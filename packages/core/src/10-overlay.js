  CMSwift.overlay = (() => {
    let seq = 0;
    const stack = new Map(); // id -> entry
    let root = null;
    const {
      ensureRoot: ensureOverlayRoot,
      focusFirst,
      trapFocus,
      applyAnchoredPosition
    } = CMSwift._overlayShared;
    const ensureRoot = () => ensureOverlayRoot(() => root, (nextRoot) => {
      root = nextRoot;
    });

    let scrollLockCount = 0;
    const lockScroll = () => {
      scrollLockCount++;
      if (scrollLockCount === 1) {
        document.documentElement.classList.add("cms-scroll-locked");
      }
    };
    const unlockScroll = () => {
      scrollLockCount = Math.max(0, scrollLockCount - 1);
      if (scrollLockCount === 0) {
        document.documentElement.classList.remove("cms-scroll-locked");
      }
    };

    const getTop = () => {
      let top = null;
      for (const e of stack.values()) top = e; // insertion order
      return top;
    };

    const open = (content, opts = {}) => {
      const id = `ov_${++seq}`;

      const entry = {
        id,
        opts,
        isOpen: true,
        anchorEl: opts.anchorEl || null,
        placement: opts.placement || "bottom-start",
        onClose: typeof opts.onClose === "function" ? opts.onClose : null,
        overlay: null,
        panel: null,
        backdrop: null,
        _positionCleanup: null,
        _cleanup: null
      };

      const overlay = document.createElement("div");
      overlay.className = ["cms-overlay", opts.type ? `type-${opts.type}` : ""].filter(Boolean).join(" ");
      overlay.dataset.id = id;

      const backdrop = document.createElement("div");
      backdrop.className = "cms-overlay-backdrop";
      if (!opts.backdrop) backdrop.style.display = "none";

      const panel = document.createElement("div");
      panel.className = ["cms-overlay-panel", opts.className].filter(Boolean).join(" ");
      panel.tabIndex = -1;

      // mount content
      const node = (typeof content === "function") ? content({ close: () => close(id) }) : content;
      const normalized = CMSwift.ui.slot(node);
      if (Array.isArray(normalized)) normalized.forEach(n => n && panel.appendChild(n));
      else if (normalized) panel.appendChild(normalized);

      overlay.appendChild(backdrop);
      overlay.appendChild(panel);
      const host = ensureRoot();
      if (!host) return { id, close: () => close(id), panel, overlay };
      host.appendChild(overlay);

      // stack bookkeeping
      entry.overlay = overlay;
      entry.panel = panel;
      entry.backdrop = backdrop;
      stack.set(id, entry);

      // scroll lock + focus
      if (opts.lockScroll) lockScroll();
      if (opts.autoFocus !== false) setTimeout(() => focusFirst(panel), 0);

      // positioning (for menus/tooltips)
      const position = () => {
        applyAnchoredPosition(panel, opts);
      };

      if (opts.anchorEl) {
        position();
        const onResize = () => position();
        window.addEventListener("resize", onResize);
        window.addEventListener("scroll", onResize, true);
        entry._positionCleanup = () => {
          window.removeEventListener("resize", onResize);
          window.removeEventListener("scroll", onResize, true);
        };
      }

      // click outside
      const onDocClick = (e) => {
        const top = getTop();
        if (!top || top.id !== id) return;
        if (opts.closeOnOutside === false) return;
        if (!panel.contains(e.target)) close(id);
      };
      document.addEventListener("mousedown", onDocClick, true);

      // ESC + focus trap
      const onKeyDown = (e) => {
        const top = getTop();
        if (!top || top.id !== id) return;

        if (opts.trapFocus) trapFocus(e, panel);
        if (e.key === "Escape" && opts.closeOnEsc !== false) {
          e.preventDefault();
          close(id);
        }
      };
      document.addEventListener("keydown", onKeyDown, true);

      // backdrop click
      backdrop.addEventListener("click", () => {
        if (opts.closeOnBackdrop === false) return;
        close(id);
      });

      // store cleanup
      entry._cleanup = () => {
        document.removeEventListener("mousedown", onDocClick, true);
        document.removeEventListener("keydown", onKeyDown, true);
        entry._positionCleanup?.();
      };

      // z-index stacking
      const z = 1000 + stack.size * 10;
      overlay.style.zIndex = String(z);

      return {
        id,
        close: () => close(id),
        panel,
        overlay
      };
    };

    const close = (id) => {
      const entry = stack.get(id);
      if (!entry) return;
      stack.delete(id);

      entry._cleanup?.();

      if (entry.opts.lockScroll) unlockScroll();

      entry.overlay?.remove();

      entry.onClose?.();
    };

    const closeTop = () => {
      const top = getTop();
      if (top) close(top.id);
    };

    return { open, close, closeTop, root, _stack: stack };
  })();

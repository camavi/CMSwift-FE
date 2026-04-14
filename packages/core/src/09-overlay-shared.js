  // ===============================
  // Overlay shared helpers
  // ===============================
  CMSwift._overlayShared = (() => {
    const focusSelector = [
      "button:not([disabled])",
      "[href]",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "[tabindex]:not([tabindex='-1'])"
    ].join(",");

    function ensureRoot(getRoot, setRoot) {
      const currentRoot = getRoot();
      if (currentRoot && currentRoot.isConnected) return currentRoot;

      let el = document.getElementById("cms-overlay-root");
      if (!el && document?.body) {
        el = document.createElement("div");
        el.id = "cms-overlay-root";
        el.className = "cms-overlay-root";
        document.body.appendChild(el);
      }

      if (!document.body && !el) {
        CMSwift.ready(() => {
          let readyEl = document.getElementById("cms-overlay-root");
          if (!readyEl) {
            readyEl = document.createElement("div");
            readyEl.id = "cms-overlay-root";
            readyEl.className = "cms-overlay-root";
            document.body.appendChild(readyEl);
          }
          setRoot(readyEl);
        });
      }

      setRoot(el);
      return el;
    }

    function focusFirst(container) {
      const node = container.querySelector(focusSelector);
      node?.focus?.();
    }

    function trapFocus(event, container) {
      if (event.key !== "Tab") return;
      const nodes = Array.from(container.querySelectorAll(focusSelector)).filter((node) => node.offsetParent !== null);
      if (!nodes.length) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    function applyAnchoredPosition(panel, opts) {
      if (!opts.anchorEl) return;

      const anchorRect = opts.anchorEl.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();

      let top = anchorRect.bottom + (opts.offsetY ?? 8);
      let left = anchorRect.left + (opts.offsetX ?? 0);

      if (opts.placement?.startsWith("top")) top = anchorRect.top - panelRect.height - (opts.offsetY ?? 8);
      if (opts.placement?.includes("end")) left = anchorRect.right - panelRect.width;

      panel.style.position = "fixed";
      panel.style.top = `${Math.max(8, Math.min(top, window.innerHeight - panelRect.height - 8))}px`;
      panel.style.left = `${Math.max(8, Math.min(left, window.innerWidth - panelRect.width - 8))}px`;
    }

    return {
      ensureRoot,
      focusFirst,
      trapFocus,
      applyAnchoredPosition
    };
  })();

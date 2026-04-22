  UI.Row = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const renderArea = (names, fallback, ctx = {}) => {
      const list = Array.isArray(names) ? names : [names];
      for (const name of list) {
        if (CMSwift.ui.getSlot(slots, name) != null) {
          return renderSlotToArray(slots, name, ctx, fallback);
        }
      }
      return fallback == null ? [] : renderSlotToArray(null, "default", ctx, fallback);
    };

    const rowSpaceValue = (value) => {
      if (value == null || value === false || value === "") return "";
      if (typeof value === "number") return `${value}px`;
      if (typeof value === "string" && CMSwift.uiSizes?.includes(value)) return `var(--cms-s-${value})`;
      return String(value);
    };
    const rowWidthValue = (value) => {
      if (value == null || value === false || value === "") return "";
      if (typeof value === "number") return `${value}px`;
      if (typeof value === "string" && CMSwift.uiSizes?.includes(value)) return `var(--cms-w-${value})`;
      return String(value);
    };

    const p = CMSwift.omit(props, [
      "slots",
      "start", "left", "startClass",
      "body", "center", "bodyClass", "centerClass",
      "end", "right", "endClass",
      "align", "justify", "wrap", "gap", "rowGap", "columnGap",
      "direction", "reverse", "inline", "full", "width", "minWidth", "maxWidth"
    ]);
    p.class = uiClass(["cms-row", props.class]);

    const style = { ...(props.style || {}) };
    const direction = uiComputed([props.direction, props.reverse], () => {
      const raw = uiUnwrap(props.direction);
      if (raw != null && raw !== "") return String(raw);
      return uiUnwrap(props.reverse) ? "row-reverse" : "";
    });
    const align = uiStyleValue(props.align);
    const justify = uiStyleValue(props.justify);
    const wrap = uiStyleValue(props.wrap, (v) => typeof v === "boolean" ? (v ? "wrap" : "nowrap") : String(v));
    const gap = uiStyleValue(props.gap, rowSpaceValue);
    const rowGap = uiStyleValue(props.rowGap, rowSpaceValue);
    const columnGap = uiStyleValue(props.columnGap, rowSpaceValue);
    const display = uiStyleValue(props.inline, (v) => v ? "inline-flex" : "flex");
    const width = uiStyleValue(props.width, rowWidthValue);
    const minWidth = uiStyleValue(props.minWidth, rowWidthValue);
    const maxWidth = uiStyleValue(props.maxWidth, rowWidthValue);
    const full = uiStyleValue(props.full, (v) => v ? "100%" : "", "");
    const inlineWidth = uiComputed([props.inline, props.full, props.width], () => {
      const isInline = !!uiUnwrap(props.inline);
      const isFull = !!uiUnwrap(props.full);
      const hasWidth = uiUnwrap(props.width) != null && uiUnwrap(props.width) !== false && uiUnwrap(props.width) !== "";
      if (!isInline || isFull || hasWidth) return "";
      return "max-content";
    });

    if (direction != null) style.flexDirection = direction;
    if (align != null) style.alignItems = align;
    if (justify != null) style.justifyContent = justify;
    if (wrap != null) style.flexWrap = wrap;
    if (gap != null) style.gap = gap;
    if (rowGap != null) style.rowGap = rowGap;
    if (columnGap != null) style.columnGap = columnGap;
    if (display != null) style.display = display;
    if (inlineWidth != null) style.width = inlineWidth;
    if (width != null) style.width = width;
    if (minWidth != null) style.minWidth = minWidth;
    if (maxWidth != null) style.maxWidth = maxWidth;
    if (full != null) style.width = full;
    if (Object.keys(style).length) p.style = style;

    const ctx = { props };
    const startNodes = renderArea(["start", "left"], props.start ?? props.left, ctx);
    const bodyNodes = renderArea(["body", "center", "default"], props.body ?? props.center ?? children, ctx);
    const endNodes = renderArea(["end", "right"], props.end ?? props.right, ctx);
    const hasStructuredContent = startNodes.length || endNodes.length || props.body != null || props.center != null || props.startClass || props.bodyClass || props.centerClass || props.endClass
      || CMSwift.ui.getSlot(slots, "start") != null
      || CMSwift.ui.getSlot(slots, "left") != null
      || CMSwift.ui.getSlot(slots, "body") != null
      || CMSwift.ui.getSlot(slots, "center") != null
      || CMSwift.ui.getSlot(slots, "end") != null
      || CMSwift.ui.getSlot(slots, "right") != null;

    if (!hasStructuredContent) {
      const content = renderSlotToArray(slots, "default", ctx, children);
      const el = _.div(p, ...content);
      setPropertyProps(el, props);
      return el;
    }

    const regionStyle = {
      display: "flex",
      alignItems: "inherit",
      gap: "inherit",
      flexWrap: "inherit",
      minWidth: 0
    };
    const bodyClass = props.bodyClass ?? props.centerClass;
    const endAutoMargin = uiComputed([props.direction, props.reverse], () => {
      const rawDirection = uiUnwrap(props.direction) || (uiUnwrap(props.reverse) ? "row-reverse" : "row");
      return rawDirection === "row" ? "auto" : "";
    });

    const parts = [
      startNodes.length
        ? _.div({ class: uiClass(["cms-row-start", props.startClass]), style: { ...regionStyle } }, ...startNodes)
        : null,
      bodyNodes.length
        ? _.div({ class: uiClass(["cms-row-body", bodyClass]), style: { ...regionStyle, flex: "1 1 auto" } }, ...bodyNodes)
        : null,
      endNodes.length
        ? _.div({
          class: uiClass(["cms-row-end", props.endClass]),
          style: {
            ...regionStyle,
            justifyContent: "flex-end",
            marginInlineStart: endAutoMargin
          }
        }, ...endNodes)
        : null
    ].filter(Boolean);

    const el = _.div(p, ...parts);
    setPropertyProps(el, props);
    return el;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Row = {
      signature: "UI.Row(...children) | UI.Row(props, ...children)",
      props: {
        start: "Node|Function|Array",
        left: "Alias di start",
        body: "Node|Function|Array",
        center: "Alias di body",
        end: "Node|Function|Array",
        right: "Alias di end",
        align: `stretch|flex-start|center|flex-end|baseline`,
        justify: `flex-start|center|flex-end|space-between|space-around|space-evenly`,
        wrap: "boolean|string",
        direction: `row|row-reverse|column|column-reverse`,
        reverse: "boolean",
        gap: "string|number",
        rowGap: "string|number",
        columnGap: "string|number",
        inline: "boolean",
        full: "boolean",
        width: "string|number",
        minWidth: "string|number",
        maxWidth: "string|number",
        startClass: "string",
        bodyClass: "string",
        centerClass: "Alias di bodyClass",
        endClass: "string",
        slots: "{ start?, left?, body?, center?, end?, right?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        start: "Leading content area",
        left: "Alias di start",
        body: "Main content area",
        center: "Alias di body",
        end: "Trailing content area",
        right: "Alias di end",
        default: "Fallback content / children"
      },
      returns: "HTMLDivElement",
      description: "Wrapper flex in riga con children, slot strutturati e props di layout per gap, allineamento, wrap e direction."
    };
  }
  function uiIsSignal(v) {
    return Array.isArray(v) && v.length === 2 && typeof v[0] === "function" && typeof v[1] === "function";
  }

  function uiIsRod(v) {
    return !!v && v.type === "rod";
  }

  function uiIsReactive(v) {
    return typeof v === "function" || uiIsRod(v) || uiIsSignal(v);
  }

  function uiUnwrap(v) {
    if (typeof v === "function") return v();
    if (uiIsRod(v)) return v.value;
    if (uiIsSignal(v)) return v[0]();
    return v;
  }

  function uiHasReactive(parts) {
    const stack = Array.isArray(parts) ? [...parts] : [parts];
    while (stack.length) {
      const item = stack.pop();
      if (uiIsReactive(item)) return true;
      if (Array.isArray(item)) stack.push(...item);
    }
    return false;
  }

  function uiClass(parts) {
    const hasReactive = uiHasReactive(parts);
    const build = () => {
      const out = [];
      const stack = Array.isArray(parts) ? [...parts] : [parts];
      while (stack.length) {
        const item = stack.shift();
        if (item == null || item === false) continue;
        const value = uiUnwrap(item);
        if (value == null || value === false || value === "") continue;
        if (Array.isArray(value)) {
          stack.unshift(...value);
          continue;
        }
        out.push(value);
      }
      return out.join(" ");
    };
    return hasReactive ? build : build();
  }

  function uiClassStatic(parts) {
    const cls = uiClass(parts);
    return typeof cls === "function" ? cls() : cls;
  }

  function uiWhen(cond, className, fallback = "") {
    if (uiIsReactive(cond)) {
      return () => (uiUnwrap(cond) ? className : fallback);
    }
    return cond ? className : fallback;
  }

  function uiClassValue(value, prefix, suffix = "") {
    if (uiIsReactive(value)) {
      return () => {
        const v = uiUnwrap(value);
        if (v == null || v === "") return "";
        return `${prefix}${v}${suffix}`;
      };
    }
    if (value == null || value === "") return "";
    return `${prefix}${value}${suffix}`;
  }

  function uiComputed(deps, fn) {
    const list = Array.isArray(deps) ? deps : [deps];
    const reactive = list.some(uiIsReactive);
    if (!reactive) return fn();
    return () => fn();
  }

  function uiStyleValue(value, map, empty = "") {
    if (uiIsReactive(value)) {
      return () => {
        const v = uiUnwrap(value);
        if (v == null || v === false) return empty;
        return map ? map(v) : v;
      };
    }
    if (value == null || value === false) return null;
    return map ? map(value) : value;
  }

  CMSwift.uiIsReactive = uiIsReactive;
  CMSwift.uiUnwrap = uiUnwrap;
  CMSwift.uiClass = uiClass;
  CMSwift.uiClassStatic = uiClassStatic;
  CMSwift.uiWhen = uiWhen;
  CMSwift.uiClassValue = uiClassValue;
  CMSwift.uiComputed = uiComputed;
  CMSwift.uiStyleValue = uiStyleValue;
  UI.Col = (...args) => {
    const { props: rawProps, children } = CMSwift.uiNormalizeArgs(args);
    const slots = rawProps.slots || {};
    const hasOwn = (key) => Object.prototype.hasOwnProperty.call(rawProps, key);
    const renderArea = (names, fallback, ctx = {}) => {
      const list = Array.isArray(names) ? names : [names];
      for (const name of list) {
        if (CMSwift.ui.getSlot(slots, name) != null) {
          return renderSlotToArray(slots, name, ctx, fallback);
        }
      }
      return fallback == null ? [] : renderSlotToArray(null, "default", ctx, fallback);
    };
    const resolveSpaceValue = (value) => {
      if (value == null || value === false || value === "") return "";
      if (typeof value === "number") return `${value}px`;
      if (typeof value === "string" && CMSwift.uiSizes?.includes(value)) return `var(--cms-s-${value})`;
      return String(value);
    };
    const resolveSizeValue = (value) => {
      if (value == null || value === false || value === "") return "";
      if (typeof value === "string" && CMSwift.uiSizes?.includes(value)) return unitCover(value, "size");
      return toCssSize(value);
    };
    const resolveSpanClass = (value, prefix) => {
      const raw = uiUnwrap(value);
      if (raw == null || raw === false || raw === "") return "";
      if (raw === "auto") return prefix === "cms-col-" ? "cms-col-auto" : "";
      if (raw === true) return `${prefix}24`;
      const n = Number(raw);
      if (Number.isFinite(n) && n > 0) {
        return `${prefix}${Math.max(1, Math.min(24, Math.round(n)))}`;
      }
      if (typeof raw === "string") {
        const normalized = raw.trim();
        if (!normalized) return "";
        if (normalized.startsWith(prefix)) return normalized;
        if (/^\d+$/.test(normalized)) {
          return `${prefix}${Math.max(1, Math.min(24, Number(normalized)))}`;
        }
      }
      return "";
    };
    const resolveFlexValue = () => {
      const explicit = uiUnwrap(rawProps.flex);
      if (explicit != null && explicit !== false && explicit !== "") return String(explicit);
      if (uiUnwrap(rawProps.fill)) return "1 1 auto";
      const hasGrow = hasOwn("grow");
      const hasShrink = hasOwn("shrink");
      const hasBasis = hasOwn("basis");
      if (!hasGrow && !hasShrink && !hasBasis) return "";
      const grow = hasGrow ? uiUnwrap(rawProps.grow) : 0;
      const shrink = hasShrink ? uiUnwrap(rawProps.shrink) : 1;
      const basis = hasBasis ? resolveSizeValue(uiUnwrap(rawProps.basis)) : "auto";
      return `${grow} ${shrink} ${basis || "auto"}`;
    };

    const baseColClass = uiComputed([rawProps.auto, rawProps.col, rawProps.span], () => {
      if (uiUnwrap(rawProps.auto)) return "cms-col-auto";
      const spanSource = hasOwn("span") ? rawProps.span : rawProps.col;
      return resolveSpanClass(spanSource, "cms-col-") || "cms-col";
    });

    const p = CMSwift.omit(rawProps, [
      "slots",
      "col", "span", "sm", "md", "lg", "auto",
      "size", "width", "minWidth", "maxWidth",
      "height", "minHeight", "maxHeight",
      "gap", "rowGap", "columnGap",
      "align", "justify", "inline", "center", "stack",
      "flex", "fill", "grow", "shrink", "basis",
      "self", "order", "scroll",
      "start", "top", "header", "before", "startClass", "topClass", "headerClass",
      "body", "content", "bodyClass", "contentClass",
      "end", "bottom", "footer", "after", "endClass", "bottomClass", "footerClass"
    ]);

    const style = { minWidth: 0, ...(rawProps.style || {}) };
    const gap = uiStyleValue(rawProps.gap, resolveSpaceValue);
    const rowGap = uiStyleValue(rawProps.rowGap, resolveSpaceValue);
    const columnGap = uiStyleValue(rawProps.columnGap, resolveSpaceValue);
    const align = uiStyleValue(rawProps.align);
    const justify = uiStyleValue(rawProps.justify);
    const widthSource = hasOwn("width") ? rawProps.width : rawProps.size;
    const width = uiStyleValue(widthSource, resolveSizeValue);
    const minWidth = uiStyleValue(rawProps.minWidth, resolveSizeValue);
    const maxWidth = uiStyleValue(rawProps.maxWidth, resolveSizeValue);
    const height = uiStyleValue(rawProps.height, resolveSizeValue);
    const minHeight = uiStyleValue(rawProps.minHeight, resolveSizeValue);
    const maxHeight = uiStyleValue(rawProps.maxHeight, resolveSizeValue);
    const self = uiStyleValue(rawProps.self);
    const order = uiStyleValue(rawProps.order, (v) => String(v));
    const scroll = uiStyleValue(rawProps.scroll, (v) => v ? "auto" : "", "");
    const flexValue = uiComputed([
      rawProps.flex, rawProps.fill, rawProps.grow, rawProps.shrink, rawProps.basis
    ], resolveFlexValue);
    const center = uiComputed([rawProps.center, rawProps.align, rawProps.justify], () => {
      return !!uiUnwrap(rawProps.center)
        && (uiUnwrap(rawProps.align) == null || uiUnwrap(rawProps.align) === "")
        && (uiUnwrap(rawProps.justify) == null || uiUnwrap(rawProps.justify) === "");
    });
    if (flexValue != null && flexValue !== "") style.flex = flexValue;
    if (self != null) style.alignSelf = self;
    if (order != null) style.order = order;
    if (scroll != null && scroll !== "") style.overflow = scroll;
    if (width != null && width !== "") {
      style.width = width;
      if (!hasOwn("flex") && !hasOwn("fill") && !hasOwn("grow") && !hasOwn("shrink") && !hasOwn("basis")) {
        style.flex = "0 0 auto";
      }
    }
    if (minWidth != null) style.minWidth = minWidth;
    if (maxWidth != null) style.maxWidth = maxWidth;
    if (height != null) style.height = height;
    if (minHeight != null) style.minHeight = minHeight;
    if (maxHeight != null) style.maxHeight = maxHeight;
    if (Object.keys(style).length) p.style = style;

    const ctx = { props: rawProps };
    const startNodes = renderArea(
      ["start", "top", "header", "before"],
      rawProps.start ?? rawProps.top ?? rawProps.header ?? rawProps.before,
      ctx
    );
    const bodyFallback = hasOwn("body")
      ? rawProps.body
      : (hasOwn("content") ? rawProps.content : children);
    const bodyNodes = renderArea(["body", "content", "default"], bodyFallback, ctx);
    const endNodes = renderArea(
      ["end", "bottom", "footer", "after"],
      rawProps.end ?? rawProps.bottom ?? rawProps.footer ?? rawProps.after,
      ctx
    );
    const hasStructuredContent = startNodes.length || endNodes.length
      || hasOwn("start") || hasOwn("top") || hasOwn("header") || hasOwn("before")
      || hasOwn("body") || hasOwn("content")
      || hasOwn("end") || hasOwn("bottom") || hasOwn("footer") || hasOwn("after")
      || rawProps.startClass || rawProps.bodyClass || rawProps.contentClass || rawProps.endClass
      || rawProps.topClass || rawProps.headerClass || rawProps.bottomClass || rawProps.footerClass
      || CMSwift.ui.getSlot(slots, "start") != null
      || CMSwift.ui.getSlot(slots, "top") != null
      || CMSwift.ui.getSlot(slots, "header") != null
      || CMSwift.ui.getSlot(slots, "before") != null
      || CMSwift.ui.getSlot(slots, "body") != null
      || CMSwift.ui.getSlot(slots, "content") != null
      || CMSwift.ui.getSlot(slots, "end") != null
      || CMSwift.ui.getSlot(slots, "bottom") != null
      || CMSwift.ui.getSlot(slots, "footer") != null
      || CMSwift.ui.getSlot(slots, "after") != null;

    const useFlexLayout = uiComputed([
      rawProps.stack, rawProps.gap, rawProps.rowGap, rawProps.columnGap,
      rawProps.align, rawProps.justify, rawProps.center
    ], () => {
      if (!!uiUnwrap(rawProps.stack)) return true;
      if (hasStructuredContent) return true;
      const values = [
        uiUnwrap(rawProps.gap),
        uiUnwrap(rawProps.rowGap),
        uiUnwrap(rawProps.columnGap),
        uiUnwrap(rawProps.align),
        uiUnwrap(rawProps.justify)
      ];
      if (values.some((value) => value != null && value !== false && value !== "")) return true;
      return !!uiUnwrap(rawProps.center);
    });

    p.class = uiClass([
      "cms-col",
      baseColClass,
      uiComputed(rawProps.sm, () => resolveSpanClass(rawProps.sm, "cms-sm-col-")),
      uiComputed(rawProps.md, () => resolveSpanClass(rawProps.md, "cms-md-col-")),
      uiComputed(rawProps.lg, () => resolveSpanClass(rawProps.lg, "cms-lg-col-")),
      uiWhen(useFlexLayout, "cms-col-flex"),
      uiWhen(rawProps.inline, "cms-col-inline"),
      rawProps.class
    ]);

    if (gap != null) style.gap = gap;
    if (rowGap != null) style.rowGap = rowGap;
    if (columnGap != null) style.columnGap = columnGap;
    if (align != null) style.alignItems = align;
    else if (center != null && center !== "") style.alignItems = center ? "center" : "";
    if (justify != null) style.justifyContent = justify;
    else if (center != null && center !== "") style.justifyContent = center ? "center" : "";
    if (Object.keys(style).length) p.style = style;

    if (!hasStructuredContent) {
      const el = _.div(p, ...renderSlotToArray(slots, "default", ctx, children));
      setPropertyProps(el, rawProps);
      return el;
    }

    const sectionStyle = {
      display: "flex",
      flexDirection: "column",
      gap: "inherit",
      minWidth: 0
    };
    const parts = [
      startNodes.length
        ? _.div({
          class: uiClass(["cms-col-start", rawProps.startClass, rawProps.topClass, rawProps.headerClass]),
          style: { ...sectionStyle }
        }, ...startNodes)
        : null,
      bodyNodes.length
        ? _.div({
          class: uiClass(["cms-col-body", rawProps.bodyClass, rawProps.contentClass]),
          style: { ...sectionStyle, flex: "1 1 auto" }
        }, ...bodyNodes)
        : null,
      endNodes.length
        ? _.div({
          class: uiClass(["cms-col-end", rawProps.endClass, rawProps.bottomClass, rawProps.footerClass]),
          style: { ...sectionStyle }
        }, ...endNodes)
        : null
    ].filter(Boolean);

    const el = _.div(p, ...parts);
    setPropertyProps(el, rawProps);
    return el;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Col = {
      signature: "UI.Col(...children) | UI.Col(props, ...children)",
      props: {
        col: "number|string",
        span: "Alias di col",
        sm: "number|string",
        md: "number|string",
        lg: "number|string",
        auto: "boolean",
        gap: "number|string",
        rowGap: "number|string",
        columnGap: "number|string",
        align: "string",
        justify: "string",
        inline: "boolean",
        stack: "boolean",
        center: "boolean",
        width: "number|string",
        size: "Alias di width",
        minWidth: "number|string",
        maxWidth: "number|string",
        height: "number|string",
        minHeight: "number|string",
        maxHeight: "number|string",
        flex: "string",
        fill: "boolean",
        grow: "number",
        shrink: "number",
        basis: "number|string",
        self: "string",
        order: "number|string",
        scroll: "boolean",
        start: "Node|Function|Array",
        top: "Alias di start",
        header: "Alias di start",
        body: "Node|Function|Array",
        content: "Alias di body",
        end: "Node|Function|Array",
        bottom: "Alias di end",
        footer: "Alias di end",
        startClass: "string",
        bodyClass: "string",
        endClass: "string",
        slots: "{ start?, top?, header?, body?, content?, end?, bottom?, footer?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        start: "Area iniziale della colonna",
        top: "Alias di start",
        header: "Alias di start",
        body: "Area principale della colonna",
        content: "Alias di body",
        end: "Area finale della colonna",
        bottom: "Alias di end",
        footer: "Alias di end",
        default: "Contenuto fallback della colonna"
      },
      returns: "HTMLDivElement",
      description: "Wrapper responsive a 24 colonne. Di default si comporta come un contenitore normale e attiva il layout flex verticale quando usi gap/allineamento, regioni strutturate o `stack`."
    };
  }

  UI.Spacer = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const p = CMSwift.omit(props, ["slots"]);
    p.class = uiClass(["cms-spacer", props.class]);
    const content = renderSlotToArray(slots, "default", {}, children);
    return _.div(p, ...content);
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Spacer = {
      signature: "UI.Spacer() | UI.Spacer(props)",
      props: {
        slots: "{ default?: Slot }",
        class: "string",
        style: "object"
      },
      slots: {
        default: "Optional spacer content"
      },
      returns: "HTMLDivElement",
      description: "Flex spacer."
    };
  }

  UI.Container = (...args) => {
    const { props: rawProps, children } = CMSwift.uiNormalizeArgs(args);
    const slots = rawProps.slots || {};
    const props = { ...rawProps };
    const hasOwn = (key) => Object.prototype.hasOwnProperty.call(rawProps, key);
    const containerWidthMap = {
      xxs: "360px",
      xs: "480px",
      sm: "640px",
      md: "820px",
      lg: "1100px",
      xl: "1280px",
      xxl: "1440px",
      narrow: "760px",
      prose: "760px",
      wide: "1360px"
    };
    const resolveWidthValue = (value) => {
      if (value == null || value === false || value === "") return "";
      if (typeof value === "number") return `${value}px`;
      const key = String(value).trim().toLowerCase();
      if (!key) return "";
      if (key === "full" || key === "fluid") return "100%";
      return containerWidthMap[key] || String(value);
    };
    const resolveSpaceValue = (value) => {
      if (value == null || value === false || value === "") return "";
      if (typeof value === "number") return `${value}px`;
      if (typeof value === "string" && CMSwift.uiSizes?.includes(value)) return `var(--cms-s-${value})`;
      return String(value);
    };
    const resolveColsValue = (value) => {
      if (value == null || value === false || value === "") return "";
      if (typeof value === "number" && Number.isFinite(value)) return `repeat(${Math.max(1, Math.floor(value))}, minmax(0, 1fr))`;
      const raw = String(value).trim();
      if (!raw) return "";
      if (/^\d+$/.test(raw)) return `repeat(${Math.max(1, Number(raw))}, minmax(0, 1fr))`;
      return raw;
    };
    const resolveWrapValue = (value) => {
      if (value == null || value === "") return "";
      if (value === true) return "wrap";
      if (value === false) return "nowrap";
      return String(value);
    };
    const ctx = { props: rawProps };
    const appendResolvedValue = (host, value) => {
      if (value == null || value === false) return;
      if (Array.isArray(value)) {
        value.forEach((item) => appendResolvedValue(host, item));
        return;
      }
      if (value?.nodeType) {
        host.appendChild(value);
        return;
      }
      host.appendChild(document.createTextNode(String(value)));
    };
    const renderPropNodes = (name, fallback) => {
      const slot = CMSwift.ui.getSlot(slots, name);
      if (slot !== null && slot !== undefined) {
        return renderSlotToArray(slots, name, ctx, null);
      }
      if (typeof fallback === "function") {
        const host = _.div({ class: `cms-container-slot-${name}` });
        CMSwift.reactive.effect(() => {
          const normalized = flattenSlotValue(CMSwift.ui.slot(fallback(ctx)));
          host.replaceChildren();
          if (Array.isArray(normalized)) normalized.forEach((item) => appendResolvedValue(host, item));
          else appendResolvedValue(host, normalized);
        }, `UI.Container:${name}`);
        return [host];
      }
      return renderSlotToArray(slots, name, ctx, fallback);
    };
    const contentFallback = hasOwn("content") ? rawProps.content : (children?.length ? children : null);
    const beforeNodes = renderPropNodes("before", rawProps.before ?? rawProps.top);
    const headerNodes = renderPropNodes("header", rawProps.header);
    const startNodes = [
      ...renderPropNodes("left", rawProps.left),
      ...renderPropNodes("start", rawProps.start)
    ];
    const bodyNodes = renderPropNodes("body", hasOwn("body") ? rawProps.body : null);
    const contentNodes = (() => {
      const explicit = renderPropNodes("content", hasOwn("content") ? rawProps.content : null);
      return explicit.length ? explicit : renderPropNodes("default", contentFallback);
    })();
    const endNodes = [
      ...renderPropNodes("right", rawProps.right),
      ...renderPropNodes("end", rawProps.end)
    ];
    const footerNodes = renderPropNodes("footer", rawProps.footer);
    const afterNodes = renderPropNodes("after", rawProps.after ?? rawProps.bottom);
    const hasShellSections = beforeNodes.length || headerNodes.length || startNodes.length || endNodes.length || footerNodes.length || afterNodes.length
      || CMSwift.ui.getSlot(slots, "before") != null
      || CMSwift.ui.getSlot(slots, "header") != null
      || CMSwift.ui.getSlot(slots, "left") != null
      || CMSwift.ui.getSlot(slots, "start") != null
      || CMSwift.ui.getSlot(slots, "right") != null
      || CMSwift.ui.getSlot(slots, "end") != null
      || CMSwift.ui.getSlot(slots, "footer") != null
      || CMSwift.ui.getSlot(slots, "after") != null;
    const hasStructuredLayout = !!hasShellSections || (bodyNodes.length > 0 && (CMSwift.ui.getSlot(slots, "body") != null || hasShellSections));
    const resolveLayoutMode = () => {
      const explicit = String(uiUnwrap(rawProps.layout ?? rawProps.display) || "").trim().toLowerCase();
      if (["flex", "grid", "stack"].includes(explicit)) return explicit;
      if (["inline", "inline-flex", "inlineflex"].includes(explicit)) return "inline";
      if (!!uiUnwrap(rawProps.inline)) return "inline";
      if (!!uiUnwrap(rawProps.grid) || uiUnwrap(rawProps.cols) != null) return "grid";
      if (explicit === "block") return "block";
      if (uiUnwrap(rawProps.direction) != null || uiUnwrap(rawProps.wrap) != null || uiUnwrap(rawProps.align) != null || uiUnwrap(rawProps.justify) != null || uiUnwrap(rawProps.gap) != null) return "flex";
      if (startNodes.length || endNodes.length) return "flex";
      return "block";
    };
    const layoutClass = uiComputed([
      rawProps.layout, rawProps.display, rawProps.inline, rawProps.grid, rawProps.cols,
      rawProps.direction, rawProps.wrap, rawProps.align, rawProps.justify, rawProps.gap
    ], () => {
      const mode = resolveLayoutMode();
      return mode === "block" ? "" : `is-${mode}`;
    });
    const rootStyle = { ...(props.style || {}) };
    const assignStyle = (key, value) => {
      if (value != null) rootStyle[key] = value;
    };
    assignStyle("maxWidth", uiComputed([rawProps.maxWidth, rawProps.fluid], () => {
      if (uiUnwrap(rawProps.fluid)) return "none";
      const value = resolveWidthValue(uiUnwrap(rawProps.maxWidth));
      return value || "";
    }));
    assignStyle("width", uiStyleValue(rawProps.width, resolveWidthValue));
    assignStyle("minWidth", uiStyleValue(rawProps.minWidth, resolveWidthValue));
    assignStyle("--cms-container-padding", uiStyleValue(rawProps.padding, resolveSpaceValue));
    assignStyle("--cms-container-padding-x", uiStyleValue(rawProps.paddingX ?? rawProps.gutter, resolveSpaceValue));
    assignStyle("--cms-container-padding-y", uiStyleValue(rawProps.paddingY, resolveSpaceValue));
    assignStyle("--cms-container-gap", uiStyleValue(rawProps.gap, resolveSpaceValue));
    assignStyle("--cms-container-section-gap", uiStyleValue(rawProps.sectionGap ?? rawProps.gap, resolveSpaceValue));
    assignStyle("--cms-container-cols", uiStyleValue(rawProps.cols, resolveColsValue));
    assignStyle("--cms-container-align", uiStyleValue(rawProps.align, (value) => String(value)));
    assignStyle("--cms-container-justify", uiStyleValue(rawProps.justify, (value) => String(value)));
    assignStyle("--cms-container-direction", uiStyleValue(rawProps.direction, (value) => String(value)));
    assignStyle("--cms-container-wrap", uiStyleValue(rawProps.wrap, resolveWrapValue));

    const p = CMSwift.omit(props, [
      "after", "afterClass", "align", "as", "before", "beforeClass", "body", "bodyClass",
      "bottom", "cols", "content", "contentClass", "direction", "display", "end",
      "endClass", "fluid", "footer", "footerClass", "gap", "grid", "gutter", "header",
      "headerClass", "inline", "justify", "layout", "left", "mainClass", "maxWidth",
      "minWidth", "padding", "paddingX", "paddingY", "right", "sectionGap", "slots",
      "start", "startClass", "tag", "top", "width", "wrap"
    ]);
    p.class = uiClass([
      "cms-container",
      uiWhen(rawProps.fluid, "is-fluid"),
      uiWhen(hasStructuredLayout, "has-structure"),
      hasStructuredLayout ? "" : layoutClass,
      props.class
    ]);
    p.style = rootStyle;

    const createSection = (name, nodes, extraClass) => {
      if (!nodes.length) return null;
      return _.div({ class: uiClass(["cms-container-section", `cms-container-${name}`, extraClass]) }, ...nodes);
    };

    const contentRoot = bodyNodes.length
      ? _.div({ class: uiClass(["cms-container-body", hasStructuredLayout ? layoutClass : "", rawProps.bodyClass]) }, ...bodyNodes)
      : (
        (startNodes.length || contentNodes.length || endNodes.length)
          ? _.div(
            { class: uiClass(["cms-container-body", hasStructuredLayout ? layoutClass : "", rawProps.bodyClass]) },
            createSection("start", startNodes, rawProps.startClass),
            contentNodes.length ? _.div({ class: uiClass(["cms-container-main", rawProps.mainClass, rawProps.contentClass]) }, ...contentNodes) : null,
            createSection("end", endNodes, rawProps.endClass)
          )
          : null
      );

    const creator = (() => {
      const tag = String(uiUnwrap(rawProps.tag ?? rawProps.as) || "div").toLowerCase();
      return typeof _[tag] === "function" ? _[tag] : _.div;
    })();

    const el = hasStructuredLayout
      ? creator(
        p,
        createSection("before", beforeNodes, rawProps.beforeClass),
        createSection("header", headerNodes, rawProps.headerClass),
        contentRoot,
        createSection("footer", footerNodes, rawProps.footerClass),
        createSection("after", afterNodes, rawProps.afterClass)
      )
      : creator(p, ...(bodyNodes.length ? bodyNodes : contentNodes));
    setPropertyProps(el, rawProps);
    return el;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Container = {
      signature: "UI.Container(...children) | UI.Container(props, ...children)",
      props: {
        tag: "string",
        fluid: "boolean",
        maxWidth: "number|string",
        minWidth: "number|string",
        width: "number|string",
        padding: "number|string",
        paddingX: "number|string",
        paddingY: "number|string",
        gap: "number|string",
        sectionGap: "number|string",
        layout: '"block|flex|grid|stack|inline"',
        direction: '"row|column"',
        wrap: "boolean|string",
        align: "string",
        justify: "string",
        cols: "number|string",
        before: "String|Node|Function|Array",
        header: "String|Node|Function|Array",
        start: "String|Node|Function|Array",
        body: "String|Node|Function|Array",
        content: "String|Node|Function|Array",
        end: "String|Node|Function|Array",
        footer: "String|Node|Function|Array",
        after: "String|Node|Function|Array",
        slots: "{ before?, header?, left?, start?, body?, content?, default?, right?, end?, footer?, after? }",
        class: "string",
        style: "object"
      },
      slots: {
        before: "Top content before the main container body",
        header: "Structured header area",
        left: "Alias for start",
        start: "Leading area inside the main body",
        body: "Custom body renderer overriding start/content/end wrappers",
        content: "Explicit main content",
        default: "Fallback content from children",
        right: "Alias for end",
        end: "Trailing area inside the main body",
        footer: "Structured footer area",
        after: "Bottom content after the main container body"
      },
      returns: "HTMLDivElement",
      description: "Container composabile con max-width, spacing, layout props e sezioni opzionali."
    };
  }

  UI.Card = (...args) => {
    const { props: rawProps, children } = CMSwift.uiNormalizeArgs(args);
    const slots = rawProps.slots || {};
    const props = { ...rawProps };
    applyCommonProps(props);

    const isSectionNode = (node, name) => {
      return !!(node && node.nodeType === 1 && node.classList?.contains(`cms-card-${name}`));
    };
    const renderIconFallback = (value) => {
      if (value == null) return null;
      if (typeof value === "string") return UI.Icon({ name: value, size: rawProps.iconSize || rawProps.size || "lg" });
      return CMSwift.ui.slot(value, { as: "icon" });
    };
    const iconFallback = renderIconFallback(rawProps.icon);
    const coverFallback = rawProps.image
      ? _.img({
        src: rawProps.image,
        alt: rawProps.imageAlt || "",
        class: uiClass(["cms-card-cover-media", rawProps.imageClass]),
        style: rawProps.imageStyle
      })
      : rawProps.cover;

    const ctx = {
      dense: !!uiUnwrap(rawProps.dense),
      flat: !!uiUnwrap(rawProps.flat),
      clickable: !!uiUnwrap(rawProps.clickable),
      to: uiUnwrap(rawProps.to) || null
    };

    const defaultNodes = renderSlotToArray(slots, "default", ctx, children?.length ? children : []);
    const sectionNodes = {
      identifier: [],
      cover: [],
      media: [],
      header: [],
      body: [],
      footer: [],
      actions: []
    };
    const looseNodes = [];

    defaultNodes.forEach((node) => {
      if (isSectionNode(node, "identifier")) sectionNodes.identifier.push(node);
      else if (isSectionNode(node, "cover")) sectionNodes.cover.push(node);
      else if (isSectionNode(node, "media")) sectionNodes.media.push(node);
      else if (isSectionNode(node, "header")) sectionNodes.header.push(node);
      else if (isSectionNode(node, "body")) sectionNodes.body.push(node);
      else if (isSectionNode(node, "footer")) sectionNodes.footer.push(node);
      else if (isSectionNode(node, "actions")) sectionNodes.actions.push(node);
      else looseNodes.push(node);
    });

    const identifierNodes = renderSlotToArray(slots, "identifier", ctx, rawProps.identifier);
    const coverNodes = renderSlotToArray(slots, "cover", ctx, coverFallback);
    const mediaNodes = renderSlotToArray(slots, "media", ctx, rawProps.media);
    const eyebrowNodes = renderSlotToArray(slots, "eyebrow", ctx, rawProps.eyebrow ?? rawProps.kicker);
    const titleNodes = renderSlotToArray(slots, "title", ctx, rawProps.title);
    const subtitleNodes = renderSlotToArray(slots, "subtitle", ctx, rawProps.subtitle);
    const headerNodes = renderSlotToArray(slots, "header", ctx, rawProps.header);
    const iconNodes = renderSlotToArray(slots, "icon", ctx, iconFallback);
    const asideNodes = renderSlotToArray(slots, "aside", ctx, rawProps.aside ?? rawProps.headerAside);
    const bodyNodes = renderSlotToArray(slots, "body", ctx, rawProps.body);
    const footerNodes = renderSlotToArray(slots, "footer", ctx, rawProps.footer);
    const actionsNodes = renderSlotToArray(slots, "actions", ctx, rawProps.actions);

    const generatedIdentifier = identifierNodes.length
      ? _.div({ class: uiClass(["cms-card-identifier", rawProps.identifierClass]) }, ...identifierNodes)
      : null;
    const generatedCover = coverNodes.length
      ? _.div({ class: uiClass(["cms-card-cover", rawProps.coverClass]) }, ...coverNodes)
      : null;
    const generatedMedia = mediaNodes.length
      ? _.div({ class: uiClass(["cms-card-media", rawProps.mediaClass]) }, ...mediaNodes)
      : null;

    const hasStructuredHeader = iconNodes.length || eyebrowNodes.length || titleNodes.length || subtitleNodes.length || headerNodes.length || asideNodes.length;
    const generatedHeader = hasStructuredHeader
      ? _.div(
        { class: uiClass(["cms-card-header", rawProps.headerClass]) },
        _.div(
          { class: "cms-card-head" },
          iconNodes.length ? _.div({ class: "cms-card-icon" }, ...iconNodes) : null,
          _.div(
            { class: "cms-card-head-main" },
            eyebrowNodes.length ? _.div({ class: uiClass(["cms-card-eyebrow", rawProps.eyebrowClass]) }, ...eyebrowNodes) : null,
            titleNodes.length ? _.div({ class: uiClass(["cms-card-title", rawProps.titleClass]) }, ...titleNodes) : null,
            subtitleNodes.length ? _.div({ class: uiClass(["cms-card-subtitle", rawProps.subtitleClass]) }, ...subtitleNodes) : null,
            headerNodes.length ? _.div({ class: uiClass(["cms-card-header-content", rawProps.headerContentClass]) }, ...headerNodes) : null
          ),
          asideNodes.length ? _.div({ class: uiClass(["cms-card-aside", rawProps.asideClass]) }, ...asideNodes) : null
        )
      )
      : null;

    const mergedBodyNodes = [...bodyNodes, ...looseNodes];
    const generatedBody = mergedBodyNodes.length
      ? _.div({ class: uiClass(["cms-card-body", rawProps.bodyClass]) }, ...mergedBodyNodes)
      : null;

    const mergedActionNodes = [...actionsNodes, ...sectionNodes.actions];
    const generatedFooter = (footerNodes.length || mergedActionNodes.length)
      ? _.div(
        { class: uiClass(["cms-card-footer", rawProps.footerClass]) },
        ...footerNodes,
        mergedActionNodes.length ? _.div({ class: "cms-card-actions" }, ...mergedActionNodes) : null
      )
      : null;

    const interactiveClass = uiComputed([rawProps.clickable, rawProps.to], () => {
      return (uiUnwrap(rawProps.clickable) || uiUnwrap(rawProps.to)) ? "cms-card-clickable" : "";
    });
    const hasIdentifier = identifierNodes.length || sectionNodes.identifier.length;
    const hasTopVisual = coverNodes.length || sectionNodes.cover.length || mediaNodes.length || sectionNodes.media.length;

    const p = CMSwift.omit(props, [
      "actions", "aside", "asideClass", "body", "bodyClass", "clickable", "cover", "coverClass",
      "coverHeight", "dense", "eyebrow", "eyebrowClass", "flat", "footer", "footerClass", "header",
      "headerAside", "headerClass", "headerContentClass", "icon", "iconSize", "identifier",
      "identifierClass", "image", "imageAlt", "imageClass", "imageStyle", "kicker", "media",
      "mediaClass", "slots", "subtitle", "subtitleClass", "title", "titleClass", "to"
    ]);
    p.class = uiClass([
      "cms-panel",
      "cms-card",
      'cms-clear-set',
      "cms-singularity",
      uiWhen(rawProps.flat, "cms-card-flat"),
      uiWhen(rawProps.dense, "cms-card-dense"),
      uiWhen(hasIdentifier, "cms-card-has-identifier"),
      uiWhen(hasTopVisual, "cms-card-has-top-visual"),
      interactiveClass,
      props.class
    ]);
    p.style = { ...(props.style || {}) };
    if (rawProps.coverHeight != null) {
      p.style["--cms-card-cover-height"] = toCssSize(uiUnwrap(rawProps.coverHeight));
    }

    const userOnClick = rawProps.onClick;
    const userOnKeydown = rawProps.onKeydown;
    const onClick = (e) => {
      userOnClick?.(e);
      if (e.defaultPrevented) return;
      const to = uiUnwrap(rawProps.to);
      if (to && CMSwift.router?.navigate) {
        e.preventDefault();
        CMSwift.router.navigate(to);
      }
    };
    const onKeydown = (e) => {
      userOnKeydown?.(e);
      if (e.defaultPrevented) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick(e);
      }
    };
    if (uiUnwrap(rawProps.clickable) || uiUnwrap(rawProps.to)) {
      p.onClick = onClick;
      p.onKeydown = onKeydown;
      if (p.tabIndex == null) p.tabIndex = 0;
      if (p.role == null) p.role = "button";
    }

    const el = _.div(
      p,
      generatedIdentifier,
      ...sectionNodes.identifier,
      generatedCover,
      ...sectionNodes.cover,
      generatedMedia,
      ...sectionNodes.media,
      generatedHeader,
      ...sectionNodes.header,
      generatedBody,
      ...sectionNodes.body,
      generatedFooter,
      ...sectionNodes.footer
    );

    setPropertyProps(el, rawProps);
    return el;
  }
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Card = {
      signature: "UI.Card(...children) | UI.Card(props, ...children)",
      description: "Card a sezioni con header strutturato, cover/media, body e footer/actions.",
      props: {
        title: "String|Node|Function|Array",
        subtitle: "String|Node|Function|Array",
        eyebrow: "String|Node|Function|Array",
        header: "String|Node|Function|Array",
        body: "String|Node|Function|Array",
        footer: "String|Node|Function|Array",
        actions: "Node|Function|Array",
        icon: "String|Node|Function|Array",
        aside: "Node|Function|Array",
        identifier: "String|Node|Function|Array",
        media: "Node|Function|Array",
        cover: "Node|Function|Array",
        image: "string",
        imageAlt: "string",
        coverHeight: "string|number",
        clickable: "boolean",
        to: "string",
        dense: "boolean",
        flat: "boolean",
        headerClass: "string",
        bodyClass: "string",
        footerClass: "string",
        slots: "{ identifier?, cover?, media?, icon?, eyebrow?, title?, subtitle?, header?, aside?, body?, footer?, actions?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        identifier: "Badge/top identifier content",
        cover: "Top visual/cover content",
        media: "Media section above header/body",
        icon: "Header icon content",
        eyebrow: "Eyebrow/kicker content",
        title: "Card title content",
        subtitle: "Card subtitle content",
        header: "Header support content",
        aside: "Right side header content",
        body: "Body content",
        footer: "Footer content",
        actions: "Footer actions slot",
        default: "Fallback body content or raw card sections"
      },
      returns: "HTMLDivElement"
    };
  }
  UI.Btn = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};

    const state = uiComputed([props.color, props.state], () => {
      const color = uiUnwrap(props.color) || uiUnwrap(props.state) || "";
      return ["primary", "secondary", "warning", "danger", "success", "info", "light", "dark"].includes(color)
        ? color
        : (uiUnwrap(props.state) || "");
    });

    const cls = uiClass(["cms-clear-set", "cms-btn", "cms-singularity", "cms-clickable", state, uiWhen(props.outline, "outline"), props.class]);

    const p = CMSwift.omit(props, [
      "icon", "iconRight", "label", "loading", "outline", "iconAlign", "slots",
      "shortcode", "shortcut", "hotkey", "showShortcode", "showShortcut"
    ]);
    p.class = cls;

    const iconFallback = props.icon != null
      ? (typeof props.icon === "string" ? UI.Icon({ name: props.icon }) : props.icon)
      : null;
    const iconRightFallback = props.iconRight != null
      ? (typeof props.iconRight === "string" ? UI.Icon({ name: props.iconRight }) : props.iconRight)
      : null;
    const icon = CMSwift.ui.renderSlot(slots, "icon", {}, iconFallback);
    const iconRight = CMSwift.ui.renderSlot(slots, "iconRight", {}, iconRightFallback);
    const label = CMSwift.ui.renderSlot(slots, "label", {}, props.label);
    const slotChildren = renderSlotToArray(slots, "default", {}, children);

    const content = [];
    const pushAll = (x) => {
      if (!x) return;
      if (Array.isArray(x)) content.push(...x);
      else content.push(x);
    };

    const align = props.iconAlign;
    const iconAfter = align === "after" || align === "right";

    if (iconAfter && !iconRightFallback) {
      pushAll(label);
      if (slotChildren.length) content.push(...slotChildren);
      pushAll(icon);
    } else {
      pushAll(icon);
      pushAll(label);
      if (slotChildren.length) content.push(...slotChildren);
    }
    pushAll(iconRight);
    pushAll(uiCreateShortcodeHint(props, { className: "cms-shortcode cms-btn-shortcode" }));

    if (content.length === 0) content.push(_.span("Button"));

    const disabled = !!props.disabled || !!props.loading;

    const onClick = props.loading ? null : props.onClick;

    const onPointerDown = (e) => {
      props.onPointerDown?.(e);
      if (disabled || !e?.currentTarget) return;
      const btn = e.currentTarget;
      const rect = btn.getBoundingClientRect();
      const x = typeof e.clientX === "number" ? e.clientX - rect.left : rect.width / 2;
      const y = typeof e.clientY === "number" ? e.clientY - rect.top : rect.height / 2;
      btn.style.setProperty("--cms-burst-x", `${x}px`);
      btn.style.setProperty("--cms-burst-y", `${y}px`);
      btn.classList.remove("cms-btn-burst");
      void btn.offsetWidth;
      btn.classList.add("cms-btn-burst");
    };

    if (props.loading) {
      content.unshift(_.span({ class: "cms-muted", style: { marginRight: "8px" } }, "⏳"));
    }

    const btn = _.button({
      ...p,
      disabled,
      onClick,
      onPointerDown,
      "aria-disabled": disabled ? "true" : null,
      "aria-busy": props.loading ? "true" : null
    }, ...content);

    setPropertyProps(btn, props);
    uiRegisterShortcode(btn, props, {
      isEnabled: () => !disabled,
      action: () => {
        if (disabled) return false;
        btn.click();
      }
    });
    return btn;
  }
  if (CMSwift.isDev?.()) {
    UI.meta.Btn = {
      signature: "UI.Btn(...children) | UI.Btn(props, ...children)",
      props: {
        label: "String|Node|Function|Array",
        icon: "String|Node|Function|Array",
        iconRight: "String|Node|Function|Array",
        iconAlign: `before|after|left|right`,
        color: `primary|secondary|warning|danger|success|info|light|dark`,
        outline: "boolean",
        loading: "boolean",
        disabled: "boolean",
        shortcode: "string|Array<string>|object",
        showShortcode: "boolean",
        slots: "{ icon?, label?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        icon: "Icon slot",
        iconRight: "Right icon slot",
        label: "Label slot",
        default: "Button content"
      },
      events: ["click", "pointerdown", "focus", "blur"],
      returns: "HTMLButtonElement"
    };
  }
  // Esempio: CMSwift.ui.QBtn({ color: "primary", icon: "save", label: "Salva" })

  // Input: supporta value come rod (two-way) oppure rod via props.model
  // props: { model: rod OR [get,set] signal OR plain, placeholder, type }


  UI.FormField = (props = {}) => {

    applyCommonProps(props);

    const slots = props.slots || {};
    const state = uiComputed([props.color, props.state], () => {
      const color = uiUnwrap(props.color) || uiUnwrap(props.state) || "";
      return ["primary", "secondary", "warning", "danger", "success", "info", "light", "dark"].includes(color)
        ? color
        : (uiUnwrap(props.state) || "");
    });

    const wrap = _.div({ class: uiClass(["cms-clear-field-set", "cms-field", "cms-singularity-field", state, uiWhen(props.fill, "cms-field-fill"), uiWhen(props.outline, "outline"), props.wrapClass, props.class]) });

    const topLabelNodes = renderSlotToArray(slots, "topLabel", {}, props.topLabel);
    if (topLabelNodes.length) {
      wrap.appendChild(_.div({ class: "cms-field-label" }, ...topLabelNodes));
    }
    const isMulti = props.multi || props.multiple;

    const controlEl = typeof props.control === "function" ? props.control() : props.control;
    const getHasValue = () => {
      const v = props.getValue ? props.getValue() : null;
      return !(v == null || v === "");
    };
    const clear = () => {
      if (props.disabled || props.readonly) return;
      props.onClear?.();
      props.onFocus?.();
    };

    const controlSlot = CMSwift.ui.renderSlot(slots, "control", {
      control: controlEl,
      clear,
      disabled: !!props.disabled,
      readonly: !!props.readonly,
      hasValue: getHasValue()
    }, null);

    let control = null;
    let clearBtn = null;

    if (controlSlot) {
      control = Array.isArray(controlSlot)
        ? _.div({ class: "cms-control" }, ...controlSlot)
        : controlSlot;
    } else {
      control = _.div({ class: "cms-control" });

      // left addon
      const left = _.div({ class: "cms-addon cms-addon-left" });
      const iconFallback = props.icon != null
        ? (typeof props.icon === "string" ? UI.Icon({ name: props.icon }) : props.icon)
        : null;
      const iconNode = CMSwift.ui.renderSlot(slots, "icon", {}, iconFallback);
      const prefixNode = CMSwift.ui.renderSlot(slots, "prefix", {}, props.prefix);
      renderSlotToArray(null, "default", {}, iconNode).forEach(n => left.appendChild(n));
      renderSlotToArray(null, "default", {}, prefixNode).forEach(n => left.appendChild(n));
      if (left.childNodes.length) control.appendChild(left);

      // middle: controlEl + floating label
      const mid = _.div({ class: "cms-mid" + (left.childNodes.length > 0 ? " cms-with-left" : ""), style: { position: "relative", flex: "1", minWidth: "0" } });
      if (controlEl) mid.appendChild(controlEl);

      const labelNodes = renderSlotToArray(slots, "label", {}, props.label);
      if (labelNodes.length) {
        const floatLabel = _.div({ class: uiClass(["cms-float-label", uiWhen(isMulti, "cms-multiselect")]) }, ...labelNodes);
        mid.appendChild(floatLabel);
      }

      control.appendChild(mid);

      // clear
      const defaultClear = props.clearable ? _.div({
        class: "cms-clear",
        title: "Clear",
        onClick: clear
      }, UI.Icon({ name: "close" })) : null;

      const clearNode = CMSwift.ui.renderSlot(slots, "clear", {

        disabled: !!props.disabled,
        readonly: !!props.readonly,
        hasValue: getHasValue()
      }, defaultClear);

      if (clearNode) {
        clearNode.onclick = (e) => {
          e.stopPropagation();
          clear();
        }
        renderSlotToArray(null, "default", {}, clearNode).forEach(n => control.appendChild(n));
      }

      clearBtn = defaultClear;
      if (clearBtn && props.clearable?.action) {
        props.clearable.action((v) => v ? clearBtn.classList.remove("cms-d-none") : clearBtn.classList.add("cms-d-none"));
      }

      // right addon
      const right = _.div({ class: "cms-addon cms-addon-right" });
      const iconRightFallback = props.iconRight != null
        ? (typeof props.iconRight === "string" ? UI.Icon({ name: props.iconRight }) : props.iconRight)
        : null;
      const iconRightNode = CMSwift.ui.renderSlot(slots, "iconRight", {}, iconRightFallback);
      const suffixNode = CMSwift.ui.renderSlot(slots, "suffix", {}, props.suffix);
      const shortcodeNode = CMSwift.ui.renderSlot(slots, "shortcode", { props }, uiCreateShortcodeHint(props, { className: "cms-shortcode cms-field-shortcode" }));
      renderSlotToArray(null, "default", {}, suffixNode).forEach(n => right.appendChild(n));
      renderSlotToArray(null, "default", {}, iconRightNode).forEach(n => right.appendChild(n));
      renderSlotToArray(null, "default", {}, shortcodeNode).forEach(n => right.appendChild(n));
      if (right.childNodes.length) {
        control.appendChild(right);
        mid.classList.add("cms-with-right");
      }
    }

    const resolveValue = (value) => {
      if (!value) return value;
      if (value && typeof value.action === "function") return value.value;
      if (Array.isArray(value) && typeof value[0] === "function") return value[0]();
      if (typeof value === "function") return value();
      return value;
    };
    const hasContent = (value) => {
      if (value == null || value === false || value === "") return false;
      if (Array.isArray(value)) return value.length > 0;
      return true;
    };
    let messageEl = null;
    const renderMessage = () => {
      const statusOrder = [
        { key: "error", value: resolveValue(props.error), slot: "errorMessage", className: "cms-error" },
        { key: "warning", value: resolveValue(props.warning), slot: "warning", className: "cms-warning" },
        { key: "success", value: resolveValue(props.success), slot: "success", className: "cms-success" },
        { key: "note", value: resolveValue(props.note), slot: "note", className: "cms-note" },
        { key: "hint", value: resolveValue(props.hint), slot: "hint", className: "cms-hint" }
      ];
      let active = null;
      for (const item of statusOrder) {
        if (hasContent(item.value)) {
          active = item;
          break;
        }
      }
      const ctx = {
        error: statusOrder[0].value,
        warning: statusOrder[1].value,
        success: statusOrder[2].value,
        note: statusOrder[3].value,
        hint: statusOrder[4].value,
        props
      };
      const nodes = active
        ? renderSlotToArray(slots, active.slot, ctx, active.value)
        : [];
      const nextEl = nodes.length
        ? _.div({ class: active?.className }, ...nodes)
        : null;

      const stateKeys = ["error", "warning", "success", "note"];
      stateKeys.forEach((k) => control?.classList?.toggle(k, active?.key === k));

      if (messageEl) {
        if (nextEl) messageEl.replaceWith(nextEl);
        else messageEl.remove();
      } else if (nextEl) {
        wrap.appendChild(nextEl);
      }
      messageEl = nextEl;
    };

    // state updater
    const setHasValue = () => {
      const has = getHasValue();
      control?.classList?.toggle("has-value", has);
      if (clearBtn) clearBtn.style.display = has ? "" : "none";
    };

    // initial states
    setHasValue();
    control?.classList?.toggle("disabled", !!props.disabled);

    wrap.appendChild(control);
    const errorSlot = CMSwift.ui.getSlot(slots, "errorMessage");
    const warningSlot = CMSwift.ui.getSlot(slots, "warning");
    const successSlot = CMSwift.ui.getSlot(slots, "success");
    const noteSlot = CMSwift.ui.getSlot(slots, "note");
    const hintSlot = CMSwift.ui.getSlot(slots, "hint");
    const canReact = !!(props.error?.action || props.warning?.action || props.success?.action || props.note?.action || props.hint?.action)
      || (Array.isArray(props.error) && typeof props.error[0] === "function")
      || (Array.isArray(props.warning) && typeof props.warning[0] === "function")
      || (Array.isArray(props.success) && typeof props.success[0] === "function")
      || (Array.isArray(props.note) && typeof props.note[0] === "function")
      || (Array.isArray(props.hint) && typeof props.hint[0] === "function")
      || typeof props.error === "function"
      || typeof props.warning === "function"
      || typeof props.success === "function"
      || typeof props.note === "function"
      || typeof props.hint === "function"
      || typeof errorSlot === "function"
      || typeof warningSlot === "function"
      || typeof successSlot === "function"
      || typeof noteSlot === "function"
      || typeof hintSlot === "function";
    if (canReact) {
      CMSwift.reactive.effect(() => { renderMessage(); }, "UI.FormField:message");
    } else {
      renderMessage();
    }

    // expose small API so Input/Select can refresh state when value changes programmatically
    wrap._refresh = setHasValue;
    wrap._control = control;
    wrap._el = controlEl;

    return wrap;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.FormField = {
      signature: "UI.FormField(props)",
      description: "Wrapper field con label floating, hint/error/success/warning/note, clear e addons slot-based.",
      props: {
        label: "String|Node|Function",
        topLabel: "String|Node|Function",
        hint: "String|Node|Function",
        error: "String|Node|Function",
        success: "String|Node|Function",
        warning: "String|Node|Function",
        note: "String|Node|Function",
        icon: "String|Node|Function",
        iconRight: "String|Node|Function",
        prefix: "String|Node|Function",
        suffix: "String|Node|Function",
        clearable: "boolean",
        shortcode: "string|Array<string>|object",
        showShortcode: "boolean",
        disabled: "boolean",
        readonly: "boolean",
        control: "Node|Function",
        getValue: "() => any",
        onClear: "() => void",
        onFocus: "() => void",
        wrapClass: "string",
        slots: "{ label?, topLabel?, prefix?, suffix?, shortcode?, icon?, iconRight?, clear?, hint?, error?, control? }"
      },
      slots: {
        label: "Floating label content",
        topLabel: "Top label content",
        prefix: "Left addon content",
        suffix: "Right addon content",
        icon: "Left icon content",
        iconRight: "Right icon content",
        shortcode: "Shortcut badge content",
        clear: "Clear button slot (ctx: { clear, disabled, readonly, hasValue })",
        hint: "Hint content",
        errorMessage: "Error content",
        success: "Success content",
        warning: "Warning content",
        note: "Note content",
        control: "Override control wrapper (ctx: { control, clear, disabled, readonly, hasValue })"
      },
      returns: "HTMLDivElement (wrapper) con ._refresh()"
    };
  }
  UI.InputRaw = (props = {}) => {
    const el = _.input({
      class: uiClass(["cms-input-raw", props.class]),
      type: props.type || "text",
      name: props.name,
      placeholder: props.placeholder,
      autocomplete: props.autocomplete,
      value: props.value
    });

    let lastKnownValue = el.value ?? "";
    const syncAutofill = () => {
      const next = el.value ?? "";
      if (next === lastKnownValue) return;
      lastKnownValue = next;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    };
    let autofillTimer = null;
    let autofillProbe = false;
    const scheduleAutofillProbe = () => {
      if (autofillProbe) return;
      autofillProbe = true;
      let count = 0;
      const tick = () => {
        syncAutofill();
        count += 1;
        if (count >= 10) {
          autofillProbe = false;
          return;
        }
        setTimeout(tick, 120);
      };
      setTimeout(tick, 40);
    };
    const startAutofillWatch = () => {
      if (autofillTimer) return;
      autofillTimer = setInterval(() => {
        if (document.activeElement !== el) {
          clearInterval(autofillTimer);
          autofillTimer = null;
          return;
        }
        syncAutofill();
      }, 250);
    };
    const stopAutofillWatch = () => {
      if (!autofillTimer) return;
      clearInterval(autofillTimer);
      autofillTimer = null;
    };
    el.addEventListener("input", () => { lastKnownValue = el.value ?? ""; });
    el.addEventListener("change", () => { lastKnownValue = el.value ?? ""; });
    el.addEventListener("animationstart", (e) => {
      if (e.animationName !== "cms-autofill") return;
      syncAutofill();
      startAutofillWatch();
      scheduleAutofillProbe();
    });
    el.addEventListener("focus", () => {
      startAutofillWatch();
      scheduleAutofillProbe();
      setTimeout(syncAutofill, 50);
    });
    el.addEventListener("blur", () => {
      stopAutofillWatch();
      setTimeout(syncAutofill, 0);
    });
    setTimeout(syncAutofill, 0);
    scheduleAutofillProbe();

    // model binding
    const model = props.model;
    if (model) {
      // Supporta rod direttamente
      if (typeof model === "object" && typeof model._bind === "function") {
        app.rodModel(el, model);
      }
      // Supporta [get,set] signal -> creiamo rodFromSignal
      else if (Array.isArray(model) && typeof model[0] === "function" && typeof model[1] === "function") {
        const r = app.rodFromSignal(model[0], model[1]);
        app.rodModel(el, r);
        // NOTE: se vuoi cleanup automatico qui, lo facciamo nel layer component (v2)
      }
    }
    uiRegisterShortcode(el, props, {
      isEnabled: () => !el.disabled,
      action: () => uiFocusShortcutTarget(el, { selectText: !!props.selectOnShortcode })
    });
    return el;
  };

  UI.Input = (props = {}) => {
    const slots = props.slots || {};
    const input = _.input({
      class: uiClass(["cms-input", props.class]),
      type: props.type || "text",
      name: props.name,
      autocomplete: props.autocomplete,
      inputmode: props.inputmode,
      value: props.value ?? "",
      disabled: !!props.disabled,
      readOnly: !!props.readonly
    });

    let lastKnownValue = input.value ?? "";
    const syncAutofill = () => {
      const next = input.value ?? "";
      if (next === lastKnownValue) return;
      lastKnownValue = next;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    };
    let autofillTimer = null;
    let autofillProbe = false;
    const scheduleAutofillProbe = () => {
      if (autofillProbe) return;
      autofillProbe = true;
      let count = 0;
      const tick = () => {
        syncAutofill();
        count += 1;
        if (count >= 10) {
          autofillProbe = false;
          return;
        }
        setTimeout(tick, 120);
      };
      setTimeout(tick, 40);
    };
    const startAutofillWatch = () => {
      if (autofillTimer) return;
      autofillTimer = setInterval(() => {
        if (document.activeElement !== input) {
          clearInterval(autofillTimer);
          autofillTimer = null;
          return;
        }
        syncAutofill();
      }, 250);
    };
    const stopAutofillWatch = () => {
      if (!autofillTimer) return;
      clearInterval(autofillTimer);
      autofillTimer = null;
    };

    // listeners
    input.addEventListener("input", () => {
      lastKnownValue = input.value ?? "";
      props.onInput?.(input.value);
    });
    input.addEventListener("change", () => {
      lastKnownValue = input.value ?? "";
      props.onChange?.(input.value);
    });
    input.addEventListener("focus", (e) => {
      props.onFocus?.(e);
      startAutofillWatch();
      scheduleAutofillProbe();
      setTimeout(syncAutofill, 50);
    });
    input.addEventListener("blur", (e) => {
      props.onBlur?.(e);
      stopAutofillWatch();
      setTimeout(syncAutofill, 0);
    });
    input.addEventListener("animationstart", (e) => {
      if (e.animationName !== "cms-autofill") return;
      syncAutofill();
      startAutofillWatch();
      scheduleAutofillProbe();
    });
    setTimeout(syncAutofill, 0);
    scheduleAutofillProbe();

    // model binding
    const model = props.model;
    if (model) {
      const bindInputRod = (rod) => {
        let syncing = false;

        const updateFromRod = (v) => {
          const next = v ?? "";
          if (input.value === next) return;
          input.value = next;
          lastKnownValue = next;
        };

        rod.action((v) => {
          if (syncing) return;
          syncing = true;
          try { updateFromRod(v); } finally { syncing = false; }
        });

        updateFromRod(rod.value);

        const onInput = (e) => {
          if (syncing || e?.isComposing) return;
          const next = input.value;
          if (rod.value === next) return;
          syncing = true;
          try { rod.value = next; } finally { syncing = false; }
        };

        input.addEventListener("input", onInput);
        input.addEventListener("compositionend", onInput);

        if (typeof rod.onDispose === "function") {
          rod.onDispose(() => {
            input.removeEventListener("input", onInput);
            input.removeEventListener("compositionend", onInput);
          });
        }
      };
      if (typeof model === "object" && typeof model._bind === "function") {
        bindInputRod(model);
      } else if (Array.isArray(model) && typeof model[0] === "function" && typeof model[1] === "function") {
        const r = CMSwift.rodFromSignal(model[0], model[1]);
        bindInputRod(r);
      }
    }

    const inputSlot = CMSwift.ui.renderSlot(slots, "input", { input, props }, input);
    const controlNode = Array.isArray(inputSlot)
      ? _.div({ style: { display: "contents" } }, ...inputSlot)
      : inputSlot;

    const field = UI.FormField({
      ...props,
      control: controlNode,
      getValue: () => input.value,
      onClear: () => {
        if (input.disabled || input.readOnly) return;
        input.value = "";
        input.dispatchEvent(new Event("input", { bubbles: true }));
      },
      onFocus: () => input.focus()
    });

    // keep UI in sync with programmatic updates:
    // (questa parte DIPENDE da come rodModel aggiorna input.value)
    input.addEventListener("input", () => field._refresh?.());
    input.addEventListener("change", () => field._refresh?.());

    // expose reference
    field._input = input;
    uiRegisterShortcode(input, props, {
      isEnabled: () => !input.disabled,
      action: () => uiFocusShortcutTarget(input, { selectText: !!props.selectOnShortcode })
    });

    return field;
  }
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};

    UI.meta.Input = {
      signature: "UI.Input(props)",
      description: "Field input con floating label, hint/error/success/warning/note, clearable, icon, prefix/suffix e supporto reattivo (rod/signal).",
      props: {
        // value & model
        model: "rod | [get,set] signal",
        value: "string",

        // input native
        type: "string (default: 'text')",
        name: "string",
        autocomplete: "string",
        inputmode: "string",
        disabled: "boolean",
        readonly: "boolean",
        shortcode: "string|Array<string>|object",
        showShortcode: "boolean",

        // UI / UX
        label: "String|Node|Function (floating label)",
        topLabel: "String|Node|Function (label sopra, non floating)",
        placeholder: "string (fallback se non usi label)",
        hint: "String|Node|Function",
        error: "String|Node|Function",
        success: "String|Node|Function",
        warning: "String|Node|Function",
        note: "String|Node|Function",
        clearable: "boolean",

        // addons
        icon: "String|Node|Function",
        iconRight: "String|Node|Function",
        prefix: "String|Node|Function",
        suffix: "String|Node|Function",

        // style
        class: "string (applicata all'input)",
        wrapClass: "string (applicata al field wrapper)",
        style: "object",

        // events
        onInput: "(value:string) => void",
        onChange: "(value:string) => void",
        onFocus: "(event) => void",
        onBlur: "(event) => void"
      },

      slots: {
        label: "Floating label (via FormField slots.label)",
        topLabel: "Top label (via FormField slots.topLabel)",
        prefix: "Addon a sinistra (via FormField slots.prefix)",
        suffix: "Addon a destra (via FormField slots.suffix)",
        shortcode: "Shortcut badge (via FormField slots.shortcode)",
        icon: "Icona a sinistra (via FormField slots.icon)",
        iconRight: "Icona a destra (via FormField slots.iconRight)",
        clear: "Clear button (via FormField slots.clear)",
        hint: "Hint content (via FormField slots.hint)",
        errorMessage: "Error content (via FormField slots.errorMessage)",
        success: "Success content (via FormField slots.success)",
        warning: "Warning content (via FormField slots.warning)",
        note: "Note content (via FormField slots.note)",
        input: "Custom input node (ctx: { input, props })"
      },

      returns: "HTMLDivElement (field wrapper) con ._input = HTMLInputElement"
    };
  }

  UI.Select = (props = {}) => {
    const filterable = props.filterable;
    const isMulti = !!props.multiple || !!props.multi;
    const allowCustom = !!props.allowCustom || !!props.allowCustomValue;
    const slots = props.slots || {};
    const isBoundValue = (v) => !!v && ((typeof v === "object" && typeof v._bind === "function") || uiIsSignal(v));
    const valueBinding = isBoundValue(props.model)
      ? props.model
      : (isBoundValue(props.value) ? props.value : null);

    const toArray = (v) => {
      if (Array.isArray(v)) return v.slice();
      if (v == null || v === "") return [];
      return [v];
    };
    const normalizeValue = (v) => isMulti ? toArray(v) : v;
    const initialValue = valueBinding
      ? (typeof valueBinding === "object" && typeof valueBinding._bind === "function" ? valueBinding.value : valueBinding[0]())
      : props.value;

    // state
    const [getOpen, setOpen] = CMSwift.reactive.signal(false);
    const [getFilter, setFilter] = CMSwift.reactive.signal("");
    const [getValue, setValue] = CMSwift.reactive.signal(isMulti ? toArray(initialValue) : (initialValue ?? ""));
    const [getLoading, setLoading] = CMSwift.reactive.signal(false);
    const [getList, setList] = CMSwift.reactive.signal([]);      // normalized flat list
    const [getFlat, setFlat] = CMSwift.reactive.signal([]);      // flat selectable options only (no groups)
    const [getActive, setActive] = CMSwift.reactive.signal(-1);  // active index in flat selectable list

    let modelSet = null;

    // model binding
    if (valueBinding) {
      if (typeof valueBinding === "object" && typeof valueBinding._bind === "function") {
        setValue(normalizeValue(valueBinding.value));
        valueBinding.action((v) => setValue(normalizeValue(v)));
        modelSet = (v) => {
          const next = normalizeValue(v);
          if (valueBinding.value !== next) valueBinding.value = next;
        };
      } else if (Array.isArray(valueBinding) && typeof valueBinding[0] === "function" && typeof valueBinding[1] === "function") {
        const get = valueBinding[0];
        const set = valueBinding[1];
        CMSwift.reactive.effect(() => { setValue(normalizeValue(get())); }, "UI.Select:model");
        modelSet = (v) => set(normalizeValue(v));
      }
    }

    function isDisabled() {
      if (typeof props.disabled === "function") return props.disabled();
      else if (typeof props.disabled === "boolean") return props.disabled;
      else if (props?.disabled?.action) {
        return props.disabled.value;
      } else return false;
    }

    function normalizeOption(opt) {
      if (opt == null) return null;
      if (typeof opt === "string" || typeof opt === "number") {
        return { type: "option", label: String(opt), value: opt, disabled: false };
      }
      if (typeof opt === "object") {
        // group support: { label, options: [...] }
        if (Array.isArray(opt.options)) {
          return {
            type: "group",
            label: String(opt.label ?? ""),
            options: opt.options
          };
        }
        const label = opt.label ?? (opt.value != null ? String(opt.value) : "");
        return {
          type: "option",
          label: String(label),
          value: opt.value ?? opt.label ?? "",
          disabled: !!opt.disabled
        };
      }
      return { type: "option", label: String(opt), value: opt, disabled: false };
    }

    // Build display list with groups + flatten selectable list
    function buildLists(rawOptions) {
      const base = Array.isArray(rawOptions) ? rawOptions : [];
      const normalized = base.map(normalizeOption).filter(Boolean);

      const display = [];     // includes group headers + options
      const selectable = [];  // options only (no group headers)

      for (const item of normalized) {
        if (item.type === "group") {
          display.push({ type: "group", label: item.label });
          const gopts = (item.options || []).map(normalizeOption).filter(Boolean).filter(x => x.type === "option");
          for (const o of gopts) {
            display.push(o);
            selectable.push(o);
          }
        } else {
          display.push(item);
          selectable.push(item);
        }
      }

      setList(display);
      setFlat(selectable);
    }

    // supports async options
    async function loadOptions() {
      const src = props.options;
      let raw;

      try {
        const v = (typeof src === "function") ? src() : src;
        if (v && typeof v.then === "function") {
          setLoading(true);
          raw = await v;
        } else {
          raw = v;
        }
        buildLists(raw);
      } catch (e) {
        console.error("[UI.Select] options load error:", e);
        buildLists([]);
      } finally {
        setLoading(false);
      }
    }

    function commit(next) {
      const val = normalizeValue(next);
      setValue(val);
      if (modelSet) modelSet(val);
      props.onChange?.(val);
    }

    function toggleValue(val) {
      const list = toArray(getValue());
      const exists = list.some(v => v == val);
      const next = exists ? list.filter(v => v != val) : [...list, val];
      commit(next);
    }

    function selectValue(val, fromFilter = false) {
      if (isMulti) {
        toggleValue(val);
        if (fromFilter) clearFilterInput();
      } else {
        commit(val);
        close();
      }
    }

    function clearFilterInput() {
      setFilter("");
      if (filterInput) filterInput.value = "";
    }

    function close() {
      setOpen(false);
      clearFilterInput();
      setActive(-1);
    }

    async function open() {
      if (isDisabled()) return;
      setOpen(true);

      // load options (sync/async) on open
      await loadOptions();

      // set active to current selected, otherwise first enabled
      const current = getValue();
      const flat = getFlat();
      let idx = -1;
      if (isMulti) {
        const list = toArray(current);
        for (const val of list) {
          idx = flat.findIndex(o => o.value == val && !o.disabled);
          if (idx >= 0) break;
        }
      } else {
        idx = flat.findIndex(o => o.value == current && !o.disabled);
      }
      if (idx < 0) idx = flat.findIndex(o => !o.disabled);
      setActive(idx);

      if (filterInput) setTimeout(() => filterInput.focus(), 0);
    }

    function toggle() {
      if (getOpen()) close();
      else open();
    }

    // root select (control + menu)
    const root = _.div({
      class: uiClass(["cms-select", isMulti ? "multiple" : "", props.class]),
      tabIndex: isDisabled() ? -1 : 0,
      role: "combobox",
      "aria-expanded": "false",
      "aria-disabled": isDisabled() ? "true" : "false"
    });

    const valueNode = _.div({
      class: uiClass(["cms-select-value", isMulti ? "cms-select-value-multi" : ""])
    });
    CMSwift.reactive.effect(() => {
      const flat = getFlat();
      valueNode.innerHTML = "";
      if (isMulti) {
        const list = toArray(getValue());
        for (const val of list) {
          const opt = flat.find(o => o.value == val);
          const label = opt ? opt.label : (val == null ? "" : String(val));
          let removing = false;
          const chip = UI.Chip({
            label,
            dense: true,
            color: props.chipColor || props.color,
            icon: props.chipIcon || null,
            iconRight: props.chipIconRight || null,
            glossy: props.glossy,
            glow: props.glow,
            glass: props.chipGlass || props.glass,
            class: props.chipClass,
            flat: props.flat,
            rounded: props.rounded,
            outline: props.outline,
            shadow: props.chipShadow,
            lightShadow: props.lightShadow,
            gloss: props.gloss,
            border: props.border,
            size: props.chipSize,
            removable: true,
            onRemove: (e) => {
              e?.preventDefault?.();
              e?.stopPropagation?.();
              e?.stopImmediatePropagation?.();
              if (removing) return;
              removing = true;
              toggleValue(val);
            }
          });
          valueNode.appendChild(chip);
        }
      } else {
        const v = getValue();
        const opt = flat.find(o => o.value == v);
        valueNode.textContent = opt ? opt.label : ((v == null || v === "") ? "" : String(v));
      }
    }, "UI.Select:value");

    const arrowWrap = _.div({ class: "cms-select-arrow" });
    CMSwift.reactive.effect(() => {
      const arrowNode = CMSwift.ui.renderSlot(slots, "arrow", { open: getOpen() }, UI.Icon("#chevron-down"));
      arrowWrap.innerHTML = "";
      renderSlotToArray(null, "default", {}, arrowNode).forEach(n => arrowWrap.appendChild(n));
    }, "UI.Select:arrow");

    const control = _.div({ class: "cms-select-control", onClick: toggle },
      valueNode,
      arrowWrap
    );

    const optionsWrap = _.div({
      class: "cms-select-options",
      role: "listbox",
      "aria-multiselectable": isMulti ? "true" : "false"
    });

    const filterWrap = _.div({ class: "cms-select-filter cms-d-none" });
    let filterInput = null;
    const defaultFilterInput = _.input({
      class: "cms-input",
      type: "text",
      placeholder: props.filterPlaceholder || "Cerca...",
      onInput: (e) => setFilter(e.target.value || "")
    });
    const renderFilterSlot = () => {
      const filterNode = CMSwift.ui.renderSlot(slots, "filter", {
        value: getFilter(),
        setValue: (v) => {
          const next = v == null ? "" : String(v);
          setFilter(next);
          if (filterInput && "value" in filterInput) filterInput.value = next;
        },
        close
      }, defaultFilterInput);
      filterWrap.innerHTML = "";
      const nodes = renderSlotToArray(null, "default", {}, filterNode);
      nodes.forEach(n => filterWrap.appendChild(n));
      filterInput = nodes.length === 1 && nodes[0] && nodes[0].tagName === "INPUT" ? nodes[0] : null;
      if (filterInput) filterInput.value = getFilter() || "";
    };
    renderFilterSlot();
    CMSwift.reactive.effect(() => {
      const next = getFilter() || "";
      if (filterInput && "value" in filterInput && filterInput.value !== next) {
        filterInput.value = next;
      }
    }, "UI.Select:filterValue");

    if (typeof filterable === "boolean") filterable ? filterWrap.classList.remove("cms-d-none") : filterWrap.classList.add("cms-d-none");
    else if (filterable?.action) {
      filterable.action((v) => {
        v ? filterWrap.classList.remove("cms-d-none") : filterWrap.classList.add("cms-d-none");
      });
      filterable.value ? filterWrap.classList.remove("cms-d-none") : filterWrap.classList.add("cms-d-none");;
    }
    //copia del props
    const menuProps = { ...props };
    applyCommonProps(menuProps);

    const stateMenu = uiComputed([menuProps.color, menuProps.state], () => {
      const color = uiUnwrap(menuProps.color) || uiUnwrap(menuProps.state) || "";
      return ["primary", "secondary", "warning", "danger", "success", "info", "light", "dark"].includes(color)
        ? color
        : (uiUnwrap(menuProps.state) || "");
    });
    const menu = _.div({ class: uiClass(["cms-select-menu", "cms-singularity-menu-select", stateMenu, menuProps.class, uiWhen(props.fill, "cms-select-menu-fill")]), onClick: (e) => e.stopPropagation() },
      filterWrap, optionsWrap
    );
    let menuPortalFrame = 0;
    let menuPortalBound = false;

    const scheduleMenuPosition = () => {
      if (!getOpen() || menu.parentNode !== document.body) return;
      if (menuPortalFrame) return;
      menuPortalFrame = requestAnimationFrame(() => {
        menuPortalFrame = 0;
        if (!getOpen() || !root.isConnected || menu.parentNode !== document.body) return;
        const anchor = root.getBoundingClientRect();
        const gap = 6;
        const pad = 8;
        const maxWidth = Math.max(160, window.innerWidth - (pad * 2));
        const width = Math.min(Math.max(anchor.width, 180), maxWidth);
        const left = Math.max(pad, Math.min(anchor.left, window.innerWidth - width - pad));

        menu.style.width = `${width}px`;
        menu.style.left = `${left}px`;
        menu.style.right = "auto";
        menu.style.marginTop = "0";

        const menuHeight = menu.getBoundingClientRect().height || 0;
        const spaceBelow = window.innerHeight - anchor.bottom - gap - pad;
        const spaceAbove = anchor.top - gap - pad;
        const placeAbove = spaceBelow < 180 && spaceAbove > spaceBelow;
        let top = placeAbove ? (anchor.top - gap - menuHeight) : (anchor.bottom + gap);
        top = Math.max(pad, Math.min(top, window.innerHeight - menuHeight - pad));
        menu.style.top = `${top}px`;
      });
    };

    const bindMenuPortalPosition = () => {
      if (menuPortalBound) return;
      menuPortalBound = true;
      window.addEventListener("resize", scheduleMenuPosition);
      window.addEventListener("scroll", scheduleMenuPosition, true);
    };

    const unbindMenuPortalPosition = () => {
      if (!menuPortalBound) return;
      menuPortalBound = false;
      window.removeEventListener("resize", scheduleMenuPosition);
      window.removeEventListener("scroll", scheduleMenuPosition, true);
    };

    const mountMenuPortal = () => {
      if (menu.parentNode === document.body) return;
      if (menuPortalFrame) {
        cancelAnimationFrame(menuPortalFrame);
        menuPortalFrame = 0;
      }
      menu.classList.add("portal");
      menu.style.display = "block";
      document.body.appendChild(menu);
      bindMenuPortalPosition();
      scheduleMenuPosition();
    };

    const unmountMenuPortal = () => {
      if (menuPortalFrame) {
        cancelAnimationFrame(menuPortalFrame);
        menuPortalFrame = 0;
      }
      unbindMenuPortalPosition();
      if (menu.parentNode !== root) root.appendChild(menu);
      menu.classList.remove("portal");
      menu.style.display = "";
      menu.style.position = "";
      menu.style.top = "";
      menu.style.left = "";
      menu.style.right = "";
      menu.style.width = "";
      menu.style.marginTop = "";
    };

    root.appendChild(control);
    root.appendChild(menu);

    // open class + aria
    CMSwift.reactive.effect(() => {
      const o = getOpen();
      root.classList.toggle("open", o);
      root.setAttribute("aria-expanded", o ? "true" : "false");
      if (o) mountMenuPortal();
      else unmountMenuPortal();
    }, "UI.Select:open");

    CMSwift.reactive.effect(() => {
      const d = isDisabled();
      root.classList.toggle("disabled", d);
      root.tabIndex = d ? -1 : 0;
      root.setAttribute("aria-disabled", d ? "true" : "false");
    }, "UI.Select:disabled");

    // render options with filter (active paint in separate effect)
    let optionNodes = [];
    let lastActive = -1;
    let activeIndex = -1;

    function paintActive() {
      const active = getActive();
      activeIndex = active;
      if (active === lastActive) return;
      if (optionNodes[lastActive]) optionNodes[lastActive].classList.remove("active");
      if (optionNodes[active]) optionNodes[active].classList.add("active");
      lastActive = active;
      if (active >= 0) optionNodes[active]?.scrollIntoView({ block: "nearest" });
    }

    CMSwift.reactive.effect(() => {
      const display = getList();
      const flat = getFlat();
      const filter = (getFilter() || "").toLowerCase().trim();
      const current = getValue();
      const selectedValues = isMulti ? toArray(current) : [current];
      const loading = getLoading();
      const activeSnapshot = activeIndex;

      optionsWrap.innerHTML = "";
      optionNodes = [];
      lastActive = -1;

      // build filtered view:
      // we filter only options, group headers appear only if their options remain
      const nodes = [];
      let flatIndex = 0;

      const pushOption = (opt) => {
        const selected = selectedValues.some(v => v == opt.value);
        const disabled = !!opt.disabled;

        const cls = [
          "cms-select-option",
          selected ? "selected" : "",
          disabled ? "disabled" : ""
        ].filter(Boolean).join(" ");

        const select = () => {
          if (isMulti) toggleValue(opt.value);
          else { commit(opt.value); close(); }
        };

        const content = CMSwift.ui.renderSlot(slots, "option", {
          opt,
          selected,
          active: flatIndex === activeSnapshot,
          disabled,
          select
        }, opt.label);
        const contentNodes = renderSlotToArray(null, "default", {}, content);

        const node = _.div({
          class: cls,
          "data-flat-index": String(flatIndex),
          // da sistemare nel futuro
          //onMouseEnter: () => setActive(flatIndex),
          onClick: disabled ? null : select
        }, ...contentNodes);

        nodes.push(node);
        optionNodes[flatIndex] = node;
        flatIndex++;
      };

      // If filter active, we filter against flat list; groups become irrelevant visually.
      if (filter) {
        const filtered = flat.filter(o => o.label.toLowerCase().includes(filter));
        if (filtered.length === 0) {
          const emptyNode = CMSwift.ui.renderSlot(slots, "empty", { filter }, props.emptyText || "Nessuna opzione");
          optionsWrap.appendChild(_.div({ class: "cms-select-empty" }, ...renderSlotToArray(null, "default", {}, emptyNode)));
          if (getOpen()) scheduleMenuPosition();
          return;
        }
        for (const opt of filtered) pushOption(opt);
      } else {
        // no filter: render grouped display list with headers
        let hadAnyOption = false;
        for (const item of display) {
          if (item.type === "group") {
            const groupNode = CMSwift.ui.renderSlot(slots, "group", { label: item.label }, item.label);
            nodes.push(_.div({ class: "cms-select-group" }, ...renderSlotToArray(null, "default", {}, groupNode)));
          } else {
            hadAnyOption = true;
            pushOption(item);
          }
        }
        if (!hadAnyOption) {
          const emptyNode = CMSwift.ui.renderSlot(slots, "empty", { filter }, props.emptyText || "Nessuna opzione");
          optionsWrap.appendChild(_.div({ class: "cms-select-empty" }, ...renderSlotToArray(null, "default", {}, emptyNode)));
          if (getOpen()) scheduleMenuPosition();
          return;
        }
      }

      if (loading) {
        const loadingNode = CMSwift.ui.renderSlot(slots, "loading", {}, "Caricamento...");
        optionsWrap.appendChild(_.div({ class: "cms-select-empty" }, ...renderSlotToArray(null, "default", {}, loadingNode)));
        if (getOpen()) scheduleMenuPosition();
        return;
      }

      for (const n of nodes) optionsWrap.appendChild(n);
      paintActive();
      if (getOpen()) scheduleMenuPosition();
    }, "UI.Select:render");

    CMSwift.reactive.effect(() => {
      paintActive();
    }, "UI.Select:paintActive");

    // outside click + escape cleanup
    const onDocClick = (e) => {
      if (!root.isConnected) return;
      const t = e.target;
      if (root.contains(t)) return;
      if (menu.contains(t)) return;
      close();
    };
    document.addEventListener("click", onDocClick, true);

    const onKeyDown = (e) => {
      if (isDisabled()) return;

      const openNow = getOpen();
      const flat = getFlat();
      const active = getActive();
      const isFilterTarget = filterInput && e.target === filterInput;

      const nextEnabled = (start, dir) => {
        let i = start;
        while (i >= 0 && i < flat.length) {
          if (!flat[i].disabled) return i;
          i += dir;
        }
        return -1;
      };

      const findMatchByFilter = (term) => {
        if (!term) return null;
        const t = term.toLowerCase();
        let exact = flat.find(o => String(o.label).toLowerCase() === t || String(o.value).toLowerCase() === t);
        if (!exact) exact = flat.find(o => String(o.label).toLowerCase().includes(t));
        return exact && !exact.disabled ? exact : null;
      };

      if (e.key === "Escape") {
        if (openNow) { e.preventDefault(); close(); }
        return;
      }

      if (isFilterTarget && (e.key === "Enter" || e.key === " ")) {
        const term = (getFilter() || "").trim();
        if (term) {
          const match = findMatchByFilter(term);
          if (match) {
            e.preventDefault();
            selectValue(match.value, true);
            return;
          }
          if (allowCustom && e.key === "Enter") {
            e.preventDefault();
            selectValue(term, true);
            return;
          }
          if (e.key === "Enter") {
            e.preventDefault();
            return;
          }
        }
        if (e.key === " ") return;
      }

      if (e.key === "Enter" || e.key === " ") {
        // open if closed, otherwise commit active
        e.preventDefault();
        if (!openNow) { open(); return; }
        if (active >= 0 && flat[active] && !flat[active].disabled) {
          if (isMulti) toggleValue(flat[active].value);
          else { commit(flat[active].value); close(); }
        }
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!openNow) { open(); return; }
        const i = nextEnabled(active < 0 ? 0 : active + 1, +1);
        if (i >= 0) setActive(i);
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!openNow) { open(); return; }
        const i = nextEnabled(active < 0 ? flat.length - 1 : active - 1, -1);
        if (i >= 0) setActive(i);
        return;
      }

      if (e.key === "Home") {
        if (!openNow) return;
        e.preventDefault();
        const i = nextEnabled(0, +1);
        if (i >= 0) setActive(i);
        return;
      }

      if (e.key === "End") {
        if (!openNow) return;
        e.preventDefault();
        const i = nextEnabled(flat.length - 1, -1);
        if (i >= 0) setActive(i);
        return;
      }
    };

    // attach keydown to root + filter wrapper
    root.addEventListener("keydown", onKeyDown);
    filterWrap.addEventListener("keydown", onKeyDown);

    root._dispose = () => {
      document.removeEventListener("click", onDocClick, true);
      root.removeEventListener("keydown", onKeyDown);
      filterWrap.removeEventListener("keydown", onKeyDown);
      unmountMenuPortal();
    };

    // Wrap in FormField
    const field = UI.FormField({
      ...props,
      control: root,
      clearable: props.clearable,
      disabled: isDisabled(),
      readonly: false,
      getValue: () => {
        const v = getValue();
        return isMulti ? (Array.isArray(v) && v.length ? v : "") : v;
      },
      onClear: () => {
        if (isDisabled()) return;
        commit(isMulti ? [] : null);
        close();
      },
      onFocus: () => {
        // open on focus (nice UX)
        open();
      }
    });

    // refresh has-value when value changes
    CMSwift.reactive.effect(() => { field._refresh?.(); }, "UI.Select:fieldRefresh");

    field._select = root;
    field._dispose = root._dispose;
    uiRegisterShortcode(field, props, {
      isEnabled: () => !isDisabled(),
      action: () => {
        if (isDisabled()) return false;
        uiFocusShortcutTarget(root);
        open();
      }
    });

    loadOptions();

    return field;
  }
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Select = {
      signature: "UI.Select(props)",
      description: "Select premium: keyboard nav, option groups, async options, filter, clearable, multi select, valori custom da filtro. Wrappato in UI.FormField.",

      props: {
        options: "Array<option|group> | () => Array<option|group> | async () => Promise<Array<option|group>>",
        value: "any",
        model: "rod | [get,set] signal",

        label: "String|Node|Function (floating)",
        topLabel: "String|Node|Function",
        hint: "String|Node|Function",
        error: "String|Node|Function",
        success: "String|Node|Function",
        warning: "String|Node|Function",
        note: "String|Node|Function",

        clearable: "boolean",
        filterable: "boolean",
        multiple: "boolean",
        multi: "boolean (alias multiple)",
        allowCustom: "boolean (consenti valori custom dal filtro)",
        allowCustomValue: "boolean (alias allowCustom)",
        filterPlaceholder: "string",
        emptyText: "string",
        shortcode: "string|Array<string>|object",
        showShortcode: "boolean",

        icon: "String|Node|Function",
        iconRight: "String|Node|Function",
        prefix: "String|Node|Function",
        suffix: "String|Node|Function",

        disabled: "boolean | () => boolean",
        dense: "boolean",
        class: "string",
        wrapClass: "string",
        slots: "{ clear?, arrow?, filter?, option?, group?, empty?, loading? }",

        onChange: "(value:any) => void"
      },

      slots: {
        clear: "Clear button (via FormField slots.clear)",
        arrow: "Arrow slot (ctx: { open })",
        filter: "Filter input slot (ctx: { value, setValue, close })",
        option: "Option renderer (ctx: { opt, selected, active, disabled, select })",
        group: "Group header (ctx: { label })",
        empty: "Empty state (ctx: { filter })",
        loading: "Loading state (ctx: {})",
        label: "Floating label (via FormField slots.label)",
        topLabel: "Top label (via FormField slots.topLabel)",
        prefix: "Left addon (via FormField slots.prefix)",
        suffix: "Right addon (via FormField slots.suffix)",
        shortcode: "Shortcut badge (via FormField slots.shortcode)",
        icon: "Left icon (via FormField slots.icon)",
        iconRight: "Right icon (via FormField slots.iconRight)",
        hint: "Hint content (via FormField slots.hint)",
        errorMessage: "Error content (via FormField slots.errorMessage)",
        success: "Success content (via FormField slots.success)",
        warning: "Warning content (via FormField slots.warning)",
        note: "Note content (via FormField slots.note)"
      },

      keyboard: ["Enter/Space", "ArrowUp", "ArrowDown", "Home", "End", "Escape"],

      returns: "HTMLDivElement (wrapper field) con ._select, ._dispose()"
    };
  }

  function resolveModel(model, name) {
    if (!model) return null;
    if (typeof model === "object" && typeof model._bind === "function") {
      return {
        get: () => model.value,
        set: (v) => { if (model.value !== v) model.value = v; },
        watch: (fn) => { if (typeof model.action === "function") model.action(fn); }
      };
    }
    if (Array.isArray(model) && typeof model[0] === "function" && typeof model[1] === "function") {
      const get = model[0];
      const set = model[1];
      return {
        get,
        set,
        watch: (fn) => app.reactive.effect(() => { fn(get()); }, name || "UI:model")
      };
    }
    return null;
  }

  UI.Layout = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const hasOwn = (obj, key) => !!obj && Object.prototype.hasOwnProperty.call(obj, key);
    const resolveProp = (...keys) => {
      for (const key of keys) {
        if (hasOwn(props, key)) return props[key];
      }
      return undefined;
    };
    const toLayoutCssSize = (value, fallback = null) => {
      if (value == null || value === false || value === "") return fallback;
      return typeof value === "number" ? `${value}px` : String(value);
    };
    const toLayoutPx = (value, fallback = null) => {
      if (value == null || value === false || value === "") return fallback;
      if (typeof value === "number" && Number.isFinite(value)) return value;
      const parsed = Number.parseFloat(String(value));
      return Number.isFinite(parsed) ? parsed : fallback;
    };
    const clampLayoutWidth = (value, min = null, max = null) => {
      let next = Number.isFinite(value) ? value : 0;
      if (Number.isFinite(min)) next = Math.max(min, next);
      if (Number.isFinite(max)) next = Math.min(max, next);
      return next;
    };

    const headerSource = resolveProp("header", "headerContent");
    const drawerSource = resolveProp("aside", "drawer");
    const navSource = resolveProp("nav", "asideRight", "drawerRight");
    const pageSource = resolveProp("page", "main", "content", "body");
    const footerSource = resolveProp("footer", "footerContent");

    const drawerEnabledProp = resolveProp("drawerEnabled", "asideEnabled");
    const navEnabledProp = resolveProp("navEnabled", "asideRightEnabled", "rightAsideEnabled");
    const drawerEnabledValue = uiUnwrap(drawerEnabledProp);
    const navEnabledValue = uiUnwrap(navEnabledProp);
    const drawerRequested = drawerEnabledValue !== false;
    const navRequested = navEnabledValue === true || uiUnwrap(props.noNav) === false;
    const drawerDisabled = uiUnwrap(props.noDrawer) === true || drawerEnabledValue === false || drawerSource === false;
    const navDisabled = uiUnwrap(props.noNav) === true || navEnabledValue === false || navSource === false;
    const getDrawerFloating = () => uiUnwrap(props.drawerFloating) === true;
    const getNavFloating = () => uiUnwrap(props.navFloating) === true;
    const getDrawerResizable = () => uiUnwrap(props.drawerResizable) === true;
    const getNavResizable = () => uiUnwrap(props.navResizable) === true;
    const getDrawerMinWidth = () => toLayoutPx(uiUnwrap(props.drawerMinWidth), 180);
    const getDrawerMaxWidth = () => toLayoutPx(uiUnwrap(props.drawerMaxWidth), null);
    const getNavMinWidth = () => toLayoutPx(uiUnwrap(props.navMinWidth), 180);
    const getNavMaxWidth = () => toLayoutPx(uiUnwrap(props.navMaxWidth), null);
    const initialDrawerWidthPx = toLayoutPx(uiUnwrap(props.drawerWidth), 280);
    const initialNavWidthPx = toLayoutPx(uiUnwrap(props.navWidth) ?? uiUnwrap(props.asideRightWidth), 280);
    const [getDrawerWidthPx, setDrawerWidthPx] = CMSwift.reactive.signal(
      clampLayoutWidth(initialDrawerWidthPx, getDrawerMinWidth(), getDrawerMaxWidth())
    );
    const [getNavWidthPx, setNavWidthPx] = CMSwift.reactive.signal(
      clampLayoutWidth(initialNavWidthPx, getNavMinWidth(), getNavMaxWidth())
    );

    const controlledDrawer = resolveModel(props.drawerOpen, "UI.Layout:drawerOpen");
    const initialOpen = controlledDrawer
      ? !!controlledDrawer.get()
      : (typeof props.drawerOpen === "boolean" ? !!props.drawerOpen : true);
    const [getOpen, syncOpen] = CMSwift.reactive.signal(initialOpen);
    const setOpen = (value) => {
      const next = !!value;
      if (getOpen() !== next) syncOpen(next);
      controlledDrawer?.set(next);
    };
    controlledDrawer?.watch?.(() => {
      const next = !!controlledDrawer.get();
      if (getOpen() !== next) syncOpen(next);
    });

    const controlledNav = resolveModel(props.navOpen, "UI.Layout:navOpen");
    const initialNavOpen = controlledNav
      ? !!controlledNav.get()
      : (typeof props.navOpen === "boolean" ? !!props.navOpen : true);
    const [getNavOpen, syncNavOpen] = CMSwift.reactive.signal(initialNavOpen);
    const setNavOpen = (value) => {
      const next = !!value;
      if (getNavOpen() !== next) syncNavOpen(next);
      controlledNav?.set(next);
    };
    controlledNav?.watch?.(() => {
      const next = !!controlledNav.get();
      if (getNavOpen() !== next) syncNavOpen(next);
    });

    const layoutBreakpoint = Number(uiUnwrap(props.layoutBreakpoint) ?? 0);
    const drawerBreakpoint = Number(uiUnwrap(props.drawerBreakpoint) ?? (layoutBreakpoint || 1024));
    const navBreakpoint = Number(uiUnwrap(props.navBreakpoint) ?? (layoutBreakpoint || drawerBreakpoint));
    const responsiveBreakpoint = Math.max(drawerBreakpoint, navBreakpoint, 0);
    const [getMobile, setMobile] = CMSwift.reactive.signal(false);
    const checkMobile = () => {
      if (typeof window === "undefined") return;
      setMobile(window.innerWidth < responsiveBreakpoint);
    };
    if (typeof window !== "undefined") {
      checkMobile();
      window.addEventListener("resize", checkMobile);
    }

    const createCtx = () => ({
      props,
      openAside: () => setOpen(true),
      closeAside: () => setOpen(false),
      toggleAside: () => setOpen(!getOpen()),
      openNav: () => setNavOpen(true),
      closeNav: () => setNavOpen(false),
      toggleNav: () => setNavOpen(!getNavOpen()),
      isDrawerOpen: () => !!getOpen(),
      isNavOpen: () => !!getNavOpen(),
      isMobile: () => !!getMobile(),
      isDrawerFloating: () => getDrawerFloating(),
      isNavFloating: () => getNavFloating()
    });
    const renderAliasSlot = (names, fallback) => {
      const ctx = createCtx();
      for (const name of names) {
        if (!hasOwn(slots, name)) continue;
        const raw = typeof slots[name] === "function" ? slots[name](ctx) : slots[name];
        return renderSlotToArray(null, "default", ctx, raw);
      }
      const raw = typeof fallback === "function" ? fallback(ctx) : fallback;
      return renderSlotToArray(null, "default", ctx, raw);
    };

    const pageFallback = pageSource !== undefined ? pageSource : children;

    const cls = uiClass(["cms-app", "cms-layout", props.class]);
    const p = CMSwift.omit(props, [
      "header", "headerContent",
      "aside", "drawer",
      "nav", "asideRight", "drawerRight",
      "page", "main", "content", "body",
      "footer", "footerContent",
      "noDrawer", "drawerEnabled", "asideEnabled",
      "noNav", "navEnabled", "asideRightEnabled", "rightAsideEnabled",
      "drawerOpen", "navOpen",
      "layoutBreakpoint", "drawerBreakpoint", "navBreakpoint",
      "drawerWidth", "navWidth", "asideRightWidth",
      "drawerResizable", "drawerMinWidth", "drawerMaxWidth",
      "navResizable", "navMinWidth", "navMaxWidth",
      "drawerPeek", "navPeek", "asideRightPeek",
      "drawerFloating", "navFloating",
      "overlayClose", "escClose",
      "stickyHeader", "stickyFooter", "stickyAside", "stickyNav",
      "tagPage",
      "shellClass", "headerClass", "asideClass", "navClass", "pageClass", "footerClass", "overlayClass",
      "gap", "headerOffset", "minHeight",
      "slots"
    ]);
    p.class = cls;
    p.style = { ...(props.style || {}) };
    p.style["--cms-layout-drawer-width"] = toLayoutCssSize(uiUnwrap(props.drawerWidth) ?? 280, "280px");
    p.style["--cms-layout-nav-width"] = toLayoutCssSize(uiUnwrap(props.navWidth) ?? uiUnwrap(props.asideRightWidth) ?? 280, "280px");
    p.style["--cms-layout-drawer-peek"] = toLayoutCssSize(uiUnwrap(props.drawerPeek) ?? 20, "20px");
    p.style["--cms-layout-nav-peek"] = toLayoutCssSize(uiUnwrap(props.navPeek) ?? uiUnwrap(props.asideRightPeek) ?? 20, "20px");
    const layoutGap = toLayoutCssSize(uiUnwrap(props.gap), null);
    if (layoutGap != null) p.style["--cms-layout-gap"] = layoutGap;
    const headerOffset = toLayoutCssSize(uiUnwrap(props.headerOffset), null);
    if (headerOffset != null) p.style["--layout-header-height"] = headerOffset;
    const minHeight = toLayoutCssSize(uiUnwrap(props.minHeight), null);
    if (minHeight != null) p.style["--cms-layout-min-height"] = minHeight;

    const root = _.div(p);
    const tagPage = uiUnwrap(props.tagPage) === true;
    const tags = tagPage
      ? { header: "header", aside: "aside", nav: "nav", page: "main", footer: "footer" }
      : { header: "div", aside: "div", nav: "div", page: "div", footer: "div" };

    const shell = _.div({ class: uiClass(["cms-layout-shell-grid", props.shellClass]) });
    const headerWrap = _[tags.header]({
      class: uiClass(["cms-layout-section", "cms-layout-header", "header", uiWhen(props.stickyHeader, "sticky"), props.headerClass])
    });
    const asideWrap = _[tags.aside]({
      class: uiClass(["cms-layout-section", "cms-layout-aside", "aside", uiWhen(props.stickyAside !== false, "sticky"), props.asideClass]),
      role: "navigation",
      "aria-hidden": "true"
    });
    const asideContentWrap = _.div({ class: "cms-layout-panel-body cms-layout-aside-body" });
    const asideResizeHandle = _.div({
      class: "cms-layout-resize-handle cms-layout-resize-handle-drawer",
      "aria-hidden": "true"
    });
    asideWrap.appendChild(asideContentWrap);
    asideWrap.appendChild(asideResizeHandle);
    const navWrap = _[tags.nav]({
      class: uiClass(["cms-layout-section", "cms-layout-nav", "nav", uiWhen(props.stickyNav, "sticky"), props.navClass]),
      role: tags.nav === "nav" ? null : "complementary",
      "aria-hidden": "true"
    });
    const navContentWrap = _.div({ class: "cms-layout-panel-body cms-layout-nav-body" });
    const navResizeHandle = _.div({
      class: "cms-layout-resize-handle cms-layout-resize-handle-nav",
      "aria-hidden": "true"
    });
    navWrap.appendChild(navContentWrap);
    navWrap.appendChild(navResizeHandle);
    const mainWrap = _[tags.page]({
      class: uiClass(["cms-layout-section", "cms-layout-main", "main", props.pageClass]),
      role: tags.page === "main" ? null : "main"
    });
    const footerWrap = _[tags.footer]({
      class: uiClass(["cms-layout-section", "cms-layout-footer", "footer", uiWhen(props.stickyFooter, "sticky"), props.footerClass])
    });

    shell.appendChild(headerWrap);
    shell.appendChild(asideWrap);
    shell.appendChild(mainWrap);
    shell.appendChild(navWrap);
    shell.appendChild(footerWrap);
    root.appendChild(shell);

    const overlay = _.div({
      class: uiClass(["cms-aside-overlay", props.overlayClass]),
      onClick: () => {
        if (uiUnwrap(props.overlayClose) === false) return;
        if (getOpen()) setOpen(false);
        if (getNavOpen()) setNavOpen(false);
      }
    });
    root.appendChild(overlay);

    let hasHeaderContent = false;
    let hasDrawerContent = false;
    let hasNavContent = false;
    let hasPageContent = false;
    let hasFooterContent = false;
    let headerObserver = null;
    let disposeResizeSession = null;

    const disposeTree = (node) => {
      if (!node || typeof node !== "object") return;
      if (typeof node._dispose === "function") node._dispose();
      if (!node.childNodes || !node.childNodes.length) return;
      Array.from(node.childNodes).forEach(disposeTree);
    };

    const clearWrap = (wrap) => {
      if (!wrap) return;
      Array.from(wrap.childNodes).forEach((node) => {
        disposeTree(node);
        node.remove();
      });
    };

    const normalizeUpdateNodes = (value) => {
      const ctx = createCtx();
      const raw = typeof value === "function" ? value(ctx) : value;
      return renderSlotToArray(null, "default", ctx, raw);
    };

    const syncHeaderHeight = () => {
      const height = hasHeaderContent ? headerWrap.getBoundingClientRect().height : 0;
      root.style.setProperty("--layout-header-height", `${height}px`);
    };

    const fillWrap = (wrap, nodes) => {
      clearWrap(wrap);
      nodes.forEach((node) => wrap.appendChild(node));
      return nodes.length > 0;
    };
    const syncPanelWidths = () => {
      if (getDrawerResizable()) {
        const nextDrawerWidth = clampLayoutWidth(getDrawerWidthPx(), getDrawerMinWidth(), getDrawerMaxWidth());
        if (nextDrawerWidth !== getDrawerWidthPx()) setDrawerWidthPx(nextDrawerWidth);
        root.style.setProperty("--cms-layout-drawer-width", `${nextDrawerWidth}px`);
      }
      if (getNavResizable()) {
        const nextNavWidth = clampLayoutWidth(getNavWidthPx(), getNavMinWidth(), getNavMaxWidth());
        if (nextNavWidth !== getNavWidthPx()) setNavWidthPx(nextNavWidth);
        root.style.setProperty("--cms-layout-nav-width", `${nextNavWidth}px`);
      }
    };
    const startResize = (side, event) => {
      if (event.button !== 0) return;
      const panel = side === "drawer" ? asideWrap : navWrap;
      if (panel.hidden) return;
      const getCurrentWidth = side === "drawer" ? getDrawerWidthPx : getNavWidthPx;
      const setCurrentWidth = side === "drawer" ? setDrawerWidthPx : setNavWidthPx;
      const getMinWidth = side === "drawer" ? getDrawerMinWidth : getNavMinWidth;
      const getMaxWidth = side === "drawer" ? getDrawerMaxWidth : getNavMaxWidth;
      const rect = panel.getBoundingClientRect();
      const initialWidth = rect.width || getCurrentWidth();
      const onMove = (moveEvent) => {
        const nextWidth = side === "drawer"
          ? (moveEvent.clientX - rect.left)
          : (rect.right - moveEvent.clientX);
        setCurrentWidth(clampLayoutWidth(nextWidth || initialWidth, getMinWidth(), getMaxWidth()));
        syncPanelWidths();
        syncLayoutState();
      };
      const onUp = () => {
        root.classList.remove("is-resizing-layout");
        document.removeEventListener("pointermove", onMove, true);
        document.removeEventListener("pointerup", onUp, true);
        disposeResizeSession = null;
      };
      root.classList.add("is-resizing-layout");
      document.addEventListener("pointermove", onMove, true);
      document.addEventListener("pointerup", onUp, true);
      disposeResizeSession = onUp;
      event.preventDefault();
    };
    const onDrawerResizePointerDown = (event) => startResize("drawer", event);
    const onNavResizePointerDown = (event) => startResize("nav", event);
    asideResizeHandle.addEventListener("pointerdown", onDrawerResizePointerDown);
    navResizeHandle.addEventListener("pointerdown", onNavResizePointerDown);

    const syncLayoutState = () => {
      const mobile = !!getMobile();
      const asideOpen = !!getOpen();
      const navOpen = !!getNavOpen();
      const drawerEnabled = !drawerDisabled && drawerRequested && hasDrawerContent;
      const navEnabled = !navDisabled && navRequested && hasNavContent;
      const drawerFloating = drawerEnabled && (mobile || getDrawerFloating());
      const navFloating = navEnabled && (mobile || getNavFloating());
      const drawerVisible = drawerEnabled && asideOpen;
      const navVisible = navEnabled && navOpen;
      const inlineDrawerVisible = drawerVisible && !drawerFloating;
      const inlineNavVisible = navVisible && !navFloating;
      const inlineDrawerResizable = inlineDrawerVisible && getDrawerResizable();
      const inlineNavResizable = inlineNavVisible && getNavResizable();
      const overlayVisible = (drawerVisible && drawerFloating) || (navVisible && navFloating);

      syncPanelWidths();

      root.classList.toggle("is-mobile", mobile);
      root.classList.toggle("drawer-open", drawerVisible);
      root.classList.toggle("nav-open", navVisible);
      root.classList.toggle("no-drawer", !drawerEnabled);
      root.classList.toggle("no-nav", !navEnabled);
      root.classList.toggle("has-header", hasHeaderContent);
      root.classList.toggle("has-drawer", drawerEnabled);
      root.classList.toggle("has-nav", navEnabled);
      root.classList.toggle("has-footer", hasFooterContent);
      root.classList.toggle("drawer-floating", drawerFloating);
      root.classList.toggle("nav-floating", navFloating);

      headerWrap.hidden = !hasHeaderContent;
      footerWrap.hidden = !hasFooterContent;
      mainWrap.hidden = !hasPageContent;

      overlay.hidden = !(drawerFloating || navFloating);
      overlay.classList.toggle("show", overlayVisible);

      asideWrap.hidden = !drawerEnabled || (!drawerVisible && !drawerFloating);
      asideWrap.classList.toggle("open", drawerVisible);
      asideWrap.classList.toggle("is-floating", drawerFloating);
      asideWrap.classList.toggle("is-resizable", inlineDrawerResizable);
      asideWrap.setAttribute("aria-hidden", drawerVisible ? "false" : "true");
      asideResizeHandle.hidden = !inlineDrawerResizable;

      navWrap.hidden = !navEnabled || (!navVisible && !navFloating);
      navWrap.classList.toggle("open", navVisible);
      navWrap.classList.toggle("is-floating", navFloating);
      navWrap.classList.toggle("is-resizable", inlineNavResizable);
      navWrap.setAttribute("aria-hidden", navVisible ? "false" : "true");
      navResizeHandle.hidden = !inlineNavResizable;

      shell.style.gridTemplateColumns = [
        inlineDrawerVisible ? "minmax(0, var(--cms-layout-drawer-width))" : "0px",
        "minmax(0, 1fr)",
        inlineNavVisible ? "minmax(0, var(--cms-layout-nav-width))" : "0px"
      ].join(" ");
      shell.style.gridTemplateAreas = [
        "\"header header header\"",
        `"${inlineDrawerVisible ? "aside" : "."} main ${inlineNavVisible ? "nav" : "."}"`,
        "\"footer footer footer\""
      ].join(" ");
    };

    const headerUpdate = (value, newUrl) => {
      hasHeaderContent = fillWrap(headerWrap, normalizeUpdateNodes(value));
      syncHeaderHeight();
      syncLayoutState();
      if (newUrl) CMSwift.router.setURLOnly(newUrl);
      return headerWrap;
    };
    const asideUpdate = (value, newUrl) => {
      hasDrawerContent = fillWrap(asideContentWrap, normalizeUpdateNodes(value));
      if (!hasDrawerContent) setOpen(false);
      syncLayoutState();
      if (newUrl) CMSwift.router.setURLOnly(newUrl);
      return asideWrap;
    };
    const navUpdate = (value, newUrl) => {
      hasNavContent = fillWrap(navContentWrap, normalizeUpdateNodes(value));
      if (!hasNavContent) setNavOpen(false);
      syncLayoutState();
      if (newUrl) CMSwift.router.setURLOnly(newUrl);
      return navWrap;
    };
    const pageUpdate = (value, newUrl) => {
      hasPageContent = fillWrap(mainWrap, normalizeUpdateNodes(value));
      syncLayoutState();
      if (newUrl) CMSwift.router.setURLOnly(newUrl);
      return mainWrap;
    };
    const footerUpdate = (value, newUrl) => {
      hasFooterContent = fillWrap(footerWrap, normalizeUpdateNodes(value));
      syncLayoutState();
      if (newUrl) CMSwift.router.setURLOnly(newUrl);
      return footerWrap;
    };

    hasHeaderContent = fillWrap(headerWrap, renderAliasSlot(["header"], headerSource));
    hasDrawerContent = fillWrap(asideContentWrap, drawerDisabled ? [] : renderAliasSlot(["aside", "drawer"], drawerSource));
    hasNavContent = fillWrap(navContentWrap, navDisabled ? [] : renderAliasSlot(["nav", "asideRight", "drawerRight"], navSource));
    hasPageContent = fillWrap(mainWrap, renderAliasSlot(["page", "main", "default"], pageFallback));
    hasFooterContent = fillWrap(footerWrap, renderAliasSlot(["footer"], footerSource));

    if (typeof ResizeObserver !== "undefined") {
      headerObserver = new ResizeObserver(() => syncHeaderHeight());
      headerObserver.observe(headerWrap);
    }
    syncHeaderHeight();

    CMSwift.reactive.effect(() => {
      getMobile();
      getOpen();
      getNavOpen();
      syncLayoutState();
    }, "UI.Layout:state");

    const onKeyDown = (e) => {
      if (uiUnwrap(props.escClose) === false) return;
      if ((!getMobile() && !getDrawerFloating() && !getNavFloating()) || (!getOpen() && !getNavOpen())) return;
      if (e.key !== "Escape") return;
      e.preventDefault();
      if (getOpen()) setOpen(false);
      if (getNavOpen()) setNavOpen(false);
    };
    if (typeof document !== "undefined") {
      document.addEventListener("keydown", onKeyDown, true);
    }

    root.openAside = () => setOpen(true);
    root.closeAside = () => setOpen(false);
    root.toggleAside = () => setOpen(!getOpen());
    root.openNav = () => setNavOpen(true);
    root.closeNav = () => setNavOpen(false);
    root.toggleNav = () => setNavOpen(!getNavOpen());
    root.isDrawerOpen = () => !!getOpen();
    root.isNavOpen = () => !!getNavOpen();
    root.isMobile = () => !!getMobile();
    root.header = () => headerWrap;
    root.aside = () => asideWrap;
    root.drawer = () => asideWrap;
    root.nav = () => navWrap;
    root.page = () => mainWrap;
    root.main = () => mainWrap;
    root.footer = () => footerWrap;
    root.headerUpdate = headerUpdate;
    root.asideUpdate = asideUpdate;
    root.drawerUpdate = asideUpdate;
    root.navUpdate = navUpdate;
    root.pageUpdate = pageUpdate;
    root.mainUpdate = pageUpdate;
    root.footerUpdate = footerUpdate;
    root.reflow = syncLayoutState;
    root._dispose = () => {
      if (typeof window !== "undefined") window.removeEventListener("resize", checkMobile);
      if (typeof document !== "undefined") document.removeEventListener("keydown", onKeyDown, true);
      asideResizeHandle.removeEventListener("pointerdown", onDrawerResizePointerDown);
      navResizeHandle.removeEventListener("pointerdown", onNavResizePointerDown);
      disposeResizeSession?.();
      headerObserver?.disconnect?.();
    };

    setPropertyProps(root, props);
    syncLayoutState();
    return root;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Layout = {
      signature: "UI.Layout(...children) | UI.Layout(props, ...children)",
      props: {
        header: "Node|Function|Array",
        headerContent: "Node|Function|Array",
        aside: "Node|Function|Array|false",
        drawer: "Node|Function|Array|false",
        nav: "Node|Function|Array|false",
        asideRight: "Node|Function|Array|false",
        drawerRight: "Node|Function|Array|false",
        page: "Node|Function|Array",
        main: "Node|Function|Array",
        content: "Node|Function|Array",
        body: "Node|Function|Array",
        footer: "Node|Function|Array",
        footerContent: "Node|Function|Array",
        noDrawer: "boolean",
        drawerEnabled: "boolean",
        asideEnabled: "boolean",
        noNav: "boolean",
        navEnabled: "boolean",
        asideRightEnabled: "boolean",
        drawerOpen: "rod | [get,set] signal | boolean",
        navOpen: "rod | [get,set] signal | boolean",
        layoutBreakpoint: "number(px)",
        drawerBreakpoint: "number(px)",
        navBreakpoint: "number(px)",
        drawerWidth: "number|string",
        drawerResizable: "boolean",
        drawerMinWidth: "number|string",
        drawerMaxWidth: "number|string",
        navWidth: "number|string",
        navResizable: "boolean",
        navMinWidth: "number|string",
        navMaxWidth: "number|string",
        asideRightWidth: "number|string",
        drawerPeek: "number|string",
        navPeek: "number|string",
        asideRightPeek: "number|string",
        drawerFloating: "boolean",
        navFloating: "boolean",
        overlayClose: "boolean",
        escClose: "boolean",
        stickyHeader: "boolean",
        stickyFooter: "boolean",
        stickyAside: "boolean",
        stickyNav: "boolean",
        tagPage: "boolean",
        gap: "number|string",
        headerOffset: "number|string",
        minHeight: "number|string",
        shellClass: "string",
        headerClass: "string",
        asideClass: "string",
        navClass: "string",
        pageClass: "string",
        footerClass: "string",
        overlayClass: "string",
        slots: "{ header?, aside?, drawer?, nav?, asideRight?, drawerRight?, page?, main?, footer?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        header: "Header content",
        aside: "Aside / drawer content",
        drawer: "Alias di aside",
        nav: "Right-side panel content",
        asideRight: "Alias di nav",
        drawerRight: "Alias di nav",
        page: "Page content",
        main: "Alias di page",
        footer: "Footer content",
        default: "Fallback page content"
      },
      returns: "HTMLDivElement con methods openAside/closeAside/toggleAside/openNav/closeNav/toggleNav, " +
        "isDrawerOpen/isNavOpen/isMobile/reflow, header()/aside()/nav()/page()/footer(), " +
        "headerUpdate/asideUpdate/navUpdate/pageUpdate/mainUpdate/footerUpdate e _dispose()",
      description: "Shell layout composabile con drawer sinistro e nav destro indipendenti, width configurabili, resize opzionale con min/max, modalita floating opzionale e update runtime delle sezioni."
    };
  }
  // Esempio: CMSwift.ui.Layout({ header, aside, page, footer })

  UI.Footer = (...args) => {
    const { props: rawProps, children } = CMSwift.uiNormalizeArgs(args);
    const slots = rawProps.slots || {};
    const hasOwn = (key) => Object.prototype.hasOwnProperty.call(rawProps, key);
    const ctx = { props: rawProps };
    const appendResolvedValue = (host, value) => {
      if (value == null || value === false) return;
      if (Array.isArray(value)) {
        value.forEach((item) => appendResolvedValue(host, item));
        return;
      }
      if (value?.nodeType) {
        host.appendChild(value);
        return;
      }
      host.appendChild(document.createTextNode(String(value)));
    };
    const renderPropNodes = (name, fallback, map = (value) => value) => {
      const slot = CMSwift.ui.getSlot(slots, name);
      if (slot !== null && slot !== undefined) {
        return renderSlotToArray(slots, name, ctx, null);
      }
      if (typeof fallback === "function") {
        const inlineNames = new Set(["eyebrow", "title", "subtitle"]);
        const host = _[inlineNames.has(name) ? "span" : "div"]({ class: `cms-footer-slot-${name}` });
        CMSwift.reactive.effect(() => {
          const nextValue = map(fallback(ctx));
          const normalized = flattenSlotValue(CMSwift.ui.slot(nextValue));
          host.replaceChildren();
          if (Array.isArray(normalized)) normalized.forEach((item) => appendResolvedValue(host, item));
          else appendResolvedValue(host, normalized);
        }, `UI.Footer:${name}`);
        return [host];
      }
      return renderSlotToArray(slots, name, ctx, map(fallback));
    };

    const renderIconValue = (value, as = "icon", sizeFallback = rawProps.iconSize || rawProps.size || "md") => {
      if (value == null || value === false) return null;
      if (typeof value === "string") return UI.Icon({ name: value, size: sizeFallback });
      return CMSwift.ui.slot(value, { as });
    };

    const startFallback = hasOwn("left") ? rawProps.left : rawProps.start;
    const endFallback = hasOwn("right") ? rawProps.right : rawProps.end;
    const titleFallback = hasOwn("title") ? rawProps.title : rawProps.label;
    const subtitleFallback = rawProps.subtitle ?? rawProps.description ?? rawProps.note;
    const contentFallback = hasOwn("content")
      ? rawProps.content
      : (hasOwn("body") ? rawProps.body : (children?.length ? children : null));

    const startNodes = [
      ...renderPropNodes("left", startFallback),
      ...renderPropNodes("start", null)
    ];
    const iconNodes = renderPropNodes("icon", rawProps.icon, renderIconValue);
    const eyebrowNodes = renderPropNodes("eyebrow", rawProps.eyebrow ?? rawProps.kicker);
    const titleNodes = renderPropNodes("title", titleFallback);
    const subtitleNodes = renderPropNodes("subtitle", subtitleFallback);
    const metaNodes = renderPropNodes("meta", rawProps.meta);
    const contentNodes = (() => {
      const explicit = renderPropNodes("content", null);
      return explicit.length ? explicit : renderPropNodes("default", contentFallback);
    })();
    const customBodyNodes = [
      ...renderPropNodes("center", null),
      ...renderPropNodes("body", null)
    ];
    const endNodes = [
      ...renderPropNodes("right", endFallback),
      ...renderPropNodes("end", null)
    ];
    const actionNodes = renderPropNodes("actions", rawProps.actions);

    const structuredBody = _.div(
      { class: uiClass(["cms-footer-body", rawProps.bodyClass, rawProps.centerClass]) },
      _.div(
        { class: "cms-footer-heading" },
        iconNodes.length ? _.div({ class: "cms-footer-icon" }, ...iconNodes) : null,
        _.div(
          { class: "cms-footer-copy" },
          eyebrowNodes.length ? _.div({ class: uiClass(["cms-footer-eyebrow", rawProps.eyebrowClass]) }, ...eyebrowNodes) : null,
          titleNodes.length ? _.div({ class: uiClass(["cms-footer-title", rawProps.titleClass]) }, ...titleNodes) : null,
          subtitleNodes.length ? _.div({ class: uiClass(["cms-footer-subtitle", rawProps.subtitleClass]) }, ...subtitleNodes) : null,
          contentNodes.length ? _.div({ class: uiClass(["cms-footer-content", rawProps.contentClass]) }, ...contentNodes) : null
        ),
        metaNodes.length ? _.div({ class: uiClass(["cms-footer-meta", rawProps.metaClass]) }, ...metaNodes) : null
      )
    );

    const mainChildren = [];
    if (customBodyNodes.length) {
      mainChildren.push(_.div({ class: uiClass(["cms-footer-body", rawProps.bodyClass, rawProps.centerClass]) }, ...customBodyNodes));
    } else if (iconNodes.length || eyebrowNodes.length || titleNodes.length || subtitleNodes.length || contentNodes.length || metaNodes.length) {
      mainChildren.push(structuredBody);
    }
    if (endNodes.length || actionNodes.length) {
      mainChildren.push(
        _.div(
          { class: uiClass(["cms-footer-end", rawProps.endClass]) },
          ...endNodes,
          ...(actionNodes.length ? [_.div({ class: uiClass(["cms-footer-actions", rawProps.actionsClass]) }, ...actionNodes)] : [])
        )
      );
    }

    const p = CMSwift.omit(rawProps, [
      "actions", "actionsClass", "align", "body", "bodyClass", "center", "centerClass", "content",
      "contentClass", "dense", "description", "divider", "elevated", "end", "endClass", "eyebrow",
      "eyebrowClass", "gap", "icon", "iconSize", "kicker", "label", "left", "meta", "metaClass",
      "minHeight", "note", "right", "slots", "stack", "start", "startClass", "sticky", "subtitle",
      "subtitleClass", "title", "titleClass", "wrap", "justify"
    ]);
    p.class = uiClass([
      "cms-panel",
      "cms-footer",
      "cms-singularity",
      uiWhen(rawProps.sticky, "sticky"),
      uiWhen(rawProps.dense, "dense"),
      uiWhen(rawProps.elevated, "elevated"),
      uiWhen(rawProps.divider !== false, "divider"),
      uiWhen(rawProps.stack, "stack"),
      uiClassValue(rawProps.align, "align-"),
      rawProps.class
    ]);
    p.style = { ...(rawProps.style || {}) };
    const justify = uiStyleValue(rawProps.justify);
    if (justify != null) p.style.justifyContent = justify;
    const wrap = uiStyleValue(rawProps.wrap, (v) => v ? "wrap" : "nowrap");
    if (wrap != null) p.style.flexWrap = wrap;
    if (rawProps.gap != null) p.style["--cms-footer-gap"] = toCssSize(uiUnwrap(rawProps.gap));
    if (rawProps.minHeight != null) p.style.minHeight = toCssSize(uiUnwrap(rawProps.minHeight));

    const el = _.footer(
      p,
      ...(startNodes.length ? [_.div({ class: uiClass(["cms-footer-start", rawProps.startClass]) }, ...startNodes)] : []),
      ...(mainChildren.length ? [_.div({ class: "cms-footer-main" }, ...mainChildren)] : [])
    );

    setPropertyProps(el, rawProps);
    return el;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Footer = {
      signature: "UI.Footer(...children) | UI.Footer(props, ...children)",
      props: {
        title: "String|Node|Function|Array",
        subtitle: "String|Node|Function|Array",
        eyebrow: "String|Node|Function|Array",
        content: "Node|Function|Array",
        meta: "Node|Function|Array",
        icon: "String|Node|Function|Array",
        left: "Node|Function|Array",
        start: "Alias di left",
        right: "Node|Function|Array",
        end: "Alias di right",
        body: "Alias di content",
        actions: "Node|Function|Array",
        sticky: "boolean",
        dense: "boolean",
        elevated: "boolean",
        divider: "boolean",
        align: `left|center|right`,
        justify: `flex-start|center|flex-end|space-between|space-around|space-evenly`,
        wrap: "boolean",
        stack: "boolean",
        gap: "string|number",
        minHeight: "string|number",
        slots: "{ left?, start?, right?, end?, center?, body?, icon?, eyebrow?, title?, subtitle?, meta?, content?, actions?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        left: "Area iniziale del footer",
        start: "Alias/addon area iniziale",
        right: "Area finale del footer",
        end: "Alias/addon area finale",
        center: "Override completo del body centrale",
        body: "Alias di center",
        icon: "Icona leading",
        eyebrow: "Eyebrow / kicker",
        title: "Titolo principale",
        subtitle: "Sottotitolo o nota",
        meta: "Meta info accanto al contenuto centrale",
        content: "Contenuto extra o fallback dei children",
        actions: "Azioni raggruppate nella zona finale",
        default: "Fallback content per la body area"
      },
      returns: "HTMLElement <footer>",
      description: "Footer strutturato con regioni start/body/end, copy opzionale, azioni e slot composabili."
    };
  }
  // Esempio: CMSwift.ui.Footer({}, "Footer")

  const normalizeChildren = (children) => {
    const out = [];
    for (const ch of (children || [])) {
      const v = flattenSlotValue(CMSwift.ui.slot(ch));
      if (!v) continue;
      if (Array.isArray(v)) out.push(...v);
      else out.push(v);
    }
    return out;
  };

  const slotToArray = (value, opts) => {
    const v = flattenSlotValue(CMSwift.ui.slot(value, opts));
    if (!v) return [];
    return Array.isArray(v) ? v : [v];
  };

  const toCssSize = (v) => {
    if (typeof v === "number") return `${v}px`;
    if (typeof v === "string" && CMSwift.uiSizes?.includes(v)) return `var(--cms-size-${v})`;
    return String(v);
  };

  UI.Toolbar = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const renderArea = (names, fallback, ctx = {}) => {
      const list = Array.isArray(names) ? names : [names];
      for (const name of list) {
        if (CMSwift.ui.getSlot(slots, name) != null) {
          return renderSlotToArray(slots, name, ctx, fallback);
        }
      }
      return fallback == null ? [] : renderSlotToArray(null, "default", ctx, fallback);
    };
    const hasArea = (names) => {
      const list = Array.isArray(names) ? names : [names];
      return list.some((name) => CMSwift.ui.getSlot(slots, name) != null);
    };

    const ctx = { props };
    const beforeNodes = renderArea(["before"], props.before, ctx);
    const startNodes = renderArea(["start", "left"], props.start ?? props.left, ctx);
    const centerNodes = renderArea(["center", "body", "content", "default"], props.center ?? props.body ?? props.content ?? children, ctx);
    const endNodes = renderArea(["end", "right", "actions"], props.end ?? props.right ?? props.actions, ctx);
    const afterNodes = renderArea(["after"], props.after, ctx);
    const titleNodes = renderArea(["title"], props.title, ctx);
    const subtitleNodes = renderArea(["subtitle"], props.subtitle, ctx);
    const metaNodes = renderArea(["meta"], props.meta, ctx);

    const hasStructuredContent = !!(
      beforeNodes.length || startNodes.length || endNodes.length || afterNodes.length || titleNodes.length || subtitleNodes.length || metaNodes.length
      || props.before != null || props.start != null || props.left != null || props.end != null || props.right != null || props.actions != null
      || props.after != null || props.title != null || props.subtitle != null || props.meta != null || props.body != null || props.center != null || props.content != null
      || props.beforeClass || props.startClass || props.bodyClass || props.centerClass || props.contentClass || props.endClass || props.afterClass
      || props.titleClass || props.subtitleClass || props.metaClass || props.copyClass
      || hasArea(["before", "start", "left", "center", "body", "content", "end", "right", "actions", "after", "title", "subtitle", "meta"])
    );

    const cls = uiClass([
      "cms-toolbar",
      uiWhen(hasStructuredContent, "structured"),
      uiWhen(props.dense, "dense"),
      uiWhen(props.divider, "divider"),
      uiWhen(props.elevated, "elevated"),
      uiWhen(props.sticky, "sticky"),
      props.class
    ]);

    const p = CMSwift.omit(props, [
      "actions", "after", "afterClass", "align", "before", "beforeClass", "body", "bodyClass", "center", "centerClass",
      "content", "contentClass", "copyClass", "dense", "divider", "elevated", "end", "endClass", "gap", "justify",
      "left", "meta", "metaClass", "right", "size", "slots", "start", "startClass", "sticky", "subtitle", "subtitleClass",
      "title", "titleClass", "wrap"
    ]);
    p.class = cls;

    const style = { ...(props.style || {}) };
    style.display = style.display || "flex";
    const align = uiStyleValue(props.align);
    const justify = uiStyleValue(props.justify);
    const wrap = uiStyleValue(props.wrap, (v) => typeof v === "boolean" ? (v ? "wrap" : "nowrap") : String(v), "wrap");
    const gap = uiStyleValue(props.gap, toCssSize, "var(--cms-s-md)");
    style["--cms-toolbar-gap"] = gap != null ? gap : "var(--cms-s-md)";
    style.gap = style.gap || "var(--cms-toolbar-gap)";
    const sizePadding = {
      xxs: "4px 6px",
      xs: "6px 8px",
      sm: "6px 10px",
      md: "10px 12px",
      lg: "12px 16px",
      xl: "14px 18px",
      xxl: "16px 20px"
    };
    const padding = uiStyleValue(props.size, (v) => sizePadding[v] || "");
    if (padding != null) style.padding = padding;
    if (hasStructuredContent) {
      style.flexDirection = style.flexDirection || "column";
      style.alignItems = style.alignItems || "stretch";
    } else {
      if (align != null) style.alignItems = align;
      if (justify != null) style.justifyContent = justify;
      if (wrap != null) style.flexWrap = wrap;
    }
    if (Object.keys(style).length) p.style = style;

    if (!hasStructuredContent) {
      const content = renderSlotToArray(slots, "default", ctx, children);
      const el = _.div(p, ...content);
      setPropertyProps(el, props);
      return el;
    }

    const bodyClass = props.bodyClass ?? props.centerClass ?? props.contentClass;
    const endAutoMargin = uiComputed([props.justify], () => {
      const value = uiUnwrap(props.justify);
      return !value || value === "flex-start" ? "auto" : "";
    });
    const regionStyle = {
      display: "flex",
      alignItems: "inherit",
      gap: "var(--cms-toolbar-gap)",
      flexWrap: "inherit",
      minWidth: 0
    };
    const mainStyle = {};
    if (align != null) mainStyle.alignItems = align;
    if (justify != null) mainStyle.justifyContent = justify;
    if (wrap != null) mainStyle.flexWrap = wrap;

    const copyNode = (metaNodes.length || titleNodes.length || subtitleNodes.length)
      ? _.div(
        { class: uiClass(["cms-toolbar-copy", props.copyClass]) },
        metaNodes.length ? _.div({ class: uiClass(["cms-toolbar-meta", props.metaClass]) }, ...metaNodes) : null,
        titleNodes.length ? _.div({ class: uiClass(["cms-toolbar-title", props.titleClass]) }, ...titleNodes) : null,
        subtitleNodes.length ? _.div({ class: uiClass(["cms-toolbar-subtitle", props.subtitleClass]) }, ...subtitleNodes) : null
      )
      : null;

    const hasMainContent = !!(startNodes.length || copyNode || centerNodes.length || endNodes.length);
    const parts = [
      beforeNodes.length
        ? _.div({ class: uiClass(["cms-toolbar-before", props.beforeClass]), style: { ...regionStyle } }, ...beforeNodes)
        : null,
      hasMainContent
        ? _.div(
          { class: "cms-toolbar-main", style: mainStyle },
          startNodes.length
            ? _.div({ class: uiClass(["cms-toolbar-start", props.startClass]), style: { ...regionStyle } }, ...startNodes)
            : null,
          (copyNode || centerNodes.length)
            ? _.div({ class: uiClass(["cms-toolbar-center", bodyClass]), style: { ...regionStyle, flex: "1 1 240px" } }, copyNode, ...centerNodes)
            : null,
          endNodes.length
            ? _.div({
              class: uiClass(["cms-toolbar-end", props.endClass]),
              style: {
                ...regionStyle,
                justifyContent: "flex-end",
                marginInlineStart: endAutoMargin
              }
            }, ...endNodes)
            : null
        )
        : null,
      afterNodes.length
        ? _.div({ class: uiClass(["cms-toolbar-after", props.afterClass]), style: { ...regionStyle } }, ...afterNodes)
        : null
    ].filter(Boolean);

    const el = _.div(p, ...parts);
    setPropertyProps(el, props);
    return el;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Toolbar = {
      signature: "UI.Toolbar(...children) | UI.Toolbar(props, ...children)",
      props: {
        before: "Node|Function|Array",
        start: "Node|Function|Array",
        left: "Alias di start",
        center: "Node|Function|Array",
        body: "Alias di center",
        content: "Alias di center",
        title: "String|Node|Function|Array",
        subtitle: "String|Node|Function|Array",
        meta: "String|Node|Function|Array",
        end: "Node|Function|Array",
        right: "Alias di end",
        actions: "Alias di end",
        after: "Node|Function|Array",
        dense: "boolean",
        divider: "boolean",
        elevated: "boolean",
        sticky: "boolean",
        wrap: "boolean|string",
        align: `stretch|flex-start|center|flex-end|baseline`,
        justify: `flex-start|center|flex-end|space-between|space-around|space-evenly`,
        gap: "string|number (es: '8px' o 'var(--cms-s-md)')",
        size: "xxs|xs|sm|md|lg|xl|xxl",
        beforeClass: "string",
        startClass: "string",
        bodyClass: "string",
        centerClass: "Alias di bodyClass",
        contentClass: "Alias di bodyClass",
        copyClass: "string",
        titleClass: "string",
        subtitleClass: "string",
        metaClass: "string",
        endClass: "string",
        afterClass: "string",
        slots: "{ before?, start?, left?, center?, body?, content?, title?, subtitle?, meta?, end?, right?, actions?, after?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        before: "Row superiore opzionale",
        start: "Leading content area",
        left: "Alias di start",
        center: "Main content area",
        body: "Alias di center",
        content: "Alias di center",
        title: "Titolo principale della toolbar",
        subtitle: "Sottotitolo o nota operativa",
        meta: "Meta info/chips sopra o accanto al titolo",
        end: "Trailing actions area",
        right: "Alias di end",
        actions: "Alias di end",
        after: "Row inferiore opzionale",
        default: "Fallback content / children"
      },
      events: {
        onClick: "MouseEvent"
      },
      description: "Toolbar composabile con regioni before/start/center/end/after, copy opzionale e fallback compatibile con l'uso flex semplice.",
      returns: "HTMLDivElement"
    };
  }
  // Esempio: CMSwift.ui.Toolbar({}, CMSwift.ui.Btn({}, "Azione"))

  const isGridColNode = (value) => value && value.nodeType === 1 && value.classList?.contains("cms-grid-col");

  UI.Grid = (...args) => {
    const { props: rawProps, children } = CMSwift.uiNormalizeArgs(args);
    const slots = rawProps.slots || {};
    const itemSource = uiUnwrap(rawProps.items);
    const items = Array.isArray(itemSource) ? itemSource : (itemSource == null ? [] : [itemSource]);

    const buildItemProps = (entryProps = {}) => {
      const baseProps = rawProps.itemProps || {};
      const merged = { ...baseProps, ...entryProps };
      merged.class = uiClass([baseProps.class, rawProps.itemClass, entryProps.class]);
      merged.style = {
        ...(baseProps.style || {}),
        ...(rawProps.itemStyle || {}),
        ...(entryProps.style || {})
      };
      return merged;
    };

    const normalizeResolvedNode = (value, entryProps = {}) => {
      if (value == null || value === false) return [];
      if (isGridColNode(value)) return [value];
      if (isUIPlainObject(value)) {
        const childContent = value.children != null
          ? asNodeArray(value.children)
          : (value.content != null
            ? asNodeArray(value.content)
            : (value.node != null
              ? asNodeArray(value.node)
              : (value.label != null ? asNodeArray(value.label) : [])));
        return [UI.GridCol(buildItemProps(value), ...childContent)];
      }
      if (Array.isArray(value)) {
        return [UI.GridCol(buildItemProps(entryProps), ...value)];
      }
      return [UI.GridCol(buildItemProps(entryProps), value)];
    };

    const normalizeItemNode = (value, index, total, useItemSlot = true) => {
      if (value == null || value === false) return [];
      const entryProps = isUIPlainObject(value) ? value : {};
      if (useItemSlot) {
        const ctx = {
          item: value,
          index,
          count: total,
          first: index === 0,
          last: index === total - 1
        };
        const slotted = renderSlotToArray(slots, "item", ctx, null);
        if (slotted.length) {
          return slotted.flatMap((node) => normalizeResolvedNode(node, entryProps));
        }
      }
      return normalizeResolvedNode(value, entryProps);
    };

    const content = [];
    items.forEach((item, index) => {
      content.push(...normalizeItemNode(item, index, items.length));
    });

    const defaultNodes = renderSlotToArray(slots, "default", { items, count: items.length }, children);
    defaultNodes.forEach((node) => {
      content.push(...normalizeResolvedNode(node));
    });

    if (!content.length) {
      const emptyNodes = renderSlotToArray(slots, "empty", { items, count: 0 }, rawProps.empty);
      emptyNodes.forEach((node) => {
        const normalized = normalizeResolvedNode(node, {
          style: { gridColumn: "1 / -1" }
        });
        content.push(...normalized);
      });
    }

    const cls = uiClass([
      "cms-grid",
      uiWhen(rawProps.dense, "dense"),
      uiWhen(rawProps.inline, "cms-grid-inline"),
      uiWhen(rawProps.debug, "cms-grid-debug"),
      rawProps.class
    ]);

    const p = CMSwift.omit(rawProps, [
      "gap", "rowGap", "columnGap", "colGap", "cols", "columns", "rows", "areas", "align", "justify",
      "alignItems", "justifyItems", "placeItems", "placeContent", "dense", "flow", "inline", "debug",
      "autoFit", "autoFill", "min", "max", "autoRows", "items", "itemClass", "itemStyle", "itemProps",
      "empty", "slots", "full", "width", "minWidth", "maxWidth", "padding"
    ]);
    p.class = cls;

    const style = { ...(rawProps.style || {}) };
    const gap = uiStyleValue(rawProps.gap, toCssSize);
    if (gap != null) {
      style["--cms-grid-gap"] = gap;
      style.gap = gap;
    }
    const rowGap = uiStyleValue(rawProps.rowGap, toCssSize);
    if (rowGap != null) style.rowGap = rowGap;
    const columnGap = uiStyleValue(rawProps.columnGap ?? rawProps.colGap, toCssSize);
    if (columnGap != null) style.columnGap = columnGap;

    const trackMax = uiStyleValue(rawProps.max, toCssSize, "1fr");
    const min = uiStyleValue(rawProps.min, toCssSize);
    if (min != null) {
      const mode = uiUnwrap(rawProps.autoFill) ? "auto-fill" : "auto-fit";
      style.gridTemplateColumns = `repeat(${mode}, minmax(${min}, ${trackMax || "1fr"}))`;
    } else {
      const cols = uiStyleValue(rawProps.columns ?? rawProps.cols, (v) => typeof v === "number"
        ? `repeat(${v}, minmax(0, 1fr))`
        : String(v)
      );
      if (cols != null) style.gridTemplateColumns = cols;
    }

    const rows = uiStyleValue(rawProps.rows, (v) => typeof v === "number"
      ? `repeat(${v}, minmax(0, auto))`
      : String(v)
    );
    if (rows != null) style.gridTemplateRows = rows;

    const autoRows = uiStyleValue(rawProps.autoRows, toCssSize);
    if (autoRows != null) style.gridAutoRows = autoRows;

    const flow = uiStyleValue(rawProps.flow, (v) => {
      const value = String(v);
      return rawProps.dense && !value.includes("dense") ? `${value} dense` : value;
    });
    if (flow != null) style.gridAutoFlow = flow;

    const areas = uiStyleValue(rawProps.areas, (value) => {
      if (Array.isArray(value)) {
        return value.map((row) => `"${Array.isArray(row) ? row.join(" ") : String(row)}"`).join(" ");
      }
      return String(value);
    });
    if (areas != null) style.gridTemplateAreas = areas;

    const align = uiStyleValue(rawProps.align ?? rawProps.alignItems);
    if (align != null) style.alignItems = align;
    const justify = uiStyleValue(rawProps.justify);
    if (justify != null) style.justifyContent = justify;
    const justifyItems = uiStyleValue(rawProps.justifyItems);
    if (justifyItems != null) style.justifyItems = justifyItems;
    const placeItems = uiStyleValue(rawProps.placeItems);
    if (placeItems != null) style.placeItems = placeItems;
    const placeContent = uiStyleValue(rawProps.placeContent);
    if (placeContent != null) style.placeContent = placeContent;
    const width = uiStyleValue(rawProps.width, toCssSize);
    if (width != null) style.width = width;
    if (uiUnwrap(rawProps.full) === true) style.width = "100%";
    const minWidth = uiStyleValue(rawProps.minWidth, toCssSize);
    if (minWidth != null) style.minWidth = minWidth;
    const maxWidth = uiStyleValue(rawProps.maxWidth, toCssSize);
    if (maxWidth != null) style.maxWidth = maxWidth;
    const padding = uiStyleValue(rawProps.padding, toCssSize);
    if (padding != null) style.padding = padding;
    if (Object.keys(style).length) p.style = style;

    const el = _.div(p, ...content);
    setPropertyProps(el, rawProps);
    return el;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Grid = {
      signature: "UI.Grid(...children) | UI.Grid(props, ...children)",
      props: {
        cols: "number|string",
        columns: "alias di cols",
        min: "string|number (auto-fit/auto-fill min width)",
        max: "string|number (max track size, default 1fr)",
        gap: "string|number",
        rowGap: "string|number",
        columnGap: "string|number",
        colGap: "alias di columnGap",
        rows: "number|string",
        autoRows: "string|number",
        areas: "string|array",
        flow: "row|column|dense|row dense|column dense",
        align: `stretch|start|center|end`,
        alignItems: "alias di align",
        justify: `start|center|end|space-between|space-around|space-evenly`,
        justifyItems: `stretch|start|center|end`,
        placeItems: "string",
        placeContent: "string",
        dense: "boolean",
        inline: "boolean",
        debug: "boolean",
        autoFit: "boolean",
        autoFill: "boolean",
        full: "boolean",
        width: "string|number",
        minWidth: "string|number",
        maxWidth: "string|number",
        padding: "string|number",
        items: "Array<Node|Object|string>",
        itemClass: "string",
        itemStyle: "object",
        itemProps: "object",
        empty: "String|Node|Function|Array",
        slots: "{ default?, item?, empty? }",
        class: "string",
        style: "object"
      },
      slots: {
        default: "Grid content fallback",
        item: "Render custom di ogni item ({ item, index, count, first, last })",
        empty: "Empty state della griglia"
      },
      returns: "HTMLDivElement",
      description: "Griglia dichiarativa per layout responsive: supporta children, items/slot item, auto-fit, template custom e empty state."
    };
  }
  // Esempio: CMSwift.ui.Grid({}, CMSwift.ui.GridCol({ span: 12 }, "Col"))

  UI.GridCol = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const hasOwn = (key) => Object.prototype.hasOwnProperty.call(props, key);
    const renderArea = (names, fallback, ctx = {}) => {
      const list = Array.isArray(names) ? names : [names];
      for (const name of list) {
        if (CMSwift.ui.getSlot(slots, name) != null) {
          return renderSlotToArray(slots, name, ctx, fallback);
        }
      }
      return fallback == null ? [] : renderSlotToArray(null, "default", ctx, fallback);
    };
    const resolveSpaceValue = (value) => {
      if (value == null || value === false || value === "") return "";
      if (typeof value === "string" && CMSwift.uiSizes?.includes(value)) return `var(--cms-s-${value})`;
      return toCssSize(value);
    };
    const resolveSizeValue = (value) => {
      if (value == null || value === false || value === "") return "";
      if (typeof value === "string" && CMSwift.uiSizes?.includes(value)) return unitCover(value, "size");
      return toCssSize(value);
    };

    const style = { ...(props.style || {}) };
    const toGridSpan = (value) => {
      if (value == null || value === "") return null;
      if (value === "auto") return "auto";
      if (value === "full" || value === true) return "1 / -1";
      const n = Number(value);
      if (Number.isFinite(n) && n > 0) {
        const spanValue = Math.max(1, Math.round(n));
        return `span ${spanValue} / span ${spanValue}`;
      }
      return String(value);
    };
    const toGridRow = (value) => {
      if (value == null || value === "") return null;
      if (value === "full" || value === true) return "1 / -1";
      const n = Number(value);
      if (Number.isFinite(n) && n > 0) {
        const spanValue = Math.max(1, Math.round(n));
        return `span ${spanValue} / span ${spanValue}`;
      }
      return String(value);
    };

    const span = uiStyleValue(props.span, toGridSpan);
    const sm = uiStyleValue(props.sm, toGridSpan);
    const md = uiStyleValue(props.md, toGridSpan);
    const lg = uiStyleValue(props.lg, toGridSpan);
    const rowSpan = uiStyleValue(props.rowSpan, toGridRow);
    const row = uiStyleValue(props.row, toGridRow);
    const area = uiStyleValue(props.area);
    const align = uiStyleValue(props.align);
    const justify = uiStyleValue(props.justify);
    const place = uiStyleValue(props.place);
    const gap = uiStyleValue(props.gap, resolveSpaceValue);
    const rowGap = uiStyleValue(props.rowGap, resolveSpaceValue);
    const columnGap = uiStyleValue(props.columnGap, resolveSpaceValue);
    const padding = uiStyleValue(props.padding, resolveSpaceValue);
    const width = uiStyleValue(props.width, resolveSizeValue);
    const minHeight = uiStyleValue(props.minHeight, resolveSizeValue);
    const height = uiStyleValue(props.height, resolveSizeValue);
    const maxHeight = uiStyleValue(props.maxHeight, resolveSizeValue);
    const contentAlign = uiStyleValue(props.contentAlign);
    const contentJustify = uiStyleValue(props.contentJustify);
    const direction = uiStyleValue(props.direction);
    const scroll = uiStyleValue(props.scroll, (value) => value === true ? "auto" : String(value), "");
    const fullHeight = uiStyleValue(props.fullHeight, (value) => value ? "100%" : "", "");
    const centerContent = uiComputed([props.center, props.contentAlign, props.contentJustify], () => {
      return !!uiUnwrap(props.center)
        && (uiUnwrap(props.contentAlign) == null || uiUnwrap(props.contentAlign) === "")
        && (uiUnwrap(props.contentJustify) == null || uiUnwrap(props.contentJustify) === "");
    });

    const ctx = { props };
    const startNodes = renderArea(
      ["start", "top", "header", "before"],
      props.start ?? props.top ?? props.header ?? props.before,
      ctx
    );
    const bodyFallback = hasOwn("body")
      ? props.body
      : (hasOwn("content") ? props.content : children);
    const bodyNodes = renderArea(["body", "content", "default"], bodyFallback, ctx);
    const endNodes = renderArea(
      ["end", "bottom", "footer", "after"],
      props.end ?? props.bottom ?? props.footer ?? props.after,
      ctx
    );
    const hasStructuredContent = startNodes.length || endNodes.length
      || hasOwn("start") || hasOwn("top") || hasOwn("header") || hasOwn("before")
      || hasOwn("body") || hasOwn("content")
      || hasOwn("end") || hasOwn("bottom") || hasOwn("footer") || hasOwn("after")
      || props.startClass || props.bodyClass || props.contentClass || props.endClass
      || props.topClass || props.headerClass || props.bottomClass || props.footerClass
      || CMSwift.ui.getSlot(slots, "start") != null
      || CMSwift.ui.getSlot(slots, "top") != null
      || CMSwift.ui.getSlot(slots, "header") != null
      || CMSwift.ui.getSlot(slots, "before") != null
      || CMSwift.ui.getSlot(slots, "body") != null
      || CMSwift.ui.getSlot(slots, "content") != null
      || CMSwift.ui.getSlot(slots, "end") != null
      || CMSwift.ui.getSlot(slots, "bottom") != null
      || CMSwift.ui.getSlot(slots, "footer") != null
      || CMSwift.ui.getSlot(slots, "after") != null;
    const useStackLayout = uiComputed([
      props.stack, props.gap, props.rowGap, props.columnGap,
      props.contentAlign, props.contentJustify, props.direction, props.center
    ], () => {
      if (hasStructuredContent || !!uiUnwrap(props.stack)) return true;
      const values = [
        uiUnwrap(props.gap),
        uiUnwrap(props.rowGap),
        uiUnwrap(props.columnGap),
        uiUnwrap(props.contentAlign),
        uiUnwrap(props.contentJustify),
        uiUnwrap(props.direction)
      ];
      if (values.some((value) => value != null && value !== false && value !== "")) return true;
      return !!uiUnwrap(props.center);
    });
    const surfaceClasses = uiComputed([
      props.panel, props.color, props.clickable, props.border, props.glossy, props.glow,
      props.glass, props.shadow, props.outline, props.gradient, props.textGradient,
      props.lightShadow, props.radius
    ], () => {
      const active = !!(
        uiUnwrap(props.panel) || uiUnwrap(props.color) || uiUnwrap(props.clickable) ||
        uiUnwrap(props.border) || uiUnwrap(props.glossy) || uiUnwrap(props.glow) ||
        uiUnwrap(props.glass) || uiUnwrap(props.shadow) || uiUnwrap(props.outline) ||
        uiUnwrap(props.gradient) || uiUnwrap(props.textGradient) || uiUnwrap(props.lightShadow) ||
        uiUnwrap(props.radius)
      );
      return active ? ["cms-clear-set", "cms-singularity", "cms-grid-col-surface"] : [];
    });
    const cls = uiClass([
      "cms-grid-col",
      surfaceClasses,
      uiWhen(props.panel, "cms-grid-col-panel"),
      uiWhen(props.auto, "is-auto"),
      uiWhen(useStackLayout, "cms-grid-col-stack"),
      uiWhen(props.inline, "cms-grid-col-inline"),
      uiWhen(centerContent, "cms-grid-col-center"),
      props.class
    ]);

    const p = CMSwift.omit(props, [
      "span", "sm", "md", "lg", "auto",
      "row", "rowSpan", "area", "align", "justify", "place",
      "gap", "rowGap", "columnGap", "padding",
      "width", "height", "minHeight", "maxHeight", "fullHeight",
      "stack", "inline", "direction", "contentAlign", "contentJustify", "center", "scroll",
      "panel", "to",
      "start", "top", "header", "before", "startClass", "topClass", "headerClass",
      "body", "content", "bodyClass", "contentClass",
      "end", "bottom", "footer", "after", "endClass", "bottomClass", "footerClass",
      "slots", "style",
      "clickable", "dense", "flat", "border", "glossy", "glow", "glass", "shadow",
      "outline", "rounded", "gradient", "textGradient", "lightShadow", "color", "textColor",
      "size", "radius"
    ]);
    p.class = cls;

    if (uiUnwrap(props.auto) === true) style["--cms-grid-col-base"] = "auto";
    else if (span != null) style["--cms-grid-col-base"] = span;
    if (sm != null) style["--cms-grid-col-sm"] = sm;
    if (md != null) style["--cms-grid-col-md"] = md;
    if (lg != null) style["--cms-grid-col-lg"] = lg;
    if (rowSpan != null) style.gridRow = rowSpan;
    else if (row != null) style.gridRow = row;
    if (area != null) style.gridArea = area;
    if (align != null) style.alignSelf = align;
    if (justify != null) style.justifySelf = justify;
    if (place != null) style.placeSelf = place;
    if (gap != null) style.gap = gap;
    if (rowGap != null) style.rowGap = rowGap;
    if (columnGap != null) style.columnGap = columnGap;
    if (padding != null) style.padding = padding;
    if (width != null) style.width = width;
    if (fullHeight != null && fullHeight !== "") style.height = fullHeight;
    else if (height != null) style.height = height;
    if (minHeight != null) style.minHeight = minHeight;
    if (maxHeight != null) style.maxHeight = maxHeight;
    if (direction != null) style.flexDirection = direction;
    if (contentAlign != null) style.alignItems = contentAlign;
    else if (centerContent != null && centerContent !== "") style.alignItems = centerContent ? "center" : "";
    if (contentJustify != null) style.justifyContent = contentJustify;
    else if (centerContent != null && centerContent !== "") style.justifyContent = centerContent ? "center" : "";
    if (scroll != null && scroll !== "") style.overflow = scroll;
    if (Object.keys(style).length) p.style = style;

    const userOnClick = props.onClick;
    const userOnKeydown = props.onKeydown;
    const isInteractive = !!(uiUnwrap(props.clickable) || uiUnwrap(props.to));
    const onClick = (e) => {
      userOnClick?.(e);
      if (e.defaultPrevented) return;
      const to = uiUnwrap(props.to);
      if (to && CMSwift.router?.navigate) {
        e.preventDefault();
        CMSwift.router.navigate(to);
      }
    };
    const onKeydown = (e) => {
      userOnKeydown?.(e);
      if (e.defaultPrevented) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick(e);
      }
    };
    if (isInteractive) {
      p.onClick = onClick;
      p.onKeydown = onKeydown;
      if (p.tabIndex == null) p.tabIndex = 0;
      if (p.role == null) p.role = "button";
    }

    if (!hasStructuredContent) {
      const el = _.div(p, ...renderSlotToArray(slots, "default", ctx, children));
      setPropertyProps(el, props);
      return el;
    }

    const sectionStyle = {
      display: "flex",
      flexDirection: "column",
      gap: "inherit",
      minWidth: 0
    };
    const parts = [
      startNodes.length
        ? _.div({
          class: uiClass(["cms-grid-col-start", props.startClass, props.topClass, props.headerClass]),
          style: { ...sectionStyle }
        }, ...startNodes)
        : null,
      bodyNodes.length
        ? _.div({
          class: uiClass(["cms-grid-col-body", props.bodyClass, props.contentClass]),
          style: { ...sectionStyle, flex: "1 1 auto" }
        }, ...bodyNodes)
        : null,
      endNodes.length
        ? _.div({
          class: uiClass(["cms-grid-col-end", props.endClass, props.bottomClass, props.footerClass]),
          style: { ...sectionStyle }
        }, ...endNodes)
        : null
    ].filter(Boolean);

    const el = _.div(p, ...parts);
    setPropertyProps(el, props);
    return el;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.GridCol = {
      signature: "UI.GridCol(...children) | UI.GridCol(props, ...children)",
      props: {
        span: "number|string",
        sm: "number|string",
        md: "number|string",
        lg: "number|string",
        auto: "boolean",
        row: "number|string",
        rowSpan: "number|string",
        area: "string",
        align: "string (align-self)",
        justify: "string (justify-self)",
        place: "string (place-self)",
        gap: "string|number",
        rowGap: "string|number",
        columnGap: "string|number",
        padding: "string|number",
        width: "string|number",
        height: "string|number",
        minHeight: "string|number",
        maxHeight: "string|number",
        fullHeight: "boolean",
        stack: "boolean",
        inline: "boolean",
        direction: "column|row|string",
        contentAlign: "string",
        contentJustify: "string",
        center: "boolean",
        scroll: "boolean|string",
        panel: "boolean",
        clickable: "boolean",
        to: "string",
        start: "Node|Function|Array",
        body: "Node|Function|Array",
        end: "Node|Function|Array",
        color: "string",
        outline: "boolean",
        shadow: "boolean|string",
        radius: "number|string",
        slots: "{ start?, body?, end?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        start: "Top/header region",
        body: "Main body region",
        end: "Bottom/footer region",
        default: "Fallback content"
      },
      events: {
        onClick: "MouseEvent",
        onKeydown: "KeyboardEvent"
      },
      returns: "HTMLDivElement",
      description: "Item per CSS Grid con span responsive, layout interno opzionale a stack, regioni start/body/end e varianti visuali leggere."
    };
  }
  // Esempio: CMSwift.ui.GridCol({ span: 6, sm: 12 }, "Colonna")


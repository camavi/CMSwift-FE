// ===============================
// CMSwift UI Kit MVP
// ===============================
(function initCMSwiftUI(app) {
  app.ui = app.ui || {};
  app.services = app.services || {};
  app.services.notify = app.services.notify || {};

  const uiRodPathRaw = Symbol("cms.ui.rodPathRaw");
  const uiRodPathEnhanced = Symbol("cms.ui.rodPathEnhanced");
  const uiRodPathPatchedH = Symbol("cms.ui.rodPathPatchedH");
  const uiRodPathWrappedUI = Symbol("cms.ui.rodPathWrappedUI");
  const uiRodPathAccess = new WeakMap();
  const uiRodPathProxyCache = new WeakMap();
  const uiRodPathReadBuffer = [];
  const uiIsIndexKey = (key) => {
    if (typeof key === "number") return Number.isInteger(key) && key >= 0;
    if (typeof key !== "string" || key === "") return false;
    if (key[0] === "-" || key.includes(".")) return false;
    const num = Number(key);
    return Number.isInteger(num) && num >= 0 && String(num) === key;
  };
  const uiTrackablePrimitive = (v) => {
    const t = typeof v;
    return t === "string" || t === "number" || t === "boolean" || t === "bigint";
  };
  const uiIsPlainObject = (v) => {
    if (!v || typeof v !== "object") return false;
    const p = Object.getPrototypeOf(v);
    return p === Object.prototype || p === null;
  };
  let uiRodPathReadFlushQueued = false;
  const uiScheduleRodPathReadFlush = () => {
    if (uiRodPathReadFlushQueued) return;
    uiRodPathReadFlushQueued = true;
    queueMicrotask(() => {
      uiRodPathReadFlushQueued = false;
      uiRodPathReadBuffer.length = 0;
    });
  };
  const uiPushRodPathRead = (entry) => {
    uiRodPathReadBuffer.push(entry);
    if (uiRodPathReadBuffer.length > 128) {
      uiRodPathReadBuffer.splice(0, uiRodPathReadBuffer.length - 128);
    }
    uiScheduleRodPathReadFlush();
  };
  const uiCreateRodPathCursor = () => {
    if (!uiRodPathReadBuffer.length) return null;
    const items = uiRodPathReadBuffer.slice();
    uiRodPathReadBuffer.length = 0;
    return { items, index: 0 };
  };
  const uiTakeRodPathMatch = (cursor, value) => {
    if (!cursor) return null;
    const entry = cursor.items[cursor.index];
    if (!entry) return null;
    if (!Object.is(entry.value, value)) return null;
    cursor.index += 1;
    return entry;
  };
  const uiUnwrapRodPathValue = (v) => {
    if (v && typeof v === "object" && v[uiRodPathRaw]) return v[uiRodPathRaw];
    return v;
  };
  const uiReadRodPath = (rod, path) => {
    const access = uiRodPathAccess.get(rod);
    if (!access) return undefined;
    let cur = access.rawGet();
    for (const key of path) {
      if (cur == null) return undefined;
      cur = cur[key];
    }
    return cur;
  };
  const uiWriteRodPath = (rod, path, nextValue) => {
    const access = uiRodPathAccess.get(rod);
    if (!access) return;
    const unwrapped = uiUnwrapRodPathValue(nextValue);
    if (!path.length) {
      if (Object.is(access.rawGet(), unwrapped)) return;
      access.rawSet(unwrapped);
      return;
    }
    let root = access.rawGet();
    if (!root || typeof root !== "object") {
      root = uiIsIndexKey(path[0]) ? [] : {};
    }
    let cur = root;
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      let child = cur[key];
      if (!child || typeof child !== "object") {
        const nextKey = path[i + 1];
        child = uiIsIndexKey(nextKey) ? [] : {};
        cur[key] = child;
      }
      cur = child;
    }
    if (Object.is(cur[path[path.length - 1]], unwrapped)) return;
    cur[path[path.length - 1]] = unwrapped;
    access.rawSet(root);
  };
  const uiCreateRodPathModel = (rod, path) => [
    () => uiReadRodPath(rod, path),
    (nextValue) => uiWriteRodPath(rod, path, nextValue)
  ];
  const uiCreateRodPathProxy = (rod, target, path = []) => {
    if (!target || typeof target !== "object") return target;
    let byTarget = uiRodPathProxyCache.get(rod);
    if (!byTarget) {
      byTarget = new WeakMap();
      uiRodPathProxyCache.set(rod, byTarget);
    }
    const cached = byTarget.get(target);
    if (cached) return cached;
    const proxy = new Proxy(target, {
      get(obj, prop, receiver) {
        if (prop === uiRodPathRaw) return obj;
        const value = Reflect.get(obj, prop, receiver);
        if (typeof prop === "symbol") return value;
        const nextPath = path.concat(prop);
        if (value && typeof value === "object") {
          return uiCreateRodPathProxy(rod, value, nextPath);
        }
        if (typeof value === "function") {
          return value.bind(receiver);
        }
        if (uiTrackablePrimitive(value)) {
          uiPushRodPathRead({ rod, path: nextPath, value });
        }
        return value;
      },
      set(obj, prop, value, receiver) {
        const nextValue = uiUnwrapRodPathValue(value);
        const prevValue = Reflect.get(obj, prop, receiver);
        if (Object.is(prevValue, nextValue)) return true;
        const ok = Reflect.set(obj, prop, nextValue, receiver);
        if (ok) {
          const access = uiRodPathAccess.get(rod);
          access?.rawSet(access.rawGet());
        }
        return ok;
      },
      deleteProperty(obj, prop) {
        const hadKey = Reflect.has(obj, prop);
        const ok = Reflect.deleteProperty(obj, prop);
        if (ok && hadKey) {
          const access = uiRodPathAccess.get(rod);
          access?.rawSet(access.rawGet());
        }
        return ok;
      }
    });
    byTarget.set(target, proxy);
    return proxy;
  };
  const uiEnhanceRodPath = (rod) => {
    if (!rod || typeof rod !== "object" || rod.type !== "rod" || rod[uiRodPathEnhanced]) return rod;
    const desc = Object.getOwnPropertyDescriptor(rod, "value");
    if (!desc || typeof desc.get !== "function" || typeof desc.set !== "function") return rod;
    const rawGet = () => desc.get.call(rod);
    const rawSet = (v) => desc.set.call(rod, uiUnwrapRodPathValue(v));
    uiRodPathAccess.set(rod, { rawGet, rawSet });
    Object.defineProperty(rod, "value", {
      get() {
        const raw = rawGet();
        if (!raw || typeof raw !== "object") return raw;
        return uiCreateRodPathProxy(rod, raw, []);
      },
      set(v) {
        rawSet(v);
      },
      configurable: true
    });
    Object.defineProperty(rod, uiRodPathEnhanced, { value: true, configurable: false });
    return rod;
  };
  const uiPatchRodFactory = () => {
    if (typeof window._.rod !== "function" || window._.rod[uiRodPathEnhanced]) return;
    const baseRod = window._.rod;
    const patchedRod = function patchedRod(...args) {
      return uiEnhanceRodPath(baseRod(...args));
    };
    Object.defineProperty(patchedRod, uiRodPathEnhanced, { value: true, configurable: false });
    window._.rod = patchedRod;
  };
  const uiPatchValueForH = (value, cursor, keyHint = "") => {
    if (Array.isArray(value)) {
      let changed = false;
      const next = value.map((item) => {
        const out = uiPatchValueForH(item, cursor, "");
        if (out !== item) changed = true;
        return out;
      });
      return changed ? next : value;
    }
    if (uiTrackablePrimitive(value)) {
      const entry = uiTakeRodPathMatch(cursor, value);
      if (!entry) return value;
      if (keyHint === "model") return uiCreateRodPathModel(entry.rod, entry.path);
      return () => uiReadRodPath(entry.rod, entry.path);
    }
    if (!uiIsPlainObject(value)) return value;
    let changed = false;
    const out = {};
    for (const key of Object.keys(value)) {
      const next = uiPatchValueForH(value[key], cursor, key);
      out[key] = next;
      if (next !== value[key]) changed = true;
    }
    return changed ? out : value;
  };
  const uiPatchValueForUI = (value, cursor, keyHint = "") => {
    if (Array.isArray(value)) {
      let changed = false;
      const next = value.map((item) => {
        const out = uiPatchValueForUI(item, cursor, "");
        if (out !== item) changed = true;
        return out;
      });
      return changed ? next : value;
    }
    if (uiTrackablePrimitive(value)) {
      const entry = uiTakeRodPathMatch(cursor, value);
      if (!entry) return value;
      if (keyHint === "model") return uiCreateRodPathModel(entry.rod, entry.path);
      return () => uiReadRodPath(entry.rod, entry.path);
    }
    if (!uiIsPlainObject(value)) return value;
    let changed = false;
    const out = {};
    for (const key of Object.keys(value)) {
      const shouldPatch = key === "model" || key === "children";
      const next = shouldPatch ? uiPatchValueForUI(value[key], cursor, key) : value[key];
      out[key] = next;
      if (next !== value[key]) changed = true;
    }
    return changed ? out : value;
  };
  const uiWrapUIFunction = (fn) => {
    if (typeof fn !== "function" || fn[uiRodPathWrappedUI]) return fn;
    const wrapped = function uiWrappedComponent(...args) {
      const cursor = uiCreateRodPathCursor();
      if (!cursor) return fn.apply(this, args);
      let changed = false;
      const patchedArgs = args.map((arg) => {
        const out = uiPatchValueForUI(arg, cursor, "");
        if (out !== arg) changed = true;
        return out;
      });
      return fn.apply(this, changed ? patchedArgs : args);
    };
    Object.defineProperty(wrapped, uiRodPathWrappedUI, { value: true, configurable: false });
    return wrapped;
  };
  const uiInstallUIProxy = () => {
    const uiTarget = app.ui;
    if (!uiTarget || uiTarget[uiRodPathWrappedUI]) return;
    Object.defineProperty(uiTarget, uiRodPathWrappedUI, { value: true, configurable: false });
    for (const key of Object.keys(uiTarget)) {
      if (typeof uiTarget[key] === "function") {
        uiTarget[key] = uiWrapUIFunction(uiTarget[key]);
      }
    }
    app.ui = new Proxy(uiTarget, {
      get(target, prop, receiver) {
        return Reflect.get(target, prop, receiver);
      },
      set(target, prop, value, receiver) {
        const next = typeof value === "function" ? uiWrapUIFunction(value) : value;
        return Reflect.set(target, prop, next, receiver);
      }
    });
  };
  const uiPatchHyperscript = () => {
    if (!window._ || window._[uiRodPathPatchedH]) return;
    Object.defineProperty(window._, uiRodPathPatchedH, { value: true, configurable: false });
    for (const key of Object.keys(window._)) {
      const base = window._[key];
      if (typeof base !== "function") continue;
      window._[key] = function uiWrappedHyperscript(...args) {
        const cursor = uiCreateRodPathCursor();
        if (!cursor) return base.apply(this, args);
        let changed = false;
        const patchedArgs = args.map((arg) => {
          const out = uiPatchValueForH(arg, cursor, "");
          if (out !== arg) changed = true;
          return out;
        });
        return base.apply(this, changed ? patchedArgs : args);
      };
    }
  };

  uiPatchRodFactory();
  if (CMSwift.rod?._all instanceof Set) {
    CMSwift.rod._all.forEach((rod) => uiEnhanceRodPath(rod));
  }
  uiPatchHyperscript();
  uiInstallUIProxy();

  const UI_STATE_ALIASES = {
    error: "danger",
    danger: "danger",
    warn: "warning",
    warning: "warning",
    success: "success",
    info: "info",
    primary: "primary",
    secondary: "secondary",
    light: "light",
    dark: "dark"
  };
  const UI_STATE_TOKENS = new Set(Object.values(UI_STATE_ALIASES));
  const UI_RADIUS_TOKENS = new Set(["none", "xxs", "xs", "sm", "md", "lg", "xl", "xxl", "xxxl", "full"]);
  const UI_SHADOW_TOKENS = new Set(["none", "sm", "md", "lg"]);
  const sizeMap = {
    xxs: { font: "9px", pad: "2px 5px" },
    xs: { font: "10px", pad: "2px 6px" },
    sm: { font: "11px", pad: "2px 7px" },
    md: { font: "12px", pad: "2px 8px" },
    lg: { font: "13px", pad: "3px 10px" },
    xl: { font: "14px", pad: "4px 12px" },
    xxl: { font: "15px", pad: "5px 14px" },
    xxxl: { font: "16px", pad: "6px 16px" }
  };

  // normalize color is RGB | RGBA | HEX | color name
  const isTokenCSS = (value) => {
    // se la parola contiene un trattino - è un token
    if (value.indexOf("-") > -1) return true;
  }
  const normalizeState = (value) => {
    if (!value) return "";
    const key = String(value).toLowerCase();
    return UI_STATE_ALIASES[key] || "";
  };

  const normalizeRadius = (value) => {
    if (value == null) return null;
    const key = String(value).toLowerCase();
    if (key === "full") return "xxxl";
    if (UI_RADIUS_TOKENS.has(key)) return key;
    return null;
  };

  const normalizeShadow = (value) => {
    if (value === true) return "sm";
    if (value == null || value === false) return null;
    const key = String(value).toLowerCase();
    if (UI_SHADOW_TOKENS.has(key)) return key;
    return null;
  };

  const applyCommonProps = (props = {}) => {
    const classTokens = [];
    const style = {};

    classTokens.push(
      uiWhen(props.clickable, "cms-clickable"),
      uiWhen(props.dense, "cms-dense"),
      uiWhen(props.flat, "cms-flat"),
      uiWhen(props.border, "cms-border"),
      uiWhen(props.glossy, "cms-glossy"),
      uiWhen(props.glow, "cms-glow"),
      uiWhen(props.glass, "cms-glass"),
      uiWhen(props.shadow, "cms-shadow"),
      uiWhen(props.outline, "cms-outline"),
      uiWhen(props.rounded, "cms-rounded"),
      uiWhen(props.gradient, "cms-gradient"),
      uiWhen(props.textGradient, "cms-text-gradient"),
      uiWhen(props.lightShadow, "cms-light-shadow")
    );

    if (uiIsReactive(props.color)) {
      classTokens.push(() => {
        const v = uiUnwrap(props.color);
        const state = normalizeState(v);
        return state ? `cms-state-${state}` : "";
      });
      style.backgroundColor = () => {
        const v = uiUnwrap(props.color);
        const state = normalizeState(v);
        if (state) return "";
        if (v && isTokenCSS(String(v))) return `var(--cms-${v})`;
        return v || "";
      };
    } else {
      const state = normalizeState(props.color);
      if (state) {
        classTokens.push(`cms-state-${state}`);
      } else if (props.color && isTokenCSS(props.color)) {
        style.backgroundColor = `var(--cms-${props.color})`;
      } else if (props.color) {
        style.backgroundColor = props.color;
      }
    }

    // facciamo text color per i token
    if (uiIsReactive(props.textColor)) {
      style.color = () => {
        const v = uiUnwrap(props.textColor);
        if (v && isTokenCSS(String(v))) return `var(--cms-${v})`;
        return v || "";
      };
    } else if (props.textColor && isTokenCSS(props.textColor)) {
      style.color = `var(--cms-${props.textColor})`;
    } else if (props.textColor) {
      style.color = props.textColor;
    }

    if (uiIsReactive(props.size)) {
      classTokens.push(() => {
        const v = uiUnwrap(props.size);
        if (typeof v === "string" && CMSwift.uiSizes?.includes(v)) return `cms-size-${v}`;
        return "";
      });
    } else {
      const size = props.size;
      if (typeof size === "string" && CMSwift.uiSizes?.includes(size)) {
        classTokens.push(`cms-size-${size}`);
      }
    }

    if (uiIsReactive(props.shadow)) {
      classTokens.push(() => {
        const v = uiUnwrap(props.shadow);
        const shadow = normalizeShadow(v);
        return shadow ? `cms-shadow-${shadow}` : "";
      });
      style.boxShadow = () => {
        const v = uiUnwrap(props.shadow);
        const shadow = normalizeShadow(v);
        if (shadow || v == null || v === false) return "";
        return typeof v === "string" ? v : "";
      };
    } else {
      const shadow = normalizeShadow(props.shadow);
      if (shadow) classTokens.push(`cms-shadow-${shadow}`);
      else if (props.shadow && typeof props.shadow === "string") {
        style.boxShadow = props.shadow;
      }
    }

    if (classTokens.length) {
      props.class = uiClass([props.class, ...classTokens]);
    }
    if (Object.keys(style).length) {
      props.style = { ...style, ...(props.style || {}) };
    }
  };

  const normalizeArgsBase = CMSwift.uiNormalizeArgs;
  CMSwift.uiNormalizeArgs = function (args) {
    const out = normalizeArgsBase(args);
    const props = out.props || {};
    if (props && Object.prototype.hasOwnProperty.call(props, "children")) {
      const propChildren = props.children;
      if (!out.children || out.children.length === 0) {
        out.children = Array.isArray(propChildren) ? propChildren : [propChildren];
      }
      delete props.children;
    }
    applyCommonProps(props);
    return out;
  };

  // --------------------------------
  // 2) UI PRIMITIVES (layout + atoms)
  // --------------------------------
  const UI = window._;

  /*
  UI.Row
  UI.Col
  UI.Spacer
  UI.Container
  UI.Card
  UI.Btn
  UI.Input
  UI.Select
  UI.Layout
  UI.Footer
  UI.Toolbar
  UI.Grid
  UI.GridCol
  UI.Icon
  UI.Badge
  UI.Avatar
  UI.Chip
  UI.Tooltip
  UI.List
  UI.Item
  UI.Separator
  UI.Checkbox
  UI.Radio
  UI.Toggle
  UI.Slider
  UI.Rating
  UI.Date
  UI.Time
  UI.Tabs
  UI.RouteTab
  UI.Breadcrumbs
  UI.Pagination
  UI.Spinner
  UI.Progress
  UI.LoadingBar
  UI.Banner
  UI.Header
  UI.Drawer
  UI.Page
  UI.AppShell
  UI.Parallax
  */

  const META_PROP_DESCRIPTIONS = {
    actions: "Content rendered in the action area, typically in a footer or trailing region.",
    active: "Marks the item as active/selected and applies active styling/ARIA when relevant.",
    align: "Alignment of content along the cross axis (e.g. left/center/right).",
    allowCustom: "Allows values not present in the options list.",
    allowCustomValue: "Accepts free-form values in addition to predefined options.",
    aside: "Content or configuration for the aside/secondary region.",
    auto: "Enables automatic sizing or layout behavior instead of fixed sizing.",
    autocomplete: "Native autocomplete attribute for input elements.",
    backdrop: "Whether to render a backdrop overlay behind the component.",
    bgClass: "Additional CSS classes applied to the background layer.",
    bgPosition: "CSS background-position value for the background image/layer.",
    bgSize: "CSS background-size value for the background image/layer.",
    cardClass: "Additional CSS classes applied to the card container.",
    checked: "Checked state for toggleable controls (controlled).",
    class: "Additional CSS classes applied to the component root element.",
    clearable: "Shows a clear action to reset the current value.",
    clickable: "Enables pointer/hover styles and click handling on the component.",
    closeOnEsc: "Closes the component when the Escape key is pressed.",
    closeOnOutside: "Closes the component when clicking outside its bounds.",
    closeOnSelect: "Closes the menu/popover after selecting an item.",
    color: "Semantic color name used to style the component.",
    cols: "Number of columns for grid layouts.",
    columns: "Column definitions for table-like components.",
    content: "Main content node(s) or render function for the component body.",
    contentClass: "Additional CSS classes applied to the content container.",
    control: "Custom control element or render function for the input area.",
    children: "Default child content (nodes, arrays, or render function).",
    delay: "Delay in milliseconds before showing or hiding.",
    dense: "Uses compact spacing and sizing.",
    disabled: "Disables interaction and applies disabled styling/ARIA.",
    divider: "Shows dividers between items or sections.",
    drawer: "Content or configuration for the drawer region.",
    drawerBreakpoint: "Viewport width where the drawer switches behavior (overlay vs persistent).",
    drawerCloseIcon: "Icon used for the drawer close control.",
    drawerOpen: "Controls whether the drawer is open (controlled).",
    drawerOpenIcon: "Icon used for the drawer open control.",
    drawerStateKey: "Storage key used to persist drawer open state.",
    drawerWidth: "Drawer width (number interpreted as px or CSS length).",
    elevated: "Applies elevated shadow/raised styling.",
    emptyText: "Text shown when there is no data to display.",
    error: "Error state or message displayed with the component.",
    escClose: "Alias for close-on-escape behavior.",
    filterPlaceholder: "Placeholder text for the filter/search input.",
    filterable: "Enables filtering UI for option lists.",
    flat: "Removes elevation/border for a flat look.",
    footer: "Footer content node(s) or render function.",
    form: "HTML form attribute to associate controls with a form.",
    gap: "Gap/spacing between child elements.",
    getValue: "Function to extract a value from an item object.",
    groupCloseIcon: "Icon used to collapse grouped items.",
    groupOpenIcon: "Icon used to expand grouped items.",
    header: "Header content node(s) or render function.",
    height: "Explicit height (number interpreted as px or CSS length).",
    hint: "Helper text shown near the control.",
    icon: "Icon name or node rendered with the component.",
    iconRight: "Icon name or node rendered on the right side of the component.",
    iconAlign: "Position of the icon relative to the label.",
    initialSort: "Initial sort configuration for table data.",
    inputmode: "Native inputmode attribute hint for virtual keyboards.",
    items: "Array of items or nodes to render.",
    justify: "Justification of items along the main axis.",
    label: "Label text or node for the component.",
    left: "Content or configuration for the left region.",
    lg: "Column span at large breakpoint.",
    loading: "Shows loading state and disables interactions where appropriate.",
    loadingText: "Text displayed while loading.",
    lockScroll: "Prevents body scroll while an overlay is open.",
    max: "Maximum value for range-based controls.",
    md: "Column span at medium breakpoint.",
    message: "Message text shown in banners/alerts.",
    min: "Minimum value for range-based controls.",
    model: "Two-way bound value (alias to value in some components).",
    multi: "Enables multi-selection behavior.",
    multiple: "Allows selecting multiple values.",
    name: "HTML name attribute for form submission.",
    noDrawer: "Disables rendering of the drawer region.",
    note: "Secondary note text.",
    number: "Forces numeric input/formatting where supported.",
    offset: "General offset for positioning.",
    offsetX: "Horizontal offset for overlay placement in pixels.",
    offsetY: "Vertical offset for overlay placement in pixels.",
    onBlur: "Callback fired when the control loses focus.",
    onChange: "Callback fired when the value or selection changes.",
    onClear: "Callback fired when the clear action is used.",
    onClose: "Callback fired when the component closes.",
    onFocus: "Callback fired when the control gains focus.",
    onInput: "Callback fired on input events or while typing.",
    onOpen: "Callback fired when the component opens.",
    onRemove: "Callback fired when an item is removed.",
    onSubmit: "Callback fired when a form is submitted.",
    open: "Controls open/visible state (controlled).",
    options: "Array of selectable options or option groups.",
    outline: "Uses outlined visual style.",
    overlay: "Renders content in an overlay layer or portal.",
    overlayClose: "Closes the overlay when the backdrop is clicked.",
    page: "Current page index (1-based unless documented otherwise).",
    pageSize: "Number of items per page.",
    persistent: "Prevents closing via outside click or Escape.",
    placeholder: "Placeholder text for inputs.",
    placement: "Overlay placement relative to the target/anchor.",
    prefix: "Content rendered before the main control.",
    readonly: "Prevents editing while keeping focus and selection.",
    removable: "Shows a remove affordance for chips/items.",
    right: "Content or configuration for the right region.",
    rowKey: "Key or function used to derive unique row IDs.",
    rows: "Row data array for table-like components.",
    radius: "Border radius token or CSS length applied to the component.",
    borderRadius: "Border radius token or CSS length applied to the component.",
    separator: "Separator string/node between items.",
    showLabel: "Whether to render the label text.",
    size: "Size token, number, or CSS length for sizing.",
    slots: "Named slots map for render overrides.",
    sm: "Column span at small breakpoint.",
    span: "Column span within a grid.",
    speed: "Animation speed or duration in milliseconds.",
    square: "Use square corners instead of rounded.",
    src: "Image source URL.",
    startTop: "Starting scroll offset for parallax effects.",
    stateKey: "Storage key used to persist component state.",
    step: "Step increment for numeric controls.",
    sticky: "Makes the component sticky within its container.",
    stickyAside: "Keeps the aside region sticky during scroll.",
    stickyFooter: "Keeps the footer region sticky during scroll.",
    stickyHeader: "Keeps the header region sticky during scroll.",
    striped: "Applies striped row styling.",
    style: "Inline styles applied to the component root element.",
    subtitle: "Subtitle text or node.",
    success: "Marks the component with success state styling.",
    suffix: "Content rendered after the main control.",
    tableClass: "Additional CSS classes applied to the table element.",
    tabs: "Tab definitions array.",
    tagPage: "Query parameter name used to read/write the current page.",
    target: "Target element or anchor used for positioning.",
    text: "Text content for simple components.",
    thickness: "Stroke/line thickness for progress indicators.",
    title: "Title text or node.",
    to: "Navigation target/route to open on click.",
    topLabel: "Label displayed above the control.",
    trapFocus: "Keeps focus trapped inside the dialog/popover.",
    type: "Variant or native input type.",
    value: "Current value (controlled).",
    vertical: "Vertical orientation instead of horizontal.",
    warning: "Marks the component with warning state styling.",
    width: "Explicit width (number interpreted as px or CSS length).",
    wrap: "Allows children to wrap to new lines.",
    wrapClass: "Additional CSS classes applied to the outer wrapper.",
    zIndex: "z-index for overlay stacking.",
    shadow: "Shadow token or CSS box-shadow string applied to the component.",
  };

  const META_SLOT_DESCRIPTIONS = {
    actions: "Slot for action buttons or links.",
    arrow: "Slot for the tooltip/popover arrow element.",
    aside: "Slot for aside/secondary content.",
    center: "Slot for centered content within a toolbar/row.",
    clear: "Slot for the clear control/content.",
    content: "Slot for the main body content.",
    control: "Slot for custom control/input rendering.",
    default: "Primary content for the component.",
    drawer: "Slot for drawer content.",
    empty: "Slot for empty-state content.",
    errorMessage: "Slot for custom error message rendering.",
    filter: "Slot for custom filter/search UI.",
    footer: "Slot for footer content.",
    group: "Slot for grouped content container.",
    groupLabel: "Slot for group label content.",
    header: "Slot for header content.",
    hint: "Slot for helper/hint text.",
    icon: "Slot for icon content.",
    iconRight: "Slot for right-aligned icon content.",
    input: "Slot for custom input element/content.",
    item: "Slot for custom item rendering.",
    itemLabel: "Slot for item label rendering.",
    label: "Slot for label content.",
    left: "Slot for left-aligned content.",
    loading: "Slot for loading state content.",
    message: "Slot for message/alert content.",
    next: "Slot for the next-page control.",
    note: "Slot for note/secondary text.",
    option: "Slot for custom option rendering.",
    page: "Slot for page indicator/content.",
    prefix: "Slot for prefix content.",
    prev: "Slot for the previous-page control.",
    right: "Slot for right-aligned content.",
    separator: "Slot for separator rendering between items.",
    star: "Slot for custom star icon/content in rating.",
    subtitle: "Slot for subtitle content.",
    success: "Slot for success message/content.",
    suffix: "Slot for suffix content.",
    tab: "Slot for custom tab label/content.",
    target: "Slot for custom target/anchor element.",
    title: "Slot for title content.",
    topLabel: "Slot for top label content.",
    warning: "Slot for warning message/content."
  };

  const META_PROP_DEFAULTS = {
    dense: false,
    disabled: false,
    readonly: false,
    outline: false,
    clickable: false,
    flat: false,
    elevated: false
  };
  const DEFAULT_SIZE = [...CMSwift.uiSizes];
  const DEFAULT_COLOR = [...CMSwift.uiColors];
  const META_PROP_VALUES = {
    size: ["number", "CSS units", ...DEFAULT_SIZE],
    color: DEFAULT_COLOR,
    iconAlign: ["left", "right", "before", "after"],
    align: ["left", "center", "right"],
    justify: ["start", "center", "end", "space-between", "space-around", "space-evenly"],
    placement: ["top", "bottom", "left", "right", "top-start", "top-end", "bottom-start", "bottom-end"],
    type: DEFAULT_COLOR,
    shadow: ["none", ...DEFAULT_SIZE],
    outline: ["number", "CSS units", ...DEFAULT_SIZE],
    borderRadius: ["number", "CSS units", ...DEFAULT_SIZE],
    radius: ["number", "CSS units", ...DEFAULT_SIZE],
    icon: ["#name_tabler", "name_material", "class"],
    iconRight: ["#name_tabler", "name_material", "class"]
  };

  const META_PROP_CATEGORIES = {
    class: "style",
    style: "style",
    size: "style",
    color: "style",
    outline: "style",
    shadow: "style",
    borderRadius: "style",
    radius: "style",
    dense: "layout",
    flat: "style",
    elevated: "style",
    clickable: "behavior",
    disabled: "state",
    readonly: "state",
    loading: "state",
    active: "state",
    error: "state",
    success: "state",
    warning: "state",
    note: "state",
    hint: "state",
    value: "data",
    model: "data",
    items: "data",
    options: "data",
    rows: "data",
    columns: "data",
    onClick: "events",
    onChange: "events",
    onInput: "events",
    onFocus: "events",
    onBlur: "events",
    onSubmit: "events"
  };

  const normalizeMetaType = (value) => {
    if (typeof value === "string") return value;
    if (!value || typeof value !== "object" || Array.isArray(value)) return "unknown";
    return value.type || value.signature || value.value || "unknown";
  };

  const fallbackMetaDescription = (name, kind) => {
    if (kind === "slot") {
      return `Slot content for "${name}". Accepts nodes, arrays, or render functions.`;
    }
    return `Component configuration for "${name}". When not handled internally, it is forwarded to the root element.`;
  };

  const normalizeMetaFields = (fields, descriptions, kind) => {
    if (!fields || typeof fields !== "object") return fields;
    const out = {};
    for (const [name, value] of Object.entries(fields)) {
      const description = descriptions[name] || fallbackMetaDescription(name, kind);
      if (value && typeof value === "object" && !Array.isArray(value)) {
        const type = normalizeMetaType(value);
        out[name] = {
          ...value,
          type,
          description: value.description || description,
          default: Object.prototype.hasOwnProperty.call(value, "default") ? value.default : (META_PROP_DEFAULTS[name] ?? null),
          values: value.values || META_PROP_VALUES[name] || null,
          category: value.category || META_PROP_CATEGORIES[name] || (kind === "slot" ? "slot" : "general")
        };
      } else {
        const type = normalizeMetaType(value);
        out[name] = {
          type,
          description,
          default: META_PROP_DEFAULTS[name] ?? null,
          values: META_PROP_VALUES[name] || null,
          category: META_PROP_CATEGORIES[name] || (kind === "slot" ? "slot" : "general")
        };
      }
    }
    return out;
  };

  const normalizeMetaEntry = (componentName, meta) => {
    if (!meta || typeof meta !== "object") return meta;
    if (!meta.props || typeof meta.props !== "object" || Array.isArray(meta.props)) {
      meta.props = meta.props && typeof meta.props === "object" && !Array.isArray(meta.props) ? meta.props : {};
    }
    if (!Object.prototype.hasOwnProperty.call(meta.props, "children")) {
      meta.props.children = "Node|Array|Function";
    }
    const commonProps = {
      size: meta.props.size || "string|number",
      color: meta.props.color || "string",
      outline: meta.props.outline || "boolean",
      clickable: meta.props.clickable || "boolean",
      radius: meta.props.radius || "string|number",
      borderRadius: meta.props.borderRadius || "string|number",
      shadow: meta.props.shadow || "string|boolean",
      class: meta.props.class || "string",
      style: meta.props.style || "object"
    };
    meta.props = { ...commonProps, ...meta.props };
    if (meta.props.icon && !meta.props.iconRight) {
      meta.props.iconRight = meta.props.icon;
    }
    if (meta.props) meta.props = normalizeMetaFields(meta.props, META_PROP_DESCRIPTIONS, "prop");
    if (meta.slots) meta.slots = normalizeMetaFields(meta.slots, META_SLOT_DESCRIPTIONS, "slot");
    if (meta.slots && meta.slots.icon && !meta.slots.iconRight) {
      meta.slots.iconRight = { type: meta.slots.icon?.type || "Node|Array|Function", description: "Slot for right-aligned icon content." };
    }
    if (!meta.description) {
      meta.description = `${componentName} component meta definition.`;
    }
    return meta;
  };

  const ensureMetaProxy = () => {
    if (app.ui._metaProxyInstalled) return;
    app.ui._metaProxyInstalled = true;
    const target = app.ui.meta || {};
    for (const key of Object.keys(target)) {
      normalizeMetaEntry(key, target[key]);
    }
    const proxy = new Proxy(target, {
      set(obj, prop, value) {
        if (typeof prop === "symbol") {
          obj[prop] = value;
          return true;
        }
        obj[prop] = normalizeMetaEntry(prop, value);
        return true;
      }
    });
    app.ui.meta = proxy;
    UI.meta = proxy;
  };

  if (app.isDev?.()) {
    ensureMetaProxy();
  }

  function flattenSlotValue(value) {
    if (!value) return null;
    if (!Array.isArray(value)) return value;
    const out = [];
    const stack = value.slice();
    while (stack.length) {
      const item = stack.shift();
      if (!item) continue;
      if (Array.isArray(item)) stack.unshift(...item);
      else out.push(item);
    }
    return out.length ? out : null;
  }
  function setPropertyProps(obj, props) {
    if (props.size) {
      if (typeof props.size === "number") {
        obj.style.setProperty("--cms-font-size", `${props.size}px`);
      } else if (CMSwift.uiSizes.includes(props.size)) {
        obj.style.setProperty("--cms-font-size", `var(--cms-font-size-${props.size})`);
      }
    }

    // gradient
    if (props.gradient) {
      if (typeof props.gradient == "number") {
        obj.style.setProperty("--set-gradient-deg", `${props.gradient}deg`);
      }
    }
    // radius
    if (props.radius) {
      if (typeof props.radius == "number") {
        obj.style.setProperty("--set-border-radius", `${props.radius}px`);
      } else if (CMSwift.uiSizes.includes(props.radius)) {
        obj.style.setProperty("--set-border-radius", `var(--cms-r-${props.radius})`);
      } else {
        obj.style.setProperty("--set-border-radius", `${props.radius}`);
      }
    }

  }

  function uiOptionNode(props = {}, ...children) {
    const el = document.createElement("option");
    if (props && typeof props === "object") {
      if (props.value != null) el.value = String(props.value);
      if (props.label != null) el.label = String(props.label);
      if (props.disabled != null) el.disabled = !!props.disabled;
      if (props.selected != null) el.selected = !!props.selected;
      if (props.class != null) el.className = String(props.class);
    }
    const content = children.flat ? children.flat(Infinity) : children;
    if (content.length) {
      content.forEach((child) => {
        if (child == null || child === false) return;
        if (child instanceof Node) el.appendChild(child);
        else el.appendChild(document.createTextNode(String(child)));
      });
    } else if (props && props.text != null) {
      el.textContent = String(props.text);
    }
    return el;
  }

  CMSwift.ui.getSlot = (slots, name) => {
    if (!slots) return null;
    return Object.prototype.hasOwnProperty.call(slots, name) ? slots[name] : null;
  };

  CMSwift.ui.renderSlot = (slots, name, ctx, fallback) => {
    const slot = CMSwift.ui.getSlot(slots, name);
    const hasSlot = slot !== null && slot !== undefined;
    const raw = hasSlot ? (typeof slot === "function" ? slot(ctx || {}) : slot) : fallback;
    if (raw == null) return null;
    return flattenSlotValue(CMSwift.ui.slot(raw));
  };

  const renderSlotToArray = (slots, name, ctx, fallback) => {
    const v = CMSwift.ui.renderSlot(slots, name, ctx, fallback);
    if (!v) return [];
    return Array.isArray(v) ? v : [v];
  };

  const unitCover = (v, name = 'size') => {
    if (typeof v === "number") return v + "px";
    if (CMSwift.uiSizes.includes(v)) return `var(--cms-${name}-${v})`;
    if (typeof v === "string") return v;
    return v;
  };

  UI.Row = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const p = CMSwift.omit(props, ["slots"]);
    p.class = uiClass(["cms-row", props.class]);
    const content = renderSlotToArray(slots, "default", {}, children);
    return _.div(p, ...content);
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Row = {
      signature: "UI.Row(...children) | UI.Row(props, ...children)",
      props: {
        slots: "{ default?: Slot }",
        class: "string",
        style: "object"
      },
      slots: {
        default: "Row content"
      },
      returns: "HTMLDivElement",
      description: "Row layout wrapper."
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
    try {
      const { props, children } = CMSwift.uiNormalizeArgs(args);
      const slots = props.slots || {};
      const style = { ...(props.style || {}) };
      const colClass = uiComputed([props.auto, props.col], () => {
        const auto = uiUnwrap(props.auto);
        const col = auto ? "" : uiUnwrap(props.col);
        return col === "" ? "cms-col" : col != null ? `cms-col-${col}` : "cms-col";
      });
      const cls = uiClass([
        colClass,
        uiClassValue(props.sm, "cms-sm-col-"),
        uiClassValue(props.md, "cms-md-col-"),
        uiClassValue(props.lg, "cms-lg-col-"),
        props.class
      ]);

      const p = CMSwift.omit(props, ["slots", "col", "sm", "md", "lg", "auto", "size", "style"]);
      p.class = cls;
      const width = uiStyleValue(props.size, (v) => unitCover(v, "w"));
      const flex = uiStyleValue(props.size, () => "0 0 auto");
      if (width != null) style.width = width;
      if (flex != null) style.flex = flex;

      p.style = style;

      const content = renderSlotToArray(slots, "default", {}, children);
      return _.div(p, ...content);
    } catch (e) {
      console.log(e);
    }
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Col = {
      signature: "UI.Col(...children) | UI.Col(props, ...children)",
      props: {
        slots: "{ default?: Slot }",
        class: "string",
        style: "object"
      },
      slots: {
        default: "Column content"
      },
      returns: "HTMLDivElement",
      description: "Column layout wrapper."
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
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const p = CMSwift.omit(props, ["slots"]);
    p.class = uiClass(["cms-container", props.class]);
    const content = renderSlotToArray(slots, "default", {}, children);
    return _.div(p, ...content);
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Container = {
      signature: "UI.Container(...children) | UI.Container(props, ...children)",
      props: {
        slots: "{ default?: Slot }",
        class: "string",
        style: "object"
      },
      slots: {
        default: "Container content"
      },
      returns: "HTMLDivElement",
      description: "Container layout wrapper."
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
      "icon", "iconRight", "label", "loading", "outline", "iconAlign", "slots"
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
      renderSlotToArray(null, "default", {}, suffixNode).forEach(n => right.appendChild(n));
      renderSlotToArray(null, "default", {}, iconRightNode).forEach(n => right.appendChild(n));
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
        disabled: "boolean",
        readonly: "boolean",
        control: "Node|Function",
        getValue: "() => any",
        onClear: "() => void",
        onFocus: "() => void",
        wrapClass: "string",
        slots: "{ label?, topLabel?, prefix?, suffix?, icon?, iconRight?, clear?, hint?, error?, control? }"
      },
      slots: {
        label: "Floating label content",
        topLabel: "Top label content",
        prefix: "Left addon content",
        suffix: "Right addon content",
        icon: "Left icon content",
        iconRight: "Right icon content",
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

    const headerSource = resolveProp("header", "headerContent");
    const drawerSource = resolveProp("aside", "drawer", "nav");
    const pageSource = resolveProp("page", "main", "content", "body");
    const footerSource = resolveProp("footer", "footerContent");

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

    const drawerBreakpoint = Number(uiUnwrap(props.drawerBreakpoint) ?? 1024);
    const [getMobile, setMobile] = CMSwift.reactive.signal(false);
    const checkMobile = () => {
      if (typeof window === "undefined") return;
      setMobile(window.innerWidth < drawerBreakpoint);
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
      isDrawerOpen: () => !!getOpen(),
      isMobile: () => !!getMobile()
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

    const explicitNoDrawer = uiUnwrap(props.noDrawer) === true || drawerSource === false;
    const pageFallback = pageSource !== undefined ? pageSource : children;

    const cls = uiClass(["cms-app", "cms-layout", props.class]);
    const p = CMSwift.omit(props, [
      "header", "headerContent",
      "aside", "drawer", "nav",
      "page", "main", "content", "body",
      "footer", "footerContent",
      "noDrawer", "drawerOpen", "drawerBreakpoint", "drawerWidth",
      "overlayClose", "escClose",
      "stickyHeader", "stickyFooter", "stickyAside",
      "tagPage",
      "shellClass", "headerClass", "asideClass", "pageClass", "footerClass", "overlayClass",
      "gap", "headerOffset", "minHeight",
      "slots"
    ]);
    p.class = cls;
    p.style = { ...(props.style || {}) };
    p.style["--cms-layout-drawer-width"] = toLayoutCssSize(uiUnwrap(props.drawerWidth) ?? 280, "280px");
    const layoutGap = toLayoutCssSize(uiUnwrap(props.gap), null);
    if (layoutGap != null) p.style["--cms-layout-gap"] = layoutGap;
    const headerOffset = toLayoutCssSize(uiUnwrap(props.headerOffset), null);
    if (headerOffset != null) p.style["--layout-header-height"] = headerOffset;
    const minHeight = toLayoutCssSize(uiUnwrap(props.minHeight), null);
    if (minHeight != null) p.style["--cms-layout-min-height"] = minHeight;

    const root = _.div(p);
    const tagPage = uiUnwrap(props.tagPage) === true;
    const tags = tagPage
      ? { header: "header", aside: "aside", page: "main", footer: "footer" }
      : { header: "div", aside: "div", page: "div", footer: "div" };

    const shell = _.div({ class: uiClass(["cms-layout-shell-grid", props.shellClass]) });
    const headerWrap = _[tags.header]({
      class: uiClass(["cms-layout-section", "cms-layout-header", "header", uiWhen(props.stickyHeader, "sticky"), props.headerClass])
    });
    const asideWrap = _[tags.aside]({
      class: uiClass(["cms-layout-section", "cms-layout-aside", "aside", uiWhen(props.stickyAside !== false, "sticky"), props.asideClass]),
      role: "navigation",
      "aria-hidden": "true"
    });
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
    shell.appendChild(footerWrap);
    root.appendChild(shell);

    const overlay = _.div({
      class: uiClass(["cms-aside-overlay", props.overlayClass]),
      onClick: () => {
        if (uiUnwrap(props.overlayClose) === false) return;
        setOpen(false);
      }
    });
    root.appendChild(overlay);

    let hasHeaderContent = false;
    let hasDrawerContent = false;
    let hasPageContent = false;
    let hasFooterContent = false;
    let headerObserver = null;

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

    const syncLayoutState = () => {
      const mobile = !!getMobile();
      const open = !!getOpen();
      const drawerEnabled = !explicitNoDrawer && hasDrawerContent;
      const drawerVisible = drawerEnabled && open;

      root.classList.toggle("is-mobile", mobile);
      root.classList.toggle("drawer-open", drawerVisible);
      root.classList.toggle("no-drawer", !drawerEnabled);
      root.classList.toggle("has-header", hasHeaderContent);
      root.classList.toggle("has-drawer", drawerEnabled);
      root.classList.toggle("has-footer", hasFooterContent);

      headerWrap.hidden = !hasHeaderContent;
      footerWrap.hidden = !hasFooterContent;
      mainWrap.hidden = !hasPageContent;

      overlay.hidden = !drawerEnabled;
      overlay.classList.toggle("show", mobile && drawerVisible);

      if (!drawerEnabled) {
        asideWrap.hidden = true;
        asideWrap.classList.remove("open");
        asideWrap.setAttribute("aria-hidden", "true");
        shell.style.gridTemplateColumns = "minmax(0, 1fr)";
        shell.style.gridTemplateAreas = "\"header\" \"main\" \"footer\"";
        return;
      }

      asideWrap.hidden = false;
      asideWrap.classList.toggle("open", open);
      asideWrap.setAttribute("aria-hidden", drawerVisible ? "false" : "true");

      if (mobile) {
        asideWrap.style.removeProperty("display");
        shell.style.gridTemplateColumns = "minmax(0, 1fr)";
        shell.style.gridTemplateAreas = "\"header\" \"main\" \"footer\"";
        return;
      }

      if (drawerVisible) {
        asideWrap.style.removeProperty("display");
        shell.style.removeProperty("grid-template-columns");
        shell.style.removeProperty("grid-template-areas");
      } else {
        asideWrap.style.display = "none";
        shell.style.gridTemplateColumns = "minmax(0, 1fr)";
        shell.style.gridTemplateAreas = "\"header\" \"main\" \"footer\"";
      }
    };

    const headerUpdate = (value, newUrl) => {
      hasHeaderContent = fillWrap(headerWrap, normalizeUpdateNodes(value));
      syncHeaderHeight();
      syncLayoutState();
      if (newUrl) CMSwift.router.setURLOnly(newUrl);
      return headerWrap;
    };
    const asideUpdate = (value, newUrl) => {
      hasDrawerContent = fillWrap(asideWrap, normalizeUpdateNodes(value));
      if (!hasDrawerContent) setOpen(false);
      syncLayoutState();
      if (newUrl) CMSwift.router.setURLOnly(newUrl);
      return asideWrap;
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
    hasDrawerContent = fillWrap(asideWrap, explicitNoDrawer ? [] : renderAliasSlot(["aside", "drawer", "nav"], drawerSource));
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
      syncLayoutState();
    }, "UI.Layout:state");

    const onKeyDown = (e) => {
      if (uiUnwrap(props.escClose) === false) return;
      if (!getMobile() || !getOpen()) return;
      if (e.key !== "Escape") return;
      e.preventDefault();
      setOpen(false);
    };
    if (typeof document !== "undefined") {
      document.addEventListener("keydown", onKeyDown, true);
    }

    root.openAside = () => setOpen(true);
    root.closeAside = () => setOpen(false);
    root.toggleAside = () => setOpen(!getOpen());
    root.isDrawerOpen = () => !!getOpen();
    root.isMobile = () => !!getMobile();
    root.header = () => headerWrap;
    root.aside = () => asideWrap;
    root.page = () => mainWrap;
    root.main = () => mainWrap;
    root.footer = () => footerWrap;
    root.headerUpdate = headerUpdate;
    root.asideUpdate = asideUpdate;
    root.pageUpdate = pageUpdate;
    root.mainUpdate = pageUpdate;
    root.footerUpdate = footerUpdate;
    root.reflow = syncLayoutState;
    root._dispose = () => {
      if (typeof window !== "undefined") window.removeEventListener("resize", checkMobile);
      if (typeof document !== "undefined") document.removeEventListener("keydown", onKeyDown, true);
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
        page: "Node|Function|Array",
        main: "Node|Function|Array",
        content: "Node|Function|Array",
        body: "Node|Function|Array",
        footer: "Node|Function|Array",
        footerContent: "Node|Function|Array",
        noDrawer: "boolean",
        drawerOpen: "rod | [get,set] signal | boolean",
        drawerBreakpoint: "number(px)",
        drawerWidth: "number|string",
        overlayClose: "boolean",
        escClose: "boolean",
        stickyHeader: "boolean",
        stickyFooter: "boolean",
        stickyAside: "boolean",
        tagPage: "boolean",
        gap: "number|string",
        headerOffset: "number|string",
        minHeight: "number|string",
        shellClass: "string",
        headerClass: "string",
        asideClass: "string",
        pageClass: "string",
        footerClass: "string",
        overlayClass: "string",
        slots: "{ header?, aside?, drawer?, nav?, page?, main?, footer?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        header: "Header content",
        aside: "Aside / drawer content",
        drawer: "Alias di aside",
        nav: "Alias di aside",
        page: "Page content",
        main: "Alias di page",
        footer: "Footer content",
        default: "Fallback page content"
      },
      returns: "HTMLDivElement con methods openAside/closeAside/toggleAside/isDrawerOpen/isMobile/reflow, " +
        "header()/aside()/page()/footer(), headerUpdate/asideUpdate/pageUpdate/mainUpdate/footerUpdate e _dispose()",
      description: "Shell layout composabile con slot alias, drawer responsivo e update runtime delle sezioni."
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

    const cls = uiClass([
      "cms-toolbar",
      uiWhen(props.dense, "dense"),
      uiWhen(props.divider, "divider"),
      uiWhen(props.elevated, "elevated"),
      uiWhen(props.sticky, "sticky"),
      props.class
    ]);

    const p = CMSwift.omit(props, ["dense", "divider", "wrap", "justify", "align", "gap", "elevated", "sticky", "slots"]);
    p.class = cls;

    const style = { ...(props.style || {}) };
    style.display = style.display || "flex";
    const align = uiStyleValue(props.align);
    if (align != null) style.alignItems = align;
    const justify = uiStyleValue(props.justify);
    if (justify != null) style.justifyContent = justify;
    const wrap = uiStyleValue(props.wrap, (v) => v ? "wrap" : "nowrap");
    if (wrap != null) style.flexWrap = wrap;
    const gap = uiStyleValue(props.gap, toCssSize, "var(--cms-s-md)");
    style.gap = gap != null ? gap : "var(--cms-s-md)";
    const sizePadding = {
      xxs: "4px 6px",
      xs: "6px 8px",
      sm: "6px 10px",
      md: "10px 12px",
      lg: "12px 16px",
      xl: "14px 18px"
    };
    const padding = uiStyleValue(props.size, (v) => sizePadding[v] || "");
    if (padding != null) style.padding = padding;
    if (Object.keys(style).length) p.style = style;

    const content = renderSlotToArray(slots, "default", {}, children);
    return _.div(p, ...content);
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Toolbar = {
      signature: "UI.Toolbar(...children) | UI.Toolbar(props, ...children)",
      props: {
        dense: "boolean",
        divider: "boolean",
        elevated: "boolean",
        sticky: "boolean",
        wrap: "boolean",
        align: `stretch|flex-start|center|flex-end|baseline`,
        justify: `flex-start|center|flex-end|space-between|space-around|space-evenly`,
        gap: "string (es: '8px' o 'var(--cms-s-md)')",
        slots: "{ default? }",
        class: "string",
        style: "object"
      },
      slots: {
        default: "Toolbar content"
      },
      events: {
        onClick: "MouseEvent"
      },
      description: "Toolbar flessibile con varianti dense/divider/elevated/sticky.",
      returns: "HTMLDivElement"
    };
  }
  // Esempio: CMSwift.ui.Toolbar({}, CMSwift.ui.Btn({}, "Azione"))

  UI.Grid = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const cls = uiClass([
      "cms-grid",
      uiWhen(props.dense, "dense"),
      props.class
    ]);

    const p = CMSwift.omit(props, ["gap", "cols", "align", "justify", "dense", "slots"]);
    p.class = cls;

    const style = { ...(props.style || {}) };
    const gap = uiStyleValue(props.gap, toCssSize);
    if (gap != null) style["--cms-grid-gap"] = gap;
    const cols = uiStyleValue(props.cols, (v) => typeof v === "number"
      ? `repeat(${v}, minmax(0, 1fr))`
      : String(v)
    );
    if (cols != null) style.gridTemplateColumns = cols;
    const align = uiStyleValue(props.align);
    if (align != null) style.alignItems = align;
    const justify = uiStyleValue(props.justify);
    if (justify != null) style.justifyContent = justify;
    if (Object.keys(style).length) p.style = style;

    return _.div(p, ...renderSlotToArray(slots, "default", {}, children));
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Grid = {
      signature: "UI.Grid(...children) | UI.Grid(props, ...children)",
      props: {
        gap: "string|number",
        cols: "number|string",
        align: `stretch|start|center|end`,
        justify: `start|center|end|space-between|space-around|space-evenly`,
        dense: "boolean",
        slots: "{ default? }",
        class: "string",
        style: "object"
      },
      slots: {
        default: "Grid content"
      },
      returns: "HTMLDivElement",
      description: "Griglia base con gap e colonne configurabili."
    };
  }
  // Esempio: CMSwift.ui.Grid({}, CMSwift.ui.GridCol({ span: 12 }, "Col"))

  UI.GridCol = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const cls = uiClass([
      "cms-grid-col",
      uiWhen(props.auto, "is-auto"),
      props.class
    ]);

    const p = CMSwift.omit(props, ["span", "sm", "md", "lg", "auto", "slots", "style"]);
    p.class = cls;

    const style = { ...(props.style || {}) };
    const toGridSpan = (value) => {
      if (value == null || value === "") return null;
      if (value === "auto") return "auto";
      const n = Number(value);
      if (Number.isFinite(n) && n > 0) return `span ${n} / span ${n}`;
      return String(value);
    };

    const span = uiStyleValue(props.span, toGridSpan);
    const sm = uiStyleValue(props.sm, toGridSpan);
    const md = uiStyleValue(props.md, toGridSpan);
    const lg = uiStyleValue(props.lg, toGridSpan);

    if (uiUnwrap(props.auto) === true) style["--cms-grid-col-base"] = "auto";
    else if (span != null) style["--cms-grid-col-base"] = span;
    if (sm != null) style["--cms-grid-col-sm"] = sm;
    if (md != null) style["--cms-grid-col-md"] = md;
    if (lg != null) style["--cms-grid-col-lg"] = lg;
    if (Object.keys(style).length) p.style = style;

    return _.div(p, ...renderSlotToArray(slots, "default", {}, children));
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.GridCol = {
      signature: "UI.GridCol(...children) | UI.GridCol(props, ...children)",
      props: {
        span: "number",
        sm: "number",
        md: "number",
        lg: "number",
        auto: "boolean",
        slots: "{ default? }",
        class: "string",
        style: "object"
      },
      slots: {
        default: "Column content"
      },
      returns: "HTMLDivElement",
      description: "Item per CSS Grid con span responsive e breakpoint sm/md/lg."
    };
  }
  // Esempio: CMSwift.ui.GridCol({ span: 6, sm: 12 }, "Colonna")

  UI.Icon = (...args) => {
    let props = {};
    let children = [];
    let name = "home";
    let hasName = false;
    const a = args[0];
    const b = args[1];
    const isPlainObject = (v) => v && typeof v === "object" && !v.nodeType && !Array.isArray(v) && !(v instanceof Function);

    if (typeof a === "string") {
      name = a;
      hasName = true;
      if (isPlainObject(b)) {
        props = b;
        if (args.length > 2) children = args.slice(2);
      } else if (args.length > 1) {
        children = args.slice(1);
      }
    } else if (isPlainObject(a)) {
      props = a;
      if (a.name != null) {
        name = a.name;
        hasName = true;
      }
      if (args.length > 1) children = args.slice(1);
    } else if (args.length) {
      children = args;
    }

    if (!hasName && children.length) {
      name = children.length === 1 ? children[0] : children;
    }
    applyCommonProps(props);

    const slots = props.slots || {};

    const size = uiUnwrap(props.size);
    const color = uiUnwrap(props.color);
    const isFill = String(name).endsWith("-fill");
    const style = { ...(props.style || {}) };
    const sizeClass = uiComputed(props.size, () => {
      const v = uiUnwrap(props.size);
      return (typeof v === "string" && sizeMap[v]) ? v : "";
    });

    const hasVisualSurface = !!(props.color || props.clickable || props.border || props.glossy || props.glow || props.glass || props.shadow || props.outline || props.gradient || props.textGradient || props.lightShadow || props.radius);

    const cls = uiClass([
      "cms-icon",
      "material-icons",
      ...(hasVisualSurface ? ["cms-clear-set", "cms-singularity"] : []),
      sizeClass,
      props.class
    ]);
    const p = CMSwift.omit(props, ["name", "size", "class", "style", "label", "border", "color", "icon", "iconRight", "removable", "onRemove", "dense", "flat", "glossy", "outline", "slots"]);
    p.class = cls;
    if (Object.keys(style).length) p.style = style;

    if (typeof name === "function" || (name && typeof name === "object")) {
      const customNode = CMSwift.ui.renderSlot(slots, "default", {}, name);
      const content = renderSlotToArray(null, "default", {}, customNode);
      return _.span({ ...p, "data-icon": "custom" }, ...content);
    }

    const nameStr = String(name);
    const useHref = nameStr.includes("#") ? nameStr : "";
    let icon = null;
    if (useHref) {
      const svg = _.svg(
        { width: "100%", height: "100%" },
        _.use({ href: "/_cmswift-fe/img/svg/tabler-icons-sprite.svg" + useHref })
      );
      if (isFill) svg.style.fill = "currentColor";
      icon = _.span({ ...p, "data-icon": nameStr }, svg, ...children);
    } else {
      icon = _.span({ ...p, "data-icon": nameStr }, nameStr, ...children);
    }

    if (size != null) {
      let v = size;
      if (CMSwift.uiSizes.includes(size)) {
        v = `var(--cms-icon-size-${size})`;
      }
      v = typeof v === "number" ? v + "px" : String(v);
      icon.style.setProperty("--set-icon-size", v);
    }

    setPropertyProps(icon, props);
    return icon;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Icon = {
      signature: "UI.Icon(name) | UI.Icon(props) | UI.Icon(props, ...children)",
      props: {
        name: "string|Node|Function",
        size: "number|string",
        color: "string",
        shadow: "boolean|string",
        lightShadow: "boolean",
        clickable: "boolean",
        border: "boolean",
        glossy: "boolean",
        glow: "boolean",
        glass: "boolean",
        gradient: "boolean|number",
        outline: "boolean",
        textGradient: "boolean",
        radius: "number|string",
        slots: "{ default? }",
        class: "string",
        style: "object"
      },
      slots: {
        default: "Custom icon content"
      },
      returns: "HTMLSpanElement",
      description: "Icona basata su sprite o testo, con size/color configurabili."
    };
  }
  // Esempio: CMSwift.ui.Icon({ name: "home", size: 18 })

  UI.Badge = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const sizeClass = uiComputed(props.size, () => {
      const v = uiUnwrap(props.size);
      return (typeof v === "string" && sizeMap[v]) ? `cms-size-${v}` : "";
    });
    const cls = uiClass([
      "cms-clear-set",
      "cms-badge",
      "cms-singularity",
      sizeClass,
      uiWhen(props.outline, "outline"),
      props.class
    ]);
    const p = CMSwift.omit(props, [
      "label",
      "color",
      "outline",
      "size",
      "slots",
      "notification",
      "iconSize",
      "topLeft",
      "topRight",
      "bottomLeft",
      "bottomRight",
      "left",
      "right"
    ]);
    p.class = cls;

    const style = {
      ...(props.style || {})
    };
    if (props.size) {
      const size = uiUnwrap(props.size);
      if (!(typeof size === "string" && sizeMap[size])) {
        style.fontSize = toCssSize(props.size);
      }
    }
    p.style = style;

    const renderNamedSlotToArray = (names, ctx, fallback) => {
      const list = Array.isArray(names) ? names : [names];
      for (const name of list) {
        if (CMSwift.ui.getSlot(slots, name) != null) {
          return renderSlotToArray(slots, name, ctx, fallback);
        }
      }
      return fallback == null || fallback === false || fallback === ""
        ? []
        : renderSlotToArray(null, "default", ctx, fallback);
    };

    const resolveIconSize = () => {
      const raw = uiUnwrap(props.iconSize ?? props.size);
      if (typeof raw === "number") return Math.max(10, Math.round(raw * 0.85));
      if (typeof raw === "string") {
        const map = {
          xxs: 10,
          xs: 11,
          sm: 12,
          md: 13,
          lg: 14,
          xl: 16,
          xxl: 18,
          xxxl: 20
        };
        return map[raw] || 14;
      }
      return 14;
    };

    const resolveIconFallback = (source, as) => {
      const raw = uiUnwrap(source);
      if (raw == null || raw === false || raw === "") return null;
      if (typeof raw === "string") return UI.Icon({ name: raw, size: resolveIconSize() });
      return CMSwift.ui.slot(raw, { as });
    };

    const renderIconAnchor = (slotNames, propKey, position) => _.dynamic(() => {
      const iconFallback = resolveIconFallback(props[propKey], position);
      const nodes = renderNamedSlotToArray(slotNames, { position }, iconFallback);
      if (!nodes.length) return null;
      return _.span({
        class: `cms-badge-anchor cms-badge-anchor-${position}`,
        "data-badge-slot": position
      }, ...nodes);
    });

    const content = _.dynamic(() => {
      const labelFallback = uiUnwrap(props.label);
      let labelNodes = renderNamedSlotToArray(["label"], {}, labelFallback);
      if (!labelNodes.length) labelNodes = renderNamedSlotToArray(["default"], {}, children);
      return _.span(
        { class: "cms-badge-content" },
        _.span({ class: "cms-badge-label" }, ...(labelNodes.length ? labelNodes : [""]))
      );
    });

    const notification = _.dynamic(() => {
      const rawNotification = uiUnwrap(props.notification);
      const fallback = rawNotification == null || rawNotification === false || rawNotification === ""
        ? null
        : rawNotification;
      const nodes = renderNamedSlotToArray(["notification"], { notification: rawNotification }, fallback);
      if (!nodes.length) return null;
      return _.span({
        class: "cms-badge-notification",
        "data-badge-slot": "notification",
        "aria-label": typeof rawNotification === "number" ? `${rawNotification} notifications` : null
      }, ...nodes);
    });

    const wrap = _.span(
      renderIconAnchor(["left"], "left", "left"),
      renderIconAnchor(["centerLeft", "center-left"], "centerLeft", "center-left"),
      p,
      content,
      renderIconAnchor(["topLeft", "top-left"], "topLeft", "top-left"),
      renderIconAnchor(["topRight", "top-right"], "topRight", "top-right"),
      renderIconAnchor(["bottomLeft", "bottom-left"], "bottomLeft", "bottom-left"),
      renderIconAnchor(["bottomRight", "bottom-right"], "bottomRight", "bottom-right"),
      renderIconAnchor(["centerRight", "center-right"], "centerRight", "center-right"),
      renderIconAnchor(["right"], "right", "right"),
      notification
    );
    // se esiste un props con left o right
    if (props.topLeft || props.centerLeft || props.bottomLeft) {
      wrap.style.setProperty("padding-left", "15px");
    }
    if (props.topRight || props.centerRight || props.bottomRight) {
      wrap.style.setProperty("padding-right", "15px");
    }

    setPropertyProps(wrap, props);
    return wrap;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Badge = {
      signature: "UI.Badge(...children) | UI.Badge(props, ...children)",
      props: {
        label: "String|Node|Function|Array",
        color: "string",
        size: "string|number",
        outline: "boolean",
        notification: "string|number|Node|Function|[get,set] signal",
        iconSize: "string|number",
        topLeft: "String|Node|Function|Array",
        topRight: "String|Node|Function|Array",
        bottomLeft: "String|Node|Function|Array",
        bottomRight: "String|Node|Function|Array",
        centerLeft: "String|Node|Function|Array",
        centerRight: "String|Node|Function|Array",
        left: "String|Node|Function|Array",
        right: "String|Node|Function|Array",
        slots: "{ label?, default?, notification?, topLeft?, topRight?, bottomLeft?, bottomRight?, left?, right? }",
        class: "string",
        style: "object"
      },
      slots: {
        label: "Badge label content",
        default: "Fallback content",
        notification: "Notification badge content",
        topLeft: "Icon anchored top-left",
        topRight: "Icon anchored top-right",
        bottomLeft: "Icon anchored bottom-left",
        bottomRight: "Icon anchored bottom-right",
        centerLeft: "Icon anchored center-left",
        centerRight: "Icon anchored center-right",
        left: "Icon anchored left",
        right: "Icon anchored right"
      },
      returns: "HTMLSpanElement",
      description: "Badge inline con notification reattiva e 6 slot icona posizionabili."
    };
  }
  // Esempio: CMSwift.ui.Badge({ label: "New" })

  const avatarGetInitials = (value) => {
    if (value == null || value === false) return "";
    const text = String(value)
      .replace(/[._-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!text) return "";
    const words = text.split(" ").filter(Boolean);
    if (!words.length) return "";
    if (words.length === 1) {
      const token = words[0].replace(/[^a-z0-9]/gi, "");
      return token.slice(0, 2).toUpperCase();
    }
    return words.slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join("");
  };

  const avatarStatusState = (value, fallback) => {
    const raw = value == null || value === true ? fallback : value;
    if (raw == null || raw === false) return normalizeState(fallback);
    const token = String(raw).toLowerCase();
    if (token === "online" || token === "available" || token === "active") return "success";
    if (token === "away" || token === "pending") return "warning";
    if (token === "busy" || token === "dnd" || token === "blocked") return "danger";
    if (token === "offline" || token === "idle") return "secondary";
    return normalizeState(token) || normalizeState(fallback);
  };

  const avatarPrimitiveBadge = (value, className = "cms-avatar-badge") => {
    if (value == null || value === false) return null;
    if (value instanceof Node || Array.isArray(value)) return value;
    if (typeof value === "function") return value;
    if (value === true) return _.span({ class: className });
    return _.span({ class: className }, String(value));
  };

  const avatarPrimitiveStatus = (value, color) => {
    if (value == null || value === false) {
      if (!color) return null;
      const fallbackState = avatarStatusState(null, color);
      return _.span({ class: uiClass(["cms-avatar-status", fallbackState ? `cms-state-${fallbackState}` : ""]) });
    }
    if (value instanceof Node || Array.isArray(value)) return value;
    if (typeof value === "function") return value;
    const state = avatarStatusState(value, color);
    if (value === true || state) {
      return _.span({ class: uiClass(["cms-avatar-status", state ? `cms-state-${state}` : ""]) });
    }
    return avatarPrimitiveBadge(value, "cms-avatar-badge");
  };

  const avatarRenderAnchor = (className, nodes) => {
    if (!nodes || !nodes.length) return null;
    return _.span({ class: uiClass(["cms-avatar-anchor", className]) }, ...nodes);
  };

  UI.Avatar = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const sizeClass = uiComputed(props.size, () => {
      const v = uiUnwrap(props.size);
      return (typeof v === "string" && CMSwift.uiSizes?.includes(v)) ? `cms-size-${v}` : "";
    });
    const stateClass = uiComputed([props.color, props.state], () => {
      const v = uiUnwrap(props.color) || uiUnwrap(props.state) || "";
      const state = normalizeState(v);
      return state ? `cms-state-${state}` : "";
    });
    const cls = uiClass([
      "cms-clear-set",
      "cms-avatar",
      "cms-singularity",
      sizeClass,
      stateClass,
      uiWhen(props.square, "cms-avatar-square"),
      uiWhen(props.elevated, "elevated"),
      props.class
    ]);

    const p = CMSwift.omit(props, [
      "src", "srcset", "srcSet", "sizes", "alt", "label", "name", "initials", "text",
      "size", "fontSize", "textSize", "radius", "rounded", "square", "elevated",
      "icon", "iconSize", "media", "fit", "badge", "notification", "status",
      "statusColor", "presence", "topLeft", "topRight", "bottomLeft", "bottomRight",
      "slots"
    ]);
    p.class = cls;

    const style = { ...(props.style || {}) };
    const sizeStyle = uiStyleValue(props.size, (value) => {
      if (typeof value === "string" && CMSwift.uiSizes?.includes(value)) return "";
      return toCssSize(value);
    }, "");
    if (sizeStyle != null) {
      style.width = sizeStyle;
      style.height = sizeStyle;
    }

    const fontSizeValue = props.fontSize ?? props.textSize;
    const fontSizeStyle = fontSizeValue != null
      ? uiStyleValue(fontSizeValue, toCssSize)
      : uiStyleValue(props.size, (value) => {
        if (typeof value === "string" && CMSwift.uiSizes?.includes(value)) return "";
        return `clamp(11px, calc(${toCssSize(value)} * 0.34), 28px)`;
      }, "");
    if (fontSizeStyle != null) style.fontSize = fontSizeStyle;

    const radiusStyle = uiStyleValue(props.radius, (value) => {
      const normalized = normalizeRadius(value);
      if (normalized === "xxxl") return "999px";
      if (normalized) return `var(--cms-r-${normalized})`;
      if (typeof value === "number") return `${value}px`;
      return String(value);
    });
    if (radiusStyle != null) style["--set-border-radius"] = radiusStyle;
    p.style = style;

    const ctx = { props };
    const altText = uiComputed([props.alt, props.label, props.name, props.text], () => {
      const raw = uiUnwrap(props.alt) || uiUnwrap(props.label) || uiUnwrap(props.name) || uiUnwrap(props.text) || "avatar";
      return String(raw);
    });
    const iconFallback = props.icon != null
      ? (typeof props.icon === "string"
        ? UI.Icon({ name: props.icon, size: props.iconSize || props.size || "sm" })
        : CMSwift.ui.slot(props.icon, { as: "icon" }))
      : null;
    const labelFallback = uiComputed([props.initials, props.text, props.label, props.name], () => {
      const explicit = uiUnwrap(props.initials) ?? uiUnwrap(props.text);
      if (explicit != null) return explicit;
      const rawLabel = uiUnwrap(props.label) ?? uiUnwrap(props.name);
      if (typeof rawLabel === "string") return avatarGetInitials(rawLabel);
      return rawLabel;
    });
    const badgeFallback = avatarPrimitiveBadge(uiUnwrap(props.badge ?? props.notification));
    const statusFallback = avatarPrimitiveStatus(
      uiUnwrap(props.status ?? props.presence),
      uiUnwrap(props.statusColor)
    );

    let mediaNodes = renderSlotToArray(slots, "media", ctx, props.media);
    if (!mediaNodes.length && props.src) {
      const imgProps = {
        class: "cms-avatar-img",
        src: props.src,
        alt: altText,
        sizes: props.sizes,
        style: {}
      };
      if (props.srcset != null) imgProps.srcset = props.srcset;
      if (props.srcSet != null) imgProps.srcset = props.srcSet;
      const fitStyle = uiStyleValue(props.fit);
      if (fitStyle != null) imgProps.style.objectFit = fitStyle;
      mediaNodes = [_.img(imgProps)];
    }

    const defaultNodes = renderSlotToArray(slots, "default", ctx, children);
    const fallbackNodes = renderSlotToArray(slots, "fallback", ctx, null);
    const labelNodes = renderSlotToArray(slots, "label", ctx, labelFallback);
    const iconNodes = renderSlotToArray(slots, "icon", ctx, iconFallback);
    const mainNodes = mediaNodes.length
      ? mediaNodes
      : (defaultNodes.length
        ? defaultNodes
        : (fallbackNodes.length
          ? fallbackNodes
          : (labelNodes.length
            ? labelNodes
            : (iconNodes.length ? iconNodes : ["?"]))));

    const bodyClass = mediaNodes.length ? "cms-avatar-media" : "cms-avatar-fallback";
    const body = _.span({ class: "cms-avatar-body" },
      _.span({ class: bodyClass }, ...mainNodes)
    );

    let topLeftNodes = renderSlotToArray(slots, "topLeft", ctx, props.topLeft);
    let topRightNodes = renderSlotToArray(slots, "topRight", ctx, props.topRight);
    let bottomLeftNodes = renderSlotToArray(slots, "bottomLeft", ctx, props.bottomLeft);
    let bottomRightNodes = renderSlotToArray(slots, "bottomRight", ctx, props.bottomRight);
    const badgeNodes = renderSlotToArray(slots, "badge", ctx, badgeFallback);
    const statusNodes = renderSlotToArray(slots, "status", ctx, statusFallback);

    if (!topRightNodes.length && badgeNodes.length) topRightNodes = badgeNodes;
    if (!bottomRightNodes.length && statusNodes.length) bottomRightNodes = statusNodes;

    return _.div(
      p,
      body,
      avatarRenderAnchor("cms-avatar-anchor-top-left", topLeftNodes),
      avatarRenderAnchor("cms-avatar-anchor-top-right", topRightNodes),
      avatarRenderAnchor("cms-avatar-anchor-bottom-left", bottomLeftNodes),
      avatarRenderAnchor("cms-avatar-anchor-bottom-right", bottomRightNodes)
    );
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Avatar = {
      signature: "UI.Avatar(...children) | UI.Avatar(props, ...children)",
      props: {
        src: "string",
        srcset: "string",
        sizes: "string",
        alt: "string",
        label: "String|Node|Function|Array",
        name: "string",
        initials: "string|Node|Function|Array",
        text: "string|Node|Function|Array",
        size: "number|string",
        fontSize: "number|string",
        radius: "number|string",
        square: "boolean",
        elevated: "boolean",
        color: "string",
        state: "string",
        icon: "string|Node|Function|Array",
        iconSize: "number|string",
        media: "Node|Function|Array",
        fit: "cover|contain|fill|scale-down|none",
        badge: "string|number|Node|Function|Array",
        notification: "string|number|Node|Function|Array",
        status: "boolean|string|number|Node|Function|Array",
        statusColor: "success|warning|danger|info|primary|secondary|dark|light|string",
        topLeft: "Node|Function|Array",
        topRight: "Node|Function|Array",
        bottomLeft: "Node|Function|Array",
        bottomRight: "Node|Function|Array",
        slots: "{ media?, default?, fallback?, label?, icon?, badge?, status?, topLeft?, topRight?, bottomLeft?, bottomRight? }",
        class: "string",
        style: "object"
      },
      slots: {
        media: "Media principale custom",
        default: "Contenuto principale custom al posto di immagine o fallback",
        fallback: "Fallback custom quando non c'e immagine",
        label: "Fallback testuale / initials",
        icon: "Icona fallback",
        badge: "Badge overlay, di default top-right",
        status: "Presence dot o contenuto overlay, di default bottom-right",
        topLeft: "Contenuto overlay top-left",
        topRight: "Contenuto overlay top-right",
        bottomLeft: "Contenuto overlay bottom-left",
        bottomRight: "Contenuto overlay bottom-right"
      },
      returns: "HTMLDivElement",
      description: "Avatar flessibile con immagine, fallback intelligenti, stati, badge e slot overlay."
    };
  }
  // Esempio: CMSwift.ui.Avatar({ label: "CM" })

  UI.Chip = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const sizeClass = uiComputed(props.size, () => {
      const v = uiUnwrap(props.size);
      return (typeof v === "string" && sizeMap[v]) ? v : "";
    });
    const cls = uiClass([
      "cms-clear-set",
      "cms-chip",
      "cms-singularity",
      sizeClass,
      props.class
    ]);
    const p = CMSwift.omit(props, ["label", "border", "color", "icon", "iconRight", "removable", "onRemove", "dense", "flat", "glossy", "outline", "slots"]);
    p.class = cls;
    p.style = {
      ...(props.style || {})
    };

    const iconFallback = props.icon
      ? (typeof props.icon === "string" ? UI.Icon({ name: props.icon, size: props?.size ?? null }) : CMSwift.ui.slot(props.icon, { as: "icon" }))
      : null;
    const iconRightFallback = props.iconRight
      ? (typeof props.iconRight === "string" ? UI.Icon({ name: props.iconRight, size: props?.size ?? null }) : CMSwift.ui.slot(props.iconRight, { as: "iconRight" }))
      : null;
    const iconNode = CMSwift.ui.renderSlot(slots, "icon", {}, iconFallback);
    const iconRightNode = CMSwift.ui.renderSlot(slots, "iconRight", {}, iconRightFallback);
    const labelNodes = renderSlotToArray(slots, "label", {}, props.label);
    const labelNode = labelNodes.length ? labelNodes : renderSlotToArray(slots, "default", {}, children);

    const iconNodes = renderSlotToArray(null, "default", {}, iconNode);
    const iconRightNodes = renderSlotToArray(null, "default", {}, iconRightNode);
    const wrap = _.span(p, ...iconNodes, ...(labelNode.length ? labelNode : [""]), ...iconRightNodes);
    if (props.removable) {
      const btn = UI.Btn({ class: "cms-chip-remove", onClick: props.onRemove, size: props?.size ?? null }, UI.Icon({ size: props?.size ?? null, name: "close" }));
      wrap.appendChild(btn);
      btn.onclick = () => {
        if (props.onRemove) {
          props.onRemove();
        }
        wrap.remove();
      }
    }
    setPropertyProps(wrap, props);
    return wrap;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Chip = {
      signature: "UI.Chip(...children) | UI.Chip(props, ...children)",
      props: {
        label: "String|Node|Function|Array",
        icon: "String|Node|Function|Array",
        iconRight: "String|Node|Function|Array",
        removable: "boolean",
        onRemove: "function",
        dense: "boolean",
        outline: "boolean|string|number",
        slots: "{ icon?, label?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        icon: "Chip icon content",
        iconRight: "Chip right icon content",
        label: "Chip label content",
        default: "Fallback content"
      },
      events: {
        onRemove: "MouseEvent"
      },
      returns: "HTMLSpanElement",
      description: "Chip con icona opzionale e rimozione."
    };
  }
  // Esempio: CMSwift.ui.Chip({ label: "Tag", removable: true })

  const overlayAnimDuration = (el, fallback = 180) => {
    const d = getComputedStyle(el).transitionDuration;
    if (!d) return fallback;
    const first = d.split(",")[0].trim();
    if (!first) return fallback;
    const ms = first.includes("ms") ? parseFloat(first) : parseFloat(first) * 1000;
    return Number.isFinite(ms) ? ms : fallback;
  };

  const overlayEnter = (entry) => {
    if (!entry?.overlay || !entry?.panel) return;
    entry.overlay.classList.add("enter");
    entry.panel.classList.add("enter");
    requestAnimationFrame(() => {
      if (!entry?.overlay || !entry?.panel) return;
      entry.overlay.classList.add("entered");
      entry.panel.classList.add("entered");
      entry.overlay.classList.remove("enter");
      entry.panel.classList.remove("enter");
    });
  };

  const overlayLeave = (entry, done) => {
    if (!entry?.overlay || !entry?.panel) {
      done?.();
      return;
    }
    if (entry._closing) return;
    entry._closing = true;
    entry.overlay.classList.add("leave");
    entry.panel.classList.add("leave");
    const finish = () => {
      if (entry._closed) return;
      entry._closed = true;
      done?.();
    };
    const onEnd = (e) => {
      if (e.target !== entry.panel) return;
      entry.panel.removeEventListener("transitionend", onEnd);
      finish();
    };
    entry.panel.addEventListener("transitionend", onEnd);
    const ms = overlayAnimDuration(entry.panel, 180);
    setTimeout(finish, ms + 40);
  };

  UI.Tooltip = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    let entry = null;
    let openTimer = null;
    let closeTimer = null;
    let boundEl = null;
    const hasOwn = (key) => Object.prototype.hasOwnProperty.call(props, key);
    const hasExternalTarget = hasOwn("target") || hasOwn("anchorEl") || hasOwn("triggerEl");
    const targetNode = props.target || props.anchorEl || props.triggerEl || (children && children.length ? children[0] : null);

    const getNumber = (value, fallback) => {
      const raw = uiUnwrap(value);
      if (raw == null || raw === "") return fallback;
      const n = Number(raw);
      return Number.isFinite(n) ? n : fallback;
    };
    const clearTimers = () => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
      openTimer = null;
      closeTimer = null;
    };
    const getDelay = () => getNumber(props.delay, 350);
    const getHideDelay = () => getNumber(props.hideDelay, uiUnwrap(props.interactive) ? 120 : 0);
    const closeNow = () => {
      clearTimers();
      if (!entry) return;
      const toClose = entry;
      entry = null;
      overlayLeave(toClose, () => CMSwift.overlay.close(toClose.id));
    };
    const parseTriggers = (value) => {
      if (value == null || value === true) return new Set(["hover", "focus"]);
      if (value === false) return new Set(["manual"]);
      const raw = Array.isArray(value) ? value : String(value).split(/[\s,|/]+/);
      const out = new Set();
      raw.forEach((item) => {
        const key = String(item || "").trim().toLowerCase();
        if (!key) return;
        if (key === "mouseenter" || key === "mouseover") out.add("hover");
        else if (key === "blur" || key === "focusin") out.add("focus");
        else if (key === "tap") out.add("click");
        else out.add(key);
      });
      return out.size ? out : new Set(["manual"]);
    };
    const triggers = parseTriggers(props.trigger ?? props.triggers ?? (hasOwn("open") ? "manual" : null));
    const allowHover = triggers.has("hover");
    const allowFocus = triggers.has("focus");
    const allowClick = triggers.has("click");
    const isManual = triggers.has("manual") || (!allowHover && !allowFocus && !allowClick);

    const buildContent = () => {
      const ctx = {
        anchorEl: boundEl || targetNode || null,
        close: () => closeNow(),
        hide: () => closeNow(),
        isOpen: () => !!entry
      };
      const iconFallback = props.icon
        ? (typeof props.icon === "string"
          ? UI.Icon({ name: props.icon, size: props.iconSize || props.size || "sm" })
          : CMSwift.ui.slot(props.icon, { as: "icon" }))
        : null;
      const titleNodes = renderSlotToArray(slots, "title", ctx, props.title ?? props.heading);
      const iconNodes = renderSlotToArray(slots, "icon", ctx, iconFallback);
      const footerNodes = renderSlotToArray(slots, "footer", ctx, props.footer ?? props.actions);

      let bodyRaw = props.content ?? props.text ?? props.body ?? props.description ?? props.label;
      if (bodyRaw == null) {
        if (hasExternalTarget) bodyRaw = children;
        else if (targetNode && children && children.length > 1) bodyRaw = children.slice(1);
        else if (!targetNode) bodyRaw = children;
      }
      let bodyNodes = renderSlotToArray(slots, "content", ctx, bodyRaw);
      if (!bodyNodes.length) bodyNodes = renderSlotToArray(slots, "default", ctx, bodyRaw);

      const bodyEl = bodyNodes.length ? _.div({ class: "cms-tooltip-body" }, ...bodyNodes) : null;
      const headEl = (iconNodes.length || titleNodes.length)
        ? _.div(
          { class: "cms-tooltip-head" },
          iconNodes.length ? _.div({ class: "cms-tooltip-icon" }, ...iconNodes) : null,
          _.div(
            { class: "cms-tooltip-head-main" },
            titleNodes.length ? _.div({ class: "cms-tooltip-title" }, ...titleNodes) : null,
            bodyEl
          )
        )
        : bodyEl;
      const footerEl = footerNodes.length ? _.div({ class: "cms-tooltip-footer" }, ...footerNodes) : null;

      return _.div({ class: "cms-tooltip-content" }, ...[headEl, footerEl].filter(Boolean));
    };

    const open = (anchorEl) => {
      const anchor = anchorEl || boundEl;
      if (!anchor || uiUnwrap(props.disabled)) return null;
      if (entry && entry._anchorEl === anchor) return entry;
      if (entry) closeNow();
      const shouldCloseOnOutside = props.closeOnOutside ?? (allowClick || uiUnwrap(props.interactive));
      const shouldCloseOnEsc = props.closeOnEsc ?? (allowClick || uiUnwrap(props.interactive));
      let currentRef = null;
      entry = CMSwift.overlay.open(() => buildContent(), {
        type: "tooltip",
        anchorEl: anchor,
        placement: props.placement || "top",
        offsetX: props.offsetX ?? 0,
        offsetY: props.offsetY ?? props.offset ?? 8,
        backdrop: false,
        lockScroll: false,
        trapFocus: false,
        closeOnOutside: shouldCloseOnOutside,
        closeOnBackdrop: false,
        closeOnEsc: shouldCloseOnEsc,
        autoFocus: false,
        className: uiClassStatic([
          "cms-tooltip",
          uiWhen(props.interactive, "interactive"),
          props.class,
          props.panelClass
        ]),
        onClose: () => {
          currentRef?._tooltipCleanup?.();
          if (entry === currentRef) entry = null;
          props.onClose?.();
        }
      });
      if (!entry?.panel) return entry;
      const current = entry;
      currentRef = current;
      current._anchorEl = anchor;
      current.panel.dataset.placement = String(uiUnwrap(props.placement || "top"));
      if (props.maxWidth != null) current.panel.style.maxWidth = toCssSize(uiUnwrap(props.maxWidth));
      if (props.minWidth != null) current.panel.style.minWidth = toCssSize(uiUnwrap(props.minWidth));
      if (props.width != null) current.panel.style.width = toCssSize(uiUnwrap(props.width));
      if (props.style) Object.assign(current.panel.style, props.style);
      setPropertyProps(current.panel, props);
      if (uiUnwrap(props.interactive)) {
        const cancelHide = () => {
          clearTimeout(closeTimer);
          closeTimer = null;
        };
        const scheduleHide = () => hide();
        const onPanelClick = (e) => {
          const target = e.target;
          if (target && target.closest && target.closest("[data-tooltip-close]")) {
            closeNow();
          }
        };
        current.panel.addEventListener("mouseenter", cancelHide);
        current.panel.addEventListener("mouseleave", scheduleHide);
        current.panel.addEventListener("focusin", cancelHide);
        current.panel.addEventListener("focusout", scheduleHide);
        current.panel.addEventListener("click", onPanelClick);
        current._tooltipCleanup = () => {
          current.panel?.removeEventListener("mouseenter", cancelHide);
          current.panel?.removeEventListener("mouseleave", scheduleHide);
          current.panel?.removeEventListener("focusin", cancelHide);
          current.panel?.removeEventListener("focusout", scheduleHide);
          current.panel?.removeEventListener("click", onPanelClick);
        };
      }
      overlayEnter(current);
      props.onOpen?.(current);
      return current;
    };

    const show = (anchorEl) => {
      clearTimeout(closeTimer);
      closeTimer = null;
      clearTimeout(openTimer);
      openTimer = setTimeout(() => open(anchorEl), getDelay());
    };

    const hide = (immediate = false) => {
      clearTimeout(openTimer);
      openTimer = null;
      if (!entry) return;
      clearTimeout(closeTimer);
      if (immediate) {
        closeNow();
        return;
      }
      closeTimer = setTimeout(() => closeNow(), getHideDelay());
    };
    const toggle = (anchorEl) => {
      if (entry) hide(true);
      else open(anchorEl);
    };
    const isOpen = () => !!entry;

    const bind = (el) => {
      if (!el) return () => { };
      boundEl = el;
      const cleanups = [];
      const cleanup = () => {
        clearTimers();
        cleanups.forEach((fn) => fn());
      };
      if (hasOwn("open")) {
        if (uiIsReactive(props.open)) {
          CMSwift.reactive.effect(() => {
            if (!boundEl) return;
            if (uiUnwrap(props.open)) open(boundEl);
            else hide(true);
          }, "UI.Tooltip:open");
        } else if (props.open === true) {
          open(el);
        } else if (props.open === false) {
          hide(true);
        }
        return cleanup;
      }
      if (isManual || uiUnwrap(props.disabled)) return cleanup;
      if (allowHover) {
        const onEnter = () => show(el);
        const onLeave = () => hide();
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          el.removeEventListener("mouseenter", onEnter);
          el.removeEventListener("mouseleave", onLeave);
        });
      }
      if (allowFocus) {
        const onFocus = () => show(el);
        const onBlur = () => hide();
        el.addEventListener("focus", onFocus);
        el.addEventListener("blur", onBlur);
        cleanups.push(() => {
          el.removeEventListener("focus", onFocus);
          el.removeEventListener("blur", onBlur);
        });
      }
      if (allowClick) {
        const onClick = (e) => {
          props.onTriggerClick?.(e);
          if (e.defaultPrevented) return;
          toggle(el);
        };
        el.addEventListener("click", onClick);
        cleanups.push(() => el.removeEventListener("click", onClick));
      }
      return cleanup;
    };

    if (targetNode) {
      const cls = uiClass(["cms-tooltip-wrap", props.wrapClass, props.targetClass]);
      const p = CMSwift.omit(props, [
        "actions", "anchorEl", "body", "closeOnEsc", "closeOnOutside", "content", "delay", "description",
        "disabled", "footer", "heading", "hideDelay", "icon", "iconSize", "interactive", "label",
        "maxWidth", "minWidth", "offset", "offsetX", "offsetY", "onClose", "onOpen", "onTriggerClick",
        "open", "panelClass", "placement", "slots", "style", "target", "targetClass", "targetStyle",
        "text", "title", "trigger", "triggerEl", "triggers", "width", "wrapClass", "wrapStyle"
      ]);
      p.class = cls;
      p.style = { display: "inline-flex", alignItems: "center", ...(props.wrapStyle || props.targetStyle || {}) };
      const target = CMSwift.ui.renderSlot(slots, "target", {
        open: () => open(boundEl),
        show: () => show(boundEl),
        hide: () => hide(true),
        toggle: () => toggle(boundEl),
        isOpen
      }, targetNode);
      const wrap = _.span(p, ...renderSlotToArray(null, "default", {}, target));
      bind(wrap);
      wrap._tooltip = { bind, open, show, hide, close: closeNow, toggle, isOpen };
      return wrap;
    }

    return { bind, open, show, hide, close: closeNow, toggle, isOpen };
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Tooltip = {
      signature: "UI.Tooltip(props, target?) | UI.Tooltip(target, content)",
      props: {
        title: "String|Node|Function|Array",
        content: "String|Node|Function|Array",
        text: "String|Node|Function|Array",
        body: "String|Node|Function|Array",
        footer: "String|Node|Function|Array",
        icon: "String|Node|Function|Array",
        target: "Node|Function|Array",
        trigger: "\"hover focus\" | \"click\" | \"manual\" | Array",
        interactive: "boolean",
        disabled: "boolean",
        open: "boolean | reactive",
        placement: "string",
        delay: "number",
        hideDelay: "number",
        offset: "number (legacy)",
        offsetX: "number",
        offsetY: "number",
        closeOnOutside: "boolean",
        closeOnEsc: "boolean",
        maxWidth: "string|number",
        minWidth: "string|number",
        width: "string|number",
        slots: "{ target?, icon?, title?, content?, footer?, default? }",
        class: "string",
        panelClass: "string",
        wrapClass: "string",
        style: "object",
        targetStyle: "object"
      },
      slots: {
        target: "Tooltip trigger content ({ open, show, hide, toggle, isOpen })",
        icon: "Tooltip icon content",
        title: "Tooltip title content",
        content: "Tooltip body content ({ close, hide, isOpen, anchorEl })",
        footer: "Tooltip footer content ({ close, hide, isOpen, anchorEl })",
        default: "Fallback tooltip body content"
      },
      events: {
        onOpen: "(entry) => void",
        onClose: "() => void",
        onTriggerClick: "(event) => void"
      },
      returns: "Object { bind(), open(), show(), hide(), close(), toggle(), isOpen() } | HTMLSpanElement",
      description: "Tooltip ancorato con trigger hover/focus/click, contenuto ricco e API imperativa."
    };
  }
  // Esempio: CMSwift.ui.Tooltip({ title: "Info", text: "Dettaglio rapido" }, CMSwift.ui.Icon({ name: "info" }))

  const isUIPlainObject = (value) => value && typeof value === "object" && !value.nodeType && !Array.isArray(value) && !(value instanceof Function);
  const isListItemNode = (value) => value && value.nodeType === 1 && String(value.tagName || "").toLowerCase() === "li";
  const asNodeArray = (value) => {
    if (value == null || value === false || value === "") return [];
    return Array.isArray(value) ? value : [value];
  };

  UI.List = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const ordered = !!uiUnwrap(props.number ?? props.ordered);
    const marker = uiUnwrap(props.marker);
    const itemSource = uiUnwrap(props.items);
    const items = Array.isArray(itemSource) ? itemSource : (itemSource == null ? [] : [itemSource]);

    const buildItemProps = (entryProps = {}) => {
      const baseProps = props.itemProps || {};
      const merged = { ...baseProps, ...entryProps };
      if (props.divider != null && merged.divider == null) merged.divider = props.divider;
      merged.class = uiClass([baseProps.class, props.itemClass, entryProps.class]);
      merged.style = {
        ...(baseProps.style || {}),
        ...(props.itemStyle || {}),
        ...(entryProps.style || {})
      };
      return merged;
    };

    const normalizeResolvedNode = (value) => {
      if (value == null || value === false) return [];
      if (isListItemNode(value)) return [value];
      if (isUIPlainObject(value)) {
        const itemChildren = value.children != null
          ? asNodeArray(value.children)
          : (value.content != null
            ? asNodeArray(value.content)
            : asNodeArray(value.node));
        return [UI.Item(buildItemProps(value), ...itemChildren)];
      }
      if (Array.isArray(value)) {
        return [UI.Item(buildItemProps(), ...value)];
      }
      if (value?.nodeType) {
        return [UI.Item(buildItemProps(), value)];
      }
      return [UI.Item(buildItemProps(), value)];
    };

    const normalizeItemNode = (value, index, total, useItemSlot = true) => {
      if (value == null || value === false) return [];
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
          return slotted.flatMap((node) => normalizeResolvedNode(node));
        }
      }
      return normalizeResolvedNode(value);
    };

    const content = [];
    items.forEach((item, index) => {
      content.push(...normalizeItemNode(item, index, items.length));
    });

    const defaultNodes = renderSlotToArray(slots, "default", { items, count: items.length }, children);
    defaultNodes.forEach((node, index) => {
      content.push(...normalizeItemNode(node, items.length + index, items.length + defaultNodes.length, false));
    });

    if (!content.length) {
      const emptyNodes = renderSlotToArray(slots, "empty", { items, count: 0 }, props.empty);
      if (emptyNodes.length) {
        if (emptyNodes.length === 1 && isListItemNode(emptyNodes[0])) {
          content.push(emptyNodes[0]);
        } else {
          content.push(UI.Item({ class: "cms-item-empty", flat: true }, ...emptyNodes));
        }
      }
    }

    const cls = uiClass([
      "cms-list",
      uiWhen(props.dense, "dense"),
      uiWhen(props.divider, "divider"),
      uiWhen(marker === false || marker === "none", "cms-list-no-marker"),
      props.class
    ]);
    const p = CMSwift.omit(props, [
      "dense", "divider", "slots", "number", "ordered", "items", "itemClass", "itemStyle", "itemProps",
      "empty", "marker", "gap"
    ]);
    p.class = cls;
    p.style = {
      ...(props.style || {})
    };
    const gap = uiStyleValue(props.gap, toCssSize);
    if (gap != null) p.style["--cms-list-gap"] = gap;
    if (marker != null && marker !== false && marker !== true && marker !== "none") {
      p.style.listStyleType = String(marker);
    }

    return _[ordered ? "ol" : "ul"](p, ...content);
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.List = {
      signature: "UI.List(...children) | UI.List(props, ...children)",
      props: {
        items: "Array<Node|Object|string>",
        ordered: "boolean",
        number: "boolean",
        marker: "boolean|string",
        dense: "boolean",
        divider: "boolean",
        gap: "string|number",
        empty: "String|Node|Function|Array",
        itemClass: "string",
        itemStyle: "object",
        itemProps: "object",
        slots: "{ default?, item?, empty? }",
        class: "string",
        style: "object"
      },
      slots: {
        default: "List content fallback",
        item: "Render custom di ogni item ({ item, index, count, first, last })",
        empty: "Empty state content"
      },
      returns: "HTMLUListElement|HTMLOListElement",
      description: "Lista dichiarativa con supporto items, slot item, ordered/marker ed empty state."
    };
  }
  // Esempio: CMSwift.ui.List({}, CMSwift.ui.Item({}, "Item"))

  UI.Item = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    if (props.state != null && props.color == null) props.color = props.state;
    applyCommonProps(props);
    const slots = props.slots || {};
    const interactive = uiComputed([props.clickable, props.to], () => !!(uiUnwrap(props.clickable) || uiUnwrap(props.to)));
    const active = uiComputed([props.active, props.selected], () => !!(uiUnwrap(props.active) || uiUnwrap(props.selected)));
    const hasSurface = !!(
      props.color != null || props.outline || props.border || props.glossy || props.glow || props.glass ||
      props.shadow || props.gradient || props.textGradient || props.lightShadow || props.radius ||
      props.rounded || props.flat
    );

    const resolveIcon = (value, size, as) => {
      const raw = uiUnwrap(value);
      if (raw == null || raw === false || raw === "") return null;
      if (typeof raw === "string") return UI.Icon({ name: raw, size: size || "sm" });
      return CMSwift.ui.slot(raw, { as });
    };

    const iconNodes = renderSlotToArray(slots, "icon", {}, resolveIcon(props.icon, props.iconSize || props.size, "icon"));
    const titleNodes = renderSlotToArray(slots, "title", {}, props.title ?? props.label);
    const subtitleNodes = renderSlotToArray(slots, "subtitle", {}, props.subtitle ?? props.caption ?? props.description);
    const metaNodes = renderSlotToArray(slots, "meta", {}, props.meta ?? props.eyebrow);
    const bodyNodes = renderSlotToArray(slots, "body", {}, props.body ?? props.content);
    const defaultNodes = renderSlotToArray(slots, "default", {}, children);
    const actionsNodes = renderSlotToArray(slots, "actions", {}, props.actions ?? props.footer);
    const asideFallback = props.aside ?? props.trailing ?? resolveIcon(props.iconRight, props.iconSize || props.size, "iconRight");
    const asideNodes = renderSlotToArray(slots, "aside", {}, asideFallback);

    const mergedBodyNodes = [...bodyNodes, ...defaultNodes];
    const isInline = !(
      hasSurface || props.clickable || props.to || iconNodes.length || titleNodes.length ||
      subtitleNodes.length || metaNodes.length || actionsNodes.length || asideNodes.length ||
      bodyNodes.length
    );

    const cls = uiClass([
      "cms-item",
      uiWhen(props.divider, "divider"),
      uiWhen(hasSurface, "cms-clear-set"),
      uiWhen(hasSurface, "cms-singularity"),
      uiWhen(hasSurface, "cms-item-surface"),
      uiWhen(isInline, "cms-item-inline"),
      uiWhen(interactive, "cms-item-clickable"),
      uiWhen(active, "is-active"),
      uiWhen(props.disabled, "is-disabled"),
      props.class
    ]);
    const p = CMSwift.omit(props, [
      "divider", "slots", "label", "title", "subtitle", "caption", "description", "meta", "eyebrow",
      "body", "content", "children", "node", "icon", "iconRight", "iconSize", "aside", "trailing",
      "actions", "footer", "clickable", "to", "active", "selected", "disabled", "state",
      "color", "size", "outline", "flat", "border", "glossy", "glow", "glass", "gradient",
      "textGradient", "lightShadow", "shadow", "rounded", "radius", "textColor", "dense"
    ]);
    p.class = cls;
    p.style = {
      ...(props.style || {})
    };

    const userOnClick = props.onClick;
    const userOnKeydown = props.onKeydown;
    const onClick = (e) => {
      userOnClick?.(e);
      if (e.defaultPrevented || uiUnwrap(props.disabled)) return;
      const to = uiUnwrap(props.to);
      if (to && CMSwift.router?.navigate) {
        e.preventDefault();
        CMSwift.router.navigate(to);
      }
    };
    const onKeydown = (e) => {
      userOnKeydown?.(e);
      if (e.defaultPrevented || uiUnwrap(props.disabled)) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick(e);
      }
    };
    if (uiUnwrap(props.disabled)) {
      p["aria-disabled"] = "true";
    }
    if (uiUnwrap(props.clickable) || uiUnwrap(props.to)) {
      p.onClick = onClick;
      p.onKeydown = onKeydown;
      if (p.tabIndex == null) p.tabIndex = uiUnwrap(props.disabled) ? -1 : 0;
      if (p.role == null) p.role = "button";
    }

    const titleSection = titleNodes.length ? _.div({ class: "cms-item-title" }, ...titleNodes) : null;
    const subtitleSection = subtitleNodes.length ? _.div({ class: "cms-item-subtitle" }, ...subtitleNodes) : null;
    const metaSection = metaNodes.length ? _.div({ class: "cms-item-meta" }, ...metaNodes) : null;
    const bodySection = mergedBodyNodes.length
      ? _.div({ class: uiClass(["cms-item-body", uiWhen(!(titleNodes.length || subtitleNodes.length || metaNodes.length), "is-standalone")]) }, ...mergedBodyNodes)
      : null;
    const actionsSection = actionsNodes.length ? _.div({ class: "cms-item-actions" }, ...actionsNodes) : null;

    const item = _.li(
      p,
      _.div(
        { class: "cms-item-row" },
        iconNodes.length ? _.div({ class: "cms-item-icon" }, ...iconNodes) : null,
        _.div(
          { class: "cms-item-main" },
          metaSection,
          titleSection,
          subtitleSection,
          bodySection,
          actionsSection
        ),
        asideNodes.length ? _.div({ class: "cms-item-aside" }, ...asideNodes) : null
      )
    );
    setPropertyProps(item, props);
    return item;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Item = {
      signature: "UI.Item(...children) | UI.Item(props, ...children)",
      props: {
        label: "String|Node|Function|Array",
        title: "String|Node|Function|Array",
        subtitle: "String|Node|Function|Array",
        meta: "String|Node|Function|Array",
        body: "String|Node|Function|Array",
        icon: "String|Node|Function|Array",
        iconRight: "String|Node|Function|Array",
        aside: "Node|Function|Array",
        actions: "Node|Function|Array",
        clickable: "boolean",
        to: "string",
        active: "boolean",
        selected: "boolean",
        disabled: "boolean",
        color: "string",
        state: "Alias di color",
        size: "string|number",
        outline: "boolean",
        shadow: "boolean|string",
        lightShadow: "boolean",
        border: "boolean",
        glossy: "boolean",
        glow: "boolean",
        glass: "boolean",
        gradient: "boolean|number",
        textGradient: "boolean",
        radius: "string|number",
        divider: "boolean",
        slots: "{ icon?, title?, subtitle?, meta?, body?, aside?, actions?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        icon: "Leading visual/icon",
        title: "Main title content",
        subtitle: "Secondary text",
        meta: "Top meta content",
        body: "Body content",
        aside: "Trailing content",
        actions: "Actions row",
        default: "Fallback body content"
      },
      returns: "HTMLLIElement",
      description: "Item strutturato per liste semplici, feed, task list e righe cliccabili."
    };
  }
  // Esempio: CMSwift.ui.Item({}, "Elemento")

  UI.Separator = (...args) => {
    const { props } = CMSwift.uiNormalizeArgs(args);
    const cls = uiClass(["cms-separator", uiWhen(props.vertical, "vertical"), props.class]);
    const p = CMSwift.omit(props, ["vertical", "size", "slots"]);
    p.class = cls;
    const style = { borderColor: "var(--cms-border)", ...(props.style || {}) };
    const sizeValue = uiUnwrap(props.size);
    const vertical = uiUnwrap(props.vertical);
    if (sizeValue != null) {
      const size = toCssSize(sizeValue);
      if (vertical) style.width = size;
      else style.height = size;
    }
    p.style = style;
    return _.hr(p);
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Separator = {
      signature: "UI.Separator() | UI.Separator(props)",
      props: {
        vertical: "boolean",
        size: "string|number",
        slots: "{ default? }",
        class: "string",
        style: "object"
      },
      slots: {
        default: "Unused (separator has no content)"
      },
      returns: "HTMLHRElement",
      description: "Separatore orizzontale o verticale."
    };
  }
  // Esempio: CMSwift.ui.Separator()

  const buildChoiceControl = (type, args, options = {}) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const isRadio = type === "radio";
    const isToggle = options.appearance === "toggle";
    const supportsStandby = !isRadio;
    const id = props.id || (`cms-${type}-` + Math.random().toString(36).slice(2));
    const model = resolveModel(
      props.model,
      options.modelName || (isRadio ? "UI.Radio:model" : "UI.Checkbox:model")
    );

    const inputProps = CMSwift.omit(props, [
      "model", "label", "checked", "class", "style", "dense", "onChange", "onInput", "slots",
      "icon", "iconOn", "iconOff", "iconStandby", "checkedIcon", "uncheckedIcon", "standbyIcon",
      "indeterminateIcon", "inputClass", "iconSize", "color", "size", "outline", "behavior", "mode",
      "flat", "glossy", "glow", "glass", "gradient", "textGradient", "lightShadow", "shadow",
      "rounded", "radius", "textColor", "clickable", "border"
    ]);
    inputProps.type = type;
    inputProps.id = id;
    if (isRadio && props.name != null) inputProps.name = props.name;
    inputProps.class = uiClass([`cms-${type}`, "cms-choice-input", props.inputClass]);
    const input = _.input(inputProps);

    const labelNodes = renderSlotToArray(slots, "label", {}, props.label);
    const labelContent = labelNodes.length ? labelNodes : renderSlotToArray(slots, "default", {}, children);

    const wrapProps = CMSwift.omit(props, [
      "model", "label", "checked", "onChange", "onInput", "value", "name", "id", "type", "dense",
      "inputClass", "slots", "icon", "iconOn", "iconOff", "iconStandby", "checkedIcon",
      "uncheckedIcon", "standbyIcon", "indeterminateIcon", "iconSize", "color", "size", "behavior",
      "mode",
      "outline", "flat", "glossy", "glow", "glass", "gradient", "textGradient", "lightShadow",
      "shadow", "rounded", "radius", "textColor", "clickable", "border"
    ]);
    wrapProps.class = uiClass([
      "cms-clear-set",
      "cms-singularity-check",
      "cms-choice-wrap",
      `cms-${type}-wrap`,
      uiWhen(isToggle, "cms-toggle-wrap"),
      uiWhen(isToggle && isRadio, "cms-toggle-radio-wrap"),
      uiWhen(isToggle && !isRadio, "cms-toggle-checkbox-wrap"),
      uiWhen(props.dense, "dense"),
      props.class
    ]);
    wrapProps.style = { ...(props.style || {}) };

    const sizeValue = uiUnwrap(props.size);
    if (sizeValue != null && !(typeof sizeValue === "string" && CMSwift.uiSizes?.includes(sizeValue))) {
      wrapProps.style["--cms-choice-size"] = toCssSize(sizeValue);
    }

    const marker = _.span({
      class: uiClass([
        "cms-choice-mark",
        isRadio ? "cms-choice-radio-mark" : "cms-choice-checkbox-mark",
        uiWhen(isToggle, "cms-toggle-mark")
      ])
    });
    const indicatorHost = isToggle ? _.span({ class: "cms-toggle-thumb" }) : marker;
    if (isToggle) marker.appendChild(indicatorHost);
    const labelNode = labelContent.length ? _.span({ class: "cms-choice-label" }, ...labelContent) : null;

    const wrap = _.label(
      wrapProps,
      input,
      marker,
      labelNode
    );
    setPropertyProps(wrap, props);

    const iconSize = props.iconSize ? props.iconSize : props.size;
    const defaultCheckedIcon = isToggle ? null : (isRadio ? "radio_button_checked" : "check");
    const defaultUncheckedIcon = isToggle ? null : (isRadio ? "radio_button_unchecked" : null);
    const defaultStandbyIcon = isToggle || isRadio ? null : "indeterminate_check_box";
    const setInputState = (value) => {
      if (isRadio) {
        input.checked = value == props.value;
        return input.checked;
      }
      const normalized = value == null ? null : !!value;
      input.checked = normalized === true;
      input.indeterminate = supportsStandby && normalized == null;
      return normalized;
    };
    const getInputState = () => {
      if (!isRadio && supportsStandby && input.indeterminate) return null;
      return !!input.checked;
    };
    const resolveIconSource = (state) => {
      if (state === true) {
        if (props.checkedIcon != null) return props.checkedIcon;
        if (props.icon != null) return props.icon;
        return defaultCheckedIcon;
      }
      if (state === false) {
        if (props.uncheckedIcon != null) return props.uncheckedIcon;
        return defaultUncheckedIcon;
      }
      if (props.indeterminateIcon != null) return props.indeterminateIcon;
      if (props.standbyIcon != null) return props.standbyIcon;
      if (props.iconStandby != null) return props.iconStandby;
      return defaultStandbyIcon;
    };

    const syncIndicator = () => {
      const state = getInputState();
      const checked = state === true;
      while (indicatorHost.firstChild) indicatorHost.removeChild(indicatorHost.firstChild);
      wrap.classList.toggle("is-checked", checked);
      wrap.classList.toggle("is-indeterminate", state == null);
      wrap.classList.toggle("is-disabled", !!input.disabled);
      if (checked && (props.checkedIcon || props.icon)) {
        wrap.classList.toggle("toggle-default", false);
      } else if (checked && !props.checkedIcon) {
        wrap.classList.toggle("toggle-default", true);
      } else if (state == null && !props.standbyIcon) {
        wrap.classList.toggle("toggle-default", true);
      } else if (state == null && props.standbyIcon) {
        wrap.classList.toggle("toggle-default", false);
      } else if (input.disabled === false && !props.uncheckedIcon) {
        wrap.classList.toggle("toggle-default", true);
      } else {
        wrap.classList.toggle("toggle-default", false);
      }

      if (isToggle) {
        if (state == null) {
          indicatorHost.style.transform = "translateX(calc((var(--cms-toggle-width) - var(--cms-toggle-thumb-size) - 1px) / 2))";
        } else {
          indicatorHost.style.removeProperty("transform");
        }
      }

      const ctx = { checked, state, indeterminate: state == null, value: props.value, id, type };
      let iconNode = null;
      if (state === true) {
        iconNode = CMSwift.ui.renderSlot(slots, "checkedIcon", ctx, null);
        if (iconNode == null) iconNode = CMSwift.ui.renderSlot(slots, "iconOn", ctx, null);
      } else if (state === false) {
        iconNode = CMSwift.ui.renderSlot(slots, "uncheckedIcon", ctx, null);
        if (iconNode == null) iconNode = CMSwift.ui.renderSlot(slots, "iconOff", ctx, null);
      } else {
        iconNode = CMSwift.ui.renderSlot(slots, "indeterminateIcon", ctx, null);
        if (iconNode == null) iconNode = CMSwift.ui.renderSlot(slots, "standbyIcon", ctx, null);
        if (iconNode == null) iconNode = CMSwift.ui.renderSlot(slots, "iconStandby", ctx, null);
      }
      if (iconNode == null) iconNode = CMSwift.ui.renderSlot(slots, "icon", ctx, null);
      if (iconNode == null) {
        const source = resolveIconSource(state);
        if (typeof source === "string") iconNode = UI.Icon({ name: source, size: iconSize, ...(isToggle ? { textColor: props.color, outline: true } : {}) });
        else if (source != null) {
          iconNode = CMSwift.ui.slot(source, {
            checked,
            state,
            indeterminate: state == null,
            as: state === true ? "checkedIcon" : (state === false ? "uncheckedIcon" : "indeterminateIcon")
          });
        }
      }
      renderSlotToArray(null, "default", {}, iconNode).forEach((n) => indicatorHost.appendChild(n));
    };

    if (model) {
      setInputState(model.get());
      model.watch((v) => {
        setInputState(v);
        syncIndicator();
      }, isRadio ? "UI.Radio:watch" : "UI.Checkbox:watch");
      input.addEventListener("change", (e) => {
        if (isRadio) {
          if (input.checked) {
            model.set(props.value);
            props.onChange?.(props.value, e);
          }
        } else {
          const nextState = getInputState();
          model.set(nextState);
          props.onChange?.(nextState, e);
        }
        syncIndicator();
      });
    } else {
      setInputState(isRadio ? (props.checked === true ? props.value : undefined) : props.checked);
      input.addEventListener("change", (e) => {
        if (isRadio) props.onChange?.(props.value, e);
        else props.onChange?.(getInputState(), e);
        syncIndicator();
      });
    }
    if (props.onInput) {
      input.addEventListener("input", (e) => {
        if (isRadio) props.onInput?.(props.value, e);
        else props.onInput?.(getInputState(), e);
      });
    }

    syncIndicator();
    return wrap;
  };

  UI.Checkbox = (...args) => buildChoiceControl("checkbox", args);
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Checkbox = {
      signature: "UI.Checkbox(...children) | UI.Checkbox(props, ...children)",
      props: {
        label: "String|Node|Function|Array",
        checked: "boolean|null",
        model: "[get,set] signal",
        icon: "String|Node|Function|Array",
        iconOn: "Alias di icon/checkedIcon",
        iconOff: "Alias di uncheckedIcon",
        iconStandby: "Icona per stato null/indeterminate",
        checkedIcon: "String|Node|Function|Array",
        uncheckedIcon: "String|Node|Function|Array",
        color: "string",
        size: "string|number",
        outline: "boolean",
        dense: "boolean",
        slots: "{ label?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        label: "Checkbox label",
        icon: "Base icon content",
        iconStandby: "Slot for null/indeterminate icon",
        checkedIcon: "Icon when checked",
        uncheckedIcon: "Icon when unchecked",
        default: "Fallback label content"
      },
      events: {
        onChange: "(checked|null, event)",
        onInput: "(checked|null, event)"
      },
      returns: "HTMLLabelElement",
      description: "Checkbox con label e supporto model."
    };
  }
  // Esempio: CMSwift.ui.Checkbox({ label: "Accetto", model: [get,set] })

  UI.Radio = (...args) => buildChoiceControl("radio", args);
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Radio = {
      signature: "UI.Radio(...children) | UI.Radio(props, ...children)",
      props: {
        label: "String|Node|Function|Array",
        value: "any",
        name: "string",
        checked: "boolean|null",
        model: "[get,set] signal",
        icon: "String|Node|Function|Array",
        iconOn: "Alias di icon/checkedIcon",
        iconOff: "Alias di uncheckedIcon",
        checkedIcon: "String|Node|Function|Array",
        uncheckedIcon: "String|Node|Function|Array",
        color: "string",
        size: "string|number",
        outline: "boolean",
        dense: "boolean",
        slots: "{ label?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        label: "Radio label",
        icon: "Base icon content",
        iconOn: "Alias slot for checked icon",
        iconOff: "Alias slot for unchecked icon",
        checkedIcon: "Icon when checked",
        uncheckedIcon: "Icon when unchecked",
        default: "Fallback label content"
      },
      events: {
        onChange: "(value, event)",
        onInput: "(value, event)"
      },
      returns: "HTMLLabelElement",
      description: "Radio con label e supporto model."
    };
  }
  // Esempio: CMSwift.ui.Radio({ name: "r1", value: "a", label: "A", model: [get,set] })

  UI.Toggle = (...args) => {
    const { props } = CMSwift.uiNormalizeArgs(args);
    const behavior = String(props.behavior ?? props.mode ?? props.type ?? "checkbox").toLowerCase() === "radio"
      ? "radio"
      : "checkbox";
    return buildChoiceControl(behavior, args, {
      appearance: "toggle",
      modelName: "UI.Toggle:model"
    });
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Toggle = {
      signature: "UI.Toggle(...children) | UI.Toggle(props, ...children)",
      props: {
        label: "String|Node|Function|Array",
        behavior: "\"checkbox\"|\"radio\"",
        mode: "Alias di behavior",
        value: "any",
        name: "string",
        checked: "boolean",
        model: "[get,set] signal",
        icon: "String|Node|Function|Array",
        iconOn: "Alias di icon/checkedIcon",
        iconOff: "Alias di uncheckedIcon",
        iconStandby: "Icona per stato null/indeterminate",
        checkedIcon: "String|Node|Function|Array",
        uncheckedIcon: "String|Node|Function|Array",
        color: "string",
        size: "string|number",
        dense: "boolean",
        slots: "{ label?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        label: "Toggle label",
        icon: "Base icon content",
        iconOn: "Alias slot for checked icon",
        iconOff: "Alias slot for unchecked icon",
        iconStandby: "Slot for null/indeterminate icon",
        checkedIcon: "Icon when checked",
        uncheckedIcon: "Icon when unchecked",
        default: "Fallback label content"
      },
      events: {
        onChange: "(checked|value, event)",
        onInput: "(checked|value, event)"
      },
      returns: "HTMLLabelElement",
      description: "Toggle switch con supporto model e comportamento checkbox/radio."
    };
  }
  // Esempio: CMSwift.ui.Toggle({ label: "Attivo", model: [get,set] })

  UI.Slider = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const boundValue = props.model || ((uiIsSignal(props.value) || uiIsRod(props.value)) ? props.value : null);
    const model = resolveModel(boundValue, "UI.Slider:model");

    const inputProps = CMSwift.omit(props, [
      "model", "value", "class", "style", "onChange", "onInput", "slots",
      "label", "icon", "iconRight", "thumbIcon", "iconThumb", "pointIcon",
      "markers", "markerLabels", "labelMarks", "leftLabel", "rightLabel",
      "startLabel", "endLabel", "minLabel", "maxLabel", "withQItem", "qitem",
      "item", "itemClass", "itemStyle", "showValue", "thumbLabel", "labelValue",
      "selectionColor", "trackColor", "thumbColor", "inputClass", "readonly"
    ]);
    inputProps.type = "range";
    inputProps.class = uiClass(["cms-slider-input", props.inputClass]);
    const input = _.input(inputProps);

    const wrap = _.label({
      class: uiClass([
        "cms-clear-set",
        "cms-singularity-check",
        "cms-slider-wrap",
        uiWhen(props.dense, "dense"),
        props.class
      ]),
      style: props.style
    });
    setPropertyProps(wrap, props);

    const header = _.div({
      class: "cms-slider-header"
    });
    const labelHost = _.span({
      class: "cms-slider-label"
    });
    const valueHost = _.span({
      class: "cms-slider-value"
    });
    header.append(labelHost, valueHost);

    const body = _.div({
      class: "cms-slider-body"
    });
    const startIconHost = _.span({
      class: "cms-slider-icon cms-slider-icon-left"
    });
    const startLabelHost = _.span({
      class: "cms-slider-edge-label cms-slider-edge-label-left"
    });
    const main = _.div({
      class: "cms-slider-main"
    });
    const sliderBox = _.div({
      class: "cms-slider-box"
    });
    const rail = _.span({
      class: "cms-slider-rail"
    });
    const selection = _.span({
      class: "cms-slider-selection"
    });
    const thumb = _.span({
      class: "cms-slider-thumb"
    });
    const thumbIconHost = _.span({
      class: "cms-slider-thumb-icon"
    });
    const thumbLabelHost = _.span({
      class: "cms-slider-thumb-label"
    });
    thumb.append(thumbLabelHost, thumbIconHost);

    const markersHost = _.div({
      class: "cms-slider-markers"
    });
    const endLabelHost = _.span({
      class: "cms-slider-edge-label cms-slider-edge-label-right"
    });
    const endIconHost = _.span({
      class: "cms-slider-icon cms-slider-icon-right"
    });

    sliderBox.append(rail, selection, thumb, input);
    main.append(sliderBox, markersHost);
    body.append(startIconHost, startLabelHost, main, endLabelHost, endIconHost);
    wrap.append(header, body);

    const clearHost = (host) => {
      while (host.firstChild) host.removeChild(host.firstChild);
    };
    const renderInto = (host, nodes, display = "") => {
      clearHost(host);
      (nodes || []).forEach((n) => host.appendChild(n));
      host.style.display = host.childNodes.length ? display : "none";
    };
    const unwrapSlotValue = (value) => (uiIsSignal(value) || uiIsRod(value) ? uiUnwrap(value) : value);
    const asArray = (value, ctx = {}) => slotToArray(unwrapSlotValue(value), ctx);
    const asIconArray = (value, as, ctx = {}) => {
      const resolved = unwrapSlotValue(value);
      if (resolved == null) return [];
      if (typeof resolved === "string") return [UI.Icon({ name: resolved, size: props.iconSize ?? props.size ?? 16 })];
      return asArray(resolved, { ...ctx, as });
    };
    const getNumber = (value, fallback) => {
      const next = Number(value);
      return Number.isFinite(next) ? next : fallback;
    };
    const getMin = () => getNumber(uiUnwrap(props.min), 0);
    const getMax = () => {
      const min = getMin();
      const max = getNumber(uiUnwrap(props.max), 100);
      return max < min ? min : max;
    };
    const getStep = () => {
      const raw = uiUnwrap(props.step);
      if (raw === "any") return "any";
      const step = getNumber(raw, 1);
      return step > 0 ? step : 1;
    };
    const getPrecision = (value) => {
      if (value === "any") return 0;
      const str = String(value);
      if (str.includes("e-")) return Number(str.split("e-")[1] || 0);
      const idx = str.indexOf(".");
      return idx === -1 ? 0 : str.length - idx - 1;
    };
    const normalizeValue = (value) => {
      const min = getMin();
      const max = getMax();
      const step = getStep();
      let next = getNumber(value, min);
      if (step !== "any") {
        next = min + Math.round((next - min) / step) * step;
        const precision = getPrecision(step);
        if (precision > 0) next = Number(next.toFixed(precision));
      }
      return Math.min(max, Math.max(min, next));
    };
    const ratioFromValue = (value) => {
      const min = getMin();
      const max = getMax();
      const span = max - min;
      if (!span) return 0;
      const raw = (normalizeValue(value) - min) / span;
      const ratio = uiUnwrap(props.reverse) ? (1 - raw) : raw;
      return Math.max(0, Math.min(1, ratio));
    };
    const [getValue, setValue] = CMSwift.reactive.signal(normalizeValue(
      model ? model.get() : (uiUnwrap(props.value) ?? uiUnwrap(props.min) ?? 0)
    ));

    const setSliderValue = (raw, opts = {}) => {
      const next = normalizeValue(raw);
      if (getValue() !== next) setValue(next);
      if (String(input.value) !== String(next)) input.value = String(next);
      if (model && opts.fromModel !== true) model.set(next);
      return next;
    };

    const getMarkerItems = () => {
      const raw = uiUnwrap(props.markers);
      const showLabels = !!uiUnwrap(props.markerLabels ?? props.labelMarks);
      if (!raw) return [];
      const min = getMin();
      const max = getMax();
      const normalizeMarker = (entry, index) => {
        if (entry == null) return null;
        if (typeof entry === "object" && !Array.isArray(entry)) {
          const value = normalizeValue(entry.value ?? entry.position ?? entry.at ?? min);
          return {
            key: entry.key ?? `marker-${index}-${value}`,
            value,
            label: entry.label ?? (showLabels ? String(value) : null),
            icon: entry.icon ?? null,
            className: entry.class ?? entry.className ?? ""
          };
        }
        const value = normalizeValue(entry);
        return {
          key: `marker-${index}-${value}`,
          value,
          label: showLabels ? String(entry) : null,
          icon: null,
          className: ""
        };
      };

      if (Array.isArray(raw)) {
        return raw.map((entry, index) => normalizeMarker(entry, index)).filter(Boolean);
      }
      if (typeof raw === "number" && raw > 1) {
        const count = Math.floor(raw);
        const stepValue = count > 1 ? (max - min) / (count - 1) : 0;
        return Array.from({ length: count }, (_, index) => normalizeMarker(min + (stepValue * index), index)).filter(Boolean);
      }
      if (raw === true) {
        const step = getStep();
        if (step === "any") {
          return [normalizeMarker(min, 0), normalizeMarker(max, 1)].filter(Boolean);
        }
        const count = Math.floor((max - min) / step) + 1;
        if (count > 24) {
          return [normalizeMarker(min, 0), normalizeMarker((min + max) / 2, 1), normalizeMarker(max, 2)].filter(Boolean);
        }
        return Array.from({ length: count }, (_, index) => normalizeMarker(min + (step * index), index)).filter(Boolean);
      }
      if (typeof raw === "object") {
        return Object.keys(raw).map((key, index) => normalizeMarker({
          value: Number(key),
          label: raw[key]
        }, index)).filter(Boolean);
      }
      return [];
    };

    const renderMarkers = () => {
      clearHost(markersHost);
      const markers = getMarkerItems();
      markersHost.style.display = markers.length ? "block" : "none";
      markersHost.style.minHeight = markers.some((marker) => marker.label != null && marker.label !== "") ? "30px" : "10px";
      markers.forEach((marker) => {
        const ratio = ratioFromValue(marker.value);
        const active = uiUnwrap(props.reverse) ? getValue() <= marker.value : getValue() >= marker.value;
        const item = _.button({
          type: "button",
          class: uiClass(["cms-slider-marker", marker.className, uiWhen(() => active, "active")]),
          style: {
            left: `${ratio * 100}%`,
            color: active ? (uiUnwrap(props.color) || "var(--cms-primary)") : "var(--cms-muted)",
            cursor: (uiUnwrap(props.disabled) || uiUnwrap(props.readonly)) ? "default" : "pointer"
          },
          disabled: !!uiUnwrap(props.disabled) || !!uiUnwrap(props.readonly),
          onClick: () => {
            if (uiUnwrap(props.disabled) || uiUnwrap(props.readonly)) return;
            const next = setSliderValue(marker.value);
            props.onInput?.(next);
            props.onChange?.(next);
          }
        });
        const markerCtx = {
          marker,
          active,
          value: marker.value,
          current: getValue(),
          input
        };
        let markerNode = CMSwift.ui.renderSlot(slots, "marker", markerCtx, null);
        if (markerNode == null && marker.icon != null) {
          markerNode = typeof marker.icon === "string"
            ? UI.Icon({ name: marker.icon, size: 12 })
            : CMSwift.ui.slot(marker.icon, { ...markerCtx, as: "marker" });
        }
        const markerTick = _.span({
          class: "cms-slider-marker-tick",
          style: {
            background: active ? (uiUnwrap(props.color) || "var(--cms-primary)") : "var(--cms-border-color)"
          }
        });
        const markerNodes = markerNode == null
          ? [markerTick]
          : renderSlotToArray(null, "default", markerCtx, markerNode);
        const labelNodes = marker.label == null
          ? renderSlotToArray(slots, "markerLabel", markerCtx, null)
          : renderSlotToArray(slots, "markerLabel", markerCtx, marker.label);
        markerNodes.forEach((node) => item.appendChild(node));
        if (labelNodes.length) {
          item.appendChild(_.span({
            class: "cms-slider-marker-label"
          }, ...labelNodes));
        }
        markersHost.appendChild(item);
      });
    };

    const renderHeader = () => {
      const ctx = { value: getValue(), input, props };
      let labelNodes = renderSlotToArray(slots, "label", ctx, unwrapSlotValue(props.label));
      if (!labelNodes.length) labelNodes = renderSlotToArray(slots, "default", ctx, children);
      renderInto(labelHost, labelNodes, "inline-flex");

      const showValue = uiUnwrap(props.showValue);
      const rawValueLabel = showValue === false
        ? null
        : (unwrapSlotValue(props.labelValue) ?? getValue());
      const valueNodes = showValue || unwrapSlotValue(props.labelValue) != null
        ? renderSlotToArray(slots, "value", ctx, rawValueLabel)
        : [];
      renderInto(valueHost, valueNodes, "inline-flex");
      header.style.display = (labelHost.childNodes.length || valueHost.childNodes.length) ? "flex" : "none";
    };

    const renderAddons = () => {
      const ctx = { value: getValue(), input, props };
      const leftIcon = renderSlotToArray(slots, "icon", ctx, null);
      const leftIconNodes = leftIcon.length ? leftIcon : asIconArray(props.icon, "icon", ctx);
      renderInto(startIconHost, leftIconNodes, "inline-flex");

      const rightIcon = renderSlotToArray(slots, "iconRight", ctx, null);
      const rightIconNodes = rightIcon.length ? rightIcon : asIconArray(props.iconRight, "iconRight", ctx);
      renderInto(endIconHost, rightIconNodes, "inline-flex");

      const leftLabelSource = unwrapSlotValue(props.startLabel ?? props.leftLabel ?? props.minLabel);
      const rightLabelSource = unwrapSlotValue(props.endLabel ?? props.rightLabel ?? props.maxLabel);
      renderInto(startLabelHost, renderSlotToArray(slots, "startLabel", ctx, leftLabelSource), "inline-flex");
      renderInto(endLabelHost, renderSlotToArray(slots, "endLabel", ctx, rightLabelSource), "inline-flex");
    };

    const renderThumb = () => {
      const ctx = { value: getValue(), input, props };
      const thumbIconNodes = renderSlotToArray(slots, "thumbIcon", ctx, null);
      const thumbIconFallback = props.thumbIcon ?? props.iconThumb ?? props.pointIcon;
      renderInto(
        thumbIconHost,
        thumbIconNodes.length ? thumbIconNodes : asIconArray(thumbIconFallback, "thumbIcon", ctx),
        "inline-flex"
      );

      const rawThumbLabel = unwrapSlotValue(props.thumbLabel)
        ?? unwrapSlotValue(props.labelValue)
        ?? (uiUnwrap(props.showValue) ? String(getValue()) : null);
      const thumbLabelNodes = renderSlotToArray(slots, "thumbLabel", ctx, rawThumbLabel);
      renderInto(thumbLabelHost, thumbLabelNodes, "inline-flex");
    };

    const syncVisualState = () => {
      const value = normalizeValue(getValue());
      const min = getMin();
      const max = getMax();
      const step = getStep();
      const ratio = ratioFromValue(value);
      const percent = `${ratio * 100}%`;
      const color = uiUnwrap(props.color) || uiUnwrap(props.selectionColor) || "var(--cms-primary)";
      const trackColor = uiUnwrap(props.trackColor) || "var(--cms-border-color)";
      const thumbColor = uiUnwrap(props.thumbColor) || color;
      const readonly = !!uiUnwrap(props.readonly);
      const disabled = !!uiUnwrap(props.disabled);

      input.min = String(min);
      input.max = String(max);
      input.step = step === "any" ? "any" : String(step);
      input.disabled = disabled;
      input.value = String(value);

      rail.style.background = trackColor;
      selection.style.background = color;
      selection.style.width = percent;
      thumb.style.left = percent;
      thumb.style.borderColor = thumbColor;
      thumb.style.color = thumbColor;
      thumbLabelHost.style.background = color;
      wrap.classList.toggle("is-disabled", disabled);
      wrap.classList.toggle("is-readonly", readonly);
      wrap.classList.toggle("has-markers", markersHost.childNodes.length > 0);
    };

    if (model) {
      setSliderValue(model.get(), { fromModel: true });
      model.watch((v) => { setSliderValue(v, { fromModel: true }); }, "UI.Slider:watch");
    } else if (uiIsReactive(props.value)) {
      CMSwift.reactive.effect(() => {
        setSliderValue(uiUnwrap(props.value), { fromModel: true });
      }, "UI.Slider:value");
    } else {
      setSliderValue(props.value ?? props.min ?? 0, { fromModel: true });
    }

    input.addEventListener("input", (e) => {
      if (uiUnwrap(props.disabled) || uiUnwrap(props.readonly)) {
        input.value = String(getValue());
        return;
      }
      const next = setSliderValue(input.value);
      props.onInput?.(next, e);
    });
    input.addEventListener("change", (e) => {
      if (uiUnwrap(props.disabled) || uiUnwrap(props.readonly)) {
        input.value = String(getValue());
        return;
      }
      const next = setSliderValue(input.value);
      props.onChange?.(next, e);
    });

    CMSwift.reactive.effect(() => {
      renderHeader();
      renderAddons();
      renderThumb();
      renderMarkers();
      syncVisualState();
    }, "UI.Slider:render");

    wrap._input = input;
    wrap._getValue = getValue;
    wrap._setValue = (value) => setSliderValue(value);

    if (props.withQItem || props.qitem || props.item === true) {
      const item = UI.Item({
        class: uiClass(["cms-slider-item", props.itemClass]),
        style: props.itemStyle
      }, wrap);
      item._input = input;
      item._slider = wrap;
      item._getValue = getValue;
      item._setValue = wrap._setValue;
      return item;
    }

    return wrap;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Slider = {
      signature: "UI.Slider(...children) | UI.Slider(props, ...children)",
      props: {
        min: "number",
        max: "number",
        step: "number|\"any\"",
        value: "number | rod | [get,set] signal",
        model: "rod | [get,set] signal",
        label: "String|Node|Function|Array",
        icon: "String|Node|Function|Array",
        iconRight: "String|Node|Function|Array",
        thumbIcon: "String|Node|Function|Array",
        iconThumb: "Alias di thumbIcon",
        pointIcon: "Alias di thumbIcon",
        thumbLabel: "String|Node|Function|Array",
        showValue: "boolean",
        labelValue: "String|Node|Function|Array",
        markers: "boolean|number|Array|Object",
        markerLabels: "boolean",
        labelMarks: "Alias di markerLabels",
        startLabel: "String|Node|Function|Array",
        endLabel: "String|Node|Function|Array",
        leftLabel: "Alias di startLabel",
        rightLabel: "Alias di endLabel",
        minLabel: "Alias di startLabel",
        maxLabel: "Alias di endLabel",
        withQItem: "boolean",
        qitem: "Alias di withQItem",
        item: "boolean",
        itemClass: "string",
        itemStyle: "object",
        selectionColor: "string",
        trackColor: "string",
        thumbColor: "string",
        readonly: "boolean",
        inputClass: "string",
        slots: "{ label?, default?, value?, icon?, iconRight?, thumbIcon?, thumbLabel?, marker?, markerLabel?, startLabel?, endLabel? }",
        class: "string",
        style: "object"
      },
      slots: {
        label: "Label content",
        default: "Fallback label content",
        value: "Header value content",
        icon: "Left icon content",
        iconRight: "Right icon content",
        thumbIcon: "Thumb icon content",
        thumbLabel: "Thumb label content",
        marker: "Marker content",
        markerLabel: "Marker label content",
        startLabel: "Label a sinistra/inizio track",
        endLabel: "Label a destra/fine track"
      },
      events: {
        onChange: "(value, event)",
        onInput: "(value, event)"
      },
      returns: "HTMLLabelElement | HTMLLIElement (with ._input = HTMLInputElement)",
      description: "Slider reattivo con label, icone, thumb custom, markers e supporto model/QItem."
    };
  }
  // Esempio: CMSwift.ui.Slider({ min: 0, max: 10, model: [get,set] })

  UI.Rating = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const boundValue = props.model || ((uiIsSignal(props.value) || uiIsRod(props.value)) ? props.value : null);
    const model = resolveModel(boundValue, "UI.Rating:model");
    const id = props.id || (`cms-rating-` + Math.random().toString(36).slice(2));
    const inputProps = CMSwift.omit(props, [
      "model", "value", "max", "class", "style", "dense", "readonly", "disabled", "clearable",
      "half", "allowHalf", "noDimming", "label", "slots", "onChange", "onInput", "onHover",
      "icon", "checkedIcon", "uncheckedIcon", "halfIcon", "hoveredIcon", "iconSelected", "iconHalf",
      "iconHovered", "iconOn", "iconOff", "iconSize", "color", "colorSelected", "colorHalf",
      "colorHovered", "colorInactive", "activeColor", "halfColor", "hoverColor", "size", "gap",
      "tabindex", "tabIndex", "inputClass"
    ]);
    inputProps.type = "hidden";
    inputProps.id = id;
    if (props.name != null) inputProps.name = props.name;
    inputProps.class = uiClass(["cms-rating-input", "cms-choice-input", props.inputClass]);
    const input = _.input(inputProps);

    const wrapProps = CMSwift.omit(props, [
      "model", "value", "max", "id", "name", "type", "class", "style", "dense", "readonly",
      "disabled", "clearable", "half", "allowHalf", "noDimming", "label", "slots", "onChange",
      "onInput", "onHover", "icon", "checkedIcon", "uncheckedIcon", "halfIcon", "hoveredIcon",
      "iconSelected", "iconHalf", "iconHovered", "iconOn", "iconOff", "iconSize", "color",
      "colorSelected", "colorHalf", "colorHovered", "colorInactive", "activeColor", "halfColor",
      "hoverColor", "size", "gap", "tabindex", "tabIndex", "inputClass"
    ]);
    wrapProps.class = uiClass([
      "cms-clear-set",
      "cms-singularity-check",
      "cms-choice-wrap",
      "cms-rating",
      "cms-rating-wrap",
      uiWhen(props.dense, "dense"),
      props.class
    ]);
    wrapProps.style = { ...(props.style || {}) };
    const sizeValue = uiUnwrap(props.size);
    if (sizeValue != null && !(typeof sizeValue === "string" && CMSwift.uiSizes?.includes(sizeValue))) {
      wrapProps.style["--cms-rating-size"] = toCssSize(sizeValue);
    }
    const gapValue = uiUnwrap(props.gap);
    if (gapValue != null) {
      wrapProps.style["--cms-rating-gap"] = toCssSize(gapValue);
    }

    const control = _.span({
      class: "cms-rating-control",
      onMouseleave: (e) => {
        if (hoverValue == null) return;
        hoverValue = null;
        syncVisualState();
        props.onHover?.(getValue(), e);
      },
      onKeydown: (e) => {
        if (!isInteractive()) return;
        const step = hasHalf() ? 0.5 : 1;
        const current = getValue();
        let next = current;
        switch (e.key) {
          case "ArrowRight":
          case "ArrowUp":
            next = current + step;
            break;
          case "ArrowLeft":
          case "ArrowDown":
            next = current - step;
            break;
          case "Home":
            next = uiUnwrap(props.clearable) ? 0 : step;
            break;
          case "End":
            next = getMax();
            break;
          case "Delete":
          case "Backspace":
          case "0":
            if (!uiUnwrap(props.clearable)) return;
            next = 0;
            break;
          case " ":
          case "Enter":
            next = current || (uiUnwrap(props.clearable) ? step : Math.max(step, 1));
            break;
          default:
            return;
        }
        e.preventDefault();
        setRatingValue(next, e, { emit: true });
      }
    });
    const labelHost = _.span({ class: "cms-choice-label cms-rating-label" });
    const wrap = _.label(wrapProps, input, control, labelHost);
    setPropertyProps(wrap, props);

    const clearHost = (host) => {
      while (host.firstChild) host.removeChild(host.firstChild);
    };
    const renderInto = (host, nodes, display = "") => {
      clearHost(host);
      (nodes || []).forEach((n) => host.appendChild(n));
      host.style.display = host.childNodes.length ? display : "none";
    };
    const unwrapSlotValue = (value) => (uiIsSignal(value) || uiIsRod(value) ? uiUnwrap(value) : value);
    const asArray = (value, ctx = {}) => slotToArray(unwrapSlotValue(value), ctx);
    const asIconArray = (value, as, ctx = {}) => {
      const resolved = unwrapSlotValue(value);
      if (resolved == null) return [];
      if (typeof resolved === "string") return [UI.Icon({ name: resolved, color: props.color, size: props.iconSize ?? props.size ?? 16 })];
      return asArray(resolved, { ...ctx, as });
    };

    const getMax = () => {
      const value = Number(uiUnwrap(props.max) ?? 5);
      return Number.isFinite(value) && value > 0 ? Math.max(1, Math.round(value)) : 5;
    };
    const hasHalf = () => !!uiUnwrap(props.half ?? props.allowHalf);
    const normalizeValue = (value, max = getMax()) => {
      let next = Number(uiUnwrap(value));
      if (!Number.isFinite(next)) next = 0;
      next = Math.min(max, Math.max(0, next));
      const step = hasHalf() ? 0.5 : 1;
      return Math.round(next / step) * step;
    };
    const isDisabled = () => !!uiUnwrap(props.disabled);
    const isReadonly = () => !!uiUnwrap(props.readonly);
    const isInteractive = () => !isDisabled() && !isReadonly();
    const getValue = () => normalizeValue(model ? model.get() : localValue);
    const updateInputValue = (value) => {
      const stringValue = value > 0 ? String(value) : "";
      input.value = stringValue;
      input.setAttribute("value", stringValue);
      input.disabled = isDisabled();
    };

    let localValue = normalizeValue(model ? model.get() : uiUnwrap(props.value));
    let hoverValue = null;
    let renderedMax = 0;
    let items = [];

    const getPointerValue = (index, event) => {
      if (!hasHalf()) return normalizeValue(index);
      const rect = event.currentTarget.getBoundingClientRect();
      const half = (event.clientX - rect.left) <= (rect.width / 2);
      return normalizeValue(half ? index - 0.5 : index);
    };
    const getItemState = (displayValue, index) => {
      if (displayValue >= index) return "full";
      if (hasHalf() && displayValue >= (index - 0.5)) return "half";
      return "empty";
    };
    const getStateColor = (state, hovered) => {
      const selectedColor = uiUnwrap(props.colorSelected ?? props.activeColor ?? props.color ?? props.textColor) || "var(--cms-warning, #f0b429)";
      const halfColor = uiUnwrap(props.colorHalf ?? props.halfColor ?? props.colorSelected ?? props.activeColor ?? props.color ?? props.textColor) || selectedColor;
      const hoveredColor = uiUnwrap(props.colorHovered ?? props.hoverColor ?? props.colorSelected ?? props.activeColor ?? props.color ?? props.textColor) || selectedColor;
      const inactiveColor = uiUnwrap(props.colorInactive ?? props.colorOff ?? props.color) || "var(--cms-muted)";
      if (hovered) return hoveredColor;
      if (state === "full") return selectedColor;
      if (state === "half") return halfColor;
      return inactiveColor;
    };
    const resolveItemNodes = (ctx) => {
      const slotCandidates = [];
      if (ctx.hovered && ctx.state !== "empty") slotCandidates.push("hoveredIcon", "iconHovered");
      if (ctx.state === "full") slotCandidates.push("checkedIcon", "selectedIcon", "iconSelected", "iconOn");
      else if (ctx.state === "half") slotCandidates.push("halfIcon", "iconHalf");
      else slotCandidates.push("uncheckedIcon", "iconOff");
      slotCandidates.push("icon", "item", "star");
      for (const name of slotCandidates) {
        const nodes = renderSlotToArray(slots, name, ctx, null);
        if (nodes.length) return nodes;
      }

      let source = null;
      let as = "icon";
      if (ctx.hovered && ctx.state !== "empty") {
        source = props.hoveredIcon ?? props.iconHovered;
        as = "hoveredIcon";
      }
      if (source == null && ctx.state === "full") {
        source = props.checkedIcon ?? props.iconSelected ?? props.iconOn ?? props.icon ?? "star";
        as = "checkedIcon";
      } else if (source == null && ctx.state === "half") {
        source = props.halfIcon ?? props.iconHalf ?? props.checkedIcon ?? props.iconSelected ?? props.icon ?? "star_half";
        as = "halfIcon";
      } else if (source == null) {
        source = props.uncheckedIcon ?? props.iconOff ?? (uiUnwrap(props.noDimming) ? (props.icon ?? props.checkedIcon ?? props.iconSelected ?? "star") : "star_border");
        as = "uncheckedIcon";
      }
      return asIconArray(source, as, ctx);
    };
    const ensureItems = () => {
      const max = getMax();
      if (renderedMax === max) return;
      renderedMax = max;
      items = [];
      clearHost(control);
      for (let index = 1; index <= max; index++) {
        const iconHost = _.span({ class: "cms-rating-item-icon" });
        const item = _.span({
          class: "cms-rating-item",
          role: "radio",
          tabIndex: -1,
          onMousemove: (e) => {
            if (!isInteractive()) return;
            const nextHover = getPointerValue(index, e);
            if (hoverValue === nextHover) return;
            hoverValue = nextHover;
            syncVisualState();
            props.onHover?.(nextHover, e);
          },
          onClick: (e) => {
            if (!isInteractive()) return;
            let nextValue = getPointerValue(index, e);
            if (uiUnwrap(props.clearable) && nextValue === getValue()) nextValue = 0;
            setRatingValue(nextValue, e, { emit: true });
          }
        }, iconHost);
        items.push({ item, iconHost, index });
        control.appendChild(item);
      }
    };
    const syncVisualState = () => {
      ensureItems();
      const max = getMax();
      const value = getValue();
      const displayValue = hoverValue == null ? value : normalizeValue(hoverValue, max);
      const disabled = isDisabled();
      const readonly = isReadonly();
      const clearable = !!uiUnwrap(props.clearable);
      const noDimming = !!uiUnwrap(props.noDimming);

      wrap.classList.toggle("is-disabled", disabled);
      wrap.classList.toggle("is-readonly", readonly);
      wrap.classList.toggle("is-hovering", hoverValue != null);
      wrap.classList.toggle("is-clearable", clearable);
      wrap.classList.toggle("is-half", hasHalf());
      wrap.classList.toggle("no-dimming", noDimming);

      const tabindex = Number(uiUnwrap(props.tabindex ?? props.tabIndex) ?? 0);
      control.tabIndex = disabled ? -1 : tabindex;
      control.setAttribute("role", "slider");
      control.setAttribute("aria-valuemin", "0");
      control.setAttribute("aria-valuemax", String(max));
      control.setAttribute("aria-valuenow", String(value));
      control.setAttribute("aria-disabled", disabled ? "true" : "false");
      control.setAttribute("aria-readonly", readonly ? "true" : "false");

      updateInputValue(value);

      const labelNodes = renderSlotToArray(
        slots,
        "label",
        { value, max, disabled, readonly, clearable },
        props.label != null ? unwrapSlotValue(props.label) : children
      );
      renderInto(labelHost, labelNodes, "inline-flex");

      items.forEach(({ item, iconHost, index }) => {
        const state = getItemState(displayValue, index);
        const hovered = hoverValue != null && state !== "empty";
        const ctx = {
          index,
          max,
          value,
          displayValue,
          state,
          active: state !== "empty",
          checked: state === "full",
          half: state === "half",
          hovered,
          disabled,
          readonly,
          clearable,
          setValue: (next) => setRatingValue(next, null, { emit: false })
        };
        item.className = uiClassStatic([
          "cms-rating-item",
          `is-${state}`,
          uiWhen(hovered, "is-hovered")
        ]);
        item.style.color = getStateColor(state, hovered);
        item.style.opacity = state === "empty" && !noDimming ? "0.48" : "1";
        item.setAttribute("aria-checked", String(value === index));
        renderInto(iconHost, resolveItemNodes(ctx), "inline-flex");
      });
    };
    const setRatingValue = (value, event, options = {}) => {
      const normalized = normalizeValue(value);
      const current = getValue();
      localValue = normalized;
      hoverValue = null;
      if (model && options.fromModel !== true) model.set(normalized);
      updateInputValue(normalized);
      syncVisualState();
      if (options.emit !== false && normalized !== current) {
        props.onInput?.(normalized, event);
        props.onChange?.(normalized, event);
      }
      return normalized;
    };

    wrap._input = input;
    wrap._rating = control;
    wrap._getValue = getValue;
    wrap._setValue = (value) => setRatingValue(value, null, { emit: false });

    if (model) {
      model.watch((next) => {
        const normalized = normalizeValue(next);
        if (serializeValue(normalized) === serializeValue(localValue)) return;
        localValue = normalized;
        hoverValue = null;
        updateInputValue(localValue);
        syncVisualState();
      }, "UI.Rating:watch");
    }

    CMSwift.reactive.effect(() => {
      if (!model && props.value != null) {
        localValue = normalizeValue(uiUnwrap(props.value));
      }
      syncVisualState();
    }, "UI.Rating:render");

    return wrap;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Rating = {
      signature: "UI.Rating(...children) | UI.Rating(props, ...children)",
      props: {
        max: "number",
        value: "number | rod | [get,set] signal",
        model: "rod | [get,set] signal",
        name: "string",
        label: "String|Node|Function|Array",
        clearable: "boolean",
        half: "boolean",
        allowHalf: "Alias di half",
        noDimming: "boolean",
        readonly: "boolean",
        disabled: "boolean",
        icon: "String|Node|Function|Array",
        iconSelected: "Alias di checkedIcon",
        checkedIcon: "String|Node|Function|Array",
        uncheckedIcon: "String|Node|Function|Array",
        iconHalf: "Alias di halfIcon",
        halfIcon: "String|Node|Function|Array",
        iconHovered: "Alias di hoveredIcon",
        hoveredIcon: "String|Node|Function|Array",
        color: "string",
        colorSelected: "string",
        colorHalf: "string",
        colorHovered: "string",
        colorInactive: "string",
        iconSize: "string|number",
        size: "string|number",
        gap: "string|number",
        slots: "{ label?, icon?, checkedIcon?, uncheckedIcon?, halfIcon?, hoveredIcon?, item?, star? }",
        class: "string",
        style: "object"
      },
      slots: {
        label: "Label content",
        icon: "Base icon content per item",
        checkedIcon: "Icon when item is selected",
        uncheckedIcon: "Icon when item is empty",
        halfIcon: "Icon when item is half-selected",
        hoveredIcon: "Icon while hovering selected items",
        item: "Custom item renderer",
        star: "Alias di item/icon"
      },
      events: {
        onChange: "(value, event)",
        onInput: "(value, event)",
        onHover: "(value, event)"
      },
      keyboard: ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "Enter", "Space", "Delete", "Backspace", "0"],
      returns: "HTMLLabelElement (with ._input, ._rating, ._getValue(), ._setValue(value))",
      description: "Rating reattivo con label, icone custom, half rating, clearable e supporto model."
    };
  }
  // Esempio: CMSwift.ui.Rating({ max: 5, model: [get,set] })

  const uiCloneTimeParts = (value) => {
    if (!value) return null;
    return {
      hour: Number(value.hour) || 0,
      minute: Number(value.minute) || 0,
      second: Number(value.second) || 0
    };
  };
  const uiTimePad = (value) => String(Math.max(0, Number(value) || 0)).padStart(2, "0");
  const uiNormalizeTimeParts = (raw, options = {}) => {
    if (raw == null || raw === "") return null;
    let hour = null;
    let minute = null;
    let second = 0;
    let meridiem = null;

    if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
      hour = raw.getHours();
      minute = raw.getMinutes();
      second = raw.getSeconds();
    } else if (typeof raw === "number" && Number.isFinite(raw)) {
      const total = Math.max(0, Math.floor(raw));
      hour = Math.floor(total / 3600) % 24;
      minute = Math.floor(total / 60) % 60;
      second = total % 60;
    } else if (typeof raw === "object") {
      if (raw.time != null || raw.value != null) return uiNormalizeTimeParts(raw.time ?? raw.value, options);
      hour = Number(raw.hour ?? raw.hours ?? raw.h ?? raw.hh);
      minute = Number(raw.minute ?? raw.minutes ?? raw.min ?? raw.mm ?? 0);
      second = Number(raw.second ?? raw.seconds ?? raw.sec ?? raw.ss ?? 0);
      meridiem = raw.meridiem ?? raw.ampm ?? raw.period ?? null;
    } else if (typeof raw === "string") {
      const value = raw.trim();
      if (!value) return null;
      const compact = value.match(/^(\d{1,2})(\d{2})(\d{2})?$/);
      const match = value.match(/(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?\s*([ap]m)?/i);
      if (match) {
        hour = Number(match[1]);
        minute = Number(match[2]);
        second = match[3] != null ? Number(match[3]) : 0;
        meridiem = match[4] || null;
      } else if (compact) {
        hour = Number(compact[1]);
        minute = Number(compact[2]);
        second = compact[3] != null ? Number(compact[3]) : 0;
      } else {
        return null;
      }
    } else {
      return null;
    }

    if (!Number.isFinite(hour) || !Number.isFinite(minute) || !Number.isFinite(second)) return null;
    if (meridiem) {
      const lower = String(meridiem).toLowerCase();
      if (lower === "pm" && hour < 12) hour += 12;
      if (lower === "am" && hour === 12) hour = 0;
    }
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59 || second < 0 || second > 59) return null;

    const normalized = {
      hour: Math.floor(hour),
      minute: Math.floor(minute),
      second: Math.floor(second)
    };
    return uiConstrainTimeParts(normalized, options);
  };
  const uiExportTimeValue = (value, options = {}) => {
    const parts = value && typeof value === "object" && value.hour != null
      ? uiCloneTimeParts(value)
      : uiNormalizeTimeParts(value, options);
    if (!parts) return "";
    const withSeconds = options.withSeconds === true || Number(parts.second || 0) > 0;
    return `${uiTimePad(parts.hour)}:${uiTimePad(parts.minute)}${withSeconds ? `:${uiTimePad(parts.second)}` : ""}`;
  };
  const uiCompareTimeValue = (a, b) => {
    const av = uiExportTimeValue(a, { withSeconds: true });
    const bv = uiExportTimeValue(b, { withSeconds: true });
    if (!av && !bv) return 0;
    if (!av) return -1;
    if (!bv) return 1;
    return av < bv ? -1 : (av > bv ? 1 : 0);
  };
  function uiConstrainTimeParts(value, options = {}) {
    if (!value) return null;
    const out = uiCloneTimeParts(value);
    const min = options.min != null ? uiNormalizeTimeParts(options.min, { withSeconds: true }) : null;
    const max = options.max != null ? uiNormalizeTimeParts(options.max, { withSeconds: true }) : null;
    if (min && uiCompareTimeValue(out, min) < 0) return uiCloneTimeParts(min);
    if (max && uiCompareTimeValue(out, max) > 0) return uiCloneTimeParts(max);
    return out;
  }
  const uiExtractTimeFromValue = (raw, options = {}) => {
    if (raw == null || raw === "") return null;
    if (raw instanceof Date) return uiNormalizeTimeParts(raw, options);
    if (typeof raw === "object") return uiNormalizeTimeParts(raw.time != null ? raw.time : raw, options);
    if (typeof raw === "string" || typeof raw === "number") return uiNormalizeTimeParts(raw, options);
    return null;
  };
  const uiFormatTimeDisplay = (value, options = {}) => {
    const parts = uiNormalizeTimeParts(value, options);
    if (!parts) return "";
    const withSeconds = options.withSeconds === true || Number(parts.second || 0) > 0;
    const use12h = !!uiUnwrap(options.use12h ?? options.ampm);
    if (!use12h) {
      return `${uiTimePad(parts.hour)}:${uiTimePad(parts.minute)}${withSeconds ? `:${uiTimePad(parts.second)}` : ""}`;
    }
    const meridiem = parts.hour >= 12 ? "PM" : "AM";
    const hour = parts.hour % 12 || 12;
    return `${uiTimePad(hour)}:${uiTimePad(parts.minute)}${withSeconds ? `:${uiTimePad(parts.second)}` : ""} ${meridiem}`;
  };
  const uiMergeDateAndTime = (dateValue, timeValue, options = {}) => {
    if (!dateValue) return "";
    const time = uiExportTimeValue(timeValue, options);
    return time ? `${dateValue}T${time}` : dateValue;
  };
  const uiBuildTimeSteps = (step, max) => {
    const safeStep = Math.max(1, Math.min(max + 1, Math.round(Number(step) || 1)));
    const out = [];
    for (let value = 0; value <= max; value += safeStep) out.push(value);
    return out;
  };
  const uiCreateTimePickerSection = (config = {}) => {
    const {
      props = {},
      slots = {},
      value = null,
      withSeconds = false,
      minuteStep = 5,
      secondStep = 5,
      disabled = false,
      readonly = false,
      embedded = false,
      className = "",
      slotPrefix = "",
      shortcuts = null,
      onSelect = null
    } = config;
    const selectedValue = uiNormalizeTimeParts(value, { withSeconds, min: props.min, max: props.max });
    const baseParts = selectedValue
      || uiNormalizeTimeParts(new Date(), { withSeconds, min: props.min, max: props.max })
      || { hour: 0, minute: 0, second: 0 };
    const selectedParts = selectedValue ? uiCloneTimeParts(selectedValue) : null;
    const prefixed = (name) => slotPrefix ? `${slotPrefix}${name[0].toUpperCase()}${name.slice(1)}` : null;
    const renderNamedSlot = (name, ctx, fallback) => {
      const candidates = [prefixed(name), name].filter(Boolean);
      for (const candidate of candidates) {
        const slotValue = CMSwift.ui.getSlot(slots, candidate);
        if (slotValue == null) continue;
        const rendered = CMSwift.ui.renderSlot(slots, candidate, ctx, fallback);
        if (rendered != null) return rendered;
      }
      return CMSwift.ui.slot(fallback, ctx);
    };
    const renderPointNodes = (ctx) => {
      let pointNode = renderNamedSlot("point", ctx, null);
      if (pointNode == null && config.pointIcon != null && ctx.selected) {
        pointNode = typeof config.pointIcon === "string"
          ? UI.Icon({ name: config.pointIcon, size: embedded ? 10 : 12 })
          : CMSwift.ui.slot(config.pointIcon, ctx);
      }
      return renderSlotToArray(null, "default", ctx, pointNode);
    };
    const makeRequestedValue = (part, optionValue) => {
      const next = {
        hour: baseParts.hour,
        minute: baseParts.minute,
        second: withSeconds ? baseParts.second : 0
      };
      next[part] = optionValue;
      return next;
    };
    const section = _.div({
      class: uiClass([
        "cms-time-section",
        uiWhen(embedded, "is-embedded"),
        uiWhen(withSeconds, "has-seconds"),
        className
      ])
    });
    const shortcutList = uiUnwrap(shortcuts) || [];
    if (Array.isArray(shortcutList) && shortcutList.length) {
      const shortcutWrap = _.div({ class: "cms-time-shortcuts" });
      shortcutList.forEach((item, index) => {
        if (!item) return;
        const rawValue = typeof item.value === "function"
          ? item.value({ now: uiExportTimeValue(new Date(), { withSeconds }) })
          : item.value;
        const normalizedValue = uiNormalizeTimeParts(rawValue, { withSeconds, min: props.min, max: props.max });
        if (!normalizedValue) return;
        const ctx = {
          item,
          index,
          value: uiExportTimeValue(normalizedValue, { withSeconds }),
          displayValue: uiFormatTimeDisplay(normalizedValue, { withSeconds, use12h: props.use12h ?? props.ampm })
        };
        const labelNode = renderNamedSlot("shortcut", ctx, item.label ?? item.text ?? ctx.displayValue);
        shortcutWrap.appendChild(_.button({
          type: "button",
          class: uiClass(["cms-time-shortcut", uiWhen(!!selectedParts && uiCompareTimeValue(normalizedValue, selectedParts) === 0, "is-selected")]),
          disabled: disabled || readonly,
          onClick: () => onSelect?.(normalizedValue, { shortcut: item, index })
        }, ...renderSlotToArray(null, "default", ctx, labelNode)));
      });
      if (shortcutWrap.childNodes.length) section.appendChild(shortcutWrap);
    }
    const columns = _.div({ class: "cms-time-columns" });
    const createColumn = (title, part, values) => {
      const column = _.div({ class: "cms-time-column", "data-time-part": part });
      const optionsWrap = _.div({ class: "cms-time-options" });
      values.forEach((optionValue) => {
        const requested = makeRequestedValue(part, optionValue);
        const normalized = uiConstrainTimeParts(requested, { withSeconds, min: props.min, max: props.max });
        const optionDisabled = disabled || readonly || uiCompareTimeValue(normalized, requested) !== 0;
        const selected = !!selectedParts && selectedParts[part] === optionValue;
        const ctx = {
          part,
          selected,
          disabled: optionDisabled,
          value: optionValue,
          label: uiTimePad(optionValue),
          timeValue: uiExportTimeValue(normalized, { withSeconds }),
          displayValue: uiFormatTimeDisplay(normalized, { withSeconds, use12h: props.use12h ?? props.ampm })
        };
        const optionNode = renderNamedSlot("option", ctx, ctx.label);
        const pointNodes = selected ? renderPointNodes(ctx) : [];
        optionsWrap.appendChild(_.button({
          type: "button",
          class: uiClass(["cms-time-option", uiWhen(selected, "is-selected"), uiWhen(optionDisabled, "is-disabled")]),
          disabled: optionDisabled,
          onClick: () => onSelect?.(normalized, { part, optionValue })
        },
          _.span({ class: "cms-time-option-label" }, ...renderSlotToArray(null, "default", ctx, optionNode)),
          pointNodes.length ? _.span({ class: "cms-time-option-point" }, ...pointNodes) : null
        ));
      });
      column.appendChild(optionsWrap);
      return column;
    };
    columns.appendChild(createColumn(uiUnwrap(props.hoursLabel) || "Ore", "hour", uiBuildTimeSteps(1, 23)));
    columns.appendChild(createColumn(uiUnwrap(props.minutesLabel) || "Min", "minute", uiBuildTimeSteps(minuteStep, 59)));
    if (withSeconds) {
      columns.appendChild(createColumn(uiUnwrap(props.secondsLabel) || "Sec", "second", uiBuildTimeSteps(secondStep, 59)));
    }
    section.appendChild(columns);
    return section;
  };

  const uiCaptureTimeColumnScrollState = (root) => {
    if (!root) return null;
    const state = {};
    root.querySelectorAll(".cms-time-column").forEach((column, index) => {
      const key = column.getAttribute("data-time-part") || String(index);
      state[key] = column.scrollTop;
    });
    return state;
  };

  const uiCenterTimeColumnsToSelection = (root, options = {}) => {
    if (!root) return;
    const scrollState = options.scrollState || null;
    const behavior = options.behavior ?? "smooth";
    root.querySelectorAll(".cms-time-column").forEach((column, index) => {
      const key = column.getAttribute("data-time-part") || String(index);
      const previousTop = scrollState && Number.isFinite(scrollState[key]) ? scrollState[key] : null;
      if (previousTop != null) column.scrollTop = previousTop;
      const selectedOption = column.querySelector(".cms-time-option.is-selected");
      if (!selectedOption) return;
      const maxTop = Math.max(0, column.scrollHeight - column.clientHeight);
      const targetTop = selectedOption.offsetTop - ((column.clientHeight - selectedOption.offsetHeight) / 2);
      const nextTop = Math.max(0, Math.min(maxTop, targetTop));
      if (Math.abs(column.scrollTop - nextTop) < 1) {
        column.scrollTop = nextTop;
        return;
      }
      if (behavior && typeof column.scrollTo === "function") {
        column.scrollTo({ top: nextTop, behavior });
        return;
      }
      column.scrollTop = nextTop;
    });
  };

  UI.Date = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const sizeValue = uiComputed(props.size, () => {
      const value = String(uiUnwrap(props.size) || "").toLowerCase();
      return ["xs", "sm", "md", "lg", "xl"].includes(value) ? `cms-size-${value}` : "";
    });
    const requestedMode = String(
      uiUnwrap(
        props.mode
        ?? (uiUnwrap(props.rangeMultiple ?? props.multipleRange ?? props.multiRange) ? "range-multiple" : null)
        ?? ((props.range && props.multiple) ? "range-multiple" : (props.range ? "range" : (props.multiple ? "multiple" : "single")))
      )
    ).toLowerCase();
    const mode = ["range-multiple", "multiple-range", "rangemultiple", "multiplerange", "range_multiple", "multiple_range", "multi-range", "multi_range", "ranges"]
      .includes(requestedMode)
      ? "range-multiple"
      : (requestedMode === "range"
        ? "range"
        : (requestedMode === "multiple" ? "multiple" : "single"));
    const valueBinding = props.model || ((uiIsSignal(props.value) || uiIsRod(props.value)) ? props.value : null);
    const model = resolveModel(valueBinding, "UI.Date:model");
    const initialRawValue = model ? model.get() : uiUnwrap(props.value);
    const rangeAsArray = uiUnwrap(props.rangeAs ?? props.rangeModel) === "array" || Array.isArray(initialRawValue);
    const rangeMultipleAsArray = uiUnwrap(props.rangeMultipleAs ?? props.multipleRangeAs) === "array"
      || (Array.isArray(initialRawValue) && Array.isArray(initialRawValue[0]));
    const isTimeEnabled = () => mode === "single" && !!uiUnwrap(props.withTime ?? props.time ?? props.timePicker ?? props.enableTime);
    const getTimeOptions = () => {
      const detectedTime = uiExportTimeValue(
        uiExtractTimeFromValue(uiUnwrap(props.timeValue) ?? (model ? model.get() : uiUnwrap(props.value)) ?? initialRawValue, { withSeconds: true }),
        { withSeconds: true }
      );
      return {
        withSeconds: !!uiUnwrap(props.timeWithSeconds ?? props.withSeconds ?? props.showSeconds)
          || /:\d{2}:\d{2}$/.test(detectedTime)
          || /:\d{2}:\d{2}$/.test(uiUnwrap(props.timeFormat) || ""),
        min: uiUnwrap(props.timeMin ?? props.minTime),
        max: uiUnwrap(props.timeMax ?? props.maxTime),
        use12h: uiUnwrap(props.time12h ?? props.use12h ?? props.ampm)
      };
    };
    const getTimeMinuteStep = () => {
      const raw = Number(uiUnwrap(props.timeMinuteStep ?? props.minuteStep ?? 5));
      return Math.max(1, Math.min(30, Number.isFinite(raw) ? raw : 5));
    };
    const getTimeSecondStep = () => {
      const raw = Number(uiUnwrap(props.timeSecondStep ?? props.secondStep ?? 5));
      return Math.max(1, Math.min(30, Number.isFinite(raw) ? raw : 5));
    };

    const pad = (n) => String(n).padStart(2, "0");
    const createDate = (year, month, day) => {
      const date = new Date(year, month, day);
      if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) return null;
      return date;
    };
    const toIsoDate = (date) => {
      if (!(date instanceof Date) || Number.isNaN(date.getTime())) return null;
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    };
    const fromIsoDate = (iso) => {
      if (typeof iso !== "string") return null;
      const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (!match) return null;
      const year = Number(match[1]);
      const month = Number(match[2]) - 1;
      const day = Number(match[3]);
      const date = new Date(year, month, day);
      if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) return null;
      return date;
    };
    const shiftDays = (iso, amount) => {
      const date = fromIsoDate(iso);
      if (!date) return null;
      date.setDate(date.getDate() + amount);
      return toIsoDate(date);
    };
    const shiftMonths = (date, amount) => new Date(date.getFullYear(), date.getMonth() + amount, 1);
    const monthStart = (value) => {
      if (value instanceof Date && !Number.isNaN(value.getTime())) return new Date(value.getFullYear(), value.getMonth(), 1);
      const date = normalizeDateOnly(value);
      const parsed = fromIsoDate(date);
      return parsed ? new Date(parsed.getFullYear(), parsed.getMonth(), 1) : new Date();
    };
    const todayIso = () => toIsoDate(new Date());
    const isSameIso = (a, b) => !!a && !!b && a === b;
    const compareIso = (a, b) => {
      if (a == null && b == null) return 0;
      if (a == null) return -1;
      if (b == null) return 1;
      return a < b ? -1 : (a > b ? 1 : 0);
    };
    const diffDays = (a, b) => {
      const da = fromIsoDate(a);
      const db = fromIsoDate(b);
      if (!da || !db) return 0;
      return Math.round((db.getTime() - da.getTime()) / 86400000);
    };
    const ensureArray = (value) => Array.isArray(value) ? value.slice() : (value == null || value === "" ? [] : [value]);
    const cloneRangeValue = (value) => ({ from: value?.from || null, to: value?.to || null });
    const cloneRangeList = (value) => Array.isArray(value) ? value.map(cloneRangeValue) : [];
    const exportRangeValue = (value) => {
      const out = cloneRangeValue(value);
      return rangeAsArray ? [out.from, out.to] : out;
    };
    const exportRangeMultipleValue = (value) => cloneRangeList(value).map((item) => (
      rangeMultipleAsArray ? [item.from, item.to] : item
    ));
    const cloneValue = (value) => {
      if (mode === "multiple") return Array.isArray(value) ? value.slice() : [];
      if (mode === "range") return cloneRangeValue(value);
      if (mode === "range-multiple") return cloneRangeList(value);
      return value || null;
    };
    const exportValue = (value) => {
      if (mode === "multiple") return Array.isArray(value) ? value.slice() : [];
      if (mode === "range") return exportRangeValue(value);
      if (mode === "range-multiple") return exportRangeMultipleValue(value);
      return value || "";
    };
    const serializeValue = (value) => JSON.stringify(exportValue(value));
    const normalizeDateOnly = (raw) => {
      if (raw == null || raw === "") return null;
      if (raw instanceof Date) return toIsoDate(raw);
      if (typeof raw === "number") return toIsoDate(new Date(raw));
      if (typeof raw !== "string") {
        if (typeof raw === "object" && raw.date != null) return normalizeDateOnly(raw.date);
        return null;
      }
      const value = raw.trim();
      if (!value) return null;
      const isoLike = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:$|[T\s])/);
      if (isoLike) {
        const date = createDate(Number(isoLike[1]), Number(isoLike[2]) - 1, Number(isoLike[3]));
        return toIsoDate(date);
      }
      const euroLike = value.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})$/);
      if (euroLike) {
        const year = euroLike[3].length === 2 ? (2000 + Number(euroLike[3])) : Number(euroLike[3]);
        const date = createDate(year, Number(euroLike[2]) - 1, Number(euroLike[1]));
        return toIsoDate(date);
      }
      if (/^\d{1,4}$/.test(value)) return null;
      const parsed = new Date(value);
      if (Number.isNaN(parsed.getTime())) return null;
      const explicitYear = value.match(/(?:^|[^\d])(\d{4})(?!\d)/);
      if (explicitYear && parsed.getFullYear() !== Number(explicitYear[1])) return null;
      return toIsoDate(parsed);
    };
    const normalizeRangeValue = (raw) => {
      if (raw == null || raw === "") return { from: null, to: null };
      let from = null;
      let to = null;
      if (Array.isArray(raw)) {
        from = normalizeDateOnly(raw[0]);
        to = normalizeDateOnly(raw[1]);
      } else if (typeof raw === "object") {
        from = normalizeDateOnly(raw.from ?? raw.start ?? raw.dateFrom ?? raw.departure);
        to = normalizeDateOnly(raw.to ?? raw.end ?? raw.dateTo ?? raw.return);
      } else {
        const found = String(raw).match(/\d{4}-\d{1,2}-\d{1,2}|\d{1,2}[\/.\-]\d{1,2}[\/.\-]\d{2,4}/g) || [];
        from = normalizeDateOnly(found[0]);
        to = normalizeDateOnly(found[1]);
      }
      if (from && to && from > to) [from, to] = [to, from];
      return { from, to };
    };
    const normalizeRangeMultipleValue = (raw) => {
      const out = [];
      const seen = new Set();
      const pushRange = (value) => {
        const normalized = normalizeRangeValue(value);
        if (!normalized.from) return;
        const key = `${normalized.from || ""}|${normalized.to || ""}`;
        if (seen.has(key)) return;
        seen.add(key);
        out.push(normalized);
      };
      if (raw == null || raw === "") return out;
      if (Array.isArray(raw)) {
        const isFlatDateList = raw.every((item) => (
          item == null
          || typeof item === "string"
          || typeof item === "number"
          || item instanceof Date
        ));
        if (isFlatDateList) {
          const dates = raw.map(normalizeDateOnly).filter(Boolean);
          for (let index = 0; index < dates.length; index += 2) {
            pushRange({ from: dates[index], to: dates[index + 1] || null });
          }
        } else {
          raw.forEach((item) => pushRange(item));
        }
      } else if (typeof raw === "object" && Array.isArray(raw.ranges)) {
        raw.ranges.forEach((item) => pushRange(item));
      } else if (typeof raw === "object") {
        pushRange(raw);
      } else {
        const found = String(raw).match(/\d{4}-\d{1,2}-\d{1,2}|\d{1,2}[\/.\-]\d{1,2}[\/.\-]\d{2,4}/g) || [];
        const dates = found.map(normalizeDateOnly).filter(Boolean);
        for (let index = 0; index < dates.length; index += 2) {
          pushRange({ from: dates[index], to: dates[index + 1] || null });
        }
      }
      return out.sort((a, b) => compareIso(a.from, b.from) || compareIso(a.to, b.to));
    };
    const normalizeMultipleValue = (raw) => {
      const out = [];
      ensureArray(raw).forEach((item) => {
        const normalized = normalizeDateOnly(item);
        if (normalized && !out.includes(normalized)) out.push(normalized);
      });
      return out.sort();
    };
    const normalizeValue = (raw) => {
      if (mode === "range") return normalizeRangeValue(raw);
      if (mode === "range-multiple") return normalizeRangeMultipleValue(raw);
      if (mode === "multiple") return normalizeMultipleValue(raw);
      return normalizeDateOnly(raw);
    };
    const getMin = () => normalizeDateOnly(uiUnwrap(props.min ?? props.minDate));
    const getMax = () => normalizeDateOnly(uiUnwrap(props.max ?? props.maxDate));
    const getLocale = () => uiUnwrap(props.locale) || undefined;
    const getFirstDayOfWeek = () => {
      const raw = Number(uiUnwrap(props.firstDayOfWeek ?? props.weekStart ?? 1));
      return Number.isFinite(raw) ? ((raw % 7) + 7) % 7 : 1;
    };
    const getMonthsToShow = () => {
      const fallback = (mode === "range" || mode === "range-multiple") ? 2 : 1;
      const raw = Number(uiUnwrap(props.monthsToShow) ?? fallback);
      return Math.max(1, Math.min(4, Number.isFinite(raw) ? raw : fallback));
    };
    const getDefaultViewValue = () => {
      const min = getMin();
      const max = getMax();
      let fallback = normalizeDateOnly(uiUnwrap(props.defaultMonth)) || todayIso();
      if (min && fallback < min) fallback = min;
      if (max && fallback > max) fallback = max;
      return fallback || min || max || todayIso();
    };
    const getCurrentValue = () => uiUnwrap(props.confirm) ? workingValue : localValue;
    const getDateContext = (iso) => {
      const date = fromIsoDate(iso);
      if (!date) return { date: iso, value: iso };
      return {
        date: iso,
        value: iso,
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        weekday: date.getDay(),
        today: isSameIso(iso, todayIso())
      };
    };
    const matchesDateSpec = (spec, iso) => {
      if (spec == null) return false;
      if (Array.isArray(spec)) return spec.some((item) => normalizeDateOnly(item) === iso);
      if (spec instanceof Set) return spec.has(iso);
      if (typeof spec === "function") return !!spec(iso, getDateContext(iso));
      if (typeof spec === "string" || spec instanceof Date || typeof spec === "number") {
        return normalizeDateOnly(spec) === iso;
      }
      return false;
    };
    const isDateAllowed = (iso) => {
      if (!iso) return false;
      const min = getMin();
      const max = getMax();
      if (min && iso < min) return false;
      if (max && iso > max) return false;
      const allowSpec = uiUnwrap(props.options ?? props.enableDates ?? props.allowedDates);
      if (allowSpec != null && !matchesDateSpec(allowSpec, iso)) return false;
      const disableSpec = uiUnwrap(props.disableDates ?? props.disabledDates ?? props.notAllowedDates);
      if (disableSpec != null && matchesDateSpec(disableSpec, iso)) return false;
      const weekday = fromIsoDate(iso)?.getDay();
      if (Array.isArray(uiUnwrap(props.allowedWeekdays ?? props.weekdays)) && weekday != null) {
        const allowedWeekdays = uiUnwrap(props.allowedWeekdays ?? props.weekdays).map((x) => Number(x));
        if (!allowedWeekdays.includes(weekday)) return false;
      }
      if (uiUnwrap(props.weekdaysOnly) && (weekday === 0 || weekday === 6)) return false;
      if (uiUnwrap(props.weekendsOnly) && weekday != null && weekday !== 0 && weekday !== 6) return false;
      const current = getCurrentValue();
      const pendingRange = mode === "range"
        ? (current?.from && !current?.to ? current : null)
        : (mode === "range-multiple"
          ? ((Array.isArray(current) && current.length && current[current.length - 1]?.from && !current[current.length - 1]?.to)
            ? current[current.length - 1]
            : null)
          : null);
      if (pendingRange?.from) {
        const nights = Math.abs(diffDays(pendingRange.from, iso));
        const minRange = Number(uiUnwrap(props.minRange ?? props.minDays ?? props.minNights));
        const maxRange = Number(uiUnwrap(props.maxRange ?? props.maxDays ?? props.maxNights));
        if (Number.isFinite(minRange) && nights < minRange) return false;
        if (Number.isFinite(maxRange) && nights > maxRange) return false;
      }
      return true;
    };
    const formatSingleDisplay = (iso) => {
      if (!iso) return "";
      const date = fromIsoDate(iso);
      if (!date) return iso;
      const displayMask = String(uiUnwrap(props.displayMask ?? props.mask ?? "") || "").toLowerCase();
      if (displayMask === "iso" || uiUnwrap(props.isoDisplay) === true) return iso;
      return new Intl.DateTimeFormat(getLocale(), {
        year: "numeric",
        month: "short",
        day: "2-digit"
      }).format(date);
    };
    const formatDisplayValue = (value, timeValue = localTimeValue) => {
      if (mode === "range-multiple") {
        if (!Array.isArray(value) || !value.length) return "";
        if (value.length > 2 && uiUnwrap(props.compactMultiple) !== false) {
          return `${value.length} ${uiUnwrap(props.multipleRangeLabel) || "intervalli selezionati"}`;
        }
        return value.map((range) => {
          const from = range?.from ? formatSingleDisplay(range.from) : "";
          const to = range?.to ? formatSingleDisplay(range.to) : "";
          return from && to ? `${from} -> ${to}` : (from || to || "");
        }).filter(Boolean).join("; ");
      }
      if (mode === "multiple") {
        if (!Array.isArray(value) || !value.length) return "";
        if (value.length > 3 && uiUnwrap(props.compactMultiple) !== false) {
          return `${value.length} ${uiUnwrap(props.multipleLabel) || "date selezionate"}`;
        }
        return value.map(formatSingleDisplay).join(", ");
      }
      if (mode === "range") {
        const from = value?.from ? formatSingleDisplay(value.from) : "";
        const to = value?.to ? formatSingleDisplay(value.to) : "";
        if (from && to) return `${from} -> ${to}`;
        return from || to || "";
      }
      const dateLabel = formatSingleDisplay(value);
      if (!isTimeEnabled()) return dateLabel;
      const timeLabel = formatTimeDisplayValue(timeValue);
      return [dateLabel, timeLabel].filter(Boolean).join(" • ");
    };
    const extractTypedDates = (raw) => {
      const found = String(raw || "").match(/\d{4}-\d{1,2}-\d{1,2}|\d{1,2}[\/.\-]\d{1,2}[\/.\-]\d{2,4}/g) || [];
      return found.map(normalizeDateOnly).filter(Boolean);
    };
    const parseTypedValue = (raw) => {
      if (raw == null || raw === "") {
        if (mode === "multiple" || mode === "range-multiple") return [];
        if (mode === "range") return { from: null, to: null };
        return null;
      }
      const dates = extractTypedDates(raw);
      if (mode === "range-multiple") {
        const ranges = [];
        for (let index = 0; index < dates.length; index += 2) {
          if (!dates[index]) continue;
          ranges.push({ from: dates[index], to: dates[index + 1] || null });
        }
        return ranges;
      }
      if (mode === "multiple") return dates;
      if (mode === "range") return { from: dates[0] || null, to: dates[1] || null };
      return dates[0] || normalizeDateOnly(raw);
    };
    const emptyValue = () => ((mode === "multiple" || mode === "range-multiple") ? [] : (mode === "range" ? { from: null, to: null } : null));
    const resolveDateTimeTimeValue = (raw, fallback = null) => {
      if (!isTimeEnabled()) return null;
      const options = getTimeOptions();
      const explicit = uiUnwrap(props.timeValue);
      const source = raw != null ? raw : explicit;
      const resolved = uiExtractTimeFromValue(source, options);
      return uiCloneTimeParts(resolved ?? fallback ?? null);
    };
    const getCurrentTimeValue = () => uiUnwrap(props.confirm) ? workingTimeValue : localTimeValue;
    const exportCurrentValue = (dateValue = localValue, timeValue = localTimeValue) => {
      if (mode === "single" && isTimeEnabled()) return uiMergeDateAndTime(dateValue || null, timeValue, getTimeOptions());
      return exportValue(dateValue);
    };
    const serializeCurrentValue = (dateValue = localValue, timeValue = localTimeValue) => JSON.stringify(exportCurrentValue(dateValue, timeValue));
    const formatTimeDisplayValue = (value) => uiFormatTimeDisplay(value, getTimeOptions());

    let localValue = normalizeValue(initialRawValue);
    let workingValue = cloneValue(localValue);
    let localTimeValue = resolveDateTimeTimeValue(initialRawValue, uiExtractTimeFromValue(uiUnwrap(props.timeValue), getTimeOptions()));
    let workingTimeValue = uiCloneTimeParts(localTimeValue);
    let hoverDate = null;
    let mouseSelectedDate = null;
    let viewMonth = monthStart(
      mode === "range"
        ? (localValue?.from || localValue?.to || getDefaultViewValue())
        : (mode === "range-multiple"
          ? (localValue?.[localValue.length - 1]?.from || localValue?.[localValue.length - 1]?.to || getDefaultViewValue())
          : (mode === "multiple"
            ? (localValue[0] || getDefaultViewValue())
            : (localValue || getDefaultViewValue())))
    );
    let entry = null;
    let panelRoot = null;

    const getVisibleMonthOffset = (value) => {
      const date = value instanceof Date ? value : fromIsoDate(normalizeDateOnly(value));
      if (!date) return -1;
      const year = date.getFullYear();
      const month = date.getMonth();
      for (let index = 0; index < getMonthsToShow(); index += 1) {
        const visibleMonth = shiftMonths(viewMonth, index);
        if (visibleMonth.getFullYear() === year && visibleMonth.getMonth() === month) return index;
      }
      return -1;
    };

    const displayInput = _.input({
      class: uiClass(["cms-input", "cms-date-display", sizeValue, uiWhen(props.manualInput, "is-manual"), props.inputClass]),
      type: "text",
      autocomplete: "off",
      placeholder: props.placeholder || (
        mode === "range"
          ? "Seleziona andata e ritorno"
          : (mode === "range-multiple"
            ? "Seleziona intervalli"
            : (mode === "multiple" ? "Seleziona date" : "Seleziona data"))
      ),
      readOnly: !uiUnwrap(props.manualInput),
      disabled: !!uiUnwrap(props.disabled),
      value: formatDisplayValue(localValue, localTimeValue)
    });
    const hiddenHost = _.div({ style: { display: "contents" } });
    const controlNode = _.div({ class: "cms-date-control", style: { display: "contents" } }, displayInput, hiddenHost);

    const field = UI.FormField({
      ...props,
      iconRight: props.iconRight ?? "calendar_month",
      control: controlNode,
      getValue: () => displayInput.value,
      onClear: () => {
        if (uiUnwrap(props.disabled) || uiUnwrap(props.readonly)) return;
        setDateValue(emptyValue(), null);
        if (entry) closePanel();
      },
      onFocus: () => displayInput.focus()
    });

    const syncViewMonth = (value, options = {}) => {
      const current = options.focusIso || (
        mode === "range"
          ? (value?.from || value?.to || getDefaultViewValue())
          : (mode === "range-multiple"
            ? (value?.[value.length - 1]?.from || value?.[value.length - 1]?.to || getDefaultViewValue())
            : (mode === "multiple"
              ? (value?.[0] || getDefaultViewValue())
              : (value || getDefaultViewValue())))
      );
      let nextViewMonth = monthStart(current);
      if (options.preserveMonthOffset) {
        const monthOffset = Number.isInteger(options.visibleMonthOffset)
          ? options.visibleMonthOffset
          : getVisibleMonthOffset(options.anchorIso || options.focusIso || current);
        if (monthOffset > 0) nextViewMonth = shiftMonths(nextViewMonth, -monthOffset);
      }
      viewMonth = nextViewMonth;
    };

    const syncHiddenInputs = () => {
      hiddenHost.replaceChildren();
      const baseName = uiUnwrap(props.name);
      if (!baseName) return;
      const appendHidden = (name, value) => {
        hiddenHost.appendChild(_.input({ type: "hidden", name, value: value ?? "" }));
      };
      const value = localValue;
      if (mode === "single") {
        appendHidden(baseName, exportCurrentValue(value, localTimeValue));
        return;
      }
      if (mode === "range") {
        appendHidden(uiUnwrap(props.nameFrom) || `${baseName}_from`, value?.from || "");
        appendHidden(uiUnwrap(props.nameTo) || `${baseName}_to`, value?.to || "");
        return;
      }
      if (mode === "range-multiple") {
        const rangeList = Array.isArray(value) ? value : [];
        const fromName = /\[\]$/.test(uiUnwrap(props.nameFrom) || "") ? uiUnwrap(props.nameFrom) : `${uiUnwrap(props.nameFrom) || `${baseName}_from`}[]`;
        const toName = /\[\]$/.test(uiUnwrap(props.nameTo) || "") ? uiUnwrap(props.nameTo) : `${uiUnwrap(props.nameTo) || `${baseName}_to`}[]`;
        rangeList.forEach((item) => {
          appendHidden(fromName, item?.from || "");
          appendHidden(toName, item?.to || "");
        });
        return;
      }
      const listName = /\[\]$/.test(baseName) ? baseName : `${baseName}[]`;
      (Array.isArray(value) ? value : []).forEach((item) => appendHidden(listName, item));
    };

    const syncDisplay = () => {
      displayInput.readOnly = !uiUnwrap(props.manualInput);
      displayInput.disabled = !!uiUnwrap(props.disabled);
      displayInput.setAttribute("aria-expanded", entry ? "true" : "false");
      displayInput.value = formatDisplayValue(localValue, localTimeValue);
      syncHiddenInputs();
      field._refresh?.();
    };

    const setDateValue = (nextValue, event, options = {}) => {
      const normalized = normalizeValue(nextValue);
      const nextTime = isTimeEnabled()
        ? uiCloneTimeParts(
          uiExtractTimeFromValue(
            options.timeValue != null
              ? options.timeValue
              : (options.preserveTime ? getCurrentTimeValue() : nextValue),
            getTimeOptions()
          ) ?? (options.preserveTime ? getCurrentTimeValue() : null)
        )
        : null;
      const prev = serializeCurrentValue(localValue, localTimeValue);
      localValue = cloneValue(normalized);
      workingValue = cloneValue(normalized);
      if (isTimeEnabled()) {
        localTimeValue = uiCloneTimeParts(nextTime);
        workingTimeValue = uiCloneTimeParts(nextTime);
      }
      hoverDate = null;
      syncViewMonth(normalized, options);
      syncDisplay();
      renderPanel();
      if (model && options.fromModel !== true) model.set(exportCurrentValue(normalized, nextTime));
      const nextSerialized = serializeCurrentValue(normalized, nextTime);
      if (options.emit !== false && nextSerialized !== prev) {
        const emitted = exportCurrentValue(normalized, nextTime);
        props.onInput?.(emitted, event);
        props.onChange?.(emitted, event);
      }
      return normalized;
    };
    const setTimeValue = (nextValue, event, options = {}) => {
      if (!isTimeEnabled()) return null;
      const normalizedTime = uiCloneTimeParts(uiExtractTimeFromValue(nextValue, getTimeOptions()));
      if (uiUnwrap(props.confirm) && options.commit !== true) {
        workingTimeValue = normalizedTime;
        renderPanel();
        return normalizedTime;
      }
      const prev = serializeCurrentValue(localValue, localTimeValue);
      localTimeValue = uiCloneTimeParts(normalizedTime);
      workingTimeValue = uiCloneTimeParts(normalizedTime);
      syncDisplay();
      renderPanel();
      if (model && options.fromModel !== true) model.set(exportCurrentValue(localValue, normalizedTime));
      const nextSerialized = serializeCurrentValue(localValue, normalizedTime);
      if (options.emit !== false && nextSerialized !== prev) {
        const emitted = exportCurrentValue(localValue, normalizedTime);
        props.onInput?.(emitted, event);
        props.onChange?.(emitted, event);
      }
      return normalizedTime;
    };
    const setWorkingOrCommit = (nextValue, event, options = {}) => {
      if (uiUnwrap(props.confirm)) {
        workingValue = cloneValue(normalizeValue(nextValue));
        if (isTimeEnabled() && (options.timeValue != null || options.preserveTime)) {
          workingTimeValue = uiCloneTimeParts(uiExtractTimeFromValue(
            options.timeValue != null ? options.timeValue : getCurrentTimeValue(),
            getTimeOptions()
          ));
        }
        hoverDate = null;
        syncViewMonth(workingValue, options);
        renderPanel();
        return;
      }
      setDateValue(nextValue, event, options);
    };
    const selectionPreview = () => {
      const current = getCurrentValue();
      if (mode === "range") {
        if (!current?.from || current?.to || !hoverDate) return current;
        return compareIso(current.from, hoverDate) <= 0
          ? { from: current.from, to: hoverDate }
          : { from: hoverDate, to: current.from };
      }
      if (mode === "range-multiple") {
        const last = Array.isArray(current) && current.length ? current[current.length - 1] : null;
        if (!last?.from || last?.to || !hoverDate) return last;
        return compareIso(last.from, hoverDate) <= 0
          ? { from: last.from, to: hoverDate }
          : { from: hoverDate, to: last.from };
      }
      return current;
    };
    const renderedRanges = () => {
      if (mode === "range") {
        const preview = selectionPreview();
        return preview?.from ? [preview] : [];
      }
      if (mode === "range-multiple") {
        const current = Array.isArray(getCurrentValue()) ? getCurrentValue() : [];
        if (!current.length) return [];
        const preview = selectionPreview();
        if (!preview?.from) return current;
        return [...current.slice(0, -1), preview];
      }
      return [];
    };
    const isSelectedDate = (iso) => {
      const current = getCurrentValue();
      if (mode === "multiple") return current.includes(iso);
      if (mode === "range-multiple") {
        return Array.isArray(current) && current.some((range) => isSameIso(range?.from, iso) || isSameIso(range?.to, iso));
      }
      if (mode === "range") return isSameIso(current?.from, iso) || isSameIso(current?.to, iso);
      return isSameIso(current, iso);
    };
    const isInRange = (iso) => {
      if (mode !== "range" && mode !== "range-multiple") return false;
      return renderedRanges().some((range) => range?.from && range?.to && iso >= range.from && iso <= range.to);
    };
    const updateRangeHover = (iso, options = {}) => {
      const current = getCurrentValue();
      const pendingRange = mode === "range"
        ? current
        : (mode === "range-multiple"
          ? (Array.isArray(current) && current.length ? current[current.length - 1] : null)
          : null);
      if (!pendingRange?.from || pendingRange?.to || hoverDate === iso) return;
      hoverDate = iso;
      // Re-rendering on focus replaces the clicked day button before the click event fires.
      if (options.render !== false) renderPanel();
    };
    const shouldCloseOnSelect = () => {
      if (uiUnwrap(props.confirm)) return false;
      if (props.closeOnSelect === false) return false;
      if (mode === "multiple" || mode === "range-multiple") return !!props.closeOnSelect;
      return true;
    };
    const selectDate = (iso, event, selectionOptions = {}) => {
      if (!isDateAllowed(iso) || uiUnwrap(props.disabled) || uiUnwrap(props.readonly)) return;
      const syncOptions = {
        focusIso: iso,
        anchorIso: iso,
        preserveTime: isTimeEnabled(),
        timeValue: getCurrentTimeValue(),
        preserveMonthOffset: !!entry && getMonthsToShow() > 1,
        visibleMonthOffset: Number.isInteger(selectionOptions.visibleMonthOffset) ? selectionOptions.visibleMonthOffset : null
      };
      if (mode === "multiple") {
        const list = normalizeMultipleValue(getCurrentValue());
        const next = list.includes(iso) ? list.filter((item) => item !== iso) : [...list, iso];
        setWorkingOrCommit(next.sort(), event, syncOptions);
        if (shouldCloseOnSelect()) closePanel();
        return;
      }
      if (mode === "range") {
        const current = cloneValue(getCurrentValue());
        let next;
        if (!current.from || (current.from && current.to)) {
          next = { from: iso, to: null };
        } else if (compareIso(iso, current.from) < 0) {
          next = { from: iso, to: current.from };
        } else {
          next = { from: current.from, to: iso };
        }
        setWorkingOrCommit(next, event, syncOptions);
        if (next.to && shouldCloseOnSelect()) closePanel();
        return;
      }
      if (mode === "range-multiple") {
        const list = normalizeRangeMultipleValue(getCurrentValue());
        const last = list.length ? list[list.length - 1] : null;
        let next;
        if (!last?.from || last?.to) {
          next = [...list, { from: iso, to: null }];
        } else if (compareIso(iso, last.from) < 0) {
          next = [...list.slice(0, -1), { from: iso, to: last.from }];
        } else {
          next = [...list.slice(0, -1), { from: last.from, to: iso }];
        }
        setWorkingOrCommit(next, event, syncOptions);
        if (next[next.length - 1]?.to && shouldCloseOnSelect()) closePanel();
        return;
      }
      setWorkingOrCommit(iso, event, syncOptions);
      if (shouldCloseOnSelect()) closePanel();
    };
    const clearValue = () => {
      mouseSelectedDate = null;
      setDateValue(emptyValue(), null, { timeValue: null });
    };
    const jumpToToday = () => {
      const today = todayIso();
      if (!isDateAllowed(today)) {
        syncViewMonth(today);
        renderPanel();
        return;
      }
      if (mode === "range") {
        const tomorrow = shiftDays(today, 1);
        const next = tomorrow && isDateAllowed(tomorrow) ? { from: today, to: tomorrow } : { from: today, to: null };
        setWorkingOrCommit(next, null);
        return;
      }
      if (mode === "range-multiple") {
        const tomorrow = shiftDays(today, 1);
        const next = tomorrow && isDateAllowed(tomorrow)
          ? [{ from: today, to: tomorrow }]
          : [{ from: today, to: null }];
        setWorkingOrCommit(next, null);
        return;
      }
      if (mode === "multiple") {
        setWorkingOrCommit([today], null);
        return;
      }
      setWorkingOrCommit(today, null, { preserveTime: isTimeEnabled(), timeValue: getCurrentTimeValue() });
    };
    const scrollTimeColumnsToSelection = (options = {}) => {
      uiCenterTimeColumnsToSelection(panelRoot, options);
    };
    const jumpToNow = () => {
      if (!isTimeEnabled()) return;
      const scrollState = uiCaptureTimeColumnScrollState(panelRoot);
      setTimeValue(new Date(), null, { commit: !uiUnwrap(props.confirm) });
      scrollTimeColumnsToSelection({ scrollState });
      if (!uiUnwrap(props.confirm) && props.closeOnSelect === true) closePanel();
    };
    const applyWorkingValue = () => {
      if (!uiUnwrap(props.confirm)) return;
      setDateValue(workingValue, null, { timeValue: workingTimeValue, preserveTime: true });
      if (props.closeOnSelect !== false) closePanel();
    };

    const renderPanel = () => {
      if (!panelRoot) return;
      const locale = getLocale();
      const monthLabelFormatter = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" });
      const weekdayFormatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
      const titleDates = Array.from({ length: 7 }, (_, index) => {
        const day = (getFirstDayOfWeek() + index) % 7;
        return weekdayFormatter.format(new Date(2024, 0, 7 + day));
      });
      const pickerValue = getCurrentValue();

      const buildDayPoint = (ctx) => {
        let pointNode = CMSwift.ui.renderSlot(slots, "point", ctx, null);
        if (pointNode == null) pointNode = CMSwift.ui.renderSlot(slots, "dayPoint", ctx, null);
        if (pointNode == null && props.pointIcon != null && (ctx.selected || ctx.inRange || ctx.today)) {
          pointNode = typeof props.pointIcon === "string"
            ? UI.Icon({ name: props.pointIcon, size: 10 })
            : CMSwift.ui.slot(props.pointIcon, ctx);
        }
        return renderSlotToArray(null, "default", ctx, pointNode);
      };

      const renderMonth = (baseDate, monthOffset) => {
        const year = baseDate.getFullYear();
        const month = baseDate.getMonth();
        const start = new Date(year, month, 1);
        const offset = (start.getDay() - getFirstDayOfWeek() + 7) % 7;
        const gridStart = new Date(year, month, 1 - offset);
        const monthBox = _.div({ class: "cms-date-month" });
        monthBox.appendChild(_.div({ class: "cms-date-month-title" }, monthLabelFormatter.format(start)));

        const weekdays = _.div({ class: "cms-date-weekdays" });
        titleDates.forEach((label) => weekdays.appendChild(_.div({ class: "cms-date-weekday" }, label)));
        monthBox.appendChild(weekdays);

        const grid = _.div({ class: "cms-date-grid" });
        for (let index = 0; index < 42; index += 1) {
          const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + index);
          const iso = toIsoDate(date);
          const inMonth = date.getMonth() === month;
          const selected = isSelectedDate(iso);
          const inRange = isInRange(iso);
          const rangeStart = (mode === "range" || mode === "range-multiple") && renderedRanges().some((range) => isSameIso(range?.from, iso));
          const rangeEnd = (mode === "range" || mode === "range-multiple") && renderedRanges().some((range) => isSameIso(range?.to, iso));
          const disabled = !isDateAllowed(iso);
          const ctx = {
            ...getDateContext(iso),
            selected,
            inRange,
            rangeStart,
            rangeEnd,
            disabled,
            outside: !inMonth,
            value: pickerValue,
            select: () => selectDate(iso, null, { visibleMonthOffset: monthOffset })
          };
          const pointNodes = buildDayPoint(ctx);
          const labelNode = CMSwift.ui.renderSlot(slots, "day", ctx, String(date.getDate()));
          const labelNodes = renderSlotToArray(null, "default", ctx, labelNode);
          const dayBtn = _.button({
            type: "button",
            class: uiClass([
              "cms-date-day",
              uiWhen(!inMonth, "is-outside"),
              uiWhen(selected, "is-selected"),
              uiWhen(inRange, "is-in-range"),
              uiWhen(rangeStart, "is-range-start"),
              uiWhen(rangeEnd, "is-range-end"),
              uiWhen(disabled, "is-disabled"),
              uiWhen(isSameIso(iso, todayIso()), "is-today"),
              uiWhen(pointNodes.length, "has-point")
            ]),
            disabled,
            onMouseDown: (event) => {
              if (event.button !== 0) return;
              mouseSelectedDate = iso;
              event.preventDefault();
              selectDate(iso, event, { visibleMonthOffset: monthOffset });
            },
            onClick: (event) => {
              if (mouseSelectedDate != null && event.detail !== 0) {
                mouseSelectedDate = null;
                return;
              }
              mouseSelectedDate = null;
              selectDate(iso, event, { visibleMonthOffset: monthOffset });
            },
            onMouseEnter: () => updateRangeHover(iso),
            onFocus: () => updateRangeHover(iso, { render: false })
          },
            _.span({ class: "cms-date-day-label" }, ...labelNodes),
            pointNodes.length ? _.span({ class: "cms-date-day-point" }, ...pointNodes) : null
          );
          grid.appendChild(dayBtn);
        }
        monthBox.appendChild(grid);
        return monthBox;
      };

      const min = getMin();
      const max = getMax();
      const candidateYears = [
        viewMonth.getFullYear(),
        fromIsoDate(todayIso())?.getFullYear(),
        fromIsoDate(min)?.getFullYear(),
        fromIsoDate(max)?.getFullYear(),
        fromIsoDate(uiUnwrap(props.defaultMonth))?.getFullYear()
      ];
      if (mode === "range") {
        candidateYears.push(fromIsoDate(pickerValue?.from)?.getFullYear(), fromIsoDate(pickerValue?.to)?.getFullYear());
      } else if (mode === "range-multiple") {
        pickerValue.forEach((item) => {
          candidateYears.push(fromIsoDate(item?.from)?.getFullYear(), fromIsoDate(item?.to)?.getFullYear());
        });
      } else if (mode === "multiple") {
        pickerValue.forEach((item) => candidateYears.push(fromIsoDate(item)?.getFullYear()));
      } else {
        candidateYears.push(fromIsoDate(pickerValue)?.getFullYear());
      }
      const validYears = candidateYears.filter((year) => Number.isFinite(year));
      const inferredYearStart = (validYears.length ? Math.min(...validYears) : viewMonth.getFullYear()) - 100;
      const inferredYearEnd = (validYears.length ? Math.max(...validYears) : viewMonth.getFullYear()) + 50;
      const yearStart = Number(uiUnwrap(props.yearStart ?? (min ? fromIsoDate(min)?.getFullYear() : null) ?? inferredYearStart));
      const yearEnd = Number(uiUnwrap(props.yearEnd ?? (max ? fromIsoDate(max)?.getFullYear() : null) ?? inferredYearEnd));
      const monthSelect = _.select({
        class: "cms-date-select",
        value: String(viewMonth.getMonth()),
        onChange: (event) => {
          viewMonth = new Date(viewMonth.getFullYear(), Number(event.currentTarget.value), 1);
          props.onNavigate?.({ month: viewMonth.getMonth() + 1, year: viewMonth.getFullYear() });
          renderPanel();
        }
      },
        ...Array.from({ length: 12 }, (_, index) => uiOptionNode({ value: String(index) }, new Intl.DateTimeFormat(locale, { month: "long" }).format(new Date(2024, index, 1))))
      );
      const yearSelect = _.select({
        class: "cms-date-select cms-date-select-year",
        value: String(viewMonth.getFullYear()),
        onChange: (event) => {
          viewMonth = new Date(Number(event.currentTarget.value), viewMonth.getMonth(), 1);
          props.onNavigate?.({ month: viewMonth.getMonth() + 1, year: viewMonth.getFullYear() });
          renderPanel();
        }
      },
        ...Array.from({ length: Math.max(1, yearEnd - yearStart + 1) }, (_, index) => {
          const year = yearStart + index;
          return uiOptionNode({ value: String(year) }, String(year));
        })
      );

      const header = _.div({ class: "cms-date-header" },
        _.button({
          type: "button",
          class: "cms-date-nav",
          onClick: () => {
            viewMonth = shiftMonths(viewMonth, -1);
            props.onNavigate?.({ month: viewMonth.getMonth() + 1, year: viewMonth.getFullYear() });
            renderPanel();
          }
        }, UI.Icon({ name: "chevron_left", size: 16 })),
        _.div({ class: "cms-date-header-center" }, monthSelect, yearSelect),
        _.button({
          type: "button",
          class: "cms-date-nav",
          onClick: () => {
            viewMonth = shiftMonths(viewMonth, 1);
            props.onNavigate?.({ month: viewMonth.getMonth() + 1, year: viewMonth.getFullYear() });
            renderPanel();
          }
        }, UI.Icon({ name: "chevron_right", size: 16 }))
      );

      const shortcuts = _.div({ class: "cms-date-shortcuts" });
      const shortcutList = uiUnwrap(props.shortcuts ?? props.presets) || [];
      shortcutList.forEach((item, index) => {
        if (!item) return;
        const rawValue = typeof item.value === "function" ? item.value({ today: todayIso() }) : item.value;
        const label = item.label ?? item.text ?? `Preset ${index + 1}`;
        shortcuts.appendChild(_.button({
          type: "button",
          class: "cms-date-shortcut",
          onClick: () => setWorkingOrCommit(rawValue, null, { preserveTime: isTimeEnabled(), timeValue: getCurrentTimeValue() })
        }, label));
      });

      const months = _.div({ class: "cms-date-months" });
      for (let index = 0; index < getMonthsToShow(); index += 1) {
        months.appendChild(renderMonth(shiftMonths(viewMonth, index), index));
      }
      const footerDisplayValue = formatDisplayValue(pickerValue, getCurrentTimeValue());
      const footerValue = _.div({ class: "cms-date-value" },
        ...renderSlotToArray(
          slots,
          "value",
          { value: pickerValue, displayValue: footerDisplayValue, mode, timeValue: getCurrentTimeValue() },
          footerDisplayValue || renderSlotToArray(slots, "default", {}, children)
        )
      );
      const headerTime = _.div({ class: "cms-time-header" });
      const columnsTime = _.div({ class: "cms-time-columns-2" },
        _.div({ class: "cms-time-column-title" }, uiUnwrap(props.hoursLabel) || "Ore"),
        _.div({ class: "cms-time-column-title" }, uiUnwrap(props.minutesLabel) || "Min")
      );
      headerTime.appendChild(columnsTime);
      const bodyTime = isTimeEnabled()
        ? uiCreateTimePickerSection({
          props: {
            min: uiUnwrap(props.timeMin ?? props.minTime),
            max: uiUnwrap(props.timeMax ?? props.maxTime),
            use12h: uiUnwrap(props.time12h ?? props.use12h ?? props.ampm),
            hoursLabel: uiUnwrap(props.timeHoursLabel) || "Ore",
            minutesLabel: uiUnwrap(props.timeMinutesLabel) || "Min",
            secondsLabel: uiUnwrap(props.timeSecondsLabel) || "Sec"
          },
          slots,
          slotPrefix: "time",
          value: getCurrentTimeValue(),
          withSeconds: false,
          minuteStep: 1,
          secondStep: getTimeSecondStep(),
          disabled: !!uiUnwrap(props.disabled),
          readonly: !!uiUnwrap(props.readonly),
          embedded: true,
          pointIcon: uiUnwrap(props.timePointIcon),
          shortcuts: uiUnwrap(props.timeShortcuts ?? props.timePresets),
          onSelect: (nextTime) => {
            const scrollState = uiCaptureTimeColumnScrollState(panelRoot);
            setTimeValue(nextTime, null);
            scrollTimeColumnsToSelection({ scrollState });
          }
        })
        : null;
      const footerInfo = _.div({ class: "cms-date-footer-info" },
        footerValue
      );

      const footer = _.div({ class: uiClass(["cms-date-footer", uiWhen(isTimeEnabled(), "has-time")]) },
        footerInfo,
        _.div({ class: "cms-date-actions" },
          _.button({ type: "button", class: "cms-date-action", onClick: jumpToToday }, uiUnwrap(props.todayLabel) || "Oggi"),
          uiUnwrap(props.clearable) !== false
            ? _.button({ type: "button", class: "cms-date-action", onClick: clearValue }, uiUnwrap(props.clearLabel) || "Reset")
            : null,
          uiUnwrap(props.confirm)
            ? _.button({ type: "button", class: "cms-date-action is-primary", onClick: applyWorkingValue }, uiUnwrap(props.applyLabel) || "Applica")
            : null
        )
      );

      const footerTimer = _.div(_.button({ type: "button", class: "cms-date-action cms-w-lg", onClick: jumpToNow }, uiUnwrap(props.nowLabel) || "Ora"));

      const contentTimer = isTimeEnabled() ? _.div({ class: "cms-date-time" }, headerTime, bodyTime, footerTimer) : null;

      panelRoot.replaceChildren(
        _.div({
          class: "cms-date-panel-root",
          onKeydown: (event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              closePanel();
            }
          }
        },
          header,
          shortcutList.length ? shortcuts : null,
          _.div({ class: 'cms-data-time' }, months, contentTimer),
          footer
        )
      );
    };

    function openPanel() {
      if (entry || uiUnwrap(props.disabled) || uiUnwrap(props.readonly)) return entry;
      workingValue = cloneValue(localValue);
      workingTimeValue = uiCloneTimeParts(localTimeValue);
      hoverDate = null;
      mouseSelectedDate = null;
      syncViewMonth(workingValue);
      entry = CMSwift.overlay.open(({ close }) => {
        const fallback = (mode === "range" || mode === "range-multiple") ? 2 : 1;
        const raw = Number(uiUnwrap(props.monthsToShow) ?? fallback);
        panelRoot = _.div({ class: uiClassStatic(["cms-date-panel", uiUnwrap(sizeValue), uiWhen(raw > 1, "multi-month"), props.panelClass]) });
        renderPanel();
        return panelRoot;
      }, {
        type: "date",
        anchorEl: field._control || displayInput,
        placement: props.placement || "bottom-start",
        offsetX: props.offsetX ?? 0,
        offsetY: props.offsetY ?? props.offset ?? 8,
        backdrop: false,
        lockScroll: false,
        trapFocus: false,
        closeOnOutside: props.closeOnOutside !== false,
        closeOnBackdrop: false,
        closeOnEsc: true,
        autoFocus: false,
        className: uiClassStatic(["cms-date-overlay", props.panelClass, uiWhen(isTimeEnabled(), "has-time")]),
        onClose: () => {
          entry = null;
          panelRoot = null;
          hoverDate = null;
          syncDisplay();
          props.onClose?.();
        }
      });
      if (props.panelStyle) Object.assign(entry.panel.style, props.panelStyle);
      overlayEnter(entry);
      syncDisplay();
      props.onOpen?.();
      return entry;
    }

    function closePanel() {
      if (!entry) return;
      mouseSelectedDate = null;
      const toClose = entry;
      overlayLeave(toClose, () => CMSwift.overlay.close(toClose.id));
    }

    displayInput.addEventListener("focus", (event) => {
      props.onFocus?.(event);
      if (props.openOnFocus !== false) openPanel();
    });
    displayInput.addEventListener("click", (event) => {
      props.onClick?.(event);
      openPanel();
    });
    displayInput.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (entry) {
          event.preventDefault();
          closePanel();
        }
        return;
      }
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPanel();
      }
      if ((event.key === "Backspace" || event.key === "Delete") && !uiUnwrap(props.manualInput) && uiUnwrap(props.clearable) !== false) {
        event.preventDefault();
        clearValue();
      }
    });
    if (uiUnwrap(props.manualInput)) {
      displayInput.addEventListener("input", (event) => {
        props.onTyping?.(displayInput.value, event);
      });
      displayInput.addEventListener("change", (event) => {
        const parsed = parseTypedValue(displayInput.value);
        setDateValue(parsed, event, { timeValue: uiExtractTimeFromValue(displayInput.value, getTimeOptions()), preserveTime: !uiExtractTimeFromValue(displayInput.value, getTimeOptions()) });
      });
      displayInput.addEventListener("blur", (event) => {
        props.onBlur?.(event);
        const parsed = parseTypedValue(displayInput.value);
        if (displayInput.value === "") clearValue();
        else setDateValue(parsed, event, { timeValue: uiExtractTimeFromValue(displayInput.value, getTimeOptions()), preserveTime: !uiExtractTimeFromValue(displayInput.value, getTimeOptions()) });
      });
    } else {
      displayInput.addEventListener("blur", (event) => props.onBlur?.(event));
    }

    if (model) {
      model.watch((next) => {
        const normalized = normalizeValue(next);
        const nextTime = resolveDateTimeTimeValue(next);
        if (serializeCurrentValue(normalized, nextTime) === serializeCurrentValue(localValue, localTimeValue)) return;
        localValue = normalized;
        workingValue = cloneValue(localValue);
        localTimeValue = uiCloneTimeParts(nextTime);
        workingTimeValue = uiCloneTimeParts(nextTime);
        hoverDate = null;
        syncViewMonth(localValue);
        syncDisplay();
        renderPanel();
      }, "UI.Date:watch");
    }

    CMSwift.reactive.effect(() => {
      if (!model && props.value != null) {
        localValue = normalizeValue(uiUnwrap(props.value));
        workingValue = cloneValue(localValue);
        localTimeValue = resolveDateTimeTimeValue(uiUnwrap(props.value));
        workingTimeValue = uiCloneTimeParts(localTimeValue);
      } else if (isTimeEnabled() && props.timeValue != null) {
        localTimeValue = resolveDateTimeTimeValue(uiUnwrap(props.timeValue));
        workingTimeValue = uiCloneTimeParts(localTimeValue);
      }
      syncDisplay();
      renderPanel();
      if (entry && uiUnwrap(props.disabled)) closePanel();
    }, "UI.Date:render");

    field._input = displayInput;
    field._date = displayInput;
    field._open = openPanel;
    field._close = closePanel;
    field._getValue = () => exportCurrentValue(localValue, localTimeValue);
    field._setValue = (value) => setDateValue(value, null, { emit: false, timeValue: resolveDateTimeTimeValue(value) });
    field._time = () => uiCloneTimeParts(localTimeValue);
    field._panel = () => entry?.panel || null;

    return field;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Date = {
      signature: "UI.Date(props)",
      props: {
        value: "string | { from, to } | string[] | Array<{ from, to }> | Array<[from, to]>",
        model: "rod | [get,set] signal",
        mode: "\"single\"|\"range\"|\"multiple\"|\"range-multiple\"",
        range: "boolean",
        multiple: "boolean",
        rangeMultiple: "boolean",
        multipleRange: "Alias di rangeMultiple",
        min: "string",
        max: "string",
        minDate: "Alias di min",
        maxDate: "Alias di max",
        minRange: "number",
        maxRange: "number",
        manualInput: "boolean",
        firstDayOfWeek: "number",
        monthsToShow: "number",
        locale: "string",
        shortcuts: "Array<{ label, value }>",
        options: "Array|string|Function",
        enableDates: "Alias di options",
        disableDates: "Array|string|Function",
        label: "String|Node|Function|Array",
        icon: "String|Node|Function|Array",
        iconRight: "String|Node|Function|Array",
        pointIcon: "String|Node|Function|Array",
        withTime: "boolean",
        timeValue: "string|Date",
        timeMin: "string",
        timeMax: "string",
        timeMinuteStep: "number",
        timeSecondStep: "number",
        timeWithSeconds: "boolean",
        timeShortcuts: "Array<{ label, value }>",
        timePointIcon: "String|Node|Function|Array",
        clearable: "boolean",
        confirm: "boolean",
        name: "string",
        nameFrom: "string",
        nameTo: "string",
        size: "\"xs\"|\"sm\"|\"md\"|\"lg\"|\"xl\"",
        class: "string",
        style: "object"
      },
      slots: {
        day: "Contenuto del giorno ({ date, selected, inRange, disabled, outside })",
        point: "Punto/icona nel giorno",
        dayPoint: "Alias di point",
        value: "Footer value renderer ({ value, displayValue, mode })",
        timeOption: "Renderer per opzione oraria nel footer integrato",
        timePoint: "Punto/icona nella time option del footer",
        timeShortcut: "Renderer scorciatoia oraria integrata",
        label: "Floating label",
        topLabel: "Top label",
        icon: "Left icon",
        iconRight: "Right icon",
        default: "Fallback value content"
      },
      events: {
        onChange: "(value, event)",
        onInput: "(value, event)",
        onOpen: "void",
        onClose: "void",
        onNavigate: "({ month, year })"
      },
      returns: "HTMLDivElement (field wrapper) con ._input, ._open(), ._close(), ._getValue(), ._setValue(value)",
      description: "Date picker reattivo con overlay fixed, single/range/multiple/multi-range, model, min/max, presets, size xs-xl e supporto opzionale al tempo in interfaccia unificata."
    };
  }
  // Esempio: CMSwift.ui.Date({ value: "2024-01-01" })

  UI.Time = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const sizeValue = uiComputed(props.size, () => {
      const value = String(uiUnwrap(props.size) || "").toLowerCase();
      return ["xs", "sm", "md", "lg", "xl"].includes(value) ? `cms-size-${value}` : "";
    });
    const getTimeOptions = () => {
      const detectedTime = uiExportTimeValue(
        uiExtractTimeFromValue(model ? model.get() : uiUnwrap(props.value) ?? initialRawValue, { withSeconds: true }),
        { withSeconds: true }
      );
      return {
        withSeconds: !!uiUnwrap(props.withSeconds ?? props.showSeconds) || /:\d{2}:\d{2}$/.test(detectedTime),
        min: uiUnwrap(props.min ?? props.minTime),
        max: uiUnwrap(props.max ?? props.maxTime),
        use12h: uiUnwrap(props.use12h ?? props.ampm)
      };
    };
    const getMinuteStep = () => {
      const raw = Number(uiUnwrap(props.minuteStep ?? 1));
      return Math.max(1, Math.min(30, Number.isFinite(raw) ? raw : 5));
    };
    const getSecondStep = () => {
      const raw = Number(uiUnwrap(props.secondStep ?? 1));
      return Math.max(1, Math.min(30, Number.isFinite(raw) ? raw : 5));
    };
    const valueBinding = props.model || ((uiIsSignal(props.value) || uiIsRod(props.value)) ? props.value : null);
    const model = resolveModel(valueBinding, "UI.Time:model");
    const initialRawValue = model ? model.get() : uiUnwrap(props.value);
    const parseTypedValue = (raw) => uiExtractTimeFromValue(raw, getTimeOptions());
    const formatDisplayValue = (value) => uiFormatTimeDisplay(value, getTimeOptions());
    const exportValue = (value) => uiExportTimeValue(value, getTimeOptions());
    const serializeValue = (value) => JSON.stringify(exportValue(value));

    let localValue = uiCloneTimeParts(parseTypedValue(initialRawValue));
    let workingValue = uiCloneTimeParts(localValue);
    let entry = null;
    let panelRoot = null;

    const displayInput = _.input({
      class: uiClass(["cms-input", "cms-time-display", sizeValue, uiWhen(props.manualInput, "is-manual"), props.inputClass]),
      type: "text",
      autocomplete: "off",
      placeholder: props.placeholder || "Seleziona orario",
      readOnly: !uiUnwrap(props.manualInput),
      disabled: !!uiUnwrap(props.disabled),
      value: formatDisplayValue(localValue)
    });
    displayInput.setAttribute("aria-haspopup", "dialog");
    const hiddenHost = _.div({ style: { display: "contents" } });
    const controlNode = _.div({ class: "cms-time-control", style: { display: "contents" } }, displayInput, hiddenHost);

    const field = UI.FormField({
      ...props,
      iconRight: props.iconRight ?? "schedule",
      control: controlNode,
      getValue: () => displayInput.value,
      onClear: () => {
        if (uiUnwrap(props.disabled) || uiUnwrap(props.readonly)) return;
        setTimeState(null, null, { commit: true });
        if (entry) closePanel();
      },
      onFocus: () => displayInput.focus()
    });

    const getCurrentValue = () => uiUnwrap(props.confirm) ? workingValue : localValue;
    const syncHiddenInputs = () => {
      hiddenHost.replaceChildren();
      const baseName = uiUnwrap(props.name);
      if (!baseName) return;
      hiddenHost.appendChild(_.input({ type: "hidden", name: baseName, value: exportValue(localValue) }));
    };
    const syncDisplay = () => {
      displayInput.readOnly = !uiUnwrap(props.manualInput);
      displayInput.disabled = !!uiUnwrap(props.disabled);
      displayInput.setAttribute("aria-expanded", entry ? "true" : "false");
      displayInput.value = formatDisplayValue(localValue);
      syncHiddenInputs();
      field._refresh?.();
    };
    const setTimeState = (nextValue, event, options = {}) => {
      const normalized = uiCloneTimeParts(parseTypedValue(nextValue));
      if (uiUnwrap(props.confirm) && options.commit !== true) {
        workingValue = uiCloneTimeParts(normalized);
        renderPanel();
        return normalized;
      }
      const prev = serializeValue(localValue);
      localValue = uiCloneTimeParts(normalized);
      workingValue = uiCloneTimeParts(normalized);
      syncDisplay();
      renderPanel();
      if (model && options.fromModel !== true) model.set(exportValue(normalized));
      const nextSerialized = serializeValue(normalized);
      if (options.emit !== false && nextSerialized !== prev) {
        const emitted = exportValue(normalized);
        props.onInput?.(emitted, event);
        props.onChange?.(emitted, event);
      }
      return normalized;
    };
    const shouldCloseOnSelect = (meta) => {
      if (uiUnwrap(props.confirm)) return false;
      if (props.closeOnSelect !== true) return false;
      if (getTimeOptions().withSeconds) return meta?.part === "second";
      return meta?.part === "minute";
    };
    const scrollTimeColumnsToSelection = (options = {}) => {
      uiCenterTimeColumnsToSelection(panelRoot, options);
    };
    const jumpToNow = () => {
      const scrollState = uiCaptureTimeColumnScrollState(panelRoot);
      setTimeState(new Date(), null, { commit: !uiUnwrap(props.confirm) });
      scrollTimeColumnsToSelection({ scrollState });
      if (!uiUnwrap(props.confirm) && props.closeOnSelect === true) closePanel();
    };
    const applyWorkingValue = () => {
      if (!uiUnwrap(props.confirm)) return;
      setTimeState(workingValue, null, { commit: true });
      if (props.closeOnSelect !== false) closePanel();
    };

    const renderPanel = () => {
      if (!panelRoot) return;
      const currentValue = getCurrentValue();
      const footerDisplayValue = formatDisplayValue(currentValue);
      const header = _.div({ class: "cms-time-header" });
      const columns = _.div({ class: "cms-time-columns" },
        _.div({ class: "cms-time-column-title" }, uiUnwrap(props.hoursLabel) || "Ore"),
        _.div({ class: "cms-time-column-title" }, uiUnwrap(props.minutesLabel) || "Min")
      );
      const withSeconds = getTimeOptions().withSeconds;
      if (withSeconds) {
        columns.appendChild(_.div({ class: "cms-time-column-title" }, uiUnwrap(props.secondsLabel) || "Sec"));
      }
      header.appendChild(columns);
      const body = uiCreateTimePickerSection({
        props: {
          min: uiUnwrap(props.min ?? props.minTime),
          max: uiUnwrap(props.max ?? props.maxTime),
          use12h: uiUnwrap(props.use12h ?? props.ampm),
          hoursLabel: uiUnwrap(props.hoursLabel) || "Ore",
          minutesLabel: uiUnwrap(props.minutesLabel) || "Min",
          secondsLabel: uiUnwrap(props.secondsLabel) || "Sec"
        },
        slots,
        value: currentValue,
        withSeconds: withSeconds,
        minuteStep: getMinuteStep(),
        secondStep: getSecondStep(),
        disabled: !!uiUnwrap(props.disabled),
        readonly: !!uiUnwrap(props.readonly),
        pointIcon: uiUnwrap(props.pointIcon),
        shortcuts: uiUnwrap(props.shortcuts ?? props.presets),
        onSelect: (nextTime, meta) => {
          const scrollState = uiCaptureTimeColumnScrollState(panelRoot);
          setTimeState(nextTime, null);
          scrollTimeColumnsToSelection({ scrollState });
          if (shouldCloseOnSelect(meta)) closePanel();
        }
      });
      const footer = _.div({ class: "cms-time-footer" },
        _.div({ class: "cms-time-value" },
          ...renderSlotToArray(
            slots,
            "value",
            { value: currentValue, displayValue: footerDisplayValue },
            footerDisplayValue || renderSlotToArray(slots, "default", {}, children)
          )
        ),
        _.div({ class: "cms-time-actions" },
          _.button({ type: "button", class: "cms-time-action", onClick: jumpToNow }, uiUnwrap(props.nowLabel) || "Ora"),
          uiUnwrap(props.clearable) !== false
            ? _.button({ type: "button", class: "cms-time-action", onClick: () => setTimeState(null, null, { commit: !uiUnwrap(props.confirm) }) }, uiUnwrap(props.clearLabel) || "Reset")
            : null,
          uiUnwrap(props.confirm)
            ? _.button({ type: "button", class: "cms-time-action is-primary", onClick: applyWorkingValue }, uiUnwrap(props.applyLabel) || "Applica")
            : null
        )
      );
      panelRoot.replaceChildren(_.div({
        class: "cms-time-panel-root",
        onKeydown: (event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            closePanel();
          }
        }
      }, header, body, footer));
    };

    function openPanel() {
      if (entry || uiUnwrap(props.disabled) || uiUnwrap(props.readonly)) return entry;
      workingValue = uiCloneTimeParts(localValue);
      entry = CMSwift.overlay.open(() => {
        panelRoot = _.div({ class: uiClassStatic(["cms-time-panel", uiUnwrap(sizeValue), props.panelClass]) });
        renderPanel();
        return panelRoot;
      }, {
        type: "time",
        anchorEl: field._control || displayInput,
        placement: props.placement || "bottom-start",
        offsetX: props.offsetX ?? 0,
        offsetY: props.offsetY ?? props.offset ?? 8,
        backdrop: false,
        lockScroll: false,
        trapFocus: false,
        closeOnOutside: props.closeOnOutside !== false,
        closeOnBackdrop: false,
        closeOnEsc: true,
        autoFocus: false,
        className: uiClassStatic(["cms-time-overlay", props.panelClass]),
        onClose: () => {
          entry = null;
          panelRoot = null;
          syncDisplay();
          props.onClose?.();
        }
      });
      if (props.panelStyle) Object.assign(entry.panel.style, props.panelStyle);
      overlayEnter(entry);
      scrollTimeColumnsToSelection();
      syncDisplay();
      props.onOpen?.();
      return entry;
    }

    function closePanel() {
      if (!entry) return;
      const toClose = entry;
      overlayLeave(toClose, () => CMSwift.overlay.close(toClose.id));
    }

    displayInput.addEventListener("focus", (event) => {
      props.onFocus?.(event);
      if (props.openOnFocus !== false) openPanel();
    });
    displayInput.addEventListener("click", (event) => {
      props.onClick?.(event);
      openPanel();
    });
    displayInput.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (entry) {
          event.preventDefault();
          closePanel();
        }
        return;
      }
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPanel();
      }
      if ((event.key === "Backspace" || event.key === "Delete") && !uiUnwrap(props.manualInput) && uiUnwrap(props.clearable) !== false) {
        event.preventDefault();
        setTimeState(null, event, { commit: true });
      }
    });
    if (uiUnwrap(props.manualInput)) {
      displayInput.addEventListener("input", (event) => props.onTyping?.(displayInput.value, event));
      displayInput.addEventListener("change", (event) => setTimeState(displayInput.value, event));
      displayInput.addEventListener("blur", (event) => {
        props.onBlur?.(event);
        if (displayInput.value === "") setTimeState(null, event);
        else setTimeState(displayInput.value, event);
      });
    } else {
      displayInput.addEventListener("blur", (event) => props.onBlur?.(event));
    }

    if (model) {
      model.watch((next) => {
        const normalized = uiCloneTimeParts(parseTypedValue(next));
        if (serializeValue(normalized) === serializeValue(localValue)) return;
        localValue = uiCloneTimeParts(normalized);
        workingValue = uiCloneTimeParts(normalized);
        syncDisplay();
        renderPanel();
      }, "UI.Time:watch");
    }

    CMSwift.reactive.effect(() => {
      if (!model && props.value != null) {
        localValue = uiCloneTimeParts(parseTypedValue(uiUnwrap(props.value)));
        workingValue = uiCloneTimeParts(localValue);
      }
      syncDisplay();
      renderPanel();
      if (entry && uiUnwrap(props.disabled)) closePanel();
    }, "UI.Time:render");

    field._input = displayInput;
    field._time = displayInput;
    field._open = openPanel;
    field._close = closePanel;
    field._getValue = () => exportValue(localValue);
    field._setValue = (value) => setTimeState(value, null, { emit: false, commit: true });
    field._panel = () => entry?.panel || null;

    return field;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Time = {
      signature: "UI.Time(props)",
      props: {
        value: "string|Date",
        model: "rod | [get,set] signal",
        min: "string",
        max: "string",
        minuteStep: "number",
        secondStep: "number",
        withSeconds: "boolean",
        manualInput: "boolean",
        clearable: "boolean",
        confirm: "boolean",
        label: "String|Node|Function|Array",
        icon: "String|Node|Function|Array",
        iconRight: "String|Node|Function|Array",
        pointIcon: "String|Node|Function|Array",
        shortcuts: "Array<{ label, value }>",
        name: "string",
        class: "string",
        style: "object"
      },
      slots: {
        option: "Renderer per opzione oraria ({ part, value, label, selected, timeValue })",
        point: "Punto/icona nella time option selezionata",
        shortcut: "Renderer scorciatoia",
        value: "Footer value renderer ({ value, displayValue })",
        label: "Floating label",
        topLabel: "Top label",
        icon: "Left icon",
        iconRight: "Right icon",
        default: "Fallback value content"
      },
      events: {
        onChange: "(value, event)",
        onInput: "(value, event)",
        onOpen: "void",
        onClose: "void"
      },
      returns: "HTMLDivElement (field wrapper) con ._input, ._open(), ._close(), ._getValue(), ._setValue(value)",
      description: "Time picker reattivo con overlay fixed, label/icon slots, point icon, shortcuts, confirm e model."
    };
  }
  // Esempio: CMSwift.ui.Time({ value: "09:30" })

  UI.Tabs = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const tabs = props.tabs || [];
    const model = resolveModel(props.model, "UI.Tabs:model");
    const wrap = _.div({
      class: uiClass(["cms-tabs", uiWhen(props.dense, "dense"), props.class]),
      style: {
        display: "flex",
        gap: props.gap != null ? toCssSize(props.gap) : "8px",
        alignItems: props.align || "center",
        justifyContent: props.justify || "flex-start",
        ...(props.style || {})
      }
    });
    const nodes = tabs.map(t => {
      const val = t.value ?? t.name ?? t.label;
      const labelNode = CMSwift.ui.renderSlot(slots, "tab", { tab: t, value: val }, t.label ?? String(val));
      const btn = UI.Btn({
        class: "cms-tab",
        onClick: () => {
          if (model) model.set(val);
          props.onChange?.(val);
          t.onClick?.(val);
        }
      }, ...renderSlotToArray(null, "default", {}, labelNode));
      wrap.appendChild(btn);
      return { btn, val };
    });

    function update(val) {
      nodes.forEach(n => n.btn.classList.toggle("active", n.val == val));
    }
    if (model) {
      update(model.get());
      model.watch((v) => update(v), "UI.Tabs:watch");
    } else if (props.value != null) {
      update(props.value);
    }
    renderSlotToArray(slots, "default", {}, children).forEach((ch) => wrap.appendChild(ch));
    return wrap;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Tabs = {
      signature: "UI.Tabs(props) | UI.Tabs(props, ...children)",
      props: {
        tabs: "Array<{label,value,onClick}>",
        value: "any",
        model: "[get,set] signal",
        gap: "string|number",
        align: "string",
        justify: "string",
        dense: "boolean",
        slots: "{ tab?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        tab: "Tab label renderer (ctx: { tab, value })",
        default: "Extra tab content"
      },
      events: {
        onChange: "(value)"
      },
      returns: "HTMLDivElement",
      description: "Tabs interattive con supporto model."
    };
  }
  // Esempio: CMSwift.ui.Tabs({ tabs: [{ label: "Uno", value: 1 }] , model: [get,set] })

  UI.RouteTab = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const cls = uiClass(["cms-route-tab", uiWhen(props.active, "active"), props.class]);
    const p = CMSwift.omit(props, ["active", "label", "to", "slots"]);
    p.href = props.to || props.href || "#";
    p.class = cls;
    p.onClick = (e) => {
      props.onClick?.(e);
      if (props.to && app.router?.navigate) {
        e.preventDefault();
        app.router.navigate(props.to);
      }
    };
    const labelNodes = renderSlotToArray(slots, "label", {}, props.label);
    const content = labelNodes.length ? labelNodes : renderSlotToArray(slots, "default", {}, children);
    return _.a(p, ...(content.length ? content : [props.to || ""]));
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.RouteTab = {
      signature: "UI.RouteTab(...children) | UI.RouteTab(props, ...children)",
      props: {
        label: "String|Node|Function|Array",
        to: "string",
        active: "boolean",
        slots: "{ label?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        label: "RouteTab label",
        default: "Fallback content"
      },
      events: {
        onClick: "MouseEvent"
      },
      returns: "HTMLAnchorElement",
      description: "Tab che naviga via router o href."
    };
  }
  // Esempio: CMSwift.ui.RouteTab({ label: "Home", to: "/" })

  UI.Breadcrumbs = (...args) => {
    const { props } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const items = props.items || [];
    const sep = props.separator || "/";
    const wrap = _.nav({ class: uiClass(["cms-breadcrumbs", props.class]) });
    items.forEach((it, i) => {
      const label = it.label || it.title || it.to || it.href || "";
      const defaultNode = it.to || it.href
        ? _.a({ href: it.to || it.href }, label)
        : _.span(label);
      const itemNode = CMSwift.ui.renderSlot(slots, "item", { item: it, index: i }, defaultNode);
      renderSlotToArray(null, "default", {}, itemNode).forEach(n => wrap.appendChild(n));
      if (i < items.length - 1) {
        const sepNode = CMSwift.ui.renderSlot(slots, "separator", { index: i }, sep);
        wrap.appendChild(_.span({ class: "cms-breadcrumb-sep", style: { margin: "0 6px" } }, ...renderSlotToArray(null, "default", {}, sepNode)));
      }
    });
    return wrap;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Breadcrumbs = {
      signature: "UI.Breadcrumbs(props)",
      props: {
        items: "Array<{label,to,href}>",
        separator: "string|Node",
        slots: "{ item?, separator? }",
        class: "string",
        style: "object"
      },
      slots: {
        item: "Item renderer (ctx: { item, index })",
        separator: "Separator content (ctx: { index })"
      },
      returns: "HTMLElement <nav>",
      description: "Breadcrumbs con separatore configurabile."
    };
  }
  // Esempio: CMSwift.ui.Breadcrumbs({ items: [{ label: "Home", to: "/" }, { label: "Pagina" }] })

  UI.Pagination = (...args) => {
    const { props } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const model = resolveModel(props.model, "UI.Pagination:model");
    const sizeClass = uiComputed(props.size, () => {
      const v = uiUnwrap(props.size);
      return (typeof v === "string" && sizeMap[v]) ? `cms-size-${v}` : "";
    });
    const wrap = _.nav({
      class: uiClass([
        "cms-pagination",
        "cms-clear-set",
        sizeClass,
        uiWhen(props.dense, "dense"),
        uiWhen(props.simple, "is-simple"),
        uiWhen(props.disabled, "is-disabled"),
        props.class
      ]),
      style: { ...(props.style || {}) },
      role: "navigation",
      "aria-label": props.ariaLabel || "Pagination"
    });
    const controls = _.div({ class: "cms-pagination-controls" });
    const startGroup = _.div({ class: "cms-pagination-start" });
    const pagesGroup = _.div({ class: "cms-pagination-pages" });
    const endGroup = _.div({ class: "cms-pagination-end" });
    const summary = _.div({ class: "cms-pagination-summary" });

    controls.appendChild(startGroup);
    controls.appendChild(pagesGroup);
    controls.appendChild(endGroup);
    wrap.appendChild(controls);
    wrap.appendChild(summary);

    let currentPage = 1;
    let currentPages = 1;

    const toInt = (value, fallback = 0) => {
      const raw = uiUnwrap(value);
      if (raw == null || raw === "") return fallback;
      const n = Number(raw);
      if (!Number.isFinite(n)) return fallback;
      return Math.trunc(n);
    };
    const clampPage = (page, pages = getPages()) => {
      const raw = Number(page);
      const next = Number.isFinite(raw) ? Math.trunc(raw) : 1;
      return Math.min(Math.max(next || 1, 1), Math.max(1, pages || 1));
    };
    const getPages = () => {
      const explicit = toInt(props.max ?? props.pages ?? props.pageCount ?? props.totalPages, 0);
      if (explicit > 0) return explicit;
      const total = toInt(props.total ?? props.totalItems ?? props.count, 0);
      const pageSize = toInt(props.pageSize ?? props.perPage ?? props.limit, 0);
      if (total >= 0 && pageSize > 0) return Math.max(1, Math.ceil(total / pageSize));
      return 1;
    };
    const getRequestedPage = () => {
      if (model) return toInt(model.get(), 1);
      return toInt(props.page ?? props.value ?? props.current ?? props.currentPage, 1);
    };
    const getSiblingCount = () => Math.max(0, toInt(props.siblings ?? props.siblingCount ?? props.window, 1));
    const getBoundaryCount = () => Math.max(0, toInt(props.boundaryCount ?? props.boundaries ?? props.edges, 1));
    const isDisabled = () => !!uiUnwrap(props.disabled);
    const showSummary = () => uiUnwrap(props.showSummary ?? props.showLabel) !== false;
    const showNumbers = () => uiUnwrap(props.showPages) !== false && !uiUnwrap(props.simple);
    const showPrev = () => uiUnwrap(props.showPrev) !== false;
    const showNext = () => uiUnwrap(props.showNext) !== false;
    const showEdges = () => !!uiUnwrap(props.showEdges);
    const showFirst = () => {
      const value = uiUnwrap(props.showFirst);
      return value == null ? showEdges() : !!value;
    };
    const showLast = () => {
      const value = uiUnwrap(props.showLast);
      return value == null ? showEdges() : !!value;
    };
    const hideOnSinglePage = () => !!uiUnwrap(props.hideOnSinglePage);
    const getTotal = () => {
      const total = uiUnwrap(props.total ?? props.totalItems ?? props.count);
      if (total == null || total === "") return null;
      const n = Number(total);
      return Number.isFinite(n) ? Math.max(0, Math.trunc(n)) : null;
    };
    const getPageSize = () => {
      const pageSize = uiUnwrap(props.pageSize ?? props.perPage ?? props.limit);
      if (pageSize == null || pageSize === "") return null;
      const n = Number(pageSize);
      return Number.isFinite(n) && n > 0 ? Math.trunc(n) : null;
    };
    const getCtx = (page = currentPage, pages = currentPages) => {
      const total = getTotal();
      const pageSize = getPageSize();
      const from = total != null && pageSize ? (total === 0 ? 0 : ((page - 1) * pageSize) + 1) : null;
      const to = total != null && pageSize ? Math.min(total, page * pageSize) : null;
      return {
        page,
        value: page,
        current: page,
        currentPage: page,
        pages,
        max: pages,
        total,
        pageSize,
        from,
        to,
        disabled: isDisabled(),
        isFirst: page <= 1,
        isLast: page >= pages,
        canPrev: page > 1,
        canNext: page < pages,
        setPage: (nextPage, event) => commitPage(nextPage, event),
        prev: (event) => commitPage(page - 1, event),
        next: (event) => commitPage(page + 1, event),
        first: (event) => commitPage(1, event),
        last: (event) => commitPage(pages, event)
      };
    };
    const buildItems = (page, pages) => {
      if (pages <= 0) return [];
      const items = [];
      const included = new Set();
      const boundary = getBoundaryCount();
      const siblings = getSiblingCount();

      for (let i = 1; i <= Math.min(boundary, pages); i++) included.add(i);
      for (let i = Math.max(1, page - siblings); i <= Math.min(pages, page + siblings); i++) included.add(i);
      for (let i = Math.max(1, pages - boundary + 1); i <= pages; i++) included.add(i);

      let last = 0;
      for (let i = 1; i <= pages; i++) {
        if (!included.has(i)) continue;
        if (last && i - last > 1) items.push({ type: "ellipsis", key: `ellipsis-${last}-${i}` });
        items.push({ type: "page", page: i, key: `page-${i}` });
        last = i;
      }
      if (!items.length) items.push({ type: "page", page: 1, key: "page-1" });
      return items;
    };
    const renderNamedSlot = (name, fallback, ctx, alias = null) => {
      const primary = CMSwift.ui.getSlot(slots, name) != null
        ? renderSlotToArray(slots, name, ctx, fallback)
        : [];
      if (primary.length) return primary;
      if (alias && CMSwift.ui.getSlot(slots, alias) != null) {
        return renderSlotToArray(slots, alias, ctx, fallback);
      }
      return renderSlotToArray(null, "default", ctx, fallback);
    };
    const renderInto = (host, nodes) => {
      host.innerHTML = "";
      nodes.forEach((node) => host.appendChild(node));
    };
    const createButton = (name, fallback, onClick, options = {}) => {
      const ctx = { ...getCtx(), kind: name, active: !!options.active };
      return UI.Btn({
        class: uiClass([
          "cms-pagination-btn",
          `cms-pagination-${name}`,
          uiWhen(options.active, "active"),
          options.class
        ]),
        size: props.itemSize || props.size || (props.dense ? "sm" : "md"),
        color: options.active ? (props.color || props.state || "primary") : (options.color || null),
        outline: options.active ? false : (options.outline ?? true),
        disabled: isDisabled() || !!options.disabled,
        "aria-current": options.active ? "page" : null,
        onClick: (event) => {
          if (isDisabled() || options.disabled) return;
          onClick?.(event);
        }
      }, ...renderNamedSlot(name, fallback, ctx, name === "summary" ? "label" : (name === "page" ? "item" : null)));
    };
    const render = (page, pages) => {
      currentPage = clampPage(page, pages);
      currentPages = Math.max(1, pages || 1);
      const ctx = getCtx(currentPage, currentPages);

      wrap.style.display = hideOnSinglePage() && currentPages <= 1 ? "none" : "";
      summary.style.display = showSummary() ? "" : "none";
      pagesGroup.style.display = showNumbers() ? "" : "none";

      startGroup.innerHTML = "";
      pagesGroup.innerHTML = "";
      endGroup.innerHTML = "";

      const startNodes = renderNamedSlot("start", props.start, ctx);
      if (startNodes.length) {
        startGroup.appendChild(_.div({ class: "cms-pagination-extra cms-pagination-extra-start" }, ...startNodes));
      }

      if (showFirst()) {
        startGroup.appendChild(createButton("first", "«", (event) => commitPage(1, event), {
          disabled: currentPage <= 1
        }));
      }
      if (showPrev()) {
        startGroup.appendChild(createButton("prev", "Prev", (event) => commitPage(currentPage - 1, event), {
          disabled: currentPage <= 1
        }));
      }

      if (showNumbers()) {
        buildItems(currentPage, currentPages).forEach((item) => {
          if (item.type === "ellipsis") {
            const ellipsisCtx = { ...ctx, kind: "ellipsis" };
            const ellipsisNodes = renderNamedSlot("ellipsis", "…", ellipsisCtx);
            pagesGroup.appendChild(_.span({ class: "cms-pagination-ellipsis", "aria-hidden": "true" }, ...ellipsisNodes));
            return;
          }
          const itemPage = item.page;
          const itemCtx = { ...ctx, page: itemPage, value: itemPage, item, active: itemPage === currentPage };
          pagesGroup.appendChild(UI.Btn({
            class: uiClass([
              "cms-pagination-btn",
              "cms-pagination-page-btn",
              uiWhen(itemPage === currentPage, "active")
            ]),
            size: props.itemSize || props.size || (props.dense ? "sm" : "md"),
            color: itemPage === currentPage ? (props.color || props.state || "primary") : null,
            outline: itemPage === currentPage ? false : true,
            disabled: isDisabled(),
            "aria-current": itemPage === currentPage ? "page" : null,
            onClick: (event) => commitPage(itemPage, event)
          }, ...renderNamedSlot("page", String(itemPage), itemCtx, "item")));
        });
      }

      if (showNext()) {
        endGroup.appendChild(createButton("next", "Next", (event) => commitPage(currentPage + 1, event), {
          disabled: currentPage >= currentPages
        }));
      }
      if (showLast()) {
        endGroup.appendChild(createButton("last", "»", (event) => commitPage(currentPages, event), {
          disabled: currentPage >= currentPages
        }));
      }

      const endNodes = renderNamedSlot("end", props.end, ctx);
      if (endNodes.length) {
        endGroup.appendChild(_.div({ class: "cms-pagination-extra cms-pagination-extra-end" }, ...endNodes));
      }

      let summaryText = `Pagina ${currentPage} di ${currentPages}`;
      if (ctx.total != null && ctx.pageSize) {
        summaryText = ctx.total === 0
          ? "0 risultati"
          : `${ctx.from}-${ctx.to} di ${ctx.total}`;
      }
      renderInto(summary, renderNamedSlot("summary", summaryText, ctx, "label"));
    };
    const commitPage = (page, event = null) => {
      const pages = getPages();
      const nextPage = clampPage(page, pages);
      if (nextPage === currentPage && pages === currentPages) return nextPage;
      render(nextPage, pages);
      if (model && model.get() !== nextPage) model.set(nextPage);
      props.onChange?.(nextPage, getCtx(nextPage, pages), event);
      props.onPageChange?.(nextPage, getCtx(nextPage, pages), event);
      return nextPage;
    };

    app.reactive.effect(() => {
      const pages = getPages();
      const requested = getRequestedPage();
      const nextPage = clampPage(requested, pages);
      render(nextPage, pages);
      if (model && requested !== nextPage) model.set(nextPage);
    }, "UI.Pagination:sync");

    wrap.getPage = () => currentPage;
    wrap.getPages = () => currentPages;
    wrap.setPage = (page) => commitPage(page);
    wrap.prev = () => commitPage(currentPage - 1);
    wrap.next = () => commitPage(currentPage + 1);
    wrap.first = () => commitPage(1);
    wrap.last = () => commitPage(currentPages);
    setPropertyProps(wrap, props);
    return wrap;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Pagination = {
      signature: "UI.Pagination(props)",
      props: {
        max: "number",
        pages: "number",
        total: "number",
        pageSize: "number",
        value: "number",
        page: "number",
        model: "[get,set] signal",
        showPages: "boolean",
        showSummary: "boolean",
        showLabel: "boolean",
        showPrev: "boolean",
        showNext: "boolean",
        showFirst: "boolean",
        showLast: "boolean",
        showEdges: "boolean",
        siblings: "number",
        boundaryCount: "number",
        hideOnSinglePage: "boolean",
        size: "xxs|xs|sm|md|lg|xl|xxl|xxxl",
        dense: "boolean",
        simple: "boolean",
        color: "primary|secondary|warning|danger|success|info|light|dark",
        state: "primary|secondary|warning|danger|success|info|light|dark",
        slots: "{ start?, end?, first?, prev?, page?, item?, ellipsis?, next?, last?, summary?, label? }",
        class: "string",
        style: "object"
      },
      slots: {
        start: "Contenuto prima dei controlli",
        end: "Contenuto dopo i controlli",
        first: "First button content",
        prev: "Prev button content",
        page: "Page item content (ctx: { page, active, pages })",
        item: "Alias di page",
        ellipsis: "Ellipsis content",
        next: "Next button content",
        last: "Last button content",
        summary: "Summary content",
        label: "Alias legacy di summary"
      },
      events: {
        onChange: "(page, ctx, event)",
        onPageChange: "(page, ctx, event)"
      },
      returns: "HTMLElement <nav>",
      description: "Paginazione standard con controlli edge, numeri, ellissi, summary e supporto total/pageSize."
    };
  }
  // Esempio: CMSwift.ui.Pagination({ total: 120, pageSize: 12, model: [get,set], showEdges: true })

  UI.Spinner = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};

    const makeCssVarValue = (value, mapper, fallback) => {
      if (uiIsReactive(value)) {
        return () => {
          const raw = uiUnwrap(value);
          if (raw == null || raw === false || raw === "") return fallback;
          const next = mapper ? mapper(raw) : raw;
          return next == null || next === "" ? fallback : next;
        };
      }
      if (value == null || value === false || value === "") return fallback;
      const next = mapper ? mapper(value) : value;
      return next == null || next === "" ? fallback : next;
    };

    const resolveSpinnerColor = (value) => {
      if (value == null || value === false || value === "") return "";
      const state = normalizeState(value);
      if (state) return "";
      const str = String(value).trim();
      if (!str) return "";
      if (
        str.startsWith("#") ||
        str.startsWith("rgb(") ||
        str.startsWith("rgba(") ||
        str.startsWith("hsl(") ||
        str.startsWith("hsla(") ||
        str.startsWith("var(")
      ) return str;
      if (isTokenCSS(str)) return `var(--cms-${str})`;
      return str;
    };

    const stateClass = uiComputed(props.state, () => {
      const state = normalizeState(uiUnwrap(props.state));
      return state ? `cms-state-${state}` : "";
    });

    const cls = uiClass([
      "cms-spinner",
      stateClass,
      uiWhen(props.vertical, "vertical"),
      uiWhen(props.reverse, "reverse"),
      uiWhen(props.center, "center"),
      uiWhen(props.block, "block"),
      uiWhen(props.pause || props.paused, "paused"),
      props.class
    ]);

    const p = CMSwift.omit(props, [
      "ariaLabel", "block", "center", "color", "indicatorClass", "indicatorStyle",
      "label", "note", "pause", "paused", "reverse", "size", "slots", "speed",
      "state", "thickness", "trackColor", "vertical"
    ]);
    p.class = cls;

    const rootStyle = { ...(props.style || {}) };
    if (props.color != null && Object.prototype.hasOwnProperty.call(rootStyle, "backgroundColor")) {
      delete rootStyle.backgroundColor;
    }
    p.style = rootStyle;
    if (p.role == null) p.role = "status";
    if (p["aria-live"] == null) p["aria-live"] = "polite";
    if (p["aria-busy"] == null) p["aria-busy"] = "true";

    const ctx = { props };
    const labelNodes = renderSlotToArray(slots, "label", ctx, props.label);
    const copyNodes = renderSlotToArray(slots, "default", ctx, children);
    const noteNodes = renderSlotToArray(slots, "note", ctx, props.note);
    const hasText = labelNodes.length || copyNodes.length || noteNodes.length;

    if (!hasText) {
      const ariaLabel = uiUnwrap(props.ariaLabel ?? props["aria-label"]);
      if (ariaLabel) p["aria-label"] = ariaLabel;
      else if (p["aria-label"] == null) p["aria-label"] = "Loading";
    }

    const indicatorFallback = _.span({
      class: uiClass(["cms-spinner-indicator", props.indicatorClass]),
      style: {
        "--cms-spinner-size": makeCssVarValue(props.size, toCssSize, "18px"),
        "--cms-spinner-thickness": makeCssVarValue(props.thickness, toCssSize, "2px"),
        "--cms-spinner-speed": makeCssVarValue(props.speed, (v) => typeof v === "number" ? `${v}ms` : String(v), "900ms"),
        "--cms-spinner-color": makeCssVarValue(props.color, resolveSpinnerColor, "var(--set-border-color, var(--cms-primary))"),
        "--cms-spinner-track": makeCssVarValue(props.trackColor, resolveSpinnerColor, "color-mix(in srgb, var(--cms-spinner-color) 18%, transparent)"),
        ...(props.indicatorStyle || {})
      },
      "aria-hidden": "true"
    });
    const indicatorNodes = renderSlotToArray(slots, "indicator", ctx, indicatorFallback);
    const content = [];

    if (indicatorNodes.length) content.push(...indicatorNodes);
    if (hasText) {
      content.push(_.div(
        { class: "cms-spinner-content" },
        labelNodes.length ? _.div({ class: "cms-spinner-label" }, ...labelNodes) : null,
        copyNodes.length ? _.div({ class: "cms-spinner-copy" }, ...copyNodes) : null,
        noteNodes.length ? _.div({ class: "cms-spinner-note" }, ...noteNodes) : null
      ));
    }

    const root = _.div(p, ...content);
    setPropertyProps(root, props);
    return root;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Spinner = {
      signature: "UI.Spinner(...children) | UI.Spinner(props, ...children)",
      props: {
        size: "number|string",
        color: "string",
        thickness: "number|string",
        trackColor: "string",
        speed: "number|string",
        state: "primary|secondary|success|warning|danger|info|light|dark",
        label: "String|Node|Function|Array",
        note: "String|Node|Function|Array",
        vertical: "boolean",
        reverse: "boolean",
        center: "boolean",
        block: "boolean",
        pause: "boolean",
        paused: "boolean",
        ariaLabel: "string",
        indicatorClass: "string",
        indicatorStyle: "object",
        slots: "{ indicator?, label?, note?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        indicator: "Custom spinner indicator",
        label: "Primary label/content near the spinner",
        note: "Secondary supporting text",
        default: "Extra content rendered near the spinner"
      },
      returns: "HTMLDivElement",
      description: "Spinner animato con layout flessibile, contenuti opzionali e controllo di dimensioni, velocita e traccia."
    };
  }
  // Esempio: CMSwift.ui.Spinner({ size: 24 })

  UI.Progress = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const boundValue = props.model || ((uiIsSignal(props.value) || uiIsRod(props.value)) ? props.value : null);
    const model = resolveModel(boundValue, "UI.Progress:model");
    const stateClass = uiComputed([props.state, props.color], () => {
      const state = normalizeState(uiUnwrap(props.state) || uiUnwrap(props.color));
      return state ? `cms-state-${state}` : "";
    });

    const getNumber = (value, fallback) => {
      const next = Number(value);
      return Number.isFinite(next) ? next : fallback;
    };
    const getMin = () => getNumber(uiUnwrap(props.min), 0);
    const getMax = () => {
      const min = getMin();
      const max = getNumber(uiUnwrap(props.max), 100);
      return max < min ? min : max;
    };
    const getTrackHeight = () => {
      const raw = uiUnwrap(props.height ?? props.thickness ?? props.size);
      if (raw == null || raw === "") return "8px";
      if (typeof raw === "number") return `${raw}px`;
      if (typeof raw === "string") {
        const sizePreset = {
          xxs: "4px",
          xs: "6px",
          sm: "8px",
          md: "10px",
          lg: "12px",
          xl: "14px",
          xxl: "16px",
          xxxl: "18px"
        };
        return sizePreset[raw] || raw;
      }
      return "8px";
    };
    const resolveCssColor = (value, fallback = "") => {
      const raw = uiUnwrap(value);
      if (raw == null || raw === false || raw === "") return fallback;
      const state = normalizeState(raw);
      if (state) return `var(--cms-${state})`;
      if (typeof raw === "string" && isTokenCSS(raw)) return `var(--cms-${raw})`;
      return String(raw);
    };
    const normalizeValue = (value) => {
      const min = getMin();
      const max = getMax();
      const next = getNumber(value, min);
      return Math.min(max, Math.max(min, next));
    };
    const ratioFromValue = (value) => {
      const min = getMin();
      const max = getMax();
      const span = max - min;
      if (!span) return 0;
      const raw = (normalizeValue(value) - min) / span;
      const ratio = uiUnwrap(props.reverse) ? (1 - raw) : raw;
      return Math.max(0, Math.min(1, ratio));
    };
    const clampBuffer = (value) => {
      const normalized = normalizeValue(value);
      return normalized < getValue() ? getValue() : normalized;
    };
    const resolveDisplayValue = (value, percent, ctx) => {
      const formatter = props.formatValue;
      if (typeof formatter === "function") {
        const formatted = formatter(value, percent, ctx);
        if (formatted != null) return formatted;
      }
      return `${Math.round(percent)}%`;
    };
    const clearHost = (host) => {
      while (host.firstChild) host.removeChild(host.firstChild);
    };
    const renderInto = (host, nodes, display = "flex") => {
      clearHost(host);
      (nodes || []).forEach((node) => {
        if (node == null || node === false) return;
        if (node instanceof Node) {
          host.appendChild(node);
          return;
        }
        host.appendChild(document.createTextNode(String(node)));
      });
      host.style.display = host.childNodes.length ? display : "none";
    };
    const asArray = (value, ctx = {}) => slotToArray(uiUnwrap(value), ctx);
    const asIconArray = (value, as, ctx = {}) => {
      const raw = uiUnwrap(value);
      if (raw == null || raw === false || raw === "") return [];
      if (typeof raw === "string") return [UI.Icon({ name: raw, size: props.iconSize ?? 16 })];
      return asArray(raw, { ...ctx, as });
    };
    const resolveContentProp = (value) => {
      if (uiIsRod(value) || uiIsSignal(value)) return uiUnwrap(value);
      if (typeof value === "function" && value.length === 0) return value();
      return value;
    };

    const [getValue, setValue] = CMSwift.reactive.signal(normalizeValue(
      model ? model.get() : (uiUnwrap(props.value) ?? uiUnwrap(props.min) ?? 0)
    ));
    const [getBuffer, setBuffer] = CMSwift.reactive.signal(clampBuffer(
      uiUnwrap(props.buffer) ?? (model ? model.get() : (uiUnwrap(props.value) ?? uiUnwrap(props.min) ?? 0))
    ));

    const setProgressValue = (raw, opts = {}) => {
      const next = normalizeValue(raw);
      if (getValue() !== next) setValue(next);
      if (getBuffer() < next) setBuffer(next);
      if (model && opts.fromModel !== true) model.set(next);
      return next;
    };
    const setProgressBuffer = (raw) => {
      const next = clampBuffer(raw);
      if (getBuffer() !== next) setBuffer(next);
      return next;
    };

    const wrapProps = CMSwift.omit(props, [
      "model", "value", "min", "max", "buffer", "class", "style", "slots",
      "label", "note", "showValue", "valueLabel", "insideLabel", "formatValue",
      "icon", "iconRight", "iconSize", "startLabel", "endLabel", "leftLabel", "rightLabel",
      "trackColor", "bufferColor", "height", "thickness", "size", "state", "color",
      "reverse", "striped", "animated", "indeterminate", "ariaLabel", "ariaValueText",
      "width", "dense", "outline", "flat", "border", "glossy", "glow", "glass",
      "shadow", "gradient", "textGradient", "lightShadow", "radius", "rounded", "textColor"
    ]);
    const rootStyle = {
      width: uiUnwrap(props.width) || "100%",
      ...(props.style || {})
    };
    const propColor = uiUnwrap(props.color);
    if ((propColor != null || uiIsReactive(props.color)) && !normalizeState(propColor || "")) {
      delete rootStyle.backgroundColor;
    }
    wrapProps.class = uiClass([
      "cms-progress-wrap",
      uiWhen(props.dense, "dense"),
      uiWhen(props.reverse, "is-reverse"),
      uiWhen(props.indeterminate, "is-indeterminate"),
      stateClass,
      props.class
    ]);
    wrapProps.style = rootStyle;

    const header = _.div({ class: "cms-progress-header" });
    const heading = _.div({ class: "cms-progress-heading" });
    const labelHost = _.div({ class: "cms-progress-label" });
    const noteHost = _.div({ class: "cms-progress-note" });
    const valueHost = _.div({ class: "cms-progress-value" });
    heading.append(labelHost, noteHost);
    header.append(heading, valueHost);

    const body = _.div({ class: "cms-progress-body" });
    const startLabelHost = _.span({ class: "cms-progress-edge-label cms-progress-edge-label-left" });
    const track = _.div({
      class: "cms-progress",
      role: "progressbar"
    });
    const buffer = _.span({ class: "cms-progress-buffer" });
    const fill = _.span({
      class: uiClass([
        "cms-progress-bar",
        "cms-singularity",
        stateClass,
        uiWhen(props.outline, "cms-outline"),
        uiWhen(props.flat, "cms-flat"),
        uiWhen(props.border, "cms-border"),
        uiWhen(props.glossy, "cms-glossy"),
        uiWhen(props.glow, "cms-glow"),
        uiWhen(props.glass, "cms-glass"),
        uiWhen(props.shadow, "cms-shadow"),
        uiComputed(props.shadow, () => {
          const shadow = normalizeShadow(uiUnwrap(props.shadow));
          return shadow ? `cms-shadow-${shadow}` : "";
        }),
        uiWhen(props.gradient, "cms-gradient"),
        uiWhen(props.textGradient, "cms-text-gradient"),
        uiWhen(props.lightShadow, "cms-light-shadow"),
        uiWhen(props.striped, "is-striped"),
        uiWhen(props.animated || props.indeterminate, "is-animated")
      ])
    });
    const insideHost = _.span({ class: "cms-progress-bar-label" });
    fill.appendChild(insideHost);
    track.append(buffer, fill);
    const endLabelHost = _.span({ class: "cms-progress-edge-label cms-progress-edge-label-right" });
    body.append(startLabelHost, track, endLabelHost);

    const wrap = _.div(wrapProps, header, body);
    setPropertyProps(fill, props);

    const renderHeader = () => {
      const value = getValue();
      const percent = ratioFromValue(value) * 100;
      const ctx = {
        value,
        percent,
        min: getMin(),
        max: getMax(),
        buffer: getBuffer(),
        progress: wrap,
        track,
        bar: fill,
        props
      };
      const iconNodes = renderSlotToArray(slots, "icon", ctx, null);
      const iconFallback = iconNodes.length ? [] : asIconArray(props.icon, "icon", ctx);
      const labelNodes = renderSlotToArray(slots, "label", ctx, resolveContentProp(props.label));
      const fallbackNodes = labelNodes.length ? labelNodes : renderSlotToArray(slots, "default", ctx, children);
      const rightIconNodes = renderSlotToArray(slots, "iconRight", ctx, null);
      const rightIconFallback = rightIconNodes.length ? [] : asIconArray(props.iconRight, "iconRight", ctx);
      const noteNodes = renderSlotToArray(slots, "note", ctx, resolveContentProp(props.note));
      const valueFallback = props.valueLabel != null
        ? resolveContentProp(props.valueLabel)
        : resolveDisplayValue(value, percent, ctx);
      const showValue = uiUnwrap(props.showValue);
      const outsideValueNodes = (showValue === true || props.valueLabel != null || CMSwift.ui.getSlot(slots, "value") != null)
        ? renderSlotToArray(slots, "value", ctx, valueFallback)
        : [];

      renderInto(labelHost, [...iconFallback, ...iconNodes, ...fallbackNodes, ...rightIconFallback, ...rightIconNodes], "inline-flex");
      renderInto(noteHost, noteNodes, "block");
      renderInto(valueHost, showValue === "inside" ? [] : outsideValueNodes, "inline-flex");
      header.style.display = (labelHost.childNodes.length || noteHost.childNodes.length || valueHost.childNodes.length) ? "flex" : "none";
    };

    const renderEdgeLabels = () => {
      const value = getValue();
      const percent = ratioFromValue(value) * 100;
      const ctx = {
        value,
        percent,
        min: getMin(),
        max: getMax(),
        buffer: getBuffer(),
        progress: wrap,
        track,
        bar: fill,
        props
      };
      const startSource = resolveContentProp(props.startLabel ?? props.leftLabel);
      const endSource = resolveContentProp(props.endLabel ?? props.rightLabel);
      renderInto(startLabelHost, renderSlotToArray(slots, "startLabel", ctx, startSource), "inline-flex");
      renderInto(endLabelHost, renderSlotToArray(slots, "endLabel", ctx, endSource), "inline-flex");
    };

    const renderInsideValue = () => {
      const value = getValue();
      const percent = ratioFromValue(value) * 100;
      const ctx = {
        value,
        percent,
        min: getMin(),
        max: getMax(),
        buffer: getBuffer(),
        progress: wrap,
        track,
        bar: fill,
        props
      };
      const showValue = uiUnwrap(props.showValue);
      const insideFallback = props.insideLabel != null
        ? resolveContentProp(props.insideLabel)
        : resolveDisplayValue(value, percent, ctx);
      const insideNodes = (showValue === "inside" || props.insideLabel != null || CMSwift.ui.getSlot(slots, "inside") != null)
        ? renderSlotToArray(slots, "inside", ctx, insideFallback)
        : [];
      renderInto(insideHost, insideNodes, "inline-flex");
    };

    const syncVisualState = () => {
      const value = getValue();
      const bufferValue = getBuffer();
      const min = getMin();
      const max = getMax();
      const percent = ratioFromValue(value) * 100;
      const bufferPercent = ratioFromValue(bufferValue) * 100;
      const tone = resolveCssColor(props.color, "");
      const trackTone = resolveCssColor(
        props.trackColor,
        tone ? `color-mix(in srgb, ${tone} 14%, transparent)` : "rgba(255,255,255,0.08)"
      );
      const bufferTone = resolveCssColor(
        props.bufferColor,
        tone ? `color-mix(in srgb, ${tone} 30%, transparent)` : "rgba(255,255,255,0.16)"
      );
      const ariaLabel = uiUnwrap(props.ariaLabel);
      const ariaValueText = uiUnwrap(props.ariaValueText);
      const isIndeterminate = !!uiUnwrap(props.indeterminate);
      const customRadius = uiUnwrap(props.radius);

      wrap.style.width = uiUnwrap(props.width) || "100%";
      wrap.style.setProperty("--cms-progress-height", getTrackHeight());
      if (customRadius != null) {
        if (typeof customRadius === "number") wrap.style.setProperty("--cms-progress-radius", `${customRadius}px`);
        else if (typeof customRadius === "string" && CMSwift.uiSizes.includes(customRadius)) wrap.style.setProperty("--cms-progress-radius", `var(--cms-r-${customRadius})`);
        else wrap.style.setProperty("--cms-progress-radius", String(customRadius));
      } else {
        wrap.style.removeProperty("--cms-progress-radius");
      }

      track.style.background = trackTone;
      buffer.style.background = bufferTone;
      buffer.style.width = `${bufferPercent}%`;

      if (tone && !normalizeState(uiUnwrap(props.state) || uiUnwrap(props.color))) {
        fill.style.setProperty("--set-background-color", tone);
        fill.style.setProperty("--set-border-color", tone);
        fill.style.setProperty("--set-color", uiUnwrap(props.textColor) || "var(--cms-on-primary, #fff)");
      } else if (!normalizeState(uiUnwrap(props.state) || uiUnwrap(props.color))) {
        fill.style.setProperty("--set-background-color", "var(--cms-primary)");
        fill.style.setProperty("--set-border-color", "var(--cms-primary)");
        fill.style.setProperty("--set-color", uiUnwrap(props.textColor) || "var(--cms-on-primary, #fff)");
      } else {
        fill.style.removeProperty("--set-background-color");
        fill.style.removeProperty("--set-border-color");
        fill.style.removeProperty("--set-color");
      }

      if (isIndeterminate) {
        fill.style.width = "";
        track.removeAttribute("aria-valuenow");
        track.removeAttribute("aria-valuemin");
        track.removeAttribute("aria-valuemax");
      } else {
        fill.style.width = `${percent}%`;
        track.setAttribute("aria-valuemin", String(min));
        track.setAttribute("aria-valuemax", String(max));
        track.setAttribute("aria-valuenow", String(value));
      }

      if (ariaLabel != null) track.setAttribute("aria-label", String(ariaLabel));
      else if (typeof uiUnwrap(props.label) === "string") track.setAttribute("aria-label", String(uiUnwrap(props.label)));
      else track.removeAttribute("aria-label");

      if (ariaValueText != null) {
        track.setAttribute("aria-valuetext", String(ariaValueText));
      } else if (!isIndeterminate) {
        track.setAttribute("aria-valuetext", resolveDisplayValue(value, percent, { value, percent, min, max, buffer: bufferValue, progress: wrap, track, bar: fill, props }));
      } else {
        track.removeAttribute("aria-valuetext");
      }

      wrap.classList.toggle("has-start-label", startLabelHost.childNodes.length > 0);
      wrap.classList.toggle("has-end-label", endLabelHost.childNodes.length > 0);
      wrap.classList.toggle("has-inside-label", insideHost.childNodes.length > 0);
    };

    if (model) {
      setProgressValue(model.get(), { fromModel: true });
      model.watch((value) => { setProgressValue(value, { fromModel: true }); }, "UI.Progress:watch");
    } else if (uiIsReactive(props.value)) {
      CMSwift.reactive.effect(() => {
        setProgressValue(uiUnwrap(props.value), { fromModel: true });
      }, "UI.Progress:value");
    } else {
      setProgressValue(props.value ?? props.min ?? 0, { fromModel: true });
    }

    if (uiIsReactive(props.buffer)) {
      CMSwift.reactive.effect(() => {
        setProgressBuffer(uiUnwrap(props.buffer));
      }, "UI.Progress:buffer");
    } else {
      setProgressBuffer(props.buffer ?? props.value ?? props.min ?? 0);
    }

    CMSwift.reactive.effect(() => {
      renderHeader();
      renderEdgeLabels();
      renderInsideValue();
      syncVisualState();
    }, "UI.Progress:render");

    wrap._track = track;
    wrap._bar = fill;
    wrap._buffer = buffer;
    wrap._getValue = getValue;
    wrap._getBuffer = getBuffer;
    wrap._setValue = (value) => setProgressValue(value);
    wrap._setBuffer = (value) => setProgressBuffer(value);

    return wrap;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Progress = {
      signature: "UI.Progress(...children) | UI.Progress(props, ...children)",
      props: {
        value: "number|rod|[get,set] signal",
        model: "rod|[get,set] signal",
        min: "number",
        max: "number",
        buffer: "number|rod|[get,set] signal",
        label: "String|Node|Function|Array",
        note: "String|Node|Function|Array",
        showValue: "boolean|\"inside\"",
        valueLabel: "String|Node|Function|Array",
        insideLabel: "String|Node|Function|Array",
        formatValue: "function(value, percent, ctx)",
        icon: "String|Node|Function|Array",
        iconRight: "String|Node|Function|Array",
        startLabel: "String|Node|Function|Array",
        endLabel: "String|Node|Function|Array",
        leftLabel: "Alias di startLabel",
        rightLabel: "Alias di endLabel",
        width: "string|number",
        size: "string|number",
        height: "string|number",
        thickness: "Alias di height",
        color: "string",
        state: "primary|secondary|success|warning|danger|info|light|dark",
        trackColor: "string",
        bufferColor: "string",
        striped: "boolean",
        animated: "boolean",
        indeterminate: "boolean",
        reverse: "boolean",
        slots: "{ icon?, label?, note?, value?, inside?, startLabel?, endLabel?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        icon: "Icona prima della label",
        label: "Contenuto principale del progress",
        note: "Contenuto secondario sotto la label",
        value: "Valore esterno a destra",
        inside: "Contenuto dentro la barra",
        startLabel: "Label a sinistra della barra",
        endLabel: "Label a destra della barra",
        default: "Fallback label content"
      },
      returns: "HTMLDivElement",
      description: "Progress bar standardizzata con header opzionale, buffer, stato semantico e supporto reattivo."
    };
  }
  // Esempio: CMSwift.ui.Progress({ value: 45 })

  UI.LoadingBar = function LoadingBar(...args) {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const getNumber = (value, fallback) => {
      const next = Number(value);
      return Number.isFinite(next) ? next : fallback;
    };
    const getMin = () => getNumber(uiUnwrap(props.min), 0);
    const getMax = () => {
      const min = getMin();
      const max = getNumber(uiUnwrap(props.max), 100);
      return max < min ? min : max;
    };
    const clampValue = (value) => {
      const min = getMin();
      const max = getMax();
      const next = getNumber(value, min);
      return Math.min(max, Math.max(min, next));
    };
    const toCssValue = (value, fallback = "") => {
      if (value == null || value === false || value === "") return fallback;
      if (typeof value === "number") return `${value}px`;
      return String(value);
    };
    const resolveTarget = (target) => {
      const raw = uiUnwrap(target);
      if (!raw) return document.body;
      if (raw === document) return document.body;
      if (typeof raw === "string") return document.querySelector(raw) || document.body;
      if (raw && raw.body instanceof HTMLElement) return raw.body;
      return raw instanceof HTMLElement ? raw : document.body;
    };

    const valueBinding = props.model || ((uiIsSignal(props.value) || uiIsRod(props.value)) ? props.value : null);
    const valueModel = resolveModel(valueBinding, "UI.LoadingBar:model");
    const bufferBinding = (uiIsSignal(props.buffer) || uiIsRod(props.buffer)) ? props.buffer : null;
    const bufferModel = resolveModel(bufferBinding, "UI.LoadingBar:buffer");
    const initialValue = valueModel ? valueModel.get() : (uiUnwrap(props.value) ?? getMin());
    const initialBuffer = bufferModel ? bufferModel.get() : (uiUnwrap(props.buffer) ?? initialValue);
    const [getValue, setValueSignal] = CMSwift.reactive.signal(clampValue(initialValue));
    const [getBuffer, setBufferSignal] = CMSwift.reactive.signal(Math.max(clampValue(initialBuffer), clampValue(initialValue)));
    const [getVisible, setVisibleSignal] = CMSwift.reactive.signal(
      props.visible != null ? !!uiUnwrap(props.visible) : (clampValue(initialValue) > getMin() || !!uiUnwrap(props.indeterminate))
    );

    let trickleTimer = null;
    let doneTimer = null;

    const clearTrickle = () => {
      if (trickleTimer) {
        clearInterval(trickleTimer);
        trickleTimer = null;
      }
    };
    const clearDoneTimer = () => {
      if (doneTimer) {
        clearTimeout(doneTimer);
        doneTimer = null;
      }
    };
    const syncVisibility = (next, opts = {}) => {
      const visible = !!next;
      if (getVisible() !== visible) setVisibleSignal(visible);
      if (opts.fromExternal !== true && typeof props.onVisibleChange === "function") {
        props.onVisibleChange(visible);
      }
      return visible;
    };
    const syncValue = (raw, opts = {}) => {
      const next = clampValue(raw);
      if (getValue() !== next) setValueSignal(next);
      if (getBuffer() < next) {
        setBufferSignal(next);
        if (bufferModel && opts.fromExternal !== true) bufferModel.set(next);
      }
      if (valueModel && opts.fromExternal !== true) valueModel.set(next);
      return next;
    };
    const syncBuffer = (raw, opts = {}) => {
      const next = Math.max(syncValue(getValue(), { fromExternal: true }), clampValue(raw));
      if (getBuffer() !== next) setBufferSignal(next);
      if (bufferModel && opts.fromExternal !== true) bufferModel.set(next);
      return next;
    };
    const showIfNeeded = (nextValue = getValue()) => {
      if (props.visible != null) return;
      if (uiUnwrap(props.indeterminate) || nextValue > getMin()) syncVisibility(true);
      else if (uiUnwrap(props.hideOnZero) !== false) syncVisibility(false);
    };
    const startTrickle = () => {
      clearTrickle();
      if (uiUnwrap(props.trickle) === false || uiUnwrap(props.indeterminate)) return;
      const interval = getNumber(uiUnwrap(props.trickleInterval), 280);
      if (interval <= 0) return;
      trickleTimer = setInterval(() => {
        const current = getValue();
        const max = clampValue(uiUnwrap(props.trickleTo) ?? uiUnwrap(props.trickleMax) ?? 92);
        if (current >= max) return;
        const step = getNumber(uiUnwrap(props.trickleStep), current < 45 ? 12 : (current < 75 ? 7 : 3));
        syncValue(Math.min(max, current + step));
      }, interval);
    };

    const shellProps = CMSwift.omit(props, [
      "model", "value", "min", "max", "buffer", "class", "style", "slots",
      "label", "note", "showValue", "valueLabel", "insideLabel", "formatValue",
      "icon", "iconRight", "iconSize", "startLabel", "endLabel", "leftLabel", "rightLabel",
      "trackColor", "bufferColor", "height", "thickness", "size", "state", "color",
      "reverse", "striped", "animated", "indeterminate", "ariaLabel", "ariaValueText",
      "width", "dense", "outline", "flat", "border", "glossy", "glow", "glass",
      "shadow", "gradient", "textGradient", "lightShadow", "radius", "rounded", "textColor",
      "target", "mount", "position", "top", "right", "bottom", "left", "inset", "zIndex",
      "visible", "autoStart", "hideOnZero", "startValue", "step", "trickle", "trickleStep",
      "trickleInterval", "trickleMax", "trickleTo", "doneValue", "doneDelay", "hideDelay",
      "resetValue", "progressClass", "progressStyle", "onVisibleChange"
    ]);
    shellProps.class = uiClass(["cms-loading-bar", props.class]);
    shellProps.style = { ...(props.style || {}) };

    const progressProps = CMSwift.omit(props, [
      "target", "mount", "position", "top", "right", "bottom", "left", "inset", "zIndex",
      "visible", "autoStart", "hideOnZero", "startValue", "step", "trickle", "trickleStep",
      "trickleInterval", "trickleMax", "trickleTo", "doneValue", "doneDelay", "hideDelay",
      "resetValue", "progressClass", "progressStyle", "onVisibleChange"
    ]);
    progressProps.class = uiClass(["cms-loading-bar-progress", props.progressClass, progressProps.class]);
    progressProps.style = { ...(props.progressStyle || {}) };
    progressProps.value = [getValue, setValueSignal];
    progressProps.buffer = [getBuffer, setBufferSignal];
    if (progressProps.dense == null) progressProps.dense = true;
    if (progressProps.height == null && progressProps.thickness == null && progressProps.size == null) {
      progressProps.height = 3;
    }
    if (progressProps.width == null) progressProps.width = "100%";

    const root = _.div(shellProps);
    const progress = UI.Progress(progressProps, ...children);
    root.appendChild(progress);

    const set = (value) => {
      clearDoneTimer();
      const next = syncValue(value);
      showIfNeeded(next);
      return root;
    };
    const setBuffer = (value) => {
      clearDoneTimer();
      const next = syncBuffer(value);
      showIfNeeded(next);
      return root;
    };
    const inc = (step = uiUnwrap(props.step) ?? 8) => {
      clearDoneTimer();
      const current = getValue();
      const next = syncValue(current + getNumber(step, 0));
      showIfNeeded(next);
      return root;
    };
    const start = (value = uiUnwrap(props.startValue) ?? 12) => {
      clearDoneTimer();
      const next = Math.max(getValue(), clampValue(value));
      syncValue(next);
      syncBuffer(Math.max(getBuffer(), next));
      showIfNeeded(next);
      startTrickle();
      return root;
    };
    const reset = (value = uiUnwrap(props.resetValue) ?? getMin()) => {
      clearDoneTimer();
      clearTrickle();
      const next = clampValue(value);
      syncBuffer(next);
      syncValue(next);
      showIfNeeded(next);
      return root;
    };
    const done = (value = uiUnwrap(props.doneValue) ?? getMax()) => {
      clearDoneTimer();
      clearTrickle();
      const next = clampValue(value);
      syncBuffer(next);
      syncValue(next);
      showIfNeeded(next);
      const delay = Math.max(0, getNumber(uiUnwrap(props.hideDelay) ?? uiUnwrap(props.doneDelay), 220));
      doneTimer = setTimeout(() => { reset(); }, delay);
      return root;
    };
    const stop = (...innerArgs) => done(...innerArgs);
    const show = () => {
      syncVisibility(true);
      return root;
    };
    const hide = () => {
      clearDoneTimer();
      clearTrickle();
      syncVisibility(false);
      return root;
    };
    const destroy = () => {
      clearDoneTimer();
      clearTrickle();
      root.remove();
      return null;
    };

    root.el = root;
    root._progress = progress;
    root.get = () => getValue();
    root.getBuffer = () => getBuffer();
    root.set = set;
    root.setBuffer = setBuffer;
    root.inc = inc;
    root.start = start;
    root.done = done;
    root.complete = done;
    root.stop = stop;
    root.reset = reset;
    root.show = show;
    root.hide = hide;
    root.destroy = destroy;
    root._dispose = destroy;

    if (valueModel) {
      valueModel.watch((value) => { syncValue(value, { fromExternal: true }); showIfNeeded(clampValue(value)); }, "UI.LoadingBar:watch");
    } else if (uiIsReactive(props.value)) {
      CMSwift.reactive.effect(() => {
        const next = clampValue(uiUnwrap(props.value));
        syncValue(next, { fromExternal: true });
        showIfNeeded(next);
      }, "UI.LoadingBar:value");
    }

    if (bufferModel) {
      bufferModel.watch((value) => { syncBuffer(value, { fromExternal: true }); }, "UI.LoadingBar:bufferWatch");
    } else if (uiIsReactive(props.buffer)) {
      CMSwift.reactive.effect(() => {
        syncBuffer(uiUnwrap(props.buffer), { fromExternal: true });
      }, "UI.LoadingBar:buffer");
    }

    CMSwift.reactive.effect(() => {
      const min = getMin();
      const max = getMax();
      const current = Math.min(max, Math.max(min, getValue()));
      const bufferCurrent = Math.max(current, Math.min(max, Math.max(min, getBuffer())));
      if (current !== getValue()) setValueSignal(current);
      if (bufferCurrent !== getBuffer()) setBufferSignal(bufferCurrent);
    }, "UI.LoadingBar:range");

    CMSwift.reactive.effect(() => {
      if (props.visible == null) return;
      syncVisibility(uiUnwrap(props.visible), { fromExternal: true });
    }, "UI.LoadingBar:visible");

    CMSwift.reactive.effect(() => {
      const position = uiUnwrap(props.position) || "fixed";
      const inset = uiUnwrap(props.inset);
      const top = uiUnwrap(props.top);
      const right = uiUnwrap(props.right);
      const bottom = uiUnwrap(props.bottom);
      const left = uiUnwrap(props.left);
      const width = uiUnwrap(props.width);
      const visible = props.visible != null ? !!uiUnwrap(props.visible) : getVisible();
      const inlineLike = position === "static" || position === "relative";

      root.classList.toggle("is-visible", visible);
      root.classList.toggle("is-inline", inlineLike);
      root.classList.toggle("has-track", !!uiUnwrap(props.trackColor));

      root.style.position = position;
      root.style.zIndex = String(uiUnwrap(props.zIndex) ?? 10002);
      root.style.width = toCssValue(width, inlineLike ? "100%" : "");

      if (inset != null && inset !== "") {
        root.style.inset = toCssValue(inset);
        root.style.removeProperty("top");
        root.style.removeProperty("right");
        root.style.removeProperty("bottom");
        root.style.removeProperty("left");
      } else {
        root.style.removeProperty("inset");
        if (!inlineLike && position !== "sticky") {
          root.style.top = toCssValue(top, "0px");
          root.style.right = toCssValue(right, width == null || width === "" ? "0px" : "");
          root.style.bottom = toCssValue(bottom, "");
          root.style.left = toCssValue(left, "0px");
        } else {
          root.style.top = toCssValue(top, "");
          root.style.right = toCssValue(right, "");
          root.style.bottom = toCssValue(bottom, "");
          root.style.left = toCssValue(left, "");
        }
      }
    }, "UI.LoadingBar:layout");

    setPropertyProps(root, props);

    if (uiUnwrap(props.mount) !== false) {
      resolveTarget(props.target).appendChild(root);
    }
    if (uiUnwrap(props.autoStart)) start();
    return root;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.LoadingBar = {
      signature: "UI.LoadingBar(...children) | UI.LoadingBar(props, ...children)",
      props: {
        value: "number|rod|[get,set] signal",
        model: "rod|[get,set] signal",
        buffer: "number|rod|[get,set] signal",
        min: "number",
        max: "number",
        height: "string|number",
        thickness: "Alias di height",
        size: "string|number",
        color: "string",
        state: "primary|secondary|success|warning|danger|info|light|dark",
        trackColor: "string",
        bufferColor: "string",
        striped: "boolean",
        animated: "boolean",
        indeterminate: "boolean",
        reverse: "boolean",
        width: "string|number",
        target: "HTMLElement|string",
        mount: "boolean",
        position: "fixed|absolute|relative|static|sticky",
        inset: "string|number",
        top: "string|number",
        right: "string|number",
        bottom: "string|number",
        left: "string|number",
        zIndex: "number",
        visible: "boolean",
        autoStart: "boolean",
        startValue: "number",
        step: "number",
        trickle: "boolean",
        trickleStep: "number",
        trickleInterval: "number",
        trickleMax: "number",
        trickleTo: "Alias di trickleMax",
        doneValue: "number",
        doneDelay: "Alias di hideDelay",
        hideDelay: "number",
        resetValue: "number",
        label: "String|Node|Function|Array",
        note: "String|Node|Function|Array",
        showValue: "boolean|\"inside\"",
        valueLabel: "String|Node|Function|Array",
        insideLabel: "String|Node|Function|Array",
        startLabel: "String|Node|Function|Array",
        endLabel: "String|Node|Function|Array",
        progressClass: "string",
        progressStyle: "object",
        slots: "{ icon?, label?, note?, value?, inside?, startLabel?, endLabel?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        icon: "Icona prima della label",
        label: "Contenuto principale",
        note: "Contenuto secondario",
        value: "Valore esterno a destra",
        inside: "Contenuto dentro la barra",
        startLabel: "Label a sinistra della barra",
        endLabel: "Label a destra della barra",
        default: "Fallback content"
      },
      returns: "HTMLDivElement con API imperativa: .set(), .setBuffer(), .inc(), .start(), .done(), .stop(), .reset(), .show(), .hide(), .destroy()",
      description: "Loading bar basata su UI.Progress, montabile su body o container custom, controllabile via model o API imperativa."
    };
  }
  // Esempio: const lb = CMSwift.ui.LoadingBar({ autoStart: true }); lb.done();

  UI.Notify = (opts = {}) => app.services.notify?.show?.(opts);
  UI.Notify.success = (message, title = "Success") => app.services.notify?.success?.(message, title);
  UI.Notify.error = (message, title = "Error") => app.services.notify?.error?.(message, title);
  UI.Notify.info = (message, title = "Info") => app.services.notify?.info?.(message, title);
  // Esempio: CMSwift.ui.Notify({ type: "success", title: "OK", message: "Salvato" })

  UI.Banner = (...args) => {
    const { props: rawProps, children } = CMSwift.uiNormalizeArgs(args);
    const slots = rawProps.slots || {};

    const resolveStateValue = () => normalizeState(uiUnwrap(rawProps.type) || uiUnwrap(rawProps.state) || "");
    const ctx = {
      state: resolveStateValue,
      dismissible: () => !!uiUnwrap(rawProps.dismissible)
    };

    const typeClass = uiComputed([rawProps.type, rawProps.state], () => resolveStateValue());
    const variantClass = uiComputed(rawProps.variant, () => {
      const variant = String(uiUnwrap(rawProps.variant) || "").toLowerCase();
      return ["solid", "outline", "ghost"].includes(variant) ? `cms-banner-${variant}` : "";
    });
    const actionsPlacementClass = uiComputed([rawProps.actionsPlacement, rawProps.stack], () => {
      const placement = String(uiUnwrap(rawProps.actionsPlacement) || "").toLowerCase();
      return placement === "bottom" || !!uiUnwrap(rawProps.stack) ? "cms-banner-actions-bottom" : "";
    });
    const stackClass = uiComputed(rawProps.stack, () => uiUnwrap(rawProps.stack) ? "cms-banner-stack" : "");

    const props = { ...rawProps };
    const p = CMSwift.omit(props, [
      "actions", "actionsPlacement", "accent", "aside", "body", "closeLabel", "description",
      "dismiss", "dismissible", "icon", "iconSize", "message", "meta", "onDismiss", "slots",
      "stack", "state", "subtitle", "title", "type", "variant"
    ]);
    p.class = uiClass([
      "cms-clear-set",
      "cms-banner",
      "cms-singularity",
      typeClass,
      variantClass,
      actionsPlacementClass,
      stackClass,
      props.class
    ]);
    p.style = { ...(props.style || {}) };

    const toneToCss = (value) => {
      if (value == null || value === "") return "";
      const v = uiUnwrap(value);
      if (v == null || v === "") return "";
      const s = String(v);
      if (isTokenCSS(s)) return `var(--cms-${s})`;
      return s;
    };

    if (rawProps.accent != null || uiIsReactive(rawProps.accent)) {
      p.style["--cms-banner-accent"] = () => toneToCss(rawProps.accent);
      p.style["--cms-banner-border"] = () => {
        const tone = toneToCss(rawProps.accent);
        return tone ? `color-mix(in srgb, ${tone} 38%, var(--cms-border-color))` : "";
      };
      p.style["--cms-banner-bg"] = () => {
        const tone = toneToCss(rawProps.accent);
        return tone ? `color-mix(in srgb, ${tone} 14%, var(--cms-panel))` : "";
      };
      p.style["--cms-banner-color"] = () => {
        const tone = toneToCss(rawProps.accent);
        return tone ? `color-mix(in srgb, ${tone} 78%, white)` : "";
      };
    }

    const autoIconMap = {
      success: "check_circle",
      warning: "warning",
      danger: "error",
      info: "info",
      primary: "bolt",
      secondary: "campaign",
      dark: "shield",
      light: "notifications"
    };

    const iconFallback = (() => {
      if (rawProps.icon === false || rawProps.icon === null) return null;
      if (rawProps.icon != null) {
        return typeof rawProps.icon === "string"
          ? UI.Icon({ name: rawProps.icon, size: rawProps.iconSize || rawProps.size || "md" })
          : CMSwift.ui.slot(rawProps.icon, { as: "icon" });
      }
      const state = resolveStateValue();
      const iconName = state ? autoIconMap[state] : null;
      return iconName ? UI.Icon({ name: iconName, size: rawProps.iconSize || rawProps.size || "md" }) : null;
    })();

    const titleNodes = renderSlotToArray(slots, "title", ctx, rawProps.title);
    const messageNodes = renderSlotToArray(slots, "message", ctx, rawProps.message != null ? rawProps.message : children);
    const descriptionNodes = renderSlotToArray(slots, "description", ctx, rawProps.description ?? rawProps.subtitle);
    const metaNodes = renderSlotToArray(slots, "meta", ctx, rawProps.meta);
    const bodyNodes = renderSlotToArray(
      slots,
      "default",
      ctx,
      rawProps.body != null ? [rawProps.body, ...(children || [])] : (rawProps.message != null ? children : null)
    );
    const iconNodes = renderSlotToArray(slots, "icon", ctx, iconFallback);
    const asideNodes = renderSlotToArray(slots, "aside", ctx, rawProps.aside);
    const actionsNodes = renderSlotToArray(slots, "actions", ctx, rawProps.actions);
    const dismissNodes = renderSlotToArray(slots, "dismiss", ctx, rawProps.dismiss);

    const hasBottomActions = (() => {
      const placement = String(uiUnwrap(rawProps.actionsPlacement) || "").toLowerCase();
      return placement === "bottom" || !!uiUnwrap(rawProps.stack);
    })();
    const isDismissible = !!uiUnwrap(rawProps.dismissible) || !!rawProps.onDismiss;

    let bannerEl = null;
    const defaultDismissNode = isDismissible
      ? UI.Btn({
        class: "cms-banner-close",
        outline: true,
        size: rawProps.size || "sm",
        "aria-label": rawProps.closeLabel || "Chiudi banner",
        onClick: (e) => {
          rawProps.onDismiss?.(e);
          if (e.defaultPrevented) return;
          bannerEl?.remove();
        }
      }, UI.Icon({ name: "close", size: rawProps.size || "sm" }))
      : null;

    const sideNodes = [
      ...asideNodes,
      ...(!hasBottomActions ? actionsNodes : []),
      ...(dismissNodes.length ? dismissNodes : (defaultDismissNode ? [defaultDismissNode] : []))
    ];

    bannerEl = _.div(
      p,
      iconNodes.length ? _.div({ class: "cms-banner-icon" }, ...iconNodes) : null,
      _.div(
        { class: "cms-banner-body" },
        _.div(
          { class: "cms-banner-copy" },
          titleNodes.length ? _.div({ class: "cms-banner-title" }, ...titleNodes) : null,
          messageNodes.length ? _.div({ class: "cms-banner-message" }, ...messageNodes) : null,
          descriptionNodes.length ? _.div({ class: "cms-banner-description" }, ...descriptionNodes) : null,
          bodyNodes.length ? _.div({ class: "cms-banner-extra" }, ...bodyNodes) : null,
          metaNodes.length ? _.div({ class: "cms-banner-meta" }, ...metaNodes) : null
        ),
        hasBottomActions && actionsNodes.length
          ? _.div({ class: "cms-banner-actions" }, ...actionsNodes)
          : null
      ),
      sideNodes.length ? _.div({ class: "cms-banner-side" }, ...sideNodes) : null
    );

    const role = p.role || (() => {
      const state = resolveStateValue();
      return state === "danger" || state === "warning" ? "alert" : "status";
    })();
    bannerEl.setAttribute("role", role);
    setPropertyProps(bannerEl, rawProps);
    return bannerEl;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Banner = {
      signature: "UI.Banner(...children) | UI.Banner(props, ...children)",
      props: {
        title: "String|Node|Function|Array",
        message: "String|Node|Function|Array",
        description: "String|Node|Function|Array",
        meta: "String|Node|Function|Array",
        icon: "String|Node|Function|Array|false",
        actions: "Node|Function|Array",
        aside: "Node|Function|Array",
        body: "Node|Function|Array",
        dismissible: "boolean",
        dismiss: "Node|Function|Array",
        onDismiss: "function",
        closeLabel: "string",
        type: "success|warning|danger|error|info|primary|secondary|light|dark",
        state: "success|warning|danger|error|info|primary|secondary|light|dark",
        accent: "string",
        variant: "soft|solid|outline|ghost",
        actionsPlacement: "end|bottom",
        dense: "boolean",
        stack: "boolean",
        slots: "{ icon?, title?, message?, description?, meta?, actions?, aside?, dismiss?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        icon: "Leading visual/icon content",
        title: "Banner title content",
        message: "Primary message content",
        description: "Secondary/supporting text",
        meta: "Meta information content",
        actions: "Actions area content",
        aside: "Right side support content",
        dismiss: "Custom dismiss control",
        default: "Extra banner body content"
      },
      returns: "HTMLDivElement",
      description: "Banner strutturato con tono, azioni, dismiss e slots composabili."
    };
  }
  // Esempio: CMSwift.ui.Banner({ type: "warning", title: "Pagamento in sospeso", message: "Aggiorna il batch entro le 18:00" })

  // -------------------------------
  // 3) APP SHELL
  // -------------------------------
  let drawerStateKey = "cmswift:drawer-open";
  const drawerToggleIcons = new Set();
  const drawerElsByKey = new Map();
  const readDrawerOpen = (key = drawerStateKey) => {
    const store = CMSwift?.store;
    if (store?.get) {
      const stored = store.get(key, undefined);
      if (typeof stored === "boolean") return stored;
    }
    try {
      return localStorage.getItem(key) === "1";
    } catch {
      return false;
    }
  };
  const writeDrawerOpen = (open, key = drawerStateKey) => {
    const store = CMSwift?.store;
    if (store?.set) {
      store.set(key, !!open);
      return;
    }
    try {
      localStorage.setItem(key, open ? "1" : "0");
    } catch {
      // ignore storage errors
    }
  };
  let drawerOpen = readDrawerOpen();
  const setDrawerOpen = (open, key = drawerStateKey) => {
    drawerOpen = !!open;
    const drawerEls = drawerElsByKey.get(key);
    if (drawerEls && drawerEls.size) {
      drawerEls.forEach((el) => el?.classList.toggle("open", drawerOpen));
    } else {
      const drawerEl = document.querySelector(".cms-drawer");
      if (drawerEl) drawerEl.classList.toggle("open", drawerOpen);
    }
    drawerToggleIcons.forEach((entry) => {
      if (!entry) return;
      if (typeof entry.update === "function") {
        entry.update(drawerOpen);
        return;
      }
      const { el, openIcon, closeIcon } = entry;
      if (el) el.textContent = drawerOpen ? openIcon : closeIcon;
    });
    writeDrawerOpen(drawerOpen, key);
    return drawerOpen;
  };

  UI.Header = (...args) => {
    const { props: rawProps, children } = CMSwift.uiNormalizeArgs(args);
    const slots = rawProps.slots || {};
    const props = { ...rawProps };
    applyCommonProps(props);

    const hasOwn = (key) => Object.prototype.hasOwnProperty.call(rawProps, key);
    const currentStateKey = rawProps.drawerStateKey ?? drawerStateKey;
    if (currentStateKey) {
      drawerStateKey = currentStateKey;
      drawerOpen = readDrawerOpen(currentStateKey);
    }

    const isDrawerOpen = () => readDrawerOpen(currentStateKey);
    const openDrawer = () => setDrawerOpen(true, currentStateKey);
    const closeDrawer = () => setDrawerOpen(false, currentStateKey);
    const toggleDrawer = () => setDrawerOpen(!isDrawerOpen(), currentStateKey);
    const ctx = {
      props: rawProps,
      stateKey: currentStateKey,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer,
      toggleAside: toggleDrawer
    };
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
        const host = _[inlineNames.has(name) ? "span" : "div"]({ class: `cms-header-slot-${name}` });
        CMSwift.reactive.effect(() => {
          const nextValue = map(fallback(ctx));
          const normalized = flattenSlotValue(CMSwift.ui.slot(nextValue));
          host.replaceChildren();
          if (Array.isArray(normalized)) normalized.forEach((item) => appendResolvedValue(host, item));
          else appendResolvedValue(host, normalized);
        }, `UI.Header:${name}`);
        return [host];
      }
      return renderSlotToArray(slots, name, ctx, map(fallback));
    };

    const renderIconValue = (value, as = "icon", sizeFallback = rawProps.iconSize || rawProps.size || "md") => {
      if (value == null || value === false) return null;
      if (typeof value === "string") return UI.Icon({ name: value, size: sizeFallback });
      return CMSwift.ui.slot(value, { as });
    };
    const renderDrawerToggleValue = (open) => {
      const value = open ? (rawProps.drawerOpenIcon ?? "✕") : (rawProps.drawerCloseIcon ?? "☰");
      if (value == null || value === false) return null;
      if (typeof value === "string") return value;
      return CMSwift.ui.slot(value, { as: open ? "drawerOpenIcon" : "drawerCloseIcon" });
    };

    const toggleIconHost = _.span({ class: "cms-header-toggle-icon" });
    const paintToggleIcon = (open) => {
      const nodes = renderSlotToArray(null, "default", ctx, renderDrawerToggleValue(open));
      toggleIconHost.replaceChildren(...(nodes.length ? nodes : [""]));
    };
    paintToggleIcon(isDrawerOpen());

    const autoLeft = UI.Btn({
      class: "cms-header-toggle",
      outline: true,
      size: rawProps.toggleSize ?? rawProps.size ?? "sm",
      onClick: toggleDrawer,
      "aria-label": rawProps.toggleLabel || "Toggle navigation"
    }, toggleIconHost);
    if (rawProps.left == null && rawProps.left !== false && !CMSwift.ui.getSlot(slots, "left")) {
      drawerToggleIcons.add({ update: paintToggleIcon });
    }

    const leftFallback = rawProps.left === false
      ? null
      : (rawProps.left != null ? rawProps.left : autoLeft);
    const titleFallback = hasOwn("title") ? rawProps.title : (rawProps.label ?? "App");
    const subtitleFallback = rawProps.subtitle ?? rawProps.description ?? "";
    const rightFallback = hasOwn("right") ? rawProps.right : rawProps.end;
    const contentFallback = hasOwn("content")
      ? rawProps.content
      : (hasOwn("body") ? rawProps.body : (children?.length ? children : null));

    const startNodes = [
      ...renderPropNodes("left", leftFallback),
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
    const customCenterNodes = [
      ...renderPropNodes("center", null),
      ...renderPropNodes("body", null)
    ];
    const rightNodes = [
      ...renderPropNodes("right", rightFallback),
      ...renderPropNodes("end", null)
    ];
    const actionNodes = renderPropNodes("actions", rawProps.actions);

    const structuredCenter = _.div(
      { class: uiClass(["cms-header-body", rawProps.bodyClass, rawProps.centerClass]) },
      _.div(
        { class: "cms-header-heading" },
        iconNodes.length ? _.div({ class: "cms-header-icon" }, ...iconNodes) : null,
        _.div(
          { class: "cms-header-copy" },
          eyebrowNodes.length ? _.div({ class: uiClass(["cms-header-eyebrow", rawProps.eyebrowClass]) }, ...eyebrowNodes) : null,
          titleNodes.length ? _.div({ class: uiClass(["cms-header-title", rawProps.titleClass]) }, ...titleNodes) : null,
          subtitleNodes.length ? _.div({ class: uiClass(["cms-header-subtitle", rawProps.subtitleClass]) }, ...subtitleNodes) : null,
          contentNodes.length ? _.div({ class: uiClass(["cms-header-content", rawProps.contentClass]) }, ...contentNodes) : null
        ),
        metaNodes.length ? _.div({ class: uiClass(["cms-header-meta", rawProps.metaClass]) }, ...metaNodes) : null
      )
    );

    const endContent = [
      ...rightNodes,
      ...(actionNodes.length ? [_.div({ class: uiClass(["cms-header-actions", rawProps.actionsClass]) }, ...actionNodes)] : [])
    ];

    const p = CMSwift.omit(props, [
      "actions", "actionsClass", "body", "bodyClass", "centerClass", "content", "contentClass",
      "description", "divider", "drawerCloseIcon", "drawerOpenIcon", "drawerStateKey", "elevated",
      "end", "eyebrow", "eyebrowClass", "icon", "iconSize", "kicker", "label", "left", "meta",
      "metaClass", "right", "slots", "stack", "sticky", "subtitle", "subtitleClass", "title",
      "titleClass", "toggleLabel", "toggleSize", "gap", "minHeight", "startClass", "endClass"
    ]);
    p.class = uiClass([
      "cms-panel",
      "cms-header",
      "cms-singularity",
      uiWhen(rawProps.sticky !== false, "sticky"),
      uiWhen(rawProps.stack, "stack"),
      uiWhen(rawProps.elevated, "elevated"),
      uiWhen(rawProps.divider !== false, "divider"),
      props.class
    ]);
    p.style = { ...(props.style || {}) };
    if (rawProps.gap != null) p.style["--cms-header-gap"] = toCssSize(uiUnwrap(rawProps.gap));
    if (rawProps.minHeight != null) p.style.minHeight = toCssSize(uiUnwrap(rawProps.minHeight));

    const el = _.div(
      p,
      ...(startNodes.length ? [_.div({ class: uiClass(["cms-header-start", rawProps.startClass]) }, ...startNodes)] : []),
      _.div(
        { class: "cms-header-main" },
        ...(customCenterNodes.length
          ? [_.div({ class: uiClass(["cms-header-body", rawProps.bodyClass, rawProps.centerClass]) }, ...customCenterNodes)]
          : [structuredCenter]),
        ...(endContent.length ? [_.div({ class: uiClass(["cms-header-end", rawProps.endClass]) }, ...endContent)] : [])
      )
    );

    setPropertyProps(el, rawProps);
    return el;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Header = {
      signature: "UI.Header(...children) | UI.Header(props, ...children)",
      props: {
        title: "String|Node|Function|Array",
        subtitle: "String|Node|Function|Array",
        eyebrow: "String|Node|Function|Array",
        content: "Node|Function|Array",
        meta: "Node|Function|Array",
        icon: "String|Node|Function|Array",
        left: "Node|Function|Array|false",
        right: "Node|Function|Array",
        actions: "Node|Function|Array",
        drawerOpenIcon: "string|Node",
        drawerCloseIcon: "string|Node",
        drawerStateKey: "string",
        sticky: "boolean",
        stack: "boolean",
        dense: "boolean",
        elevated: "boolean",
        divider: "boolean",
        gap: "string|number",
        minHeight: "string|number",
        slots: "{ left?, start?, right?, end?, center?, body?, icon?, eyebrow?, title?, subtitle?, meta?, content?, actions? }",
        class: "string",
        style: "object"
      },
      slots: {
        left: "Area sinistra, fallback al toggle drawer",
        start: "Alias/addon area sinistra",
        right: "Area destra principale",
        end: "Alias/addon area destra",
        center: "Override completo del body centrale",
        body: "Alias di center",
        icon: "Icona leading",
        eyebrow: "Eyebrow / kicker",
        title: "Titolo",
        subtitle: "Sottotitolo",
        meta: "Meta info accanto al contenuto centrale",
        content: "Contenuto extra sotto il sottotitolo",
        actions: "Azioni raggruppate nella zona destra"
      },
      returns: "HTMLDivElement",
      description: "Header strutturato con regioni start/body/end, toggle drawer integrato, metadata e slot composabili."
    };
  }

  UI.Drawer = (...args) => {
    const { props } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const items = props.items || [];
    const header = props.header ?? null;
    const stateKey = props.stateKey ?? null;
    const closeOnSelect = props.closeOnSelect ?? true;
    const groupOpenIcon = props.groupOpenIcon;
    const groupCloseIcon = props.groupCloseIcon;
    const className = props.class ?? null;

    if (stateKey) {
      drawerStateKey = stateKey;
      drawerOpen = readDrawerOpen();
    }
    const currentStateKey = drawerStateKey;
    const store = CMSwift?.store;
    const canStore = !!(store?.get && store?.set);
    const groupStateKey = `${currentStateKey}:groups`;
    let groupState = canStore ? (store.get(groupStateKey, {}) || {}) : {};

    const isExternalLink = (it) => {
      if (typeof it.external === "boolean") return it.external;
      const href = it.href || it.to || "";
      return /^(https?:)?\/\//.test(href);
    };

    const shouldClose = (it) => closeOnSelect && !it.keepOpen;

    const makeIcon = (icon, side = "left") => {
      // deve accettare function, oggetti node e stringhe
      if (icon == null) return null;
      if (typeof icon === "function") return icon;
      if (typeof icon === "string") return _.Icon(icon);
      return icon;
    };

    const getItemIcons = (it) => {
      const side = it.iconPosition || "left";
      const leftIcon = it.iconLeft ?? (side !== "right" ? it.icon : null);
      const rightIcon = it.iconRight ?? (side === "right" ? it.icon : null);
      return {
        left: makeIcon(leftIcon, "left"),
        right: makeIcon(rightIcon, "right")
      };
    };

    const itemKeyPart = (it, label, level, idx) => it.key || it.id || it.to || it.href || label || `item-${level}-${idx}`;

    const readGroupOpen = (key, fallback) => {
      if (!canStore) return fallback;
      if (Object.prototype.hasOwnProperty.call(groupState, key)) return !!groupState[key];
      return fallback;
    };

    const writeGroupOpen = (key, open) => {
      if (!canStore) return;
      groupState = { ...groupState, [key]: !!open };
      store.set(groupStateKey, groupState);
    };

    const renderItems = (list = [], level = 0, path = []) => {
      return list.map((it, idx) => {
        const children = it.items || it.children || it.sub;
        const label = it.label || it.title || it.to || it.href || `item-${level}-${idx}`;
        const keyPart = itemKeyPart(it, label, level, idx);
        const stateKey = path.concat(keyPart).join("::");
        const { left: itemIconLeft, right: itemIconRight } = getItemIcons(it);

        const btnOpenIcon = groupOpenIcon ?? _.Icon("arrow_drop_down", { size: "lg" });
        const btnCloseIcon = groupCloseIcon ?? _.Icon("arrow_drop_up", { size: "lg" });

        if (Array.isArray(children) && children.length) {
          let open = readGroupOpen(stateKey, !!it.expanded);
          const openIcon = it.openIcon || btnOpenIcon;
          const closeIcon = it.closeIcon || btnCloseIcon;
          const openIconSide = it.iconSidePosition || it.openIconSide || it.openIconPosition || "left";
          const closeIconSide = it.iconSidePosition || it.closeIconSide || it.closeIconPosition || "left";
          const toggleIconEl = _.span({ class: "cms-drawer-group-icon" });
          const labelContent = CMSwift.ui.renderSlot(slots, "groupLabel", { item: it, label }, label);
          const labelEl = _.span({ class: "cms-drawer-group-label" }, ...renderSlotToArray(null, "default", {}, labelContent));
          const groupItems = _.div({ class: "cms-drawer-group-items" }, ...renderItems(children, level + 1, path.concat(keyPart)));
          const toggleBtn = _.button({
            class: "cms-drawer-group-toggle",
            onClick: () => setOpen(!open)
          }, toggleIconEl, itemIconLeft, labelEl, itemIconRight);
          const spacerRight = _.Spacer();
          const setToggleIcon = (isOpen) => {
            const icon = isOpen ? openIcon : closeIcon;
            const side = (isOpen ? openIconSide : closeIconSide) === "right" ? "right" : "left";
            toggleIconEl.innerHTML = "";
            if (icon) toggleIconEl.appendChild(_.span(icon));
            if (side === "right") {
              toggleIconEl.classList.remove("left");
              toggleIconEl.classList.add("right");
              toggleBtn.appendChild(spacerRight);
              toggleBtn.appendChild(toggleIconEl);
            } else {
              toggleIconEl.classList.remove("right");
              toggleIconEl.classList.add("left");
              toggleBtn.insertBefore(toggleIconEl, toggleBtn.firstChild);
            }
          };
          const setOpen = (val) => {
            open = !!val;
            setToggleIcon(open);
            groupWrap.classList.toggle("open", open);
            writeGroupOpen(stateKey, open);
          };
          const groupWrap = _.div({
            class: uiClass(["cms-drawer-group", open ? "open" : "", it.class])
          }, toggleBtn, groupItems);
          setToggleIcon(open);
          return groupWrap;
        }

        const needsFlex = !!itemIconRight;
        const itemStyle = needsFlex ? Object.assign({ display: "flex", alignItems: "center", gap: "8px" }, it.style || {}) : it.style;
        const href = it.href || it.to || null;
        const labelText = it.label || href;
        const itemLabel = CMSwift.ui.renderSlot(slots, "itemLabel", { item: it, label: labelText }, labelText);

        if (it.button || it.type === "button") {
          return UI.Btn({
            class: uiClass(["cms-drawer-btn", it.class]),
            style: itemStyle,
            onClick: () => {
              if (shouldClose(it)) setDrawerOpen(false);
            }
          }, itemIconLeft, ...renderSlotToArray(null, "default", {}, itemLabel), itemIconRight);
        }

        const external = isExternalLink(it);
        const target = external ? (it.target || "_blank") : it.target;
        const rel = external ? (it.rel || "noopener noreferrer") : it.rel;
        const attr = {};

        if (external) attr.target = target;
        if (rel) attr.rel = rel;
        if (href) attr.href = href;
        if (itemStyle) attr.style = itemStyle;

        return _.a({
          class: uiClass(["cms-drawer-link", it.class]),
          ...attr,
          onClick: (e) => {
            it.onClick?.(e);
            if (!external && it.to && app.router?.navigate) {
              e.preventDefault();
              app.router.navigate(it.to);
            }
            if (shouldClose(it)) setDrawerOpen(false);
          }
        }, itemIconLeft, ...renderSlotToArray(null, "default", {}, itemLabel), itemIconRight);
      });
    };

    const drawerEl = _.div(
      {
        class: uiClass([
          "cms-panel",
          "cms-drawer",
          drawerOpen ? "open" : "",
          uiWhen(props.sticky, "sticky"),
          className
        ]),
        style: props.style
      },
      ...renderSlotToArray(slots, "header", {}, header),
      ...renderItems(items)
    );
    const drawerSet = drawerElsByKey.get(currentStateKey) || new Set();
    drawerSet.add(drawerEl);
    drawerElsByKey.set(currentStateKey, drawerSet);
    setDrawerOpen(drawerOpen, currentStateKey);
    return drawerEl;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Drawer = {
      signature: "UI.Drawer(props)",
      props: {
        items: "Array",
        header: "Node|Function|Array",
        stateKey: "string",
        closeOnSelect: "boolean",
        groupOpenIcon: "Node",
        groupCloseIcon: "Node",
        sticky: "boolean",
        slots: "{ header?, itemLabel?, groupLabel? }",
        class: "string",
        style: "object"
      },
      slots: {
        header: "Drawer header content",
        itemLabel: "Item label renderer (ctx: { item, label })",
        groupLabel: "Group label renderer (ctx: { item, label })"
      },
      returns: "HTMLDivElement",
      description: "Drawer navigazione con gruppi e stato persistente."
    };
  }

  UI.Page = (...args) => {
    const { props: rawProps, children } = CMSwift.uiNormalizeArgs(args);
    const slots = rawProps.slots || {};
    const props = { ...rawProps };

    const isSectionNode = (node, name) => {
      return !!(node && node.nodeType === 1 && node.classList?.contains(`cms-page-${name}`));
    };
    const renderIconFallback = (value) => {
      if (value == null) return null;
      if (typeof value === "string") return UI.Icon({ name: value, size: rawProps.iconSize || rawProps.size || "xl" });
      return CMSwift.ui.slot(value, { as: "icon" });
    };

    const ctx = {
      dense: !!uiUnwrap(rawProps.dense),
      flat: !!uiUnwrap(rawProps.flat),
      centered: !!uiUnwrap(rawProps.centered),
      narrow: !!uiUnwrap(rawProps.narrow)
    };
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
        const host = _[inlineNames.has(name) ? "span" : "div"]({ class: `cms-page-slot-${name}` });
        CMSwift.reactive.effect(() => {
          const nextValue = map(fallback(ctx));
          const normalized = flattenSlotValue(CMSwift.ui.slot(nextValue));
          host.replaceChildren();
          if (Array.isArray(normalized)) normalized.forEach((item) => appendResolvedValue(host, item));
          else appendResolvedValue(host, normalized);
        }, `UI.Page:${name}`);
        return [host];
      }
      return renderSlotToArray(slots, name, ctx, map(fallback));
    };

    const defaultNodes = renderSlotToArray(slots, "default", ctx, children?.length ? children : []);
    const sectionNodes = {
      hero: [],
      header: [],
      body: [],
      footer: [],
      actions: []
    };
    const looseNodes = [];

    defaultNodes.forEach((node) => {
      if (isSectionNode(node, "hero")) sectionNodes.hero.push(node);
      else if (isSectionNode(node, "header")) sectionNodes.header.push(node);
      else if (isSectionNode(node, "body")) sectionNodes.body.push(node);
      else if (isSectionNode(node, "footer")) sectionNodes.footer.push(node);
      else if (isSectionNode(node, "actions")) sectionNodes.actions.push(node);
      else looseNodes.push(node);
    });

    const iconNodes = renderPropNodes("icon", rawProps.icon, renderIconFallback);
    const heroNodes = renderPropNodes("hero", rawProps.hero ?? rawProps.banner);
    const eyebrowNodes = renderPropNodes("eyebrow", rawProps.eyebrow ?? rawProps.kicker);
    const titleNodes = renderPropNodes("title", rawProps.title);
    const subtitleNodes = renderPropNodes("subtitle", rawProps.subtitle ?? rawProps.description);
    const headerNodes = renderPropNodes("header", rawProps.header);
    const asideNodes = renderPropNodes("aside", rawProps.aside);
    const bodyNodes = renderPropNodes("body", rawProps.body ?? rawProps.content);
    const footerNodes = renderPropNodes("footer", rawProps.footer);
    const actionsNodes = renderPropNodes("actions", rawProps.actions);

    const generatedHero = heroNodes.length
      ? _.div({ class: uiClass(["cms-page-hero", rawProps.heroClass]) }, ...heroNodes)
      : null;

    const hasStructuredHeader = iconNodes.length || eyebrowNodes.length || titleNodes.length || subtitleNodes.length || headerNodes.length || asideNodes.length;
    const generatedHeader = hasStructuredHeader
      ? _.div(
        { class: uiClass(["cms-page-header", rawProps.headerClass]) },
        _.div(
          { class: "cms-page-head" },
          iconNodes.length ? _.div({ class: uiClass(["cms-page-icon", rawProps.iconClass]) }, ...iconNodes) : null,
          _.div(
            { class: "cms-page-head-main" },
            eyebrowNodes.length ? _.div({ class: uiClass(["cms-page-eyebrow", rawProps.eyebrowClass]) }, ...eyebrowNodes) : null,
            titleNodes.length ? _.div({ class: uiClass(["cms-page-title", rawProps.titleClass]) }, ...titleNodes) : null,
            subtitleNodes.length ? _.div({ class: uiClass(["cms-page-subtitle", rawProps.subtitleClass]) }, ...subtitleNodes) : null,
            headerNodes.length ? _.div({ class: uiClass(["cms-page-header-content", rawProps.headerContentClass]) }, ...headerNodes) : null
          ),
          asideNodes.length ? _.div({ class: uiClass(["cms-page-aside", rawProps.asideClass]) }, ...asideNodes) : null
        )
      )
      : null;

    const mergedBodyNodes = [...bodyNodes, ...looseNodes];
    const generatedBody = mergedBodyNodes.length
      ? _.div({ class: uiClass(["cms-page-body", rawProps.bodyClass]) }, ...mergedBodyNodes)
      : null;

    const mergedActionNodes = [...actionsNodes, ...sectionNodes.actions];
    const generatedFooter = (footerNodes.length || mergedActionNodes.length)
      ? _.div(
        { class: uiClass(["cms-page-footer", rawProps.footerClass]) },
        ...footerNodes,
        mergedActionNodes.length ? _.div({ class: "cms-page-actions" }, ...mergedActionNodes) : null
      )
      : null;

    const hasHero = !!(heroNodes.length || sectionNodes.hero.length);
    const hasHeader = !!(hasStructuredHeader || sectionNodes.header.length);
    const p = CMSwift.omit(props, [
      "actions", "aside", "asideClass", "banner", "body", "bodyClass", "centered", "content",
      "dense", "description", "eyebrow", "eyebrowClass", "flat", "footer", "footerClass",
      "gap", "header", "headerClass", "headerContentClass", "headerGap", "hero", "heroClass",
      "heroPadding", "icon", "iconClass", "iconSize", "kicker", "maxWidth", "minHeight",
      "narrow", "padding", "size", "slots", "subtitle", "subtitleClass", "title", "titleClass"
    ]);
    p.class = uiClass([
      "cms-panel",
      "cms-page",
      uiWhen(rawProps.dense, "dense"),
      uiWhen(rawProps.flat, "cms-page-flat"),
      uiWhen(rawProps.centered, "cms-page-centered"),
      uiWhen(rawProps.narrow, "cms-page-narrow"),
      uiWhen(hasHero, "cms-page-has-hero"),
      uiWhen(hasHeader, "cms-page-has-header"),
      props.class
    ]);
    p.style = { ...(props.style || {}) };

    if (rawProps.gap != null || uiIsReactive(rawProps.gap)) {
      p.style["--cms-page-gap"] = uiStyleValue(rawProps.gap, toCssSize);
    }
    if (rawProps.padding != null || uiIsReactive(rawProps.padding)) {
      p.style["--cms-page-padding"] = uiStyleValue(rawProps.padding, toCssSize);
    }
    if (rawProps.maxWidth != null || uiIsReactive(rawProps.maxWidth)) {
      p.style["--cms-page-max-width"] = uiStyleValue(rawProps.maxWidth, toCssSize);
    }
    if (rawProps.minHeight != null || uiIsReactive(rawProps.minHeight)) {
      p.style["--cms-page-min-height"] = uiStyleValue(rawProps.minHeight, toCssSize);
    }
    if (rawProps.headerGap != null || uiIsReactive(rawProps.headerGap)) {
      p.style["--cms-page-header-gap"] = uiStyleValue(rawProps.headerGap, toCssSize);
    }
    if (rawProps.heroPadding != null || uiIsReactive(rawProps.heroPadding)) {
      p.style["--cms-page-hero-padding"] = uiStyleValue(rawProps.heroPadding, toCssSize);
    }

    const el = _.div(
      p,
      generatedHero,
      ...sectionNodes.hero,
      generatedHeader,
      ...sectionNodes.header,
      generatedBody,
      ...sectionNodes.body,
      generatedFooter,
      ...sectionNodes.footer
    );

    setPropertyProps(el, rawProps);
    return el;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Page = {
      signature: "UI.Page(...children) | UI.Page(props, ...children)",
      props: {
        hero: "Node|Function|Array",
        icon: "String|Node|Function|Array",
        eyebrow: "String|Node|Function|Array",
        title: "String|Node|Function|Array",
        subtitle: "String|Node|Function|Array",
        header: "String|Node|Function|Array",
        aside: "Node|Function|Array",
        body: "Node|Function|Array",
        footer: "Node|Function|Array",
        actions: "Node|Function|Array",
        dense: "boolean",
        flat: "boolean",
        centered: "boolean",
        narrow: "boolean",
        gap: "string|number",
        padding: "string|number",
        maxWidth: "string|number",
        minHeight: "string|number",
        heroPadding: "string|number",
        headerGap: "string|number",
        slots: "{ hero?, icon?, eyebrow?, title?, subtitle?, header?, aside?, body?, footer?, actions?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        hero: "Top hero/banner area",
        icon: "Page icon/visual",
        eyebrow: "Eyebrow/kicker content",
        title: "Page title content",
        subtitle: "Page subtitle/description content",
        header: "Header support content under title",
        aside: "Top-right header content",
        body: "Structured body content",
        footer: "Footer meta/content",
        actions: "Footer actions content",
        default: "Fallback body content"
      },
      returns: "HTMLDivElement",
      description: "Contenitore pagina strutturato con hero, header, body, footer e layout configurabile."
    };
  }

  UI.AppShell = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const hasOwn = (obj, key) => !!obj && Object.prototype.hasOwnProperty.call(obj, key);

    const noDrawer = uiUnwrap(props.noDrawer) === true || props.drawer === false;
    const reverse = uiUnwrap(props.reverse) === true;
    const stack = uiUnwrap(props.stack) === true;
    const currentStateKey = props.drawerStateKey ?? props.stateKey ?? drawerStateKey;

    if (currentStateKey) {
      drawerStateKey = currentStateKey;
      drawerOpen = readDrawerOpen(currentStateKey);
    }

    const shellCtx = {
      props,
      noDrawer,
      stateKey: currentStateKey,
      isDrawerOpen: () => readDrawerOpen(currentStateKey),
      openDrawer: () => setDrawerOpen(true, currentStateKey),
      closeDrawer: () => setDrawerOpen(false, currentStateKey),
      toggleDrawer: () => setDrawerOpen(!readDrawerOpen(currentStateKey), currentStateKey)
    };

    const headerProps = (props.headerProps && typeof props.headerProps === "object") ? { ...props.headerProps } : {};
    let headerFallback = props.header;
    if (!hasOwn(props, "header") && (
      Object.keys(headerProps).length ||
      hasOwn(props, "title") ||
      hasOwn(props, "subtitle") ||
      hasOwn(props, "left") ||
      hasOwn(props, "right")
    )) {
      if (!hasOwn(headerProps, "title") && hasOwn(props, "title")) headerProps.title = props.title;
      if (!hasOwn(headerProps, "subtitle") && hasOwn(props, "subtitle")) headerProps.subtitle = props.subtitle;
      if (!hasOwn(headerProps, "left") && hasOwn(props, "left")) headerProps.left = props.left;
      if (!hasOwn(headerProps, "right") && hasOwn(props, "right")) headerProps.right = props.right;
      if (!hasOwn(headerProps, "drawerStateKey")) headerProps.drawerStateKey = currentStateKey;
      if (noDrawer && !hasOwn(headerProps, "left")) headerProps.left = false;
      headerFallback = UI.Header(headerProps);
    }

    const drawerProps = (props.drawerProps && typeof props.drawerProps === "object") ? { ...props.drawerProps } : {};
    const drawerItems = hasOwn(props, "drawerItems") ? props.drawerItems : props.items;
    const drawerHeader = hasOwn(props, "drawerHeader") ? props.drawerHeader : undefined;
    let drawerFallback = props.drawer;
    if (!hasOwn(props, "drawer") && !noDrawer && (
      Object.keys(drawerProps).length ||
      drawerItems != null ||
      drawerHeader != null
    )) {
      if (!hasOwn(drawerProps, "items") && drawerItems != null) drawerProps.items = drawerItems;
      if (!hasOwn(drawerProps, "header") && drawerHeader != null) drawerProps.header = drawerHeader;
      if (!hasOwn(drawerProps, "stateKey")) drawerProps.stateKey = currentStateKey;
      drawerFallback = UI.Drawer(drawerProps);
    }

    const pageProps = (props.pageProps && typeof props.pageProps === "object") ? { ...props.pageProps } : {};
    const pageContentFallback = hasOwn(props, "content") ? props.content : children;
    const defaultPageContent = renderSlotToArray(slots, "default", shellCtx, pageContentFallback);
    let pageFallback = props.page;
    if (!hasOwn(props, "page") && (Object.keys(pageProps).length || defaultPageContent.length)) {
      pageFallback = UI.Page(pageProps, ...defaultPageContent);
    }

    const footerProps = (props.footerProps && typeof props.footerProps === "object") ? { ...props.footerProps } : {};
    const footerContent = hasOwn(props, "footerContent") ? props.footerContent : undefined;
    let footerFallback = props.footer;
    if (!hasOwn(props, "footer") && (Object.keys(footerProps).length || footerContent != null)) {
      footerFallback = UI.Footer(footerProps, ...renderSlotToArray(null, "default", shellCtx, footerContent));
    }

    const headerNodes = renderSlotToArray(slots, "header", shellCtx, headerFallback);
    const drawerNodes = noDrawer ? [] : renderSlotToArray(slots, "drawer", shellCtx, drawerFallback);
    const pageNodes = renderSlotToArray(slots, "page", shellCtx, pageFallback);
    const footerNodes = renderSlotToArray(slots, "footer", shellCtx, footerFallback);

    const cls = uiClass([
      "cms-app",
      "cms-app-shell",
      uiWhen(noDrawer, "no-drawer"),
      uiWhen(reverse, "is-reverse"),
      uiWhen(stack, "is-stack"),
      uiWhen(props.flush, "is-flush"),
      uiWhen(props.divider, "is-divider"),
      props.class
    ]);

    const p = CMSwift.omit(props, [
      "header", "drawer", "page", "footer", "content",
      "title", "subtitle", "left", "right",
      "items", "drawerItems", "drawerHeader",
      "headerProps", "drawerProps", "pageProps", "footerProps",
      "footerContent",
      "noDrawer", "reverse", "stack", "flush", "divider",
      "drawerStateKey", "stateKey",
      "drawerWidth", "gap", "padding",
      "slots"
    ]);
    p.class = cls;
    p.style = { ...(props.style || {}) };

    const drawerWidth = uiStyleValue(props.drawerWidth, toCssSize);
    if (drawerWidth != null) p.style["--cms-app-shell-drawer-width"] = drawerWidth;
    const gap = uiStyleValue(props.gap, toCssSize);
    if (gap != null) p.style["--cms-app-shell-gap"] = gap;
    const padding = uiStyleValue(props.padding, toCssSize);
    if (padding != null) p.style["--cms-app-shell-padding"] = padding;

    const headerWrap = headerNodes.length
      ? _.div({ class: "cms-app-shell-header-slot" }, ...headerNodes)
      : null;
    const drawerWrap = drawerNodes.length
      ? _.div({ class: "cms-app-shell-drawer-slot" }, ...drawerNodes)
      : null;
    const pageWrap = pageNodes.length
      ? _.div({ class: "cms-app-shell-page-slot" }, ...pageNodes)
      : null;
    const footerWrap = footerNodes.length
      ? _.div({ class: "cms-app-shell-footer-slot" }, ...footerNodes)
      : null;

    const bodyNodes = reverse
      ? [pageWrap, drawerWrap]
      : [drawerWrap, pageWrap];

    const root = _.div(
      p,
      ...(headerWrap ? [headerWrap] : []),
      _.div({ class: "cms-app-shell-body" }, ...bodyNodes.filter(Boolean)),
      ...(footerWrap ? [footerWrap] : [])
    );

    root.openDrawer = shellCtx.openDrawer;
    root.closeDrawer = shellCtx.closeDrawer;
    root.toggleDrawer = shellCtx.toggleDrawer;
    root.isDrawerOpen = shellCtx.isDrawerOpen;
    root.header = headerWrap;
    root.drawer = drawerWrap;
    root.page = pageWrap;
    root.footer = footerWrap;

    setPropertyProps(root, props);
    return root;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.AppShell = {
      signature: "UI.AppShell(...children) | UI.AppShell(props, ...children)",
      props: {
        header: "Node|Function|Array|false",
        drawer: "Node|Function|Array|false",
        page: "Node|Function|Array|false",
        footer: "Node|Function|Array|false",
        title: "string|Node|Function|Array",
        subtitle: "string|Node|Function|Array",
        left: "Node|Function|Array|false",
        right: "Node|Function|Array",
        items: "Array",
        drawerItems: "Array",
        drawerHeader: "Node|Function|Array",
        content: "Node|Function|Array",
        headerProps: "object",
        drawerProps: "object",
        pageProps: "object",
        footerProps: "object",
        footerContent: "Node|Function|Array",
        noDrawer: "boolean",
        reverse: "boolean",
        stack: "boolean",
        flush: "boolean",
        divider: "boolean",
        drawerStateKey: "string",
        stateKey: "string",
        drawerWidth: "number|string",
        gap: "number|string",
        padding: "number|string",
        slots: "{ header?, drawer?, page?, footer?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        header: "Header content",
        drawer: "Drawer content",
        page: "Page content",
        footer: "Footer content",
        default: "Fallback page content"
      },
      returns: "HTMLDivElement con methods openDrawer/closeDrawer/toggleDrawer/isDrawerOpen",
      description: "Shell applicazione composabile con shortcut per Header/Drawer/Page/Footer e gestione drawer."
    };
  }

  UI.Parallax = function Parallax(...args) {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const height = uiUnwrap(props.height) || "220px";
    const speed = uiUnwrap(props.speed) ?? 0.3;
    const startTop = uiUnwrap(props.startTop) ?? 0;
    const image = uiUnwrap(props.image) || uiUnwrap(props.src) || "";
    const bgImage = props.background || (image ? `url(${image})` : "");
    const style = Object.assign({}, props.style || {}, {
      "--cms-parallax-height": height,
    });

    if (bgImage) style["--cms-parallax-image"] = bgImage;
    const overlay = uiUnwrap(props.overlay);
    if (overlay) style["--cms-parallax-overlay"] = overlay;
    const color = uiUnwrap(props.color);
    if (color) style["--cms-parallax-color"] = color;
    const bgPosition = uiUnwrap(props.bgPosition);
    if (bgPosition) style["--cms-parallax-position"] = bgPosition;
    const bgSize = uiUnwrap(props.bgSize);
    if (bgSize) style["--cms-parallax-size"] = bgSize;

    const bg = _.div({
      class: uiClass(["cms-parallax-bg", props.bgClass]),
    });
    const contentNodes = children.length
      ? renderSlotToArray(slots, "default", {}, children)
      : renderSlotToArray(slots, "content", {}, props.content);
    const content = _.div(
      { class: uiClass(["cms-parallax-content", props.contentClass]) },
      ...contentNodes
    );
    const wrapProps = CMSwift.omit(props, [
      "height", "speed", "startTop", "image", "src", "background",
      "overlay", "color", "bgPosition", "bgSize",
      "bgClass", "contentClass", "content", "class", "style", "slots"
    ]);
    wrapProps.class = uiClass(["cms-parallax", props.class]);
    const wrap = _.div(wrapProps, bg, content);
    Object.entries(style).forEach((v) => { wrap.style.setProperty(v[0], v[1]); });
    let ticking = false;
    function update() {
      const rect = wrap.getBoundingClientRect();
      const offset = (rect.top - startTop) * speed;
      bg.style.transform = `translateY(${offset}px)`;
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    }

    //update();
    setTimeout(update, 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return wrap;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Parallax = {
      signature: "UI.Parallax(...children) | UI.Parallax(props, ...children)",
      props: {
        src: "string",
        height: "string|number",
        speed: "number",
        startTop: "number",
        overlay: "string",
        color: "string",
        bgPosition: "string",
        bgSize: "string",
        bgClass: "string",
        contentClass: "string",
        slots: "{ content?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        content: "Parallax content",
        default: "Fallback content"
      },
      returns: "HTMLDivElement",
      description: "Parallax container con background e contenuti."
    };
  }

  // Example:
  // _.Parallax({ src: "/assets/hero.jpg", height: "280px", speed: 0.2 }, _.h2("Hello"));

  // -------------------------------
  // 4) NOTIFY SERVICE (toast)
  // -------------------------------
  const [toasts, setToasts] = app.reactive.signal([]);

  function ensureToastRoot() {
    let root = document.querySelector(".cms-toast-wrap");
    if (root) return root;
    root = document.createElement("div");
    root.className = "cms-toast-wrap";
    document.body.appendChild(root);

    // render reattivo
    app.reactive.effect(() => {
      const list = toasts();
      root.innerHTML = "";
      for (const t of list) {
        const node = _.div({ class: `cms-toast ${t.type || "info"}` },
          _.div({ class: "t-title" }, t.title || (t.type || "info").toUpperCase()),
          t.message ? _.div(t.message) : null
        );
        root.appendChild(node);
      }
    }, "CMSwiftUI:toasts");

    return root;
  }

  function pushToast({ type = "info", title = "", message = "", timeout = 2500 } = {}) {
    ensureToastRoot();
    const id = Math.random().toString(36).slice(2);
    const next = [...toasts(), { id, type, title, message }];
    setToasts(next);

    if (timeout > 0) {
      setTimeout(() => {
        setToasts(toasts().filter(x => x.id !== id));
      }, timeout);
    }
    return id;
  }

  app.services.notify.show = pushToast;
  app.services.notify.success = (message, title = "Success") => pushToast({ type: "success", title, message });
  app.services.notify.error = (message, title = "Error") => pushToast({ type: "error", title, message, timeout: 3500 });
  app.services.notify.info = (message, title = "Info") => pushToast({ type: "info", title, message });

  // Optional shortcut
  app.notify = app.services.notify;

  // useForm + UI.Form
  CMSwift.form = CMSwift.form || {};

  CMSwift.form._isPromise = (v) => v && typeof v.then === "function";

  CMSwift.form._normalizeRules = (rules) => {
    // rules: { fieldName: [fn|{rule, message}] } or { fieldName: fn } etc.
    const out = {};
    for (const k in (rules || {})) {
      const r = rules[k];
      out[k] = Array.isArray(r) ? r : [r];
    }
    return out;
  };

  // rule returns: true (ok) | false (generic error) | string (error msg)
  CMSwift.form._runRule = async (rule, value, ctx) => {
    let fn = rule;
    let msg = null;

    if (rule && typeof rule === "object" && typeof rule.rule === "function") {
      fn = rule.rule;
      msg = rule.message || null;
    }

    const res = fn ? fn(value, ctx) : true;
    const v = CMSwift.form._isPromise(res) ? await res : res;

    if (v === true) return null;
    if (typeof v === "string") return v;
    if (v === false) return msg || "Valore non valido";
    return v ? null : (msg || "Valore non valido");
  };

  CMSwift.useForm = (options = {}) => {
    const model = options.model || {};
    const rules = CMSwift.form._normalizeRules(options.rules || {});
    const validateOn = options.validateOn || "submit"; // "input" | "blur" | "submit"
    const initial = options.initial || null;

    // errors: { field: string|null }
    const errors = _.rod({});
    const touched = _.rod({});
    const submitting = _.rod(false);
    const submitError = _.rod(null);

    const getModelObj = () => {
      // allow rod model (model.value)
      if (model && typeof model === "object" && "value" in model) return model.value || {};
      return model;
    };

    const setModelObj = (next) => {
      if (model && typeof model === "object" && "value" in model) model.value = next;
      else {
        // mutate existing
        const obj = model || {};
        for (const k in obj) delete obj[k];
        Object.assign(obj, next);
      }
    };

    const getFieldValue = (name) => {
      const obj = getModelObj();
      return obj ? obj[name] : undefined;
    };

    const setFieldValue = (name, value) => {
      const obj = { ...(getModelObj() || {}) };
      obj[name] = value;
      setModelObj(obj);
    };

    const setError = (name, msg) => {
      const e = { ...(errors.value || {}) };
      if (msg) e[name] = msg;
      else delete e[name];
      errors.value = e;
    };

    const getError = (name) => (errors.value || {})[name] || null;

    const touch = (name) => {
      touched.value = { ...(touched.value || {}), [name]: true };
    };

    const isTouched = (name) => !!(touched.value || {})[name];

    const validateField = async (name) => {
      const list = rules[name] || [];
      if (!list.length) {
        setError(name, null);
        return true;
      }
      const value = getFieldValue(name);
      const ctx = { name, value, model: getModelObj(), form: api };

      for (const rule of list) {
        if (!rule) continue;
        const msg = await CMSwift.form._runRule(rule, value, ctx);
        if (msg) {
          setError(name, msg);
          return false;
        }
      }
      setError(name, null);
      return true;
    };

    const validate = async () => {
      submitError.value = null;
      const names = Object.keys(rules);
      let ok = true;
      for (const n of names) {
        const r = await validateField(n);
        if (!r) ok = false;
      }
      return ok;
    };

    const reset = () => {
      submitError.value = null;
      errors.value = {};
      touched.value = {};
      if (initial) setModelObj({ ...(initial || {}) });
    };

    const submit = async (fn) => {
      submitting.value = true;
      submitError.value = null;
      try {
        const ok = await validate();
        if (!ok) return { ok: false, reason: "validation" };
        const res = await fn?.(getModelObj(), api);
        return { ok: true, result: res };
      } catch (e) {
        console.error("[useForm] submit error:", e);
        submitError.value = (e && e.message) ? e.message : String(e);
        return { ok: false, reason: "exception", error: e };
      } finally {
        submitting.value = false;
      }
    };

    // Field binding factory for UI components
    const field = (name, fieldOpts = {}) => {
      const r = _.rod("");
      // keep rod synced with form model
      // when r changes -> update model
      r.action?.((v) => {
        setFieldValue(name, v)
      });

      const shouldShowError = () => {
        if (validateOn === "submit" || validateOn === "input" || validateOn === "blur") return true;
        return isTouched(name);
      };

      let activeEl = null;
      let blurHandled = false;
      let watchingOutside = false;

      const runBlur = async () => {
        if (blurHandled) return;
        blurHandled = true;
        touch(name);
        if (validateOn === "blur" || validateOn === "input") await validateField(name);
        setTimeout(() => { blurHandled = false; }, 0);
      };

      const onDocPointerDown = (e) => {
        if (!activeEl) return;
        if (activeEl === e.target || (activeEl.contains && activeEl.contains(e.target))) return;
        runBlur();
        activeEl = null;
        if (watchingOutside) {
          watchingOutside = false;
          document.removeEventListener("pointerdown", onDocPointerDown, true);
        }
      };

      const ensureOutsideWatch = () => {
        if (watchingOutside) return;
        watchingOutside = true;
        document.addEventListener("pointerdown", onDocPointerDown, true);
      };

      const onInput = async () => {
        activeEl = document.activeElement;
        blurHandled = false;
        ensureOutsideWatch();
        if (validateOn === "input") await validateField(name);
      };

      const onBlur = async () => {
        await runBlur();
        activeEl = null;
        if (watchingOutside) {
          watchingOutside = false;
          document.removeEventListener("pointerdown", onDocPointerDown, true);
        }
      };
      return {
        name,
        model: r,
        get value() { return r.value; },
        set value(v) { r.value = v; },
        error: () => (shouldShowError() ? getError(name) : null),
        success: fieldOpts.success || null,
        warning: fieldOpts.warning || null,
        note: fieldOpts.note || null,
        touch: () => touch(name),
        validate: () => validateField(name),
        onInput,
        onBlur,
        // allow passing through custom hints
        hint: fieldOpts.hint || null
      };
    };

    const api = {
      model,
      errors,
      touched,
      submitting,
      submitError,

      getValue: getFieldValue,
      setValue: setFieldValue,
      getError,
      setError,

      touch,
      isTouched,

      field,
      validateField,
      validate,
      reset,
      submit
    };

    return api;
  };

  UI.Form = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const form = props.form; // required-ish
    const onSubmit = props.onSubmit; // async (model, form) => ...
    const cls = uiClass(["cms-form", props.class]);

    const p = CMSwift.omit(props, ["form", "onSubmit"]);
    p.class = cls;

    const el = _.form({
      ...p,
      onSubmit: async (e) => {
        e.preventDefault();
        if (!form) return;
        await form.submit(onSubmit || (async () => { }));
      }
    });

    // children can be nodes or function(form)->nodes
    const content = [];
    for (const ch of (children || [])) {
      const v = (typeof ch === "function") ? ch(form) : ch;
      const out = CMSwift.ui.slot(v);
      if (!out) continue;
      if (Array.isArray(out)) content.push(...out);
      else content.push(out);
    }

    content.forEach(n => el.appendChild(n));

    // disable fields/buttons while submitting (optional UX)
    if (form && form.submitting) {
      CMSwift.reactive.effect(() => {
        el.classList.toggle("is-submitting", !!form.submitting.value);
      }, "UI.Form:submitting");
    }

    return el;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Form = {
      signature: "UI.Form({ form, onSubmit, ...props }, ...children)",
      props: {
        form: "useForm() instance",
        onSubmit: "async (model, form) => any",
        class: "string",
        style: "object"
      },
      slots: {
        default: "(form) => Node|Array|Node"
      },
      returns: "HTMLFormElement"
    };
  }

  // ===============================
  // Dialog Service (Modal)
  // ===============================
  app.services = app.services || {};
  app.services.dialog = app.services.dialog || {};
  app.dialog = app.services.dialog;

  let modalRoot = null;

  function ensureModalRoot() {
    if (modalRoot) return modalRoot;

    modalRoot = document.createElement("div");
    modalRoot.setAttribute("data-cms-modal-root", "true");
    document.body.appendChild(modalRoot);
    return modalRoot;
  }

  UI.cardHeader = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const cls = uiClass(["cms-card-header", uiWhen(props.divider, "divider"), props.class]);
    const p = CMSwift.omit(props, ["divider", "align", "justify", "gap", "wrap", "slots"]);
    p.class = cls;

    const style = { ...(props.style || {}) };
    const align = uiStyleValue(props.align);
    if (align != null) style.alignItems = align;
    const justify = uiStyleValue(props.justify);
    if (justify != null) style.justifyContent = justify;
    const wrap = uiStyleValue(props.wrap, (v) => v ? "wrap" : "nowrap");
    if (wrap != null) style.flexWrap = wrap;
    const gap = uiStyleValue(props.gap, toCssSize);
    if (gap != null) style.gap = gap;
    if (Object.keys(style).length) p.style = style;

    return _.div(p, ...renderSlotToArray(slots, "default", {}, children));
  };
  UI.cardBody = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const cls = uiClass(["cms-card-body", props.class]);
    const p = CMSwift.omit(props, ["slots"]);
    p.class = cls;
    return _.div(p, ...renderSlotToArray(slots, "default", {}, children));
  };
  UI.cardFooter = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const cls = uiClass(["cms-card-footer", uiWhen(props.divider, "divider"), props.class]);
    const p = CMSwift.omit(props, ["divider", "align", "justify", "gap", "wrap", "slots"]);
    p.class = cls;

    const style = { ...(props.style || {}) };
    const align = uiStyleValue(props.align);
    if (align != null) style.alignItems = align;
    const justify = uiStyleValue(props.justify);
    if (justify != null) style.justifyContent = justify;
    const wrap = uiStyleValue(props.wrap, (v) => v ? "wrap" : "nowrap");
    if (wrap != null) style.flexWrap = wrap;
    const gap = uiStyleValue(props.gap, toCssSize);
    if (gap != null) style.gap = gap;
    if (Object.keys(style).length) p.style = style;

    return _.div(p, ...renderSlotToArray(slots, "default", {}, children));
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.cardHeader = {
      signature: "UI.cardHeader(...children) | UI.cardHeader(props, ...children)",
      props: {
        divider: "boolean",
        align: `stretch|flex-start|center|flex-end|baseline`,
        justify: `flex-start|center|flex-end|space-between|space-around|space-evenly`,
        wrap: "boolean",
        gap: "string|number",
        slots: "{ default? }",
        class: "string",
        style: "object"
      },
      slots: {
        default: "Card header content"
      },
      returns: "HTMLDivElement",
      description: "Header della card con supporto layout flex."
    };
    UI.meta.cardBody = {
      signature: "UI.cardBody(...children) | UI.cardBody(props, ...children)",
      props: {
        slots: "{ default? }",
        class: "string",
        style: "object"
      },
      slots: {
        default: "Card body content"
      },
      returns: "HTMLDivElement",
      description: "Body della card."
    };
    UI.meta.cardFooter = {
      signature: "UI.cardFooter(...children) | UI.cardFooter(props, ...children)",
      props: {
        divider: "boolean",
        align: `stretch|flex-start|center|flex-end|baseline`,
        justify: `flex-start|center|flex-end|space-between|space-around|space-evenly`,
        wrap: "boolean",
        gap: "string|number",
        slots: "{ default? }",
        class: "string",
        style: "object"
      },
      slots: {
        default: "Card footer content"
      },
      returns: "HTMLDivElement",
      description: "Footer della card con supporto layout flex."
    };
  }

  UI.Dialog = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const stateList = ["primary", "secondary", "warning", "danger", "success", "info", "light", "dark"];
    const sizeList = ["xs", "sm", "md", "lg", "xl", "full"];
    let currentProps = { ...props };
    let entry = null;
    let lastActive = null;
    const resolveRender = (value, ctx) => typeof value === "function" ? value(ctx) : value;
    const splitClasses = (value) => String(value || "").split(/\s+/).filter(Boolean);
    const setTrackedClasses = (target, key, classes) => {
      if (!target) return;
      const prev = target[key] || [];
      if (prev.length) target.classList.remove(...prev);
      const next = (classes || []).filter(Boolean);
      if (next.length) target.classList.add(...next);
      target[key] = next;
    };
    const setStyleValue = (target, name, value, formatter = (v) => v) => {
      if (!target) return;
      if (value == null || value === "") {
        target.style.removeProperty(name);
        return;
      }
      target.style.setProperty(name, formatter(value));
    };
    const getOptions = () => currentProps;
    const getStateClass = (opts) => {
      const value = uiUnwrap(opts.state ?? opts.color);
      if (!value) return "";
      return stateList.includes(value) ? value : String(value);
    };
    const getSizeClass = (opts) => {
      const value = uiUnwrap(opts.size);
      return (typeof value === "string" && sizeList.includes(value)) ? value : "";
    };
    const getAlignClass = (opts) => {
      const raw = String(uiUnwrap(opts.actionsAlign ?? opts.footerAlign ?? opts.alignActions ?? "end")).toLowerCase();
      if (["start", "left"].includes(raw)) return "start";
      if (["center", "middle"].includes(raw)) return "center";
      if (["between", "space-between"].includes(raw)) return "between";
      if (["stretch", "full"].includes(raw)) return "stretch";
      return "end";
    };
    const getVerticalAlignClass = (opts) => {
      const raw = String(uiUnwrap(opts.align ?? opts.verticalAlign ?? opts.position ?? "center")).toLowerCase();
      if (["top", "start", "flex-start"].includes(raw)) return "cms-dialog-align-top";
      if (["bottom", "end", "flex-end"].includes(raw)) return "cms-dialog-align-bottom";
      return "";
    };
    const isClosable = (opts) => {
      const value = opts.closable ?? opts.dismissible ?? opts.closeButton;
      return value !== false;
    };
    const buildContent = () => {
      const opts = getOptions();
      const ctx = {
        close,
        dismiss: close,
        open,
        toggle,
        update,
        isOpen,
        entry: () => entry,
        props: opts
      };
      const iconFallback = opts.icon != null
        ? (typeof opts.icon === "string"
          ? UI.Icon({ name: opts.icon, size: opts.iconSize || "md" })
          : CMSwift.ui.slot(opts.icon, { as: "icon" }))
        : null;
      const eyebrowNodes = renderSlotToArray(slots, "eyebrow", ctx, resolveRender(opts.eyebrow, ctx));
      const titleNodes = renderSlotToArray(slots, "title", ctx, resolveRender(opts.title ?? opts.heading ?? opts.header, ctx));
      const subtitleNodes = renderSlotToArray(slots, "subtitle", ctx, resolveRender(opts.subtitle ?? opts.description, ctx));
      const iconNodes = renderSlotToArray(slots, "icon", ctx, iconFallback);
      const customHeaderNodes = renderSlotToArray(slots, "header", ctx, resolveRender(opts.headerContent ?? opts.head, ctx));
      const closeSlotNodes = isClosable(opts)
        ? renderSlotToArray(slots, "close", ctx, UI.Btn({
          class: "cms-dialog-close",
          size: "sm",
          outline: true,
          "aria-label": opts.closeLabel || "Chiudi dialog",
          "data-dialog-close": true
        }, UI.Icon({ name: opts.closeIcon || "close", size: "sm" })))
        : [];
      const bodyRaw = opts.content ?? opts.body ?? opts.message ?? (children && children.length ? children : null);
      let contentNodes = renderSlotToArray(slots, "content", ctx, resolveRender(bodyRaw, ctx));
      if (!contentNodes.length) contentNodes = renderSlotToArray(slots, "body", ctx, resolveRender(bodyRaw, ctx));
      if (!contentNodes.length) contentNodes = renderSlotToArray(slots, "default", ctx, resolveRender(bodyRaw, ctx));
      const footerRaw = resolveRender(opts.footer ?? opts.actions, ctx);
      let footerNodes = renderSlotToArray(slots, "footer", ctx, footerRaw);
      if (!footerNodes.length) footerNodes = renderSlotToArray(slots, "actions", ctx, footerRaw);

      let headerEl = null;
      if (customHeaderNodes.length) {
        headerEl = _.div({ class: "cms-dialog-head cms-dialog-head-custom" }, ...customHeaderNodes);
      } else if (eyebrowNodes.length || titleNodes.length || subtitleNodes.length || iconNodes.length || closeSlotNodes.length) {
        headerEl = _.div(
          { class: "cms-dialog-head" },
          iconNodes.length ? _.div({ class: "cms-dialog-icon" }, ...iconNodes) : null,
          _.div(
            { class: "cms-dialog-head-main" },
            eyebrowNodes.length ? _.div({ class: "cms-dialog-eyebrow" }, ...eyebrowNodes) : null,
            titleNodes.length ? _.div({ class: "cms-dialog-title" }, ...titleNodes) : null,
            subtitleNodes.length ? _.div({ class: "cms-dialog-subtitle" }, ...subtitleNodes) : null
          ),
          closeSlotNodes.length ? _.div({ class: "cms-dialog-close-wrap" }, ...closeSlotNodes) : null
        );
      }

      const bodyEl = _.div(
        { class: uiClass(["cms-dialog-body", opts.bodyClass]) },
        ...contentNodes
      );
      const footerEl = footerNodes.length
        ? _.div({
          class: uiClass([
            "cms-dialog-actions",
            `is-${getAlignClass(opts)}`,
            uiWhen(opts.stackActions, "is-stacked"),
            opts.actionsClass,
            opts.footerClass
          ])
        }, ...footerNodes)
        : null;

      return _.div({
        class: uiClass([
          "cms-dialog-shell",
          uiWhen(!!headerEl, "has-head"),
          uiWhen(!!footerEl, "has-footer"),
          uiWhen(opts.divider !== false, "with-divider")
        ])
      }, ...[headerEl, bodyEl, footerEl].filter(Boolean));
    };
    const applyEntryOptions = (currentEntry) => {
      if (!currentEntry?.panel) return;
      const opts = getOptions();
      const stateClass = getStateClass(opts);
      const sizeClass = getSizeClass(opts);
      setTrackedClasses(currentEntry.panel, "_dialogClassTokens", [
        "cms-dialog",
        "cms-singularity",
        "cms-clear-set",
        sizeClass ? `cms-dialog-${sizeClass}` : "",
        stateClass,
        stateClass ? `cms-state-${stateClass}` : "",
        uiUnwrap(opts.fullscreen) ? "fullscreen" : "",
        uiUnwrap(opts.scrollable) ? "scrollable" : "",
        uiUnwrap(opts.stickyHeader) ? "sticky-head" : "",
        uiUnwrap(opts.stickyActions) ? "sticky-actions" : "",
        uiUnwrap(opts.borderless) ? "borderless" : "",
        ...splitClasses(opts.class),
        ...splitClasses(opts.panelClass)
      ]);
      setTrackedClasses(currentEntry.overlay, "_dialogOverlayClassTokens", [
        getVerticalAlignClass(opts),
        uiUnwrap(opts.backdropBlur) ? "cms-dialog-overlay-blur" : "",
        ...splitClasses(opts.overlayClass)
      ]);
      setStyleValue(currentEntry.panel, "--cms-dialog-width", uiUnwrap(opts.width), toCssSize);
      setStyleValue(currentEntry.panel, "--cms-dialog-min-width", uiUnwrap(opts.minWidth), toCssSize);
      setStyleValue(currentEntry.panel, "--cms-dialog-max-width", uiUnwrap(opts.maxWidth), toCssSize);
      setStyleValue(currentEntry.panel, "--cms-dialog-max-height", uiUnwrap(opts.maxHeight), toCssSize);
      setStyleValue(currentEntry.panel, "--cms-dialog-body-max-height", uiUnwrap(opts.bodyMaxHeight ?? opts.contentMaxHeight), toCssSize);
      if (opts.style) Object.assign(currentEntry.panel.style, opts.style);
      setPropertyProps(currentEntry.panel, opts);
      currentEntry.panel.setAttribute("role", opts.role || "dialog");
      currentEntry.panel.setAttribute("aria-modal", opts.modal === false ? "false" : "true");
      if (opts.ariaLabel) currentEntry.panel.setAttribute("aria-label", opts.ariaLabel);
      else currentEntry.panel.removeAttribute("aria-label");
    };
    const renderOpenContent = () => {
      if (!entry?.panel) return;
      entry.panel.replaceChildren(buildContent());
    };
    const update = (nextProps = {}) => {
      if (nextProps && typeof nextProps === "object") currentProps = { ...currentProps, ...nextProps };
      if (entry) {
        applyEntryOptions(entry);
        renderOpenContent();
      }
      return api;
    };
    const open = (nextProps = null) => {
      if (nextProps && typeof nextProps === "object") currentProps = { ...currentProps, ...nextProps };
      if (entry) {
        applyEntryOptions(entry);
        renderOpenContent();
        return entry;
      }
      lastActive = document.activeElement;
      const opts = getOptions();
      const persistent = opts.persistent === true;
      entry = CMSwift.overlay.open(() => buildContent(), {
        type: "dialog",
        backdrop: opts.backdrop !== false,
        lockScroll: opts.lockScroll !== false,
        trapFocus: opts.trapFocus !== false,
        autoFocus: opts.autoFocus !== false,
        closeOnOutside: opts.closeOnOutside ?? !persistent,
        closeOnBackdrop: opts.closeOnBackdrop ?? !persistent,
        closeOnEsc: opts.closeOnEsc ?? !persistent,
        className: uiClassStatic(["cms-dialog"]),
        onClose: () => {
          entry?.panel?.removeEventListener("click", onPanelClick);
          entry = null;
          getOptions().onClose?.();
          if (lastActive && typeof lastActive.focus === "function") {
            setTimeout(() => lastActive.focus(), 0);
          }
        }
      });
      const onPanelClick = (e) => {
        const target = e.target;
        if (target && target.closest && target.closest("[data-dialog-close]")) close();
      };
      entry.panel.addEventListener("click", onPanelClick);
      applyEntryOptions(entry);
      overlayEnter(entry);
      getOptions().onOpen?.(entry);
      return entry;
    };

    const close = () => {
      if (!entry) return;
      const toClose = entry;
      overlayLeave(toClose, () => CMSwift.overlay.close(toClose.id));
    };

    const isOpen = () => !!entry;
    const toggle = (nextProps = null) => isOpen() ? (close(), null) : open(nextProps);
    const api = { open, close, toggle, update, isOpen, entry: () => entry, props: () => ({ ...currentProps }) };

    return api;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Dialog = {
      signature: "UI.Dialog(props) | UI.Dialog(props, ...children) -> { open, close, toggle, update, isOpen }",
      props: {
        title: "String|Node|Function|Array|({ close })=>Node",
        subtitle: "String|Node|Function|Array|({ close })=>Node",
        eyebrow: "String|Node|Function|Array|({ close })=>Node",
        icon: "String|Node|Function|Array",
        content: "Node|Function|Array|({ close })=>Node",
        body: "Alias di content",
        actions: "Node|Function|Array|({ close })=>Node",
        footer: "Alias di actions",
        size: "xs|sm|md|lg|xl|full",
        state: "primary|secondary|warning|danger|success|info|light|dark",
        color: "Alias di state",
        width: "string|number",
        minWidth: "string|number",
        maxWidth: "string|number",
        maxHeight: "string|number",
        bodyMaxHeight: "string|number",
        persistent: "boolean",
        closable: "boolean",
        closeButton: "boolean",
        closeIcon: "string",
        align: "top|center|bottom",
        actionsAlign: "start|center|end|between|stretch",
        stickyHeader: "boolean",
        stickyActions: "boolean",
        scrollable: "boolean",
        stackActions: "boolean",
        fullscreen: "boolean",
        backdrop: "boolean",
        backdropBlur: "boolean",
        lockScroll: "boolean",
        trapFocus: "boolean",
        autoFocus: "boolean",
        closeOnOutside: "boolean",
        closeOnBackdrop: "boolean",
        closeOnEsc: "boolean",
        slots: "{ icon?, eyebrow?, title?, subtitle?, header?, content?, body?, footer?, actions?, close?, default? }",
        class: "string",
        panelClass: "string",
        overlayClass: "string",
        style: "object"
      },
      events: {
        onOpen: "(entry)",
        onClose: "void"
      },
      slots: {
        icon: "Dialog icon ({ close })",
        eyebrow: "Eyebrow sopra il titolo ({ close })",
        title: "Dialog title ({ close })",
        subtitle: "Dialog subtitle ({ close })",
        header: "Header personalizzato ({ close })",
        content: "Dialog body ({ close })",
        body: "Alias di content ({ close })",
        footer: "Footer personalizzato ({ close })",
        actions: "Dialog actions ({ close })",
        close: "Close action ({ close })",
        default: "Fallback body content ({ close })"
      },
      description: "Dialog overlay standardizzato con varianti, animazioni, slots strutturati e API imperativa.",
      returns: "Object { open(overrides?), close(), toggle(overrides?), update(props), isOpen(), entry(), props() }"
    };
  }

  UI.TabPanel = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const rawTabs = Array.isArray(props.tabs)
      ? props.tabs
      : (Array.isArray(props.items) ? props.items : []);
    const model = resolveModel(props.model, "UI.TabPanel:model");
    const componentId = props.id || (`cms-tabpanel-` + Math.random().toString(36).slice(2, 9));
    const normalizeOrientation = (value) => String(uiUnwrap(value) || "vertical").toLowerCase() === "horizontal" ? "horizontal" : "vertical";
    const normalizePosition = (value) => String(uiUnwrap(value) || "before").toLowerCase() === "after" ? "after" : "before";
    const normalizeVariant = (value) => {
      const raw = String(uiUnwrap(value) || "").toLowerCase();
      if (raw === "pills" || raw === "pill") return "pills";
      if (raw === "soft" || raw === "card") return "soft";
      return "line";
    };
    const resolveAccent = (value) => {
      const raw = uiUnwrap(value);
      if (raw == null || raw === "") return null;
      return CMSwift.uiColors.includes(raw) ? `var(--cms-${raw})` : String(raw);
    };

    const orientation = normalizeOrientation(props.orientation || props.orient || props.direction);
    const navPosition = normalizePosition(props.navPosition || props.barPosition || props.position);
    const variant = normalizeVariant(props.variant || (props.pills ? "pills" : (props.soft ? "soft" : "line")));
    const wrapTabs = !!props.wrap;
    const swipeable = !!props.swipeable;
    const infinite = !!props.infinite;
    const animated = !!props.animated;
    const navFill = !!(props.navFill ?? props.fill ?? props.stretch);
    const disabledAll = !!props.disabled;

    const transitionDurationRaw = uiUnwrap(props.transitionDuration ?? props["transition-duration"]);
    const transitionDuration = (() => {
      if (transitionDurationRaw == null) return 220;
      if (typeof transitionDurationRaw === "number") return transitionDurationRaw;
      const parsed = parseFloat(transitionDurationRaw);
      return Number.isFinite(parsed) ? parsed : 220;
    })();
    const transitionEasing = uiUnwrap(props.transitionEasing ?? props["transition-easing"]) || "ease";
    const transitionPrev = props.transitionPrev ?? props["transition-prev"] ?? null;
    const transitionNext = props.transitionNext ?? props["transition-next"] ?? null;
    const accentColor = resolveAccent(props.color ?? props.state);

    const tabs = rawTabs.map((tab, index) => {
      if (tab == null) return null;
      if (typeof tab !== "object") {
        return {
          name: tab,
          labelFallback: tab,
          panelFallback: null,
          noteFallback: null,
          iconFallback: null,
          badgeFallback: null,
          hidden: false,
          raw: tab,
          index
        };
      }
      const name = tab.name ?? tab.value ?? tab.id ?? tab.key ?? tab.label ?? tab.title ?? `tab-${index}`;
      const hasLabel = tab.label != null || tab.title != null;
      const labelFallback = hasLabel
        ? (tab.label ?? tab.title)
        : (tab.children != null && tab.content == null && tab.panel == null ? tab.children : (tab.name ?? tab.value ?? `Tab ${index + 1}`));
      const panelFallback = tab.content ?? tab.panel ?? tab.body ?? (hasLabel ? tab.children : null);
      const noteFallback = tab.note ?? tab.subtitle ?? tab.description ?? null;
      const iconFallback = tab.icon ?? null;
      const badgeFallback = Object.prototype.hasOwnProperty.call(tab, "badge")
        ? tab.badge
        : (Object.prototype.hasOwnProperty.call(tab, "counter") ? tab.counter : null);
      return {
        ...tab,
        name,
        labelFallback,
        panelFallback,
        noteFallback,
        iconFallback,
        badgeFallback,
        index
      };
    }).filter(Boolean).filter((tab) => tab.hidden !== true && tab.visible !== false);

    const cls = uiClass([
      "cms-clear-set",
      "cms-tabpanel",
      "cms-singularity",
      orientation,
      `variant-${variant}`,
      uiWhen(wrapTabs, "wrap"),
      uiWhen(animated, "animated"),
      uiWhen(navFill, "nav-fill"),
      uiWhen(disabledAll, "disabled"),
      uiWhen(navPosition === "after", "nav-after"),
      props.class
    ]);
    const wrapProps = CMSwift.omit(props, [
      "tabs", "items", "value", "default", "defaultValue", "model",
      "orientation", "orient", "direction",
      "navPosition", "barPosition", "position",
      "variant", "pills", "soft",
      "navFill", "fill", "stretch",
      "wrap", "swipeable", "infinite", "animated",
      "transitionDuration", "transition-duration",
      "transitionEasing", "transition-easing",
      "transitionPrev", "transition-prev",
      "transitionNext", "transition-next",
      "slots", "empty",
      "tabClass", "tabStyle",
      "panelClass", "panelStyle",
      "navClass", "panelsClass",
      "class", "style"
    ]);
    wrapProps.class = cls;
    wrapProps.style = props.style;
    const wrap = _.div(wrapProps);

    if (animated) {
      wrap.style.setProperty("--cms-tabpanel-duration", `${transitionDuration}ms`);
      wrap.style.setProperty("--cms-tabpanel-easing", transitionEasing);
    }
    if (accentColor) {
      wrap.style.setProperty("--cms-tabpanel-accent", accentColor);
    }

    const nav = _.div({
      class: uiClass(["cms-tabpanel-nav", props.navClass]),
      role: "tablist",
      "aria-orientation": orientation
    });
    const panelsWrap = _.div({ class: uiClass(["cms-tabpanel-panels", props.panelsClass]) });

    const tabButtons = [];
    const panelNodes = [];
    let activeIndex = -1;

    const isHorizontal = () => orientation === "horizontal";
    const createCtx = (tab, index, active) => ({
      tab,
      name: tab.name,
      index,
      active,
      value: tab.name,
      select: () => setActiveByIndex(index),
      next: () => goNext(),
      prev: () => goPrev()
    });

    const findEnabledIndex = (start, step, allowWrap = false) => {
      if (!tabs.length) return -1;
      let idx = start;
      for (let i = 0; i < tabs.length; i += 1) {
        idx += step;
        if (idx >= tabs.length) {
          if (!allowWrap) return -1;
          idx = 0;
        } else if (idx < 0) {
          if (!allowWrap) return -1;
          idx = tabs.length - 1;
        }
        if (!tabs[idx]?.disabled) return idx;
      }
      return -1;
    };

    const focusIndex = (index) => {
      const btn = tabButtons[index]?.btn;
      if (!btn || typeof btn.focus !== "function") return;
      requestAnimationFrame(() => btn.focus());
    };

    const makeLabelNodes = (tab, index, isActive) => {
      const ctx = createCtx(tab, index, isActive);
      const labelNode = CMSwift.ui.renderSlot(slots, "label", ctx, tab.labelFallback);
      return renderSlotToArray(null, "default", {}, labelNode);
    };

    const makeTabNode = (tab, index) => {
      const isActive = index === activeIndex;
      const tabId = `${componentId}-tab-${index}`;
      const panelId = `${componentId}-panel-${index}`;
      const ctx = createCtx(tab, index, isActive);
      const labelNodes = makeLabelNodes(tab, index, isActive);
      const iconFallback = tab.iconFallback != null
        ? (typeof tab.iconFallback === "string"
          ? UI.Icon({ name: tab.iconFallback, size: tab.iconSize ?? tab.size ?? props.size ?? null })
          : tab.iconFallback)
        : null;
      const iconNodes = renderSlotToArray(slots, "icon", ctx, iconFallback);
      const noteNodes = renderSlotToArray(slots, "note", ctx, tab.noteFallback);
      const badgeNodes = renderSlotToArray(slots, "badge", ctx, tab.badgeFallback);
      const fallbackTabContent = _.span({ class: "cms-tabpanel-tab-inner" },
        iconNodes.length ? _.span({ class: "cms-tabpanel-tab-icon" }, ...iconNodes) : null,
        _.span({ class: "cms-tabpanel-tab-copy" },
          _.span({ class: "cms-tabpanel-tab-label" }, ...(labelNodes.length ? labelNodes : [""])),
          noteNodes.length ? _.span({ class: "cms-tabpanel-tab-note" }, ...noteNodes) : null
        ),
        badgeNodes.length ? _.span({ class: "cms-tabpanel-tab-badge" }, ...badgeNodes) : null
      );
      const contentNodes = renderSlotToArray(slots, "tab", {
        ...ctx,
        label: labelNodes,
        icon: iconNodes,
        note: noteNodes,
        badge: badgeNodes,
        tabId,
        panelId
      }, fallbackTabContent);
      const onKeydown = (e) => {
        if (disabledAll || tab.disabled) return;
        const key = e.key;
        if (key === "Enter" || key === " ") {
          e.preventDefault();
          setActiveByIndex(index);
          return;
        }
        if (key === "Home") {
          e.preventDefault();
          const first = tabs.findIndex((item) => !item.disabled);
          if (first >= 0) {
            setActiveByIndex(first);
            focusIndex(first);
          }
          return;
        }
        if (key === "End") {
          e.preventDefault();
          const last = (() => {
            for (let i = tabs.length - 1; i >= 0; i -= 1) {
              if (!tabs[i]?.disabled) return i;
            }
            return -1;
          })();
          if (last >= 0) {
            setActiveByIndex(last);
            focusIndex(last);
          }
          return;
        }
        const prevKeys = isHorizontal() ? ["ArrowLeft"] : ["ArrowUp"];
        const nextKeys = isHorizontal() ? ["ArrowRight"] : ["ArrowDown"];
        if (prevKeys.includes(key)) {
          e.preventDefault();
          const prev = findEnabledIndex(index, -1, infinite);
          if (prev >= 0) {
            setActiveByIndex(prev, { dir: "prev" });
            focusIndex(prev);
          }
          return;
        }
        if (nextKeys.includes(key)) {
          e.preventDefault();
          const next = findEnabledIndex(index, 1, infinite);
          if (next >= 0) {
            setActiveByIndex(next, { dir: "next" });
            focusIndex(next);
          }
        }
      };
      const defaultBtn = UI.Btn({
        class: uiClass([
          "cms-tabpanel-tab",
          uiWhen(isActive, "active"),
          uiWhen(tab.disabled || disabledAll, "disabled"),
          props.tabClass,
          tab.tabClass || tab.class
        ]),
        type: "button",
        id: tabId,
        role: "tab",
        disabled: !!(tab.disabled || disabledAll),
        "aria-selected": isActive ? "true" : "false",
        "aria-controls": panelId,
        tabindex: isActive ? "0" : "-1",
        outline: variant === "pills" && !isActive,
        color: variant === "pills" && isActive ? (tab.color || props.color || props.state || "primary") : null,
        size: tab.size ?? props.size ?? null,
        style: {
          ...(props.tabStyle || {}),
          ...(tab.tabStyle || {})
        },
        onClick: () => {
          if (tab.disabled || disabledAll) return;
          setActiveByIndex(index);
        },
        onKeydown
      }, ...contentNodes);
      const navBtn = _.div({
        class: uiClass([
          "cms-tabpanel-nav-btn",
          uiWhen(isActive, "active"),
          tab.navClass
        ]),
        "data-name": tab.name
      }, defaultBtn, _.span({ class: "tab-indicator" }));
      tabButtons[index] = { btn: defaultBtn, wrap: navBtn, index };
      return navBtn;
    };

    const makePanelNode = (tab, index) => {
      const isActive = index === activeIndex;
      const tabId = `${componentId}-tab-${index}`;
      const panelId = `${componentId}-panel-${index}`;
      const ctx = createCtx(tab, index, isActive);
      const panelNode = CMSwift.ui.renderSlot(slots, "panel", ctx, tab.panelFallback);
      const panel = _.div({
        class: uiClass([
          "cms-tabpanel-panel",
          uiWhen(isActive, "active"),
          props.panelClass,
          tab.panelClass
        ]),
        style: {
          ...(props.panelStyle || {}),
          ...(tab.panelStyle || {})
        },
        "data-name": tab.name,
        role: "tabpanel",
        id: panelId,
        tabindex: 0,
        "aria-labelledby": tabId,
        "aria-hidden": isActive ? "false" : "true"
      }, ...renderSlotToArray(null, "default", {}, panelNode));
      panelNodes[index] = panel;
      return panel;
    };

    const defaultNavNodes = tabs.map((tab, index) => makeTabNode(tab, index));
    const navContent = CMSwift.ui.renderSlot(slots, "nav", {
      tabs,
      active: () => (activeIndex >= 0 ? tabs[activeIndex]?.name : null),
      activeIndex: () => activeIndex,
      activeTab: () => (activeIndex >= 0 ? tabs[activeIndex] : null),
      select: (nameOrIndex) => {
        if (typeof nameOrIndex === "number") setActiveByIndex(nameOrIndex);
        else setActiveByValue(nameOrIndex);
      },
      next: () => goNext(),
      prev: () => goPrev(),
      nodes: defaultNavNodes,
      orientation,
      position: navPosition,
      variant
    }, defaultNavNodes);

    renderSlotToArray(null, "default", {}, navContent).forEach(n => nav.appendChild(n));
    if (tabs.length) {
      tabs.forEach((tab, index) => panelsWrap.appendChild(makePanelNode(tab, index)));
    } else {
      const emptyNodes = renderSlotToArray(slots, "empty", { tabs }, props.empty ?? _.div({ class: "cms-tabpanel-empty" }, "Nessun contenuto disponibile."));
      emptyNodes.forEach((node) => panelsWrap.appendChild(node));
    }

    const setDirectionVars = (dir) => {
      if (!animated) return;
      const enter = dir === "next" ? "18px" : "-18px";
      const leave = dir === "next" ? "-18px" : "18px";
      wrap.style.setProperty("--cms-tabpanel-enter", enter);
      wrap.style.setProperty("--cms-tabpanel-leave", leave);
    };

    const cleanCustomTransitions = () => {
      const classes = [];
      if (transitionPrev) classes.push(...String(transitionPrev).split(/\s+/));
      if (transitionNext) classes.push(...String(transitionNext).split(/\s+/));
      if (classes.length) panelsWrap.classList.remove(...classes.filter(Boolean));
    };

    const applyCustomTransition = (dir) => {
      cleanCustomTransitions();
      const cls = dir === "prev" ? transitionPrev : transitionNext;
      if (!cls) return;
      const parts = String(cls).split(/\s+/).filter(Boolean);
      if (!parts.length) return;
      panelsWrap.classList.add(...parts);
      setTimeout(() => panelsWrap.classList.remove(...parts), transitionDuration + 40);
    };

    const updateNavButtons = (nextIndex) => {
      const active = tabButtons.find(({ btn }) => btn.classList.contains("active"));
      const rectPrev = active?.btn.parentNode?.getBoundingClientRect();
      tabButtons.forEach(({ btn, index }) => {
        const isActive = index === nextIndex;
        const parent = btn.parentNode;
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        if (parent.isConnected && rectPrev) {
          parent.style.setProperty("--nav-pos-x", (rectPrev.left - rect.left) + "px");
          parent.style.setProperty("--nav-pos-y", (rectPrev.top - rect.top) + "px");
        }
        parent.classList.toggle("active", isActive);
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-selected", isActive ? "true" : "false");
        btn.setAttribute("tabindex", isActive ? "0" : "-1");
      });
    };

    const updatePanels = (prevIndex, nextIndex, dir) => {
      setDirectionVars(dir);
      panelNodes.forEach((panel, index) => {
        if (!panel) return;
        const isNext = index === nextIndex;
        const isPrev = index === prevIndex;
        if (isNext) {
          panel.classList.add("active");
          panel.classList.remove("leaving");
          panel.setAttribute("aria-hidden", "false");
        } else {
          panel.classList.remove("active");
          panel.setAttribute("aria-hidden", "true");
          if (animated && isPrev) {
            panel.classList.add("leaving");
            setTimeout(() => panel.classList.remove("leaving"), transitionDuration + 40);
          } else {
            panel.classList.remove("leaving");
          }
        }
      });
    };

    const computeDir = (prevIndex, nextIndex) => {
      if (prevIndex < 0 || prevIndex === nextIndex) return "next";
      if (infinite && prevIndex === tabs.length - 1 && nextIndex === 0) return "next";
      if (infinite && prevIndex === 0 && nextIndex === tabs.length - 1) return "prev";
      return nextIndex > prevIndex ? "next" : "prev";
    };

    const setActiveByIndex = (nextIndex, opts = {}) => {
      if (nextIndex == null || nextIndex < 0 || nextIndex >= tabs.length) return;
      if (tabs[nextIndex]?.disabled) return;
      const prevIndex = activeIndex;
      if (prevIndex === nextIndex) return;
      activeIndex = nextIndex;
      const nextTab = tabs[nextIndex];
      const dir = opts.dir || computeDir(prevIndex, nextIndex);
      if (model && !opts.fromModel) model.set(nextTab.name);
      updateNavButtons(nextIndex);
      updatePanels(prevIndex, nextIndex, dir);
      applyCustomTransition(dir);
      wrap.dataset.active = String(nextTab.name);
      props.onChange?.(nextTab.name, nextTab, nextIndex);
    };

    const setActiveByValue = (value, opts = {}) => {
      if (!tabs.length) return;
      const idx = tabs.findIndex(t => t.name == value);
      if (idx === -1) return;
      setActiveByIndex(idx, opts);
    };

    const goNext = () => {
      if (!tabs.length) return;
      const nextIndex = activeIndex < 0
        ? tabs.findIndex((tab) => !tab.disabled)
        : findEnabledIndex(activeIndex, 1, infinite);
      if (nextIndex < 0) return;
      setActiveByIndex(nextIndex, { dir: "next" });
    };

    const goPrev = () => {
      if (!tabs.length) return;
      const nextIndex = activeIndex < 0
        ? (() => {
          for (let i = tabs.length - 1; i >= 0; i -= 1) {
            if (!tabs[i]?.disabled) return i;
          }
          return -1;
        })()
        : findEnabledIndex(activeIndex, -1, infinite);
      if (nextIndex < 0) return;
      setActiveByIndex(nextIndex, { dir: "prev" });
    };

    if (swipeable) {
      let startX = 0;
      let startY = 0;
      let tracking = false;
      const threshold = 42;
      panelsWrap.addEventListener("pointerdown", (e) => {
        if (e.button != null && e.button !== 0) return;
        tracking = true;
        startX = e.clientX;
        startY = e.clientY;
      });
      panelsWrap.addEventListener("pointerup", (e) => {
        if (!tracking) return;
        tracking = false;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy)) return;
        if (dx < 0) goNext();
        else goPrev();
      });
      panelsWrap.addEventListener("pointercancel", () => { tracking = false; });
      panelsWrap.addEventListener("pointerleave", () => { tracking = false; });
    }

    const initialValue = model ? model.get() : (props.value ?? props.defaultValue ?? props.default ?? null);
    if (tabs.length) {
      const initialIndex = tabs.findIndex(t => t.name == initialValue);
      if (initialIndex >= 0) {
        setActiveByIndex(initialIndex, { fromModel: true });
      } else {
        const firstEnabled = tabs.findIndex((tab) => !tab.disabled);
        if (firstEnabled >= 0) {
          setActiveByIndex(firstEnabled, { fromModel: true });
          if (model) model.set(tabs[firstEnabled].name);
        }
      }
    }

    if (model) {
      model.watch((v) => setActiveByValue(v, { fromModel: true }), "UI.TabPanel:watch");
    }

    if (navPosition === "after") {
      wrap.appendChild(panelsWrap);
      wrap.appendChild(nav);
    } else {
      wrap.appendChild(nav);
      wrap.appendChild(panelsWrap);
    }

    const extra = renderSlotToArray(slots, "default", {}, children);
    extra.forEach((n) => wrap.appendChild(n));
    setPropertyProps(wrap, props);
    wrap._tabs = () => tabs.slice();
    wrap._active = () => (activeIndex >= 0 ? tabs[activeIndex] : null);
    wrap._getValue = () => (activeIndex >= 0 ? tabs[activeIndex]?.name : null);
    wrap._setValue = (value) => setActiveByValue(value);
    wrap._select = (value) => {
      if (typeof value === "number") setActiveByIndex(value);
      else setActiveByValue(value);
    };
    wrap._next = goNext;
    wrap._prev = goPrev;
    return wrap;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.TabPanel = {
      signature: "UI.TabPanel(props) | UI.TabPanel(props, ...children)",
      props: {
        tabs: {
          type: "Array<{ name?, value?, label?, title?, note?, subtitle?, icon?, badge?, content?, panel?, body?, children?, disabled?, hidden?, tabClass?, panelClass? }>",
          description: "Definizione dei tab. Supporta alias multipli per label e contenuto.",
          category: "data"
        },
        items: {
          type: "Array",
          description: "Alias di `tabs`.",
          category: "data"
        },
        value: {
          type: "any",
          description: "Valore iniziale o controllato del tab attivo.",
          category: "data"
        },
        defaultValue: {
          type: "any",
          description: "Alias esplicito per il tab iniziale quando non usi `model`.",
          category: "data"
        },
        model: {
          type: "[get,set] signal",
          description: "Binding reattivo del tab attivo.",
          category: "data"
        },
        orientation: {
          type: "vertical|horizontal",
          description: "Orientamento della navigazione.",
          values: ["vertical", "horizontal"],
          default: "vertical",
          category: "layout"
        },
        navPosition: {
          type: "before|after",
          description: "Posizione della barra tab rispetto ai pannelli.",
          values: ["before", "after"],
          default: "before",
          category: "layout"
        },
        variant: {
          type: "line|pills|soft",
          description: "Stile visivo della navigazione tab.",
          values: ["line", "pills", "soft"],
          default: "line",
          category: "style"
        },
        wrap: {
          type: "boolean",
          description: "Permette al nav di andare a capo quando lo spazio non basta.",
          default: false,
          category: "layout"
        },
        navFill: {
          type: "boolean",
          description: "Distribuisce i tab sulla larghezza disponibile.",
          default: false,
          category: "layout"
        },
        swipeable: {
          type: "boolean",
          description: "Abilita swipe sui pannelli.",
          default: false,
          category: "behavior"
        },
        infinite: {
          type: "boolean",
          description: "Quando attivo, next/prev cicla dal primo all'ultimo tab.",
          default: false,
          category: "behavior"
        },
        animated: {
          type: "boolean",
          description: "Abilita la transizione fra pannelli.",
          default: false,
          category: "behavior"
        },
        transitionDuration: {
          type: "number",
          description: "Durata animazione in millisecondi.",
          default: 220,
          category: "behavior"
        },
        transitionEasing: {
          type: "string",
          description: "Timing function CSS dell'animazione.",
          default: "ease",
          category: "behavior"
        },
        transitionPrev: {
          type: "string",
          description: "Classi custom applicate durante la transizione verso il tab precedente.",
          category: "behavior"
        },
        transitionNext: {
          type: "string",
          description: "Classi custom applicate durante la transizione verso il tab successivo.",
          category: "behavior"
        },
        tabClass: {
          type: "string",
          description: "Classi aggiuntive per tutti i bottoni tab.",
          category: "style"
        },
        tabStyle: {
          type: "object",
          description: "Style inline applicato a tutti i bottoni tab.",
          category: "style"
        },
        navClass: {
          type: "string",
          description: "Classi aggiuntive per il wrapper della nav.",
          category: "style"
        },
        panelsClass: {
          type: "string",
          description: "Classi aggiuntive per il wrapper dei pannelli.",
          category: "style"
        },
        panelClass: {
          type: "string",
          description: "Classi aggiuntive comuni per ogni pannello.",
          category: "style"
        },
        panelStyle: {
          type: "object",
          description: "Style inline comune per ogni pannello.",
          category: "style"
        },
        empty: {
          type: "Node|Function|Array",
          description: "Fallback visuale quando `tabs` e `items` sono vuoti.",
          category: "state"
        },
        disabled: {
          type: "boolean",
          description: "Disabilita l'intero componente.",
          default: false,
          category: "state"
        },
        slots: {
          type: "{ nav?, tab?, label?, icon?, note?, badge?, panel?, empty?, default? }",
          description: "Slot strutturati per personalizzare nav, label, badge e contenuto.",
          category: "general"
        }
      },
      slots: {
        nav: {
          type: "Function|Node|Array",
          description: "Renderer completo della navigazione. Riceve `tabs`, `active()`, `activeTab()`, `select()`, `next()`, `prev()`, `nodes`, `orientation`, `position`, `variant`."
        },
        tab: {
          type: "Function|Node|Array",
          description: "Contenuto interno del bottone tab. Riceve `tab`, `name`, `index`, `active`, `label`, `icon`, `note`, `badge`, `select()`."
        },
        label: {
          type: "Function|Node|Array",
          description: "Label del tab."
        },
        icon: {
          type: "Function|Node|Array",
          description: "Icona del tab."
        },
        note: {
          type: "Function|Node|Array",
          description: "Nota, subtitle o descrizione breve sotto la label."
        },
        badge: {
          type: "Function|Node|Array",
          description: "Badge o counter allineato a destra del tab."
        },
        panel: {
          type: "Function|Node|Array",
          description: "Renderer del pannello attivo/inattivo. Riceve `tab`, `name`, `index`, `active`, `select()`, `next()`, `prev()`."
        },
        empty: {
          type: "Function|Node|Array",
          description: "Fallback quando non ci sono tab."
        },
        default: {
          type: "Node|Array|Function",
          description: "Contenuto extra appendato dopo il componente."
        }
      },
      events: {
        onChange: "(name, tab, index)"
      },
      returns: "HTMLDivElement con API `_getValue()`, `_setValue(value)`, `_select(value)`, `_next()`, `_prev()`, `_active()`, `_tabs()`",
      description: "Tab panel standardizzato con nav accessibile, slot strutturati, model reattivo, swipe e animazioni."
    };
  }

  function closeBackdrop(backdrop) {
    if (backdrop && backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
  }

  function renderDialog({ title, message, contentNode, okText, cancelText, showCancel, onOk, onCancel, persistent }) {
    ensureModalRoot();

    const backdrop = _.div({
      class: "cms-dialog-backdrop", onClick: (e) => {
        if (e.target === backdrop && persistent !== true) onCancel?.();
      }
    });

    const titleNodes = renderSlotToArray(null, "default", {}, title);
    const messageNodes = renderSlotToArray(null, "default", {}, message);
    const contentNodes = renderSlotToArray(null, "default", {}, contentNode);

    const dialog = _.div({ class: "cms-dialog cms-panel" },
      titleNodes.length ? _.h3(...titleNodes) : null,
      messageNodes.length ? _.p(...messageNodes) : null,
      ...contentNodes,
      _.div({ class: "cms-dialog-actions" },
        showCancel ? CMSwift.ui.Btn({ onClick: onCancel }, cancelText || "Annulla") : null,
        CMSwift.ui.Btn({ color: "primary", onClick: onOk }, okText || "OK")
      )
    );

    backdrop.appendChild(dialog);
    ensureModalRoot().appendChild(backdrop);

    // escape to close
    const onKey = (e) => {
      if (e.key === "Escape") onCancel?.();
    };
    document.addEventListener("keydown", onKey, { once: true });

    return { backdrop, close: () => closeBackdrop(backdrop) };
  }

  app.dialog.alert = function (message, opts = {}) {
    return new Promise((resolve) => {
      const { backdrop, close } = renderDialog({
        title: opts.title || "Info",
        message,
        okText: opts.okText || "OK",
        showCancel: false,
        persistent: opts.persistent,
        onOk: () => { close(); resolve(true); },
        onCancel: () => { close(); resolve(true); }
      });
    });
  };

  app.dialog.confirm = function (opts = {}) {
    return new Promise((resolve) => {
      const { close } = renderDialog({
        title: opts.title || "Conferma",
        message: opts.message || "",
        okText: opts.okText || "Conferma",
        cancelText: opts.cancelText || "Annulla",
        showCancel: true,
        persistent: opts.persistent,
        onOk: () => { close(); resolve(true); },
        onCancel: () => { close(); resolve(false); }
      });
    });
  };

  app.dialog.prompt = function (opts = {}) {
    return new Promise((resolve) => {
      const input = CMSwift.ui.Input({
        class: "cms-dialog-input",
        type: opts.type || "text",
        placeholder: opts.placeholder || ""
      });

      // default value
      if (opts.value != null) input.value = String(opts.value);

      const { close } = renderDialog({
        title: opts.title || "Inserisci valore",
        message: opts.message || "",
        okText: opts.okText || "OK",
        cancelText: opts.cancelText || "Annulla",
        showCancel: true,
        contentNode: _.div(input),
        persistent: opts.persistent,
        onOk: () => { const v = input.value; close(); resolve(v); },
        onCancel: () => { close(); resolve(null); }
      });

      // focus
      setTimeout(() => input.focus(), 0);
    });
  };

  // ===============================
  // Loading Service
  // ===============================

  app.services = app.services || {};
  app.services.loading = app.services.loading || {};
  app.loading = app.services.loading;

  let overlay = null;
  let countLoading = 0;

  function ensureOverlay() {
    if (overlay) return overlay;

    overlay = document.createElement("div");
    overlay.className = "cms-loading-backdrop";
    overlay.style.cssText = `
position: fixed; inset: 0;
background: rgba(0,0,0,0.45);
display: none;
align-items: center; justify-content: center;
z-index: 10001;
padding: 14px;
`;
    const box = document.createElement("div");
    box.className = "cms-panel cms-loading-card";
    box.style.cssText = `
padding: 14px 16px;
border-radius: var(--cms-r-lg);
min-width: 260px;
display:flex; gap: 12px; align-items:center;
flex-direction: column;
`;

    const spinner = document.createElement("div");
    spinner.className = "cms-loading-spinner";
    spinner.style.cssText = `
width: 18px; height: 18px;
border-radius: 50%;
border: 2px solid rgba(255,255,255,0.25);
border-top-color: var(--cms-primary);
animation: cmsSpin 0.9s linear infinite;
`;

    const text = document.createElement("div");
    text.className = "cms-muted cms-loading-text";
    text.textContent = "Loading...";

    const progressWrap = document.createElement("div");
    progressWrap.className = "cms-loading-progress";
    progressWrap.style.cssText = `
width: 100%;
height: 6px;
border-radius: 999px;
overflow: hidden;
background: rgba(255,255,255,0.08);
display: none;
`;
    const progressBar = document.createElement("div");
    progressBar.className = "cms-loading-progress-bar";
    progressBar.style.cssText = `
height: 100%;
width: 0%;
background: var(--cms-primary);
transition: width 200ms ease;
`;
    progressWrap.appendChild(progressBar);

    const row = document.createElement("div");
    row.style.cssText = "display:flex; gap: 12px; align-items:center; width: 100%;";
    row.appendChild(spinner);
    row.appendChild(text);

    box.appendChild(row);
    box.appendChild(progressWrap);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const style = document.createElement("style");
    style.textContent = `
@keyframes cmsSpin { to { transform: rotate(360deg); } }
`;
    document.head.appendChild(style);

    overlay._textNode = text;
    overlay._spinner = spinner;
    overlay._progressWrap = progressWrap;
    overlay._progressBar = progressBar;
    overlay._progressActive = false;
    return overlay;
  }

  function normalizeLoadingOptions(message, opts) {
    if (typeof message === "object" && message !== null) return { ...message };
    const base = (opts && typeof opts === "object") ? opts : {};
    if (typeof opts === "string" && (message == null || typeof message === "number")) {
      return { ...base, message: opts };
    }
    return { ...base, message: message };
  }

  function setLoadingMode(ov, mode) {
    const showProgress = mode === "progress";
    ov._spinner.style.display = showProgress ? "none" : "";
    ov._progressWrap.style.display = showProgress ? "block" : "none";
    ov._mode = mode;
  }

  app.loading.show = function (message = "Loading...", opts = {}) {
    const ov = ensureOverlay();
    const o = normalizeLoadingOptions(message, opts);
    countLoading++;
    ov._progressActive = false;
    ov._textNode.textContent = o.message || "Loading...";
    setLoadingMode(ov, "spinner");
    if (o.spinner === false) ov._spinner.style.display = "none";
    ov.style.display = "flex";
  };

  app.loading.hide = function () {
    if (!overlay) return;
    countLoading = Math.max(0, countLoading - 1);
    if (countLoading === 0) {
      overlay.style.display = "none";
      overlay._progressActive = false;
    }
  };

  app.loading.progress = function (value = 0, opts = {}) {
    const ov = ensureOverlay();
    if (typeof value === "object" && value !== null) {
      opts = value;
      value = value.value ?? 0;
    }
    const o = normalizeLoadingOptions(null, opts);
    if (!ov._progressActive) {
      countLoading++;
      ov._progressActive = true;
    }
    const v = Math.max(0, Math.min(100, Number(value ?? 0)));
    ov._textNode.textContent = o.message || "Loading...";
    ov._progressBar.style.width = v + "%";
    setLoadingMode(ov, "progress");
    ov.style.display = "flex";
  };

  // helper: wrapper async
  app.loading.wrap = async function (message, fn) {
    app.loading.show(message);
    try { return await fn(); }
    finally { app.loading.hide(); }
  };

  // ===============================
  // UI.Table
  // ===============================
  function toValue(rows) {
    if (typeof rows === "function") return rows();
    return rows || [];
  }

  function tableGetByPath(obj, path) {
    if (obj == null || path == null) return undefined;
    if (typeof path !== "string" || path.indexOf(".") < 0) return obj?.[path];
    return path.split(".").reduce((acc, key) => acc == null ? acc : acc[key], obj);
  }

  function defaultCompare(a, b) {
    if (a == null && b == null) return 0;
    if (a == null) return -1;
    if (b == null) return 1;
    if (typeof a === "number" && typeof b === "number") return a - b;
    return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
  }

  function tableToArray(value) {
    const rows = toValue(value);
    return Array.isArray(rows) ? rows : [];
  }

  function tableColumnLabel(col) {
    return col?.label ?? col?.title ?? col?.header ?? col?.key ?? "";
  }

  function tableColumnSortKey(col, index) {
    return col?.sortKey ?? col?.key ?? `__col_${index}`;
  }

  function tableFindColumn(columns, key) {
    return columns.find((col, index) => tableColumnSortKey(col, index) === key || col?.key === key) || null;
  }

  function tableResolveValue(col, row, rowIndex) {
    if (!col) return row;
    if (typeof col.get === "function") return col.get(row, { row, rowIndex, col });
    if (typeof col.value === "function") return col.value(row, { row, rowIndex, col });
    if (typeof col.key === "string") return tableGetByPath(row, col.key);
    return col.key != null ? row?.[col.key] : row;
  }

  function tableResolveStyle(style, ctx) {
    if (typeof style === "function") return style(ctx) || {};
    return style || {};
  }

  function tableTextValue(value) {
    if (value == null) return "";
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
    if (Array.isArray(value)) return value.map(tableTextValue).filter(Boolean).join(" ");
    if (typeof Node !== "undefined" && value instanceof Node) return value.textContent || "";
    if (typeof value === "object") {
      if (typeof value.textContent === "string") return value.textContent;
      try {
        return JSON.stringify(value);
      } catch {
        return "";
      }
    }
    return String(value);
  }

  function tableNormalizePageSizes(options, fallback) {
    const list = Array.isArray(options) ? options : fallback;
    const normalized = list
      .map((item) => Number(item))
      .filter((item) => Number.isFinite(item) && item > 0);
    return normalized.length ? Array.from(new Set(normalized)) : fallback;
  }

  function tableMatchesQuery(row, columns, query, props) {
    const predicate = props.searchBy || props.searchPredicate;
    if (typeof predicate === "function") return !!predicate(row, { query, columns });

    const terms = String(query || "")
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
    if (!terms.length) return true;

    const searchKeys = Array.isArray(props.searchKeys) && props.searchKeys.length
      ? props.searchKeys
      : columns.filter((col) => col?.searchable !== false).map((col) => col?.searchKey ?? col?.key).filter(Boolean);

    const tokens = [];
    if (searchKeys.length) {
      for (const key of searchKeys) {
        if (typeof key === "function") tokens.push(tableTextValue(key(row)));
        else {
          const col = columns.find((item) => item?.key === key || item?.searchKey === key);
          tokens.push(tableTextValue(col ? tableResolveValue(col, row, -1) : tableGetByPath(row, key)));
        }
      }
    } else {
      tokens.push(tableTextValue(row));
    }

    const haystack = tokens.join(" ").toLowerCase();
    return terms.every((term) => haystack.includes(term));
  }

  UI.Table = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const columns = Array.isArray(props.columns) ? props.columns : [];
    const basePageSizes = tableNormalizePageSizes(props.pageSizeOptions, [5, 10, 20, 50]);
    const initialPageSize = Number(props.pageSize ?? basePageSizes[0] ?? 10) || 10;
    const pageSizes = Array.from(new Set([...basePageSizes, initialPageSize])).sort((a, b) => a - b);
    const initialSort = props.initialSort || (props.sortBy ? { key: props.sortBy, dir: props.sortDir === "desc" ? "desc" : "asc" } : null);
    const searchable = props.searchable === true
      || typeof props.searchable === "string"
      || props.searchPlaceholder != null
      || props.search != null
      || props.query != null
      || !!props.searchModel
      || !!props.queryModel
      || Array.isArray(props.searchKeys)
      || typeof props.searchBy === "function"
      || typeof props.searchPredicate === "function";
    const searchModel = resolveModel(props.searchModel || props.queryModel, "UI.Table:query");

    const [getPage, setPage] = app.reactive.signal(Math.max(1, Number(props.page || 1) || 1));
    const [getPageSize, setPageSizeState] = app.reactive.signal(initialPageSize);
    const [getSort, setSort] = app.reactive.signal(initialSort);
    const [getQuery, setQueryState] = app.reactive.signal(String((searchModel ? searchModel.get() : (props.search ?? props.query)) ?? ""));

    const setQuery = (value) => {
      const next = String(value ?? "");
      setQueryState(next);
      if (searchModel) searchModel.set(next);
      setPage(1);
    };
    const setPageSize = (value) => {
      const next = Number(value) || initialPageSize;
      setPageSizeState(next);
      setPage(1);
    };
    const toggleSort = (col, index) => {
      const nextKey = tableColumnSortKey(col, index);
      const current = getSort();
      if (!current || (current.key !== nextKey && current.key !== col?.key)) setSort({ key: nextKey, dir: "asc" });
      else if (current.dir === "asc") setSort({ key: nextKey, dir: "desc" });
      else setSort(null);
      setPage(1);
    };

    let searchInput = null;
    if (searchModel) {
      searchModel.watch((value) => {
        const next = String(value ?? "");
        setQueryState(next);
        if (searchInput && searchInput.value !== next) searchInput.value = next;
        setPage(1);
      }, "UI.Table:queryWatch");
    }

    const wrapProps = CMSwift.omit(props, [
      "columns", "rows", "rowKey", "loading", "page", "pageSize", "pageSizeOptions", "pagination",
      "initialSort", "sortBy", "sortDir", "search", "query", "searchable", "searchPlaceholder",
      "searchKeys", "searchBy", "searchPredicate", "searchModel", "queryModel", "filter",
      "actions", "actionsLabel", "emptyText", "loadingText", "onRowClick", "onRowDblClick",
      "tableClass", "tableStyle", "cardClass", "dense", "striped", "hover", "stickyHeader",
      "toolbar", "toolbarStart", "toolbarEnd", "caption", "footer", "status", "rowClass", "rowAttrs",
      "minTableWidth", "hideHeader", "hideFooter", "slots", "body"
    ]);
    wrapProps.class = uiClass(["cms-table-card", props.class, props.cardClass]);
    if (props.dense != null) wrapProps.dense = props.dense;

    const shell = _.div({ class: "cms-table-shell" });
    const leadNodes = renderSlotToArray(slots, "default", {}, children);
    if (leadNodes.length) shell.appendChild(_.div({ class: "cms-table-lead" }, ...leadNodes));

    const toolbarStartNodes = renderSlotToArray(slots, "toolbarStart", {}, props.toolbarStart);
    const toolbarNodes = renderSlotToArray(slots, "toolbar", {}, props.toolbar);
    const toolbarEndNodes = renderSlotToArray(slots, "toolbarEnd", {}, props.toolbarEnd);

    const toolbar = _.div({ class: "cms-table-toolbar" });
    const toolbarMain = _.div({ class: "cms-table-toolbar-main" });
    const toolbarSide = _.div({ class: "cms-table-toolbar-side" });
    toolbarStartNodes.forEach((node) => toolbarMain.appendChild(node));
    toolbarNodes.forEach((node) => toolbarMain.appendChild(node));

    const searchSlotNodes = renderSlotToArray(slots, "search", { query: getQuery(), getQuery, setQuery }, null);
    if (searchSlotNodes.length) {
      searchSlotNodes.forEach((node) => toolbarSide.appendChild(node));
    } else if (searchable) {
      searchInput = _.input({
        type: "search",
        class: "cms-input",
        placeholder: typeof props.searchable === "string" ? props.searchable : (props.searchPlaceholder || "Cerca nella tabella"),
        value: String(getQuery() || "")
      });
      searchInput.addEventListener("input", () => setQuery(searchInput.value));
      const clearSearch = UI.Btn({
        class: "cms-table-search-clear",
        outline: true,
        onClick: () => {
          if (searchInput) searchInput.value = "";
          setQuery("");
        }
      }, "Reset");
      toolbarSide.appendChild(
        _.div({ class: "cms-singularity cms-table-search" },
          _.span({ class: "cms-table-search-icon", "aria-hidden": "true" }, "⌕"),
          searchInput,
          clearSearch
        )
      );
    }
    toolbarEndNodes.forEach((node) => toolbarSide.appendChild(node));
    if (toolbarMain.childNodes.length || toolbarSide.childNodes.length) {
      toolbar.appendChild(toolbarMain);
      toolbar.appendChild(toolbarSide);
      shell.appendChild(toolbar);
    }

    const statusSummary = _.div({ class: "cms-singularity cms-table-chip" }, "");
    const statusFilter = _.div({ class: "cms-singularity cms-table-chip" }, "");
    const statusSort = _.div({ class: "cms-singularity cms-table-chip" }, "");
    const statusExtraNodes = renderSlotToArray(slots, "status", {}, props.status);
    const status = _.div({ class: "cms-table-status" },
      statusSummary,
      statusFilter,
      statusSort,
      ...statusExtraNodes
    );
    shell.appendChild(status);

    const captionNodes = renderSlotToArray(slots, "caption", {}, props.caption);
    if (captionNodes.length) shell.appendChild(_.div({ class: "cms-table-caption" }, ...captionNodes));

    const thead = _.thead();
    const tbody = _.tbody();
    const hasActions = !!props.actions || !!slots.actions;

    const tableClass = uiClass([
      "cms-table",
      uiWhen(props.dense, "dense"),
      uiWhen(props.striped, "striped"),
      uiWhen(props.hover !== false, "hover"),
      uiWhen(props.stickyHeader !== false, "sticky-head"),
      props.tableClass
    ]);
    const tableStyle = {
      ...(props.tableStyle || {})
    };
    if (props.minTableWidth != null) tableStyle["--cms-table-min-width"] = toCssSize(props.minTableWidth);
    const table = _.table({ class: tableClass, style: tableStyle }, thead, tbody);
    const wrapTable = _.div({ class: "cms-singularity cms-table-wrap" }, table);
    shell.appendChild(wrapTable);

    const pagerInfo = _.div({ class: "cms-singularity cms-table-chip" }, "");
    const pagerMeta = _.div({ class: "cms-singularity cms-table-chip" }, "");
    const btnPrev = UI.Btn({ outline: true, onClick: () => setPage(Math.max(1, getPage() - 1)) }, "‹");
    const btnNext = UI.Btn({ outline: true, onClick: () => setPage(getPage() + 1) }, "›");
    const pageChip = _.div({ class: "cms-singularity cms-table-chip" }, "");
    const sizeSelect = _.select({ class: "cms-input cms-table-size-select" },
      ...pageSizes.map((size) => uiOptionNode({ value: String(size) }, String(size)))
    );
    sizeSelect.value = String(getPageSize());
    sizeSelect.addEventListener("change", () => setPageSize(sizeSelect.value));
    const footerExtraNodes = renderSlotToArray(slots, "footer", {}, props.footer);

    const footer = _.div({ class: "cms-table-foot" },
      _.div({ class: "cms-table-foot-main" },
        pagerInfo,
        pagerMeta,
        _.label({ class: "cms-table-size" },
          _.span("Righe"),
          sizeSelect
        )
      ),
      _.div({ class: "cms-table-foot-extra" },
        ...footerExtraNodes,
        _.div({ class: "cms-table-pager" },
          btnPrev,
          pageChip,
          btnNext
        )
      )
    );
    if (props.hideFooter !== true) shell.appendChild(footer);

    const renderHeader = () => {
      thead.innerHTML = "";
      if (props.hideHeader) return;

      const row = _.tr();
      columns.forEach((col, colIndex) => {
        const ctx = { col, colIndex, sort: getSort() };
        const thStyle = {
          ...tableResolveStyle(col?.style, { ...ctx, header: true }),
          ...tableResolveStyle(col?.headerStyle ?? col?.thStyle, { ...ctx, header: true })
        };
        if (col?.width != null) thStyle.width = toCssSize(col.width);
        if (col?.minWidth != null) thStyle.minWidth = toCssSize(col.minWidth);
        if (col?.maxWidth != null) thStyle.maxWidth = toCssSize(col.maxWidth);
        if (col?.align) thStyle.textAlign = col.align;
        let headerNodes = renderSlotToArray(col?.slots, "header", ctx, null);
        if (!headerNodes.length) {
          const fallback = typeof col?.header === "function" ? col.header(ctx) : (col?.header ?? tableColumnLabel(col));
          headerNodes = renderSlotToArray(slots, "header", ctx, fallback);
        }

        const currentSort = getSort();
        const sortKey = tableColumnSortKey(col, colIndex);
        const isSortable = col?.sortable !== false && (col?.key != null || typeof col?.get === "function" || typeof col?.compare === "function");
        const isActive = !!currentSort && (currentSort.key === sortKey || currentSort.key === col?.key);
        const th = _.th({
          class: uiClass([
            "cms-table-head-cell",
            uiWhen(col?.nowrap, "is-nowrap"),
            uiWhen(isSortable, "cms-table-sortable"),
            uiWhen(isActive, "is-sorted"),
            col?.headerClass
          ]),
          style: thStyle
        });

        if (isSortable) {
          th.appendChild(
            _.button({
              type: "button",
              class: "cms-table-head-button",
              onClick: () => toggleSort(col, colIndex)
            },
              _.span({ class: "cms-table-head-label" }, ...headerNodes),
              _.span({ class: "cms-table-head-arrow", "aria-hidden": "true" },
                isActive ? (currentSort.dir === "asc" ? "↑" : "↓") : "↕"
              )
            )
          );
        } else {
          headerNodes.forEach((node) => th.appendChild(node));
        }
        row.appendChild(th);
      });

      if (hasActions) {
        const actionsHeaderNodes = renderSlotToArray(slots, "actionsHeader", {}, props.actionsLabel || "Azioni");
        row.appendChild(
          _.th({ class: "cms-table-head-cell cms-table-head-actions", style: { textAlign: "right" } }, ...actionsHeaderNodes)
        );
      }
      thead.appendChild(row);
    };

    const renderStateRow = (slotName, fallback) => {
      const ctx = { columns, count: columns.length };
      const nodes = renderSlotToArray(slots, slotName, ctx, fallback);
      const colSpan = String(columns.length + (hasActions ? 1 : 0));
      tbody.appendChild(
        _.tr(
          _.td({ colSpan, class: "cms-table-state" }, ...nodes)
        )
      );
    };

    app.reactive.effect(() => {
      const rows = tableToArray(props.rows);
      const query = String(getQuery() || "").trim();
      const currentSort = getSort();
      const loading = typeof props.loading === "function" ? !!props.loading() : !!props.loading;
      const paginationEnabled = props.pagination !== false;

      renderHeader();
      tbody.innerHTML = "";
      if (searchInput && searchInput.value !== getQuery()) searchInput.value = getQuery();
      if (sizeSelect.value !== String(getPageSize())) sizeSelect.value = String(getPageSize());

      if (loading) {
        statusSummary.textContent = "Caricamento in corso";
        statusFilter.style.display = "none";
        statusSort.style.display = "none";
        pagerInfo.textContent = "Loading…";
        pagerMeta.textContent = "";
        pageChip.textContent = "Pagina 1";
        btnPrev.disabled = true;
        btnNext.disabled = true;
        renderStateRow("loading", props.loadingText || "Loading...");
        return;
      }

      let list = rows.slice();
      const datasetTotal = list.length;
      if (typeof props.filter === "function") {
        list = list.filter((row, index) => props.filter(row, { row, index, query, rows, columns }));
      }
      if (query) {
        list = list.filter((row) => tableMatchesQuery(row, columns, query, props));
      }

      if (currentSort) {
        const sortCol = tableFindColumn(columns, currentSort.key);
        if (sortCol) {
          list.sort((a, b) => {
            const av = tableResolveValue(sortCol, a, -1);
            const bv = tableResolveValue(sortCol, b, -1);
            const out = typeof sortCol.compare === "function"
              ? sortCol.compare(av, bv, a, b)
              : defaultCompare(av, bv);
            return currentSort.dir === "asc" ? out : -out;
          });
        }
      }

      const filteredTotal = list.length;
      const currentPageSize = Math.max(1, Number(getPageSize()) || initialPageSize);
      const pages = paginationEnabled ? Math.max(1, Math.ceil(filteredTotal / currentPageSize)) : 1;
      const page = paginationEnabled ? Math.min(getPage(), pages) : 1;
      if (page !== getPage()) setPage(page);

      const start = paginationEnabled ? (page - 1) * currentPageSize : 0;
      const end = paginationEnabled ? start + currentPageSize : filteredTotal;
      const pageRows = list.slice(start, end);

      statusSummary.textContent = filteredTotal === datasetTotal
        ? `${filteredTotal} righe`
        : `${filteredTotal} di ${datasetTotal} righe`;
      statusFilter.textContent = query ? `Ricerca: ${query}` : "";
      statusFilter.style.display = query ? "" : "none";
      if (currentSort) {
        const sortCol = tableFindColumn(columns, currentSort.key);
        statusSort.textContent = sortCol
          ? `Ordine: ${tableColumnLabel(sortCol)} ${currentSort.dir === "asc" ? "↑" : "↓"}`
          : "";
        statusSort.style.display = sortCol ? "" : "none";
      } else {
        statusSort.style.display = "none";
      }

      pagerInfo.textContent = filteredTotal
        ? `${start + 1}-${Math.min(end, filteredTotal)} di ${filteredTotal}`
        : "0 risultati";
      pagerMeta.textContent = filteredTotal !== datasetTotal ? `Dataset totale ${datasetTotal}` : `Page size ${currentPageSize}`;
      pageChip.textContent = paginationEnabled ? `Pagina ${page} / ${pages}` : "Tutte le righe";
      btnPrev.disabled = !paginationEnabled || page <= 1;
      btnNext.disabled = !paginationEnabled || page >= pages;
      sizeSelect.disabled = !paginationEnabled;
      sizeSelect.parentNode.style.display = paginationEnabled ? "" : "none";

      if (pageRows.length === 0) {
        renderStateRow("empty", props.emptyText || "Nessun dato");
        return;
      }

      for (let pageIndex = 0; pageIndex < pageRows.length; pageIndex++) {
        const row = pageRows[pageIndex];
        const rowIndex = start + pageIndex;
        const rowCtx = { row, rowIndex, pageIndex };
        const rowAttrs = typeof props.rowAttrs === "function" ? (props.rowAttrs(row, rowCtx) || {}) : (props.rowAttrs || {});
        const rowClass = typeof props.rowClass === "function" ? props.rowClass(row, rowCtx) : props.rowClass;
        const isInteractiveRow = !!(props.onRowClick || props.onRowDblClick);
        const tr = _.tr({
          ...rowAttrs,
          class: uiClass([
            "cms-table-row",
            rowClass,
            rowAttrs.class,
            uiWhen(isInteractiveRow, "is-clickable")
          ])
        });

        if (props.rowKey) {
          const key = typeof props.rowKey === "function" ? props.rowKey(row, rowCtx) : tableGetByPath(row, props.rowKey);
          if (key != null) tr.dataset.key = String(key);
        }

        const shouldIgnoreRowEvent = (event) => {
          const target = event?.target;
          return !!(target && target.closest && target.closest("button, a, input, select, textarea, label, [data-table-action]"));
        };
        if (props.onRowClick) {
          tr.addEventListener("click", (event) => {
            if (shouldIgnoreRowEvent(event)) return;
            props.onRowClick(row, rowCtx, event);
          });
        }
        if (props.onRowDblClick) {
          tr.addEventListener("dblclick", (event) => {
            if (shouldIgnoreRowEvent(event)) return;
            props.onRowDblClick(row, rowCtx, event);
          });
        }

        columns.forEach((col, colIndex) => {
          const value = tableResolveValue(col, row, rowIndex);
          const cellCtx = { ...rowCtx, col, colIndex, value };
          const tdStyle = {
            ...tableResolveStyle(col?.style, cellCtx),
            ...tableResolveStyle(col?.cellStyle ?? col?.tdStyle, cellCtx)
          };
          if (col?.align) tdStyle.textAlign = col.align;
          if (col?.width != null) tdStyle.width = toCssSize(col.width);
          if (col?.minWidth != null) tdStyle.minWidth = toCssSize(col.minWidth);
          if (col?.maxWidth != null) tdStyle.maxWidth = toCssSize(col.maxWidth);
          const cellClass = typeof col?.cellClass === "function" ? col.cellClass(row, cellCtx) : (col?.cellClass || col?.class);
          const td = _.td({
            class: uiClass(["cms-table-cell", cellClass, uiWhen(col?.nowrap, "is-nowrap")]),
            style: tdStyle
          });

          let cellNodes = renderSlotToArray(col?.slots, "cell", cellCtx, null);
          if (!cellNodes.length) {
            const raw = typeof col?.render === "function"
              ? col.render(row, cellCtx)
              : (typeof col?.format === "function" ? col.format(value, row, cellCtx) : value);
            const fallback = raw == null ? (col?.emptyText ?? "") : raw;
            cellNodes = renderSlotToArray(slots, "cell", cellCtx, fallback);
          }
          if (!cellNodes.length) cellNodes = [""];
          cellNodes.forEach((node) => td.appendChild(node));
          tr.appendChild(td);
        });

        if (hasActions) {
          const actionCtx = { ...rowCtx };
          const actionRaw = typeof props.actions === "function" ? props.actions(row, rowCtx) : props.actions;
          let actionNodes = renderSlotToArray(slots, "actions", actionCtx, actionRaw);
          if (!actionNodes.length) actionNodes = renderSlotToArray(null, "default", actionCtx, actionRaw);
          tr.appendChild(
            _.td({ class: "cms-table-cell cms-table-cell-actions", style: { textAlign: "right" } },
              _.div({ class: "cms-table-actions" }, ...actionNodes)
            )
          );
        }

        tbody.appendChild(tr);
      }
    }, "UI.Table:render");

    wrapProps.body = shell;
    return UI.Card(wrapProps);
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Table = {
      signature: "UI.Table(props)",
      props: {
        columns: "Array<{ key, label?, sortable?, get?, value?, render?, format?, width?, minWidth?, maxWidth?, align?, compare?, style?, headerStyle?, thStyle?, cellStyle?, tdStyle?, cellClass?, headerClass?, nowrap?, searchable? }>",
        rows: "Array|() => Array",
        rowKey: "string|((row)=>string)",
        loading: "boolean|() => boolean",
        page: "number",
        pageSize: "number",
        pageSizeOptions: "number[]",
        pagination: "boolean",
        initialSort: "{ key, dir: 'asc'|'desc' }",
        search: "string",
        query: "string",
        searchable: "boolean|string",
        searchPlaceholder: "string",
        searchKeys: "Array<string|function>",
        searchModel: "[get,set] signal",
        filter: "(row, ctx)=>boolean",
        actions: "(row, ctx)=>Node|Array",
        actionsLabel: "string|Node|Function|Array",
        emptyText: "string|Node|Function|Array",
        loadingText: "string|Node|Function|Array",
        toolbar: "Node|Function|Array",
        toolbarStart: "Node|Function|Array",
        toolbarEnd: "Node|Function|Array",
        caption: "string|Node|Function|Array",
        footer: "Node|Function|Array",
        status: "string|Node|Function|Array",
        rowClass: "string|((row,ctx)=>string)",
        rowAttrs: "object|((row,ctx)=>object)",
        minTableWidth: "string|number",
        stickyHeader: "boolean",
        hideHeader: "boolean",
        hideFooter: "boolean",
        dense: "boolean",
        striped: "boolean",
        hover: "boolean",
        tableClass: "string",
        cardClass: "string",
        class: "string",
        style: "object"
      },
      slots: {
        default: "Contenuto introduttivo sopra la tabella",
        toolbarStart: "Area sinistra toolbar",
        toolbar: "Toolbar centrale/custom",
        toolbarEnd: "Area destra toolbar",
        search: "Sostituisce la search box built-in",
        header: "Header custom per colonna",
        cell: "Render globale celle",
        actions: "Render globale azioni riga",
        actionsHeader: "Header colonna azioni",
        caption: "Caption sopra la tabella",
        status: "Contenuto extra nella status row",
        loading: "Stato loading",
        empty: "Stato empty",
        footer: "Contenuto extra nel footer"
      },
      events: {
        onRowClick: "(row, ctx, event) => void",
        onRowDblClick: "(row, ctx, event) => void"
      },
      returns: "HTMLDivElement",
      description: "Tabella standardizzata con toolbar, ricerca, sorting, paginazione, stati e rendering flessibile."
    };
  }

  UI.Menu = (props = {}) => {
    const slots = props.slots || {};
    let entry = null;

    const buildContent = (close) => {
      const ctx = { close };
      const raw = typeof props.content === "function" ? props.content(ctx) : props.content;
      let nodes = renderSlotToArray(slots, "content", ctx, raw);
      if (!nodes.length) nodes = renderSlotToArray(slots, "default", ctx, raw);
      const box = _.div(
        { class: uiClass(["cms-menu", props.class]), style: props.style || {} },
        ...nodes
      );

      box.addEventListener("click", (e) => {
        const t = e.target;
        if (t && t.closest && t.closest("[data-menu-close]")) {
          close();
          return;
        }
        if (props.closeOnSelect !== false) close();
      });

      box.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
        const items = Array.from(box.querySelectorAll(
          "[data-menu-item], .cms-menu-item, [role='menuitem'], button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])"
        )).filter(el => el.offsetParent !== null);
        if (!items.length) return;
        e.preventDefault();
        const dir = e.key === "ArrowDown" ? 1 : -1;
        const active = items.indexOf(document.activeElement);
        const next = active < 0 ? (dir > 0 ? 0 : items.length - 1) : (active + dir + items.length) % items.length;
        items[next].focus();
      });

      return box;
    };

    const open = (anchorEl) => {
      const a = anchorEl || props.anchorEl;
      if (!a) return null;
      if (entry) {
        const prev = entry;
        overlayLeave(prev, () => CMSwift.overlay.close(prev.id));
      }
      entry = CMSwift.overlay.open(({ close }) => buildContent(close), {
        type: "menu",
        anchorEl: a,
        placement: props.placement || "bottom-start",
        offsetY: props.offsetY ?? 8,
        offsetX: props.offsetX ?? 0,
        backdrop: false,
        lockScroll: false,
        trapFocus: false,
        closeOnOutside: props.closeOnOutside !== false,
        closeOnEsc: true,
        className: props.panelClass || "",
        onClose: () => {
          entry = null;
          props.onClose?.();
        }
      });
      overlayEnter(entry);
      props.onOpen?.();
      return entry;
    };

    const close = () => {
      if (!entry) return;
      const toClose = entry;
      overlayLeave(toClose, () => CMSwift.overlay.close(toClose.id));
    };

    return { open, close };
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Menu = {
      signature: "UI.Menu(props) -> { open, close }",
      props: {
        content: "Node|Function|Array|({ close })=>Node",
        placement: "string",
        offsetX: "number",
        offsetY: "number",
        closeOnSelect: "boolean",
        closeOnOutside: "boolean",
        slots: "{ content?, default? }",
        class: "string",
        style: "object",
        onOpen: "function",
        onClose: "function"
      },
      slots: {
        content: "Menu content ({ close })",
        default: "Fallback content ({ close })"
      },
      events: {
        onOpen: "void",
        onClose: "void"
      },
      returns: "Object { open(), close() }",
      description: "Menu overlay ancorato con close-on-select."
    };
  }

  UI.Popover = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const stateList = ["primary", "secondary", "warning", "danger", "success", "info", "light", "dark"];
    const sizeList = ["xs", "sm", "md", "lg", "xl"];
    let currentProps = { ...props };
    let entry = null;
    let boundEl = null;
    let lastActive = null;
    let openTimer = null;
    let closeTimer = null;

    const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj || {}, key);
    const resolveRender = (value, ctx) => typeof value === "function" ? value(ctx) : value;
    const splitClasses = (value) => String(value || "").split(/\s+/).filter(Boolean);
    const isPlainObject = (value) => value && typeof value === "object" && !value.nodeType && !Array.isArray(value) && !(value instanceof Function);
    const isAnchorLike = (value) => !!value && typeof value === "object" && (value.nodeType === 1 || typeof value.getBoundingClientRect === "function");
    const clearTimers = () => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
      openTimer = null;
      closeTimer = null;
    };
    const setTrackedClasses = (target, key, classes) => {
      if (!target) return;
      const prev = target[key] || [];
      if (prev.length) target.classList.remove(...prev);
      const next = (classes || []).filter(Boolean);
      if (next.length) target.classList.add(...next);
      target[key] = next;
    };
    const setStyleValue = (target, name, value, formatter = (v) => v) => {
      if (!target) return;
      if (value == null || value === "") {
        target.style.removeProperty(name);
        return;
      }
      target.style.setProperty(name, formatter(value));
    };
    const getOptions = () => currentProps;
    const getStateClass = (opts) => {
      const value = uiUnwrap(opts.state ?? opts.color);
      if (!value) return "";
      return stateList.includes(value) ? value : String(value);
    };
    const getSizeClass = (opts) => {
      const value = uiUnwrap(opts.size);
      return (typeof value === "string" && sizeList.includes(value)) ? value : "";
    };
    const getAlignClass = (opts) => {
      const raw = String(uiUnwrap(opts.actionsAlign ?? opts.footerAlign ?? opts.alignActions ?? "end")).toLowerCase();
      if (["start", "left"].includes(raw)) return "start";
      if (["center", "middle"].includes(raw)) return "center";
      if (["between", "space-between"].includes(raw)) return "between";
      if (["stretch", "full"].includes(raw)) return "stretch";
      return "end";
    };
    const getPlacement = (opts) => String(uiUnwrap(opts.placement ?? opts.position ?? "bottom-start"));
    const getNumber = (value, fallback) => {
      const raw = uiUnwrap(value);
      if (raw == null || raw === "") return fallback;
      const n = Number(raw);
      return Number.isFinite(n) ? n : fallback;
    };
    const getDelay = () => getNumber(getOptions().delay, 0);
    const getHideDelay = () => getNumber(getOptions().hideDelay, 120);
    const isClosable = (opts) => {
      const value = opts.closable ?? opts.dismissible ?? opts.closeButton;
      return value === true;
    };
    const getAnchor = (anchorOverride = null) => {
      if (anchorOverride) return anchorOverride;
      const opts = getOptions();
      return boundEl || uiUnwrap(opts.anchorEl ?? opts.triggerEl ?? opts.target ?? opts.anchor) || null;
    };
    const parseTriggers = (value) => {
      if (value == null || value === true) return new Set(["click"]);
      if (value === false) return new Set(["manual"]);
      const raw = Array.isArray(value) ? value : String(value).split(/[\s,|/]+/);
      const out = new Set();
      raw.forEach((item) => {
        const key = String(item || "").trim().toLowerCase();
        if (!key) return;
        if (key === "mouseenter" || key === "mouseover") out.add("hover");
        else if (key === "blur" || key === "focusin") out.add("focus");
        else if (key === "tap") out.add("click");
        else out.add(key);
      });
      return out.size ? out : new Set(["manual"]);
    };
    const parseOpenArgs = (arg1, arg2) => {
      let anchorEl = null;
      let nextProps = null;
      if (isAnchorLike(arg1)) {
        anchorEl = arg1;
        if (isPlainObject(arg2)) nextProps = arg2;
      } else if (isPlainObject(arg1)) {
        nextProps = arg1;
        const maybeAnchor = arg1.anchorEl ?? arg1.triggerEl ?? arg1.target ?? arg1.anchor;
        if (isAnchorLike(maybeAnchor)) anchorEl = maybeAnchor;
      } else if (arg1 != null) {
        anchorEl = arg1;
      }
      return { anchorEl, nextProps };
    };
    const buildContent = () => {
      const opts = getOptions();
      const ctx = {
        close,
        dismiss: close,
        open,
        toggle,
        update,
        isOpen,
        entry: () => entry,
        anchorEl: getAnchor(),
        props: opts
      };
      const iconFallback = opts.icon != null
        ? (typeof opts.icon === "string"
          ? UI.Icon({ name: opts.icon, size: opts.iconSize || "md" })
          : CMSwift.ui.slot(opts.icon, { as: "icon" }))
        : null;
      const eyebrowNodes = renderSlotToArray(slots, "eyebrow", ctx, resolveRender(opts.eyebrow, ctx));
      const titleNodes = renderSlotToArray(slots, "title", ctx, resolveRender(opts.title ?? opts.heading ?? opts.label, ctx));
      const subtitleNodes = renderSlotToArray(slots, "subtitle", ctx, resolveRender(opts.subtitle ?? opts.description, ctx));
      const iconNodes = renderSlotToArray(slots, "icon", ctx, iconFallback);
      const headerNodes = renderSlotToArray(slots, "header", ctx, resolveRender(opts.headerContent ?? opts.head ?? opts.header, ctx));
      const closeSlotNodes = isClosable(opts)
        ? renderSlotToArray(slots, "close", ctx, UI.Btn({
          class: "cms-dialog-close",
          size: "sm",
          outline: true,
          "aria-label": opts.closeLabel || "Chiudi popover",
          "data-popover-close": true
        }, UI.Icon({ name: opts.closeIcon || "close", size: "sm" })))
        : [];

      let bodyRaw = opts.content ?? opts.body ?? opts.message ?? opts.text;
      if (bodyRaw == null && children && children.length) bodyRaw = children;
      let contentNodes = renderSlotToArray(slots, "content", ctx, resolveRender(bodyRaw, ctx));
      if (!contentNodes.length) contentNodes = renderSlotToArray(slots, "body", ctx, resolveRender(bodyRaw, ctx));
      if (!contentNodes.length) contentNodes = renderSlotToArray(slots, "default", ctx, resolveRender(bodyRaw, ctx));

      const footerRaw = resolveRender(opts.footer ?? opts.actions, ctx);
      let footerNodes = renderSlotToArray(slots, "footer", ctx, footerRaw);
      if (!footerNodes.length) footerNodes = renderSlotToArray(slots, "actions", ctx, footerRaw);

      let headerEl = null;
      if (headerNodes.length) {
        headerEl = _.div({ class: "cms-dialog-head cms-dialog-head-custom" }, ...headerNodes);
      } else if (eyebrowNodes.length || titleNodes.length || subtitleNodes.length || iconNodes.length || closeSlotNodes.length) {
        headerEl = _.div(
          { class: "cms-dialog-head" },
          iconNodes.length ? _.div({ class: "cms-dialog-icon" }, ...iconNodes) : null,
          _.div(
            { class: "cms-dialog-head-main" },
            eyebrowNodes.length ? _.div({ class: "cms-dialog-eyebrow" }, ...eyebrowNodes) : null,
            titleNodes.length ? _.div({ class: "cms-dialog-title" }, ...titleNodes) : null,
            subtitleNodes.length ? _.div({ class: "cms-dialog-subtitle" }, ...subtitleNodes) : null
          ),
          closeSlotNodes.length ? _.div({ class: "cms-dialog-close-wrap" }, ...closeSlotNodes) : null
        );
      }

      const sections = [];
      if (headerEl) sections.push(headerEl);
      if (contentNodes.length) {
        sections.push(_.div({ class: uiClass(["cms-dialog-body", opts.bodyClass]) }, ...contentNodes));
      }
      if (footerNodes.length) {
        sections.push(_.div({
          class: uiClass([
            "cms-dialog-actions",
            `is-${getAlignClass(opts)}`,
            uiWhen(opts.stackActions, "is-stacked"),
            opts.actionsClass,
            opts.footerClass
          ])
        }, ...footerNodes));
      }
      if (!sections.length) {
        sections.push(_.div({ class: uiClass(["cms-dialog-body", opts.bodyClass]) }));
      }

      return _.div({
        class: uiClass([
          "cms-dialog-shell",
          "cms-popover-shell",
          uiWhen(!!headerEl, "has-head"),
          uiWhen(footerNodes.length > 0, "has-footer"),
          uiWhen(opts.divider !== false, "with-divider")
        ])
      }, ...sections);
    };
    const applyEntryOptions = (currentEntry) => {
      if (!currentEntry?.panel) return;
      const opts = getOptions();
      const stateClass = getStateClass(opts);
      const sizeClass = getSizeClass(opts);
      setTrackedClasses(currentEntry.panel, "_popoverClassTokens", [
        "cms-dialog",
        "cms-popover",
        "cms-singularity",
        "cms-clear-set",
        sizeClass ? `cms-dialog-${sizeClass}` : "",
        stateClass,
        stateClass ? `cms-state-${stateClass}` : "",
        uiUnwrap(opts.scrollable) ? "scrollable" : "",
        uiUnwrap(opts.stickyHeader) ? "sticky-head" : "",
        uiUnwrap(opts.stickyActions) ? "sticky-actions" : "",
        uiUnwrap(opts.borderless) ? "borderless" : "",
        ...splitClasses(opts.class),
        ...splitClasses(opts.panelClass)
      ]);
      setTrackedClasses(currentEntry.overlay, "_popoverOverlayClassTokens", [
        ...splitClasses(opts.overlayClass)
      ]);
      currentEntry.panel.dataset.placement = getPlacement(opts);
      setStyleValue(currentEntry.panel, "--cms-dialog-width", uiUnwrap(opts.width), toCssSize);
      setStyleValue(currentEntry.panel, "--cms-dialog-min-width", uiUnwrap(opts.minWidth), toCssSize);
      setStyleValue(currentEntry.panel, "--cms-dialog-max-width", uiUnwrap(opts.maxWidth), toCssSize);
      setStyleValue(currentEntry.panel, "--cms-dialog-max-height", uiUnwrap(opts.maxHeight), toCssSize);
      setStyleValue(currentEntry.panel, "--cms-dialog-body-max-height", uiUnwrap(opts.bodyMaxHeight ?? opts.contentMaxHeight), toCssSize);
      if (opts.style) Object.assign(currentEntry.panel.style, opts.style);
      setPropertyProps(currentEntry.panel, opts);
      currentEntry.panel.setAttribute("role", opts.role || "dialog");
      currentEntry.panel.setAttribute("aria-modal", opts.modal === true ? "true" : "false");
      if (opts.ariaLabel) currentEntry.panel.setAttribute("aria-label", opts.ariaLabel);
      else currentEntry.panel.removeAttribute("aria-label");
    };
    const renderOpenContent = () => {
      if (!entry?.panel) return;
      entry.panel.replaceChildren(buildContent());
    };
    const close = () => {
      clearTimers();
      if (!entry) return;
      const toClose = entry;
      entry = null;
      overlayLeave(toClose, () => CMSwift.overlay.close(toClose.id));
    };
    const update = (nextProps = {}) => {
      if (nextProps && typeof nextProps === "object") currentProps = { ...currentProps, ...nextProps };
      if (entry) {
        applyEntryOptions(entry);
        renderOpenContent();
      }
      return api;
    };
    const open = (arg1 = null, arg2 = null) => {
      clearTimers();
      const { anchorEl, nextProps } = parseOpenArgs(arg1, arg2);
      if (nextProps) currentProps = { ...currentProps, ...nextProps };
      const opts = getOptions();
      const anchor = getAnchor(anchorEl);
      if (!anchor || uiUnwrap(opts.disabled)) return null;
      if (entry && entry._anchorEl === anchor) {
        applyEntryOptions(entry);
        renderOpenContent();
        return entry;
      }
      if (entry) close();
      lastActive = document.activeElement;
      const activeTriggers = parseTriggers(opts.trigger ?? opts.triggers ?? (hasOwn(opts, "open") ? "manual" : null));
      const allowHover = activeTriggers.has("hover");
      const allowFocus = activeTriggers.has("focus");
      let currentRef = null;
      entry = CMSwift.overlay.open(() => buildContent(), {
        type: "popover",
        anchorEl: anchor,
        placement: getPlacement(opts),
        offsetX: opts.offsetX ?? 0,
        offsetY: opts.offsetY ?? opts.offset ?? 10,
        backdrop: opts.backdrop === true,
        lockScroll: opts.lockScroll === true,
        trapFocus: opts.trapFocus === true,
        autoFocus: opts.autoFocus === true,
        closeOnOutside: opts.closeOnOutside !== false,
        closeOnBackdrop: opts.closeOnBackdrop ?? opts.backdrop === true,
        closeOnEsc: opts.closeOnEsc !== false,
        className: uiClassStatic(["cms-dialog", "cms-popover"]),
        onClose: () => {
          currentRef?._popoverCleanup?.();
          getOptions().onClose?.(currentRef);
          if (getOptions().returnFocus !== false && lastActive && typeof lastActive.focus === "function") {
            setTimeout(() => lastActive.focus(), 0);
          }
        }
      });
      if (!entry?.panel) return entry;
      const current = entry;
      currentRef = current;
      current._anchorEl = anchor;
      const cancelHide = () => {
        clearTimeout(closeTimer);
        closeTimer = null;
      };
      const scheduleHide = () => {
        if (!allowHover && !allowFocus) return;
        hide();
      };
      const onPanelClick = (e) => {
        const target = e.target;
        if (!target || !target.closest) return;
        if (target.closest("[data-popover-close]") || target.closest("[data-dialog-close]")) {
          close();
          return;
        }
        if (getOptions().closeOnSelect === true && target.closest("[data-popover-select]")) {
          close();
        }
      };
      current.panel.addEventListener("click", onPanelClick);
      if (allowHover || allowFocus) {
        current.panel.addEventListener("mouseenter", cancelHide);
        current.panel.addEventListener("mouseleave", scheduleHide);
        current.panel.addEventListener("focusin", cancelHide);
        current.panel.addEventListener("focusout", scheduleHide);
      }
      current._popoverCleanup = () => {
        current.panel?.removeEventListener("click", onPanelClick);
        current.panel?.removeEventListener("mouseenter", cancelHide);
        current.panel?.removeEventListener("mouseleave", scheduleHide);
        current.panel?.removeEventListener("focusin", cancelHide);
        current.panel?.removeEventListener("focusout", scheduleHide);
      };
      applyEntryOptions(current);
      overlayEnter(current);
      getOptions().onOpen?.(current);
      return current;
    };
    const show = (anchorEl, nextProps = null) => {
      clearTimeout(closeTimer);
      closeTimer = null;
      clearTimeout(openTimer);
      openTimer = setTimeout(() => open(anchorEl, nextProps), getDelay());
    };
    const hide = (immediate = false) => {
      clearTimeout(openTimer);
      openTimer = null;
      if (!entry) return;
      clearTimeout(closeTimer);
      if (immediate) {
        close();
        return;
      }
      closeTimer = setTimeout(() => close(), getHideDelay());
    };
    const toggle = (arg1 = null, arg2 = null) => isOpen() ? (close(), null) : open(arg1, arg2);
    const isOpen = () => !!entry;
    const bind = (el) => {
      if (!el) return () => { };
      boundEl = el;
      const opts = getOptions();
      const triggers = parseTriggers(opts.trigger ?? opts.triggers ?? (hasOwn(opts, "open") ? "manual" : null));
      const allowHover = triggers.has("hover");
      const allowFocus = triggers.has("focus");
      const allowClick = triggers.has("click");
      const isManual = triggers.has("manual") || (!allowHover && !allowFocus && !allowClick);
      const cleanups = [];
      const cleanup = () => {
        clearTimers();
        cleanups.forEach((fn) => fn());
        if (boundEl === el) boundEl = null;
      };
      if (hasOwn(opts, "open")) {
        if (uiIsReactive(opts.open)) {
          CMSwift.reactive.effect(() => {
            if (!boundEl) return;
            if (uiUnwrap(getOptions().open)) open(boundEl);
            else hide(true);
          }, "UI.Popover:open");
        } else if (opts.open === true) {
          open(el);
        } else if (opts.open === false) {
          hide(true);
        }
        return cleanup;
      }
      if (isManual || uiUnwrap(opts.disabled)) return cleanup;
      if (allowHover) {
        const onEnter = () => show(el);
        const onLeave = () => hide();
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          el.removeEventListener("mouseenter", onEnter);
          el.removeEventListener("mouseleave", onLeave);
        });
      }
      if (allowFocus) {
        const onFocus = () => show(el);
        const onBlur = () => hide();
        el.addEventListener("focus", onFocus);
        el.addEventListener("blur", onBlur);
        cleanups.push(() => {
          el.removeEventListener("focus", onFocus);
          el.removeEventListener("blur", onBlur);
        });
      }
      if (allowClick) {
        const onClick = (e) => {
          getOptions().onTriggerClick?.(e);
          if (e.defaultPrevented) return;
          toggle(el);
        };
        el.addEventListener("click", onClick);
        cleanups.push(() => el.removeEventListener("click", onClick));
      }
      return cleanup;
    };
    const api = {
      open,
      close,
      show,
      hide,
      toggle,
      update,
      bind,
      isOpen,
      entry: () => entry,
      props: () => ({ ...currentProps })
    };

    return api;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Popover = {
      signature: "UI.Popover(props) | UI.Popover(props, ...children) -> { open, close, show, hide, toggle, update, bind, isOpen }",
      props: {
        title: "String|Node|Function|Array|({ close })=>Node",
        subtitle: "String|Node|Function|Array|({ close })=>Node",
        eyebrow: "String|Node|Function|Array|({ close })=>Node",
        icon: "String|Node|Function|Array",
        content: "Node|Function|Array|({ close })=>Node",
        body: "Alias di content",
        actions: "Node|Function|Array|({ close })=>Node",
        footer: "Alias di actions",
        size: "xs|sm|md|lg|xl",
        state: "primary|secondary|warning|danger|success|info|light|dark",
        color: "Alias di state",
        trigger: "click|hover|focus|manual|Array",
        placement: "string",
        offsetX: "number",
        offsetY: "number",
        offset: "Alias di offsetY",
        width: "string|number",
        minWidth: "string|number",
        maxWidth: "string|number",
        maxHeight: "string|number",
        bodyMaxHeight: "string|number",
        contentMaxHeight: "Alias di bodyMaxHeight",
        backdrop: "boolean",
        lockScroll: "boolean",
        trapFocus: "boolean",
        autoFocus: "boolean",
        closeButton: "boolean",
        closable: "boolean",
        closeOnSelect: "boolean",
        closeOnOutside: "boolean",
        closeOnBackdrop: "boolean",
        closeOnEsc: "boolean",
        open: "boolean|rod|signal",
        anchorEl: "HTMLElement|VirtualAnchor",
        triggerEl: "Alias di anchorEl",
        target: "Alias di anchorEl",
        slots: "{ icon?, eyebrow?, title?, subtitle?, header?, content?, body?, footer?, actions?, close?, default? }",
        class: "string",
        panelClass: "string",
        overlayClass: "string",
        style: "object",
        onOpen: "function",
        onClose: "function",
        onTriggerClick: "function"
      },
      slots: {
        icon: "Popover icon",
        eyebrow: "Popover eyebrow ({ close })",
        title: "Popover title ({ close })",
        subtitle: "Popover subtitle ({ close })",
        header: "Header custom ({ close })",
        content: "Popover body ({ close })",
        body: "Alias di content ({ close })",
        footer: "Popover footer ({ close })",
        actions: "Alias di footer ({ close })",
        close: "Close button slot ({ close })",
        default: "Fallback body ({ close })"
      },
      events: {
        onOpen: "void",
        onClose: "void"
      },
      returns: "Object { open(), close(), show(), hide(), toggle(), update(), bind(), isOpen() }",
      description: "Popover ancorato standardizzato con layout ricco, slot completi, trigger bindabili e API imperativa."
    };
  }

  UI.ContextMenu = (props = {}) => {
    const slots = props.slots || {};
    let entry = null;

    const buildContent = (close) => {
      const ctx = { close };
      const raw = typeof props.content === "function" ? props.content(ctx) : props.content;
      let nodes = renderSlotToArray(slots, "content", ctx, raw);
      if (!nodes.length) nodes = renderSlotToArray(slots, "default", ctx, raw);
      const box = _.div(
        { class: uiClass(["cms-menu", props.class]), style: props.style || {} },
        ...nodes
      );
      box.addEventListener("click", (e) => {
        const t = e.target;
        if (t && t.closest && t.closest("[data-menu-close]")) {
          close();
          return;
        }
        if (props.closeOnSelect !== false) close();
      });
      return box;
    };

    const openAt = (x, y) => {
      const anchorEl = {
        getBoundingClientRect: () => ({
          top: y,
          bottom: y,
          left: x,
          right: x,
          width: 0,
          height: 0
        })
      };
      if (entry) {
        const prev = entry;
        overlayLeave(prev, () => CMSwift.overlay.close(prev.id));
      }
      entry = CMSwift.overlay.open(({ close }) => buildContent(close), {
        type: "menu",
        anchorEl,
        placement: props.placement || "bottom-start",
        offsetX: props.offsetX ?? 0,
        offsetY: props.offsetY ?? 0,
        backdrop: false,
        lockScroll: false,
        trapFocus: false,
        closeOnOutside: props.closeOnOutside !== false,
        closeOnEsc: true,
        onClose: () => {
          entry = null;
          props.onClose?.();
        }
      });
      overlayEnter(entry);
      props.onOpen?.();
      return entry;
    };

    const bind = (el) => {
      if (!el) return () => { };
      const onCtx = (e) => {
        e.preventDefault();
        openAt(e.clientX, e.clientY);
      };
      el.addEventListener("contextmenu", onCtx);
      return () => el.removeEventListener("contextmenu", onCtx);
    };

    const close = () => {
      if (!entry) return;
      const toClose = entry;
      overlayLeave(toClose, () => CMSwift.overlay.close(toClose.id));
    };

    return { bind, openAt, close };
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.ContextMenu = {
      signature: "UI.ContextMenu(props) -> { bind, openAt, close }",
      props: {
        content: "Node|Function|Array|({ close })=>Node",
        placement: "string",
        offsetX: "number",
        offsetY: "number",
        closeOnSelect: "boolean",
        closeOnOutside: "boolean",
        slots: "{ content?, default? }",
        class: "string",
        style: "object",
        onOpen: "function",
        onClose: "function"
      },
      slots: {
        content: "Context menu content ({ close })",
        default: "Fallback content ({ close })"
      },
      events: {
        onOpen: "void",
        onClose: "void"
      },
      returns: "Object { bind(), openAt(), close() }",
      description: "Context menu a right-click con posizionamento su mouse."
    };
  }
})(CMSwift);

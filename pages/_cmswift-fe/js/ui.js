// ===============================
// CMSwift UI Kit MVP
// ===============================
(function initCMSwiftUI(app) {
  app.ui = app.ui || {};
  app.services = app.services || {};
  app.services.notify = app.services.notify || {};

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

    if (uiIsReactive(props.radius) || uiIsReactive(props.borderRadius)) {
      classTokens.push(() => {
        const r = uiUnwrap(props.radius);
        const b = uiUnwrap(props.borderRadius);
        const v = r != null ? r : b;
        const radius = normalizeRadius(v);
        return radius ? `cms-r-${radius}` : "";
      });
      style.borderRadius = () => {
        const r = uiUnwrap(props.radius);
        const b = uiUnwrap(props.borderRadius);
        const v = r != null ? r : b;
        const radius = normalizeRadius(v);
        if (radius || v == null) return "";
        return toCssSize(v);
      };
    } else {
      const radius = normalizeRadius(props.radius ?? props.borderRadius);
      if (radius) classTokens.push(`cms-r-${radius}`);
      else if (props.radius != null || props.borderRadius != null) {
        style.borderRadius = toCssSize(props.radius ?? props.borderRadius);
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
  const UI = app.ui;

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
    useInput: "Uses an input field to allow custom typing.",
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

  const META_PROP_VALUES = {
    size: CMSwift.uiSizes || ["xxs", "xs", "sm", "md", "lg", "xl", "xxl", "xxxl"],
    color: ["primary", "secondary", "success", "warning", "danger", "info", "light", "dark"],
    iconAlign: ["left", "right", "before", "after"],
    align: ["left", "center", "right"],
    justify: ["start", "center", "end", "space-between", "space-around", "space-evenly"],
    placement: ["top", "bottom", "left", "right", "top-start", "top-end", "bottom-start", "bottom-end"],
    type: ["primary", "secondary", "success", "warning", "danger", "info", "light", "dark"],
    shadow: ["none", "sm", "md", "lg"]
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
    return _h.div(p, ...content);
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
      return _h.div(p, ...content);
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
    return _h.div(p, ...content);
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
    return _h.div(p, ...content);
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
    // usa il tuo normalize se ce l’hai già
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const cls = uiClass([
      "cms-panel",
      "cms-card",
      uiWhen(props.flat, "cms-card-flat"),
      uiWhen(props.dense, "cms-card-dense"),
      uiWhen(props.clickable, "cms-card-clickable"),
      props.class
    ]);

    // props speciali da non passare come attributi DOM
    const p = CMSwift.omit
      ? CMSwift.omit(props, ["header", "footer", "actions", "flat", "dense", "clickable", "to", "slots"])
      : (() => {
        const x = { ...props };
        ["header", "footer", "actions", "flat", "dense", "clickable", "to", "slots"].forEach(k => delete x[k]);
        return x;
      })();

    // routing helper (opzionale)
    const onClick = (e) => {
      props.onClick?.(e);
      if (e.defaultPrevented) return;

      if (props.to && CMSwift.router?.navigate) {
        e.preventDefault();
        CMSwift.router.navigate(props.to);
      }
    };

    // struttura standard: header/body/footer
    const headerIdentifier = renderSlotToArray(slots, "header", {}, props.identifier);
    const headerNodes = renderSlotToArray(slots, "header", {}, props.header);
    const footerNodes = renderSlotToArray(slots, "footer", {}, props.footer);
    const actionsNodes = renderSlotToArray(slots, "actions", {}, props.actions);

    const bodyChildren = renderSlotToArray(slots, "default", {}, children?.length ? children : []);
    const body = _h.div({ class: "cms-card-body" }, ...bodyChildren);

    const el = _h.div(
      { ...p, class: cls, onClick: (props.clickable || props.to) ? onClick : props.onClick },
      headerIdentifier.length ? _h.div({ class: "cms-card-identifier" }, ...headerIdentifier) : null,
      headerNodes.length ? _h.div({ class: "cms-card-header" }, ...headerNodes) : null,
      body,
      (footerNodes.length || actionsNodes.length) ? _h.div({ class: "cms-card-footer" }, ...footerNodes, ...actionsNodes) : null
    );

    return el;
  }
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Card = {
      signature: "UI.Card(...children) | UI.Card(props, ...children)",
      description: "Card con header/body/footer opzionali.",
      props: {
        header: "String|Node|Function|Array",
        footer: "String|Node|Function|Array",
        actions: "Node|Function|Array",
        clickable: "boolean",
        to: "string",
        dense: "boolean",
        flat: "boolean",
        slots: "{ header?, footer?, actions?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        header: "Header slot",
        footer: "Footer slot",
        actions: "Footer actions slot",
        default: "Card body content"
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

    const cls = uiClass(["cms-btn", state, uiWhen(props.outline, "outline"), props.class]);

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

    if (content.length === 0) content.push(_h.span("Button"));

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
      content.unshift(_h.span({ class: "cms-muted", style: { marginRight: "8px" } }, "⏳"));
    }

    return _h.button({
      ...p,
      disabled,
      onClick,
      onPointerDown,
      "aria-disabled": disabled ? "true" : null,
      "aria-busy": props.loading ? "true" : null
    }, ...content);
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
    const slots = props.slots || {};
    const wrap = _h.div({ class: uiClass(["cms-field", props.wrapClass]) });

    const topLabelNodes = renderSlotToArray(slots, "topLabel", {}, props.topLabel);
    if (topLabelNodes.length) {
      wrap.appendChild(_h.div({ class: "cms-field-label" }, ...topLabelNodes));
    }

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
        ? _h.div({ class: "cms-control" }, ...controlSlot)
        : controlSlot;
    } else {
      control = _h.div({ class: "cms-control" });

      // left addon
      const left = _h.div({ class: "cms-addon" });
      const iconFallback = props.icon != null
        ? (typeof props.icon === "string" ? UI.Icon({ name: props.icon }) : props.icon)
        : null;
      const iconNode = CMSwift.ui.renderSlot(slots, "icon", {}, iconFallback);
      const prefixNode = CMSwift.ui.renderSlot(slots, "prefix", {}, props.prefix);
      renderSlotToArray(null, "default", {}, iconNode).forEach(n => left.appendChild(n));
      renderSlotToArray(null, "default", {}, prefixNode).forEach(n => left.appendChild(n));
      if (left.childNodes.length) control.appendChild(left);

      // middle: controlEl + floating label
      const mid = _h.div({ style: { position: "relative", flex: "1", minWidth: "0" } });
      if (controlEl) mid.appendChild(controlEl);

      const labelNodes = renderSlotToArray(slots, "label", {}, props.label);
      if (labelNodes.length) {
        const floatLabel = _h.div({ class: "cms-float-label" }, ...labelNodes);
        mid.appendChild(floatLabel);
      }

      control.appendChild(mid);

      // clear
      const defaultClear = props.clearable ? _h.div({
        class: "cms-clear",
        title: "Clear",
        onClick: clear
      }, UI.Icon({ name: "close" })) : null;

      const clearNode = CMSwift.ui.renderSlot(slots, "clear", {
        clear,
        disabled: !!props.disabled,
        readonly: !!props.readonly,
        hasValue: getHasValue()
      }, defaultClear);

      if (clearNode) {
        renderSlotToArray(null, "default", {}, clearNode).forEach(n => control.appendChild(n));
      }

      clearBtn = defaultClear;
      if (clearBtn && props.clearable?.action) {
        props.clearable.action((v) => v ? clearBtn.classList.remove("cms-d-none") : clearBtn.classList.add("cms-d-none"));
      }

      // right addon
      const right = _h.div({ class: "cms-addon" });
      const iconRightFallback = props.iconRight != null
        ? (typeof props.iconRight === "string" ? UI.Icon({ name: props.iconRight }) : props.iconRight)
        : null;
      const iconRightNode = CMSwift.ui.renderSlot(slots, "iconRight", {}, iconRightFallback);
      const suffixNode = CMSwift.ui.renderSlot(slots, "suffix", {}, props.suffix);
      renderSlotToArray(null, "default", {}, iconRightNode).forEach(n => right.appendChild(n));
      renderSlotToArray(null, "default", {}, suffixNode).forEach(n => right.appendChild(n));
      if (right.childNodes.length) control.appendChild(right);
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
        ? _h.div({ class: active?.className }, ...nodes)
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
    const el = _h.input({
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
    const input = _h.input({
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
      ? _h.div({ style: { display: "contents" } }, ...inputSlot)
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
    const filterable = props.filterable || props.useInput;
    const isMulti = !!props.multiple || !!props.multi;
    const allowCustom = !!props.allowCustom || !!props.allowCustomValue;
    const slots = props.slots || {};

    const toArray = (v) => {
      if (Array.isArray(v)) return v.slice();
      if (v == null || v === "") return [];
      return [v];
    };
    const normalizeValue = (v) => isMulti ? toArray(v) : v;

    // state
    const [getOpen, setOpen] = CMSwift.reactive.signal(false);
    const [getFilter, setFilter] = CMSwift.reactive.signal("");
    const [getValue, setValue] = CMSwift.reactive.signal(isMulti ? toArray(props.value) : (props.value ?? ""));
    const [getLoading, setLoading] = CMSwift.reactive.signal(false);
    const [getList, setList] = CMSwift.reactive.signal([]);      // normalized flat list
    const [getFlat, setFlat] = CMSwift.reactive.signal([]);      // flat selectable options only (no groups)
    const [getActive, setActive] = CMSwift.reactive.signal(-1);  // active index in flat selectable list

    let modelSet = null;

    // model binding
    const model = props.model;
    if (model) {
      if (typeof model === "object" && typeof model._bind === "function") {
        setValue(normalizeValue(model.value));
        model.action((v) => setValue(normalizeValue(v)));
        modelSet = (v) => {
          const next = normalizeValue(v);
          if (model.value !== next) model.value = next;
        };
      } else if (Array.isArray(model) && typeof model[0] === "function" && typeof model[1] === "function") {
        const get = model[0];
        const set = model[1];
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
    const root = _h.div({
      class: uiClass(["cms-select", isMulti ? "multiple" : "", props.class]),
      tabIndex: isDisabled() ? -1 : 0,
      role: "combobox",
      "aria-expanded": "false",
      "aria-disabled": isDisabled() ? "true" : "false"
    });

    const valueNode = _h.div({
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
          const chip = UI.Chip({
            label,
            dense: true,
            removable: true,
            onRemove: (e) => {
              e?.stopPropagation?.();
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

    const arrowWrap = _h.div({ class: "cms-select-arrow" });
    CMSwift.reactive.effect(() => {
      const arrowNode = CMSwift.ui.renderSlot(slots, "arrow", { open: getOpen() }, UI.Icon("#chevron-down"));
      arrowWrap.innerHTML = "";
      renderSlotToArray(null, "default", {}, arrowNode).forEach(n => arrowWrap.appendChild(n));
    }, "UI.Select:arrow");

    const control = _h.div({ class: "cms-select-control", onClick: toggle },
      valueNode,
      arrowWrap
    );

    const optionsWrap = _h.div({
      class: "cms-select-options",
      role: "listbox",
      "aria-multiselectable": isMulti ? "true" : "false"
    });

    const filterWrap = _h.div({ class: "cms-select-filter cms-d-none" });
    let filterInput = null;
    const defaultFilterInput = _h.input({
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
    const menu = _h.div({ class: "cms-select-menu", onClick: (e) => e.stopPropagation() },
      filterWrap, optionsWrap
    );

    root.appendChild(control);
    root.appendChild(menu);

    // open class + aria
    CMSwift.reactive.effect(() => {
      const o = getOpen();
      root.classList.toggle("open", o);
      root.setAttribute("aria-expanded", o ? "true" : "false");
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

        const node = _h.div({
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
          optionsWrap.appendChild(_h.div({ class: "cms-select-empty" }, ...renderSlotToArray(null, "default", {}, emptyNode)));
          return;
        }
        for (const opt of filtered) pushOption(opt);
      } else {
        // no filter: render grouped display list with headers
        let hadAnyOption = false;
        for (const item of display) {
          if (item.type === "group") {
            const groupNode = CMSwift.ui.renderSlot(slots, "group", { label: item.label }, item.label);
            nodes.push(_h.div({ class: "cms-select-group" }, ...renderSlotToArray(null, "default", {}, groupNode)));
          } else {
            hadAnyOption = true;
            pushOption(item);
          }
        }
        if (!hadAnyOption) {
          const emptyNode = CMSwift.ui.renderSlot(slots, "empty", { filter }, props.emptyText || "Nessuna opzione");
          optionsWrap.appendChild(_h.div({ class: "cms-select-empty" }, ...renderSlotToArray(null, "default", {}, emptyNode)));
          return;
        }
      }

      if (loading) {
        const loadingNode = CMSwift.ui.renderSlot(slots, "loading", {}, "Caricamento...");
        optionsWrap.appendChild(_h.div({ class: "cms-select-empty" }, ...renderSlotToArray(null, "default", {}, loadingNode)));
        return;
      }

      for (const n of nodes) optionsWrap.appendChild(n);
      paintActive();
    }, "UI.Select:render");

    CMSwift.reactive.effect(() => {
      paintActive();
    }, "UI.Select:paintActive");

    // outside click + escape cleanup
    const onDocClick = (e) => {
      if (!root.isConnected) return;
      if (!root.contains(e.target)) close();
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
        useInput: "boolean (alias filterable)",
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

  UI.Layout = ({
    header = null,
    aside = null,
    page = null,
    footer = null,
    slots = null,

    // behavior
    noDrawer = false,
    drawerOpen = null,     // rod | [get,set] signal | boolean (controllo)
    drawerBreakpoint = 1024, // px: sotto -> overlay
    drawerWidth = 280,     // px
    overlayClose = true,   // click overlay closes
    escClose = true,       // esc closes

    stickyHeader = false,
    stickyFooter = false,
    stickyAside = true,

    tagPage = false,
    class: className
  } = {}) => {

    // --- normalize slots ---
    const slotMap = slots || {};
    const H = renderSlotToArray(slotMap, "header", {}, header);
    const A = renderSlotToArray(slotMap, "aside", {}, aside);
    const P = renderSlotToArray(slotMap, "page", {}, page);
    const F = renderSlotToArray(slotMap, "footer", {}, footer);

    // --- aside open state ---
    const [getOpen, setOpen] = (() => {
      if (drawerOpen === null) {
        const [g, s] = CMSwift.reactive.signal(true);
        return [g, s];
      }
      // rod
      if (typeof drawerOpen === "object" && typeof drawerOpen._bind === "function") {
        return [() => !!drawerOpen.value, (v) => drawerOpen.value = !!v];
      }
      // signal tuple
      if (Array.isArray(drawerOpen) && typeof drawerOpen[0] === "function" && typeof drawerOpen[1] === "function") {
        return [() => !!drawerOpen[0](), (v) => drawerOpen[1](!!v)];
      }
      // boolean
      if (typeof drawerOpen === "boolean") {
        const [g, s] = CMSwift.reactive.signal(!!drawerOpen);
        return [g, s];
      }
      const [g, s] = CMSwift.reactive.signal(true);
      return [g, s];
    })();

    // --- is mobile? ---
    const [getMobile, setMobile] = CMSwift.reactive.signal(false);
    const checkMobile = () => setMobile(window.innerWidth < drawerBreakpoint);

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // --- elements ---
    const root = _h.div({ class: uiClass(["cms-app", className]) });

    const createHeaderWrap = () => _h[tagPage ? "header" : "div"]({
      class: uiClass(["cms-layout header", uiWhen(stickyHeader, "sticky")])
    });
    const createFooterWrap = () => _h[tagPage ? "footer" : "div"]({
      class: uiClass(["cms-layout footer", uiWhen(stickyFooter, "sticky")])
    });
    let headerWrap = H.length ? createHeaderWrap() : null;
    let footerWrap = F.length ? createFooterWrap() : null;

    // overlay for mobile aside
    const overlay = _h.div({
      class: "cms-aside-overlay",
      onClick: () => {
        if (!overlayClose) return;
        setOpen(false);
      }
    });

    const asideWrap = _h[tagPage ? "aside" : "div"]({
      class: uiClass(["cms-layout-aside", "aside", uiWhen(stickyAside, "sticky")]),
      style: { width: `${drawerWidth}px` },
      role: "navigation",
      "aria-hidden": "false"
    });

    const shell = _h.div({ class: "cms-layout-shell-grid" });
    root.appendChild(shell);

    const mainWrap = _h[tagPage ? "main" : "div"]({ class: "cms-layout main", role: "main" });

    // compose
    if (headerWrap) shell.appendChild(headerWrap);
    if (asideWrap) shell.appendChild(asideWrap);
    shell.appendChild(mainWrap);
    if (footerWrap) shell.appendChild(footerWrap);

    // overlay only when drawer exists
    let hasDrawerContent = A.length > 0;
    if (!noDrawer && hasDrawerContent) root.appendChild(overlay);

    // listen fot header size changes
    if (headerWrap) {
      const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        root.style.setProperty("--layout-header-height", `${entry.contentRect.height}px`);
      });
      observer.observe(headerWrap);
    }

    // --- reactive classes / aria ---
    CMSwift.reactive.effect(() => {
      const mobile = getMobile();
      root.classList.toggle("is-mobile", mobile);
    }, "UI.Layout:mobile");

    CMSwift.reactive.effect(() => {
      const open = !!getOpen();
      const mobile = getMobile();

      const drawerVisible = noDrawer ? false : open;

      root.classList.toggle("drawer-open", drawerVisible);
      overlay.classList.toggle("show", mobile && open);

      if (!noDrawer && A) {
        asideWrap.setAttribute("aria-hidden", drawerVisible ? "false" : "true");

        // mobile slide
        asideWrap.classList.toggle("open", open);

        if (mobile) {
          asideWrap.style.removeProperty("display");
          root.style.removeProperty("grid-template-columns");
          root.style.removeProperty("grid-template-areas");
        } else {
          if (drawerVisible) {
            asideWrap.style.removeProperty("display");
            root.style.removeProperty("grid-template-columns");
            root.style.removeProperty("grid-template-areas");
          } else {
            asideWrap.style.display = "none";
            root.style.gridTemplateColumns = "1fr";
            root.style.gridTemplateAreas = "\"header\" \"main\" \"footer\"";
          }
        }
      }
    }, "UI.Layout:drawerState");

    // ESC close (mobile)
    const onKeyDown = (e) => {
      if (!escClose) return;
      if (!getMobile()) return;
      if (!getOpen()) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown, true);

    // cleanup hook (finché non hai auto-cleanup)
    root._dispose = () => {
      window.removeEventListener("resize", checkMobile);
      document.removeEventListener("keydown", onKeyDown, true);
    };

    // API handy
    root.openAside = () => setOpen(true);
    root.closeAside = () => setOpen(false);
    root.toggleAside = () => setOpen(!getOpen());

    // slots
    root.header = () => headerWrap;
    root.aside = () => asideWrap;
    root.page = () => mainWrap;
    root.footer = () => footerWrap;


    const disposeTree = (node) => {
      if (!node || typeof node !== "object") return;
      if (typeof node._dispose === "function") node._dispose();
      if (!node.childNodes || !node.childNodes.length) return;
      Array.from(node.childNodes).forEach(disposeTree);
    };

    const clearWrap = (wrap) => {
      if (!wrap) return;
      const nodes = Array.from(wrap.childNodes);
      nodes.forEach((n) => {
        disposeTree(n);
        n.remove();
      });
    };

    const normalizeUpdateNodes = (value) => {
      const ctx = {};
      const raw = (typeof value === "function") ? value(ctx) : value;
      return renderSlotToArray(null, "default", ctx, raw);
    };

    const ensureOverlay = () => {
      if (noDrawer) return;
      if (hasDrawerContent) {
        if (!overlay.parentNode) root.appendChild(overlay);
      } else if (overlay.parentNode) {
        overlay.remove();
      }
    };

    const headerUpdate = (children, newUrl) => {
      const nodes = normalizeUpdateNodes(children);
      if (!nodes.length) {
        if (headerWrap) {
          clearWrap(headerWrap);
          headerWrap.remove();
          headerWrap = null;
        }
        return null;
      }
      if (!headerWrap) {
        headerWrap = createHeaderWrap();
        root.insertBefore(headerWrap, shell);
      }
      clearWrap(headerWrap);
      nodes.forEach((n) => headerWrap.appendChild(n));
      if (newUrl) {
        CMSwift.router.setURLOnly(newUrl);
      }
      return headerWrap;
    };

    const asideUpdate = (children, newUrl) => {
      const nodes = normalizeUpdateNodes(children);
      clearWrap(asideWrap);
      nodes.forEach((n) => asideWrap.appendChild(n));
      hasDrawerContent = nodes.length > 0;
      ensureOverlay();
      if (newUrl) {
        CMSwift.router.setURLOnly(newUrl);
      }
      return asideWrap;
    };

    const mainUpdate = (children, newUrl) => {
      const nodes = normalizeUpdateNodes(children);
      clearWrap(mainWrap);
      nodes.forEach((n) => mainWrap.appendChild(n));
      if (newUrl) {
        CMSwift.router.setURLOnly(newUrl);
      }
      return mainWrap;
    };

    const footerUpdate = (children, newUrl) => {
      const nodes = normalizeUpdateNodes(children);
      if (!nodes.length) {
        if (footerWrap) {
          clearWrap(footerWrap);
          footerWrap.remove();
          footerWrap = null;
        }
        return null;
      }
      if (!footerWrap) {
        footerWrap = createFooterWrap();
        const anchor = overlay.parentNode ? overlay : null;
        if (anchor) root.insertBefore(footerWrap, anchor);
        else root.appendChild(footerWrap);
      }
      clearWrap(footerWrap);
      nodes.forEach((n) => footerWrap.appendChild(n));
      if (newUrl) {
        CMSwift.router.setURLOnly(newUrl);
      }
      return footerWrap;
    };

    root.headerUpdate = headerUpdate;
    root.asideUpdate = asideUpdate;
    root.mainUpdate = mainUpdate;
    root.footerUpdate = footerUpdate;

    headerUpdate(H);
    asideUpdate(A);
    mainUpdate(P);
    footerUpdate(F);
    return root;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Layout = {
      signature: "UI.Layout({ header, aside, page, footer, ... })",
      props: {
        header: "Node|Function|Array",
        aside: "Node|Function|Array",
        page: "Node|Function|Array",
        footer: "Node|Function|Array",
        noDrawer: "boolean",

        drawerOpen: "rod | [get,set] signal | boolean",
        drawerBreakpoint: "number(px)",
        drawerWidth: "number(px)",
        overlayClose: "boolean",
        escClose: "boolean",

        stickyHeader: "boolean",
        stickyFooter: "boolean",
        stickyAside: "boolean",

        slots: "{ header?, aside?, page?, footer? }",
        tagPage: "boolean", // default: false 
        class: "string"
      },
      slots: {
        header: "Header content",
        aside: "Drawer content",
        page: "Page content",
        footer: "Footer content"
      },
      returns: "HTMLDivElement (.cms-layout) con methods openAside/closeAside/toggleAside, _dispose(), " +
        " header, aside, page, footer, headerUpdate(Node, newUrl), asideUpdate(Node, newUrl), pageUpdate(Node, newUrl), footerUpdate(Node, newUrl)",
    };
  }
  // Esempio: CMSwift.ui.Layout({ header, aside, page, footer })

  UI.Footer = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};

    const cls = uiClass([
      "cms-footer",
      uiWhen(props.sticky, "sticky"),
      uiWhen(props.dense, "dense"),
      uiWhen(props.elevated, "elevated"),
      uiClassValue(props.align, "align-"),
      props.class
    ]);

    // props speciali da non passare al DOM
    const p = CMSwift.omit(props, ["sticky", "dense", "elevated", "align", "slots"]);
    p.class = cls;

    const content = renderSlotToArray(slots, "default", {}, children);

    return _h.footer(p, ...content);
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Footer = {
      signature: "UI.Footer(...children) | UI.Footer(props, ...children)",
      props: {
        sticky: "boolean",
        dense: "boolean",
        elevated: "boolean",
        align: `left|center|right`,
        slots: "{ default? }",
        class: "string",
        style: "object"
      },
      slots: {
        default: "Footer content"
      },
      returns: "HTMLElement <footer>"
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
    return _h.div(p, ...content);
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
    if (gap != null) style.gap = gap;
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

    return _h.div(p, ...renderSlotToArray(slots, "default", {}, children));
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
    const spanClass = uiComputed([props.auto, props.span], () => {
      const auto = uiUnwrap(props.auto);
      const span = auto ? "auto" : (uiUnwrap(props.span) || 24);
      return span === "auto" ? "cms-col-auto" : `cms-col-${span}`;
    });
    const cls = uiClass([
      spanClass,
      uiClassValue(props.sm, "cms-sm-col-"),
      uiClassValue(props.md, "cms-md-col-"),
      uiClassValue(props.lg, "cms-lg-col-"),
      props.class
    ]);

    const p = CMSwift.omit(props, ["span", "sm", "md", "lg", "auto", "slots"]);
    p.class = cls;
    return _h.div(p, ...renderSlotToArray(slots, "default", {}, children));
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
      description: "Colonna per la griglia con breakpoints."
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

    const slots = props.slots || {};

    const size = uiUnwrap(props.size);
    const color = uiUnwrap(props.color);
    const isFill = String(name).endsWith("-fill");
    const style = { ...(props.style || {}) };

    if (color) style.color = color;

    const cls = uiClass(["cms-icon", "material-icons", props.class]);
    const p = CMSwift.omit(props, ["name", "size", "color", "class", "style", "slots"]);
    p.class = cls;
    if (Object.keys(style).length) p.style = style;

    if (typeof name === "function" || (name && typeof name === "object")) {
      const customNode = CMSwift.ui.renderSlot(slots, "default", {}, name);
      const content = renderSlotToArray(null, "default", {}, customNode);
      return _h.span({ ...p, "data-icon": "custom" }, ...content);
    }

    const nameStr = String(name);
    const useHref = nameStr.includes("#") ? nameStr : "";
    let icon = null;
    if (useHref) {
      const svg = _h.svg(
        { width: "100%", height: "100%" },
        _h.use({ href: "/_cmswift-fe/img/svg/tabler-icons-sprite.svg" + useHref })
      );
      if (isFill) svg.style.fill = "currentColor";
      icon = _h.span({ ...p, "data-icon": nameStr }, svg, ...children);
    } else {
      icon = _h.span({ ...p, "data-icon": nameStr }, nameStr, ...children);
    }

    if (size != null) {
      let v = size;
      if (CMSwift.uiSizes.includes(size)) {
        v = `var(--cms-icon-size-${size})`;
      }
      v = typeof v === "number" ? v + "px" : String(v);
      icon.style.setProperty("--set-icon-size", v);
    }

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
    const cls = uiClass(["cms-badge", uiWhen(props.outline, "outline"), props.class]);
    const p = CMSwift.omit(props, ["label", "color", "outline", "size", "slots"]);
    p.class = cls;

    const color = props.color ?? "primary";
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
    const style = {
      display: "inline-flex",
      alignItems: "center",
      padding: "2px 8px",
      borderRadius: "999px",
      fontSize: "12px",
      border: "1px solid var(--cms-border-color)",
      ...(props.style || {})
    };
    if (props.size) {
      if (typeof props.size === "string" && sizeMap[props.size]) {
        style.fontSize = sizeMap[props.size].font;
        style.padding = sizeMap[props.size].pad;
      } else {
        style.fontSize = toCssSize(props.size);
      }
    }
    if (color) {
      const colorValue = color === "primary" ? "var(--cms-primary)" : color;
      if (props.outline) {
        style.background = "transparent";
        style.borderColor = colorValue;
        style.color = style.color || colorValue;
      } else {
        style.background = colorValue;
        if (!style.color) style.color = "white";
      }
    }
    p.style = style;

    const labelNodes = renderSlotToArray(slots, "label", {}, props.label);
    const content = labelNodes.length ? labelNodes : renderSlotToArray(slots, "default", {}, children);
    return _h.span(p, ...(content.length ? content : [""]));
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
        slots: "{ label?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        label: "Badge label content",
        default: "Fallback content"
      },
      returns: "HTMLSpanElement",
      description: "Badge inline con colore configurabile."
    };
  }
  // Esempio: CMSwift.ui.Badge({ label: "New" })

  UI.Avatar = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const cls = uiClass(["cms-avatar", uiWhen(props.elevated, "elevated"), props.class]);
    const p = CMSwift.omit(props, ["src", "label", "size", "rounded", "square", "elevated", "slots"]);
    p.class = cls;

    const size = uiUnwrap(props.size) ?? 32;
    const style = {
      width: toCssSize(size),
      height: toCssSize(size),
      borderRadius: props.square ? "6px" : "999px",
      overflow: "hidden",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(255,255,255,0.08)",
      ...(props.style || {})
    };
    p.style = style;

    const labelNodes = renderSlotToArray(slots, "label", {}, props.label);
    const fallback = labelNodes.length ? labelNodes : renderSlotToArray(slots, "default", {}, children);
    const img = props.src
      ? _h.img({ src: props.src, alt: props.label || "avatar", style: { width: "100%", height: "100%", objectFit: "cover" } })
      : null;

    return _h.div(p, img || (fallback.length ? fallback : ["?"]));
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Avatar = {
      signature: "UI.Avatar(...children) | UI.Avatar(props, ...children)",
      props: {
        src: "string",
        label: "String|Node|Function|Array",
        size: "number|string",
        square: "boolean",
        elevated: "boolean",
        slots: "{ label?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        label: "Avatar label content",
        default: "Fallback content"
      },
      returns: "HTMLDivElement",
      description: "Avatar con immagine o fallback testuale."
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
    const wrap = _h.span(p, ...iconNodes, ...(labelNode.length ? labelNode : [""]), ...iconRightNodes);
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

    if (props.size && typeof props.size === "number") {
      wrap.style.setProperty("--cms-font-size", `${props.size}px`);
    } else if (CMSwift.uiSizes.includes(props.size)) {
      wrap.style.setProperty("--cms-font-size", `var(--cms-font-size-${props.size})`);
    }
    if (props.gradient && typeof props.gradient !== "boolean") {
      wrap.style.setProperty("--set-gradient-deg", `${props.gradient}deg`);
    }
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
        outline: "boolean",
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
    let timer = null;
    let boundEl = null;

    const buildContent = (close) => {
      const ctx = { close };
      const slotNodes = renderSlotToArray(slots, "content", ctx, null);
      if (slotNodes.length) return slotNodes;
      const raw = props.content ?? props.text ?? (children && children.length > 1 ? children[1] : null);
      const resolved = typeof raw === "function" ? raw(ctx) : raw;
      return renderSlotToArray(null, "default", ctx, resolved);
    };

    const open = (anchorEl) => {
      const anchor = anchorEl || boundEl;
      if (!anchor || entry) return;
      entry = CMSwift.overlay.open(({ close }) => buildContent(close), {
        type: "tooltip",
        anchorEl: anchor,
        placement: props.placement || "top",
        offsetX: props.offsetX ?? 0,
        offsetY: props.offsetY ?? props.offset ?? 8,
        backdrop: false,
        lockScroll: false,
        trapFocus: false,
        closeOnOutside: false,
        closeOnBackdrop: false,
        closeOnEsc: false,
        autoFocus: false,
        className: uiClassStatic(["cms-tooltip", props.class]),
        onClose: () => { entry = null; }
      });
      if (props.style) Object.assign(entry.panel.style, props.style);
      overlayEnter(entry);
    };

    const show = (anchorEl) => {
      const delay = props.delay ?? 350;
      clearTimeout(timer);
      timer = setTimeout(() => open(anchorEl), delay);
    };

    const hide = () => {
      clearTimeout(timer);
      if (!entry) return;
      const toClose = entry;
      overlayLeave(toClose, () => CMSwift.overlay.close(toClose.id));
    };

    const bind = (el) => {
      if (!el) return () => { };
      boundEl = el;
      if (props.open === true) {
        open(el);
        return () => { };
      }
      if (props.open === false) return () => { };
      const onEnter = () => show(el);
      const onLeave = () => hide();
      const onFocus = () => show(el);
      const onBlur = () => hide();
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
      el.addEventListener("focus", onFocus);
      el.addEventListener("blur", onBlur);
      return () => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
        el.removeEventListener("focus", onFocus);
        el.removeEventListener("blur", onBlur);
      };
    };

    const targetNode = props.target || (children && children.length ? children[0] : null);
    if (targetNode) {
      const cls = uiClass(["cms-tooltip-wrap", props.class]);
      const p = CMSwift.omit(props, ["text", "content", "target", "placement", "delay", "offsetX", "offsetY", "offset", "class", "style", "slots"]);
      p.class = cls;
      p.style = { display: "inline-flex", alignItems: "center", ...(props.style || {}) };
      const target = CMSwift.ui.renderSlot(slots, "target", {}, targetNode);
      const wrap = _h.span(p, ...renderSlotToArray(null, "default", {}, target));
      bind(wrap);
      return wrap;
    }

    return { bind, show, hide };
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Tooltip = {
      signature: "UI.Tooltip(props) -> { bind, show, hide } | UI.Tooltip(target, text)",
      props: {
        text: "String|Node|Function|Array",
        content: "String|Node|Function|Array",
        target: "Node|Function|Array (legacy)",
        open: "boolean (legacy)",
        placement: "string",
        delay: "number",
        offset: "number (legacy)",
        offsetX: "number",
        offsetY: "number",
        slots: "{ target?, content? }",
        class: "string",
        style: "object"
      },
      slots: {
        target: "Tooltip target (legacy wrapper)",
        content: "Tooltip content ({ close })"
      },
      returns: "Object { bind(), show(), hide() } | HTMLSpanElement",
      description: "Tooltip overlay ancorato con hover/focus e delay."
    };
  }
  // Esempio: CMSwift.ui.Tooltip({ text: "Info" }, CMSwift.ui.Icon({ name: "i" }))

  UI.List = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const number = props.number || false;
    const cls = uiClass(["cms-list", uiWhen(props.dense, "dense"), props.class]);
    const p = CMSwift.omit(props, ["dense", "slots"]);
    p.class = cls;
    return _h[number ? "ol" : "ul"](p, ...renderSlotToArray(slots, "default", {}, children));
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.List = {
      signature: "UI.List(...children) | UI.List(props, ...children)",
      props: {
        dense: "boolean",
        slots: "{ default? }",
        class: "string",
        style: "object",
        number: "boolean"
      },
      slots: {
        default: "List content"
      },
      returns: "HTMLUListElement",
      description: "Lista base con opzionale densita."
    };
  }
  // Esempio: CMSwift.ui.List({}, CMSwift.ui.Item({}, "Item"))

  UI.Item = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const cls = uiClass(["cms-item", uiWhen(props.divider, "divider"), props.class]);
    const p = CMSwift.omit(props, ["divider", "slots"]);
    p.class = cls;
    return _h.li(p, ...renderSlotToArray(slots, "default", {}, children));
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Item = {
      signature: "UI.Item(...children) | UI.Item(props, ...children)",
      props: {
        divider: "boolean",
        slots: "{ default? }",
        class: "string",
        style: "object"
      },
      slots: {
        default: "Item content"
      },
      returns: "HTMLLIElement",
      description: "Elemento lista con divider opzionale."
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
    return _h.hr(p);
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

  UI.Checkbox = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const id = props.id || ("cms-cb-" + Math.random().toString(36).slice(2));
    const model = resolveModel(props.model, "UI.Checkbox:model");

    const inputProps = CMSwift.omit(props, ["model", "label", "checked", "class", "style", "dense", "onChange", "onInput", "slots"]);
    inputProps.type = "checkbox";
    inputProps.id = id;
    inputProps.class = uiClass(["cms-checkbox", props.inputClass]);
    const input = _h.input(inputProps);

    if (model) {
      input.checked = !!model.get();
      model.watch((v) => { input.checked = !!v; }, "UI.Checkbox:watch");
      input.addEventListener("change", (e) => {
        model.set(!!input.checked);
        props.onChange?.(!!input.checked, e);
      });
    } else {
      input.checked = !!props.checked;
      input.addEventListener("change", (e) => props.onChange?.(!!input.checked, e));
    }
    if (props.onInput) input.addEventListener("input", (e) => props.onInput?.(!!input.checked, e));

    const labelNodes = renderSlotToArray(slots, "label", {}, props.label);
    const labelContent = labelNodes.length ? labelNodes : renderSlotToArray(slots, "default", {}, children);
    const wrapProps = CMSwift.omit(props, ["model", "label", "checked", "onChange", "onInput", "value", "name", "id", "type", "dense", "inputClass", "slots"]);
    wrapProps.class = uiClass(["cms-checkbox-wrap", uiWhen(props.dense, "dense"), props.class]);
    wrapProps.style = { display: "inline-flex", alignItems: "center", gap: "8px", ...(props.style || {}) };

    return _h.label(
      wrapProps,
      input,
      labelContent.length ? _h.span(...labelContent) : null
    );
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Checkbox = {
      signature: "UI.Checkbox(...children) | UI.Checkbox(props, ...children)",
      props: {
        label: "String|Node|Function|Array",
        checked: "boolean",
        model: "[get,set] signal",
        dense: "boolean",
        slots: "{ label?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        label: "Checkbox label",
        default: "Fallback label content"
      },
      events: {
        onChange: "(checked, event)",
        onInput: "(checked, event)"
      },
      returns: "HTMLLabelElement",
      description: "Checkbox con label e supporto model."
    };
  }
  // Esempio: CMSwift.ui.Checkbox({ label: "Accetto", model: [get,set] })

  UI.Radio = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const id = props.id || ("cms-radio-" + Math.random().toString(36).slice(2));
    const model = resolveModel(props.model, "UI.Radio:model");

    const inputProps = CMSwift.omit(props, ["model", "label", "checked", "class", "style", "dense", "onChange", "onInput", "slots"]);
    inputProps.type = "radio";
    inputProps.id = id;
    inputProps.name = props.name;
    inputProps.class = uiClass(["cms-radio", props.inputClass]);
    const input = _h.input(inputProps);

    if (model) {
      input.checked = model.get() == props.value;
      model.watch((v) => { input.checked = (v == props.value); }, "UI.Radio:watch");
      input.addEventListener("change", (e) => {
        if (input.checked) {
          model.set(props.value);
          props.onChange?.(props.value, e);
        }
      });
    } else {
      input.checked = props.checked === true;
      input.addEventListener("change", (e) => props.onChange?.(props.value, e));
    }
    if (props.onInput) input.addEventListener("input", (e) => props.onInput?.(props.value, e));

    const labelNodes = renderSlotToArray(slots, "label", {}, props.label);
    const labelContent = labelNodes.length ? labelNodes : renderSlotToArray(slots, "default", {}, children);
    const wrapProps = CMSwift.omit(props, ["model", "label", "checked", "onChange", "onInput", "value", "name", "id", "type", "dense", "inputClass", "slots"]);
    wrapProps.class = uiClass(["cms-radio-wrap", uiWhen(props.dense, "dense"), props.class]);
    wrapProps.style = { display: "inline-flex", alignItems: "center", gap: "8px", ...(props.style || {}) };

    return _h.label(
      wrapProps,
      input,
      labelContent.length ? _h.span(...labelContent) : null
    );
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Radio = {
      signature: "UI.Radio(...children) | UI.Radio(props, ...children)",
      props: {
        label: "String|Node|Function|Array",
        value: "any",
        name: "string",
        checked: "boolean",
        model: "[get,set] signal",
        dense: "boolean",
        slots: "{ label?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        label: "Radio label",
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
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const model = resolveModel(props.model, "UI.Toggle:model");

    const inputProps = CMSwift.omit(props, ["model", "label", "checked", "class", "style", "dense", "onChange", "onInput", "slots"]);
    inputProps.type = "checkbox";
    inputProps.class = uiClass(["cms-toggle", props.inputClass]);
    const input = _h.input(inputProps);

    input.checked = !!props.checked;
    if (model) {
      input.checked = !!model.get();
      model.watch((v) => { input.checked = !!v; }, "UI.Toggle:watch");
      input.addEventListener("change", (e) => {
        model.set(!!input.checked);
        props.onChange?.(!!input.checked, e);
      });
    } else {
      input.addEventListener("change", (e) => props.onChange?.(!!input.checked, e));
    }
    if (props.onInput) input.addEventListener("input", (e) => props.onInput?.(!!input.checked, e));

    const labelNodes = renderSlotToArray(slots, "label", {}, props.label);
    const labelContent = labelNodes.length ? labelNodes : renderSlotToArray(slots, "default", {}, children);
    const wrapProps = CMSwift.omit(props, ["model", "label", "checked", "onChange", "onInput", "value", "name", "id", "type", "dense", "inputClass", "slots"]);
    wrapProps.class = uiClass(["cms-toggle-wrap", uiWhen(props.dense, "dense"), props.class]);
    wrapProps.style = { display: "inline-flex", alignItems: "center", gap: "8px", ...(props.style || {}) };

    return _h.label(
      wrapProps,
      input,
      labelContent.length ? _h.span(...labelContent) : null
    );
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Toggle = {
      signature: "UI.Toggle(...children) | UI.Toggle(props, ...children)",
      props: {
        label: "String|Node|Function|Array",
        checked: "boolean",
        model: "[get,set] signal",
        dense: "boolean",
        slots: "{ label?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        label: "Toggle label",
        default: "Fallback label content"
      },
      events: {
        onChange: "(checked, event)",
        onInput: "(checked, event)"
      },
      returns: "HTMLLabelElement",
      description: "Toggle switch con supporto model."
    };
  }
  // Esempio: CMSwift.ui.Toggle({ label: "Attivo", model: [get,set] })

  UI.Slider = (...args) => {
    const { props } = CMSwift.uiNormalizeArgs(args);
    const model = resolveModel(props.model, "UI.Slider:model");

    const inputProps = CMSwift.omit(props, ["model", "value", "class", "style", "onChange", "onInput", "slots"]);
    inputProps.type = "range";
    inputProps.min = props.min ?? 0;
    inputProps.max = props.max ?? 100;
    inputProps.step = props.step ?? 1;
    inputProps.class = uiClass(["cms-slider", props.class]);
    inputProps.style = props.style;
    const input = _h.input(inputProps);

    if (model) {
      input.value = String(model.get() ?? 0);
      model.watch((v) => { input.value = String(v ?? 0); }, "UI.Slider:watch");
      input.addEventListener("input", (e) => {
        model.set(Number(input.value));
        props.onInput?.(Number(input.value), e);
      });
      input.addEventListener("change", (e) => props.onChange?.(Number(input.value), e));
    } else {
      if (props.value != null) input.value = String(props.value);
      input.addEventListener("input", (e) => props.onInput?.(Number(input.value), e));
      input.addEventListener("change", (e) => props.onChange?.(Number(input.value), e));
    }
    return input;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Slider = {
      signature: "UI.Slider(props)",
      props: {
        min: "number",
        max: "number",
        step: "number",
        value: "number",
        model: "[get,set] signal",
        slots: "{ default? }",
        class: "string",
        style: "object"
      },
      slots: {
        default: "Unused (slider has no content)"
      },
      events: {
        onChange: "(value, event)",
        onInput: "(value, event)"
      },
      returns: "HTMLInputElement",
      description: "Slider range con supporto model."
    };
  }
  // Esempio: CMSwift.ui.Slider({ min: 0, max: 10, model: [get,set] })

  UI.Rating = (...args) => {
    const { props } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const max = props.max || 5;
    const model = resolveModel(props.model, "UI.Rating:model");
    const wrap = _h.div({
      class: uiClass(["cms-rating", props.class]),
      style: { display: "inline-flex", gap: "6px", ...(props.style || {}) }
    });
    const stars = [];
    const readonly = !!props.readonly || !!props.disabled;

    function setActive(val) {
      stars.forEach((s, i) => s.classList.toggle("active", i < val));
    }

    for (let i = 1; i <= max; i++) {
      const starContent = CMSwift.ui.renderSlot(slots, "star", { index: i, max }, "★");
      const star = _h.span({
        class: "cms-rating-star",
        style: { cursor: readonly ? "default" : "pointer", color: "var(--cms-muted)" },
        onClick: () => {
          if (readonly) return;
          if (model) model.set(i);
          setActive(i);
          props.onChange?.(i);
        }
      }, ...renderSlotToArray(null, "default", {}, starContent));
      stars.push(star);
      wrap.appendChild(star);
    }

    if (model) {
      const v = Number(model.get() || 0);
      setActive(v);
      model.watch((next) => setActive(Number(next || 0)), "UI.Rating:watch");
    } else if (props.value != null) {
      setActive(Number(props.value || 0));
    }

    return wrap;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Rating = {
      signature: "UI.Rating(props)",
      props: {
        max: "number",
        value: "number",
        model: "[get,set] signal",
        readonly: "boolean",
        slots: "{ star? }",
        class: "string",
        style: "object"
      },
      slots: {
        star: "Star content (ctx: { index, max })"
      },
      events: {
        onChange: "(value)"
      },
      returns: "HTMLDivElement",
      description: "Rating a stelle con supporto model."
    };
  }
  // Esempio: CMSwift.ui.Rating({ max: 5, model: [get,set] })

  UI.Date = (...args) => {
    const { props } = CMSwift.uiNormalizeArgs(args);
    const p = CMSwift.omit(props, ["class", "slots"]);
    p.type = "date";
    p.class = uiClass(["cms-input", props.class]);
    return _h.input(p);
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Date = {
      signature: "UI.Date(props)",
      props: {
        value: "string",
        slots: "{ default? }",
        class: "string",
        style: "object"
      },
      slots: {
        default: "Unused (date input has no content)"
      },
      returns: "HTMLInputElement",
      description: "Input type date standardizzato."
    };
  }
  // Esempio: CMSwift.ui.Date({ value: "2024-01-01" })

  UI.Time = (...args) => {
    const { props } = CMSwift.uiNormalizeArgs(args);
    const p = CMSwift.omit(props, ["class", "slots"]);
    p.type = "time";
    p.class = uiClass(["cms-input", props.class]);
    return _h.input(p);
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Time = {
      signature: "UI.Time(props)",
      props: {
        value: "string",
        slots: "{ default? }",
        class: "string",
        style: "object"
      },
      slots: {
        default: "Unused (time input has no content)"
      },
      returns: "HTMLInputElement",
      description: "Input type time standardizzato."
    };
  }
  // Esempio: CMSwift.ui.Time({ value: "09:30" })

  UI.Tabs = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const tabs = props.tabs || [];
    const model = resolveModel(props.model, "UI.Tabs:model");
    const wrap = _h.div({
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
    return _h.a(p, ...(content.length ? content : [props.to || ""]));
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
    const wrap = _h.nav({ class: uiClass(["cms-breadcrumbs", props.class]) });
    items.forEach((it, i) => {
      const label = it.label || it.title || it.to || it.href || "";
      const defaultNode = it.to || it.href
        ? _h.a({ href: it.to || it.href }, label)
        : _h.span(label);
      const itemNode = CMSwift.ui.renderSlot(slots, "item", { item: it, index: i }, defaultNode);
      renderSlotToArray(null, "default", {}, itemNode).forEach(n => wrap.appendChild(n));
      if (i < items.length - 1) {
        const sepNode = CMSwift.ui.renderSlot(slots, "separator", { index: i }, sep);
        wrap.appendChild(_h.span({ class: "cms-breadcrumb-sep", style: { margin: "0 6px" } }, ...renderSlotToArray(null, "default", {}, sepNode)));
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
    const max = Math.max(1, props.max || 1);
    const model = resolveModel(props.model, "UI.Pagination:model");
    const wrap = _h.div({
      class: uiClass(["cms-pagination", uiWhen(props.dense, "dense"), props.class]),
      style: { display: "flex", gap: "8px", alignItems: "center", ...(props.style || {}) }
    });
    const label = _h.span("");
    const prev = UI.Btn({ onClick: () => setPage(getPage() - 1) },
      ...renderSlotToArray(slots, "prev", { max, setPage }, "Prev")
    );
    const next = UI.Btn({ onClick: () => setPage(getPage() + 1) },
      ...renderSlotToArray(slots, "next", { max, setPage }, "Next")
    );

    function getPage() {
      return model ? Number(model.get() || 1) : Number(props.value || 1);
    }
    function setPage(v, fromModel = false) {
      const nextVal = Math.min(max, Math.max(1, v));
      if (model && !fromModel) model.set(nextVal);
      label.innerHTML = "";
      const labelNode = CMSwift.ui.renderSlot(slots, "label", { page: nextVal, max }, `Page ${nextVal} / ${max}`);
      renderSlotToArray(null, "default", {}, labelNode).forEach(n => label.appendChild(n));
      prev.disabled = nextVal <= 1;
      next.disabled = nextVal >= max;
      props.onChange?.(nextVal);
    }

    wrap.appendChild(prev);
    if (props.showLabel !== false) wrap.appendChild(label);
    wrap.appendChild(next);
    setPage(getPage());

    if (model) model.watch((v) => setPage(Number(v || 1), true), "UI.Pagination:watch");
    return wrap;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Pagination = {
      signature: "UI.Pagination(props)",
      props: {
        max: "number",
        value: "number",
        model: "[get,set] signal",
        showLabel: "boolean",
        dense: "boolean",
        slots: "{ prev?, next?, label? }",
        class: "string",
        style: "object"
      },
      slots: {
        prev: "Prev button content (ctx: { max, setPage })",
        next: "Next button content (ctx: { max, setPage })",
        label: "Label content (ctx: { page, max })"
      },
      events: {
        onChange: "(value)"
      },
      returns: "HTMLDivElement",
      description: "Paginazione con prev/next e label."
    };
  }
  // Esempio: CMSwift.ui.Pagination({ max: 10, model: [get,set] })

  let spinnerStyleAdded = false;
  function ensureSpinnerStyles() {
    if (spinnerStyleAdded) return;
    spinnerStyleAdded = true;
    const style = document.createElement("style");
    style.textContent = "@keyframes cmsSpin { to { transform: rotate(360deg); } }";
    document.head.appendChild(style);
  }

  UI.Spinner = (...args) => {
    const { props } = CMSwift.uiNormalizeArgs(args);
    ensureSpinnerStyles();
    const size = uiUnwrap(props.size) || 18;
    const thickness = uiUnwrap(props.thickness);
    const color = uiUnwrap(props.color);
    const style = {
      width: toCssSize(size),
      height: toCssSize(size),
      borderRadius: "50%",
      border: thickness ? `${toCssSize(thickness)} solid rgba(255,255,255,0.25)` : "2px solid rgba(255,255,255,0.25)",
      borderTopColor: color || "var(--cms-primary)",
      animation: "cmsSpin 0.9s linear infinite",
      ...(props.style || {})
    };
    const p = CMSwift.omit(props, ["size", "color", "thickness", "slots"]);
    p.class = uiClass(["cms-spinner", props.class]);
    p.style = style;
    return _h.div(p);
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Spinner = {
      signature: "UI.Spinner(props)",
      props: {
        size: "number|string",
        color: "string",
        thickness: "number|string",
        slots: "{ default? }",
        class: "string",
        style: "object"
      },
      slots: {
        default: "Unused (spinner has no content)"
      },
      returns: "HTMLDivElement",
      description: "Spinner animato."
    };
  }
  // Esempio: CMSwift.ui.Spinner({ size: 24 })

  UI.Progress = (...args) => {
    const { props } = CMSwift.uiNormalizeArgs(args);
    const value = Math.max(0, Math.min(100, Number(uiUnwrap(props.value) ?? 0)));
    const wrap = _h.div({
      class: uiClass(["cms-progress", props.class]),
      style: {
        width: uiUnwrap(props.width) || "100%",
        height: uiUnwrap(props.size) || "6px",
        background: "rgba(255,255,255,0.08)",
        borderRadius: "999px",
        overflow: "hidden",
        ...(props.style || {})
      }
    });
    const bar = _h.div({
      class: uiClass(["cms-progress-bar", uiWhen(props.striped, "striped")]),
      style: {
        width: value + "%",
        height: "100%",
        background: uiUnwrap(props.color) || "var(--cms-primary)",
        transition: "width 200ms ease"
      }
    });
    wrap.appendChild(bar);
    return wrap;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Progress = {
      signature: "UI.Progress(props)",
      props: {
        value: "number",
        width: "string|number",
        size: "string|number",
        color: "string",
        striped: "boolean",
        slots: "{ default? }",
        class: "string",
        style: "object"
      },
      slots: {
        default: "Unused (progress has no content)"
      },
      returns: "HTMLDivElement",
      description: "Progress bar orizzontale."
    };
  }
  // Esempio: CMSwift.ui.Progress({ value: 45 })

  UI.LoadingBar = function LoadingBar(...args) {
    const { props } = CMSwift.uiNormalizeArgs(args);
    const root = _h.div({
      class: uiClass(["cms-loading-bar", props.class]),
      style: {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: uiUnwrap(props.height) || "3px",
        zIndex: uiUnwrap(props.zIndex) || 10002,
        pointerEvents: "none"
      }
    });
    const bar = _h.div({
      class: "cms-loading-bar-inner",
      style: {
        width: "0%",
        height: "100%",
        background: uiUnwrap(props.color) || "var(--cms-primary)",
        transition: "width 200ms ease, opacity 200ms ease",
        opacity: "0"
      }
    });
    root.appendChild(bar);
    (props.target || document.body).appendChild(root);

    function set(value) {
      const v = Math.max(0, Math.min(100, Number(value || 0)));
      bar.style.width = v + "%";
      bar.style.opacity = v > 0 ? "1" : "0";
    }
    function start() { set(10); }
    function stop() {
      set(100);
      setTimeout(() => set(0), 200);
    }
    return { el: root, set, start, stop };
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.LoadingBar = {
      signature: "UI.LoadingBar(props)",
      props: {
        height: "string|number",
        color: "string",
        zIndex: "number",
        target: "HTMLElement",
        slots: "{ default? }",
        class: "string",
        style: "object"
      },
      slots: {
        default: "Unused (loading bar has no content)"
      },
      returns: "{ el, set(value), start(), stop() }",
      description: "Loading bar top-fixed con API imperativa."
    };
  }
  // Esempio: const lb = CMSwift.ui.LoadingBar(); lb.start(); lb.stop();

  UI.Notify = (opts = {}) => app.services.notify?.show?.(opts);
  UI.Notify.success = (message, title = "Success") => app.services.notify?.success?.(message, title);
  UI.Notify.error = (message, title = "Error") => app.services.notify?.error?.(message, title);
  UI.Notify.info = (message, title = "Info") => app.services.notify?.info?.(message, title);
  // Esempio: CMSwift.ui.Notify({ type: "success", title: "OK", message: "Salvato" })

  UI.Banner = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const cls = uiClass(["cms-banner", props.type || "", uiWhen(props.dense, "dense"), props.class]);
    const p = CMSwift.omit(props, ["type", "message", "actions", "dense", "slots"]);
    p.class = cls;
    const sizeMap = {
      sm: { pad: "8px 12px", font: "13px" },
      md: { pad: "10px 14px", font: "14px" },
      lg: { pad: "12px 16px", font: "15px" }
    };
    p.style = {
      padding: "10px 14px",
      borderRadius: "var(--cms-r-md)",
      border: "1px solid var(--cms-border)",
      background: "rgba(255,255,255,0.04)",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontSize: "14px",
      ...(props.style || {})
    };
    const sizeValue = uiUnwrap(props.size);
    if (sizeValue && typeof sizeValue === "string" && sizeMap[sizeValue]) {
      p.style.padding = sizeMap[sizeValue].pad;
      p.style.fontSize = sizeMap[sizeValue].font;
    }

    const messageNodes = renderSlotToArray(slots, "message", {}, props.message);
    const message = messageNodes.length ? messageNodes : renderSlotToArray(slots, "default", {}, children);
    const actions = props.actions
      ? (Array.isArray(props.actions) ? props.actions : [props.actions])
      : null;
    const actionsNode = CMSwift.ui.renderSlot(slots, "actions", {}, actions);
    const actionsNodes = actionsNode ? renderSlotToArray(null, "default", {}, actionsNode) : [];

    const wrap = _h.div(
      p,
      _h.div({ class: "cms-banner-message" }, ...(message.length ? message : [""])),
      actionsNodes.length
        ? _h.div({ class: "cms-banner-actions", style: { marginLeft: "auto", display: "flex", gap: "8px" } }, ...actionsNodes)
        : null
    );
    return wrap;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Banner = {
      signature: "UI.Banner(...children) | UI.Banner(props, ...children)",
      props: {
        message: "String|Node|Function|Array",
        actions: "Node|Array",
        type: "string",
        dense: "boolean",
        slots: "{ message?, actions?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        message: "Banner message content",
        actions: "Banner actions content",
        default: "Fallback message content"
      },
      returns: "HTMLDivElement",
      description: "Banner informativo con azioni opzionali."
    };
  }
  // Esempio: CMSwift.ui.Banner({ message: "Aggiornamento disponibile" })

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
    drawerToggleIcons.forEach(({ el, openIcon, closeIcon }) => {
      if (el) el.textContent = drawerOpen ? openIcon : closeIcon;
    });
    writeDrawerOpen(drawerOpen, key);
    return drawerOpen;
  };

  UI.Header = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const title = props.title ?? "App";
    const subtitle = props.subtitle ?? "";
    const left = props.left ?? null;
    const right = props.right ?? null;
    const drawerOpenIcon = props.drawerOpenIcon ?? "✕";
    const drawerCloseIcon = props.drawerCloseIcon ?? "☰";
    const headerDrawerStateKey = props.drawerStateKey ?? null;

    if (headerDrawerStateKey) {
      drawerStateKey = headerDrawerStateKey;
      drawerOpen = readDrawerOpen();
    }
    const iconEl = left == null ? _h.span(drawerOpen ? drawerOpenIcon : drawerCloseIcon) : null;
    if (iconEl) drawerToggleIcons.add({ el: iconEl, openIcon: drawerOpenIcon, closeIcon: drawerCloseIcon });

    const cls = uiClass([
      "cms-panel",
      "cms-header",
      uiWhen(props.sticky, "sticky"),
      uiWhen(props.dense, "dense"),
      uiWhen(props.elevated, "elevated"),
      uiWhen(props.divider, "divider"),
      props.class
    ]);
    const p = CMSwift.omit(props, [
      "title", "subtitle", "left", "right",
      "drawerOpenIcon", "drawerCloseIcon", "drawerStateKey",
      "sticky", "dense", "elevated", "divider", "slots"
    ]);
    p.class = cls;

    const toggleAside = () => {
      const isOpen = setDrawerOpen(!drawerOpen);
      if (iconEl) iconEl.textContent = isOpen ? drawerOpenIcon : drawerCloseIcon;
    };
    const leftFallback = left != null ? left : UI.Btn({ onClick: toggleAside }, iconEl);
    const leftNode = left === false && !CMSwift.ui.getSlot(slots, "left")
      ? null
      : CMSwift.ui.renderSlot(slots, "left", { toggleAside }, leftFallback);
    const rightNode = CMSwift.ui.renderSlot(slots, "right", {}, right);

    const titleNode = CMSwift.ui.renderSlot(slots, "title", {}, title);
    const subtitleNode = subtitle ? CMSwift.ui.renderSlot(slots, "subtitle", {}, subtitle) : null;
    const defaultCenter = [
      _h.div({ class: "cms-title" }, ...renderSlotToArray(null, "default", {}, titleNode)),
      subtitleNode ? _h.div({ class: "cms-muted", style: { fontSize: "12px", marginTop: "2px" } }, ...renderSlotToArray(null, "default", {}, subtitleNode)) : null
    ];

    const centerContent = renderSlotToArray(slots, "center", {}, (children && children.length) ? children : defaultCenter);

    return _h.div(
      p,
      ...(leftNode ? renderSlotToArray(null, "default", {}, leftNode) : []),
      _h.div(...centerContent),
      UI.Spacer(),
      ...(rightNode ? renderSlotToArray(null, "default", {}, rightNode) : [])
    );
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Header = {
      signature: "UI.Header(...children) | UI.Header(props, ...children)",
      props: {
        title: "string",
        subtitle: "string",
        left: "Node|Function|Array|false",
        right: "Node|Function|Array",
        drawerOpenIcon: "string|Node",
        drawerCloseIcon: "string|Node",
        drawerStateKey: "string",
        sticky: "boolean",
        dense: "boolean",
        elevated: "boolean",
        divider: "boolean",
        slots: "{ left?, right?, center?, title?, subtitle? }",
        class: "string",
        style: "object"
      },
      slots: {
        left: "Left area (ctx: { toggleAside })",
        right: "Right area",
        center: "Center content",
        title: "Title content",
        subtitle: "Subtitle content"
      },
      returns: "HTMLDivElement",
      description: "Header con supporto drawer e slot laterali."
    };
  }

  UI.Drawer = (...args) => {
    const { props } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const items = props.items || [];
    const header = props.header ?? null;
    const stateKey = props.stateKey ?? null;
    const closeOnSelect = props.closeOnSelect ?? true;
    const groupOpenIcon = props.groupOpenIcon ?? _ui.Icon("arrow_drop_down", { size: "lg" });
    const groupCloseIcon = props.groupCloseIcon ?? _ui.Icon("arrow_drop_up", { size: "lg" });
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

    const makeIcon = (icon, side = "left") => (icon ? _h.span({
      class: uiClass(["cms-drawer-item-icon", side === "right" ? "right" : "left"]),
    }, icon) : null);

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

        if (Array.isArray(children) && children.length) {
          let open = readGroupOpen(stateKey, !!it.expanded);
          const openIcon = it.openIcon || groupOpenIcon;
          const closeIcon = it.closeIcon || groupCloseIcon;
          const openIconSide = it.iconSidePosition || it.openIconSide || it.openIconPosition || "left";
          const closeIconSide = it.iconSidePosition || it.closeIconSide || it.closeIconPosition || "left";
          const toggleIconEl = _h.span({ class: "cms-drawer-group-icon" });
          const labelContent = CMSwift.ui.renderSlot(slots, "groupLabel", { item: it, label }, label);
          const labelEl = _h.span({ class: "cms-drawer-group-label" }, ...renderSlotToArray(null, "default", {}, labelContent));
          const groupItems = _h.div({ class: "cms-drawer-group-items" }, ...renderItems(children, level + 1, path.concat(keyPart)));
          const toggleBtn = _h.button({
            class: "cms-drawer-group-toggle",
            onClick: () => setOpen(!open)
          }, toggleIconEl, itemIconLeft, labelEl, itemIconRight);
          const spacerRight = _ui.Spacer();
          const setToggleIcon = (isOpen) => {
            const icon = isOpen ? openIcon : closeIcon;
            const side = (isOpen ? openIconSide : closeIconSide) === "right" ? "right" : "left";
            toggleIconEl.innerHTML = "";
            if (icon) toggleIconEl.appendChild(_h.span(icon));
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
          const groupWrap = _h.div({
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

        return _h.a({
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

    const drawerEl = _h.div(
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
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const cls = uiClass(["cms-panel", "cms-page", uiWhen(props.dense, "dense"), props.class]);
    const p = CMSwift.omit(props, ["dense", "slots"]);
    p.class = cls;
    return _h.div(p, ...renderSlotToArray(slots, "default", {}, children));
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Page = {
      signature: "UI.Page(...children) | UI.Page(props, ...children)",
      props: {
        dense: "boolean",
        slots: "{ default? }",
        class: "string",
        style: "object"
      },
      slots: {
        default: "Page content"
      },
      returns: "HTMLDivElement",
      description: "Contenitore pagina base."
    };
  }

  UI.AppShell = (...args) => {
    const { props } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const header = renderSlotToArray(slots, "header", {}, props.header);
    const drawer = renderSlotToArray(slots, "drawer", {}, props.drawer);
    const page = renderSlotToArray(slots, "page", {}, props.page);
    const noDrawer = props.noDrawer === true;
    const drawerNodes = noDrawer ? [] : drawer;
    const shellCls = uiClass(["cms-shell", noDrawer ? "no-drawer" : ""]);
    return _h.div({ class: uiClass(["cms-app", props.class]), style: props.style },
      ...header,
      _h.div({ class: shellCls },
        ...drawerNodes,
        ...page
      )
    );
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.AppShell = {
      signature: "UI.AppShell(props)",
      props: {
        header: "Node|Function|Array",
        drawer: "Node|Function|Array",
        page: "Node|Function|Array",
        noDrawer: "boolean",
        slots: "{ header?, drawer?, page? }",
        class: "string",
        style: "object"
      },
      slots: {
        header: "Header content",
        drawer: "Drawer content",
        page: "Page content"
      },
      returns: "HTMLDivElement",
      description: "Shell applicazione con header/drawer/page."
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

    const bg = _h.div({
      class: uiClass(["cms-parallax-bg", props.bgClass]),
    });
    const contentNodes = children.length
      ? renderSlotToArray(slots, "default", {}, children)
      : renderSlotToArray(slots, "content", {}, props.content);
    const content = _h.div(
      { class: uiClass(["cms-parallax-content", props.contentClass]) },
      ...contentNodes
    );
    const wrapProps = CMSwift.omit(props, [
      "height", "speed", "startTop", "image", "src", "background",
      "overlay", "color", "bgPosition", "bgSize",
      "bgClass", "contentClass", "content", "class", "style", "slots"
    ]);
    wrapProps.class = uiClass(["cms-parallax", props.class]);
    const wrap = _h.div(wrapProps, bg, content);
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
  // UI.Parallax({ src: "/assets/hero.jpg", height: "280px", speed: 0.2 }, _h.h2("Hello"));

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
        const node = _h.div({ class: `cms-toast ${t.type || "info"}` },
          _h.div({ class: "t-title" }, t.title || (t.type || "info").toUpperCase()),
          t.message ? _h.div(t.message) : null
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
    const errors = _rod({});
    const touched = _rod({});
    const submitting = _rod(false);
    const submitError = _rod(null);

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
      const r = _rod("");
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
        console.log("onInput", name, validateOn);
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

    const el = _h.form({
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

  UI.CardHeader = (...args) => {
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

    return _h.div(p, ...renderSlotToArray(slots, "default", {}, children));
  };
  UI.CardBody = (...args) => {
    const { props, children } = CMSwift.uiNormalizeArgs(args);
    const slots = props.slots || {};
    const cls = uiClass(["cms-card-body", props.class]);
    const p = CMSwift.omit(props, ["slots"]);
    p.class = cls;
    return _h.div(p, ...renderSlotToArray(slots, "default", {}, children));
  };
  UI.CardFooter = (...args) => {
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

    return _h.div(p, ...renderSlotToArray(slots, "default", {}, children));
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.CardHeader = {
      signature: "UI.CardHeader(...children) | UI.CardHeader(props, ...children)",
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
    UI.meta.CardBody = {
      signature: "UI.CardBody(...children) | UI.CardBody(props, ...children)",
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
    UI.meta.CardFooter = {
      signature: "UI.CardFooter(...children) | UI.CardFooter(props, ...children)",
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
    let entry = null;
    let lastActive = null;

    const buildContent = (close) => {
      const ctx = { close };
      const titleFallback = props.title != null ? props.title : props.header;
      const titleNodes = renderSlotToArray(slots, "title", ctx, titleFallback);
      const contentFallback = props.content != null
        ? (typeof props.content === "function" ? props.content(ctx) : props.content)
        : (children && children.length ? children : null);
      let contentNodes = renderSlotToArray(slots, "content", ctx, contentFallback);
      if (!contentNodes.length) contentNodes = renderSlotToArray(slots, "default", ctx, contentFallback);
      const actionsFallback = props.actions != null
        ? (typeof props.actions === "function" ? props.actions(ctx) : props.actions)
        : null;
      const actionsNodes = renderSlotToArray(slots, "actions", ctx, actionsFallback);

      const titleEl = titleNodes.length ? _h.div({ class: "cms-dialog-title" }, ...titleNodes) : null;
      const bodyEl = _h.div({ class: "cms-dialog-body" }, ...contentNodes);
      const actionsEl = actionsNodes.length ? _h.div({ class: "cms-dialog-actions" }, ...actionsNodes) : null;
      return [titleEl, bodyEl, actionsEl].filter(Boolean);
    };

    const open = () => {
      if (entry) return entry;
      lastActive = document.activeElement;
      const persistent = props.persistent === true;
      entry = CMSwift.overlay.open(({ close }) => buildContent(close), {
        type: "dialog",
        backdrop: true,
        lockScroll: true,
        trapFocus: true,
        closeOnOutside: !persistent,
        closeOnBackdrop: !persistent,
        closeOnEsc: !persistent,
        className: uiClassStatic(["cms-dialog", props.class]),
        onClose: () => {
          entry = null;
          props.onClose?.();
          if (lastActive && typeof lastActive.focus === "function") {
            setTimeout(() => lastActive.focus(), 0);
          }
        }
      });
      if (props.style) Object.assign(entry.panel.style, props.style);
      overlayEnter(entry);
      props.onOpen?.();
      return entry;
    };

    const close = () => {
      if (!entry) return;
      const toClose = entry;
      overlayLeave(toClose, () => CMSwift.overlay.close(toClose.id));
    };

    const isOpen = () => !!entry;

    return { open, close, isOpen };
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Dialog = {
      signature: "UI.Dialog(props) -> { open, close }",
      props: {
        title: "String|Node|Function|Array",
        content: "Node|Function|Array|({ close })=>Node",
        actions: "Node|Function|Array|({ close })=>Node",
        persistent: "boolean",
        slots: "{ title?, content?, actions?, default? }",
        class: "string",
        style: "object"
      },
      events: {
        onOpen: "void",
        onClose: "void"
      },
      slots: {
        title: "Dialog title ({ close })",
        content: "Dialog body ({ close })",
        actions: "Dialog actions ({ close })",
        default: "Fallback body content ({ close })"
      },
      description: "Dialog overlay con focus trap e scroll lock.",
      returns: "Object { open(), close(), isOpen() }"
    };
  }

  function closeBackdrop(backdrop) {
    if (backdrop && backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
  }

  function renderDialog({ title, message, contentNode, okText, cancelText, showCancel, onOk, onCancel, persistent }) {
    ensureModalRoot();

    const backdrop = _h.div({
      class: "cms-dialog-backdrop", onClick: (e) => {
        if (e.target === backdrop && persistent !== true) onCancel?.();
      }
    });

    const titleNodes = renderSlotToArray(null, "default", {}, title);
    const messageNodes = renderSlotToArray(null, "default", {}, message);
    const contentNodes = renderSlotToArray(null, "default", {}, contentNode);

    const dialog = _h.div({ class: "cms-dialog cms-panel" },
      titleNodes.length ? _h.h3(...titleNodes) : null,
      messageNodes.length ? _h.p(...messageNodes) : null,
      ...contentNodes,
      _h.div({ class: "cms-dialog-actions" },
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
        contentNode: _h.div(input),
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
  // UI.Table MVP
  // ===============================
  function toValue(rows) {
    if (typeof rows === "function") return rows();
    return rows || [];
  }

  function defaultCompare(a, b) {
    if (a == null && b == null) return 0;
    if (a == null) return -1;
    if (b == null) return 1;
    if (typeof a === "number" && typeof b === "number") return a - b;
    return String(a).localeCompare(String(b));
  }

  UI.Table = (...args) => {
    const { props } = CMSwift.uiNormalizeArgs(args);
    // props:
    // columns: [{ key, label, sortable, get(row), render(row), width, align }]
    // rows: array | () => array (reactive)
    // rowKey: "id" | (row)=>string
    // loading: boolean | () => boolean
    // pageSize: number
    // initialSort: { key, dir: "asc|desc" }
    // actions: (row) => Node|Node[]   (per row)
    // emptyText, loadingText
    // onRowClick(row)
    const columns = props.columns || [];
    const pageSize0 = props.pageSize || 10;

    const [getPage, setPage] = app.reactive.signal(1);
    const [getPageSize, setPageSize] = app.reactive.signal(pageSize0);
    const [getSort, setSort] = app.reactive.signal(props.initialSort || null); // {key,dir}

    const wrapProps = CMSwift.omit(props, [
      "columns", "rows", "rowKey", "loading", "pageSize", "initialSort",
      "actions", "emptyText", "loadingText", "onRowClick", "onRowDblClick",
      "tableClass", "cardClass", "dense", "striped", "hover", "slots"
    ]);
    wrapProps.class = uiClass(["cms-table-card", props.class, props.cardClass]);
    if (props.dense != null) wrapProps.dense = props.dense;
    const wrap = UI.Card(wrapProps);

    // header row
    const thead = _h.thead(
      _h.tr(
        ...columns.map(col => {
          const isSortable = col.sortable !== false;
          const thStyle = {};
          if (col.width) thStyle.width = col.width;
          if (col.align) thStyle.textAlign = col.align;

          if (!isSortable) {
            const labelNodes = renderSlotToArray(null, "default", {}, col.label || col.key);
            return _h.th({ style: thStyle, class: col.headerClass }, ...labelNodes);
          }

          const labelText = (typeof col.label === "string" || typeof col.label === "number")
            ? col.label
            : (col.key || "");
          return _h.th({
            class: uiClass(["cms-table-sort", col.headerClass]),
            style: thStyle,
            onClick: () => {
              const s = getSort();
              if (!s || s.key !== col.key) setSort({ key: col.key, dir: "asc" });
              else if (s.dir === "asc") setSort({ key: col.key, dir: "desc" });
              else setSort(null);
              setPage(1);
            }
          }, () => {
            const s = getSort();
            const active = s && s.key === col.key;
            const arrow = active ? (s.dir === "asc" ? "▲" : "▼") : "↕";
            return `${labelText} ` + arrow;
          });
        }),
        props.actions ? _h.th({ style: { textAlign: "right" } }, "Azioni") : null
      )
    );

    const tbody = _h.tbody();

    const tableClass = uiClass(["cms-table", uiWhen(props.dense, "dense"), props.tableClass]);
    const table = _h.table({ class: tableClass }, thead, tbody);

    const wrapTable = _h.div({ class: "cms-table-wrap" }, table);

    // footer/pager
    const pagerInfo = _h.div({ class: "cms-table-chip" }, "");
    const btnPrev = UI.Btn({ onClick: () => setPage(Math.max(1, getPage() - 1)) }, "‹");
    const btnNext = UI.Btn({ onClick: () => setPage(getPage() + 1) }, "›");

    const sizeSelect = _h.select({ class: "cms-input", style: { width: "110px" } },
      ...[5, 10, 20, 50].map(n => _h.option({ value: String(n) }, String(n)))
    );
    sizeSelect.value = String(getPageSize());
    sizeSelect.addEventListener("change", () => {
      setPageSize(Number(sizeSelect.value) || pageSize0);
      setPage(1);
    });

    const footer = _h.div({ class: "cms-table-foot" },
      _h.div({ class: "cms-row" },
        pagerInfo,
        _h.div({ class: "cms-table-chip" }, "Rows"),
        sizeSelect
      ),
      _h.div({ class: "cms-table-pager" },
        btnPrev,
        _h.div({ class: "cms-table-chip" }, () => `Page ${getPage()}`),
        btnNext
      )
    );

    // render rows reattivo
    app.reactive.effect(() => {
      const rows = toValue(props.rows);
      const loading = typeof props.loading === "function" ? !!props.loading() : !!props.loading;

      tbody.innerHTML = "";

      // loading state
      if (loading) {
        const loadingNodes = renderSlotToArray(null, "default", {}, props.loadingText || "Loading...");
        const tr = _h.tr(
          _h.td({ colSpan: String(columns.length + (props.actions ? 1 : 0)), class: "cms-muted" },
            ...loadingNodes
          )
        );
        tbody.appendChild(tr);
        pagerInfo.textContent = "Loading…";
        return;
      }

      // apply sort
      let list = rows.slice();
      const s = getSort();
      if (s) {
        const col = columns.find(c => c.key === s.key);
        if (col) {
          const getter = col.get || ((r) => r?.[col.key]);
          const cmp = col.compare || defaultCompare;
          list.sort((a, b) => {
            const av = getter(a);
            const bv = getter(b);
            const out = cmp(av, bv, a, b);
            return s.dir === "asc" ? out : -out;
          });
        }
      }

      // pagination
      const pageSize = getPageSize();
      const total = list.length;
      const pages = Math.max(1, Math.ceil(total / pageSize));
      const page = Math.min(getPage(), pages);
      if (page !== getPage()) setPage(page);

      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const pageRows = list.slice(start, end);

      pagerInfo.textContent = total
        ? `${start + 1}-${Math.min(end, total)} of ${total}`
        : "0";

      btnPrev.disabled = page <= 1;
      btnNext.disabled = page >= pages;

      // empty state
      if (pageRows.length === 0) {
        const emptyNodes = renderSlotToArray(null, "default", {}, props.emptyText || "Nessun dato");
        const tr = _h.tr(
          _h.td({ colSpan: String(columns.length + (props.actions ? 1 : 0)), class: "cms-muted" },
            ...emptyNodes
          )
        );
        tbody.appendChild(tr);
        return;
      }

      // rows render
      for (const row of pageRows) {
        const tr = _h.tr({
          onClick: props.onRowClick ? () => props.onRowClick(row) : null,
          onDblclick: props.onRowDblClick ? () => props.onRowDblClick(row) : null,
          style: (props.onRowClick || props.onRowDblClick) ? { cursor: "pointer" } : null
        });
        if (props.rowKey) {
          const key = typeof props.rowKey === "function" ? props.rowKey(row) : row?.[props.rowKey];
          if (key != null) tr.dataset.key = String(key);
        }

        for (const col of columns) {
          const tdStyle = {};
          if (col.align) tdStyle.textAlign = col.align;

          let cell;
          if (col.render) cell = col.render(row);
          else {
            const v = (col.get ? col.get(row) : row?.[col.key]);
            cell = (v == null ? "" : String(v));
          }
          const cellNodes = renderSlotToArray(null, "default", { row, col }, cell);
          tr.appendChild(_h.td({ style: tdStyle }, ...cellNodes));
        }

        // actions column
        if (props.actions) {
          const actionsNode = props.actions(row);
          const actionsNodes = renderSlotToArray(null, "default", { row }, actionsNode);
          tr.appendChild(
            _h.td({ style: { textAlign: "right" } },
              _h.div({ class: "cms-table-actions" },
                ...actionsNodes
              )
            )
          );
        }

        tbody.appendChild(tr);
      }
    }, "UI.Table:render");

    wrap.appendChild(wrapTable);
    wrap.appendChild(footer);
    return wrap;
  };
  if (CMSwift.isDev?.()) {
    UI.meta = UI.meta || {};
    UI.meta.Table = {
      signature: "UI.Table(props)",
      props: {
        columns: "Array<{ key, label?, sortable?, get?, render?, width?, align?, compare? }>",
        rows: "Array|() => Array",
        rowKey: "string|((row)=>string)",
        loading: "boolean|() => boolean",
        pageSize: "number",
        initialSort: "{ key, dir: 'asc'|'desc' }",
        actions: "(row)=>Node|Array",
        emptyText: "string|Node|Function|Array",
        loadingText: "string|Node|Function|Array",
        dense: "boolean",
        tableClass: "string",
        cardClass: "string",
        class: "string",
        style: "object"
      },
      events: {
        onRowClick: "(row) => void",
        onRowDblClick: "(row) => void"
      },
      returns: "HTMLDivElement",
      description: "Tabella con ordinamento, paginazione e azioni per riga."
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
      const box = _h.div(
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

  UI.Popover = (props = {}) => {
    const slots = props.slots || {};
    let entry = null;

    const buildContent = (close) => {
      const ctx = { close };
      const titleNodes = renderSlotToArray(slots, "title", ctx, props.title);
      const raw = typeof props.content === "function" ? props.content(ctx) : props.content;
      let contentNodes = renderSlotToArray(slots, "content", ctx, raw);
      if (!contentNodes.length) contentNodes = renderSlotToArray(slots, "default", ctx, raw);
      const actionsRaw = typeof props.actions === "function" ? props.actions(ctx) : props.actions;
      const actionsNodes = renderSlotToArray(slots, "actions", ctx, actionsRaw);

      const titleEl = titleNodes.length ? _h.div({ class: "cms-dialog-title" }, ...titleNodes) : null;
      const bodyEl = _h.div({ class: "cms-dialog-body" }, ...contentNodes);
      const actionsEl = actionsNodes.length ? _h.div({ class: "cms-dialog-actions" }, ...actionsNodes) : null;
      return [titleEl, bodyEl, actionsEl].filter(Boolean);
    };

    const open = (anchorEl) => {
      const a = anchorEl || props.anchorEl;
      if (!a) return null;
      if (entry) {
        const prev = entry;
        overlayLeave(prev, () => CMSwift.overlay.close(prev.id));
      }
      entry = CMSwift.overlay.open(({ close }) => buildContent(close), {
        type: "popover",
        anchorEl: a,
        placement: props.placement || "bottom-start",
        offsetY: props.offsetY ?? 8,
        offsetX: props.offsetX ?? 0,
        backdrop: props.backdrop === true,
        lockScroll: props.lockScroll === true,
        trapFocus: props.trapFocus === true,
        closeOnOutside: props.closeOnOutside !== false,
        closeOnEsc: props.closeOnEsc !== false,
        className: uiClassStatic(["cms-dialog", props.class]),
        onClose: () => {
          entry = null;
          props.onClose?.();
        }
      });
      if (props.style) Object.assign(entry.panel.style, props.style);
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
    UI.meta.Popover = {
      signature: "UI.Popover(props) -> { open, close }",
      props: {
        title: "String|Node|Function|Array",
        content: "Node|Function|Array|({ close })=>Node",
        actions: "Node|Function|Array|({ close })=>Node",
        placement: "string",
        offsetX: "number",
        offsetY: "number",
        backdrop: "boolean",
        lockScroll: "boolean",
        trapFocus: "boolean",
        closeOnOutside: "boolean",
        closeOnEsc: "boolean",
        slots: "{ title?, content?, actions?, default? }",
        class: "string",
        style: "object",
        onOpen: "function",
        onClose: "function"
      },
      slots: {
        title: "Popover title ({ close })",
        content: "Popover body ({ close })",
        actions: "Popover actions ({ close })",
        default: "Fallback body ({ close })"
      },
      events: {
        onOpen: "void",
        onClose: "void"
      },
      returns: "Object { open(), close() }",
      description: "Popover overlay ancorato, piu ricco del menu."
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
      const box = _h.div(
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

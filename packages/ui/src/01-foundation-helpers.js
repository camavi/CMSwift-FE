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

const isUIPlainObject = (value) => value && typeof value === "object" && !value.nodeType && !Array.isArray(value) && !(value instanceof Function);
const isListItemNode = (value) => value && value.nodeType === 1 && String(value.tagName || "").toLowerCase() === "li";
const asNodeArray = (value) => {
  if (value == null || value === false || value === "") return [];
  return Array.isArray(value) ? value : [value];
};

CMSwift.isUIPlainObject = isUIPlainObject;
CMSwift.isListItemNode = isListItemNode;
CMSwift.asNodeArray = asNodeArray;

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
  padding: "Padding applied to the component root element.",
  persistent: "Prevents closing via outside click or Escape.",
  placeholder: "Placeholder text for inputs.",
  placement: "Overlay placement relative to the target/anchor.",
  prefix: "Content rendered before the main control.",
  readonly: "Prevents editing while keeping focus and selection.",
  removable: "Shows a remove affordance for chips/items.",
  right: "Content or configuration for the right region.",
  rowKey: "Key or function used to derive unique row IDs.",
  rows: "Row data array for table-like components.",
  margin: "Margin applied to the component root element.",
  maxHeight: "Maximum height constraint (number interpreted as px or CSS length).",
  maxWidth: "Maximum width constraint (number interpreted as px or CSS length).",
  minHeight: "Minimum height constraint (number interpreted as px or CSS length).",
  minWidth: "Minimum width constraint (number interpreted as px or CSS length).",
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
  padding: ["number", "CSS units", ...DEFAULT_SIZE],
  margin: ["number", "CSS units", ...DEFAULT_SIZE],
  width: ["number", "CSS units", ...DEFAULT_SIZE],
  minWidth: ["number", "CSS units", ...DEFAULT_SIZE],
  maxWidth: ["number", "CSS units", ...DEFAULT_SIZE],
  height: ["number", "CSS units", ...DEFAULT_SIZE],
  minHeight: ["number", "CSS units", ...DEFAULT_SIZE],
  maxHeight: ["number", "CSS units", ...DEFAULT_SIZE],
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
  padding: "layout",
  margin: "layout",
  width: "layout",
  minWidth: "layout",
  maxWidth: "layout",
  height: "layout",
  minHeight: "layout",
  maxHeight: "layout",
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
    padding: meta.props.padding || "string|number",
    margin: meta.props.margin || "string|number",
    width: meta.props.width || "string|number",
    minWidth: meta.props.minWidth || "string|number",
    maxWidth: meta.props.maxWidth || "string|number",
    height: meta.props.height || "string|number",
    minHeight: meta.props.minHeight || "string|number",
    maxHeight: meta.props.maxHeight || "string|number",
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
const STYLE_PROP_TOKEN_MAP = {
  padding: "p",
  paddingTop: "p",
  paddingRight: "p",
  paddingBottom: "p",
  paddingLeft: "p",
  paddingInline: "p",
  paddingInlineStart: "p",
  paddingInlineEnd: "p",
  paddingBlock: "p",
  paddingBlockStart: "p",
  paddingBlockEnd: "p",
  margin: "m",
  marginTop: "m",
  marginRight: "m",
  marginBottom: "m",
  marginLeft: "m",
  marginInline: "m",
  marginInlineStart: "m",
  marginInlineEnd: "m",
  marginBlock: "m",
  marginBlockStart: "m",
  marginBlockEnd: "m",
  width: "w",
  minWidth: "w",
  maxWidth: "w",
  height: "h",
  minHeight: "h",
  maxHeight: "h"
};
const camelToCssProperty = (name) => name.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
const applyStyleProp = (obj, value, name, tokenName) => {
  if (value == null || value === false || value === "") return;
  obj.style.setProperty(camelToCssProperty(name), unitCover(value, tokenName));
};
function setPropertyProps(obj, props) {
  if (props.size) {
    if (typeof props.size === "number") {
      obj.style.setProperty("--cms-font-size", `${props.size}px`);
    } else if (CMSwift.uiSizes.includes(props.size)) {
      obj.style.setProperty("--cms-font-size", `var(--cms-font-size-${props.size})`);
    }
  }

  Object.entries(STYLE_PROP_TOKEN_MAP).forEach(([name, tokenName]) => {
    applyStyleProp(obj, props[name], name, tokenName);
  });

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


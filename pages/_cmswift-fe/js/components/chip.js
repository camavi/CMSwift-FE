/*
TODO: dobbiamo implementare questa lista, il senso di questo è portare UI.Chip alla opera del arte
  - non ci sono ancora i CSS per il chip
  - manca creare i colori per il chip
  - manca iconRight
  - manca i size
  - manca Clickable
  - manca Removable
  - manca Square
  - manca Long label truncation

  - il meta dati vorrei creare molto più completo con:
    - descrizione più dettagliata
    - esempi
    - ogni props con la sua descrizione dettagliata, ogni props con tipo, ogni props con default, ogni props con valori accettati, ogni props con categoria
    - tipi di slot
  - usare il CSS pages/_cmswift-fe/css/ui.css dovi
*/
UI.Chip = (...args) => {
  const { props, children } = CMSwift.uiNormalizeArgs(args);
  const slots = props.slots || {};
  const cls = ["cms-chip", props.dense ? "dense" : "", props.outline ? "outline" : "", props.class]
    .filter(Boolean).join(" ");
  const p = CMSwift.omit(props, ["label", "icon", "removable", "onRemove", "dense", "outline", "slots"]);
  p.class = cls;
  p.style = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 10px",
    borderRadius: "999px",
    border: "1px solid var(--cms-border)",
    ...(props.style || {})
  };

  const iconFallback = props.icon
    ? (typeof props.icon === "string" ? UI.Icon({ name: props.icon, size: 14 }) : CMSwift.ui.slot(props.icon, { as: "icon" }))
    : null;
  const iconNode = CMSwift.ui.renderSlot(slots, "icon", {}, iconFallback);
  const labelNodes = renderSlotToArray(slots, "label", {}, props.label);
  const labelNode = labelNodes.length ? labelNodes : renderSlotToArray(slots, "default", {}, children);

  const iconNodes = renderSlotToArray(null, "default", {}, iconNode);
  const wrap = _h.span(p, ...iconNodes, ...(labelNode.length ? labelNode : [""]));
  if (props.removable) {
    const btn = UI.Btn({ class: "cms-chip-remove", onClick: props.onRemove }, "×");
    btn.style.padding = "2px 6px";
    wrap.appendChild(btn);
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
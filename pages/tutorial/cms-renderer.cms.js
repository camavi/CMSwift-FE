const infoLine = (label, getter) => _.div({ class: "cms-m-b-xs" }, _.b(`${label}: `), _.span(getter));

const row = (...children) => _.div({
  style: {
    display: "grid",
    gap: "16px",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    alignItems: "start"
  }
}, ...children);

const stack = (...children) => _.div({
  style: {
    display: "grid",
    gap: "12px"
  }
}, ...children);

const actionRow = (...children) => _.div({
  style: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap"
  }
}, ...children);

const formatAttr = (id, name) => () => {
  const el = document.getElementById(id);
  if (!el) return "missing";
  const value = el.getAttribute(name);
  return value == null ? "absent" : JSON.stringify(value);
};

const formatProp = (id, name) => () => {
  const el = document.getElementById(id);
  if (!el) return "missing";
  return JSON.stringify(el[name]);
};

const formatChildNodes = (id) => () => {
  const el = document.getElementById(id);
  if (!el) return "missing";
  return String(el.childNodes.length);
};

const inputValue = _.rod("CMSwift");
const inputDisabled = _.rod(false);
const inputRequired = _.rod(true);
const inputReadonly = _.rod(false);
const inputPlaceholderEnabled = _.rod(true);

const selectValue = _.rod("ops");
const selectDisabled = _.rod(false);
const selectRequired = _.rod(false);

const ariaExpanded = _.rod(false);
const ariaControlsEnabled = _.rod(true);
const dataStateEnabled = _.rod(true);

const svgActive = _.rod(true);
const svgLabelEnabled = _.rod(true);

const dynamicMode = _.rod("node");
const classPrimaryEnabled = _.rod(true);
const classOutlineEnabled = _.rod(false);
const classDenseEnabled = _.rod(false);
const eventClicks = _.rod(0);
const eventCustomHits = _.rod(0);
const eventLast = _.rod("none");
const eventMode = _.rod("alpha");
const eventHandler = _.rod(null);
const eventOnceHits = _.rod(0);
const eventCaptureHits = _.rod(0);
const eventPassiveHits = _.rod(0);

const setEventHandler = (mode) => {
  eventMode.value = mode;
  eventHandler.value = (event) => {
    eventClicks.value += 1;
    eventLast.value = `${mode}:${event.type}`;
  };
};

setEventHandler("alpha");

const rendererSamples = {
  bridge: {
    code: [
      _.input({
        disabled: inputDisabled,
        required: inputRequired,
        readOnly: inputReadonly,
        placeholder: () => inputPlaceholderEnabled.value ? "Renderer probe" : null,
        "aria-invalid": () => inputRequired.value && !inputValue.value ? "true" : null,
        "data-empty": () => inputValue.value ? null : "true"
      }),
      _.select({
        value: selectValue,
        disabled: selectDisabled,
        required: selectRequired,
        "data-mode": () => selectRequired.value ? "strict" : null
      })
    ],
    sample: [
      '_.input({',
      '  disabled: inputDisabled,',
      '  required: inputRequired,',
      '  readOnly: inputReadonly,',
      '  placeholder: () => inputPlaceholderEnabled.value ? "Renderer probe" : null,',
      '  "aria-invalid": () => inputRequired.value && !inputValue.value ? "true" : null,',
      '  "data-empty": () => inputValue.value ? null : "true"',
      '});',
      '_.select({',
      '  value: selectValue,',
      '  disabled: selectDisabled,',
      '  required: selectRequired,',
      '  "data-mode": () => selectRequired.value ? "strict" : null',
      '});'
    ]
  },
  dynamic: {
    code: [
      _.div(
        () => dynamicMode.value === "node"
          ? _.span({ class: "cms-badge color-success" }, "single node")
          : dynamicMode.value === "array"
            ? [
              _.span({ class: "cms-badge color-info" }, "array A"),
              _.span({ class: "cms-badge color-warning" }, "array B")
            ]
            : null
      )
    ],
    sample: [
      '_.div(() => dynamicMode.value === "node"',
      '  ? _.span("single node")',
      '  : dynamicMode.value === "array"',
      '    ? [_.span("array A"), _.span("array B")]',
      '    : null',
      ');'
    ]
  },
  classMap: {
    code: [
      _.div({
        class: [
          "cms-btn",
          {
            "color-primary": classPrimaryEnabled,
            outline: classOutlineEnabled,
            dense: classDenseEnabled
          }
        ]
      }, "Class probe")
    ],
    sample: [
      '_.div({',
      '  class: [',
      '    "cms-btn",',
      '    {',
      '      "color-primary": classPrimaryEnabled,',
      '      outline: classOutlineEnabled,',
      '      dense: classDenseEnabled',
      '    }',
      '  ]',
      '}, "Class probe");'
    ]
  },
  events: {
    code: [
      _.button({
        onClick: eventHandler,
        "on:cmsprobe": {
          handler: () => {
            eventCustomHits.value += 1;
            eventLast.value = "custom:cmsprobe";
          }
        }
      }, "Event probe")
    ],
    sample: [
      'const eventHandler = _.rod((event) => {',
      '  eventClicks.value += 1;',
      '  eventLast.value = "alpha:" + event.type;',
      '});',
      '_.button({',
      '  onClick: eventHandler,',
      '  "on:cmsprobe": {',
      '    handler: () => {',
      '      eventCustomHits.value += 1;',
      '      eventLast.value = "custom:cmsprobe";',
      '    }',
      '  }',
      '}, "Event probe");'
    ]
  },
  eventOptions: {
    code: [
      _.button({
        onClick: {
          handler: () => { eventOnceHits.value += 1; },
          options: { once: true }
        }
      }, "Once"),
      _.div({
        onClick: {
          handler: () => { eventCaptureHits.value += 1; },
          options: { capture: true }
        }
      },
        _.button("Capture child")
      ),
      _.div({
        "on:wheel": {
          handler: () => { eventPassiveHits.value += 1; },
          options: { passive: true }
        }
      }, "Passive wheel")
    ],
    sample: [
      '_.button({',
      '  onClick: {',
      '    handler: onceHandler,',
      '    options: { once: true }',
      '  }',
      '}, "Once");',
      '_.div({',
      '  onClick: {',
      '    handler: captureHandler,',
      '    options: { capture: true }',
      '  }',
      '}, _.button("Capture child"));',
      '_.div({',
      '  "on:wheel": {',
      '    handler: wheelHandler,',
      '    options: { passive: true }',
      '  }',
      '}, "Passive wheel");'
    ]
  }
};

const cmsRenderer = _.div({ class: "cms-panel cms-page" },
  _.h1("CMS Renderer"),
  _.p("Pagina di verifica browser del bridge `props -> DOM` di CMSwift. Qui controlliamo il DOM reale per input, select, attributi `aria/data`, SVG e children dinamici, cosi i fix del renderer restano osservabili e ripetibili."),
  _.Card({ title: "Checklist", subtitle: "Cose da verificare a colpo d'occhio" },
    _.List(
      _.Item("boolean props: disabled, required, readOnly cambiano sia property sia presenza/assenza attributo"),
      _.Item("attributi aria/data: null o false li rimuove, stringhe li serializza correttamente"),
      _.Item("class: supporta string, array annidati e object-map reattivi"),
      _.Item("eventi: supporta attach, detach con null/false, handler via rod, custom event `on:...` e options `once/capture/passive`"),
      _.Item("select: value e attributi richiesti restano coerenti sul nodo DOM"),
      _.Item("SVG: aria/data attr e prop numeriche vengono applicate senza rompere il nodo"),
      _.Item("children function: possono restituire nodo singolo, array o null")
    )
  ),
  boxCode("Snippet chiave del renderer", rendererSamples.bridge, 24),
  boxCode("Class map", rendererSamples.classMap, 24),
  boxCode("Event binding", rendererSamples.events, 24),
  boxCode("Event options", rendererSamples.eventOptions, 24),
  boxCode("Children dinamici", rendererSamples.dynamic, 24),
  row(
    _.Card({ title: "Input boolean props", subtitle: "Verifica property DOM + attributi reali" },
      stack(
        _.input({
          id: "renderer-input-probe",
          class: "cms-input-raw",
          type: "text",
          value: inputValue,
          disabled: inputDisabled,
          required: inputRequired,
          readOnly: inputReadonly,
          placeholder: () => inputPlaceholderEnabled.value ? "Renderer probe" : null,
          "aria-invalid": () => inputRequired.value && !inputValue.value ? "true" : null,
          "data-empty": () => inputValue.value ? null : "true",
          style: { width: "100%" }
        }),
        actionRow(
          _.Btn({ size: "sm", outline: true, onClick: () => { inputDisabled.value = !inputDisabled.value; } }, () => inputDisabled.value ? "disabled=true" : "disabled=false"),
          _.Btn({ size: "sm", outline: true, onClick: () => { inputRequired.value = !inputRequired.value; } }, () => inputRequired.value ? "required=true" : "required=false"),
          _.Btn({ size: "sm", outline: true, onClick: () => { inputReadonly.value = !inputReadonly.value; } }, () => inputReadonly.value ? "readOnly=true" : "readOnly=false"),
          _.Btn({ size: "sm", onClick: () => { inputPlaceholderEnabled.value = !inputPlaceholderEnabled.value; } }, () => inputPlaceholderEnabled.value ? "placeholder on" : "placeholder off"),
          _.Btn({ size: "sm", color: "warning", onClick: () => { inputValue.value = ""; } }, "clear value")
        ),
        infoLine("DOM.disabled", formatProp("renderer-input-probe", "disabled")),
        infoLine("DOM.required", formatProp("renderer-input-probe", "required")),
        infoLine("DOM.readOnly", formatProp("renderer-input-probe", "readOnly")),
        infoLine("attr placeholder", formatAttr("renderer-input-probe", "placeholder")),
        infoLine("attr aria-invalid", formatAttr("renderer-input-probe", "aria-invalid")),
        infoLine("attr data-empty", formatAttr("renderer-input-probe", "data-empty"))
      )
    ),
    _.Card({ title: "Select + attr removal", subtitle: "Controllo su value, required e custom attr" },
      stack(
        _.select({
          id: "renderer-select-probe",
          class: "cms-input-raw",
          value: selectValue,
          disabled: selectDisabled,
          required: selectRequired,
          "data-mode": () => selectRequired.value ? "strict" : null,
          style: { width: "100%" }
        },
          _.option({ value: "ops" }, "Operations"),
          _.option({ value: "sales" }, "Sales"),
          _.option({ value: "finance" }, "Finance")
        ),
        actionRow(
          _.Btn({ size: "sm", outline: true, onClick: () => { selectDisabled.value = !selectDisabled.value; } }, () => selectDisabled.value ? "disabled=true" : "disabled=false"),
          _.Btn({ size: "sm", outline: true, onClick: () => { selectRequired.value = !selectRequired.value; } }, () => selectRequired.value ? "required=true" : "required=false"),
          _.Btn({ size: "sm", onClick: () => { selectValue.value = "ops"; } }, "ops"),
          _.Btn({ size: "sm", onClick: () => { selectValue.value = "sales"; } }, "sales"),
          _.Btn({ size: "sm", onClick: () => { selectValue.value = "finance"; } }, "finance")
        ),
        infoLine("DOM.value", formatProp("renderer-select-probe", "value")),
        infoLine("DOM.disabled", formatProp("renderer-select-probe", "disabled")),
        infoLine("DOM.required", formatProp("renderer-select-probe", "required")),
        infoLine("attr data-mode", formatAttr("renderer-select-probe", "data-mode"))
      )
    )
  ),
  row(
    _.Card({ title: "ARIA / data attributes", subtitle: "Il DOM deve mostrare la presenza reale degli attributi" },
      stack(
        _.button({
          id: "renderer-aria-probe",
          class: "cms-btn color-primary",
          type: "button",
          "aria-expanded": () => ariaExpanded.value ? "true" : "false",
          "aria-controls": () => ariaControlsEnabled.value ? "renderer-aria-panel" : null,
          "data-state": () => dataStateEnabled.value ? (ariaExpanded.value ? "open" : "closed") : null,
          onClick: () => { ariaExpanded.value = !ariaExpanded.value; }
        }, () => ariaExpanded.value ? "Collapse panel" : "Expand panel"),
        _.div({
          id: "renderer-aria-panel",
          hidden: () => !ariaExpanded.value
        }, "Panel controllato via aria-expanded"),
        actionRow(
          _.Btn({ size: "sm", outline: true, onClick: () => { ariaControlsEnabled.value = !ariaControlsEnabled.value; } }, () => ariaControlsEnabled.value ? "aria-controls on" : "aria-controls off"),
          _.Btn({ size: "sm", outline: true, onClick: () => { dataStateEnabled.value = !dataStateEnabled.value; } }, () => dataStateEnabled.value ? "data-state on" : "data-state off")
        ),
        infoLine("attr aria-expanded", formatAttr("renderer-aria-probe", "aria-expanded")),
        infoLine("attr aria-controls", formatAttr("renderer-aria-probe", "aria-controls")),
        infoLine("attr data-state", formatAttr("renderer-aria-probe", "data-state")),
        infoLine("panel.hidden", formatProp("renderer-aria-panel", "hidden"))
      )
    ),
    _.Card({ title: "SVG bridge", subtitle: "Verifica attributi e contenuto dinamico del nodo SVG" },
      stack(
        _.svg({
          id: "renderer-svg-probe",
          viewBox: "0 0 120 48",
          width: 120,
          height: 48,
          role: "img",
          "aria-label": () => svgLabelEnabled.value ? "Renderer status badge" : null,
          "data-tone": () => svgActive.value ? "success" : null
        },
          _.rect({
            x: 4,
            y: 4,
            width: 112,
            height: 40,
            rx: 12,
            fill: () => svgActive.value ? "#16a34a" : "#64748b"
          }),
          _.text({
            x: 60,
            y: 29,
            "text-anchor": "middle",
            fill: "#ffffff",
            style: { fontSize: "13px", fontFamily: "system-ui" }
          }, () => svgActive.value ? "ACTIVE" : "IDLE")
        ),
        actionRow(
          _.Btn({ size: "sm", outline: true, onClick: () => { svgActive.value = !svgActive.value; } }, () => svgActive.value ? "tone=success" : "tone=none"),
          _.Btn({ size: "sm", onClick: () => { svgLabelEnabled.value = !svgLabelEnabled.value; } }, () => svgLabelEnabled.value ? "aria-label on" : "aria-label off")
        ),
        infoLine("attr aria-label", formatAttr("renderer-svg-probe", "aria-label")),
        infoLine("attr data-tone", formatAttr("renderer-svg-probe", "data-tone")),
        infoLine("rect fill", () => {
          const svg = document.getElementById("renderer-svg-probe");
          const rect = svg?.querySelector("rect");
          return rect ? JSON.stringify(rect.getAttribute("fill")) : "missing";
        })
      )
    )
  ),
  _.Card({ title: "Class string / array / object-map", subtitle: "Verifica serializzazione e reattivita del class binding" },
    stack(
      _.div({
        id: "renderer-class-probe",
        class: [
          "cms-btn",
          "cms-m-r-xs",
          {
            "color-primary": classPrimaryEnabled,
            outline: classOutlineEnabled,
            dense: classDenseEnabled
          }
        ]
      }, "Class probe"),
      actionRow(
        _.Btn({ size: "sm", outline: true, onClick: () => { classPrimaryEnabled.value = !classPrimaryEnabled.value; } }, () => classPrimaryEnabled.value ? "color-primary on" : "color-primary off"),
        _.Btn({ size: "sm", outline: true, onClick: () => { classOutlineEnabled.value = !classOutlineEnabled.value; } }, () => classOutlineEnabled.value ? "outline on" : "outline off"),
        _.Btn({ size: "sm", onClick: () => { classDenseEnabled.value = !classDenseEnabled.value; } }, () => classDenseEnabled.value ? "dense on" : "dense off")
      ),
      infoLine("attr class", formatAttr("renderer-class-probe", "class"))
    )
  ),
  _.Card({ title: "Event attach / detach / custom event", subtitle: "Verifica update del listener e supporto a `on:custom-event`" },
    stack(
      _.button({
        id: "renderer-event-probe",
        class: "cms-btn color-secondary",
        type: "button",
        onClick: eventHandler,
        "on:cmsprobe": {
          handler: () => {
            eventCustomHits.value += 1;
            eventLast.value = "custom:cmsprobe";
          }
        }
      }, "Event probe"),
      actionRow(
        _.Btn({ size: "sm", outline: true, onClick: () => { setEventHandler("alpha"); } }, "handler alpha"),
        _.Btn({ size: "sm", outline: true, onClick: () => { setEventHandler("beta"); } }, "handler beta"),
        _.Btn({ size: "sm", color: "warning", onClick: () => { eventHandler.value = null; eventLast.value = "detached"; } }, "detach click"),
        _.Btn({
          size: "sm",
          onClick: () => {
            const target = document.getElementById("renderer-event-probe");
            target?.dispatchEvent(new CustomEvent("cmsprobe", { bubbles: true, detail: { source: "manual" } }));
          }
        }, "dispatch cmsprobe")
      ),
      infoLine("clicks", () => String(eventClicks.value)),
      infoLine("custom hits", () => String(eventCustomHits.value)),
      infoLine("last event", () => eventLast.value),
      infoLine("click attached", () => typeof eventHandler.value === "function" ? "yes" : "no"),
      infoLine("mode", () => eventMode.value)
    )
  ),
  _.Card({ title: "Event options: once / capture / passive", subtitle: "Verifica le opzioni native di addEventListener esposte dal renderer" },
    stack(
      actionRow(
        _.button({
          id: "renderer-once-probe",
          class: "cms-btn color-primary",
          type: "button",
          onClick: {
            handler: () => {
              eventOnceHits.value += 1;
              eventLast.value = "once:click";
            },
            options: { once: true }
          }
        }, "Click once"),
        _.div({
          id: "renderer-capture-probe",
          style: { display: "inline-flex", padding: "4px", border: "1px dashed var(--cms-border)" },
          onClick: {
            handler: () => {
              eventCaptureHits.value += 1;
              eventLast.value = "capture:click";
            },
            options: { capture: true }
          }
        },
          _.button({
            class: "cms-btn outline",
            type: "button",
            onClick: () => {
              eventLast.value = "bubble:child-click";
            }
          }, "Capture child")
        ),
        _.div({
          id: "renderer-passive-probe",
          style: {
            width: "160px",
            height: "56px",
            overflow: "auto",
            border: "1px dashed var(--cms-border)",
            padding: "8px"
          },
          "on:wheel": {
            handler: () => {
              eventPassiveHits.value += 1;
              eventLast.value = "passive:wheel";
            },
            options: { passive: true }
          }
        },
          _.div({ style: { height: "120px" } }, "Wheel here")
        )
      ),
      infoLine("once hits", () => String(eventOnceHits.value)),
      infoLine("capture hits", () => String(eventCaptureHits.value)),
      infoLine("passive hits", () => String(eventPassiveHits.value)),
      _.p({ class: "cms-muted" }, "Il bottone `Click once` deve reagire una sola volta. Nel blocco `Capture child`, il parent cattura il click prima del bubbling normale. Nel box `Wheel here`, il listener e registrato come passive.")
    )
  ),
  _.Card({ title: "Children function -> node / array / null", subtitle: "Caso del renderer corretto nel passo precedente" },
    stack(
      actionRow(
        _.Btn({ size: "sm", onClick: () => { dynamicMode.value = "node"; } }, "single node"),
        _.Btn({ size: "sm", onClick: () => { dynamicMode.value = "array"; } }, "array"),
        _.Btn({ size: "sm", color: "warning", onClick: () => { dynamicMode.value = "empty"; } }, "null")
      ),
      _.div({
        id: "renderer-child-probe",
        style: {
          minHeight: "38px",
          display: "flex",
          gap: "8px",
          alignItems: "center",
          flexWrap: "wrap"
        }
      },
        () => dynamicMode.value === "node"
          ? _.span({ class: "cms-badge color-success" }, "single node")
          : dynamicMode.value === "array"
            ? [
              _.span({ class: "cms-badge color-info" }, "array A"),
              _.span({ class: "cms-badge color-warning" }, "array B")
            ]
            : null
      ),
      infoLine("mode", () => dynamicMode.value),
      infoLine("childNodes", formatChildNodes("renderer-child-probe"))
    )
  )
);

export { cmsRenderer };

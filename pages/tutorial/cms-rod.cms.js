const infoLine = (label, getter) => _.div({ class: "cms-m-b-xs" }, _.b(`${label}: `), _.span(getter));

const actionRow = (...children) => _.div({
  style: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap"
  }
}, ...children);

const stack = (...children) => _.div({
  style: {
    display: "grid",
    gap: "12px"
  }
}, ...children);

const cmsRod = _.component((props, ctx) => {
  const titleRod = _.rod("Inventory sync");
  const countRod = _.rod(3);
  const actionHitsRod = _.rod(0);
  const lastActionRod = _.rod("none");

  const classRod = _.rod(["cms-btn", "color-primary"]);
  const attrRod = _.rod("ready");
  const textRod = _.rod("rodBind active");

  const modelRod = _.rod("ops");

  const [getQty, setQty] = _.signal(5);
  const bridgeRod = _.rodFromSignal(getQty, setQty);

  countRod.action((value) => {
    actionHitsRod.value = actionHitsRod.value + 1;
    lastActionRod.value = `count=${value}`;
  });

  const textProbe = _.Chip({ color: "info" }, "rodBind active");
  const classProbe = _.Btn({ outline: true }, "class probe");
  const attrProbe = _.Chip({ outline: true }, "attr probe");

  const unbindText = _.rodBind(textProbe, textRod, { key: "textContent" });
  const unbindClass = _.rodBind(classProbe, classRod, { key: "class" });
  const unbindAttr = _.rodBind(attrProbe, attrRod, { key: "attr:data-state" });

  const modelInput = _.input({ class: "cms-input-raw", type: "text", placeholder: "rodModel -> input", style: { width: "100%" } });
  const modelSelect = _.select({ class: "cms-input-raw", style: { width: "100%" } },
    _.option({ value: "ops" }, "Operations"),
    _.option({ value: "sales" }, "Sales"),
    _.option({ value: "finance" }, "Finance")
  );
  const disposeModelInput = _.rodModel(modelInput, modelRod, { event: "input" });
  const disposeModelSelect = _.rodModel(modelSelect, modelRod, { event: "change" });

  const bridgeInput = _.input({ class: "cms-input-raw", type: "number", style: { width: "100%" } });
  const disposeBridgeInput = _.rodModel(bridgeInput, bridgeRod, {
    event: "input",
    parse: (value) => value === "" ? 0 : Number(value),
    format: (value) => String(value ?? 0)
  });

  ctx.onDispose(() => {
    unbindText();
    unbindClass();
    unbindAttr();
    disposeModelInput();
    disposeModelSelect();
    disposeBridgeInput();
    bridgeRod.dispose?.();
  });

  const listSample = {
    basic: {
      code: [
        _.Card({ title: "Rod base", subtitle: "Value diretto, action e rendering semplice" },
          stack(
            actionRow(
              _.Btn({ size: "sm", outline: true, onClick: () => { countRod.value -= 1; } }, "count -"),
              _.Btn({ size: "sm", onClick: () => { countRod.value += 1; } }, "count +"),
              _.Btn({ size: "sm", outline: true, onClick: () => { titleRod.value = "Inventory sync"; } }, "title default"),
              _.Btn({ size: "sm", onClick: () => { titleRod.value = "Manual override"; } }, "title override")
            ),
            infoLine("titleRod.value", () => titleRod.value),
            infoLine("countRod.value", () => String(countRod.value)),
            infoLine("action hits", () => String(actionHitsRod.value)),
            infoLine("last action", () => lastActionRod.value),
            _.div({ class: "cms-muted" }, () => `Inline rod render: ${titleRod.value} / ${countRod.value}`)
          )
        )
      ],
      sample: [
        'const titleRod = _.rod("Inventory sync");',
        'const countRod = _.rod(3);',
        'countRod.action((value) => {',
        '  console.log("changed", value);',
        '});',
        '_.div(() => `${titleRod.value} / ${countRod.value}`);'
      ]
    },
    bind: {
      code: [
        _.Card({ title: "rodBind", subtitle: "Binding diretto su nodi DOM reali" },
          stack(
            actionRow(
              _.Btn({ size: "sm", outline: true, onClick: () => { textRod.value = "rodBind active"; } }, "text default"),
              _.Btn({ size: "sm", onClick: () => { textRod.value = "status updated"; } }, "text update"),
              _.Btn({ size: "sm", outline: true, onClick: () => { classRod.value = ["cms-btn", "color-primary"]; } }, "class primary"),
              _.Btn({ size: "sm", onClick: () => { classRod.value = ["cms-btn", "color-success", "dense"]; } }, "class success"),
              _.Btn({ size: "sm", outline: true, onClick: () => { attrRod.value = "ready"; } }, "attr ready"),
              _.Btn({ size: "sm", onClick: () => { attrRod.value = null; } }, "attr remove")
            ),
            textProbe,
            classProbe,
            attrProbe,
            infoLine("text rod", () => textRod.value),
            infoLine("class attr", () => classProbe.getAttribute("class") || "absent"),
            infoLine("data-state", () => attrProbe.getAttribute("data-state") || "absent")
          )
        )
      ],
      sample: [
        'const textProbe = _.div();',
        'const textRod = _.rod("rodBind active");',
        '_.rodBind(textProbe, textRod, { key: "textContent" });',
        '_.rodBind(classProbe, classRod, { key: "class" });',
        '_.rodBind(attrProbe, attrRod, { key: "attr:data-state" });'
      ]
    },
    model: {
      code: [
        _.Card({ title: "rodModel", subtitle: "Two-way binding su input e select" },
          stack(
            modelInput,
            modelSelect,
            actionRow(
              _.Btn({ size: "sm", outline: true, onClick: () => { modelRod.value = "ops"; } }, "ops"),
              _.Btn({ size: "sm", onClick: () => { modelRod.value = "sales"; } }, "sales"),
              _.Btn({ size: "sm", color: "warning", onClick: () => { modelRod.value = "finance"; } }, "finance")
            ),
            infoLine("modelRod.value", () => modelRod.value)
          )
        )
      ],
      sample: [
        'const modelRod = _.rod("ops");',
        'const inputEl = _.input({ class: "cms-input-raw" });',
        'const selectEl = _.select({}, ...options);',
        '_.rodModel(inputEl, modelRod, { event: "input" });',
        '_.rodModel(selectEl, modelRod, { event: "change" });'
      ]
    },
    bridge: {
      code: [
        _.Card({ title: "rodFromSignal", subtitle: "Bridge signal <-> rod" },
          stack(
            bridgeInput,
            actionRow(
              _.Btn({ size: "sm", outline: true, onClick: () => { setQty(getQty() - 1); } }, "signal -"),
              _.Btn({ size: "sm", outline: true, onClick: () => { setQty(getQty() + 1); } }, "signal +"),
              _.Btn({ size: "sm", outline: true, onClick: () => { bridgeRod.value = Number(bridgeRod.value ?? 0) - 1; } }, "rod -"),
              _.Btn({ size: "sm", outline: true, onClick: () => { bridgeRod.value = Number(bridgeRod.value ?? 0) + 1; } }, "rod +")
            ),
            infoLine("signal getter", () => String(getQty())),
            infoLine("bridgeRod.value", () => String(bridgeRod.value))
          )
        )
      ],
      sample: [
        'const [getQty, setQty] = _.signal(5);',
        'const bridgeRod = _.rodFromSignal(getQty, setQty);',
        '_.rodModel(inputEl, bridgeRod, {',
        '  event: "input",',
        '  parse: (value) => Number(value)',
        '});'
      ]
    }
  };

  return _.div({ class: "cms-panel cms-page" },
    _.h1("CMS Rod"),
    _.p("Tutorial minimo del blocco `rod`. Qui usiamo direttamente `_.rod`, `_.rodBind`, `_.rodModel` e `_.rodFromSignal` per verificare il comportamento del layer bridge rispetto al core reattivo."),
    _.h2("API disponibili"),
    _.List(
      _.Item("`_.rod(initial)` -> contenitore reattivo con `.value`, `.action()`, `.dispose()`"),
      _.Item("`_.rodBind(el, rod, { key })` -> binding diretto su un nodo DOM"),
      _.Item("`_.rodModel(el, rod, opts)` -> two-way model per input/select"),
      _.Item("`_.rodFromSignal(get, set)` -> bridge tra signal e rod")
    ),
    _.h2("Esempi"),
    boxCode("Rod base", listSample.basic, 24),
    boxCode("rodBind", listSample.bind, 24),
    boxCode("rodModel", listSample.model, 24),
    boxCode("rodFromSignal", listSample.bridge, 24)
  );
});

export { cmsRod };

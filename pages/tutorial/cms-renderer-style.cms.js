const styleInfoLine = (label, getter) => _.div({ class: "cms-m-b-xs" }, _.b(`${label}: `), _.span(getter));

const styleStack = (...children) => _.div({
  style: {
    display: "grid",
    gap: "12px"
  }
}, ...children);

const styleActionRow = (...children) => _.div({
  style: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap"
  }
}, ...children);

const probeId = "cms-renderer-style-probe";

const readProbe = (reader) => () => {
  const el = document.getElementById(probeId);
  if (!el) return "missing";
  return reader(el);
};

const readStyleProp = (name) => readProbe((el) => {
  const value = name.startsWith("--")
    ? el.style.getPropertyValue(name)
    : el.style[name];
  return value ? JSON.stringify(value) : "absent";
});

const readStyleAttr = readProbe((el) => JSON.stringify(el.getAttribute("style") || ""));

const styleCleanupDemo = _.component((props, ctx) => {
  const [getMode, setMode] = _.signal("rich");
  const [getAccent, setAccent] = _.signal("#0f766e");
  const [getPaddingBoost, setPaddingBoost] = _.signal(true);

  const probeStyle = _.computed(() => {
    const accent = getAccent();
    const padding = getPaddingBoost() ? "18px 22px" : "12px 16px";

    if (getMode() === "rich") {
      return {
        background: `linear-gradient(135deg, ${accent} 0%, #111827 100%)`,
        color: "#ffffff",
        border: `2px solid ${accent}`,
        boxShadow: `0 18px 36px -20px ${accent}`,
        borderRadius: "22px",
        padding,
        "--cms-style-accent": accent
      };
    }

    if (getMode() === "minimal") {
      return {
        color: accent,
        padding
      };
    }

    return {
      color: "#111827",
      outline: `3px dashed ${accent}`,
      outlineOffset: "6px",
      padding,
      "--cms-style-accent": accent
    };
  });

  const cleanupStatus = _.computed(() => {
    const el = document.getElementById(probeId);
    if (!el) return "waiting";

    const staleForMinimal = [
      el.style.background,
      el.style.border,
      el.style.boxShadow,
      el.style.borderRadius,
      el.style.getPropertyValue("--cms-style-accent")
    ].some(Boolean);

    const staleForOutline = [
      el.style.background,
      el.style.border,
      el.style.boxShadow,
      el.style.borderRadius
    ].some(Boolean);

    if (getMode() === "minimal") return staleForMinimal ? "STALE" : "OK";
    if (getMode() === "outline") return staleForOutline ? "STALE" : "OK";
    return "OK";
  });

  ctx.onDispose(() => {
    probeStyle.dispose?.();
    cleanupStatus.dispose?.();
  });

  const sample = {
    code: [
      _.div({
        style: () => getMode() === "rich"
          ? {
            background: `linear-gradient(135deg, ${getAccent()} 0%, #111827 100%)`,
            border: `2px solid ${getAccent()}`,
            boxShadow: `0 18px 36px -20px ${getAccent()}`,
            "--cms-style-accent": getAccent()
          }
          : {
            color: getAccent(),
            padding: "12px 16px"
          }
      }, "Probe")
    ],
    sample: [
      '_.div({',
      '  style: () => getMode() === "rich"',
      '    ? {',
      '      background: `linear-gradient(135deg, ${getAccent()} 0%, #111827 100%)`,',
      '      border: `2px solid ${getAccent()}`,',
      '      boxShadow: `0 18px 36px -20px ${getAccent()}`,',
      '      "--cms-style-accent": getAccent()',
      '    }',
      '    : {',
      '      color: getAccent(),',
      '      padding: "12px 16px"',
      '    }',
      '}, "Probe");'
    ]
  };

  return _.div({ class: "cms-panel cms-page" },
    _.h1("CMS Renderer Style Cleanup"),
    _.p("Pagina dedicata al caso `style` dinamico quando l'oggetto cambia shape. Qui il test visivo e il DOM reale devono mostrare che le chiavi vecchie spariscono davvero, non restano appese sul nodo."),
    _.Card({ title: "Checklist", subtitle: "Cosa deve succedere quando cambi mode" },
      _.List(
        _.Item("`rich -> minimal`: devono sparire `background`, `border`, `boxShadow`, `borderRadius` e `--cms-style-accent`"),
        _.Item("`rich -> outline`: devono sparire `background`, `border`, `boxShadow`, `borderRadius`, ma restare `outline` e `--cms-style-accent`"),
        _.Item("il box visivo e il `style` attribute devono riflettere la shape corrente, non la precedente")
      )
    ),
    boxCode("Dynamic style object cleanup", sample, 24),
    _.Card({ title: "Probe", subtitle: "Passa da uno shape all'altro e controlla il nodo DOM reale" },
      styleStack(
        styleActionRow(
          _.Btn({ size: "sm", color: "primary", onClick: () => setMode("rich") }, "rich"),
          _.Btn({ size: "sm", color: "secondary", onClick: () => setMode("minimal") }, "minimal"),
          _.Btn({ size: "sm", outline: true, onClick: () => setMode("outline") }, "outline"),
          _.Btn({ size: "sm", outline: true, onClick: () => setAccent("#0f766e") }, "accent teal"),
          _.Btn({ size: "sm", outline: true, onClick: () => setAccent("#b91c1c") }, "accent red"),
          _.Btn({ size: "sm", outline: true, onClick: () => setPaddingBoost(!getPaddingBoost()) }, "toggle padding")
        ),
        _.div({
          style: {
            padding: "12px",
            border: "1px solid var(--cms-border)",
            borderRadius: "18px",
            background: "var(--cms-surface-1)"
          }
        },
          _.div({
            id: probeId,
            style: () => probeStyle()
          },
            _.strong(() => `mode = ${getMode()}`),
            _.div("Dynamic style cleanup probe"),
            _.small(() => `accent = ${getAccent()}`)
          )
        ),
        _.Chip({ color: () => cleanupStatus() === "OK" ? "success" : "danger" }, () => `cleanup status: ${cleanupStatus()}`),
        styleInfoLine("style attribute", readStyleAttr),
        styleInfoLine("background", readStyleProp("background")),
        styleInfoLine("border", readStyleProp("border")),
        styleInfoLine("boxShadow", readStyleProp("boxShadow")),
        styleInfoLine("borderRadius", readStyleProp("borderRadius")),
        styleInfoLine("outline", readStyleProp("outline")),
        styleInfoLine("--cms-style-accent", readStyleProp("--cms-style-accent"))
      )
    )
  );
});

export { styleCleanupDemo as cmsRendererStyle };

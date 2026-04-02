const createSection = (code, sample) => ({
  code: Array.isArray(code) ? code : [code],
  sample: Array.isArray(sample) ? sample : [sample]
});

const row = (...children) => _.div({
  style: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    alignItems: "center"
  }
}, ...children);

const statBox = (label, value, note) => _.div({
  style: {
    minWidth: "160px",
    padding: "14px 16px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.14)",
    backdropFilter: "blur(10px)"
  }
},
  _.div({ style: { fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: ".08em", opacity: ".8" } }, label),
  _.div({ style: { fontSize: "26px", fontWeight: "800", marginTop: "6px" } }, value),
  _.div({ style: { fontSize: "13px", marginTop: "6px", opacity: ".82" } }, note)
);

const liveState = _.rod("primary");
const liveJustify = _.rod("flex-end");
const liveAlign = _.rod("flex-start");
const liveHeight = _.rod("360px");
const liveSpeed = _.rod(18);
const liveStatic = _.rod(false);
const liveOverlay = _.rod(true);

const liveBackground = () => {
  const map = {
    primary: "radial-gradient(circle at 20% 18%, rgba(56, 189, 248, 0.28), transparent 24%), linear-gradient(135deg, #071827 0%, #123a69 44%, #0f766e 100%)",
    success: "radial-gradient(circle at 78% 0%, rgba(255,255,255,0.16), transparent 18%), linear-gradient(135deg, #062018 0%, #0f5132 45%, #1d9b67 100%)",
    warning: "radial-gradient(circle at 20% 15%, rgba(255,255,255,0.18), transparent 20%), linear-gradient(135deg, #271607 0%, #8a4f11 48%, #d97706 100%)",
    danger: "radial-gradient(circle at 75% 12%, rgba(255,255,255,0.15), transparent 18%), linear-gradient(135deg, #27090c 0%, #6b1720 44%, #d14343 100%)",
    info: "radial-gradient(circle at 20% 18%, rgba(255,255,255,0.18), transparent 22%), linear-gradient(135deg, #081626 0%, #0f4c81 46%, #38bdf8 100%)",
    secondary: "radial-gradient(circle at 22% 18%, rgba(255,255,255,0.18), transparent 22%), linear-gradient(135deg, #131127 0%, #43307a 44%, #7c3aed 100%)"
  };
  return map[liveState.value] || map.primary;
};

const listSample = {
  basic: createSection(
    _.Parallax({
      height: "420px",
      padding: "32px",
      gap: "20px",
      speed: 0.16,
      contentMaxWidth: "860px",
      background: "radial-gradient(circle at 20% 18%, rgba(56, 189, 248, 0.28), transparent 24%), linear-gradient(135deg, #071827 0%, #123a69 44%, #0f766e 100%)",
      badge: row(
        _.Chip({ color: "info", outline: true, size: "sm" }, "Campaign spring 2026"),
        _.Chip({ color: "success", size: "sm" }, "assets approvati"),
        _.Chip({ color: "secondary", outline: true, size: "sm" }, "hero standard")
      ),
      eyebrow: "DTC commerce",
      title: "UI.Parallax come hero reale per campagne, metriche e call to action.",
      subtitle: "Il componente gestisce copy strutturato, badge, azioni, foreground content e layer decorativi senza dover costruire markup custom ogni volta.",
      aside: _.Btn({ color: "primary" }, "Apri campaign"),
      media: row(
        statBox("CTR", "+18%", "rispetto al lancio precedente"),
        statBox("SKU live", "124", "catalogo localizzato IT/ES"),
        statBox("Tempo medio", "1.8s", "page load sulla hero")
      ),
      footer: row(
        _.Chip({ color: "success" }, "rollout 10%"),
        _.Chip({ color: "info", outline: true }, "A/B test in corso"),
        _.Chip({ color: "secondary", outline: true }, "owner: growth")
      ),
      actions: row(
        _.Btn({ outline: true }, "Duplica"),
        _.Btn({ color: "primary" }, "Pubblica")
      )
    }),
    [
      '_.Parallax({',
      '  height: "420px",',
      '  padding: "32px",',
      '  speed: 0.16,',
      '  background: "radial-gradient(circle at 20% 18%, rgba(56, 189, 248, 0.28), transparent 24%), linear-gradient(135deg, #071827 0%, #123a69 44%, #0f766e 100%)",',
      '  badge: _.Chip({ color: "info", outline: true, size: "sm" }, "Campaign spring 2026"),',
      '  eyebrow: "DTC commerce",',
      '  title: "UI.Parallax come hero reale per campagne, metriche e call to action.",',
      '  subtitle: "Il componente gestisce copy strutturato, badge, azioni e foreground content.",',
      '  aside: _.Btn({ color: "primary" }, "Apri campaign"),',
      '  media: row(statBox("CTR", "+18%", "rispetto al lancio precedente")),',
      '  footer: row(_.Chip({ color: "success" }, "rollout 10%")),',
      '  actions: row(_.Btn({ outline: true }, "Duplica"), _.Btn({ color: "primary" }, "Pubblica"))',
      '});'
    ]
  ),
  slots: createSection(
    _.Parallax({
      height: "460px",
      padding: "28px",
      gap: "18px",
      justify: "space-between",
      align: "stretch",
      speed: 0.22,
      contentMaxWidth: "980px",
      background: "radial-gradient(circle at 86% 0%, rgba(255,255,255,0.14), transparent 18%), linear-gradient(145deg, #0b1325 0%, #1d3d68 42%, #111827 100%)",
      overlay: "linear-gradient(180deg, rgba(3, 7, 18, 0.08), rgba(3, 7, 18, 0.72))",
      slots: {
        background: () => row(
          _.Chip({ color: "light", outline: true, size: "sm" }, "feed sincronizzato"),
          _.Chip({ color: "info", outline: true, size: "sm" }, "cut-off 18:00"),
          _.Chip({ color: "success", outline: true, size: "sm" }, "warehouse online")
        ),
        header: () => _.div(
          _.div({ style: { fontSize: "11px", fontWeight: "700", letterSpacing: ".08em", textTransform: "uppercase", opacity: ".8" } }, "Operations workspace"),
          _.div({ style: { fontSize: "38px", fontWeight: "800", lineHeight: "1.05", marginTop: "6px" } }, "Parallax con slots completi"),
          _.div({ style: { marginTop: "10px", maxWidth: "60ch", lineHeight: "1.55", opacity: ".92" } }, "Usa `slots.background`, `slots.header`, `slots.content`, `slots.footer` e `slots.actions` per costruire blocchi editoriali o dashboard narrative con maggiore controllo.")
        ),
        aside: () => row(
          _.Btn({ outline: true, size: "sm" }, "Apri log"),
          _.Btn({ color: "info", size: "sm" }, "Apri war room")
        ),
        content: () => row(
          _.Card({ title: "Ordini in coda", subtitle: "Ultimi 15 minuti", style: { minWidth: "220px", background: "rgba(255,255,255,0.1)" } }, _.h3("128")),
          _.Card({ title: "Anomalie", subtitle: "Richiedono review", style: { minWidth: "220px", background: "rgba(255,255,255,0.1)" } }, _.h3("7")),
          _.Card({ title: "Corrieri in ritardo", subtitle: "Hub Milano / Roma", style: { minWidth: "220px", background: "rgba(255,255,255,0.1)" } }, _.h3("3"))
        ),
        footer: () => row(
          _.Chip({ color: "warning" }, "SLA 17 min"),
          _.Chip({ color: "success" }, "smoke test ok"),
          _.Chip({ color: "secondary", outline: true }, "last sync 14:28")
        ),
        actions: () => row(
          _.Btn({ outline: true }, "Esporta report"),
          _.Btn({ color: "primary" }, "Apri dashboard")
        )
      }
    }),
    [
      '_.Parallax({',
      '  height: "460px",',
      '  justify: "space-between",',
      '  align: "stretch",',
      '  speed: 0.22,',
      '  slots: {',
      '    background: () => row(_.Chip({ color: "light", outline: true }, "feed sincronizzato")),',
      '    header: () => _.div(_.div("Operations workspace"), _.div("Parallax con slots completi")),',
      '    aside: () => row(_.Btn({ outline: true, size: "sm" }, "Apri log")),',
      '    content: () => row(_.Card({ title: "Ordini in coda" }, _.h3("128"))),',
      '    footer: () => row(_.Chip({ color: "warning" }, "SLA 17 min")),',
      '    actions: () => row(_.Btn({ color: "primary" }, "Apri dashboard"))',
      '  }',
      '});'
    ]
  ),
  layout: createSection(
    row(
      _.div({ style: { flex: "1 1 280px" } },
        _.Parallax({
          height: "260px",
          padding: "24px",
          justify: "flex-start",
          speed: 0.14,
          state: "info",
          background: "linear-gradient(135deg, #0f172a 0%, #155e75 100%)",
          title: "Top aligned",
          subtitle: "Ideale per announcement o notice piu compatte.",
          actions: _.Btn({ size: "sm", outline: true }, "Inspect")
        })
      ),
      _.div({ style: { flex: "1 1 280px" } },
        _.Parallax({
          height: "260px",
          padding: "24px",
          justify: "center",
          align: "center",
          speed: 0.2,
          state: "secondary",
          background: "linear-gradient(135deg, #111827 0%, #5b21b6 100%)",
          title: "Centered",
          subtitle: "Landing blocchi piu narrativi o teaser editoriali.",
          actions: _.Btn({ size: "sm", color: "secondary" }, "Open")
        })
      ),
      _.div({ style: { flex: "1 1 280px" } },
        _.Parallax({
          height: "260px",
          padding: "24px",
          justify: "flex-end",
          disabled: true,
          state: "warning",
          background: "linear-gradient(135deg, #1f1307 0%, #b45309 100%)",
          title: "Static mode",
          subtitle: "Puoi disattivare l'effetto mantenendo la stessa struttura visuale.",
          footer: _.Chip({ color: "warning" }, "disabled: true")
        })
      )
    ),
    [
      '_.Parallax({ justify: "flex-start", title: "Top aligned" });',
      '_.Parallax({ justify: "center", align: "center", title: "Centered" });',
      '_.Parallax({ disabled: true, title: "Static mode" });'
    ]
  ),
  live: createSection(
    [
      _.Card({ title: "Playground", subtitle: "Controlla allineamento, altezza, velocita e overlay con componenti standard." },
        _.div({ style: { marginBottom: "16px" } },
          _.div({ style: { fontSize: "12px", fontWeight: "700", marginBottom: "8px" } }, "State"),
          row(
            _.Radio({ color: "primary", value: "primary", model: liveState }, "Primary"),
            _.Radio({ color: "success", value: "success", model: liveState }, "Success"),
            _.Radio({ color: "warning", value: "warning", model: liveState }, "Warning"),
            _.Radio({ color: "danger", value: "danger", model: liveState }, "Danger"),
            _.Radio({ color: "info", value: "info", model: liveState }, "Info"),
            _.Radio({ color: "secondary", value: "secondary", model: liveState }, "Secondary")
          )
        ),
        _.div({ style: { marginBottom: "16px" } },
          _.div({ style: { fontSize: "12px", fontWeight: "700", marginBottom: "8px" } }, "Layout"),
          row(
            _.Radio({ color: "secondary", value: "flex-start", model: liveJustify }, "Top"),
            _.Radio({ color: "secondary", value: "center", model: liveJustify }, "Center"),
            _.Radio({ color: "secondary", value: "flex-end", model: liveJustify }, "Bottom"),
            _.Radio({ color: "secondary", value: "space-between", model: liveJustify }, "Space between"),
            _.Radio({ color: "info", value: "flex-start", model: liveAlign }, "Left"),
            _.Radio({ color: "info", value: "center", model: liveAlign }, "Center x"),
            _.Radio({ color: "info", value: "stretch", model: liveAlign }, "Stretch")
          )
        ),
        _.div({ style: { marginBottom: "16px" } },
          _.div({ style: { fontSize: "12px", fontWeight: "700", marginBottom: "8px" } }, "Height"),
          row(
            _.Radio({ color: "warning", value: "280px", model: liveHeight }, "280px"),
            _.Radio({ color: "warning", value: "360px", model: liveHeight }, "360px"),
            _.Radio({ color: "warning", value: "460px", model: liveHeight }, "460px"),
            _.Checkbox({ color: "success", model: liveOverlay }, "Overlay intenso"),
            _.Checkbox({ color: "secondary", model: liveStatic }, "Static")
          )
        ),
        _.Slider({
          min: 0,
          max: 40,
          step: 1,
          model: liveSpeed,
          label: "Speed",
          showValue: true,
          markers: [0, 10, 20, 30, 40]
        }),
        _.div({ style: { marginTop: "18px" } },
          _.Parallax({
            height: () => liveHeight.value,
            padding: "28px",
            gap: "16px",
            justify: () => liveJustify.value,
            align: () => liveAlign.value,
            speed: () => liveSpeed.value / 100,
            disabled: () => liveStatic.value,
            state: () => liveState.value,
            background: () => liveBackground(),
            overlay: () => liveOverlay.value
              ? "linear-gradient(180deg, rgba(3, 7, 18, 0.12), rgba(3, 7, 18, 0.72))"
              : "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(3, 7, 18, 0.18))",
            badge: row(
              _.Chip({ color: "light", outline: true, size: "sm" }, () => `state: ${liveState.value}`),
              _.Chip({ color: "light", outline: true, size: "sm" }, () => `speed: ${(liveSpeed.value / 100).toFixed(2)}`),
              _.Chip({ color: "light", outline: true, size: "sm" }, () => liveStatic.value ? "static" : "parallax on")
            ),
            title: "Anteprima live",
            subtitle: "Cambia prop e layout senza ricreare il componente. Il parallax reagisce a rod e signal come gli altri componenti standard.",
            media: row(
              statBox("Sessioni", "8.4k", "ultime 24 ore"),
              statBox("Conversione", () => liveState.value === "warning" ? "2.8%" : "3.4%", "dettaglio aggiornato live")
            ),
            actions: row(
              _.Btn({ outline: true }, "Annulla"),
              _.Btn({ color: () => liveState.value }, "Applica")
            ),
            footer: row(
              _.Chip({ color: "info", outline: true }, () => `justify: ${liveJustify.value}`),
              _.Chip({ color: "secondary", outline: true }, () => `align: ${liveAlign.value}`)
            )
          })
        )
      )
    ],
    [
      'const liveState = _.rod("primary");',
      'const liveSpeed = _.rod(18);',
      '_.Parallax({',
      '  height: () => liveHeight.value,',
      '  justify: () => liveJustify.value,',
      '  align: () => liveAlign.value,',
      '  speed: () => liveSpeed.value / 100,',
      '  disabled: () => liveStatic.value,',
      '  background: () => liveBackground(),',
      '  overlay: () => liveOverlay.value ? "linear-gradient(...)" : "linear-gradient(...)",',
      '  badge: row(_.Chip({ outline: true }, () => `state: ${liveState.value}`)),',
      '  title: "Anteprima live",',
      '  media: row(statBox("Sessioni", "8.4k", "ultime 24 ore")),',
      '  actions: row(_.Btn({ color: () => liveState.value }, "Applica"))',
      '});'
    ]
  )
};

const parallax = _.div({ class: "cms-panel cms-page" },
  _.h1("Parallax"),
  _.p("`UI.Parallax` ora e un contenitore standardizzato per hero, banner editoriali e sezioni operative: supporta header strutturato, body, footer, actions, slot dedicati e API minima di refresh."),
  _.h2("Props principali"),
  _.List(
    _.Item("`src`, `image`, `background`, `overlay`, `bgPosition`, `bgSize`, `bgRepeat`: controllano il layer visivo"),
    _.Item("`badge`, `eyebrow`, `title`, `subtitle`, `header`, `aside`, `media`, `content`, `footer`, `actions`: permettono layout piu ricchi senza markup ad hoc"),
    _.Item("`height`, `minHeight`, `padding`, `gap`, `justify`, `align`, `contentMaxWidth`: governano layout e densita"),
    _.Item("`speed`, `startTop`, `maxOffset`, `disabled`: controllano il comportamento parallax"),
    _.Item("slot disponibili: `background`, `badge`, `eyebrow`, `title`, `subtitle`, `header`, `aside`, `media`, `content`, `footer`, `actions`, `default`")
  ),
  _.h2("Documentazione API"),
  _.docTable("Parallax"),
  _.h2("Esempi completi"),
  boxCode("Hero commerciale", listSample.basic),
  boxCode("Slots e composizione", listSample.slots),
  boxCode("Layout e varianti", listSample.layout),
  boxCode("Playground live", listSample.live)
);

export { parallax };

import { radio } from "./radio.cms";

const render = (options) => _.Icon(options);

const renderSample = (options) => `_.Icon({${serializeOptions(options)}});`;

const createSection = (entries) => ({
  code: entries.map((options) => render(options)),
  sample: entries.map((options) => renderSample(options))
});

const themeEntries = [
  { label: "Default", color: null, icon: "home" },
  { label: "Success", color: "success", icon: "#bell", radius: "xl" },
  { label: "Warning", color: "warning", icon: "warning", radius: "sm" },
  { label: "Danger", color: "danger", icon: "#heart", radius: 10 },
  { label: "Info", color: "info", icon: "info", radius: "0.7rem" },
  { label: "Primary", color: "primary", icon: "#code" },
  { label: "Secondary", color: "secondary", icon: "palette", radius: "50%" },
  { label: "Dark", color: "dark", icon: "#brand-github" },
  { label: "Light", color: "light", icon: "light_mode", radius: "50%" }
];

const materialShowIcons = [
  "home",
  "verified",
  "warning",
  "error",
  "info",
  "rocket_launch",
  "palette",
  "dark_mode",
  "light_mode"
];

const gradientValues = [true, -90, 90, 1, 25, -25, 270, true, true];

const buildThemeSection = (extraOptions = {}, names = null) => {
  const r = themeEntries.map((theme, index) => ({
    name: names?.[index] || theme.icon,
    size: "xl",
    ...(theme.color ? { color: theme.color } : {}),
    ...(theme.radius ? { radius: theme.radius } : {}),
    ...(typeof extraOptions === "function" ? extraOptions(theme, index) : extraOptions)
  }));
  return createSection(r);
};

const listSample = {
  source: {
    code: [
      _.Icon("home"),
      _.Icon("search"),
      _.Icon("favorite"),
      _.Icon("bolt"),
      _.Icon("#home"),
      _.Icon("#search"),
      _.Icon("#bell"),
      _.Icon("#heart"),
      _.Icon("#brand-github"),
      _.Icon("#code")
    ],
    sample: [
      '_.Icon("home");',
      '_.Icon("search");',
      '_.Icon("favorite");',
      '_.Icon("bolt");',
      '_.Icon("#home");',
      '_.Icon("#search");',
      '_.Icon("#bell");',
      '_.Icon("#heart");',
      '_.Icon("#brand-github");',
      '_.Icon("#code");',
    ]
  },
  signature: {
    code: [
      _.Icon("bolt", { textColor: "#f59e0b", size: "lg" }),
      _.Icon("check_circle", { textColor: "#16a34a", size: 24 }),
      _.Icon({ name: "#plus", textColor: "#2563eb", size: 22 }),
      _.Icon({ name: "#heart", textColor: "#e11d48", size: 26 }),
      _.Icon({ name: "settings", textColor: "#475569", size: "xl" })
    ],
    sample: [
      '_.Icon("bolt", { textColor: "#f59e0b", size: "lg" });',
      '_.Icon("check_circle", { textColor: "#16a34a", size: 24 });',
      '_.Icon({ name: "#plus", textColor: "#2563eb", size: 22 });',
      '_.Icon({ name: "#heart", textColor: "#e11d48", size: 26 });',
      '_.Icon({ name: "settings", textColor: "#475569", size: "xl" });',
    ]
  },
  state: buildThemeSection(),
  size: {
    code: [
      _.Icon({ name: "home", size: "xs" }),
      _.Icon({ name: "home", size: "sm" }),
      _.Icon({ name: "home", size: "md" }),
      _.Icon({ name: "home", size: "lg" }),
      _.Icon({ name: "home", size: "xl" }),
      _.Icon({ name: "#plus", size: 20 }),
      _.Icon({ name: "#brand-github", size: "clamp(26px, 4vw, 42px)" })
    ],
    sample: [
      '_.Icon({ name: "home", size: "xs" });',
      '_.Icon({ name: "home", size: "sm" });',
      '_.Icon({ name: "home", size: "md" });',
      '_.Icon({ name: "home", size: "lg" });',
      '_.Icon({ name: "home", size: "xl" });',
      '_.Icon({ name: "#plus", size: 20 });',
      '_.Icon({ name: "#brand-github", size: "clamp(26px, 4vw, 42px)" });',
    ]
  },
  shadow: buildThemeSection({ shadow: true }),
  lightShadow: buildThemeSection({ lightShadow: true }),
  clickable: buildThemeSection({ clickable: true }),
  border: buildThemeSection({ border: true }),
  glossy: buildThemeSection({ glossy: true }),
  glossyBorder: buildThemeSection({ border: true, glossy: true }),
  glow: buildThemeSection({ glow: true }),
  glass: buildThemeSection({ glass: true }),
  gradient: buildThemeSection((theme, index) => ({ gradient: gradientValues[index] })),
  outline: buildThemeSection({ outline: true }),
  outlineGlow: buildThemeSection({ glow: true, outline: true }),
  outlineGlossy: buildThemeSection({ glossy: true, outline: true }),
  outlineGlass: buildThemeSection({ outline: true, glass: true }),
  outlineLightShadow: buildThemeSection({ lightShadow: true, outline: true }),
  textGradient: buildThemeSection({ textGradient: true }, materialShowIcons),
  outlineTextGradient: buildThemeSection({ textGradient: true, outline: true }, materialShowIcons),
  color: {
    code: [
      _.Icon({ name: "home", textColor: "#b1faf3", color: "#2563eb", size: 24 }),
      _.Icon({ name: "favorite", textColor: "#f7c272", color: "#db2777", size: 24 }),
      _.Icon({ name: "bolt", textColor: "#e801f9", color: "#f59e0b", size: 24 }),
      _.Icon({ name: "check_circle", textColor: "#f8f005", color: "#16a34a", size: 24 }),
      _.Icon({ name: "#bell", textColor: "#00c7fe", color: "#7c3aed", size: 24 }),
      _.Icon({ name: "#heart", textColor: "#d7e3fb", color: "#e11d48", size: 24 }),
      _.Icon({ name: "#brand-codepen", textColor: "#ffffff", color: "#0f766e", size: 24 })
    ],
    sample: [
      '_.Icon({ name: "home", textColor: "#b1faf3", color: "#2563eb", size: 24 });',
      '_.Icon({ name: "favorite", textColor: "#f7c272", color: "#db2777", size: 24 });',
      '_.Icon({ name: "bolt", textColor: "#e801f9", color: "#f59e0b", size: 24 });',
      '_.Icon({ name: "check_circle", textColor: "#f8f005", color: "#16a34a", size: 24 });',
      '_.Icon({ name: "#bell", textColor: "#00c7fe", color: "#7c3aed", size: 24 });',
      '_.Icon({ name: "#heart", textColor: "#d7e3fb", color: "#e11d48", size: 24 });',
      '_.Icon({ name: "#brand-codepen", textColor: "#ffffff", color: "#0f766e", size: 24 });',
    ]
  },
  custom: {
    code: [
      _.Icon(
        _.span({
          style: {
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.08em"
          }
        }, "AI")
      ),
      _.Icon({
        name: _.span({
          style: {
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.08em"
          }
        }, "LAB"),
        size: 30,
        style: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: "30px",
          minHeight: "30px",
          borderRadius: "10px",
          background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
          color: "#ffffff"
        }
      }),
      _.Icon({
        name: _.span({
          style: {
            fontSize: "10px",
            fontWeight: "700"
          }
        }, "24"),
        size: 28,
        style: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: "28px",
          minHeight: "28px",
          borderRadius: "999px",
          border: "1px solid #fed7aa",
          background: "#fff7ed",
          color: "#9a3412"
        }
      }),
      _.Icon({
        name: _.span({
          style: {
            width: "18px",
            height: "18px",
            display: "inline-block",
            borderRadius: "6px",
            background: "linear-gradient(180deg, #fef3c7, #f59e0b)"
          }
        }),
        size: 26,
        style: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: "26px",
          minHeight: "26px"
        }
      })
    ],
    sample: [
      '_.Icon(_.span({ style: { fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em" } }, "AI"));',
      '_.Icon({',
      '  name: _.span({ style: { fontSize: "11px", fontWeight: "700", letterSpacing: "0.08em" } }, "LAB"),',
      '  size: 30,',
      '  style: { display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: "30px", minHeight: "30px", borderRadius: "10px", background: "linear-gradient(135deg, #0ea5e9, #8b5cf6)", color: "#ffffff" }',
      '});',
      '_.Icon({',
      '  name: _.span({ style: { fontSize: "10px", fontWeight: "700" } }, "24"),',
      '  size: 28,',
      '  style: { display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: "28px", minHeight: "28px", borderRadius: "999px", border: "1px solid #fed7aa", background: "#fff7ed", color: "#9a3412" }',
      '});',
    ]
  },
  showcase: {
    code: [
      _.div({ style: { display: "grid", gap: "16px" } },
        _.Card({ header: "Toolbar mista" },
          _.Toolbar({ wrap: true, gap: "18px" },
            _.div({ style: { display: "inline-flex", alignItems: "center", gap: "10px" } },
              _.Icon({ name: "#brand-github", size: 26, textColor: "#ffffff", color: "#111827" }),
              _.span("Repository")
            ),
            _.div({ style: { display: "inline-flex", alignItems: "center", gap: "10px" } },
              _.Icon({ name: "notifications", size: 26, textColor: "#ffffff", color: "#ea580c" }),
              _.span("Alert")
            ),
            _.div({ style: { display: "inline-flex", alignItems: "center", gap: "10px" } },
              _.Icon({ name: "#code", size: 26, textColor: "#ffffff", color: "#0f766e" }),
              _.span("Code")
            ),
            _.div({ style: { display: "inline-flex", alignItems: "center", gap: "10px" } },
              _.Icon({ name: "favorite", size: 26, textColor: "#ffffff", color: "#db2777" }),
              _.span("Likes")
            )
          )
        ),
        _.Card({ header: "Hero icon mix" },
          _.div({ style: { display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" } },
            _.Icon({ name: "#brand-codepen", size: 42, textColor: "#ffffff", color: "#2563eb" }),
            _.Icon({ name: "auto_awesome", size: 40, textColor: "#ffff85", color: "#7c3aed" }),
            _.Icon({
              name: _.span({
                style: {
                  fontSize: "12px",
                  fontWeight: "700",
                  letterSpacing: "0.08em"
                }
              }, "AI"),
              size: 40,
              style: {
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "40px",
                minHeight: "40px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #14b8a6, #0f766e)",
                color: "#ffffff"
              }
            }),
            _.div(
              _.div({ style: { fontWeight: "700" } }, "Material + Tabler + custom"),
              _.div({ style: { color: "#6b7280" } }, "Un'unica API per sprite SVG, Material Icons e contenuto personalizzato.")
            )
          )
        )
      )
    ],
    sample: [
      '_.Toolbar({ wrap: true, gap: "18px" },',
      '  _.div({ style: { display: "inline-flex", alignItems: "center", gap: "10px" } }, _.Icon({ name: "#brand-github", size: 26, color: "#111827" }), _.span("Repository")),',
      '  _.div({ style: { display: "inline-flex", alignItems: "center", gap: "10px" } }, _.Icon({ name: "notifications", size: 26, color: "#ea580c" }), _.span("Alert")),',
      '  _.div({ style: { display: "inline-flex", alignItems: "center", gap: "10px" } }, _.Icon({ name: "#app", size: 26, color: "#0f766e" }), _.span("Apps"))',
      ');',
      '',
      '_.Icon({',
      '  name: _.span({ style: { fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em" } }, "AI"),',
      '  size: 40,',
      '  style: { display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: "40px", minHeight: "40px", borderRadius: "12px", background: "linear-gradient(135deg, #14b8a6, #0f766e)", color: "#ffffff" }',
      '});',
    ]
  }
};

const icon = _.div({ class: "cms-panel cms-page" },
  _.h1("Icon"),
  _.p("`_.Icon` e il componente base per tutte le micro-grafie dell'interfaccia: puoi renderizzare icone Google Material, sprite SVG Tabler oppure contenuto custom mantenendo la stessa API."),
  _.p("Per Tabler usa il prefisso `#` nel nome, per esempio `_.Icon(\"#home\")` oppure `_.Icon({ name: \"#home\" })`. Per Google Material usa il nome diretto, per esempio `_.Icon(\"home\")` oppure `_.Icon({ name: \"favorite\" })`."),
  _.h2("Props principali"),
  _.List(
    _.Item("name: string, Node o Function; se inizia con `#` usa lo sprite Tabler, altrimenti Material Icons"),
    _.Item("size: token (`xs-sm-md-lg-xl`), numero in px o qualsiasi misura CSS"),
    _.Item("color: supporta sia colori CSS sia stati standard come `success`, `warning`, `danger`, `info`, `primary`, `secondary`, `dark`, `light`"),
    _.Item("shadow, lightShadow, clickable, border, glossy, glow, glass, gradient, outline e textGradient per tutte le varianti decorative standard"),
    _.Item("style e class: rifinitura del wrapper quando l'icona diventa parte del layout"),
    _.Item("contenuto custom: passa un Node o una Function per creare icone testuali, badge numerici o mini-shape")
  ),
  _.h2("Documentazione API"),
  _.docTable("Icon"),
  _.h2("Tutorial completo"),
  boxCode("Material + Tabler", listSample.source),
  boxCode("String signature + props", listSample.signature),
  boxCode("State color", listSample.state),
  boxCode("Size", listSample.size),
  boxCode("Shadow", listSample.shadow),
  boxCode("Light Shadow", listSample.lightShadow),
  boxCode("Clickable", listSample.clickable),
  boxCode("Border", listSample.border),
  boxCode("Glossy", listSample.glossy),
  boxCode("Glossy border", listSample.glossyBorder),
  boxCode("Glow", listSample.glow),
  boxCode("Glass", listSample.glass),
  boxCode("Gradient", listSample.gradient),
  boxCode("Outline", listSample.outline),
  boxCode("Outline + Glow", listSample.outlineGlow),
  boxCode("Outline + Glossy", listSample.outlineGlossy),
  boxCode("Outline + Glass", listSample.outlineGlass),
  boxCode("Outline + Light Shadow", listSample.outlineLightShadow),
  boxCode("Text Gradient", listSample.textGradient),
  boxCode("Outline + Text Gradient", listSample.outlineTextGradient),
  boxCode("Raw CSS color", listSample.color),
  boxCode("Custom content", listSample.custom),
  boxCode("Showcase mix", listSample.showcase),
);

export { icon };

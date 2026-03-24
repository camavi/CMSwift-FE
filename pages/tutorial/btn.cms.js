const render = (options, label) => {
  if (!Object.keys(options).length) return _.Btn(label);
  return _.Btn(options, label);
};

const renderSample = (options, label) => {
  if (!Object.keys(options).length) return `_.Btn("${label}");`;
  return `_.Btn(${serializeOptions(options)}, "${label}");`;
};

const createSection = (entries) => ({
  code: entries.map(({ label, options }) => render(options, label)),
  sample: entries.map(({ label, options }) => renderSample(options, label))
});

const buildThemeSection = (extraOptions = {}, mode = "left") => createSection(
  listThemes.map((theme) => ({
    label: theme.label,
    options: makeOptions(theme, extraOptions, typeof mode === "function" ? mode(theme) : mode)
  }))
);

const listSample = {
  basic: buildThemeSection(),
  size: createSection(
    sizeConfigs.map(({ theme, label, size }) => ({
      label,
      options: makeOptions(buttonThemeMap[theme], { size })
    }))
  ),
  icon: buildThemeSection({}, (theme) => iconModes[theme.label] || "left"),
  removable: buildThemeSection({ removable: true }),
  shadow: buildThemeSection({ removable: true, shadow: true }),
  lightShadow: buildThemeSection({ removable: true, lightShadow: true }),
  clickable: buildThemeSection({ clickable: true }),
  border: buildThemeSection({ removable: true, border: true }),
  glossy: buildThemeSection({ removable: true, glossy: true }),
  glossyBorder: buildThemeSection({ removable: true, border: true, glossy: true }),
  glow: buildThemeSection({ removable: true, glow: true }),
  glass: buildThemeSection({ removable: true, glass: true }),
  gradient: createSection(
    listThemes.map((theme, index) => ({
      label: theme.label,
      options: makeOptions(theme, { removable: true, gradient: gradientValues[index] })
    }))
  ),
  outline: buildThemeSection({ removable: true, outline: true }),
  outlineGlow: buildThemeSection({ glow: true, removable: true, outline: true }),
  outlineGlossy: buildThemeSection({ glossy: true, removable: true, outline: true }),
  outlineGlass: buildThemeSection({ removable: true, outline: true, glass: true }),
  outlineLightShadow: buildThemeSection({ removable: true, lightShadow: true, outline: true }),
  textGradient: buildThemeSection({ removable: true, textGradient: true }),
  outlineTextGradient: buildThemeSection({ removable: true, textGradient: true, outline: true })
};

const btn = _.div({ class: "cms-panel cms-page" },
  _.h1("Button"),
  _.p("Bottone con varianti colore, outline, icona/label e stato loading. Gestisce disabilitazione, aria e animazione burst su pointerdown."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Documentazione API"),
  _.DocTable("Btn"),
  _.h2("Esempio completo"),
  boxCode("Basic color", listSample.basic),
  boxCode("Size", listSample.size),
  boxCode("Icon", listSample.icon),
  boxCode("Removable", listSample.removable),
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
  boxCode("Outline + Text Gradient", listSample.outlineTextGradient)
);

export { btn };

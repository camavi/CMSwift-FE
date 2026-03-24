const parallaxSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Parallax sample"),
  _.p("Sezione parallax con background image, height e speed. Supporta overlay/color/position e slot content."),
  _.Card({ header: "Esempio" },
    _.Parallax({ height: "220px" }, _.h2("Parallax"))
  )
);

export { parallaxSample };

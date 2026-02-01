const parallaxSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Parallax sample"),
  _h.p("Sezione parallax con background image, height e speed. Supporta overlay/color/position e slot content."),
  _ui.Card({ header: "Esempio" },
    _ui.Parallax({ height: "220px" }, _h.h2("Parallax"))
  )
);

export { parallaxSample };

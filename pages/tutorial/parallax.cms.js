const parallax = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Parallax"),
  _h.p("Sezione parallax con background image, height e speed. Supporta overlay/color/position e slot content."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.Parallax({ height: "220px" }, _h.h2("Parallax"))
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Parallax")
);

export { parallax };

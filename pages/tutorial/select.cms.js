import { icon } from "./icon.cms";

const select = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Select"),
  _h.p("Select custom con UI.FormField: gruppi, filtro, async options, multi-select e valori custom. Include tastiera, clearable e slot per opzioni/empty/loading."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Select"),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.Select({ label: "Stato", icon: "home", shadow: true, glossy: true, filterable: true, multi: true, color: "primary", prefix: "Home", suffix: "Home", options: ["Draft", "Live", "Archived"], value: "Live" })
  )
);

export { select };

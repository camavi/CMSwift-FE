import { icon } from "./icon.cms";

const input = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Input"),
  _h.p("Input con UI.FormField integrato: label floating, hint/error, icon/prefix/suffix e clearable. Supporta model reattivo e onInput/onChange."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Input"),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    _ui.Input({ label: "Nome", placeholder: "Inserisci nome", hint: "Helper text", icon: "#home", prefix: "home" }),
    _ui.Input({ label: "Nome", color: "primary", placeholder: "Inserisci nome", hint: "Helper text", icon: "#home", prefix: "home", iconRight: "#home", suffix: "home" }),
    _ui.Input({ label: "Nome", color: "secondary", placeholder: "Inserisci nome", hint: "Helper text", icon: "#home", prefix: "home", iconRight: "#home", suffix: "home" }),
    _ui.Input({ label: "Nome", color: "danger", placeholder: "Inserisci nome", hint: "Helper text", icon: "#home", prefix: "home", iconRight: "#home", suffix: "home" }),
    _ui.Input({ label: "Nome", color: "warning", placeholder: "Inserisci nome", hint: "Helper text", icon: "#home", prefix: "home", iconRight: "#home", suffix: "home" }),
    _ui.Input({ label: "Nome", color: "info", placeholder: "Inserisci nome", hint: "Helper text", icon: "#home", prefix: "home", iconRight: "#home", suffix: "home" }),
    _ui.Input({ label: "Nome", color: "success", placeholder: "Inserisci nome", hint: "Helper text", icon: "#home", prefix: "home", iconRight: "#home", suffix: "home" }),
    _ui.Input({ label: "Nome", color: "dark", lightShadow: true, placeholder: "Inserisci nome", hint: "Helper text", icon: "#home", prefix: "home", iconRight: "#home", suffix: "home" }),
    _ui.Input({ label: "Nome", color: "light", lightShadow: true, placeholder: "Inserisci nome", hint: "Helper text", icon: "#home", prefix: "home", iconRight: "#home", suffix: "home" }),
    _ui.Input({ label: "Nome", color: "primary" })
  ),

);

export { input };

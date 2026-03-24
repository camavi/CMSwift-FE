import { icon } from "./icon.cms";

const input = _.div({ class: "cms-panel cms-page" },
  _.h1("Input"),
  _.p("Input con _.FormField integrato: label floating, hint/error, icon/prefix/suffix e clearable. Supporta model reattivo e onInput/onChange."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Documentazione API"),
  _.DocTable("Input"),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    _.Input({ label: "Nome", placeholder: "Inserisci nome", hint: "Helper text", icon: "#home", prefix: "home" }),
    _.Input({ label: "Nome", color: "primary", placeholder: "Inserisci nome", hint: "Helper text", icon: "#home", prefix: "home", iconRight: "#home", suffix: "home" }),
    _.Input({ label: "Nome", color: "secondary", placeholder: "Inserisci nome", hint: "Helper text", icon: "#home", prefix: "home", iconRight: "#home", suffix: "home" }),
    _.Input({ label: "Nome", color: "danger", placeholder: "Inserisci nome", hint: "Helper text", icon: "#home", prefix: "home", iconRight: "#home", suffix: "home" }),
    _.Input({ label: "Nome", color: "warning", placeholder: "Inserisci nome", hint: "Helper text", icon: "#home", prefix: "home", iconRight: "#home", suffix: "home" }),
    _.Input({ label: "Nome", color: "info", placeholder: "Inserisci nome", hint: "Helper text", icon: "#home", prefix: "home", iconRight: "#home", suffix: "home" }),
    _.Input({ label: "Nome", color: "success", placeholder: "Inserisci nome", hint: "Helper text", icon: "#home", prefix: "home", iconRight: "#home", suffix: "home" }),
    _.Input({ label: "Nome", color: "dark", lightShadow: true, placeholder: "Inserisci nome", hint: "Helper text", icon: "#home", prefix: "home", iconRight: "#home", suffix: "home" }),
    _.Input({ label: "Nome", color: "light", lightShadow: true, placeholder: "Inserisci nome", hint: "Helper text", icon: "#home", prefix: "home", iconRight: "#home", suffix: "home" }),
    _.Input({ label: "Nome", color: "primary" })
  ),

);

export { input };

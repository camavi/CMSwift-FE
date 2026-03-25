const dialogApi = _.Dialog({
  title: "Conferma", content: "Sei sicuro?", actions: [
    _.Btn({ onClick: () => dialogApi.close() }, "Annulla"),
    _.Btn({ variant: "primary", onClick: () => dialogApi.close() }, "Ok")
  ]
});
const dialogExample = _.Btn({ variant: "primary", onClick: () => dialogApi.open() }, "Apri dialog");

const dialog = _.div({ class: "cms-panel cms-page" },
  _.h1("Dialog"),
  _.p("Dialog overlay con focus trap e scroll lock. API `open/close/isOpen`, contenuto via title/content/actions."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    dialogExample
  ),
  _.h2("Documentazione API"),
  _.docTable("Dialog")
);

export { dialog };

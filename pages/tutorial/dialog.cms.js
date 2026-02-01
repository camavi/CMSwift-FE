const dialogApi = _ui.Dialog({ title: "Conferma", content: "Sei sicuro?", actions: [
  _ui.Btn({ onClick: () => dialogApi.close() }, "Annulla"),
  _ui.Btn({ variant: "primary", onClick: () => dialogApi.close() }, "Ok")
] });
const dialogExample = _ui.Btn({ variant: "primary", onClick: () => dialogApi.open() }, "Apri dialog");

const dialog = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Dialog"),
  _h.p("Dialog overlay con focus trap e scroll lock. API `open/close/isOpen`, contenuto via title/content/actions."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    dialogExample
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Dialog")
);

export { dialog };

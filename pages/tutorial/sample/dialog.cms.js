const dialogApi = _ui.Dialog({ title: "Conferma", content: "Sei sicuro?", actions: [
  _ui.Btn({ onClick: () => dialogApi.close() }, "Annulla"),
  _ui.Btn({ variant: "primary", onClick: () => dialogApi.close() }, "Ok")
] });
const dialogExample = _ui.Btn({ variant: "primary", onClick: () => dialogApi.open() }, "Apri dialog");

const dialogSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Dialog sample"),
  _h.p("Dialog overlay con focus trap e scroll lock. API `open/close/isOpen`, contenuto via title/content/actions."),
  _ui.Card({ header: "Esempio" },
    dialogExample
  )
);

export { dialogSample };

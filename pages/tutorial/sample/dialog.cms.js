const dialogApi = _.Dialog({ title: "Conferma", content: "Sei sicuro?", actions: [
  _.Btn({ onClick: () => dialogApi.close() }, "Annulla"),
  _.Btn({ variant: "primary", onClick: () => dialogApi.close() }, "Ok")
] });
const dialogExample = _.Btn({ variant: "primary", onClick: () => dialogApi.open() }, "Apri dialog");

const dialogSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Dialog sample"),
  _.p("Dialog overlay con focus trap e scroll lock. API `open/close/isOpen`, contenuto via title/content/actions."),
  _.Card({ header: "Esempio" },
    dialogExample
  )
);

export { dialogSample };

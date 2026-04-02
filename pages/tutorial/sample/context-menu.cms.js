const ctxArea = _.div({ class: "cms-panel", style: { padding: "16px", cursor: "context-menu" } }, "Right click qui");
const contextMenuApi = _.ContextMenu({
  title: "Azioni rapide",
  items: [
    { label: "Copia", icon: "content_copy" },
    { label: "Rinomina", icon: "edit" },
    { divider: true },
    { label: "Elimina", icon: "delete", color: "danger" }
  ]
});
contextMenuApi.bind(ctxArea);
const contextMenuExample = _.Row(ctxArea);

const contextMenuSample = _.div({ class: "cms-panel cms-page" },
  _.h2("ContextMenu sample"),
  _.p("Menu contestuale standardizzato con `items`, `bind(el)` e API imperativa `openAt(x,y)`."),
  _.Card({ header: "Esempio" },
    contextMenuExample
  )
);

export { contextMenuSample };

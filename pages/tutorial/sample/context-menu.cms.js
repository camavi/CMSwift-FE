const ctxArea = _.div({ class: "cms-panel", style: { padding: "12px" } }, "Right click qui");
const contextMenuApi = _.ContextMenu({ content: _.List(_.Item("Copia"), _.Item("Elimina")) });
contextMenuApi.bind(ctxArea);
const contextMenuExample = _.Row(ctxArea);

const contextMenuSample = _.div({ class: "cms-panel cms-page" },
  _.h2("ContextMenu sample"),
  _.p("Menu contestuale su right-click con `bind` o `openAt(x,y)`. Supporta closeOnSelect e onOpen/onClose."),
  _.Card({ header: "Esempio" },
    contextMenuExample
  )
);

export { contextMenuSample };

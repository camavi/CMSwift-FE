const ctxArea = _.div({ class: "cms-panel", style: { padding: "12px" } }, "Right click qui");
const contextMenuApi = _.ContextMenu({ content: _.List(_.Item("Copia"), _.Item("Elimina")) });
contextMenuApi.bind(ctxArea);
const contextMenuExample = _.Row(ctxArea);

const contextMenu = _.div({ class: "cms-panel cms-page" },
  _.h1("ContextMenu"),
  _.p("Menu contestuale su right-click con `bind` o `openAt(x,y)`. Supporta closeOnSelect e onOpen/onClose."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    contextMenuExample
  ),
  _.h2("Documentazione API"),
  _.DocTable("ContextMenu")
);

export { contextMenu };

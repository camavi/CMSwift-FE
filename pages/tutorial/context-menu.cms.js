const ctxArea = _h.div({ class: "cms-panel", style: { padding: "12px" } }, "Right click qui");
const contextMenuApi = _ui.ContextMenu({ content: _ui.List(_ui.Item("Copia"), _ui.Item("Elimina")) });
contextMenuApi.bind(ctxArea);
const contextMenuExample = _ui.Row(ctxArea);

const contextMenu = _h.div({ class: "cms-panel cms-page" },
  _h.h1("ContextMenu"),
  _h.p("Menu contestuale su right-click con `bind` o `openAt(x,y)`. Supporta closeOnSelect e onOpen/onClose."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    contextMenuExample
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("ContextMenu")
);

export { contextMenu };

const ctxArea = _h.div({ class: "cms-panel", style: { padding: "12px" } }, "Right click qui");
const contextMenuApi = _ui.ContextMenu({ content: _ui.List(_ui.Item("Copia"), _ui.Item("Elimina")) });
contextMenuApi.bind(ctxArea);
const contextMenuExample = _ui.Row(ctxArea);

const contextMenuSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("ContextMenu sample"),
  _h.p("Menu contestuale su right-click con `bind` o `openAt(x,y)`. Supporta closeOnSelect e onOpen/onClose."),
  _ui.Card({ header: "Esempio" },
    contextMenuExample
  )
);

export { contextMenuSample };

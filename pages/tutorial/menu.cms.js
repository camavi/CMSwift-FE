const menuBtn = _ui.Btn("Apri menu");
const menuApi = _ui.Menu({ content: _ui.List(_ui.Item("Profilo"), _ui.Item("Logout")) });
menuBtn.addEventListener("click", () => menuApi.open(menuBtn));
const menuExample = _ui.Row(menuBtn);

const menu = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Menu"),
  _h.p("Menu overlay ancorato con close-on-select. API `open/close` e slot `content`."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    menuExample
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Menu")
);

export { menu };

const menuBtn = _ui.Btn("Apri menu");
const menuApi = _ui.Menu({ content: _ui.List(_ui.Item("Profilo"), _ui.Item("Logout")) });
menuBtn.addEventListener("click", () => menuApi.open(menuBtn));
const menuExample = _ui.Row(menuBtn);

const menuSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Menu sample"),
  _h.p("Menu overlay ancorato con close-on-select. API `open/close` e slot `content`."),
  _ui.Card({ header: "Esempio" },
    menuExample
  )
);

export { menuSample };

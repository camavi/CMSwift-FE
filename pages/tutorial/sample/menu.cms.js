const menuBtn = _.Btn("Apri menu");
const menuApi = _.Menu({ content: _.List(_.Item("Profilo"), _.Item("Logout")) });
menuBtn.addEventListener("click", () => menuApi.open(menuBtn));
const menuExample = _.Row(menuBtn);

const menuSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Menu sample"),
  _.p("Menu overlay ancorato con close-on-select. API `open/close` e slot `content`."),
  _.Card({ header: "Esempio" },
    menuExample
  )
);

export { menuSample };

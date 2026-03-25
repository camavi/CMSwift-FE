const menuBtn = _.Btn("Apri menu");
const menuApi = _.Menu({ content: _.List(_.Item("Profilo"), _.Item("Logout")) });
menuBtn.addEventListener("click", () => menuApi.open(menuBtn));
const menuExample = _.Row(menuBtn);

const menu = _.div({ class: "cms-panel cms-page" },
  _.h1("Menu"),
  _.p("Menu overlay ancorato con close-on-select. API `open/close` e slot `content`."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    menuExample
  ),
  _.h2("Documentazione API"),
  _.docTable("Menu")
);

export { menu };

const popBtn = _.Btn("Apri popover");
const popoverApi = _.Popover({ title: "Popover", content: "Contenuto popover" });
popBtn.addEventListener("click", () => popoverApi.open(popBtn));
const popoverExample = _.Row(popBtn);

const popover = _.div({ class: "cms-panel cms-page" },
  _.h1("Popover"),
  _.p("Popover overlay ancorato con title/content/actions. Supporta backdrop, trapFocus e closeOnOutside."),
  _.h2("Props principali"),
  _.List(
    _.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _.Item("state: success, warning, danger, info, primary, secondary"),
    _.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _.h2("Esempio completo"),
  _.Card({ header: "Demo" },
    popoverExample
  ),
  _.h2("Documentazione API"),
  _.DocTable("Popover")
);

export { popover };

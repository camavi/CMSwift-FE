const popBtn = _ui.Btn("Apri popover");
const popoverApi = _ui.Popover({ title: "Popover", content: "Contenuto popover" });
popBtn.addEventListener("click", () => popoverApi.open(popBtn));
const popoverExample = _ui.Row(popBtn);

const popover = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Popover"),
  _h.p("Popover overlay ancorato con title/content/actions. Supporta backdrop, trapFocus e closeOnOutside."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("state: success, warning, danger, info, primary, secondary"),
    _ui.Item("outline, shadow, borderRadius, clickable per stile e interazione")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Demo" },
    popoverExample
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Popover")
);

export { popover };

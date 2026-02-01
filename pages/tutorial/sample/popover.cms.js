const popBtn = _ui.Btn("Apri popover");
const popoverApi = _ui.Popover({ title: "Popover", content: "Contenuto popover" });
popBtn.addEventListener("click", () => popoverApi.open(popBtn));
const popoverExample = _ui.Row(popBtn);

const popoverSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Popover sample"),
  _h.p("Popover overlay ancorato con title/content/actions. Supporta backdrop, trapFocus e closeOnOutside."),
  _ui.Card({ header: "Esempio" },
    popoverExample
  )
);

export { popoverSample };

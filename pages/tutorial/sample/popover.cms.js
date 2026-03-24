const popBtn = _.Btn("Apri popover");
const popoverApi = _.Popover({ title: "Popover", content: "Contenuto popover" });
popBtn.addEventListener("click", () => popoverApi.open(popBtn));
const popoverExample = _.Row(popBtn);

const popoverSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Popover sample"),
  _.p("Popover overlay ancorato con title/content/actions. Supporta backdrop, trapFocus e closeOnOutside."),
  _.Card({ header: "Esempio" },
    popoverExample
  )
);

export { popoverSample };

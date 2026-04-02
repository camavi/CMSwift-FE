const parallaxSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Parallax sample"),
  _.p("Hero parallax con title/subtitle, actions e background configurabile. Supporta anche slot strutturati come `badge`, `media`, `footer` e `actions`."),
  _.Card({ header: "Esempio" },
    _.Parallax({
      height: "260px",
      background: "linear-gradient(135deg, #081827 0%, #0f4c81 48%, #0f766e 100%)",
      eyebrow: "Sample",
      title: "Parallax standardizzato",
      subtitle: "Usalo come hero o banner operativo senza markup ad hoc.",
      actions: _.Btn({ size: "sm", color: "primary" }, "Apri")
    })
  )
);

export { parallaxSample };

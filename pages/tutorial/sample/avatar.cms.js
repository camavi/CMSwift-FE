const avatarSample = _.div({ class: "cms-panel cms-page" },
  _.h2("Avatar sample"),
  _.p("Avatar con immagine `src` o fallback testuale. Supporta size, square e variante elevated."),
  _.Card({ header: "Esempio" },
    _.Avatar({ label: "CM", size: 40 })
  )
);

export { avatarSample };

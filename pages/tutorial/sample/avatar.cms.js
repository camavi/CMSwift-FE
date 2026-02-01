const avatarSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Avatar sample"),
  _h.p("Avatar con immagine `src` o fallback testuale. Supporta size, square e variante elevated."),
  _ui.Card({ header: "Esempio" },
    _ui.Avatar({ label: "CM", size: 40 })
  )
);

export { avatarSample };

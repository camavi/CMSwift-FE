const bannerSample = _h.div({ class: "cms-panel cms-page" },
  _h.h2("Banner sample"),
  _h.p("Banner informativo con messaggio e azioni opzionali. Supporta type, densita e slot message/actions."),
  _ui.Card({ header: "Esempio" },
    _ui.Banner({ type: "success", message: "Operazione completata" })
  )
);

export { bannerSample };

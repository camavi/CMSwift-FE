const badgeNotifications = CMSwift.reactive.signal(7);
const badgeDownloads = CMSwift.reactive.signal(2);

const badge = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Badge"),
  _h.p("Badge inline a pillola con notification reattiva e 6 slot icona posizionabili. Usa `label`, `notification` e gli slot dedicati."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("size: dimensione del componente (xs-sm-md-lg-xl)"),
    _ui.Item("notification: badge numerico reattivo, anche via signal"),
    _ui.Item("topLeft, topRight, bottomLeft, bottomRight, left, right: 6 posizioni icona"),
    _ui.Item("slots: `label`, `notification` e gli slot icona per personalizzare il rendering")
  ),
  _h.h2("Esempio completo"),
  _ui.Card({ header: "Badge base e con slot icona" },
    _ui.Toolbar({ wrap: true, gap: "20px" },
      _ui.Badge({ color: "primary" }, "New"),
      _ui.Badge({ color: "success", left: "check_circle" }, "Online"),
      _ui.Badge({ color: "warning", topLeft: "star", right: "bolt" }, "Beta"),
      _ui.Badge({ color: "secondary", bottomRight: "download_done", topRight: "cloud" }, "Deploy")
    )
  ),
  _ui.Card({ header: "Notification reattiva" },
    _ui.Toolbar({ wrap: true, gap: "12px" },
      _ui.Badge({
        color: "primary",
        label: () => badgeNotifications[0]() > 9 ? "Inbox busy" : "Inbox",
        centerRight: "mail",
        notification: badgeNotifications
      }),
      _ui.Badge({
        color: "info",
        label: "Downloads",
        centerLeft: "download",
        notification: badgeDownloads,
        slots: {
          topLeft: () => _ui.Icon({ name: badgeDownloads[0]() > 3 ? "sync" : "schedule", size: 12 })
        }
      }),
      _ui.Btn({
        size: "sm",
        onClick: () => badgeNotifications[1](badgeNotifications[0]() + 1)
      }, "Inbox +1"),
      _ui.Btn({
        size: "sm",
        onClick: () => badgeNotifications[1](Math.max(0, badgeNotifications[0]() - 1))
      }, "Inbox -1"),
      _ui.Btn({
        size: "sm",
        onClick: () => badgeDownloads[1](badgeDownloads[0]() + 1)
      }, "Download +1"),
      _ui.Btn({
        size: "sm",
        onClick: () => {
          badgeNotifications[1](0);
          badgeDownloads[1](0);
        }
      }, "Reset")
    )
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Badge"),
);

export { badge };

const badgeNotifications = CMSwift.reactive.signal(7);
const badgeDownloads = CMSwift.reactive.signal(2);
const badgeEnergy = CMSwift.reactive.signal(84);

const listSample = {
  basic: {
    code: [
      _ui.Badge("Default"),
      _ui.Badge({ color: "success" }, "Success"),
      _ui.Badge({ color: "warning" }, "Warning"),
      _ui.Badge({ color: "danger" }, "Danger"),
      _ui.Badge({ color: "info" }, "Info"),
      _ui.Badge({ color: "primary" }, "Primary"),
      _ui.Badge({ color: "secondary" }, "Secondary"),
      _ui.Badge({ color: "dark" }, "Dark"),
      _ui.Badge({ color: "light" }, "Light")
    ],
    sample: [
      '_ui.Badge("Default");',
      '_ui.Badge({ color: "success" }, "Success");',
      '_ui.Badge({ color: "warning" }, "Warning");',
      '_ui.Badge({ color: "danger" }, "Danger");',
      '_ui.Badge({ color: "info" }, "Info");',
      '_ui.Badge({ color: "primary" }, "Primary");',
      '_ui.Badge({ color: "secondary" }, "Secondary");',
      '_ui.Badge({ color: "dark" }, "Dark");',
      '_ui.Badge({ color: "light" }, "Light");',
    ]
  },
  size: {
    code: [
      _ui.Badge({ size: "xxs", color: "success" }, "XXS"),
      _ui.Badge({ size: "xs", color: "success" }, "XS"),
      _ui.Badge({ size: "sm", color: "info" }, "SM"),
      _ui.Badge({ size: "md", color: "primary" }, "MD"),
      _ui.Badge({ size: "lg", color: "warning" }, "LG"),
      _ui.Badge({ size: "xl", color: "danger" }, "XL"),
      _ui.Badge({ size: 22, color: "secondary" }, "22px")
    ],
    sample: [
      '_ui.Badge({ size: "xxs", color: "success" }, "XXS");',
      '_ui.Badge({ size: "xs", color: "success" }, "XS");',
      '_ui.Badge({ size: "sm", color: "info" }, "SM");',
      '_ui.Badge({ size: "md", color: "primary" }, "MD");',
      '_ui.Badge({ size: "lg", color: "warning" }, "LG");',
      '_ui.Badge({ size: "xl", color: "danger" }, "XL");',
      '_ui.Badge({ size: 22, color: "secondary" }, "22px");',
    ]
  },
  outline: {
    code: [
      _ui.Badge({ outline: true }, "Minimal"),
      _ui.Badge({ outline: true, color: "success", left: "verified" }, "Ready"),
      _ui.Badge({ outline: true, color: "warning", right: "bolt" }, "Preview"),
      _ui.Badge({ outline: true, color: "danger", topRight: "priority_high" }, "Alert"),
      _ui.Badge({ outline: true, color: "secondary", bottomLeft: "palette" }, "Studio")
    ],
    sample: [
      '_ui.Badge({ outline: true }, "Minimal");',
      '_ui.Badge({ outline: true, color: "success", left: "verified" }, "Ready");',
      '_ui.Badge({ outline: true, color: "warning", right: "bolt" }, "Preview");',
      '_ui.Badge({ outline: true, color: "danger", topRight: "priority_high" }, "Alert");',
      '_ui.Badge({ outline: true, color: "secondary", bottomLeft: "palette" }, "Studio");',
    ]
  },
  anchors: {
    code: [
      _ui.Badge({ color: "primary", left: "check_circle" }, "Left"),
      _ui.Badge({ color: "success", right: "east" }, "Right"),
      _ui.Badge({ color: "warning", topLeft: "star" }, "Top Left"),
      _ui.Badge({ color: "danger", topRight: "flare" }, "Top Right"),
      _ui.Badge({ color: "info", bottomLeft: "download_done" }, "Bottom Left"),
      _ui.Badge({ color: "secondary", bottomRight: "rocket_launch" }, "Bottom Right"),
      _ui.Badge({ color: "dark", left: "auto_awesome", right: "favorite" }, "Double Icon")
    ],
    sample: [
      '_ui.Badge({ color: "primary", left: "check_circle" }, "Left");',
      '_ui.Badge({ color: "success", right: "east" }, "Right");',
      '_ui.Badge({ color: "warning", topLeft: "star" }, "Top Left");',
      '_ui.Badge({ color: "danger", topRight: "flare" }, "Top Right");',
      '_ui.Badge({ color: "info", bottomLeft: "download_done" }, "Bottom Left");',
      '_ui.Badge({ color: "secondary", bottomRight: "rocket_launch" }, "Bottom Right");',
      '_ui.Badge({ color: "dark", left: "auto_awesome", right: "favorite" }, "Double Icon");',
    ]
  },
  notification: {
    code: [
      _ui.Badge({ color: "primary", notification: 3 }, "Inbox"),
      _ui.Badge({ color: "danger", notification: 99, topRight: "campaign" }, "Broadcast"),
      _ui.Badge({ color: "info", notification: "NEW", right: "bolt" }, "Release"),
      _ui.Badge({ color: "success", notification: badgeDownloads, left: "download" }, "Downloads")
    ],
    sample: [
      '_ui.Badge({ color: "primary", notification: 3 }, "Inbox");',
      '_ui.Badge({ color: "danger", notification: 99, topRight: "campaign" }, "Broadcast");',
      '_ui.Badge({ color: "info", notification: "NEW", right: "bolt" }, "Release");',
      '_ui.Badge({ color: "success", notification: badgeDownloads, left: "download" }, "Downloads");',
    ]
  },
  slots: {
    code: [
      _ui.Badge({
        color: "secondary",
        slots: {
          label: () => _h.span(
            { style: { display: "inline-flex", gap: "6px", alignItems: "center" } },
            _ui.Icon({ name: "theater_comedy", size: 13 }),
            "Scene Mode"
          )
        }
      }),
      _ui.Badge({
        color: "primary",
        notification: badgeNotifications,
        slots: {
          notification: ({ notification }) => _h.span(
            {
              style: {
                minWidth: "22px",
                textAlign: "center",
                fontWeight: "700"
              }
            },
            notification > 9 ? "9+" : notification
          )
        }
      }, "Inbox"),
      _ui.Badge({
        color: "warning",
        bottomLeft: "star",
        slots: {
          right: () => _ui.Icon({ name: badgeEnergy[0]() > 90 ? "mode_heat" : "wb_incandescent", size: 13 }),
          label: () => `Energy ${badgeEnergy[0]()}%`
        }
      })
    ],
    sample: [
      '_ui.Badge({',
      '  color: "secondary",',
      '  slots: {',
      '    label: () => _h.span({ style: { display: "inline-flex", gap: "6px", alignItems: "center" } }, _ui.Icon({ name: "theater_comedy", size: 13 }), "Scene Mode")',
      '  }',
      '});',
      '',
      '_ui.Badge({',
      '  color: "primary",',
      '  notification: badgeNotifications,',
      '  slots: {',
      '    notification: ({ notification }) => _h.span({ style: { minWidth: "22px", textAlign: "center", fontWeight: "700" } }, notification > 9 ? "9+" : notification)',
      '  }',
      '}, "Inbox");',
      '',
      '_ui.Badge({',
      '  color: "warning",',
      '  bottomLeft: "star",',
      '  slots: {',
      '    right: () => _ui.Icon({ name: badgeEnergy[0]() > 90 ? "mode_heat" : "wb_incandescent", size: 13 }),',
    ]
  },
  reactive: {
    code: [
      _h.div({ style: { display: "grid", gap: "16px" } },
        _ui.Toolbar({ wrap: true, gap: "20px" },
          _ui.Badge({
            color: "primary",
            notification: badgeNotifications,
            bottomRight: "mail",
            label: () => badgeNotifications[0]() > 12 ? "Inbox on fire" : "Inbox"
          }),
          _ui.Badge({
            color: "info",
            notification: badgeDownloads,
            left: "download",
            label: () => badgeDownloads[0]() > 4 ? "Downloads in progress" : "Downloads"
          }),
          _ui.Badge({
            color: () => badgeEnergy[0]() > 90 ? "warning" : "success",
            notification: () => `${badgeEnergy[0]()}%`,
            bottomRight: "bolt",
            label: () => badgeEnergy[0]() > 90 ? "Core overheated" : "Core stable"
          })
        ),
        _ui.Toolbar({ wrap: true, gap: "10px" },
          _ui.Btn({
            size: "sm",
            onClick: () => badgeNotifications[1](badgeNotifications[0]() + 1)
          }, "Inbox +1"),
          _ui.Btn({
            size: "sm",
            onClick: () => badgeDownloads[1](badgeDownloads[0]() + 1)
          }, "Download +1"),
          _ui.Btn({
            size: "sm",
            onClick: () => badgeEnergy[1](Math.min(100, badgeEnergy[0]() + 3))
          }, "Energy +3"),
          _ui.Btn({
            size: "sm",
            onClick: () => badgeEnergy[1](Math.max(0, badgeEnergy[0]() - 8))
          }, "Cool -8"),
          _ui.Btn({
            size: "sm",
            onClick: () => {
              badgeNotifications[1](7);
              badgeDownloads[1](2);
              badgeEnergy[1](84);
            }
          }, "Reset scene")
        )
      )
    ],
    sample: [
      'const badgeNotifications = CMSwift.reactive.signal(7);',
      'const badgeDownloads = CMSwift.reactive.signal(2);',
      'const badgeEnergy = CMSwift.reactive.signal(84);',
      '',
      '_ui.Badge({',
      '  color: "primary",',
      '  notification: badgeNotifications,',
      '  bottomRight: "mail",',
      '  label: () => badgeNotifications[0]() > 12 ? "Inbox on fire" : "Inbox"',
      '});',
      '',
      '_ui.Btn({ onClick: () => badgeNotifications[1](badgeNotifications[0]() + 1) }, "Inbox +1");',
    ]
  }
};

const badge = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Badge"),
  _h.p("Badge e un micro-componente scenico: etichetta compatta, icone ancorate, notification reattiva e slot per costruire micro-stati ricchi senza aprire card o modali."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("color, outline e size per definire tono visivo e densita"),
    _ui.Item("label o children per il contenuto principale"),
    _ui.Item("notification anche reattiva tramite signal"),
    _ui.Item("left, right, topLeft, topRight, bottomLeft, bottomRight per ancorare icone"),
    _ui.Item("slots: label, notification e slot icona per render custom")
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Badge"),
  _h.h2("Tutorial completo"),
  boxCode("Basic color", listSample.basic),
  boxCode("Size", listSample.size),
  boxCode("Outline", listSample.outline),
  boxCode("Icon anchors", listSample.anchors),
  boxCode("Notification", listSample.notification),
  boxCode("Slots", listSample.slots),
  boxCode("Reactive control room", listSample.reactive),
);

export { badge };

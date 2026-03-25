const badgeNotifications = _.signal(7);
const badgeDownloads = _.signal(2);
const badgeEnergy = _.signal(84);

const listSample = {
  basic: {
    code: [
      _.Badge("Default"),
      _.Badge({ color: "success" }, "Success"),
      _.Badge({ color: "warning" }, "Warning"),
      _.Badge({ color: "danger" }, "Danger"),
      _.Badge({ color: "info" }, "Info"),
      _.Badge({ color: "primary" }, "Primary"),
      _.Badge({ color: "secondary" }, "Secondary"),
      _.Badge({ color: "dark" }, "Dark"),
      _.Badge({ color: "light" }, "Light")
    ],
    sample: [
      '_.Badge("Default");',
      '_.Badge({ color: "success" }, "Success");',
      '_.Badge({ color: "warning" }, "Warning");',
      '_.Badge({ color: "danger" }, "Danger");',
      '_.Badge({ color: "info" }, "Info");',
      '_.Badge({ color: "primary" }, "Primary");',
      '_.Badge({ color: "secondary" }, "Secondary");',
      '_.Badge({ color: "dark" }, "Dark");',
      '_.Badge({ color: "light" }, "Light");',
    ]
  },
  size: {
    code: [
      _.Badge({ size: "xxs", color: "success" }, "XXS"),
      _.Badge({ size: "xs", color: "success" }, "XS"),
      _.Badge({ size: "sm", color: "info" }, "SM"),
      _.Badge({ size: "md", color: "primary" }, "MD"),
      _.Badge({ size: "lg", color: "warning" }, "LG"),
      _.Badge({ size: "xl", color: "danger" }, "XL"),
      _.Badge({ size: 22, color: "secondary" }, "22px")
    ],
    sample: [
      '_.Badge({ size: "xxs", color: "success" }, "XXS");',
      '_.Badge({ size: "xs", color: "success" }, "XS");',
      '_.Badge({ size: "sm", color: "info" }, "SM");',
      '_.Badge({ size: "md", color: "primary" }, "MD");',
      '_.Badge({ size: "lg", color: "warning" }, "LG");',
      '_.Badge({ size: "xl", color: "danger" }, "XL");',
      '_.Badge({ size: 22, color: "secondary" }, "22px");',
    ]
  },
  outline: {
    code: [
      _.Badge({ outline: true }, "Minimal"),
      _.Badge({ outline: true, color: "success", left: "verified" }, "Ready"),
      _.Badge({ outline: true, color: "warning", right: "bolt" }, "Preview"),
      _.Badge({ outline: true, color: "danger", topRight: "priority_high" }, "Alert"),
      _.Badge({ outline: true, color: "secondary", bottomLeft: "palette" }, "Studio")
    ],
    sample: [
      '_.Badge({ outline: true }, "Minimal");',
      '_.Badge({ outline: true, color: "success", left: "verified" }, "Ready");',
      '_.Badge({ outline: true, color: "warning", right: "bolt" }, "Preview");',
      '_.Badge({ outline: true, color: "danger", topRight: "priority_high" }, "Alert");',
      '_.Badge({ outline: true, color: "secondary", bottomLeft: "palette" }, "Studio");',
    ]
  },
  anchors: {
    code: [
      _.Badge({ color: "primary", left: "check_circle" }, "Left"),
      _.Badge({ color: "success", right: "east" }, "Right"),
      _.Badge({ color: "warning", topLeft: "star" }, "Top Left"),
      _.Badge({ color: "danger", topRight: "flare" }, "Top Right"),
      _.Badge({ color: "info", bottomLeft: "download_done" }, "Bottom Left"),
      _.Badge({ color: "secondary", bottomRight: "rocket_launch" }, "Bottom Right"),
      _.Badge({ color: "dark", left: "auto_awesome", right: "favorite" }, "Double Icon")
    ],
    sample: [
      '_.Badge({ color: "primary", left: "check_circle" }, "Left");',
      '_.Badge({ color: "success", right: "east" }, "Right");',
      '_.Badge({ color: "warning", topLeft: "star" }, "Top Left");',
      '_.Badge({ color: "danger", topRight: "flare" }, "Top Right");',
      '_.Badge({ color: "info", bottomLeft: "download_done" }, "Bottom Left");',
      '_.Badge({ color: "secondary", bottomRight: "rocket_launch" }, "Bottom Right");',
      '_.Badge({ color: "dark", left: "auto_awesome", right: "favorite" }, "Double Icon");',
    ]
  },
  notification: {
    code: [
      _.Badge({ color: "primary", notification: 3 }, "Inbox"),
      _.Badge({ color: "danger", notification: 99, topRight: "campaign" }, "Broadcast"),
      _.Badge({ color: "info", notification: "NEW", right: "bolt" }, "Release"),
      _.Badge({ color: "success", notification: badgeDownloads, left: "download" }, "Downloads")
    ],
    sample: [
      '_.Badge({ color: "primary", notification: 3 }, "Inbox");',
      '_.Badge({ color: "danger", notification: 99, topRight: "campaign" }, "Broadcast");',
      '_.Badge({ color: "info", notification: "NEW", right: "bolt" }, "Release");',
      '_.Badge({ color: "success", notification: badgeDownloads, left: "download" }, "Downloads");',
    ]
  },
  slots: {
    code: [
      _.Badge({
        color: "secondary",
        slots: {
          label: () => _.span(
            { style: { display: "inline-flex", gap: "6px", alignItems: "center" } },
            _.Icon({ name: "theater_comedy", size: 13 }),
            "Scene Mode"
          )
        }
      }),
      _.Badge({
        color: "primary",
        notification: badgeNotifications,
        slots: {
          notification: ({ notification }) => _.span(
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
      _.Badge({
        color: "warning",
        bottomLeft: "star",
        slots: {
          right: () => _.Icon({ name: badgeEnergy[0]() > 90 ? "mode_heat" : "wb_incandescent", size: 13 }),
          label: () => `Energy ${badgeEnergy[0]()}%`
        }
      })
    ],
    sample: [
      '_.Badge({',
      '  color: "secondary",',
      '  slots: {',
      '    label: () => _.span({ style: { display: "inline-flex", gap: "6px", alignItems: "center" } }, _.Icon({ name: "theater_comedy", size: 13 }), "Scene Mode")',
      '  }',
      '});',
      '',
      '_.Badge({',
      '  color: "primary",',
      '  notification: badgeNotifications,',
      '  slots: {',
      '    notification: ({ notification }) => _.span({ style: { minWidth: "22px", textAlign: "center", fontWeight: "700" } }, notification > 9 ? "9+" : notification)',
      '  }',
      '}, "Inbox");',
      '',
      '_.Badge({',
      '  color: "warning",',
      '  bottomLeft: "star",',
      '  slots: {',
      '    right: () => _.Icon({ name: badgeEnergy[0]() > 90 ? "mode_heat" : "wb_incandescent", size: 13 }),',
    ]
  },
  reactive: {
    code: [
      _.div({ style: { display: "grid", gap: "16px" } },
        _.Toolbar({ wrap: true, gap: "20px" },
          _.Badge({
            color: "primary",
            notification: badgeNotifications,
            bottomRight: "mail",
            label: () => badgeNotifications[0]() > 12 ? "Inbox on fire" : "Inbox"
          }),
          _.Badge({
            color: "info",
            notification: badgeDownloads,
            left: "download",
            label: () => badgeDownloads[0]() > 4 ? "Downloads in progress" : "Downloads"
          }),
          _.Badge({
            color: () => badgeEnergy[0]() > 90 ? "warning" : "success",
            notification: () => `${badgeEnergy[0]()}%`,
            bottomRight: "bolt",
            label: () => badgeEnergy[0]() > 90 ? "Core overheated" : "Core stable"
          })
        ),
        _.Toolbar({ wrap: true, gap: "10px" },
          _.Btn({
            size: "sm",
            onClick: () => badgeNotifications[1](badgeNotifications[0]() + 1)
          }, "Inbox +1"),
          _.Btn({
            size: "sm",
            onClick: () => badgeDownloads[1](badgeDownloads[0]() + 1)
          }, "Download +1"),
          _.Btn({
            size: "sm",
            onClick: () => badgeEnergy[1](Math.min(100, badgeEnergy[0]() + 3))
          }, "Energy +3"),
          _.Btn({
            size: "sm",
            onClick: () => badgeEnergy[1](Math.max(0, badgeEnergy[0]() - 8))
          }, "Cool -8"),
          _.Btn({
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
      'const badgeNotifications = _.signal(7);',
      'const badgeDownloads = _.signal(2);',
      'const badgeEnergy = _.signal(84);',
      '',
      '_.Badge({',
      '  color: "primary",',
      '  notification: badgeNotifications,',
      '  bottomRight: "mail",',
      '  label: () => badgeNotifications[0]() > 12 ? "Inbox on fire" : "Inbox"',
      '});',
      '',
      '_.Btn({ onClick: () => badgeNotifications[1](badgeNotifications[0]() + 1) }, "Inbox +1");',
    ]
  }
};

const badge = _.div({ class: "cms-panel cms-page" },
  _.h1("Badge"),
  _.p("Badge e un micro-componente scenico: etichetta compatta, icone ancorate, notification reattiva e slot per costruire micro-stati ricchi senza aprire card o modali."),
  _.h2("Props principali"),
  _.List(
    _.Item("color, outline e size per definire tono visivo e densita"),
    _.Item("label o children per il contenuto principale"),
    _.Item("notification anche reattiva tramite signal"),
    _.Item("left, right, topLeft, topRight, bottomLeft, bottomRight per ancorare icone"),
    _.Item("slots: label, notification e slot icona per render custom")
  ),
  _.h2("Documentazione API"),
  _.docTable("Badge"),
  _.h2("Tutorial completo"),
  boxCode("Basic color", listSample.basic),
  boxCode("Size", listSample.size),
  boxCode("Outline", listSample.outline),
  boxCode("Icon anchors", listSample.anchors),
  boxCode("Notification", listSample.notification),
  boxCode("Slots", listSample.slots),
  boxCode("Reactive control room", listSample.reactive),
);

export { badge };

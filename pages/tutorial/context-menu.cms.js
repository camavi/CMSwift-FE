const createSection = (code, sample) => ({
  code: Array.isArray(code) ? code : [code],
  sample: Array.isArray(sample) ? sample : [sample]
});

const row = (...children) => _.div({
  style: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    alignItems: "center"
  }
}, ...children);

const stack = (...children) => _.div({
  style: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  }
}, ...children);

const surfaceStyle = {
  minHeight: "180px",
  padding: "18px",
  borderRadius: "18px",
  border: "1px dashed rgba(127,127,127,0.28)",
  background: "linear-gradient(180deg, rgba(127,127,127,0.08), rgba(127,127,127,0.03))",
  cursor: "context-menu"
};

const contextStatus = _.rod("Nessuna azione eseguita.");
const layoutMode = _.rod("grid");
const layoutDensity = _.rod("comfortable");
const layoutFlags = _.rod({
  snap: true,
  guides: true,
  safeArea: false
});
const stagePoint = _.rod({ x: 180, y: 110 });

const explorerMenu = _.ContextMenu({
  width: 320,
  state: "primary",
  title: "hero-home-v4.fig",
  subtitle: "Cartella Campaign / Spring 2026",
  eyebrow: "File explorer",
  status: _.Chip({ color: "info", size: "xs", outline: true }, "Ultimo sync 14:28"),
  items: [
    {
      label: "Apri anteprima",
      subtitle: "Apre il file nel visualizzatore media",
      icon: "open_in_new",
      shortcut: "Invio",
      onClick: () => {
        contextStatus.value = "Anteprima asset aperta.";
      }
    },
    {
      label: "Copia link interno",
      subtitle: "Condivide il permalink con il team",
      icon: "content_copy",
      shortcut: "Cmd+Shift+C",
      onClick: () => {
        contextStatus.value = "Link interno copiato negli appunti.";
      }
    },
    { divider: true },
    {
      label: "Invia a review",
      subtitle: "Crea un task per design e brand team",
      icon: "rate_review",
      badge: _.Chip({ color: "warning", size: "xs", outline: true }, "2 owner"),
      onClick: () => {
        contextStatus.value = "Task review creato per hero-home-v4.fig.";
      }
    },
    {
      label: "Archivia asset",
      subtitle: "Sposta il file nello storico del progetto",
      icon: "archive",
      color: "danger",
      onClick: () => {
        contextStatus.value = "Asset archiviato.";
      }
    }
  ]
});

const explorerSurface = _.div({ style: surfaceStyle, tabIndex: 0 },
  _.div({ style: { display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "flex-start" } },
    _.div(
      _.div({ style: { fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.72, fontWeight: "700" } }, "Area bindata"),
      _.div({ class: "cms-h4", style: { marginTop: "8px" } }, "Right click su questo asset"),
      _.p({ class: "cms-muted", style: { margin: "8px 0 0" } }, "Caso base per file explorer, DAM o lista documenti.")
    ),
    _.Chip({ color: "primary", outline: true, size: "sm" }, "bind(el)")
  ),
  _.div({ style: { marginTop: "18px", display: "flex", gap: "12px", alignItems: "center" } },
    _.Avatar({ label: "HH", size: "lg", color: "primary" }),
    _.div(
      _.div({ style: { fontWeight: "700" } }, "hero-home-v4.fig"),
      _.div({ class: "cms-muted", style: { fontSize: "12px" } }, "updated by Giulia Ferri · 82 MB")
    )
  )
);
explorerMenu.bind(explorerSurface);

const orderContextMenu = _.ContextMenu({
  size: "sm",
  width: 320,
  placement: "bottom-start"
});

const orderCards = [
  {
    id: "ORD-4421",
    customer: "Marketplace DE",
    tone: "warning",
    tag: "ETA +18h",
    summary: "Spedizione fuori soglia, serve riallineare il corriere."
  },
  {
    id: "ORD-4388",
    customer: "Wholesale IT",
    tone: "danger",
    tag: "P1",
    summary: "Picking bloccato da 26 minuti nel nodo Milano."
  },
  {
    id: "ORD-4350",
    customer: "VIP direct",
    tone: "info",
    tag: "VIP",
    summary: "Cliente premium con richiesta supporto dedicato."
  }
];

const orderCardNodes = orderCards.map((order) => {
  const card = _.Card({
    title: order.id,
    subtitle: order.customer,
    aside: _.Chip({ color: order.tone, outline: true, size: "xs" }, order.tag)
  },
    _.p(order.summary),
    _.div({ class: "cms-muted", style: { fontSize: "12px", cursor: "context-menu" } }, "Right click sulla card per aprire il menu riga.")
  );
  orderContextMenu.bind(card, {
    title: order.id,
    subtitle: order.customer,
    status: _.Chip({ color: order.tone, outline: true, size: "xs" }, order.tag),
    items: [
      {
        label: "Apri timeline",
        subtitle: order.summary,
        icon: "schedule",
        onClick: () => {
          contextStatus.value = `Timeline aperta per ${order.id}.`;
        }
      },
      {
        label: "Riassegna owner",
        subtitle: "Passa il caso al team operativo corretto",
        icon: "group_add",
        onClick: () => {
          contextStatus.value = `Owner riassegnato su ${order.id}.`;
        }
      },
      {
        label: "Escala immediatamente",
        subtitle: "Invia il caso al team competente",
        icon: "priority_high",
        color: order.tone,
        onClick: () => {
          contextStatus.value = `Escalation inviata per ${order.id}.`;
        }
      }
    ]
  });
  return card;
});

const layoutMenu = _.ContextMenu({
  width: 380,
  state: "secondary",
  closeOnSelect: false,
  title: "Widget analytics",
  subtitle: "Menu contestuale con contenuto custom e CTA finali.",
  content: () => _.div(
    _.div({ style: { paddingBottom: "8px", borderBottom: "1px solid rgba(127,127,127,0.14)" } },
      _.div({ style: { fontWeight: "700", marginBottom: "6px" } }, "Layout"),
      stack(
        _.Radio({ color: "secondary", value: "grid", model: layoutMode }, "Grid"),
        _.Radio({ color: "secondary", value: "list", model: layoutMode }, "List"),
        _.Radio({ color: "secondary", value: "focus", model: layoutMode }, "Focus")
      )
    ),
    _.div({ style: { padding: "8px 0", borderBottom: "1px solid rgba(127,127,127,0.14)" } },
      _.div({ style: { fontWeight: "700", marginBottom: "6px" } }, "Densita"),
      row(
        _.Chip({
          clickable: true,
          outline: layoutDensity.value !== "compact",
          color: layoutDensity.value === "compact" ? "secondary" : null,
          onClick: () => { layoutDensity.value = "compact"; }
        }, "Compact"),
        _.Chip({
          clickable: true,
          outline: layoutDensity.value !== "comfortable",
          color: layoutDensity.value === "comfortable" ? "secondary" : null,
          onClick: () => { layoutDensity.value = "comfortable"; }
        }, "Comfortable"),
        _.Chip({
          clickable: true,
          outline: layoutDensity.value !== "expanded",
          color: layoutDensity.value === "expanded" ? "secondary" : null,
          onClick: () => { layoutDensity.value = "expanded"; }
        }, "Expanded")
      )
    ),
    _.div(
      _.div({ style: { fontWeight: "700", marginBottom: "6px" } }, "Assist"),
      stack(
        _.Checkbox({ color: "info", model: layoutFlags.value.snap }, "Snap to grid"),
        _.Checkbox({ color: "success", model: layoutFlags.value.guides }, "Guide visive"),
        _.Checkbox({ color: "warning", model: layoutFlags.value.safeArea }, "Safe area mobile")
      )
    )
  ),
  footer: ({ close }) => row(
    _.Btn({
      outline: true,
      onClick: () => {
        layoutMode.value = "grid";
        layoutDensity.value = "comfortable";
        layoutFlags.value.snap = true;
        layoutFlags.value.guides = true;
        layoutFlags.value.safeArea = false;
        contextStatus.value = "Configurazione layout ripristinata.";
      }
    }, "Reset"),
    _.Btn({
      color: "secondary",
      onClick: () => {
        contextStatus.value = `Layout ${layoutMode.value} applicato in modalita ${layoutDensity.value}.`;
        close();
      }
    }, "Applica")
  )
});

const layoutSurface = _.div({ style: surfaceStyle, tabIndex: 0 },
  _.div({ style: { display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center" } },
    _.div(
      _.div({ style: { fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.72, fontWeight: "700" } }, "Custom content"),
      _.div({ class: "cms-h4", style: { marginTop: "8px" } }, "Widget dashboard"),
      _.p({ class: "cms-muted", style: { margin: "8px 0 0" } }, "Esempio per menu contestuali che devono ospitare controlli reali.")
    ),
    row(
      _.Chip({ color: "secondary", outline: true, size: "sm" }, () => layoutMode.value),
      _.Chip({ color: "info", outline: true, size: "sm" }, () => layoutDensity.value)
    )
  ),
  _.div({ style: { marginTop: "18px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" } },
    _.div({ class: "cms-panel", style: { minHeight: "46px" } }),
    _.div({ class: "cms-panel", style: { minHeight: "46px" } }),
    _.div({ class: "cms-panel", style: { minHeight: "46px" } }),
    _.div({ class: "cms-panel", style: { minHeight: "74px", gridColumn: "span 2" } }),
    _.div({ class: "cms-panel", style: { minHeight: "74px" } })
  )
);
layoutMenu.bind(layoutSurface);

const stageMenu = _.ContextMenu({
  width: 300,
  state: "info",
  title: "Stage point",
  subtitle: () => `Azione rapida su ${stagePoint.value.x}, ${stagePoint.value.y}`,
  items: [
    {
      label: "Inserisci annotation",
      subtitle: "Aggiunge una nota nel punto selezionato",
      icon: "edit_note",
      onClick: () => {
        contextStatus.value = `Annotation inserita a ${stagePoint.value.x}, ${stagePoint.value.y}.`;
      }
    },
    {
      label: "Crea hotspot QA",
      subtitle: "Marca il punto per review e test",
      icon: "ads_click",
      onClick: () => {
        contextStatus.value = `Hotspot QA creato a ${stagePoint.value.x}, ${stagePoint.value.y}.`;
      }
    },
    {
      label: "Centra viewport",
      subtitle: "Riposiziona la camera sul punto selezionato",
      icon: "center_focus_strong",
      onClick: () => {
        contextStatus.value = `Viewport centrata su ${stagePoint.value.x}, ${stagePoint.value.y}.`;
      }
    }
  ]
});

const stageSurface = _.div({
  tabIndex: 0,
  style: {
    ...surfaceStyle,
    position: "relative",
    overflow: "hidden"
  }
},
  _.div({
    style: {
      position: "absolute",
      inset: "0",
      background: "radial-gradient(circle at 20% 20%, rgba(38, 126, 255, 0.18), transparent 30%), radial-gradient(circle at 78% 66%, rgba(16, 185, 129, 0.18), transparent 26%)"
    }
  }),
  _.div({ style: { position: "relative", zIndex: "1" } },
    _.div({ style: { display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center" } },
      _.div(
        _.div({ style: { fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.72, fontWeight: "700" } }, "API imperativa"),
        _.div({ class: "cms-h4", style: { marginTop: "8px" } }, "Canvas / stage preview"),
        _.p({ class: "cms-muted", style: { margin: "8px 0 0" } }, "Apri il menu via `bind()` con click destro o via `openAt(x, y)` dai controlli.")
      ),
      _.Chip({ color: "info", outline: true, size: "sm" }, () => `${stagePoint.value.x}, ${stagePoint.value.y}`)
    ),
    _.div({
      style: {
        position: "relative",
        height: "120px",
        marginTop: "18px",
        borderRadius: "14px",
        border: "1px solid rgba(127,127,127,0.18)"
      }
    },
      _.div({
        style: {
          position: "absolute",
          left: () => `${stagePoint.value.x - 10}px`,
          top: () => `${stagePoint.value.y - 10}px`,
          width: "20px",
          height: "20px",
          borderRadius: "999px",
          background: "rgba(59, 130, 246, 0.82)",
          boxShadow: "0 0 0 8px rgba(59, 130, 246, 0.16)"
        }
      })
    )
  )
);
stageSurface.addEventListener("contextmenu", (e) => {
  const rect = stageSurface.getBoundingClientRect();
  stagePoint.value = {
    x: Math.round(e.clientX - rect.left),
    y: Math.round(e.clientY - rect.top)
  };
});
stageMenu.bind(stageSurface);

const openCenterBtn = _.Btn({
  outline: true,
  onClick: () => {
    const rect = stageSurface.getBoundingClientRect();
    const x = Math.round(rect.left + rect.width / 2);
    const y = Math.round(rect.top + rect.height / 2);
    stagePoint.value = { x: Math.round(rect.width / 2), y: Math.round(rect.height / 2) };
    stageMenu.openAt(x, y);
  }
}, "Apri al centro");

const openSavedPointBtn = _.Btn({
  color: "info",
  onClick: () => {
    const rect = stageSurface.getBoundingClientRect();
    stageMenu.openAt(rect.left + stagePoint.value.x, rect.top + stagePoint.value.y);
  }
}, "Apri all'ultimo punto");

const listSample = {
  basic: createSection(
    [
      _.p("Caso base: `bind(el)` su un asset o una card per aprire un menu contestuale ricco con `items`, shortcut, badge e chiusura automatica."),
      _.div({ class: "cms-m-b-md" },
        _.b("Ultima azione: "),
        _.span(contextStatus)
      ),
      explorerSurface
    ],
    [
      'const explorerMenu = _.ContextMenu({',
      '  width: 320,',
      '  title: "hero-home-v4.fig",',
      '  subtitle: "Cartella Campaign / Spring 2026",',
      '  items: [',
      '    { label: "Apri anteprima", icon: "open_in_new", shortcut: "Invio" },',
      '    { label: "Copia link interno", icon: "content_copy", shortcut: "Cmd+Shift+C" },',
      '    { divider: true },',
      '    { label: "Archivia asset", icon: "archive", color: "danger" }',
      '  ]',
      '});',
      'explorerMenu.bind(explorerSurface);'
    ]
  ),
  dynamic: createSection(
    [
      _.p("Stessa istanza, contesti runtime diversi: `bind(el, overrides)` evita di creare un menu per ogni riga o card."),
      _.Grid({ min: "240px", gap: "16px" }, ...orderCardNodes)
    ],
    [
      'const orderContextMenu = _.ContextMenu({ size: "sm", width: 320 });',
      'orderContextMenu.bind(card, {',
      '  title: order.id,',
      '  subtitle: order.customer,',
      '  status: _.Chip({ color: order.tone, outline: true, size: "xs" }, order.tag),',
      '  items: [',
      '    { label: "Apri timeline", icon: "schedule" },',
      '    { label: "Riassegna owner", icon: "group_add" },',
      '    { label: "Escala immediatamente", icon: "priority_high", color: order.tone }',
      '  ]',
      '});'
    ]
  ),
  custom: createSection(
    [
      _.p("Quando servono controlli veri, il componente riusa lo standard di `Menu`: contenuto custom, footer actions, stato e `closeOnSelect: false`."),
      _.div({ class: "cms-m-b-md" },
        _.b("Configurazione live: "),
        _.span(() => `${layoutMode.value} · ${layoutDensity.value} · snap ${layoutFlags.value.snap ? "on" : "off"}`)
      ),
      layoutSurface
    ],
    [
      'const layoutMenu = _.ContextMenu({',
      '  width: 380,',
      '  state: "secondary",',
      '  closeOnSelect: false,',
      '  title: "Widget analytics",',
      '  content: () => _.div(',
      '    _.Radio({ value: "grid", model: layoutMode }, "Grid"),',
      '    _.Checkbox({ model: layoutFlags.value.snap }, "Snap to grid"),',
      '    _.Chip({ clickable: true, onClick: () => { layoutDensity.value = "compact"; } }, "Compact")',
      '  ),',
      '  footer: ({ close }) => _.Btn({ color: "secondary", onClick: close }, "Applica")',
      '});',
      'layoutMenu.bind(layoutSurface);'
    ]
  ),
  imperative: createSection(
    [
      _.p("Per canvas, mappe o superfici libere usa `openAt(x, y)` o `open(event)` oltre al normale `bind()`."),
      row(openCenterBtn, openSavedPointBtn),
      _.div({ class: "cms-m-b-md" },
        _.b("Ultimo punto: "),
        _.span(() => `${stagePoint.value.x}, ${stagePoint.value.y}`)
      ),
      stageSurface
    ],
    [
      'const stageMenu = _.ContextMenu({ title: "Stage point", items: [{ label: "Inserisci annotation" }] });',
      'stageSurface.addEventListener("contextmenu", (e) => {',
      '  stagePoint.value = { x: e.clientX - rect.left, y: e.clientY - rect.top };',
      '});',
      'stageMenu.bind(stageSurface);',
      'stageMenu.openAt(x, y);',
      'stageMenu.open(event);'
    ]
  )
};

const contextMenu = _.div({ class: "cms-panel cms-page" },
  _.h1("ContextMenu"),
  _.p("Context menu standardizzato costruito sopra `Menu`: supporta `items`, slot ricchi, footer custom, runtime overrides per target diversi e API imperativa con `open/openAt/openFromEvent/toggle/update/bind/isOpen`."),
  _.h2("Props principali"),
  _.List(
    _.Item("title, subtitle, eyebrow, icon, content, footer, status, empty per la struttura standard"),
    _.Item("items con stringhe, item object, divider, group, checked, shortcut, badge, color, onClick e closeOnSelect"),
    _.Item("slots before/icon/eyebrow/title/subtitle/header/content/item/groupLabel/footer/after per layout custom"),
    _.Item("size, state, width, minWidth, maxWidth, maxHeight, placement, offsetX, offsetY per presenza e posizionamento"),
    _.Item("bind(el), bind(el, overrides), open(event), openAt(x, y), close, toggle, update e apertura anche da tastiera con tasto ContextMenu / Shift+F10")
  ),
  _.h2("Documentazione API"),
  _.docTable("ContextMenu"),
  _.h2("Esempi completi"),
  boxCode("Bind base su asset", listSample.basic),
  boxCode("Runtime overrides per riga", listSample.dynamic),
  boxCode("Contenuto custom e controlli", listSample.custom),
  boxCode("Canvas e openAt(x, y)", listSample.imperative)
);

export { contextMenu };

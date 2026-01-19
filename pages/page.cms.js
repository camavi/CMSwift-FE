function layoutPage(_content = null, _header = null, _drawer = null, _footer = null) {

  let currentLayout = null;
  const header = _header || _ui.Header({
    title: "CMSwift",
    subtitle: "Demo componenti UI",
    right: _ui.Toolbar(
      _ui.Btn(
        {
          icon: "#bell",
          onClick: () => _ui.Notify.info("Hai nuove notifiche"),
        },
        "Notifiche"
      ),
      _ui.Btn(
        {
          variant: "primary", icon: "#plus", onClick: () => {
            drawerOpen.value = false;
            _ui.Notify.info("Nuovo elemento");
            CMSwift.router.navigate("/demo/component/card");
          }
        },
        "Nuovo"
      )
    ),
  });
  const content = _content || _ui.Container(
    _h.div(
      { style: { margin: "16px 0" } },
      _h.h2("CMSwift UI Kit"),
      _h.p(
        "Tutti i componenti in azione su una singola pagina."
      )
    )
  )
  const drawer = _drawer || _ui.Drawer({
    stateKey: "demo:drawer",
    header: _h.h3({ class: "cms-t-center" }, "Menu principale"),
    items: [
      { label: "Home", to: "/demo", icon: "🏠" },

      { label: "Layout", to: "/demo/layout", icon: "📰" },
      {
        label: "Component", items: [
          {
            label: "AppShell", onClick: () => {
              currentLayout.page().innerHTML = "";
              currentLayout.page().appendChild(cardContent());
            }
          },
          { label: "Layout", onClick: () => currentLayout.mainUpdate(layoutContent, "/demo/component/layout") },
          { label: "Page", to: "/demo/component/page" },
          { label: "Header", to: "/demo/component/header" },
          { label: "Footer", to: "/demo/component/footer" },
          { label: "Container", to: "/demo/component/container" },
          { label: "Parallax", to: "/demo/component/parallax" },

          { label: "Row", to: "/demo/component/row" },
          { label: "Col", to: "/demo/component/col" },

          { label: "Grid", to: "/demo/component/grid" },
          { label: "Grid Col", to: "/demo/component/gridcol" },

          {
            label: "Card", onClick: () => currentLayout.mainUpdate(cardContent, "/demo/component/card")
          },
          { label: "CardHeader", to: "/demo/component/cardheader" },
          { label: "CardBody", to: "/demo/component/cardbody" },
          { label: "CardFooter", to: "/demo/component/cardfooter" },

          { label: "Tooltip", to: "/demo/component/tooltip" },
          { label: "Banner", to: "/demo/component/banner" },
          { label: "Toolbar", to: "/demo/component/toolbar" },

          { label: "Spinner", to: "/demo/component/spinner" },
          { label: "Progress", to: "/demo/component/progress" },
          { label: "Loading Bar", to: "/demo/component/loadingbar" },

          { label: "Tabs", to: "/demo/component/tabs" },
          { label: "RouteTab", to: "/demo/component/routetab" },

          { label: "Menu", to: "/demo/component/menu" },
          { label: "ContextMenu", to: "/demo/component/contextmenu" },
          { label: "Breadcrumbs", to: "/demo/component/breadcrumbs" },
          { label: "Drawer", to: "/demo/component/drawer" },


          { label: "Form", to: "/demo/component/form" },
          { label: "FormField", to: "/demo/component/formfield" },
          { label: "InputRaw", to: "/demo/component/inputraw" },
          { label: "Btn", to: "/demo/component/btn" },
          { label: "Input", to: "/demo/component/input" },
          { label: "Select", to: "/demo/component/select" },

          { label: "Checkbox", to: "/demo/component/checkbox" },
          { label: "Radio", to: "/demo/component/radio" },

          { label: "Toggle", to: "/demo/component/toggle" },
          { label: "Slider", to: "/demo/component/slider" },
          { label: "Rating", to: "/demo/component/rating" },

          { label: "Date", to: "/demo/component/date" },
          { label: "Time", to: "/demo/component/time" },

          { label: "List", to: "/demo/component/list" },
          { label: "Table", to: "/demo/component/table" },
          { label: "Pagination", to: "/demo/component/pagination" },

          { label: "Dialog", to: "/demo/component/dialog" },
          { label: "Popover", to: "/demo/component/popover" },

          { label: "Icon", to: "/demo/component/icon" },
          { label: "Avatar", to: "/demo/component/avatar" },
          { label: "Badge", to: "/demo/component/badge" },
          { label: "Chip", to: "/demo/component/chip" },
          { label: "Item", to: "/demo/component/item" },

          { label: "Separator", to: "/demo/component/separator" },
          { label: "Spacer", to: "/demo/component/spacer" },

        ]
      },
    ],
  });
  const footer = _footer || _ui.Footer(
    _h.div(
      "CMSwift UI Demo • Layout completo con componenti attivi",
      _ui.Icon({ color: "red", name: "#heart" })
    )
  );

  const drawerOpen = _rod(true)

  currentLayout = _ui.Layout({
    header: header,
    aside: drawer,
    page: content,
    footer: footer,
    drawerOpen: drawerOpen,
    tagPage: true
  });

  return currentLayout;
}

function home() {
  const content = _ui.Card(
    { header: "Card Home Header", footer: "Card Footer", actions: "Card Actions" },
    _h.div("Card Home content")
  )
  return layoutPage(content);
}

const cardContent = () => {
  return _ui.Card(
    { header: "Card Header", footer: "Card Footer", actions: "Card Actions" },
    _h.div("Card body content"),
  );
}


function card() {
  return layoutPage(cardContent());
}
const layoutContent = () => {
  const content = _h.div({ class: "cms-panel cms-page" },
    _h.h1("Layout"),
    //descrizione
    _h.p("Componente di layout principale per applicazioni CMSwift. Fornisce una struttura solida e responsiva per organizzare l’interfaccia in header, drawer laterale (aside), contenuto principale e footer, con un sistema flessibile di controllo, aggiornamento dinamico e comportamento adattivo mobile/desktop."),
    _h.p("UI.Layout è progettato per essere il contenitore base di ogni applicazione: gestisce la griglia principale, il drawer laterale responsivo, le aree sticky opzionali e offre un’API completa per controllare e aggiornare il layout in modo dinamico."),
    _h.h2("Struttura del layout:"),
    _h.div({ class: "cms-p-l-lg" },
      _ui.List(
        _ui.Item("Header: area superiore opzionale, ideale per toolbar, navigazione o branding."),
        _ui.Item("Aside (Drawer): pannello laterale per menu o navigazione, utilizzabile come drawer su mobile o come sidebar fissa su desktop."),
        _ui.Item("Page (Main): area centrale principale dell’app, renderizzata all’interno di un elemento <main>."),
        _ui.Item("Footer: area inferiore opzionale per informazioni, azioni o contenuti persistenti.")
      )
    ),
    _h.h2("Gestione dei contenuti:"),
    _h.p("I contenuti possono essere forniti come nodi, array di nodi o funzioni."),
    _h.div({ class: "cms-p-l-lg" },
      _ui.List(
        _ui.Item("Supporta slot dedicati (header, aside, page, footer) per una composizione flessibile e modulare."),
        _ui.Item("Ogni sezione può essere aggiornata o sostituita dinamicamente a runtime senza ricreare l’intero layout."),
      )
    ),
    _h.h2("Drawer responsivo:"),
    _h.p("Il drawer laterale è completamente responsivo e cambia comportamento in base alla larghezza dello schermo."),
    _h.div({ class: "cms-p-l-lg" },
      _ui.List(
        _ui.Item("Su desktop il drawer può essere fisso o nascosto, adattando automaticamente la griglia del layout."),
        _ui.Item("Su mobile il drawer diventa un pannello a comparsa con overlay."),
        _ui.Item("Lo stato di apertura può essere gestito internamente o controllato dall’esterno tramite state reattivo (signal o rod)."),
      )
    ),
    _h.h2("Overlay e interazioni:"),
    _h.p("In modalità mobile viene mostrato un overlay che oscura il contenuto quando il drawer è aperto."),
    _h.div({ class: "cms-p-l-lg" },
      _ui.List(
        _ui.Item("L’overlay può chiudere il drawer al click."),
        _ui.Item("È supportata la chiusura del drawer tramite tasto ESC su dispositivi mobili."),
      )
    ),
    _h.h2("Sticky layout:"),
    _h.div({ class: "cms-p-l-lg" },
      _ui.List(
        _ui.Item("Header, footer e aside possono essere resi sticky in modo indipendente."),
        _ui.Item("Ideale per toolbar sempre visibili, menu laterali persistenti o footer fissi."),
        _ui.Item("L’altezza dell’header viene calcolata automaticamente e resa disponibile come variabile CSS per una gestione precisa degli offset."),
      )
    ),
    _h.h2("API e controllo:"),
    _h.p("Espone metodi semplici per controllare il drawer:"),
    _h.div({ class: "cms-p-l-lg" },
      _ui.List(
        _ui.Item("openAside()"),
        _ui.Item("closeAside()"),
        _ui.Item("toggleAside()"),
        _ui.Item("Espone riferimenti diretti alle sezioni (header, aside, page, footer)."),
        _ui.Item("Fornisce metodi di aggiornamento dinamico per ogni area, con supporto opzionale all’aggiornamento dell’URL."),
      )
    ),
    _h.h2("Performance e lifecycle:"),
    _h.p("Evita ricostruzioni inutili del DOM aggiornando solo le sezioni necessarie."),
    _h.div({ class: "cms-p-l-lg" },
      _ui.List(
        _ui.Item("Gestisce automaticamente event listener e osservatori."),
        _ui.Item("Include un metodo di cleanup per rimuovere listener e risorse quando il layout viene distrutto."),
      )
    ),
    _h.p("UI.Layout è pensato per applicazioni complesse ma rimane leggero, modulare e altamente configurabile, offrendo una base solida per dashboard, CMS, web app e interfacce amministrative."),
  );
  return content;
}
function layout() {
  return layoutPage(layoutContent());
}
const page = {
  home,
  card,
  layout,
};
export { page };
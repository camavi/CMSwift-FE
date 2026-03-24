function layoutPage(_content = null, _header = null, _drawer = null, _footer = null) {

  let currentLayout = null;
  const header = _header || _.Header({
    title: "CMSwift",
    subtitle: "Demo componenti UI",
    right: _.Toolbar(
      _.Btn(
        {
          icon: "#bell",
          onClick: () => _.Notify.info("Hai nuove notifiche"),
        },
        "Notifiche"
      ),
      _.Btn(
        {
          variant: "primary", icon: "#plus", onClick: () => {
            drawerOpen.value = false;
            _.Notify.info("Nuovo elemento");
            _.navigate("/demo/component/card");
          }
        },
        "Nuovo"
      )
    ),
  });
  const content = _content || _.Container(
    _.div(
      { style: { margin: "16px 0" } },
      _.h2("CMSwift UI Kit"),
      _.p(
        "Tutti i componenti in azione su una singola pagina."
      )
    )
  )
  const drawer = _drawer || _.Drawer({
    stateKey: "demo:drawer",
    header: _.h3({ class: "cms-t-center" }, "Menu principale"),
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
  const footer = _footer || _.Footer(
    _.div(
      "CMSwift UI Demo • Layout completo con componenti attivi",
      _.Icon({ color: "red", name: "#heart" })
    )
  );

  const drawerOpen = _.rod(true)

  currentLayout = _.Layout({
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
  const content = _.Card(
    { header: "Card Home Header", footer: "Card Footer", actions: "Card Actions" },
    _.div("Card Home content")
  )
  return layoutPage(content);
}

const cardContent = () => {
  return _.Card(
    { header: "Card Header", footer: "Card Footer", actions: "Card Actions" },
    _.div("Card body content"),
  );
}


function card() {
  return layoutPage(cardContent());
}
const layoutContent = () => {
  const content = _.div({ class: "cms-panel cms-page" },
    _.h1("Layout"),
    //descrizione
    _.p("Componente di layout principale per applicazioni CMSwift. Fornisce una struttura solida e responsiva per organizzare l’interfaccia in header, drawer laterale (aside), contenuto principale e footer, con un sistema flessibile di controllo, aggiornamento dinamico e comportamento adattivo mobile/desktop."),
    _.p("_.Layout è progettato per essere il contenitore base di ogni applicazione: gestisce la griglia principale, il drawer laterale responsivo, le aree sticky opzionali e offre un’API completa per controllare e aggiornare il layout in modo dinamico."),
    _.h2("Struttura del layout:"),
    _.div({ class: "cms-p-l-lg" },
      _.List(
        _.Item("Header: area superiore opzionale, ideale per toolbar, navigazione o branding."),
        _.Item("Aside (Drawer): pannello laterale per menu o navigazione, utilizzabile come drawer su mobile o come sidebar fissa su desktop."),
        _.Item("Page (Main): area centrale principale dell’app, renderizzata all’interno di un elemento <main>."),
        _.Item("Footer: area inferiore opzionale per informazioni, azioni o contenuti persistenti.")
      )
    ),
    _.h2("Gestione dei contenuti:"),
    _.p("I contenuti possono essere forniti come nodi, array di nodi o funzioni."),
    _.div({ class: "cms-p-l-lg" },
      _.List(
        _.Item("Supporta slot dedicati (header, aside, page, footer) per una composizione flessibile e modulare."),
        _.Item("Ogni sezione può essere aggiornata o sostituita dinamicamente a runtime senza ricreare l’intero layout."),
      )
    ),
    _.h2("Drawer responsivo:"),
    _.p("Il drawer laterale è completamente responsivo e cambia comportamento in base alla larghezza dello schermo."),
    _.div({ class: "cms-p-l-lg" },
      _.List(
        _.Item("Su desktop il drawer può essere fisso o nascosto, adattando automaticamente la griglia del layout."),
        _.Item("Su mobile il drawer diventa un pannello a comparsa con overlay."),
        _.Item("Lo stato di apertura può essere gestito internamente o controllato dall’esterno tramite state reattivo (signal o rod)."),
      )
    ),
    _.h2("Overlay e interazioni:"),
    _.p("In modalità mobile viene mostrato un overlay che oscura il contenuto quando il drawer è aperto."),
    _.div({ class: "cms-p-l-lg" },
      _.List(
        _.Item("L’overlay può chiudere il drawer al click."),
        _.Item("È supportata la chiusura del drawer tramite tasto ESC su dispositivi mobili."),
      )
    ),
    _.h2("Sticky layout:"),
    _.div({ class: "cms-p-l-lg" },
      _.List(
        _.Item("Header, footer e aside possono essere resi sticky in modo indipendente."),
        _.Item("Ideale per toolbar sempre visibili, menu laterali persistenti o footer fissi."),
        _.Item("L’altezza dell’header viene calcolata automaticamente e resa disponibile come variabile CSS per una gestione precisa degli offset."),
      )
    ),
    _.h2("API e controllo:"),
    _.p("Espone metodi semplici per controllare il drawer:"),
    _.div({ class: "cms-p-l-lg" },
      _.List(
        _.Item("openAside()"),
        _.Item("closeAside()"),
        _.Item("toggleAside()"),
        _.Item("Espone riferimenti diretti alle sezioni (header, aside, page, footer)."),
        _.Item("Fornisce metodi di aggiornamento dinamico per ogni area, con supporto opzionale all’aggiornamento dell’URL."),
      )
    ),
    _.h2("Performance e lifecycle:"),
    _.p("Evita ricostruzioni inutili del DOM aggiornando solo le sezioni necessarie."),
    _.div({ class: "cms-p-l-lg" },
      _.List(
        _.Item("Gestisce automaticamente event listener e osservatori."),
        _.Item("Include un metodo di cleanup per rimuovere listener e risorse quando il layout viene distrutto."),
      )
    ),
    _.p("_.Layout è pensato per applicazioni complesse ma rimane leggero, modulare e altamente configurabile, offrendo una base solida per dashboard, CMS, web app e interfacce amministrative."),
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
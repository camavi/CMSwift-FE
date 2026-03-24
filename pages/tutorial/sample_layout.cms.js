
const width = _.rod('133%');
const layout = _.div({ class: "cms-panel cms-page" },
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
  _.Card(
    { header: "Esempio di utilizzo:" },
    _.Row(
      _.Col({ col: 24 },
        _.Row({ class: 'cms-m-b-md' },
          _.Col({ col: 5 }, "Device Responsive:"),
          _.Col({ col: 4 }, _.Btn({ onClick: () => { width.value = "400px"; console.log(width.value) }, icon: "#device-mobile" }, "Mobile")),
          _.Col({ col: 4 }, _.Btn({ onClick: () => { width.value = "900px"; console.log(width.value) }, icon: "#device-ipad" }, "Table")),
          _.Col({ col: 4 }, _.Btn({ onClick: () => { width.value = "133%"; console.log(width.value) }, icon: "#device-desktop" }, "Full PC")),
        ),
      ),
      _.Col({ col: 24, class: 'cms-t-center' },
        _.div({ style: { width: '100%', display: 'inline-block' } },
          _.iframe({
            src: "/sample/layout.html",
            border: 0,
            style: { width: width, marginRight: "-33%", height: "600px", border: "none", transform: 'scale(0.75)', origin: '0 0', transformOrigin: '0 0' }
          })
        ),
      ),
    )
  ),
  _.Card({ class: "cms-m-t-lg", header: "Esempio di utilizzo:" },),
  _.Icon("#menu-2"),
  _.Btn({ icon: "#access-point", class: "" }),
);
export { layout };
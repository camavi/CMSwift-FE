
const width = _rod('133%');
const layout = _h.div({ class: "cms-panel cms-page" },
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
  _ui.Card(
    { header: "Esempio di utilizzo:" },
    _ui.Row(
      _ui.Col({ col: 24 },
        _ui.Row({ class: 'cms-m-b-md' },
          _ui.Col({ col: 5 }, "Device Responsive:"),
          _ui.Col({ col: 4 }, _ui.Btn({ onClick: () => { width.value = "400px"; console.log(width.value) }, icon: "#device-mobile" }, "Mobile")),
          _ui.Col({ col: 4 }, _ui.Btn({ onClick: () => { width.value = "900px"; console.log(width.value) }, icon: "#device-ipad" }, "Table")),
          _ui.Col({ col: 4 }, _ui.Btn({ onClick: () => { width.value = "133%"; console.log(width.value) }, icon: "#device-desktop" }, "Full PC")),
        ),
      ),
      _ui.Col({ col: 24, class: 'cms-t-center' },
        _h.div({ style: { width: '100%', display: 'inline-block' } },
          _h.iframe({
            src: "/sample/layout.html",
            border: 0,
            style: { width: width, marginRight: "-33%", height: "600px", border: "none", transform: 'scale(0.75)', origin: '0 0', transformOrigin: '0 0' }
          })
        ),
      ),
    )
  ),
  _ui.Card({ class: "cms-m-t-lg", header: "Esempio di utilizzo:" },),
  _ui.Icon("#menu-2"),
  _ui.Btn({ icon: "#access-point", class: "" }),
);
export { layout };
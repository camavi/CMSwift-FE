const descriptions = {
  "UI.Row": {
    title: "Row",
    description: "Wrapper di layout in riga con classe `cms-row`. Accetta children o slot `default` per impilare contenuti in orizzontale."
  },
  "UI.Col": {
    title: "Col",
    description: "Wrapper di layout in colonna con classe `cms-col`. Accetta children o slot `default` per contenuti verticali."
  },
  "UI.Spacer": {
    title: "Spacer",
    description: "Spaziatore flessibile (`cms-spacer`) per distribuire spazio tra elementi. Puoi inserirlo anche con contenuto opzionale."
  },
  "UI.Container": {
    title: "Container",
    description: "Contenitore base (`cms-container`) per vincolare larghezze e padding. Usa slot `default` o children."
  },
  "UI.Card": {
    title: "Card",
    description: "Card con header/body/footer opzionali, densita e variante flat. Supporta slot `header`, `footer`, `actions` e click routing via `to`."
  },
  "UI.Btn": {
    title: "Button",
    description: "Bottone con varianti colore, outline, icona/label e stato loading. Gestisce disabilitazione, aria e animazione burst su pointerdown."
  },
  "UI.FormField": {
    title: "FormField",
    description: "Wrapper per controlli con label floating, hint/error/success/warning/note e addons (icon/prefix/suffix). Supporta clearable e slot avanzati per override."
  },
  "UI.InputRaw": {
    title: "InputRaw",
    description: "Input nativo con classe `cms-input-raw`. Supporta binding a model (rod o signal) e gestione autofill per sincronizzare input/change."
  },
  "UI.Input": {
    title: "Input",
    description: "Input con UI.FormField integrato: label floating, hint/error, icon/prefix/suffix e clearable. Supporta model reattivo e onInput/onChange."
  },
  "UI.Select": {
    title: "Select",
    description: "Select custom con UI.FormField: gruppi, filtro, async options, multi-select e valori custom. Include tastiera, clearable e slot per opzioni/empty/loading."
  },
  "UI.Layout": {
    title: "Layout",
    description: "Layout app con header/aside/page/footer e drawer responsivo. Include overlay mobile, sticky opzionali e API per aprire/chiudere/aggiornare sezioni."
  },
  "UI.Footer": {
    title: "Footer",
    description: "Footer con varianti sticky/dense/elevated e allineamento. Renderizza un `<footer>` con slot `default`."
  },
  "UI.Toolbar": {
    title: "Toolbar",
    description: "Toolbar flessibile con gap, align, justify e wrap. Varianti dense/divider/elevated/sticky per barre di azioni."
  },
  "UI.Grid": {
    title: "Grid",
    description: "Griglia CSS configurabile con `gap`, `cols`, `align` e `justify`. Utile per layout a colonne con classi `cms-grid`."
  },
  "UI.GridCol": {
    title: "GridCol",
    description: "Colonna per UI.Grid con span e breakpoint `sm/md/lg`, oppure `auto`. Genera classi `cms-col-*` responsivi."
  },
  "UI.Icon": {
    title: "Icon",
    description: "Icona basata su sprite SVG o contenuto custom. Supporta size/color e slot `default` per icone personalizzate."
  },
  "UI.Badge": {
    title: "Badge",
    description: "Badge inline a pillola con colore e dimensione configurabili. Usa `label` o slot `default`."
  },
  "UI.Avatar": {
    title: "Avatar",
    description: "Avatar con immagine `src` o fallback testuale. Supporta size, square e variante elevated."
  },
  "UI.Chip": {
    title: "Chip",
    description: "Chip compatto con icona e label, opzionale rimozione. Varianti dense/outline e slot per icon/label."
  },
  "UI.Tooltip": {
    title: "Tooltip",
    description: "Tooltip overlay ancorato con hover/focus e delay. Puoi usarlo come wrapper o via API `bind/show/hide`."
  },
  "UI.List": {
    title: "List",
    description: "Lista base `<ul>` con variante dense. Usa slot `default` per inserire `UI.Item`."
  },
  "UI.Item": {
    title: "Item",
    description: "Elemento lista `<li>` con divider opzionale. Pensato per `UI.List`."
  },
  "UI.Separator": {
    title: "Separator",
    description: "Separatore `<hr>` orizzontale o verticale con size configurabile. Ideale per dividere sezioni."
  },
  "UI.Checkbox": {
    title: "Checkbox",
    description: "Checkbox con label e supporto model reattivo. Espone onChange/onInput e variante dense."
  },
  "UI.Radio": {
    title: "Radio",
    description: "Radio button con label, value e supporto model. Gestisce onChange/onInput e classi dense."
  },
  "UI.Toggle": {
    title: "Toggle",
    description: "Switch toggle basato su checkbox con label. Supporta model, onChange/onInput e variante dense."
  },
  "UI.Slider": {
    title: "Slider",
    description: "Input range con min/max/step e binding a model. Emette onInput e onChange con valore numerico."
  },
  "UI.Rating": {
    title: "Rating",
    description: "Rating a stelle con `max`, value/model e modalita readonly. Slot `star` per render personalizzato."
  },
  "UI.Date": {
    title: "Date",
    description: "Input type `date` con styling `cms-input`. Semplifica la gestione di date native."
  },
  "UI.Time": {
    title: "Time",
    description: "Input type `time` con styling `cms-input`. Utile per orari standard."
  },
  "UI.Tabs": {
    title: "Tabs",
    description: "Tabs basate su `tabs[]` con UI.Btn e supporto model. Slot `tab` per label e `default` per extra content."
  },
  "UI.RouteTab": {
    title: "RouteTab",
    description: "Tab link con `to` o `href`, supporto router e stato `active`. Usa slot `label` o children."
  },
  "UI.Breadcrumbs": {
    title: "Breadcrumbs",
    description: "Breadcrumbs con items e separatore configurabile. Slot `item` e `separator` per rendering custom."
  },
  "UI.Pagination": {
    title: "Pagination",
    description: "Paginazione con prev/next, label e max pagine. Supporta model e slot per prev/next/label."
  },
  "UI.Spinner": {
    title: "Spinner",
    description: "Spinner animato con size, color e thickness. Utile per stati di caricamento puntuali."
  },
  "UI.Progress": {
    title: "Progress",
    description: "Progress bar orizzontale con value 0-100, colore e variante striped. Dimensioni configurabili."
  },
  "UI.LoadingBar": {
    title: "LoadingBar",
    description: "Barra di caricamento fissa in alto con API imperativa `set/start/stop`. Montata su `target` o body."
  },
  "UI.Banner": {
    title: "Banner",
    description: "Banner informativo con messaggio e azioni opzionali. Supporta type, densita e slot message/actions."
  },
  "UI.Header": {
    title: "Header",
    description: "Header di app con title/subtitle e aree left/right. Include toggle drawer e icone personalizzabili."
  },
  "UI.Drawer": {
    title: "Drawer",
    description: "Drawer di navigazione con items, gruppi e stato persistente. Supporta link, button, icone e closeOnSelect."
  },
  "UI.Page": {
    title: "Page",
    description: "Contenitore pagina (`cms-page`) per contenuti principali. Variante dense e slot `default`."
  },
  "UI.AppShell": {
    title: "AppShell",
    description: "Shell semplice con header/drawer/page in una struttura base. Supporta noDrawer e slot dedicati."
  },
  "UI.Parallax": {
    title: "Parallax",
    description: "Sezione parallax con background image, height e speed. Supporta overlay/color/position e slot content."
  },
  "UI.Form": {
    title: "Form",
    description: "Form wrapper integrato con `useForm`: gestisce submit async e stato submitting. Children possono essere function(form)."
  },
  "UI.CardHeader": {
    title: "CardHeader",
    description: "Header per card con layout flex, gap, align e divider opzionale. Utile per titoli e azioni."
  },
  "UI.CardBody": {
    title: "CardBody",
    description: "Body per card con slot `default`. Usalo per contenuti principali della card."
  },
  "UI.CardFooter": {
    title: "CardFooter",
    description: "Footer per card con layout flex e divider opzionale. Ideale per azioni o info finali."
  },
  "UI.Dialog": {
    title: "Dialog",
    description: "Dialog overlay con focus trap e scroll lock. API `open/close/isOpen`, contenuto via title/content/actions."
  },
  "UI.Table": {
    title: "Table",
    description: "Tabella con sorting, paginazione, loading/empty state e azioni per riga. Supporta row click e render custom."
  },
  "UI.Menu": {
    title: "Menu",
    description: "Menu overlay ancorato con close-on-select. API `open/close` e slot `content`."
  },
  "UI.Popover": {
    title: "Popover",
    description: "Popover overlay ancorato con title/content/actions. Supporta backdrop, trapFocus e closeOnOutside."
  },
  "UI.ContextMenu": {
    title: "ContextMenu",
    description: "Menu contestuale su right-click con `bind` o `openAt(x,y)`. Supporta closeOnSelect e onOpen/onClose."
  }
};

export default descriptions;

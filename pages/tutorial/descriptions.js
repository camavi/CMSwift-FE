const descriptions = {
  "_.Row": {
    title: "Row",
    description: "Layout flex in riga con children o slot strutturati `start/default/end`, gap configurabile e controllo di align/justify/wrap/direction."
  },
  "_.Col": {
    title: "Col",
    description: "Wrapper di layout in colonna con classe `cms-col`. Accetta children o slot `default` per contenuti verticali."
  },
  "_.Spacer": {
    title: "Spacer",
    description: "Spaziatore flessibile (`cms-spacer`) per distribuire spazio tra elementi. Puoi inserirlo anche con contenuto opzionale."
  },
  "_.Container": {
    title: "Container",
    description: "Contenitore base (`cms-container`) per vincolare larghezze e padding. Usa slot `default` o children."
  },
  "_.Card": {
    title: "Card",
    description: "Card con header/body/footer opzionali, densita e variante flat. Supporta slot `header`, `footer`, `actions` e click routing via `to`."
  },
  "_.Btn": {
    title: "Button",
    description: "Bottone con varianti colore, outline, icona/label e stato loading. Gestisce disabilitazione, aria e animazione burst su pointerdown."
  },
  "_.FormField": {
    title: "FormField",
    description: "Wrapper per controlli con label floating, hint/error/success/warning/note e addons (icon/prefix/suffix). Supporta clearable e slot avanzati per override."
  },
  "_.InputRaw": {
    title: "InputRaw",
    description: "Input nativo con classe `cms-input-raw`. Supporta binding a model (rod o signal) e gestione autofill per sincronizzare input/change."
  },
  "_.Input": {
    title: "Input",
    description: "Input con _.FormField integrato: label floating, hint/error, icon/prefix/suffix e clearable. Supporta model reattivo e onInput/onChange."
  },
  "_.Select": {
    title: "Select",
    description: "Select custom con _.FormField: gruppi, filtro, async options, multi-select e valori custom. Include tastiera, clearable e slot per opzioni/empty/loading."
  },
  "_.Layout": {
    title: "Layout",
    description: "Layout app con header/aside/page/footer e drawer responsivo. Include overlay mobile, sticky opzionali e API per aprire/chiudere/aggiornare sezioni."
  },
  "_.Footer": {
    title: "Footer",
    description: "Footer con varianti sticky/dense/elevated e allineamento. Renderizza un `<footer>` con slot `default`."
  },
  "_.Toolbar": {
    title: "Toolbar",
    description: "Toolbar flessibile con gap, align, justify e wrap. Varianti dense/divider/elevated/sticky per barre di azioni."
  },
  "_.Grid": {
    title: "Grid",
    description: "Griglia CSS reale configurabile con `gap`, `cols`, `align` e `justify`, con 24 colonne di default e supporto a `GridCol`."
  },
  "_.GridCol": {
    title: "GridCol",
    description: "Item per `_.Grid` con `span` responsive su `sm/md/lg` oppure `auto`, basato su CSS Grid."
  },
  "_.Icon": {
    title: "Icon",
    description: "Icona basata su sprite SVG o contenuto custom. Supporta size/color e slot `default` per icone personalizzate."
  },
  "_.Badge": {
    title: "Badge",
    description: "Badge inline a pillola con notification reattiva e 6 slot icona posizionabili. Usa `label`, `notification` e slot dedicati."
  },
  "_.Alert": {
    title: "Alert",
    description: "Alert compatto per warning inline, note persistenti e validation summary. Supporta dismiss, actions, aside e slots."
  },
  "_.Avatar": {
    title: "Avatar",
    description: "Avatar con immagine `src` o fallback testuale. Supporta size, square e variante elevated."
  },
  "_.Chip": {
    title: "Chip",
    description: "Chip compatto con icona e label, opzionale rimozione. Varianti dense/outline e slot per icon/label."
  },
  "_.Tooltip": {
    title: "Tooltip",
    description: "Tooltip ancorato con trigger hover/focus/click, contenuto ricco e API `bind/open/show/hide/close/toggle`."
  },
  "_.List": {
    title: "List",
    description: "Lista base `<ul>` con variante dense. Usa slot `default` per inserire `_.Item`."
  },
  "_.Item": {
    title: "Item",
    description: "Elemento lista `<li>` con divider opzionale. Pensato per `_.List`."
  },
  "_.Separator": {
    title: "Separator",
    description: "Separatore `<hr>` orizzontale o verticale con size configurabile. Ideale per dividere sezioni."
  },
  "_.Checkbox": {
    title: "Checkbox",
    description: "Checkbox con label e supporto model reattivo. Espone onChange/onInput e variante dense."
  },
  "_.Radio": {
    title: "Radio",
    description: "Radio button con label, value e supporto model. Gestisce onChange/onInput e classi dense."
  },
  "_.Toggle": {
    title: "Toggle",
    description: "Switch toggle basato su checkbox con label. Supporta model, onChange/onInput e variante dense."
  },
  "_.Slider": {
    title: "Slider",
    description: "Input range con min/max/step e binding a model. Emette onInput e onChange con valore numerico."
  },
  "_.Rating": {
    title: "Rating",
    description: "Rating a stelle con `max`, value/model e modalita readonly. Slot `star` per render personalizzato."
  },
  "_.Date": {
    title: "Date",
    description: "Input type `date` con styling `cms-input`. Semplifica la gestione di date native."
  },
  "_.Time": {
    title: "Time",
    description: "Input type `time` con styling `cms-input`. Utile per orari standard."
  },
  "_.Tabs": {
    title: "Tabs",
    description: "Tabs basate su `tabs[]` con _.Btn e supporto model. Slot `tab` per label e `default` per extra content."
  },
  "_.TabPanel": {
    title: "TabPanel",
    description: "Navigazione a pannelli con model reattivo, slot strutturati, swipe, varianti visive e contenuti complessi per dashboard o workflow."
  },
  "_.RouteTab": {
    title: "RouteTab",
    description: "Tab link con `to` o `href`, supporto router e stato `active`. Usa slot `label` o children."
  },
  "_.Breadcrumbs": {
    title: "Breadcrumbs",
    description: "Breadcrumbs con items e separatore configurabile. Slot `item` e `separator` per rendering custom."
  },
  "_.Pagination": {
    title: "Pagination",
    description: "Paginazione standard con numeri, ellissi, controlli edge, summary e supporto `model`, `max` oppure `total/pageSize`."
  },
  "_.Spinner": {
    title: "Spinner",
    description: "Spinner animato con size, color e thickness. Utile per stati di caricamento puntuali."
  },
  "_.Progress": {
    title: "Progress",
    description: "Progress bar orizzontale con value 0-100, colore e variante striped. Dimensioni configurabili."
  },
  "_.Stat": {
    title: "Stat",
    description: "Superficie compatta per metriche singole, delta e metadata operative. Ideale per dashboard dense e summary panel."
  },
  "_.Kpi": {
    title: "Kpi",
    description: "Superficie per KPI headline e mini dashboard summary con value principale, delta, media, footer e azioni."
  },
  "_.LoadingBar": {
    title: "LoadingBar",
    description: "Barra di caricamento fissa in alto con API imperativa `set/start/stop`. Montata su `target` o body."
  },
  "_.Banner": {
    title: "Banner",
    description: "Banner strutturato con titolo, messaggio, descrizione, CTA, dismiss e slots per avvisi operativi o contestuali."
  },
  "_.Notify": {
    title: "Notify",
    description: "Toast/notify standardizzato con payload strutturato, shortcut semantiche, slots, update/remove/clear e helper per promise."
  },
  "_.Header": {
    title: "Header",
    description: "Header di app con title/subtitle e aree left/right. Include toggle drawer e icone personalizzabili."
  },
  "_.Drawer": {
    title: "Drawer",
    description: "Drawer di navigazione con items, gruppi e stato persistente. Supporta link, button, icone e closeOnSelect."
  },
  "_.EmptyState": {
    title: "EmptyState",
    description: "Pattern per zero results, first-run onboarding e pannelli senza dati, con icon/illustration, meta e CTA di recovery."
  },
  "_.Page": {
    title: "Page",
    description: "Contenitore pagina strutturato con hero, header, body e footer. Supporta titolo, aside, azioni, larghezza controllata e composizione via slot."
  },
  "_.AppShell": {
    title: "AppShell",
    description: "Shell semplice con header/drawer/page in una struttura base. Supporta noDrawer e slot dedicati."
  },
  "_.Parallax": {
    title: "Parallax",
    description: "Sezione parallax con background image, height e speed. Supporta overlay/color/position e slot content."
  },
  "_.Form": {
    title: "Form",
    description: "Form wrapper integrato con `useForm`: gestisce submit async e stato submitting. Children possono essere function(form)."
  },
  "_.cardHeader": {
    title: "cardHeader",
    description: "Header per card con layout flex, gap, align e divider opzionale. Utile per titoli e azioni."
  },
  "_.cardBody": {
    title: "cardBody",
    description: "Body per card con slot `default`. Usalo per contenuti principali della card."
  },
  "_.cardFooter": {
    title: "cardFooter",
    description: "Footer per card con layout flex e divider opzionale. Ideale per azioni o info finali."
  },
  "_.Dialog": {
    title: "Dialog",
    description: "Dialog overlay con focus trap e scroll lock. API `open/close/isOpen`, contenuto via title/content/actions."
  },
  "_.Table": {
    title: "Table",
    description: "Tabella con sorting, paginazione, loading/empty state e azioni per riga. Supporta row click e render custom."
  },
  "_.Menu": {
    title: "Menu",
    description: "Menu overlay ancorato con close-on-select. API `open/close` e slot `content`."
  },
  "_.Popover": {
    title: "Popover",
    description: "Popover overlay ancorato con title/content/actions. Supporta backdrop, trapFocus e closeOnOutside."
  },
  "_.ContextMenu": {
    title: "ContextMenu",
    description: "Context menu specializzato per click destro e tastiera con `items`, contenuto custom, `bind(el, overrides)` e API `open/openAt/update`."
  }
};

export default descriptions;

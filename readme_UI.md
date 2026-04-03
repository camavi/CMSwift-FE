# CMSwift UI Reference For AI

Questo file descrive l'intero layer UI di CMSwift in un formato utile a un agente AI.
Il contenuto e derivato principalmente da `pages/_cmswift-fe/js/ui.js` (`UI.meta.*`) e da `pages/tutorial/descriptions.js`.
Dove il runtime espone componenti senza meta nativo (`InputRaw`), ho aggiunto un supplemento manuale basato sul codice reale.

## Scopo

- Dare a un AI una mappa completa dei componenti disponibili, delle loro firme, props, slot, eventi e ritorni.
- Rendere chiaro come il kit UI e pensato: composizione via `children`, `slots`, `props`, routing e modelli reattivi (`rod` / signal).
- Fornire un punto unico di consultazione senza costringere l'AI a scandire tutto `ui.js` ogni volta.

## Fonti

- Runtime principale: `pages/_cmswift-fe/js/ui.js`
- Descrizioni tutorial: `pages/tutorial/descriptions.js`
- Esempi per componente: `pages/tutorial/*.cms.js`
- Demo entrypoint: `pages/index.html`

## Convenzioni Globali

- Naming: in runtime trovi sia `UI.Component` sia l'alias globale `_.Component`.
- Eccezione di naming: i tre section helpers della card sono esportati in camelCase minuscolo come `UI.cardHeader`, `UI.cardBody`, `UI.cardFooter` e `_.cardHeader`, `_.cardBody`, `_.cardFooter`. Nel runtime non risultano alias PascalCase come `UI.CardHeader`, `UI.CardBody`, `UI.CardFooter`.
- Firma tipica: `_.Component(props?, ...children)`; alcuni componenti overlay restituiscono invece un'API imperativa (`open`, `close`, `bind`, ecc.).
- Slot values: quasi tutti gli slot accettano `Node | Array | Function`; molte props testuali accettano `String|Node|Function|Array`.
- Reactivity: molti input supportano `model` come `rod` oppure signal `[get, set]`.
- Routing: alcuni componenti accettano `to` e usano `CMSwift.router.navigate(...)` se disponibile.
- Slot aliases: il kit usa spesso alias semantici come `start/left`, `body/content/center`, `end/right/actions`.

### Meta Normalization Runtime

In dev mode i blocchi `UI.meta.*` vengono normalizzati automaticamente. Un AI deve assumere che il meta effettivo a runtime contenga anche queste informazioni condivise:

- Props comuni aggiunti se mancanti: `children`, `size`, `color`, `outline`, `clickable`, `radius`, `borderRadius`, `shadow`, `class`, `style`.
- Se esiste `icon` ma non `iconRight`, il runtime genera anche `iconRight` nel meta normalizzato.
- Ogni prop/slot riceve campi normalizzati come `type`, `description`, `default`, `values`, `category`.
- Default comuni: `dense = false`, `disabled = false`, `readonly = false`, `outline = false`, `clickable = false`, `flat = false`, `elevated = false`.
- Categorie frequenti: `style`, `layout`, `state`, `data`, `events`, `general`, `slot`.

### Ispezione Runtime

- Console browser: `CMSwift.ui.meta.Card`
- Helper debug: `CMSwift.ui.inspect("Card")`

## Canonical Patterns

Questa sezione serve come punto di ingresso umano. Prima di scorrere l'inventory completa, conviene partire da 4 pattern canonici che coprono la maggior parte degli usi reali del kit.

### 1. App Layout Base

Quando usarlo:
- Quando stai costruendo una shell applicativa completa con header, drawer laterale, pagina principale e footer.
- Quando vuoi che il layout resti coerente tra dashboard, backoffice e workspace operativi.

Stack consigliato:
- `Layout` come orchestratore principale
- `Header` per titolo, azioni e toggle
- `Drawer` per navigazione o filtri persistenti
- `Page` per il contenuto principale
- `Footer` per stato, CTA o metadati finali

Snippet canonico:

```js
_.Layout({
  minHeight: 560,
  drawerWidth: 290,
  stickyHeader: true,
  stickyAside: true,
  header: _.Header({
    left: false,
    title: "Fulfillment center",
    subtitle: "Shell completa con header, drawer, page e footer"
  }),
  aside: _.Drawer({
    items: shellItems,
    header: _.Card({ title: "Workspace" }, _.Chip({ color: "info", outline: true }, "24/7"))
  }),
  page: buildOpsPage("overview"),
  footer: _.Footer({ align: "right" },
    _.Chip({ color: "secondary", outline: true, size: "sm" }, "refresh 60s")
  )
});
```

Source pattern:
- `pages/tutorial/layout.cms.js`

### 2. Form Con Model

Quando usarlo:
- Quando il flusso e guidato da stato reattivo e validazione.
- Quando vuoi comporre `Input`, `Select`, `Checkbox`, `Radio`, `Toggle`, `Rating` dentro una card o una pagina senza wiring manuale ridondante.

Stack consigliato:
- `CMSwift.useForm()` per modello, regole e validazione
- `Form` come boundary di submit
- `Input` / `Select` / `Checkbox` / `Radio` / `Toggle` come field reattivi
- `cardHeader` / `cardBody` / `cardFooter` per una composizione leggibile

Snippet canonico:

```js
const registerForm = CMSwift.useForm({
  model: _.rod({ name: "", email: "", password: "", role: "", newsletter: true, terms: false }),
  validateOn: "blur",
  rules: {
    name: [(v) => !!v || "Inserisci il nome del creator"],
    email: [(v) => (!!v && String(v).includes("@")) || "Email non valida"],
    terms: [(v) => !!v || "Devi accettare i termini"]
  }
});

const fRegisterName = registerForm.field("name");
const fRegisterEmail = registerForm.field("email");
const fRegisterPassword = registerForm.field("password");
const fRegisterRole = registerForm.field("role");
const fRegisterNewsletter = registerForm.field("newsletter");
const fRegisterTerms = registerForm.field("terms");

_.Form({ form: registerForm, onSubmit: async (model) => console.log("REGISTER", model) }, () => [
  _.Card(
    _.cardBody(
      _.Input({ label: "Nome creator", model: fRegisterName.model }),
      _.Input({ label: "Email", model: fRegisterEmail.model }),
      _.Input({ type: "password", label: "Password", model: fRegisterPassword.model }),
      _.Select({ label: "Ruolo", model: fRegisterRole.model, options: roleOptions }),
      _.Checkbox({ model: fRegisterNewsletter.model }, "Release notes CMSwift"),
      _.Checkbox({ model: fRegisterTerms.model }, "Accetto termini e privacy")
    ),
    _.cardFooter(_.Btn({ color: "primary" }, "Crea account"))
  )
]);
```

Source pattern:
- `pages/tutorial/form.cms.js`

### 3. Table Con Toolbar E Pagination

Quando usarlo:
- Quando devi mostrare dati operativi con ricerca, filtro, ordinamento, azioni per riga e paginazione.
- Quando vuoi evitare markup custom esterno per toolbar e footer della tabella.

Stack consigliato:
- `Table` come componente principale
- `toolbarStart` / `toolbarEnd` per controlli aggiuntivi
- `filter`, `searchable`, `initialSort`, `pageSize` per comportamento
- `actions(row)` per CTA contestuali

Snippet canonico:

```js
const selectedLead = _.rod("Nessuna riga selezionata");
const leadSegment = _.rod("all");

_.Table({
  title: "Pipeline commerciale",
  rows: leadRows,
  searchable: true,
  pageSize: 5,
  initialSort: { key: "mrr", dir: "desc" },
  filter: (row) => leadSegment.value === "all" || row.segment === leadSegment.value,
  toolbarEnd: _.div(
    _.Radio({ value: "all", model: leadSegment }, "All"),
    _.Radio({ value: "enterprise", model: leadSegment }, "Enterprise"),
    _.Radio({ value: "mid-market", model: leadSegment }, "Mid-market")
  ),
  actions: (row) => [
    _.Btn({ outline: true }, "Follow-up"),
    _.Btn({ color: "primary" }, "Apri")
  ]
});
```

Source pattern:
- `pages/tutorial/table.cms.js`

### 4. Overlay Pattern: Dialog, Menu, Popover

Quando usarlo:
- Quando un'azione ha bisogno di un livello di interazione superiore senza cambiare pagina.
- Quando ti serve una differenza chiara tra conferma modale, menu contestuale e pannello ancorato.

Regola pratica:
- Usa `Dialog` per conferme o workflow bloccanti.
- Usa `Menu` per azioni rapide su target o righe.
- Usa `Popover` per contenuto ricco ancorato a un elemento, con azioni o spiegazioni contestuali.

Snippet canonico:

```js
const publishDialog = _.Dialog({
  size: "sm",
  state: "primary",
  icon: "rocket_launch",
  title: "Pubblicare la release di aprile?",
  content: _.List(_.Item("Deploy web EU e US"), _.Item("Rollback pronto in 90 secondi")),
  actions: ({ close }) => [
    _.Btn({ outline: true, onClick: close }, "Rimanda"),
    _.Btn({ color: "primary", onClick: close }, "Pubblica")
  ]
});

const quickMenu = _.Menu({
  title: "Azioni ordine",
  width: 320,
  items: [
    { label: "Apri dettaglio ordine", icon: "open_in_new" },
    { divider: true },
    { label: "Escala a finance", icon: "monitoring", color: "danger" }
  ]
});

const releasePopover = _.Popover({
  size: "sm",
  state: "primary",
  title: "Rollout aprile",
  content: _.List(_.Item("Deploy frontend EU e US"), _.Item("Rollback pronto in 90 secondi")),
  actions: ({ close }) => [
    _.Btn({ outline: true, onClick: close }, "Rimanda"),
    _.Btn({ color: "primary", onClick: close }, "Pubblica")
  ]
});

_.Btn({ color: "primary", onClick: () => publishDialog.open() }, "Apri dialog");
_.Btn({ onClick: (e) => quickMenu.toggle(e.currentTarget) }, "Apri menu");
_.Btn({ onClick: (e) => releasePopover.toggle(e.currentTarget) }, "Apri popover");
```

Source pattern:
- `pages/tutorial/dialog.cms.js`
- `pages/tutorial/menu.cms.js`
- `pages/tutorial/popover.cms.js`

## UX / Accessibility Contract

Questa sezione non sostituisce il meta dei singoli componenti: serve come matrice minima trasversale per capire come CMSwift tratta focus, tastiera, ARIA e semantiche `disabled` / `readonly`.

Regola pratica:
- Se un componente renderizza un elemento HTML nativo (`button`, `input`, `select`, `textarea`, `a`), l'AI deve assumere prima di tutto la semantica nativa dell'elemento.
- Se un componente e custom ma documenta `keyboard`, `trigger`, `trapFocus`, `autoFocus`, `closeOnEsc` o `closeOnOutside`, quelle opzioni fanno parte del contratto UX minimo e non sono “ornamenti”.
- Se un dettaglio accessibility non e esplicitato nel meta del componente, l'AI deve evitarne l'invenzione e descrivere solo cio che il runtime mostra davvero.

### Focus / Keyboard / ARIA Matrix

| Famiglia | Focus | Keyboard | ARIA / semantics | Disabled / readonly |
| --- | --- | --- | --- | --- |
| `Btn` | Focus nativo del bottone, eventi `focus` e `blur` documentati | Attivazione nativa `Enter` / `Space` del browser | `aria-disabled` quando `disabled/loading`, `aria-busy` quando `loading` | `disabled` blocca click e interazione |
| `InputRaw`, `Input`, `Date`, `Time`, `Slider`, `Rating` | Focus nativo del controllo; `Input` e wrapper field mantengono il focus sul controllo interno | Tastiera nativa del controllo; `Rating` e `Slider` documentano shortcut specifiche nel meta | Semantica del controllo nativo; `FormField` aggiunge contesto visuale ma non cambia il ruolo base | `disabled` blocca input; `readonly` mantiene focus ma impedisce modifica dove supportato |
| `Checkbox`, `Radio`, `Toggle` | Focus nativo dell'input interno | Attivazione nativa `Space`; `Toggle` eredita semantica checkbox | Semantica nativa checkbox/radio | `disabled` non interagibile; `readonly` solo dove previsto dal runtime/meta |
| `Select` | Focus gestito dal field custom e dall'area filtro interna | Meta runtime: `Enter/Space`, `ArrowUp`, `ArrowDown`, `Home`, `End`, `Escape` | Componente custom wrappato in `FormField`; l'AI deve trattarlo come widget composito, non come `<select>` puro | `disabled` supportato esplicitamente; `readonly` non fa parte del contratto standard del meta `Select` |
| `Tabs` | Focus sulla nav/tab attiva | Meta runtime: `Enter/Space`, `ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`, `Home`, `End` | Nav accessibile a tab; selezione sincronizzata con `value/model` | `disabled` globale o per singola tab |
| `Pagination` | Focus sui bottoni di pagina | Navigazione principalmente via pulsanti; l'AI deve assumere attivazione nativa del bottone | Semantica di controlli di paginazione, non di campo form | `disabled` su controlli non disponibili / pagine non cliccabili |
| `Tooltip` | Focus puo essere trigger di apertura (`hover/focus/click/manual`) | Nessuna matrice keyboard dedicata oltre al focus trigger | Contenuto descrittivo ancorato, non primario per azioni complesse | `disabled` supportato nel meta |
| `Dialog` | Focus management esplicito | Chiusura da tastiera via `closeOnEsc`; supporto `autoFocus` e `trapFocus` | Overlay modale con boundary dedicato | `persistent`, `closable`, `closeButton` e `closeOnOutside` definiscono la semantica di chiusura |
| `Menu` | Focus gestito dal pannello overlay e da `autoFocus` | `closeOnEsc` documentato; trigger `click|hover|focus|manual` | Overlay azionale / contestuale, non modale | `disabled` per singoli item e comportamento `closeOnSelect` |
| `Popover` | Focus gestito da `autoFocus` e `trapFocus` quando attivi | `closeOnEsc` documentato; trigger `click|hover|focus|manual` | Overlay ricco ancorato, con header/body/actions | `closable`, `closeButton`, `closeOnOutside`, `closeOnBackdrop` |
| `Notify` | Non focalizza di default come un overlay modale | Nessuna keyboard matrix propria oltre ai pulsanti contenuti | `role="alert"` per `danger/warning`, `role="status"` per gli altri toni | `closable` controlla solo la dismiss action, non e una semantica `disabled` |

### Overlay Contract

Per `Dialog`, `Menu`, `Popover`, `Tooltip` e `ContextMenu` il contratto minimo da assumere e:

- Esiste sempre una distinzione tra trigger declarativo (`trigger`, `open`, `anchorEl`) e API imperativa (`open`, `close`, `toggle`, `update`, `bind` quando disponibile).
- `trapFocus` e `autoFocus` non sono dettagli visivi: cambiano il comportamento della tastiera e vanno considerati parte dell'UX.
- `closeOnEsc`, `closeOnOutside`, `closeOnBackdrop`, `persistent` e `closable` definiscono la policy di uscita del componente. Un AI non dovrebbe descrivere un overlay come “modale” o “dismissable” senza verificare questi flag.
- Se un contenuto slot/prop riceve `({ close }) => ...`, quella callback fa parte dell'ergonomia standard del kit e deve essere usata per CTA keyboard-safe invece di manipolare il DOM manualmente.

### Disabled vs Readonly

Regola pratica per generazione UI:

- Usa `disabled` quando il controllo non deve ricevere input o attivazione.
- Usa `readonly` quando il controllo deve restare focusabile/selezionabile ma il valore non deve essere modificato.
- Se il meta del componente non documenta `readonly`, non assumerne il supporto solo per analogia.
- Per componenti compositi come `Select`, `Tabs`, `Pagination`, `Menu` o `Popover`, il flag `disabled` ha semantica comportamentale piu che HTML nativa: blocca apertura, selezione o navigazione interna secondo il runtime.

### Contract Gaps

Stato attuale del README:

- La composizione via `slots`, `children`, `model` e API overlay e documentata molto bene.
- Il contratto keyboard/accessibility e presente a macchia di leopardo nei meta dei singoli componenti.
- Per percezione da UI kit “serio”, i prossimi miglioramenti utili sarebbero: normalizzare un campo `keyboard` dove manca, esplicitare i ruoli/ARIA importanti nei meta, e distinguere in modo uniforme `disabled`, `readonly`, `loading`, `closable`, `persistent`.

## Inventory

### Layout e struttura

- `Row`
- `Col`
- `Spacer`
- `Container`
- `Layout`
- `Header`
- `Footer`
- `Toolbar`
- `Grid`
- `GridCol`
- `Page`
- `AppShell`
- `Parallax`
- `cardHeader`
- `cardBody`
- `cardFooter`

### Surface e contenuto

- `Card`
- `Banner`
- `Badge`
- `Avatar`
- `Chip`
- `Icon`
- `List`
- `Item`
- `Separator`

### Form e input

- `Form`
- `FormField`
- `InputRaw`
- `Input`
- `Select`
- `Checkbox`
- `Radio`
- `Toggle`
- `Slider`
- `Rating`
- `Date`
- `Time`

### Navigazione, feedback e data display

- `Tabs`
- `TabPanel`
- `RouteTab`
- `Breadcrumbs`
- `Pagination`
- `Spinner`
- `Progress`
- `LoadingBar`
- `Table`

### Overlay e runtime utilities

- `Tooltip`
- `Drawer`
- `Dialog`
- `Menu`
- `Popover`
- `ContextMenu`
- `Btn`
- `Notify`

## Component Reference

### Layout e struttura

#### Row

- Alias: `UI.Row`, `_.Row`
- Signature: `UI.Row(...children) | UI.Row(props, ...children)`
- Descrizione: Wrapper flex in riga con children, slot strutturati e props di layout per gap, allineamento, wrap e direction.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/row.cms.js`

```js
UI.meta.Row = {
      signature: "UI.Row(...children) | UI.Row(props, ...children)",
      props: {
        start: "Node|Function|Array",
        left: "Alias di start",
        body: "Node|Function|Array",
        center: "Alias di body",
        end: "Node|Function|Array",
        right: "Alias di end",
        align: `stretch|flex-start|center|flex-end|baseline`,
        justify: `flex-start|center|flex-end|space-between|space-around|space-evenly`,
        wrap: "boolean|string",
        direction: `row|row-reverse|column|column-reverse`,
        reverse: "boolean",
        gap: "string|number",
        rowGap: "string|number",
        columnGap: "string|number",
        inline: "boolean",
        full: "boolean",
        width: "string|number",
        minWidth: "string|number",
        maxWidth: "string|number",
        startClass: "string",
        bodyClass: "string",
        centerClass: "Alias di bodyClass",
        endClass: "string",
        slots: "{ start?, left?, body?, center?, end?, right?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        start: "Leading content area",
        left: "Alias di start",
        body: "Main content area",
        center: "Alias di body",
        end: "Trailing content area",
        right: "Alias di end",
        default: "Fallback content / children"
      },
      returns: "HTMLDivElement",
      description: "Wrapper flex in riga con children, slot strutturati e props di layout per gap, allineamento, wrap e direction."
    };
```

#### Col

- Alias: `UI.Col`, `_.Col`
- Signature: `UI.Col(...children) | UI.Col(props, ...children)`
- Descrizione: Wrapper responsive a 24 colonne. Di default si comporta come un contenitore normale e attiva il layout flex verticale quando usi gap/allineamento, regioni strutturate o `stack`.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/col.cms.js`

```js
UI.meta.Col = {
      signature: "UI.Col(...children) | UI.Col(props, ...children)",
      props: {
        col: "number|string",
        span: "Alias di col",
        sm: "number|string",
        md: "number|string",
        lg: "number|string",
        auto: "boolean",
        gap: "number|string",
        rowGap: "number|string",
        columnGap: "number|string",
        align: "string",
        justify: "string",
        inline: "boolean",
        stack: "boolean",
        center: "boolean",
        width: "number|string",
        size: "Alias di width",
        minWidth: "number|string",
        maxWidth: "number|string",
        height: "number|string",
        minHeight: "number|string",
        maxHeight: "number|string",
        flex: "string",
        fill: "boolean",
        grow: "number",
        shrink: "number",
        basis: "number|string",
        self: "string",
        order: "number|string",
        scroll: "boolean",
        start: "Node|Function|Array",
        top: "Alias di start",
        header: "Alias di start",
        body: "Node|Function|Array",
        content: "Alias di body",
        end: "Node|Function|Array",
        bottom: "Alias di end",
        footer: "Alias di end",
        startClass: "string",
        bodyClass: "string",
        endClass: "string",
        slots: "{ start?, top?, header?, body?, content?, end?, bottom?, footer?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        start: "Area iniziale della colonna",
        top: "Alias di start",
        header: "Alias di start",
        body: "Area principale della colonna",
        content: "Alias di body",
        end: "Area finale della colonna",
        bottom: "Alias di end",
        footer: "Alias di end",
        default: "Contenuto fallback della colonna"
      },
      returns: "HTMLDivElement",
      description: "Wrapper responsive a 24 colonne. Di default si comporta come un contenitore normale e attiva il layout flex verticale quando usi gap/allineamento, regioni strutturate o `stack`."
    };
```

#### Spacer

- Alias: `UI.Spacer`, `_.Spacer`
- Signature: `UI.Spacer() | UI.Spacer(props)`
- Descrizione: Flex spacer.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/spacer.cms.js`

```js
UI.meta.Spacer = {
      signature: "UI.Spacer() | UI.Spacer(props)",
      props: {
        slots: "{ default?: Slot }",
        class: "string",
        style: "object"
      },
      slots: {
        default: "Optional spacer content"
      },
      returns: "HTMLDivElement",
      description: "Flex spacer."
    };
```

#### Container

- Alias: `UI.Container`, `_.Container`
- Signature: `UI.Container(...children) | UI.Container(props, ...children)`
- Descrizione: Container composabile con max-width, spacing, layout props e sezioni opzionali.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/container.cms.js`

```js
UI.meta.Container = {
      signature: "UI.Container(...children) | UI.Container(props, ...children)",
      props: {
        tag: "string",
        fluid: "boolean",
        maxWidth: "number|string",
        minWidth: "number|string",
        width: "number|string",
        padding: "number|string",
        paddingX: "number|string",
        paddingY: "number|string",
        gap: "number|string",
        sectionGap: "number|string",
        layout: '"block|flex|grid|stack|inline"',
        direction: '"row|column"',
        wrap: "boolean|string",
        align: "string",
        justify: "string",
        cols: "number|string",
        before: "String|Node|Function|Array",
        header: "String|Node|Function|Array",
        start: "String|Node|Function|Array",
        body: "String|Node|Function|Array",
        content: "String|Node|Function|Array",
        end: "String|Node|Function|Array",
        footer: "String|Node|Function|Array",
        after: "String|Node|Function|Array",
        slots: "{ before?, header?, left?, start?, body?, content?, default?, right?, end?, footer?, after? }",
        class: "string",
        style: "object"
      },
      slots: {
        before: "Top content before the main container body",
        header: "Structured header area",
        left: "Alias for start",
        start: "Leading area inside the main body",
        body: "Custom body renderer overriding start/content/end wrappers",
        content: "Explicit main content",
        default: "Fallback content from children",
        right: "Alias for end",
        end: "Trailing area inside the main body",
        footer: "Structured footer area",
        after: "Bottom content after the main container body"
      },
      returns: "HTMLDivElement",
      description: "Container composabile con max-width, spacing, layout props e sezioni opzionali."
    };
```

#### Layout

- Alias: `UI.Layout`, `_.Layout`
- Signature: `UI.Layout(...children) | UI.Layout(props, ...children)`
- Descrizione: Shell layout composabile con slot alias, drawer responsivo e update runtime delle sezioni.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/layout.cms.js`

```js
UI.meta.Layout = {
      signature: "UI.Layout(...children) | UI.Layout(props, ...children)",
      props: {
        header: "Node|Function|Array",
        headerContent: "Node|Function|Array",
        aside: "Node|Function|Array|false",
        drawer: "Node|Function|Array|false",
        nav: "Node|Function|Array|false",
        page: "Node|Function|Array",
        main: "Node|Function|Array",
        content: "Node|Function|Array",
        body: "Node|Function|Array",
        footer: "Node|Function|Array",
        footerContent: "Node|Function|Array",
        noDrawer: "boolean",
        drawerOpen: "rod | [get,set] signal | boolean",
        drawerBreakpoint: "number(px)",
        drawerWidth: "number|string",
        overlayClose: "boolean",
        escClose: "boolean",
        stickyHeader: "boolean",
        stickyFooter: "boolean",
        stickyAside: "boolean",
        tagPage: "boolean",
        gap: "number|string",
        headerOffset: "number|string",
        minHeight: "number|string",
        shellClass: "string",
        headerClass: "string",
        asideClass: "string",
        pageClass: "string",
        footerClass: "string",
        overlayClass: "string",
        slots: "{ header?, aside?, drawer?, nav?, page?, main?, footer?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        header: "Header content",
        aside: "Aside / drawer content",
        drawer: "Alias di aside",
        nav: "Alias di aside",
        page: "Page content",
        main: "Alias di page",
        footer: "Footer content",
        default: "Fallback page content"
      },
      returns: "HTMLDivElement con methods openAside/closeAside/toggleAside/isDrawerOpen/isMobile/reflow, " +
        "header()/aside()/page()/footer(), headerUpdate/asideUpdate/pageUpdate/mainUpdate/footerUpdate e _dispose()",
      description: "Shell layout composabile con slot alias, drawer responsivo e update runtime delle sezioni."
    };
```

#### Header

- Alias: `UI.Header`, `_.Header`
- Signature: `UI.Header(...children) | UI.Header(props, ...children)`
- Descrizione: Header strutturato con regioni start/body/end, toggle drawer integrato, metadata e slot composabili.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/header.cms.js`

```js
UI.meta.Header = {
      signature: "UI.Header(...children) | UI.Header(props, ...children)",
      props: {
        title: "String|Node|Function|Array",
        subtitle: "String|Node|Function|Array",
        eyebrow: "String|Node|Function|Array",
        content: "Node|Function|Array",
        meta: "Node|Function|Array",
        icon: "String|Node|Function|Array",
        left: "Node|Function|Array|false",
        right: "Node|Function|Array",
        actions: "Node|Function|Array",
        drawerOpenIcon: "string|Node",
        drawerCloseIcon: "string|Node",
        drawerStateKey: "string",
        sticky: "boolean",
        stack: "boolean",
        dense: "boolean",
        elevated: "boolean",
        divider: "boolean",
        gap: "string|number",
        minHeight: "string|number",
        slots: "{ left?, start?, right?, end?, center?, body?, icon?, eyebrow?, title?, subtitle?, meta?, content?, actions? }",
        class: "string",
        style: "object"
      },
      slots: {
        left: "Area sinistra, fallback al toggle drawer",
        start: "Alias/addon area sinistra",
        right: "Area destra principale",
        end: "Alias/addon area destra",
        center: "Override completo del body centrale",
        body: "Alias di center",
        icon: "Icona leading",
        eyebrow: "Eyebrow / kicker",
        title: "Titolo",
        subtitle: "Sottotitolo",
        meta: "Meta info accanto al contenuto centrale",
        content: "Contenuto extra sotto il sottotitolo",
        actions: "Azioni raggruppate nella zona destra"
      },
      returns: "HTMLDivElement",
      description: "Header strutturato con regioni start/body/end, toggle drawer integrato, metadata e slot composabili."
    };
```

#### Footer

- Alias: `UI.Footer`, `_.Footer`
- Signature: `UI.Footer(...children) | UI.Footer(props, ...children)`
- Descrizione: Footer strutturato con regioni start/body/end, copy opzionale, azioni e slot composabili.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/footer.cms.js`

```js
UI.meta.Footer = {
      signature: "UI.Footer(...children) | UI.Footer(props, ...children)",
      props: {
        title: "String|Node|Function|Array",
        subtitle: "String|Node|Function|Array",
        eyebrow: "String|Node|Function|Array",
        content: "Node|Function|Array",
        meta: "Node|Function|Array",
        icon: "String|Node|Function|Array",
        left: "Node|Function|Array",
        start: "Alias di left",
        right: "Node|Function|Array",
        end: "Alias di right",
        body: "Alias di content",
        actions: "Node|Function|Array",
        sticky: "boolean",
        dense: "boolean",
        elevated: "boolean",
        divider: "boolean",
        align: `left|center|right`,
        justify: `flex-start|center|flex-end|space-between|space-around|space-evenly`,
        wrap: "boolean",
        stack: "boolean",
        gap: "string|number",
        minHeight: "string|number",
        slots: "{ left?, start?, right?, end?, center?, body?, icon?, eyebrow?, title?, subtitle?, meta?, content?, actions?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        left: "Area iniziale del footer",
        start: "Alias/addon area iniziale",
        right: "Area finale del footer",
        end: "Alias/addon area finale",
        center: "Override completo del body centrale",
        body: "Alias di center",
        icon: "Icona leading",
        eyebrow: "Eyebrow / kicker",
        title: "Titolo principale",
        subtitle: "Sottotitolo o nota",
        meta: "Meta info accanto al contenuto centrale",
        content: "Contenuto extra o fallback dei children",
        actions: "Azioni raggruppate nella zona finale",
        default: "Fallback content per la body area"
      },
      returns: "HTMLElement <footer>",
      description: "Footer strutturato con regioni start/body/end, copy opzionale, azioni e slot composabili."
    };
```

#### Toolbar

- Alias: `UI.Toolbar`, `_.Toolbar`
- Signature: `UI.Toolbar(...children) | UI.Toolbar(props, ...children)`
- Descrizione: Toolbar composabile con regioni before/start/center/end/after, copy opzionale e fallback compatibile con l'uso flex semplice.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/toolbar.cms.js`

```js
UI.meta.Toolbar = {
      signature: "UI.Toolbar(...children) | UI.Toolbar(props, ...children)",
      props: {
        before: "Node|Function|Array",
        start: "Node|Function|Array",
        left: "Alias di start",
        center: "Node|Function|Array",
        body: "Alias di center",
        content: "Alias di center",
        title: "String|Node|Function|Array",
        subtitle: "String|Node|Function|Array",
        meta: "String|Node|Function|Array",
        end: "Node|Function|Array",
        right: "Alias di end",
        actions: "Alias di end",
        after: "Node|Function|Array",
        dense: "boolean",
        divider: "boolean",
        elevated: "boolean",
        sticky: "boolean",
        wrap: "boolean|string",
        align: `stretch|flex-start|center|flex-end|baseline`,
        justify: `flex-start|center|flex-end|space-between|space-around|space-evenly`,
        gap: "string|number (es: '8px' o 'var(--cms-s-md)')",
        size: "xxs|xs|sm|md|lg|xl|xxl",
        beforeClass: "string",
        startClass: "string",
        bodyClass: "string",
        centerClass: "Alias di bodyClass",
        contentClass: "Alias di bodyClass",
        copyClass: "string",
        titleClass: "string",
        subtitleClass: "string",
        metaClass: "string",
        endClass: "string",
        afterClass: "string",
        slots: "{ before?, start?, left?, center?, body?, content?, title?, subtitle?, meta?, end?, right?, actions?, after?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        before: "Row superiore opzionale",
        start: "Leading content area",
        left: "Alias di start",
        center: "Main content area",
        body: "Alias di center",
        content: "Alias di center",
        title: "Titolo principale della toolbar",
        subtitle: "Sottotitolo o nota operativa",
        meta: "Meta info/chips sopra o accanto al titolo",
        end: "Trailing actions area",
        right: "Alias di end",
        actions: "Alias di end",
        after: "Row inferiore opzionale",
        default: "Fallback content / children"
      },
      events: {
        onClick: "MouseEvent"
      },
      description: "Toolbar composabile con regioni before/start/center/end/after, copy opzionale e fallback compatibile con l'uso flex semplice.",
      returns: "HTMLDivElement"
    };
```

#### Grid

- Alias: `UI.Grid`, `_.Grid`
- Signature: `UI.Grid(...children) | UI.Grid(props, ...children)`
- Descrizione: Griglia dichiarativa per layout responsive: supporta children, items/slot item, auto-fit, template custom e empty state.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/grid.cms.js`

```js
UI.meta.Grid = {
      signature: "UI.Grid(...children) | UI.Grid(props, ...children)",
      props: {
        cols: "number|string",
        columns: "alias di cols",
        min: "string|number (auto-fit/auto-fill min width)",
        max: "string|number (max track size, default 1fr)",
        gap: "string|number",
        rowGap: "string|number",
        columnGap: "string|number",
        colGap: "alias di columnGap",
        rows: "number|string",
        autoRows: "string|number",
        areas: "string|array",
        flow: "row|column|dense|row dense|column dense",
        align: `stretch|start|center|end`,
        alignItems: "alias di align",
        justify: `start|center|end|space-between|space-around|space-evenly`,
        justifyItems: `stretch|start|center|end`,
        placeItems: "string",
        placeContent: "string",
        dense: "boolean",
        inline: "boolean",
        debug: "boolean",
        autoFit: "boolean",
        autoFill: "boolean",
        full: "boolean",
        width: "string|number",
        minWidth: "string|number",
        maxWidth: "string|number",
        padding: "string|number",
        items: "Array<Node|Object|string>",
        itemClass: "string",
        itemStyle: "object",
        itemProps: "object",
        empty: "String|Node|Function|Array",
        slots: "{ default?, item?, empty? }",
        class: "string",
        style: "object"
      },
      slots: {
        default: "Grid content fallback",
        item: "Render custom di ogni item ({ item, index, count, first, last })",
        empty: "Empty state della griglia"
      },
      returns: "HTMLDivElement",
      description: "Griglia dichiarativa per layout responsive: supporta children, items/slot item, auto-fit, template custom e empty state."
    };
```

#### GridCol

- Alias: `UI.GridCol`, `_.GridCol`
- Signature: `UI.GridCol(...children) | UI.GridCol(props, ...children)`
- Descrizione: Item per CSS Grid con span responsive, layout interno opzionale a stack, regioni start/body/end e varianti visuali leggere.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/grid-col.cms.js`

```js
UI.meta.GridCol = {
      signature: "UI.GridCol(...children) | UI.GridCol(props, ...children)",
      props: {
        span: "number|string",
        sm: "number|string",
        md: "number|string",
        lg: "number|string",
        auto: "boolean",
        row: "number|string",
        rowSpan: "number|string",
        area: "string",
        align: "string (align-self)",
        justify: "string (justify-self)",
        place: "string (place-self)",
        gap: "string|number",
        rowGap: "string|number",
        columnGap: "string|number",
        padding: "string|number",
        width: "string|number",
        height: "string|number",
        minHeight: "string|number",
        maxHeight: "string|number",
        fullHeight: "boolean",
        stack: "boolean",
        inline: "boolean",
        direction: "column|row|string",
        contentAlign: "string",
        contentJustify: "string",
        center: "boolean",
        scroll: "boolean|string",
        panel: "boolean",
        clickable: "boolean",
        to: "string",
        start: "Node|Function|Array",
        body: "Node|Function|Array",
        end: "Node|Function|Array",
        color: "string",
        outline: "boolean",
        shadow: "boolean|string",
        radius: "number|string",
        slots: "{ start?, body?, end?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        start: "Top/header region",
        body: "Main body region",
        end: "Bottom/footer region",
        default: "Fallback content"
      },
      events: {
        onClick: "MouseEvent",
        onKeydown: "KeyboardEvent"
      },
      returns: "HTMLDivElement",
      description: "Item per CSS Grid con span responsive, layout interno opzionale a stack, regioni start/body/end e varianti visuali leggere."
    };
```

#### Page

- Alias: `UI.Page`, `_.Page`
- Signature: `UI.Page(...children) | UI.Page(props, ...children)`
- Descrizione: Contenitore pagina strutturato con hero, header, body, footer e layout configurabile.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/page.cms.js`

```js
UI.meta.Page = {
      signature: "UI.Page(...children) | UI.Page(props, ...children)",
      props: {
        hero: "Node|Function|Array",
        icon: "String|Node|Function|Array",
        eyebrow: "String|Node|Function|Array",
        title: "String|Node|Function|Array",
        subtitle: "String|Node|Function|Array",
        header: "String|Node|Function|Array",
        aside: "Node|Function|Array",
        body: "Node|Function|Array",
        footer: "Node|Function|Array",
        actions: "Node|Function|Array",
        dense: "boolean",
        flat: "boolean",
        centered: "boolean",
        narrow: "boolean",
        gap: "string|number",
        padding: "string|number",
        maxWidth: "string|number",
        minHeight: "string|number",
        heroPadding: "string|number",
        headerGap: "string|number",
        slots: "{ hero?, icon?, eyebrow?, title?, subtitle?, header?, aside?, body?, footer?, actions?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        hero: "Top hero/banner area",
        icon: "Page icon/visual",
        eyebrow: "Eyebrow/kicker content",
        title: "Page title content",
        subtitle: "Page subtitle/description content",
        header: "Header support content under title",
        aside: "Top-right header content",
        body: "Structured body content",
        footer: "Footer meta/content",
        actions: "Footer actions content",
        default: "Fallback body content"
      },
      returns: "HTMLDivElement",
      description: "Contenitore pagina strutturato con hero, header, body, footer e layout configurabile."
    };
```

#### AppShell

- Alias: `UI.AppShell`, `_.AppShell`
- Signature: `UI.AppShell(...children) | UI.AppShell(props, ...children)`
- Descrizione: Shell applicazione composabile con shortcut per Header/Drawer/Page/Footer e gestione drawer.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/app-shell.cms.js`

```js
UI.meta.AppShell = {
      signature: "UI.AppShell(...children) | UI.AppShell(props, ...children)",
      props: {
        header: "Node|Function|Array|false",
        drawer: "Node|Function|Array|false",
        page: "Node|Function|Array|false",
        footer: "Node|Function|Array|false",
        title: "string|Node|Function|Array",
        subtitle: "string|Node|Function|Array",
        left: "Node|Function|Array|false",
        right: "Node|Function|Array",
        items: "Array",
        drawerItems: "Array",
        drawerHeader: "Node|Function|Array",
        content: "Node|Function|Array",
        headerProps: "object",
        drawerProps: "object",
        pageProps: "object",
        footerProps: "object",
        footerContent: "Node|Function|Array",
        noDrawer: "boolean",
        reverse: "boolean",
        stack: "boolean",
        flush: "boolean",
        divider: "boolean",
        drawerStateKey: "string",
        stateKey: "string",
        drawerWidth: "number|string",
        gap: "number|string",
        padding: "number|string",
        slots: "{ header?, drawer?, page?, footer?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        header: "Header content",
        drawer: "Drawer content",
        page: "Page content",
        footer: "Footer content",
        default: "Fallback page content"
      },
      returns: "HTMLDivElement con methods openDrawer/closeDrawer/toggleDrawer/isDrawerOpen",
      description: "Shell applicazione composabile con shortcut per Header/Drawer/Page/Footer e gestione drawer."
    };
```

#### Parallax

- Alias: `UI.Parallax`, `_.Parallax`
- Signature: `UI.Parallax(...children) | UI.Parallax(props, ...children)`
- Descrizione: Hero/section parallax standardizzato con header strutturato, body, actions, slots e API minima di refresh.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/parallax.cms.js`

```js
UI.meta.Parallax = {
      signature: "UI.Parallax(...children) | UI.Parallax(props, ...children)",
      props: {
        src: "string",
        image: "string",
        background: "string",
        backgroundContent: "Node|Function|Array",
        height: "string|number",
        minHeight: "string|number",
        speed: "number",
        maxOffset: "number",
        startTop: "number",
        state: "success|warning|danger|info|primary|secondary|dark|light|string",
        overlay: "string",
        color: "string",
        bgPosition: "string",
        bgSize: "string",
        bgRepeat: "string",
        padding: "string|number",
        gap: "string|number",
        justify: "string",
        align: "string",
        contentMaxWidth: "string|number",
        disabled: "boolean",
        badge: "Node|Function|Array",
        eyebrow: "String|Node|Function|Array",
        title: "String|Node|Function|Array",
        subtitle: "String|Node|Function|Array",
        header: "Node|Function|Array",
        aside: "Node|Function|Array",
        media: "Node|Function|Array",
        content: "Node|Function|Array",
        footer: "Node|Function|Array",
        actions: "Node|Function|Array",
        bgClass: "string",
        badgeClass: "string",
        headerClass: "string",
        bodyClass: "string",
        footerClass: "string",
        contentClass: "string",
        slots: "{ background?, badge?, eyebrow?, title?, subtitle?, header?, aside?, media?, content?, footer?, actions?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        background: "Contenuto decorativo dentro il layer di sfondo",
        badge: "Meta badge/chip sopra il contenuto principale",
        eyebrow: "Eyebrow/kicker",
        title: "Titolo principale",
        subtitle: "Sottotitolo o testo di supporto",
        header: "Contenuto aggiuntivo in header",
        aside: "Area laterale header",
        media: "Contenuto multimediale o card in foreground",
        content: "Body principale",
        footer: "Footer informativo",
        actions: "Area azioni",
        default: "Fallback body content"
      },
      returns: "HTMLDivElement con methods refresh/update/destroy",
      description: "Hero/section parallax standardizzato con header strutturato, body, actions, slots e API minima di refresh."
    };
```

#### cardHeader

- Alias: `UI.cardHeader`, `_.cardHeader`
- Signature: `UI.cardHeader(...children) | UI.cardHeader(props, ...children)`
- Descrizione: Header della card con supporto layout flex.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/card-header.cms.js`
- Naming note: il nome canonico esportato dal runtime e `cardHeader`; non emerge alcun alias `CardHeader`.

```js
UI.meta.cardHeader = {
      signature: "UI.cardHeader(...children) | UI.cardHeader(props, ...children)",
      props: {
        divider: "boolean",
        align: `stretch|flex-start|center|flex-end|baseline`,
        justify: `flex-start|center|flex-end|space-between|space-around|space-evenly`,
        wrap: "boolean",
        gap: "string|number",
        slots: "{ default? }",
        class: "string",
        style: "object"
      },
      slots: {
        default: "Card header content"
      },
      returns: "HTMLDivElement",
      description: "Header della card con supporto layout flex."
    };
```

#### cardBody

- Alias: `UI.cardBody`, `_.cardBody`
- Signature: `UI.cardBody(...children) | UI.cardBody(props, ...children)`
- Descrizione: Body della card.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/card-body.cms.js`
- Naming note: il nome canonico esportato dal runtime e `cardBody`; non emerge alcun alias `CardBody`.

```js
UI.meta.cardBody = {
      signature: "UI.cardBody(...children) | UI.cardBody(props, ...children)",
      props: {
        slots: "{ default? }",
        class: "string",
        style: "object"
      },
      slots: {
        default: "Card body content"
      },
      returns: "HTMLDivElement",
      description: "Body della card."
    };
```

#### cardFooter

- Alias: `UI.cardFooter`, `_.cardFooter`
- Signature: `UI.cardFooter(...children) | UI.cardFooter(props, ...children)`
- Descrizione: Footer della card con supporto layout flex.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/card-footer.cms.js`
- Naming note: il nome canonico esportato dal runtime e `cardFooter`; non emerge alcun alias `CardFooter`.

```js
UI.meta.cardFooter = {
      signature: "UI.cardFooter(...children) | UI.cardFooter(props, ...children)",
      props: {
        divider: "boolean",
        align: `stretch|flex-start|center|flex-end|baseline`,
        justify: `flex-start|center|flex-end|space-between|space-around|space-evenly`,
        wrap: "boolean",
        gap: "string|number",
        slots: "{ default? }",
        class: "string",
        style: "object"
      },
      slots: {
        default: "Card footer content"
      },
      returns: "HTMLDivElement",
      description: "Footer della card con supporto layout flex."
    };
```

### Surface e contenuto

#### Card

- Alias: `UI.Card`, `_.Card`
- Signature: `UI.Card(...children) | UI.Card(props, ...children)`
- Descrizione: Card a sezioni con header strutturato, cover/media, body e footer/actions.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/card.cms.js`

```js
UI.meta.Card = {
      signature: "UI.Card(...children) | UI.Card(props, ...children)",
      description: "Card a sezioni con header strutturato, cover/media, body e footer/actions.",
      props: {
        title: "String|Node|Function|Array",
        subtitle: "String|Node|Function|Array",
        eyebrow: "String|Node|Function|Array",
        header: "String|Node|Function|Array",
        body: "String|Node|Function|Array",
        footer: "String|Node|Function|Array",
        actions: "Node|Function|Array",
        icon: "String|Node|Function|Array",
        aside: "Node|Function|Array",
        identifier: "String|Node|Function|Array",
        media: "Node|Function|Array",
        cover: "Node|Function|Array",
        image: "string",
        imageAlt: "string",
        coverHeight: "string|number",
        clickable: "boolean",
        to: "string",
        dense: "boolean",
        flat: "boolean",
        headerClass: "string",
        bodyClass: "string",
        footerClass: "string",
        slots: "{ identifier?, cover?, media?, icon?, eyebrow?, title?, subtitle?, header?, aside?, body?, footer?, actions?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        identifier: "Badge/top identifier content",
        cover: "Top visual/cover content",
        media: "Media section above header/body",
        icon: "Header icon content",
        eyebrow: "Eyebrow/kicker content",
        title: "Card title content",
        subtitle: "Card subtitle content",
        header: "Header support content",
        aside: "Right side header content",
        body: "Body content",
        footer: "Footer content",
        actions: "Footer actions slot",
        default: "Fallback body content or raw card sections"
      },
      returns: "HTMLDivElement"
    };
```

#### Banner

- Alias: `UI.Banner`, `_.Banner`
- Signature: `UI.Banner(...children) | UI.Banner(props, ...children)`
- Descrizione: String|Node|Function|Array
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/banner.cms.js`

```js
UI.meta.Banner = {
      signature: "UI.Banner(...children) | UI.Banner(props, ...children)",
      props: {
        title: "String|Node|Function|Array",
        message: "String|Node|Function|Array",
        description: "String|Node|Function|Array",
        meta: "String|Node|Function|Array",
        icon: "String|Node|Function|Array|false",
        actions: "Node|Function|Array",
        aside: "Node|Function|Array",
        body: "Node|Function|Array",
        dismissible: "boolean",
        dismiss: "Node|Function|Array",
        onDismiss: "function",
        closeLabel: "string",
        type: "success|warning|danger|error|info|primary|secondary|light|dark",
        state: "success|warning|danger|error|info|primary|secondary|light|dark",
        accent: "string",
        variant: "soft|solid|outline|ghost",
        actionsPlacement: "end|bottom",
        dense: "boolean",
        stack: "boolean",
        slots: "{ icon?, title?, message?, description?, meta?, actions?, aside?, dismiss?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        icon: "Leading visual/icon content",
        title: "Banner title content",
        message: "Primary message content",
        description: "Secondary/supporting text",
        meta: "Meta information content",
        actions: "Actions area content",
        aside: "Right side support content",
        dismiss: "Custom dismiss control",
        default: "Extra banner body content"
      },
      returns: "HTMLDivElement",
      description: "Banner strutturato con tono, azioni, dismiss e slots composabili."
    };
```

#### Badge

- Alias: `UI.Badge`, `_.Badge`
- Signature: `UI.Badge(...children) | UI.Badge(props, ...children)`
- Descrizione: Badge inline con notification reattiva e 6 slot icona posizionabili.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/badge.cms.js`

```js
UI.meta.Badge = {
      signature: "UI.Badge(...children) | UI.Badge(props, ...children)",
      props: {
        label: "String|Node|Function|Array",
        color: "string",
        size: "string|number",
        outline: "boolean",
        notification: "string|number|Node|Function|[get,set] signal",
        iconSize: "string|number",
        topLeft: "String|Node|Function|Array",
        topRight: "String|Node|Function|Array",
        bottomLeft: "String|Node|Function|Array",
        bottomRight: "String|Node|Function|Array",
        centerLeft: "String|Node|Function|Array",
        centerRight: "String|Node|Function|Array",
        left: "String|Node|Function|Array",
        right: "String|Node|Function|Array",
        slots: "{ label?, default?, notification?, topLeft?, topRight?, bottomLeft?, bottomRight?, left?, right? }",
        class: "string",
        style: "object"
      },
      slots: {
        label: "Badge label content",
        default: "Fallback content",
        notification: "Notification badge content",
        topLeft: "Icon anchored top-left",
        topRight: "Icon anchored top-right",
        bottomLeft: "Icon anchored bottom-left",
        bottomRight: "Icon anchored bottom-right",
        centerLeft: "Icon anchored center-left",
        centerRight: "Icon anchored center-right",
        left: "Icon anchored left",
        right: "Icon anchored right"
      },
      returns: "HTMLSpanElement",
      description: "Badge inline con notification reattiva e 6 slot icona posizionabili."
    };
```

#### Avatar

- Alias: `UI.Avatar`, `_.Avatar`
- Signature: `UI.Avatar(...children) | UI.Avatar(props, ...children)`
- Descrizione: Avatar flessibile con immagine, fallback intelligenti, stati, badge e slot overlay.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/avatar.cms.js`

```js
UI.meta.Avatar = {
      signature: "UI.Avatar(...children) | UI.Avatar(props, ...children)",
      props: {
        src: "string",
        srcset: "string",
        sizes: "string",
        alt: "string",
        label: "String|Node|Function|Array",
        name: "string",
        initials: "string|Node|Function|Array",
        text: "string|Node|Function|Array",
        size: "number|string",
        fontSize: "number|string",
        radius: "number|string",
        square: "boolean",
        elevated: "boolean",
        color: "string",
        state: "string",
        icon: "string|Node|Function|Array",
        iconSize: "number|string",
        media: "Node|Function|Array",
        fit: "cover|contain|fill|scale-down|none",
        badge: "string|number|Node|Function|Array",
        notification: "string|number|Node|Function|Array",
        status: "boolean|string|number|Node|Function|Array",
        statusColor: "success|warning|danger|info|primary|secondary|dark|light|string",
        topLeft: "Node|Function|Array",
        topRight: "Node|Function|Array",
        bottomLeft: "Node|Function|Array",
        bottomRight: "Node|Function|Array",
        slots: "{ media?, default?, fallback?, label?, icon?, badge?, status?, topLeft?, topRight?, bottomLeft?, bottomRight? }",
        class: "string",
        style: "object"
      },
      slots: {
        media: "Media principale custom",
        default: "Contenuto principale custom al posto di immagine o fallback",
        fallback: "Fallback custom quando non c'e immagine",
        label: "Fallback testuale / initials",
        icon: "Icona fallback",
        badge: "Badge overlay, di default top-right",
        status: "Presence dot o contenuto overlay, di default bottom-right",
        topLeft: "Contenuto overlay top-left",
        topRight: "Contenuto overlay top-right",
        bottomLeft: "Contenuto overlay bottom-left",
        bottomRight: "Contenuto overlay bottom-right"
      },
      returns: "HTMLDivElement",
      description: "Avatar flessibile con immagine, fallback intelligenti, stati, badge e slot overlay."
    };
```

#### Chip

- Alias: `UI.Chip`, `_.Chip`
- Signature: `UI.Chip(...children) | UI.Chip(props, ...children)`
- Descrizione: Chip con icona opzionale e rimozione.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/chip.cms.js`

```js
UI.meta.Chip = {
      signature: "UI.Chip(...children) | UI.Chip(props, ...children)",
      props: {
        label: "String|Node|Function|Array",
        icon: "String|Node|Function|Array",
        iconRight: "String|Node|Function|Array",
        removable: "boolean",
        onRemove: "function",
        dense: "boolean",
        outline: "boolean|string|number",
        slots: "{ icon?, label?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        icon: "Chip icon content",
        iconRight: "Chip right icon content",
        label: "Chip label content",
        default: "Fallback content"
      },
      events: {
        onRemove: "MouseEvent"
      },
      returns: "HTMLSpanElement",
      description: "Chip con icona opzionale e rimozione."
    };
```

#### Icon

- Alias: `UI.Icon`, `_.Icon`
- Signature: `UI.Icon(name) | UI.Icon(props) | UI.Icon(props, ...children)`
- Descrizione: Icona basata su sprite o testo, con size/color configurabili.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/icon.cms.js`

```js
UI.meta.Icon = {
      signature: "UI.Icon(name) | UI.Icon(props) | UI.Icon(props, ...children)",
      props: {
        name: "string|Node|Function",
        size: "number|string",
        color: "string",
        shadow: "boolean|string",
        lightShadow: "boolean",
        clickable: "boolean",
        border: "boolean",
        glossy: "boolean",
        glow: "boolean",
        glass: "boolean",
        gradient: "boolean|number",
        outline: "boolean",
        textGradient: "boolean",
        radius: "number|string",
        slots: "{ default? }",
        class: "string",
        style: "object"
      },
      slots: {
        default: "Custom icon content"
      },
      returns: "HTMLSpanElement",
      description: "Icona basata su sprite o testo, con size/color configurabili."
    };
```

#### List

- Alias: `UI.List`, `_.List`
- Signature: `UI.List(...children) | UI.List(props, ...children)`
- Descrizione: Lista dichiarativa con supporto items, slot item, ordered/marker ed empty state.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/list.cms.js`

```js
UI.meta.List = {
      signature: "UI.List(...children) | UI.List(props, ...children)",
      props: {
        items: "Array<Node|Object|string>",
        ordered: "boolean",
        number: "boolean",
        marker: "boolean|string",
        dense: "boolean",
        divider: "boolean",
        gap: "string|number",
        empty: "String|Node|Function|Array",
        itemClass: "string",
        itemStyle: "object",
        itemProps: "object",
        slots: "{ default?, item?, empty? }",
        class: "string",
        style: "object"
      },
      slots: {
        default: "List content fallback",
        item: "Render custom di ogni item ({ item, index, count, first, last })",
        empty: "Empty state content"
      },
      returns: "HTMLUListElement|HTMLOListElement",
      description: "Lista dichiarativa con supporto items, slot item, ordered/marker ed empty state."
    };
```

#### Item

- Alias: `UI.Item`, `_.Item`
- Signature: `UI.Item(...children) | UI.Item(props, ...children)`
- Descrizione: Item strutturato per liste semplici, feed, task list e righe cliccabili.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/item.cms.js`

```js
UI.meta.Item = {
      signature: "UI.Item(...children) | UI.Item(props, ...children)",
      props: {
        label: "String|Node|Function|Array",
        title: "String|Node|Function|Array",
        subtitle: "String|Node|Function|Array",
        meta: "String|Node|Function|Array",
        body: "String|Node|Function|Array",
        icon: "String|Node|Function|Array",
        iconRight: "String|Node|Function|Array",
        aside: "Node|Function|Array",
        actions: "Node|Function|Array",
        clickable: "boolean",
        to: "string",
        active: "boolean",
        selected: "boolean",
        disabled: "boolean",
        color: "string",
        state: "Alias di color",
        size: "string|number",
        outline: "boolean",
        shadow: "boolean|string",
        lightShadow: "boolean",
        border: "boolean",
        glossy: "boolean",
        glow: "boolean",
        glass: "boolean",
        gradient: "boolean|number",
        textGradient: "boolean",
        radius: "string|number",
        divider: "boolean",
        slots: "{ icon?, title?, subtitle?, meta?, body?, aside?, actions?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        icon: "Leading visual/icon",
        title: "Main title content",
        subtitle: "Secondary text",
        meta: "Top meta content",
        body: "Body content",
        aside: "Trailing content",
        actions: "Actions row",
        default: "Fallback body content"
      },
      returns: "HTMLLIElement",
      description: "Item strutturato per liste semplici, feed, task list e righe cliccabili."
    };
```

#### Separator

- Alias: `UI.Separator`, `_.Separator`
- Signature: `UI.Separator() | UI.Separator(props)`
- Descrizione: Separatore orizzontale o verticale.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/separator.cms.js`

```js
UI.meta.Separator = {
      signature: "UI.Separator() | UI.Separator(props)",
      props: {
        vertical: "boolean",
        size: "string|number",
        slots: "{ default? }",
        class: "string",
        style: "object"
      },
      slots: {
        default: "Unused (separator has no content)"
      },
      returns: "HTMLHRElement",
      description: "Separatore orizzontale o verticale."
    };
```

### Form e input

#### Form

- Alias: `UI.Form`, `_.Form`
- Signature: `UI.Form({ form, onSubmit, ...props }, ...children)`
- Descrizione: Form wrapper integrato con `useForm`: gestisce submit async e stato submitting. Children possono essere function(form).
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/form.cms.js`

```js
UI.meta.Form = {
      signature: "UI.Form({ form, onSubmit, ...props }, ...children)",
      props: {
        form: "useForm() instance",
        onSubmit: "async (model, form) => any",
        class: "string",
        style: "object"
      },
      slots: {
        default: "(form) => Node|Array|Node"
      },
      returns: "HTMLFormElement"
    };
```

#### FormField

- Alias: `UI.FormField`, `_.FormField`
- Signature: `UI.FormField(props)`
- Descrizione: Wrapper field con label floating, hint/error/success/warning/note, clear e addons slot-based.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/form-field.cms.js`

```js
UI.meta.FormField = {
      signature: "UI.FormField(props)",
      description: "Wrapper field con label floating, hint/error/success/warning/note, clear e addons slot-based.",
      props: {
        label: "String|Node|Function",
        topLabel: "String|Node|Function",
        hint: "String|Node|Function",
        error: "String|Node|Function",
        success: "String|Node|Function",
        warning: "String|Node|Function",
        note: "String|Node|Function",
        icon: "String|Node|Function",
        iconRight: "String|Node|Function",
        prefix: "String|Node|Function",
        suffix: "String|Node|Function",
        clearable: "boolean",
        disabled: "boolean",
        readonly: "boolean",
        control: "Node|Function",
        getValue: "() => any",
        onClear: "() => void",
        onFocus: "() => void",
        wrapClass: "string",
        slots: "{ label?, topLabel?, prefix?, suffix?, icon?, iconRight?, clear?, hint?, error?, control? }"
      },
      slots: {
        label: "Floating label content",
        topLabel: "Top label content",
        prefix: "Left addon content",
        suffix: "Right addon content",
        icon: "Left icon content",
        iconRight: "Right icon content",
        clear: "Clear button slot (ctx: { clear, disabled, readonly, hasValue })",
        hint: "Hint content",
        errorMessage: "Error content",
        success: "Success content",
        warning: "Warning content",
        note: "Note content",
        control: "Override control wrapper (ctx: { control, clear, disabled, readonly, hasValue })"
      },
      returns: "HTMLDivElement (wrapper) con ._refresh()"
    };
```

#### InputRaw

- Alias: `UI.InputRaw`, `_.InputRaw`
- Signature: `UI.InputRaw(props)`
- Descrizione: Input nativo con classe cms-input-raw, sync autofill e binding a rod/signal senza wrapper FormField.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/input-raw.cms.js`
- Note: questo blocco meta e stato aggiunto manualmente perche il runtime espone il componente ma non definisce `UI.meta.*` per esso.

```js
UI.meta.InputRaw = {
  signature: "UI.InputRaw(props)",
  description: "Input nativo con classe cms-input-raw, sync autofill e binding a rod/signal senza wrapper FormField.",
  props: {
    type: "string (default: 'text')",
    name: "string",
    placeholder: "string",
    autocomplete: "string",
    value: "string|number",
    class: "string",
    model: "rod | [get,set] signal"
  },
  events: {
    input: "Native input event",
    change: "Native change event",
    focus: "Native focus event",
    blur: "Native blur event"
  },
  returns: "HTMLInputElement",
  sourceNote: "Manual supplement: InputRaw exists in UI runtime but has no native UI.meta block in ui.js."
};
```

#### Input

- Alias: `UI.Input`, `_.Input`
- Signature: `UI.Input(props)`
- Descrizione: Field input con floating label, hint/error/success/warning/note, clearable, icon, prefix/suffix e supporto reattivo (rod/signal).
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/input.cms.js`

```js
UI.meta.Input = {
      signature: "UI.Input(props)",
      description: "Field input con floating label, hint/error/success/warning/note, clearable, icon, prefix/suffix e supporto reattivo (rod/signal).",
      props: {
        // value & model
        model: "rod | [get,set] signal",
        value: "string",

        // input native
        type: "string (default: 'text')",
        name: "string",
        autocomplete: "string",
        inputmode: "string",
        disabled: "boolean",
        readonly: "boolean",

        // UI / UX
        label: "String|Node|Function (floating label)",
        topLabel: "String|Node|Function (label sopra, non floating)",
        placeholder: "string (fallback se non usi label)",
        hint: "String|Node|Function",
        error: "String|Node|Function",
        success: "String|Node|Function",
        warning: "String|Node|Function",
        note: "String|Node|Function",
        clearable: "boolean",

        // addons
        icon: "String|Node|Function",
        iconRight: "String|Node|Function",
        prefix: "String|Node|Function",
        suffix: "String|Node|Function",

        // style
        class: "string (applicata all'input)",
        wrapClass: "string (applicata al field wrapper)",
        style: "object",

        // events
        onInput: "(value:string) => void",
        onChange: "(value:string) => void",
        onFocus: "(event) => void",
        onBlur: "(event) => void"
      },

      slots: {
        label: "Floating label (via FormField slots.label)",
        topLabel: "Top label (via FormField slots.topLabel)",
        prefix: "Addon a sinistra (via FormField slots.prefix)",
        suffix: "Addon a destra (via FormField slots.suffix)",
        icon: "Icona a sinistra (via FormField slots.icon)",
        iconRight: "Icona a destra (via FormField slots.iconRight)",
        clear: "Clear button (via FormField slots.clear)",
        hint: "Hint content (via FormField slots.hint)",
        errorMessage: "Error content (via FormField slots.errorMessage)",
        success: "Success content (via FormField slots.success)",
        warning: "Warning content (via FormField slots.warning)",
        note: "Note content (via FormField slots.note)",
        input: "Custom input node (ctx: { input, props })"
      },

      returns: "HTMLDivElement (field wrapper) con ._input = HTMLInputElement"
    };
```

#### Select

- Alias: `UI.Select`, `_.Select`
- Signature: `UI.Select(props)`
- Descrizione: Select premium: keyboard nav, option groups, async options, filter, clearable, multi select, valori custom da filtro. Wrappato in UI.FormField.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/select.cms.js`

```js
UI.meta.Select = {
      signature: "UI.Select(props)",
      description: "Select premium: keyboard nav, option groups, async options, filter, clearable, multi select, valori custom da filtro. Wrappato in UI.FormField.",

      props: {
        options: "Array<option|group> | () => Array<option|group> | async () => Promise<Array<option|group>>",
        value: "any",
        model: "rod | [get,set] signal",

        label: "String|Node|Function (floating)",
        topLabel: "String|Node|Function",
        hint: "String|Node|Function",
        error: "String|Node|Function",
        success: "String|Node|Function",
        warning: "String|Node|Function",
        note: "String|Node|Function",

        clearable: "boolean",
        filterable: "boolean",
        multiple: "boolean",
        multi: "boolean (alias multiple)",
        allowCustom: "boolean (consenti valori custom dal filtro)",
        allowCustomValue: "boolean (alias allowCustom)",
        filterPlaceholder: "string",
        emptyText: "string",

        icon: "String|Node|Function",
        iconRight: "String|Node|Function",
        prefix: "String|Node|Function",
        suffix: "String|Node|Function",

        disabled: "boolean | () => boolean",
        dense: "boolean",
        class: "string",
        wrapClass: "string",
        slots: "{ clear?, arrow?, filter?, option?, group?, empty?, loading? }",

        onChange: "(value:any) => void"
      },

      slots: {
        clear: "Clear button (via FormField slots.clear)",
        arrow: "Arrow slot (ctx: { open })",
        filter: "Filter input slot (ctx: { value, setValue, close })",
        option: "Option renderer (ctx: { opt, selected, active, disabled, select })",
        group: "Group header (ctx: { label })",
        empty: "Empty state (ctx: { filter })",
        loading: "Loading state (ctx: {})",
        label: "Floating label (via FormField slots.label)",
        topLabel: "Top label (via FormField slots.topLabel)",
        prefix: "Left addon (via FormField slots.prefix)",
        suffix: "Right addon (via FormField slots.suffix)",
        icon: "Left icon (via FormField slots.icon)",
        iconRight: "Right icon (via FormField slots.iconRight)",
        hint: "Hint content (via FormField slots.hint)",
        errorMessage: "Error content (via FormField slots.errorMessage)",
        success: "Success content (via FormField slots.success)",
        warning: "Warning content (via FormField slots.warning)",
        note: "Note content (via FormField slots.note)"
      },

      keyboard: ["Enter/Space", "ArrowUp", "ArrowDown", "Home", "End", "Escape"],

      returns: "HTMLDivElement (wrapper field) con ._select, ._dispose()"
    };
```

#### Checkbox

- Alias: `UI.Checkbox`, `_.Checkbox`
- Signature: `UI.Checkbox(...children) | UI.Checkbox(props, ...children)`
- Descrizione: Checkbox con label e supporto model.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/checkbox.cms.js`

```js
UI.meta.Checkbox = {
      signature: "UI.Checkbox(...children) | UI.Checkbox(props, ...children)",
      props: {
        label: "String|Node|Function|Array",
        checked: "boolean|null",
        model: "[get,set] signal",
        icon: "String|Node|Function|Array",
        iconOn: "Alias di icon/checkedIcon",
        iconOff: "Alias di uncheckedIcon",
        iconStandby: "Icona per stato null/indeterminate",
        checkedIcon: "String|Node|Function|Array",
        uncheckedIcon: "String|Node|Function|Array",
        color: "string",
        size: "string|number",
        outline: "boolean",
        dense: "boolean",
        slots: "{ label?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        label: "Checkbox label",
        icon: "Base icon content",
        iconStandby: "Slot for null/indeterminate icon",
        checkedIcon: "Icon when checked",
        uncheckedIcon: "Icon when unchecked",
        default: "Fallback label content"
      },
      events: {
        onChange: "(checked|null, event)",
        onInput: "(checked|null, event)"
      },
      returns: "HTMLLabelElement",
      description: "Checkbox con label e supporto model."
    };
```

#### Radio

- Alias: `UI.Radio`, `_.Radio`
- Signature: `UI.Radio(...children) | UI.Radio(props, ...children)`
- Descrizione: Radio con label e supporto model.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/radio.cms.js`

```js
UI.meta.Radio = {
      signature: "UI.Radio(...children) | UI.Radio(props, ...children)",
      props: {
        label: "String|Node|Function|Array",
        value: "any",
        name: "string",
        checked: "boolean|null",
        model: "[get,set] signal",
        icon: "String|Node|Function|Array",
        iconOn: "Alias di icon/checkedIcon",
        iconOff: "Alias di uncheckedIcon",
        checkedIcon: "String|Node|Function|Array",
        uncheckedIcon: "String|Node|Function|Array",
        color: "string",
        size: "string|number",
        outline: "boolean",
        dense: "boolean",
        slots: "{ label?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        label: "Radio label",
        icon: "Base icon content",
        iconOn: "Alias slot for checked icon",
        iconOff: "Alias slot for unchecked icon",
        checkedIcon: "Icon when checked",
        uncheckedIcon: "Icon when unchecked",
        default: "Fallback label content"
      },
      events: {
        onChange: "(value, event)",
        onInput: "(value, event)"
      },
      returns: "HTMLLabelElement",
      description: "Radio con label e supporto model."
    };
```

#### Toggle

- Alias: `UI.Toggle`, `_.Toggle`
- Signature: `UI.Toggle(...children) | UI.Toggle(props, ...children)`
- Descrizione: Toggle switch con supporto model e comportamento checkbox/radio.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/toggle.cms.js`

```js
UI.meta.Toggle = {
      signature: "UI.Toggle(...children) | UI.Toggle(props, ...children)",
      props: {
        label: "String|Node|Function|Array",
        behavior: "\"checkbox\"|\"radio\"",
        mode: "Alias di behavior",
        value: "any",
        name: "string",
        checked: "boolean",
        model: "[get,set] signal",
        icon: "String|Node|Function|Array",
        iconOn: "Alias di icon/checkedIcon",
        iconOff: "Alias di uncheckedIcon",
        iconStandby: "Icona per stato null/indeterminate",
        checkedIcon: "String|Node|Function|Array",
        uncheckedIcon: "String|Node|Function|Array",
        color: "string",
        size: "string|number",
        dense: "boolean",
        slots: "{ label?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        label: "Toggle label",
        icon: "Base icon content",
        iconOn: "Alias slot for checked icon",
        iconOff: "Alias slot for unchecked icon",
        iconStandby: "Slot for null/indeterminate icon",
        checkedIcon: "Icon when checked",
        uncheckedIcon: "Icon when unchecked",
        default: "Fallback label content"
      },
      events: {
        onChange: "(checked|value, event)",
        onInput: "(checked|value, event)"
      },
      returns: "HTMLLabelElement",
      description: "Toggle switch con supporto model e comportamento checkbox/radio."
    };
```

#### Slider

- Alias: `UI.Slider`, `_.Slider`
- Signature: `UI.Slider(...children) | UI.Slider(props, ...children)`
- Descrizione: Slider reattivo con label, icone, thumb custom, markers e supporto model/QItem.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/slider.cms.js`

```js
UI.meta.Slider = {
      signature: "UI.Slider(...children) | UI.Slider(props, ...children)",
      props: {
        min: "number",
        max: "number",
        step: "number|\"any\"",
        value: "number | rod | [get,set] signal",
        model: "rod | [get,set] signal",
        label: "String|Node|Function|Array",
        icon: "String|Node|Function|Array",
        iconRight: "String|Node|Function|Array",
        thumbIcon: "String|Node|Function|Array",
        iconThumb: "Alias di thumbIcon",
        pointIcon: "Alias di thumbIcon",
        thumbLabel: "String|Node|Function|Array",
        showValue: "boolean",
        labelValue: "String|Node|Function|Array",
        markers: "boolean|number|Array|Object",
        markerLabels: "boolean",
        labelMarks: "Alias di markerLabels",
        startLabel: "String|Node|Function|Array",
        endLabel: "String|Node|Function|Array",
        leftLabel: "Alias di startLabel",
        rightLabel: "Alias di endLabel",
        minLabel: "Alias di startLabel",
        maxLabel: "Alias di endLabel",
        withQItem: "boolean",
        qitem: "Alias di withQItem",
        item: "boolean",
        itemClass: "string",
        itemStyle: "object",
        selectionColor: "string",
        trackColor: "string",
        thumbColor: "string",
        readonly: "boolean",
        inputClass: "string",
        slots: "{ label?, default?, value?, icon?, iconRight?, thumbIcon?, thumbLabel?, marker?, markerLabel?, startLabel?, endLabel? }",
        class: "string",
        style: "object"
      },
      slots: {
        label: "Label content",
        default: "Fallback label content",
        value: "Header value content",
        icon: "Left icon content",
        iconRight: "Right icon content",
        thumbIcon: "Thumb icon content",
        thumbLabel: "Thumb label content",
        marker: "Marker content",
        markerLabel: "Marker label content",
        startLabel: "Label a sinistra/inizio track",
        endLabel: "Label a destra/fine track"
      },
      events: {
        onChange: "(value, event)",
        onInput: "(value, event)"
      },
      returns: "HTMLLabelElement | HTMLLIElement (with ._input = HTMLInputElement)",
      description: "Slider reattivo con label, icone, thumb custom, markers e supporto model/QItem."
    };
```

#### Rating

- Alias: `UI.Rating`, `_.Rating`
- Signature: `UI.Rating(...children) | UI.Rating(props, ...children)`
- Descrizione: Rating reattivo con label, icone custom, half rating, clearable e supporto model.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/rating.cms.js`

```js
UI.meta.Rating = {
      signature: "UI.Rating(...children) | UI.Rating(props, ...children)",
      props: {
        max: "number",
        value: "number | rod | [get,set] signal",
        model: "rod | [get,set] signal",
        name: "string",
        label: "String|Node|Function|Array",
        clearable: "boolean",
        half: "boolean",
        allowHalf: "Alias di half",
        noDimming: "boolean",
        readonly: "boolean",
        disabled: "boolean",
        icon: "String|Node|Function|Array",
        iconSelected: "Alias di checkedIcon",
        checkedIcon: "String|Node|Function|Array",
        uncheckedIcon: "String|Node|Function|Array",
        iconHalf: "Alias di halfIcon",
        halfIcon: "String|Node|Function|Array",
        iconHovered: "Alias di hoveredIcon",
        hoveredIcon: "String|Node|Function|Array",
        color: "string",
        colorSelected: "string",
        colorHalf: "string",
        colorHovered: "string",
        colorInactive: "string",
        iconSize: "string|number",
        size: "string|number",
        gap: "string|number",
        slots: "{ label?, icon?, checkedIcon?, uncheckedIcon?, halfIcon?, hoveredIcon?, item?, star? }",
        class: "string",
        style: "object"
      },
      slots: {
        label: "Label content",
        icon: "Base icon content per item",
        checkedIcon: "Icon when item is selected",
        uncheckedIcon: "Icon when item is empty",
        halfIcon: "Icon when item is half-selected",
        hoveredIcon: "Icon while hovering selected items",
        item: "Custom item renderer",
        star: "Alias di item/icon"
      },
      events: {
        onChange: "(value, event)",
        onInput: "(value, event)",
        onHover: "(value, event)"
      },
      keyboard: ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "Enter", "Space", "Delete", "Backspace", "0"],
      returns: "HTMLLabelElement (with ._input, ._rating, ._getValue(), ._setValue(value))",
      description: "Rating reattivo con label, icone custom, half rating, clearable e supporto model."
    };
```

#### Date

- Alias: `UI.Date`, `_.Date`
- Signature: `UI.Date(props)`
- Descrizione: Date picker reattivo con overlay fixed, single/range/multiple/multi-range, model, min/max, presets, size xs-xl e supporto opzionale al tempo in interfaccia unificata.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/date.cms.js`

```js
UI.meta.Date = {
      signature: "UI.Date(props)",
      props: {
        value: "string | { from, to } | string[] | Array<{ from, to }> | Array<[from, to]>",
        model: "rod | [get,set] signal",
        mode: "\"single\"|\"range\"|\"multiple\"|\"range-multiple\"",
        range: "boolean",
        multiple: "boolean",
        rangeMultiple: "boolean",
        multipleRange: "Alias di rangeMultiple",
        min: "string",
        max: "string",
        minDate: "Alias di min",
        maxDate: "Alias di max",
        minRange: "number",
        maxRange: "number",
        manualInput: "boolean",
        firstDayOfWeek: "number",
        monthsToShow: "number",
        locale: "string",
        shortcuts: "Array<{ label, value }>",
        options: "Array|string|Function",
        enableDates: "Alias di options",
        disableDates: "Array|string|Function",
        label: "String|Node|Function|Array",
        icon: "String|Node|Function|Array",
        iconRight: "String|Node|Function|Array",
        pointIcon: "String|Node|Function|Array",
        withTime: "boolean",
        timeValue: "string|Date",
        timeMin: "string",
        timeMax: "string",
        timeMinuteStep: "number",
        timeSecondStep: "number",
        timeWithSeconds: "boolean",
        timeShortcuts: "Array<{ label, value }>",
        timePointIcon: "String|Node|Function|Array",
        clearable: "boolean",
        confirm: "boolean",
        name: "string",
        nameFrom: "string",
        nameTo: "string",
        size: "\"xs\"|\"sm\"|\"md\"|\"lg\"|\"xl\"",
        class: "string",
        style: "object"
      },
      slots: {
        day: "Contenuto del giorno ({ date, selected, inRange, disabled, outside })",
        point: "Punto/icona nel giorno",
        dayPoint: "Alias di point",
        value: "Footer value renderer ({ value, displayValue, mode })",
        timeOption: "Renderer per opzione oraria nel footer integrato",
        timePoint: "Punto/icona nella time option del footer",
        timeShortcut: "Renderer scorciatoia oraria integrata",
        label: "Floating label",
        topLabel: "Top label",
        icon: "Left icon",
        iconRight: "Right icon",
        default: "Fallback value content"
      },
      events: {
        onChange: "(value, event)",
        onInput: "(value, event)",
        onOpen: "void",
        onClose: "void",
        onNavigate: "({ month, year })"
      },
      returns: "HTMLDivElement (field wrapper) con ._input, ._open(), ._close(), ._getValue(), ._setValue(value)",
      description: "Date picker reattivo con overlay fixed, single/range/multiple/multi-range, model, min/max, presets, size xs-xl e supporto opzionale al tempo in interfaccia unificata."
    };
```

#### Time

- Alias: `UI.Time`, `_.Time`
- Signature: `UI.Time(props)`
- Descrizione: Time picker reattivo con overlay fixed, label/icon slots, point icon, shortcuts, confirm e model.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/time.cms.js`

```js
UI.meta.Time = {
      signature: "UI.Time(props)",
      props: {
        value: "string|Date",
        model: "rod | [get,set] signal",
        min: "string",
        max: "string",
        minuteStep: "number",
        secondStep: "number",
        withSeconds: "boolean",
        manualInput: "boolean",
        clearable: "boolean",
        confirm: "boolean",
        label: "String|Node|Function|Array",
        icon: "String|Node|Function|Array",
        iconRight: "String|Node|Function|Array",
        pointIcon: "String|Node|Function|Array",
        shortcuts: "Array<{ label, value }>",
        name: "string",
        class: "string",
        style: "object"
      },
      slots: {
        option: "Renderer per opzione oraria ({ part, value, label, selected, timeValue })",
        point: "Punto/icona nella time option selezionata",
        shortcut: "Renderer scorciatoia",
        value: "Footer value renderer ({ value, displayValue })",
        label: "Floating label",
        topLabel: "Top label",
        icon: "Left icon",
        iconRight: "Right icon",
        default: "Fallback value content"
      },
      events: {
        onChange: "(value, event)",
        onInput: "(value, event)",
        onOpen: "void",
        onClose: "void"
      },
      returns: "HTMLDivElement (field wrapper) con ._input, ._open(), ._close(), ._getValue(), ._setValue(value)",
      description: "Time picker reattivo con overlay fixed, label/icon slots, point icon, shortcuts, confirm e model."
    };
```

### Navigazione, feedback e data display

#### Tabs

- Alias: `UI.Tabs`, `_.Tabs`
- Signature: `UI.Tabs(props) | UI.Tabs(props, ...children)`
- Descrizione: Tab bar standardizzata con supporto controlled/uncontrolled, slot strutturati, badge/note/icon e navigazione tastiera.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/tabs.cms.js`

```js
UI.meta.Tabs = {
      signature: "UI.Tabs(props) | UI.Tabs(props, ...children)",
      props: {
        tabs: "Array<{ value|name|id|key, label|title, note|subtitle|description, icon, badge|counter, disabled, hidden, onClick }>",
        items: "Alias di tabs",
        value: "any",
        defaultValue: "any",
        default: "Alias di defaultValue",
        model: "[get,set] signal",
        orientation: "horizontal|vertical",
        variant: "line|pills|soft",
        fill: "boolean",
        wrap: "boolean",
        disabled: "boolean",
        color: "string",
        state: "string",
        gap: "string|number",
        tabGap: "string|number",
        align: "string",
        justify: "string",
        size: "string|number",
        dense: "boolean",
        navClass: "string",
        tabClass: "string",
        itemClass: "string",
        slots: "{ nav?, tab?, label?, icon?, note?, badge?, extra?, empty?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        nav: "Renderer della nav completa",
        tab: "Renderer del singolo tab",
        label: "Renderer della label",
        icon: "Renderer dell'icona",
        note: "Renderer della nota",
        badge: "Renderer del badge/counter",
        extra: "Area extra accanto alla nav",
        empty: "Fallback quando tabs/items e vuoto",
        default: "Children / extra content fallback"
      },
      events: {
        onChange: "(value, tab, event, index)"
      },
      keyboard: ["Enter/Space", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"],
      returns: "HTMLDivElement con ._getValue(), ._setValue(value), ._select(value), ._next(), ._prev(), ._getTabs()",
      description: "Tab bar standardizzata con supporto controlled/uncontrolled, slot strutturati, badge/note/icon e navigazione tastiera."
    };
```

#### TabPanel

- Alias: `UI.TabPanel`, `_.TabPanel`
- Signature: `UI.TabPanel(props) | UI.TabPanel(props, ...children)`
- Descrizione: Definizione dei tab. Supporta alias multipli per label e contenuto.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/tap-panel.cms.js`

```js
UI.meta.TabPanel = {
      signature: "UI.TabPanel(props) | UI.TabPanel(props, ...children)",
      props: {
        tabs: {
          type: "Array<{ name?, value?, label?, title?, note?, subtitle?, icon?, badge?, content?, panel?, body?, children?, disabled?, hidden?, tabClass?, panelClass? }>",
          description: "Definizione dei tab. Supporta alias multipli per label e contenuto.",
          category: "data"
        },
        items: {
          type: "Array",
          description: "Alias di `tabs`.",
          category: "data"
        },
        value: {
          type: "any",
          description: "Valore iniziale o controllato del tab attivo.",
          category: "data"
        },
        defaultValue: {
          type: "any",
          description: "Alias esplicito per il tab iniziale quando non usi `model`.",
          category: "data"
        },
        model: {
          type: "[get,set] signal",
          description: "Binding reattivo del tab attivo.",
          category: "data"
        },
        orientation: {
          type: "vertical|horizontal",
          description: "Orientamento della navigazione.",
          values: ["vertical", "horizontal"],
          default: "vertical",
          category: "layout"
        },
        navPosition: {
          type: "before|after",
          description: "Posizione della barra tab rispetto ai pannelli.",
          values: ["before", "after"],
          default: "before",
          category: "layout"
        },
        variant: {
          type: "line|pills|soft",
          description: "Stile visivo della navigazione tab.",
          values: ["line", "pills", "soft"],
          default: "line",
          category: "style"
        },
        wrap: {
          type: "boolean",
          description: "Permette al nav di andare a capo quando lo spazio non basta.",
          default: false,
          category: "layout"
        },
        navFill: {
          type: "boolean",
          description: "Distribuisce i tab sulla larghezza disponibile.",
          default: false,
          category: "layout"
        },
        swipeable: {
          type: "boolean",
          description: "Abilita swipe sui pannelli.",
          default: false,
          category: "behavior"
        },
        infinite: {
          type: "boolean",
          description: "Quando attivo, next/prev cicla dal primo all'ultimo tab.",
          default: false,
          category: "behavior"
        },
        animated: {
          type: "boolean",
          description: "Abilita la transizione fra pannelli.",
          default: false,
          category: "behavior"
        },
        transitionDuration: {
          type: "number",
          description: "Durata animazione in millisecondi.",
          default: 220,
          category: "behavior"
        },
        transitionEasing: {
          type: "string",
          description: "Timing function CSS dell'animazione.",
          default: "ease",
          category: "behavior"
        },
        transitionPrev: {
          type: "string",
          description: "Classi custom applicate durante la transizione verso il tab precedente.",
          category: "behavior"
        },
        transitionNext: {
          type: "string",
          description: "Classi custom applicate durante la transizione verso il tab successivo.",
          category: "behavior"
        },
        tabClass: {
          type: "string",
          description: "Classi aggiuntive per tutti i bottoni tab.",
          category: "style"
        },
        tabStyle: {
          type: "object",
          description: "Style inline applicato a tutti i bottoni tab.",
          category: "style"
        },
        navClass: {
          type: "string",
          description: "Classi aggiuntive per il wrapper della nav.",
          category: "style"
        },
        panelsClass: {
          type: "string",
          description: "Classi aggiuntive per il wrapper dei pannelli.",
          category: "style"
        },
        panelClass: {
          type: "string",
          description: "Classi aggiuntive comuni per ogni pannello.",
          category: "style"
        },
        panelStyle: {
          type: "object",
          description: "Style inline comune per ogni pannello.",
          category: "style"
        },
        empty: {
          type: "Node|Function|Array",
          description: "Fallback visuale quando `tabs` e `items` sono vuoti.",
          category: "state"
        },
        disabled: {
          type: "boolean",
          description: "Disabilita l'intero componente.",
          default: false,
          category: "state"
        },
        slots: {
          type: "{ nav?, tab?, label?, icon?, note?, badge?, panel?, empty?, default? }",
          description: "Slot strutturati per personalizzare nav, label, badge e contenuto.",
          category: "general"
        }
      },
      slots: {
        nav: {
          type: "Function|Node|Array",
          description: "Renderer completo della navigazione. Riceve `tabs`, `active()`, `activeTab()`, `select()`, `next()`, `prev()`, `nodes`, `orientation`, `position`, `variant`."
        },
        tab: {
          type: "Function|Node|Array",
          description: "Contenuto interno del bottone tab. Riceve `tab`, `name`, `index`, `active`, `label`, `icon`, `note`, `badge`, `select()`."
        },
        label: {
          type: "Function|Node|Array",
          description: "Label del tab."
        },
        icon: {
          type: "Function|Node|Array",
          description: "Icona del tab."
        },
        note: {
          type: "Function|Node|Array",
          description: "Nota, subtitle o descrizione breve sotto la label."
        },
        badge: {
          type: "Function|Node|Array",
          description: "Badge o counter allineato a destra del tab."
        },
        panel: {
          type: "Function|Node|Array",
          description: "Renderer del pannello attivo/inattivo. Riceve `tab`, `name`, `index`, `active`, `select()`, `next()`, `prev()`."
        },
        empty: {
          type: "Function|Node|Array",
          description: "Fallback quando non ci sono tab."
        },
        default: {
          type: "Node|Array|Function",
          description: "Contenuto extra appendato dopo il componente."
        }
      },
      events: {
        onChange: "(name, tab, index)"
      },
      returns: "HTMLDivElement con API `_getValue()`, `_setValue(value)`, `_select(value)`, `_next()`, `_prev()`, `_active()`, `_tabs()`",
      description: "Tab panel standardizzato con nav accessibile, slot strutturati, model reattivo, swipe e animazioni."
    };
```

#### RouteTab

- Alias: `UI.RouteTab`, `_.RouteTab`
- Signature: `UI.RouteTab(...children) | UI.RouteTab(props, ...children)`
- Descrizione: Tab/link standardizzato per navigazione router o href, con slot strutturati, stati e badge.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/route-tab.cms.js`

```js
UI.meta.RouteTab = {
      signature: "UI.RouteTab(...children) | UI.RouteTab(props, ...children)",
      props: {
        label: "String|Node|Function|Array",
        to: "string",
        href: "string",
        active: "boolean",
        selected: "Alias di active",
        match: "\"exact\"|\"startsWith\"|RegExp|Function|string",
        matchMode: "\"exact\"|\"startsWith\"",
        exact: "boolean",
        startsWith: "boolean",
        note: "String|Node|Function|Array",
        badge: "String|Node|Function|Array",
        icon: "String|Node|Function|Array",
        iconRight: "String|Node|Function|Array",
        aside: "Node|Function|Array",
        variant: "\"line\"|\"pills\"|\"soft\"",
        disabled: "boolean",
        block: "boolean",
        state: "string",
        color: "string",
        slots: "{ icon?, label?, note?, badge?, aside?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        icon: "Leading icon content",
        label: "Main label content",
        note: "Secondary note/caption",
        badge: "Badge / counter area",
        aside: "Trailing visual/action area",
        default: "Extra content under the note"
      },
      events: {
        onClick: "MouseEvent",
        onNavigate: "(to, event)"
      },
      returns: "HTMLAnchorElement con ._isActive(), ._setActive(boolean|null), ._navigate(event?)",
      description: "Tab/link standardizzato per navigazione router o href, con slot strutturati, stati e badge."
    };
```

#### Breadcrumbs

- Alias: `UI.Breadcrumbs`, `_.Breadcrumbs`
- Signature: `UI.Breadcrumbs(props)`
- Descrizione: Breadcrumbs standardizzati con item strutturati, slot completi, collapse automatico e supporto a link/router.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/breadcrumbs.cms.js`

```js
UI.meta.Breadcrumbs = {
      signature: "UI.Breadcrumbs(props)",
      props: {
        items: "Array<string|number|Node|Function|{ label?, to?, href?, icon?, note?, badge?, current?, disabled?, hidden?, slots? }>",
        model: "[get,set] signal|Array",
        home: "boolean|Object",
        separator: "string|Node|Function",
        before: "Node|Function|Array",
        after: "Node|Function|Array",
        empty: "Node|Function|Array",
        variant: "\"line\"|\"pills\"|\"soft\"",
        max: "number",
        leadingCount: "number",
        trailingCount: "number",
        dense: "boolean",
        wrap: "boolean",
        nowrap: "boolean",
        linkCurrent: "boolean",
        color: "string",
        state: "string",
        itemSize: "string|number",
        ariaLabel: "string",
        class: "string",
        style: "object"
      },
      slots: {
        before: "Content before breadcrumb list",
        after: "Content after breadcrumb list",
        item: "Full renderer for a breadcrumb entry",
        icon: "Leading icon for each breadcrumb",
        label: "Main breadcrumb label",
        note: "Secondary line for the breadcrumb",
        badge: "Badge/counter area",
        aside: "Trailing area",
        default: "Extra content under note",
        separator: "Separator renderer",
        collapsed: "Renderer for collapsed middle items",
        empty: "Renderer for empty state"
      },
      events: {
        onItemClick: "(item, ctx, event)",
        onNavigate: "(toOrHref, item, event)"
      },
      returns: "HTMLElement <nav> con .getItems(), .getVisibleItems(), .refresh(), .setItems(items)",
      description: "Breadcrumbs standardizzati con item strutturati, slot completi, collapse automatico e supporto a link/router."
    };
```

#### Pagination

- Alias: `UI.Pagination`, `_.Pagination`
- Signature: `UI.Pagination(props)`
- Descrizione: Paginazione standard con controlli edge, numeri, ellissi, summary e supporto total/pageSize.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/pagination.cms.js`

```js
UI.meta.Pagination = {
      signature: "UI.Pagination(props)",
      props: {
        max: "number",
        pages: "number",
        total: "number",
        pageSize: "number",
        value: "number",
        page: "number",
        model: "[get,set] signal",
        showPages: "boolean",
        showSummary: "boolean",
        showLabel: "boolean",
        showPrev: "boolean",
        showNext: "boolean",
        showFirst: "boolean",
        showLast: "boolean",
        showEdges: "boolean",
        siblings: "number",
        boundaryCount: "number",
        hideOnSinglePage: "boolean",
        size: "xxs|xs|sm|md|lg|xl|xxl|xxxl",
        dense: "boolean",
        simple: "boolean",
        color: "primary|secondary|warning|danger|success|info|light|dark",
        state: "primary|secondary|warning|danger|success|info|light|dark",
        slots: "{ start?, end?, first?, prev?, page?, item?, ellipsis?, next?, last?, summary?, label? }",
        class: "string",
        style: "object"
      },
      slots: {
        start: "Contenuto prima dei controlli",
        end: "Contenuto dopo i controlli",
        first: "First button content",
        prev: "Prev button content",
        page: "Page item content (ctx: { page, active, pages })",
        item: "Alias di page",
        ellipsis: "Ellipsis content",
        next: "Next button content",
        last: "Last button content",
        summary: "Summary content",
        label: "Alias legacy di summary"
      },
      events: {
        onChange: "(page, ctx, event)",
        onPageChange: "(page, ctx, event)"
      },
      returns: "HTMLElement <nav>",
      description: "Paginazione standard con controlli edge, numeri, ellissi, summary e supporto total/pageSize."
    };
```

#### Spinner

- Alias: `UI.Spinner`, `_.Spinner`
- Signature: `UI.Spinner(...children) | UI.Spinner(props, ...children)`
- Descrizione: Spinner animato con layout flessibile, contenuti opzionali e controllo di dimensioni, velocita e traccia.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/spinner.cms.js`

```js
UI.meta.Spinner = {
      signature: "UI.Spinner(...children) | UI.Spinner(props, ...children)",
      props: {
        size: "number|string",
        color: "string",
        thickness: "number|string",
        trackColor: "string",
        speed: "number|string",
        state: "primary|secondary|success|warning|danger|info|light|dark",
        label: "String|Node|Function|Array",
        note: "String|Node|Function|Array",
        vertical: "boolean",
        reverse: "boolean",
        center: "boolean",
        block: "boolean",
        pause: "boolean",
        paused: "boolean",
        ariaLabel: "string",
        indicatorClass: "string",
        indicatorStyle: "object",
        slots: "{ indicator?, label?, note?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        indicator: "Custom spinner indicator",
        label: "Primary label/content near the spinner",
        note: "Secondary supporting text",
        default: "Extra content rendered near the spinner"
      },
      returns: "HTMLDivElement",
      description: "Spinner animato con layout flessibile, contenuti opzionali e controllo di dimensioni, velocita e traccia."
    };
```

#### Progress

- Alias: `UI.Progress`, `_.Progress`
- Signature: `UI.Progress(...children) | UI.Progress(props, ...children)`
- Descrizione: Progress bar standardizzata con header opzionale, buffer, stato semantico e supporto reattivo.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/progress.cms.js`

```js
UI.meta.Progress = {
      signature: "UI.Progress(...children) | UI.Progress(props, ...children)",
      props: {
        value: "number|rod|[get,set] signal",
        model: "rod|[get,set] signal",
        min: "number",
        max: "number",
        buffer: "number|rod|[get,set] signal",
        label: "String|Node|Function|Array",
        note: "String|Node|Function|Array",
        showValue: "boolean|\"inside\"",
        valueLabel: "String|Node|Function|Array",
        insideLabel: "String|Node|Function|Array",
        formatValue: "function(value, percent, ctx)",
        icon: "String|Node|Function|Array",
        iconRight: "String|Node|Function|Array",
        startLabel: "String|Node|Function|Array",
        endLabel: "String|Node|Function|Array",
        leftLabel: "Alias di startLabel",
        rightLabel: "Alias di endLabel",
        width: "string|number",
        size: "string|number",
        height: "string|number",
        thickness: "Alias di height",
        color: "string",
        state: "primary|secondary|success|warning|danger|info|light|dark",
        trackColor: "string",
        bufferColor: "string",
        striped: "boolean",
        animated: "boolean",
        indeterminate: "boolean",
        reverse: "boolean",
        slots: "{ icon?, label?, note?, value?, inside?, startLabel?, endLabel?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        icon: "Icona prima della label",
        label: "Contenuto principale del progress",
        note: "Contenuto secondario sotto la label",
        value: "Valore esterno a destra",
        inside: "Contenuto dentro la barra",
        startLabel: "Label a sinistra della barra",
        endLabel: "Label a destra della barra",
        default: "Fallback label content"
      },
      returns: "HTMLDivElement",
      description: "Progress bar standardizzata con header opzionale, buffer, stato semantico e supporto reattivo."
    };
```

#### LoadingBar

- Alias: `UI.LoadingBar`, `_.LoadingBar`
- Signature: `UI.LoadingBar(...children) | UI.LoadingBar(props, ...children)`
- Descrizione: Loading bar basata su UI.Progress, montabile su body o container custom, controllabile via model o API imperativa.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/loading-bar.cms.js`

```js
UI.meta.LoadingBar = {
      signature: "UI.LoadingBar(...children) | UI.LoadingBar(props, ...children)",
      props: {
        value: "number|rod|[get,set] signal",
        model: "rod|[get,set] signal",
        buffer: "number|rod|[get,set] signal",
        min: "number",
        max: "number",
        height: "string|number",
        thickness: "Alias di height",
        size: "string|number",
        color: "string",
        state: "primary|secondary|success|warning|danger|info|light|dark",
        trackColor: "string",
        bufferColor: "string",
        striped: "boolean",
        animated: "boolean",
        indeterminate: "boolean",
        reverse: "boolean",
        width: "string|number",
        target: "HTMLElement|string",
        mount: "boolean",
        position: "fixed|absolute|relative|static|sticky",
        inset: "string|number",
        top: "string|number",
        right: "string|number",
        bottom: "string|number",
        left: "string|number",
        zIndex: "number",
        visible: "boolean",
        autoStart: "boolean",
        startValue: "number",
        step: "number",
        trickle: "boolean",
        trickleStep: "number",
        trickleInterval: "number",
        trickleMax: "number",
        trickleTo: "Alias di trickleMax",
        doneValue: "number",
        doneDelay: "Alias di hideDelay",
        hideDelay: "number",
        resetValue: "number",
        label: "String|Node|Function|Array",
        note: "String|Node|Function|Array",
        showValue: "boolean|\"inside\"",
        valueLabel: "String|Node|Function|Array",
        insideLabel: "String|Node|Function|Array",
        startLabel: "String|Node|Function|Array",
        endLabel: "String|Node|Function|Array",
        progressClass: "string",
        progressStyle: "object",
        slots: "{ icon?, label?, note?, value?, inside?, startLabel?, endLabel?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        icon: "Icona prima della label",
        label: "Contenuto principale",
        note: "Contenuto secondario",
        value: "Valore esterno a destra",
        inside: "Contenuto dentro la barra",
        startLabel: "Label a sinistra della barra",
        endLabel: "Label a destra della barra",
        default: "Fallback content"
      },
      returns: "HTMLDivElement con API imperativa: .set(), .setBuffer(), .inc(), .start(), .done(), .stop(), .reset(), .show(), .hide(), .destroy()",
      description: "Loading bar basata su UI.Progress, montabile su body o container custom, controllabile via model o API imperativa."
    };
```

#### Table

- Alias: `UI.Table`, `_.Table`
- Signature: `UI.Table(props)`
- Descrizione: Tabella standardizzata con toolbar, ricerca, sorting, paginazione, stati e rendering flessibile.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/table.cms.js`

```js
UI.meta.Table = {
      signature: "UI.Table(props)",
      props: {
        columns: "Array<{ key, label?, sortable?, get?, value?, render?, format?, width?, minWidth?, maxWidth?, align?, compare?, style?, headerStyle?, thStyle?, cellStyle?, tdStyle?, cellClass?, headerClass?, nowrap?, searchable? }>",
        rows: "Array|() => Array",
        rowKey: "string|((row)=>string)",
        loading: "boolean|() => boolean",
        page: "number",
        pageSize: "number",
        pageSizeOptions: "number[]",
        pagination: "boolean",
        initialSort: "{ key, dir: 'asc'|'desc' }",
        search: "string",
        query: "string",
        searchable: "boolean|string",
        searchPlaceholder: "string",
        searchKeys: "Array<string|function>",
        searchModel: "[get,set] signal",
        filter: "(row, ctx)=>boolean",
        actions: "(row, ctx)=>Node|Array",
        actionsLabel: "string|Node|Function|Array",
        emptyText: "string|Node|Function|Array",
        loadingText: "string|Node|Function|Array",
        toolbar: "Node|Function|Array",
        toolbarStart: "Node|Function|Array",
        toolbarEnd: "Node|Function|Array",
        caption: "string|Node|Function|Array",
        footer: "Node|Function|Array",
        status: "string|Node|Function|Array",
        rowClass: "string|((row,ctx)=>string)",
        rowAttrs: "object|((row,ctx)=>object)",
        minTableWidth: "string|number",
        stickyHeader: "boolean",
        hideHeader: "boolean",
        hideFooter: "boolean",
        dense: "boolean",
        striped: "boolean",
        hover: "boolean",
        tableClass: "string",
        cardClass: "string",
        class: "string",
        style: "object"
      },
      slots: {
        default: "Contenuto introduttivo sopra la tabella",
        toolbarStart: "Area sinistra toolbar",
        toolbar: "Toolbar centrale/custom",
        toolbarEnd: "Area destra toolbar",
        search: "Sostituisce la search box built-in",
        header: "Header custom per colonna",
        cell: "Render globale celle",
        actions: "Render globale azioni riga",
        actionsHeader: "Header colonna azioni",
        caption: "Caption sopra la tabella",
        status: "Contenuto extra nella status row",
        loading: "Stato loading",
        empty: "Stato empty",
        footer: "Contenuto extra nel footer"
      },
      events: {
        onRowClick: "(row, ctx, event) => void",
        onRowDblClick: "(row, ctx, event) => void"
      },
      returns: "HTMLDivElement",
      description: "Tabella standardizzata con toolbar, ricerca, sorting, paginazione, stati e rendering flessibile."
    };
```

### Overlay e runtime utilities

#### Tooltip

- Alias: `UI.Tooltip`, `_.Tooltip`
- Signature: `UI.Tooltip(props, target?) | UI.Tooltip(target, content)`
- Descrizione: Tooltip ancorato con trigger hover/focus/click, contenuto ricco e API imperativa.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/tooltip.cms.js`

```js
UI.meta.Tooltip = {
      signature: "UI.Tooltip(props, target?) | UI.Tooltip(target, content)",
      props: {
        title: "String|Node|Function|Array",
        content: "String|Node|Function|Array",
        text: "String|Node|Function|Array",
        body: "String|Node|Function|Array",
        footer: "String|Node|Function|Array",
        icon: "String|Node|Function|Array",
        target: "Node|Function|Array",
        trigger: "\"hover focus\" | \"click\" | \"manual\" | Array",
        interactive: "boolean",
        disabled: "boolean",
        open: "boolean | reactive",
        placement: "string",
        delay: "number",
        hideDelay: "number",
        offset: "number (legacy)",
        offsetX: "number",
        offsetY: "number",
        closeOnOutside: "boolean",
        closeOnEsc: "boolean",
        maxWidth: "string|number",
        minWidth: "string|number",
        width: "string|number",
        slots: "{ target?, icon?, title?, content?, footer?, default? }",
        class: "string",
        panelClass: "string",
        wrapClass: "string",
        style: "object",
        targetStyle: "object"
      },
      slots: {
        target: "Tooltip trigger content ({ open, show, hide, toggle, isOpen })",
        icon: "Tooltip icon content",
        title: "Tooltip title content",
        content: "Tooltip body content ({ close, hide, isOpen, anchorEl })",
        footer: "Tooltip footer content ({ close, hide, isOpen, anchorEl })",
        default: "Fallback tooltip body content"
      },
      events: {
        onOpen: "(entry) => void",
        onClose: "() => void",
        onTriggerClick: "(event) => void"
      },
      returns: "Object { bind(), open(), show(), hide(), close(), toggle(), isOpen() } | HTMLSpanElement",
      description: "Tooltip ancorato con trigger hover/focus/click, contenuto ricco e API imperativa."
    };
```

#### Drawer

- Alias: `UI.Drawer`, `_.Drawer`
- Signature: `UI.Drawer(props)`
- Descrizione: Drawer strutturato e retro compatibile con header/footer, gruppi, slot estesi, empty state e stato persistente.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/drawer.cms.js`

```js
UI.meta.Drawer = {
      signature: "UI.Drawer(props)",
      props: {
        items: "Array",
        header: "Node|Function|Array",
        footer: "Node|Function|Array",
        before: "Node|Function|Array",
        after: "Node|Function|Array",
        title: "String|Node|Function|Array",
        subtitle: "String|Node|Function|Array",
        eyebrow: "String|Node|Function|Array",
        icon: "String|Node|Function|Array",
        content: "Node|Function|Array",
        meta: "Node|Function|Array",
        actions: "Node|Function|Array",
        empty: "Node|Function|Array",
        emptyText: "string",
        stateKey: "string",
        closeOnSelect: "boolean",
        groupOpenIcon: "String|Node|Function|Array",
        groupCloseIcon: "String|Node|Function|Array",
        itemIconSize: "string|number",
        gap: "string|number",
        indent: "string|number",
        padding: "string|number",
        width: "string|number",
        minHeight: "string|number",
        maxHeight: "string|number",
        onSelect: "function(item, ctx, event)",
        sticky: "boolean",
        slots: "{ header?, body?, footer?, before?, after?, empty?, item?, itemLabel?, itemNote?, itemBadge?, itemAside?, itemContent?, group?, groupLabel?, groupNote?, groupBadge?, groupAside?, groupContent?, sectionLabel? }",
        class: "string",
        style: "object"
      },
      slots: {
        header: "Header del drawer, override completo",
        body: "Override completo del body",
        footer: "Footer del drawer",
        before: "Contenuto prima della lista items",
        after: "Contenuto dopo la lista items",
        empty: "Empty state quando non ci sono contenuti",
        item: "Override completo di un item semplice",
        itemLabel: "Label item (ctx: { item, label, note, badge, aside, content })",
        itemNote: "Note/subtitle item",
        itemBadge: "Badge item",
        itemAside: "Aside/meta item",
        itemContent: "Contenuto extra item",
        group: "Override completo header di un gruppo (ctx include toggle/isOpen)",
        groupLabel: "Label gruppo",
        groupNote: "Note gruppo",
        groupBadge: "Badge gruppo",
        groupAside: "Aside/meta gruppo",
        groupContent: "Contenuto extra gruppo",
        sectionLabel: "Label per elementi section/heading"
      },
      returns: "HTMLDivElement con methods openDrawer/closeDrawer/toggleDrawer/isDrawerOpen",
      description: "Drawer strutturato e retro compatibile con header/footer, gruppi, slot estesi, empty state e stato persistente."
    };
```

#### Dialog

- Alias: `UI.Dialog`, `_.Dialog`
- Signature: `UI.Dialog(props) | UI.Dialog(props, ...children) -> { open, close, toggle, update, isOpen }`
- Descrizione: Dialog overlay standardizzato con varianti, animazioni, slots strutturati e API imperativa.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/dialog.cms.js`

```js
UI.meta.Dialog = {
      signature: "UI.Dialog(props) | UI.Dialog(props, ...children) -> { open, close, toggle, update, isOpen }",
      props: {
        title: "String|Node|Function|Array|({ close })=>Node",
        subtitle: "String|Node|Function|Array|({ close })=>Node",
        eyebrow: "String|Node|Function|Array|({ close })=>Node",
        icon: "String|Node|Function|Array",
        content: "Node|Function|Array|({ close })=>Node",
        body: "Alias di content",
        actions: "Node|Function|Array|({ close })=>Node",
        footer: "Alias di actions",
        size: "xs|sm|md|lg|xl|full",
        state: "primary|secondary|warning|danger|success|info|light|dark",
        color: "Alias di state",
        width: "string|number",
        minWidth: "string|number",
        maxWidth: "string|number",
        maxHeight: "string|number",
        bodyMaxHeight: "string|number",
        persistent: "boolean",
        closable: "boolean",
        closeButton: "boolean",
        closeIcon: "string",
        align: "top|center|bottom",
        actionsAlign: "start|center|end|between|stretch",
        stickyHeader: "boolean",
        stickyActions: "boolean",
        scrollable: "boolean",
        stackActions: "boolean",
        fullscreen: "boolean",
        backdrop: "boolean",
        backdropBlur: "boolean",
        lockScroll: "boolean",
        trapFocus: "boolean",
        autoFocus: "boolean",
        closeOnOutside: "boolean",
        closeOnBackdrop: "boolean",
        closeOnEsc: "boolean",
        slots: "{ icon?, eyebrow?, title?, subtitle?, header?, content?, body?, footer?, actions?, close?, default? }",
        class: "string",
        panelClass: "string",
        overlayClass: "string",
        style: "object"
      },
      events: {
        onOpen: "(entry)",
        onClose: "void"
      },
      slots: {
        icon: "Dialog icon ({ close })",
        eyebrow: "Eyebrow sopra il titolo ({ close })",
        title: "Dialog title ({ close })",
        subtitle: "Dialog subtitle ({ close })",
        header: "Header personalizzato ({ close })",
        content: "Dialog body ({ close })",
        body: "Alias di content ({ close })",
        footer: "Footer personalizzato ({ close })",
        actions: "Dialog actions ({ close })",
        close: "Close action ({ close })",
        default: "Fallback body content ({ close })"
      },
      description: "Dialog overlay standardizzato con varianti, animazioni, slots strutturati e API imperativa.",
      returns: "Object { open(overrides?), close(), toggle(overrides?), update(props), isOpen(), entry(), props() }"
    };
```

#### Menu

- Alias: `UI.Menu`, `_.Menu`
- Signature: `UI.Menu(props) | UI.Menu(props, ...children) -> { open, close, show, hide, toggle, update, bind, isOpen }`
- Descrizione: Menu overlay standardizzato con item model, slot ricchi, trigger bindabili, header/footer e API imperativa.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/menu.cms.js`

```js
UI.meta.Menu = {
      signature: "UI.Menu(props) | UI.Menu(props, ...children) -> { open, close, show, hide, toggle, update, bind, isOpen }",
      props: {
        title: "String|Node|Function|Array|({ close })=>Node",
        subtitle: "String|Node|Function|Array|({ close })=>Node",
        eyebrow: "String|Node|Function|Array|({ close })=>Node",
        icon: "String|Node|Function|Array",
        content: "Node|Function|Array|({ close })=>Node",
        body: "Alias di content",
        items: "Array<string|object>|Function|Array",
        before: "Node|Function|Array",
        after: "Node|Function|Array",
        footer: "Node|Function|Array",
        status: "Node|Function|Array",
        empty: "Node|Function|Array",
        size: "xs|sm|md|lg|xl",
        state: "primary|secondary|warning|danger|success|info|light|dark",
        color: "Alias di state",
        trigger: "click|hover|focus|manual|Array",
        placement: "string",
        offsetX: "number",
        offsetY: "number",
        offset: "Alias di offsetY",
        width: "string|number",
        minWidth: "string|number",
        maxWidth: "string|number",
        maxHeight: "string|number",
        bodyMaxHeight: "string|number",
        contentMaxHeight: "Alias di bodyMaxHeight",
        closeOnSelect: "boolean",
        closeOnOutside: "boolean",
        closeOnEsc: "boolean",
        autoFocus: "boolean",
        anchorEl: "HTMLElement|VirtualAnchor",
        triggerEl: "Alias di anchorEl",
        target: "Alias di anchorEl",
        slots: "{ before?, icon?, eyebrow?, title?, subtitle?, header?, content?, body?, item?, itemTitle?, itemSubtitle?, itemBadge?, itemShortcut?, groupLabel?, empty?, status?, footer?, after?, default? }",
        class: "string",
        panelClass: "string",
        overlayClass: "string",
        style: "object",
        panelStyle: "object",
        onOpen: "function",
        onClose: "function",
        onItemClick: "(item, ctx, event) => void",
        onTriggerClick: "function"
      },
      slots: {
        before: "Area sopra header/body ({ close })",
        icon: "Menu icon",
        eyebrow: "Menu eyebrow ({ close })",
        title: "Menu title ({ close })",
        subtitle: "Menu subtitle ({ close })",
        header: "Header custom ({ close })",
        content: "Custom content ({ close })",
        body: "Alias di content ({ close })",
        item: "Custom item body ({ item, close })",
        itemTitle: "Item title ({ item, close })",
        itemSubtitle: "Item subtitle ({ item, close })",
        itemBadge: "Item badge ({ item, close })",
        itemShortcut: "Item shortcut ({ item, close })",
        groupLabel: "Label gruppi ({ item, close })",
        empty: "Empty state ({ close })",
        status: "Status row ({ close })",
        footer: "Footer actions ({ close })",
        after: "Area sotto body/footer ({ close })",
        default: "Fallback content ({ close })"
      },
      events: {
        onOpen: "void",
        onClose: "void",
        onItemClick: "item click"
      },
      returns: "Object { open(), close(), show(), hide(), toggle(), update(), bind(), isOpen() }",
      description: "Menu overlay standardizzato con item model, slot ricchi, trigger bindabili, header/footer e API imperativa."
    };
```

#### Popover

- Alias: `UI.Popover`, `_.Popover`
- Signature: `UI.Popover(props) | UI.Popover(props, ...children) -> { open, close, show, hide, toggle, update, bind, isOpen }`
- Descrizione: Popover ancorato standardizzato con layout ricco, slot completi, trigger bindabili e API imperativa.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/popover.cms.js`

```js
UI.meta.Popover = {
      signature: "UI.Popover(props) | UI.Popover(props, ...children) -> { open, close, show, hide, toggle, update, bind, isOpen }",
      props: {
        title: "String|Node|Function|Array|({ close })=>Node",
        subtitle: "String|Node|Function|Array|({ close })=>Node",
        eyebrow: "String|Node|Function|Array|({ close })=>Node",
        icon: "String|Node|Function|Array",
        content: "Node|Function|Array|({ close })=>Node",
        body: "Alias di content",
        actions: "Node|Function|Array|({ close })=>Node",
        footer: "Alias di actions",
        size: "xs|sm|md|lg|xl",
        state: "primary|secondary|warning|danger|success|info|light|dark",
        color: "Alias di state",
        trigger: "click|hover|focus|manual|Array",
        placement: "string",
        offsetX: "number",
        offsetY: "number",
        offset: "Alias di offsetY",
        width: "string|number",
        minWidth: "string|number",
        maxWidth: "string|number",
        maxHeight: "string|number",
        bodyMaxHeight: "string|number",
        contentMaxHeight: "Alias di bodyMaxHeight",
        backdrop: "boolean",
        lockScroll: "boolean",
        trapFocus: "boolean",
        autoFocus: "boolean",
        closeButton: "boolean",
        closable: "boolean",
        closeOnSelect: "boolean",
        closeOnOutside: "boolean",
        closeOnBackdrop: "boolean",
        closeOnEsc: "boolean",
        open: "boolean|rod|signal",
        anchorEl: "HTMLElement|VirtualAnchor",
        triggerEl: "Alias di anchorEl",
        target: "Alias di anchorEl",
        slots: "{ icon?, eyebrow?, title?, subtitle?, header?, content?, body?, footer?, actions?, close?, default? }",
        class: "string",
        panelClass: "string",
        overlayClass: "string",
        style: "object",
        onOpen: "function",
        onClose: "function",
        onTriggerClick: "function"
      },
      slots: {
        icon: "Popover icon",
        eyebrow: "Popover eyebrow ({ close })",
        title: "Popover title ({ close })",
        subtitle: "Popover subtitle ({ close })",
        header: "Header custom ({ close })",
        content: "Popover body ({ close })",
        body: "Alias di content ({ close })",
        footer: "Popover footer ({ close })",
        actions: "Alias di footer ({ close })",
        close: "Close button slot ({ close })",
        default: "Fallback body ({ close })"
      },
      events: {
        onOpen: "void",
        onClose: "void"
      },
      returns: "Object { open(), close(), show(), hide(), toggle(), update(), bind(), isOpen() }",
      description: "Popover ancorato standardizzato con layout ricco, slot completi, trigger bindabili e API imperativa."
    };
```

#### ContextMenu

- Alias: `UI.ContextMenu`, `_.ContextMenu`
- Signature: `UI.ContextMenu(props) | UI.ContextMenu(props, ...children) -> { open, openAt, openFromEvent, show, hide, close, toggle, update, bind, isOpen }`
- Descrizione: Specializzazione di Menu per click destro e tasto context menu, con items, slot ricchi, runtime overrides e posizionamento su coordinate.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/context-menu.cms.js`

```js
UI.meta.ContextMenu = {
      signature: "UI.ContextMenu(props) | UI.ContextMenu(props, ...children) -> { open, openAt, openFromEvent, show, hide, close, toggle, update, bind, isOpen }",
      props: {
        title: "String|Node|Function|Array|({ close })=>Node",
        subtitle: "String|Node|Function|Array|({ close })=>Node",
        eyebrow: "String|Node|Function|Array|({ close })=>Node",
        icon: "String|Node|Function|Array",
        content: "Node|Function|Array|({ close })=>Node",
        body: "Alias di content",
        items: "Array<string|object>|Function|Array",
        before: "Node|Function|Array",
        after: "Node|Function|Array",
        footer: "Node|Function|Array",
        status: "Node|Function|Array",
        empty: "Node|Function|Array",
        size: "xs|sm|md|lg|xl",
        state: "primary|secondary|warning|danger|success|info|light|dark",
        color: "Alias di state",
        placement: "string",
        offsetX: "number",
        offsetY: "number",
        offset: "Alias di offsetY",
        width: "string|number",
        minWidth: "string|number",
        maxWidth: "string|number",
        maxHeight: "string|number",
        bodyMaxHeight: "string|number",
        contentMaxHeight: "Alias di bodyMaxHeight",
        closeOnSelect: "boolean",
        closeOnOutside: "boolean",
        closeOnEsc: "boolean",
        anchorEl: "HTMLElement|VirtualAnchor",
        triggerEl: "Alias di anchorEl",
        target: "Alias di anchorEl",
        slots: "{ before?, icon?, eyebrow?, title?, subtitle?, header?, content?, body?, item?, itemTitle?, itemSubtitle?, itemBadge?, itemShortcut?, groupLabel?, empty?, status?, footer?, after?, default? }",
        class: "string",
        panelClass: "string",
        overlayClass: "string",
        style: "object",
        panelStyle: "object",
        onOpen: "function",
        onClose: "function",
        onItemClick: "(item, ctx, event) => void",
        onTrigger: "(event, ctx) => boolean|void"
      },
      slots: {
        before: "Area sopra header/body ({ close })",
        icon: "Context icon",
        eyebrow: "Context eyebrow ({ close })",
        title: "Context title ({ close })",
        subtitle: "Context subtitle ({ close })",
        header: "Header custom ({ close })",
        content: "Context menu content ({ close })",
        body: "Alias di content ({ close })",
        item: "Custom item body ({ item, close })",
        itemTitle: "Item title ({ item, close })",
        itemSubtitle: "Item subtitle ({ item, close })",
        itemBadge: "Item badge ({ item, close })",
        itemShortcut: "Item shortcut ({ item, close })",
        groupLabel: "Label gruppi ({ item, close })",
        empty: "Empty state ({ close })",
        status: "Status row ({ close })",
        footer: "Footer actions ({ close })",
        after: "Area sotto body/footer ({ close })",
        default: "Fallback content ({ close })"
      },
      events: {
        onOpen: "void",
        onClose: "void",
        onItemClick: "item click",
        onTrigger: "trigger contextmenu / tastiera"
      },
      returns: "Object { open(), openAt(), openFromEvent(), show(), hide(), close(), toggle(), update(), bind(), isOpen() }",
      description: "Specializzazione di Menu per click destro e tasto context menu, con items, slot ricchi, runtime overrides e posizionamento su coordinate."
    };
```

#### Btn

- Alias: `UI.Btn`, `_.Btn`
- Signature: `UI.Btn(...children) | UI.Btn(props, ...children)`
- Descrizione: Bottone con varianti colore, outline, icona/label e stato loading. Gestisce disabilitazione, aria e animazione burst su pointerdown.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/btn.cms.js`

```js
UI.meta.Btn = {
      signature: "UI.Btn(...children) | UI.Btn(props, ...children)",
      props: {
        label: "String|Node|Function|Array",
        icon: "String|Node|Function|Array",
        iconRight: "String|Node|Function|Array",
        iconAlign: `before|after|left|right`,
        color: `primary|secondary|warning|danger|success|info|light|dark`,
        outline: "boolean",
        loading: "boolean",
        disabled: "boolean",
        slots: "{ icon?, label?, default? }",
        class: "string",
        style: "object"
      },
      slots: {
        icon: "Icon slot",
        iconRight: "Right icon slot",
        label: "Label slot",
        default: "Button content"
      },
      events: ["click", "pointerdown", "focus", "blur"],
      returns: "HTMLButtonElement"
    };
```

#### Notify

- Alias: `UI.Notify`, `_.Notify`
- Signature: `UI.Notify(message, title?, opts?) | UI.Notify(opts, ...children)`
- Descrizione: Notify standardizzato per toast e micro-feedback applicativi. Supporta payload strutturato, slots, update/remove/clear e helper promise.
- Runtime source: `pages/_cmswift-fe/js/ui.js`
- Tutorial / sample source: `pages/tutorial/notify.cms.js`

```js
UI.meta.Notify = {
  signature: "UI.Notify(message, title?, opts?) | UI.Notify(opts, ...children)",
  description: "Notify standardizzato con payload strutturato, shortcut semantiche, update/remove/clear e supporto promise.",
  props: {
    id: "string",
    type: "success|error|info|warning|primary|secondary|light|dark",
    state: "Alias di type",
    color: "Alias di type",
    title: "String|Node|Function|Array|false",
    message: "String|Node|Function|Array",
    description: "String|Node|Function|Array",
    meta: "String|Node|Function|Array",
    body: "Node|Function|Array",
    icon: "String|Node|Function|Array|false",
    actions: "Node|Function|Array",
    dismiss: "Node|Function|Array",
    timeout: "number",
    duration: "Alias di timeout",
    closable: "boolean",
    dismissLabel: "string",
    position: "top-left|top-center|top-right|bottom-left|bottom-center|bottom-right",
    variant: "soft|solid|outline",
    slots: "{ icon?, title?, message?, description?, meta?, actions?, dismiss?, default? }"
  },
  methods: {
    show: "Alias di UI.Notify(...)",
    success: "UI.Notify.success(message|opts, title?)",
    error: "UI.Notify.error(message|opts, title?)",
    warning: "UI.Notify.warning(message|opts, title?)",
    info: "UI.Notify.info(message|opts, title?)",
    update: "UI.Notify.update(id, patch)",
    remove: "UI.Notify.remove(id)",
    clear: "UI.Notify.clear()",
    promise: "UI.Notify.promise(promise|fn, { loading?, success?, error? })"
  },
  slots: {
    icon: "Leading visual/icon content",
    title: "Toast title content",
    message: "Primary message content",
    description: "Secondary/supporting text",
    meta: "Meta info or badges",
    actions: "Actions area content",
    dismiss: "Custom dismiss control",
    default: "Extra body content under the message"
  },
  returns: "string|null (toast id)"
};
```

## Note Finali Per Un AI

- Quando una prop o uno slot sembra duplicato, dai priorita agli alias dichiarati dal componente (`start/left`, `end/right`, `body/content`, `footer/actions`).
- Per i componenti overlay (`Tooltip`, `Dialog`, `Menu`, `Popover`, `ContextMenu`) considera sia la configurazione declarativa sia l'API imperativa restituita.
- Per i componenti form usa sempre `model` come prima scelta se devi generare UI reattiva; usa `value` per stato statico o uncontrolled.
- Per layout complessi combina `Layout`, `Header`, `Drawer`, `Page`, `Footer`, `Toolbar`, `Grid`, `GridCol` prima di introdurre markup custom.
- Per esempi completi apri i file in `pages/tutorial/`: il README serve come reference veloce, i tutorial mostrano combinazioni realistiche dei componenti.

const roleOptions = [
  { label: "Creator", value: "creator" },
  { label: "Admin", value: "admin" },
  { label: "Editor", value: "editor" }
];

const planOptions = [
  { label: "Starter", value: "starter" },
  { label: "Pro", value: "pro" },
  { label: "Scale", value: "scale" }
];

const useCaseOptions = [
  { label: "Landing page", value: "landing" },
  { label: "Dashboard admin", value: "dashboard" },
  { label: "Portale docs", value: "docs" }
];

const favoriteOptions = [
  { label: "Form", value: "form" },
  { label: "Card", value: "card" },
  { label: "Chip", value: "chip" },
  { label: "Badge", value: "badge" }
];

const chipRow = (...children) => _h.div({
  style: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "16px"
  }
}, ...children);

const formError = (form) => _h.div({ class: "cms-error" }, () => form.submitError.value || "");
const fieldError = (field) => _h.div({ class: "cms-error" }, () => field.error() || "");

const formActions = (label, onReset, form) => _ui.Toolbar(
  { justify: "space-between" },
  _ui.Btn({ onClick: onReset, type: "button" }, "Reset"),
  _ui.Btn(
    {
      color: "primary",
      type: "submit",
      loading: form.submitting.value
    },
    label
  )
);

const bindInput = (field, props = {}) => _ui.Input({
  model: field.model,
  error: () => field.error(),
  hint: field.hint,
  onInput: field.onInput,
  onBlur: field.onBlur,
  clearable: true,
  ...props
});

const registerForm = CMSwift.useForm({
  model: _rod({
    name: "",
    email: "",
    password: "",
    role: "",
    newsletter: true,
    terms: false
  }),
  validateOn: "blur",
  rules: {
    name: [(v) => !!v || "Inserisci il nome del creator"],
    email: [(v) => (!!v && String(v).includes("@")) || "Email non valida"],
    password: [(v) => (!!v && String(v).length >= 8) || "Minimo 8 caratteri"],
    role: [(v) => !!v || "Seleziona un ruolo"],
    terms: [(v) => !!v || "Devi accettare i termini"]
  }
});

const fRegisterName = registerForm.field("name", { hint: "Nome visibile nella workspace CMSwift" });
const fRegisterEmail = registerForm.field("email", { hint: "Usa una mail reale per gli inviti" });
const fRegisterPassword = registerForm.field("password", { hint: "Almeno 8 caratteri" });
const fRegisterRole = registerForm.field("role");
const fRegisterNewsletter = registerForm.field("newsletter");
const fRegisterTerms = registerForm.field("terms");
fRegisterNewsletter.value = true;

const resetRegisterForm = () => {
  registerForm.reset();
  fRegisterName.value = "";
  fRegisterEmail.value = "";
  fRegisterPassword.value = "";
  fRegisterRole.value = "";
  fRegisterNewsletter.value = true;
  fRegisterTerms.value = false;
};

const registerSample = [
  "const registerForm = CMSwift.useForm({",
  "  model: _rod({ name: '', email: '', password: '', role: '', newsletter: true, terms: false }),",
  "  validateOn: 'blur',",
  "  rules: {",
  "    name: [(v) => !!v || 'Inserisci il nome del creator'],",
  "    email: [(v) => (!!v && String(v).includes('@')) || 'Email non valida'],",
  "    password: [(v) => (!!v && String(v).length >= 8) || 'Minimo 8 caratteri'],",
  "    role: [(v) => !!v || 'Seleziona un ruolo'],",
  "    terms: [(v) => !!v || 'Devi accettare i termini']",
  "  }",
  "});",
  "_ui.Form({ form: registerForm, onSubmit: async (model) => console.log('REGISTER', model) }, () => [",
  "  _ui.Card(",
  "    _ui.CardHeader(...),",
  "    _ui.CardBody(",
  "      _ui.Input({ label: 'Nome creator', model: fRegisterName.model }),",
  "      _ui.Input({ label: 'Email', model: fRegisterEmail.model }),",
  "      _ui.Input({ type: 'password', label: 'Password', model: fRegisterPassword.model }),",
  "      _ui.Select({ label: 'Ruolo', model: fRegisterRole.model, options: roleOptions }),",
  "      _ui.Checkbox({ model: fRegisterNewsletter.model }, 'Release notes CMSwift'),",
  "      _ui.Checkbox({ model: fRegisterTerms.model }, 'Accetto termini e privacy')",
  "    ),",
  "    _ui.CardFooter(formActions('Crea account', resetRegisterForm, registerForm))",
  "  )",
  "]);"
];

const onboardingForm = CMSwift.useForm({
  model: _rod({
    studio: "",
    stack: "",
    team: "solo",
    plan: "pro",
    automations: true,
    designReview: true,
    analytics: false
  }),
  validateOn: "blur",
  rules: {
    studio: [(v) => !!v || "Inserisci il nome dello studio"],
    stack: [(v) => !!v || "Descrivi rapidamente lo stack"],
    team: [(v) => !!v || "Seleziona il setup del team"],
    plan: [(v) => !!v || "Seleziona un piano"]
  }
});

const fStudio = onboardingForm.field("studio", { hint: "Es. CMSwift Atelier" });
const fStack = onboardingForm.field("stack", { hint: "Es. CMSwift UI, API e automazioni" });
const fTeam = onboardingForm.field("team");
const fPlan = onboardingForm.field("plan");
const fAutomations = onboardingForm.field("automations");
const fDesignReview = onboardingForm.field("designReview");
const fAnalytics = onboardingForm.field("analytics");
fTeam.value = "solo";
fPlan.value = "pro";
fAutomations.value = true;
fDesignReview.value = true;

const resetOnboardingForm = () => {
  onboardingForm.reset();
  fStudio.value = "";
  fStack.value = "";
  fTeam.value = "solo";
  fPlan.value = "pro";
  fAutomations.value = true;
  fDesignReview.value = true;
  fAnalytics.value = false;
};

const onboardingSample = [
  "const onboardingForm = CMSwift.useForm({",
  "  model: _rod({ studio: '', stack: '', team: 'solo', plan: 'pro', automations: true, designReview: true, analytics: false }),",
  "  validateOn: 'blur',",
  "  rules: {",
  "    studio: [(v) => !!v || 'Inserisci il nome dello studio'],",
  "    stack: [(v) => !!v || 'Descrivi rapidamente lo stack'],",
  "    team: [(v) => !!v || 'Seleziona il setup del team'],",
  "    plan: [(v) => !!v || 'Seleziona un piano']",
  "  }",
  "});",
  "_ui.Form({ form: onboardingForm, onSubmit: async (model) => console.log('ONBOARDING', model) }, () => [",
  "  _ui.Card(",
  "    _ui.CardHeader(...Avatar, Badge, Chip...),",
  "    _ui.CardBody(",
  "      _ui.Input({ label: 'Studio name', model: fStudio.model }),",
  "      _ui.Input({ label: 'Stack creativo', model: fStack.model }),",
  "      _ui.Radio({ value: 'solo', model: fTeam.model }, 'Solo maker'),",
  "      _ui.Radio({ value: 'squad', model: fTeam.model }, 'Small squad'),",
  "      _ui.Radio({ value: 'agency', model: fTeam.model }, 'Agency mode'),",
  "      _ui.Select({ label: 'Piano', model: fPlan.model, options: planOptions }),",
  "      _ui.Toggle({ model: fAutomations.model }, 'Attiva automazioni'),",
  "      _ui.Checkbox({ model: fDesignReview.model }, 'Design review'),",
  "      _ui.Checkbox({ model: fAnalytics.model }, 'Product analytics')",
  "    ),",
  "    _ui.CardFooter(formActions('Lancia workspace', resetOnboardingForm, onboardingForm))",
  "  )",
  "]);"
];

const feedbackForm = CMSwift.useForm({
  model: _rod({
    useCase: "",
    favorite: "",
    score: 4,
    recommend: true,
    followup: true,
    notes: ""
  }),
  validateOn: "blur",
  rules: {
    useCase: [(v) => !!v || "Seleziona un contesto"],
    favorite: [(v) => !!v || "Seleziona il componente preferito"],
    score: [(v) => Number(v || 0) > 0 || "Aggiungi una valutazione"]
  }
});

const fUseCase = feedbackForm.field("useCase");
const fFavorite = feedbackForm.field("favorite");
const fScore = feedbackForm.field("score");
const fRecommend = feedbackForm.field("recommend");
const fFollowup = feedbackForm.field("followup");
const fNotes = feedbackForm.field("notes", { hint: "Una nota breve ma concreta" });
fScore.value = 4;
fRecommend.value = true;
fFollowup.value = true;

const resetFeedbackForm = () => {
  feedbackForm.reset();
  fUseCase.value = "";
  fFavorite.value = "";
  fScore.value = 4;
  fRecommend.value = true;
  fFollowup.value = true;
  fNotes.value = "";
};

const feedbackSample = [
  "const feedbackForm = CMSwift.useForm({",
  "  model: _rod({ useCase: '', favorite: '', score: 4, recommend: true, followup: true, notes: '' }),",
  "  validateOn: 'blur',",
  "  rules: {",
  "    useCase: [(v) => !!v || 'Seleziona un contesto'],",
  "    favorite: [(v) => !!v || 'Seleziona il componente preferito'],",
  "    score: [(v) => Number(v || 0) > 0 || 'Aggiungi una valutazione']",
  "  }",
  "});",
  "_ui.Form({ form: feedbackForm, onSubmit: async (model) => console.log('FEEDBACK', model) }, () => [",
  "  _ui.Card(",
  "    _ui.CardHeader(...Badge e Chip...),",
  "    _ui.CardBody(",
  "      _ui.Select({ label: 'Use case', model: fUseCase.model, options: useCaseOptions }),",
  "      _ui.Select({ label: 'Componente preferito', model: fFavorite.model, options: favoriteOptions }),",
  "      _ui.Rating({ model: fScore.model, max: 5 }),",
  "      _ui.Toggle({ model: fRecommend.model }, 'Lo consiglierei ad altri team'),",
  "      _ui.Checkbox({ model: fFollowup.model }, 'Voglio essere ricontattato'),",
  "      _ui.Input({ label: 'Nota finale', model: fNotes.model })",
  "    ),",
  "    _ui.CardFooter(formActions('Invia feedback', resetFeedbackForm, feedbackForm))",
  "  )",
  "]);"
];

const listSample = {
  registration: {
    code: _ui.Form(
      { form: registerForm, onSubmit: async (model) => console.log("REGISTER", model) },
      () => [
        _ui.Card(
          _ui.CardHeader(
            _ui.Toolbar(
              { justify: "space-between" },
              _h.div(
                _h.h3("Registrazione Creator"),
                _h.p("Un form reale con validazione, stato submit e micro-componenti CMSwift."),
                _ui.Badge({ label: "CMSwift", notification: 3, topRight: "rocket_launch" })
              ),
            )
          ),
          _ui.CardBody(
            chipRow(
              _ui.Chip({ icon: "bolt" }, "Launch fast"),
              _ui.Chip({ icon: "palette" }, "Design system"),
              _ui.Chip({ icon: "code" }, "Reactive UI")
            ),
            bindInput(fRegisterName, { label: "Nome creator", icon: "person" }),
            bindInput(fRegisterEmail, { label: "Email", type: "email", icon: "mail" }),
            bindInput(fRegisterPassword, { label: "Password", type: "password", icon: "lock" }),
            _ui.Select({
              label: "Ruolo iniziale",
              model: fRegisterRole.model,
              error: fRegisterRole.error,
              options: roleOptions,
              clearable: true
            }),
            _ui.Checkbox(
              { model: fRegisterNewsletter.model, icon: "campaign" },
              "Ricevi release notes, pattern e update di prodotto"
            ),
            _ui.Checkbox(
              { model: fRegisterTerms.model, icon: "verified_user", color: "primary" },
              "Accetto termini, privacy e workspace policy"
            ),
            fieldError(fRegisterTerms),
            formError(registerForm)
          ),
          _ui.CardFooter(formActions("Crea account", resetRegisterForm, registerForm))
        )
      ]
    ),
    sample: registerSample
  },
  onboarding: {
    code: _ui.Form(
      { form: onboardingForm, onSubmit: async (model) => console.log("ONBOARDING", model) },
      () => [
        _ui.Card(
          _ui.CardHeader(
            _ui.Toolbar(
              { justify: "space-between" },
              _h.div(
                _ui.Toolbar(
                  { justify: "flex-start" },
                  _ui.Avatar({ label: "CM", elevated: true }),
                  _h.div(
                    _h.h3("CMSwift Launch Pad"),
                    _h.p("Un onboarding creativo per configurare una workspace pronta a scalare."),
                    _ui.Badge({ label: "Beta", topLeft: "auto_awesome", notification: 1 })
                  )
                )
              )
            )
          ),
          _ui.CardBody(
            chipRow(
              _ui.Chip({ icon: "dataset_linked" }, "API-first"),
              _ui.Chip({ icon: "dashboard_customize" }, "Composable"),
              _ui.Chip({ icon: "rocket_launch" }, "Fast setup")
            ),
            bindInput(fStudio, { label: "Studio name", icon: "apartment" }),
            bindInput(fStack, { label: "Stack creativo", icon: "memory" }),
            _h.div(
              { class: "cms-m-b-sm" },
              _h.b("Setup team"),
              _h.div(
                { style: { display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" } },
                _ui.Radio({ value: "solo", model: fTeam.model, color: "primary" }, "Solo maker"),
                _ui.Radio({ value: "squad", model: fTeam.model, color: "info" }, "Small squad"),
                _ui.Radio({ value: "agency", model: fTeam.model, color: "secondary" }, "Agency mode")
              ),
              fieldError(fTeam)
            ),
            _ui.Select({
              label: "Piano workspace",
              model: fPlan.model,
              error: fPlan.error,
              options: planOptions
            }),
            _ui.Toggle({ model: fAutomations.model }, "Attiva automazioni di contenuto"),
            _ui.Checkbox({ model: fDesignReview.model, icon: "draw" }, "Abilita design review interna"),
            _ui.Checkbox({ model: fAnalytics.model, icon: "analytics" }, "Abilita analytics di prodotto"),
            formError(onboardingForm)
          ),
          _ui.CardFooter(formActions("Lancia workspace", resetOnboardingForm, onboardingForm))
        )
      ]
    ),
    sample: onboardingSample
  },
  feedback: {
    code: _ui.Form(
      { form: feedbackForm, onSubmit: async (model) => console.log("FEEDBACK", model) },
      () => [
        _ui.Card(
          _ui.CardHeader(
            _ui.Toolbar(
              { justify: "space-between" },
              _h.div(
                _h.h3("Pulse Check"),
                _h.p("Feedback rapido ma ricco: rating, preferenze e follow-up in un unico form."),
                _ui.Badge({ label: "Live", topRight: "favorite", notification: 5 })
              )
            )
          ),
          _ui.CardBody(
            chipRow(
              _ui.Chip({ icon: "forum" }, "Community"),
              _ui.Chip({ icon: "tips_and_updates" }, "Ideas"),
              _ui.Chip({ icon: "favorite" }, "UX signal")
            ),
            _ui.Select({
              label: "Use case principale",
              model: fUseCase.model,
              error: fUseCase.error,
              options: useCaseOptions,
              clearable: true
            }),
            _ui.Select({
              label: "Componente preferito",
              model: fFavorite.model,
              error: fFavorite.error,
              options: favoriteOptions,
              clearable: true
            }),
            _h.div(
              { class: "cms-m-b-sm" },
              _h.b("Valutazione esperienza"),
              _h.div({ style: { marginTop: "8px" } }, _ui.Rating({ model: fScore.model, max: 5 })),
              fieldError(fScore)
            ),
            _ui.Toggle({ model: fRecommend.model }, "Lo consiglierei ad altri team"),
            _ui.Checkbox({ model: fFollowup.model, icon: "mail" }, "Voglio essere ricontattato"),
            bindInput(fNotes, { label: "Nota finale", icon: "edit" }),
            formError(feedbackForm)
          ),
          _ui.CardFooter(formActions("Invia feedback", resetFeedbackForm, feedbackForm))
        )
      ]
    ),
    sample: feedbackSample
  }
};

const form = _h.div({ class: "cms-panel cms-page" },
  _h.h1("Form"),
  _h.p("Form wrapper integrato con `useForm`: gestisce submit async, validazione e stato `submitting`. I children possono essere funzioni che ricevono l'istanza del form."),
  _h.h2("Props principali"),
  _ui.List(
    _ui.Item("form: istanza restituita da `CMSwift.useForm()`"),
    _ui.Item("onSubmit: handler async con `(model, form)`"),
    _ui.Item("class, style e children function per costruire layout avanzati")
  ),
  _h.h2("Documentazione API"),
  CMSwift.ui.DocTable("Form"),
  _h.h2("Esempi completi"),
  _ui.Card({ header: "Demo" },
    boxCode("Registrazione creator", listSample.registration),
    boxCode("Onboarding CMSwift", listSample.onboarding),
    boxCode("Feedback form", listSample.feedback)
  )
);

export { form };

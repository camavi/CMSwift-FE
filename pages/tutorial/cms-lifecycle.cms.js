const infoLine = (label, getter) => _.div({ class: "cms-m-b-xs" }, _.b(`${label}: `), _.span(getter));

const actionRow = (...children) => _.div({
  style: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap"
  }
}, ...children);

const stack = (...children) => _.div({
  style: {
    display: "grid",
    gap: "12px"
  }
}, ...children);

const cmsLifecycle = _.component((props, ctx) => {
  const lifecycleStatus = _.rod("idle");
  const lifecycleMounts = _.rod(0);
  const lifecycleDisposals = _.rod(0);
  const autoCleanupEnabled = _.rod(false);

  const mountHost = _.div({
    style: {
      minHeight: "120px",
      border: "1px dashed var(--cms-border)",
      padding: "12px",
      borderRadius: "12px"
    }
  });

  const autoCleanupHost = _.div({
    style: {
      minHeight: "120px",
      border: "1px dashed var(--cms-border)",
      padding: "12px",
      borderRadius: "12px"
    }
  });

  const makeTickerCard = _.component((cardProps, localCtx) => {
    const ticks = _.rod(0);
    const intervalId = setInterval(() => {
      ticks.value += 1;
    }, 1000);

    localCtx.onDispose(() => {
      clearInterval(intervalId);
      lifecycleDisposals.value += 1;
      lifecycleStatus.value = `disposed ${cardProps.label}`;
    });

    return _.Card({
      title: cardProps.label,
      subtitle: "istanza montata via _.mount",
      aside: _.Chip({ color: cardProps.color || "success", outline: true }, () => `tick ${ticks.value}`)
    },
      _.p("Questo componente registra cleanup con `ctx.onDispose(...)`."),
      _.div({ class: "cms-muted" }, () => `ticks: ${ticks.value}`)
    );
  });

  let stopMounted = null;
  let stopAutoMounted = null;

  const mountPrimary = (label, color) => {
    stopMounted?.();
    stopMounted = _.mount(mountHost, () => makeTickerCard({ label, color }), { clear: true });
    lifecycleMounts.value += 1;
    lifecycleStatus.value = `mounted ${label}`;
  };

  const unmountPrimary = () => {
    stopMounted?.();
    stopMounted = null;
    lifecycleStatus.value = "primary unmounted";
  };

  const enableObserver = () => {
    _.enableAutoCleanup();
    autoCleanupEnabled.value = true;
    lifecycleStatus.value = "auto cleanup enabled";
  };

  const mountAutoCleanupProbe = () => {
    stopAutoMounted?.();
    stopAutoMounted = _.mount(autoCleanupHost, () => makeTickerCard({ label: "Auto cleanup probe", color: "warning" }), { clear: true });
    lifecycleMounts.value += 1;
    lifecycleStatus.value = "mounted auto cleanup probe";
  };

  const removeAutoCleanupProbe = () => {
    while (autoCleanupHost.firstChild) {
      autoCleanupHost.removeChild(autoCleanupHost.firstChild);
    }
    lifecycleStatus.value = "manual DOM removal requested";
  };

  ctx.onDispose(() => {
    stopMounted?.();
    stopAutoMounted?.();
  });

  const listSample = {
    mount: {
      code: [
        _.Card({ title: "Mount + component", subtitle: "Mount imperativo con cleanup locale" },
          stack(
            actionRow(
              _.Btn({ size: "sm", outline: true, onClick: () => mountPrimary("Primary widget", "success") }, "mount primary"),
              _.Btn({ size: "sm", onClick: () => mountPrimary("Replacement widget", "info") }, "replace"),
              _.Btn({ size: "sm", color: "warning", onClick: unmountPrimary }, "unmount")
            ),
            mountHost
          )
        )
      ],
      sample: [
        'const Widget = _.component((props, ctx) => {',
        '  const ticks = _.rod(0);',
        '  const intervalId = setInterval(() => { ticks.value += 1; }, 1000);',
        '  ctx.onDispose(() => clearInterval(intervalId));',
        '  return _.Card({ title: props.label }, _.div(() => `ticks: ${ticks.value}`));',
        '});',
        'let stopMounted = _.mount(host, () => Widget({ label: "Primary widget" }), { clear: true });',
        'stopMounted();'
      ]
    },
    cleanup: {
      code: [
        _.Card({ title: "Auto cleanup observer", subtitle: "Rimozione manuale dal DOM con cleanup osservato" },
          stack(
            actionRow(
              _.Btn({ size: "sm", outline: true, onClick: enableObserver }, "enable observer"),
              _.Btn({ size: "sm", onClick: mountAutoCleanupProbe }, "mount probe"),
              _.Btn({ size: "sm", color: "danger", onClick: removeAutoCleanupProbe }, "remove DOM node")
            ),
            autoCleanupHost
          )
        )
      ],
      sample: [
        '_.enableAutoCleanup();',
        '_.mount(host, () => Widget({ label: "Auto cleanup probe" }), { clear: true });',
        'while (host.firstChild) host.removeChild(host.firstChild);'
      ]
    }
  };

  return _.div({ class: "cms-panel cms-page" },
    _.h1("CMS Lifecycle"),
    _.p("Tutorial minimo del blocco lifecycle. Qui usiamo direttamente `_.mount`, `_.component`, `ctx.onDispose(...)` e `_.enableAutoCleanup()` per verificare mount, unmount e cleanup del DOM."),
    _.h2("API disponibili"),
    _.List(
      _.Item("`_.mount(target, content, opts)` -> mount imperativo con `unmount()` di ritorno"),
      _.Item("`_.component(renderFn)` -> component instance con `ctx.onDispose(...)`"),
      _.Item("`_.enableAutoCleanup()` -> observer che pulisce disposer quando un nodo viene rimosso dal DOM")
    ),
    _.h2("Stato live"),
    _.Card({ title: "Lifecycle status", subtitle: "Contatori globali della pagina demo" },
      infoLine("mounts", () => String(lifecycleMounts.value)),
      infoLine("disposals", () => String(lifecycleDisposals.value)),
      infoLine("observer enabled", () => autoCleanupEnabled.value ? "true" : "false"),
      infoLine("status", () => lifecycleStatus.value)
    ),
    _.h2("Esempi"),
    boxCode("Mount + component", listSample.mount, 24),
    boxCode("Auto cleanup observer", listSample.cleanup, 24)
  );
});

export { cmsLifecycle };

CMSwift.ready(() => {
  const root = document.getElementById("ui-playground");
  if (!root || typeof _.Card !== "function") return;
  const t = (key, replacements = {}) =>
    window.CMSwiftDemoI18n?.t(`playground.ui.${key}`, replacements) ?? key;

  const nameModel = _.rod("Carlos");
  const roleModel = _.rod("developer");
  const [getUpdates, setUpdates] = _.signal(true);

  _.mount(
    root,
    _.div(
      _.Card(
        _.cardBody(
          _.Input({
            label: t("nameLabel"),
            model: nameModel,
            clearable: true,
          }),
          _.Select({
            label: t("roleLabel"),
            model: roleModel,
            options: ["developer", "designer", "operator"],
          }),
          _.Checkbox({ model: [getUpdates, setUpdates] }, t("updatesLabel")),
          _.div(
            {
              style: {
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginTop: "12px",
              },
            },
            _.Btn(
              {
                color: "primary",
                onClick: () => _.Notify?.success?.(t("actionToast")),
              },
              t("actionButton"),
            ),
            _.Chip({ color: "info", outline: true }, () => t("roleChip", { value: roleModel.value })),
            _.Badge({ color: "success" }, () =>
              getUpdates() ? t("updatesOn") : t("updatesOff"),
            ),
          ),
        ),
      ),
      _.Card(
        _.cardBody(
          _.h3(t("liveState")),
          _.p(() => t("liveName", { value: nameModel.value })),
          _.p(() => t("liveRole", { value: roleModel.value })),
          _.p(() => (getUpdates() ? t("liveUpdatesOn") : t("liveUpdatesOff"))),
        ),
      ),
    ),
  );
});

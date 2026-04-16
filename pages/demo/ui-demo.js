CMSwift.ready(() => {
  const root = document.getElementById("ui-playground");
  if (!root || typeof _.Card !== "function") return;
  const t = (key, replacements = {}) =>
    window.CMSwiftDemoI18n?.t(`playground.ui.${key}`, replacements) ?? key;

  const nameModel = _.rod("Carlos");
  const roleModel = _.rod("developer");
  const [getUpdates, setUpdates] = _.signal(true);
  const Themes = _.rod(_.getTheme() === "dark");
  Themes.action((v) => {
    _.setTheme(v ? "dark" : "light");
  });
  _.mount(
    root,
    _.div(
      _.Card(
        _.cardBody(
          _.Row(
            _.Spacer(),
            _.div({ class: "cms-text-right" },
              _.Toggle({ color: "success", model: Themes, uncheckedIcon: "light_mode", checkedIcon: "brightness_6", }, () => Themes.value ? "Theme dark" : "Theme light"),
            )
          ),
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

            _.Btn(
              {
                color: "secondary",
                outline: true,
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

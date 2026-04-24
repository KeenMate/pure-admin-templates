defmodule __APP_MODULE__Web.__PAGE_MODULE__Live do
  use __APP_MODULE__Web, :live_view

  def mount(_params, _session, socket) do
    {:ok, assign(socket, page_title: "__PAGE_LABEL__")}
  end

  def render(assigns) do
    ~H"""
    <.paragraph>Welcome to __APP_NAME__. Edit <code>lib/__APP_ID___web/live/__PAGE_ENTITY___live.ex</code> to customize this page.</.paragraph>

    <.grid>
      <.column size="25">
        <.card>
          <.stat variant="hero" number="1,234" label_text={gettext("Users")} change_text="▲ 12%" change_direction="positive" />
        </.card>
      </.column>
      <.column size="25">
        <.card>
          <.stat variant="hero" number="$5,678" label_text={gettext("Revenue")} change_text="▲ 8%" change_direction="positive" />
        </.card>
      </.column>
      <.column size="25">
        <.card>
          <.stat variant="hero" number="98%" label_text={gettext("Uptime")} change_text="▲ 0.2%" change_direction="positive" />
        </.card>
      </.column>
      <.column size="25">
        <.card>
          <.stat variant="hero" number="42" label_text={gettext("Tasks")} change_text="▼ 3" change_direction="negative" />
        </.card>
      </.column>
    </.grid>

    <.card title_text={gettext("Quick Actions")}>
      <.button_group is_vertical>
        <.button variant="primary" is_block>{gettext("New Order")}</.button>
        <.button variant="secondary" is_block>{gettext("Add Customer")}</.button>
        <.button variant="secondary" is_block>{gettext("Generate Report")}</.button>
        <.button variant="secondary" is_block>{gettext("Export Data")}</.button>
      </.button_group>
    </.card>

    <.card title_text={gettext("Internationalization (i18n)")}>
      <.paragraph>
        This template wires Phoenix's built-in
        <.pa_link href="https://hexdocs.pm/gettext" target="_blank">Gettext</.pa_link>
        to <.code>keen_pure_admin</.code>'s translation hook. App strings use
        <.code>gettext(...)</.code>; library strings (button labels, dialog text,
        settings panel) route through a callback in
        <.code>lib/__APP_ID_SNAKE___web/translations.ex</.code> that looks them up
        under the <.code>pure_admin</.code> Gettext domain. To add a locale:
      </.paragraph>
      <.ordered_list>
        <li>
          Wrap any new user-facing strings: <.code>{"<%= gettext(\"Save\") %>"}</.code>
          in HEEx, or <.code>gettext("Save")</.code> in <.code>.ex</.code> files.
        </li>
        <li>
          Extract translatable strings (both your <.code>gettext()</.code> calls and
          the library's <.code>pureAdmin.*</.code> keys) into POT templates:
          <.code>mix gettext.extract</.code>.
        </li>
        <li>
          Merge into a new locale (creates
          <.code>priv/gettext/cs/LC_MESSAGES/default.po</.code> for app strings and
          <.code>priv/gettext/cs/LC_MESSAGES/pure_admin.po</.code> for library strings):
          <.code>mix gettext.merge priv/gettext --locale cs</.code>.
        </li>
        <li>
          Translate the <.code>.po</.code> files. The <.code>pure_admin.po</.code>
          file is for overriding library defaults — you only need to translate
          keys you care about; missing entries fall back to English.
        </li>
        <li>
          Set the active locale at runtime:
          <.code>{"Gettext.put_locale(__APP_MODULE__Web.Gettext, \"cs\")"}</.code>
          (typically in a plug or LiveView <.code>mount/3</.code>).
        </li>
      </.ordered_list>
      <.paragraph>
        For larger apps, use additional domain-scoped namespaces:
        <.code>{"dgettext(\"forms\", \"Save\")"}</.code> writes to
        <.code>priv/gettext/cs/LC_MESSAGES/forms.po</.code>. The
        <.code>pure_admin</.code> domain is reserved for library overrides;
        the <.code>default</.code> domain is for your app strings.
      </.paragraph>
    </.card>
    """
  end
end

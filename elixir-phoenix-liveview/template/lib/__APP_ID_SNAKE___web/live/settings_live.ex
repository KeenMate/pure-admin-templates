defmodule __APP_MODULE__Web.SettingsLive do
  use __APP_MODULE__Web, :live_view

  alias PureAdmin.Components.Flash, as: PureFlash

  @timezones [
    {"UTC", "UTC"},
    {"US/Eastern", "US/Eastern"},
    {"US/Pacific", "US/Pacific"},
    {"Europe/London", "Europe/London"},
    {"Europe/Prague", "Europe/Prague"},
    {"Asia/Tokyo", "Asia/Tokyo"}
  ]

  @defaults %{
    "app_name" => "__APP_NAME__",
    "app_description" =>
      "A modern admin dashboard built with Pure Admin and Phoenix LiveView.",
    "timezone" => "UTC",
    "email_notifications" => "true",
    "push_notifications" => "false"
  }

  def mount(_params, _session, socket) do
    {:ok,
     socket
     |> assign(page_title: gettext("Settings"))
     |> assign_form(@defaults)}
  end

  def handle_event("save", %{"settings" => params}, socket) do
    # Demo only — in a real app you'd persist to a context/changeset here.
    {:noreply,
     socket
     |> assign_form(Map.merge(@defaults, params))
     |> PureFlash.push_flash("settings", "success", gettext("Settings saved successfully!"),
       title: gettext("Saved"),
       duration: 3000,
       replace: true
     )}
  end

  defp assign_form(socket, params) do
    assign(socket, :form, to_form(params, as: :settings))
  end

  def render(assigns) do
    assigns = assign(assigns, :timezones, @timezones)

    ~H"""
    <.paragraph class="text-color-2">{gettext("Configure your application settings.")}</.paragraph>

    <.flash_container id="settings" />

    <.grid>
      <.column size="100" lg="1-2">
        <.simple_form for={@form} id="settings-form" phx-submit="save">
          <%!-- General --%>
          <.card title_text={gettext("General")}>
            <.form_group field={@form[:app_name]}>
              <.form_label>{gettext("Application Name")}</.form_label>
              <.input field={@form[:app_name]} placeholder={gettext("Enter app name")} />
            </.form_group>

            <.form_group field={@form[:app_description]}>
              <.form_label>{gettext("Description")}</.form_label>
              <.textarea
                field={@form[:app_description]}
                rows="3"
                placeholder={gettext("Describe your application")}
              />
            </.form_group>

            <.form_group field={@form[:timezone]}>
              <.form_label>{gettext("Timezone")}</.form_label>
              <.select field={@form[:timezone]} options={@timezones} />
            </.form_group>
          </.card>

          <%!-- Notifications --%>
          <.card title_text={gettext("Notifications")}>
            <.checkbox field={@form[:email_notifications]} label={gettext("Email Notifications")} />
            <.checkbox field={@form[:push_notifications]} label={gettext("Push Notifications")} />
          </.card>

          <:actions>
            <.button type="submit" variant="primary">
              <:icon>__ICON:save__</:icon>
              {gettext("Save Changes")}
            </.button>
          </:actions>
        </.simple_form>
      </.column>

      <.column size="100" lg="1-2">
        <%!-- App Info --%>
        <.card title_text={gettext("Application Info")}>
          <.fields>
            <.field label={gettext("Version")}>1.0.0</.field>
            <.field label={gettext("Framework")}>{gettext("Phoenix LiveView 1.x")}</.field>
            <.field label={gettext("UI Library")}><.code>keen_pure_admin</.code></.field>
            <.field label={gettext("CSS Framework")}><.code>pure-admin</.code></.field>
          </.fields>
        </.card>

        <%!-- Danger Zone --%>
        <.card title_text={gettext("Danger Zone")}>
          <.alert variant="danger">
            {gettext("These actions are irreversible. Please proceed with caution.")}
          </.alert>
          <.button_group class="mt-4">
            <.button variant="danger" is_outline>
              <:icon>__ICON:broom__</:icon>
              {gettext("Clear Cache")}
            </.button>
            <.button variant="danger">
              <:icon>__ICON:trash__</:icon>
              {gettext("Reset Application")}
            </.button>
          </.button_group>
        </.card>
      </.column>
    </.grid>
    """
  end
end

defmodule __APP_MODULE__Web.UsersLive do
  use __APP_MODULE__Web, :live_view

  alias PureAdmin.Components.Toast, as: PureToast

  # Joined dates spread across the past few years so the relative column
  # ("3 months ago", "yesterday", etc.) shows variance.
  @users [
    %{id: 1, name: "John Doe", email: "john.doe@example.com", role: "Admin", status: "Active", joined: ~D[2024-01-15]},
    %{id: 2, name: "Jane Smith", email: "jane.smith@example.com", role: "Editor", status: "Active", joined: ~D[2024-02-20]},
    %{id: 3, name: "Bob Johnson", email: "bob.j@example.com", role: "Viewer", status: "Inactive", joined: ~D[2024-03-10]},
    %{id: 4, name: "Alice Williams", email: "alice.w@example.com", role: "Admin", status: "Active", joined: ~D[2024-04-05]},
    %{id: 5, name: "Charlie Brown", email: "charlie.b@example.com", role: "Editor", status: "Active", joined: ~D[2024-05-12]},
    %{id: 6, name: "Diana Prince", email: "diana.p@example.com", role: "Viewer", status: "Active", joined: ~D[2024-06-18]},
    %{id: 7, name: "Eve Davis", email: "eve.d@example.com", role: "Editor", status: "Inactive", joined: ~D[2024-07-22]},
    %{id: 8, name: "Frank Miller", email: "frank.m@example.com", role: "Viewer", status: "Active", joined: ~D[2024-08-30]}
  ]

  def mount(_params, _session, socket) do
    {:ok,
     assign(socket,
       page_title: gettext("Users"),
       users: @users,
       last_deleted: nil
     )}
  end

  # Optimistic delete — drop from the list, push a toast with an Undo action.
  # The toast container in app.html.heex catches push_toast events globally.
  def handle_event("delete", %{"id" => id}, socket) do
    with {int_id, ""} <- Integer.parse(id),
         %{} = user <- Enum.find(socket.assigns.users, &(&1.id == int_id)) do
      {:noreply,
       socket
       |> assign(
         users: Enum.reject(socket.assigns.users, &(&1.id == int_id)),
         last_deleted: user
       )
       |> PureToast.push_toast("info", gettext("User deleted"), gettext("%{name} removed.", name: user.name),
         duration: 6000,
         actions: [
           %{label: gettext("Undo"), event: "undo_delete", variant: "primary"},
           %{label: gettext("Dismiss"), dismiss: true, variant: "secondary"}
         ]
       )}
    else
      _ -> {:noreply, socket}
    end
  end

  def handle_event("undo_delete", _params, socket) do
    case socket.assigns.last_deleted do
      %{} = user ->
        users = Enum.sort_by([user | socket.assigns.users], & &1.id)

        {:noreply,
         socket
         |> assign(users: users, last_deleted: nil)
         |> PureToast.push_toast("success", gettext("Restored"), gettext("%{name} is back.", name: user.name),
           duration: 2500
         )}

      _ ->
        {:noreply, socket}
    end
  end

  defp role_variant("Admin"), do: "primary"
  defp role_variant("Editor"), do: "info"
  defp role_variant(_), do: "secondary"

  defp status_variant("Active"), do: "success"
  defp status_variant(_), do: "warning"

  def render(assigns) do
    ~H"""
    <.paragraph class="text-color-2">{gettext("Manage your team members and their permissions.")}</.paragraph>

    <%!-- User Stats --%>
    <.grid>
      <.column size="100" md="1-3">
        <.card>
          <div class="text-center">
            <.heading level={2}>{length(@users)}</.heading>
            <.paragraph class="text-color-2">{gettext("Total Users")}</.paragraph>
          </div>
        </.card>
      </.column>
      <.column size="100" md="1-3">
        <.card>
          <div class="text-center">
            <.heading level={2}>{Enum.count(@users, & &1.status == "Active")}</.heading>
            <.paragraph class="text-color-2">{gettext("Active")}</.paragraph>
          </div>
        </.card>
      </.column>
      <.column size="100" md="1-3">
        <.card>
          <.heading level={2} class="text-center">{Enum.count(@users, & &1.role == "Admin")}</.heading>
          <.paragraph class="text-color-2 text-center">{gettext("Admins")}</.paragraph>
        </.card>
      </.column>
    </.grid>

    <%!-- Users Table --%>
    <.card title_text={gettext("All Users")}>
      <:tools>
        <.button variant="primary" size="sm">
          <:icon>__ICON:user-plus__</:icon>
          {gettext("Add User")}
        </.button>
      </:tools>

      <.table rows={@users} is_compact is_hover is_striped is_responsive>
        <:col :let={user} label={gettext("Actions")} col_class="col-auto">
          <.button_group>
            <.button variant="primary" size="xs" is_icon_only title={gettext("View")}>__ICON:eye__</.button>
            <.button variant="secondary" size="xs" is_icon_only title={gettext("Edit")}>__ICON:pen__</.button>
            <.button
              variant="danger"
              size="xs"
              is_icon_only
              title={gettext("Delete")}
              phx-click="delete"
              phx-value-id={user.id}
            >__ICON:trash__</.button>
          </.button_group>
        </:col>
        <:col :let={user} label={gettext("Name")}><strong>{user.name}</strong></:col>
        <:col :let={user} label={gettext("Email")}>{user.email}</:col>
        <:col :let={user} label={gettext("Role")}>
          <.badge variant={role_variant(user.role)}>{user.role}</.badge>
        </:col>
        <:col :let={user} label={gettext("Status")}>
          <.badge variant={status_variant(user.status)}>{user.status}</.badge>
        </:col>
        <:col :let={user} label={gettext("Joined")}>
          <span class="text-color-2" title={PureAdmin.DateTime.format(user.joined, :long_date)}>
            {PureAdmin.DateTime.relative(user.joined)}
          </span>
        </:col>
      </.table>
    </.card>
    """
  end
end

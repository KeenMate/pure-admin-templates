defmodule __APP_MODULE__Web.__PAGE_MODULE__Live do
  use __APP_MODULE__Web, :live_view

  def mount(_params, _session, socket) do
    items = [
      %{id: 1, name: "Item 1", status: "Active", status_variant: "success"},
      %{id: 2, name: "Item 2", status: "Pending", status_variant: "warning"},
      %{id: 3, name: "Item 3", status: "Inactive", status_variant: "danger"}
    ]

    {:ok, assign(socket, page_title: "__PAGE_LABEL__", items: items)}
  end

  def render(assigns) do
    ~H"""
    <.card has_padding={false} title_text="__PAGE_LABEL__">
      <.table rows={@items}>
        <:col :let={_item} label={gettext("Actions")} class="col-auto">
          <.button_group>
            <.button variant="primary" size="xs" is_icon_only title={gettext("View")}>👁️</.button>
            <.button variant="secondary" size="xs" is_icon_only title={gettext("Edit")}>✏️</.button>
            <.button variant="danger" size="xs" is_icon_only title={gettext("Delete")}>🗑️</.button>
          </.button_group>
        </:col>
        <:col :let={item} label={gettext("ID")}>{item.id}</:col>
        <:col :let={item} label={gettext("Name")}>{item.name}</:col>
        <:col :let={item} label={gettext("Status")}>
          <.badge variant={item.status_variant}>{item.status}</.badge>
        </:col>
      </.table>
    </.card>
    """
  end
end

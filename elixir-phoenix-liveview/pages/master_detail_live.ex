defmodule __APP_MODULE__Web.__PAGE_MODULE__Live do
  use __APP_MODULE__Web, :live_view

  def mount(_params, _session, socket) do
    items = [
      %{id: 1, name: "__PAGE_LABEL__ 1", description: "First item", status: "Active"},
      %{id: 2, name: "__PAGE_LABEL__ 2", description: "Second item", status: "Pending"},
      %{id: 3, name: "__PAGE_LABEL__ 3", description: "Third item", status: "Active"}
    ]

    {:ok,
     socket
     |> assign(page_title: "__PAGE_LABEL__")
     |> assign(items: items)
     |> assign(selected_id: nil)}
  end

  def handle_event("select", %{"id" => id}, socket) do
    {:noreply, assign(socket, selected_id: String.to_integer(id))}
  end

  def handle_event("close", _params, socket) do
    {:noreply, assign(socket, selected_id: nil)}
  end

  def render(assigns) do
    selected = assigns.selected_id && Enum.find(assigns.items, &(&1.id == assigns.selected_id))
    assigns = assign(assigns, :selected, selected)

    ~H"""
    <.grid>
      <.column size={if @selected, do: "50", else: "100"}>
        <.card has_padding={false} title_text="__PAGE_LABEL__">
          <.table rows={@items}>
            <:col :let={item} label="ID">{item.id}</:col>
            <:col :let={item} label="Name">{item.name}</:col>
            <:col :let={item} label="Status">{item.status}</:col>
            <:col :let={item} label="Actions">
              <.button variant="secondary" size="sm" phx-click="select" phx-value-id={item.id}>
                View
              </.button>
            </:col>
          </.table>
        </.card>
      </.column>
      <.column :if={@selected} size="50">
        <.card title_text={@selected.name}>
          <.paragraph>{@selected.description}</.paragraph>
          <p><strong>Status:</strong> {@selected.status}</p>
          <.button variant="secondary" phx-click="close">Close</.button>
        </.card>
      </.column>
    </.grid>
    """
  end
end

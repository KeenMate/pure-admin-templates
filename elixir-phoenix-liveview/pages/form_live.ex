defmodule __APP_MODULE__Web.__PAGE_MODULE__FormLive do
  use __APP_MODULE__Web, :live_view

  def mount(_params, _session, socket) do
    {:ok,
     socket
     |> assign(page_title: "__PAGE_LABEL__")
     |> assign(form: to_form(%{"name" => "", "description" => "", "status" => "active"}))}
  end

  def handle_event("save", params, socket) do
    {:noreply,
     socket
     |> put_flash(:info, "Saved: #{inspect(params)}")
     |> assign(form: to_form(params))}
  end

  def render(assigns) do
    ~H"""
    <.card title_text="__PAGE_LABEL__">
      <.simple_form for={@form} phx-submit="save">
        <.input field={@form[:name]} label="Name" required />
        <.input field={@form[:description]} type="textarea" label="Description" />
        <.input
          field={@form[:status]}
          type="select"
          label="Status"
          options={[{"Active", "active"}, {"Inactive", "inactive"}]}
        />
        <:actions>
          <.button variant="secondary">Cancel</.button>
          <.button variant="primary" type="submit">Save</.button>
        </:actions>
      </.simple_form>
    </.card>
    """
  end
end

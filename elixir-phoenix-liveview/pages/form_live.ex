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
        <.form_group field={@form[:name]}>
          <.form_label is_required>Name</.form_label>
          <.input field={@form[:name]} />
        </.form_group>

        <.form_group field={@form[:description]}>
          <.form_label>Description</.form_label>
          <.textarea field={@form[:description]} rows="3" />
        </.form_group>

        <.form_group field={@form[:status]}>
          <.form_label>Status</.form_label>
          <.select
            field={@form[:status]}
            options={[{"Active", "active"}, {"Inactive", "inactive"}]}
          />
        </.form_group>

        <:actions>
          <.button variant="secondary">Cancel</.button>
          <.button variant="primary" type="submit">Save</.button>
        </:actions>
      </.simple_form>
    </.card>
    """
  end
end

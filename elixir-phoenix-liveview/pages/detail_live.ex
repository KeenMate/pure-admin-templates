defmodule __APP_MODULE__Web.__PAGE_MODULE__DetailLive do
  use __APP_MODULE__Web, :live_view

  def mount(%{"id" => id}, _session, socket) do
    {:ok, assign(socket, page_title: "__PAGE_LABEL__ ##{id}", id: id)}
  end

  def render(assigns) do
    ~H"""
    <.card title_text={"__PAGE_LABEL__ ##{@id}"}>
      <.paragraph>Detail view for __PAGE_ENTITY__ #{@id}.</.paragraph>

      <h4>Properties</h4>
      <ul>
        <li><strong>ID:</strong> {@id}</li>
        <li><strong>Name:</strong> Item {@id}</li>
        <li><strong>Status:</strong> Active</li>
        <li><strong>Created:</strong> 2026-01-01</li>
      </ul>

      <.button_group>
        <.button variant="primary">Edit</.button>
        <.button variant="danger">Delete</.button>
      </.button_group>
    </.card>
    """
  end
end

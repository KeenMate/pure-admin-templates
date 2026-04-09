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
          <.stat variant="hero" number="1,234" label_text="Users" change_text="▲ 12%" change_direction="positive" />
        </.card>
      </.column>
      <.column size="25">
        <.card>
          <.stat variant="hero" number="$5,678" label_text="Revenue" change_text="▲ 8%" change_direction="positive" />
        </.card>
      </.column>
      <.column size="25">
        <.card>
          <.stat variant="hero" number="98%" label_text="Uptime" change_text="▲ 0.2%" change_direction="positive" />
        </.card>
      </.column>
      <.column size="25">
        <.card>
          <.stat variant="hero" number="42" label_text="Tasks" change_text="▼ 3" change_direction="negative" />
        </.card>
      </.column>
    </.grid>

    <.card title_text="Quick Actions">
      <.button_group>
        <.button variant="primary">New Item</.button>
        <.button variant="secondary">Export</.button>
        <.button variant="secondary">Settings</.button>
      </.button_group>
    </.card>
    """
  end
end

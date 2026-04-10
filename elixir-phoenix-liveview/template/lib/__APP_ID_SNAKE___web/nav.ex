defmodule __APP_MODULE__Web.Nav do
  @moduledoc """
  Sidebar navigation helpers — assigns `:current_path` so the sidebar
  can highlight the active item.

  Works as both a Plug (for controllers) and an on_mount hook (for LiveViews).

  Usage:
    - Controllers: `plug __APP_MODULE__Web.Nav` in your `:browser` pipeline
    - LiveViews: `on_mount: [{__APP_MODULE__Web.Nav, :default}]` in `live_session`
  """

  # ── Plug for controllers ─────────────────────────────────────
  def init(opts), do: opts

  def call(conn, _opts) do
    Plug.Conn.assign(conn, :current_path, conn.request_path)
  end

  # ── on_mount hook for LiveViews ──────────────────────────────
  def on_mount(:default, _params, _session, socket) do
    {:cont,
     Phoenix.LiveView.attach_hook(socket, :set_current_path, :handle_params, fn _params, uri, socket ->
       path = URI.parse(uri).path
       {:cont, Phoenix.Component.assign(socket, :current_path, path)}
     end)}
  end
end

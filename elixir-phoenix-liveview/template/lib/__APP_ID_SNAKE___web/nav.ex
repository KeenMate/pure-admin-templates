defmodule __APP_MODULE__Web.Nav do
  @moduledoc """
  Sidebar navigation helpers — assigns `:current_path` so the sidebar
  can highlight the active item.

  Usage:
    - For controllers: add `plug __APP_MODULE__Web.Nav, :assign_current_path`
      in your `:browser` pipeline in `router.ex`.
    - For LiveViews: add `on_mount: [{__APP_MODULE__Web.Nav, :default}]` to
      your `live_session`.
  """
  import Plug.Conn
  import Phoenix.LiveView
  import Phoenix.Component

  # ── Plug for controllers ─────────────────────────────────────
  def init(opts), do: opts

  def call(conn, _opts) do
    assign(conn, :current_path, conn.request_path)
  end

  # ── on_mount hook for LiveViews ──────────────────────────────
  def on_mount(:default, _params, _session, socket) do
    {:cont,
     socket
     |> attach_hook(:set_current_path, :handle_params, fn _params, uri, socket ->
       path = URI.parse(uri).path
       {:cont, assign(socket, :current_path, path)}
     end)}
  end
end

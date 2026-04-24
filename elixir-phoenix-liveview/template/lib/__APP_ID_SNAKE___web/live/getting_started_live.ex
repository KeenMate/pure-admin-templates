defmodule __APP_MODULE__Web.GettingStartedLive do
  use __APP_MODULE__Web, :live_view

  def mount(_params, _session, socket) do
    {:ok, assign(socket, page_title: gettext("Getting Started"))}
  end

  def render(assigns) do
    ~H"""
    <.paragraph class="text-color-2">
      {gettext("Everything you need to know to start building with this template.")}
    </.paragraph>

    <%!-- Project Structure --%>
    <.card title_text={gettext("Project Structure")}>
      <.code_block>lib/__APP_ID_SNAKE__/                          # Domain layer (contexts)
    └── application.ex
    lib/__APP_ID_SNAKE___web/                      # Web layer
    ├── components/
    │   ├── layouts/                          # root.html.heex, app.html.heex
    │   └── layouts.ex                        # use PureAdmin.Components
    ├── controllers/                          # Page controllers + HEEx
    ├── live/
    │   ├── getting_started_live.ex           # This page (/getting-started)
    │   ├── users_live.ex                     # Users page (/users)
    │   └── settings_live.ex                  # Settings page (/settings)
    ├── nav.ex                                # current_path plug for sidebar
    ├── translations.ex                       # Bridges keen_pure_admin → Gettext
    └── router.ex                             # Routes
    config/                                   # config.exs, dev.exs, runtime.exs
    priv/
    ├── gettext/                              # .po translation files
    └── static/themes/                        # Theme CSS files (managed by pureadmin CLI)
    mix.exs                                   # Dependencies + project config</.code_block>
    </.card>

    <%!-- Routing --%>
    <.card title_text={gettext("Routing (Phoenix LiveView)")}>
      <.paragraph class="mb-4">
        {gettext("This template uses Phoenix's")} <.code>Router</.code> {gettext("with LiveView routes. Each LiveView module in")} <.code>lib/__APP_ID_SNAKE___web/live/</.code> {gettext("becomes a route when wired into")} <.code>router.ex</.code>.
      </.paragraph>

      <.heading level={4}>{gettext("Adding a New Page")}</.heading>
      <.basic_list>
        <li>{gettext("Create a LiveView module in")} <.code>lib/__APP_ID_SNAKE___web/live/</.code> ({gettext("e.g.")} <.code>orders_live.ex</.code>)</li>
        <li>{gettext("Add a")} <.code>live "/orders", OrdersLive</.code> {gettext("entry in")} <.code>router.ex</.code></li>
        <li>{gettext("Add a")} <.code>{"<.sidebar_item>"}</.code> {gettext("in")} <.code>app.html.heex</.code> {gettext("pointing to the new route")}</li>
      </.basic_list>

      <.heading level={4} class="mt-4">{gettext("Example: Adding an Orders Page")}</.heading>
      <.code_block language="elixir"># lib/__APP_ID_SNAKE___web/live/orders_live.ex
    defmodule __APP_MODULE__Web.OrdersLive do
      use __APP_MODULE__Web, :live_view

      def mount(_params, _session, socket) do
        &#123;:ok, assign(socket, page_title: "Orders")&#125;
      end

      def render(assigns) do
        ~H&quot;&quot;&quot;
        &lt;.paragraph class="text-color-2"&gt;Manage customer orders.&lt;/.paragraph&gt;
        &lt;.card title_text="Orders"&gt;
          &lt;%!-- Your content here --%&gt;
        &lt;/.card&gt;
        &quot;&quot;&quot;
      end
    end</.code_block>

      <.paragraph class="mt-4">{gettext("Then wire the route in")} <.code>router.ex</.code>:</.paragraph>
      <.code_block language="elixir">scope "/", __APP_MODULE__Web do
      pipe_through :browser
      live "/orders", OrdersLive
    end</.code_block>

      <.paragraph class="mt-4">{gettext("And add the sidebar item in")} <.code>app.html.heex</.code>:</.paragraph>
      <.code_block language="heex">&lt;.sidebar_item
      label="Orders"
      icon="fa-solid fa-cart-shopping"
      href="/orders"
      is_active={"{assigns[:current_path] == \"/orders\"}"}
    /&gt;</.code_block>
    </.card>

    <%!-- Layout --%>
    <.card title_text={gettext("Layout Components")}>
      <.paragraph class="mb-4">
        {gettext("The layout in")} <.code>app.html.heex</.code> {gettext("is built from these components:")}
      </.paragraph>

      <.table is_compact rows={[
        %{component: "<.layout>", purpose: gettext("Top-level page wrapper")},
        %{component: "<.navbar>", purpose: gettext("Top navigation bar with :start, :center, :end_ slots")},
        %{component: "<.navbar_burger>", purpose: gettext("Burger menu trigger that toggles the sidebar")},
        %{component: "<.navbar_brand>", purpose: gettext("App brand (logo + name from config)")},
        %{component: "<.layout_inner>", purpose: gettext("Sidebar + content wrapper")},
        %{component: "<.sidebar> / <.sidebar_item>", purpose: gettext("Side navigation with collapsible submenus")},
        %{component: "<.sidebar_submenu>", purpose: gettext("Collapsible group of sidebar items")},
        %{component: "<.layout_content>", purpose: gettext("Content area wrapper")},
        %{component: "<.main>", purpose: gettext("Main content area where LiveViews render")},
        %{component: "<.footer>", purpose: gettext("Page footer (reads copyright from config)")},
        %{component: "<.navbar_profile_btn>", purpose: gettext("Profile trigger in navbar end slot")},
        %{component: "<.profile_panel>", purpose: gettext("Slide-out profile panel")},
        %{component: "<.settings_panel>", purpose: gettext("Theme switcher + display settings panel")}
      ]}>
        <:col :let={row} label={gettext("Component")}><.code>{row.component}</.code></:col>
        <:col :let={row} label={gettext("Purpose")}>{row.purpose}</:col>
      </.table>
    </.card>

    <%!-- Theming --%>
    <.card title_text={gettext("Theming")}>
      <.paragraph class="mb-4">
        {gettext("Themes are managed via the")} <.code>pureadmin</.code> {gettext("CLI and loaded as static CSS files from")} <.code>priv/static/themes/</.code>.
      </.paragraph>

      <.heading level={4}>{gettext("Available Commands")}</.heading>
      <.code_block language="bash">npx pureadmin list              # List all available themes
    npx pureadmin themes audi       # Download Audi theme
    npx pureadmin themes dark       # Download Dark theme
    npx pureadmin update            # Update all downloaded themes</.code_block>

      <.heading level={4} class="mt-4">{gettext("Switching Themes")}</.heading>
      <.paragraph>
        {gettext("Change the theme CSS")} <.code>{"<link>"}</.code> {gettext("in")} <.code>root.html.heex</.code>:
      </.paragraph>
      <.code_block language="heex">&lt;%!-- In root.html.heex &lt;head&gt; --%&gt;
    &lt;link rel="stylesheet" href=&#123;~p"/themes/__DEFAULT_THEME__/css/__DEFAULT_THEME__.css"&#125; /&gt;</.code_block>
    </.card>

    <%!-- Key Concepts --%>
    <.card title_text={gettext("Key Concepts")}>
      <.grid>
        <.column size="100" lg="1-2">
          <.heading level={4}>{gettext("LiveView Lifecycle")}</.heading>
          <.paragraph class="mb-2">{gettext("Every LiveView module follows this contract:")}</.paragraph>
          <.basic_list>
            <li><.code>mount/3</.code> — {gettext("called once on initial render and reconnect")}</li>
            <li><.code>handle_params/3</.code> — {gettext("called after mount and on URL changes")}</li>
            <li><.code>handle_event/3</.code> — {gettext("handles browser events (")}<.code>phx-click</.code>, <.code>phx-submit</.code>{gettext(", etc.)")}</li>
            <li><.code>handle_info/2</.code> — {gettext("handles PubSub messages or other process info")}</li>
            <li><.code>render/1</.code> — {gettext("returns the HEEx template")}</li>
          </.basic_list>
        </.column>
        <.column size="100" lg="1-2">
          <.heading level={4}>{gettext("Component Patterns")}</.heading>
          <.paragraph class="mb-2">{gettext("Common patterns used throughout:")}</.paragraph>
          <.basic_list>
            <li><.code>title_text</.code> — {gettext("attr for card/section headings")}</li>
            <li><.code>variant</.code> — {gettext("attr for color variants (primary, success, etc.)")}</li>
            <li><.code>:icon</.code> — {gettext("named slot for icon content (button, alert, badge)")}</li>
            <li><.code>:tools</.code> — {gettext("named slot for header actions on cards")}</li>
            <li><.code>{":col :let={user}"}</.code> — {gettext("table column slot with row binding")}</li>
            <li><.code>is_*</.code> — {gettext("boolean modifier attrs (is_block, is_outline, is_compact)")}</li>
          </.basic_list>
        </.column>
      </.grid>
    </.card>

    <%!-- Forms & DateTime (keen_pure_admin v1.1) --%>
    <.card title_text={gettext("Forms & DateTime helpers (v1.1)")}>
      <.paragraph class="mb-4">
        <.code>keen_pure_admin ~&gt; 1.1</.code> {gettext("ships two big quality-of-life additions worth knowing about up front.")}
      </.paragraph>

      <.heading level={4}>{gettext("Form binding via")} <.code>field=&#123;@form[:x]&#125;</.code></.heading>
      <.paragraph class="mb-2">
        {gettext("Pass the form field directly to")} <.code>&lt;.input&gt;</.code>, <.code>&lt;.textarea&gt;</.code>, <.code>&lt;.select&gt;</.code>, <.code>&lt;.checkbox&gt;</.code>, <.code>&lt;.radio&gt;</.code>, {gettext("or")} <.code>&lt;.form_group&gt;</.code> {gettext("and the component derives")} <.code>name</.code>, <.code>id</.code>, <.code>value</.code>/<.code>checked</.code>, {gettext("and error state automatically. Inline errors render below the input when the bound field has errors —")} <.code>show_errors=&#123;false&#125;</.code> {gettext("opts out per-input.")}
      </.paragraph>
      <.code_block language="elixir">def mount(_params, _session, socket) do
      &#123;:ok, assign(socket, form: to_form(%&#123;"name" =&gt; ""&#125;, as: :user))&#125;
    end

    def render(assigns) do
      ~H&quot;&quot;&quot;
      &lt;.simple_form for=&#123;@form&#125; phx-submit="save"&gt;
        &lt;.input field=&#123;@form[:name]&#125; label="Name" placeholder="Jane" /&gt;
        &lt;:actions&gt;
          &lt;.button type="submit"&gt;Save&lt;/.button&gt;
        &lt;/:actions&gt;
      &lt;/.simple_form&gt;
      &quot;&quot;&quot;
    end</.code_block>
      <.paragraph class="mt-2">
        {gettext("See")} <.code>lib/__APP_ID_SNAKE___web/live/settings_live.ex</.code> {gettext("for the full pattern, including a flash banner replaced via")} <.code>PureFlash.push_flash(..., replace: true)</.code> {gettext("instead of stacking on every save.")}
      </.paragraph>

      <.heading level={4} class="mt-4">{gettext("Relative timestamps via")} <.code>PureAdmin.DateTime</.code></.heading>
      <.paragraph class="mb-2">
        <.code>PureAdmin.DateTime.relative/2</.code> {gettext("buckets a")} <.code>Date</.code> | <.code>NaiveDateTime</.code> | <.code>DateTime</.code> {gettext("into")} <em>just now</em>, <em>3 minutes ago</em>, <em>yesterday</em>, <em>2 weeks ago</em>, <em>in 5 months</em>, {gettext("etc.")} <.code>format/2</.code> {gettext("handles named formats (")}<.code>:short_date</.code>, <.code>:long_date_time</.code>, <.code>:time</.code>{gettext(") and a raw strftime fallback. All phrases route through")} <.code>PureAdmin.Translations.t/2</.code> {gettext("(see the i18n card below) — 47 keys under")} <.code>pureAdmin.datetime.*</.code>.
      </.paragraph>
      <.code_block language="elixir">&lt;span title=&#123;PureAdmin.DateTime.format(user.joined, :long_date)&#125;&gt;
      &#123;PureAdmin.DateTime.relative(user.joined)&#125;
    &lt;/span&gt;
    &lt;%!-- → "3 months ago" with the full date in the tooltip --%&gt;</.code_block>
      <.paragraph class="mt-2">
        <.code>lib/__APP_ID_SNAKE___web/live/users_live.ex</.code> {gettext("uses this in the Joined column.")}
      </.paragraph>

      <.heading level={4} class="mt-4">{gettext("Toast + undo for destructive actions")}</.heading>
      <.paragraph class="mb-2">
        <.code>PureAdmin.Components.Toast.push_toast/5</.code> {gettext("pairs naturally with optimistic deletes. Pass an")} <.code>actions:</.code> {gettext("list with an Undo button that fires a LiveView event; the toast container in")} <.code>app.html.heex</.code> {gettext("catches it. Used in the Users page — the Form Demo (see below) takes the same pattern further with a popconfirm for bulk clear.")}
      </.paragraph>
    </.card>

    <%!-- Internationalization --%>
    <.card title_text={gettext("Internationalization (i18n)")}>
      <.paragraph class="mb-4">
        {gettext("Two distinct categories of strings flow through two parallel pipes. They only look like one mechanism in this template because both ends happen to land in Gettext.")}
      </.paragraph>

      <.code_block>Your code:        gettext("Hello")
                          │
                          ▼
                      Phoenix Gettext (unmodified)
                          │
                          ▼
                      priv/gettext/&lt;locale&gt;/LC_MESSAGES/default.po


    Library code:     PureAdmin.Translations.t("pureAdmin.buttons.cancel")
                          │
                          ▼
                      callback registered via   config :keen_pure_admin, translate: ...
                          │
                          ▼
                      __APP_MODULE__Web.Translations.translate/2   ← lib/.../translations.ex
                          │
                          ▼  (this template's CHOICE — swap for DB / ETS / anything)
                      Gettext.dgettext(__APP_MODULE__Web.Gettext, "pure_admin", key)
                          │
                          ▼
                      priv/gettext/&lt;locale&gt;/LC_MESSAGES/pure_admin.po</.code_block>

      <.heading level={4} class="mt-4">{gettext("Pipe 1 — your app's strings")}</.heading>
      <.paragraph class="mb-2">
        {gettext("Standard Phoenix Gettext. Wrap text in")} <.code>gettext("...")</.code>, {gettext("run the usual")} <.code>mix gettext.*</.code> {gettext("tasks. Nothing PureAdmin-specific —")} <.code>translations.ex</.code> {gettext("doesn't touch this pipe at all.")}
      </.paragraph>
      <.code_block language="heex">&lt;h1&gt;&#123;gettext("Welcome to __APP_NAME__")&#125;&lt;/h1&gt;
    &lt;p&gt;&#123;gettext("Hello %&#123;name&#125;", name: @user.name)&#125;&lt;/p&gt;</.code_block>

      <.heading level={4} class="mt-4">{gettext("Pipe 2 — library strings (you can call them too)")}</.heading>
      <.paragraph class="mb-2">
        <.code>keen_pure_admin</.code> {gettext("ships English defaults for")} <.code>pureAdmin.*</.code> {gettext("keys — button labels, dialog text, settings panel, command palette, a11y. You can reuse them from your own LiveViews so your custom UI stays consistent with the library when locales change:")}
      </.paragraph>
      <.code_block language="elixir">defmodule __APP_MODULE__Web.MyLive do
      use __APP_MODULE__Web, :live_view
      import PureAdmin.Translations, only: [t: 1, t: 2]

      def render(assigns) do
        ~H&quot;&quot;&quot;
        &lt;%!-- Same "Cancel" the library uses for its dialogs --%&gt;
        &lt;.button&gt;&#123;t("pureAdmin.buttons.cancel")&#125;&lt;/.button&gt;

        &lt;%!-- With %&#123;param&#125; interpolation --%&gt;
        &lt;p&gt;&#123;t("pureAdmin.pagination.pages", %&#123;total: @count&#125;)&#125;&lt;/p&gt;
        &quot;&quot;&quot;
      end
    end</.code_block>
      <.paragraph class="mb-2 mt-2">
        {gettext("If you only need a key once or twice and don't want the import, the fully-qualified call works the same:")} <.code>{"PureAdmin.Translations.t(\"pureAdmin.buttons.save\")"}</.code>.
      </.paragraph>

      <.heading level={4} class="mt-4">{gettext("How pipe 2 is wired (and how to swap the backend)")}</.heading>
      <.paragraph class="mb-2">
        <.code>PureAdmin.Translations.t/2</.code> {gettext("calls a callback registered via")} <.code>config :keen_pure_admin, translate: &amp;...</.code>. {gettext("The library is agnostic — the callback can fetch translations from anywhere. This template's callback in")} <.code>lib/__APP_ID_SNAKE___web/translations.ex</.code> {gettext("forwards to Gettext under the")} <.code>pure_admin</.code> {gettext("domain so library strings live in the same .po structure as your app strings. Return")} <.code>nil</.code> {gettext("to fall back to the baked-in English default.")}
      </.paragraph>
      <.code_block language="elixir"># Sketch — replace the Gettext call with anything else.
    defmodule __APP_MODULE__Web.Translations do
      def translate(key, params) do
        case __APP_MODULE__.Translations.fetch(key, current_locale()) do
          nil  -&gt; nil   # falls back to library's English default
          text -&gt; PureAdmin.Translations.interpolate(text, params)
        end
      end
    end</.code_block>

      <.heading level={4} class="mt-4">{gettext("Adding a Language (with the default Gettext setup)")}</.heading>
      <.code_block language="bash"># 1. Wrap any new user-facing strings with gettext()
    mix gettext.extract                                # extract to .pot files
    mix gettext.merge priv/gettext --locale cs         # create cs/ translations

    # 2. Translate priv/gettext/cs/LC_MESSAGES/default.po (your app strings)
    #    and priv/gettext/cs/LC_MESSAGES/pure_admin.po (library overrides)

    # 3. Set the active locale at runtime (in a plug or LiveView mount/3):
    #    Gettext.put_locale(__APP_MODULE__Web.Gettext, "cs")</.code_block>
    </.card>

    <%!-- Resources --%>
    <.card title_text={gettext("Resources")}>
      <.basic_list>
        <li>
          <strong>{gettext("Component Library:")}</strong>
          <.code>keen_pure_admin</.code> — <.pa_link href="https://hexdocs.pm/keen_pure_admin" target="_blank">{gettext("HexDocs reference")}</.pa_link>
        </li>
        <li>
          <strong>{gettext("CSS Framework:")}</strong>
          <.code>pure-admin</.code> — {gettext("BEM-based styling, served from")} <.code>priv/static/</.code>
        </li>
        <li>
          <strong>{gettext("Themes & Icons:")}</strong>
          <.pa_link href="https://pureadmin.io" target="_blank">pureadmin.io</.pa_link>
        </li>
        <li>
          <strong>{gettext("Phoenix LiveView Docs:")}</strong>
          <.pa_link href="https://hexdocs.pm/phoenix_live_view" target="_blank">hexdocs.pm/phoenix_live_view</.pa_link>
        </li>
      </.basic_list>
    </.card>
    """
  end
end

defmodule __APP_MODULE__Web.Translations do
  @moduledoc """
  Bridge between `keen_pure_admin`'s built-in translation hook and Phoenix Gettext.

  `keen_pure_admin` ships with English defaults for all `pureAdmin.*` keys
  (button labels, dialog text, settings panel, a11y, etc.). To localize them,
  this module routes lookups to Gettext under the `pure_admin` domain.

  Wired in `config/config.exs`:

      config :keen_pure_admin,
        translate: &__APP_MODULE__Web.Translations.translate/2

  ## Adding translations

  Run once to extract all `pureAdmin.*` keys into a POT template:

      mix gettext.extract

  Merge into a locale file (e.g. Czech):

      mix gettext.merge priv/gettext --locale cs

  Translate strings in `priv/gettext/cs/LC_MESSAGES/pure_admin.po`. Returning
  `nil` from `translate/2` falls through to the library's English default —
  so partial translations work; you only need to translate keys you care about.

  ## Custom routing

  Replace `Gettext.dgettext/3` with any source — DB lookups, ETS, an in-app
  translation editor, etc. As long as you call `PureAdmin.Translations.interpolate/2`
  on the result so `%{param}` placeholders work the same as the defaults.
  """

  def translate(key, params) do
    case Gettext.dgettext(__APP_MODULE__Web.Gettext, "pure_admin", key) do
      ^key -> nil
      text -> PureAdmin.Translations.interpolate(text, params)
    end
  end
end

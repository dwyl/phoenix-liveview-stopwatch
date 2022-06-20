defmodule StopwatchWeb.Router do
  use StopwatchWeb, :router

  pipeline :browser do
    plug(:accepts, ["html"])
    plug(:fetch_session)
    plug(:fetch_live_flash)
    plug(:put_root_layout, {StopwatchWeb.LayoutView, :root})
    plug(:protect_from_forgery)
    plug(:put_secure_browser_headers)
  end

  scope "/", StopwatchWeb do
    pipe_through(:browser)

    live("/", StopwatchLive)
  end
end

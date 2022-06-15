defmodule StopwatchWeb.PageController do
  use StopwatchWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end

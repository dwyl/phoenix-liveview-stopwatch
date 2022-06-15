defmodule StopwatchW.StopwatchLiveTest do
  use StopwatchWeb.ConnCase
  import Phoenix.LiveViewTest

  test "disconnected and connected mount", %{conn: conn} do
    conn = get(conn, "/")
    assert html_response(conn, 200) =~ "<h1>00:00:00</h1>"

    {:ok, _view, _html} = live(conn)
  end

  test "test tick event increment timer", %{conn: conn} do
    {:ok, view, _html} = live(conn, "/")
    Process.send(view.pid, :tick, [])
    assert render(view) =~ "00:00:01"
  end
end

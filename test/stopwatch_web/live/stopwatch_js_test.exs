defmodule StopwatchW.StopwatchJSTest do
  use StopwatchWeb.ConnCase
  import Phoenix.LiveViewTest

  test "stopwatch is ticking", %{conn: conn} do
    conn = get(conn, "/stopwatch-js")
    assert html_response(conn, 200) =~ "00:00:00"

    {:ok, view, _html} = live(conn)
    render_click(view, "start") =~ "stop"
    render_click(view, "stop") =~ "start"
    render_click(view, "reset") =~ "start"
  end
end

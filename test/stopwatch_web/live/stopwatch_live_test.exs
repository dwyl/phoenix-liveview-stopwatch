defmodule StopwatchW.StopwatchLiveTest do
  use StopwatchWeb.ConnCase
  import Phoenix.LiveViewTest

  test "stopwatch is ticking", %{conn: conn} do
    conn = get(conn, "/")
    assert html_response(conn, 200) =~ "<h1>00:00:00</h1>"

    {:ok, view, _html} = live(conn)
    render_click(view, "start")
    Process.sleep(1000)
    assert render_click(view, "stop") =~ "00:00:01"

    # reset
    assert render_click(view, "reset") =~ "Start"
  end
end

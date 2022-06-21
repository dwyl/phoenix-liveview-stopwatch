defmodule Stopwatch.TimerServerTest do
  use ExUnit.Case, async: true
  alias Stopwatch.TimerServer

  setup context do
    timer = start_supervised!({Stopwatch.TimerServer, name: context.test})
    %{timer: timer}
  end

  test "GenServer timer is working", %{timer: timer} do
    assert {:stopped, ~T[00:00:00]} == TimerServer.get_timer_state(timer)
    assert :running == TimerServer.start_timer(timer)
    assert :stopped == TimerServer.stop_timer(timer)
    assert :reset == TimerServer.reset(timer)
  end
end

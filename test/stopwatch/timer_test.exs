defmodule Stopwatch.TimerTest do
  use ExUnit.Case, async: true

  setup context do
    start_supervised!({Stopwatch.Timer, name: context.test})
    %{timer: context.test}
  end

  test "Timer agent is working!", %{timer: timer} do
    assert {:stopped, ~T[00:00:00]} == Stopwatch.Timer.get_timer_state(timer)
    assert :ok = Stopwatch.Timer.start_timer(timer)
    assert :ok = Stopwatch.Timer.tick(timer)
    assert {:running, time} = Stopwatch.Timer.get_timer_state(timer)
    assert Time.truncate(time, :second) == ~T[00:00:01]
    assert :ok = Stopwatch.Timer.stop_timer(timer)
    assert {:stopped, _time} = Stopwatch.Timer.get_timer_state(timer)
  end

  test "Timer is reset", %{timer: timer} do
    assert :ok = Stopwatch.Timer.start_timer(timer)
    :ok = Stopwatch.Timer.tick(timer)
    :ok = Stopwatch.Timer.tick(timer)
    {:running, time} = Stopwatch.Timer.get_timer_state(timer)
    assert Time.truncate(time, :second) == ~T[00:00:02]
    Stopwatch.Timer.reset(timer)
    assert {:stopped, ~T[00:00:00]} == Stopwatch.Timer.get_timer_state(timer)
  end
end

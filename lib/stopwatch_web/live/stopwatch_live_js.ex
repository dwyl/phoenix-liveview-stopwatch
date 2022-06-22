defmodule StopwatchWeb.StopwatchLiveJS do
  use StopwatchWeb, :live_view
  alias Stopwatch.TimerDB

  def mount(_params, _session, socket) do
    if connected?(socket), do: TimerDB.subscribe()

    # {timer_status, time} = TimerServer.get_timer_state(Stopwatch.TimerServer)
    # {:ok, assign(socket, time: time, timer_status: timer_status)}
    {status, start, stop} = TimerDB.get_timer_state(Stopwatch.TimerDB)
    # if running
    TimerDB.notify()
    {:ok, assign(socket, timer_status: status, start: start, stop: stop)}
  end

  def render(assigns) do
    Phoenix.View.render(StopwatchWeb.StopwatchView, "stopwatch_js.html", assigns)
  end

  def handle_event("start", _value, socket) do
    TimerDB.start_timer(Stopwatch.TimerDB)

    TimerDB.notify()
    {:noreply, socket}
  end

  def handle_event("stop", _value, socket) do
    TimerDB.stop_timer(Stopwatch.TimerDB)
    TimerDB.notify()
    {:noreply, socket}
  end

  def handle_event("reset", _value, socket) do
    TimerDB.reset_timer(Stopwatch.TimerDB)
    TimerDB.notify()
    {:noreply, socket}
  end

  def handle_info(:timer_updated, socket) do
    {timer_status, start, stop} = TimerDB.get_timer_state(Stopwatch.TimerDB)
    socket = assign(socket, timer_status: timer_status, start: start, stop: stop)

    {:noreply,
     push_event(socket, "timerUpdated", %{timer_status: timer_status, start: start, stop: stop})}
  end
end

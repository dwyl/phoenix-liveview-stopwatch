defmodule StopwatchWeb.StopwatchLive do
  use StopwatchWeb, :live_view
  alias Stopwatch.TimerServer

  def mount(_params, _session, socket) do
    if connected?(socket), do: TimerServer.subscribe()

    {timer_status, time} = TimerServer.get_timer_state(Stopwatch.TimerServer)
    {:ok, assign(socket, time: time, timer_status: timer_status)}
  end

  def render(assigns) do
    Phoenix.View.render(StopwatchWeb.StopwatchView, "stopwatch.html", assigns)
  end

  def handle_event("start", _value, socket) do
    :running = TimerServer.start_timer(Stopwatch.TimerServer)
    TimerServer.notify()
    {:noreply, socket}
  end

  def handle_event("stop", _value, socket) do
    :stopped = TimerServer.stop_timer(Stopwatch.TimerServer)
    TimerServer.notify()
    {:noreply, socket}
  end

  def handle_event("reset", _value, socket) do
    :reset = TimerServer.reset(Stopwatch.TimerServer)
    TimerServer.notify()
    {:noreply, socket}
  end

  def handle_info(:timer_updated, socket) do
    {timer_status, time} = TimerServer.get_timer_state(Stopwatch.TimerServer)

    {:noreply, assign(socket, time: time, timer_status: timer_status)}
  end
end

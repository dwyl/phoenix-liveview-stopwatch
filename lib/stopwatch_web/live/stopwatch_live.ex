defmodule StopwatchWeb.StopwatchLive do
  use StopwatchWeb, :live_view

  def mount(_params, _session, socket) do
    if connected?(socket), do: Stopwatch.Timer.subscribe()

    {timer_status, time} = Stopwatch.Timer.get()
    {:ok, assign(socket, time: time, timer_status: timer_status)}
  end

  def render(assigns) do
    Phoenix.View.render(StopwatchWeb.StopwatchView, "stopwatch.html", assigns)
  end

  def handle_event("start", _value, socket) do
    Process.send_after(self(), :tick, 1000)
    Stopwatch.Timer.start_timer()
    {:noreply, socket}
  end

  def handle_event("stop", _value, socket) do
    Stopwatch.Timer.stop_timer()
    {:noreply, socket}
  end

  def handle_info(:timer_updated, socket) do
    {timer_status, time} = Stopwatch.Timer.get()
    {:noreply, assign(socket, time: time, timer_status: timer_status)}
  end

  def handle_info(:tick, socket) do
    {timer_status, _time} = Stopwatch.Timer.get()

    if timer_status == :running do
      Process.send_after(self(), :tick, 1000)
      Stopwatch.Timer.tick()
      {:noreply, socket}
    else
      {:noreply, socket}
    end
  end
end

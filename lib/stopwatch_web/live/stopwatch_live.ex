defmodule StopwatchWeb.StopwatchLive do
  use StopwatchWeb, :live_view

  def mount(_params, _session, socket) do
    time = Stopwatch.Timer.get() |> IO.inspect()
    {:ok, assign(socket, time: time, timer_status: :stopped)}
  end

  def render(assigns) do
    Phoenix.View.render(StopwatchWeb.StopwatchView, "stopwatch.html", assigns)
  end

  def handle_event("start", _value, socket) do
    Process.send_after(self(), :tick, 1000)
    {:noreply, assign(socket, :timer_status, :running)}
  end

  def handle_event("stop", _value, socket) do
    {:noreply, assign(socket, :timer_status, :stopped)}
  end

  def handle_info(:tick, socket) do
    if socket.assigns.timer_status == :running do
      Process.send_after(self(), :tick, 1000)
      # time = Time.add(socket.assigns.time, 1, :second)
      Stopwatch.Timer.tick()
      {:noreply, assign(socket, :time, Stopwatch.Timer.get())}
    else
      {:noreply, socket}
    end
  end
end

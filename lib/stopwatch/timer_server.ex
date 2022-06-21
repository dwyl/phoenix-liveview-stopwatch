defmodule Stopwatch.TimerServer do
  use GenServer
  alias Phoenix.PubSub

  def start_link(opts) do
    GenServer.start_link(__MODULE__, :ok, opts)
  end

  def start_timer(server) do
    GenServer.call(server, :start)
  end

  def stop_timer(server) do
    GenServer.call(server, :stop)
  end

  def get_timer_state(server) do
    GenServer.call(server, :state)
  end

  def reset(server) do
    GenServer.call(server, :reset)
  end

  @impl true
  def init(:ok) do
    {:ok, {:stopped, ~T[00:00:00]}}
  end

  @impl true
  def handle_call(:start, _from, {_status, time}) do
    Process.send_after(self(), :tick, 1000)
    {:reply, :running, {:running, time}}
  end

  @impl true
  def handle_call(:stop, _from, {_status, time}) do
    {:reply, :stopped, {:stopped, time}}
  end

  @impl true
  def handle_call(:state, _from, stopwatch) do
    {:reply, stopwatch, stopwatch}
  end

  @impl true
  def handle_call(:reset, _from, _stopwatch) do
    {:reply, :reset, {:stopped, ~T[00:00:00]}}
  end

  @impl true
  def handle_info(:tick, {status, time} = stopwatch) do
    if status == :running do
      Process.send_after(self(), :tick, 1000)
      notify()
      {:noreply, {status, Time.add(time, 1, :second)}}
    else
      {:noreply, stopwatch}
    end
  end

  def subscribe() do
    PubSub.subscribe(Stopwatch.PubSub, "liveview_stopwatch")
  end

  def notify() do
    PubSub.broadcast(Stopwatch.PubSub, "liveview_stopwatch", :timer_updated)
  end
end

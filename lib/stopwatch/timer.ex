defmodule Stopwatch.Timer do
  use Agent
  alias Phoenix.PubSub

  def start_link(opts) do
    Agent.start_link(fn -> {:stopped, ~T[00:00:00]} end, opts)
  end

  def get_timer_state(timer) do
    Agent.get(timer, fn state -> state end)
  end

  def start_timer(timer) do
    Agent.update(timer, fn {_timer_status, time} -> {:running, time} end)
    notify()
  end

  def stop_timer(timer) do
    Agent.update(timer, fn {_timer_status, time} -> {:stopped, time} end)
    notify()
  end

  def tick(timer) do
    Agent.update(timer, fn {timer_status, timer} ->
      {timer_status, Time.add(timer, 1, :second)}
    end)

    notify()
  end

  def subscribe() do
    PubSub.subscribe(Stopwatch.PubSub, "liveview_stopwatch")
  end

  def notify() do
    PubSub.broadcast(Stopwatch.PubSub, "liveview_stopwatch", :timer_updated)
  end
end

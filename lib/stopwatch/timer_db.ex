defmodule Stopwatch.TimerDB do
  use Agent
  alias Phoenix.PubSub

  def start_link(opts) do
    Agent.start_link(fn -> {:stopped, nil, nil} end, opts)
  end

  def start_timer(db) do
    start = DateTime.utc_now() |> DateTime.to_unix(:millisecond)
    Agent.update(db, fn _ -> {:running, start, nil} end)
  end

  def stop_timer(db) do
    stop = DateTime.utc_now() |> DateTime.to_unix(:millisecond)
    Agent.update(db, fn {_, start, _} -> {:stopped, start, stop} end)
  end

  def get_timer_state(db) do
    Agent.get(db, fn state -> state end)
  end

  def reset_timer(db) do
    Agent.update(db, fn _state -> {:stopped, nil, nil} end)
  end

  def subscribe() do
    PubSub.subscribe(Stopwatch.PubSub, "liveview_stopwatch_js")
  end

  def notify() do
    PubSub.broadcast(Stopwatch.PubSub, "liveview_stopwatch_js", :timer_updated)
  end
end

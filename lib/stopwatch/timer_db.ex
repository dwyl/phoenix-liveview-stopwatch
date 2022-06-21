defmodule Stopwatch.TimerDB do
  use Agent
  alias Phoenix.PubSub

  def start_link(opts) do
    Agent.start_link(fn -> {:stopped, nil, nil} end, opts)
  end

  def start_timer(db) do
    Agent.update(db, fn _ -> {:running, NaiveDateTime.utc_now(), nil} end)
  end

  def stop_timer(db) do
    Agent.update(db, fn {_, start, _} -> {:stopped, start, NaiveDateTime.utc_now()} end)
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

  # coveralls-ignore-end

  def notify() do
    PubSub.broadcast(Stopwatch.PubSub, "liveview_stopwatch_js", :timer_updated)
  end
end

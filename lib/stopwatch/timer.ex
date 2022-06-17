defmodule Stopwatch.Timer do
  use Agent

  def start_link(_opts) do
    Agent.start_link(fn -> ~T[00:00:00] end, name: __MODULE__)
  end

  def get() do
    Agent.get(__MODULE__, fn t -> t end)
  end

  def tick() do
    Agent.get_and_update(__MODULE__, fn t -> {t, Time.add(t, 10, :second)} end)
  end
end

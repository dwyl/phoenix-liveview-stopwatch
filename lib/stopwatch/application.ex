defmodule Stopwatch.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Telemetry supervisor
      StopwatchWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: Stopwatch.PubSub},
      # Start the Endpoint (http/https)
      StopwatchWeb.Endpoint,
      # Start a worker by calling: Stopwatch.Worker.start_link(arg)
      # {Stopwatch.Worker, arg}
      # {Stopwatch.Timer, name: Stopwatch.Timer}
      {Stopwatch.TimerServer, name: Stopwatch.TimerServer}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Stopwatch.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    StopwatchWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end

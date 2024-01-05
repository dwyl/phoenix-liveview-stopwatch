import Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :stopwatch, StopwatchWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "UtF2HDPYn/l1NRTblw0I39IO1EFK8L+arMD4WD2bK0TafaRURFqwYI3sOoujn0+d",
  server: false

# Print only warnings and errors during test
config :logger, level: :warning

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime

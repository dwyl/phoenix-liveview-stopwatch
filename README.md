<div align="center">

# `Phoenix` `LiveView` Stopwatch 

[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/dwyl/phoenix-liveview-stopwatch/Elixir%20CI?label=build&style=flat-square)](https://github.com/dwyl/phoenix-liveview-stopwatch/actions/workflows/ci.yml)
[![codecov.io](https://img.shields.io/codecov/c/github/dwyl/phoenix-liveview-stopwatch/main.svg?style=flat-square)](http://codecov.io/github/dwyl/phoenix-liveview-stopwatch?branch=main)
[![Hex.pm](https://img.shields.io/hexpm/v/phoenix-liveview-stopwatch?color=brightgreen&style=flat-square)](https://hex.pm/packages/phoenix-liveview-stopwatch)
[![Libraries.io dependency status](https://img.shields.io/librariesio/release/hex/phoenix-liveview-stopwatch?logoColor=brightgreen&style=flat-square)](https://libraries.io/hex/phoenix-liveview-stopwatch)
[![docs](https://img.shields.io/badge/docs-maintained-brightgreen?style=flat-square)](https://hexdocs.pm/phoenix-liveview-stopwatch/api-reference.html)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat-square)](https://github.com/dwyl/phoenix-liveview-stopwatch/issues)
[![HitCount](http://hits.dwyl.com/dwyl/phoenix-liveview-stopwatch.svg)](http://hits.dwyl.com/dwyl/phoenix-liveview-stopwatch)

</div>

## Why? 💡

We wanted to build the **simplest possible _shared_ stopwatch**
as a self-contained
[***experiment***](https://github.com/dwyl/technology-stack/issues/96)
to 
`Phoenix LiveView` lets us build RealTime collaborative apps
without writing a line of `JavaScript`.


## How? 💻



- Create new phoenix "barebone" Phonenix application:

```sh
mix phx.new stopwatch --no-mailer --no-dashboard --no-gettext --no-ecto
```

- Create folders and files for liveView stopwatch code:

```sh
mkdir lib/stopwatch_web/live
touch lib/stopwatch_web/live/stopwatch_live.ex
touch lib/stopwatch_web/views/stopwatch_view.ex
mkdir lib/stopwatch_web/templates/stopwatch
touch lib/stopwatch_web/templates/stopwatch/stopwatch.html.heex
```

- Update router. In `lib/stopwatch_web/router.ex` update the "/" endpoint:

```elixir
live("/", StopwatchLive)
```

- Create liveView logic (mount, render, handle_event, handle_info) 
in StopwatchLive module. In `lib/stopwatch_web/live/stopwatch_live.ex` add:

```elixir
defmodule StopwatchWeb.StopwatchLive do
  use StopwatchWeb, :live_view

  def mount(_params, _session, socket) do
    {:ok, assign(socket, time: ~T[00:00:00], timer_status: :stopped)}
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
      time = Time.add(socket.assigns.time, 1, :second)
      {:noreply, assign(socket, :time, time)}
    else
      {:noreply, socket}
    end
  end
end
```

In `mount` `:time` is initialised using the `~T` sigil to create a Time value,
and `:timer_status` is set to `:stopped`, this value is used to display the correct
start/stop button on the template.

The `render` function call the `stopwatch.html` template with the `:time` and
`:timer_status` defined in the `assigns`.

There are two `handle_event` functions. One for starting the timer and the other
to stop it. When the stopwatch start we send a new `:tick` event after 1 second and
set the timer status to `:running`. The `stop` event only switch the timer status
back to `stopped`.

Finally the `handle_info` function manages the `:tick` event. If the status is
`:running` when send another `:tick` event after 1 second and increment the `:timer`
value with 1 second.

- Update `lib/stopwatch_web/templates/layout/root.hml.heex` with the following body:

```html
<body>
    <%= @inner_content %>
</body>
```

- Create the `StopwatchView` module in `lib/stopwatch_web/views/stopwatch_view.ex` 

```elixir defmodule StopwatchWeb.StopwatchView do
  use StopwatchWeb, :view
end
```

Finally create the templates in `lib/stopwatch_web/templates/stopwatch/stopwatch.html.heex`:

```html
<h1><%= @time |> Time.truncate(:second) |> Time.to_string()  %></h1>
<%= if @timer_status == :stopped do %>
  <button phx-click="start">Start</button>
<% end %>

<%= if @timer_status == :running do %>
  <button phx-click="stop">Stop</button>
<% end %>
```

If you run the server with `mix phx.server` you should now be able
to start/stop the stopwatch.

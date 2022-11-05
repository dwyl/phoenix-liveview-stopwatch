<div align="center">

# `Phoenix` `LiveView` _Stopwatch_ ⏱️

[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/dwyl/phoenix-liveview-stopwatch/Elixir%20CI?label=build&style=flat-square)](https://github.com/dwyl/phoenix-liveview-stopwatch/actions/workflows/ci.yml)
[![codecov.io](https://img.shields.io/codecov/c/github/dwyl/phoenix-liveview-stopwatch/main.svg?style=flat-square)](https://codecov.io/github/dwyl/phoenix-liveview-stopwatch?branch=main)
[![Hex.pm](https://img.shields.io/hexpm/v/phoenix?color=brightgreen&style=flat-square)](https://hex.pm/packages/phoenix)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat-square)](https://github.com/dwyl/phoenix-liveview-stopwatch/issues)
[![HitCount](https://hits.dwyl.com/dwyl/phoenix-liveview-stopwatch.svg)](https://hits.dwyl.com/dwyl/phoenix-liveview-stopwatch)

</div>

- [`Phoenix` `LiveView` _Stopwatch_ ⏱️](#phoenix-liveview-stopwatch-️)
- [Why? 💡](#why-)
- [What? 🤷‍♀️](#what-️)
- [How? 💻](#how-)
  - [Create a new "barebones" Phonenix application:](#create-a-new-barebones-phonenix-application)
  - [Create folders and files for `LiveView`:](#create-folders-and-files-for-liveview)
  - [Update `router.ex`](#update-routerex)
  - [Create `LiveView` logic](#create-liveview-logic)
  - [Update Root Template](#update-root-template)
  - [Create View](#create-view)
  - [Create Template](#create-template)
  - [Sync Stopwatch](#sync-stopwatch)
  - [`GenServer`](#genserver)
  - [`Liveview` + `JavaScript`](#liveview--javascript)
  - [What's _next_?](#whats-next)

<br />
  
# Why? 💡

We wanted to build the **simplest possible _shared_ stopwatch**
as a self-contained
[***experiment***](https://github.com/dwyl/technology-stack/issues/96)
to test how easy complex/simple it would be
before using this in our main
[**`app`**](https://github.com/dwyl/app)

# What? 🤷‍♀️

`Phoenix LiveView` lets us build RealTime collaborative apps
without writing a line of `JavaScript`.
This is an _example_ that anyone can understand in **`10 mins`**.

# How? 💻

Try the finished app before you try to build it:

https://liveview-stopwatch.fly.dev/

![stopwatch](https://user-images.githubusercontent.com/194400/174432051-5199369d-df07-4809-a758-24d3738535f7.png)

Once you've tried it, come back and **_build_ it**!
## Create a new "barebones" Phonenix application:

```sh
mix phx.new stopwatch --no-mailer --no-dashboard --no-gettext --no-ecto
```

## Create folders and files for `LiveView`:

```sh
mkdir lib/stopwatch_web/live
touch lib/stopwatch_web/live/stopwatch_live.ex
touch lib/stopwatch_web/views/stopwatch_view.ex
mkdir lib/stopwatch_web/templates/stopwatch
touch lib/stopwatch_web/templates/stopwatch/stopwatch.html.heex
```

## Update `router.ex`

In `lib/stopwatch_web/router.ex` update the "/" endpoint:

```elixir
live("/", StopwatchLive)
```

## Create `LiveView` logic 

Create the 
`mount`, `render`, `handle_event` and `handle_info` 
functions 
in StopwatchLive module: 
`lib/stopwatch_web/live/stopwatch_live.ex` 

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

## Update Root Template

Update the 
`lib/stopwatch_web/templates/layout/root.hml.heex` 
with the following body:

```html
<body>
    <%= @inner_content %>
</body>
```

## Create View

Create the `StopwatchView` module in `lib/stopwatch_web/views/stopwatch_view.ex` 

```elixir defmodule StopwatchWeb.StopwatchView do
  use StopwatchWeb, :view
end
```

## Create Template

Finally create the templates in 
`lib/stopwatch_web/templates/stopwatch/stopwatch.html.heex`:

```html
<h1><%= @time |> Time.truncate(:second) |> Time.to_string()  %></h1>
<%= if @timer_status == :stopped do %>
  <button phx-click="start">Start</button>
<% end %>

<%= if @timer_status == :running do %>
  <button phx-click="stop">Stop</button>
<% end %>
```

If you run the server with 
`mix phx.server` 
you should now be able
to start/stop the stopwatch.

## Sync Stopwatch

So far the application will create a new timer for each client.
That is good but doesn't really showcase the power of `LiveView`.
We might aswell just be using _any_ other framework/library.
To really see the power of using `LiveView`,
we're going to use its' super power - 
lightweight websocket "channels" -
to create a _collaborative_ stopwatch experience!

<!--
> **Note**: this example will only have a single timer
> that is shared across multiple clients.
> It's intended as a simple showcase not a real-world app.
> Though you could easily use this 
> as the basis for a reaction-time game
> that kids could play for _hours_. 
-->

To be able to sync a timer 
between all the connected clients 
we can move the stopwatch logic 
to its own module and use 
[`Agent`](https://elixir-lang.org/getting-started/mix-otp/agent.html).

Create `lib/stopwatch/timer.ex` file and add the folowing content:

```elixir
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
```

The agent defines the state of the stopwatch 
as a tuple `{timer_status, time}`.
We defined the 
`get_timer_state/1`, `start_timer/1`, `stop_timer/1` 
and `tick/1` functions 
which are responsible for updating the tuple.

Finally the last two funtions: 
`subscribe/0` and `notify/0` 
are responsible for listening and sending 
the `:timer_updated` event via PubSub to the clients.


Now we have the Timer agent defined 
we can tell the application to create
a stopwatch when the application starts.
Update the `lib/stopwatch/application.ex` file 
to add the `StopwatchTimer`
in the supervision tree:

```elixir
    children = [
      # Start the Telemetry supervisor
      StopwatchWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: Stopwatch.PubSub},
      # Start the Endpoint (http/https)
      StopwatchWeb.Endpoint,
      # Start a worker by calling: Stopwatch.Worker.start_link(arg)
      # {Stopwatch.Worker, arg}
      {Stopwatch.Timer, name: Stopwatch.Timer} # Create timer
    ]
```

We define the timer name as `Stopwatch.Timer`. 
This name could be any `atom` 
and doesn't have to be an existing module name. 
It is just a unique way to find the timer.

We can now update our `LiveView` logic 
to use the function defined in `Stopwatch.Timer`.
Update 
`lib/stopwatch_web/live/stopwatch_live.ex`:

```elixir
defmodule StopwatchWeb.StopwatchLive do
  use StopwatchWeb, :live_view

  def mount(_params, _session, socket) do
    if connected?(socket), do: Stopwatch.Timer.subscribe()

    {timer_status, time} = Stopwatch.Timer.get_timer_state(Stopwatch.Timer)
    {:ok, assign(socket, time: time, timer_status: timer_status)}
  end

  def render(assigns) do
    Phoenix.View.render(StopwatchWeb.StopwatchView, "stopwatch.html", assigns)
  end

  def handle_event("start", _value, socket) do
    Process.send_after(self(), :tick, 1000)
    Stopwatch.Timer.start_timer(Stopwatch.Timer)
    {:noreply, socket}
  end

  def handle_event("stop", _value, socket) do
    Stopwatch.Timer.stop_timer(Stopwatch.Timer)
    {:noreply, socket}
  end

  def handle_info(:timer_updated, socket) do
    {timer_status, time} = Stopwatch.Timer.get_timer_state(Stopwatch.Timer)
    {:noreply, assign(socket, time: time, timer_status: timer_status)}
  end

  def handle_info(:tick, socket) do
    {timer_status, _time} = Stopwatch.Timer.get_timer_state(Stopwatch.Timer)

    if timer_status == :running do
      Process.send_after(self(), :tick, 1000)
      Stopwatch.Timer.tick(Stopwatch.Timer)
      {:noreply, socket}
    else
      {:noreply, socket}
    end
  end
end
```

In `mount/3`, when the socket is connected 
we subscribe the client to the PubSub channel. 
This will allow our `LiveView` 
to listen for events from other clients.

The  `start`, `stop` and `tick` events 
are now calling the
`start_timer`, `stop_timer` and `tick` functions 
from `Timer`, 
and we return `{:ok, socket}` 
without any changes on the `assigns`.
All the updates are now done 
in the new 
`handle_info(:timer_updated, socket)`
function. 
The `:timer_updated` event 
is sent by `PubSub` 
each time the timer state is changed.


If you run the application:
```sh
mix phx.server
```

And open it in two different clients 
you should now have a synchronised stopwatch!

![liveview-stopwatch-sync](https://user-images.githubusercontent.com/194400/174431168-d37e5382-f3e1-4c99-bd3b-bd3500a5035e.gif)

To _test_ our new `Stopwatch.Timer` agent, 
we can add the following code to
`test/stopwatch/timer_test.exs`:

```elixir
defmodule Stopwatch.TimerTest do
  use ExUnit.Case, async: true

  setup context do
    start_supervised!({Stopwatch.Timer, name: context.test})
    %{timer: context.test}
  end

  test "Timer agent is working!", %{timer: timer} do
    assert {:stopped, ~T[00:00:00]} == Stopwatch.Timer.get_timer_state(timer)
    assert :ok = Stopwatch.Timer.start_timer(timer)
    assert :ok = Stopwatch.Timer.tick(timer)
    assert {:running, time} = Stopwatch.Timer.get_timer_state(timer)
    assert Time.truncate(time, :second) == ~T[00:00:01]
    assert :ok = Stopwatch.Timer.stop_timer(timer)
    assert {:stopped, _time} = Stopwatch.Timer.get_timer_state(timer)
  end

  
  test "Timer is reset", %{timer: timer} do
    assert :ok = Stopwatch.Timer.start_timer(timer)
    :ok = Stopwatch.Timer.tick(timer)
    :ok = Stopwatch.Timer.tick(timer)
    {:running, time} = Stopwatch.Timer.get_timer_state(timer)
    assert Time.truncate(time, :second) == ~T[00:00:02]
    Stopwatch.Timer.reset(timer)
    assert {:stopped, ~T[00:00:00]} == Stopwatch.Timer.get_timer_state(timer)
  end
end
```

We use the `setup` function 
to create a new timer for each test.
`start_supervised!` takes care of creating 
and stopping the process timer for the tests. 
Since `mix run` will automatically run the `Timer` 
defined in `application.ex`, 
i.e. the Timer with the name `Stopwatch.Timer` 
we want to create new timers 
for the tests using other names to avoid conflicts. 
This is why we use `context.test` 
to define the name of the test `Timer` process.


## `GenServer`

One problem with our current code is if the stopwatch is running and the
client is closed (ex: browser tab closed) then the `tick` actions are stopped
however the stopwatch status is still `:running`.
This is because our live logic is responsible for updating the timer with:

```elixir
  def handle_info(:tick, socket) do
    {timer_status, _time} = Stopwatch.Timer.get_timer_state(Stopwatch.Timer)

    if timer_status == :running do
      Process.send_after(self(), :tick, 1000)
      Stopwatch.Timer.tick(Stopwatch.Timer)
      {:noreply, socket}
    else
      {:noreply, socket}
    end
  end
```

as `Process.send_after` will send the `:tick` message after 1s.
When the client is closed the live process is also closed and the `tick`
message is not sent anymore.

Instead we want to move the ticking logic to the `Timer`.
However `Agent` are not ideal to work with `Process.send_after` function and
instead we are going to rewrite our `Timer` module using `GenServer`.

Create the `lib/stopwatch/timer_server.ex` file and add the following:

```elixir
defmodule Stopwatch.TimerServer do
  use GenServer
  alias Phoenix.PubSub

  # Client API

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

  # Server
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
  def handle_info(:tick, {status, time} = stopwatch) do
    if status == :running do
      Process.send_after(self(), :tick, 1000)
      notify()
      {:noreply, {status, Time.add(time, 1, :second)}}
    else
      {:noreply, stopwatch}
    end
  end

  @impl true
  def handle_call(:state, _from, stopwatch) do
    {:reply, stopwatch, stopwatch}
  end

  @impl true
  def handle_call(:reset, _from, _stopwatch) do
    {:reply, :reset, {:stopped, ~T[00:00:00]}}
  end

  def subscribe() do
    PubSub.subscribe(Stopwatch.PubSub, "liveview_stopwatch")
  end

  def notify() do
    PubSub.broadcast(Stopwatch.PubSub, "liveview_stopwatch", :timer_updated)
  end
end
```

Compared to `Agent`, `GenServer` splits functions into client and server logic.
We can define the same client api functions name and use `hand_call` to send
messages to the `GenServer` to `stop`, `start` and `reset` the stopwatch.

The ticking process is now done by calling `Process.send_after(self(), :tick 1000)`.
The `GenServer` will then manage the `tick` events with `handle_info(:tick, stopwatch)`.

Now that we have defined our server, we need to update `lib/stopwatch/application.ex` to use
the `GenServer` instead of the `Agent`:

```elixir
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
```

We have commented our `Stopwatch.Timer` agent and added the GenServer:
`{Stopwatch.TimerServer, name: Stopwatch.TimerServer}`


Finally we can update our live logic to use Stopwatch.TimerServer and to
remove the `tick` logic from it:


```elixir
defmodule StopwatchWeb.StopwatchLive do
  use StopwatchWeb, :live_view
  alias Stopwatch.TimerServer

  def mount(_params, _session, socket) do
    if connected?(socket), do: TimerServer.subscribe()

    {timer_status, time} = TimerServer.get_timer_state(Stopwatch.TimerServer)
    {:ok, assign(socket, time: time, timer_status: timer_status)}
  end

  def render(assigns) do
    Phoenix.View.render(StopwatchWeb.StopwatchView, "stopwatch.html", assigns)
  end

  def handle_event("start", _value, socket) do
    :running = TimerServer.start_timer(Stopwatch.TimerServer)
    TimerServer.notify()
    {:noreply, socket}
  end

  def handle_event("stop", _value, socket) do
    :stopped = TimerServer.stop_timer(Stopwatch.TimerServer)
    TimerServer.notify()
    {:noreply, socket}
  end

  def handle_event("reset", _value, socket) do
    :reset = TimerServer.reset(Stopwatch.TimerServer)
    TimerServer.notify()
    {:noreply, socket}
  end

  def handle_info(:timer_updated, socket) do
    {timer_status, time} = TimerServer.get_timer_state(Stopwatch.TimerServer)

    {:noreply, assign(socket, time: time, timer_status: timer_status)}
  end
end
```

## `Liveview` + `JavaScript`

This section will combine 
`LiveView` and `JavaScript`
to create the stopwatch logic. 
On `start|stop|reset` 
the `LiveView` will save
the state of the stopwatch.
The `JavaScript` is then responsible 
for handling the `start|stop`.

Open the `lib/stopwatch_web/router.ex` file 
and define a new endpoint `/stopwatch-js`:

```elixir
live("/stopwatch-js", StopwatchLiveJS)
```

Next create a new file at:
`lib/stopwatch_web/live/stopwatch_live_js.ex`
and add the
`StopwatchLiveJS` module definition:


```elixir
defmodule StopwatchWeb.StopwatchLiveJS do
  use StopwatchWeb, :live_view
  alias Stopwatch.TimerDB

  def mount(_params, _session, socket) do
    if connected?(socket), do: TimerDB.subscribe()

    # {timer_status, time} = TimerServer.get_timer_state(Stopwatch.TimerServer)
    # {:ok, assign(socket, time: time, timer_status: timer_status)}
    {status, start, stop} = TimerDB.get_timer_state(Stopwatch.TimerDB)
    TimerDB.notify()
    {:ok, assign(socket, timer_status: status, start: start, stop: stop)}
  end

  def render(assigns) do
    Phoenix.View.render(StopwatchWeb.StopwatchView, "stopwatch_js.html", assigns)
  end

  def handle_event("start", _value, socket) do
    TimerDB.start_timer(Stopwatch.TimerDB)

    TimerDB.notify()
    {:noreply, socket}
  end

  def handle_event("stop", _value, socket) do
    TimerDB.stop_timer(Stopwatch.TimerDB)
    TimerDB.notify()
    {:noreply, socket}
  end

  def handle_event("reset", _value, socket) do
    TimerDB.reset_timer(Stopwatch.TimerDB)
    TimerDB.notify()
    {:noreply, socket}
  end

  def handle_info(:timer_updated, socket) do
    {timer_status, start, stop} = TimerDB.get_timer_state(Stopwatch.TimerDB)
    socket = assign(socket, timer_status: timer_status, start: start, stop: stop)

    {:noreply,
     push_event(socket, "timerUpdated", %{timer_status: timer_status, start: start, stop: stop})}
  end
end
```

`TimerDB` is an `Agent` used 
to store the stopwatch status as a `tuple`:
`{status, start_time, stop_time}`

Since we have created the project with 
`mix phx.new --no-ecto` 
it was easier
to use `Agent` but you can also use a `database`
(e.g. `Postgres`) 
to store the state
of the stopwatch.

The module listens for 
"start", "stop" and "reset" events, 
saves the updated status
using the `TimerDB` module 
and notifies the changes 
to connected clients with 
`handle_info`

The template is defined in:
`lib/stopwatch_web/templates/stopwatch/stopwatch_js.html.heex`:

```html
<h1 id="timer">00:00:00</h1>

<%= if @timer_status == :stopped do %>
  <button phx-click="start">Start</button>
<% end %>

<%= if @timer_status == :running do %>
  <button phx-click="stop">Stop</button>
<% end %>

<button phx-click="reset">Reset</button>
```

Finally update the 
`assets/js/app.js` file 
to add the stopwatch logic:

```js
timer = document.getElementById("timer")
T = {ticking: false}
window.addEventListener("phx:timerUpdated", e => {
  if (e.detail.timer_status == "running" && !T.ticking) {
          T.ticking = true
          T.timerInterval = setInterval(function() {
            text = timer_text(new Date(e.detail.start), Date.now())
            timer.textContent = text
          }, 1000);
  }

  if (e.detail.timer_status == "stopped") {
    clearInterval(T.timerInterval)
    T.ticking = false
    text = timer_text(new Date(e.detail.start), new Date(e.detail.stop))
    timer.textContent = text
  }
})
 
function leftPad(val) {
  return val < 10 ? '0' + String(val) : val;
}

function timer_text(start, current) {
  let h="00", m="00", s="00";
  const diff = current - start;
  // seconds
  if(diff > 1000) {
    s = Math.floor(diff / 1000);
    s = s > 60 ? s % 60 : s;
    s = leftPad(s);
  }
  // minutes
  if(diff > 60000) {
    m = Math.floor(diff/60000);
    m = m > 60 ? m % 60 : leftPad(m);
  }
  // hours
  if(diff > 3600000) {
    h = Math.floor(diff/3600000);
    h = leftPad(h)
    }

   return h + ':' + m + ':' + s;
}
```

The important part is 
where we trigger the ticking process:

```js
window.addEventListener("phx:timerUpdated", e => {
  if (e.detail.timer_status == "running" && !T.ticking) {
    T.ticking = true
    T.timerInterval = setInterval(function() {
      text = timer_text(new Date(e.detail.start), Date.now())
      timer.textContent = text
    }, 1000);
  }
})
```
 
`setInterval` is called 
when the stopwatch is started 
and every `1s` we _compare_
the `start` time (unix time/epoch) 
to the `current` `Date.now()` time.

The rest of the logic is borrowed from: 
[dwyl/learn-alpine.js#stopwatch](https://github.com/dwyl/learn-alpine.js#stopwatch-%EF%B8%8F)

## What's _next_?

If you found this example useful, 
please ⭐️ the GitHub repository
so we (_and others_) know you liked it!

Your feedback is always very welcome!

If you think of other features
you want to add,
please 
[**open an issue**](https://github.com/dwyl/phoenix-liveview-stopwatch/issues)
to discuss!

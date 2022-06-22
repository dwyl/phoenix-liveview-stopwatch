// We import the CSS which is extracted to its own file by esbuild.
// Remove this line if you add a your own CSS build pipeline (e.g postcss).
import "../css/app.css"

// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
// import "./user_socket.js"

// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "../vendor/some-package.js"
//
// Alternatively, you can `npm install some-package --prefix assets` and import
// them using a path starting with the package name:
//
//     import "some-package"
//

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html"
// Establish Phoenix Socket and LiveView configuration.
import {Socket} from "phoenix"
import {LiveSocket} from "phoenix_live_view"
import topbar from "../vendor/topbar"

let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
let liveSocket = new LiveSocket("/live", Socket, {params: {_csrf_token: csrfToken}})

// Show progress bar on live navigation and form submits
topbar.config({barColors: {0: "#29d"}, shadowColor: "rgba(0, 0, 0, .3)"})
window.addEventListener("phx:page-loading-start", info => topbar.show())
window.addEventListener("phx:page-loading-stop", info => topbar.hide())
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
// connect if there are any LiveViews on the page
liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket


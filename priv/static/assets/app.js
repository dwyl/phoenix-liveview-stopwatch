(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));

  // vendor/topbar.js
  var require_topbar = __commonJS({
    "vendor/topbar.js"(exports, module) {
      (function(window2, document2) {
        "use strict";
        (function() {
          var lastTime = 0;
          var vendors = ["ms", "moz", "webkit", "o"];
          for (var x = 0; x < vendors.length && !window2.requestAnimationFrame; ++x) {
            window2.requestAnimationFrame = window2[vendors[x] + "RequestAnimationFrame"];
            window2.cancelAnimationFrame = window2[vendors[x] + "CancelAnimationFrame"] || window2[vendors[x] + "CancelRequestAnimationFrame"];
          }
          if (!window2.requestAnimationFrame)
            window2.requestAnimationFrame = function(callback, element) {
              var currTime = new Date().getTime();
              var timeToCall = Math.max(0, 16 - (currTime - lastTime));
              var id = window2.setTimeout(function() {
                callback(currTime + timeToCall);
              }, timeToCall);
              lastTime = currTime + timeToCall;
              return id;
            };
          if (!window2.cancelAnimationFrame)
            window2.cancelAnimationFrame = function(id) {
              clearTimeout(id);
            };
        })();
        var canvas, progressTimerId, fadeTimerId, currentProgress, showing, addEvent = function(elem, type, handler) {
          if (elem.addEventListener)
            elem.addEventListener(type, handler, false);
          else if (elem.attachEvent)
            elem.attachEvent("on" + type, handler);
          else
            elem["on" + type] = handler;
        }, options = {
          autoRun: true,
          barThickness: 3,
          barColors: {
            0: "rgba(26,  188, 156, .9)",
            ".25": "rgba(52,  152, 219, .9)",
            ".50": "rgba(241, 196, 15,  .9)",
            ".75": "rgba(230, 126, 34,  .9)",
            "1.0": "rgba(211, 84,  0,   .9)"
          },
          shadowBlur: 10,
          shadowColor: "rgba(0,   0,   0,   .6)",
          className: null
        }, repaint = function() {
          canvas.width = window2.innerWidth;
          canvas.height = options.barThickness * 5;
          var ctx = canvas.getContext("2d");
          ctx.shadowBlur = options.shadowBlur;
          ctx.shadowColor = options.shadowColor;
          var lineGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
          for (var stop in options.barColors)
            lineGradient.addColorStop(stop, options.barColors[stop]);
          ctx.lineWidth = options.barThickness;
          ctx.beginPath();
          ctx.moveTo(0, options.barThickness / 2);
          ctx.lineTo(Math.ceil(currentProgress * canvas.width), options.barThickness / 2);
          ctx.strokeStyle = lineGradient;
          ctx.stroke();
        }, createCanvas = function() {
          canvas = document2.createElement("canvas");
          var style = canvas.style;
          style.position = "fixed";
          style.top = style.left = style.right = style.margin = style.padding = 0;
          style.zIndex = 100001;
          style.display = "none";
          if (options.className)
            canvas.classList.add(options.className);
          document2.body.appendChild(canvas);
          addEvent(window2, "resize", repaint);
        }, topbar2 = {
          config: function(opts) {
            for (var key in opts)
              if (options.hasOwnProperty(key))
                options[key] = opts[key];
          },
          show: function() {
            if (showing)
              return;
            showing = true;
            if (fadeTimerId !== null)
              window2.cancelAnimationFrame(fadeTimerId);
            if (!canvas)
              createCanvas();
            canvas.style.opacity = 1;
            canvas.style.display = "block";
            topbar2.progress(0);
            if (options.autoRun) {
              (function loop() {
                progressTimerId = window2.requestAnimationFrame(loop);
                topbar2.progress("+" + 0.05 * Math.pow(1 - Math.sqrt(currentProgress), 2));
              })();
            }
          },
          progress: function(to) {
            if (typeof to === "undefined")
              return currentProgress;
            if (typeof to === "string") {
              to = (to.indexOf("+") >= 0 || to.indexOf("-") >= 0 ? currentProgress : 0) + parseFloat(to);
            }
            currentProgress = to > 1 ? 1 : to;
            repaint();
            return currentProgress;
          },
          hide: function() {
            if (!showing)
              return;
            showing = false;
            if (progressTimerId != null) {
              window2.cancelAnimationFrame(progressTimerId);
              progressTimerId = null;
            }
            (function loop() {
              if (topbar2.progress("+.1") >= 1) {
                canvas.style.opacity -= 0.05;
                if (canvas.style.opacity <= 0.05) {
                  canvas.style.display = "none";
                  fadeTimerId = null;
                  return;
                }
              }
              fadeTimerId = window2.requestAnimationFrame(loop);
            })();
          }
        };
        if (typeof module === "object" && typeof module.exports === "object") {
          module.exports = topbar2;
        } else if (typeof define === "function" && define.amd) {
          define(function() {
            return topbar2;
          });
        } else {
          this.topbar = topbar2;
        }
      }).call(exports, window, document);
    }
  });

  // ../deps/phoenix_html/priv/static/phoenix_html.js
  (function() {
    var PolyfillEvent = eventConstructor();
    function eventConstructor() {
      if (typeof window.CustomEvent === "function")
        return window.CustomEvent;
      function CustomEvent2(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: void 0 };
        var evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
      }
      CustomEvent2.prototype = window.Event.prototype;
      return CustomEvent2;
    }
    function buildHiddenInput(name, value) {
      var input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      return input;
    }
    function handleClick(element, targetModifierKey) {
      var to = element.getAttribute("data-to"), method = buildHiddenInput("_method", element.getAttribute("data-method")), csrf = buildHiddenInput("_csrf_token", element.getAttribute("data-csrf")), form = document.createElement("form"), target = element.getAttribute("target");
      form.method = element.getAttribute("data-method") === "get" ? "get" : "post";
      form.action = to;
      form.style.display = "hidden";
      if (target)
        form.target = target;
      else if (targetModifierKey)
        form.target = "_blank";
      form.appendChild(csrf);
      form.appendChild(method);
      document.body.appendChild(form);
      form.submit();
    }
    window.addEventListener("click", function(e) {
      var element = e.target;
      if (e.defaultPrevented)
        return;
      while (element && element.getAttribute) {
        var phoenixLinkEvent = new PolyfillEvent("phoenix.link.click", {
          "bubbles": true,
          "cancelable": true
        });
        if (!element.dispatchEvent(phoenixLinkEvent)) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return false;
        }
        if (element.getAttribute("data-method")) {
          handleClick(element, e.metaKey || e.shiftKey);
          e.preventDefault();
          return false;
        } else {
          element = element.parentNode;
        }
      }
    }, false);
    window.addEventListener("phoenix.link.click", function(e) {
      var message = e.target.getAttribute("data-confirm");
      if (message && !window.confirm(message)) {
        e.preventDefault();
      }
    }, false);
  })();

  // ../deps/phoenix/priv/static/phoenix.mjs
  var closure = (value) => {
    if (typeof value === "function") {
      return value;
    } else {
      let closure22 = function() {
        return value;
      };
      return closure22;
    }
  };
  var globalSelf = typeof self !== "undefined" ? self : null;
  var phxWindow = typeof window !== "undefined" ? window : null;
  var global = globalSelf || phxWindow || global;
  var DEFAULT_VSN = "2.0.0";
  var SOCKET_STATES = { connecting: 0, open: 1, closing: 2, closed: 3 };
  var DEFAULT_TIMEOUT = 1e4;
  var WS_CLOSE_NORMAL = 1e3;
  var CHANNEL_STATES = {
    closed: "closed",
    errored: "errored",
    joined: "joined",
    joining: "joining",
    leaving: "leaving"
  };
  var CHANNEL_EVENTS = {
    close: "phx_close",
    error: "phx_error",
    join: "phx_join",
    reply: "phx_reply",
    leave: "phx_leave"
  };
  var TRANSPORTS = {
    longpoll: "longpoll",
    websocket: "websocket"
  };
  var XHR_STATES = {
    complete: 4
  };
  var Push = class {
    constructor(channel, event, payload, timeout) {
      this.channel = channel;
      this.event = event;
      this.payload = payload || function() {
        return {};
      };
      this.receivedResp = null;
      this.timeout = timeout;
      this.timeoutTimer = null;
      this.recHooks = [];
      this.sent = false;
    }
    resend(timeout) {
      this.timeout = timeout;
      this.reset();
      this.send();
    }
    send() {
      if (this.hasReceived("timeout")) {
        return;
      }
      this.startTimeout();
      this.sent = true;
      this.channel.socket.push({
        topic: this.channel.topic,
        event: this.event,
        payload: this.payload(),
        ref: this.ref,
        join_ref: this.channel.joinRef()
      });
    }
    receive(status, callback) {
      if (this.hasReceived(status)) {
        callback(this.receivedResp.response);
      }
      this.recHooks.push({ status, callback });
      return this;
    }
    reset() {
      this.cancelRefEvent();
      this.ref = null;
      this.refEvent = null;
      this.receivedResp = null;
      this.sent = false;
    }
    matchReceive({ status, response, _ref }) {
      this.recHooks.filter((h) => h.status === status).forEach((h) => h.callback(response));
    }
    cancelRefEvent() {
      if (!this.refEvent) {
        return;
      }
      this.channel.off(this.refEvent);
    }
    cancelTimeout() {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }
    startTimeout() {
      if (this.timeoutTimer) {
        this.cancelTimeout();
      }
      this.ref = this.channel.socket.makeRef();
      this.refEvent = this.channel.replyEventName(this.ref);
      this.channel.on(this.refEvent, (payload) => {
        this.cancelRefEvent();
        this.cancelTimeout();
        this.receivedResp = payload;
        this.matchReceive(payload);
      });
      this.timeoutTimer = setTimeout(() => {
        this.trigger("timeout", {});
      }, this.timeout);
    }
    hasReceived(status) {
      return this.receivedResp && this.receivedResp.status === status;
    }
    trigger(status, response) {
      this.channel.trigger(this.refEvent, { status, response });
    }
  };
  var Timer = class {
    constructor(callback, timerCalc) {
      this.callback = callback;
      this.timerCalc = timerCalc;
      this.timer = null;
      this.tries = 0;
    }
    reset() {
      this.tries = 0;
      clearTimeout(this.timer);
    }
    scheduleTimeout() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.tries = this.tries + 1;
        this.callback();
      }, this.timerCalc(this.tries + 1));
    }
  };
  var Channel = class {
    constructor(topic, params, socket) {
      this.state = CHANNEL_STATES.closed;
      this.topic = topic;
      this.params = closure(params || {});
      this.socket = socket;
      this.bindings = [];
      this.bindingRef = 0;
      this.timeout = this.socket.timeout;
      this.joinedOnce = false;
      this.joinPush = new Push(this, CHANNEL_EVENTS.join, this.params, this.timeout);
      this.pushBuffer = [];
      this.stateChangeRefs = [];
      this.rejoinTimer = new Timer(() => {
        if (this.socket.isConnected()) {
          this.rejoin();
        }
      }, this.socket.rejoinAfterMs);
      this.stateChangeRefs.push(this.socket.onError(() => this.rejoinTimer.reset()));
      this.stateChangeRefs.push(this.socket.onOpen(() => {
        this.rejoinTimer.reset();
        if (this.isErrored()) {
          this.rejoin();
        }
      }));
      this.joinPush.receive("ok", () => {
        this.state = CHANNEL_STATES.joined;
        this.rejoinTimer.reset();
        this.pushBuffer.forEach((pushEvent) => pushEvent.send());
        this.pushBuffer = [];
      });
      this.joinPush.receive("error", () => {
        this.state = CHANNEL_STATES.errored;
        if (this.socket.isConnected()) {
          this.rejoinTimer.scheduleTimeout();
        }
      });
      this.onClose(() => {
        this.rejoinTimer.reset();
        if (this.socket.hasLogger())
          this.socket.log("channel", `close ${this.topic} ${this.joinRef()}`);
        this.state = CHANNEL_STATES.closed;
        this.socket.remove(this);
      });
      this.onError((reason) => {
        if (this.socket.hasLogger())
          this.socket.log("channel", `error ${this.topic}`, reason);
        if (this.isJoining()) {
          this.joinPush.reset();
        }
        this.state = CHANNEL_STATES.errored;
        if (this.socket.isConnected()) {
          this.rejoinTimer.scheduleTimeout();
        }
      });
      this.joinPush.receive("timeout", () => {
        if (this.socket.hasLogger())
          this.socket.log("channel", `timeout ${this.topic} (${this.joinRef()})`, this.joinPush.timeout);
        let leavePush = new Push(this, CHANNEL_EVENTS.leave, closure({}), this.timeout);
        leavePush.send();
        this.state = CHANNEL_STATES.errored;
        this.joinPush.reset();
        if (this.socket.isConnected()) {
          this.rejoinTimer.scheduleTimeout();
        }
      });
      this.on(CHANNEL_EVENTS.reply, (payload, ref) => {
        this.trigger(this.replyEventName(ref), payload);
      });
    }
    join(timeout = this.timeout) {
      if (this.joinedOnce) {
        throw new Error("tried to join multiple times. 'join' can only be called a single time per channel instance");
      } else {
        this.timeout = timeout;
        this.joinedOnce = true;
        this.rejoin();
        return this.joinPush;
      }
    }
    onClose(callback) {
      this.on(CHANNEL_EVENTS.close, callback);
    }
    onError(callback) {
      return this.on(CHANNEL_EVENTS.error, (reason) => callback(reason));
    }
    on(event, callback) {
      let ref = this.bindingRef++;
      this.bindings.push({ event, ref, callback });
      return ref;
    }
    off(event, ref) {
      this.bindings = this.bindings.filter((bind) => {
        return !(bind.event === event && (typeof ref === "undefined" || ref === bind.ref));
      });
    }
    canPush() {
      return this.socket.isConnected() && this.isJoined();
    }
    push(event, payload, timeout = this.timeout) {
      payload = payload || {};
      if (!this.joinedOnce) {
        throw new Error(`tried to push '${event}' to '${this.topic}' before joining. Use channel.join() before pushing events`);
      }
      let pushEvent = new Push(this, event, function() {
        return payload;
      }, timeout);
      if (this.canPush()) {
        pushEvent.send();
      } else {
        pushEvent.startTimeout();
        this.pushBuffer.push(pushEvent);
      }
      return pushEvent;
    }
    leave(timeout = this.timeout) {
      this.rejoinTimer.reset();
      this.joinPush.cancelTimeout();
      this.state = CHANNEL_STATES.leaving;
      let onClose = () => {
        if (this.socket.hasLogger())
          this.socket.log("channel", `leave ${this.topic}`);
        this.trigger(CHANNEL_EVENTS.close, "leave");
      };
      let leavePush = new Push(this, CHANNEL_EVENTS.leave, closure({}), timeout);
      leavePush.receive("ok", () => onClose()).receive("timeout", () => onClose());
      leavePush.send();
      if (!this.canPush()) {
        leavePush.trigger("ok", {});
      }
      return leavePush;
    }
    onMessage(_event, payload, _ref) {
      return payload;
    }
    isMember(topic, event, payload, joinRef) {
      if (this.topic !== topic) {
        return false;
      }
      if (joinRef && joinRef !== this.joinRef()) {
        if (this.socket.hasLogger())
          this.socket.log("channel", "dropping outdated message", { topic, event, payload, joinRef });
        return false;
      } else {
        return true;
      }
    }
    joinRef() {
      return this.joinPush.ref;
    }
    rejoin(timeout = this.timeout) {
      if (this.isLeaving()) {
        return;
      }
      this.socket.leaveOpenTopic(this.topic);
      this.state = CHANNEL_STATES.joining;
      this.joinPush.resend(timeout);
    }
    trigger(event, payload, ref, joinRef) {
      let handledPayload = this.onMessage(event, payload, ref, joinRef);
      if (payload && !handledPayload) {
        throw new Error("channel onMessage callbacks must return the payload, modified or unmodified");
      }
      let eventBindings = this.bindings.filter((bind) => bind.event === event);
      for (let i = 0; i < eventBindings.length; i++) {
        let bind = eventBindings[i];
        bind.callback(handledPayload, ref, joinRef || this.joinRef());
      }
    }
    replyEventName(ref) {
      return `chan_reply_${ref}`;
    }
    isClosed() {
      return this.state === CHANNEL_STATES.closed;
    }
    isErrored() {
      return this.state === CHANNEL_STATES.errored;
    }
    isJoined() {
      return this.state === CHANNEL_STATES.joined;
    }
    isJoining() {
      return this.state === CHANNEL_STATES.joining;
    }
    isLeaving() {
      return this.state === CHANNEL_STATES.leaving;
    }
  };
  var Ajax = class {
    static request(method, endPoint, accept, body, timeout, ontimeout, callback) {
      if (global.XDomainRequest) {
        let req = new global.XDomainRequest();
        this.xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback);
      } else {
        let req = new global.XMLHttpRequest();
        this.xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback);
      }
    }
    static xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback) {
      req.timeout = timeout;
      req.open(method, endPoint);
      req.onload = () => {
        let response = this.parseJSON(req.responseText);
        callback && callback(response);
      };
      if (ontimeout) {
        req.ontimeout = ontimeout;
      }
      req.onprogress = () => {
      };
      req.send(body);
    }
    static xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback) {
      req.open(method, endPoint, true);
      req.timeout = timeout;
      req.setRequestHeader("Content-Type", accept);
      req.onerror = () => {
        callback && callback(null);
      };
      req.onreadystatechange = () => {
        if (req.readyState === XHR_STATES.complete && callback) {
          let response = this.parseJSON(req.responseText);
          callback(response);
        }
      };
      if (ontimeout) {
        req.ontimeout = ontimeout;
      }
      req.send(body);
    }
    static parseJSON(resp) {
      if (!resp || resp === "") {
        return null;
      }
      try {
        return JSON.parse(resp);
      } catch (e) {
        console && console.log("failed to parse JSON response", resp);
        return null;
      }
    }
    static serialize(obj, parentKey) {
      let queryStr = [];
      for (var key in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) {
          continue;
        }
        let paramKey = parentKey ? `${parentKey}[${key}]` : key;
        let paramVal = obj[key];
        if (typeof paramVal === "object") {
          queryStr.push(this.serialize(paramVal, paramKey));
        } else {
          queryStr.push(encodeURIComponent(paramKey) + "=" + encodeURIComponent(paramVal));
        }
      }
      return queryStr.join("&");
    }
    static appendParams(url, params) {
      if (Object.keys(params).length === 0) {
        return url;
      }
      let prefix = url.match(/\?/) ? "&" : "?";
      return `${url}${prefix}${this.serialize(params)}`;
    }
  };
  var LongPoll = class {
    constructor(endPoint) {
      this.endPoint = null;
      this.token = null;
      this.skipHeartbeat = true;
      this.onopen = function() {
      };
      this.onerror = function() {
      };
      this.onmessage = function() {
      };
      this.onclose = function() {
      };
      this.pollEndpoint = this.normalizeEndpoint(endPoint);
      this.readyState = SOCKET_STATES.connecting;
      this.poll();
    }
    normalizeEndpoint(endPoint) {
      return endPoint.replace("ws://", "http://").replace("wss://", "https://").replace(new RegExp("(.*)/" + TRANSPORTS.websocket), "$1/" + TRANSPORTS.longpoll);
    }
    endpointURL() {
      return Ajax.appendParams(this.pollEndpoint, { token: this.token });
    }
    closeAndRetry(code, reason, wasClean) {
      this.close(code, reason, wasClean);
      this.readyState = SOCKET_STATES.connecting;
    }
    ontimeout() {
      this.onerror("timeout");
      this.closeAndRetry(1005, "timeout", false);
    }
    poll() {
      if (!(this.readyState === SOCKET_STATES.open || this.readyState === SOCKET_STATES.connecting)) {
        return;
      }
      Ajax.request("GET", this.endpointURL(), "application/json", null, this.timeout, this.ontimeout.bind(this), (resp) => {
        if (resp) {
          var { status, token, messages } = resp;
          this.token = token;
        } else {
          status = 0;
        }
        switch (status) {
          case 200:
            messages.forEach((msg) => {
              setTimeout(() => {
                this.onmessage({ data: msg });
              }, 0);
            });
            this.poll();
            break;
          case 204:
            this.poll();
            break;
          case 410:
            this.readyState = SOCKET_STATES.open;
            this.onopen({});
            this.poll();
            break;
          case 403:
            this.onerror(403);
            this.close(1008, "forbidden", false);
            break;
          case 0:
          case 500:
            this.onerror(500);
            this.closeAndRetry(1011, "internal server error", 500);
            break;
          default:
            throw new Error(`unhandled poll status ${status}`);
        }
      });
    }
    send(body) {
      Ajax.request("POST", this.endpointURL(), "application/json", body, this.timeout, this.onerror.bind(this, "timeout"), (resp) => {
        if (!resp || resp.status !== 200) {
          this.onerror(resp && resp.status);
          this.closeAndRetry(1011, "internal server error", false);
        }
      });
    }
    close(code, reason, wasClean) {
      this.readyState = SOCKET_STATES.closed;
      let opts = Object.assign({ code: 1e3, reason: void 0, wasClean: true }, { code, reason, wasClean });
      if (typeof CloseEvent !== "undefined") {
        this.onclose(new CloseEvent("close", opts));
      } else {
        this.onclose(opts);
      }
    }
  };
  var serializer_default = {
    HEADER_LENGTH: 1,
    META_LENGTH: 4,
    KINDS: { push: 0, reply: 1, broadcast: 2 },
    encode(msg, callback) {
      if (msg.payload.constructor === ArrayBuffer) {
        return callback(this.binaryEncode(msg));
      } else {
        let payload = [msg.join_ref, msg.ref, msg.topic, msg.event, msg.payload];
        return callback(JSON.stringify(payload));
      }
    },
    decode(rawPayload, callback) {
      if (rawPayload.constructor === ArrayBuffer) {
        return callback(this.binaryDecode(rawPayload));
      } else {
        let [join_ref, ref, topic, event, payload] = JSON.parse(rawPayload);
        return callback({ join_ref, ref, topic, event, payload });
      }
    },
    binaryEncode(message) {
      let { join_ref, ref, event, topic, payload } = message;
      let metaLength = this.META_LENGTH + join_ref.length + ref.length + topic.length + event.length;
      let header = new ArrayBuffer(this.HEADER_LENGTH + metaLength);
      let view = new DataView(header);
      let offset = 0;
      view.setUint8(offset++, this.KINDS.push);
      view.setUint8(offset++, join_ref.length);
      view.setUint8(offset++, ref.length);
      view.setUint8(offset++, topic.length);
      view.setUint8(offset++, event.length);
      Array.from(join_ref, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(ref, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(topic, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(event, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      var combined = new Uint8Array(header.byteLength + payload.byteLength);
      combined.set(new Uint8Array(header), 0);
      combined.set(new Uint8Array(payload), header.byteLength);
      return combined.buffer;
    },
    binaryDecode(buffer) {
      let view = new DataView(buffer);
      let kind = view.getUint8(0);
      let decoder = new TextDecoder();
      switch (kind) {
        case this.KINDS.push:
          return this.decodePush(buffer, view, decoder);
        case this.KINDS.reply:
          return this.decodeReply(buffer, view, decoder);
        case this.KINDS.broadcast:
          return this.decodeBroadcast(buffer, view, decoder);
      }
    },
    decodePush(buffer, view, decoder) {
      let joinRefSize = view.getUint8(1);
      let topicSize = view.getUint8(2);
      let eventSize = view.getUint8(3);
      let offset = this.HEADER_LENGTH + this.META_LENGTH - 1;
      let joinRef = decoder.decode(buffer.slice(offset, offset + joinRefSize));
      offset = offset + joinRefSize;
      let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
      offset = offset + topicSize;
      let event = decoder.decode(buffer.slice(offset, offset + eventSize));
      offset = offset + eventSize;
      let data = buffer.slice(offset, buffer.byteLength);
      return { join_ref: joinRef, ref: null, topic, event, payload: data };
    },
    decodeReply(buffer, view, decoder) {
      let joinRefSize = view.getUint8(1);
      let refSize = view.getUint8(2);
      let topicSize = view.getUint8(3);
      let eventSize = view.getUint8(4);
      let offset = this.HEADER_LENGTH + this.META_LENGTH;
      let joinRef = decoder.decode(buffer.slice(offset, offset + joinRefSize));
      offset = offset + joinRefSize;
      let ref = decoder.decode(buffer.slice(offset, offset + refSize));
      offset = offset + refSize;
      let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
      offset = offset + topicSize;
      let event = decoder.decode(buffer.slice(offset, offset + eventSize));
      offset = offset + eventSize;
      let data = buffer.slice(offset, buffer.byteLength);
      let payload = { status: event, response: data };
      return { join_ref: joinRef, ref, topic, event: CHANNEL_EVENTS.reply, payload };
    },
    decodeBroadcast(buffer, view, decoder) {
      let topicSize = view.getUint8(1);
      let eventSize = view.getUint8(2);
      let offset = this.HEADER_LENGTH + 2;
      let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
      offset = offset + topicSize;
      let event = decoder.decode(buffer.slice(offset, offset + eventSize));
      offset = offset + eventSize;
      let data = buffer.slice(offset, buffer.byteLength);
      return { join_ref: null, ref: null, topic, event, payload: data };
    }
  };
  var Socket = class {
    constructor(endPoint, opts = {}) {
      this.stateChangeCallbacks = { open: [], close: [], error: [], message: [] };
      this.channels = [];
      this.sendBuffer = [];
      this.ref = 0;
      this.timeout = opts.timeout || DEFAULT_TIMEOUT;
      this.transport = opts.transport || global.WebSocket || LongPoll;
      this.establishedConnections = 0;
      this.defaultEncoder = serializer_default.encode.bind(serializer_default);
      this.defaultDecoder = serializer_default.decode.bind(serializer_default);
      this.closeWasClean = false;
      this.binaryType = opts.binaryType || "arraybuffer";
      this.connectClock = 1;
      if (this.transport !== LongPoll) {
        this.encode = opts.encode || this.defaultEncoder;
        this.decode = opts.decode || this.defaultDecoder;
      } else {
        this.encode = this.defaultEncoder;
        this.decode = this.defaultDecoder;
      }
      let awaitingConnectionOnPageShow = null;
      if (phxWindow && phxWindow.addEventListener) {
        phxWindow.addEventListener("pagehide", (_e) => {
          if (this.conn) {
            this.disconnect();
            awaitingConnectionOnPageShow = this.connectClock;
          }
        });
        phxWindow.addEventListener("pageshow", (_e) => {
          if (awaitingConnectionOnPageShow === this.connectClock) {
            awaitingConnectionOnPageShow = null;
            this.connect();
          }
        });
      }
      this.heartbeatIntervalMs = opts.heartbeatIntervalMs || 3e4;
      this.rejoinAfterMs = (tries) => {
        if (opts.rejoinAfterMs) {
          return opts.rejoinAfterMs(tries);
        } else {
          return [1e3, 2e3, 5e3][tries - 1] || 1e4;
        }
      };
      this.reconnectAfterMs = (tries) => {
        if (opts.reconnectAfterMs) {
          return opts.reconnectAfterMs(tries);
        } else {
          return [10, 50, 100, 150, 200, 250, 500, 1e3, 2e3][tries - 1] || 5e3;
        }
      };
      this.logger = opts.logger || null;
      this.longpollerTimeout = opts.longpollerTimeout || 2e4;
      this.params = closure(opts.params || {});
      this.endPoint = `${endPoint}/${TRANSPORTS.websocket}`;
      this.vsn = opts.vsn || DEFAULT_VSN;
      this.heartbeatTimer = null;
      this.pendingHeartbeatRef = null;
      this.reconnectTimer = new Timer(() => {
        this.teardown(() => this.connect());
      }, this.reconnectAfterMs);
    }
    replaceTransport(newTransport) {
      this.disconnect();
      this.transport = newTransport;
    }
    protocol() {
      return location.protocol.match(/^https/) ? "wss" : "ws";
    }
    endPointURL() {
      let uri = Ajax.appendParams(Ajax.appendParams(this.endPoint, this.params()), { vsn: this.vsn });
      if (uri.charAt(0) !== "/") {
        return uri;
      }
      if (uri.charAt(1) === "/") {
        return `${this.protocol()}:${uri}`;
      }
      return `${this.protocol()}://${location.host}${uri}`;
    }
    disconnect(callback, code, reason) {
      this.connectClock++;
      this.closeWasClean = true;
      this.reconnectTimer.reset();
      this.teardown(callback, code, reason);
    }
    connect(params) {
      this.connectClock++;
      if (params) {
        console && console.log("passing params to connect is deprecated. Instead pass :params to the Socket constructor");
        this.params = closure(params);
      }
      if (this.conn) {
        return;
      }
      this.closeWasClean = false;
      this.conn = new this.transport(this.endPointURL());
      this.conn.binaryType = this.binaryType;
      this.conn.timeout = this.longpollerTimeout;
      this.conn.onopen = () => this.onConnOpen();
      this.conn.onerror = (error) => this.onConnError(error);
      this.conn.onmessage = (event) => this.onConnMessage(event);
      this.conn.onclose = (event) => this.onConnClose(event);
    }
    log(kind, msg, data) {
      this.logger(kind, msg, data);
    }
    hasLogger() {
      return this.logger !== null;
    }
    onOpen(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.open.push([ref, callback]);
      return ref;
    }
    onClose(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.close.push([ref, callback]);
      return ref;
    }
    onError(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.error.push([ref, callback]);
      return ref;
    }
    onMessage(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.message.push([ref, callback]);
      return ref;
    }
    ping(callback) {
      if (!this.isConnected()) {
        return false;
      }
      let ref = this.makeRef();
      let startTime = Date.now();
      this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref });
      let onMsgRef = this.onMessage((msg) => {
        if (msg.ref === ref) {
          this.off([onMsgRef]);
          callback(Date.now() - startTime);
        }
      });
      return true;
    }
    onConnOpen() {
      if (this.hasLogger())
        this.log("transport", `connected to ${this.endPointURL()}`);
      this.closeWasClean = false;
      this.establishedConnections++;
      this.flushSendBuffer();
      this.reconnectTimer.reset();
      this.resetHeartbeat();
      this.stateChangeCallbacks.open.forEach(([, callback]) => callback());
    }
    heartbeatTimeout() {
      if (this.pendingHeartbeatRef) {
        this.pendingHeartbeatRef = null;
        if (this.hasLogger()) {
          this.log("transport", "heartbeat timeout. Attempting to re-establish connection");
        }
        this.abnormalClose("heartbeat timeout");
      }
    }
    resetHeartbeat() {
      if (this.conn && this.conn.skipHeartbeat) {
        return;
      }
      this.pendingHeartbeatRef = null;
      clearTimeout(this.heartbeatTimer);
      setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
    }
    teardown(callback, code, reason) {
      if (!this.conn) {
        return callback && callback();
      }
      this.waitForBufferDone(() => {
        if (this.conn) {
          if (code) {
            this.conn.close(code, reason || "");
          } else {
            this.conn.close();
          }
        }
        this.waitForSocketClosed(() => {
          if (this.conn) {
            this.conn.onclose = function() {
            };
            this.conn = null;
          }
          callback && callback();
        });
      });
    }
    waitForBufferDone(callback, tries = 1) {
      if (tries === 5 || !this.conn || !this.conn.bufferedAmount) {
        callback();
        return;
      }
      setTimeout(() => {
        this.waitForBufferDone(callback, tries + 1);
      }, 150 * tries);
    }
    waitForSocketClosed(callback, tries = 1) {
      if (tries === 5 || !this.conn || this.conn.readyState === SOCKET_STATES.closed) {
        callback();
        return;
      }
      setTimeout(() => {
        this.waitForSocketClosed(callback, tries + 1);
      }, 150 * tries);
    }
    onConnClose(event) {
      let closeCode = event && event.code;
      if (this.hasLogger())
        this.log("transport", "close", event);
      this.triggerChanError();
      clearTimeout(this.heartbeatTimer);
      if (!this.closeWasClean && closeCode !== 1e3) {
        this.reconnectTimer.scheduleTimeout();
      }
      this.stateChangeCallbacks.close.forEach(([, callback]) => callback(event));
    }
    onConnError(error) {
      if (this.hasLogger())
        this.log("transport", error);
      let transportBefore = this.transport;
      let establishedBefore = this.establishedConnections;
      this.stateChangeCallbacks.error.forEach(([, callback]) => {
        callback(error, transportBefore, establishedBefore);
      });
      if (transportBefore === this.transport || establishedBefore > 0) {
        this.triggerChanError();
      }
    }
    triggerChanError() {
      this.channels.forEach((channel) => {
        if (!(channel.isErrored() || channel.isLeaving() || channel.isClosed())) {
          channel.trigger(CHANNEL_EVENTS.error);
        }
      });
    }
    connectionState() {
      switch (this.conn && this.conn.readyState) {
        case SOCKET_STATES.connecting:
          return "connecting";
        case SOCKET_STATES.open:
          return "open";
        case SOCKET_STATES.closing:
          return "closing";
        default:
          return "closed";
      }
    }
    isConnected() {
      return this.connectionState() === "open";
    }
    remove(channel) {
      this.off(channel.stateChangeRefs);
      this.channels = this.channels.filter((c) => c.joinRef() !== channel.joinRef());
    }
    off(refs) {
      for (let key in this.stateChangeCallbacks) {
        this.stateChangeCallbacks[key] = this.stateChangeCallbacks[key].filter(([ref]) => {
          return refs.indexOf(ref) === -1;
        });
      }
    }
    channel(topic, chanParams = {}) {
      let chan = new Channel(topic, chanParams, this);
      this.channels.push(chan);
      return chan;
    }
    push(data) {
      if (this.hasLogger()) {
        let { topic, event, payload, ref, join_ref } = data;
        this.log("push", `${topic} ${event} (${join_ref}, ${ref})`, payload);
      }
      if (this.isConnected()) {
        this.encode(data, (result) => this.conn.send(result));
      } else {
        this.sendBuffer.push(() => this.encode(data, (result) => this.conn.send(result)));
      }
    }
    makeRef() {
      let newRef = this.ref + 1;
      if (newRef === this.ref) {
        this.ref = 0;
      } else {
        this.ref = newRef;
      }
      return this.ref.toString();
    }
    sendHeartbeat() {
      if (this.pendingHeartbeatRef && !this.isConnected()) {
        return;
      }
      this.pendingHeartbeatRef = this.makeRef();
      this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref: this.pendingHeartbeatRef });
      this.heartbeatTimer = setTimeout(() => this.heartbeatTimeout(), this.heartbeatIntervalMs);
    }
    abnormalClose(reason) {
      this.closeWasClean = false;
      if (this.isConnected()) {
        this.conn.close(WS_CLOSE_NORMAL, reason);
      }
    }
    flushSendBuffer() {
      if (this.isConnected() && this.sendBuffer.length > 0) {
        this.sendBuffer.forEach((callback) => callback());
        this.sendBuffer = [];
      }
    }
    onConnMessage(rawMessage) {
      this.decode(rawMessage.data, (msg) => {
        let { topic, event, payload, ref, join_ref } = msg;
        if (ref && ref === this.pendingHeartbeatRef) {
          clearTimeout(this.heartbeatTimer);
          this.pendingHeartbeatRef = null;
          setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
        }
        if (this.hasLogger())
          this.log("receive", `${payload.status || ""} ${topic} ${event} ${ref && "(" + ref + ")" || ""}`, payload);
        for (let i = 0; i < this.channels.length; i++) {
          const channel = this.channels[i];
          if (!channel.isMember(topic, event, payload, join_ref)) {
            continue;
          }
          channel.trigger(event, payload, ref, join_ref);
        }
        for (let i = 0; i < this.stateChangeCallbacks.message.length; i++) {
          let [, callback] = this.stateChangeCallbacks.message[i];
          callback(msg);
        }
      });
    }
    leaveOpenTopic(topic) {
      let dupChannel = this.channels.find((c) => c.topic === topic && (c.isJoined() || c.isJoining()));
      if (dupChannel) {
        if (this.hasLogger())
          this.log("transport", `leaving duplicate topic "${topic}"`);
        dupChannel.leave();
      }
    }
  };

  // ../deps/phoenix_live_view/priv/static/phoenix_live_view.esm.js
  var CONSECUTIVE_RELOADS = "consecutive-reloads";
  var MAX_RELOADS = 10;
  var RELOAD_JITTER_MIN = 1e3;
  var RELOAD_JITTER_MAX = 3e3;
  var FAILSAFE_JITTER = 3e4;
  var PHX_EVENT_CLASSES = [
    "phx-click-loading",
    "phx-change-loading",
    "phx-submit-loading",
    "phx-keydown-loading",
    "phx-keyup-loading",
    "phx-blur-loading",
    "phx-focus-loading"
  ];
  var PHX_COMPONENT = "data-phx-component";
  var PHX_LIVE_LINK = "data-phx-link";
  var PHX_TRACK_STATIC = "track-static";
  var PHX_LINK_STATE = "data-phx-link-state";
  var PHX_REF = "data-phx-ref";
  var PHX_REF_SRC = "data-phx-ref-src";
  var PHX_TRACK_UPLOADS = "track-uploads";
  var PHX_UPLOAD_REF = "data-phx-upload-ref";
  var PHX_PREFLIGHTED_REFS = "data-phx-preflighted-refs";
  var PHX_DONE_REFS = "data-phx-done-refs";
  var PHX_DROP_TARGET = "drop-target";
  var PHX_ACTIVE_ENTRY_REFS = "data-phx-active-refs";
  var PHX_LIVE_FILE_UPDATED = "phx:live-file:updated";
  var PHX_SKIP = "data-phx-skip";
  var PHX_PRUNE = "data-phx-prune";
  var PHX_PAGE_LOADING = "page-loading";
  var PHX_CONNECTED_CLASS = "phx-connected";
  var PHX_DISCONNECTED_CLASS = "phx-loading";
  var PHX_NO_FEEDBACK_CLASS = "phx-no-feedback";
  var PHX_ERROR_CLASS = "phx-error";
  var PHX_PARENT_ID = "data-phx-parent-id";
  var PHX_MAIN = "data-phx-main";
  var PHX_ROOT_ID = "data-phx-root-id";
  var PHX_TRIGGER_ACTION = "trigger-action";
  var PHX_FEEDBACK_FOR = "feedback-for";
  var PHX_HAS_FOCUSED = "phx-has-focused";
  var FOCUSABLE_INPUTS = ["text", "textarea", "number", "email", "password", "search", "tel", "url", "date", "time", "datetime-local", "color", "range"];
  var CHECKABLE_INPUTS = ["checkbox", "radio"];
  var PHX_HAS_SUBMITTED = "phx-has-submitted";
  var PHX_SESSION = "data-phx-session";
  var PHX_VIEW_SELECTOR = `[${PHX_SESSION}]`;
  var PHX_STICKY = "data-phx-sticky";
  var PHX_STATIC = "data-phx-static";
  var PHX_READONLY = "data-phx-readonly";
  var PHX_DISABLED = "data-phx-disabled";
  var PHX_DISABLE_WITH = "disable-with";
  var PHX_DISABLE_WITH_RESTORE = "data-phx-disable-with-restore";
  var PHX_HOOK = "hook";
  var PHX_DEBOUNCE = "debounce";
  var PHX_THROTTLE = "throttle";
  var PHX_UPDATE = "update";
  var PHX_KEY = "key";
  var PHX_PRIVATE = "phxPrivate";
  var PHX_AUTO_RECOVER = "auto-recover";
  var PHX_LV_DEBUG = "phx:live-socket:debug";
  var PHX_LV_PROFILE = "phx:live-socket:profiling";
  var PHX_LV_LATENCY_SIM = "phx:live-socket:latency-sim";
  var PHX_PROGRESS = "progress";
  var LOADER_TIMEOUT = 1;
  var BEFORE_UNLOAD_LOADER_TIMEOUT = 200;
  var BINDING_PREFIX = "phx-";
  var PUSH_TIMEOUT = 3e4;
  var DEBOUNCE_TRIGGER = "debounce-trigger";
  var THROTTLED = "throttled";
  var DEBOUNCE_PREV_KEY = "debounce-prev-key";
  var DEFAULTS = {
    debounce: 300,
    throttle: 300
  };
  var DYNAMICS = "d";
  var STATIC = "s";
  var COMPONENTS = "c";
  var EVENTS = "e";
  var REPLY = "r";
  var TITLE = "t";
  var TEMPLATES = "p";
  var EntryUploader = class {
    constructor(entry, chunkSize, liveSocket2) {
      this.liveSocket = liveSocket2;
      this.entry = entry;
      this.offset = 0;
      this.chunkSize = chunkSize;
      this.chunkTimer = null;
      this.uploadChannel = liveSocket2.channel(`lvu:${entry.ref}`, { token: entry.metadata() });
    }
    error(reason) {
      clearTimeout(this.chunkTimer);
      this.uploadChannel.leave();
      this.entry.error(reason);
    }
    upload() {
      this.uploadChannel.onError((reason) => this.error(reason));
      this.uploadChannel.join().receive("ok", (_data) => this.readNextChunk()).receive("error", (reason) => this.error(reason));
    }
    isDone() {
      return this.offset >= this.entry.file.size;
    }
    readNextChunk() {
      let reader = new window.FileReader();
      let blob = this.entry.file.slice(this.offset, this.chunkSize + this.offset);
      reader.onload = (e) => {
        if (e.target.error === null) {
          this.offset += e.target.result.byteLength;
          this.pushChunk(e.target.result);
        } else {
          return logError("Read error: " + e.target.error);
        }
      };
      reader.readAsArrayBuffer(blob);
    }
    pushChunk(chunk) {
      if (!this.uploadChannel.isJoined()) {
        return;
      }
      this.uploadChannel.push("chunk", chunk).receive("ok", () => {
        this.entry.progress(this.offset / this.entry.file.size * 100);
        if (!this.isDone()) {
          this.chunkTimer = setTimeout(() => this.readNextChunk(), this.liveSocket.getLatencySim() || 0);
        }
      });
    }
  };
  var logError = (msg, obj) => console.error && console.error(msg, obj);
  var isCid = (cid) => {
    let type = typeof cid;
    return type === "number" || type === "string" && /^(0|[1-9]\d*)$/.test(cid);
  };
  function detectDuplicateIds() {
    let ids = /* @__PURE__ */ new Set();
    let elems = document.querySelectorAll("*[id]");
    for (let i = 0, len = elems.length; i < len; i++) {
      if (ids.has(elems[i].id)) {
        console.error(`Multiple IDs detected: ${elems[i].id}. Ensure unique element ids.`);
      } else {
        ids.add(elems[i].id);
      }
    }
  }
  var debug = (view, kind, msg, obj) => {
    if (view.liveSocket.isDebugEnabled()) {
      console.log(`${view.id} ${kind}: ${msg} - `, obj);
    }
  };
  var closure2 = (val) => typeof val === "function" ? val : function() {
    return val;
  };
  var clone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };
  var closestPhxBinding = (el, binding, borderEl) => {
    do {
      if (el.matches(`[${binding}]`)) {
        return el;
      }
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1 && !(borderEl && borderEl.isSameNode(el) || el.matches(PHX_VIEW_SELECTOR)));
    return null;
  };
  var isObject = (obj) => {
    return obj !== null && typeof obj === "object" && !(obj instanceof Array);
  };
  var isEqualObj = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);
  var isEmpty = (obj) => {
    for (let x in obj) {
      return false;
    }
    return true;
  };
  var maybe = (el, callback) => el && callback(el);
  var channelUploader = function(entries, onError, resp, liveSocket2) {
    entries.forEach((entry) => {
      let entryUploader = new EntryUploader(entry, resp.config.chunk_size, liveSocket2);
      entryUploader.upload();
    });
  };
  var Browser = {
    canPushState() {
      return typeof history.pushState !== "undefined";
    },
    dropLocal(localStorage, namespace, subkey) {
      return localStorage.removeItem(this.localKey(namespace, subkey));
    },
    updateLocal(localStorage, namespace, subkey, initial, func) {
      let current = this.getLocal(localStorage, namespace, subkey);
      let key = this.localKey(namespace, subkey);
      let newVal = current === null ? initial : func(current);
      localStorage.setItem(key, JSON.stringify(newVal));
      return newVal;
    },
    getLocal(localStorage, namespace, subkey) {
      return JSON.parse(localStorage.getItem(this.localKey(namespace, subkey)));
    },
    updateCurrentState(callback) {
      if (!this.canPushState()) {
        return;
      }
      history.replaceState(callback(history.state || {}), "", window.location.href);
    },
    pushState(kind, meta, to) {
      if (this.canPushState()) {
        if (to !== window.location.href) {
          if (meta.type == "redirect" && meta.scroll) {
            let currentState = history.state || {};
            currentState.scroll = meta.scroll;
            history.replaceState(currentState, "", window.location.href);
          }
          delete meta.scroll;
          history[kind + "State"](meta, "", to || null);
          let hashEl = this.getHashTargetEl(window.location.hash);
          if (hashEl) {
            hashEl.scrollIntoView();
          } else if (meta.type === "redirect") {
            window.scroll(0, 0);
          }
        }
      } else {
        this.redirect(to);
      }
    },
    setCookie(name, value) {
      document.cookie = `${name}=${value}`;
    },
    getCookie(name) {
      return document.cookie.replace(new RegExp(`(?:(?:^|.*;s*)${name}s*=s*([^;]*).*$)|^.*$`), "$1");
    },
    redirect(toURL, flash) {
      if (flash) {
        Browser.setCookie("__phoenix_flash__", flash + "; max-age=60000; path=/");
      }
      window.location = toURL;
    },
    localKey(namespace, subkey) {
      return `${namespace}-${subkey}`;
    },
    getHashTargetEl(maybeHash) {
      let hash = maybeHash.toString().substring(1);
      if (hash === "") {
        return;
      }
      return document.getElementById(hash) || document.querySelector(`a[name="${hash}"]`);
    }
  };
  var browser_default = Browser;
  var DOM = {
    byId(id) {
      return document.getElementById(id) || logError(`no id found for ${id}`);
    },
    removeClass(el, className) {
      el.classList.remove(className);
      if (el.classList.length === 0) {
        el.removeAttribute("class");
      }
    },
    all(node, query, callback) {
      if (!node) {
        return [];
      }
      let array = Array.from(node.querySelectorAll(query));
      return callback ? array.forEach(callback) : array;
    },
    childNodeLength(html) {
      let template = document.createElement("template");
      template.innerHTML = html;
      return template.content.childElementCount;
    },
    isUploadInput(el) {
      return el.type === "file" && el.getAttribute(PHX_UPLOAD_REF) !== null;
    },
    findUploadInputs(node) {
      return this.all(node, `input[type="file"][${PHX_UPLOAD_REF}]`);
    },
    findComponentNodeList(node, cid) {
      return this.filterWithinSameLiveView(this.all(node, `[${PHX_COMPONENT}="${cid}"]`), node);
    },
    isPhxDestroyed(node) {
      return node.id && DOM.private(node, "destroyed") ? true : false;
    },
    markPhxChildDestroyed(el) {
      if (this.isPhxChild(el)) {
        el.setAttribute(PHX_SESSION, "");
      }
      this.putPrivate(el, "destroyed", true);
    },
    findPhxChildrenInFragment(html, parentId) {
      let template = document.createElement("template");
      template.innerHTML = html;
      return this.findPhxChildren(template.content, parentId);
    },
    isIgnored(el, phxUpdate) {
      return (el.getAttribute(phxUpdate) || el.getAttribute("data-phx-update")) === "ignore";
    },
    isPhxUpdate(el, phxUpdate, updateTypes) {
      return el.getAttribute && updateTypes.indexOf(el.getAttribute(phxUpdate)) >= 0;
    },
    findPhxSticky(el) {
      return this.all(el, `[${PHX_STICKY}]`);
    },
    findPhxChildren(el, parentId) {
      return this.all(el, `${PHX_VIEW_SELECTOR}[${PHX_PARENT_ID}="${parentId}"]`);
    },
    findParentCIDs(node, cids) {
      let initial = new Set(cids);
      return cids.reduce((acc, cid) => {
        let selector = `[${PHX_COMPONENT}="${cid}"] [${PHX_COMPONENT}]`;
        this.filterWithinSameLiveView(this.all(node, selector), node).map((el) => parseInt(el.getAttribute(PHX_COMPONENT))).forEach((childCID) => acc.delete(childCID));
        return acc;
      }, initial);
    },
    filterWithinSameLiveView(nodes, parent) {
      if (parent.querySelector(PHX_VIEW_SELECTOR)) {
        return nodes.filter((el) => this.withinSameLiveView(el, parent));
      } else {
        return nodes;
      }
    },
    withinSameLiveView(node, parent) {
      while (node = node.parentNode) {
        if (node.isSameNode(parent)) {
          return true;
        }
        if (node.getAttribute(PHX_SESSION) !== null) {
          return false;
        }
      }
    },
    private(el, key) {
      return el[PHX_PRIVATE] && el[PHX_PRIVATE][key];
    },
    deletePrivate(el, key) {
      el[PHX_PRIVATE] && delete el[PHX_PRIVATE][key];
    },
    putPrivate(el, key, value) {
      if (!el[PHX_PRIVATE]) {
        el[PHX_PRIVATE] = {};
      }
      el[PHX_PRIVATE][key] = value;
    },
    updatePrivate(el, key, defaultVal, updateFunc) {
      let existing = this.private(el, key);
      if (existing === void 0) {
        this.putPrivate(el, key, updateFunc(defaultVal));
      } else {
        this.putPrivate(el, key, updateFunc(existing));
      }
    },
    copyPrivates(target, source) {
      if (source[PHX_PRIVATE]) {
        target[PHX_PRIVATE] = source[PHX_PRIVATE];
      }
    },
    putTitle(str) {
      let titleEl = document.querySelector("title");
      let { prefix, suffix } = titleEl.dataset;
      document.title = `${prefix || ""}${str}${suffix || ""}`;
    },
    debounce(el, event, phxDebounce, defaultDebounce, phxThrottle, defaultThrottle, callback) {
      let debounce = el.getAttribute(phxDebounce);
      let throttle = el.getAttribute(phxThrottle);
      if (debounce === "") {
        debounce = defaultDebounce;
      }
      if (throttle === "") {
        throttle = defaultThrottle;
      }
      let value = debounce || throttle;
      switch (value) {
        case null:
          return callback();
        case "blur":
          if (this.once(el, "debounce-blur")) {
            el.addEventListener("blur", () => callback());
          }
          return;
        default:
          let timeout = parseInt(value);
          let trigger = () => throttle ? this.deletePrivate(el, THROTTLED) : callback();
          let currentCycle = this.incCycle(el, DEBOUNCE_TRIGGER, trigger);
          if (isNaN(timeout)) {
            return logError(`invalid throttle/debounce value: ${value}`);
          }
          if (throttle) {
            let newKeyDown = false;
            if (event.type === "keydown") {
              let prevKey = this.private(el, DEBOUNCE_PREV_KEY);
              this.putPrivate(el, DEBOUNCE_PREV_KEY, event.key);
              newKeyDown = prevKey !== event.key;
            }
            if (!newKeyDown && this.private(el, THROTTLED)) {
              return false;
            } else {
              callback();
              this.putPrivate(el, THROTTLED, true);
              setTimeout(() => this.triggerCycle(el, DEBOUNCE_TRIGGER), timeout);
            }
          } else {
            setTimeout(() => this.triggerCycle(el, DEBOUNCE_TRIGGER, currentCycle), timeout);
          }
          let form = el.form;
          if (form && this.once(form, "bind-debounce")) {
            form.addEventListener("submit", () => {
              Array.from(new FormData(form).entries(), ([name]) => {
                let input = form.querySelector(`[name="${name}"]`);
                this.incCycle(input, DEBOUNCE_TRIGGER);
                this.deletePrivate(input, THROTTLED);
              });
            });
          }
          if (this.once(el, "bind-debounce")) {
            el.addEventListener("blur", () => this.triggerCycle(el, DEBOUNCE_TRIGGER));
          }
      }
    },
    triggerCycle(el, key, currentCycle) {
      let [cycle, trigger] = this.private(el, key);
      if (!currentCycle) {
        currentCycle = cycle;
      }
      if (currentCycle === cycle) {
        this.incCycle(el, key);
        trigger();
      }
    },
    once(el, key) {
      if (this.private(el, key) === true) {
        return false;
      }
      this.putPrivate(el, key, true);
      return true;
    },
    incCycle(el, key, trigger = function() {
    }) {
      let [currentCycle] = this.private(el, key) || [0, trigger];
      currentCycle++;
      this.putPrivate(el, key, [currentCycle, trigger]);
      return currentCycle;
    },
    discardError(container, el, phxFeedbackFor) {
      let field = el.getAttribute && el.getAttribute(phxFeedbackFor);
      let input = field && container.querySelector(`[id="${field}"], [name="${field}"]`);
      if (!input) {
        return;
      }
      if (!(this.private(input, PHX_HAS_FOCUSED) || this.private(input.form, PHX_HAS_SUBMITTED))) {
        el.classList.add(PHX_NO_FEEDBACK_CLASS);
      }
    },
    showError(inputEl, phxFeedbackFor) {
      if (inputEl.id || inputEl.name) {
        this.all(inputEl.form, `[${phxFeedbackFor}="${inputEl.id}"], [${phxFeedbackFor}="${inputEl.name}"]`, (el) => {
          this.removeClass(el, PHX_NO_FEEDBACK_CLASS);
        });
      }
    },
    isPhxChild(node) {
      return node.getAttribute && node.getAttribute(PHX_PARENT_ID);
    },
    isPhxSticky(node) {
      return node.getAttribute && node.getAttribute(PHX_STICKY) !== null;
    },
    firstPhxChild(el) {
      return this.isPhxChild(el) ? el : this.all(el, `[${PHX_PARENT_ID}]`)[0];
    },
    dispatchEvent(target, name, opts = {}) {
      let bubbles = opts.bubbles === void 0 ? true : !!opts.bubbles;
      let eventOpts = { bubbles, cancelable: true, detail: opts.detail || {} };
      let event = name === "click" ? new MouseEvent("click", eventOpts) : new CustomEvent(name, eventOpts);
      target.dispatchEvent(event);
    },
    cloneNode(node, html) {
      if (typeof html === "undefined") {
        return node.cloneNode(true);
      } else {
        let cloned = node.cloneNode(false);
        cloned.innerHTML = html;
        return cloned;
      }
    },
    mergeAttrs(target, source, opts = {}) {
      let exclude = opts.exclude || [];
      let isIgnored = opts.isIgnored;
      let sourceAttrs = source.attributes;
      for (let i = sourceAttrs.length - 1; i >= 0; i--) {
        let name = sourceAttrs[i].name;
        if (exclude.indexOf(name) < 0) {
          target.setAttribute(name, source.getAttribute(name));
        }
      }
      let targetAttrs = target.attributes;
      for (let i = targetAttrs.length - 1; i >= 0; i--) {
        let name = targetAttrs[i].name;
        if (isIgnored) {
          if (name.startsWith("data-") && !source.hasAttribute(name)) {
            target.removeAttribute(name);
          }
        } else {
          if (!source.hasAttribute(name)) {
            target.removeAttribute(name);
          }
        }
      }
    },
    mergeFocusedInput(target, source) {
      if (!(target instanceof HTMLSelectElement)) {
        DOM.mergeAttrs(target, source, { exclude: ["value"] });
      }
      if (source.readOnly) {
        target.setAttribute("readonly", true);
      } else {
        target.removeAttribute("readonly");
      }
    },
    hasSelectionRange(el) {
      return el.setSelectionRange && (el.type === "text" || el.type === "textarea");
    },
    restoreFocus(focused, selectionStart, selectionEnd) {
      if (!DOM.isTextualInput(focused)) {
        return;
      }
      let wasFocused = focused.matches(":focus");
      if (focused.readOnly) {
        focused.blur();
      }
      if (!wasFocused) {
        focused.focus();
      }
      if (this.hasSelectionRange(focused)) {
        focused.setSelectionRange(selectionStart, selectionEnd);
      }
    },
    isFormInput(el) {
      return /^(?:input|select|textarea)$/i.test(el.tagName) && el.type !== "button";
    },
    syncAttrsToProps(el) {
      if (el instanceof HTMLInputElement && CHECKABLE_INPUTS.indexOf(el.type.toLocaleLowerCase()) >= 0) {
        el.checked = el.getAttribute("checked") !== null;
      }
    },
    isTextualInput(el) {
      return FOCUSABLE_INPUTS.indexOf(el.type) >= 0;
    },
    isNowTriggerFormExternal(el, phxTriggerExternal) {
      return el.getAttribute && el.getAttribute(phxTriggerExternal) !== null;
    },
    syncPendingRef(fromEl, toEl, disableWith) {
      let ref = fromEl.getAttribute(PHX_REF);
      if (ref === null) {
        return true;
      }
      let refSrc = fromEl.getAttribute(PHX_REF_SRC);
      if (DOM.isFormInput(fromEl) || fromEl.getAttribute(disableWith) !== null) {
        if (DOM.isUploadInput(fromEl)) {
          DOM.mergeAttrs(fromEl, toEl, { isIgnored: true });
        }
        DOM.putPrivate(fromEl, PHX_REF, toEl);
        return false;
      } else {
        PHX_EVENT_CLASSES.forEach((className) => {
          fromEl.classList.contains(className) && toEl.classList.add(className);
        });
        toEl.setAttribute(PHX_REF, ref);
        toEl.setAttribute(PHX_REF_SRC, refSrc);
        return true;
      }
    },
    cleanChildNodes(container, phxUpdate) {
      if (DOM.isPhxUpdate(container, phxUpdate, ["append", "prepend"])) {
        let toRemove = [];
        container.childNodes.forEach((childNode) => {
          if (!childNode.id) {
            let isEmptyTextNode = childNode.nodeType === Node.TEXT_NODE && childNode.nodeValue.trim() === "";
            if (!isEmptyTextNode) {
              logError(`only HTML element tags with an id are allowed inside containers with phx-update.

removing illegal node: "${(childNode.outerHTML || childNode.nodeValue).trim()}"

`);
            }
            toRemove.push(childNode);
          }
        });
        toRemove.forEach((childNode) => childNode.remove());
      }
    },
    replaceRootContainer(container, tagName, attrs) {
      let retainedAttrs = /* @__PURE__ */ new Set(["id", PHX_SESSION, PHX_STATIC, PHX_MAIN, PHX_ROOT_ID]);
      if (container.tagName.toLowerCase() === tagName.toLowerCase()) {
        Array.from(container.attributes).filter((attr) => !retainedAttrs.has(attr.name.toLowerCase())).forEach((attr) => container.removeAttribute(attr.name));
        Object.keys(attrs).filter((name) => !retainedAttrs.has(name.toLowerCase())).forEach((attr) => container.setAttribute(attr, attrs[attr]));
        return container;
      } else {
        let newContainer = document.createElement(tagName);
        Object.keys(attrs).forEach((attr) => newContainer.setAttribute(attr, attrs[attr]));
        retainedAttrs.forEach((attr) => newContainer.setAttribute(attr, container.getAttribute(attr)));
        newContainer.innerHTML = container.innerHTML;
        container.replaceWith(newContainer);
        return newContainer;
      }
    },
    getSticky(el, name, defaultVal) {
      let op = (DOM.private(el, "sticky") || []).find(([existingName]) => name === existingName);
      if (op) {
        let [_name, _op, stashedResult] = op;
        return stashedResult;
      } else {
        return typeof defaultVal === "function" ? defaultVal() : defaultVal;
      }
    },
    deleteSticky(el, name) {
      this.updatePrivate(el, "sticky", [], (ops) => {
        return ops.filter(([existingName, _]) => existingName !== name);
      });
    },
    putSticky(el, name, op) {
      let stashedResult = op(el);
      this.updatePrivate(el, "sticky", [], (ops) => {
        let existingIndex = ops.findIndex(([existingName]) => name === existingName);
        if (existingIndex >= 0) {
          ops[existingIndex] = [name, op, stashedResult];
        } else {
          ops.push([name, op, stashedResult]);
        }
        return ops;
      });
    },
    applyStickyOperations(el) {
      let ops = DOM.private(el, "sticky");
      if (!ops) {
        return;
      }
      ops.forEach(([name, op, _stashed]) => this.putSticky(el, name, op));
    }
  };
  var dom_default = DOM;
  var UploadEntry = class {
    static isActive(fileEl, file) {
      let isNew = file._phxRef === void 0;
      let activeRefs = fileEl.getAttribute(PHX_ACTIVE_ENTRY_REFS).split(",");
      let isActive = activeRefs.indexOf(LiveUploader.genFileRef(file)) >= 0;
      return file.size > 0 && (isNew || isActive);
    }
    static isPreflighted(fileEl, file) {
      let preflightedRefs = fileEl.getAttribute(PHX_PREFLIGHTED_REFS).split(",");
      let isPreflighted = preflightedRefs.indexOf(LiveUploader.genFileRef(file)) >= 0;
      return isPreflighted && this.isActive(fileEl, file);
    }
    constructor(fileEl, file, view) {
      this.ref = LiveUploader.genFileRef(file);
      this.fileEl = fileEl;
      this.file = file;
      this.view = view;
      this.meta = null;
      this._isCancelled = false;
      this._isDone = false;
      this._progress = 0;
      this._lastProgressSent = -1;
      this._onDone = function() {
      };
      this._onElUpdated = this.onElUpdated.bind(this);
      this.fileEl.addEventListener(PHX_LIVE_FILE_UPDATED, this._onElUpdated);
    }
    metadata() {
      return this.meta;
    }
    progress(progress) {
      this._progress = Math.floor(progress);
      if (this._progress > this._lastProgressSent) {
        if (this._progress >= 100) {
          this._progress = 100;
          this._lastProgressSent = 100;
          this._isDone = true;
          this.view.pushFileProgress(this.fileEl, this.ref, 100, () => {
            LiveUploader.untrackFile(this.fileEl, this.file);
            this._onDone();
          });
        } else {
          this._lastProgressSent = this._progress;
          this.view.pushFileProgress(this.fileEl, this.ref, this._progress);
        }
      }
    }
    cancel() {
      this._isCancelled = true;
      this._isDone = true;
      this._onDone();
    }
    isDone() {
      return this._isDone;
    }
    error(reason = "failed") {
      this.view.pushFileProgress(this.fileEl, this.ref, { error: reason });
      LiveUploader.clearFiles(this.fileEl);
    }
    onDone(callback) {
      this._onDone = () => {
        this.fileEl.removeEventListener(PHX_LIVE_FILE_UPDATED, this._onElUpdated);
        callback();
      };
    }
    onElUpdated() {
      let activeRefs = this.fileEl.getAttribute(PHX_ACTIVE_ENTRY_REFS).split(",");
      if (activeRefs.indexOf(this.ref) === -1) {
        this.cancel();
      }
    }
    toPreflightPayload() {
      return {
        last_modified: this.file.lastModified,
        name: this.file.name,
        size: this.file.size,
        type: this.file.type,
        ref: this.ref
      };
    }
    uploader(uploaders) {
      if (this.meta.uploader) {
        let callback = uploaders[this.meta.uploader] || logError(`no uploader configured for ${this.meta.uploader}`);
        return { name: this.meta.uploader, callback };
      } else {
        return { name: "channel", callback: channelUploader };
      }
    }
    zipPostFlight(resp) {
      this.meta = resp.entries[this.ref];
      if (!this.meta) {
        logError(`no preflight upload response returned with ref ${this.ref}`, { input: this.fileEl, response: resp });
      }
    }
  };
  var liveUploaderFileRef = 0;
  var LiveUploader = class {
    static genFileRef(file) {
      let ref = file._phxRef;
      if (ref !== void 0) {
        return ref;
      } else {
        file._phxRef = (liveUploaderFileRef++).toString();
        return file._phxRef;
      }
    }
    static getEntryDataURL(inputEl, ref, callback) {
      let file = this.activeFiles(inputEl).find((file2) => this.genFileRef(file2) === ref);
      callback(URL.createObjectURL(file));
    }
    static hasUploadsInProgress(formEl) {
      let active = 0;
      dom_default.findUploadInputs(formEl).forEach((input) => {
        if (input.getAttribute(PHX_PREFLIGHTED_REFS) !== input.getAttribute(PHX_DONE_REFS)) {
          active++;
        }
      });
      return active > 0;
    }
    static serializeUploads(inputEl) {
      let files = this.activeFiles(inputEl);
      let fileData = {};
      files.forEach((file) => {
        let entry = { path: inputEl.name };
        let uploadRef = inputEl.getAttribute(PHX_UPLOAD_REF);
        fileData[uploadRef] = fileData[uploadRef] || [];
        entry.ref = this.genFileRef(file);
        entry.name = file.name || entry.ref;
        entry.type = file.type;
        entry.size = file.size;
        fileData[uploadRef].push(entry);
      });
      return fileData;
    }
    static clearFiles(inputEl) {
      inputEl.value = null;
      inputEl.removeAttribute(PHX_UPLOAD_REF);
      dom_default.putPrivate(inputEl, "files", []);
    }
    static untrackFile(inputEl, file) {
      dom_default.putPrivate(inputEl, "files", dom_default.private(inputEl, "files").filter((f) => !Object.is(f, file)));
    }
    static trackFiles(inputEl, files) {
      if (inputEl.getAttribute("multiple") !== null) {
        let newFiles = files.filter((file) => !this.activeFiles(inputEl).find((f) => Object.is(f, file)));
        dom_default.putPrivate(inputEl, "files", this.activeFiles(inputEl).concat(newFiles));
        inputEl.value = null;
      } else {
        dom_default.putPrivate(inputEl, "files", files);
      }
    }
    static activeFileInputs(formEl) {
      let fileInputs = dom_default.findUploadInputs(formEl);
      return Array.from(fileInputs).filter((el) => el.files && this.activeFiles(el).length > 0);
    }
    static activeFiles(input) {
      return (dom_default.private(input, "files") || []).filter((f) => UploadEntry.isActive(input, f));
    }
    static inputsAwaitingPreflight(formEl) {
      let fileInputs = dom_default.findUploadInputs(formEl);
      return Array.from(fileInputs).filter((input) => this.filesAwaitingPreflight(input).length > 0);
    }
    static filesAwaitingPreflight(input) {
      return this.activeFiles(input).filter((f) => !UploadEntry.isPreflighted(input, f));
    }
    constructor(inputEl, view, onComplete) {
      this.view = view;
      this.onComplete = onComplete;
      this._entries = Array.from(LiveUploader.filesAwaitingPreflight(inputEl) || []).map((file) => new UploadEntry(inputEl, file, view));
      this.numEntriesInProgress = this._entries.length;
    }
    entries() {
      return this._entries;
    }
    initAdapterUpload(resp, onError, liveSocket2) {
      this._entries = this._entries.map((entry) => {
        entry.zipPostFlight(resp);
        entry.onDone(() => {
          this.numEntriesInProgress--;
          if (this.numEntriesInProgress === 0) {
            this.onComplete();
          }
        });
        return entry;
      });
      let groupedEntries = this._entries.reduce((acc, entry) => {
        let { name, callback } = entry.uploader(liveSocket2.uploaders);
        acc[name] = acc[name] || { callback, entries: [] };
        acc[name].entries.push(entry);
        return acc;
      }, {});
      for (let name in groupedEntries) {
        let { callback, entries } = groupedEntries[name];
        callback(entries, onError, resp, liveSocket2);
      }
    }
  };
  var Hooks = {
    LiveFileUpload: {
      activeRefs() {
        return this.el.getAttribute(PHX_ACTIVE_ENTRY_REFS);
      },
      preflightedRefs() {
        return this.el.getAttribute(PHX_PREFLIGHTED_REFS);
      },
      mounted() {
        this.preflightedWas = this.preflightedRefs();
      },
      updated() {
        let newPreflights = this.preflightedRefs();
        if (this.preflightedWas !== newPreflights) {
          this.preflightedWas = newPreflights;
          if (newPreflights === "") {
            this.__view.cancelSubmit(this.el.form);
          }
        }
        if (this.activeRefs() === "") {
          this.el.value = null;
        }
        this.el.dispatchEvent(new CustomEvent(PHX_LIVE_FILE_UPDATED));
      }
    },
    LiveImgPreview: {
      mounted() {
        this.ref = this.el.getAttribute("data-phx-entry-ref");
        this.inputEl = document.getElementById(this.el.getAttribute(PHX_UPLOAD_REF));
        LiveUploader.getEntryDataURL(this.inputEl, this.ref, (url) => {
          this.url = url;
          this.el.src = url;
        });
      },
      destroyed() {
        URL.revokeObjectURL(this.url);
      }
    }
  };
  var hooks_default = Hooks;
  var DOMPostMorphRestorer = class {
    constructor(containerBefore, containerAfter, updateType) {
      let idsBefore = /* @__PURE__ */ new Set();
      let idsAfter = new Set([...containerAfter.children].map((child) => child.id));
      let elementsToModify = [];
      Array.from(containerBefore.children).forEach((child) => {
        if (child.id) {
          idsBefore.add(child.id);
          if (idsAfter.has(child.id)) {
            let previousElementId = child.previousElementSibling && child.previousElementSibling.id;
            elementsToModify.push({ elementId: child.id, previousElementId });
          }
        }
      });
      this.containerId = containerAfter.id;
      this.updateType = updateType;
      this.elementsToModify = elementsToModify;
      this.elementIdsToAdd = [...idsAfter].filter((id) => !idsBefore.has(id));
    }
    perform() {
      let container = dom_default.byId(this.containerId);
      this.elementsToModify.forEach((elementToModify) => {
        if (elementToModify.previousElementId) {
          maybe(document.getElementById(elementToModify.previousElementId), (previousElem) => {
            maybe(document.getElementById(elementToModify.elementId), (elem) => {
              let isInRightPlace = elem.previousElementSibling && elem.previousElementSibling.id == previousElem.id;
              if (!isInRightPlace) {
                previousElem.insertAdjacentElement("afterend", elem);
              }
            });
          });
        } else {
          maybe(document.getElementById(elementToModify.elementId), (elem) => {
            let isInRightPlace = elem.previousElementSibling == null;
            if (!isInRightPlace) {
              container.insertAdjacentElement("afterbegin", elem);
            }
          });
        }
      });
      if (this.updateType == "prepend") {
        this.elementIdsToAdd.reverse().forEach((elemId) => {
          maybe(document.getElementById(elemId), (elem) => container.insertAdjacentElement("afterbegin", elem));
        });
      }
    }
  };
  var DOCUMENT_FRAGMENT_NODE = 11;
  function morphAttrs(fromNode, toNode) {
    var toNodeAttrs = toNode.attributes;
    var attr;
    var attrName;
    var attrNamespaceURI;
    var attrValue;
    var fromValue;
    if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE || fromNode.nodeType === DOCUMENT_FRAGMENT_NODE) {
      return;
    }
    for (var i = toNodeAttrs.length - 1; i >= 0; i--) {
      attr = toNodeAttrs[i];
      attrName = attr.name;
      attrNamespaceURI = attr.namespaceURI;
      attrValue = attr.value;
      if (attrNamespaceURI) {
        attrName = attr.localName || attrName;
        fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName);
        if (fromValue !== attrValue) {
          if (attr.prefix === "xmlns") {
            attrName = attr.name;
          }
          fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
        }
      } else {
        fromValue = fromNode.getAttribute(attrName);
        if (fromValue !== attrValue) {
          fromNode.setAttribute(attrName, attrValue);
        }
      }
    }
    var fromNodeAttrs = fromNode.attributes;
    for (var d = fromNodeAttrs.length - 1; d >= 0; d--) {
      attr = fromNodeAttrs[d];
      attrName = attr.name;
      attrNamespaceURI = attr.namespaceURI;
      if (attrNamespaceURI) {
        attrName = attr.localName || attrName;
        if (!toNode.hasAttributeNS(attrNamespaceURI, attrName)) {
          fromNode.removeAttributeNS(attrNamespaceURI, attrName);
        }
      } else {
        if (!toNode.hasAttribute(attrName)) {
          fromNode.removeAttribute(attrName);
        }
      }
    }
  }
  var range;
  var NS_XHTML = "http://www.w3.org/1999/xhtml";
  var doc = typeof document === "undefined" ? void 0 : document;
  var HAS_TEMPLATE_SUPPORT = !!doc && "content" in doc.createElement("template");
  var HAS_RANGE_SUPPORT = !!doc && doc.createRange && "createContextualFragment" in doc.createRange();
  function createFragmentFromTemplate(str) {
    var template = doc.createElement("template");
    template.innerHTML = str;
    return template.content.childNodes[0];
  }
  function createFragmentFromRange(str) {
    if (!range) {
      range = doc.createRange();
      range.selectNode(doc.body);
    }
    var fragment = range.createContextualFragment(str);
    return fragment.childNodes[0];
  }
  function createFragmentFromWrap(str) {
    var fragment = doc.createElement("body");
    fragment.innerHTML = str;
    return fragment.childNodes[0];
  }
  function toElement(str) {
    str = str.trim();
    if (HAS_TEMPLATE_SUPPORT) {
      return createFragmentFromTemplate(str);
    } else if (HAS_RANGE_SUPPORT) {
      return createFragmentFromRange(str);
    }
    return createFragmentFromWrap(str);
  }
  function compareNodeNames(fromEl, toEl) {
    var fromNodeName = fromEl.nodeName;
    var toNodeName = toEl.nodeName;
    var fromCodeStart, toCodeStart;
    if (fromNodeName === toNodeName) {
      return true;
    }
    fromCodeStart = fromNodeName.charCodeAt(0);
    toCodeStart = toNodeName.charCodeAt(0);
    if (fromCodeStart <= 90 && toCodeStart >= 97) {
      return fromNodeName === toNodeName.toUpperCase();
    } else if (toCodeStart <= 90 && fromCodeStart >= 97) {
      return toNodeName === fromNodeName.toUpperCase();
    } else {
      return false;
    }
  }
  function createElementNS(name, namespaceURI) {
    return !namespaceURI || namespaceURI === NS_XHTML ? doc.createElement(name) : doc.createElementNS(namespaceURI, name);
  }
  function moveChildren(fromEl, toEl) {
    var curChild = fromEl.firstChild;
    while (curChild) {
      var nextChild = curChild.nextSibling;
      toEl.appendChild(curChild);
      curChild = nextChild;
    }
    return toEl;
  }
  function syncBooleanAttrProp(fromEl, toEl, name) {
    if (fromEl[name] !== toEl[name]) {
      fromEl[name] = toEl[name];
      if (fromEl[name]) {
        fromEl.setAttribute(name, "");
      } else {
        fromEl.removeAttribute(name);
      }
    }
  }
  var specialElHandlers = {
    OPTION: function(fromEl, toEl) {
      var parentNode = fromEl.parentNode;
      if (parentNode) {
        var parentName = parentNode.nodeName.toUpperCase();
        if (parentName === "OPTGROUP") {
          parentNode = parentNode.parentNode;
          parentName = parentNode && parentNode.nodeName.toUpperCase();
        }
        if (parentName === "SELECT" && !parentNode.hasAttribute("multiple")) {
          if (fromEl.hasAttribute("selected") && !toEl.selected) {
            fromEl.setAttribute("selected", "selected");
            fromEl.removeAttribute("selected");
          }
          parentNode.selectedIndex = -1;
        }
      }
      syncBooleanAttrProp(fromEl, toEl, "selected");
    },
    INPUT: function(fromEl, toEl) {
      syncBooleanAttrProp(fromEl, toEl, "checked");
      syncBooleanAttrProp(fromEl, toEl, "disabled");
      if (fromEl.value !== toEl.value) {
        fromEl.value = toEl.value;
      }
      if (!toEl.hasAttribute("value")) {
        fromEl.removeAttribute("value");
      }
    },
    TEXTAREA: function(fromEl, toEl) {
      var newValue = toEl.value;
      if (fromEl.value !== newValue) {
        fromEl.value = newValue;
      }
      var firstChild = fromEl.firstChild;
      if (firstChild) {
        var oldValue = firstChild.nodeValue;
        if (oldValue == newValue || !newValue && oldValue == fromEl.placeholder) {
          return;
        }
        firstChild.nodeValue = newValue;
      }
    },
    SELECT: function(fromEl, toEl) {
      if (!toEl.hasAttribute("multiple")) {
        var selectedIndex = -1;
        var i = 0;
        var curChild = fromEl.firstChild;
        var optgroup;
        var nodeName;
        while (curChild) {
          nodeName = curChild.nodeName && curChild.nodeName.toUpperCase();
          if (nodeName === "OPTGROUP") {
            optgroup = curChild;
            curChild = optgroup.firstChild;
          } else {
            if (nodeName === "OPTION") {
              if (curChild.hasAttribute("selected")) {
                selectedIndex = i;
                break;
              }
              i++;
            }
            curChild = curChild.nextSibling;
            if (!curChild && optgroup) {
              curChild = optgroup.nextSibling;
              optgroup = null;
            }
          }
        }
        fromEl.selectedIndex = selectedIndex;
      }
    }
  };
  var ELEMENT_NODE = 1;
  var DOCUMENT_FRAGMENT_NODE$1 = 11;
  var TEXT_NODE = 3;
  var COMMENT_NODE = 8;
  function noop() {
  }
  function defaultGetNodeKey(node) {
    if (node) {
      return node.getAttribute && node.getAttribute("id") || node.id;
    }
  }
  function morphdomFactory(morphAttrs2) {
    return function morphdom2(fromNode, toNode, options) {
      if (!options) {
        options = {};
      }
      if (typeof toNode === "string") {
        if (fromNode.nodeName === "#document" || fromNode.nodeName === "HTML" || fromNode.nodeName === "BODY") {
          var toNodeHtml = toNode;
          toNode = doc.createElement("html");
          toNode.innerHTML = toNodeHtml;
        } else {
          toNode = toElement(toNode);
        }
      }
      var getNodeKey = options.getNodeKey || defaultGetNodeKey;
      var onBeforeNodeAdded = options.onBeforeNodeAdded || noop;
      var onNodeAdded = options.onNodeAdded || noop;
      var onBeforeElUpdated = options.onBeforeElUpdated || noop;
      var onElUpdated = options.onElUpdated || noop;
      var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
      var onNodeDiscarded = options.onNodeDiscarded || noop;
      var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || noop;
      var childrenOnly = options.childrenOnly === true;
      var fromNodesLookup = /* @__PURE__ */ Object.create(null);
      var keyedRemovalList = [];
      function addKeyedRemoval(key) {
        keyedRemovalList.push(key);
      }
      function walkDiscardedChildNodes(node, skipKeyedNodes) {
        if (node.nodeType === ELEMENT_NODE) {
          var curChild = node.firstChild;
          while (curChild) {
            var key = void 0;
            if (skipKeyedNodes && (key = getNodeKey(curChild))) {
              addKeyedRemoval(key);
            } else {
              onNodeDiscarded(curChild);
              if (curChild.firstChild) {
                walkDiscardedChildNodes(curChild, skipKeyedNodes);
              }
            }
            curChild = curChild.nextSibling;
          }
        }
      }
      function removeNode(node, parentNode, skipKeyedNodes) {
        if (onBeforeNodeDiscarded(node) === false) {
          return;
        }
        if (parentNode) {
          parentNode.removeChild(node);
        }
        onNodeDiscarded(node);
        walkDiscardedChildNodes(node, skipKeyedNodes);
      }
      function indexTree(node) {
        if (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
          var curChild = node.firstChild;
          while (curChild) {
            var key = getNodeKey(curChild);
            if (key) {
              fromNodesLookup[key] = curChild;
            }
            indexTree(curChild);
            curChild = curChild.nextSibling;
          }
        }
      }
      indexTree(fromNode);
      function handleNodeAdded(el) {
        onNodeAdded(el);
        var curChild = el.firstChild;
        while (curChild) {
          var nextSibling = curChild.nextSibling;
          var key = getNodeKey(curChild);
          if (key) {
            var unmatchedFromEl = fromNodesLookup[key];
            if (unmatchedFromEl && compareNodeNames(curChild, unmatchedFromEl)) {
              curChild.parentNode.replaceChild(unmatchedFromEl, curChild);
              morphEl(unmatchedFromEl, curChild);
            } else {
              handleNodeAdded(curChild);
            }
          } else {
            handleNodeAdded(curChild);
          }
          curChild = nextSibling;
        }
      }
      function cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey) {
        while (curFromNodeChild) {
          var fromNextSibling = curFromNodeChild.nextSibling;
          if (curFromNodeKey = getNodeKey(curFromNodeChild)) {
            addKeyedRemoval(curFromNodeKey);
          } else {
            removeNode(curFromNodeChild, fromEl, true);
          }
          curFromNodeChild = fromNextSibling;
        }
      }
      function morphEl(fromEl, toEl, childrenOnly2) {
        var toElKey = getNodeKey(toEl);
        if (toElKey) {
          delete fromNodesLookup[toElKey];
        }
        if (!childrenOnly2) {
          if (onBeforeElUpdated(fromEl, toEl) === false) {
            return;
          }
          morphAttrs2(fromEl, toEl);
          onElUpdated(fromEl);
          if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
            return;
          }
        }
        if (fromEl.nodeName !== "TEXTAREA") {
          morphChildren(fromEl, toEl);
        } else {
          specialElHandlers.TEXTAREA(fromEl, toEl);
        }
      }
      function morphChildren(fromEl, toEl) {
        var curToNodeChild = toEl.firstChild;
        var curFromNodeChild = fromEl.firstChild;
        var curToNodeKey;
        var curFromNodeKey;
        var fromNextSibling;
        var toNextSibling;
        var matchingFromEl;
        outer:
          while (curToNodeChild) {
            toNextSibling = curToNodeChild.nextSibling;
            curToNodeKey = getNodeKey(curToNodeChild);
            while (curFromNodeChild) {
              fromNextSibling = curFromNodeChild.nextSibling;
              if (curToNodeChild.isSameNode && curToNodeChild.isSameNode(curFromNodeChild)) {
                curToNodeChild = toNextSibling;
                curFromNodeChild = fromNextSibling;
                continue outer;
              }
              curFromNodeKey = getNodeKey(curFromNodeChild);
              var curFromNodeType = curFromNodeChild.nodeType;
              var isCompatible = void 0;
              if (curFromNodeType === curToNodeChild.nodeType) {
                if (curFromNodeType === ELEMENT_NODE) {
                  if (curToNodeKey) {
                    if (curToNodeKey !== curFromNodeKey) {
                      if (matchingFromEl = fromNodesLookup[curToNodeKey]) {
                        if (fromNextSibling === matchingFromEl) {
                          isCompatible = false;
                        } else {
                          fromEl.insertBefore(matchingFromEl, curFromNodeChild);
                          if (curFromNodeKey) {
                            addKeyedRemoval(curFromNodeKey);
                          } else {
                            removeNode(curFromNodeChild, fromEl, true);
                          }
                          curFromNodeChild = matchingFromEl;
                        }
                      } else {
                        isCompatible = false;
                      }
                    }
                  } else if (curFromNodeKey) {
                    isCompatible = false;
                  }
                  isCompatible = isCompatible !== false && compareNodeNames(curFromNodeChild, curToNodeChild);
                  if (isCompatible) {
                    morphEl(curFromNodeChild, curToNodeChild);
                  }
                } else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) {
                  isCompatible = true;
                  if (curFromNodeChild.nodeValue !== curToNodeChild.nodeValue) {
                    curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
                  }
                }
              }
              if (isCompatible) {
                curToNodeChild = toNextSibling;
                curFromNodeChild = fromNextSibling;
                continue outer;
              }
              if (curFromNodeKey) {
                addKeyedRemoval(curFromNodeKey);
              } else {
                removeNode(curFromNodeChild, fromEl, true);
              }
              curFromNodeChild = fromNextSibling;
            }
            if (curToNodeKey && (matchingFromEl = fromNodesLookup[curToNodeKey]) && compareNodeNames(matchingFromEl, curToNodeChild)) {
              fromEl.appendChild(matchingFromEl);
              morphEl(matchingFromEl, curToNodeChild);
            } else {
              var onBeforeNodeAddedResult = onBeforeNodeAdded(curToNodeChild);
              if (onBeforeNodeAddedResult !== false) {
                if (onBeforeNodeAddedResult) {
                  curToNodeChild = onBeforeNodeAddedResult;
                }
                if (curToNodeChild.actualize) {
                  curToNodeChild = curToNodeChild.actualize(fromEl.ownerDocument || doc);
                }
                fromEl.appendChild(curToNodeChild);
                handleNodeAdded(curToNodeChild);
              }
            }
            curToNodeChild = toNextSibling;
            curFromNodeChild = fromNextSibling;
          }
        cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey);
        var specialElHandler = specialElHandlers[fromEl.nodeName];
        if (specialElHandler) {
          specialElHandler(fromEl, toEl);
        }
      }
      var morphedNode = fromNode;
      var morphedNodeType = morphedNode.nodeType;
      var toNodeType = toNode.nodeType;
      if (!childrenOnly) {
        if (morphedNodeType === ELEMENT_NODE) {
          if (toNodeType === ELEMENT_NODE) {
            if (!compareNodeNames(fromNode, toNode)) {
              onNodeDiscarded(fromNode);
              morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI));
            }
          } else {
            morphedNode = toNode;
          }
        } else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) {
          if (toNodeType === morphedNodeType) {
            if (morphedNode.nodeValue !== toNode.nodeValue) {
              morphedNode.nodeValue = toNode.nodeValue;
            }
            return morphedNode;
          } else {
            morphedNode = toNode;
          }
        }
      }
      if (morphedNode === toNode) {
        onNodeDiscarded(fromNode);
      } else {
        if (toNode.isSameNode && toNode.isSameNode(morphedNode)) {
          return;
        }
        morphEl(morphedNode, toNode, childrenOnly);
        if (keyedRemovalList) {
          for (var i = 0, len = keyedRemovalList.length; i < len; i++) {
            var elToRemove = fromNodesLookup[keyedRemovalList[i]];
            if (elToRemove) {
              removeNode(elToRemove, elToRemove.parentNode, false);
            }
          }
        }
      }
      if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
        if (morphedNode.actualize) {
          morphedNode = morphedNode.actualize(fromNode.ownerDocument || doc);
        }
        fromNode.parentNode.replaceChild(morphedNode, fromNode);
      }
      return morphedNode;
    };
  }
  var morphdom = morphdomFactory(morphAttrs);
  var morphdom_esm_default = morphdom;
  var DOMPatch = class {
    static patchEl(fromEl, toEl, activeElement) {
      morphdom_esm_default(fromEl, toEl, {
        childrenOnly: false,
        onBeforeElUpdated: (fromEl2, toEl2) => {
          if (activeElement && activeElement.isSameNode(fromEl2) && dom_default.isFormInput(fromEl2)) {
            dom_default.mergeFocusedInput(fromEl2, toEl2);
            return false;
          }
        }
      });
    }
    constructor(view, container, id, html, targetCID) {
      this.view = view;
      this.liveSocket = view.liveSocket;
      this.container = container;
      this.id = id;
      this.rootID = view.root.id;
      this.html = html;
      this.targetCID = targetCID;
      this.cidPatch = isCid(this.targetCID);
      this.callbacks = {
        beforeadded: [],
        beforeupdated: [],
        beforephxChildAdded: [],
        afteradded: [],
        afterupdated: [],
        afterdiscarded: [],
        afterphxChildAdded: [],
        aftertransitionsDiscarded: []
      };
    }
    before(kind, callback) {
      this.callbacks[`before${kind}`].push(callback);
    }
    after(kind, callback) {
      this.callbacks[`after${kind}`].push(callback);
    }
    trackBefore(kind, ...args) {
      this.callbacks[`before${kind}`].forEach((callback) => callback(...args));
    }
    trackAfter(kind, ...args) {
      this.callbacks[`after${kind}`].forEach((callback) => callback(...args));
    }
    markPrunableContentForRemoval() {
      dom_default.all(this.container, "[phx-update=append] > *, [phx-update=prepend] > *", (el) => {
        el.setAttribute(PHX_PRUNE, "");
      });
    }
    perform() {
      let { view, liveSocket: liveSocket2, container, html } = this;
      let targetContainer = this.isCIDPatch() ? this.targetCIDContainer(html) : container;
      if (this.isCIDPatch() && !targetContainer) {
        return;
      }
      let focused = liveSocket2.getActiveElement();
      let { selectionStart, selectionEnd } = focused && dom_default.hasSelectionRange(focused) ? focused : {};
      let phxUpdate = liveSocket2.binding(PHX_UPDATE);
      let phxFeedbackFor = liveSocket2.binding(PHX_FEEDBACK_FOR);
      let disableWith = liveSocket2.binding(PHX_DISABLE_WITH);
      let phxTriggerExternal = liveSocket2.binding(PHX_TRIGGER_ACTION);
      let phxRemove = liveSocket2.binding("remove");
      let added = [];
      let updates = [];
      let appendPrependUpdates = [];
      let pendingRemoves = [];
      let externalFormTriggered = null;
      let diffHTML = liveSocket2.time("premorph container prep", () => {
        return this.buildDiffHTML(container, html, phxUpdate, targetContainer);
      });
      this.trackBefore("added", container);
      this.trackBefore("updated", container, container);
      liveSocket2.time("morphdom", () => {
        morphdom_esm_default(targetContainer, diffHTML, {
          childrenOnly: targetContainer.getAttribute(PHX_COMPONENT) === null,
          getNodeKey: (node) => {
            return dom_default.isPhxDestroyed(node) ? null : node.id;
          },
          onBeforeNodeAdded: (el) => {
            this.trackBefore("added", el);
            return el;
          },
          onNodeAdded: (el) => {
            if (el instanceof HTMLImageElement && el.srcset) {
              el.srcset = el.srcset;
            } else if (el instanceof HTMLVideoElement && el.autoplay) {
              el.play();
            }
            if (dom_default.isNowTriggerFormExternal(el, phxTriggerExternal)) {
              externalFormTriggered = el;
            }
            dom_default.discardError(targetContainer, el, phxFeedbackFor);
            if (dom_default.isPhxChild(el) && view.ownsElement(el) || dom_default.isPhxSticky(el) && view.ownsElement(el.parentNode)) {
              this.trackAfter("phxChildAdded", el);
            }
            added.push(el);
          },
          onNodeDiscarded: (el) => {
            if (dom_default.isPhxChild(el) || dom_default.isPhxSticky(el)) {
              liveSocket2.destroyViewByEl(el);
            }
            this.trackAfter("discarded", el);
          },
          onBeforeNodeDiscarded: (el) => {
            if (el.getAttribute && el.getAttribute(PHX_PRUNE) !== null) {
              return true;
            }
            if (el.parentNode !== null && dom_default.isPhxUpdate(el.parentNode, phxUpdate, ["append", "prepend"]) && el.id) {
              return false;
            }
            if (el.getAttribute && el.getAttribute(phxRemove)) {
              pendingRemoves.push(el);
              return false;
            }
            if (this.skipCIDSibling(el)) {
              return false;
            }
            return true;
          },
          onElUpdated: (el) => {
            if (dom_default.isNowTriggerFormExternal(el, phxTriggerExternal)) {
              externalFormTriggered = el;
            }
            updates.push(el);
          },
          onBeforeElUpdated: (fromEl, toEl) => {
            dom_default.cleanChildNodes(toEl, phxUpdate);
            if (this.skipCIDSibling(toEl)) {
              return false;
            }
            if (dom_default.isPhxSticky(fromEl)) {
              return false;
            }
            if (dom_default.isIgnored(fromEl, phxUpdate)) {
              this.trackBefore("updated", fromEl, toEl);
              dom_default.mergeAttrs(fromEl, toEl, { isIgnored: true });
              updates.push(fromEl);
              dom_default.applyStickyOperations(fromEl);
              return false;
            }
            if (fromEl.type === "number" && (fromEl.validity && fromEl.validity.badInput)) {
              return false;
            }
            if (!dom_default.syncPendingRef(fromEl, toEl, disableWith)) {
              if (dom_default.isUploadInput(fromEl)) {
                this.trackBefore("updated", fromEl, toEl);
                updates.push(fromEl);
              }
              dom_default.applyStickyOperations(fromEl);
              return false;
            }
            if (dom_default.isPhxChild(toEl)) {
              let prevSession = fromEl.getAttribute(PHX_SESSION);
              dom_default.mergeAttrs(fromEl, toEl, { exclude: [PHX_STATIC] });
              if (prevSession !== "") {
                fromEl.setAttribute(PHX_SESSION, prevSession);
              }
              fromEl.setAttribute(PHX_ROOT_ID, this.rootID);
              dom_default.applyStickyOperations(fromEl);
              return false;
            }
            dom_default.copyPrivates(toEl, fromEl);
            dom_default.discardError(targetContainer, toEl, phxFeedbackFor);
            let isFocusedFormEl = focused && fromEl.isSameNode(focused) && dom_default.isFormInput(fromEl);
            if (isFocusedFormEl) {
              this.trackBefore("updated", fromEl, toEl);
              dom_default.mergeFocusedInput(fromEl, toEl);
              dom_default.syncAttrsToProps(fromEl);
              updates.push(fromEl);
              dom_default.applyStickyOperations(fromEl);
              return false;
            } else {
              if (dom_default.isPhxUpdate(toEl, phxUpdate, ["append", "prepend"])) {
                appendPrependUpdates.push(new DOMPostMorphRestorer(fromEl, toEl, toEl.getAttribute(phxUpdate)));
              }
              dom_default.syncAttrsToProps(toEl);
              dom_default.applyStickyOperations(toEl);
              this.trackBefore("updated", fromEl, toEl);
              return true;
            }
          }
        });
      });
      if (liveSocket2.isDebugEnabled()) {
        detectDuplicateIds();
      }
      if (appendPrependUpdates.length > 0) {
        liveSocket2.time("post-morph append/prepend restoration", () => {
          appendPrependUpdates.forEach((update) => update.perform());
        });
      }
      liveSocket2.silenceEvents(() => dom_default.restoreFocus(focused, selectionStart, selectionEnd));
      dom_default.dispatchEvent(document, "phx:update");
      added.forEach((el) => this.trackAfter("added", el));
      updates.forEach((el) => this.trackAfter("updated", el));
      if (pendingRemoves.length > 0) {
        liveSocket2.transitionRemoves(pendingRemoves);
        liveSocket2.requestDOMUpdate(() => {
          pendingRemoves.forEach((el) => {
            let child = dom_default.firstPhxChild(el);
            if (child) {
              liveSocket2.destroyViewByEl(child);
            }
            el.remove();
          });
          this.trackAfter("transitionsDiscarded", pendingRemoves);
        });
      }
      if (externalFormTriggered) {
        liveSocket2.disconnect();
        externalFormTriggered.submit();
      }
      return true;
    }
    isCIDPatch() {
      return this.cidPatch;
    }
    skipCIDSibling(el) {
      return el.nodeType === Node.ELEMENT_NODE && el.getAttribute(PHX_SKIP) !== null;
    }
    targetCIDContainer(html) {
      if (!this.isCIDPatch()) {
        return;
      }
      let [first, ...rest] = dom_default.findComponentNodeList(this.container, this.targetCID);
      if (rest.length === 0 && dom_default.childNodeLength(html) === 1) {
        return first;
      } else {
        return first && first.parentNode;
      }
    }
    buildDiffHTML(container, html, phxUpdate, targetContainer) {
      let isCIDPatch = this.isCIDPatch();
      let isCIDWithSingleRoot = isCIDPatch && targetContainer.getAttribute(PHX_COMPONENT) === this.targetCID.toString();
      if (!isCIDPatch || isCIDWithSingleRoot) {
        return html;
      } else {
        let diffContainer = null;
        let template = document.createElement("template");
        diffContainer = dom_default.cloneNode(targetContainer);
        let [firstComponent, ...rest] = dom_default.findComponentNodeList(diffContainer, this.targetCID);
        template.innerHTML = html;
        rest.forEach((el) => el.remove());
        Array.from(diffContainer.childNodes).forEach((child) => {
          if (child.id && child.nodeType === Node.ELEMENT_NODE && child.getAttribute(PHX_COMPONENT) !== this.targetCID.toString()) {
            child.setAttribute(PHX_SKIP, "");
            child.innerHTML = "";
          }
        });
        Array.from(template.content.childNodes).forEach((el) => diffContainer.insertBefore(el, firstComponent));
        firstComponent.remove();
        return diffContainer.outerHTML;
      }
    }
  };
  var Rendered = class {
    static extract(diff) {
      let { [REPLY]: reply, [EVENTS]: events, [TITLE]: title } = diff;
      delete diff[REPLY];
      delete diff[EVENTS];
      delete diff[TITLE];
      return { diff, title, reply: reply || null, events: events || [] };
    }
    constructor(viewId, rendered) {
      this.viewId = viewId;
      this.rendered = {};
      this.mergeDiff(rendered);
    }
    parentViewId() {
      return this.viewId;
    }
    toString(onlyCids) {
      return this.recursiveToString(this.rendered, this.rendered[COMPONENTS], onlyCids);
    }
    recursiveToString(rendered, components = rendered[COMPONENTS], onlyCids) {
      onlyCids = onlyCids ? new Set(onlyCids) : null;
      let output = { buffer: "", components, onlyCids };
      this.toOutputBuffer(rendered, null, output);
      return output.buffer;
    }
    componentCIDs(diff) {
      return Object.keys(diff[COMPONENTS] || {}).map((i) => parseInt(i));
    }
    isComponentOnlyDiff(diff) {
      if (!diff[COMPONENTS]) {
        return false;
      }
      return Object.keys(diff).length === 1;
    }
    getComponent(diff, cid) {
      return diff[COMPONENTS][cid];
    }
    mergeDiff(diff) {
      let newc = diff[COMPONENTS];
      let cache = {};
      delete diff[COMPONENTS];
      this.rendered = this.mutableMerge(this.rendered, diff);
      this.rendered[COMPONENTS] = this.rendered[COMPONENTS] || {};
      if (newc) {
        let oldc = this.rendered[COMPONENTS];
        for (let cid in newc) {
          newc[cid] = this.cachedFindComponent(cid, newc[cid], oldc, newc, cache);
        }
        for (let cid in newc) {
          oldc[cid] = newc[cid];
        }
        diff[COMPONENTS] = newc;
      }
    }
    cachedFindComponent(cid, cdiff, oldc, newc, cache) {
      if (cache[cid]) {
        return cache[cid];
      } else {
        let ndiff, stat, scid = cdiff[STATIC];
        if (isCid(scid)) {
          let tdiff;
          if (scid > 0) {
            tdiff = this.cachedFindComponent(scid, newc[scid], oldc, newc, cache);
          } else {
            tdiff = oldc[-scid];
          }
          stat = tdiff[STATIC];
          ndiff = this.cloneMerge(tdiff, cdiff);
          ndiff[STATIC] = stat;
        } else {
          ndiff = cdiff[STATIC] !== void 0 ? cdiff : this.cloneMerge(oldc[cid] || {}, cdiff);
        }
        cache[cid] = ndiff;
        return ndiff;
      }
    }
    mutableMerge(target, source) {
      if (source[STATIC] !== void 0) {
        return source;
      } else {
        this.doMutableMerge(target, source);
        return target;
      }
    }
    doMutableMerge(target, source) {
      for (let key in source) {
        let val = source[key];
        let targetVal = target[key];
        if (isObject(val) && val[STATIC] === void 0 && isObject(targetVal)) {
          this.doMutableMerge(targetVal, val);
        } else {
          target[key] = val;
        }
      }
    }
    cloneMerge(target, source) {
      let merged = __spreadValues(__spreadValues({}, target), source);
      for (let key in merged) {
        let val = source[key];
        let targetVal = target[key];
        if (isObject(val) && val[STATIC] === void 0 && isObject(targetVal)) {
          merged[key] = this.cloneMerge(targetVal, val);
        }
      }
      return merged;
    }
    componentToString(cid) {
      return this.recursiveCIDToString(this.rendered[COMPONENTS], cid);
    }
    pruneCIDs(cids) {
      cids.forEach((cid) => delete this.rendered[COMPONENTS][cid]);
    }
    get() {
      return this.rendered;
    }
    isNewFingerprint(diff = {}) {
      return !!diff[STATIC];
    }
    templateStatic(part, templates) {
      if (typeof part === "number") {
        return templates[part];
      } else {
        return part;
      }
    }
    toOutputBuffer(rendered, templates, output) {
      if (rendered[DYNAMICS]) {
        return this.comprehensionToBuffer(rendered, templates, output);
      }
      let { [STATIC]: statics } = rendered;
      statics = this.templateStatic(statics, templates);
      output.buffer += statics[0];
      for (let i = 1; i < statics.length; i++) {
        this.dynamicToBuffer(rendered[i - 1], templates, output);
        output.buffer += statics[i];
      }
    }
    comprehensionToBuffer(rendered, templates, output) {
      let { [DYNAMICS]: dynamics, [STATIC]: statics } = rendered;
      statics = this.templateStatic(statics, templates);
      let compTemplates = templates || rendered[TEMPLATES];
      for (let d = 0; d < dynamics.length; d++) {
        let dynamic = dynamics[d];
        output.buffer += statics[0];
        for (let i = 1; i < statics.length; i++) {
          this.dynamicToBuffer(dynamic[i - 1], compTemplates, output);
          output.buffer += statics[i];
        }
      }
    }
    dynamicToBuffer(rendered, templates, output) {
      if (typeof rendered === "number") {
        output.buffer += this.recursiveCIDToString(output.components, rendered, output.onlyCids);
      } else if (isObject(rendered)) {
        this.toOutputBuffer(rendered, templates, output);
      } else {
        output.buffer += rendered;
      }
    }
    recursiveCIDToString(components, cid, onlyCids) {
      let component = components[cid] || logError(`no component for CID ${cid}`, components);
      let template = document.createElement("template");
      template.innerHTML = this.recursiveToString(component, components, onlyCids);
      let container = template.content;
      let skip = onlyCids && !onlyCids.has(cid);
      let [hasChildNodes, hasChildComponents] = Array.from(container.childNodes).reduce(([hasNodes, hasComponents], child, i) => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          if (child.getAttribute(PHX_COMPONENT)) {
            return [hasNodes, true];
          }
          child.setAttribute(PHX_COMPONENT, cid);
          if (!child.id) {
            child.id = `${this.parentViewId()}-${cid}-${i}`;
          }
          if (skip) {
            child.setAttribute(PHX_SKIP, "");
            child.innerHTML = "";
          }
          return [true, hasComponents];
        } else {
          if (child.nodeValue.trim() !== "") {
            logError(`only HTML element tags are allowed at the root of components.

got: "${child.nodeValue.trim()}"

within:
`, template.innerHTML.trim());
            child.replaceWith(this.createSpan(child.nodeValue, cid));
            return [true, hasComponents];
          } else {
            child.remove();
            return [hasNodes, hasComponents];
          }
        }
      }, [false, false]);
      if (!hasChildNodes && !hasChildComponents) {
        logError("expected at least one HTML element tag inside a component, but the component is empty:\n", template.innerHTML.trim());
        return this.createSpan("", cid).outerHTML;
      } else if (!hasChildNodes && hasChildComponents) {
        logError("expected at least one HTML element tag directly inside a component, but only subcomponents were found. A component must render at least one HTML tag directly inside itself.", template.innerHTML.trim());
        return template.innerHTML;
      } else {
        return template.innerHTML;
      }
    }
    createSpan(text, cid) {
      let span = document.createElement("span");
      span.innerText = text;
      span.setAttribute(PHX_COMPONENT, cid);
      return span;
    }
  };
  var viewHookID = 1;
  var ViewHook = class {
    static makeID() {
      return viewHookID++;
    }
    static elementID(el) {
      return el.phxHookId;
    }
    constructor(view, el, callbacks) {
      this.__view = view;
      this.liveSocket = view.liveSocket;
      this.__callbacks = callbacks;
      this.__listeners = /* @__PURE__ */ new Set();
      this.__isDisconnected = false;
      this.el = el;
      this.el.phxHookId = this.constructor.makeID();
      for (let key in this.__callbacks) {
        this[key] = this.__callbacks[key];
      }
    }
    __mounted() {
      this.mounted && this.mounted();
    }
    __updated() {
      this.updated && this.updated();
    }
    __beforeUpdate() {
      this.beforeUpdate && this.beforeUpdate();
    }
    __destroyed() {
      this.destroyed && this.destroyed();
    }
    __reconnected() {
      if (this.__isDisconnected) {
        this.__isDisconnected = false;
        this.reconnected && this.reconnected();
      }
    }
    __disconnected() {
      this.__isDisconnected = true;
      this.disconnected && this.disconnected();
    }
    pushEvent(event, payload = {}, onReply = function() {
    }) {
      return this.__view.pushHookEvent(null, event, payload, onReply);
    }
    pushEventTo(phxTarget, event, payload = {}, onReply = function() {
    }) {
      return this.__view.withinTargets(phxTarget, (view, targetCtx) => {
        return view.pushHookEvent(targetCtx, event, payload, onReply);
      });
    }
    handleEvent(event, callback) {
      let callbackRef = (customEvent, bypass) => bypass ? event : callback(customEvent.detail);
      window.addEventListener(`phx:${event}`, callbackRef);
      this.__listeners.add(callbackRef);
      return callbackRef;
    }
    removeHandleEvent(callbackRef) {
      let event = callbackRef(null, true);
      window.removeEventListener(`phx:${event}`, callbackRef);
      this.__listeners.delete(callbackRef);
    }
    upload(name, files) {
      return this.__view.dispatchUploads(name, files);
    }
    uploadTo(phxTarget, name, files) {
      return this.__view.withinTargets(phxTarget, (view) => view.dispatchUploads(name, files));
    }
    __cleanup__() {
      this.__listeners.forEach((callbackRef) => this.removeHandleEvent(callbackRef));
    }
  };
  var JS = {
    exec(eventType, phxEvent, view, sourceEl, defaults) {
      let [defaultKind, defaultArgs] = defaults || [null, {}];
      let commands = phxEvent.charAt(0) === "[" ? JSON.parse(phxEvent) : [[defaultKind, defaultArgs]];
      commands.forEach(([kind, args]) => {
        if (kind === defaultKind && defaultArgs.data) {
          args.data = Object.assign(args.data || {}, defaultArgs.data);
        }
        this.filterToEls(sourceEl, args).forEach((el) => {
          this[`exec_${kind}`](eventType, phxEvent, view, sourceEl, el, args);
        });
      });
    },
    isVisible(el) {
      return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length > 0);
    },
    exec_dispatch(eventType, phxEvent, view, sourceEl, el, { to, event, detail, bubbles }) {
      detail = detail || {};
      detail.dispatcher = sourceEl;
      dom_default.dispatchEvent(el, event, { detail, bubbles });
    },
    exec_push(eventType, phxEvent, view, sourceEl, el, args) {
      if (!view.isConnected()) {
        return;
      }
      let { event, data, target, page_loading, loading, value, dispatcher } = args;
      let pushOpts = { loading, value, target, page_loading: !!page_loading };
      let targetSrc = eventType === "change" && dispatcher ? dispatcher : sourceEl;
      let phxTarget = target || targetSrc.getAttribute(view.binding("target")) || targetSrc;
      view.withinTargets(phxTarget, (targetView, targetCtx) => {
        if (eventType === "change") {
          let { newCid, _target, callback } = args;
          _target = _target || (sourceEl instanceof HTMLInputElement ? sourceEl.name : void 0);
          if (_target) {
            pushOpts._target = _target;
          }
          targetView.pushInput(sourceEl, targetCtx, newCid, event || phxEvent, pushOpts, callback);
        } else if (eventType === "submit") {
          targetView.submitForm(sourceEl, targetCtx, event || phxEvent, pushOpts);
        } else {
          targetView.pushEvent(eventType, sourceEl, targetCtx, event || phxEvent, data, pushOpts);
        }
      });
    },
    exec_add_class(eventType, phxEvent, view, sourceEl, el, { names, transition, time }) {
      this.addOrRemoveClasses(el, names, [], transition, time, view);
    },
    exec_remove_class(eventType, phxEvent, view, sourceEl, el, { names, transition, time }) {
      this.addOrRemoveClasses(el, [], names, transition, time, view);
    },
    exec_transition(eventType, phxEvent, view, sourceEl, el, { time, transition }) {
      let [transition_start, running, transition_end] = transition;
      let onStart = () => this.addOrRemoveClasses(el, transition_start.concat(running), []);
      let onDone = () => this.addOrRemoveClasses(el, transition_end, transition_start.concat(running));
      view.transition(time, onStart, onDone);
    },
    exec_toggle(eventType, phxEvent, view, sourceEl, el, { display, ins, outs, time }) {
      this.toggle(eventType, view, el, display, ins, outs, time);
    },
    exec_show(eventType, phxEvent, view, sourceEl, el, { display, transition, time }) {
      this.show(eventType, view, el, display, transition, time);
    },
    exec_hide(eventType, phxEvent, view, sourceEl, el, { display, transition, time }) {
      this.hide(eventType, view, el, display, transition, time);
    },
    exec_set_attr(eventType, phxEvent, view, sourceEl, el, { attr: [attr, val] }) {
      this.setOrRemoveAttrs(el, [[attr, val]], []);
    },
    exec_remove_attr(eventType, phxEvent, view, sourceEl, el, { attr }) {
      this.setOrRemoveAttrs(el, [], [attr]);
    },
    show(eventType, view, el, display, transition, time) {
      if (!this.isVisible(el)) {
        this.toggle(eventType, view, el, display, transition, null, time);
      }
    },
    hide(eventType, view, el, display, transition, time) {
      if (this.isVisible(el)) {
        this.toggle(eventType, view, el, display, null, transition, time);
      }
    },
    toggle(eventType, view, el, display, ins, outs, time) {
      let [inClasses, inStartClasses, inEndClasses] = ins || [[], [], []];
      let [outClasses, outStartClasses, outEndClasses] = outs || [[], [], []];
      if (inClasses.length > 0 || outClasses.length > 0) {
        if (this.isVisible(el)) {
          let onStart = () => {
            this.addOrRemoveClasses(el, outStartClasses, inClasses.concat(inStartClasses).concat(inEndClasses));
            window.requestAnimationFrame(() => {
              this.addOrRemoveClasses(el, outClasses, []);
              window.requestAnimationFrame(() => this.addOrRemoveClasses(el, outEndClasses, outStartClasses));
            });
          };
          el.dispatchEvent(new Event("phx:hide-start"));
          view.transition(time, onStart, () => {
            this.addOrRemoveClasses(el, [], outClasses.concat(outEndClasses));
            dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = "none");
            el.dispatchEvent(new Event("phx:hide-end"));
          });
        } else {
          if (eventType === "remove") {
            return;
          }
          let onStart = () => {
            this.addOrRemoveClasses(el, inStartClasses, outClasses.concat(outStartClasses).concat(outEndClasses));
            dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = display || "block");
            window.requestAnimationFrame(() => {
              this.addOrRemoveClasses(el, inClasses, []);
              window.requestAnimationFrame(() => this.addOrRemoveClasses(el, inEndClasses, inStartClasses));
            });
          };
          el.dispatchEvent(new Event("phx:show-start"));
          view.transition(time, onStart, () => {
            this.addOrRemoveClasses(el, [], inClasses.concat(inEndClasses));
            el.dispatchEvent(new Event("phx:show-end"));
          });
        }
      } else {
        if (this.isVisible(el)) {
          window.requestAnimationFrame(() => {
            el.dispatchEvent(new Event("phx:hide-start"));
            dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = "none");
            el.dispatchEvent(new Event("phx:hide-end"));
          });
        } else {
          window.requestAnimationFrame(() => {
            el.dispatchEvent(new Event("phx:show-start"));
            dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = display || "block");
            el.dispatchEvent(new Event("phx:show-end"));
          });
        }
      }
    },
    addOrRemoveClasses(el, adds, removes, transition, time, view) {
      let [transition_run, transition_start, transition_end] = transition || [[], [], []];
      if (transition_run.length > 0) {
        let onStart = () => this.addOrRemoveClasses(el, transition_start.concat(transition_run), []);
        let onDone = () => this.addOrRemoveClasses(el, adds.concat(transition_end), removes.concat(transition_run).concat(transition_start));
        return view.transition(time, onStart, onDone);
      }
      window.requestAnimationFrame(() => {
        let [prevAdds, prevRemoves] = dom_default.getSticky(el, "classes", [[], []]);
        let keepAdds = adds.filter((name) => prevAdds.indexOf(name) < 0 && !el.classList.contains(name));
        let keepRemoves = removes.filter((name) => prevRemoves.indexOf(name) < 0 && el.classList.contains(name));
        let newAdds = prevAdds.filter((name) => removes.indexOf(name) < 0).concat(keepAdds);
        let newRemoves = prevRemoves.filter((name) => adds.indexOf(name) < 0).concat(keepRemoves);
        dom_default.putSticky(el, "classes", (currentEl) => {
          currentEl.classList.remove(...newRemoves);
          currentEl.classList.add(...newAdds);
          return [newAdds, newRemoves];
        });
      });
    },
    setOrRemoveAttrs(el, sets, removes) {
      let [prevSets, prevRemoves] = dom_default.getSticky(el, "attrs", [[], []]);
      let alteredAttrs = sets.map(([attr, _val]) => attr).concat(removes);
      let newSets = prevSets.filter(([attr, _val]) => !alteredAttrs.includes(attr)).concat(sets);
      let newRemoves = prevRemoves.filter((attr) => !alteredAttrs.includes(attr)).concat(removes);
      dom_default.putSticky(el, "attrs", (currentEl) => {
        newRemoves.forEach((attr) => currentEl.removeAttribute(attr));
        newSets.forEach(([attr, val]) => currentEl.setAttribute(attr, val));
        return [newSets, newRemoves];
      });
    },
    hasAllClasses(el, classes) {
      return classes.every((name) => el.classList.contains(name));
    },
    isToggledOut(el, outClasses) {
      return !this.isVisible(el) || this.hasAllClasses(el, outClasses);
    },
    filterToEls(sourceEl, { to }) {
      return to ? dom_default.all(document, to) : [sourceEl];
    }
  };
  var js_default = JS;
  var serializeForm = (form, meta, onlyNames = []) => {
    let formData = new FormData(form);
    let toRemove = [];
    formData.forEach((val, key, _index) => {
      if (val instanceof File) {
        toRemove.push(key);
      }
    });
    toRemove.forEach((key) => formData.delete(key));
    let params = new URLSearchParams();
    for (let [key, val] of formData.entries()) {
      if (onlyNames.length === 0 || onlyNames.indexOf(key) >= 0) {
        params.append(key, val);
      }
    }
    for (let metaKey in meta) {
      params.append(metaKey, meta[metaKey]);
    }
    return params.toString();
  };
  var View = class {
    constructor(el, liveSocket2, parentView, flash) {
      this.liveSocket = liveSocket2;
      this.flash = flash;
      this.parent = parentView;
      this.root = parentView ? parentView.root : this;
      this.el = el;
      this.id = this.el.id;
      this.ref = 0;
      this.childJoins = 0;
      this.loaderTimer = null;
      this.pendingDiffs = [];
      this.pruningCIDs = [];
      this.redirect = false;
      this.href = null;
      this.joinCount = this.parent ? this.parent.joinCount - 1 : 0;
      this.joinPending = true;
      this.destroyed = false;
      this.joinCallback = function(onDone) {
        onDone && onDone();
      };
      this.stopCallback = function() {
      };
      this.pendingJoinOps = this.parent ? null : [];
      this.viewHooks = {};
      this.uploaders = {};
      this.formSubmits = [];
      this.children = this.parent ? null : {};
      this.root.children[this.id] = {};
      this.channel = this.liveSocket.channel(`lv:${this.id}`, () => {
        return {
          redirect: this.redirect ? this.href : void 0,
          url: this.redirect ? void 0 : this.href || void 0,
          params: this.connectParams(),
          session: this.getSession(),
          static: this.getStatic(),
          flash: this.flash
        };
      });
      this.showLoader(this.liveSocket.loaderTimeout);
      this.bindChannel();
    }
    setHref(href) {
      this.href = href;
    }
    setRedirect(href) {
      this.redirect = true;
      this.href = href;
    }
    isMain() {
      return this.el.getAttribute(PHX_MAIN) !== null;
    }
    connectParams() {
      let params = this.liveSocket.params(this.el);
      let manifest = dom_default.all(document, `[${this.binding(PHX_TRACK_STATIC)}]`).map((node) => node.src || node.href).filter((url) => typeof url === "string");
      if (manifest.length > 0) {
        params["_track_static"] = manifest;
      }
      params["_mounts"] = this.joinCount;
      return params;
    }
    isConnected() {
      return this.channel.canPush();
    }
    getSession() {
      return this.el.getAttribute(PHX_SESSION);
    }
    getStatic() {
      let val = this.el.getAttribute(PHX_STATIC);
      return val === "" ? null : val;
    }
    destroy(callback = function() {
    }) {
      this.destroyAllChildren();
      this.destroyed = true;
      delete this.root.children[this.id];
      if (this.parent) {
        delete this.root.children[this.parent.id][this.id];
      }
      clearTimeout(this.loaderTimer);
      let onFinished = () => {
        callback();
        for (let id in this.viewHooks) {
          this.destroyHook(this.viewHooks[id]);
        }
      };
      dom_default.markPhxChildDestroyed(this.el);
      this.log("destroyed", () => ["the child has been removed from the parent"]);
      this.channel.leave().receive("ok", onFinished).receive("error", onFinished).receive("timeout", onFinished);
    }
    setContainerClasses(...classes) {
      this.el.classList.remove(PHX_CONNECTED_CLASS, PHX_DISCONNECTED_CLASS, PHX_ERROR_CLASS);
      this.el.classList.add(...classes);
    }
    showLoader(timeout) {
      clearTimeout(this.loaderTimer);
      if (timeout) {
        this.loaderTimer = setTimeout(() => this.showLoader(), timeout);
      } else {
        for (let id in this.viewHooks) {
          this.viewHooks[id].__disconnected();
        }
        this.setContainerClasses(PHX_DISCONNECTED_CLASS);
      }
    }
    hideLoader() {
      clearTimeout(this.loaderTimer);
      this.setContainerClasses(PHX_CONNECTED_CLASS);
    }
    triggerReconnected() {
      for (let id in this.viewHooks) {
        this.viewHooks[id].__reconnected();
      }
    }
    log(kind, msgCallback) {
      this.liveSocket.log(this, kind, msgCallback);
    }
    transition(time, onStart, onDone = function() {
    }) {
      this.liveSocket.transition(time, onStart, onDone);
    }
    withinTargets(phxTarget, callback) {
      if (phxTarget instanceof HTMLElement || phxTarget instanceof SVGElement) {
        return this.liveSocket.owner(phxTarget, (view) => callback(view, phxTarget));
      }
      if (isCid(phxTarget)) {
        let targets = dom_default.findComponentNodeList(this.el, phxTarget);
        if (targets.length === 0) {
          logError(`no component found matching phx-target of ${phxTarget}`);
        } else {
          callback(this, parseInt(phxTarget));
        }
      } else {
        let targets = Array.from(document.querySelectorAll(phxTarget));
        if (targets.length === 0) {
          logError(`nothing found matching the phx-target selector "${phxTarget}"`);
        }
        targets.forEach((target) => this.liveSocket.owner(target, (view) => callback(view, target)));
      }
    }
    applyDiff(type, rawDiff, callback) {
      this.log(type, () => ["", clone(rawDiff)]);
      let { diff, reply, events, title } = Rendered.extract(rawDiff);
      if (title) {
        dom_default.putTitle(title);
      }
      callback({ diff, reply, events });
      return reply;
    }
    onJoin(resp) {
      let { rendered, container } = resp;
      if (container) {
        let [tag, attrs] = container;
        this.el = dom_default.replaceRootContainer(this.el, tag, attrs);
      }
      this.childJoins = 0;
      this.joinPending = true;
      this.flash = null;
      browser_default.dropLocal(this.liveSocket.localStorage, window.location.pathname, CONSECUTIVE_RELOADS);
      this.applyDiff("mount", rendered, ({ diff, events }) => {
        this.rendered = new Rendered(this.id, diff);
        let html = this.renderContainer(null, "join");
        this.dropPendingRefs();
        let forms = this.formsForRecovery(html);
        this.joinCount++;
        if (forms.length > 0) {
          forms.forEach(([form, newForm, newCid], i) => {
            this.pushFormRecovery(form, newCid, (resp2) => {
              if (i === forms.length - 1) {
                this.onJoinComplete(resp2, html, events);
              }
            });
          });
        } else {
          this.onJoinComplete(resp, html, events);
        }
      });
    }
    dropPendingRefs() {
      dom_default.all(document, `[${PHX_REF_SRC}="${this.id}"][${PHX_REF}]`, (el) => {
        el.removeAttribute(PHX_REF);
        el.removeAttribute(PHX_REF_SRC);
      });
    }
    onJoinComplete({ live_patch }, html, events) {
      if (this.joinCount > 1 || this.parent && !this.parent.isJoinPending()) {
        return this.applyJoinPatch(live_patch, html, events);
      }
      let newChildren = dom_default.findPhxChildrenInFragment(html, this.id).filter((toEl) => {
        let fromEl = toEl.id && this.el.querySelector(`[id="${toEl.id}"]`);
        let phxStatic = fromEl && fromEl.getAttribute(PHX_STATIC);
        if (phxStatic) {
          toEl.setAttribute(PHX_STATIC, phxStatic);
        }
        return this.joinChild(toEl);
      });
      if (newChildren.length === 0) {
        if (this.parent) {
          this.root.pendingJoinOps.push([this, () => this.applyJoinPatch(live_patch, html, events)]);
          this.parent.ackJoin(this);
        } else {
          this.onAllChildJoinsComplete();
          this.applyJoinPatch(live_patch, html, events);
        }
      } else {
        this.root.pendingJoinOps.push([this, () => this.applyJoinPatch(live_patch, html, events)]);
      }
    }
    attachTrueDocEl() {
      this.el = dom_default.byId(this.id);
      this.el.setAttribute(PHX_ROOT_ID, this.root.id);
    }
    applyJoinPatch(live_patch, html, events) {
      this.attachTrueDocEl();
      let patch = new DOMPatch(this, this.el, this.id, html, null);
      patch.markPrunableContentForRemoval();
      this.performPatch(patch, false);
      this.joinNewChildren();
      dom_default.all(this.el, `[${this.binding(PHX_HOOK)}], [data-phx-${PHX_HOOK}]`, (hookEl) => {
        let hook = this.addHook(hookEl);
        if (hook) {
          hook.__mounted();
        }
      });
      this.joinPending = false;
      this.liveSocket.dispatchEvents(events);
      this.applyPendingUpdates();
      if (live_patch) {
        let { kind, to } = live_patch;
        this.liveSocket.historyPatch(to, kind);
      }
      this.hideLoader();
      if (this.joinCount > 1) {
        this.triggerReconnected();
      }
      this.stopCallback();
    }
    triggerBeforeUpdateHook(fromEl, toEl) {
      this.liveSocket.triggerDOM("onBeforeElUpdated", [fromEl, toEl]);
      let hook = this.getHook(fromEl);
      let isIgnored = hook && dom_default.isIgnored(fromEl, this.binding(PHX_UPDATE));
      if (hook && !fromEl.isEqualNode(toEl) && !(isIgnored && isEqualObj(fromEl.dataset, toEl.dataset))) {
        hook.__beforeUpdate();
        return hook;
      }
    }
    performPatch(patch, pruneCids) {
      let removedEls = [];
      let phxChildrenAdded = false;
      let updatedHookIds = /* @__PURE__ */ new Set();
      patch.after("added", (el) => {
        this.liveSocket.triggerDOM("onNodeAdded", [el]);
        let newHook = this.addHook(el);
        if (newHook) {
          newHook.__mounted();
        }
      });
      patch.after("phxChildAdded", (el) => {
        if (dom_default.isPhxSticky(el)) {
          this.liveSocket.joinRootViews();
        } else {
          phxChildrenAdded = true;
        }
      });
      patch.before("updated", (fromEl, toEl) => {
        let hook = this.triggerBeforeUpdateHook(fromEl, toEl);
        if (hook) {
          updatedHookIds.add(fromEl.id);
        }
      });
      patch.after("updated", (el) => {
        if (updatedHookIds.has(el.id)) {
          this.getHook(el).__updated();
        }
      });
      patch.after("discarded", (el) => {
        if (el.nodeType === Node.ELEMENT_NODE) {
          removedEls.push(el);
        }
      });
      patch.after("transitionsDiscarded", (els) => this.afterElementsRemoved(els, pruneCids));
      patch.perform();
      this.afterElementsRemoved(removedEls, pruneCids);
      return phxChildrenAdded;
    }
    afterElementsRemoved(elements, pruneCids) {
      let destroyedCIDs = [];
      elements.forEach((parent) => {
        let components = dom_default.all(parent, `[${PHX_COMPONENT}]`);
        let hooks = dom_default.all(parent, `[${this.binding(PHX_HOOK)}]`);
        components.concat(parent).forEach((el) => {
          let cid = this.componentID(el);
          if (isCid(cid) && destroyedCIDs.indexOf(cid) === -1) {
            destroyedCIDs.push(cid);
          }
        });
        hooks.concat(parent).forEach((hookEl) => {
          let hook = this.getHook(hookEl);
          hook && this.destroyHook(hook);
        });
      });
      if (pruneCids) {
        this.maybePushComponentsDestroyed(destroyedCIDs);
      }
    }
    joinNewChildren() {
      dom_default.findPhxChildren(this.el, this.id).forEach((el) => this.joinChild(el));
    }
    getChildById(id) {
      return this.root.children[this.id][id];
    }
    getDescendentByEl(el) {
      if (el.id === this.id) {
        return this;
      } else {
        return this.children[el.getAttribute(PHX_PARENT_ID)][el.id];
      }
    }
    destroyDescendent(id) {
      for (let parentId in this.root.children) {
        for (let childId in this.root.children[parentId]) {
          if (childId === id) {
            return this.root.children[parentId][childId].destroy();
          }
        }
      }
    }
    joinChild(el) {
      let child = this.getChildById(el.id);
      if (!child) {
        let view = new View(el, this.liveSocket, this);
        this.root.children[this.id][view.id] = view;
        view.join();
        this.childJoins++;
        return true;
      }
    }
    isJoinPending() {
      return this.joinPending;
    }
    ackJoin(_child) {
      this.childJoins--;
      if (this.childJoins === 0) {
        if (this.parent) {
          this.parent.ackJoin(this);
        } else {
          this.onAllChildJoinsComplete();
        }
      }
    }
    onAllChildJoinsComplete() {
      this.joinCallback(() => {
        this.pendingJoinOps.forEach(([view, op]) => {
          if (!view.isDestroyed()) {
            op();
          }
        });
        this.pendingJoinOps = [];
      });
    }
    update(diff, events) {
      if (this.isJoinPending() || this.liveSocket.hasPendingLink() && !dom_default.isPhxSticky(this.el)) {
        return this.pendingDiffs.push({ diff, events });
      }
      this.rendered.mergeDiff(diff);
      let phxChildrenAdded = false;
      if (this.rendered.isComponentOnlyDiff(diff)) {
        this.liveSocket.time("component patch complete", () => {
          let parentCids = dom_default.findParentCIDs(this.el, this.rendered.componentCIDs(diff));
          parentCids.forEach((parentCID) => {
            if (this.componentPatch(this.rendered.getComponent(diff, parentCID), parentCID)) {
              phxChildrenAdded = true;
            }
          });
        });
      } else if (!isEmpty(diff)) {
        this.liveSocket.time("full patch complete", () => {
          let html = this.renderContainer(diff, "update");
          let patch = new DOMPatch(this, this.el, this.id, html, null);
          phxChildrenAdded = this.performPatch(patch, true);
        });
      }
      this.liveSocket.dispatchEvents(events);
      if (phxChildrenAdded) {
        this.joinNewChildren();
      }
    }
    renderContainer(diff, kind) {
      return this.liveSocket.time(`toString diff (${kind})`, () => {
        let tag = this.el.tagName;
        let cids = diff ? this.rendered.componentCIDs(diff).concat(this.pruningCIDs) : null;
        let html = this.rendered.toString(cids);
        return `<${tag}>${html}</${tag}>`;
      });
    }
    componentPatch(diff, cid) {
      if (isEmpty(diff))
        return false;
      let html = this.rendered.componentToString(cid);
      let patch = new DOMPatch(this, this.el, this.id, html, cid);
      let childrenAdded = this.performPatch(patch, true);
      return childrenAdded;
    }
    getHook(el) {
      return this.viewHooks[ViewHook.elementID(el)];
    }
    addHook(el) {
      if (ViewHook.elementID(el) || !el.getAttribute) {
        return;
      }
      let hookName = el.getAttribute(`data-phx-${PHX_HOOK}`) || el.getAttribute(this.binding(PHX_HOOK));
      if (hookName && !this.ownsElement(el)) {
        return;
      }
      let callbacks = this.liveSocket.getHookCallbacks(hookName);
      if (callbacks) {
        if (!el.id) {
          logError(`no DOM ID for hook "${hookName}". Hooks require a unique ID on each element.`, el);
        }
        let hook = new ViewHook(this, el, callbacks);
        this.viewHooks[ViewHook.elementID(hook.el)] = hook;
        return hook;
      } else if (hookName !== null) {
        logError(`unknown hook found for "${hookName}"`, el);
      }
    }
    destroyHook(hook) {
      hook.__destroyed();
      hook.__cleanup__();
      delete this.viewHooks[ViewHook.elementID(hook.el)];
    }
    applyPendingUpdates() {
      this.pendingDiffs.forEach(({ diff, events }) => this.update(diff, events));
      this.pendingDiffs = [];
    }
    onChannel(event, cb) {
      this.liveSocket.onChannel(this.channel, event, (resp) => {
        if (this.isJoinPending()) {
          this.root.pendingJoinOps.push([this, () => cb(resp)]);
        } else {
          this.liveSocket.requestDOMUpdate(() => cb(resp));
        }
      });
    }
    bindChannel() {
      this.liveSocket.onChannel(this.channel, "diff", (rawDiff) => {
        this.liveSocket.requestDOMUpdate(() => {
          this.applyDiff("update", rawDiff, ({ diff, events }) => this.update(diff, events));
        });
      });
      this.onChannel("redirect", ({ to, flash }) => this.onRedirect({ to, flash }));
      this.onChannel("live_patch", (redir) => this.onLivePatch(redir));
      this.onChannel("live_redirect", (redir) => this.onLiveRedirect(redir));
      this.channel.onError((reason) => this.onError(reason));
      this.channel.onClose((reason) => this.onClose(reason));
    }
    destroyAllChildren() {
      for (let id in this.root.children[this.id]) {
        this.getChildById(id).destroy();
      }
    }
    onLiveRedirect(redir) {
      let { to, kind, flash } = redir;
      let url = this.expandURL(to);
      this.liveSocket.historyRedirect(url, kind, flash);
    }
    onLivePatch(redir) {
      let { to, kind } = redir;
      this.href = this.expandURL(to);
      this.liveSocket.historyPatch(to, kind);
    }
    expandURL(to) {
      return to.startsWith("/") ? `${window.location.protocol}//${window.location.host}${to}` : to;
    }
    onRedirect({ to, flash }) {
      this.liveSocket.redirect(to, flash);
    }
    isDestroyed() {
      return this.destroyed;
    }
    join(callback) {
      if (this.isMain()) {
        this.stopCallback = this.liveSocket.withPageLoading({ to: this.href, kind: "initial" });
      }
      this.joinCallback = (onDone) => {
        onDone = onDone || function() {
        };
        callback ? callback(this.joinCount, onDone) : onDone();
      };
      this.liveSocket.wrapPush(this, { timeout: false }, () => {
        return this.channel.join().receive("ok", (data) => {
          if (!this.isDestroyed()) {
            this.liveSocket.requestDOMUpdate(() => this.onJoin(data));
          }
        }).receive("error", (resp) => !this.isDestroyed() && this.onJoinError(resp)).receive("timeout", () => !this.isDestroyed() && this.onJoinError({ reason: "timeout" }));
      });
    }
    onJoinError(resp) {
      if (resp.reason === "unauthorized" || resp.reason === "stale") {
        this.log("error", () => ["unauthorized live_redirect. Falling back to page request", resp]);
        return this.onRedirect({ to: this.href });
      }
      if (resp.redirect || resp.live_redirect) {
        this.joinPending = false;
        this.channel.leave();
      }
      if (resp.redirect) {
        return this.onRedirect(resp.redirect);
      }
      if (resp.live_redirect) {
        return this.onLiveRedirect(resp.live_redirect);
      }
      this.log("error", () => ["unable to join", resp]);
      return this.liveSocket.reloadWithJitter(this);
    }
    onClose(reason) {
      if (this.isDestroyed()) {
        return;
      }
      if (this.isJoinPending() && document.visibilityState !== "hidden" || this.liveSocket.hasPendingLink() && reason !== "leave") {
        return this.liveSocket.reloadWithJitter(this);
      }
      this.destroyAllChildren();
      this.liveSocket.dropActiveElement(this);
      if (document.activeElement) {
        document.activeElement.blur();
      }
      if (this.liveSocket.isUnloaded()) {
        this.showLoader(BEFORE_UNLOAD_LOADER_TIMEOUT);
      }
    }
    onError(reason) {
      this.onClose(reason);
      this.log("error", () => ["view crashed", reason]);
      if (!this.liveSocket.isUnloaded()) {
        this.displayError();
      }
    }
    displayError() {
      if (this.isMain()) {
        dom_default.dispatchEvent(window, "phx:page-loading-start", { detail: { to: this.href, kind: "error" } });
      }
      this.showLoader();
      this.setContainerClasses(PHX_DISCONNECTED_CLASS, PHX_ERROR_CLASS);
    }
    pushWithReply(refGenerator, event, payload, onReply = function() {
    }) {
      if (!this.isConnected()) {
        return;
      }
      let [ref, [el], opts] = refGenerator ? refGenerator() : [null, [], {}];
      let onLoadingDone = function() {
      };
      if (opts.page_loading || el && el.getAttribute(this.binding(PHX_PAGE_LOADING)) !== null) {
        onLoadingDone = this.liveSocket.withPageLoading({ kind: "element", target: el });
      }
      if (typeof payload.cid !== "number") {
        delete payload.cid;
      }
      return this.liveSocket.wrapPush(this, { timeout: true }, () => {
        return this.channel.push(event, payload, PUSH_TIMEOUT).receive("ok", (resp) => {
          if (ref !== null) {
            this.undoRefs(ref);
          }
          let finish = (hookReply) => {
            if (resp.redirect) {
              this.onRedirect(resp.redirect);
            }
            if (resp.live_patch) {
              this.onLivePatch(resp.live_patch);
            }
            if (resp.live_redirect) {
              this.onLiveRedirect(resp.live_redirect);
            }
            onLoadingDone();
            onReply(resp, hookReply);
          };
          if (resp.diff) {
            this.liveSocket.requestDOMUpdate(() => {
              let hookReply = this.applyDiff("update", resp.diff, ({ diff, events }) => {
                this.update(diff, events);
              });
              finish(hookReply);
            });
          } else {
            finish(null);
          }
        });
      });
    }
    undoRefs(ref) {
      dom_default.all(document, `[${PHX_REF_SRC}="${this.id}"][${PHX_REF}="${ref}"]`, (el) => {
        let disabledVal = el.getAttribute(PHX_DISABLED);
        el.removeAttribute(PHX_REF);
        el.removeAttribute(PHX_REF_SRC);
        if (el.getAttribute(PHX_READONLY) !== null) {
          el.readOnly = false;
          el.removeAttribute(PHX_READONLY);
        }
        if (disabledVal !== null) {
          el.disabled = disabledVal === "true" ? true : false;
          el.removeAttribute(PHX_DISABLED);
        }
        PHX_EVENT_CLASSES.forEach((className) => dom_default.removeClass(el, className));
        let disableRestore = el.getAttribute(PHX_DISABLE_WITH_RESTORE);
        if (disableRestore !== null) {
          el.innerText = disableRestore;
          el.removeAttribute(PHX_DISABLE_WITH_RESTORE);
        }
        let toEl = dom_default.private(el, PHX_REF);
        if (toEl) {
          let hook = this.triggerBeforeUpdateHook(el, toEl);
          DOMPatch.patchEl(el, toEl, this.liveSocket.getActiveElement());
          if (hook) {
            hook.__updated();
          }
          dom_default.deletePrivate(el, PHX_REF);
        }
      });
    }
    putRef(elements, event, opts = {}) {
      let newRef = this.ref++;
      let disableWith = this.binding(PHX_DISABLE_WITH);
      if (opts.loading) {
        elements = elements.concat(dom_default.all(document, opts.loading));
      }
      elements.forEach((el) => {
        el.classList.add(`phx-${event}-loading`);
        el.setAttribute(PHX_REF, newRef);
        el.setAttribute(PHX_REF_SRC, this.el.id);
        let disableText = el.getAttribute(disableWith);
        if (disableText !== null) {
          if (!el.getAttribute(PHX_DISABLE_WITH_RESTORE)) {
            el.setAttribute(PHX_DISABLE_WITH_RESTORE, el.innerText);
          }
          if (disableText !== "") {
            el.innerText = disableText;
          }
          el.setAttribute("disabled", "");
        }
      });
      return [newRef, elements, opts];
    }
    componentID(el) {
      let cid = el.getAttribute && el.getAttribute(PHX_COMPONENT);
      return cid ? parseInt(cid) : null;
    }
    targetComponentID(target, targetCtx, opts = {}) {
      if (isCid(targetCtx)) {
        return targetCtx;
      }
      let cidOrSelector = target.getAttribute(this.binding("target"));
      if (isCid(cidOrSelector)) {
        return parseInt(cidOrSelector);
      } else if (targetCtx && (cidOrSelector !== null || opts.target)) {
        return this.closestComponentID(targetCtx);
      } else {
        return null;
      }
    }
    closestComponentID(targetCtx) {
      if (isCid(targetCtx)) {
        return targetCtx;
      } else if (targetCtx) {
        return maybe(targetCtx.closest(`[${PHX_COMPONENT}]`), (el) => this.ownsElement(el) && this.componentID(el));
      } else {
        return null;
      }
    }
    pushHookEvent(targetCtx, event, payload, onReply) {
      if (!this.isConnected()) {
        this.log("hook", () => ["unable to push hook event. LiveView not connected", event, payload]);
        return false;
      }
      let [ref, els, opts] = this.putRef([], "hook");
      this.pushWithReply(() => [ref, els, opts], "event", {
        type: "hook",
        event,
        value: payload,
        cid: this.closestComponentID(targetCtx)
      }, (resp, reply) => onReply(reply, ref));
      return ref;
    }
    extractMeta(el, meta, value) {
      let prefix = this.binding("value-");
      for (let i = 0; i < el.attributes.length; i++) {
        if (!meta) {
          meta = {};
        }
        let name = el.attributes[i].name;
        if (name.startsWith(prefix)) {
          meta[name.replace(prefix, "")] = el.getAttribute(name);
        }
      }
      if (el.value !== void 0) {
        if (!meta) {
          meta = {};
        }
        meta.value = el.value;
        if (el.tagName === "INPUT" && CHECKABLE_INPUTS.indexOf(el.type) >= 0 && !el.checked) {
          delete meta.value;
        }
      }
      if (value) {
        if (!meta) {
          meta = {};
        }
        for (let key in value) {
          meta[key] = value[key];
        }
      }
      return meta;
    }
    pushEvent(type, el, targetCtx, phxEvent, meta, opts = {}) {
      this.pushWithReply(() => this.putRef([el], type, opts), "event", {
        type,
        event: phxEvent,
        value: this.extractMeta(el, meta, opts.value),
        cid: this.targetComponentID(el, targetCtx, opts)
      });
    }
    pushFileProgress(fileEl, entryRef, progress, onReply = function() {
    }) {
      this.liveSocket.withinOwners(fileEl.form, (view, targetCtx) => {
        view.pushWithReply(null, "progress", {
          event: fileEl.getAttribute(view.binding(PHX_PROGRESS)),
          ref: fileEl.getAttribute(PHX_UPLOAD_REF),
          entry_ref: entryRef,
          progress,
          cid: view.targetComponentID(fileEl.form, targetCtx)
        }, onReply);
      });
    }
    pushInput(inputEl, targetCtx, forceCid, phxEvent, opts, callback) {
      let uploads;
      let cid = isCid(forceCid) ? forceCid : this.targetComponentID(inputEl.form, targetCtx);
      let refGenerator = () => this.putRef([inputEl, inputEl.form], "change", opts);
      let formData;
      if (inputEl.getAttribute(this.binding("change"))) {
        formData = serializeForm(inputEl.form, { _target: opts._target }, [inputEl.name]);
      } else {
        formData = serializeForm(inputEl.form, { _target: opts._target });
      }
      if (dom_default.isUploadInput(inputEl) && inputEl.files && inputEl.files.length > 0) {
        LiveUploader.trackFiles(inputEl, Array.from(inputEl.files));
      }
      uploads = LiveUploader.serializeUploads(inputEl);
      let event = {
        type: "form",
        event: phxEvent,
        value: formData,
        uploads,
        cid
      };
      this.pushWithReply(refGenerator, "event", event, (resp) => {
        dom_default.showError(inputEl, this.liveSocket.binding(PHX_FEEDBACK_FOR));
        if (dom_default.isUploadInput(inputEl) && inputEl.getAttribute("data-phx-auto-upload") !== null) {
          if (LiveUploader.filesAwaitingPreflight(inputEl).length > 0) {
            let [ref, _els] = refGenerator();
            this.uploadFiles(inputEl.form, targetCtx, ref, cid, (_uploads) => {
              callback && callback(resp);
              this.triggerAwaitingSubmit(inputEl.form);
            });
          }
        } else {
          callback && callback(resp);
        }
      });
    }
    triggerAwaitingSubmit(formEl) {
      let awaitingSubmit = this.getScheduledSubmit(formEl);
      if (awaitingSubmit) {
        let [_el, _ref, _opts, callback] = awaitingSubmit;
        this.cancelSubmit(formEl);
        callback();
      }
    }
    getScheduledSubmit(formEl) {
      return this.formSubmits.find(([el, _ref, _opts, _callback]) => el.isSameNode(formEl));
    }
    scheduleSubmit(formEl, ref, opts, callback) {
      if (this.getScheduledSubmit(formEl)) {
        return true;
      }
      this.formSubmits.push([formEl, ref, opts, callback]);
    }
    cancelSubmit(formEl) {
      this.formSubmits = this.formSubmits.filter(([el, ref, _callback]) => {
        if (el.isSameNode(formEl)) {
          this.undoRefs(ref);
          return false;
        } else {
          return true;
        }
      });
    }
    pushFormSubmit(formEl, targetCtx, phxEvent, opts, onReply) {
      let filterIgnored = (el) => {
        let userIgnored = closestPhxBinding(el, `${this.binding(PHX_UPDATE)}=ignore`, el.form);
        return !(userIgnored || closestPhxBinding(el, "data-phx-update=ignore", el.form));
      };
      let filterDisables = (el) => {
        return el.hasAttribute(this.binding(PHX_DISABLE_WITH));
      };
      let filterButton = (el) => el.tagName == "BUTTON";
      let filterInput = (el) => ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
      let refGenerator = () => {
        let formElements = Array.from(formEl.elements);
        let disables = formElements.filter(filterDisables);
        let buttons = formElements.filter(filterButton).filter(filterIgnored);
        let inputs = formElements.filter(filterInput).filter(filterIgnored);
        buttons.forEach((button) => {
          button.setAttribute(PHX_DISABLED, button.disabled);
          button.disabled = true;
        });
        inputs.forEach((input) => {
          input.setAttribute(PHX_READONLY, input.readOnly);
          input.readOnly = true;
          if (input.files) {
            input.setAttribute(PHX_DISABLED, input.disabled);
            input.disabled = true;
          }
        });
        formEl.setAttribute(this.binding(PHX_PAGE_LOADING), "");
        return this.putRef([formEl].concat(disables).concat(buttons).concat(inputs), "submit", opts);
      };
      let cid = this.targetComponentID(formEl, targetCtx);
      if (LiveUploader.hasUploadsInProgress(formEl)) {
        let [ref, _els] = refGenerator();
        let push = () => this.pushFormSubmit(formEl, targetCtx, phxEvent, opts, onReply);
        return this.scheduleSubmit(formEl, ref, opts, push);
      } else if (LiveUploader.inputsAwaitingPreflight(formEl).length > 0) {
        let [ref, els] = refGenerator();
        let proxyRefGen = () => [ref, els, opts];
        this.uploadFiles(formEl, targetCtx, ref, cid, (_uploads) => {
          let formData = serializeForm(formEl, {});
          this.pushWithReply(proxyRefGen, "event", {
            type: "form",
            event: phxEvent,
            value: formData,
            cid
          }, onReply);
        });
      } else {
        let formData = serializeForm(formEl, {});
        this.pushWithReply(refGenerator, "event", {
          type: "form",
          event: phxEvent,
          value: formData,
          cid
        }, onReply);
      }
    }
    uploadFiles(formEl, targetCtx, ref, cid, onComplete) {
      let joinCountAtUpload = this.joinCount;
      let inputEls = LiveUploader.activeFileInputs(formEl);
      let numFileInputsInProgress = inputEls.length;
      inputEls.forEach((inputEl) => {
        let uploader = new LiveUploader(inputEl, this, () => {
          numFileInputsInProgress--;
          if (numFileInputsInProgress === 0) {
            onComplete();
          }
        });
        this.uploaders[inputEl] = uploader;
        let entries = uploader.entries().map((entry) => entry.toPreflightPayload());
        let payload = {
          ref: inputEl.getAttribute(PHX_UPLOAD_REF),
          entries,
          cid: this.targetComponentID(inputEl.form, targetCtx)
        };
        this.log("upload", () => ["sending preflight request", payload]);
        this.pushWithReply(null, "allow_upload", payload, (resp) => {
          this.log("upload", () => ["got preflight response", resp]);
          if (resp.error) {
            this.undoRefs(ref);
            let [entry_ref, reason] = resp.error;
            this.log("upload", () => [`error for entry ${entry_ref}`, reason]);
          } else {
            let onError = (callback) => {
              this.channel.onError(() => {
                if (this.joinCount === joinCountAtUpload) {
                  callback();
                }
              });
            };
            uploader.initAdapterUpload(resp, onError, this.liveSocket);
          }
        });
      });
    }
    dispatchUploads(name, filesOrBlobs) {
      let inputs = dom_default.findUploadInputs(this.el).filter((el) => el.name === name);
      if (inputs.length === 0) {
        logError(`no live file inputs found matching the name "${name}"`);
      } else if (inputs.length > 1) {
        logError(`duplicate live file inputs found matching the name "${name}"`);
      } else {
        dom_default.dispatchEvent(inputs[0], PHX_TRACK_UPLOADS, { detail: { files: filesOrBlobs } });
      }
    }
    pushFormRecovery(form, newCid, callback) {
      this.liveSocket.withinOwners(form, (view, targetCtx) => {
        let input = form.elements[0];
        let phxEvent = form.getAttribute(this.binding(PHX_AUTO_RECOVER)) || form.getAttribute(this.binding("change"));
        js_default.exec("change", phxEvent, view, input, ["push", { _target: input.name, newCid, callback }]);
      });
    }
    pushLinkPatch(href, targetEl, callback) {
      let linkRef = this.liveSocket.setPendingLink(href);
      let refGen = targetEl ? () => this.putRef([targetEl], "click") : null;
      let fallback = () => this.liveSocket.redirect(window.location.href);
      let push = this.pushWithReply(refGen, "live_patch", { url: href }, (resp) => {
        this.liveSocket.requestDOMUpdate(() => {
          if (resp.link_redirect) {
            this.liveSocket.replaceMain(href, null, callback, linkRef);
          } else {
            if (this.liveSocket.commitPendingLink(linkRef)) {
              this.href = href;
            }
            this.applyPendingUpdates();
            callback && callback(linkRef);
          }
        });
      });
      if (push) {
        push.receive("timeout", fallback);
      } else {
        fallback();
      }
    }
    formsForRecovery(html) {
      if (this.joinCount === 0) {
        return [];
      }
      let phxChange = this.binding("change");
      let template = document.createElement("template");
      template.innerHTML = html;
      return dom_default.all(this.el, `form[${phxChange}]`).filter((form) => form.id && this.ownsElement(form)).filter((form) => form.elements.length > 0).filter((form) => form.getAttribute(this.binding(PHX_AUTO_RECOVER)) !== "ignore").map((form) => {
        let newForm = template.content.querySelector(`form[id="${form.id}"][${phxChange}="${form.getAttribute(phxChange)}"]`);
        if (newForm) {
          return [form, newForm, this.targetComponentID(newForm)];
        } else {
          return [form, null, null];
        }
      }).filter(([form, newForm, newCid]) => newForm);
    }
    maybePushComponentsDestroyed(destroyedCIDs) {
      let willDestroyCIDs = destroyedCIDs.filter((cid) => {
        return dom_default.findComponentNodeList(this.el, cid).length === 0;
      });
      if (willDestroyCIDs.length > 0) {
        this.pruningCIDs.push(...willDestroyCIDs);
        this.pushWithReply(null, "cids_will_destroy", { cids: willDestroyCIDs }, () => {
          this.pruningCIDs = this.pruningCIDs.filter((cid) => willDestroyCIDs.indexOf(cid) !== -1);
          let completelyDestroyCIDs = willDestroyCIDs.filter((cid) => {
            return dom_default.findComponentNodeList(this.el, cid).length === 0;
          });
          if (completelyDestroyCIDs.length > 0) {
            this.pushWithReply(null, "cids_destroyed", { cids: completelyDestroyCIDs }, (resp) => {
              this.rendered.pruneCIDs(resp.cids);
            });
          }
        });
      }
    }
    ownsElement(el) {
      return el.getAttribute(PHX_PARENT_ID) === this.id || maybe(el.closest(PHX_VIEW_SELECTOR), (node) => node.id) === this.id;
    }
    submitForm(form, targetCtx, phxEvent, opts = {}) {
      dom_default.putPrivate(form, PHX_HAS_SUBMITTED, true);
      let phxFeedback = this.liveSocket.binding(PHX_FEEDBACK_FOR);
      let inputs = Array.from(form.elements);
      this.liveSocket.blurActiveElement(this);
      this.pushFormSubmit(form, targetCtx, phxEvent, opts, () => {
        inputs.forEach((input) => dom_default.showError(input, phxFeedback));
        this.liveSocket.restorePreviouslyActiveFocus();
      });
    }
    binding(kind) {
      return this.liveSocket.binding(kind);
    }
  };
  var LiveSocket = class {
    constructor(url, phxSocket, opts = {}) {
      this.unloaded = false;
      if (!phxSocket || phxSocket.constructor.name === "Object") {
        throw new Error(`
      a phoenix Socket must be provided as the second argument to the LiveSocket constructor. For example:

          import {Socket} from "phoenix"
          import {LiveSocket} from "phoenix_live_view"
          let liveSocket = new LiveSocket("/live", Socket, {...})
      `);
      }
      this.socket = new phxSocket(url, opts);
      this.bindingPrefix = opts.bindingPrefix || BINDING_PREFIX;
      this.opts = opts;
      this.params = closure2(opts.params || {});
      this.viewLogger = opts.viewLogger;
      this.metadataCallbacks = opts.metadata || {};
      this.defaults = Object.assign(clone(DEFAULTS), opts.defaults || {});
      this.activeElement = null;
      this.prevActive = null;
      this.silenced = false;
      this.main = null;
      this.outgoingMainEl = null;
      this.clickStartedAtTarget = null;
      this.linkRef = 1;
      this.roots = {};
      this.href = window.location.href;
      this.pendingLink = null;
      this.currentLocation = clone(window.location);
      this.hooks = opts.hooks || {};
      this.uploaders = opts.uploaders || {};
      this.loaderTimeout = opts.loaderTimeout || LOADER_TIMEOUT;
      this.maxReloads = opts.maxReloads || MAX_RELOADS;
      this.reloadJitterMin = opts.reloadJitterMin || RELOAD_JITTER_MIN;
      this.reloadJitterMax = opts.reloadJitterMax || RELOAD_JITTER_MAX;
      this.failsafeJitter = opts.failsafeJitter || FAILSAFE_JITTER;
      this.localStorage = opts.localStorage || window.localStorage;
      this.sessionStorage = opts.sessionStorage || window.sessionStorage;
      this.boundTopLevelEvents = false;
      this.domCallbacks = Object.assign({ onNodeAdded: closure2(), onBeforeElUpdated: closure2() }, opts.dom || {});
      this.transitions = new TransitionSet();
      window.addEventListener("pagehide", (_e) => {
        this.unloaded = true;
      });
      this.socket.onOpen(() => {
        if (this.isUnloaded()) {
          window.location.reload();
        }
      });
    }
    isProfileEnabled() {
      return this.sessionStorage.getItem(PHX_LV_PROFILE) === "true";
    }
    isDebugEnabled() {
      return this.sessionStorage.getItem(PHX_LV_DEBUG) === "true";
    }
    isDebugDisabled() {
      return this.sessionStorage.getItem(PHX_LV_DEBUG) === "false";
    }
    enableDebug() {
      this.sessionStorage.setItem(PHX_LV_DEBUG, "true");
    }
    enableProfiling() {
      this.sessionStorage.setItem(PHX_LV_PROFILE, "true");
    }
    disableDebug() {
      this.sessionStorage.setItem(PHX_LV_DEBUG, "false");
    }
    disableProfiling() {
      this.sessionStorage.removeItem(PHX_LV_PROFILE);
    }
    enableLatencySim(upperBoundMs) {
      this.enableDebug();
      console.log("latency simulator enabled for the duration of this browser session. Call disableLatencySim() to disable");
      this.sessionStorage.setItem(PHX_LV_LATENCY_SIM, upperBoundMs);
    }
    disableLatencySim() {
      this.sessionStorage.removeItem(PHX_LV_LATENCY_SIM);
    }
    getLatencySim() {
      let str = this.sessionStorage.getItem(PHX_LV_LATENCY_SIM);
      return str ? parseInt(str) : null;
    }
    getSocket() {
      return this.socket;
    }
    connect() {
      if (window.location.hostname === "localhost" && !this.isDebugDisabled()) {
        this.enableDebug();
      }
      let doConnect = () => {
        if (this.joinRootViews()) {
          this.bindTopLevelEvents();
          this.socket.connect();
        }
      };
      if (["complete", "loaded", "interactive"].indexOf(document.readyState) >= 0) {
        doConnect();
      } else {
        document.addEventListener("DOMContentLoaded", () => doConnect());
      }
    }
    disconnect(callback) {
      this.socket.disconnect(callback);
    }
    execJS(el, encodedJS, eventType = null) {
      this.owner(el, (view) => js_default.exec(eventType, encodedJS, view, el));
    }
    triggerDOM(kind, args) {
      this.domCallbacks[kind](...args);
    }
    time(name, func) {
      if (!this.isProfileEnabled() || !console.time) {
        return func();
      }
      console.time(name);
      let result = func();
      console.timeEnd(name);
      return result;
    }
    log(view, kind, msgCallback) {
      if (this.viewLogger) {
        let [msg, obj] = msgCallback();
        this.viewLogger(view, kind, msg, obj);
      } else if (this.isDebugEnabled()) {
        let [msg, obj] = msgCallback();
        debug(view, kind, msg, obj);
      }
    }
    requestDOMUpdate(callback) {
      this.transitions.after(callback);
    }
    transition(time, onStart, onDone = function() {
    }) {
      this.transitions.addTransition(time, onStart, onDone);
    }
    onChannel(channel, event, cb) {
      channel.on(event, (data) => {
        let latency = this.getLatencySim();
        if (!latency) {
          cb(data);
        } else {
          console.log(`simulating ${latency}ms of latency from server to client`);
          setTimeout(() => cb(data), latency);
        }
      });
    }
    wrapPush(view, opts, push) {
      let latency = this.getLatencySim();
      let oldJoinCount = view.joinCount;
      if (!latency) {
        if (this.isConnected() && opts.timeout) {
          return push().receive("timeout", () => {
            if (view.joinCount === oldJoinCount && !view.isDestroyed()) {
              this.reloadWithJitter(view, () => {
                this.log(view, "timeout", () => ["received timeout while communicating with server. Falling back to hard refresh for recovery"]);
              });
            }
          });
        } else {
          return push();
        }
      }
      console.log(`simulating ${latency}ms of latency from client to server`);
      let fakePush = {
        receives: [],
        receive(kind, cb) {
          this.receives.push([kind, cb]);
        }
      };
      setTimeout(() => {
        if (view.isDestroyed()) {
          return;
        }
        fakePush.receives.reduce((acc, [kind, cb]) => acc.receive(kind, cb), push());
      }, latency);
      return fakePush;
    }
    reloadWithJitter(view, log) {
      view.destroy();
      this.disconnect();
      let minMs = this.reloadJitterMin;
      let maxMs = this.reloadJitterMax;
      let afterMs = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
      let tries = browser_default.updateLocal(this.localStorage, window.location.pathname, CONSECUTIVE_RELOADS, 0, (count) => count + 1);
      log ? log() : this.log(view, "join", () => [`encountered ${tries} consecutive reloads`]);
      if (tries > this.maxReloads) {
        this.log(view, "join", () => [`exceeded ${this.maxReloads} consecutive reloads. Entering failsafe mode`]);
        afterMs = this.failsafeJitter;
      }
      setTimeout(() => {
        if (this.hasPendingLink()) {
          window.location = this.pendingLink;
        } else {
          window.location.reload();
        }
      }, afterMs);
    }
    getHookCallbacks(name) {
      return name && name.startsWith("Phoenix.") ? hooks_default[name.split(".")[1]] : this.hooks[name];
    }
    isUnloaded() {
      return this.unloaded;
    }
    isConnected() {
      return this.socket.isConnected();
    }
    getBindingPrefix() {
      return this.bindingPrefix;
    }
    binding(kind) {
      return `${this.getBindingPrefix()}${kind}`;
    }
    channel(topic, params) {
      return this.socket.channel(topic, params);
    }
    joinRootViews() {
      let rootsFound = false;
      dom_default.all(document, `${PHX_VIEW_SELECTOR}:not([${PHX_PARENT_ID}])`, (rootEl) => {
        if (!this.getRootById(rootEl.id)) {
          let view = this.newRootView(rootEl);
          view.setHref(this.getHref());
          view.join();
          if (rootEl.getAttribute(PHX_MAIN)) {
            this.main = view;
          }
        }
        rootsFound = true;
      });
      return rootsFound;
    }
    redirect(to, flash) {
      this.disconnect();
      browser_default.redirect(to, flash);
    }
    replaceMain(href, flash, callback = null, linkRef = this.setPendingLink(href)) {
      this.outgoingMainEl = this.outgoingMainEl || this.main.el;
      let newMainEl = dom_default.cloneNode(this.outgoingMainEl, "");
      this.main.showLoader(this.loaderTimeout);
      this.main.destroy();
      this.main = this.newRootView(newMainEl, flash);
      this.main.setRedirect(href);
      this.transitionRemoves();
      this.main.join((joinCount, onDone) => {
        if (joinCount === 1 && this.commitPendingLink(linkRef)) {
          this.requestDOMUpdate(() => {
            dom_default.findPhxSticky(document).forEach((el) => newMainEl.appendChild(el));
            this.outgoingMainEl.replaceWith(newMainEl);
            this.outgoingMainEl = null;
            callback && callback();
            onDone();
          });
        }
      });
    }
    transitionRemoves(elements) {
      let removeAttr = this.binding("remove");
      elements = elements || dom_default.all(document, `[${removeAttr}]`);
      elements.forEach((el) => {
        if (document.body.contains(el)) {
          this.execJS(el, el.getAttribute(removeAttr), "remove");
        }
      });
    }
    isPhxView(el) {
      return el.getAttribute && el.getAttribute(PHX_SESSION) !== null;
    }
    newRootView(el, flash) {
      let view = new View(el, this, null, flash);
      this.roots[view.id] = view;
      return view;
    }
    owner(childEl, callback) {
      let view = maybe(childEl.closest(PHX_VIEW_SELECTOR), (el) => this.getViewByEl(el)) || this.main;
      if (view) {
        callback(view);
      }
    }
    withinOwners(childEl, callback) {
      this.owner(childEl, (view) => callback(view, childEl));
    }
    getViewByEl(el) {
      let rootId = el.getAttribute(PHX_ROOT_ID);
      return maybe(this.getRootById(rootId), (root) => root.getDescendentByEl(el));
    }
    getRootById(id) {
      return this.roots[id];
    }
    destroyAllViews() {
      for (let id in this.roots) {
        this.roots[id].destroy();
        delete this.roots[id];
      }
    }
    destroyViewByEl(el) {
      let root = this.getRootById(el.getAttribute(PHX_ROOT_ID));
      if (root && root.id === el.id) {
        root.destroy();
        delete this.roots[root.id];
      } else if (root) {
        root.destroyDescendent(el.id);
      }
    }
    setActiveElement(target) {
      if (this.activeElement === target) {
        return;
      }
      this.activeElement = target;
      let cancel = () => {
        if (target === this.activeElement) {
          this.activeElement = null;
        }
        target.removeEventListener("mouseup", this);
        target.removeEventListener("touchend", this);
      };
      target.addEventListener("mouseup", cancel);
      target.addEventListener("touchend", cancel);
    }
    getActiveElement() {
      if (document.activeElement === document.body) {
        return this.activeElement || document.activeElement;
      } else {
        return document.activeElement || document.body;
      }
    }
    dropActiveElement(view) {
      if (this.prevActive && view.ownsElement(this.prevActive)) {
        this.prevActive = null;
      }
    }
    restorePreviouslyActiveFocus() {
      if (this.prevActive && this.prevActive !== document.body) {
        this.prevActive.focus();
      }
    }
    blurActiveElement() {
      this.prevActive = this.getActiveElement();
      if (this.prevActive !== document.body) {
        this.prevActive.blur();
      }
    }
    bindTopLevelEvents() {
      if (this.boundTopLevelEvents) {
        return;
      }
      this.boundTopLevelEvents = true;
      this.socket.onClose((event) => {
        if (event && event.code === 1e3 && this.main) {
          this.reloadWithJitter(this.main);
        }
      });
      document.body.addEventListener("click", function() {
      });
      window.addEventListener("pageshow", (e) => {
        if (e.persisted) {
          this.getSocket().disconnect();
          this.withPageLoading({ to: window.location.href, kind: "redirect" });
          window.location.reload();
        }
      }, true);
      this.bindNav();
      this.bindClicks();
      this.bindForms();
      this.bind({ keyup: "keyup", keydown: "keydown" }, (e, type, view, targetEl, phxEvent, eventTarget) => {
        let matchKey = targetEl.getAttribute(this.binding(PHX_KEY));
        let pressedKey = e.key && e.key.toLowerCase();
        if (matchKey && matchKey.toLowerCase() !== pressedKey) {
          return;
        }
        let data = __spreadValues({ key: e.key }, this.eventMeta(type, e, targetEl));
        js_default.exec(type, phxEvent, view, targetEl, ["push", { data }]);
      });
      this.bind({ blur: "focusout", focus: "focusin" }, (e, type, view, targetEl, phxEvent, eventTarget) => {
        if (!eventTarget) {
          let data = __spreadValues({ key: e.key }, this.eventMeta(type, e, targetEl));
          js_default.exec(type, phxEvent, view, targetEl, ["push", { data }]);
        }
      });
      this.bind({ blur: "blur", focus: "focus" }, (e, type, view, targetEl, targetCtx, phxEvent, phxTarget) => {
        if (phxTarget === "window") {
          let data = this.eventMeta(type, e, targetEl);
          js_default.exec(type, phxEvent, view, targetEl, ["push", { data }]);
        }
      });
      window.addEventListener("dragover", (e) => e.preventDefault());
      window.addEventListener("drop", (e) => {
        e.preventDefault();
        let dropTargetId = maybe(closestPhxBinding(e.target, this.binding(PHX_DROP_TARGET)), (trueTarget) => {
          return trueTarget.getAttribute(this.binding(PHX_DROP_TARGET));
        });
        let dropTarget = dropTargetId && document.getElementById(dropTargetId);
        let files = Array.from(e.dataTransfer.files || []);
        if (!dropTarget || dropTarget.disabled || files.length === 0 || !(dropTarget.files instanceof FileList)) {
          return;
        }
        LiveUploader.trackFiles(dropTarget, files);
        dropTarget.dispatchEvent(new Event("input", { bubbles: true }));
      });
      this.on(PHX_TRACK_UPLOADS, (e) => {
        let uploadTarget = e.target;
        if (!dom_default.isUploadInput(uploadTarget)) {
          return;
        }
        let files = Array.from(e.detail.files || []).filter((f) => f instanceof File || f instanceof Blob);
        LiveUploader.trackFiles(uploadTarget, files);
        uploadTarget.dispatchEvent(new Event("input", { bubbles: true }));
      });
    }
    eventMeta(eventName, e, targetEl) {
      let callback = this.metadataCallbacks[eventName];
      return callback ? callback(e, targetEl) : {};
    }
    setPendingLink(href) {
      this.linkRef++;
      this.pendingLink = href;
      return this.linkRef;
    }
    commitPendingLink(linkRef) {
      if (this.linkRef !== linkRef) {
        return false;
      } else {
        this.href = this.pendingLink;
        this.pendingLink = null;
        return true;
      }
    }
    getHref() {
      return this.href;
    }
    hasPendingLink() {
      return !!this.pendingLink;
    }
    bind(events, callback) {
      for (let event in events) {
        let browserEventName = events[event];
        this.on(browserEventName, (e) => {
          let binding = this.binding(event);
          let windowBinding = this.binding(`window-${event}`);
          let targetPhxEvent = e.target.getAttribute && e.target.getAttribute(binding);
          if (targetPhxEvent) {
            this.debounce(e.target, e, () => {
              this.withinOwners(e.target, (view) => {
                callback(e, event, view, e.target, targetPhxEvent, null);
              });
            });
          } else {
            dom_default.all(document, `[${windowBinding}]`, (el) => {
              let phxEvent = el.getAttribute(windowBinding);
              this.debounce(el, e, () => {
                this.withinOwners(el, (view) => {
                  callback(e, event, view, el, phxEvent, "window");
                });
              });
            });
          }
        });
      }
    }
    bindClicks() {
      window.addEventListener("mousedown", (e) => this.clickStartedAtTarget = e.target);
      this.bindClick("click", "click", false);
      this.bindClick("mousedown", "capture-click", true);
    }
    bindClick(eventName, bindingName, capture) {
      let click = this.binding(bindingName);
      window.addEventListener(eventName, (e) => {
        let target = null;
        if (capture) {
          target = e.target.matches(`[${click}]`) ? e.target : e.target.querySelector(`[${click}]`);
        } else {
          let clickStartedAtTarget = this.clickStartedAtTarget || e.target;
          target = closestPhxBinding(clickStartedAtTarget, click);
          this.dispatchClickAway(e, clickStartedAtTarget);
          this.clickStartedAtTarget = null;
        }
        let phxEvent = target && target.getAttribute(click);
        if (!phxEvent) {
          return;
        }
        if (target.getAttribute("href") === "#") {
          e.preventDefault();
        }
        this.debounce(target, e, () => {
          this.withinOwners(target, (view) => {
            js_default.exec("click", phxEvent, view, target, ["push", { data: this.eventMeta("click", e, target) }]);
          });
        });
      }, capture);
    }
    dispatchClickAway(e, clickStartedAt) {
      let phxClickAway = this.binding("click-away");
      dom_default.all(document, `[${phxClickAway}]`, (el) => {
        if (!(el.isSameNode(clickStartedAt) || el.contains(clickStartedAt))) {
          this.withinOwners(e.target, (view) => {
            let phxEvent = el.getAttribute(phxClickAway);
            if (js_default.isVisible(el)) {
              js_default.exec("click", phxEvent, view, el, ["push", { data: this.eventMeta("click", e, e.target) }]);
            }
          });
        }
      });
    }
    bindNav() {
      if (!browser_default.canPushState()) {
        return;
      }
      if (history.scrollRestoration) {
        history.scrollRestoration = "manual";
      }
      let scrollTimer = null;
      window.addEventListener("scroll", (_e) => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          browser_default.updateCurrentState((state) => Object.assign(state, { scroll: window.scrollY }));
        }, 100);
      });
      window.addEventListener("popstate", (event) => {
        if (!this.registerNewLocation(window.location)) {
          return;
        }
        let { type, id, root, scroll } = event.state || {};
        let href = window.location.href;
        this.requestDOMUpdate(() => {
          if (this.main.isConnected() && (type === "patch" && id === this.main.id)) {
            this.main.pushLinkPatch(href, null);
          } else {
            this.replaceMain(href, null, () => {
              if (root) {
                this.replaceRootHistory();
              }
              if (typeof scroll === "number") {
                setTimeout(() => {
                  window.scrollTo(0, scroll);
                }, 0);
              }
            });
          }
        });
      }, false);
      window.addEventListener("click", (e) => {
        let target = closestPhxBinding(e.target, PHX_LIVE_LINK);
        let type = target && target.getAttribute(PHX_LIVE_LINK);
        let wantsNewTab = e.metaKey || e.ctrlKey || e.button === 1;
        if (!type || !this.isConnected() || !this.main || wantsNewTab) {
          return;
        }
        let href = target.href;
        let linkState = target.getAttribute(PHX_LINK_STATE);
        e.preventDefault();
        e.stopImmediatePropagation();
        if (this.pendingLink === href) {
          return;
        }
        this.requestDOMUpdate(() => {
          if (type === "patch") {
            this.pushHistoryPatch(href, linkState, target);
          } else if (type === "redirect") {
            this.historyRedirect(href, linkState);
          } else {
            throw new Error(`expected ${PHX_LIVE_LINK} to be "patch" or "redirect", got: ${type}`);
          }
        });
      }, false);
    }
    dispatchEvent(event, payload = {}) {
      dom_default.dispatchEvent(window, `phx:${event}`, { detail: payload });
    }
    dispatchEvents(events) {
      events.forEach(([event, payload]) => this.dispatchEvent(event, payload));
    }
    withPageLoading(info, callback) {
      dom_default.dispatchEvent(window, "phx:page-loading-start", { detail: info });
      let done = () => dom_default.dispatchEvent(window, "phx:page-loading-stop", { detail: info });
      return callback ? callback(done) : done;
    }
    pushHistoryPatch(href, linkState, targetEl) {
      this.withPageLoading({ to: href, kind: "patch" }, (done) => {
        this.main.pushLinkPatch(href, targetEl, (linkRef) => {
          this.historyPatch(href, linkState, linkRef);
          done();
        });
      });
    }
    historyPatch(href, linkState, linkRef = this.setPendingLink(href)) {
      if (!this.commitPendingLink(linkRef)) {
        return;
      }
      browser_default.pushState(linkState, { type: "patch", id: this.main.id }, href);
      this.registerNewLocation(window.location);
    }
    historyRedirect(href, linkState, flash) {
      let scroll = window.scrollY;
      this.withPageLoading({ to: href, kind: "redirect" }, (done) => {
        this.replaceMain(href, flash, () => {
          browser_default.pushState(linkState, { type: "redirect", id: this.main.id, scroll }, href);
          this.registerNewLocation(window.location);
          done();
        });
      });
    }
    replaceRootHistory() {
      browser_default.pushState("replace", { root: true, type: "patch", id: this.main.id });
    }
    registerNewLocation(newLocation) {
      let { pathname, search } = this.currentLocation;
      if (pathname + search === newLocation.pathname + newLocation.search) {
        return false;
      } else {
        this.currentLocation = clone(newLocation);
        return true;
      }
    }
    bindForms() {
      let iterations = 0;
      this.on("submit", (e) => {
        let phxEvent = e.target.getAttribute(this.binding("submit"));
        if (!phxEvent) {
          return;
        }
        e.preventDefault();
        e.target.disabled = true;
        this.withinOwners(e.target, (view) => {
          js_default.exec("submit", phxEvent, view, e.target, ["push", {}]);
        });
      }, false);
      for (let type of ["change", "input"]) {
        this.on(type, (e) => {
          let phxChange = this.binding("change");
          let input = e.target;
          let inputEvent = input.getAttribute(phxChange);
          let formEvent = input.form && input.form.getAttribute(phxChange);
          let phxEvent = inputEvent || formEvent;
          if (!phxEvent) {
            return;
          }
          if (input.type === "number" && input.validity && input.validity.badInput) {
            return;
          }
          let dispatcher = inputEvent ? input : input.form;
          let currentIterations = iterations;
          iterations++;
          let { at, type: lastType } = dom_default.private(input, "prev-iteration") || {};
          if (at === currentIterations - 1 && type !== lastType) {
            return;
          }
          dom_default.putPrivate(input, "prev-iteration", { at: currentIterations, type });
          this.debounce(input, e, () => {
            this.withinOwners(dispatcher, (view) => {
              dom_default.putPrivate(input, PHX_HAS_FOCUSED, true);
              if (!dom_default.isTextualInput(input)) {
                this.setActiveElement(input);
              }
              js_default.exec("change", phxEvent, view, input, ["push", { _target: e.target.name, dispatcher }]);
            });
          });
        }, false);
      }
    }
    debounce(el, event, callback) {
      let phxDebounce = this.binding(PHX_DEBOUNCE);
      let phxThrottle = this.binding(PHX_THROTTLE);
      let defaultDebounce = this.defaults.debounce.toString();
      let defaultThrottle = this.defaults.throttle.toString();
      dom_default.debounce(el, event, phxDebounce, defaultDebounce, phxThrottle, defaultThrottle, callback);
    }
    silenceEvents(callback) {
      this.silenced = true;
      callback();
      this.silenced = false;
    }
    on(event, callback) {
      window.addEventListener(event, (e) => {
        if (!this.silenced) {
          callback(e);
        }
      });
    }
  };
  var TransitionSet = class {
    constructor() {
      this.transitions = /* @__PURE__ */ new Set();
      this.pendingOps = [];
      this.reset();
    }
    reset() {
      this.transitions.forEach((timer) => {
        cancelTimeout(timer);
        this.transitions.delete(timer);
      });
      this.flushPendingOps();
    }
    after(callback) {
      if (this.size() === 0) {
        callback();
      } else {
        this.pushPendingOp(callback);
      }
    }
    addTransition(time, onStart, onDone) {
      onStart();
      let timer = setTimeout(() => {
        this.transitions.delete(timer);
        onDone();
        if (this.size() === 0) {
          this.flushPendingOps();
        }
      }, time);
      this.transitions.add(timer);
    }
    pushPendingOp(op) {
      this.pendingOps.push(op);
    }
    size() {
      return this.transitions.size;
    }
    flushPendingOps() {
      this.pendingOps.forEach((op) => op());
      this.pendingOps = [];
    }
  };

  // js/app.js
  var import_topbar = __toESM(require_topbar());
  var csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");
  var liveSocket = new LiveSocket("/live", Socket, { params: { _csrf_token: csrfToken } });
  import_topbar.default.config({ barColors: { 0: "#29d" }, shadowColor: "rgba(0, 0, 0, .3)" });
  window.addEventListener("phx:page-loading-start", (info) => import_topbar.default.show());
  window.addEventListener("phx:page-loading-stop", (info) => import_topbar.default.hide());
  liveSocket.connect();
  window.liveSocket = liveSocket;
})();
/**
 * @license MIT
 * topbar 1.0.0, 2021-01-06
 * https://buunguyen.github.io/topbar
 * Copyright (c) 2021 Buu Nguyen
 */
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXNzZXRzL3ZlbmRvci90b3BiYXIuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2h0bWwvcHJpdi9zdGF0aWMvcGhvZW5peF9odG1sLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC91dGlscy5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvYXNzZXRzL2pzL3Bob2VuaXgvY29uc3RhbnRzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC9wdXNoLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC90aW1lci5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvYXNzZXRzL2pzL3Bob2VuaXgvY2hhbm5lbC5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvYXNzZXRzL2pzL3Bob2VuaXgvYWpheC5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvYXNzZXRzL2pzL3Bob2VuaXgvbG9uZ3BvbGwuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4L2Fzc2V0cy9qcy9waG9lbml4L3ByZXNlbmNlLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC9zZXJpYWxpemVyLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC9zb2NrZXQuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvY29uc3RhbnRzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2VudHJ5X3VwbG9hZGVyLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L3V0aWxzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2Jyb3dzZXIuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvZG9tLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L3VwbG9hZF9lbnRyeS5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXhfbGl2ZV92aWV3L2Fzc2V0cy9qcy9waG9lbml4X2xpdmVfdmlldy9saXZlX3VwbG9hZGVyLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2hvb2tzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2RvbV9wb3N0X21vcnBoX3Jlc3RvcmVyLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL25vZGVfbW9kdWxlcy9tb3JwaGRvbS9kaXN0L21vcnBoZG9tLWVzbS5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXhfbGl2ZV92aWV3L2Fzc2V0cy9qcy9waG9lbml4X2xpdmVfdmlldy9kb21fcGF0Y2guanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvcmVuZGVyZWQuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvdmlld19ob29rLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2pzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L3ZpZXcuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvbGl2ZV9zb2NrZXQuanMiLCAiLi4vLi4vLi4vYXNzZXRzL2pzL2FwcC5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLyoqXG4gKiBAbGljZW5zZSBNSVRcbiAqIHRvcGJhciAxLjAuMCwgMjAyMS0wMS0wNlxuICogaHR0cHM6Ly9idXVuZ3V5ZW4uZ2l0aHViLmlvL3RvcGJhclxuICogQ29weXJpZ2h0IChjKSAyMDIxIEJ1dSBOZ3V5ZW5cbiAqL1xuKGZ1bmN0aW9uICh3aW5kb3csIGRvY3VtZW50KSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIC8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL3BhdWxpcmlzaC8xNTc5NjcxXG4gIChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGxhc3RUaW1lID0gMDtcbiAgICB2YXIgdmVuZG9ycyA9IFtcIm1zXCIsIFwibW96XCIsIFwid2Via2l0XCIsIFwib1wiXTtcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZlbmRvcnMubGVuZ3RoICYmICF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lOyArK3gpIHtcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPVxuICAgICAgICB3aW5kb3dbdmVuZG9yc1t4XSArIFwiUmVxdWVzdEFuaW1hdGlvbkZyYW1lXCJdO1xuICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID1cbiAgICAgICAgd2luZG93W3ZlbmRvcnNbeF0gKyBcIkNhbmNlbEFuaW1hdGlvbkZyYW1lXCJdIHx8XG4gICAgICAgIHdpbmRvd1t2ZW5kb3JzW3hdICsgXCJDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcIl07XG4gICAgfVxuICAgIGlmICghd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSlcbiAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbiAoY2FsbGJhY2ssIGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGN1cnJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIHZhciB0aW1lVG9DYWxsID0gTWF0aC5tYXgoMCwgMTYgLSAoY3VyclRpbWUgLSBsYXN0VGltZSkpO1xuICAgICAgICB2YXIgaWQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY2FsbGJhY2soY3VyclRpbWUgKyB0aW1lVG9DYWxsKTtcbiAgICAgICAgfSwgdGltZVRvQ2FsbCk7XG4gICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsO1xuICAgICAgICByZXR1cm4gaWQ7XG4gICAgICB9O1xuICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKVxuICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIGNsZWFyVGltZW91dChpZCk7XG4gICAgICB9O1xuICB9KSgpO1xuXG4gIHZhciBjYW52YXMsXG4gICAgcHJvZ3Jlc3NUaW1lcklkLFxuICAgIGZhZGVUaW1lcklkLFxuICAgIGN1cnJlbnRQcm9ncmVzcyxcbiAgICBzaG93aW5nLFxuICAgIGFkZEV2ZW50ID0gZnVuY3Rpb24gKGVsZW0sIHR5cGUsIGhhbmRsZXIpIHtcbiAgICAgIGlmIChlbGVtLmFkZEV2ZW50TGlzdGVuZXIpIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgICBlbHNlIGlmIChlbGVtLmF0dGFjaEV2ZW50KSBlbGVtLmF0dGFjaEV2ZW50KFwib25cIiArIHR5cGUsIGhhbmRsZXIpO1xuICAgICAgZWxzZSBlbGVtW1wib25cIiArIHR5cGVdID0gaGFuZGxlcjtcbiAgICB9LFxuICAgIG9wdGlvbnMgPSB7XG4gICAgICBhdXRvUnVuOiB0cnVlLFxuICAgICAgYmFyVGhpY2tuZXNzOiAzLFxuICAgICAgYmFyQ29sb3JzOiB7XG4gICAgICAgIDA6IFwicmdiYSgyNiwgIDE4OCwgMTU2LCAuOSlcIixcbiAgICAgICAgXCIuMjVcIjogXCJyZ2JhKDUyLCAgMTUyLCAyMTksIC45KVwiLFxuICAgICAgICBcIi41MFwiOiBcInJnYmEoMjQxLCAxOTYsIDE1LCAgLjkpXCIsXG4gICAgICAgIFwiLjc1XCI6IFwicmdiYSgyMzAsIDEyNiwgMzQsICAuOSlcIixcbiAgICAgICAgXCIxLjBcIjogXCJyZ2JhKDIxMSwgODQsICAwLCAgIC45KVwiLFxuICAgICAgfSxcbiAgICAgIHNoYWRvd0JsdXI6IDEwLFxuICAgICAgc2hhZG93Q29sb3I6IFwicmdiYSgwLCAgIDAsICAgMCwgICAuNilcIixcbiAgICAgIGNsYXNzTmFtZTogbnVsbCxcbiAgICB9LFxuICAgIHJlcGFpbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSBvcHRpb25zLmJhclRoaWNrbmVzcyAqIDU7IC8vIG5lZWQgc3BhY2UgZm9yIHNoYWRvd1xuXG4gICAgICB2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgIGN0eC5zaGFkb3dCbHVyID0gb3B0aW9ucy5zaGFkb3dCbHVyO1xuICAgICAgY3R4LnNoYWRvd0NvbG9yID0gb3B0aW9ucy5zaGFkb3dDb2xvcjtcblxuICAgICAgdmFyIGxpbmVHcmFkaWVudCA9IGN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCgwLCAwLCBjYW52YXMud2lkdGgsIDApO1xuICAgICAgZm9yICh2YXIgc3RvcCBpbiBvcHRpb25zLmJhckNvbG9ycylcbiAgICAgICAgbGluZUdyYWRpZW50LmFkZENvbG9yU3RvcChzdG9wLCBvcHRpb25zLmJhckNvbG9yc1tzdG9wXSk7XG4gICAgICBjdHgubGluZVdpZHRoID0gb3B0aW9ucy5iYXJUaGlja25lc3M7XG4gICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICBjdHgubW92ZVRvKDAsIG9wdGlvbnMuYmFyVGhpY2tuZXNzIC8gMik7XG4gICAgICBjdHgubGluZVRvKFxuICAgICAgICBNYXRoLmNlaWwoY3VycmVudFByb2dyZXNzICogY2FudmFzLndpZHRoKSxcbiAgICAgICAgb3B0aW9ucy5iYXJUaGlja25lc3MgLyAyXG4gICAgICApO1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gbGluZUdyYWRpZW50O1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH0sXG4gICAgY3JlYXRlQ2FudmFzID0gZnVuY3Rpb24gKCkge1xuICAgICAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgIHZhciBzdHlsZSA9IGNhbnZhcy5zdHlsZTtcbiAgICAgIHN0eWxlLnBvc2l0aW9uID0gXCJmaXhlZFwiO1xuICAgICAgc3R5bGUudG9wID0gc3R5bGUubGVmdCA9IHN0eWxlLnJpZ2h0ID0gc3R5bGUubWFyZ2luID0gc3R5bGUucGFkZGluZyA9IDA7XG4gICAgICBzdHlsZS56SW5kZXggPSAxMDAwMDE7XG4gICAgICBzdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICBpZiAob3B0aW9ucy5jbGFzc05hbWUpIGNhbnZhcy5jbGFzc0xpc3QuYWRkKG9wdGlvbnMuY2xhc3NOYW1lKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgICAgIGFkZEV2ZW50KHdpbmRvdywgXCJyZXNpemVcIiwgcmVwYWludCk7XG4gICAgfSxcbiAgICB0b3BiYXIgPSB7XG4gICAgICBjb25maWc6IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvcHRzKVxuICAgICAgICAgIGlmIChvcHRpb25zLmhhc093blByb3BlcnR5KGtleSkpIG9wdGlvbnNba2V5XSA9IG9wdHNba2V5XTtcbiAgICAgIH0sXG4gICAgICBzaG93OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChzaG93aW5nKSByZXR1cm47XG4gICAgICAgIHNob3dpbmcgPSB0cnVlO1xuICAgICAgICBpZiAoZmFkZVRpbWVySWQgIT09IG51bGwpIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShmYWRlVGltZXJJZCk7XG4gICAgICAgIGlmICghY2FudmFzKSBjcmVhdGVDYW52YXMoKTtcbiAgICAgICAgY2FudmFzLnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgICBjYW52YXMuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgdG9wYmFyLnByb2dyZXNzKDApO1xuICAgICAgICBpZiAob3B0aW9ucy5hdXRvUnVuKSB7XG4gICAgICAgICAgKGZ1bmN0aW9uIGxvb3AoKSB7XG4gICAgICAgICAgICBwcm9ncmVzc1RpbWVySWQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xuICAgICAgICAgICAgdG9wYmFyLnByb2dyZXNzKFxuICAgICAgICAgICAgICBcIitcIiArIDAuMDUgKiBNYXRoLnBvdygxIC0gTWF0aC5zcXJ0KGN1cnJlbnRQcm9ncmVzcyksIDIpXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBwcm9ncmVzczogZnVuY3Rpb24gKHRvKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdG8gPT09IFwidW5kZWZpbmVkXCIpIHJldHVybiBjdXJyZW50UHJvZ3Jlc3M7XG4gICAgICAgIGlmICh0eXBlb2YgdG8gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICB0byA9XG4gICAgICAgICAgICAodG8uaW5kZXhPZihcIitcIikgPj0gMCB8fCB0by5pbmRleE9mKFwiLVwiKSA+PSAwXG4gICAgICAgICAgICAgID8gY3VycmVudFByb2dyZXNzXG4gICAgICAgICAgICAgIDogMCkgKyBwYXJzZUZsb2F0KHRvKTtcbiAgICAgICAgfVxuICAgICAgICBjdXJyZW50UHJvZ3Jlc3MgPSB0byA+IDEgPyAxIDogdG87XG4gICAgICAgIHJlcGFpbnQoKTtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRQcm9ncmVzcztcbiAgICAgIH0sXG4gICAgICBoaWRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghc2hvd2luZykgcmV0dXJuO1xuICAgICAgICBzaG93aW5nID0gZmFsc2U7XG4gICAgICAgIGlmIChwcm9ncmVzc1RpbWVySWQgIT0gbnVsbCkge1xuICAgICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShwcm9ncmVzc1RpbWVySWQpO1xuICAgICAgICAgIHByb2dyZXNzVGltZXJJZCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgKGZ1bmN0aW9uIGxvb3AoKSB7XG4gICAgICAgICAgaWYgKHRvcGJhci5wcm9ncmVzcyhcIisuMVwiKSA+PSAxKSB7XG4gICAgICAgICAgICBjYW52YXMuc3R5bGUub3BhY2l0eSAtPSAwLjA1O1xuICAgICAgICAgICAgaWYgKGNhbnZhcy5zdHlsZS5vcGFjaXR5IDw9IDAuMDUpIHtcbiAgICAgICAgICAgICAgY2FudmFzLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgICAgZmFkZVRpbWVySWQgPSBudWxsO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGZhZGVUaW1lcklkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAgICAgICAgfSkoKTtcbiAgICAgIH0sXG4gICAgfTtcblxuICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgPT09IFwib2JqZWN0XCIpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHRvcGJhcjtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdG9wYmFyO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHRoaXMudG9wYmFyID0gdG9wYmFyO1xuICB9XG59LmNhbGwodGhpcywgd2luZG93LCBkb2N1bWVudCkpO1xuIiwgIlwidXNlIHN0cmljdFwiO1xuXG4oZnVuY3Rpb24oKSB7XG4gIHZhciBQb2x5ZmlsbEV2ZW50ID0gZXZlbnRDb25zdHJ1Y3RvcigpO1xuXG4gIGZ1bmN0aW9uIGV2ZW50Q29uc3RydWN0b3IoKSB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cuQ3VzdG9tRXZlbnQgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIHdpbmRvdy5DdXN0b21FdmVudDtcbiAgICAvLyBJRTw9OSBTdXBwb3J0XG4gICAgZnVuY3Rpb24gQ3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcykge1xuICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHtidWJibGVzOiBmYWxzZSwgY2FuY2VsYWJsZTogZmFsc2UsIGRldGFpbDogdW5kZWZpbmVkfTtcbiAgICAgIHZhciBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcbiAgICAgIGV2dC5pbml0Q3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSwgcGFyYW1zLmRldGFpbCk7XG4gICAgICByZXR1cm4gZXZ0O1xuICAgIH1cbiAgICBDdXN0b21FdmVudC5wcm90b3R5cGUgPSB3aW5kb3cuRXZlbnQucHJvdG90eXBlO1xuICAgIHJldHVybiBDdXN0b21FdmVudDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGJ1aWxkSGlkZGVuSW5wdXQobmFtZSwgdmFsdWUpIHtcbiAgICB2YXIgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgaW5wdXQudHlwZSA9IFwiaGlkZGVuXCI7XG4gICAgaW5wdXQubmFtZSA9IG5hbWU7XG4gICAgaW5wdXQudmFsdWUgPSB2YWx1ZTtcbiAgICByZXR1cm4gaW5wdXQ7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVDbGljayhlbGVtZW50LCB0YXJnZXRNb2RpZmllcktleSkge1xuICAgIHZhciB0byA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS10b1wiKSxcbiAgICAgICAgbWV0aG9kID0gYnVpbGRIaWRkZW5JbnB1dChcIl9tZXRob2RcIiwgZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW1ldGhvZFwiKSksXG4gICAgICAgIGNzcmYgPSBidWlsZEhpZGRlbklucHV0KFwiX2NzcmZfdG9rZW5cIiwgZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNzcmZcIikpLFxuICAgICAgICBmb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvcm1cIiksXG4gICAgICAgIHRhcmdldCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwidGFyZ2V0XCIpO1xuXG4gICAgZm9ybS5tZXRob2QgPSAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW1ldGhvZFwiKSA9PT0gXCJnZXRcIikgPyBcImdldFwiIDogXCJwb3N0XCI7XG4gICAgZm9ybS5hY3Rpb24gPSB0bztcbiAgICBmb3JtLnN0eWxlLmRpc3BsYXkgPSBcImhpZGRlblwiO1xuXG4gICAgaWYgKHRhcmdldCkgZm9ybS50YXJnZXQgPSB0YXJnZXQ7XG4gICAgZWxzZSBpZiAodGFyZ2V0TW9kaWZpZXJLZXkpIGZvcm0udGFyZ2V0ID0gXCJfYmxhbmtcIjtcblxuICAgIGZvcm0uYXBwZW5kQ2hpbGQoY3NyZik7XG4gICAgZm9ybS5hcHBlbmRDaGlsZChtZXRob2QpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZm9ybSk7XG4gICAgZm9ybS5zdWJtaXQoKTtcbiAgfVxuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xuICAgIHZhciBlbGVtZW50ID0gZS50YXJnZXQ7XG4gICAgaWYgKGUuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xuXG4gICAgd2hpbGUgKGVsZW1lbnQgJiYgZWxlbWVudC5nZXRBdHRyaWJ1dGUpIHtcbiAgICAgIHZhciBwaG9lbml4TGlua0V2ZW50ID0gbmV3IFBvbHlmaWxsRXZlbnQoJ3Bob2VuaXgubGluay5jbGljaycsIHtcbiAgICAgICAgXCJidWJibGVzXCI6IHRydWUsIFwiY2FuY2VsYWJsZVwiOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgaWYgKCFlbGVtZW50LmRpc3BhdGNoRXZlbnQocGhvZW5peExpbmtFdmVudCkpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtbWV0aG9kXCIpKSB7XG4gICAgICAgIGhhbmRsZUNsaWNrKGVsZW1lbnQsIGUubWV0YUtleSB8fCBlLnNoaWZ0S2V5KTtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlO1xuICAgICAgfVxuICAgIH1cbiAgfSwgZmFsc2UpO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwaG9lbml4LmxpbmsuY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBtZXNzYWdlID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1jb25maXJtXCIpO1xuICAgIGlmKG1lc3NhZ2UgJiYgIXdpbmRvdy5jb25maXJtKG1lc3NhZ2UpKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9LCBmYWxzZSk7XG59KSgpO1xuIiwgIi8vIHdyYXBzIHZhbHVlIGluIGNsb3N1cmUgb3IgcmV0dXJucyBjbG9zdXJlXG5leHBvcnQgbGV0IGNsb3N1cmUgPSAodmFsdWUpID0+IHtcbiAgaWYodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpe1xuICAgIHJldHVybiB2YWx1ZVxuICB9IGVsc2Uge1xuICAgIGxldCBjbG9zdXJlID0gZnVuY3Rpb24gKCl7IHJldHVybiB2YWx1ZSB9XG4gICAgcmV0dXJuIGNsb3N1cmVcbiAgfVxufVxuIiwgImV4cG9ydCBjb25zdCBnbG9iYWxTZWxmID0gdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogbnVsbFxuZXhwb3J0IGNvbnN0IHBoeFdpbmRvdyA9IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiBudWxsXG5leHBvcnQgY29uc3QgZ2xvYmFsID0gZ2xvYmFsU2VsZiB8fCBwaHhXaW5kb3cgfHwgZ2xvYmFsXG5leHBvcnQgY29uc3QgREVGQVVMVF9WU04gPSBcIjIuMC4wXCJcbmV4cG9ydCBjb25zdCBTT0NLRVRfU1RBVEVTID0ge2Nvbm5lY3Rpbmc6IDAsIG9wZW46IDEsIGNsb3Npbmc6IDIsIGNsb3NlZDogM31cbmV4cG9ydCBjb25zdCBERUZBVUxUX1RJTUVPVVQgPSAxMDAwMFxuZXhwb3J0IGNvbnN0IFdTX0NMT1NFX05PUk1BTCA9IDEwMDBcbmV4cG9ydCBjb25zdCBDSEFOTkVMX1NUQVRFUyA9IHtcbiAgY2xvc2VkOiBcImNsb3NlZFwiLFxuICBlcnJvcmVkOiBcImVycm9yZWRcIixcbiAgam9pbmVkOiBcImpvaW5lZFwiLFxuICBqb2luaW5nOiBcImpvaW5pbmdcIixcbiAgbGVhdmluZzogXCJsZWF2aW5nXCIsXG59XG5leHBvcnQgY29uc3QgQ0hBTk5FTF9FVkVOVFMgPSB7XG4gIGNsb3NlOiBcInBoeF9jbG9zZVwiLFxuICBlcnJvcjogXCJwaHhfZXJyb3JcIixcbiAgam9pbjogXCJwaHhfam9pblwiLFxuICByZXBseTogXCJwaHhfcmVwbHlcIixcbiAgbGVhdmU6IFwicGh4X2xlYXZlXCJcbn1cblxuZXhwb3J0IGNvbnN0IFRSQU5TUE9SVFMgPSB7XG4gIGxvbmdwb2xsOiBcImxvbmdwb2xsXCIsXG4gIHdlYnNvY2tldDogXCJ3ZWJzb2NrZXRcIlxufVxuZXhwb3J0IGNvbnN0IFhIUl9TVEFURVMgPSB7XG4gIGNvbXBsZXRlOiA0XG59XG4iLCAiLyoqXG4gKiBJbml0aWFsaXplcyB0aGUgUHVzaFxuICogQHBhcmFtIHtDaGFubmVsfSBjaGFubmVsIC0gVGhlIENoYW5uZWxcbiAqIEBwYXJhbSB7c3RyaW5nfSBldmVudCAtIFRoZSBldmVudCwgZm9yIGV4YW1wbGUgYFwicGh4X2pvaW5cImBcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXlsb2FkIC0gVGhlIHBheWxvYWQsIGZvciBleGFtcGxlIGB7dXNlcl9pZDogMTIzfWBcbiAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lb3V0IC0gVGhlIHB1c2ggdGltZW91dCBpbiBtaWxsaXNlY29uZHNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHVzaCB7XG4gIGNvbnN0cnVjdG9yKGNoYW5uZWwsIGV2ZW50LCBwYXlsb2FkLCB0aW1lb3V0KXtcbiAgICB0aGlzLmNoYW5uZWwgPSBjaGFubmVsXG4gICAgdGhpcy5ldmVudCA9IGV2ZW50XG4gICAgdGhpcy5wYXlsb2FkID0gcGF5bG9hZCB8fCBmdW5jdGlvbiAoKXsgcmV0dXJuIHt9IH1cbiAgICB0aGlzLnJlY2VpdmVkUmVzcCA9IG51bGxcbiAgICB0aGlzLnRpbWVvdXQgPSB0aW1lb3V0XG4gICAgdGhpcy50aW1lb3V0VGltZXIgPSBudWxsXG4gICAgdGhpcy5yZWNIb29rcyA9IFtdXG4gICAgdGhpcy5zZW50ID0gZmFsc2VcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gdGltZW91dFxuICAgKi9cbiAgcmVzZW5kKHRpbWVvdXQpe1xuICAgIHRoaXMudGltZW91dCA9IHRpbWVvdXRcbiAgICB0aGlzLnJlc2V0KClcbiAgICB0aGlzLnNlbmQoKVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqL1xuICBzZW5kKCl7XG4gICAgaWYodGhpcy5oYXNSZWNlaXZlZChcInRpbWVvdXRcIikpeyByZXR1cm4gfVxuICAgIHRoaXMuc3RhcnRUaW1lb3V0KClcbiAgICB0aGlzLnNlbnQgPSB0cnVlXG4gICAgdGhpcy5jaGFubmVsLnNvY2tldC5wdXNoKHtcbiAgICAgIHRvcGljOiB0aGlzLmNoYW5uZWwudG9waWMsXG4gICAgICBldmVudDogdGhpcy5ldmVudCxcbiAgICAgIHBheWxvYWQ6IHRoaXMucGF5bG9hZCgpLFxuICAgICAgcmVmOiB0aGlzLnJlZixcbiAgICAgIGpvaW5fcmVmOiB0aGlzLmNoYW5uZWwuam9pblJlZigpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0geyp9IHN0YXR1c1xuICAgKiBAcGFyYW0geyp9IGNhbGxiYWNrXG4gICAqL1xuICByZWNlaXZlKHN0YXR1cywgY2FsbGJhY2spe1xuICAgIGlmKHRoaXMuaGFzUmVjZWl2ZWQoc3RhdHVzKSl7XG4gICAgICBjYWxsYmFjayh0aGlzLnJlY2VpdmVkUmVzcC5yZXNwb25zZSlcbiAgICB9XG5cbiAgICB0aGlzLnJlY0hvb2tzLnB1c2goe3N0YXR1cywgY2FsbGJhY2t9KVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlc2V0KCl7XG4gICAgdGhpcy5jYW5jZWxSZWZFdmVudCgpXG4gICAgdGhpcy5yZWYgPSBudWxsXG4gICAgdGhpcy5yZWZFdmVudCA9IG51bGxcbiAgICB0aGlzLnJlY2VpdmVkUmVzcCA9IG51bGxcbiAgICB0aGlzLnNlbnQgPSBmYWxzZVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBtYXRjaFJlY2VpdmUoe3N0YXR1cywgcmVzcG9uc2UsIF9yZWZ9KXtcbiAgICB0aGlzLnJlY0hvb2tzLmZpbHRlcihoID0+IGguc3RhdHVzID09PSBzdGF0dXMpXG4gICAgICAuZm9yRWFjaChoID0+IGguY2FsbGJhY2socmVzcG9uc2UpKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjYW5jZWxSZWZFdmVudCgpe1xuICAgIGlmKCF0aGlzLnJlZkV2ZW50KXsgcmV0dXJuIH1cbiAgICB0aGlzLmNoYW5uZWwub2ZmKHRoaXMucmVmRXZlbnQpXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNhbmNlbFRpbWVvdXQoKXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0VGltZXIpXG4gICAgdGhpcy50aW1lb3V0VGltZXIgPSBudWxsXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXJ0VGltZW91dCgpe1xuICAgIGlmKHRoaXMudGltZW91dFRpbWVyKXsgdGhpcy5jYW5jZWxUaW1lb3V0KCkgfVxuICAgIHRoaXMucmVmID0gdGhpcy5jaGFubmVsLnNvY2tldC5tYWtlUmVmKClcbiAgICB0aGlzLnJlZkV2ZW50ID0gdGhpcy5jaGFubmVsLnJlcGx5RXZlbnROYW1lKHRoaXMucmVmKVxuXG4gICAgdGhpcy5jaGFubmVsLm9uKHRoaXMucmVmRXZlbnQsIHBheWxvYWQgPT4ge1xuICAgICAgdGhpcy5jYW5jZWxSZWZFdmVudCgpXG4gICAgICB0aGlzLmNhbmNlbFRpbWVvdXQoKVxuICAgICAgdGhpcy5yZWNlaXZlZFJlc3AgPSBwYXlsb2FkXG4gICAgICB0aGlzLm1hdGNoUmVjZWl2ZShwYXlsb2FkKVxuICAgIH0pXG5cbiAgICB0aGlzLnRpbWVvdXRUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy50cmlnZ2VyKFwidGltZW91dFwiLCB7fSlcbiAgICB9LCB0aGlzLnRpbWVvdXQpXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGhhc1JlY2VpdmVkKHN0YXR1cyl7XG4gICAgcmV0dXJuIHRoaXMucmVjZWl2ZWRSZXNwICYmIHRoaXMucmVjZWl2ZWRSZXNwLnN0YXR1cyA9PT0gc3RhdHVzXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHRyaWdnZXIoc3RhdHVzLCByZXNwb25zZSl7XG4gICAgdGhpcy5jaGFubmVsLnRyaWdnZXIodGhpcy5yZWZFdmVudCwge3N0YXR1cywgcmVzcG9uc2V9KVxuICB9XG59XG4iLCAiLyoqXG4gKlxuICogQ3JlYXRlcyBhIHRpbWVyIHRoYXQgYWNjZXB0cyBhIGB0aW1lckNhbGNgIGZ1bmN0aW9uIHRvIHBlcmZvcm1cbiAqIGNhbGN1bGF0ZWQgdGltZW91dCByZXRyaWVzLCBzdWNoIGFzIGV4cG9uZW50aWFsIGJhY2tvZmYuXG4gKlxuICogQGV4YW1wbGVcbiAqIGxldCByZWNvbm5lY3RUaW1lciA9IG5ldyBUaW1lcigoKSA9PiB0aGlzLmNvbm5lY3QoKSwgZnVuY3Rpb24odHJpZXMpe1xuICogICByZXR1cm4gWzEwMDAsIDUwMDAsIDEwMDAwXVt0cmllcyAtIDFdIHx8IDEwMDAwXG4gKiB9KVxuICogcmVjb25uZWN0VGltZXIuc2NoZWR1bGVUaW1lb3V0KCkgLy8gZmlyZXMgYWZ0ZXIgMTAwMFxuICogcmVjb25uZWN0VGltZXIuc2NoZWR1bGVUaW1lb3V0KCkgLy8gZmlyZXMgYWZ0ZXIgNTAwMFxuICogcmVjb25uZWN0VGltZXIucmVzZXQoKVxuICogcmVjb25uZWN0VGltZXIuc2NoZWR1bGVUaW1lb3V0KCkgLy8gZmlyZXMgYWZ0ZXIgMTAwMFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0aW1lckNhbGNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZXIge1xuICBjb25zdHJ1Y3RvcihjYWxsYmFjaywgdGltZXJDYWxjKXtcbiAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2tcbiAgICB0aGlzLnRpbWVyQ2FsYyA9IHRpbWVyQ2FsY1xuICAgIHRoaXMudGltZXIgPSBudWxsXG4gICAgdGhpcy50cmllcyA9IDBcbiAgfVxuXG4gIHJlc2V0KCl7XG4gICAgdGhpcy50cmllcyA9IDBcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcilcbiAgfVxuXG4gIC8qKlxuICAgKiBDYW5jZWxzIGFueSBwcmV2aW91cyBzY2hlZHVsZVRpbWVvdXQgYW5kIHNjaGVkdWxlcyBjYWxsYmFja1xuICAgKi9cbiAgc2NoZWR1bGVUaW1lb3V0KCl7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpXG5cbiAgICB0aGlzLnRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnRyaWVzID0gdGhpcy50cmllcyArIDFcbiAgICAgIHRoaXMuY2FsbGJhY2soKVxuICAgIH0sIHRoaXMudGltZXJDYWxjKHRoaXMudHJpZXMgKyAxKSlcbiAgfVxufVxuIiwgImltcG9ydCB7Y2xvc3VyZX0gZnJvbSBcIi4vdXRpbHNcIlxuaW1wb3J0IHtcbiAgQ0hBTk5FTF9FVkVOVFMsXG4gIENIQU5ORUxfU1RBVEVTLFxufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQgUHVzaCBmcm9tIFwiLi9wdXNoXCJcbmltcG9ydCBUaW1lciBmcm9tIFwiLi90aW1lclwiXG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY1xuICogQHBhcmFtIHsoT2JqZWN0fGZ1bmN0aW9uKX0gcGFyYW1zXG4gKiBAcGFyYW0ge1NvY2tldH0gc29ja2V0XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoYW5uZWwge1xuICBjb25zdHJ1Y3Rvcih0b3BpYywgcGFyYW1zLCBzb2NrZXQpe1xuICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5jbG9zZWRcbiAgICB0aGlzLnRvcGljID0gdG9waWNcbiAgICB0aGlzLnBhcmFtcyA9IGNsb3N1cmUocGFyYW1zIHx8IHt9KVxuICAgIHRoaXMuc29ja2V0ID0gc29ja2V0XG4gICAgdGhpcy5iaW5kaW5ncyA9IFtdXG4gICAgdGhpcy5iaW5kaW5nUmVmID0gMFxuICAgIHRoaXMudGltZW91dCA9IHRoaXMuc29ja2V0LnRpbWVvdXRcbiAgICB0aGlzLmpvaW5lZE9uY2UgPSBmYWxzZVxuICAgIHRoaXMuam9pblB1c2ggPSBuZXcgUHVzaCh0aGlzLCBDSEFOTkVMX0VWRU5UUy5qb2luLCB0aGlzLnBhcmFtcywgdGhpcy50aW1lb3V0KVxuICAgIHRoaXMucHVzaEJ1ZmZlciA9IFtdXG4gICAgdGhpcy5zdGF0ZUNoYW5nZVJlZnMgPSBbXVxuXG4gICAgdGhpcy5yZWpvaW5UaW1lciA9IG5ldyBUaW1lcigoKSA9PiB7XG4gICAgICBpZih0aGlzLnNvY2tldC5pc0Nvbm5lY3RlZCgpKXsgdGhpcy5yZWpvaW4oKSB9XG4gICAgfSwgdGhpcy5zb2NrZXQucmVqb2luQWZ0ZXJNcylcbiAgICB0aGlzLnN0YXRlQ2hhbmdlUmVmcy5wdXNoKHRoaXMuc29ja2V0Lm9uRXJyb3IoKCkgPT4gdGhpcy5yZWpvaW5UaW1lci5yZXNldCgpKSlcbiAgICB0aGlzLnN0YXRlQ2hhbmdlUmVmcy5wdXNoKHRoaXMuc29ja2V0Lm9uT3BlbigoKSA9PiB7XG4gICAgICB0aGlzLnJlam9pblRpbWVyLnJlc2V0KClcbiAgICAgIGlmKHRoaXMuaXNFcnJvcmVkKCkpeyB0aGlzLnJlam9pbigpIH1cbiAgICB9KVxuICAgIClcbiAgICB0aGlzLmpvaW5QdXNoLnJlY2VpdmUoXCJva1wiLCAoKSA9PiB7XG4gICAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMuam9pbmVkXG4gICAgICB0aGlzLnJlam9pblRpbWVyLnJlc2V0KClcbiAgICAgIHRoaXMucHVzaEJ1ZmZlci5mb3JFYWNoKHB1c2hFdmVudCA9PiBwdXNoRXZlbnQuc2VuZCgpKVxuICAgICAgdGhpcy5wdXNoQnVmZmVyID0gW11cbiAgICB9KVxuICAgIHRoaXMuam9pblB1c2gucmVjZWl2ZShcImVycm9yXCIsICgpID0+IHtcbiAgICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5lcnJvcmVkXG4gICAgICBpZih0aGlzLnNvY2tldC5pc0Nvbm5lY3RlZCgpKXsgdGhpcy5yZWpvaW5UaW1lci5zY2hlZHVsZVRpbWVvdXQoKSB9XG4gICAgfSlcbiAgICB0aGlzLm9uQ2xvc2UoKCkgPT4ge1xuICAgICAgdGhpcy5yZWpvaW5UaW1lci5yZXNldCgpXG4gICAgICBpZih0aGlzLnNvY2tldC5oYXNMb2dnZXIoKSkgdGhpcy5zb2NrZXQubG9nKFwiY2hhbm5lbFwiLCBgY2xvc2UgJHt0aGlzLnRvcGljfSAke3RoaXMuam9pblJlZigpfWApXG4gICAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMuY2xvc2VkXG4gICAgICB0aGlzLnNvY2tldC5yZW1vdmUodGhpcylcbiAgICB9KVxuICAgIHRoaXMub25FcnJvcihyZWFzb24gPT4ge1xuICAgICAgaWYodGhpcy5zb2NrZXQuaGFzTG9nZ2VyKCkpIHRoaXMuc29ja2V0LmxvZyhcImNoYW5uZWxcIiwgYGVycm9yICR7dGhpcy50b3BpY31gLCByZWFzb24pXG4gICAgICBpZih0aGlzLmlzSm9pbmluZygpKXsgdGhpcy5qb2luUHVzaC5yZXNldCgpIH1cbiAgICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5lcnJvcmVkXG4gICAgICBpZih0aGlzLnNvY2tldC5pc0Nvbm5lY3RlZCgpKXsgdGhpcy5yZWpvaW5UaW1lci5zY2hlZHVsZVRpbWVvdXQoKSB9XG4gICAgfSlcbiAgICB0aGlzLmpvaW5QdXNoLnJlY2VpdmUoXCJ0aW1lb3V0XCIsICgpID0+IHtcbiAgICAgIGlmKHRoaXMuc29ja2V0Lmhhc0xvZ2dlcigpKSB0aGlzLnNvY2tldC5sb2coXCJjaGFubmVsXCIsIGB0aW1lb3V0ICR7dGhpcy50b3BpY30gKCR7dGhpcy5qb2luUmVmKCl9KWAsIHRoaXMuam9pblB1c2gudGltZW91dClcbiAgICAgIGxldCBsZWF2ZVB1c2ggPSBuZXcgUHVzaCh0aGlzLCBDSEFOTkVMX0VWRU5UUy5sZWF2ZSwgY2xvc3VyZSh7fSksIHRoaXMudGltZW91dClcbiAgICAgIGxlYXZlUHVzaC5zZW5kKClcbiAgICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5lcnJvcmVkXG4gICAgICB0aGlzLmpvaW5QdXNoLnJlc2V0KClcbiAgICAgIGlmKHRoaXMuc29ja2V0LmlzQ29ubmVjdGVkKCkpeyB0aGlzLnJlam9pblRpbWVyLnNjaGVkdWxlVGltZW91dCgpIH1cbiAgICB9KVxuICAgIHRoaXMub24oQ0hBTk5FTF9FVkVOVFMucmVwbHksIChwYXlsb2FkLCByZWYpID0+IHtcbiAgICAgIHRoaXMudHJpZ2dlcih0aGlzLnJlcGx5RXZlbnROYW1lKHJlZiksIHBheWxvYWQpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBKb2luIHRoZSBjaGFubmVsXG4gICAqIEBwYXJhbSB7aW50ZWdlcn0gdGltZW91dFxuICAgKiBAcmV0dXJucyB7UHVzaH1cbiAgICovXG4gIGpvaW4odGltZW91dCA9IHRoaXMudGltZW91dCl7XG4gICAgaWYodGhpcy5qb2luZWRPbmNlKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInRyaWVkIHRvIGpvaW4gbXVsdGlwbGUgdGltZXMuICdqb2luJyBjYW4gb25seSBiZSBjYWxsZWQgYSBzaW5nbGUgdGltZSBwZXIgY2hhbm5lbCBpbnN0YW5jZVwiKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRpbWVvdXQgPSB0aW1lb3V0XG4gICAgICB0aGlzLmpvaW5lZE9uY2UgPSB0cnVlXG4gICAgICB0aGlzLnJlam9pbigpXG4gICAgICByZXR1cm4gdGhpcy5qb2luUHVzaFxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIb29rIGludG8gY2hhbm5lbCBjbG9zZVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgb25DbG9zZShjYWxsYmFjayl7XG4gICAgdGhpcy5vbihDSEFOTkVMX0VWRU5UUy5jbG9zZSwgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogSG9vayBpbnRvIGNoYW5uZWwgZXJyb3JzXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBvbkVycm9yKGNhbGxiYWNrKXtcbiAgICByZXR1cm4gdGhpcy5vbihDSEFOTkVMX0VWRU5UUy5lcnJvciwgcmVhc29uID0+IGNhbGxiYWNrKHJlYXNvbikpXG4gIH1cblxuICAvKipcbiAgICogU3Vic2NyaWJlcyBvbiBjaGFubmVsIGV2ZW50c1xuICAgKlxuICAgKiBTdWJzY3JpcHRpb24gcmV0dXJucyBhIHJlZiBjb3VudGVyLCB3aGljaCBjYW4gYmUgdXNlZCBsYXRlciB0b1xuICAgKiB1bnN1YnNjcmliZSB0aGUgZXhhY3QgZXZlbnQgbGlzdGVuZXJcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogY29uc3QgcmVmMSA9IGNoYW5uZWwub24oXCJldmVudFwiLCBkb19zdHVmZilcbiAgICogY29uc3QgcmVmMiA9IGNoYW5uZWwub24oXCJldmVudFwiLCBkb19vdGhlcl9zdHVmZilcbiAgICogY2hhbm5lbC5vZmYoXCJldmVudFwiLCByZWYxKVxuICAgKiAvLyBTaW5jZSB1bnN1YnNjcmlwdGlvbiwgZG9fc3R1ZmYgd29uJ3QgZmlyZSxcbiAgICogLy8gd2hpbGUgZG9fb3RoZXJfc3R1ZmYgd2lsbCBrZWVwIGZpcmluZyBvbiB0aGUgXCJldmVudFwiXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKiBAcmV0dXJucyB7aW50ZWdlcn0gcmVmXG4gICAqL1xuICBvbihldmVudCwgY2FsbGJhY2spe1xuICAgIGxldCByZWYgPSB0aGlzLmJpbmRpbmdSZWYrK1xuICAgIHRoaXMuYmluZGluZ3MucHVzaCh7ZXZlbnQsIHJlZiwgY2FsbGJhY2t9KVxuICAgIHJldHVybiByZWZcbiAgfVxuXG4gIC8qKlxuICAgKiBVbnN1YnNjcmliZXMgb2ZmIG9mIGNoYW5uZWwgZXZlbnRzXG4gICAqXG4gICAqIFVzZSB0aGUgcmVmIHJldHVybmVkIGZyb20gYSBjaGFubmVsLm9uKCkgdG8gdW5zdWJzY3JpYmUgb25lXG4gICAqIGhhbmRsZXIsIG9yIHBhc3Mgbm90aGluZyBmb3IgdGhlIHJlZiB0byB1bnN1YnNjcmliZSBhbGxcbiAgICogaGFuZGxlcnMgZm9yIHRoZSBnaXZlbiBldmVudC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogLy8gVW5zdWJzY3JpYmUgdGhlIGRvX3N0dWZmIGhhbmRsZXJcbiAgICogY29uc3QgcmVmMSA9IGNoYW5uZWwub24oXCJldmVudFwiLCBkb19zdHVmZilcbiAgICogY2hhbm5lbC5vZmYoXCJldmVudFwiLCByZWYxKVxuICAgKlxuICAgKiAvLyBVbnN1YnNjcmliZSBhbGwgaGFuZGxlcnMgZnJvbSBldmVudFxuICAgKiBjaGFubmVsLm9mZihcImV2ZW50XCIpXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxuICAgKiBAcGFyYW0ge2ludGVnZXJ9IHJlZlxuICAgKi9cbiAgb2ZmKGV2ZW50LCByZWYpe1xuICAgIHRoaXMuYmluZGluZ3MgPSB0aGlzLmJpbmRpbmdzLmZpbHRlcigoYmluZCkgPT4ge1xuICAgICAgcmV0dXJuICEoYmluZC5ldmVudCA9PT0gZXZlbnQgJiYgKHR5cGVvZiByZWYgPT09IFwidW5kZWZpbmVkXCIgfHwgcmVmID09PSBiaW5kLnJlZikpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY2FuUHVzaCgpeyByZXR1cm4gdGhpcy5zb2NrZXQuaXNDb25uZWN0ZWQoKSAmJiB0aGlzLmlzSm9pbmVkKCkgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIG1lc3NhZ2UgYGV2ZW50YCB0byBwaG9lbml4IHdpdGggdGhlIHBheWxvYWQgYHBheWxvYWRgLlxuICAgKiBQaG9lbml4IHJlY2VpdmVzIHRoaXMgaW4gdGhlIGBoYW5kbGVfaW4oZXZlbnQsIHBheWxvYWQsIHNvY2tldClgXG4gICAqIGZ1bmN0aW9uLiBpZiBwaG9lbml4IHJlcGxpZXMgb3IgaXQgdGltZXMgb3V0IChkZWZhdWx0IDEwMDAwbXMpLFxuICAgKiB0aGVuIG9wdGlvbmFsbHkgdGhlIHJlcGx5IGNhbiBiZSByZWNlaXZlZC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogY2hhbm5lbC5wdXNoKFwiZXZlbnRcIilcbiAgICogICAucmVjZWl2ZShcIm9rXCIsIHBheWxvYWQgPT4gY29uc29sZS5sb2coXCJwaG9lbml4IHJlcGxpZWQ6XCIsIHBheWxvYWQpKVxuICAgKiAgIC5yZWNlaXZlKFwiZXJyb3JcIiwgZXJyID0+IGNvbnNvbGUubG9nKFwicGhvZW5peCBlcnJvcmVkXCIsIGVycikpXG4gICAqICAgLnJlY2VpdmUoXCJ0aW1lb3V0XCIsICgpID0+IGNvbnNvbGUubG9nKFwidGltZWQgb3V0IHB1c2hpbmdcIikpXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxuICAgKiBAcGFyYW0ge09iamVjdH0gcGF5bG9hZFxuICAgKiBAcGFyYW0ge251bWJlcn0gW3RpbWVvdXRdXG4gICAqIEByZXR1cm5zIHtQdXNofVxuICAgKi9cbiAgcHVzaChldmVudCwgcGF5bG9hZCwgdGltZW91dCA9IHRoaXMudGltZW91dCl7XG4gICAgcGF5bG9hZCA9IHBheWxvYWQgfHwge31cbiAgICBpZighdGhpcy5qb2luZWRPbmNlKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdHJpZWQgdG8gcHVzaCAnJHtldmVudH0nIHRvICcke3RoaXMudG9waWN9JyBiZWZvcmUgam9pbmluZy4gVXNlIGNoYW5uZWwuam9pbigpIGJlZm9yZSBwdXNoaW5nIGV2ZW50c2ApXG4gICAgfVxuICAgIGxldCBwdXNoRXZlbnQgPSBuZXcgUHVzaCh0aGlzLCBldmVudCwgZnVuY3Rpb24gKCl7IHJldHVybiBwYXlsb2FkIH0sIHRpbWVvdXQpXG4gICAgaWYodGhpcy5jYW5QdXNoKCkpe1xuICAgICAgcHVzaEV2ZW50LnNlbmQoKVxuICAgIH0gZWxzZSB7XG4gICAgICBwdXNoRXZlbnQuc3RhcnRUaW1lb3V0KClcbiAgICAgIHRoaXMucHVzaEJ1ZmZlci5wdXNoKHB1c2hFdmVudClcbiAgICB9XG5cbiAgICByZXR1cm4gcHVzaEV2ZW50XG4gIH1cblxuICAvKiogTGVhdmVzIHRoZSBjaGFubmVsXG4gICAqXG4gICAqIFVuc3Vic2NyaWJlcyBmcm9tIHNlcnZlciBldmVudHMsIGFuZFxuICAgKiBpbnN0cnVjdHMgY2hhbm5lbCB0byB0ZXJtaW5hdGUgb24gc2VydmVyXG4gICAqXG4gICAqIFRyaWdnZXJzIG9uQ2xvc2UoKSBob29rc1xuICAgKlxuICAgKiBUbyByZWNlaXZlIGxlYXZlIGFja25vd2xlZGdlbWVudHMsIHVzZSB0aGUgYHJlY2VpdmVgXG4gICAqIGhvb2sgdG8gYmluZCB0byB0aGUgc2VydmVyIGFjaywgaWU6XG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGNoYW5uZWwubGVhdmUoKS5yZWNlaXZlKFwib2tcIiwgKCkgPT4gYWxlcnQoXCJsZWZ0IVwiKSApXG4gICAqXG4gICAqIEBwYXJhbSB7aW50ZWdlcn0gdGltZW91dFxuICAgKiBAcmV0dXJucyB7UHVzaH1cbiAgICovXG4gIGxlYXZlKHRpbWVvdXQgPSB0aGlzLnRpbWVvdXQpe1xuICAgIHRoaXMucmVqb2luVGltZXIucmVzZXQoKVxuICAgIHRoaXMuam9pblB1c2guY2FuY2VsVGltZW91dCgpXG5cbiAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMubGVhdmluZ1xuICAgIGxldCBvbkNsb3NlID0gKCkgPT4ge1xuICAgICAgaWYodGhpcy5zb2NrZXQuaGFzTG9nZ2VyKCkpIHRoaXMuc29ja2V0LmxvZyhcImNoYW5uZWxcIiwgYGxlYXZlICR7dGhpcy50b3BpY31gKVxuICAgICAgdGhpcy50cmlnZ2VyKENIQU5ORUxfRVZFTlRTLmNsb3NlLCBcImxlYXZlXCIpXG4gICAgfVxuICAgIGxldCBsZWF2ZVB1c2ggPSBuZXcgUHVzaCh0aGlzLCBDSEFOTkVMX0VWRU5UUy5sZWF2ZSwgY2xvc3VyZSh7fSksIHRpbWVvdXQpXG4gICAgbGVhdmVQdXNoLnJlY2VpdmUoXCJva1wiLCAoKSA9PiBvbkNsb3NlKCkpXG4gICAgICAucmVjZWl2ZShcInRpbWVvdXRcIiwgKCkgPT4gb25DbG9zZSgpKVxuICAgIGxlYXZlUHVzaC5zZW5kKClcbiAgICBpZighdGhpcy5jYW5QdXNoKCkpeyBsZWF2ZVB1c2gudHJpZ2dlcihcIm9rXCIsIHt9KSB9XG5cbiAgICByZXR1cm4gbGVhdmVQdXNoXG4gIH1cblxuICAvKipcbiAgICogT3ZlcnJpZGFibGUgbWVzc2FnZSBob29rXG4gICAqXG4gICAqIFJlY2VpdmVzIGFsbCBldmVudHMgZm9yIHNwZWNpYWxpemVkIG1lc3NhZ2UgaGFuZGxpbmdcbiAgICogYmVmb3JlIGRpc3BhdGNoaW5nIHRvIHRoZSBjaGFubmVsIGNhbGxiYWNrcy5cbiAgICpcbiAgICogTXVzdCByZXR1cm4gdGhlIHBheWxvYWQsIG1vZGlmaWVkIG9yIHVubW9kaWZpZWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXlsb2FkXG4gICAqIEBwYXJhbSB7aW50ZWdlcn0gcmVmXG4gICAqIEByZXR1cm5zIHtPYmplY3R9XG4gICAqL1xuICBvbk1lc3NhZ2UoX2V2ZW50LCBwYXlsb2FkLCBfcmVmKXsgcmV0dXJuIHBheWxvYWQgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaXNNZW1iZXIodG9waWMsIGV2ZW50LCBwYXlsb2FkLCBqb2luUmVmKXtcbiAgICBpZih0aGlzLnRvcGljICE9PSB0b3BpYyl7IHJldHVybiBmYWxzZSB9XG5cbiAgICBpZihqb2luUmVmICYmIGpvaW5SZWYgIT09IHRoaXMuam9pblJlZigpKXtcbiAgICAgIGlmKHRoaXMuc29ja2V0Lmhhc0xvZ2dlcigpKSB0aGlzLnNvY2tldC5sb2coXCJjaGFubmVsXCIsIFwiZHJvcHBpbmcgb3V0ZGF0ZWQgbWVzc2FnZVwiLCB7dG9waWMsIGV2ZW50LCBwYXlsb2FkLCBqb2luUmVmfSlcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgam9pblJlZigpeyByZXR1cm4gdGhpcy5qb2luUHVzaC5yZWYgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVqb2luKHRpbWVvdXQgPSB0aGlzLnRpbWVvdXQpe1xuICAgIGlmKHRoaXMuaXNMZWF2aW5nKCkpeyByZXR1cm4gfVxuICAgIHRoaXMuc29ja2V0LmxlYXZlT3BlblRvcGljKHRoaXMudG9waWMpXG4gICAgdGhpcy5zdGF0ZSA9IENIQU5ORUxfU1RBVEVTLmpvaW5pbmdcbiAgICB0aGlzLmpvaW5QdXNoLnJlc2VuZCh0aW1lb3V0KVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB0cmlnZ2VyKGV2ZW50LCBwYXlsb2FkLCByZWYsIGpvaW5SZWYpe1xuICAgIGxldCBoYW5kbGVkUGF5bG9hZCA9IHRoaXMub25NZXNzYWdlKGV2ZW50LCBwYXlsb2FkLCByZWYsIGpvaW5SZWYpXG4gICAgaWYocGF5bG9hZCAmJiAhaGFuZGxlZFBheWxvYWQpeyB0aHJvdyBuZXcgRXJyb3IoXCJjaGFubmVsIG9uTWVzc2FnZSBjYWxsYmFja3MgbXVzdCByZXR1cm4gdGhlIHBheWxvYWQsIG1vZGlmaWVkIG9yIHVubW9kaWZpZWRcIikgfVxuXG4gICAgbGV0IGV2ZW50QmluZGluZ3MgPSB0aGlzLmJpbmRpbmdzLmZpbHRlcihiaW5kID0+IGJpbmQuZXZlbnQgPT09IGV2ZW50KVxuXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGV2ZW50QmluZGluZ3MubGVuZ3RoOyBpKyspe1xuICAgICAgbGV0IGJpbmQgPSBldmVudEJpbmRpbmdzW2ldXG4gICAgICBiaW5kLmNhbGxiYWNrKGhhbmRsZWRQYXlsb2FkLCByZWYsIGpvaW5SZWYgfHwgdGhpcy5qb2luUmVmKCkpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXBseUV2ZW50TmFtZShyZWYpeyByZXR1cm4gYGNoYW5fcmVwbHlfJHtyZWZ9YCB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpc0Nsb3NlZCgpeyByZXR1cm4gdGhpcy5zdGF0ZSA9PT0gQ0hBTk5FTF9TVEFURVMuY2xvc2VkIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGlzRXJyb3JlZCgpeyByZXR1cm4gdGhpcy5zdGF0ZSA9PT0gQ0hBTk5FTF9TVEFURVMuZXJyb3JlZCB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpc0pvaW5lZCgpeyByZXR1cm4gdGhpcy5zdGF0ZSA9PT0gQ0hBTk5FTF9TVEFURVMuam9pbmVkIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGlzSm9pbmluZygpeyByZXR1cm4gdGhpcy5zdGF0ZSA9PT0gQ0hBTk5FTF9TVEFURVMuam9pbmluZyB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpc0xlYXZpbmcoKXsgcmV0dXJuIHRoaXMuc3RhdGUgPT09IENIQU5ORUxfU1RBVEVTLmxlYXZpbmcgfVxufVxuIiwgImltcG9ydCB7XG4gIGdsb2JhbCxcbiAgWEhSX1NUQVRFU1xufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBamF4IHtcblxuICBzdGF0aWMgcmVxdWVzdChtZXRob2QsIGVuZFBvaW50LCBhY2NlcHQsIGJvZHksIHRpbWVvdXQsIG9udGltZW91dCwgY2FsbGJhY2spe1xuICAgIGlmKGdsb2JhbC5YRG9tYWluUmVxdWVzdCl7XG4gICAgICBsZXQgcmVxID0gbmV3IGdsb2JhbC5YRG9tYWluUmVxdWVzdCgpIC8vIElFOCwgSUU5XG4gICAgICB0aGlzLnhkb21haW5SZXF1ZXN0KHJlcSwgbWV0aG9kLCBlbmRQb2ludCwgYm9keSwgdGltZW91dCwgb250aW1lb3V0LCBjYWxsYmFjaylcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IHJlcSA9IG5ldyBnbG9iYWwuWE1MSHR0cFJlcXVlc3QoKSAvLyBJRTcrLCBGaXJlZm94LCBDaHJvbWUsIE9wZXJhLCBTYWZhcmlcbiAgICAgIHRoaXMueGhyUmVxdWVzdChyZXEsIG1ldGhvZCwgZW5kUG9pbnQsIGFjY2VwdCwgYm9keSwgdGltZW91dCwgb250aW1lb3V0LCBjYWxsYmFjaylcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgeGRvbWFpblJlcXVlc3QocmVxLCBtZXRob2QsIGVuZFBvaW50LCBib2R5LCB0aW1lb3V0LCBvbnRpbWVvdXQsIGNhbGxiYWNrKXtcbiAgICByZXEudGltZW91dCA9IHRpbWVvdXRcbiAgICByZXEub3BlbihtZXRob2QsIGVuZFBvaW50KVxuICAgIHJlcS5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICBsZXQgcmVzcG9uc2UgPSB0aGlzLnBhcnNlSlNPTihyZXEucmVzcG9uc2VUZXh0KVxuICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2socmVzcG9uc2UpXG4gICAgfVxuICAgIGlmKG9udGltZW91dCl7IHJlcS5vbnRpbWVvdXQgPSBvbnRpbWVvdXQgfVxuXG4gICAgLy8gV29yayBhcm91bmQgYnVnIGluIElFOSB0aGF0IHJlcXVpcmVzIGFuIGF0dGFjaGVkIG9ucHJvZ3Jlc3MgaGFuZGxlclxuICAgIHJlcS5vbnByb2dyZXNzID0gKCkgPT4geyB9XG5cbiAgICByZXEuc2VuZChib2R5KVxuICB9XG5cbiAgc3RhdGljIHhoclJlcXVlc3QocmVxLCBtZXRob2QsIGVuZFBvaW50LCBhY2NlcHQsIGJvZHksIHRpbWVvdXQsIG9udGltZW91dCwgY2FsbGJhY2spe1xuICAgIHJlcS5vcGVuKG1ldGhvZCwgZW5kUG9pbnQsIHRydWUpXG4gICAgcmVxLnRpbWVvdXQgPSB0aW1lb3V0XG4gICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgYWNjZXB0KVxuICAgIHJlcS5vbmVycm9yID0gKCkgPT4geyBjYWxsYmFjayAmJiBjYWxsYmFjayhudWxsKSB9XG4gICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgIGlmKHJlcS5yZWFkeVN0YXRlID09PSBYSFJfU1RBVEVTLmNvbXBsZXRlICYmIGNhbGxiYWNrKXtcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gdGhpcy5wYXJzZUpTT04ocmVxLnJlc3BvbnNlVGV4dClcbiAgICAgICAgY2FsbGJhY2socmVzcG9uc2UpXG4gICAgICB9XG4gICAgfVxuICAgIGlmKG9udGltZW91dCl7IHJlcS5vbnRpbWVvdXQgPSBvbnRpbWVvdXQgfVxuXG4gICAgcmVxLnNlbmQoYm9keSlcbiAgfVxuXG4gIHN0YXRpYyBwYXJzZUpTT04ocmVzcCl7XG4gICAgaWYoIXJlc3AgfHwgcmVzcCA9PT0gXCJcIil7IHJldHVybiBudWxsIH1cblxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShyZXNwKVxuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgY29uc29sZSAmJiBjb25zb2xlLmxvZyhcImZhaWxlZCB0byBwYXJzZSBKU09OIHJlc3BvbnNlXCIsIHJlc3ApXG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBzZXJpYWxpemUob2JqLCBwYXJlbnRLZXkpe1xuICAgIGxldCBxdWVyeVN0ciA9IFtdXG4gICAgZm9yKHZhciBrZXkgaW4gb2JqKXtcbiAgICAgIGlmKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKXsgY29udGludWUgfVxuICAgICAgbGV0IHBhcmFtS2V5ID0gcGFyZW50S2V5ID8gYCR7cGFyZW50S2V5fVske2tleX1dYCA6IGtleVxuICAgICAgbGV0IHBhcmFtVmFsID0gb2JqW2tleV1cbiAgICAgIGlmKHR5cGVvZiBwYXJhbVZhbCA9PT0gXCJvYmplY3RcIil7XG4gICAgICAgIHF1ZXJ5U3RyLnB1c2godGhpcy5zZXJpYWxpemUocGFyYW1WYWwsIHBhcmFtS2V5KSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXJ5U3RyLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KHBhcmFtS2V5KSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHBhcmFtVmFsKSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHF1ZXJ5U3RyLmpvaW4oXCImXCIpXG4gIH1cblxuICBzdGF0aWMgYXBwZW5kUGFyYW1zKHVybCwgcGFyYW1zKXtcbiAgICBpZihPYmplY3Qua2V5cyhwYXJhbXMpLmxlbmd0aCA9PT0gMCl7IHJldHVybiB1cmwgfVxuXG4gICAgbGV0IHByZWZpeCA9IHVybC5tYXRjaCgvXFw/LykgPyBcIiZcIiA6IFwiP1wiXG4gICAgcmV0dXJuIGAke3VybH0ke3ByZWZpeH0ke3RoaXMuc2VyaWFsaXplKHBhcmFtcyl9YFxuICB9XG59XG4iLCAiaW1wb3J0IHtcbiAgU09DS0VUX1NUQVRFUyxcbiAgVFJBTlNQT1JUU1xufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQgQWpheCBmcm9tIFwiLi9hamF4XCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9uZ1BvbGwge1xuXG4gIGNvbnN0cnVjdG9yKGVuZFBvaW50KXtcbiAgICB0aGlzLmVuZFBvaW50ID0gbnVsbFxuICAgIHRoaXMudG9rZW4gPSBudWxsXG4gICAgdGhpcy5za2lwSGVhcnRiZWF0ID0gdHJ1ZVxuICAgIHRoaXMub25vcGVuID0gZnVuY3Rpb24gKCl7IH0gLy8gbm9vcFxuICAgIHRoaXMub25lcnJvciA9IGZ1bmN0aW9uICgpeyB9IC8vIG5vb3BcbiAgICB0aGlzLm9ubWVzc2FnZSA9IGZ1bmN0aW9uICgpeyB9IC8vIG5vb3BcbiAgICB0aGlzLm9uY2xvc2UgPSBmdW5jdGlvbiAoKXsgfSAvLyBub29wXG4gICAgdGhpcy5wb2xsRW5kcG9pbnQgPSB0aGlzLm5vcm1hbGl6ZUVuZHBvaW50KGVuZFBvaW50KVxuICAgIHRoaXMucmVhZHlTdGF0ZSA9IFNPQ0tFVF9TVEFURVMuY29ubmVjdGluZ1xuICAgIHRoaXMucG9sbCgpXG4gIH1cblxuICBub3JtYWxpemVFbmRwb2ludChlbmRQb2ludCl7XG4gICAgcmV0dXJuIChlbmRQb2ludFxuICAgICAgLnJlcGxhY2UoXCJ3czovL1wiLCBcImh0dHA6Ly9cIilcbiAgICAgIC5yZXBsYWNlKFwid3NzOi8vXCIsIFwiaHR0cHM6Ly9cIilcbiAgICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAoXCIoLiopXFwvXCIgKyBUUkFOU1BPUlRTLndlYnNvY2tldCksIFwiJDEvXCIgKyBUUkFOU1BPUlRTLmxvbmdwb2xsKSlcbiAgfVxuXG4gIGVuZHBvaW50VVJMKCl7XG4gICAgcmV0dXJuIEFqYXguYXBwZW5kUGFyYW1zKHRoaXMucG9sbEVuZHBvaW50LCB7dG9rZW46IHRoaXMudG9rZW59KVxuICB9XG5cbiAgY2xvc2VBbmRSZXRyeShjb2RlLCByZWFzb24sIHdhc0NsZWFuKXtcbiAgICB0aGlzLmNsb3NlKGNvZGUsIHJlYXNvbiwgd2FzQ2xlYW4pXG4gICAgdGhpcy5yZWFkeVN0YXRlID0gU09DS0VUX1NUQVRFUy5jb25uZWN0aW5nXG4gIH1cblxuICBvbnRpbWVvdXQoKXtcbiAgICB0aGlzLm9uZXJyb3IoXCJ0aW1lb3V0XCIpXG4gICAgdGhpcy5jbG9zZUFuZFJldHJ5KDEwMDUsIFwidGltZW91dFwiLCBmYWxzZSlcbiAgfVxuXG4gIHBvbGwoKXtcbiAgICBpZighKHRoaXMucmVhZHlTdGF0ZSA9PT0gU09DS0VUX1NUQVRFUy5vcGVuIHx8IHRoaXMucmVhZHlTdGF0ZSA9PT0gU09DS0VUX1NUQVRFUy5jb25uZWN0aW5nKSl7IHJldHVybiB9XG5cbiAgICBBamF4LnJlcXVlc3QoXCJHRVRcIiwgdGhpcy5lbmRwb2ludFVSTCgpLCBcImFwcGxpY2F0aW9uL2pzb25cIiwgbnVsbCwgdGhpcy50aW1lb3V0LCB0aGlzLm9udGltZW91dC5iaW5kKHRoaXMpLCAocmVzcCkgPT4ge1xuICAgICAgaWYocmVzcCl7XG4gICAgICAgIHZhciB7c3RhdHVzLCB0b2tlbiwgbWVzc2FnZXN9ID0gcmVzcFxuICAgICAgICB0aGlzLnRva2VuID0gdG9rZW5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXR1cyA9IDBcbiAgICAgIH1cblxuICAgICAgc3dpdGNoKHN0YXR1cyl7XG4gICAgICAgIGNhc2UgMjAwOlxuICAgICAgICAgIG1lc3NhZ2VzLmZvckVhY2gobXNnID0+IHtcbiAgICAgICAgICAgIC8vIFRhc2tzIGFyZSB3aGF0IHRoaW5ncyBsaWtlIGV2ZW50IGhhbmRsZXJzLCBzZXRUaW1lb3V0IGNhbGxiYWNrcyxcbiAgICAgICAgICAgIC8vIHByb21pc2UgcmVzb2x2ZXMgYW5kIG1vcmUgYXJlIHJ1biB3aXRoaW4uXG4gICAgICAgICAgICAvLyBJbiBtb2Rlcm4gYnJvd3NlcnMsIHRoZXJlIGFyZSB0d28gZGlmZmVyZW50IGtpbmRzIG9mIHRhc2tzLFxuICAgICAgICAgICAgLy8gbWljcm90YXNrcyBhbmQgbWFjcm90YXNrcy5cbiAgICAgICAgICAgIC8vIE1pY3JvdGFza3MgYXJlIG1haW5seSB1c2VkIGZvciBQcm9taXNlcywgd2hpbGUgbWFjcm90YXNrcyBhcmVcbiAgICAgICAgICAgIC8vIHVzZWQgZm9yIGV2ZXJ5dGhpbmcgZWxzZS5cbiAgICAgICAgICAgIC8vIE1pY3JvdGFza3MgYWx3YXlzIGhhdmUgcHJpb3JpdHkgb3ZlciBtYWNyb3Rhc2tzLiBJZiB0aGUgSlMgZW5naW5lXG4gICAgICAgICAgICAvLyBpcyBsb29raW5nIGZvciBhIHRhc2sgdG8gcnVuLCBpdCB3aWxsIGFsd2F5cyB0cnkgdG8gZW1wdHkgdGhlXG4gICAgICAgICAgICAvLyBtaWNyb3Rhc2sgcXVldWUgYmVmb3JlIGF0dGVtcHRpbmcgdG8gcnVuIGFueXRoaW5nIGZyb20gdGhlXG4gICAgICAgICAgICAvLyBtYWNyb3Rhc2sgcXVldWUuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gRm9yIHRoZSBXZWJTb2NrZXQgdHJhbnNwb3J0LCBtZXNzYWdlcyBhbHdheXMgYXJyaXZlIGluIHRoZWlyIG93blxuICAgICAgICAgICAgLy8gZXZlbnQuIFRoaXMgbWVhbnMgdGhhdCBpZiBhbnkgcHJvbWlzZXMgYXJlIHJlc29sdmVkIGZyb20gd2l0aGluLFxuICAgICAgICAgICAgLy8gdGhlaXIgY2FsbGJhY2tzIHdpbGwgYWx3YXlzIGZpbmlzaCBleGVjdXRpb24gYnkgdGhlIHRpbWUgdGhlXG4gICAgICAgICAgICAvLyBuZXh0IG1lc3NhZ2UgZXZlbnQgaGFuZGxlciBpcyBydW4uXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gSW4gb3JkZXIgdG8gZW11bGF0ZSB0aGlzIGJlaGF2aW91ciwgd2UgbmVlZCB0byBtYWtlIHN1cmUgZWFjaFxuICAgICAgICAgICAgLy8gb25tZXNzYWdlIGhhbmRsZXIgaXMgcnVuIHdpdGhpbiBpdCdzIG93biBtYWNyb3Rhc2suXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5vbm1lc3NhZ2Uoe2RhdGE6IG1zZ30pXG4gICAgICAgICAgICB9LCAwKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgdGhpcy5wb2xsKClcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDIwNDpcbiAgICAgICAgICB0aGlzLnBvbGwoKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNDEwOlxuICAgICAgICAgIHRoaXMucmVhZHlTdGF0ZSA9IFNPQ0tFVF9TVEFURVMub3BlblxuICAgICAgICAgIHRoaXMub25vcGVuKHt9KVxuICAgICAgICAgIHRoaXMucG9sbCgpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA0MDM6XG4gICAgICAgICAgdGhpcy5vbmVycm9yKDQwMylcbiAgICAgICAgICB0aGlzLmNsb3NlKDEwMDgsIFwiZm9yYmlkZGVuXCIsIGZhbHNlKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgY2FzZSA1MDA6XG4gICAgICAgICAgdGhpcy5vbmVycm9yKDUwMClcbiAgICAgICAgICB0aGlzLmNsb3NlQW5kUmV0cnkoMTAxMSwgXCJpbnRlcm5hbCBzZXJ2ZXIgZXJyb3JcIiwgNTAwKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGRlZmF1bHQ6IHRocm93IG5ldyBFcnJvcihgdW5oYW5kbGVkIHBvbGwgc3RhdHVzICR7c3RhdHVzfWApXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHNlbmQoYm9keSl7XG4gICAgQWpheC5yZXF1ZXN0KFwiUE9TVFwiLCB0aGlzLmVuZHBvaW50VVJMKCksIFwiYXBwbGljYXRpb24vanNvblwiLCBib2R5LCB0aGlzLnRpbWVvdXQsIHRoaXMub25lcnJvci5iaW5kKHRoaXMsIFwidGltZW91dFwiKSwgKHJlc3ApID0+IHtcbiAgICAgIGlmKCFyZXNwIHx8IHJlc3Auc3RhdHVzICE9PSAyMDApe1xuICAgICAgICB0aGlzLm9uZXJyb3IocmVzcCAmJiByZXNwLnN0YXR1cylcbiAgICAgICAgdGhpcy5jbG9zZUFuZFJldHJ5KDEwMTEsIFwiaW50ZXJuYWwgc2VydmVyIGVycm9yXCIsIGZhbHNlKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBjbG9zZShjb2RlLCByZWFzb24sIHdhc0NsZWFuKXtcbiAgICB0aGlzLnJlYWR5U3RhdGUgPSBTT0NLRVRfU1RBVEVTLmNsb3NlZFxuICAgIGxldCBvcHRzID0gT2JqZWN0LmFzc2lnbih7Y29kZTogMTAwMCwgcmVhc29uOiB1bmRlZmluZWQsIHdhc0NsZWFuOiB0cnVlfSwge2NvZGUsIHJlYXNvbiwgd2FzQ2xlYW59KVxuICAgIGlmKHR5cGVvZihDbG9zZUV2ZW50KSAhPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICB0aGlzLm9uY2xvc2UobmV3IENsb3NlRXZlbnQoXCJjbG9zZVwiLCBvcHRzKSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vbmNsb3NlKG9wdHMpXG4gICAgfVxuICB9XG59XG4iLCAiLyoqXG4gKiBJbml0aWFsaXplcyB0aGUgUHJlc2VuY2VcbiAqIEBwYXJhbSB7Q2hhbm5lbH0gY2hhbm5lbCAtIFRoZSBDaGFubmVsXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyAtIFRoZSBvcHRpb25zLFxuICogICAgICAgIGZvciBleGFtcGxlIGB7ZXZlbnRzOiB7c3RhdGU6IFwic3RhdGVcIiwgZGlmZjogXCJkaWZmXCJ9fWBcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJlc2VuY2Uge1xuXG4gIGNvbnN0cnVjdG9yKGNoYW5uZWwsIG9wdHMgPSB7fSl7XG4gICAgbGV0IGV2ZW50cyA9IG9wdHMuZXZlbnRzIHx8IHtzdGF0ZTogXCJwcmVzZW5jZV9zdGF0ZVwiLCBkaWZmOiBcInByZXNlbmNlX2RpZmZcIn1cbiAgICB0aGlzLnN0YXRlID0ge31cbiAgICB0aGlzLnBlbmRpbmdEaWZmcyA9IFtdXG4gICAgdGhpcy5jaGFubmVsID0gY2hhbm5lbFxuICAgIHRoaXMuam9pblJlZiA9IG51bGxcbiAgICB0aGlzLmNhbGxlciA9IHtcbiAgICAgIG9uSm9pbjogZnVuY3Rpb24gKCl7IH0sXG4gICAgICBvbkxlYXZlOiBmdW5jdGlvbiAoKXsgfSxcbiAgICAgIG9uU3luYzogZnVuY3Rpb24gKCl7IH1cbiAgICB9XG5cbiAgICB0aGlzLmNoYW5uZWwub24oZXZlbnRzLnN0YXRlLCBuZXdTdGF0ZSA9PiB7XG4gICAgICBsZXQge29uSm9pbiwgb25MZWF2ZSwgb25TeW5jfSA9IHRoaXMuY2FsbGVyXG5cbiAgICAgIHRoaXMuam9pblJlZiA9IHRoaXMuY2hhbm5lbC5qb2luUmVmKClcbiAgICAgIHRoaXMuc3RhdGUgPSBQcmVzZW5jZS5zeW5jU3RhdGUodGhpcy5zdGF0ZSwgbmV3U3RhdGUsIG9uSm9pbiwgb25MZWF2ZSlcblxuICAgICAgdGhpcy5wZW5kaW5nRGlmZnMuZm9yRWFjaChkaWZmID0+IHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFByZXNlbmNlLnN5bmNEaWZmKHRoaXMuc3RhdGUsIGRpZmYsIG9uSm9pbiwgb25MZWF2ZSlcbiAgICAgIH0pXG4gICAgICB0aGlzLnBlbmRpbmdEaWZmcyA9IFtdXG4gICAgICBvblN5bmMoKVxuICAgIH0pXG5cbiAgICB0aGlzLmNoYW5uZWwub24oZXZlbnRzLmRpZmYsIGRpZmYgPT4ge1xuICAgICAgbGV0IHtvbkpvaW4sIG9uTGVhdmUsIG9uU3luY30gPSB0aGlzLmNhbGxlclxuXG4gICAgICBpZih0aGlzLmluUGVuZGluZ1N5bmNTdGF0ZSgpKXtcbiAgICAgICAgdGhpcy5wZW5kaW5nRGlmZnMucHVzaChkaWZmKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFByZXNlbmNlLnN5bmNEaWZmKHRoaXMuc3RhdGUsIGRpZmYsIG9uSm9pbiwgb25MZWF2ZSlcbiAgICAgICAgb25TeW5jKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgb25Kb2luKGNhbGxiYWNrKXsgdGhpcy5jYWxsZXIub25Kb2luID0gY2FsbGJhY2sgfVxuXG4gIG9uTGVhdmUoY2FsbGJhY2speyB0aGlzLmNhbGxlci5vbkxlYXZlID0gY2FsbGJhY2sgfVxuXG4gIG9uU3luYyhjYWxsYmFjayl7IHRoaXMuY2FsbGVyLm9uU3luYyA9IGNhbGxiYWNrIH1cblxuICBsaXN0KGJ5KXsgcmV0dXJuIFByZXNlbmNlLmxpc3QodGhpcy5zdGF0ZSwgYnkpIH1cblxuICBpblBlbmRpbmdTeW5jU3RhdGUoKXtcbiAgICByZXR1cm4gIXRoaXMuam9pblJlZiB8fCAodGhpcy5qb2luUmVmICE9PSB0aGlzLmNoYW5uZWwuam9pblJlZigpKVxuICB9XG5cbiAgLy8gbG93ZXItbGV2ZWwgcHVibGljIHN0YXRpYyBBUElcblxuICAvKipcbiAgICogVXNlZCB0byBzeW5jIHRoZSBsaXN0IG9mIHByZXNlbmNlcyBvbiB0aGUgc2VydmVyXG4gICAqIHdpdGggdGhlIGNsaWVudCdzIHN0YXRlLiBBbiBvcHRpb25hbCBgb25Kb2luYCBhbmQgYG9uTGVhdmVgIGNhbGxiYWNrIGNhblxuICAgKiBiZSBwcm92aWRlZCB0byByZWFjdCB0byBjaGFuZ2VzIGluIHRoZSBjbGllbnQncyBsb2NhbCBwcmVzZW5jZXMgYWNyb3NzXG4gICAqIGRpc2Nvbm5lY3RzIGFuZCByZWNvbm5lY3RzIHdpdGggdGhlIHNlcnZlci5cbiAgICpcbiAgICogQHJldHVybnMge1ByZXNlbmNlfVxuICAgKi9cbiAgc3RhdGljIHN5bmNTdGF0ZShjdXJyZW50U3RhdGUsIG5ld1N0YXRlLCBvbkpvaW4sIG9uTGVhdmUpe1xuICAgIGxldCBzdGF0ZSA9IHRoaXMuY2xvbmUoY3VycmVudFN0YXRlKVxuICAgIGxldCBqb2lucyA9IHt9XG4gICAgbGV0IGxlYXZlcyA9IHt9XG5cbiAgICB0aGlzLm1hcChzdGF0ZSwgKGtleSwgcHJlc2VuY2UpID0+IHtcbiAgICAgIGlmKCFuZXdTdGF0ZVtrZXldKXtcbiAgICAgICAgbGVhdmVzW2tleV0gPSBwcmVzZW5jZVxuICAgICAgfVxuICAgIH0pXG4gICAgdGhpcy5tYXAobmV3U3RhdGUsIChrZXksIG5ld1ByZXNlbmNlKSA9PiB7XG4gICAgICBsZXQgY3VycmVudFByZXNlbmNlID0gc3RhdGVba2V5XVxuICAgICAgaWYoY3VycmVudFByZXNlbmNlKXtcbiAgICAgICAgbGV0IG5ld1JlZnMgPSBuZXdQcmVzZW5jZS5tZXRhcy5tYXAobSA9PiBtLnBoeF9yZWYpXG4gICAgICAgIGxldCBjdXJSZWZzID0gY3VycmVudFByZXNlbmNlLm1ldGFzLm1hcChtID0+IG0ucGh4X3JlZilcbiAgICAgICAgbGV0IGpvaW5lZE1ldGFzID0gbmV3UHJlc2VuY2UubWV0YXMuZmlsdGVyKG0gPT4gY3VyUmVmcy5pbmRleE9mKG0ucGh4X3JlZikgPCAwKVxuICAgICAgICBsZXQgbGVmdE1ldGFzID0gY3VycmVudFByZXNlbmNlLm1ldGFzLmZpbHRlcihtID0+IG5ld1JlZnMuaW5kZXhPZihtLnBoeF9yZWYpIDwgMClcbiAgICAgICAgaWYoam9pbmVkTWV0YXMubGVuZ3RoID4gMCl7XG4gICAgICAgICAgam9pbnNba2V5XSA9IG5ld1ByZXNlbmNlXG4gICAgICAgICAgam9pbnNba2V5XS5tZXRhcyA9IGpvaW5lZE1ldGFzXG4gICAgICAgIH1cbiAgICAgICAgaWYobGVmdE1ldGFzLmxlbmd0aCA+IDApe1xuICAgICAgICAgIGxlYXZlc1trZXldID0gdGhpcy5jbG9uZShjdXJyZW50UHJlc2VuY2UpXG4gICAgICAgICAgbGVhdmVzW2tleV0ubWV0YXMgPSBsZWZ0TWV0YXNcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgam9pbnNba2V5XSA9IG5ld1ByZXNlbmNlXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gdGhpcy5zeW5jRGlmZihzdGF0ZSwge2pvaW5zOiBqb2lucywgbGVhdmVzOiBsZWF2ZXN9LCBvbkpvaW4sIG9uTGVhdmUpXG4gIH1cblxuICAvKipcbiAgICpcbiAgICogVXNlZCB0byBzeW5jIGEgZGlmZiBvZiBwcmVzZW5jZSBqb2luIGFuZCBsZWF2ZVxuICAgKiBldmVudHMgZnJvbSB0aGUgc2VydmVyLCBhcyB0aGV5IGhhcHBlbi4gTGlrZSBgc3luY1N0YXRlYCwgYHN5bmNEaWZmYFxuICAgKiBhY2NlcHRzIG9wdGlvbmFsIGBvbkpvaW5gIGFuZCBgb25MZWF2ZWAgY2FsbGJhY2tzIHRvIHJlYWN0IHRvIGEgdXNlclxuICAgKiBqb2luaW5nIG9yIGxlYXZpbmcgZnJvbSBhIGRldmljZS5cbiAgICpcbiAgICogQHJldHVybnMge1ByZXNlbmNlfVxuICAgKi9cbiAgc3RhdGljIHN5bmNEaWZmKHN0YXRlLCBkaWZmLCBvbkpvaW4sIG9uTGVhdmUpe1xuICAgIGxldCB7am9pbnMsIGxlYXZlc30gPSB0aGlzLmNsb25lKGRpZmYpXG4gICAgaWYoIW9uSm9pbil7IG9uSm9pbiA9IGZ1bmN0aW9uICgpeyB9IH1cbiAgICBpZighb25MZWF2ZSl7IG9uTGVhdmUgPSBmdW5jdGlvbiAoKXsgfSB9XG5cbiAgICB0aGlzLm1hcChqb2lucywgKGtleSwgbmV3UHJlc2VuY2UpID0+IHtcbiAgICAgIGxldCBjdXJyZW50UHJlc2VuY2UgPSBzdGF0ZVtrZXldXG4gICAgICBzdGF0ZVtrZXldID0gdGhpcy5jbG9uZShuZXdQcmVzZW5jZSlcbiAgICAgIGlmKGN1cnJlbnRQcmVzZW5jZSl7XG4gICAgICAgIGxldCBqb2luZWRSZWZzID0gc3RhdGVba2V5XS5tZXRhcy5tYXAobSA9PiBtLnBoeF9yZWYpXG4gICAgICAgIGxldCBjdXJNZXRhcyA9IGN1cnJlbnRQcmVzZW5jZS5tZXRhcy5maWx0ZXIobSA9PiBqb2luZWRSZWZzLmluZGV4T2YobS5waHhfcmVmKSA8IDApXG4gICAgICAgIHN0YXRlW2tleV0ubWV0YXMudW5zaGlmdCguLi5jdXJNZXRhcylcbiAgICAgIH1cbiAgICAgIG9uSm9pbihrZXksIGN1cnJlbnRQcmVzZW5jZSwgbmV3UHJlc2VuY2UpXG4gICAgfSlcbiAgICB0aGlzLm1hcChsZWF2ZXMsIChrZXksIGxlZnRQcmVzZW5jZSkgPT4ge1xuICAgICAgbGV0IGN1cnJlbnRQcmVzZW5jZSA9IHN0YXRlW2tleV1cbiAgICAgIGlmKCFjdXJyZW50UHJlc2VuY2UpeyByZXR1cm4gfVxuICAgICAgbGV0IHJlZnNUb1JlbW92ZSA9IGxlZnRQcmVzZW5jZS5tZXRhcy5tYXAobSA9PiBtLnBoeF9yZWYpXG4gICAgICBjdXJyZW50UHJlc2VuY2UubWV0YXMgPSBjdXJyZW50UHJlc2VuY2UubWV0YXMuZmlsdGVyKHAgPT4ge1xuICAgICAgICByZXR1cm4gcmVmc1RvUmVtb3ZlLmluZGV4T2YocC5waHhfcmVmKSA8IDBcbiAgICAgIH0pXG4gICAgICBvbkxlYXZlKGtleSwgY3VycmVudFByZXNlbmNlLCBsZWZ0UHJlc2VuY2UpXG4gICAgICBpZihjdXJyZW50UHJlc2VuY2UubWV0YXMubGVuZ3RoID09PSAwKXtcbiAgICAgICAgZGVsZXRlIHN0YXRlW2tleV1cbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBzdGF0ZVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGFycmF5IG9mIHByZXNlbmNlcywgd2l0aCBzZWxlY3RlZCBtZXRhZGF0YS5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHByZXNlbmNlc1xuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjaG9vc2VyXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcmVzZW5jZX1cbiAgICovXG4gIHN0YXRpYyBsaXN0KHByZXNlbmNlcywgY2hvb3Nlcil7XG4gICAgaWYoIWNob29zZXIpeyBjaG9vc2VyID0gZnVuY3Rpb24gKGtleSwgcHJlcyl7IHJldHVybiBwcmVzIH0gfVxuXG4gICAgcmV0dXJuIHRoaXMubWFwKHByZXNlbmNlcywgKGtleSwgcHJlc2VuY2UpID0+IHtcbiAgICAgIHJldHVybiBjaG9vc2VyKGtleSwgcHJlc2VuY2UpXG4gICAgfSlcbiAgfVxuXG4gIC8vIHByaXZhdGVcblxuICBzdGF0aWMgbWFwKG9iaiwgZnVuYyl7XG4gICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iaikubWFwKGtleSA9PiBmdW5jKGtleSwgb2JqW2tleV0pKVxuICB9XG5cbiAgc3RhdGljIGNsb25lKG9iail7IHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iaikpIH1cbn1cbiIsICIvKiBUaGUgZGVmYXVsdCBzZXJpYWxpemVyIGZvciBlbmNvZGluZyBhbmQgZGVjb2RpbmcgbWVzc2FnZXMgKi9cbmltcG9ydCB7XG4gIENIQU5ORUxfRVZFTlRTXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgSEVBREVSX0xFTkdUSDogMSxcbiAgTUVUQV9MRU5HVEg6IDQsXG4gIEtJTkRTOiB7cHVzaDogMCwgcmVwbHk6IDEsIGJyb2FkY2FzdDogMn0sXG5cbiAgZW5jb2RlKG1zZywgY2FsbGJhY2spe1xuICAgIGlmKG1zZy5wYXlsb2FkLmNvbnN0cnVjdG9yID09PSBBcnJheUJ1ZmZlcil7XG4gICAgICByZXR1cm4gY2FsbGJhY2sodGhpcy5iaW5hcnlFbmNvZGUobXNnKSlcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IHBheWxvYWQgPSBbbXNnLmpvaW5fcmVmLCBtc2cucmVmLCBtc2cudG9waWMsIG1zZy5ldmVudCwgbXNnLnBheWxvYWRdXG4gICAgICByZXR1cm4gY2FsbGJhY2soSlNPTi5zdHJpbmdpZnkocGF5bG9hZCkpXG4gICAgfVxuICB9LFxuXG4gIGRlY29kZShyYXdQYXlsb2FkLCBjYWxsYmFjayl7XG4gICAgaWYocmF3UGF5bG9hZC5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXIpe1xuICAgICAgcmV0dXJuIGNhbGxiYWNrKHRoaXMuYmluYXJ5RGVjb2RlKHJhd1BheWxvYWQpKVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgW2pvaW5fcmVmLCByZWYsIHRvcGljLCBldmVudCwgcGF5bG9hZF0gPSBKU09OLnBhcnNlKHJhd1BheWxvYWQpXG4gICAgICByZXR1cm4gY2FsbGJhY2soe2pvaW5fcmVmLCByZWYsIHRvcGljLCBldmVudCwgcGF5bG9hZH0pXG4gICAgfVxuICB9LFxuXG4gIC8vIHByaXZhdGVcblxuICBiaW5hcnlFbmNvZGUobWVzc2FnZSl7XG4gICAgbGV0IHtqb2luX3JlZiwgcmVmLCBldmVudCwgdG9waWMsIHBheWxvYWR9ID0gbWVzc2FnZVxuICAgIGxldCBtZXRhTGVuZ3RoID0gdGhpcy5NRVRBX0xFTkdUSCArIGpvaW5fcmVmLmxlbmd0aCArIHJlZi5sZW5ndGggKyB0b3BpYy5sZW5ndGggKyBldmVudC5sZW5ndGhcbiAgICBsZXQgaGVhZGVyID0gbmV3IEFycmF5QnVmZmVyKHRoaXMuSEVBREVSX0xFTkdUSCArIG1ldGFMZW5ndGgpXG4gICAgbGV0IHZpZXcgPSBuZXcgRGF0YVZpZXcoaGVhZGVyKVxuICAgIGxldCBvZmZzZXQgPSAwXG5cbiAgICB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCB0aGlzLktJTkRTLnB1c2gpIC8vIGtpbmRcbiAgICB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCBqb2luX3JlZi5sZW5ndGgpXG4gICAgdmlldy5zZXRVaW50OChvZmZzZXQrKywgcmVmLmxlbmd0aClcbiAgICB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCB0b3BpYy5sZW5ndGgpXG4gICAgdmlldy5zZXRVaW50OChvZmZzZXQrKywgZXZlbnQubGVuZ3RoKVxuICAgIEFycmF5LmZyb20oam9pbl9yZWYsIGNoYXIgPT4gdmlldy5zZXRVaW50OChvZmZzZXQrKywgY2hhci5jaGFyQ29kZUF0KDApKSlcbiAgICBBcnJheS5mcm9tKHJlZiwgY2hhciA9PiB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCBjaGFyLmNoYXJDb2RlQXQoMCkpKVxuICAgIEFycmF5LmZyb20odG9waWMsIGNoYXIgPT4gdmlldy5zZXRVaW50OChvZmZzZXQrKywgY2hhci5jaGFyQ29kZUF0KDApKSlcbiAgICBBcnJheS5mcm9tKGV2ZW50LCBjaGFyID0+IHZpZXcuc2V0VWludDgob2Zmc2V0KyssIGNoYXIuY2hhckNvZGVBdCgwKSkpXG5cbiAgICB2YXIgY29tYmluZWQgPSBuZXcgVWludDhBcnJheShoZWFkZXIuYnl0ZUxlbmd0aCArIHBheWxvYWQuYnl0ZUxlbmd0aClcbiAgICBjb21iaW5lZC5zZXQobmV3IFVpbnQ4QXJyYXkoaGVhZGVyKSwgMClcbiAgICBjb21iaW5lZC5zZXQobmV3IFVpbnQ4QXJyYXkocGF5bG9hZCksIGhlYWRlci5ieXRlTGVuZ3RoKVxuXG4gICAgcmV0dXJuIGNvbWJpbmVkLmJ1ZmZlclxuICB9LFxuXG4gIGJpbmFyeURlY29kZShidWZmZXIpe1xuICAgIGxldCB2aWV3ID0gbmV3IERhdGFWaWV3KGJ1ZmZlcilcbiAgICBsZXQga2luZCA9IHZpZXcuZ2V0VWludDgoMClcbiAgICBsZXQgZGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcigpXG4gICAgc3dpdGNoKGtpbmQpe1xuICAgICAgY2FzZSB0aGlzLktJTkRTLnB1c2g6IHJldHVybiB0aGlzLmRlY29kZVB1c2goYnVmZmVyLCB2aWV3LCBkZWNvZGVyKVxuICAgICAgY2FzZSB0aGlzLktJTkRTLnJlcGx5OiByZXR1cm4gdGhpcy5kZWNvZGVSZXBseShidWZmZXIsIHZpZXcsIGRlY29kZXIpXG4gICAgICBjYXNlIHRoaXMuS0lORFMuYnJvYWRjYXN0OiByZXR1cm4gdGhpcy5kZWNvZGVCcm9hZGNhc3QoYnVmZmVyLCB2aWV3LCBkZWNvZGVyKVxuICAgIH1cbiAgfSxcblxuICBkZWNvZGVQdXNoKGJ1ZmZlciwgdmlldywgZGVjb2Rlcil7XG4gICAgbGV0IGpvaW5SZWZTaXplID0gdmlldy5nZXRVaW50OCgxKVxuICAgIGxldCB0b3BpY1NpemUgPSB2aWV3LmdldFVpbnQ4KDIpXG4gICAgbGV0IGV2ZW50U2l6ZSA9IHZpZXcuZ2V0VWludDgoMylcbiAgICBsZXQgb2Zmc2V0ID0gdGhpcy5IRUFERVJfTEVOR1RIICsgdGhpcy5NRVRBX0xFTkdUSCAtIDEgLy8gcHVzaGVzIGhhdmUgbm8gcmVmXG4gICAgbGV0IGpvaW5SZWYgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBqb2luUmVmU2l6ZSkpXG4gICAgb2Zmc2V0ID0gb2Zmc2V0ICsgam9pblJlZlNpemVcbiAgICBsZXQgdG9waWMgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyB0b3BpY1NpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIHRvcGljU2l6ZVxuICAgIGxldCBldmVudCA9IGRlY29kZXIuZGVjb2RlKGJ1ZmZlci5zbGljZShvZmZzZXQsIG9mZnNldCArIGV2ZW50U2l6ZSkpXG4gICAgb2Zmc2V0ID0gb2Zmc2V0ICsgZXZlbnRTaXplXG4gICAgbGV0IGRhdGEgPSBidWZmZXIuc2xpY2Uob2Zmc2V0LCBidWZmZXIuYnl0ZUxlbmd0aClcbiAgICByZXR1cm4ge2pvaW5fcmVmOiBqb2luUmVmLCByZWY6IG51bGwsIHRvcGljOiB0b3BpYywgZXZlbnQ6IGV2ZW50LCBwYXlsb2FkOiBkYXRhfVxuICB9LFxuXG4gIGRlY29kZVJlcGx5KGJ1ZmZlciwgdmlldywgZGVjb2Rlcil7XG4gICAgbGV0IGpvaW5SZWZTaXplID0gdmlldy5nZXRVaW50OCgxKVxuICAgIGxldCByZWZTaXplID0gdmlldy5nZXRVaW50OCgyKVxuICAgIGxldCB0b3BpY1NpemUgPSB2aWV3LmdldFVpbnQ4KDMpXG4gICAgbGV0IGV2ZW50U2l6ZSA9IHZpZXcuZ2V0VWludDgoNClcbiAgICBsZXQgb2Zmc2V0ID0gdGhpcy5IRUFERVJfTEVOR1RIICsgdGhpcy5NRVRBX0xFTkdUSFxuICAgIGxldCBqb2luUmVmID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgam9pblJlZlNpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIGpvaW5SZWZTaXplXG4gICAgbGV0IHJlZiA9IGRlY29kZXIuZGVjb2RlKGJ1ZmZlci5zbGljZShvZmZzZXQsIG9mZnNldCArIHJlZlNpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIHJlZlNpemVcbiAgICBsZXQgdG9waWMgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyB0b3BpY1NpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIHRvcGljU2l6ZVxuICAgIGxldCBldmVudCA9IGRlY29kZXIuZGVjb2RlKGJ1ZmZlci5zbGljZShvZmZzZXQsIG9mZnNldCArIGV2ZW50U2l6ZSkpXG4gICAgb2Zmc2V0ID0gb2Zmc2V0ICsgZXZlbnRTaXplXG4gICAgbGV0IGRhdGEgPSBidWZmZXIuc2xpY2Uob2Zmc2V0LCBidWZmZXIuYnl0ZUxlbmd0aClcbiAgICBsZXQgcGF5bG9hZCA9IHtzdGF0dXM6IGV2ZW50LCByZXNwb25zZTogZGF0YX1cbiAgICByZXR1cm4ge2pvaW5fcmVmOiBqb2luUmVmLCByZWY6IHJlZiwgdG9waWM6IHRvcGljLCBldmVudDogQ0hBTk5FTF9FVkVOVFMucmVwbHksIHBheWxvYWQ6IHBheWxvYWR9XG4gIH0sXG5cbiAgZGVjb2RlQnJvYWRjYXN0KGJ1ZmZlciwgdmlldywgZGVjb2Rlcil7XG4gICAgbGV0IHRvcGljU2l6ZSA9IHZpZXcuZ2V0VWludDgoMSlcbiAgICBsZXQgZXZlbnRTaXplID0gdmlldy5nZXRVaW50OCgyKVxuICAgIGxldCBvZmZzZXQgPSB0aGlzLkhFQURFUl9MRU5HVEggKyAyXG4gICAgbGV0IHRvcGljID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgdG9waWNTaXplKSlcbiAgICBvZmZzZXQgPSBvZmZzZXQgKyB0b3BpY1NpemVcbiAgICBsZXQgZXZlbnQgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBldmVudFNpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIGV2ZW50U2l6ZVxuICAgIGxldCBkYXRhID0gYnVmZmVyLnNsaWNlKG9mZnNldCwgYnVmZmVyLmJ5dGVMZW5ndGgpXG5cbiAgICByZXR1cm4ge2pvaW5fcmVmOiBudWxsLCByZWY6IG51bGwsIHRvcGljOiB0b3BpYywgZXZlbnQ6IGV2ZW50LCBwYXlsb2FkOiBkYXRhfVxuICB9XG59XG4iLCAiaW1wb3J0IHtcbiAgZ2xvYmFsLFxuICBwaHhXaW5kb3csXG4gIENIQU5ORUxfRVZFTlRTLFxuICBERUZBVUxUX1RJTUVPVVQsXG4gIERFRkFVTFRfVlNOLFxuICBTT0NLRVRfU1RBVEVTLFxuICBUUkFOU1BPUlRTLFxuICBXU19DTE9TRV9OT1JNQUxcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IHtcbiAgY2xvc3VyZVxufSBmcm9tIFwiLi91dGlsc1wiXG5cbmltcG9ydCBBamF4IGZyb20gXCIuL2FqYXhcIlxuaW1wb3J0IENoYW5uZWwgZnJvbSBcIi4vY2hhbm5lbFwiXG5pbXBvcnQgTG9uZ1BvbGwgZnJvbSBcIi4vbG9uZ3BvbGxcIlxuaW1wb3J0IFNlcmlhbGl6ZXIgZnJvbSBcIi4vc2VyaWFsaXplclwiXG5pbXBvcnQgVGltZXIgZnJvbSBcIi4vdGltZXJcIlxuXG4vKiogSW5pdGlhbGl6ZXMgdGhlIFNvY2tldCAqXG4gKlxuICogRm9yIElFOCBzdXBwb3J0IHVzZSBhbiBFUzUtc2hpbSAoaHR0cHM6Ly9naXRodWIuY29tL2VzLXNoaW1zL2VzNS1zaGltKVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBlbmRQb2ludCAtIFRoZSBzdHJpbmcgV2ViU29ja2V0IGVuZHBvaW50LCBpZSwgYFwid3M6Ly9leGFtcGxlLmNvbS9zb2NrZXRcImAsXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYFwid3NzOi8vZXhhbXBsZS5jb21cImBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgXCIvc29ja2V0XCJgIChpbmhlcml0ZWQgaG9zdCAmIHByb3RvY29sKVxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRzXSAtIE9wdGlvbmFsIGNvbmZpZ3VyYXRpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLnRyYW5zcG9ydF0gLSBUaGUgV2Vic29ja2V0IFRyYW5zcG9ydCwgZm9yIGV4YW1wbGUgV2ViU29ja2V0IG9yIFBob2VuaXguTG9uZ1BvbGwuXG4gKlxuICogRGVmYXVsdHMgdG8gV2ViU29ja2V0IHdpdGggYXV0b21hdGljIExvbmdQb2xsIGZhbGxiYWNrLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdHMuZW5jb2RlXSAtIFRoZSBmdW5jdGlvbiB0byBlbmNvZGUgb3V0Z29pbmcgbWVzc2FnZXMuXG4gKlxuICogRGVmYXVsdHMgdG8gSlNPTiBlbmNvZGVyLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLmRlY29kZV0gLSBUaGUgZnVuY3Rpb24gdG8gZGVjb2RlIGluY29taW5nIG1lc3NhZ2VzLlxuICpcbiAqIERlZmF1bHRzIHRvIEpTT046XG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogKHBheWxvYWQsIGNhbGxiYWNrKSA9PiBjYWxsYmFjayhKU09OLnBhcnNlKHBheWxvYWQpKVxuICogYGBgXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLnRpbWVvdXRdIC0gVGhlIGRlZmF1bHQgdGltZW91dCBpbiBtaWxsaXNlY29uZHMgdG8gdHJpZ2dlciBwdXNoIHRpbWVvdXRzLlxuICpcbiAqIERlZmF1bHRzIGBERUZBVUxUX1RJTUVPVVRgXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdHMuaGVhcnRiZWF0SW50ZXJ2YWxNc10gLSBUaGUgbWlsbGlzZWMgaW50ZXJ2YWwgdG8gc2VuZCBhIGhlYXJ0YmVhdCBtZXNzYWdlXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdHMucmVjb25uZWN0QWZ0ZXJNc10gLSBUaGUgb3B0aW9uYWwgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBtaWxsc2VjXG4gKiBzb2NrZXQgcmVjb25uZWN0IGludGVydmFsLlxuICpcbiAqIERlZmF1bHRzIHRvIHN0ZXBwZWQgYmFja29mZiBvZjpcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBmdW5jdGlvbih0cmllcyl7XG4gKiAgIHJldHVybiBbMTAsIDUwLCAxMDAsIDE1MCwgMjAwLCAyNTAsIDUwMCwgMTAwMCwgMjAwMF1bdHJpZXMgLSAxXSB8fCA1MDAwXG4gKiB9XG4gKiBgYGBgXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLnJlam9pbkFmdGVyTXNdIC0gVGhlIG9wdGlvbmFsIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgbWlsbHNlY1xuICogcmVqb2luIGludGVydmFsIGZvciBpbmRpdmlkdWFsIGNoYW5uZWxzLlxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGZ1bmN0aW9uKHRyaWVzKXtcbiAqICAgcmV0dXJuIFsxMDAwLCAyMDAwLCA1MDAwXVt0cmllcyAtIDFdIHx8IDEwMDAwXG4gKiB9XG4gKiBgYGBgXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdHMubG9nZ2VyXSAtIFRoZSBvcHRpb25hbCBmdW5jdGlvbiBmb3Igc3BlY2lhbGl6ZWQgbG9nZ2luZywgaWU6XG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogZnVuY3Rpb24oa2luZCwgbXNnLCBkYXRhKSB7XG4gKiAgIGNvbnNvbGUubG9nKGAke2tpbmR9OiAke21zZ31gLCBkYXRhKVxuICogfVxuICogYGBgXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLmxvbmdwb2xsZXJUaW1lb3V0XSAtIFRoZSBtYXhpbXVtIHRpbWVvdXQgb2YgYSBsb25nIHBvbGwgQUpBWCByZXF1ZXN0LlxuICpcbiAqIERlZmF1bHRzIHRvIDIwcyAoZG91YmxlIHRoZSBzZXJ2ZXIgbG9uZyBwb2xsIHRpbWVyKS5cbiAqXG4gKiBAcGFyYW0geyhPYmplY3R8ZnVuY3Rpb24pfSBbb3B0cy5wYXJhbXNdIC0gVGhlIG9wdGlvbmFsIHBhcmFtcyB0byBwYXNzIHdoZW4gY29ubmVjdGluZ1xuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRzLmJpbmFyeVR5cGVdIC0gVGhlIGJpbmFyeSB0eXBlIHRvIHVzZSBmb3IgYmluYXJ5IFdlYlNvY2tldCBmcmFtZXMuXG4gKlxuICogRGVmYXVsdHMgdG8gXCJhcnJheWJ1ZmZlclwiXG4gKlxuICogQHBhcmFtIHt2c259IFtvcHRzLnZzbl0gLSBUaGUgc2VyaWFsaXplcidzIHByb3RvY29sIHZlcnNpb24gdG8gc2VuZCBvbiBjb25uZWN0LlxuICpcbiAqIERlZmF1bHRzIHRvIERFRkFVTFRfVlNOLlxuKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvY2tldCB7XG4gIGNvbnN0cnVjdG9yKGVuZFBvaW50LCBvcHRzID0ge30pe1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3MgPSB7b3BlbjogW10sIGNsb3NlOiBbXSwgZXJyb3I6IFtdLCBtZXNzYWdlOiBbXX1cbiAgICB0aGlzLmNoYW5uZWxzID0gW11cbiAgICB0aGlzLnNlbmRCdWZmZXIgPSBbXVxuICAgIHRoaXMucmVmID0gMFxuICAgIHRoaXMudGltZW91dCA9IG9wdHMudGltZW91dCB8fCBERUZBVUxUX1RJTUVPVVRcbiAgICB0aGlzLnRyYW5zcG9ydCA9IG9wdHMudHJhbnNwb3J0IHx8IGdsb2JhbC5XZWJTb2NrZXQgfHwgTG9uZ1BvbGxcbiAgICB0aGlzLmVzdGFibGlzaGVkQ29ubmVjdGlvbnMgPSAwXG4gICAgdGhpcy5kZWZhdWx0RW5jb2RlciA9IFNlcmlhbGl6ZXIuZW5jb2RlLmJpbmQoU2VyaWFsaXplcilcbiAgICB0aGlzLmRlZmF1bHREZWNvZGVyID0gU2VyaWFsaXplci5kZWNvZGUuYmluZChTZXJpYWxpemVyKVxuICAgIHRoaXMuY2xvc2VXYXNDbGVhbiA9IGZhbHNlXG4gICAgdGhpcy5iaW5hcnlUeXBlID0gb3B0cy5iaW5hcnlUeXBlIHx8IFwiYXJyYXlidWZmZXJcIlxuICAgIHRoaXMuY29ubmVjdENsb2NrID0gMVxuICAgIGlmKHRoaXMudHJhbnNwb3J0ICE9PSBMb25nUG9sbCl7XG4gICAgICB0aGlzLmVuY29kZSA9IG9wdHMuZW5jb2RlIHx8IHRoaXMuZGVmYXVsdEVuY29kZXJcbiAgICAgIHRoaXMuZGVjb2RlID0gb3B0cy5kZWNvZGUgfHwgdGhpcy5kZWZhdWx0RGVjb2RlclxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVuY29kZSA9IHRoaXMuZGVmYXVsdEVuY29kZXJcbiAgICAgIHRoaXMuZGVjb2RlID0gdGhpcy5kZWZhdWx0RGVjb2RlclxuICAgIH1cbiAgICBsZXQgYXdhaXRpbmdDb25uZWN0aW9uT25QYWdlU2hvdyA9IG51bGxcbiAgICBpZihwaHhXaW5kb3cgJiYgcGh4V2luZG93LmFkZEV2ZW50TGlzdGVuZXIpe1xuICAgICAgcGh4V2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwYWdlaGlkZVwiLCBfZSA9PiB7XG4gICAgICAgIGlmKHRoaXMuY29ubil7XG4gICAgICAgICAgdGhpcy5kaXNjb25uZWN0KClcbiAgICAgICAgICBhd2FpdGluZ0Nvbm5lY3Rpb25PblBhZ2VTaG93ID0gdGhpcy5jb25uZWN0Q2xvY2tcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHBoeFdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGFnZXNob3dcIiwgX2UgPT4ge1xuICAgICAgICBpZihhd2FpdGluZ0Nvbm5lY3Rpb25PblBhZ2VTaG93ID09PSB0aGlzLmNvbm5lY3RDbG9jayl7XG4gICAgICAgICAgYXdhaXRpbmdDb25uZWN0aW9uT25QYWdlU2hvdyA9IG51bGxcbiAgICAgICAgICB0aGlzLmNvbm5lY3QoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgICB0aGlzLmhlYXJ0YmVhdEludGVydmFsTXMgPSBvcHRzLmhlYXJ0YmVhdEludGVydmFsTXMgfHwgMzAwMDBcbiAgICB0aGlzLnJlam9pbkFmdGVyTXMgPSAodHJpZXMpID0+IHtcbiAgICAgIGlmKG9wdHMucmVqb2luQWZ0ZXJNcyl7XG4gICAgICAgIHJldHVybiBvcHRzLnJlam9pbkFmdGVyTXModHJpZXMpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gWzEwMDAsIDIwMDAsIDUwMDBdW3RyaWVzIC0gMV0gfHwgMTAwMDBcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5yZWNvbm5lY3RBZnRlck1zID0gKHRyaWVzKSA9PiB7XG4gICAgICBpZihvcHRzLnJlY29ubmVjdEFmdGVyTXMpe1xuICAgICAgICByZXR1cm4gb3B0cy5yZWNvbm5lY3RBZnRlck1zKHRyaWVzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFsxMCwgNTAsIDEwMCwgMTUwLCAyMDAsIDI1MCwgNTAwLCAxMDAwLCAyMDAwXVt0cmllcyAtIDFdIHx8IDUwMDBcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5sb2dnZXIgPSBvcHRzLmxvZ2dlciB8fCBudWxsXG4gICAgdGhpcy5sb25ncG9sbGVyVGltZW91dCA9IG9wdHMubG9uZ3BvbGxlclRpbWVvdXQgfHwgMjAwMDBcbiAgICB0aGlzLnBhcmFtcyA9IGNsb3N1cmUob3B0cy5wYXJhbXMgfHwge30pXG4gICAgdGhpcy5lbmRQb2ludCA9IGAke2VuZFBvaW50fS8ke1RSQU5TUE9SVFMud2Vic29ja2V0fWBcbiAgICB0aGlzLnZzbiA9IG9wdHMudnNuIHx8IERFRkFVTFRfVlNOXG4gICAgdGhpcy5oZWFydGJlYXRUaW1lciA9IG51bGxcbiAgICB0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYgPSBudWxsXG4gICAgdGhpcy5yZWNvbm5lY3RUaW1lciA9IG5ldyBUaW1lcigoKSA9PiB7XG4gICAgICB0aGlzLnRlYXJkb3duKCgpID0+IHRoaXMuY29ubmVjdCgpKVxuICAgIH0sIHRoaXMucmVjb25uZWN0QWZ0ZXJNcylcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNjb25uZWN0cyBhbmQgcmVwbGFjZXMgdGhlIGFjdGl2ZSB0cmFuc3BvcnRcbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gbmV3VHJhbnNwb3J0IC0gVGhlIG5ldyB0cmFuc3BvcnQgY2xhc3MgdG8gaW5zdGFudGlhdGVcbiAgICpcbiAgICovXG4gIHJlcGxhY2VUcmFuc3BvcnQobmV3VHJhbnNwb3J0KXtcbiAgICB0aGlzLmRpc2Nvbm5lY3QoKVxuICAgIHRoaXMudHJhbnNwb3J0ID0gbmV3VHJhbnNwb3J0XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgc29ja2V0IHByb3RvY29sXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBwcm90b2NvbCgpeyByZXR1cm4gbG9jYXRpb24ucHJvdG9jb2wubWF0Y2goL15odHRwcy8pID8gXCJ3c3NcIiA6IFwid3NcIiB9XG5cbiAgLyoqXG4gICAqIFRoZSBmdWxseSBxdWFsaWZlZCBzb2NrZXQgdXJsXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBlbmRQb2ludFVSTCgpe1xuICAgIGxldCB1cmkgPSBBamF4LmFwcGVuZFBhcmFtcyhcbiAgICAgIEFqYXguYXBwZW5kUGFyYW1zKHRoaXMuZW5kUG9pbnQsIHRoaXMucGFyYW1zKCkpLCB7dnNuOiB0aGlzLnZzbn0pXG4gICAgaWYodXJpLmNoYXJBdCgwKSAhPT0gXCIvXCIpeyByZXR1cm4gdXJpIH1cbiAgICBpZih1cmkuY2hhckF0KDEpID09PSBcIi9cIil7IHJldHVybiBgJHt0aGlzLnByb3RvY29sKCl9OiR7dXJpfWAgfVxuXG4gICAgcmV0dXJuIGAke3RoaXMucHJvdG9jb2woKX06Ly8ke2xvY2F0aW9uLmhvc3R9JHt1cml9YFxuICB9XG5cbiAgLyoqXG4gICAqIERpc2Nvbm5lY3RzIHRoZSBzb2NrZXRcbiAgICpcbiAgICogU2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9DbG9zZUV2ZW50I1N0YXR1c19jb2RlcyBmb3IgdmFsaWQgc3RhdHVzIGNvZGVzLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIE9wdGlvbmFsIGNhbGxiYWNrIHdoaWNoIGlzIGNhbGxlZCBhZnRlciBzb2NrZXQgaXMgZGlzY29ubmVjdGVkLlxuICAgKiBAcGFyYW0ge2ludGVnZXJ9IGNvZGUgLSBBIHN0YXR1cyBjb2RlIGZvciBkaXNjb25uZWN0aW9uIChPcHRpb25hbCkuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZWFzb24gLSBBIHRleHR1YWwgZGVzY3JpcHRpb24gb2YgdGhlIHJlYXNvbiB0byBkaXNjb25uZWN0LiAoT3B0aW9uYWwpXG4gICAqL1xuICBkaXNjb25uZWN0KGNhbGxiYWNrLCBjb2RlLCByZWFzb24pe1xuICAgIHRoaXMuY29ubmVjdENsb2NrKytcbiAgICB0aGlzLmNsb3NlV2FzQ2xlYW4gPSB0cnVlXG4gICAgdGhpcy5yZWNvbm5lY3RUaW1lci5yZXNldCgpXG4gICAgdGhpcy50ZWFyZG93bihjYWxsYmFjaywgY29kZSwgcmVhc29uKVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgLSBUaGUgcGFyYW1zIHRvIHNlbmQgd2hlbiBjb25uZWN0aW5nLCBmb3IgZXhhbXBsZSBge3VzZXJfaWQ6IHVzZXJUb2tlbn1gXG4gICAqXG4gICAqIFBhc3NpbmcgcGFyYW1zIHRvIGNvbm5lY3QgaXMgZGVwcmVjYXRlZDsgcGFzcyB0aGVtIGluIHRoZSBTb2NrZXQgY29uc3RydWN0b3IgaW5zdGVhZDpcbiAgICogYG5ldyBTb2NrZXQoXCIvc29ja2V0XCIsIHtwYXJhbXM6IHt1c2VyX2lkOiB1c2VyVG9rZW59fSlgLlxuICAgKi9cbiAgY29ubmVjdChwYXJhbXMpe1xuICAgIHRoaXMuY29ubmVjdENsb2NrKytcbiAgICBpZihwYXJhbXMpe1xuICAgICAgY29uc29sZSAmJiBjb25zb2xlLmxvZyhcInBhc3NpbmcgcGFyYW1zIHRvIGNvbm5lY3QgaXMgZGVwcmVjYXRlZC4gSW5zdGVhZCBwYXNzIDpwYXJhbXMgdG8gdGhlIFNvY2tldCBjb25zdHJ1Y3RvclwiKVxuICAgICAgdGhpcy5wYXJhbXMgPSBjbG9zdXJlKHBhcmFtcylcbiAgICB9XG4gICAgaWYodGhpcy5jb25uKXsgcmV0dXJuIH1cbiAgICB0aGlzLmNsb3NlV2FzQ2xlYW4gPSBmYWxzZVxuICAgIHRoaXMuY29ubiA9IG5ldyB0aGlzLnRyYW5zcG9ydCh0aGlzLmVuZFBvaW50VVJMKCkpXG4gICAgdGhpcy5jb25uLmJpbmFyeVR5cGUgPSB0aGlzLmJpbmFyeVR5cGVcbiAgICB0aGlzLmNvbm4udGltZW91dCA9IHRoaXMubG9uZ3BvbGxlclRpbWVvdXRcbiAgICB0aGlzLmNvbm4ub25vcGVuID0gKCkgPT4gdGhpcy5vbkNvbm5PcGVuKClcbiAgICB0aGlzLmNvbm4ub25lcnJvciA9IGVycm9yID0+IHRoaXMub25Db25uRXJyb3IoZXJyb3IpXG4gICAgdGhpcy5jb25uLm9ubWVzc2FnZSA9IGV2ZW50ID0+IHRoaXMub25Db25uTWVzc2FnZShldmVudClcbiAgICB0aGlzLmNvbm4ub25jbG9zZSA9IGV2ZW50ID0+IHRoaXMub25Db25uQ2xvc2UoZXZlbnQpXG4gIH1cblxuICAvKipcbiAgICogTG9ncyB0aGUgbWVzc2FnZS4gT3ZlcnJpZGUgYHRoaXMubG9nZ2VyYCBmb3Igc3BlY2lhbGl6ZWQgbG9nZ2luZy4gbm9vcHMgYnkgZGVmYXVsdFxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2luZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gbXNnXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAqL1xuICBsb2coa2luZCwgbXNnLCBkYXRhKXsgdGhpcy5sb2dnZXIoa2luZCwgbXNnLCBkYXRhKSB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiBhIGxvZ2dlciBoYXMgYmVlbiBzZXQgb24gdGhpcyBzb2NrZXQuXG4gICAqL1xuICBoYXNMb2dnZXIoKXsgcmV0dXJuIHRoaXMubG9nZ2VyICE9PSBudWxsIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGNhbGxiYWNrcyBmb3IgY29ubmVjdGlvbiBvcGVuIGV2ZW50c1xuICAgKlxuICAgKiBAZXhhbXBsZSBzb2NrZXQub25PcGVuKGZ1bmN0aW9uKCl7IGNvbnNvbGUuaW5mbyhcInRoZSBzb2NrZXQgd2FzIG9wZW5lZFwiKSB9KVxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgb25PcGVuKGNhbGxiYWNrKXtcbiAgICBsZXQgcmVmID0gdGhpcy5tYWtlUmVmKClcbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLm9wZW4ucHVzaChbcmVmLCBjYWxsYmFja10pXG4gICAgcmV0dXJuIHJlZlxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBjYWxsYmFja3MgZm9yIGNvbm5lY3Rpb24gY2xvc2UgZXZlbnRzXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBvbkNsb3NlKGNhbGxiYWNrKXtcbiAgICBsZXQgcmVmID0gdGhpcy5tYWtlUmVmKClcbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLmNsb3NlLnB1c2goW3JlZiwgY2FsbGJhY2tdKVxuICAgIHJldHVybiByZWZcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgY2FsbGJhY2tzIGZvciBjb25uZWN0aW9uIGVycm9yIGV2ZW50c1xuICAgKlxuICAgKiBAZXhhbXBsZSBzb2NrZXQub25FcnJvcihmdW5jdGlvbihlcnJvcil7IGFsZXJ0KFwiQW4gZXJyb3Igb2NjdXJyZWRcIikgfSlcbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIG9uRXJyb3IoY2FsbGJhY2spe1xuICAgIGxldCByZWYgPSB0aGlzLm1ha2VSZWYoKVxuICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3MuZXJyb3IucHVzaChbcmVmLCBjYWxsYmFja10pXG4gICAgcmV0dXJuIHJlZlxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBjYWxsYmFja3MgZm9yIGNvbm5lY3Rpb24gbWVzc2FnZSBldmVudHNcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIG9uTWVzc2FnZShjYWxsYmFjayl7XG4gICAgbGV0IHJlZiA9IHRoaXMubWFrZVJlZigpXG4gICAgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcy5tZXNzYWdlLnB1c2goW3JlZiwgY2FsbGJhY2tdKVxuICAgIHJldHVybiByZWZcbiAgfVxuXG4gIC8qKlxuICAgKiBQaW5ncyB0aGUgc2VydmVyIGFuZCBpbnZva2VzIHRoZSBjYWxsYmFjayB3aXRoIHRoZSBSVFQgaW4gbWlsbGlzZWNvbmRzXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgcGluZyB3YXMgcHVzaGVkIG9yIGZhbHNlIGlmIHVuYWJsZSB0byBiZSBwdXNoZWQuXG4gICAqL1xuICBwaW5nKGNhbGxiYWNrKXtcbiAgICBpZighdGhpcy5pc0Nvbm5lY3RlZCgpKXsgcmV0dXJuIGZhbHNlIH1cbiAgICBsZXQgcmVmID0gdGhpcy5tYWtlUmVmKClcbiAgICBsZXQgc3RhcnRUaW1lID0gRGF0ZS5ub3coKVxuICAgIHRoaXMucHVzaCh7dG9waWM6IFwicGhvZW5peFwiLCBldmVudDogXCJoZWFydGJlYXRcIiwgcGF5bG9hZDoge30sIHJlZjogcmVmfSlcbiAgICBsZXQgb25Nc2dSZWYgPSB0aGlzLm9uTWVzc2FnZShtc2cgPT4ge1xuICAgICAgaWYobXNnLnJlZiA9PT0gcmVmKXtcbiAgICAgICAgdGhpcy5vZmYoW29uTXNnUmVmXSlcbiAgICAgICAgY2FsbGJhY2soRGF0ZS5ub3coKSAtIHN0YXJ0VGltZSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIG9uQ29ubk9wZW4oKXtcbiAgICBpZih0aGlzLmhhc0xvZ2dlcigpKSB0aGlzLmxvZyhcInRyYW5zcG9ydFwiLCBgY29ubmVjdGVkIHRvICR7dGhpcy5lbmRQb2ludFVSTCgpfWApXG4gICAgdGhpcy5jbG9zZVdhc0NsZWFuID0gZmFsc2VcbiAgICB0aGlzLmVzdGFibGlzaGVkQ29ubmVjdGlvbnMrK1xuICAgIHRoaXMuZmx1c2hTZW5kQnVmZmVyKClcbiAgICB0aGlzLnJlY29ubmVjdFRpbWVyLnJlc2V0KClcbiAgICB0aGlzLnJlc2V0SGVhcnRiZWF0KClcbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLm9wZW4uZm9yRWFjaCgoWywgY2FsbGJhY2tdKSA9PiBjYWxsYmFjaygpKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuXG4gIGhlYXJ0YmVhdFRpbWVvdXQoKXtcbiAgICBpZih0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYpe1xuICAgICAgdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmID0gbnVsbFxuICAgICAgaWYodGhpcy5oYXNMb2dnZXIoKSl7IHRoaXMubG9nKFwidHJhbnNwb3J0XCIsIFwiaGVhcnRiZWF0IHRpbWVvdXQuIEF0dGVtcHRpbmcgdG8gcmUtZXN0YWJsaXNoIGNvbm5lY3Rpb25cIikgfVxuICAgICAgdGhpcy5hYm5vcm1hbENsb3NlKFwiaGVhcnRiZWF0IHRpbWVvdXRcIilcbiAgICB9XG4gIH1cblxuICByZXNldEhlYXJ0YmVhdCgpe1xuICAgIGlmKHRoaXMuY29ubiAmJiB0aGlzLmNvbm4uc2tpcEhlYXJ0YmVhdCl7IHJldHVybiB9XG4gICAgdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmID0gbnVsbFxuICAgIGNsZWFyVGltZW91dCh0aGlzLmhlYXJ0YmVhdFRpbWVyKVxuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zZW5kSGVhcnRiZWF0KCksIHRoaXMuaGVhcnRiZWF0SW50ZXJ2YWxNcylcbiAgfVxuXG4gIHRlYXJkb3duKGNhbGxiYWNrLCBjb2RlLCByZWFzb24pe1xuICAgIGlmKCF0aGlzLmNvbm4pe1xuICAgICAgcmV0dXJuIGNhbGxiYWNrICYmIGNhbGxiYWNrKClcbiAgICB9XG5cbiAgICB0aGlzLndhaXRGb3JCdWZmZXJEb25lKCgpID0+IHtcbiAgICAgIGlmKHRoaXMuY29ubil7XG4gICAgICAgIGlmKGNvZGUpeyB0aGlzLmNvbm4uY2xvc2UoY29kZSwgcmVhc29uIHx8IFwiXCIpIH0gZWxzZSB7IHRoaXMuY29ubi5jbG9zZSgpIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy53YWl0Rm9yU29ja2V0Q2xvc2VkKCgpID0+IHtcbiAgICAgICAgaWYodGhpcy5jb25uKXtcbiAgICAgICAgICB0aGlzLmNvbm4ub25jbG9zZSA9IGZ1bmN0aW9uICgpeyB9IC8vIG5vb3BcbiAgICAgICAgICB0aGlzLmNvbm4gPSBudWxsXG4gICAgICAgIH1cblxuICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICB3YWl0Rm9yQnVmZmVyRG9uZShjYWxsYmFjaywgdHJpZXMgPSAxKXtcbiAgICBpZih0cmllcyA9PT0gNSB8fCAhdGhpcy5jb25uIHx8ICF0aGlzLmNvbm4uYnVmZmVyZWRBbW91bnQpe1xuICAgICAgY2FsbGJhY2soKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLndhaXRGb3JCdWZmZXJEb25lKGNhbGxiYWNrLCB0cmllcyArIDEpXG4gICAgfSwgMTUwICogdHJpZXMpXG4gIH1cblxuICB3YWl0Rm9yU29ja2V0Q2xvc2VkKGNhbGxiYWNrLCB0cmllcyA9IDEpe1xuICAgIGlmKHRyaWVzID09PSA1IHx8ICF0aGlzLmNvbm4gfHwgdGhpcy5jb25uLnJlYWR5U3RhdGUgPT09IFNPQ0tFVF9TVEFURVMuY2xvc2VkKXtcbiAgICAgIGNhbGxiYWNrKClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy53YWl0Rm9yU29ja2V0Q2xvc2VkKGNhbGxiYWNrLCB0cmllcyArIDEpXG4gICAgfSwgMTUwICogdHJpZXMpXG4gIH1cblxuICBvbkNvbm5DbG9zZShldmVudCl7XG4gICAgbGV0IGNsb3NlQ29kZSA9IGV2ZW50ICYmIGV2ZW50LmNvZGVcbiAgICBpZih0aGlzLmhhc0xvZ2dlcigpKSB0aGlzLmxvZyhcInRyYW5zcG9ydFwiLCBcImNsb3NlXCIsIGV2ZW50KVxuICAgIHRoaXMudHJpZ2dlckNoYW5FcnJvcigpXG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuaGVhcnRiZWF0VGltZXIpXG4gICAgaWYoIXRoaXMuY2xvc2VXYXNDbGVhbiAmJiBjbG9zZUNvZGUgIT09IDEwMDApe1xuICAgICAgdGhpcy5yZWNvbm5lY3RUaW1lci5zY2hlZHVsZVRpbWVvdXQoKVxuICAgIH1cbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLmNsb3NlLmZvckVhY2goKFssIGNhbGxiYWNrXSkgPT4gY2FsbGJhY2soZXZlbnQpKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBvbkNvbm5FcnJvcihlcnJvcil7XG4gICAgaWYodGhpcy5oYXNMb2dnZXIoKSkgdGhpcy5sb2coXCJ0cmFuc3BvcnRcIiwgZXJyb3IpXG4gICAgbGV0IHRyYW5zcG9ydEJlZm9yZSA9IHRoaXMudHJhbnNwb3J0XG4gICAgbGV0IGVzdGFibGlzaGVkQmVmb3JlID0gdGhpcy5lc3RhYmxpc2hlZENvbm5lY3Rpb25zXG4gICAgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcy5lcnJvci5mb3JFYWNoKChbLCBjYWxsYmFja10pID0+IHtcbiAgICAgIGNhbGxiYWNrKGVycm9yLCB0cmFuc3BvcnRCZWZvcmUsIGVzdGFibGlzaGVkQmVmb3JlKVxuICAgIH0pXG4gICAgaWYodHJhbnNwb3J0QmVmb3JlID09PSB0aGlzLnRyYW5zcG9ydCB8fCBlc3RhYmxpc2hlZEJlZm9yZSA+IDApe1xuICAgICAgdGhpcy50cmlnZ2VyQ2hhbkVycm9yKClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHRyaWdnZXJDaGFuRXJyb3IoKXtcbiAgICB0aGlzLmNoYW5uZWxzLmZvckVhY2goY2hhbm5lbCA9PiB7XG4gICAgICBpZighKGNoYW5uZWwuaXNFcnJvcmVkKCkgfHwgY2hhbm5lbC5pc0xlYXZpbmcoKSB8fCBjaGFubmVsLmlzQ2xvc2VkKCkpKXtcbiAgICAgICAgY2hhbm5lbC50cmlnZ2VyKENIQU5ORUxfRVZFTlRTLmVycm9yKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIGNvbm5lY3Rpb25TdGF0ZSgpe1xuICAgIHN3aXRjaCh0aGlzLmNvbm4gJiYgdGhpcy5jb25uLnJlYWR5U3RhdGUpe1xuICAgICAgY2FzZSBTT0NLRVRfU1RBVEVTLmNvbm5lY3Rpbmc6IHJldHVybiBcImNvbm5lY3RpbmdcIlxuICAgICAgY2FzZSBTT0NLRVRfU1RBVEVTLm9wZW46IHJldHVybiBcIm9wZW5cIlxuICAgICAgY2FzZSBTT0NLRVRfU1RBVEVTLmNsb3Npbmc6IHJldHVybiBcImNsb3NpbmdcIlxuICAgICAgZGVmYXVsdDogcmV0dXJuIFwiY2xvc2VkXCJcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBpc0Nvbm5lY3RlZCgpeyByZXR1cm4gdGhpcy5jb25uZWN0aW9uU3RhdGUoKSA9PT0gXCJvcGVuXCIgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge0NoYW5uZWx9XG4gICAqL1xuICByZW1vdmUoY2hhbm5lbCl7XG4gICAgdGhpcy5vZmYoY2hhbm5lbC5zdGF0ZUNoYW5nZVJlZnMpXG4gICAgdGhpcy5jaGFubmVscyA9IHRoaXMuY2hhbm5lbHMuZmlsdGVyKGMgPT4gYy5qb2luUmVmKCkgIT09IGNoYW5uZWwuam9pblJlZigpKVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYG9uT3BlbmAsIGBvbkNsb3NlYCwgYG9uRXJyb3IsYCBhbmQgYG9uTWVzc2FnZWAgcmVnaXN0cmF0aW9ucy5cbiAgICpcbiAgICogQHBhcmFtIHtyZWZzfSAtIGxpc3Qgb2YgcmVmcyByZXR1cm5lZCBieSBjYWxscyB0b1xuICAgKiAgICAgICAgICAgICAgICAgYG9uT3BlbmAsIGBvbkNsb3NlYCwgYG9uRXJyb3IsYCBhbmQgYG9uTWVzc2FnZWBcbiAgICovXG4gIG9mZihyZWZzKXtcbiAgICBmb3IobGV0IGtleSBpbiB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzKXtcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3Nba2V5XSA9IHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3Nba2V5XS5maWx0ZXIoKFtyZWZdKSA9PiB7XG4gICAgICAgIHJldHVybiByZWZzLmluZGV4T2YocmVmKSA9PT0gLTFcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYXRlcyBhIG5ldyBjaGFubmVsIGZvciB0aGUgZ2l2ZW4gdG9waWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvcGljXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjaGFuUGFyYW1zIC0gUGFyYW1ldGVycyBmb3IgdGhlIGNoYW5uZWxcbiAgICogQHJldHVybnMge0NoYW5uZWx9XG4gICAqL1xuICBjaGFubmVsKHRvcGljLCBjaGFuUGFyYW1zID0ge30pe1xuICAgIGxldCBjaGFuID0gbmV3IENoYW5uZWwodG9waWMsIGNoYW5QYXJhbXMsIHRoaXMpXG4gICAgdGhpcy5jaGFubmVscy5wdXNoKGNoYW4pXG4gICAgcmV0dXJuIGNoYW5cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgKi9cbiAgcHVzaChkYXRhKXtcbiAgICBpZih0aGlzLmhhc0xvZ2dlcigpKXtcbiAgICAgIGxldCB7dG9waWMsIGV2ZW50LCBwYXlsb2FkLCByZWYsIGpvaW5fcmVmfSA9IGRhdGFcbiAgICAgIHRoaXMubG9nKFwicHVzaFwiLCBgJHt0b3BpY30gJHtldmVudH0gKCR7am9pbl9yZWZ9LCAke3JlZn0pYCwgcGF5bG9hZClcbiAgICB9XG5cbiAgICBpZih0aGlzLmlzQ29ubmVjdGVkKCkpe1xuICAgICAgdGhpcy5lbmNvZGUoZGF0YSwgcmVzdWx0ID0+IHRoaXMuY29ubi5zZW5kKHJlc3VsdCkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2VuZEJ1ZmZlci5wdXNoKCgpID0+IHRoaXMuZW5jb2RlKGRhdGEsIHJlc3VsdCA9PiB0aGlzLmNvbm4uc2VuZChyZXN1bHQpKSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBuZXh0IG1lc3NhZ2UgcmVmLCBhY2NvdW50aW5nIGZvciBvdmVyZmxvd3NcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIG1ha2VSZWYoKXtcbiAgICBsZXQgbmV3UmVmID0gdGhpcy5yZWYgKyAxXG4gICAgaWYobmV3UmVmID09PSB0aGlzLnJlZil7IHRoaXMucmVmID0gMCB9IGVsc2UgeyB0aGlzLnJlZiA9IG5ld1JlZiB9XG5cbiAgICByZXR1cm4gdGhpcy5yZWYudG9TdHJpbmcoKVxuICB9XG5cbiAgc2VuZEhlYXJ0YmVhdCgpe1xuICAgIGlmKHRoaXMucGVuZGluZ0hlYXJ0YmVhdFJlZiAmJiAhdGhpcy5pc0Nvbm5lY3RlZCgpKXsgcmV0dXJuIH1cbiAgICB0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYgPSB0aGlzLm1ha2VSZWYoKVxuICAgIHRoaXMucHVzaCh7dG9waWM6IFwicGhvZW5peFwiLCBldmVudDogXCJoZWFydGJlYXRcIiwgcGF5bG9hZDoge30sIHJlZjogdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmfSlcbiAgICB0aGlzLmhlYXJ0YmVhdFRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLmhlYXJ0YmVhdFRpbWVvdXQoKSwgdGhpcy5oZWFydGJlYXRJbnRlcnZhbE1zKVxuICB9XG5cbiAgYWJub3JtYWxDbG9zZShyZWFzb24pe1xuICAgIHRoaXMuY2xvc2VXYXNDbGVhbiA9IGZhbHNlXG4gICAgaWYodGhpcy5pc0Nvbm5lY3RlZCgpKXsgdGhpcy5jb25uLmNsb3NlKFdTX0NMT1NFX05PUk1BTCwgcmVhc29uKSB9XG4gIH1cblxuICBmbHVzaFNlbmRCdWZmZXIoKXtcbiAgICBpZih0aGlzLmlzQ29ubmVjdGVkKCkgJiYgdGhpcy5zZW5kQnVmZmVyLmxlbmd0aCA+IDApe1xuICAgICAgdGhpcy5zZW5kQnVmZmVyLmZvckVhY2goY2FsbGJhY2sgPT4gY2FsbGJhY2soKSlcbiAgICAgIHRoaXMuc2VuZEJ1ZmZlciA9IFtdXG4gICAgfVxuICB9XG5cbiAgb25Db25uTWVzc2FnZShyYXdNZXNzYWdlKXtcbiAgICB0aGlzLmRlY29kZShyYXdNZXNzYWdlLmRhdGEsIG1zZyA9PiB7XG4gICAgICBsZXQge3RvcGljLCBldmVudCwgcGF5bG9hZCwgcmVmLCBqb2luX3JlZn0gPSBtc2dcbiAgICAgIGlmKHJlZiAmJiByZWYgPT09IHRoaXMucGVuZGluZ0hlYXJ0YmVhdFJlZil7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmhlYXJ0YmVhdFRpbWVyKVxuICAgICAgICB0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYgPSBudWxsXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zZW5kSGVhcnRiZWF0KCksIHRoaXMuaGVhcnRiZWF0SW50ZXJ2YWxNcylcbiAgICAgIH1cblxuICAgICAgaWYodGhpcy5oYXNMb2dnZXIoKSkgdGhpcy5sb2coXCJyZWNlaXZlXCIsIGAke3BheWxvYWQuc3RhdHVzIHx8IFwiXCJ9ICR7dG9waWN9ICR7ZXZlbnR9ICR7cmVmICYmIFwiKFwiICsgcmVmICsgXCIpXCIgfHwgXCJcIn1gLCBwYXlsb2FkKVxuXG4gICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGFubmVscy5sZW5ndGg7IGkrKyl7XG4gICAgICAgIGNvbnN0IGNoYW5uZWwgPSB0aGlzLmNoYW5uZWxzW2ldXG4gICAgICAgIGlmKCFjaGFubmVsLmlzTWVtYmVyKHRvcGljLCBldmVudCwgcGF5bG9hZCwgam9pbl9yZWYpKXsgY29udGludWUgfVxuICAgICAgICBjaGFubmVsLnRyaWdnZXIoZXZlbnQsIHBheWxvYWQsIHJlZiwgam9pbl9yZWYpXG4gICAgICB9XG5cbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLm1lc3NhZ2UubGVuZ3RoOyBpKyspe1xuICAgICAgICBsZXQgWywgY2FsbGJhY2tdID0gdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcy5tZXNzYWdlW2ldXG4gICAgICAgIGNhbGxiYWNrKG1zZylcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgbGVhdmVPcGVuVG9waWModG9waWMpe1xuICAgIGxldCBkdXBDaGFubmVsID0gdGhpcy5jaGFubmVscy5maW5kKGMgPT4gYy50b3BpYyA9PT0gdG9waWMgJiYgKGMuaXNKb2luZWQoKSB8fCBjLmlzSm9pbmluZygpKSlcbiAgICBpZihkdXBDaGFubmVsKXtcbiAgICAgIGlmKHRoaXMuaGFzTG9nZ2VyKCkpIHRoaXMubG9nKFwidHJhbnNwb3J0XCIsIGBsZWF2aW5nIGR1cGxpY2F0ZSB0b3BpYyBcIiR7dG9waWN9XCJgKVxuICAgICAgZHVwQ2hhbm5lbC5sZWF2ZSgpXG4gICAgfVxuICB9XG59XG4iLCAiXG5leHBvcnQgY29uc3QgQ09OU0VDVVRJVkVfUkVMT0FEUyA9IFwiY29uc2VjdXRpdmUtcmVsb2Fkc1wiXG5leHBvcnQgY29uc3QgTUFYX1JFTE9BRFMgPSAxMFxuZXhwb3J0IGNvbnN0IFJFTE9BRF9KSVRURVJfTUlOID0gMTAwMFxuZXhwb3J0IGNvbnN0IFJFTE9BRF9KSVRURVJfTUFYID0gMzAwMFxuZXhwb3J0IGNvbnN0IEZBSUxTQUZFX0pJVFRFUiA9IDMwMDAwXG5leHBvcnQgY29uc3QgUEhYX0VWRU5UX0NMQVNTRVMgPSBbXG4gIFwicGh4LWNsaWNrLWxvYWRpbmdcIiwgXCJwaHgtY2hhbmdlLWxvYWRpbmdcIiwgXCJwaHgtc3VibWl0LWxvYWRpbmdcIixcbiAgXCJwaHgta2V5ZG93bi1sb2FkaW5nXCIsIFwicGh4LWtleXVwLWxvYWRpbmdcIiwgXCJwaHgtYmx1ci1sb2FkaW5nXCIsIFwicGh4LWZvY3VzLWxvYWRpbmdcIlxuXVxuZXhwb3J0IGNvbnN0IFBIWF9DT01QT05FTlQgPSBcImRhdGEtcGh4LWNvbXBvbmVudFwiXG5leHBvcnQgY29uc3QgUEhYX0xJVkVfTElOSyA9IFwiZGF0YS1waHgtbGlua1wiXG5leHBvcnQgY29uc3QgUEhYX1RSQUNLX1NUQVRJQyA9IFwidHJhY2stc3RhdGljXCJcbmV4cG9ydCBjb25zdCBQSFhfTElOS19TVEFURSA9IFwiZGF0YS1waHgtbGluay1zdGF0ZVwiXG5leHBvcnQgY29uc3QgUEhYX1JFRiA9IFwiZGF0YS1waHgtcmVmXCJcbmV4cG9ydCBjb25zdCBQSFhfUkVGX1NSQyA9IFwiZGF0YS1waHgtcmVmLXNyY1wiXG5leHBvcnQgY29uc3QgUEhYX1RSQUNLX1VQTE9BRFMgPSBcInRyYWNrLXVwbG9hZHNcIlxuZXhwb3J0IGNvbnN0IFBIWF9VUExPQURfUkVGID0gXCJkYXRhLXBoeC11cGxvYWQtcmVmXCJcbmV4cG9ydCBjb25zdCBQSFhfUFJFRkxJR0hURURfUkVGUyA9IFwiZGF0YS1waHgtcHJlZmxpZ2h0ZWQtcmVmc1wiXG5leHBvcnQgY29uc3QgUEhYX0RPTkVfUkVGUyA9IFwiZGF0YS1waHgtZG9uZS1yZWZzXCJcbmV4cG9ydCBjb25zdCBQSFhfRFJPUF9UQVJHRVQgPSBcImRyb3AtdGFyZ2V0XCJcbmV4cG9ydCBjb25zdCBQSFhfQUNUSVZFX0VOVFJZX1JFRlMgPSBcImRhdGEtcGh4LWFjdGl2ZS1yZWZzXCJcbmV4cG9ydCBjb25zdCBQSFhfTElWRV9GSUxFX1VQREFURUQgPSBcInBoeDpsaXZlLWZpbGU6dXBkYXRlZFwiXG5leHBvcnQgY29uc3QgUEhYX1NLSVAgPSBcImRhdGEtcGh4LXNraXBcIlxuZXhwb3J0IGNvbnN0IFBIWF9QUlVORSA9IFwiZGF0YS1waHgtcHJ1bmVcIlxuZXhwb3J0IGNvbnN0IFBIWF9QQUdFX0xPQURJTkcgPSBcInBhZ2UtbG9hZGluZ1wiXG5leHBvcnQgY29uc3QgUEhYX0NPTk5FQ1RFRF9DTEFTUyA9IFwicGh4LWNvbm5lY3RlZFwiXG5leHBvcnQgY29uc3QgUEhYX0RJU0NPTk5FQ1RFRF9DTEFTUyA9IFwicGh4LWxvYWRpbmdcIlxuZXhwb3J0IGNvbnN0IFBIWF9OT19GRUVEQkFDS19DTEFTUyA9IFwicGh4LW5vLWZlZWRiYWNrXCJcbmV4cG9ydCBjb25zdCBQSFhfRVJST1JfQ0xBU1MgPSBcInBoeC1lcnJvclwiXG5leHBvcnQgY29uc3QgUEhYX1BBUkVOVF9JRCA9IFwiZGF0YS1waHgtcGFyZW50LWlkXCJcbmV4cG9ydCBjb25zdCBQSFhfTUFJTiA9IFwiZGF0YS1waHgtbWFpblwiXG5leHBvcnQgY29uc3QgUEhYX1JPT1RfSUQgPSBcImRhdGEtcGh4LXJvb3QtaWRcIlxuZXhwb3J0IGNvbnN0IFBIWF9UUklHR0VSX0FDVElPTiA9IFwidHJpZ2dlci1hY3Rpb25cIlxuZXhwb3J0IGNvbnN0IFBIWF9GRUVEQkFDS19GT1IgPSBcImZlZWRiYWNrLWZvclwiXG5leHBvcnQgY29uc3QgUEhYX0hBU19GT0NVU0VEID0gXCJwaHgtaGFzLWZvY3VzZWRcIlxuZXhwb3J0IGNvbnN0IEZPQ1VTQUJMRV9JTlBVVFMgPSBbXCJ0ZXh0XCIsIFwidGV4dGFyZWFcIiwgXCJudW1iZXJcIiwgXCJlbWFpbFwiLCBcInBhc3N3b3JkXCIsIFwic2VhcmNoXCIsIFwidGVsXCIsIFwidXJsXCIsIFwiZGF0ZVwiLCBcInRpbWVcIiwgXCJkYXRldGltZS1sb2NhbFwiLCBcImNvbG9yXCIsIFwicmFuZ2VcIl1cbmV4cG9ydCBjb25zdCBDSEVDS0FCTEVfSU5QVVRTID0gW1wiY2hlY2tib3hcIiwgXCJyYWRpb1wiXVxuZXhwb3J0IGNvbnN0IFBIWF9IQVNfU1VCTUlUVEVEID0gXCJwaHgtaGFzLXN1Ym1pdHRlZFwiXG5leHBvcnQgY29uc3QgUEhYX1NFU1NJT04gPSBcImRhdGEtcGh4LXNlc3Npb25cIlxuZXhwb3J0IGNvbnN0IFBIWF9WSUVXX1NFTEVDVE9SID0gYFske1BIWF9TRVNTSU9OfV1gXG5leHBvcnQgY29uc3QgUEhYX1NUSUNLWSA9IFwiZGF0YS1waHgtc3RpY2t5XCJcbmV4cG9ydCBjb25zdCBQSFhfU1RBVElDID0gXCJkYXRhLXBoeC1zdGF0aWNcIlxuZXhwb3J0IGNvbnN0IFBIWF9SRUFET05MWSA9IFwiZGF0YS1waHgtcmVhZG9ubHlcIlxuZXhwb3J0IGNvbnN0IFBIWF9ESVNBQkxFRCA9IFwiZGF0YS1waHgtZGlzYWJsZWRcIlxuZXhwb3J0IGNvbnN0IFBIWF9ESVNBQkxFX1dJVEggPSBcImRpc2FibGUtd2l0aFwiXG5leHBvcnQgY29uc3QgUEhYX0RJU0FCTEVfV0lUSF9SRVNUT1JFID0gXCJkYXRhLXBoeC1kaXNhYmxlLXdpdGgtcmVzdG9yZVwiXG5leHBvcnQgY29uc3QgUEhYX0hPT0sgPSBcImhvb2tcIlxuZXhwb3J0IGNvbnN0IFBIWF9ERUJPVU5DRSA9IFwiZGVib3VuY2VcIlxuZXhwb3J0IGNvbnN0IFBIWF9USFJPVFRMRSA9IFwidGhyb3R0bGVcIlxuZXhwb3J0IGNvbnN0IFBIWF9VUERBVEUgPSBcInVwZGF0ZVwiXG5leHBvcnQgY29uc3QgUEhYX0tFWSA9IFwia2V5XCJcbmV4cG9ydCBjb25zdCBQSFhfUFJJVkFURSA9IFwicGh4UHJpdmF0ZVwiXG5leHBvcnQgY29uc3QgUEhYX0FVVE9fUkVDT1ZFUiA9IFwiYXV0by1yZWNvdmVyXCJcbmV4cG9ydCBjb25zdCBQSFhfTFZfREVCVUcgPSBcInBoeDpsaXZlLXNvY2tldDpkZWJ1Z1wiXG5leHBvcnQgY29uc3QgUEhYX0xWX1BST0ZJTEUgPSBcInBoeDpsaXZlLXNvY2tldDpwcm9maWxpbmdcIlxuZXhwb3J0IGNvbnN0IFBIWF9MVl9MQVRFTkNZX1NJTSA9IFwicGh4OmxpdmUtc29ja2V0OmxhdGVuY3ktc2ltXCJcbmV4cG9ydCBjb25zdCBQSFhfUFJPR1JFU1MgPSBcInByb2dyZXNzXCJcbmV4cG9ydCBjb25zdCBMT0FERVJfVElNRU9VVCA9IDFcbmV4cG9ydCBjb25zdCBCRUZPUkVfVU5MT0FEX0xPQURFUl9USU1FT1VUID0gMjAwXG5leHBvcnQgY29uc3QgQklORElOR19QUkVGSVggPSBcInBoeC1cIlxuZXhwb3J0IGNvbnN0IFBVU0hfVElNRU9VVCA9IDMwMDAwXG5leHBvcnQgY29uc3QgTElOS19IRUFERVIgPSBcIngtcmVxdWVzdGVkLXdpdGhcIlxuZXhwb3J0IGNvbnN0IFJFU1BPTlNFX1VSTF9IRUFERVIgPSBcIngtcmVzcG9uc2UtdXJsXCJcbmV4cG9ydCBjb25zdCBERUJPVU5DRV9UUklHR0VSID0gXCJkZWJvdW5jZS10cmlnZ2VyXCJcbmV4cG9ydCBjb25zdCBUSFJPVFRMRUQgPSBcInRocm90dGxlZFwiXG5leHBvcnQgY29uc3QgREVCT1VOQ0VfUFJFVl9LRVkgPSBcImRlYm91bmNlLXByZXYta2V5XCJcbmV4cG9ydCBjb25zdCBERUZBVUxUUyA9IHtcbiAgZGVib3VuY2U6IDMwMCxcbiAgdGhyb3R0bGU6IDMwMFxufVxuXG4vLyBSZW5kZXJlZFxuZXhwb3J0IGNvbnN0IERZTkFNSUNTID0gXCJkXCJcbmV4cG9ydCBjb25zdCBTVEFUSUMgPSBcInNcIlxuZXhwb3J0IGNvbnN0IENPTVBPTkVOVFMgPSBcImNcIlxuZXhwb3J0IGNvbnN0IEVWRU5UUyA9IFwiZVwiXG5leHBvcnQgY29uc3QgUkVQTFkgPSBcInJcIlxuZXhwb3J0IGNvbnN0IFRJVExFID0gXCJ0XCJcbmV4cG9ydCBjb25zdCBURU1QTEFURVMgPSBcInBcIlxuIiwgImltcG9ydCB7XG4gIGxvZ0Vycm9yXG59IGZyb20gXCIuL3V0aWxzXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRW50cnlVcGxvYWRlciB7XG4gIGNvbnN0cnVjdG9yKGVudHJ5LCBjaHVua1NpemUsIGxpdmVTb2NrZXQpe1xuICAgIHRoaXMubGl2ZVNvY2tldCA9IGxpdmVTb2NrZXRcbiAgICB0aGlzLmVudHJ5ID0gZW50cnlcbiAgICB0aGlzLm9mZnNldCA9IDBcbiAgICB0aGlzLmNodW5rU2l6ZSA9IGNodW5rU2l6ZVxuICAgIHRoaXMuY2h1bmtUaW1lciA9IG51bGxcbiAgICB0aGlzLnVwbG9hZENoYW5uZWwgPSBsaXZlU29ja2V0LmNoYW5uZWwoYGx2dToke2VudHJ5LnJlZn1gLCB7dG9rZW46IGVudHJ5Lm1ldGFkYXRhKCl9KVxuICB9XG5cbiAgZXJyb3IocmVhc29uKXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5jaHVua1RpbWVyKVxuICAgIHRoaXMudXBsb2FkQ2hhbm5lbC5sZWF2ZSgpXG4gICAgdGhpcy5lbnRyeS5lcnJvcihyZWFzb24pXG4gIH1cblxuICB1cGxvYWQoKXtcbiAgICB0aGlzLnVwbG9hZENoYW5uZWwub25FcnJvcihyZWFzb24gPT4gdGhpcy5lcnJvcihyZWFzb24pKVxuICAgIHRoaXMudXBsb2FkQ2hhbm5lbC5qb2luKClcbiAgICAgIC5yZWNlaXZlKFwib2tcIiwgX2RhdGEgPT4gdGhpcy5yZWFkTmV4dENodW5rKCkpXG4gICAgICAucmVjZWl2ZShcImVycm9yXCIsIHJlYXNvbiA9PiB0aGlzLmVycm9yKHJlYXNvbikpXG4gIH1cblxuICBpc0RvbmUoKXsgcmV0dXJuIHRoaXMub2Zmc2V0ID49IHRoaXMuZW50cnkuZmlsZS5zaXplIH1cblxuICByZWFkTmV4dENodW5rKCl7XG4gICAgbGV0IHJlYWRlciA9IG5ldyB3aW5kb3cuRmlsZVJlYWRlcigpXG4gICAgbGV0IGJsb2IgPSB0aGlzLmVudHJ5LmZpbGUuc2xpY2UodGhpcy5vZmZzZXQsIHRoaXMuY2h1bmtTaXplICsgdGhpcy5vZmZzZXQpXG4gICAgcmVhZGVyLm9ubG9hZCA9IChlKSA9PiB7XG4gICAgICBpZihlLnRhcmdldC5lcnJvciA9PT0gbnVsbCl7XG4gICAgICAgIHRoaXMub2Zmc2V0ICs9IGUudGFyZ2V0LnJlc3VsdC5ieXRlTGVuZ3RoXG4gICAgICAgIHRoaXMucHVzaENodW5rKGUudGFyZ2V0LnJlc3VsdClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBsb2dFcnJvcihcIlJlYWQgZXJyb3I6IFwiICsgZS50YXJnZXQuZXJyb3IpXG4gICAgICB9XG4gICAgfVxuICAgIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iKVxuICB9XG5cbiAgcHVzaENodW5rKGNodW5rKXtcbiAgICBpZighdGhpcy51cGxvYWRDaGFubmVsLmlzSm9pbmVkKCkpeyByZXR1cm4gfVxuICAgIHRoaXMudXBsb2FkQ2hhbm5lbC5wdXNoKFwiY2h1bmtcIiwgY2h1bmspXG4gICAgICAucmVjZWl2ZShcIm9rXCIsICgpID0+IHtcbiAgICAgICAgdGhpcy5lbnRyeS5wcm9ncmVzcygodGhpcy5vZmZzZXQgLyB0aGlzLmVudHJ5LmZpbGUuc2l6ZSkgKiAxMDApXG4gICAgICAgIGlmKCF0aGlzLmlzRG9uZSgpKXtcbiAgICAgICAgICB0aGlzLmNodW5rVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMucmVhZE5leHRDaHVuaygpLCB0aGlzLmxpdmVTb2NrZXQuZ2V0TGF0ZW5jeVNpbSgpIHx8IDApXG4gICAgICAgIH1cbiAgICAgIH0pXG4gIH1cbn1cbiIsICJpbXBvcnQge1xuICBQSFhfVklFV19TRUxFQ1RPUlxufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQgRW50cnlVcGxvYWRlciBmcm9tIFwiLi9lbnRyeV91cGxvYWRlclwiXG5cbmV4cG9ydCBsZXQgbG9nRXJyb3IgPSAobXNnLCBvYmopID0+IGNvbnNvbGUuZXJyb3IgJiYgY29uc29sZS5lcnJvcihtc2csIG9iailcblxuZXhwb3J0IGxldCBpc0NpZCA9IChjaWQpID0+IHtcbiAgbGV0IHR5cGUgPSB0eXBlb2YoY2lkKVxuICByZXR1cm4gdHlwZSA9PT0gXCJudW1iZXJcIiB8fCAodHlwZSA9PT0gXCJzdHJpbmdcIiAmJiAvXigwfFsxLTldXFxkKikkLy50ZXN0KGNpZCkpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXRlY3REdXBsaWNhdGVJZHMoKXtcbiAgbGV0IGlkcyA9IG5ldyBTZXQoKVxuICBsZXQgZWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiKltpZF1cIilcbiAgZm9yKGxldCBpID0gMCwgbGVuID0gZWxlbXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspe1xuICAgIGlmKGlkcy5oYXMoZWxlbXNbaV0uaWQpKXtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYE11bHRpcGxlIElEcyBkZXRlY3RlZDogJHtlbGVtc1tpXS5pZH0uIEVuc3VyZSB1bmlxdWUgZWxlbWVudCBpZHMuYClcbiAgICB9IGVsc2Uge1xuICAgICAgaWRzLmFkZChlbGVtc1tpXS5pZClcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGxldCBkZWJ1ZyA9ICh2aWV3LCBraW5kLCBtc2csIG9iaikgPT4ge1xuICBpZih2aWV3LmxpdmVTb2NrZXQuaXNEZWJ1Z0VuYWJsZWQoKSl7XG4gICAgY29uc29sZS5sb2coYCR7dmlldy5pZH0gJHtraW5kfTogJHttc2d9IC0gYCwgb2JqKVxuICB9XG59XG5cbi8vIHdyYXBzIHZhbHVlIGluIGNsb3N1cmUgb3IgcmV0dXJucyBjbG9zdXJlXG5leHBvcnQgbGV0IGNsb3N1cmUgPSAodmFsKSA9PiB0eXBlb2YgdmFsID09PSBcImZ1bmN0aW9uXCIgPyB2YWwgOiBmdW5jdGlvbiAoKXsgcmV0dXJuIHZhbCB9XG5cbmV4cG9ydCBsZXQgY2xvbmUgPSAob2JqKSA9PiB7IHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iaikpIH1cblxuZXhwb3J0IGxldCBjbG9zZXN0UGh4QmluZGluZyA9IChlbCwgYmluZGluZywgYm9yZGVyRWwpID0+IHtcbiAgZG8ge1xuICAgIGlmKGVsLm1hdGNoZXMoYFske2JpbmRpbmd9XWApKXsgcmV0dXJuIGVsIH1cbiAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnQgfHwgZWwucGFyZW50Tm9kZVxuICB9IHdoaWxlKGVsICE9PSBudWxsICYmIGVsLm5vZGVUeXBlID09PSAxICYmICEoKGJvcmRlckVsICYmIGJvcmRlckVsLmlzU2FtZU5vZGUoZWwpKSB8fCBlbC5tYXRjaGVzKFBIWF9WSUVXX1NFTEVDVE9SKSkpXG4gIHJldHVybiBudWxsXG59XG5cbmV4cG9ydCBsZXQgaXNPYmplY3QgPSAob2JqKSA9PiB7XG4gIHJldHVybiBvYmogIT09IG51bGwgJiYgdHlwZW9mIG9iaiA9PT0gXCJvYmplY3RcIiAmJiAhKG9iaiBpbnN0YW5jZW9mIEFycmF5KVxufVxuXG5leHBvcnQgbGV0IGlzRXF1YWxPYmogPSAob2JqMSwgb2JqMikgPT4gSlNPTi5zdHJpbmdpZnkob2JqMSkgPT09IEpTT04uc3RyaW5naWZ5KG9iajIpXG5cbmV4cG9ydCBsZXQgaXNFbXB0eSA9IChvYmopID0+IHtcbiAgZm9yKGxldCB4IGluIG9iail7IHJldHVybiBmYWxzZSB9XG4gIHJldHVybiB0cnVlXG59XG5cbmV4cG9ydCBsZXQgbWF5YmUgPSAoZWwsIGNhbGxiYWNrKSA9PiBlbCAmJiBjYWxsYmFjayhlbClcblxuZXhwb3J0IGxldCBjaGFubmVsVXBsb2FkZXIgPSBmdW5jdGlvbiAoZW50cmllcywgb25FcnJvciwgcmVzcCwgbGl2ZVNvY2tldCl7XG4gIGVudHJpZXMuZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgbGV0IGVudHJ5VXBsb2FkZXIgPSBuZXcgRW50cnlVcGxvYWRlcihlbnRyeSwgcmVzcC5jb25maWcuY2h1bmtfc2l6ZSwgbGl2ZVNvY2tldClcbiAgICBlbnRyeVVwbG9hZGVyLnVwbG9hZCgpXG4gIH0pXG59XG4iLCAibGV0IEJyb3dzZXIgPSB7XG4gIGNhblB1c2hTdGF0ZSgpeyByZXR1cm4gKHR5cGVvZiAoaGlzdG9yeS5wdXNoU3RhdGUpICE9PSBcInVuZGVmaW5lZFwiKSB9LFxuXG4gIGRyb3BMb2NhbChsb2NhbFN0b3JhZ2UsIG5hbWVzcGFjZSwgc3Via2V5KXtcbiAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odGhpcy5sb2NhbEtleShuYW1lc3BhY2UsIHN1YmtleSkpXG4gIH0sXG5cbiAgdXBkYXRlTG9jYWwobG9jYWxTdG9yYWdlLCBuYW1lc3BhY2UsIHN1YmtleSwgaW5pdGlhbCwgZnVuYyl7XG4gICAgbGV0IGN1cnJlbnQgPSB0aGlzLmdldExvY2FsKGxvY2FsU3RvcmFnZSwgbmFtZXNwYWNlLCBzdWJrZXkpXG4gICAgbGV0IGtleSA9IHRoaXMubG9jYWxLZXkobmFtZXNwYWNlLCBzdWJrZXkpXG4gICAgbGV0IG5ld1ZhbCA9IGN1cnJlbnQgPT09IG51bGwgPyBpbml0aWFsIDogZnVuYyhjdXJyZW50KVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgSlNPTi5zdHJpbmdpZnkobmV3VmFsKSlcbiAgICByZXR1cm4gbmV3VmFsXG4gIH0sXG5cbiAgZ2V0TG9jYWwobG9jYWxTdG9yYWdlLCBuYW1lc3BhY2UsIHN1YmtleSl7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0odGhpcy5sb2NhbEtleShuYW1lc3BhY2UsIHN1YmtleSkpKVxuICB9LFxuXG4gIHVwZGF0ZUN1cnJlbnRTdGF0ZShjYWxsYmFjayl7XG4gICAgaWYoIXRoaXMuY2FuUHVzaFN0YXRlKCkpeyByZXR1cm4gfVxuICAgIGhpc3RvcnkucmVwbGFjZVN0YXRlKGNhbGxiYWNrKGhpc3Rvcnkuc3RhdGUgfHwge30pLCBcIlwiLCB3aW5kb3cubG9jYXRpb24uaHJlZilcbiAgfSxcblxuICBwdXNoU3RhdGUoa2luZCwgbWV0YSwgdG8pe1xuICAgIGlmKHRoaXMuY2FuUHVzaFN0YXRlKCkpe1xuICAgICAgaWYodG8gIT09IHdpbmRvdy5sb2NhdGlvbi5ocmVmKXtcbiAgICAgICAgaWYobWV0YS50eXBlID09IFwicmVkaXJlY3RcIiAmJiBtZXRhLnNjcm9sbCl7XG4gICAgICAgICAgLy8gSWYgd2UncmUgcmVkaXJlY3Rpbmcgc3RvcmUgdGhlIGN1cnJlbnQgc2Nyb2xsWSBmb3IgdGhlIGN1cnJlbnQgaGlzdG9yeSBzdGF0ZS5cbiAgICAgICAgICBsZXQgY3VycmVudFN0YXRlID0gaGlzdG9yeS5zdGF0ZSB8fCB7fVxuICAgICAgICAgIGN1cnJlbnRTdGF0ZS5zY3JvbGwgPSBtZXRhLnNjcm9sbFxuICAgICAgICAgIGhpc3RvcnkucmVwbGFjZVN0YXRlKGN1cnJlbnRTdGF0ZSwgXCJcIiwgd2luZG93LmxvY2F0aW9uLmhyZWYpXG4gICAgICAgIH1cblxuICAgICAgICBkZWxldGUgbWV0YS5zY3JvbGwgLy8gT25seSBzdG9yZSB0aGUgc2Nyb2xsIGluIHRoZSByZWRpcmVjdCBjYXNlLlxuICAgICAgICBoaXN0b3J5W2tpbmQgKyBcIlN0YXRlXCJdKG1ldGEsIFwiXCIsIHRvIHx8IG51bGwpIC8vIElFIHdpbGwgY29lcmNlIHVuZGVmaW5lZCB0byBzdHJpbmdcbiAgICAgICAgbGV0IGhhc2hFbCA9IHRoaXMuZ2V0SGFzaFRhcmdldEVsKHdpbmRvdy5sb2NhdGlvbi5oYXNoKVxuXG4gICAgICAgIGlmKGhhc2hFbCl7XG4gICAgICAgICAgaGFzaEVsLnNjcm9sbEludG9WaWV3KClcbiAgICAgICAgfSBlbHNlIGlmKG1ldGEudHlwZSA9PT0gXCJyZWRpcmVjdFwiKXtcbiAgICAgICAgICB3aW5kb3cuc2Nyb2xsKDAsIDApXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZWRpcmVjdCh0bylcbiAgICB9XG4gIH0sXG5cbiAgc2V0Q29va2llKG5hbWUsIHZhbHVlKXtcbiAgICBkb2N1bWVudC5jb29raWUgPSBgJHtuYW1lfT0ke3ZhbHVlfWBcbiAgfSxcblxuICBnZXRDb29raWUobmFtZSl7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNvb2tpZS5yZXBsYWNlKG5ldyBSZWdFeHAoYCg/Oig/Ol58Lio7XFxzKikke25hbWV9XFxzKlxcPVxccyooW147XSopLiokKXxeLiokYCksIFwiJDFcIilcbiAgfSxcblxuICByZWRpcmVjdCh0b1VSTCwgZmxhc2gpe1xuICAgIGlmKGZsYXNoKXsgQnJvd3Nlci5zZXRDb29raWUoXCJfX3Bob2VuaXhfZmxhc2hfX1wiLCBmbGFzaCArIFwiOyBtYXgtYWdlPTYwMDAwOyBwYXRoPS9cIikgfVxuICAgIHdpbmRvdy5sb2NhdGlvbiA9IHRvVVJMXG4gIH0sXG5cbiAgbG9jYWxLZXkobmFtZXNwYWNlLCBzdWJrZXkpeyByZXR1cm4gYCR7bmFtZXNwYWNlfS0ke3N1YmtleX1gIH0sXG5cbiAgZ2V0SGFzaFRhcmdldEVsKG1heWJlSGFzaCl7XG4gICAgbGV0IGhhc2ggPSBtYXliZUhhc2gudG9TdHJpbmcoKS5zdWJzdHJpbmcoMSlcbiAgICBpZihoYXNoID09PSBcIlwiKXsgcmV0dXJuIH1cbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaGFzaCkgfHwgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgYVtuYW1lPVwiJHtoYXNofVwiXWApXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQnJvd3NlclxuIiwgImltcG9ydCB7XG4gIENIRUNLQUJMRV9JTlBVVFMsXG4gIERFQk9VTkNFX1BSRVZfS0VZLFxuICBERUJPVU5DRV9UUklHR0VSLFxuICBGT0NVU0FCTEVfSU5QVVRTLFxuICBQSFhfQ09NUE9ORU5ULFxuICBQSFhfRVZFTlRfQ0xBU1NFUyxcbiAgUEhYX0hBU19GT0NVU0VELFxuICBQSFhfSEFTX1NVQk1JVFRFRCxcbiAgUEhYX01BSU4sXG4gIFBIWF9OT19GRUVEQkFDS19DTEFTUyxcbiAgUEhYX1BBUkVOVF9JRCxcbiAgUEhYX1BSSVZBVEUsXG4gIFBIWF9SRUYsXG4gIFBIWF9SRUZfU1JDLFxuICBQSFhfUk9PVF9JRCxcbiAgUEhYX1NFU1NJT04sXG4gIFBIWF9TVEFUSUMsXG4gIFBIWF9VUExPQURfUkVGLFxuICBQSFhfVklFV19TRUxFQ1RPUixcbiAgUEhYX1NUSUNLWSxcbiAgVEhST1RUTEVEXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCB7XG4gIGxvZ0Vycm9yXG59IGZyb20gXCIuL3V0aWxzXCJcblxubGV0IERPTSA9IHtcbiAgYnlJZChpZCl7IHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkgfHwgbG9nRXJyb3IoYG5vIGlkIGZvdW5kIGZvciAke2lkfWApIH0sXG5cbiAgcmVtb3ZlQ2xhc3MoZWwsIGNsYXNzTmFtZSl7XG4gICAgZWwuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpXG4gICAgaWYoZWwuY2xhc3NMaXN0Lmxlbmd0aCA9PT0gMCl7IGVsLnJlbW92ZUF0dHJpYnV0ZShcImNsYXNzXCIpIH1cbiAgfSxcblxuICBhbGwobm9kZSwgcXVlcnksIGNhbGxiYWNrKXtcbiAgICBpZighbm9kZSl7IHJldHVybiBbXSB9XG4gICAgbGV0IGFycmF5ID0gQXJyYXkuZnJvbShub2RlLnF1ZXJ5U2VsZWN0b3JBbGwocXVlcnkpKVxuICAgIHJldHVybiBjYWxsYmFjayA/IGFycmF5LmZvckVhY2goY2FsbGJhY2spIDogYXJyYXlcbiAgfSxcblxuICBjaGlsZE5vZGVMZW5ndGgoaHRtbCl7XG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRlbXBsYXRlXCIpXG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gaHRtbFxuICAgIHJldHVybiB0ZW1wbGF0ZS5jb250ZW50LmNoaWxkRWxlbWVudENvdW50XG4gIH0sXG5cbiAgaXNVcGxvYWRJbnB1dChlbCl7IHJldHVybiBlbC50eXBlID09PSBcImZpbGVcIiAmJiBlbC5nZXRBdHRyaWJ1dGUoUEhYX1VQTE9BRF9SRUYpICE9PSBudWxsIH0sXG5cbiAgZmluZFVwbG9hZElucHV0cyhub2RlKXsgcmV0dXJuIHRoaXMuYWxsKG5vZGUsIGBpbnB1dFt0eXBlPVwiZmlsZVwiXVske1BIWF9VUExPQURfUkVGfV1gKSB9LFxuXG4gIGZpbmRDb21wb25lbnROb2RlTGlzdChub2RlLCBjaWQpe1xuICAgIHJldHVybiB0aGlzLmZpbHRlcldpdGhpblNhbWVMaXZlVmlldyh0aGlzLmFsbChub2RlLCBgWyR7UEhYX0NPTVBPTkVOVH09XCIke2NpZH1cIl1gKSwgbm9kZSlcbiAgfSxcblxuICBpc1BoeERlc3Ryb3llZChub2RlKXtcbiAgICByZXR1cm4gbm9kZS5pZCAmJiBET00ucHJpdmF0ZShub2RlLCBcImRlc3Ryb3llZFwiKSA/IHRydWUgOiBmYWxzZVxuICB9LFxuXG4gIG1hcmtQaHhDaGlsZERlc3Ryb3llZChlbCl7XG4gICAgaWYodGhpcy5pc1BoeENoaWxkKGVsKSl7IGVsLnNldEF0dHJpYnV0ZShQSFhfU0VTU0lPTiwgXCJcIikgfVxuICAgIHRoaXMucHV0UHJpdmF0ZShlbCwgXCJkZXN0cm95ZWRcIiwgdHJ1ZSlcbiAgfSxcblxuICBmaW5kUGh4Q2hpbGRyZW5JbkZyYWdtZW50KGh0bWwsIHBhcmVudElkKXtcbiAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGVtcGxhdGVcIilcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBodG1sXG4gICAgcmV0dXJuIHRoaXMuZmluZFBoeENoaWxkcmVuKHRlbXBsYXRlLmNvbnRlbnQsIHBhcmVudElkKVxuICB9LFxuXG4gIGlzSWdub3JlZChlbCwgcGh4VXBkYXRlKXtcbiAgICByZXR1cm4gKGVsLmdldEF0dHJpYnV0ZShwaHhVcGRhdGUpIHx8IGVsLmdldEF0dHJpYnV0ZShcImRhdGEtcGh4LXVwZGF0ZVwiKSkgPT09IFwiaWdub3JlXCJcbiAgfSxcblxuICBpc1BoeFVwZGF0ZShlbCwgcGh4VXBkYXRlLCB1cGRhdGVUeXBlcyl7XG4gICAgcmV0dXJuIGVsLmdldEF0dHJpYnV0ZSAmJiB1cGRhdGVUeXBlcy5pbmRleE9mKGVsLmdldEF0dHJpYnV0ZShwaHhVcGRhdGUpKSA+PSAwXG4gIH0sXG5cbiAgZmluZFBoeFN0aWNreShlbCl7IHJldHVybiB0aGlzLmFsbChlbCwgYFske1BIWF9TVElDS1l9XWApIH0sXG5cbiAgZmluZFBoeENoaWxkcmVuKGVsLCBwYXJlbnRJZCl7XG4gICAgcmV0dXJuIHRoaXMuYWxsKGVsLCBgJHtQSFhfVklFV19TRUxFQ1RPUn1bJHtQSFhfUEFSRU5UX0lEfT1cIiR7cGFyZW50SWR9XCJdYClcbiAgfSxcblxuICBmaW5kUGFyZW50Q0lEcyhub2RlLCBjaWRzKXtcbiAgICBsZXQgaW5pdGlhbCA9IG5ldyBTZXQoY2lkcylcbiAgICByZXR1cm4gY2lkcy5yZWR1Y2UoKGFjYywgY2lkKSA9PiB7XG4gICAgICBsZXQgc2VsZWN0b3IgPSBgWyR7UEhYX0NPTVBPTkVOVH09XCIke2NpZH1cIl0gWyR7UEhYX0NPTVBPTkVOVH1dYFxuXG4gICAgICB0aGlzLmZpbHRlcldpdGhpblNhbWVMaXZlVmlldyh0aGlzLmFsbChub2RlLCBzZWxlY3RvciksIG5vZGUpXG4gICAgICAgIC5tYXAoZWwgPT4gcGFyc2VJbnQoZWwuZ2V0QXR0cmlidXRlKFBIWF9DT01QT05FTlQpKSlcbiAgICAgICAgLmZvckVhY2goY2hpbGRDSUQgPT4gYWNjLmRlbGV0ZShjaGlsZENJRCkpXG5cbiAgICAgIHJldHVybiBhY2NcbiAgICB9LCBpbml0aWFsKVxuICB9LFxuXG4gIGZpbHRlcldpdGhpblNhbWVMaXZlVmlldyhub2RlcywgcGFyZW50KXtcbiAgICBpZihwYXJlbnQucXVlcnlTZWxlY3RvcihQSFhfVklFV19TRUxFQ1RPUikpe1xuICAgICAgcmV0dXJuIG5vZGVzLmZpbHRlcihlbCA9PiB0aGlzLndpdGhpblNhbWVMaXZlVmlldyhlbCwgcGFyZW50KSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5vZGVzXG4gICAgfVxuICB9LFxuXG4gIHdpdGhpblNhbWVMaXZlVmlldyhub2RlLCBwYXJlbnQpe1xuICAgIHdoaWxlKG5vZGUgPSBub2RlLnBhcmVudE5vZGUpe1xuICAgICAgaWYobm9kZS5pc1NhbWVOb2RlKHBhcmVudCkpeyByZXR1cm4gdHJ1ZSB9XG4gICAgICBpZihub2RlLmdldEF0dHJpYnV0ZShQSFhfU0VTU0lPTikgIT09IG51bGwpeyByZXR1cm4gZmFsc2UgfVxuICAgIH1cbiAgfSxcblxuICBwcml2YXRlKGVsLCBrZXkpeyByZXR1cm4gZWxbUEhYX1BSSVZBVEVdICYmIGVsW1BIWF9QUklWQVRFXVtrZXldIH0sXG5cbiAgZGVsZXRlUHJpdmF0ZShlbCwga2V5KXsgZWxbUEhYX1BSSVZBVEVdICYmIGRlbGV0ZSAoZWxbUEhYX1BSSVZBVEVdW2tleV0pIH0sXG5cbiAgcHV0UHJpdmF0ZShlbCwga2V5LCB2YWx1ZSl7XG4gICAgaWYoIWVsW1BIWF9QUklWQVRFXSl7IGVsW1BIWF9QUklWQVRFXSA9IHt9IH1cbiAgICBlbFtQSFhfUFJJVkFURV1ba2V5XSA9IHZhbHVlXG4gIH0sXG5cbiAgdXBkYXRlUHJpdmF0ZShlbCwga2V5LCBkZWZhdWx0VmFsLCB1cGRhdGVGdW5jKXtcbiAgICBsZXQgZXhpc3RpbmcgPSB0aGlzLnByaXZhdGUoZWwsIGtleSlcbiAgICBpZihleGlzdGluZyA9PT0gdW5kZWZpbmVkKXtcbiAgICAgIHRoaXMucHV0UHJpdmF0ZShlbCwga2V5LCB1cGRhdGVGdW5jKGRlZmF1bHRWYWwpKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnB1dFByaXZhdGUoZWwsIGtleSwgdXBkYXRlRnVuYyhleGlzdGluZykpXG4gICAgfVxuICB9LFxuXG4gIGNvcHlQcml2YXRlcyh0YXJnZXQsIHNvdXJjZSl7XG4gICAgaWYoc291cmNlW1BIWF9QUklWQVRFXSl7XG4gICAgICB0YXJnZXRbUEhYX1BSSVZBVEVdID0gc291cmNlW1BIWF9QUklWQVRFXVxuICAgIH1cbiAgfSxcblxuICBwdXRUaXRsZShzdHIpe1xuICAgIGxldCB0aXRsZUVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcInRpdGxlXCIpXG4gICAgbGV0IHtwcmVmaXgsIHN1ZmZpeH0gPSB0aXRsZUVsLmRhdGFzZXRcbiAgICBkb2N1bWVudC50aXRsZSA9IGAke3ByZWZpeCB8fCBcIlwifSR7c3RyfSR7c3VmZml4IHx8IFwiXCJ9YFxuICB9LFxuXG4gIGRlYm91bmNlKGVsLCBldmVudCwgcGh4RGVib3VuY2UsIGRlZmF1bHREZWJvdW5jZSwgcGh4VGhyb3R0bGUsIGRlZmF1bHRUaHJvdHRsZSwgY2FsbGJhY2spe1xuICAgIGxldCBkZWJvdW5jZSA9IGVsLmdldEF0dHJpYnV0ZShwaHhEZWJvdW5jZSlcbiAgICBsZXQgdGhyb3R0bGUgPSBlbC5nZXRBdHRyaWJ1dGUocGh4VGhyb3R0bGUpXG4gICAgaWYoZGVib3VuY2UgPT09IFwiXCIpeyBkZWJvdW5jZSA9IGRlZmF1bHREZWJvdW5jZSB9XG4gICAgaWYodGhyb3R0bGUgPT09IFwiXCIpeyB0aHJvdHRsZSA9IGRlZmF1bHRUaHJvdHRsZSB9XG4gICAgbGV0IHZhbHVlID0gZGVib3VuY2UgfHwgdGhyb3R0bGVcbiAgICBzd2l0Y2godmFsdWUpe1xuICAgICAgY2FzZSBudWxsOiByZXR1cm4gY2FsbGJhY2soKVxuXG4gICAgICBjYXNlIFwiYmx1clwiOlxuICAgICAgICBpZih0aGlzLm9uY2UoZWwsIFwiZGVib3VuY2UtYmx1clwiKSl7XG4gICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgKCkgPT4gY2FsbGJhY2soKSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm5cblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGV0IHRpbWVvdXQgPSBwYXJzZUludCh2YWx1ZSlcbiAgICAgICAgbGV0IHRyaWdnZXIgPSAoKSA9PiB0aHJvdHRsZSA/IHRoaXMuZGVsZXRlUHJpdmF0ZShlbCwgVEhST1RUTEVEKSA6IGNhbGxiYWNrKClcbiAgICAgICAgbGV0IGN1cnJlbnRDeWNsZSA9IHRoaXMuaW5jQ3ljbGUoZWwsIERFQk9VTkNFX1RSSUdHRVIsIHRyaWdnZXIpXG4gICAgICAgIGlmKGlzTmFOKHRpbWVvdXQpKXsgcmV0dXJuIGxvZ0Vycm9yKGBpbnZhbGlkIHRocm90dGxlL2RlYm91bmNlIHZhbHVlOiAke3ZhbHVlfWApIH1cbiAgICAgICAgaWYodGhyb3R0bGUpe1xuICAgICAgICAgIGxldCBuZXdLZXlEb3duID0gZmFsc2VcbiAgICAgICAgICBpZihldmVudC50eXBlID09PSBcImtleWRvd25cIil7XG4gICAgICAgICAgICBsZXQgcHJldktleSA9IHRoaXMucHJpdmF0ZShlbCwgREVCT1VOQ0VfUFJFVl9LRVkpXG4gICAgICAgICAgICB0aGlzLnB1dFByaXZhdGUoZWwsIERFQk9VTkNFX1BSRVZfS0VZLCBldmVudC5rZXkpXG4gICAgICAgICAgICBuZXdLZXlEb3duID0gcHJldktleSAhPT0gZXZlbnQua2V5XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYoIW5ld0tleURvd24gJiYgdGhpcy5wcml2YXRlKGVsLCBUSFJPVFRMRUQpKXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpXG4gICAgICAgICAgICB0aGlzLnB1dFByaXZhdGUoZWwsIFRIUk9UVExFRCwgdHJ1ZSlcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy50cmlnZ2VyQ3ljbGUoZWwsIERFQk9VTkNFX1RSSUdHRVIpLCB0aW1lb3V0KVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMudHJpZ2dlckN5Y2xlKGVsLCBERUJPVU5DRV9UUklHR0VSLCBjdXJyZW50Q3ljbGUpLCB0aW1lb3V0KVxuICAgICAgICB9XG5cblxuICAgICAgICBsZXQgZm9ybSA9IGVsLmZvcm1cbiAgICAgICAgaWYoZm9ybSAmJiB0aGlzLm9uY2UoZm9ybSwgXCJiaW5kLWRlYm91bmNlXCIpKXtcbiAgICAgICAgICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgQXJyYXkuZnJvbSgobmV3IEZvcm1EYXRhKGZvcm0pKS5lbnRyaWVzKCksIChbbmFtZV0pID0+IHtcbiAgICAgICAgICAgICAgbGV0IGlucHV0ID0gZm9ybS5xdWVyeVNlbGVjdG9yKGBbbmFtZT1cIiR7bmFtZX1cIl1gKVxuICAgICAgICAgICAgICB0aGlzLmluY0N5Y2xlKGlucHV0LCBERUJPVU5DRV9UUklHR0VSKVxuICAgICAgICAgICAgICB0aGlzLmRlbGV0ZVByaXZhdGUoaW5wdXQsIFRIUk9UVExFRClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBpZih0aGlzLm9uY2UoZWwsIFwiYmluZC1kZWJvdW5jZVwiKSl7XG4gICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgKCkgPT4gdGhpcy50cmlnZ2VyQ3ljbGUoZWwsIERFQk9VTkNFX1RSSUdHRVIpKVxuICAgICAgICB9XG4gICAgfVxuICB9LFxuXG4gIHRyaWdnZXJDeWNsZShlbCwga2V5LCBjdXJyZW50Q3ljbGUpe1xuICAgIGxldCBbY3ljbGUsIHRyaWdnZXJdID0gdGhpcy5wcml2YXRlKGVsLCBrZXkpXG4gICAgaWYoIWN1cnJlbnRDeWNsZSl7IGN1cnJlbnRDeWNsZSA9IGN5Y2xlIH1cbiAgICBpZihjdXJyZW50Q3ljbGUgPT09IGN5Y2xlKXtcbiAgICAgIHRoaXMuaW5jQ3ljbGUoZWwsIGtleSlcbiAgICAgIHRyaWdnZXIoKVxuICAgIH1cbiAgfSxcblxuICBvbmNlKGVsLCBrZXkpe1xuICAgIGlmKHRoaXMucHJpdmF0ZShlbCwga2V5KSA9PT0gdHJ1ZSl7IHJldHVybiBmYWxzZSB9XG4gICAgdGhpcy5wdXRQcml2YXRlKGVsLCBrZXksIHRydWUpXG4gICAgcmV0dXJuIHRydWVcbiAgfSxcblxuICBpbmNDeWNsZShlbCwga2V5LCB0cmlnZ2VyID0gZnVuY3Rpb24gKCl7IH0pe1xuICAgIGxldCBbY3VycmVudEN5Y2xlXSA9IHRoaXMucHJpdmF0ZShlbCwga2V5KSB8fCBbMCwgdHJpZ2dlcl1cbiAgICBjdXJyZW50Q3ljbGUrK1xuICAgIHRoaXMucHV0UHJpdmF0ZShlbCwga2V5LCBbY3VycmVudEN5Y2xlLCB0cmlnZ2VyXSlcbiAgICByZXR1cm4gY3VycmVudEN5Y2xlXG4gIH0sXG5cbiAgZGlzY2FyZEVycm9yKGNvbnRhaW5lciwgZWwsIHBoeEZlZWRiYWNrRm9yKXtcbiAgICBsZXQgZmllbGQgPSBlbC5nZXRBdHRyaWJ1dGUgJiYgZWwuZ2V0QXR0cmlidXRlKHBoeEZlZWRiYWNrRm9yKVxuICAgIC8vIFRPRE86IFJlbW92ZSBpZCBsb29rdXAgYWZ0ZXIgd2UgdXBkYXRlIFBob2VuaXggdG8gdXNlIGlucHV0X25hbWUgaW5zdGVhZCBvZiBpbnB1dF9pZFxuICAgIGxldCBpbnB1dCA9IGZpZWxkICYmIGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKGBbaWQ9XCIke2ZpZWxkfVwiXSwgW25hbWU9XCIke2ZpZWxkfVwiXWApXG4gICAgaWYoIWlucHV0KXsgcmV0dXJuIH1cblxuICAgIGlmKCEodGhpcy5wcml2YXRlKGlucHV0LCBQSFhfSEFTX0ZPQ1VTRUQpIHx8IHRoaXMucHJpdmF0ZShpbnB1dC5mb3JtLCBQSFhfSEFTX1NVQk1JVFRFRCkpKXtcbiAgICAgIGVsLmNsYXNzTGlzdC5hZGQoUEhYX05PX0ZFRURCQUNLX0NMQVNTKVxuICAgIH1cbiAgfSxcblxuICBzaG93RXJyb3IoaW5wdXRFbCwgcGh4RmVlZGJhY2tGb3Ipe1xuICAgIGlmKGlucHV0RWwuaWQgfHwgaW5wdXRFbC5uYW1lKXtcbiAgICAgIHRoaXMuYWxsKGlucHV0RWwuZm9ybSwgYFske3BoeEZlZWRiYWNrRm9yfT1cIiR7aW5wdXRFbC5pZH1cIl0sIFske3BoeEZlZWRiYWNrRm9yfT1cIiR7aW5wdXRFbC5uYW1lfVwiXWAsIChlbCkgPT4ge1xuICAgICAgICB0aGlzLnJlbW92ZUNsYXNzKGVsLCBQSFhfTk9fRkVFREJBQ0tfQ0xBU1MpXG4gICAgICB9KVxuICAgIH1cbiAgfSxcblxuICBpc1BoeENoaWxkKG5vZGUpe1xuICAgIHJldHVybiBub2RlLmdldEF0dHJpYnV0ZSAmJiBub2RlLmdldEF0dHJpYnV0ZShQSFhfUEFSRU5UX0lEKVxuICB9LFxuXG4gIGlzUGh4U3RpY2t5KG5vZGUpe1xuICAgIHJldHVybiBub2RlLmdldEF0dHJpYnV0ZSAmJiBub2RlLmdldEF0dHJpYnV0ZShQSFhfU1RJQ0tZKSAhPT0gbnVsbFxuICB9LFxuXG4gIGZpcnN0UGh4Q2hpbGQoZWwpe1xuICAgIHJldHVybiB0aGlzLmlzUGh4Q2hpbGQoZWwpID8gZWwgOiB0aGlzLmFsbChlbCwgYFske1BIWF9QQVJFTlRfSUR9XWApWzBdXG4gIH0sXG5cbiAgZGlzcGF0Y2hFdmVudCh0YXJnZXQsIG5hbWUsIG9wdHMgPSB7fSl7XG4gICAgbGV0IGJ1YmJsZXMgPSBvcHRzLmJ1YmJsZXMgPT09IHVuZGVmaW5lZCA/IHRydWUgOiAhIW9wdHMuYnViYmxlc1xuICAgIGxldCBldmVudE9wdHMgPSB7YnViYmxlczogYnViYmxlcywgY2FuY2VsYWJsZTogdHJ1ZSwgZGV0YWlsOiBvcHRzLmRldGFpbCB8fCB7fX1cbiAgICBsZXQgZXZlbnQgPSBuYW1lID09PSBcImNsaWNrXCIgPyBuZXcgTW91c2VFdmVudChcImNsaWNrXCIsIGV2ZW50T3B0cykgOiBuZXcgQ3VzdG9tRXZlbnQobmFtZSwgZXZlbnRPcHRzKVxuICAgIHRhcmdldC5kaXNwYXRjaEV2ZW50KGV2ZW50KVxuICB9LFxuXG4gIGNsb25lTm9kZShub2RlLCBodG1sKXtcbiAgICBpZih0eXBlb2YgKGh0bWwpID09PSBcInVuZGVmaW5lZFwiKXtcbiAgICAgIHJldHVybiBub2RlLmNsb25lTm9kZSh0cnVlKVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgY2xvbmVkID0gbm9kZS5jbG9uZU5vZGUoZmFsc2UpXG4gICAgICBjbG9uZWQuaW5uZXJIVE1MID0gaHRtbFxuICAgICAgcmV0dXJuIGNsb25lZFxuICAgIH1cbiAgfSxcblxuICBtZXJnZUF0dHJzKHRhcmdldCwgc291cmNlLCBvcHRzID0ge30pe1xuICAgIGxldCBleGNsdWRlID0gb3B0cy5leGNsdWRlIHx8IFtdXG4gICAgbGV0IGlzSWdub3JlZCA9IG9wdHMuaXNJZ25vcmVkXG4gICAgbGV0IHNvdXJjZUF0dHJzID0gc291cmNlLmF0dHJpYnV0ZXNcbiAgICBmb3IobGV0IGkgPSBzb3VyY2VBdHRycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSl7XG4gICAgICBsZXQgbmFtZSA9IHNvdXJjZUF0dHJzW2ldLm5hbWVcbiAgICAgIGlmKGV4Y2x1ZGUuaW5kZXhPZihuYW1lKSA8IDApeyB0YXJnZXQuc2V0QXR0cmlidXRlKG5hbWUsIHNvdXJjZS5nZXRBdHRyaWJ1dGUobmFtZSkpIH1cbiAgICB9XG5cbiAgICBsZXQgdGFyZ2V0QXR0cnMgPSB0YXJnZXQuYXR0cmlidXRlc1xuICAgIGZvcihsZXQgaSA9IHRhcmdldEF0dHJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKXtcbiAgICAgIGxldCBuYW1lID0gdGFyZ2V0QXR0cnNbaV0ubmFtZVxuICAgICAgaWYoaXNJZ25vcmVkKXtcbiAgICAgICAgaWYobmFtZS5zdGFydHNXaXRoKFwiZGF0YS1cIikgJiYgIXNvdXJjZS5oYXNBdHRyaWJ1dGUobmFtZSkpeyB0YXJnZXQucmVtb3ZlQXR0cmlidXRlKG5hbWUpIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmKCFzb3VyY2UuaGFzQXR0cmlidXRlKG5hbWUpKXsgdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZShuYW1lKSB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIG1lcmdlRm9jdXNlZElucHV0KHRhcmdldCwgc291cmNlKXtcbiAgICAvLyBza2lwIHNlbGVjdHMgYmVjYXVzZSBGRiB3aWxsIHJlc2V0IGhpZ2hsaWdodGVkIGluZGV4IGZvciBhbnkgc2V0QXR0cmlidXRlXG4gICAgaWYoISh0YXJnZXQgaW5zdGFuY2VvZiBIVE1MU2VsZWN0RWxlbWVudCkpeyBET00ubWVyZ2VBdHRycyh0YXJnZXQsIHNvdXJjZSwge2V4Y2x1ZGU6IFtcInZhbHVlXCJdfSkgfVxuICAgIGlmKHNvdXJjZS5yZWFkT25seSl7XG4gICAgICB0YXJnZXQuc2V0QXR0cmlidXRlKFwicmVhZG9ubHlcIiwgdHJ1ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZShcInJlYWRvbmx5XCIpXG4gICAgfVxuICB9LFxuXG4gIGhhc1NlbGVjdGlvblJhbmdlKGVsKXtcbiAgICByZXR1cm4gZWwuc2V0U2VsZWN0aW9uUmFuZ2UgJiYgKGVsLnR5cGUgPT09IFwidGV4dFwiIHx8IGVsLnR5cGUgPT09IFwidGV4dGFyZWFcIilcbiAgfSxcblxuICByZXN0b3JlRm9jdXMoZm9jdXNlZCwgc2VsZWN0aW9uU3RhcnQsIHNlbGVjdGlvbkVuZCl7XG4gICAgaWYoIURPTS5pc1RleHR1YWxJbnB1dChmb2N1c2VkKSl7IHJldHVybiB9XG4gICAgbGV0IHdhc0ZvY3VzZWQgPSBmb2N1c2VkLm1hdGNoZXMoXCI6Zm9jdXNcIilcbiAgICBpZihmb2N1c2VkLnJlYWRPbmx5KXsgZm9jdXNlZC5ibHVyKCkgfVxuICAgIGlmKCF3YXNGb2N1c2VkKXsgZm9jdXNlZC5mb2N1cygpIH1cbiAgICBpZih0aGlzLmhhc1NlbGVjdGlvblJhbmdlKGZvY3VzZWQpKXtcbiAgICAgIGZvY3VzZWQuc2V0U2VsZWN0aW9uUmFuZ2Uoc2VsZWN0aW9uU3RhcnQsIHNlbGVjdGlvbkVuZClcbiAgICB9XG4gIH0sXG5cbiAgaXNGb3JtSW5wdXQoZWwpeyByZXR1cm4gL14oPzppbnB1dHxzZWxlY3R8dGV4dGFyZWEpJC9pLnRlc3QoZWwudGFnTmFtZSkgJiYgZWwudHlwZSAhPT0gXCJidXR0b25cIiB9LFxuXG4gIHN5bmNBdHRyc1RvUHJvcHMoZWwpe1xuICAgIGlmKGVsIGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCAmJiBDSEVDS0FCTEVfSU5QVVRTLmluZGV4T2YoZWwudHlwZS50b0xvY2FsZUxvd2VyQ2FzZSgpKSA+PSAwKXtcbiAgICAgIGVsLmNoZWNrZWQgPSBlbC5nZXRBdHRyaWJ1dGUoXCJjaGVja2VkXCIpICE9PSBudWxsXG4gICAgfVxuICB9LFxuXG4gIGlzVGV4dHVhbElucHV0KGVsKXsgcmV0dXJuIEZPQ1VTQUJMRV9JTlBVVFMuaW5kZXhPZihlbC50eXBlKSA+PSAwIH0sXG5cbiAgaXNOb3dUcmlnZ2VyRm9ybUV4dGVybmFsKGVsLCBwaHhUcmlnZ2VyRXh0ZXJuYWwpe1xuICAgIHJldHVybiBlbC5nZXRBdHRyaWJ1dGUgJiYgZWwuZ2V0QXR0cmlidXRlKHBoeFRyaWdnZXJFeHRlcm5hbCkgIT09IG51bGxcbiAgfSxcblxuICBzeW5jUGVuZGluZ1JlZihmcm9tRWwsIHRvRWwsIGRpc2FibGVXaXRoKXtcbiAgICBsZXQgcmVmID0gZnJvbUVsLmdldEF0dHJpYnV0ZShQSFhfUkVGKVxuICAgIGlmKHJlZiA9PT0gbnVsbCl7IHJldHVybiB0cnVlIH1cbiAgICBsZXQgcmVmU3JjID0gZnJvbUVsLmdldEF0dHJpYnV0ZShQSFhfUkVGX1NSQylcblxuICAgIGlmKERPTS5pc0Zvcm1JbnB1dChmcm9tRWwpIHx8IGZyb21FbC5nZXRBdHRyaWJ1dGUoZGlzYWJsZVdpdGgpICE9PSBudWxsKXtcbiAgICAgIGlmKERPTS5pc1VwbG9hZElucHV0KGZyb21FbCkpeyBET00ubWVyZ2VBdHRycyhmcm9tRWwsIHRvRWwsIHtpc0lnbm9yZWQ6IHRydWV9KSB9XG4gICAgICBET00ucHV0UHJpdmF0ZShmcm9tRWwsIFBIWF9SRUYsIHRvRWwpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9IGVsc2Uge1xuICAgICAgUEhYX0VWRU5UX0NMQVNTRVMuZm9yRWFjaChjbGFzc05hbWUgPT4ge1xuICAgICAgICBmcm9tRWwuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSkgJiYgdG9FbC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSlcbiAgICAgIH0pXG4gICAgICB0b0VsLnNldEF0dHJpYnV0ZShQSFhfUkVGLCByZWYpXG4gICAgICB0b0VsLnNldEF0dHJpYnV0ZShQSFhfUkVGX1NSQywgcmVmU3JjKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH0sXG5cbiAgY2xlYW5DaGlsZE5vZGVzKGNvbnRhaW5lciwgcGh4VXBkYXRlKXtcbiAgICBpZihET00uaXNQaHhVcGRhdGUoY29udGFpbmVyLCBwaHhVcGRhdGUsIFtcImFwcGVuZFwiLCBcInByZXBlbmRcIl0pKXtcbiAgICAgIGxldCB0b1JlbW92ZSA9IFtdXG4gICAgICBjb250YWluZXIuY2hpbGROb2Rlcy5mb3JFYWNoKGNoaWxkTm9kZSA9PiB7XG4gICAgICAgIGlmKCFjaGlsZE5vZGUuaWQpe1xuICAgICAgICAgIC8vIFNraXAgd2FybmluZyBpZiBpdCdzIGFuIGVtcHR5IHRleHQgbm9kZSAoZS5nLiBhIG5ldy1saW5lKVxuICAgICAgICAgIGxldCBpc0VtcHR5VGV4dE5vZGUgPSBjaGlsZE5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFICYmIGNoaWxkTm9kZS5ub2RlVmFsdWUudHJpbSgpID09PSBcIlwiXG4gICAgICAgICAgaWYoIWlzRW1wdHlUZXh0Tm9kZSl7XG4gICAgICAgICAgICBsb2dFcnJvcihcIm9ubHkgSFRNTCBlbGVtZW50IHRhZ3Mgd2l0aCBhbiBpZCBhcmUgYWxsb3dlZCBpbnNpZGUgY29udGFpbmVycyB3aXRoIHBoeC11cGRhdGUuXFxuXFxuXCIgK1xuICAgICAgICAgICAgICBgcmVtb3ZpbmcgaWxsZWdhbCBub2RlOiBcIiR7KGNoaWxkTm9kZS5vdXRlckhUTUwgfHwgY2hpbGROb2RlLm5vZGVWYWx1ZSkudHJpbSgpfVwiXFxuXFxuYClcbiAgICAgICAgICB9XG4gICAgICAgICAgdG9SZW1vdmUucHVzaChjaGlsZE5vZGUpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICB0b1JlbW92ZS5mb3JFYWNoKGNoaWxkTm9kZSA9PiBjaGlsZE5vZGUucmVtb3ZlKCkpXG4gICAgfVxuICB9LFxuXG4gIHJlcGxhY2VSb290Q29udGFpbmVyKGNvbnRhaW5lciwgdGFnTmFtZSwgYXR0cnMpe1xuICAgIGxldCByZXRhaW5lZEF0dHJzID0gbmV3IFNldChbXCJpZFwiLCBQSFhfU0VTU0lPTiwgUEhYX1NUQVRJQywgUEhYX01BSU4sIFBIWF9ST09UX0lEXSlcbiAgICBpZihjb250YWluZXIudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSB0YWdOYW1lLnRvTG93ZXJDYXNlKCkpe1xuICAgICAgQXJyYXkuZnJvbShjb250YWluZXIuYXR0cmlidXRlcylcbiAgICAgICAgLmZpbHRlcihhdHRyID0+ICFyZXRhaW5lZEF0dHJzLmhhcyhhdHRyLm5hbWUudG9Mb3dlckNhc2UoKSkpXG4gICAgICAgIC5mb3JFYWNoKGF0dHIgPT4gY29udGFpbmVyLnJlbW92ZUF0dHJpYnV0ZShhdHRyLm5hbWUpKVxuXG4gICAgICBPYmplY3Qua2V5cyhhdHRycylcbiAgICAgICAgLmZpbHRlcihuYW1lID0+ICFyZXRhaW5lZEF0dHJzLmhhcyhuYW1lLnRvTG93ZXJDYXNlKCkpKVxuICAgICAgICAuZm9yRWFjaChhdHRyID0+IGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoYXR0ciwgYXR0cnNbYXR0cl0pKVxuXG4gICAgICByZXR1cm4gY29udGFpbmVyXG5cbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IG5ld0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSlcbiAgICAgIE9iamVjdC5rZXlzKGF0dHJzKS5mb3JFYWNoKGF0dHIgPT4gbmV3Q29udGFpbmVyLnNldEF0dHJpYnV0ZShhdHRyLCBhdHRyc1thdHRyXSkpXG4gICAgICByZXRhaW5lZEF0dHJzLmZvckVhY2goYXR0ciA9PiBuZXdDb250YWluZXIuc2V0QXR0cmlidXRlKGF0dHIsIGNvbnRhaW5lci5nZXRBdHRyaWJ1dGUoYXR0cikpKVxuICAgICAgbmV3Q29udGFpbmVyLmlubmVySFRNTCA9IGNvbnRhaW5lci5pbm5lckhUTUxcbiAgICAgIGNvbnRhaW5lci5yZXBsYWNlV2l0aChuZXdDb250YWluZXIpXG4gICAgICByZXR1cm4gbmV3Q29udGFpbmVyXG4gICAgfVxuICB9LFxuXG4gIGdldFN0aWNreShlbCwgbmFtZSwgZGVmYXVsdFZhbCl7XG4gICAgbGV0IG9wID0gKERPTS5wcml2YXRlKGVsLCBcInN0aWNreVwiKSB8fCBbXSkuZmluZCgoW2V4aXN0aW5nTmFtZSwgXSkgPT4gbmFtZSA9PT0gZXhpc3RpbmdOYW1lKVxuICAgIGlmKG9wKXtcbiAgICAgIGxldCBbX25hbWUsIF9vcCwgc3Rhc2hlZFJlc3VsdF0gPSBvcFxuICAgICAgcmV0dXJuIHN0YXNoZWRSZXN1bHRcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHR5cGVvZihkZWZhdWx0VmFsKSA9PT0gXCJmdW5jdGlvblwiID8gZGVmYXVsdFZhbCgpIDogZGVmYXVsdFZhbFxuICAgIH1cbiAgfSxcblxuICBkZWxldGVTdGlja3koZWwsIG5hbWUpe1xuICAgIHRoaXMudXBkYXRlUHJpdmF0ZShlbCwgXCJzdGlja3lcIiwgW10sIG9wcyA9PiB7XG4gICAgICByZXR1cm4gb3BzLmZpbHRlcigoW2V4aXN0aW5nTmFtZSwgX10pID0+IGV4aXN0aW5nTmFtZSAhPT0gbmFtZSlcbiAgICB9KVxuICB9LFxuXG4gIHB1dFN0aWNreShlbCwgbmFtZSwgb3Ape1xuICAgIGxldCBzdGFzaGVkUmVzdWx0ID0gb3AoZWwpXG4gICAgdGhpcy51cGRhdGVQcml2YXRlKGVsLCBcInN0aWNreVwiLCBbXSwgb3BzID0+IHtcbiAgICAgIGxldCBleGlzdGluZ0luZGV4ID0gb3BzLmZpbmRJbmRleCgoW2V4aXN0aW5nTmFtZSwgXSkgPT4gbmFtZSA9PT0gZXhpc3RpbmdOYW1lKVxuICAgICAgaWYoZXhpc3RpbmdJbmRleCA+PSAwKXtcbiAgICAgICAgb3BzW2V4aXN0aW5nSW5kZXhdID0gW25hbWUsIG9wLCBzdGFzaGVkUmVzdWx0XVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3BzLnB1c2goW25hbWUsIG9wLCBzdGFzaGVkUmVzdWx0XSlcbiAgICAgIH1cbiAgICAgIHJldHVybiBvcHNcbiAgICB9KVxuICB9LFxuXG4gIGFwcGx5U3RpY2t5T3BlcmF0aW9ucyhlbCl7XG4gICAgbGV0IG9wcyA9IERPTS5wcml2YXRlKGVsLCBcInN0aWNreVwiKVxuICAgIGlmKCFvcHMpeyByZXR1cm4gfVxuXG4gICAgb3BzLmZvckVhY2goKFtuYW1lLCBvcCwgX3N0YXNoZWRdKSA9PiB0aGlzLnB1dFN0aWNreShlbCwgbmFtZSwgb3ApKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERPTVxuIiwgImltcG9ydCB7XG4gIFBIWF9BQ1RJVkVfRU5UUllfUkVGUyxcbiAgUEhYX0xJVkVfRklMRV9VUERBVEVELFxuICBQSFhfUFJFRkxJR0hURURfUkVGU1xufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQge1xuICBjaGFubmVsVXBsb2FkZXIsXG4gIGxvZ0Vycm9yXG59IGZyb20gXCIuL3V0aWxzXCJcblxuaW1wb3J0IExpdmVVcGxvYWRlciBmcm9tIFwiLi9saXZlX3VwbG9hZGVyXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXBsb2FkRW50cnkge1xuICBzdGF0aWMgaXNBY3RpdmUoZmlsZUVsLCBmaWxlKXtcbiAgICBsZXQgaXNOZXcgPSBmaWxlLl9waHhSZWYgPT09IHVuZGVmaW5lZFxuICAgIGxldCBhY3RpdmVSZWZzID0gZmlsZUVsLmdldEF0dHJpYnV0ZShQSFhfQUNUSVZFX0VOVFJZX1JFRlMpLnNwbGl0KFwiLFwiKVxuICAgIGxldCBpc0FjdGl2ZSA9IGFjdGl2ZVJlZnMuaW5kZXhPZihMaXZlVXBsb2FkZXIuZ2VuRmlsZVJlZihmaWxlKSkgPj0gMFxuICAgIHJldHVybiBmaWxlLnNpemUgPiAwICYmIChpc05ldyB8fCBpc0FjdGl2ZSlcbiAgfVxuXG4gIHN0YXRpYyBpc1ByZWZsaWdodGVkKGZpbGVFbCwgZmlsZSl7XG4gICAgbGV0IHByZWZsaWdodGVkUmVmcyA9IGZpbGVFbC5nZXRBdHRyaWJ1dGUoUEhYX1BSRUZMSUdIVEVEX1JFRlMpLnNwbGl0KFwiLFwiKVxuICAgIGxldCBpc1ByZWZsaWdodGVkID0gcHJlZmxpZ2h0ZWRSZWZzLmluZGV4T2YoTGl2ZVVwbG9hZGVyLmdlbkZpbGVSZWYoZmlsZSkpID49IDBcbiAgICByZXR1cm4gaXNQcmVmbGlnaHRlZCAmJiB0aGlzLmlzQWN0aXZlKGZpbGVFbCwgZmlsZSlcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGZpbGVFbCwgZmlsZSwgdmlldyl7XG4gICAgdGhpcy5yZWYgPSBMaXZlVXBsb2FkZXIuZ2VuRmlsZVJlZihmaWxlKVxuICAgIHRoaXMuZmlsZUVsID0gZmlsZUVsXG4gICAgdGhpcy5maWxlID0gZmlsZVxuICAgIHRoaXMudmlldyA9IHZpZXdcbiAgICB0aGlzLm1ldGEgPSBudWxsXG4gICAgdGhpcy5faXNDYW5jZWxsZWQgPSBmYWxzZVxuICAgIHRoaXMuX2lzRG9uZSA9IGZhbHNlXG4gICAgdGhpcy5fcHJvZ3Jlc3MgPSAwXG4gICAgdGhpcy5fbGFzdFByb2dyZXNzU2VudCA9IC0xXG4gICAgdGhpcy5fb25Eb25lID0gZnVuY3Rpb24gKCl7IH1cbiAgICB0aGlzLl9vbkVsVXBkYXRlZCA9IHRoaXMub25FbFVwZGF0ZWQuYmluZCh0aGlzKVxuICAgIHRoaXMuZmlsZUVsLmFkZEV2ZW50TGlzdGVuZXIoUEhYX0xJVkVfRklMRV9VUERBVEVELCB0aGlzLl9vbkVsVXBkYXRlZClcbiAgfVxuXG4gIG1ldGFkYXRhKCl7IHJldHVybiB0aGlzLm1ldGEgfVxuXG4gIHByb2dyZXNzKHByb2dyZXNzKXtcbiAgICB0aGlzLl9wcm9ncmVzcyA9IE1hdGguZmxvb3IocHJvZ3Jlc3MpXG4gICAgaWYodGhpcy5fcHJvZ3Jlc3MgPiB0aGlzLl9sYXN0UHJvZ3Jlc3NTZW50KXtcbiAgICAgIGlmKHRoaXMuX3Byb2dyZXNzID49IDEwMCl7XG4gICAgICAgIHRoaXMuX3Byb2dyZXNzID0gMTAwXG4gICAgICAgIHRoaXMuX2xhc3RQcm9ncmVzc1NlbnQgPSAxMDBcbiAgICAgICAgdGhpcy5faXNEb25lID0gdHJ1ZVxuICAgICAgICB0aGlzLnZpZXcucHVzaEZpbGVQcm9ncmVzcyh0aGlzLmZpbGVFbCwgdGhpcy5yZWYsIDEwMCwgKCkgPT4ge1xuICAgICAgICAgIExpdmVVcGxvYWRlci51bnRyYWNrRmlsZSh0aGlzLmZpbGVFbCwgdGhpcy5maWxlKVxuICAgICAgICAgIHRoaXMuX29uRG9uZSgpXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9sYXN0UHJvZ3Jlc3NTZW50ID0gdGhpcy5fcHJvZ3Jlc3NcbiAgICAgICAgdGhpcy52aWV3LnB1c2hGaWxlUHJvZ3Jlc3ModGhpcy5maWxlRWwsIHRoaXMucmVmLCB0aGlzLl9wcm9ncmVzcylcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjYW5jZWwoKXtcbiAgICB0aGlzLl9pc0NhbmNlbGxlZCA9IHRydWVcbiAgICB0aGlzLl9pc0RvbmUgPSB0cnVlXG4gICAgdGhpcy5fb25Eb25lKClcbiAgfVxuXG4gIGlzRG9uZSgpeyByZXR1cm4gdGhpcy5faXNEb25lIH1cblxuICBlcnJvcihyZWFzb24gPSBcImZhaWxlZFwiKXtcbiAgICB0aGlzLnZpZXcucHVzaEZpbGVQcm9ncmVzcyh0aGlzLmZpbGVFbCwgdGhpcy5yZWYsIHtlcnJvcjogcmVhc29ufSlcbiAgICBMaXZlVXBsb2FkZXIuY2xlYXJGaWxlcyh0aGlzLmZpbGVFbClcbiAgfVxuXG4gIC8vcHJpdmF0ZVxuXG4gIG9uRG9uZShjYWxsYmFjayl7XG4gICAgdGhpcy5fb25Eb25lID0gKCkgPT4ge1xuICAgICAgdGhpcy5maWxlRWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihQSFhfTElWRV9GSUxFX1VQREFURUQsIHRoaXMuX29uRWxVcGRhdGVkKVxuICAgICAgY2FsbGJhY2soKVxuICAgIH1cbiAgfVxuXG4gIG9uRWxVcGRhdGVkKCl7XG4gICAgbGV0IGFjdGl2ZVJlZnMgPSB0aGlzLmZpbGVFbC5nZXRBdHRyaWJ1dGUoUEhYX0FDVElWRV9FTlRSWV9SRUZTKS5zcGxpdChcIixcIilcbiAgICBpZihhY3RpdmVSZWZzLmluZGV4T2YodGhpcy5yZWYpID09PSAtMSl7IHRoaXMuY2FuY2VsKCkgfVxuICB9XG5cbiAgdG9QcmVmbGlnaHRQYXlsb2FkKCl7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhc3RfbW9kaWZpZWQ6IHRoaXMuZmlsZS5sYXN0TW9kaWZpZWQsXG4gICAgICBuYW1lOiB0aGlzLmZpbGUubmFtZSxcbiAgICAgIHNpemU6IHRoaXMuZmlsZS5zaXplLFxuICAgICAgdHlwZTogdGhpcy5maWxlLnR5cGUsXG4gICAgICByZWY6IHRoaXMucmVmXG4gICAgfVxuICB9XG5cbiAgdXBsb2FkZXIodXBsb2FkZXJzKXtcbiAgICBpZih0aGlzLm1ldGEudXBsb2FkZXIpe1xuICAgICAgbGV0IGNhbGxiYWNrID0gdXBsb2FkZXJzW3RoaXMubWV0YS51cGxvYWRlcl0gfHwgbG9nRXJyb3IoYG5vIHVwbG9hZGVyIGNvbmZpZ3VyZWQgZm9yICR7dGhpcy5tZXRhLnVwbG9hZGVyfWApXG4gICAgICByZXR1cm4ge25hbWU6IHRoaXMubWV0YS51cGxvYWRlciwgY2FsbGJhY2s6IGNhbGxiYWNrfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge25hbWU6IFwiY2hhbm5lbFwiLCBjYWxsYmFjazogY2hhbm5lbFVwbG9hZGVyfVxuICAgIH1cbiAgfVxuXG4gIHppcFBvc3RGbGlnaHQocmVzcCl7XG4gICAgdGhpcy5tZXRhID0gcmVzcC5lbnRyaWVzW3RoaXMucmVmXVxuICAgIGlmKCF0aGlzLm1ldGEpeyBsb2dFcnJvcihgbm8gcHJlZmxpZ2h0IHVwbG9hZCByZXNwb25zZSByZXR1cm5lZCB3aXRoIHJlZiAke3RoaXMucmVmfWAsIHtpbnB1dDogdGhpcy5maWxlRWwsIHJlc3BvbnNlOiByZXNwfSkgfVxuICB9XG59XG4iLCAiaW1wb3J0IHtcbiAgUEhYX0RPTkVfUkVGUyxcbiAgUEhYX1BSRUZMSUdIVEVEX1JFRlMsXG4gIFBIWF9VUExPQURfUkVGXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCB7XG59IGZyb20gXCIuL3V0aWxzXCJcblxuaW1wb3J0IERPTSBmcm9tIFwiLi9kb21cIlxuaW1wb3J0IFVwbG9hZEVudHJ5IGZyb20gXCIuL3VwbG9hZF9lbnRyeVwiXG5cbmxldCBsaXZlVXBsb2FkZXJGaWxlUmVmID0gMFxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaXZlVXBsb2FkZXIge1xuICBzdGF0aWMgZ2VuRmlsZVJlZihmaWxlKXtcbiAgICBsZXQgcmVmID0gZmlsZS5fcGh4UmVmXG4gICAgaWYocmVmICE9PSB1bmRlZmluZWQpe1xuICAgICAgcmV0dXJuIHJlZlxuICAgIH0gZWxzZSB7XG4gICAgICBmaWxlLl9waHhSZWYgPSAobGl2ZVVwbG9hZGVyRmlsZVJlZisrKS50b1N0cmluZygpXG4gICAgICByZXR1cm4gZmlsZS5fcGh4UmVmXG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGdldEVudHJ5RGF0YVVSTChpbnB1dEVsLCByZWYsIGNhbGxiYWNrKXtcbiAgICBsZXQgZmlsZSA9IHRoaXMuYWN0aXZlRmlsZXMoaW5wdXRFbCkuZmluZChmaWxlID0+IHRoaXMuZ2VuRmlsZVJlZihmaWxlKSA9PT0gcmVmKVxuICAgIGNhbGxiYWNrKFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSkpXG4gIH1cblxuICBzdGF0aWMgaGFzVXBsb2Fkc0luUHJvZ3Jlc3MoZm9ybUVsKXtcbiAgICBsZXQgYWN0aXZlID0gMFxuICAgIERPTS5maW5kVXBsb2FkSW5wdXRzKGZvcm1FbCkuZm9yRWFjaChpbnB1dCA9PiB7XG4gICAgICBpZihpbnB1dC5nZXRBdHRyaWJ1dGUoUEhYX1BSRUZMSUdIVEVEX1JFRlMpICE9PSBpbnB1dC5nZXRBdHRyaWJ1dGUoUEhYX0RPTkVfUkVGUykpe1xuICAgICAgICBhY3RpdmUrK1xuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGFjdGl2ZSA+IDBcbiAgfVxuXG4gIHN0YXRpYyBzZXJpYWxpemVVcGxvYWRzKGlucHV0RWwpe1xuICAgIGxldCBmaWxlcyA9IHRoaXMuYWN0aXZlRmlsZXMoaW5wdXRFbClcbiAgICBsZXQgZmlsZURhdGEgPSB7fVxuICAgIGZpbGVzLmZvckVhY2goZmlsZSA9PiB7XG4gICAgICBsZXQgZW50cnkgPSB7cGF0aDogaW5wdXRFbC5uYW1lfVxuICAgICAgbGV0IHVwbG9hZFJlZiA9IGlucHV0RWwuZ2V0QXR0cmlidXRlKFBIWF9VUExPQURfUkVGKVxuICAgICAgZmlsZURhdGFbdXBsb2FkUmVmXSA9IGZpbGVEYXRhW3VwbG9hZFJlZl0gfHwgW11cbiAgICAgIGVudHJ5LnJlZiA9IHRoaXMuZ2VuRmlsZVJlZihmaWxlKVxuICAgICAgZW50cnkubmFtZSA9IGZpbGUubmFtZSB8fCBlbnRyeS5yZWZcbiAgICAgIGVudHJ5LnR5cGUgPSBmaWxlLnR5cGVcbiAgICAgIGVudHJ5LnNpemUgPSBmaWxlLnNpemVcbiAgICAgIGZpbGVEYXRhW3VwbG9hZFJlZl0ucHVzaChlbnRyeSlcbiAgICB9KVxuICAgIHJldHVybiBmaWxlRGF0YVxuICB9XG5cbiAgc3RhdGljIGNsZWFyRmlsZXMoaW5wdXRFbCl7XG4gICAgaW5wdXRFbC52YWx1ZSA9IG51bGxcbiAgICBpbnB1dEVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfVVBMT0FEX1JFRilcbiAgICBET00ucHV0UHJpdmF0ZShpbnB1dEVsLCBcImZpbGVzXCIsIFtdKVxuICB9XG5cbiAgc3RhdGljIHVudHJhY2tGaWxlKGlucHV0RWwsIGZpbGUpe1xuICAgIERPTS5wdXRQcml2YXRlKGlucHV0RWwsIFwiZmlsZXNcIiwgRE9NLnByaXZhdGUoaW5wdXRFbCwgXCJmaWxlc1wiKS5maWx0ZXIoZiA9PiAhT2JqZWN0LmlzKGYsIGZpbGUpKSlcbiAgfVxuXG4gIHN0YXRpYyB0cmFja0ZpbGVzKGlucHV0RWwsIGZpbGVzKXtcbiAgICBpZihpbnB1dEVsLmdldEF0dHJpYnV0ZShcIm11bHRpcGxlXCIpICE9PSBudWxsKXtcbiAgICAgIGxldCBuZXdGaWxlcyA9IGZpbGVzLmZpbHRlcihmaWxlID0+ICF0aGlzLmFjdGl2ZUZpbGVzKGlucHV0RWwpLmZpbmQoZiA9PiBPYmplY3QuaXMoZiwgZmlsZSkpKVxuICAgICAgRE9NLnB1dFByaXZhdGUoaW5wdXRFbCwgXCJmaWxlc1wiLCB0aGlzLmFjdGl2ZUZpbGVzKGlucHV0RWwpLmNvbmNhdChuZXdGaWxlcykpXG4gICAgICBpbnB1dEVsLnZhbHVlID0gbnVsbFxuICAgIH0gZWxzZSB7XG4gICAgICBET00ucHV0UHJpdmF0ZShpbnB1dEVsLCBcImZpbGVzXCIsIGZpbGVzKVxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBhY3RpdmVGaWxlSW5wdXRzKGZvcm1FbCl7XG4gICAgbGV0IGZpbGVJbnB1dHMgPSBET00uZmluZFVwbG9hZElucHV0cyhmb3JtRWwpXG4gICAgcmV0dXJuIEFycmF5LmZyb20oZmlsZUlucHV0cykuZmlsdGVyKGVsID0+IGVsLmZpbGVzICYmIHRoaXMuYWN0aXZlRmlsZXMoZWwpLmxlbmd0aCA+IDApXG4gIH1cblxuICBzdGF0aWMgYWN0aXZlRmlsZXMoaW5wdXQpe1xuICAgIHJldHVybiAoRE9NLnByaXZhdGUoaW5wdXQsIFwiZmlsZXNcIikgfHwgW10pLmZpbHRlcihmID0+IFVwbG9hZEVudHJ5LmlzQWN0aXZlKGlucHV0LCBmKSlcbiAgfVxuXG4gIHN0YXRpYyBpbnB1dHNBd2FpdGluZ1ByZWZsaWdodChmb3JtRWwpe1xuICAgIGxldCBmaWxlSW5wdXRzID0gRE9NLmZpbmRVcGxvYWRJbnB1dHMoZm9ybUVsKVxuICAgIHJldHVybiBBcnJheS5mcm9tKGZpbGVJbnB1dHMpLmZpbHRlcihpbnB1dCA9PiB0aGlzLmZpbGVzQXdhaXRpbmdQcmVmbGlnaHQoaW5wdXQpLmxlbmd0aCA+IDApXG4gIH1cblxuICBzdGF0aWMgZmlsZXNBd2FpdGluZ1ByZWZsaWdodChpbnB1dCl7XG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlRmlsZXMoaW5wdXQpLmZpbHRlcihmID0+ICFVcGxvYWRFbnRyeS5pc1ByZWZsaWdodGVkKGlucHV0LCBmKSlcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGlucHV0RWwsIHZpZXcsIG9uQ29tcGxldGUpe1xuICAgIHRoaXMudmlldyA9IHZpZXdcbiAgICB0aGlzLm9uQ29tcGxldGUgPSBvbkNvbXBsZXRlXG4gICAgdGhpcy5fZW50cmllcyA9XG4gICAgICBBcnJheS5mcm9tKExpdmVVcGxvYWRlci5maWxlc0F3YWl0aW5nUHJlZmxpZ2h0KGlucHV0RWwpIHx8IFtdKVxuICAgICAgICAubWFwKGZpbGUgPT4gbmV3IFVwbG9hZEVudHJ5KGlucHV0RWwsIGZpbGUsIHZpZXcpKVxuXG4gICAgdGhpcy5udW1FbnRyaWVzSW5Qcm9ncmVzcyA9IHRoaXMuX2VudHJpZXMubGVuZ3RoXG4gIH1cblxuICBlbnRyaWVzKCl7IHJldHVybiB0aGlzLl9lbnRyaWVzIH1cblxuICBpbml0QWRhcHRlclVwbG9hZChyZXNwLCBvbkVycm9yLCBsaXZlU29ja2V0KXtcbiAgICB0aGlzLl9lbnRyaWVzID1cbiAgICAgIHRoaXMuX2VudHJpZXMubWFwKGVudHJ5ID0+IHtcbiAgICAgICAgZW50cnkuemlwUG9zdEZsaWdodChyZXNwKVxuICAgICAgICBlbnRyeS5vbkRvbmUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMubnVtRW50cmllc0luUHJvZ3Jlc3MtLVxuICAgICAgICAgIGlmKHRoaXMubnVtRW50cmllc0luUHJvZ3Jlc3MgPT09IDApeyB0aGlzLm9uQ29tcGxldGUoKSB9XG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBlbnRyeVxuICAgICAgfSlcblxuICAgIGxldCBncm91cGVkRW50cmllcyA9IHRoaXMuX2VudHJpZXMucmVkdWNlKChhY2MsIGVudHJ5KSA9PiB7XG4gICAgICBsZXQge25hbWUsIGNhbGxiYWNrfSA9IGVudHJ5LnVwbG9hZGVyKGxpdmVTb2NrZXQudXBsb2FkZXJzKVxuICAgICAgYWNjW25hbWVdID0gYWNjW25hbWVdIHx8IHtjYWxsYmFjazogY2FsbGJhY2ssIGVudHJpZXM6IFtdfVxuICAgICAgYWNjW25hbWVdLmVudHJpZXMucHVzaChlbnRyeSlcbiAgICAgIHJldHVybiBhY2NcbiAgICB9LCB7fSlcblxuICAgIGZvcihsZXQgbmFtZSBpbiBncm91cGVkRW50cmllcyl7XG4gICAgICBsZXQge2NhbGxiYWNrLCBlbnRyaWVzfSA9IGdyb3VwZWRFbnRyaWVzW25hbWVdXG4gICAgICBjYWxsYmFjayhlbnRyaWVzLCBvbkVycm9yLCByZXNwLCBsaXZlU29ja2V0KVxuICAgIH1cbiAgfVxufVxuIiwgImltcG9ydCB7XG4gIFBIWF9BQ1RJVkVfRU5UUllfUkVGUyxcbiAgUEhYX0xJVkVfRklMRV9VUERBVEVELFxuICBQSFhfUFJFRkxJR0hURURfUkVGUyxcbiAgUEhYX1VQTE9BRF9SRUZcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IExpdmVVcGxvYWRlciBmcm9tIFwiLi9saXZlX3VwbG9hZGVyXCJcblxubGV0IEhvb2tzID0ge1xuICBMaXZlRmlsZVVwbG9hZDoge1xuICAgIGFjdGl2ZVJlZnMoKXsgcmV0dXJuIHRoaXMuZWwuZ2V0QXR0cmlidXRlKFBIWF9BQ1RJVkVfRU5UUllfUkVGUykgfSxcblxuICAgIHByZWZsaWdodGVkUmVmcygpeyByZXR1cm4gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoUEhYX1BSRUZMSUdIVEVEX1JFRlMpIH0sXG5cbiAgICBtb3VudGVkKCl7IHRoaXMucHJlZmxpZ2h0ZWRXYXMgPSB0aGlzLnByZWZsaWdodGVkUmVmcygpIH0sXG5cbiAgICB1cGRhdGVkKCl7XG4gICAgICBsZXQgbmV3UHJlZmxpZ2h0cyA9IHRoaXMucHJlZmxpZ2h0ZWRSZWZzKClcbiAgICAgIGlmKHRoaXMucHJlZmxpZ2h0ZWRXYXMgIT09IG5ld1ByZWZsaWdodHMpe1xuICAgICAgICB0aGlzLnByZWZsaWdodGVkV2FzID0gbmV3UHJlZmxpZ2h0c1xuICAgICAgICBpZihuZXdQcmVmbGlnaHRzID09PSBcIlwiKXtcbiAgICAgICAgICB0aGlzLl9fdmlldy5jYW5jZWxTdWJtaXQodGhpcy5lbC5mb3JtKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmKHRoaXMuYWN0aXZlUmVmcygpID09PSBcIlwiKXsgdGhpcy5lbC52YWx1ZSA9IG51bGwgfVxuICAgICAgdGhpcy5lbC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChQSFhfTElWRV9GSUxFX1VQREFURUQpKVxuICAgIH1cbiAgfSxcblxuICBMaXZlSW1nUHJldmlldzoge1xuICAgIG1vdW50ZWQoKXtcbiAgICAgIHRoaXMucmVmID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBoeC1lbnRyeS1yZWZcIilcbiAgICAgIHRoaXMuaW5wdXRFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZWwuZ2V0QXR0cmlidXRlKFBIWF9VUExPQURfUkVGKSlcbiAgICAgIExpdmVVcGxvYWRlci5nZXRFbnRyeURhdGFVUkwodGhpcy5pbnB1dEVsLCB0aGlzLnJlZiwgdXJsID0+IHtcbiAgICAgICAgdGhpcy51cmwgPSB1cmxcbiAgICAgICAgdGhpcy5lbC5zcmMgPSB1cmxcbiAgICAgIH0pXG4gICAgfSxcbiAgICBkZXN0cm95ZWQoKXtcbiAgICAgIFVSTC5yZXZva2VPYmplY3RVUkwodGhpcy51cmwpXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEhvb2tzXG4iLCAiaW1wb3J0IHtcbiAgbWF5YmVcbn0gZnJvbSBcIi4vdXRpbHNcIlxuXG5pbXBvcnQgRE9NIGZyb20gXCIuL2RvbVwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERPTVBvc3RNb3JwaFJlc3RvcmVyIHtcbiAgY29uc3RydWN0b3IoY29udGFpbmVyQmVmb3JlLCBjb250YWluZXJBZnRlciwgdXBkYXRlVHlwZSl7XG4gICAgbGV0IGlkc0JlZm9yZSA9IG5ldyBTZXQoKVxuICAgIGxldCBpZHNBZnRlciA9IG5ldyBTZXQoWy4uLmNvbnRhaW5lckFmdGVyLmNoaWxkcmVuXS5tYXAoY2hpbGQgPT4gY2hpbGQuaWQpKVxuXG4gICAgbGV0IGVsZW1lbnRzVG9Nb2RpZnkgPSBbXVxuXG4gICAgQXJyYXkuZnJvbShjb250YWluZXJCZWZvcmUuY2hpbGRyZW4pLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgaWYoY2hpbGQuaWQpeyAvLyBhbGwgb2Ygb3VyIGNoaWxkcmVuIHNob3VsZCBiZSBlbGVtZW50cyB3aXRoIGlkc1xuICAgICAgICBpZHNCZWZvcmUuYWRkKGNoaWxkLmlkKVxuICAgICAgICBpZihpZHNBZnRlci5oYXMoY2hpbGQuaWQpKXtcbiAgICAgICAgICBsZXQgcHJldmlvdXNFbGVtZW50SWQgPSBjaGlsZC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nICYmIGNoaWxkLnByZXZpb3VzRWxlbWVudFNpYmxpbmcuaWRcbiAgICAgICAgICBlbGVtZW50c1RvTW9kaWZ5LnB1c2goe2VsZW1lbnRJZDogY2hpbGQuaWQsIHByZXZpb3VzRWxlbWVudElkOiBwcmV2aW91c0VsZW1lbnRJZH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5jb250YWluZXJJZCA9IGNvbnRhaW5lckFmdGVyLmlkXG4gICAgdGhpcy51cGRhdGVUeXBlID0gdXBkYXRlVHlwZVxuICAgIHRoaXMuZWxlbWVudHNUb01vZGlmeSA9IGVsZW1lbnRzVG9Nb2RpZnlcbiAgICB0aGlzLmVsZW1lbnRJZHNUb0FkZCA9IFsuLi5pZHNBZnRlcl0uZmlsdGVyKGlkID0+ICFpZHNCZWZvcmUuaGFzKGlkKSlcbiAgfVxuXG4gIC8vIFdlIGRvIHRoZSBmb2xsb3dpbmcgdG8gb3B0aW1pemUgYXBwZW5kL3ByZXBlbmQgb3BlcmF0aW9uczpcbiAgLy8gICAxKSBUcmFjayBpZHMgb2YgbW9kaWZpZWQgZWxlbWVudHMgJiBvZiBuZXcgZWxlbWVudHNcbiAgLy8gICAyKSBBbGwgdGhlIG1vZGlmaWVkIGVsZW1lbnRzIGFyZSBwdXQgYmFjayBpbiB0aGUgY29ycmVjdCBwb3NpdGlvbiBpbiB0aGUgRE9NIHRyZWVcbiAgLy8gICAgICBieSBzdG9yaW5nIHRoZSBpZCBvZiB0aGVpciBwcmV2aW91cyBzaWJsaW5nXG4gIC8vICAgMykgTmV3IGVsZW1lbnRzIGFyZSBnb2luZyB0byBiZSBwdXQgaW4gdGhlIHJpZ2h0IHBsYWNlIGJ5IG1vcnBoZG9tIGR1cmluZyBhcHBlbmQuXG4gIC8vICAgICAgRm9yIHByZXBlbmQsIHdlIG1vdmUgdGhlbSB0byB0aGUgZmlyc3QgcG9zaXRpb24gaW4gdGhlIGNvbnRhaW5lclxuICBwZXJmb3JtKCl7XG4gICAgbGV0IGNvbnRhaW5lciA9IERPTS5ieUlkKHRoaXMuY29udGFpbmVySWQpXG4gICAgdGhpcy5lbGVtZW50c1RvTW9kaWZ5LmZvckVhY2goZWxlbWVudFRvTW9kaWZ5ID0+IHtcbiAgICAgIGlmKGVsZW1lbnRUb01vZGlmeS5wcmV2aW91c0VsZW1lbnRJZCl7XG4gICAgICAgIG1heWJlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnRUb01vZGlmeS5wcmV2aW91c0VsZW1lbnRJZCksIHByZXZpb3VzRWxlbSA9PiB7XG4gICAgICAgICAgbWF5YmUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudFRvTW9kaWZ5LmVsZW1lbnRJZCksIGVsZW0gPT4ge1xuICAgICAgICAgICAgbGV0IGlzSW5SaWdodFBsYWNlID0gZWxlbS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nICYmIGVsZW0ucHJldmlvdXNFbGVtZW50U2libGluZy5pZCA9PSBwcmV2aW91c0VsZW0uaWRcbiAgICAgICAgICAgIGlmKCFpc0luUmlnaHRQbGFjZSl7XG4gICAgICAgICAgICAgIHByZXZpb3VzRWxlbS5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJhZnRlcmVuZFwiLCBlbGVtKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUaGlzIGlzIHRoZSBmaXJzdCBlbGVtZW50IGluIHRoZSBjb250YWluZXJcbiAgICAgICAgbWF5YmUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudFRvTW9kaWZ5LmVsZW1lbnRJZCksIGVsZW0gPT4ge1xuICAgICAgICAgIGxldCBpc0luUmlnaHRQbGFjZSA9IGVsZW0ucHJldmlvdXNFbGVtZW50U2libGluZyA9PSBudWxsXG4gICAgICAgICAgaWYoIWlzSW5SaWdodFBsYWNlKXtcbiAgICAgICAgICAgIGNvbnRhaW5lci5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJhZnRlcmJlZ2luXCIsIGVsZW0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBpZih0aGlzLnVwZGF0ZVR5cGUgPT0gXCJwcmVwZW5kXCIpe1xuICAgICAgdGhpcy5lbGVtZW50SWRzVG9BZGQucmV2ZXJzZSgpLmZvckVhY2goZWxlbUlkID0+IHtcbiAgICAgICAgbWF5YmUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbUlkKSwgZWxlbSA9PiBjb250YWluZXIuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KFwiYWZ0ZXJiZWdpblwiLCBlbGVtKSlcbiAgICAgIH0pXG4gICAgfVxuICB9XG59XG4iLCAidmFyIERPQ1VNRU5UX0ZSQUdNRU5UX05PREUgPSAxMTtcblxuZnVuY3Rpb24gbW9ycGhBdHRycyhmcm9tTm9kZSwgdG9Ob2RlKSB7XG4gICAgdmFyIHRvTm9kZUF0dHJzID0gdG9Ob2RlLmF0dHJpYnV0ZXM7XG4gICAgdmFyIGF0dHI7XG4gICAgdmFyIGF0dHJOYW1lO1xuICAgIHZhciBhdHRyTmFtZXNwYWNlVVJJO1xuICAgIHZhciBhdHRyVmFsdWU7XG4gICAgdmFyIGZyb21WYWx1ZTtcblxuICAgIC8vIGRvY3VtZW50LWZyYWdtZW50cyBkb250IGhhdmUgYXR0cmlidXRlcyBzbyBsZXRzIG5vdCBkbyBhbnl0aGluZ1xuICAgIGlmICh0b05vZGUubm9kZVR5cGUgPT09IERPQ1VNRU5UX0ZSQUdNRU5UX05PREUgfHwgZnJvbU5vZGUubm9kZVR5cGUgPT09IERPQ1VNRU5UX0ZSQUdNRU5UX05PREUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgYXR0cmlidXRlcyBvbiBvcmlnaW5hbCBET00gZWxlbWVudFxuICAgIGZvciAodmFyIGkgPSB0b05vZGVBdHRycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBhdHRyID0gdG9Ob2RlQXR0cnNbaV07XG4gICAgICAgIGF0dHJOYW1lID0gYXR0ci5uYW1lO1xuICAgICAgICBhdHRyTmFtZXNwYWNlVVJJID0gYXR0ci5uYW1lc3BhY2VVUkk7XG4gICAgICAgIGF0dHJWYWx1ZSA9IGF0dHIudmFsdWU7XG5cbiAgICAgICAgaWYgKGF0dHJOYW1lc3BhY2VVUkkpIHtcbiAgICAgICAgICAgIGF0dHJOYW1lID0gYXR0ci5sb2NhbE5hbWUgfHwgYXR0ck5hbWU7XG4gICAgICAgICAgICBmcm9tVmFsdWUgPSBmcm9tTm9kZS5nZXRBdHRyaWJ1dGVOUyhhdHRyTmFtZXNwYWNlVVJJLCBhdHRyTmFtZSk7XG5cbiAgICAgICAgICAgIGlmIChmcm9tVmFsdWUgIT09IGF0dHJWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChhdHRyLnByZWZpeCA9PT0gJ3htbG5zJyl7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJOYW1lID0gYXR0ci5uYW1lOyAvLyBJdCdzIG5vdCBhbGxvd2VkIHRvIHNldCBhbiBhdHRyaWJ1dGUgd2l0aCB0aGUgWE1MTlMgbmFtZXNwYWNlIHdpdGhvdXQgc3BlY2lmeWluZyB0aGUgYHhtbG5zYCBwcmVmaXhcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZnJvbU5vZGUuc2V0QXR0cmlidXRlTlMoYXR0ck5hbWVzcGFjZVVSSSwgYXR0ck5hbWUsIGF0dHJWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmcm9tVmFsdWUgPSBmcm9tTm9kZS5nZXRBdHRyaWJ1dGUoYXR0ck5hbWUpO1xuXG4gICAgICAgICAgICBpZiAoZnJvbVZhbHVlICE9PSBhdHRyVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBmcm9tTm9kZS5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIGF0dHJWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgYW55IGV4dHJhIGF0dHJpYnV0ZXMgZm91bmQgb24gdGhlIG9yaWdpbmFsIERPTSBlbGVtZW50IHRoYXRcbiAgICAvLyB3ZXJlbid0IGZvdW5kIG9uIHRoZSB0YXJnZXQgZWxlbWVudC5cbiAgICB2YXIgZnJvbU5vZGVBdHRycyA9IGZyb21Ob2RlLmF0dHJpYnV0ZXM7XG5cbiAgICBmb3IgKHZhciBkID0gZnJvbU5vZGVBdHRycy5sZW5ndGggLSAxOyBkID49IDA7IGQtLSkge1xuICAgICAgICBhdHRyID0gZnJvbU5vZGVBdHRyc1tkXTtcbiAgICAgICAgYXR0ck5hbWUgPSBhdHRyLm5hbWU7XG4gICAgICAgIGF0dHJOYW1lc3BhY2VVUkkgPSBhdHRyLm5hbWVzcGFjZVVSSTtcblxuICAgICAgICBpZiAoYXR0ck5hbWVzcGFjZVVSSSkge1xuICAgICAgICAgICAgYXR0ck5hbWUgPSBhdHRyLmxvY2FsTmFtZSB8fCBhdHRyTmFtZTtcblxuICAgICAgICAgICAgaWYgKCF0b05vZGUuaGFzQXR0cmlidXRlTlMoYXR0ck5hbWVzcGFjZVVSSSwgYXR0ck5hbWUpKSB7XG4gICAgICAgICAgICAgICAgZnJvbU5vZGUucmVtb3ZlQXR0cmlidXRlTlMoYXR0ck5hbWVzcGFjZVVSSSwgYXR0ck5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCF0b05vZGUuaGFzQXR0cmlidXRlKGF0dHJOYW1lKSkge1xuICAgICAgICAgICAgICAgIGZyb21Ob2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbnZhciByYW5nZTsgLy8gQ3JlYXRlIGEgcmFuZ2Ugb2JqZWN0IGZvciBlZmZpY2VudGx5IHJlbmRlcmluZyBzdHJpbmdzIHRvIGVsZW1lbnRzLlxudmFyIE5TX1hIVE1MID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnO1xuXG52YXIgZG9jID0gdHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IGRvY3VtZW50O1xudmFyIEhBU19URU1QTEFURV9TVVBQT1JUID0gISFkb2MgJiYgJ2NvbnRlbnQnIGluIGRvYy5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xudmFyIEhBU19SQU5HRV9TVVBQT1JUID0gISFkb2MgJiYgZG9jLmNyZWF0ZVJhbmdlICYmICdjcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQnIGluIGRvYy5jcmVhdGVSYW5nZSgpO1xuXG5mdW5jdGlvbiBjcmVhdGVGcmFnbWVudEZyb21UZW1wbGF0ZShzdHIpIHtcbiAgICB2YXIgdGVtcGxhdGUgPSBkb2MuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBzdHI7XG4gICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQuY2hpbGROb2Rlc1swXTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRnJhZ21lbnRGcm9tUmFuZ2Uoc3RyKSB7XG4gICAgaWYgKCFyYW5nZSkge1xuICAgICAgICByYW5nZSA9IGRvYy5jcmVhdGVSYW5nZSgpO1xuICAgICAgICByYW5nZS5zZWxlY3ROb2RlKGRvYy5ib2R5KTtcbiAgICB9XG5cbiAgICB2YXIgZnJhZ21lbnQgPSByYW5nZS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc3RyKTtcbiAgICByZXR1cm4gZnJhZ21lbnQuY2hpbGROb2Rlc1swXTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRnJhZ21lbnRGcm9tV3JhcChzdHIpIHtcbiAgICB2YXIgZnJhZ21lbnQgPSBkb2MuY3JlYXRlRWxlbWVudCgnYm9keScpO1xuICAgIGZyYWdtZW50LmlubmVySFRNTCA9IHN0cjtcbiAgICByZXR1cm4gZnJhZ21lbnQuY2hpbGROb2Rlc1swXTtcbn1cblxuLyoqXG4gKiBUaGlzIGlzIGFib3V0IHRoZSBzYW1lXG4gKiB2YXIgaHRtbCA9IG5ldyBET01QYXJzZXIoKS5wYXJzZUZyb21TdHJpbmcoc3RyLCAndGV4dC9odG1sJyk7XG4gKiByZXR1cm4gaHRtbC5ib2R5LmZpcnN0Q2hpbGQ7XG4gKlxuICogQG1ldGhvZCB0b0VsZW1lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqL1xuZnVuY3Rpb24gdG9FbGVtZW50KHN0cikge1xuICAgIHN0ciA9IHN0ci50cmltKCk7XG4gICAgaWYgKEhBU19URU1QTEFURV9TVVBQT1JUKSB7XG4gICAgICAvLyBhdm9pZCByZXN0cmljdGlvbnMgb24gY29udGVudCBmb3IgdGhpbmdzIGxpa2UgYDx0cj48dGg+SGk8L3RoPjwvdHI+YCB3aGljaFxuICAgICAgLy8gY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50IGRvZXNuJ3Qgc3VwcG9ydFxuICAgICAgLy8gPHRlbXBsYXRlPiBzdXBwb3J0IG5vdCBhdmFpbGFibGUgaW4gSUVcbiAgICAgIHJldHVybiBjcmVhdGVGcmFnbWVudEZyb21UZW1wbGF0ZShzdHIpO1xuICAgIH0gZWxzZSBpZiAoSEFTX1JBTkdFX1NVUFBPUlQpIHtcbiAgICAgIHJldHVybiBjcmVhdGVGcmFnbWVudEZyb21SYW5nZShzdHIpO1xuICAgIH1cblxuICAgIHJldHVybiBjcmVhdGVGcmFnbWVudEZyb21XcmFwKHN0cik7XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHR3byBub2RlJ3MgbmFtZXMgYXJlIHRoZSBzYW1lLlxuICpcbiAqIE5PVEU6IFdlIGRvbid0IGJvdGhlciBjaGVja2luZyBgbmFtZXNwYWNlVVJJYCBiZWNhdXNlIHlvdSB3aWxsIG5ldmVyIGZpbmQgdHdvIEhUTUwgZWxlbWVudHMgd2l0aCB0aGUgc2FtZVxuICogICAgICAgbm9kZU5hbWUgYW5kIGRpZmZlcmVudCBuYW1lc3BhY2UgVVJJcy5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGFcbiAqIEBwYXJhbSB7RWxlbWVudH0gYiBUaGUgdGFyZ2V0IGVsZW1lbnRcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmVOb2RlTmFtZXMoZnJvbUVsLCB0b0VsKSB7XG4gICAgdmFyIGZyb21Ob2RlTmFtZSA9IGZyb21FbC5ub2RlTmFtZTtcbiAgICB2YXIgdG9Ob2RlTmFtZSA9IHRvRWwubm9kZU5hbWU7XG4gICAgdmFyIGZyb21Db2RlU3RhcnQsIHRvQ29kZVN0YXJ0O1xuXG4gICAgaWYgKGZyb21Ob2RlTmFtZSA9PT0gdG9Ob2RlTmFtZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBmcm9tQ29kZVN0YXJ0ID0gZnJvbU5vZGVOYW1lLmNoYXJDb2RlQXQoMCk7XG4gICAgdG9Db2RlU3RhcnQgPSB0b05vZGVOYW1lLmNoYXJDb2RlQXQoMCk7XG5cbiAgICAvLyBJZiB0aGUgdGFyZ2V0IGVsZW1lbnQgaXMgYSB2aXJ0dWFsIERPTSBub2RlIG9yIFNWRyBub2RlIHRoZW4gd2UgbWF5XG4gICAgLy8gbmVlZCB0byBub3JtYWxpemUgdGhlIHRhZyBuYW1lIGJlZm9yZSBjb21wYXJpbmcuIE5vcm1hbCBIVE1MIGVsZW1lbnRzIHRoYXQgYXJlXG4gICAgLy8gaW4gdGhlIFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiXG4gICAgLy8gYXJlIGNvbnZlcnRlZCB0byB1cHBlciBjYXNlXG4gICAgaWYgKGZyb21Db2RlU3RhcnQgPD0gOTAgJiYgdG9Db2RlU3RhcnQgPj0gOTcpIHsgLy8gZnJvbSBpcyB1cHBlciBhbmQgdG8gaXMgbG93ZXJcbiAgICAgICAgcmV0dXJuIGZyb21Ob2RlTmFtZSA9PT0gdG9Ob2RlTmFtZS50b1VwcGVyQ2FzZSgpO1xuICAgIH0gZWxzZSBpZiAodG9Db2RlU3RhcnQgPD0gOTAgJiYgZnJvbUNvZGVTdGFydCA+PSA5NykgeyAvLyB0byBpcyB1cHBlciBhbmQgZnJvbSBpcyBsb3dlclxuICAgICAgICByZXR1cm4gdG9Ob2RlTmFtZSA9PT0gZnJvbU5vZGVOYW1lLnRvVXBwZXJDYXNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuLyoqXG4gKiBDcmVhdGUgYW4gZWxlbWVudCwgb3B0aW9uYWxseSB3aXRoIGEga25vd24gbmFtZXNwYWNlIFVSSS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSB0aGUgZWxlbWVudCBuYW1lLCBlLmcuICdkaXYnIG9yICdzdmcnXG4gKiBAcGFyYW0ge3N0cmluZ30gW25hbWVzcGFjZVVSSV0gdGhlIGVsZW1lbnQncyBuYW1lc3BhY2UgVVJJLCBpLmUuIHRoZSB2YWx1ZSBvZlxuICogaXRzIGB4bWxuc2AgYXR0cmlidXRlIG9yIGl0cyBpbmZlcnJlZCBuYW1lc3BhY2UuXG4gKlxuICogQHJldHVybiB7RWxlbWVudH1cbiAqL1xuZnVuY3Rpb24gY3JlYXRlRWxlbWVudE5TKG5hbWUsIG5hbWVzcGFjZVVSSSkge1xuICAgIHJldHVybiAhbmFtZXNwYWNlVVJJIHx8IG5hbWVzcGFjZVVSSSA9PT0gTlNfWEhUTUwgP1xuICAgICAgICBkb2MuY3JlYXRlRWxlbWVudChuYW1lKSA6XG4gICAgICAgIGRvYy5jcmVhdGVFbGVtZW50TlMobmFtZXNwYWNlVVJJLCBuYW1lKTtcbn1cblxuLyoqXG4gKiBDb3BpZXMgdGhlIGNoaWxkcmVuIG9mIG9uZSBET00gZWxlbWVudCB0byBhbm90aGVyIERPTSBlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIG1vdmVDaGlsZHJlbihmcm9tRWwsIHRvRWwpIHtcbiAgICB2YXIgY3VyQ2hpbGQgPSBmcm9tRWwuZmlyc3RDaGlsZDtcbiAgICB3aGlsZSAoY3VyQ2hpbGQpIHtcbiAgICAgICAgdmFyIG5leHRDaGlsZCA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICB0b0VsLmFwcGVuZENoaWxkKGN1ckNoaWxkKTtcbiAgICAgICAgY3VyQ2hpbGQgPSBuZXh0Q2hpbGQ7XG4gICAgfVxuICAgIHJldHVybiB0b0VsO1xufVxuXG5mdW5jdGlvbiBzeW5jQm9vbGVhbkF0dHJQcm9wKGZyb21FbCwgdG9FbCwgbmFtZSkge1xuICAgIGlmIChmcm9tRWxbbmFtZV0gIT09IHRvRWxbbmFtZV0pIHtcbiAgICAgICAgZnJvbUVsW25hbWVdID0gdG9FbFtuYW1lXTtcbiAgICAgICAgaWYgKGZyb21FbFtuYW1lXSkge1xuICAgICAgICAgICAgZnJvbUVsLnNldEF0dHJpYnV0ZShuYW1lLCAnJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmcm9tRWwucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG52YXIgc3BlY2lhbEVsSGFuZGxlcnMgPSB7XG4gICAgT1BUSU9OOiBmdW5jdGlvbihmcm9tRWwsIHRvRWwpIHtcbiAgICAgICAgdmFyIHBhcmVudE5vZGUgPSBmcm9tRWwucGFyZW50Tm9kZTtcbiAgICAgICAgaWYgKHBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgIHZhciBwYXJlbnROYW1lID0gcGFyZW50Tm9kZS5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgaWYgKHBhcmVudE5hbWUgPT09ICdPUFRHUk9VUCcpIHtcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlID0gcGFyZW50Tm9kZS5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIHBhcmVudE5hbWUgPSBwYXJlbnROb2RlICYmIHBhcmVudE5vZGUubm9kZU5hbWUudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYXJlbnROYW1lID09PSAnU0VMRUNUJyAmJiAhcGFyZW50Tm9kZS5oYXNBdHRyaWJ1dGUoJ211bHRpcGxlJykpIHtcbiAgICAgICAgICAgICAgICBpZiAoZnJvbUVsLmhhc0F0dHJpYnV0ZSgnc2VsZWN0ZWQnKSAmJiAhdG9FbC5zZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXb3JrYXJvdW5kIGZvciBNUyBFZGdlIGJ1ZyB3aGVyZSB0aGUgJ3NlbGVjdGVkJyBhdHRyaWJ1dGUgY2FuIG9ubHkgYmVcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlZCBpZiBzZXQgdG8gYSBub24tZW1wdHkgdmFsdWU6XG4gICAgICAgICAgICAgICAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1pY3Jvc29mdC5jb20vZW4tdXMvbWljcm9zb2Z0LWVkZ2UvcGxhdGZvcm0vaXNzdWVzLzEyMDg3Njc5L1xuICAgICAgICAgICAgICAgICAgICBmcm9tRWwuc2V0QXR0cmlidXRlKCdzZWxlY3RlZCcsICdzZWxlY3RlZCcpO1xuICAgICAgICAgICAgICAgICAgICBmcm9tRWwucmVtb3ZlQXR0cmlidXRlKCdzZWxlY3RlZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBXZSBoYXZlIHRvIHJlc2V0IHNlbGVjdCBlbGVtZW50J3Mgc2VsZWN0ZWRJbmRleCB0byAtMSwgb3RoZXJ3aXNlIHNldHRpbmdcbiAgICAgICAgICAgICAgICAvLyBmcm9tRWwuc2VsZWN0ZWQgdXNpbmcgdGhlIHN5bmNCb29sZWFuQXR0clByb3AgYmVsb3cgaGFzIG5vIGVmZmVjdC5cbiAgICAgICAgICAgICAgICAvLyBUaGUgY29ycmVjdCBzZWxlY3RlZEluZGV4IHdpbGwgYmUgc2V0IGluIHRoZSBTRUxFQ1Qgc3BlY2lhbCBoYW5kbGVyIGJlbG93LlxuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuc2VsZWN0ZWRJbmRleCA9IC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHN5bmNCb29sZWFuQXR0clByb3AoZnJvbUVsLCB0b0VsLCAnc2VsZWN0ZWQnKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFRoZSBcInZhbHVlXCIgYXR0cmlidXRlIGlzIHNwZWNpYWwgZm9yIHRoZSA8aW5wdXQ+IGVsZW1lbnQgc2luY2UgaXQgc2V0c1xuICAgICAqIHRoZSBpbml0aWFsIHZhbHVlLiBDaGFuZ2luZyB0aGUgXCJ2YWx1ZVwiIGF0dHJpYnV0ZSB3aXRob3V0IGNoYW5naW5nIHRoZVxuICAgICAqIFwidmFsdWVcIiBwcm9wZXJ0eSB3aWxsIGhhdmUgbm8gZWZmZWN0IHNpbmNlIGl0IGlzIG9ubHkgdXNlZCB0byB0aGUgc2V0IHRoZVxuICAgICAqIGluaXRpYWwgdmFsdWUuICBTaW1pbGFyIGZvciB0aGUgXCJjaGVja2VkXCIgYXR0cmlidXRlLCBhbmQgXCJkaXNhYmxlZFwiLlxuICAgICAqL1xuICAgIElOUFVUOiBmdW5jdGlvbihmcm9tRWwsIHRvRWwpIHtcbiAgICAgICAgc3luY0Jvb2xlYW5BdHRyUHJvcChmcm9tRWwsIHRvRWwsICdjaGVja2VkJyk7XG4gICAgICAgIHN5bmNCb29sZWFuQXR0clByb3AoZnJvbUVsLCB0b0VsLCAnZGlzYWJsZWQnKTtcblxuICAgICAgICBpZiAoZnJvbUVsLnZhbHVlICE9PSB0b0VsLnZhbHVlKSB7XG4gICAgICAgICAgICBmcm9tRWwudmFsdWUgPSB0b0VsLnZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0b0VsLmhhc0F0dHJpYnV0ZSgndmFsdWUnKSkge1xuICAgICAgICAgICAgZnJvbUVsLnJlbW92ZUF0dHJpYnV0ZSgndmFsdWUnKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBURVhUQVJFQTogZnVuY3Rpb24oZnJvbUVsLCB0b0VsKSB7XG4gICAgICAgIHZhciBuZXdWYWx1ZSA9IHRvRWwudmFsdWU7XG4gICAgICAgIGlmIChmcm9tRWwudmFsdWUgIT09IG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICBmcm9tRWwudmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBmaXJzdENoaWxkID0gZnJvbUVsLmZpcnN0Q2hpbGQ7XG4gICAgICAgIGlmIChmaXJzdENoaWxkKSB7XG4gICAgICAgICAgICAvLyBOZWVkZWQgZm9yIElFLiBBcHBhcmVudGx5IElFIHNldHMgdGhlIHBsYWNlaG9sZGVyIGFzIHRoZVxuICAgICAgICAgICAgLy8gbm9kZSB2YWx1ZSBhbmQgdmlzZSB2ZXJzYS4gVGhpcyBpZ25vcmVzIGFuIGVtcHR5IHVwZGF0ZS5cbiAgICAgICAgICAgIHZhciBvbGRWYWx1ZSA9IGZpcnN0Q2hpbGQubm9kZVZhbHVlO1xuXG4gICAgICAgICAgICBpZiAob2xkVmFsdWUgPT0gbmV3VmFsdWUgfHwgKCFuZXdWYWx1ZSAmJiBvbGRWYWx1ZSA9PSBmcm9tRWwucGxhY2Vob2xkZXIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmaXJzdENoaWxkLm5vZGVWYWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBTRUxFQ1Q6IGZ1bmN0aW9uKGZyb21FbCwgdG9FbCkge1xuICAgICAgICBpZiAoIXRvRWwuaGFzQXR0cmlidXRlKCdtdWx0aXBsZScpKSB7XG4gICAgICAgICAgICB2YXIgc2VsZWN0ZWRJbmRleCA9IC0xO1xuICAgICAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICAgICAgLy8gV2UgaGF2ZSB0byBsb29wIHRocm91Z2ggY2hpbGRyZW4gb2YgZnJvbUVsLCBub3QgdG9FbCBzaW5jZSBub2RlcyBjYW4gYmUgbW92ZWRcbiAgICAgICAgICAgIC8vIGZyb20gdG9FbCB0byBmcm9tRWwgZGlyZWN0bHkgd2hlbiBtb3JwaGluZy5cbiAgICAgICAgICAgIC8vIEF0IHRoZSB0aW1lIHRoaXMgc3BlY2lhbCBoYW5kbGVyIGlzIGludm9rZWQsIGFsbCBjaGlsZHJlbiBoYXZlIGFscmVhZHkgYmVlbiBtb3JwaGVkXG4gICAgICAgICAgICAvLyBhbmQgYXBwZW5kZWQgdG8gLyByZW1vdmVkIGZyb20gZnJvbUVsLCBzbyB1c2luZyBmcm9tRWwgaGVyZSBpcyBzYWZlIGFuZCBjb3JyZWN0LlxuICAgICAgICAgICAgdmFyIGN1ckNoaWxkID0gZnJvbUVsLmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgICB2YXIgb3B0Z3JvdXA7XG4gICAgICAgICAgICB2YXIgbm9kZU5hbWU7XG4gICAgICAgICAgICB3aGlsZShjdXJDaGlsZCkge1xuICAgICAgICAgICAgICAgIG5vZGVOYW1lID0gY3VyQ2hpbGQubm9kZU5hbWUgJiYgY3VyQ2hpbGQubm9kZU5hbWUudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICBpZiAobm9kZU5hbWUgPT09ICdPUFRHUk9VUCcpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0Z3JvdXAgPSBjdXJDaGlsZDtcbiAgICAgICAgICAgICAgICAgICAgY3VyQ2hpbGQgPSBvcHRncm91cC5maXJzdENoaWxkO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlTmFtZSA9PT0gJ09QVElPTicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJDaGlsZC5oYXNBdHRyaWJ1dGUoJ3NlbGVjdGVkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjdXJDaGlsZCA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWN1ckNoaWxkICYmIG9wdGdyb3VwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJDaGlsZCA9IG9wdGdyb3VwLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0Z3JvdXAgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmcm9tRWwuc2VsZWN0ZWRJbmRleCA9IHNlbGVjdGVkSW5kZXg7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG52YXIgRUxFTUVOVF9OT0RFID0gMTtcbnZhciBET0NVTUVOVF9GUkFHTUVOVF9OT0RFJDEgPSAxMTtcbnZhciBURVhUX05PREUgPSAzO1xudmFyIENPTU1FTlRfTk9ERSA9IDg7XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5mdW5jdGlvbiBkZWZhdWx0R2V0Tm9kZUtleShub2RlKSB7XG4gIGlmIChub2RlKSB7XG4gICAgICByZXR1cm4gKG5vZGUuZ2V0QXR0cmlidXRlICYmIG5vZGUuZ2V0QXR0cmlidXRlKCdpZCcpKSB8fCBub2RlLmlkO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1vcnBoZG9tRmFjdG9yeShtb3JwaEF0dHJzKSB7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbW9ycGhkb20oZnJvbU5vZGUsIHRvTm9kZSwgb3B0aW9ucykge1xuICAgICAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgdG9Ob2RlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgaWYgKGZyb21Ob2RlLm5vZGVOYW1lID09PSAnI2RvY3VtZW50JyB8fCBmcm9tTm9kZS5ub2RlTmFtZSA9PT0gJ0hUTUwnIHx8IGZyb21Ob2RlLm5vZGVOYW1lID09PSAnQk9EWScpIHtcbiAgICAgICAgICAgICAgICB2YXIgdG9Ob2RlSHRtbCA9IHRvTm9kZTtcbiAgICAgICAgICAgICAgICB0b05vZGUgPSBkb2MuY3JlYXRlRWxlbWVudCgnaHRtbCcpO1xuICAgICAgICAgICAgICAgIHRvTm9kZS5pbm5lckhUTUwgPSB0b05vZGVIdG1sO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0b05vZGUgPSB0b0VsZW1lbnQodG9Ob2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBnZXROb2RlS2V5ID0gb3B0aW9ucy5nZXROb2RlS2V5IHx8IGRlZmF1bHRHZXROb2RlS2V5O1xuICAgICAgICB2YXIgb25CZWZvcmVOb2RlQWRkZWQgPSBvcHRpb25zLm9uQmVmb3JlTm9kZUFkZGVkIHx8IG5vb3A7XG4gICAgICAgIHZhciBvbk5vZGVBZGRlZCA9IG9wdGlvbnMub25Ob2RlQWRkZWQgfHwgbm9vcDtcbiAgICAgICAgdmFyIG9uQmVmb3JlRWxVcGRhdGVkID0gb3B0aW9ucy5vbkJlZm9yZUVsVXBkYXRlZCB8fCBub29wO1xuICAgICAgICB2YXIgb25FbFVwZGF0ZWQgPSBvcHRpb25zLm9uRWxVcGRhdGVkIHx8IG5vb3A7XG4gICAgICAgIHZhciBvbkJlZm9yZU5vZGVEaXNjYXJkZWQgPSBvcHRpb25zLm9uQmVmb3JlTm9kZURpc2NhcmRlZCB8fCBub29wO1xuICAgICAgICB2YXIgb25Ob2RlRGlzY2FyZGVkID0gb3B0aW9ucy5vbk5vZGVEaXNjYXJkZWQgfHwgbm9vcDtcbiAgICAgICAgdmFyIG9uQmVmb3JlRWxDaGlsZHJlblVwZGF0ZWQgPSBvcHRpb25zLm9uQmVmb3JlRWxDaGlsZHJlblVwZGF0ZWQgfHwgbm9vcDtcbiAgICAgICAgdmFyIGNoaWxkcmVuT25seSA9IG9wdGlvbnMuY2hpbGRyZW5Pbmx5ID09PSB0cnVlO1xuXG4gICAgICAgIC8vIFRoaXMgb2JqZWN0IGlzIHVzZWQgYXMgYSBsb29rdXAgdG8gcXVpY2tseSBmaW5kIGFsbCBrZXllZCBlbGVtZW50cyBpbiB0aGUgb3JpZ2luYWwgRE9NIHRyZWUuXG4gICAgICAgIHZhciBmcm9tTm9kZXNMb29rdXAgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICB2YXIga2V5ZWRSZW1vdmFsTGlzdCA9IFtdO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFkZEtleWVkUmVtb3ZhbChrZXkpIHtcbiAgICAgICAgICAgIGtleWVkUmVtb3ZhbExpc3QucHVzaChrZXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gd2Fsa0Rpc2NhcmRlZENoaWxkTm9kZXMobm9kZSwgc2tpcEtleWVkTm9kZXMpIHtcbiAgICAgICAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSBFTEVNRU5UX05PREUpIHtcbiAgICAgICAgICAgICAgICB2YXIgY3VyQ2hpbGQgPSBub2RlLmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgICAgICAgd2hpbGUgKGN1ckNoaWxkKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGtleSA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc2tpcEtleWVkTm9kZXMgJiYgKGtleSA9IGdldE5vZGVLZXkoY3VyQ2hpbGQpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgd2UgYXJlIHNraXBwaW5nIGtleWVkIG5vZGVzIHRoZW4gd2UgYWRkIHRoZSBrZXlcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRvIGEgbGlzdCBzbyB0aGF0IGl0IGNhbiBiZSBoYW5kbGVkIGF0IHRoZSB2ZXJ5IGVuZC5cbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZEtleWVkUmVtb3ZhbChrZXkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gT25seSByZXBvcnQgdGhlIG5vZGUgYXMgZGlzY2FyZGVkIGlmIGl0IGlzIG5vdCBrZXllZC4gV2UgZG8gdGhpcyBiZWNhdXNlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhdCB0aGUgZW5kIHdlIGxvb3AgdGhyb3VnaCBhbGwga2V5ZWQgZWxlbWVudHMgdGhhdCB3ZXJlIHVubWF0Y2hlZFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYW5kIHRoZW4gZGlzY2FyZCB0aGVtIGluIG9uZSBmaW5hbCBwYXNzLlxuICAgICAgICAgICAgICAgICAgICAgICAgb25Ob2RlRGlzY2FyZGVkKGN1ckNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJDaGlsZC5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2Fsa0Rpc2NhcmRlZENoaWxkTm9kZXMoY3VyQ2hpbGQsIHNraXBLZXllZE5vZGVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGN1ckNoaWxkID0gY3VyQ2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZXMgYSBET00gbm9kZSBvdXQgb2YgdGhlIG9yaWdpbmFsIERPTVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gIHtOb2RlfSBub2RlIFRoZSBub2RlIHRvIHJlbW92ZVxuICAgICAgICAgKiBAcGFyYW0gIHtOb2RlfSBwYXJlbnROb2RlIFRoZSBub2RlcyBwYXJlbnRcbiAgICAgICAgICogQHBhcmFtICB7Qm9vbGVhbn0gc2tpcEtleWVkTm9kZXMgSWYgdHJ1ZSB0aGVuIGVsZW1lbnRzIHdpdGgga2V5cyB3aWxsIGJlIHNraXBwZWQgYW5kIG5vdCBkaXNjYXJkZWQuXG4gICAgICAgICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZU5vZGUobm9kZSwgcGFyZW50Tm9kZSwgc2tpcEtleWVkTm9kZXMpIHtcbiAgICAgICAgICAgIGlmIChvbkJlZm9yZU5vZGVEaXNjYXJkZWQobm9kZSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG9uTm9kZURpc2NhcmRlZChub2RlKTtcbiAgICAgICAgICAgIHdhbGtEaXNjYXJkZWRDaGlsZE5vZGVzKG5vZGUsIHNraXBLZXllZE5vZGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC8vIFRyZWVXYWxrZXIgaW1wbGVtZW50YXRpb24gaXMgbm8gZmFzdGVyLCBidXQga2VlcGluZyB0aGlzIGFyb3VuZCBpbiBjYXNlIHRoaXMgY2hhbmdlcyBpbiB0aGUgZnV0dXJlXG4gICAgICAgIC8vIGZ1bmN0aW9uIGluZGV4VHJlZShyb290KSB7XG4gICAgICAgIC8vICAgICB2YXIgdHJlZVdhbGtlciA9IGRvY3VtZW50LmNyZWF0ZVRyZWVXYWxrZXIoXG4gICAgICAgIC8vICAgICAgICAgcm9vdCxcbiAgICAgICAgLy8gICAgICAgICBOb2RlRmlsdGVyLlNIT1dfRUxFTUVOVCk7XG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgICB2YXIgZWw7XG4gICAgICAgIC8vICAgICB3aGlsZSgoZWwgPSB0cmVlV2Fsa2VyLm5leHROb2RlKCkpKSB7XG4gICAgICAgIC8vICAgICAgICAgdmFyIGtleSA9IGdldE5vZGVLZXkoZWwpO1xuICAgICAgICAvLyAgICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgZnJvbU5vZGVzTG9va3VwW2tleV0gPSBlbDtcbiAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vIH1cblxuICAgICAgICAvLyAvLyBOb2RlSXRlcmF0b3IgaW1wbGVtZW50YXRpb24gaXMgbm8gZmFzdGVyLCBidXQga2VlcGluZyB0aGlzIGFyb3VuZCBpbiBjYXNlIHRoaXMgY2hhbmdlcyBpbiB0aGUgZnV0dXJlXG4gICAgICAgIC8vXG4gICAgICAgIC8vIGZ1bmN0aW9uIGluZGV4VHJlZShub2RlKSB7XG4gICAgICAgIC8vICAgICB2YXIgbm9kZUl0ZXJhdG9yID0gZG9jdW1lbnQuY3JlYXRlTm9kZUl0ZXJhdG9yKG5vZGUsIE5vZGVGaWx0ZXIuU0hPV19FTEVNRU5UKTtcbiAgICAgICAgLy8gICAgIHZhciBlbDtcbiAgICAgICAgLy8gICAgIHdoaWxlKChlbCA9IG5vZGVJdGVyYXRvci5uZXh0Tm9kZSgpKSkge1xuICAgICAgICAvLyAgICAgICAgIHZhciBrZXkgPSBnZXROb2RlS2V5KGVsKTtcbiAgICAgICAgLy8gICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgIC8vICAgICAgICAgICAgIGZyb21Ob2Rlc0xvb2t1cFtrZXldID0gZWw7XG4gICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyB9XG5cbiAgICAgICAgZnVuY3Rpb24gaW5kZXhUcmVlKG5vZGUpIHtcbiAgICAgICAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSBFTEVNRU5UX05PREUgfHwgbm9kZS5ub2RlVHlwZSA9PT0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERSQxKSB7XG4gICAgICAgICAgICAgICAgdmFyIGN1ckNoaWxkID0gbm9kZS5maXJzdENoaWxkO1xuICAgICAgICAgICAgICAgIHdoaWxlIChjdXJDaGlsZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIga2V5ID0gZ2V0Tm9kZUtleShjdXJDaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb21Ob2Rlc0xvb2t1cFtrZXldID0gY3VyQ2hpbGQ7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBXYWxrIHJlY3Vyc2l2ZWx5XG4gICAgICAgICAgICAgICAgICAgIGluZGV4VHJlZShjdXJDaGlsZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgY3VyQ2hpbGQgPSBjdXJDaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpbmRleFRyZWUoZnJvbU5vZGUpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZU5vZGVBZGRlZChlbCkge1xuICAgICAgICAgICAgb25Ob2RlQWRkZWQoZWwpO1xuXG4gICAgICAgICAgICB2YXIgY3VyQ2hpbGQgPSBlbC5maXJzdENoaWxkO1xuICAgICAgICAgICAgd2hpbGUgKGN1ckNoaWxkKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5leHRTaWJsaW5nID0gY3VyQ2hpbGQubmV4dFNpYmxpbmc7XG5cbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gZ2V0Tm9kZUtleShjdXJDaGlsZCk7XG4gICAgICAgICAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdW5tYXRjaGVkRnJvbUVsID0gZnJvbU5vZGVzTG9va3VwW2tleV07XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHdlIGZpbmQgYSBkdXBsaWNhdGUgI2lkIG5vZGUgaW4gY2FjaGUsIHJlcGxhY2UgYGVsYCB3aXRoIGNhY2hlIHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIC8vIGFuZCBtb3JwaCBpdCB0byB0aGUgY2hpbGQgbm9kZS5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHVubWF0Y2hlZEZyb21FbCAmJiBjb21wYXJlTm9kZU5hbWVzKGN1ckNoaWxkLCB1bm1hdGNoZWRGcm9tRWwpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJDaGlsZC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZCh1bm1hdGNoZWRGcm9tRWwsIGN1ckNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vcnBoRWwodW5tYXRjaGVkRnJvbUVsLCBjdXJDaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgaGFuZGxlTm9kZUFkZGVkKGN1ckNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAvLyByZWN1cnNpdmVseSBjYWxsIGZvciBjdXJDaGlsZCBhbmQgaXQncyBjaGlsZHJlbiB0byBzZWUgaWYgd2UgZmluZCBzb21ldGhpbmcgaW5cbiAgICAgICAgICAgICAgICAgIC8vIGZyb21Ob2Rlc0xvb2t1cFxuICAgICAgICAgICAgICAgICAgaGFuZGxlTm9kZUFkZGVkKGN1ckNoaWxkKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjdXJDaGlsZCA9IG5leHRTaWJsaW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2xlYW51cEZyb21FbChmcm9tRWwsIGN1ckZyb21Ob2RlQ2hpbGQsIGN1ckZyb21Ob2RlS2V5KSB7XG4gICAgICAgICAgICAvLyBXZSBoYXZlIHByb2Nlc3NlZCBhbGwgb2YgdGhlIFwidG8gbm9kZXNcIi4gSWYgY3VyRnJvbU5vZGVDaGlsZCBpc1xuICAgICAgICAgICAgLy8gbm9uLW51bGwgdGhlbiB3ZSBzdGlsbCBoYXZlIHNvbWUgZnJvbSBub2RlcyBsZWZ0IG92ZXIgdGhhdCBuZWVkXG4gICAgICAgICAgICAvLyB0byBiZSByZW1vdmVkXG4gICAgICAgICAgICB3aGlsZSAoY3VyRnJvbU5vZGVDaGlsZCkge1xuICAgICAgICAgICAgICAgIHZhciBmcm9tTmV4dFNpYmxpbmcgPSBjdXJGcm9tTm9kZUNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIGlmICgoY3VyRnJvbU5vZGVLZXkgPSBnZXROb2RlS2V5KGN1ckZyb21Ob2RlQ2hpbGQpKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBTaW5jZSB0aGUgbm9kZSBpcyBrZXllZCBpdCBtaWdodCBiZSBtYXRjaGVkIHVwIGxhdGVyIHNvIHdlIGRlZmVyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSBhY3R1YWwgcmVtb3ZhbCB0byBsYXRlclxuICAgICAgICAgICAgICAgICAgICBhZGRLZXllZFJlbW92YWwoY3VyRnJvbU5vZGVLZXkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIE5PVEU6IHdlIHNraXAgbmVzdGVkIGtleWVkIG5vZGVzIGZyb20gYmVpbmcgcmVtb3ZlZCBzaW5jZSB0aGVyZSBpc1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICBzdGlsbCBhIGNoYW5jZSB0aGV5IHdpbGwgYmUgbWF0Y2hlZCB1cCBsYXRlclxuICAgICAgICAgICAgICAgICAgICByZW1vdmVOb2RlKGN1ckZyb21Ob2RlQ2hpbGQsIGZyb21FbCwgdHJ1ZSAvKiBza2lwIGtleWVkIG5vZGVzICovKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG1vcnBoRWwoZnJvbUVsLCB0b0VsLCBjaGlsZHJlbk9ubHkpIHtcbiAgICAgICAgICAgIHZhciB0b0VsS2V5ID0gZ2V0Tm9kZUtleSh0b0VsKTtcblxuICAgICAgICAgICAgaWYgKHRvRWxLZXkpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiBhbiBlbGVtZW50IHdpdGggYW4gSUQgaXMgYmVpbmcgbW9ycGhlZCB0aGVuIGl0IHdpbGwgYmUgaW4gdGhlIGZpbmFsXG4gICAgICAgICAgICAgICAgLy8gRE9NIHNvIGNsZWFyIGl0IG91dCBvZiB0aGUgc2F2ZWQgZWxlbWVudHMgY29sbGVjdGlvblxuICAgICAgICAgICAgICAgIGRlbGV0ZSBmcm9tTm9kZXNMb29rdXBbdG9FbEtleV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghY2hpbGRyZW5Pbmx5KSB7XG4gICAgICAgICAgICAgICAgLy8gb3B0aW9uYWxcbiAgICAgICAgICAgICAgICBpZiAob25CZWZvcmVFbFVwZGF0ZWQoZnJvbUVsLCB0b0VsKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSBhdHRyaWJ1dGVzIG9uIG9yaWdpbmFsIERPTSBlbGVtZW50IGZpcnN0XG4gICAgICAgICAgICAgICAgbW9ycGhBdHRycyhmcm9tRWwsIHRvRWwpO1xuICAgICAgICAgICAgICAgIC8vIG9wdGlvbmFsXG4gICAgICAgICAgICAgICAgb25FbFVwZGF0ZWQoZnJvbUVsKTtcblxuICAgICAgICAgICAgICAgIGlmIChvbkJlZm9yZUVsQ2hpbGRyZW5VcGRhdGVkKGZyb21FbCwgdG9FbCkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChmcm9tRWwubm9kZU5hbWUgIT09ICdURVhUQVJFQScpIHtcbiAgICAgICAgICAgICAgbW9ycGhDaGlsZHJlbihmcm9tRWwsIHRvRWwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc3BlY2lhbEVsSGFuZGxlcnMuVEVYVEFSRUEoZnJvbUVsLCB0b0VsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG1vcnBoQ2hpbGRyZW4oZnJvbUVsLCB0b0VsKSB7XG4gICAgICAgICAgICB2YXIgY3VyVG9Ob2RlQ2hpbGQgPSB0b0VsLmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgICB2YXIgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21FbC5maXJzdENoaWxkO1xuICAgICAgICAgICAgdmFyIGN1clRvTm9kZUtleTtcbiAgICAgICAgICAgIHZhciBjdXJGcm9tTm9kZUtleTtcblxuICAgICAgICAgICAgdmFyIGZyb21OZXh0U2libGluZztcbiAgICAgICAgICAgIHZhciB0b05leHRTaWJsaW5nO1xuICAgICAgICAgICAgdmFyIG1hdGNoaW5nRnJvbUVsO1xuXG4gICAgICAgICAgICAvLyB3YWxrIHRoZSBjaGlsZHJlblxuICAgICAgICAgICAgb3V0ZXI6IHdoaWxlIChjdXJUb05vZGVDaGlsZCkge1xuICAgICAgICAgICAgICAgIHRvTmV4dFNpYmxpbmcgPSBjdXJUb05vZGVDaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgICAgICAgICBjdXJUb05vZGVLZXkgPSBnZXROb2RlS2V5KGN1clRvTm9kZUNoaWxkKTtcblxuICAgICAgICAgICAgICAgIC8vIHdhbGsgdGhlIGZyb21Ob2RlIGNoaWxkcmVuIGFsbCB0aGUgd2F5IHRocm91Z2hcbiAgICAgICAgICAgICAgICB3aGlsZSAoY3VyRnJvbU5vZGVDaGlsZCkge1xuICAgICAgICAgICAgICAgICAgICBmcm9tTmV4dFNpYmxpbmcgPSBjdXJGcm9tTm9kZUNoaWxkLm5leHRTaWJsaW5nO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJUb05vZGVDaGlsZC5pc1NhbWVOb2RlICYmIGN1clRvTm9kZUNoaWxkLmlzU2FtZU5vZGUoY3VyRnJvbU5vZGVDaGlsZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkID0gdG9OZXh0U2libGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZSBvdXRlcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlS2V5ID0gZ2V0Tm9kZUtleShjdXJGcm9tTm9kZUNoaWxkKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgY3VyRnJvbU5vZGVUeXBlID0gY3VyRnJvbU5vZGVDaGlsZC5ub2RlVHlwZTtcblxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzIG1lYW5zIGlmIHRoZSBjdXJGcm9tTm9kZUNoaWxkIGRvZXNudCBoYXZlIGEgbWF0Y2ggd2l0aCB0aGUgY3VyVG9Ob2RlQ2hpbGRcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlzQ29tcGF0aWJsZSA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VyRnJvbU5vZGVUeXBlID09PSBjdXJUb05vZGVDaGlsZC5ub2RlVHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1ckZyb21Ob2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQm90aCBub2RlcyBiZWluZyBjb21wYXJlZCBhcmUgRWxlbWVudCBub2Rlc1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1clRvTm9kZUtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgdGFyZ2V0IG5vZGUgaGFzIGEga2V5IHNvIHdlIHdhbnQgdG8gbWF0Y2ggaXQgdXAgd2l0aCB0aGUgY29ycmVjdCBlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGluIHRoZSBvcmlnaW5hbCBET00gdHJlZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyVG9Ob2RlS2V5ICE9PSBjdXJGcm9tTm9kZUtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlIGN1cnJlbnQgZWxlbWVudCBpbiB0aGUgb3JpZ2luYWwgRE9NIHRyZWUgZG9lcyBub3QgaGF2ZSBhIG1hdGNoaW5nIGtleSBzb1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbGV0J3MgY2hlY2sgb3VyIGxvb2t1cCB0byBzZWUgaWYgdGhlcmUgaXMgYSBtYXRjaGluZyBlbGVtZW50IGluIHRoZSBvcmlnaW5hbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRE9NIHRyZWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgobWF0Y2hpbmdGcm9tRWwgPSBmcm9tTm9kZXNMb29rdXBbY3VyVG9Ob2RlS2V5XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZnJvbU5leHRTaWJsaW5nID09PSBtYXRjaGluZ0Zyb21FbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTcGVjaWFsIGNhc2UgZm9yIHNpbmdsZSBlbGVtZW50IHJlbW92YWxzLiBUbyBhdm9pZCByZW1vdmluZyB0aGUgb3JpZ2luYWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRE9NIG5vZGUgb3V0IG9mIHRoZSB0cmVlIChzaW5jZSB0aGF0IGNhbiBicmVhayBDU1MgdHJhbnNpdGlvbnMsIGV0Yy4pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3ZSB3aWxsIGluc3RlYWQgZGlzY2FyZCB0aGUgY3VycmVudCBub2RlIGFuZCB3YWl0IHVudGlsIHRoZSBuZXh0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGl0ZXJhdGlvbiB0byBwcm9wZXJseSBtYXRjaCB1cCB0aGUga2V5ZWQgdGFyZ2V0IGVsZW1lbnQgd2l0aCBpdHMgbWF0Y2hpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZWxlbWVudCBpbiB0aGUgb3JpZ2luYWwgdHJlZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0NvbXBhdGlibGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSBmb3VuZCBhIG1hdGNoaW5nIGtleWVkIGVsZW1lbnQgc29tZXdoZXJlIGluIHRoZSBvcmlnaW5hbCBET00gdHJlZS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTGV0J3MgbW92ZSB0aGUgb3JpZ2luYWwgRE9NIG5vZGUgaW50byB0aGUgY3VycmVudCBwb3NpdGlvbiBhbmQgbW9ycGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaXQuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTk9URTogV2UgdXNlIGluc2VydEJlZm9yZSBpbnN0ZWFkIG9mIHJlcGxhY2VDaGlsZCBiZWNhdXNlIHdlIHdhbnQgdG8gZ28gdGhyb3VnaFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgYHJlbW92ZU5vZGUoKWAgZnVuY3Rpb24gZm9yIHRoZSBub2RlIHRoYXQgaXMgYmVpbmcgZGlzY2FyZGVkIHNvIHRoYXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWxsIGxpZmVjeWNsZSBob29rcyBhcmUgY29ycmVjdGx5IGludm9rZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbUVsLmluc2VydEJlZm9yZShtYXRjaGluZ0Zyb21FbCwgY3VyRnJvbU5vZGVDaGlsZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZnJvbU5leHRTaWJsaW5nID0gY3VyRnJvbU5vZGVDaGlsZC5uZXh0U2libGluZztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyRnJvbU5vZGVLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNpbmNlIHRoZSBub2RlIGlzIGtleWVkIGl0IG1pZ2h0IGJlIG1hdGNoZWQgdXAgbGF0ZXIgc28gd2UgZGVmZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZSBhY3R1YWwgcmVtb3ZhbCB0byBsYXRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkS2V5ZWRSZW1vdmFsKGN1ckZyb21Ob2RlS2V5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5PVEU6IHdlIHNraXAgbmVzdGVkIGtleWVkIG5vZGVzIGZyb20gYmVpbmcgcmVtb3ZlZCBzaW5jZSB0aGVyZSBpc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgc3RpbGwgYSBjaGFuY2UgdGhleSB3aWxsIGJlIG1hdGNoZWQgdXAgbGF0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZU5vZGUoY3VyRnJvbU5vZGVDaGlsZCwgZnJvbUVsLCB0cnVlIC8qIHNraXAga2V5ZWQgbm9kZXMgKi8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IG1hdGNoaW5nRnJvbUVsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlIG5vZGVzIGFyZSBub3QgY29tcGF0aWJsZSBzaW5jZSB0aGUgXCJ0b1wiIG5vZGUgaGFzIGEga2V5IGFuZCB0aGVyZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlzIG5vIG1hdGNoaW5nIGtleWVkIG5vZGUgaW4gdGhlIHNvdXJjZSB0cmVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNDb21wYXRpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGN1ckZyb21Ob2RlS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBvcmlnaW5hbCBoYXMgYSBrZXlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNDb21wYXRpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNDb21wYXRpYmxlID0gaXNDb21wYXRpYmxlICE9PSBmYWxzZSAmJiBjb21wYXJlTm9kZU5hbWVzKGN1ckZyb21Ob2RlQ2hpbGQsIGN1clRvTm9kZUNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNDb21wYXRpYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlIGZvdW5kIGNvbXBhdGlibGUgRE9NIGVsZW1lbnRzIHNvIHRyYW5zZm9ybVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgY3VycmVudCBcImZyb21cIiBub2RlIHRvIG1hdGNoIHRoZSBjdXJyZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRhcmdldCBET00gbm9kZS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTU9SUEhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9ycGhFbChjdXJGcm9tTm9kZUNoaWxkLCBjdXJUb05vZGVDaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGN1ckZyb21Ob2RlVHlwZSA9PT0gVEVYVF9OT0RFIHx8IGN1ckZyb21Ob2RlVHlwZSA9PSBDT01NRU5UX05PREUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBCb3RoIG5vZGVzIGJlaW5nIGNvbXBhcmVkIGFyZSBUZXh0IG9yIENvbW1lbnQgbm9kZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0NvbXBhdGlibGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNpbXBseSB1cGRhdGUgbm9kZVZhbHVlIG9uIHRoZSBvcmlnaW5hbCBub2RlIHRvXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2hhbmdlIHRoZSB0ZXh0IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1ckZyb21Ob2RlQ2hpbGQubm9kZVZhbHVlICE9PSBjdXJUb05vZGVDaGlsZC5ub2RlVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZC5ub2RlVmFsdWUgPSBjdXJUb05vZGVDaGlsZC5ub2RlVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNDb21wYXRpYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBZHZhbmNlIGJvdGggdGhlIFwidG9cIiBjaGlsZCBhbmQgdGhlIFwiZnJvbVwiIGNoaWxkIHNpbmNlIHdlIGZvdW5kIGEgbWF0Y2hcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5vdGhpbmcgZWxzZSB0byBkbyBhcyB3ZSBhbHJlYWR5IHJlY3Vyc2l2ZWx5IGNhbGxlZCBtb3JwaENoaWxkcmVuIGFib3ZlXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCA9IHRvTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbU5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWUgb3V0ZXI7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBObyBjb21wYXRpYmxlIG1hdGNoIHNvIHJlbW92ZSB0aGUgb2xkIG5vZGUgZnJvbSB0aGUgRE9NIGFuZCBjb250aW51ZSB0cnlpbmcgdG8gZmluZCBhXG4gICAgICAgICAgICAgICAgICAgIC8vIG1hdGNoIGluIHRoZSBvcmlnaW5hbCBET00uIEhvd2V2ZXIsIHdlIG9ubHkgZG8gdGhpcyBpZiB0aGUgZnJvbSBub2RlIGlzIG5vdCBrZXllZFxuICAgICAgICAgICAgICAgICAgICAvLyBzaW5jZSBpdCBpcyBwb3NzaWJsZSB0aGF0IGEga2V5ZWQgbm9kZSBtaWdodCBtYXRjaCB1cCB3aXRoIGEgbm9kZSBzb21ld2hlcmUgZWxzZSBpbiB0aGVcbiAgICAgICAgICAgICAgICAgICAgLy8gdGFyZ2V0IHRyZWUgYW5kIHdlIGRvbid0IHdhbnQgdG8gZGlzY2FyZCBpdCBqdXN0IHlldCBzaW5jZSBpdCBzdGlsbCBtaWdodCBmaW5kIGFcbiAgICAgICAgICAgICAgICAgICAgLy8gaG9tZSBpbiB0aGUgZmluYWwgRE9NIHRyZWUuIEFmdGVyIGV2ZXJ5dGhpbmcgaXMgZG9uZSB3ZSB3aWxsIHJlbW92ZSBhbnkga2V5ZWQgbm9kZXNcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhhdCBkaWRuJ3QgZmluZCBhIGhvbWVcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1ckZyb21Ob2RlS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTaW5jZSB0aGUgbm9kZSBpcyBrZXllZCBpdCBtaWdodCBiZSBtYXRjaGVkIHVwIGxhdGVyIHNvIHdlIGRlZmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgYWN0dWFsIHJlbW92YWwgdG8gbGF0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZEtleWVkUmVtb3ZhbChjdXJGcm9tTm9kZUtleSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBOT1RFOiB3ZSBza2lwIG5lc3RlZCBrZXllZCBub2RlcyBmcm9tIGJlaW5nIHJlbW92ZWQgc2luY2UgdGhlcmUgaXNcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgIHN0aWxsIGEgY2hhbmNlIHRoZXkgd2lsbCBiZSBtYXRjaGVkIHVwIGxhdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVOb2RlKGN1ckZyb21Ob2RlQ2hpbGQsIGZyb21FbCwgdHJ1ZSAvKiBza2lwIGtleWVkIG5vZGVzICovKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgfSAvLyBFTkQ6IHdoaWxlKGN1ckZyb21Ob2RlQ2hpbGQpIHt9XG5cbiAgICAgICAgICAgICAgICAvLyBJZiB3ZSBnb3QgdGhpcyBmYXIgdGhlbiB3ZSBkaWQgbm90IGZpbmQgYSBjYW5kaWRhdGUgbWF0Y2ggZm9yXG4gICAgICAgICAgICAgICAgLy8gb3VyIFwidG8gbm9kZVwiIGFuZCB3ZSBleGhhdXN0ZWQgYWxsIG9mIHRoZSBjaGlsZHJlbiBcImZyb21cIlxuICAgICAgICAgICAgICAgIC8vIG5vZGVzLiBUaGVyZWZvcmUsIHdlIHdpbGwganVzdCBhcHBlbmQgdGhlIGN1cnJlbnQgXCJ0b1wiIG5vZGVcbiAgICAgICAgICAgICAgICAvLyB0byB0aGUgZW5kXG4gICAgICAgICAgICAgICAgaWYgKGN1clRvTm9kZUtleSAmJiAobWF0Y2hpbmdGcm9tRWwgPSBmcm9tTm9kZXNMb29rdXBbY3VyVG9Ob2RlS2V5XSkgJiYgY29tcGFyZU5vZGVOYW1lcyhtYXRjaGluZ0Zyb21FbCwgY3VyVG9Ob2RlQ2hpbGQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZyb21FbC5hcHBlbmRDaGlsZChtYXRjaGluZ0Zyb21FbCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIE1PUlBIXG4gICAgICAgICAgICAgICAgICAgIG1vcnBoRWwobWF0Y2hpbmdGcm9tRWwsIGN1clRvTm9kZUNoaWxkKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgb25CZWZvcmVOb2RlQWRkZWRSZXN1bHQgPSBvbkJlZm9yZU5vZGVBZGRlZChjdXJUb05vZGVDaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvbkJlZm9yZU5vZGVBZGRlZFJlc3VsdCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvbkJlZm9yZU5vZGVBZGRlZFJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkID0gb25CZWZvcmVOb2RlQWRkZWRSZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJUb05vZGVDaGlsZC5hY3R1YWxpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCA9IGN1clRvTm9kZUNoaWxkLmFjdHVhbGl6ZShmcm9tRWwub3duZXJEb2N1bWVudCB8fCBkb2MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbUVsLmFwcGVuZENoaWxkKGN1clRvTm9kZUNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZU5vZGVBZGRlZChjdXJUb05vZGVDaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCA9IHRvTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2xlYW51cEZyb21FbChmcm9tRWwsIGN1ckZyb21Ob2RlQ2hpbGQsIGN1ckZyb21Ob2RlS2V5KTtcblxuICAgICAgICAgICAgdmFyIHNwZWNpYWxFbEhhbmRsZXIgPSBzcGVjaWFsRWxIYW5kbGVyc1tmcm9tRWwubm9kZU5hbWVdO1xuICAgICAgICAgICAgaWYgKHNwZWNpYWxFbEhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICBzcGVjaWFsRWxIYW5kbGVyKGZyb21FbCwgdG9FbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gLy8gRU5EOiBtb3JwaENoaWxkcmVuKC4uLilcblxuICAgICAgICB2YXIgbW9ycGhlZE5vZGUgPSBmcm9tTm9kZTtcbiAgICAgICAgdmFyIG1vcnBoZWROb2RlVHlwZSA9IG1vcnBoZWROb2RlLm5vZGVUeXBlO1xuICAgICAgICB2YXIgdG9Ob2RlVHlwZSA9IHRvTm9kZS5ub2RlVHlwZTtcblxuICAgICAgICBpZiAoIWNoaWxkcmVuT25seSkge1xuICAgICAgICAgICAgLy8gSGFuZGxlIHRoZSBjYXNlIHdoZXJlIHdlIGFyZSBnaXZlbiB0d28gRE9NIG5vZGVzIHRoYXQgYXJlIG5vdFxuICAgICAgICAgICAgLy8gY29tcGF0aWJsZSAoZS5nLiA8ZGl2PiAtLT4gPHNwYW4+IG9yIDxkaXY+IC0tPiBURVhUKVxuICAgICAgICAgICAgaWYgKG1vcnBoZWROb2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRvTm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbXBhcmVOb2RlTmFtZXMoZnJvbU5vZGUsIHRvTm9kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uTm9kZURpc2NhcmRlZChmcm9tTm9kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb3JwaGVkTm9kZSA9IG1vdmVDaGlsZHJlbihmcm9tTm9kZSwgY3JlYXRlRWxlbWVudE5TKHRvTm9kZS5ub2RlTmFtZSwgdG9Ob2RlLm5hbWVzcGFjZVVSSSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gR29pbmcgZnJvbSBhbiBlbGVtZW50IG5vZGUgdG8gYSB0ZXh0IG5vZGVcbiAgICAgICAgICAgICAgICAgICAgbW9ycGhlZE5vZGUgPSB0b05vZGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChtb3JwaGVkTm9kZVR5cGUgPT09IFRFWFRfTk9ERSB8fCBtb3JwaGVkTm9kZVR5cGUgPT09IENPTU1FTlRfTk9ERSkgeyAvLyBUZXh0IG9yIGNvbW1lbnQgbm9kZVxuICAgICAgICAgICAgICAgIGlmICh0b05vZGVUeXBlID09PSBtb3JwaGVkTm9kZVR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1vcnBoZWROb2RlLm5vZGVWYWx1ZSAhPT0gdG9Ob2RlLm5vZGVWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9ycGhlZE5vZGUubm9kZVZhbHVlID0gdG9Ob2RlLm5vZGVWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtb3JwaGVkTm9kZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBUZXh0IG5vZGUgdG8gc29tZXRoaW5nIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgbW9ycGhlZE5vZGUgPSB0b05vZGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1vcnBoZWROb2RlID09PSB0b05vZGUpIHtcbiAgICAgICAgICAgIC8vIFRoZSBcInRvIG5vZGVcIiB3YXMgbm90IGNvbXBhdGlibGUgd2l0aCB0aGUgXCJmcm9tIG5vZGVcIiBzbyB3ZSBoYWQgdG9cbiAgICAgICAgICAgIC8vIHRvc3Mgb3V0IHRoZSBcImZyb20gbm9kZVwiIGFuZCB1c2UgdGhlIFwidG8gbm9kZVwiXG4gICAgICAgICAgICBvbk5vZGVEaXNjYXJkZWQoZnJvbU5vZGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRvTm9kZS5pc1NhbWVOb2RlICYmIHRvTm9kZS5pc1NhbWVOb2RlKG1vcnBoZWROb2RlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbW9ycGhFbChtb3JwaGVkTm9kZSwgdG9Ob2RlLCBjaGlsZHJlbk9ubHkpO1xuXG4gICAgICAgICAgICAvLyBXZSBub3cgbmVlZCB0byBsb29wIG92ZXIgYW55IGtleWVkIG5vZGVzIHRoYXQgbWlnaHQgbmVlZCB0byBiZVxuICAgICAgICAgICAgLy8gcmVtb3ZlZC4gV2Ugb25seSBkbyB0aGUgcmVtb3ZhbCBpZiB3ZSBrbm93IHRoYXQgdGhlIGtleWVkIG5vZGVcbiAgICAgICAgICAgIC8vIG5ldmVyIGZvdW5kIGEgbWF0Y2guIFdoZW4gYSBrZXllZCBub2RlIGlzIG1hdGNoZWQgdXAgd2UgcmVtb3ZlXG4gICAgICAgICAgICAvLyBpdCBvdXQgb2YgZnJvbU5vZGVzTG9va3VwIGFuZCB3ZSB1c2UgZnJvbU5vZGVzTG9va3VwIHRvIGRldGVybWluZVxuICAgICAgICAgICAgLy8gaWYgYSBrZXllZCBub2RlIGhhcyBiZWVuIG1hdGNoZWQgdXAgb3Igbm90XG4gICAgICAgICAgICBpZiAoa2V5ZWRSZW1vdmFsTGlzdCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MCwgbGVuPWtleWVkUmVtb3ZhbExpc3QubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlbFRvUmVtb3ZlID0gZnJvbU5vZGVzTG9va3VwW2tleWVkUmVtb3ZhbExpc3RbaV1dO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZWxUb1JlbW92ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTm9kZShlbFRvUmVtb3ZlLCBlbFRvUmVtb3ZlLnBhcmVudE5vZGUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghY2hpbGRyZW5Pbmx5ICYmIG1vcnBoZWROb2RlICE9PSBmcm9tTm9kZSAmJiBmcm9tTm9kZS5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICBpZiAobW9ycGhlZE5vZGUuYWN0dWFsaXplKSB7XG4gICAgICAgICAgICAgICAgbW9ycGhlZE5vZGUgPSBtb3JwaGVkTm9kZS5hY3R1YWxpemUoZnJvbU5vZGUub3duZXJEb2N1bWVudCB8fCBkb2MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gSWYgd2UgaGFkIHRvIHN3YXAgb3V0IHRoZSBmcm9tIG5vZGUgd2l0aCBhIG5ldyBub2RlIGJlY2F1c2UgdGhlIG9sZFxuICAgICAgICAgICAgLy8gbm9kZSB3YXMgbm90IGNvbXBhdGlibGUgd2l0aCB0aGUgdGFyZ2V0IG5vZGUgdGhlbiB3ZSBuZWVkIHRvXG4gICAgICAgICAgICAvLyByZXBsYWNlIHRoZSBvbGQgRE9NIG5vZGUgaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlLiBUaGlzIGlzIG9ubHlcbiAgICAgICAgICAgIC8vIHBvc3NpYmxlIGlmIHRoZSBvcmlnaW5hbCBET00gbm9kZSB3YXMgcGFydCBvZiBhIERPTSB0cmVlIHdoaWNoXG4gICAgICAgICAgICAvLyB3ZSBrbm93IGlzIHRoZSBjYXNlIGlmIGl0IGhhcyBhIHBhcmVudCBub2RlLlxuICAgICAgICAgICAgZnJvbU5vZGUucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobW9ycGhlZE5vZGUsIGZyb21Ob2RlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtb3JwaGVkTm9kZTtcbiAgICB9O1xufVxuXG52YXIgbW9ycGhkb20gPSBtb3JwaGRvbUZhY3RvcnkobW9ycGhBdHRycyk7XG5cbmV4cG9ydCBkZWZhdWx0IG1vcnBoZG9tO1xuIiwgImltcG9ydCB7XG4gIFBIWF9DT01QT05FTlQsXG4gIFBIWF9ESVNBQkxFX1dJVEgsXG4gIFBIWF9GRUVEQkFDS19GT1IsXG4gIFBIWF9QUlVORSxcbiAgUEhYX1JPT1RfSUQsXG4gIFBIWF9TRVNTSU9OLFxuICBQSFhfU0tJUCxcbiAgUEhYX1NUQVRJQyxcbiAgUEhYX1RSSUdHRVJfQUNUSU9OLFxuICBQSFhfVVBEQVRFXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCB7XG4gIGRldGVjdER1cGxpY2F0ZUlkcyxcbiAgaXNDaWRcbn0gZnJvbSBcIi4vdXRpbHNcIlxuXG5pbXBvcnQgRE9NIGZyb20gXCIuL2RvbVwiXG5pbXBvcnQgRE9NUG9zdE1vcnBoUmVzdG9yZXIgZnJvbSBcIi4vZG9tX3Bvc3RfbW9ycGhfcmVzdG9yZXJcIlxuaW1wb3J0IG1vcnBoZG9tIGZyb20gXCJtb3JwaGRvbVwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERPTVBhdGNoIHtcbiAgc3RhdGljIHBhdGNoRWwoZnJvbUVsLCB0b0VsLCBhY3RpdmVFbGVtZW50KXtcbiAgICBtb3JwaGRvbShmcm9tRWwsIHRvRWwsIHtcbiAgICAgIGNoaWxkcmVuT25seTogZmFsc2UsXG4gICAgICBvbkJlZm9yZUVsVXBkYXRlZDogKGZyb21FbCwgdG9FbCkgPT4ge1xuICAgICAgICBpZihhY3RpdmVFbGVtZW50ICYmIGFjdGl2ZUVsZW1lbnQuaXNTYW1lTm9kZShmcm9tRWwpICYmIERPTS5pc0Zvcm1JbnB1dChmcm9tRWwpKXtcbiAgICAgICAgICBET00ubWVyZ2VGb2N1c2VkSW5wdXQoZnJvbUVsLCB0b0VsKVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHZpZXcsIGNvbnRhaW5lciwgaWQsIGh0bWwsIHRhcmdldENJRCl7XG4gICAgdGhpcy52aWV3ID0gdmlld1xuICAgIHRoaXMubGl2ZVNvY2tldCA9IHZpZXcubGl2ZVNvY2tldFxuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyXG4gICAgdGhpcy5pZCA9IGlkXG4gICAgdGhpcy5yb290SUQgPSB2aWV3LnJvb3QuaWRcbiAgICB0aGlzLmh0bWwgPSBodG1sXG4gICAgdGhpcy50YXJnZXRDSUQgPSB0YXJnZXRDSURcbiAgICB0aGlzLmNpZFBhdGNoID0gaXNDaWQodGhpcy50YXJnZXRDSUQpXG4gICAgdGhpcy5jYWxsYmFja3MgPSB7XG4gICAgICBiZWZvcmVhZGRlZDogW10sIGJlZm9yZXVwZGF0ZWQ6IFtdLCBiZWZvcmVwaHhDaGlsZEFkZGVkOiBbXSxcbiAgICAgIGFmdGVyYWRkZWQ6IFtdLCBhZnRlcnVwZGF0ZWQ6IFtdLCBhZnRlcmRpc2NhcmRlZDogW10sIGFmdGVycGh4Q2hpbGRBZGRlZDogW10sXG4gICAgICBhZnRlcnRyYW5zaXRpb25zRGlzY2FyZGVkOiBbXVxuICAgIH1cbiAgfVxuXG4gIGJlZm9yZShraW5kLCBjYWxsYmFjayl7IHRoaXMuY2FsbGJhY2tzW2BiZWZvcmUke2tpbmR9YF0ucHVzaChjYWxsYmFjaykgfVxuICBhZnRlcihraW5kLCBjYWxsYmFjayl7IHRoaXMuY2FsbGJhY2tzW2BhZnRlciR7a2luZH1gXS5wdXNoKGNhbGxiYWNrKSB9XG5cbiAgdHJhY2tCZWZvcmUoa2luZCwgLi4uYXJncyl7XG4gICAgdGhpcy5jYWxsYmFja3NbYGJlZm9yZSR7a2luZH1gXS5mb3JFYWNoKGNhbGxiYWNrID0+IGNhbGxiYWNrKC4uLmFyZ3MpKVxuICB9XG5cbiAgdHJhY2tBZnRlcihraW5kLCAuLi5hcmdzKXtcbiAgICB0aGlzLmNhbGxiYWNrc1tgYWZ0ZXIke2tpbmR9YF0uZm9yRWFjaChjYWxsYmFjayA9PiBjYWxsYmFjayguLi5hcmdzKSlcbiAgfVxuXG4gIG1hcmtQcnVuYWJsZUNvbnRlbnRGb3JSZW1vdmFsKCl7XG4gICAgRE9NLmFsbCh0aGlzLmNvbnRhaW5lciwgXCJbcGh4LXVwZGF0ZT1hcHBlbmRdID4gKiwgW3BoeC11cGRhdGU9cHJlcGVuZF0gPiAqXCIsIGVsID0+IHtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZShQSFhfUFJVTkUsIFwiXCIpXG4gICAgfSlcbiAgfVxuXG4gIHBlcmZvcm0oKXtcbiAgICBsZXQge3ZpZXcsIGxpdmVTb2NrZXQsIGNvbnRhaW5lciwgaHRtbH0gPSB0aGlzXG4gICAgbGV0IHRhcmdldENvbnRhaW5lciA9IHRoaXMuaXNDSURQYXRjaCgpID8gdGhpcy50YXJnZXRDSURDb250YWluZXIoaHRtbCkgOiBjb250YWluZXJcbiAgICBpZih0aGlzLmlzQ0lEUGF0Y2goKSAmJiAhdGFyZ2V0Q29udGFpbmVyKXsgcmV0dXJuIH1cblxuICAgIGxldCBmb2N1c2VkID0gbGl2ZVNvY2tldC5nZXRBY3RpdmVFbGVtZW50KClcbiAgICBsZXQge3NlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmR9ID0gZm9jdXNlZCAmJiBET00uaGFzU2VsZWN0aW9uUmFuZ2UoZm9jdXNlZCkgPyBmb2N1c2VkIDoge31cbiAgICBsZXQgcGh4VXBkYXRlID0gbGl2ZVNvY2tldC5iaW5kaW5nKFBIWF9VUERBVEUpXG4gICAgbGV0IHBoeEZlZWRiYWNrRm9yID0gbGl2ZVNvY2tldC5iaW5kaW5nKFBIWF9GRUVEQkFDS19GT1IpXG4gICAgbGV0IGRpc2FibGVXaXRoID0gbGl2ZVNvY2tldC5iaW5kaW5nKFBIWF9ESVNBQkxFX1dJVEgpXG4gICAgbGV0IHBoeFRyaWdnZXJFeHRlcm5hbCA9IGxpdmVTb2NrZXQuYmluZGluZyhQSFhfVFJJR0dFUl9BQ1RJT04pXG4gICAgbGV0IHBoeFJlbW92ZSA9IGxpdmVTb2NrZXQuYmluZGluZyhcInJlbW92ZVwiKVxuICAgIGxldCBhZGRlZCA9IFtdXG4gICAgbGV0IHVwZGF0ZXMgPSBbXVxuICAgIGxldCBhcHBlbmRQcmVwZW5kVXBkYXRlcyA9IFtdXG4gICAgbGV0IHBlbmRpbmdSZW1vdmVzID0gW11cbiAgICBsZXQgZXh0ZXJuYWxGb3JtVHJpZ2dlcmVkID0gbnVsbFxuXG4gICAgbGV0IGRpZmZIVE1MID0gbGl2ZVNvY2tldC50aW1lKFwicHJlbW9ycGggY29udGFpbmVyIHByZXBcIiwgKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuYnVpbGREaWZmSFRNTChjb250YWluZXIsIGh0bWwsIHBoeFVwZGF0ZSwgdGFyZ2V0Q29udGFpbmVyKVxuICAgIH0pXG5cbiAgICB0aGlzLnRyYWNrQmVmb3JlKFwiYWRkZWRcIiwgY29udGFpbmVyKVxuICAgIHRoaXMudHJhY2tCZWZvcmUoXCJ1cGRhdGVkXCIsIGNvbnRhaW5lciwgY29udGFpbmVyKVxuXG4gICAgbGl2ZVNvY2tldC50aW1lKFwibW9ycGhkb21cIiwgKCkgPT4ge1xuICAgICAgbW9ycGhkb20odGFyZ2V0Q29udGFpbmVyLCBkaWZmSFRNTCwge1xuICAgICAgICBjaGlsZHJlbk9ubHk6IHRhcmdldENvbnRhaW5lci5nZXRBdHRyaWJ1dGUoUEhYX0NPTVBPTkVOVCkgPT09IG51bGwsXG4gICAgICAgIGdldE5vZGVLZXk6IChub2RlKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIERPTS5pc1BoeERlc3Ryb3llZChub2RlKSA/IG51bGwgOiBub2RlLmlkXG4gICAgICAgIH0sXG4gICAgICAgIG9uQmVmb3JlTm9kZUFkZGVkOiAoZWwpID0+IHtcbiAgICAgICAgICB0aGlzLnRyYWNrQmVmb3JlKFwiYWRkZWRcIiwgZWwpXG4gICAgICAgICAgcmV0dXJuIGVsXG4gICAgICAgIH0sXG4gICAgICAgIG9uTm9kZUFkZGVkOiAoZWwpID0+IHtcbiAgICAgICAgICAvLyBoYWNrIHRvIGZpeCBTYWZhcmkgaGFuZGxpbmcgb2YgaW1nIHNyY3NldCBhbmQgdmlkZW8gdGFnc1xuICAgICAgICAgIGlmKGVsIGluc3RhbmNlb2YgSFRNTEltYWdlRWxlbWVudCAmJiBlbC5zcmNzZXQpe1xuICAgICAgICAgICAgZWwuc3Jjc2V0ID0gZWwuc3Jjc2V0XG4gICAgICAgICAgfSBlbHNlIGlmKGVsIGluc3RhbmNlb2YgSFRNTFZpZGVvRWxlbWVudCAmJiBlbC5hdXRvcGxheSl7XG4gICAgICAgICAgICBlbC5wbGF5KClcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoRE9NLmlzTm93VHJpZ2dlckZvcm1FeHRlcm5hbChlbCwgcGh4VHJpZ2dlckV4dGVybmFsKSl7XG4gICAgICAgICAgICBleHRlcm5hbEZvcm1UcmlnZ2VyZWQgPSBlbFxuICAgICAgICAgIH1cbiAgICAgICAgICAvL2lucHV0IGhhbmRsaW5nXG4gICAgICAgICAgRE9NLmRpc2NhcmRFcnJvcih0YXJnZXRDb250YWluZXIsIGVsLCBwaHhGZWVkYmFja0ZvcilcbiAgICAgICAgICAvLyBuZXN0ZWQgdmlldyBoYW5kbGluZ1xuICAgICAgICAgIGlmKChET00uaXNQaHhDaGlsZChlbCkgJiYgdmlldy5vd25zRWxlbWVudChlbCkpIHx8IERPTS5pc1BoeFN0aWNreShlbCkgJiYgdmlldy5vd25zRWxlbWVudChlbC5wYXJlbnROb2RlKSl7XG4gICAgICAgICAgICB0aGlzLnRyYWNrQWZ0ZXIoXCJwaHhDaGlsZEFkZGVkXCIsIGVsKVxuICAgICAgICAgIH1cbiAgICAgICAgICBhZGRlZC5wdXNoKGVsKVxuICAgICAgICB9LFxuICAgICAgICBvbk5vZGVEaXNjYXJkZWQ6IChlbCkgPT4ge1xuICAgICAgICAgIC8vIG5lc3RlZCB2aWV3IGhhbmRsaW5nXG4gICAgICAgICAgaWYoRE9NLmlzUGh4Q2hpbGQoZWwpIHx8IERPTS5pc1BoeFN0aWNreShlbCkpeyBsaXZlU29ja2V0LmRlc3Ryb3lWaWV3QnlFbChlbCkgfVxuICAgICAgICAgIHRoaXMudHJhY2tBZnRlcihcImRpc2NhcmRlZFwiLCBlbClcbiAgICAgICAgfSxcbiAgICAgICAgb25CZWZvcmVOb2RlRGlzY2FyZGVkOiAoZWwpID0+IHtcbiAgICAgICAgICBpZihlbC5nZXRBdHRyaWJ1dGUgJiYgZWwuZ2V0QXR0cmlidXRlKFBIWF9QUlVORSkgIT09IG51bGwpeyByZXR1cm4gdHJ1ZSB9XG4gICAgICAgICAgaWYoZWwucGFyZW50Tm9kZSAhPT0gbnVsbCAmJiBET00uaXNQaHhVcGRhdGUoZWwucGFyZW50Tm9kZSwgcGh4VXBkYXRlLCBbXCJhcHBlbmRcIiwgXCJwcmVwZW5kXCJdKSAmJiBlbC5pZCl7IHJldHVybiBmYWxzZSB9XG4gICAgICAgICAgaWYoZWwuZ2V0QXR0cmlidXRlICYmIGVsLmdldEF0dHJpYnV0ZShwaHhSZW1vdmUpKXtcbiAgICAgICAgICAgIHBlbmRpbmdSZW1vdmVzLnB1c2goZWwpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYodGhpcy5za2lwQ0lEU2libGluZyhlbCkpeyByZXR1cm4gZmFsc2UgfVxuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIG9uRWxVcGRhdGVkOiAoZWwpID0+IHtcbiAgICAgICAgICBpZihET00uaXNOb3dUcmlnZ2VyRm9ybUV4dGVybmFsKGVsLCBwaHhUcmlnZ2VyRXh0ZXJuYWwpKXtcbiAgICAgICAgICAgIGV4dGVybmFsRm9ybVRyaWdnZXJlZCA9IGVsXG4gICAgICAgICAgfVxuICAgICAgICAgIHVwZGF0ZXMucHVzaChlbClcbiAgICAgICAgfSxcbiAgICAgICAgb25CZWZvcmVFbFVwZGF0ZWQ6IChmcm9tRWwsIHRvRWwpID0+IHtcbiAgICAgICAgICBET00uY2xlYW5DaGlsZE5vZGVzKHRvRWwsIHBoeFVwZGF0ZSlcbiAgICAgICAgICBpZih0aGlzLnNraXBDSURTaWJsaW5nKHRvRWwpKXsgcmV0dXJuIGZhbHNlIH1cbiAgICAgICAgICBpZihET00uaXNQaHhTdGlja3koZnJvbUVsKSl7IHJldHVybiBmYWxzZSB9XG4gICAgICAgICAgaWYoRE9NLmlzSWdub3JlZChmcm9tRWwsIHBoeFVwZGF0ZSkpe1xuICAgICAgICAgICAgdGhpcy50cmFja0JlZm9yZShcInVwZGF0ZWRcIiwgZnJvbUVsLCB0b0VsKVxuICAgICAgICAgICAgRE9NLm1lcmdlQXR0cnMoZnJvbUVsLCB0b0VsLCB7aXNJZ25vcmVkOiB0cnVlfSlcbiAgICAgICAgICAgIHVwZGF0ZXMucHVzaChmcm9tRWwpXG4gICAgICAgICAgICBET00uYXBwbHlTdGlja3lPcGVyYXRpb25zKGZyb21FbClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZihmcm9tRWwudHlwZSA9PT0gXCJudW1iZXJcIiAmJiAoZnJvbUVsLnZhbGlkaXR5ICYmIGZyb21FbC52YWxpZGl0eS5iYWRJbnB1dCkpeyByZXR1cm4gZmFsc2UgfVxuICAgICAgICAgIGlmKCFET00uc3luY1BlbmRpbmdSZWYoZnJvbUVsLCB0b0VsLCBkaXNhYmxlV2l0aCkpe1xuICAgICAgICAgICAgaWYoRE9NLmlzVXBsb2FkSW5wdXQoZnJvbUVsKSl7XG4gICAgICAgICAgICAgIHRoaXMudHJhY2tCZWZvcmUoXCJ1cGRhdGVkXCIsIGZyb21FbCwgdG9FbClcbiAgICAgICAgICAgICAgdXBkYXRlcy5wdXNoKGZyb21FbClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIERPTS5hcHBseVN0aWNreU9wZXJhdGlvbnMoZnJvbUVsKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gbmVzdGVkIHZpZXcgaGFuZGxpbmdcbiAgICAgICAgICBpZihET00uaXNQaHhDaGlsZCh0b0VsKSl7XG4gICAgICAgICAgICBsZXQgcHJldlNlc3Npb24gPSBmcm9tRWwuZ2V0QXR0cmlidXRlKFBIWF9TRVNTSU9OKVxuICAgICAgICAgICAgRE9NLm1lcmdlQXR0cnMoZnJvbUVsLCB0b0VsLCB7ZXhjbHVkZTogW1BIWF9TVEFUSUNdfSlcbiAgICAgICAgICAgIGlmKHByZXZTZXNzaW9uICE9PSBcIlwiKXsgZnJvbUVsLnNldEF0dHJpYnV0ZShQSFhfU0VTU0lPTiwgcHJldlNlc3Npb24pIH1cbiAgICAgICAgICAgIGZyb21FbC5zZXRBdHRyaWJ1dGUoUEhYX1JPT1RfSUQsIHRoaXMucm9vdElEKVxuICAgICAgICAgICAgRE9NLmFwcGx5U3RpY2t5T3BlcmF0aW9ucyhmcm9tRWwpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBpbnB1dCBoYW5kbGluZ1xuICAgICAgICAgIERPTS5jb3B5UHJpdmF0ZXModG9FbCwgZnJvbUVsKVxuICAgICAgICAgIERPTS5kaXNjYXJkRXJyb3IodGFyZ2V0Q29udGFpbmVyLCB0b0VsLCBwaHhGZWVkYmFja0ZvcilcblxuICAgICAgICAgIGxldCBpc0ZvY3VzZWRGb3JtRWwgPSBmb2N1c2VkICYmIGZyb21FbC5pc1NhbWVOb2RlKGZvY3VzZWQpICYmIERPTS5pc0Zvcm1JbnB1dChmcm9tRWwpXG4gICAgICAgICAgaWYoaXNGb2N1c2VkRm9ybUVsKXtcbiAgICAgICAgICAgIHRoaXMudHJhY2tCZWZvcmUoXCJ1cGRhdGVkXCIsIGZyb21FbCwgdG9FbClcbiAgICAgICAgICAgIERPTS5tZXJnZUZvY3VzZWRJbnB1dChmcm9tRWwsIHRvRWwpXG4gICAgICAgICAgICBET00uc3luY0F0dHJzVG9Qcm9wcyhmcm9tRWwpXG4gICAgICAgICAgICB1cGRhdGVzLnB1c2goZnJvbUVsKVxuICAgICAgICAgICAgRE9NLmFwcGx5U3RpY2t5T3BlcmF0aW9ucyhmcm9tRWwpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYoRE9NLmlzUGh4VXBkYXRlKHRvRWwsIHBoeFVwZGF0ZSwgW1wiYXBwZW5kXCIsIFwicHJlcGVuZFwiXSkpe1xuICAgICAgICAgICAgICBhcHBlbmRQcmVwZW5kVXBkYXRlcy5wdXNoKG5ldyBET01Qb3N0TW9ycGhSZXN0b3Jlcihmcm9tRWwsIHRvRWwsIHRvRWwuZ2V0QXR0cmlidXRlKHBoeFVwZGF0ZSkpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgRE9NLnN5bmNBdHRyc1RvUHJvcHModG9FbClcbiAgICAgICAgICAgIERPTS5hcHBseVN0aWNreU9wZXJhdGlvbnModG9FbClcbiAgICAgICAgICAgIHRoaXMudHJhY2tCZWZvcmUoXCJ1cGRhdGVkXCIsIGZyb21FbCwgdG9FbClcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpZihsaXZlU29ja2V0LmlzRGVidWdFbmFibGVkKCkpeyBkZXRlY3REdXBsaWNhdGVJZHMoKSB9XG5cbiAgICBpZihhcHBlbmRQcmVwZW5kVXBkYXRlcy5sZW5ndGggPiAwKXtcbiAgICAgIGxpdmVTb2NrZXQudGltZShcInBvc3QtbW9ycGggYXBwZW5kL3ByZXBlbmQgcmVzdG9yYXRpb25cIiwgKCkgPT4ge1xuICAgICAgICBhcHBlbmRQcmVwZW5kVXBkYXRlcy5mb3JFYWNoKHVwZGF0ZSA9PiB1cGRhdGUucGVyZm9ybSgpKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBsaXZlU29ja2V0LnNpbGVuY2VFdmVudHMoKCkgPT4gRE9NLnJlc3RvcmVGb2N1cyhmb2N1c2VkLCBzZWxlY3Rpb25TdGFydCwgc2VsZWN0aW9uRW5kKSlcbiAgICBET00uZGlzcGF0Y2hFdmVudChkb2N1bWVudCwgXCJwaHg6dXBkYXRlXCIpXG4gICAgYWRkZWQuZm9yRWFjaChlbCA9PiB0aGlzLnRyYWNrQWZ0ZXIoXCJhZGRlZFwiLCBlbCkpXG4gICAgdXBkYXRlcy5mb3JFYWNoKGVsID0+IHRoaXMudHJhY2tBZnRlcihcInVwZGF0ZWRcIiwgZWwpKVxuXG4gICAgaWYocGVuZGluZ1JlbW92ZXMubGVuZ3RoID4gMCl7XG4gICAgICBsaXZlU29ja2V0LnRyYW5zaXRpb25SZW1vdmVzKHBlbmRpbmdSZW1vdmVzKVxuICAgICAgbGl2ZVNvY2tldC5yZXF1ZXN0RE9NVXBkYXRlKCgpID0+IHtcbiAgICAgICAgcGVuZGluZ1JlbW92ZXMuZm9yRWFjaChlbCA9PiB7XG4gICAgICAgICAgbGV0IGNoaWxkID0gRE9NLmZpcnN0UGh4Q2hpbGQoZWwpXG4gICAgICAgICAgaWYoY2hpbGQpeyBsaXZlU29ja2V0LmRlc3Ryb3lWaWV3QnlFbChjaGlsZCkgfVxuICAgICAgICAgIGVsLnJlbW92ZSgpXG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMudHJhY2tBZnRlcihcInRyYW5zaXRpb25zRGlzY2FyZGVkXCIsIHBlbmRpbmdSZW1vdmVzKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZihleHRlcm5hbEZvcm1UcmlnZ2VyZWQpe1xuICAgICAgbGl2ZVNvY2tldC5kaXNjb25uZWN0KClcbiAgICAgIGV4dGVybmFsRm9ybVRyaWdnZXJlZC5zdWJtaXQoKVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgaXNDSURQYXRjaCgpeyByZXR1cm4gdGhpcy5jaWRQYXRjaCB9XG5cbiAgc2tpcENJRFNpYmxpbmcoZWwpe1xuICAgIHJldHVybiBlbC5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUgJiYgZWwuZ2V0QXR0cmlidXRlKFBIWF9TS0lQKSAhPT0gbnVsbFxuICB9XG5cbiAgdGFyZ2V0Q0lEQ29udGFpbmVyKGh0bWwpe1xuICAgIGlmKCF0aGlzLmlzQ0lEUGF0Y2goKSl7IHJldHVybiB9XG4gICAgbGV0IFtmaXJzdCwgLi4ucmVzdF0gPSBET00uZmluZENvbXBvbmVudE5vZGVMaXN0KHRoaXMuY29udGFpbmVyLCB0aGlzLnRhcmdldENJRClcbiAgICBpZihyZXN0Lmxlbmd0aCA9PT0gMCAmJiBET00uY2hpbGROb2RlTGVuZ3RoKGh0bWwpID09PSAxKXtcbiAgICAgIHJldHVybiBmaXJzdFxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmlyc3QgJiYgZmlyc3QucGFyZW50Tm9kZVxuICAgIH1cbiAgfVxuXG4gIC8vIGJ1aWxkcyBIVE1MIGZvciBtb3JwaGRvbSBwYXRjaFxuICAvLyAtIGZvciBmdWxsIHBhdGNoZXMgb2YgTGl2ZVZpZXcgb3IgYSBjb21wb25lbnQgd2l0aCBhIHNpbmdsZVxuICAvLyAgIHJvb3Qgbm9kZSwgc2ltcGx5IHJldHVybnMgdGhlIEhUTUxcbiAgLy8gLSBmb3IgcGF0Y2hlcyBvZiBhIGNvbXBvbmVudCB3aXRoIG11bHRpcGxlIHJvb3Qgbm9kZXMsIHRoZVxuICAvLyAgIHBhcmVudCBub2RlIGJlY29tZXMgdGhlIHRhcmdldCBjb250YWluZXIgYW5kIG5vbi1jb21wb25lbnRcbiAgLy8gICBzaWJsaW5ncyBhcmUgbWFya2VkIGFzIHNraXAuXG4gIGJ1aWxkRGlmZkhUTUwoY29udGFpbmVyLCBodG1sLCBwaHhVcGRhdGUsIHRhcmdldENvbnRhaW5lcil7XG4gICAgbGV0IGlzQ0lEUGF0Y2ggPSB0aGlzLmlzQ0lEUGF0Y2goKVxuICAgIGxldCBpc0NJRFdpdGhTaW5nbGVSb290ID0gaXNDSURQYXRjaCAmJiB0YXJnZXRDb250YWluZXIuZ2V0QXR0cmlidXRlKFBIWF9DT01QT05FTlQpID09PSB0aGlzLnRhcmdldENJRC50b1N0cmluZygpXG4gICAgaWYoIWlzQ0lEUGF0Y2ggfHwgaXNDSURXaXRoU2luZ2xlUm9vdCl7XG4gICAgICByZXR1cm4gaHRtbFxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBjb21wb25lbnQgcGF0Y2ggd2l0aCBtdWx0aXBsZSBDSUQgcm9vdHNcbiAgICAgIGxldCBkaWZmQ29udGFpbmVyID0gbnVsbFxuICAgICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRlbXBsYXRlXCIpXG4gICAgICBkaWZmQ29udGFpbmVyID0gRE9NLmNsb25lTm9kZSh0YXJnZXRDb250YWluZXIpXG4gICAgICBsZXQgW2ZpcnN0Q29tcG9uZW50LCAuLi5yZXN0XSA9IERPTS5maW5kQ29tcG9uZW50Tm9kZUxpc3QoZGlmZkNvbnRhaW5lciwgdGhpcy50YXJnZXRDSUQpXG4gICAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBodG1sXG4gICAgICByZXN0LmZvckVhY2goZWwgPT4gZWwucmVtb3ZlKCkpXG4gICAgICBBcnJheS5mcm9tKGRpZmZDb250YWluZXIuY2hpbGROb2RlcykuZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgIC8vIHdlIGNhbiBvbmx5IHNraXAgdHJhY2thYmxlIG5vZGVzIHdpdGggYW4gSURcbiAgICAgICAgaWYoY2hpbGQuaWQgJiYgY2hpbGQubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFICYmIGNoaWxkLmdldEF0dHJpYnV0ZShQSFhfQ09NUE9ORU5UKSAhPT0gdGhpcy50YXJnZXRDSUQudG9TdHJpbmcoKSl7XG4gICAgICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKFBIWF9TS0lQLCBcIlwiKVxuICAgICAgICAgIGNoaWxkLmlubmVySFRNTCA9IFwiXCJcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIEFycmF5LmZyb20odGVtcGxhdGUuY29udGVudC5jaGlsZE5vZGVzKS5mb3JFYWNoKGVsID0+IGRpZmZDb250YWluZXIuaW5zZXJ0QmVmb3JlKGVsLCBmaXJzdENvbXBvbmVudCkpXG4gICAgICBmaXJzdENvbXBvbmVudC5yZW1vdmUoKVxuICAgICAgcmV0dXJuIGRpZmZDb250YWluZXIub3V0ZXJIVE1MXG4gICAgfVxuICB9XG59XG4iLCAiaW1wb3J0IHtcbiAgQ09NUE9ORU5UUyxcbiAgRFlOQU1JQ1MsXG4gIFRFTVBMQVRFUyxcbiAgRVZFTlRTLFxuICBQSFhfQ09NUE9ORU5ULFxuICBQSFhfU0tJUCxcbiAgUkVQTFksXG4gIFNUQVRJQyxcbiAgVElUTEVcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IHtcbiAgaXNPYmplY3QsXG4gIGxvZ0Vycm9yLFxuICBpc0NpZCxcbn0gZnJvbSBcIi4vdXRpbHNcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZW5kZXJlZCB7XG4gIHN0YXRpYyBleHRyYWN0KGRpZmYpe1xuICAgIGxldCB7W1JFUExZXTogcmVwbHksIFtFVkVOVFNdOiBldmVudHMsIFtUSVRMRV06IHRpdGxlfSA9IGRpZmZcbiAgICBkZWxldGUgZGlmZltSRVBMWV1cbiAgICBkZWxldGUgZGlmZltFVkVOVFNdXG4gICAgZGVsZXRlIGRpZmZbVElUTEVdXG4gICAgcmV0dXJuIHtkaWZmLCB0aXRsZSwgcmVwbHk6IHJlcGx5IHx8IG51bGwsIGV2ZW50czogZXZlbnRzIHx8IFtdfVxuICB9XG5cbiAgY29uc3RydWN0b3Iodmlld0lkLCByZW5kZXJlZCl7XG4gICAgdGhpcy52aWV3SWQgPSB2aWV3SWRcbiAgICB0aGlzLnJlbmRlcmVkID0ge31cbiAgICB0aGlzLm1lcmdlRGlmZihyZW5kZXJlZClcbiAgfVxuXG4gIHBhcmVudFZpZXdJZCgpeyByZXR1cm4gdGhpcy52aWV3SWQgfVxuXG4gIHRvU3RyaW5nKG9ubHlDaWRzKXtcbiAgICByZXR1cm4gdGhpcy5yZWN1cnNpdmVUb1N0cmluZyh0aGlzLnJlbmRlcmVkLCB0aGlzLnJlbmRlcmVkW0NPTVBPTkVOVFNdLCBvbmx5Q2lkcylcbiAgfVxuXG4gIHJlY3Vyc2l2ZVRvU3RyaW5nKHJlbmRlcmVkLCBjb21wb25lbnRzID0gcmVuZGVyZWRbQ09NUE9ORU5UU10sIG9ubHlDaWRzKXtcbiAgICBvbmx5Q2lkcyA9IG9ubHlDaWRzID8gbmV3IFNldChvbmx5Q2lkcykgOiBudWxsXG4gICAgbGV0IG91dHB1dCA9IHtidWZmZXI6IFwiXCIsIGNvbXBvbmVudHM6IGNvbXBvbmVudHMsIG9ubHlDaWRzOiBvbmx5Q2lkc31cbiAgICB0aGlzLnRvT3V0cHV0QnVmZmVyKHJlbmRlcmVkLCBudWxsLCBvdXRwdXQpXG4gICAgcmV0dXJuIG91dHB1dC5idWZmZXJcbiAgfVxuXG4gIGNvbXBvbmVudENJRHMoZGlmZil7IHJldHVybiBPYmplY3Qua2V5cyhkaWZmW0NPTVBPTkVOVFNdIHx8IHt9KS5tYXAoaSA9PiBwYXJzZUludChpKSkgfVxuXG4gIGlzQ29tcG9uZW50T25seURpZmYoZGlmZil7XG4gICAgaWYoIWRpZmZbQ09NUE9ORU5UU10peyByZXR1cm4gZmFsc2UgfVxuICAgIHJldHVybiBPYmplY3Qua2V5cyhkaWZmKS5sZW5ndGggPT09IDFcbiAgfVxuXG4gIGdldENvbXBvbmVudChkaWZmLCBjaWQpeyByZXR1cm4gZGlmZltDT01QT05FTlRTXVtjaWRdIH1cblxuICBtZXJnZURpZmYoZGlmZil7XG4gICAgbGV0IG5ld2MgPSBkaWZmW0NPTVBPTkVOVFNdXG4gICAgbGV0IGNhY2hlID0ge31cbiAgICBkZWxldGUgZGlmZltDT01QT05FTlRTXVxuICAgIHRoaXMucmVuZGVyZWQgPSB0aGlzLm11dGFibGVNZXJnZSh0aGlzLnJlbmRlcmVkLCBkaWZmKVxuICAgIHRoaXMucmVuZGVyZWRbQ09NUE9ORU5UU10gPSB0aGlzLnJlbmRlcmVkW0NPTVBPTkVOVFNdIHx8IHt9XG5cbiAgICBpZihuZXdjKXtcbiAgICAgIGxldCBvbGRjID0gdGhpcy5yZW5kZXJlZFtDT01QT05FTlRTXVxuXG4gICAgICBmb3IobGV0IGNpZCBpbiBuZXdjKXtcbiAgICAgICAgbmV3Y1tjaWRdID0gdGhpcy5jYWNoZWRGaW5kQ29tcG9uZW50KGNpZCwgbmV3Y1tjaWRdLCBvbGRjLCBuZXdjLCBjYWNoZSlcbiAgICAgIH1cblxuICAgICAgZm9yKGxldCBjaWQgaW4gbmV3Yyl7IG9sZGNbY2lkXSA9IG5ld2NbY2lkXSB9XG4gICAgICBkaWZmW0NPTVBPTkVOVFNdID0gbmV3Y1xuICAgIH1cbiAgfVxuXG4gIGNhY2hlZEZpbmRDb21wb25lbnQoY2lkLCBjZGlmZiwgb2xkYywgbmV3YywgY2FjaGUpe1xuICAgIGlmKGNhY2hlW2NpZF0pe1xuICAgICAgcmV0dXJuIGNhY2hlW2NpZF1cbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IG5kaWZmLCBzdGF0LCBzY2lkID0gY2RpZmZbU1RBVElDXVxuXG4gICAgICBpZihpc0NpZChzY2lkKSl7XG4gICAgICAgIGxldCB0ZGlmZlxuXG4gICAgICAgIGlmKHNjaWQgPiAwKXtcbiAgICAgICAgICB0ZGlmZiA9IHRoaXMuY2FjaGVkRmluZENvbXBvbmVudChzY2lkLCBuZXdjW3NjaWRdLCBvbGRjLCBuZXdjLCBjYWNoZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0ZGlmZiA9IG9sZGNbLXNjaWRdXG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ID0gdGRpZmZbU1RBVElDXVxuICAgICAgICBuZGlmZiA9IHRoaXMuY2xvbmVNZXJnZSh0ZGlmZiwgY2RpZmYpXG4gICAgICAgIG5kaWZmW1NUQVRJQ10gPSBzdGF0XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZGlmZiA9IGNkaWZmW1NUQVRJQ10gIT09IHVuZGVmaW5lZCA/IGNkaWZmIDogdGhpcy5jbG9uZU1lcmdlKG9sZGNbY2lkXSB8fCB7fSwgY2RpZmYpXG4gICAgICB9XG5cbiAgICAgIGNhY2hlW2NpZF0gPSBuZGlmZlxuICAgICAgcmV0dXJuIG5kaWZmXG4gICAgfVxuICB9XG5cbiAgbXV0YWJsZU1lcmdlKHRhcmdldCwgc291cmNlKXtcbiAgICBpZihzb3VyY2VbU1RBVElDXSAhPT0gdW5kZWZpbmVkKXtcbiAgICAgIHJldHVybiBzb3VyY2VcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kb011dGFibGVNZXJnZSh0YXJnZXQsIHNvdXJjZSlcbiAgICAgIHJldHVybiB0YXJnZXRcbiAgICB9XG4gIH1cblxuICBkb011dGFibGVNZXJnZSh0YXJnZXQsIHNvdXJjZSl7XG4gICAgZm9yKGxldCBrZXkgaW4gc291cmNlKXtcbiAgICAgIGxldCB2YWwgPSBzb3VyY2Vba2V5XVxuICAgICAgbGV0IHRhcmdldFZhbCA9IHRhcmdldFtrZXldXG4gICAgICBpZihpc09iamVjdCh2YWwpICYmIHZhbFtTVEFUSUNdID09PSB1bmRlZmluZWQgJiYgaXNPYmplY3QodGFyZ2V0VmFsKSl7XG4gICAgICAgIHRoaXMuZG9NdXRhYmxlTWVyZ2UodGFyZ2V0VmFsLCB2YWwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXJnZXRba2V5XSA9IHZhbFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNsb25lTWVyZ2UodGFyZ2V0LCBzb3VyY2Upe1xuICAgIGxldCBtZXJnZWQgPSB7Li4udGFyZ2V0LCAuLi5zb3VyY2V9XG4gICAgZm9yKGxldCBrZXkgaW4gbWVyZ2VkKXtcbiAgICAgIGxldCB2YWwgPSBzb3VyY2Vba2V5XVxuICAgICAgbGV0IHRhcmdldFZhbCA9IHRhcmdldFtrZXldXG4gICAgICBpZihpc09iamVjdCh2YWwpICYmIHZhbFtTVEFUSUNdID09PSB1bmRlZmluZWQgJiYgaXNPYmplY3QodGFyZ2V0VmFsKSl7XG4gICAgICAgIG1lcmdlZFtrZXldID0gdGhpcy5jbG9uZU1lcmdlKHRhcmdldFZhbCwgdmFsKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbWVyZ2VkXG4gIH1cblxuICBjb21wb25lbnRUb1N0cmluZyhjaWQpeyByZXR1cm4gdGhpcy5yZWN1cnNpdmVDSURUb1N0cmluZyh0aGlzLnJlbmRlcmVkW0NPTVBPTkVOVFNdLCBjaWQpIH1cblxuICBwcnVuZUNJRHMoY2lkcyl7XG4gICAgY2lkcy5mb3JFYWNoKGNpZCA9PiBkZWxldGUgdGhpcy5yZW5kZXJlZFtDT01QT05FTlRTXVtjaWRdKVxuICB9XG5cbiAgLy8gcHJpdmF0ZVxuXG4gIGdldCgpeyByZXR1cm4gdGhpcy5yZW5kZXJlZCB9XG5cbiAgaXNOZXdGaW5nZXJwcmludChkaWZmID0ge30peyByZXR1cm4gISFkaWZmW1NUQVRJQ10gfVxuXG4gIHRlbXBsYXRlU3RhdGljKHBhcnQsIHRlbXBsYXRlcyl7XG4gICAgaWYodHlwZW9mIChwYXJ0KSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgcmV0dXJuIHRlbXBsYXRlc1twYXJ0XVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcGFydFxuICAgIH1cbiAgfVxuXG4gIHRvT3V0cHV0QnVmZmVyKHJlbmRlcmVkLCB0ZW1wbGF0ZXMsIG91dHB1dCl7XG4gICAgaWYocmVuZGVyZWRbRFlOQU1JQ1NdKXsgcmV0dXJuIHRoaXMuY29tcHJlaGVuc2lvblRvQnVmZmVyKHJlbmRlcmVkLCB0ZW1wbGF0ZXMsIG91dHB1dCkgfVxuICAgIGxldCB7W1NUQVRJQ106IHN0YXRpY3N9ID0gcmVuZGVyZWRcbiAgICBzdGF0aWNzID0gdGhpcy50ZW1wbGF0ZVN0YXRpYyhzdGF0aWNzLCB0ZW1wbGF0ZXMpXG5cbiAgICBvdXRwdXQuYnVmZmVyICs9IHN0YXRpY3NbMF1cbiAgICBmb3IobGV0IGkgPSAxOyBpIDwgc3RhdGljcy5sZW5ndGg7IGkrKyl7XG4gICAgICB0aGlzLmR5bmFtaWNUb0J1ZmZlcihyZW5kZXJlZFtpIC0gMV0sIHRlbXBsYXRlcywgb3V0cHV0KVxuICAgICAgb3V0cHV0LmJ1ZmZlciArPSBzdGF0aWNzW2ldXG4gICAgfVxuICB9XG5cbiAgY29tcHJlaGVuc2lvblRvQnVmZmVyKHJlbmRlcmVkLCB0ZW1wbGF0ZXMsIG91dHB1dCl7XG4gICAgbGV0IHtbRFlOQU1JQ1NdOiBkeW5hbWljcywgW1NUQVRJQ106IHN0YXRpY3N9ID0gcmVuZGVyZWRcbiAgICBzdGF0aWNzID0gdGhpcy50ZW1wbGF0ZVN0YXRpYyhzdGF0aWNzLCB0ZW1wbGF0ZXMpXG4gICAgbGV0IGNvbXBUZW1wbGF0ZXMgPSB0ZW1wbGF0ZXMgfHwgcmVuZGVyZWRbVEVNUExBVEVTXVxuXG4gICAgZm9yKGxldCBkID0gMDsgZCA8IGR5bmFtaWNzLmxlbmd0aDsgZCsrKXtcbiAgICAgIGxldCBkeW5hbWljID0gZHluYW1pY3NbZF1cbiAgICAgIG91dHB1dC5idWZmZXIgKz0gc3RhdGljc1swXVxuICAgICAgZm9yKGxldCBpID0gMTsgaSA8IHN0YXRpY3MubGVuZ3RoOyBpKyspe1xuICAgICAgICB0aGlzLmR5bmFtaWNUb0J1ZmZlcihkeW5hbWljW2kgLSAxXSwgY29tcFRlbXBsYXRlcywgb3V0cHV0KVxuICAgICAgICBvdXRwdXQuYnVmZmVyICs9IHN0YXRpY3NbaV1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkeW5hbWljVG9CdWZmZXIocmVuZGVyZWQsIHRlbXBsYXRlcywgb3V0cHV0KXtcbiAgICBpZih0eXBlb2YgKHJlbmRlcmVkKSA9PT0gXCJudW1iZXJcIil7XG4gICAgICBvdXRwdXQuYnVmZmVyICs9IHRoaXMucmVjdXJzaXZlQ0lEVG9TdHJpbmcob3V0cHV0LmNvbXBvbmVudHMsIHJlbmRlcmVkLCBvdXRwdXQub25seUNpZHMpXG4gICAgfSBlbHNlIGlmKGlzT2JqZWN0KHJlbmRlcmVkKSl7XG4gICAgICB0aGlzLnRvT3V0cHV0QnVmZmVyKHJlbmRlcmVkLCB0ZW1wbGF0ZXMsIG91dHB1dClcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0LmJ1ZmZlciArPSByZW5kZXJlZFxuICAgIH1cbiAgfVxuXG4gIHJlY3Vyc2l2ZUNJRFRvU3RyaW5nKGNvbXBvbmVudHMsIGNpZCwgb25seUNpZHMpe1xuICAgIGxldCBjb21wb25lbnQgPSBjb21wb25lbnRzW2NpZF0gfHwgbG9nRXJyb3IoYG5vIGNvbXBvbmVudCBmb3IgQ0lEICR7Y2lkfWAsIGNvbXBvbmVudHMpXG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRlbXBsYXRlXCIpXG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gdGhpcy5yZWN1cnNpdmVUb1N0cmluZyhjb21wb25lbnQsIGNvbXBvbmVudHMsIG9ubHlDaWRzKVxuICAgIGxldCBjb250YWluZXIgPSB0ZW1wbGF0ZS5jb250ZW50XG4gICAgbGV0IHNraXAgPSBvbmx5Q2lkcyAmJiAhb25seUNpZHMuaGFzKGNpZClcblxuICAgIGxldCBbaGFzQ2hpbGROb2RlcywgaGFzQ2hpbGRDb21wb25lbnRzXSA9XG4gICAgICBBcnJheS5mcm9tKGNvbnRhaW5lci5jaGlsZE5vZGVzKS5yZWR1Y2UoKFtoYXNOb2RlcywgaGFzQ29tcG9uZW50c10sIGNoaWxkLCBpKSA9PiB7XG4gICAgICAgIGlmKGNoaWxkLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSl7XG4gICAgICAgICAgaWYoY2hpbGQuZ2V0QXR0cmlidXRlKFBIWF9DT01QT05FTlQpKXtcbiAgICAgICAgICAgIHJldHVybiBbaGFzTm9kZXMsIHRydWVdXG4gICAgICAgICAgfVxuICAgICAgICAgIGNoaWxkLnNldEF0dHJpYnV0ZShQSFhfQ09NUE9ORU5ULCBjaWQpXG4gICAgICAgICAgaWYoIWNoaWxkLmlkKXsgY2hpbGQuaWQgPSBgJHt0aGlzLnBhcmVudFZpZXdJZCgpfS0ke2NpZH0tJHtpfWAgfVxuICAgICAgICAgIGlmKHNraXApe1xuICAgICAgICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKFBIWF9TS0lQLCBcIlwiKVxuICAgICAgICAgICAgY2hpbGQuaW5uZXJIVE1MID0gXCJcIlxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gW3RydWUsIGhhc0NvbXBvbmVudHNdXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYoY2hpbGQubm9kZVZhbHVlLnRyaW0oKSAhPT0gXCJcIil7XG4gICAgICAgICAgICBsb2dFcnJvcihcIm9ubHkgSFRNTCBlbGVtZW50IHRhZ3MgYXJlIGFsbG93ZWQgYXQgdGhlIHJvb3Qgb2YgY29tcG9uZW50cy5cXG5cXG5cIiArXG4gICAgICAgICAgICAgIGBnb3Q6IFwiJHtjaGlsZC5ub2RlVmFsdWUudHJpbSgpfVwiXFxuXFxuYCArXG4gICAgICAgICAgICAgIFwid2l0aGluOlxcblwiLCB0ZW1wbGF0ZS5pbm5lckhUTUwudHJpbSgpKVxuICAgICAgICAgICAgY2hpbGQucmVwbGFjZVdpdGgodGhpcy5jcmVhdGVTcGFuKGNoaWxkLm5vZGVWYWx1ZSwgY2lkKSlcbiAgICAgICAgICAgIHJldHVybiBbdHJ1ZSwgaGFzQ29tcG9uZW50c11cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2hpbGQucmVtb3ZlKClcbiAgICAgICAgICAgIHJldHVybiBbaGFzTm9kZXMsIGhhc0NvbXBvbmVudHNdXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCBbZmFsc2UsIGZhbHNlXSlcblxuICAgIGlmKCFoYXNDaGlsZE5vZGVzICYmICFoYXNDaGlsZENvbXBvbmVudHMpe1xuICAgICAgbG9nRXJyb3IoXCJleHBlY3RlZCBhdCBsZWFzdCBvbmUgSFRNTCBlbGVtZW50IHRhZyBpbnNpZGUgYSBjb21wb25lbnQsIGJ1dCB0aGUgY29tcG9uZW50IGlzIGVtcHR5OlxcblwiLFxuICAgICAgICB0ZW1wbGF0ZS5pbm5lckhUTUwudHJpbSgpKVxuICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlU3BhbihcIlwiLCBjaWQpLm91dGVySFRNTFxuICAgIH0gZWxzZSBpZighaGFzQ2hpbGROb2RlcyAmJiBoYXNDaGlsZENvbXBvbmVudHMpe1xuICAgICAgbG9nRXJyb3IoXCJleHBlY3RlZCBhdCBsZWFzdCBvbmUgSFRNTCBlbGVtZW50IHRhZyBkaXJlY3RseSBpbnNpZGUgYSBjb21wb25lbnQsIGJ1dCBvbmx5IHN1YmNvbXBvbmVudHMgd2VyZSBmb3VuZC4gQSBjb21wb25lbnQgbXVzdCByZW5kZXIgYXQgbGVhc3Qgb25lIEhUTUwgdGFnIGRpcmVjdGx5IGluc2lkZSBpdHNlbGYuXCIsXG4gICAgICAgIHRlbXBsYXRlLmlubmVySFRNTC50cmltKCkpXG4gICAgICByZXR1cm4gdGVtcGxhdGUuaW5uZXJIVE1MXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZW1wbGF0ZS5pbm5lckhUTUxcbiAgICB9XG4gIH1cblxuICBjcmVhdGVTcGFuKHRleHQsIGNpZCl7XG4gICAgbGV0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKVxuICAgIHNwYW4uaW5uZXJUZXh0ID0gdGV4dFxuICAgIHNwYW4uc2V0QXR0cmlidXRlKFBIWF9DT01QT05FTlQsIGNpZClcbiAgICByZXR1cm4gc3BhblxuICB9XG59XG4iLCAibGV0IHZpZXdIb29rSUQgPSAxXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWV3SG9vayB7XG4gIHN0YXRpYyBtYWtlSUQoKXsgcmV0dXJuIHZpZXdIb29rSUQrKyB9XG4gIHN0YXRpYyBlbGVtZW50SUQoZWwpeyByZXR1cm4gZWwucGh4SG9va0lkIH1cblxuICBjb25zdHJ1Y3Rvcih2aWV3LCBlbCwgY2FsbGJhY2tzKXtcbiAgICB0aGlzLl9fdmlldyA9IHZpZXdcbiAgICB0aGlzLmxpdmVTb2NrZXQgPSB2aWV3LmxpdmVTb2NrZXRcbiAgICB0aGlzLl9fY2FsbGJhY2tzID0gY2FsbGJhY2tzXG4gICAgdGhpcy5fX2xpc3RlbmVycyA9IG5ldyBTZXQoKVxuICAgIHRoaXMuX19pc0Rpc2Nvbm5lY3RlZCA9IGZhbHNlXG4gICAgdGhpcy5lbCA9IGVsXG4gICAgdGhpcy5lbC5waHhIb29rSWQgPSB0aGlzLmNvbnN0cnVjdG9yLm1ha2VJRCgpXG4gICAgZm9yKGxldCBrZXkgaW4gdGhpcy5fX2NhbGxiYWNrcyl7IHRoaXNba2V5XSA9IHRoaXMuX19jYWxsYmFja3Nba2V5XSB9XG4gIH1cblxuICBfX21vdW50ZWQoKXsgdGhpcy5tb3VudGVkICYmIHRoaXMubW91bnRlZCgpIH1cbiAgX191cGRhdGVkKCl7IHRoaXMudXBkYXRlZCAmJiB0aGlzLnVwZGF0ZWQoKSB9XG4gIF9fYmVmb3JlVXBkYXRlKCl7IHRoaXMuYmVmb3JlVXBkYXRlICYmIHRoaXMuYmVmb3JlVXBkYXRlKCkgfVxuICBfX2Rlc3Ryb3llZCgpeyB0aGlzLmRlc3Ryb3llZCAmJiB0aGlzLmRlc3Ryb3llZCgpIH1cbiAgX19yZWNvbm5lY3RlZCgpe1xuICAgIGlmKHRoaXMuX19pc0Rpc2Nvbm5lY3RlZCl7XG4gICAgICB0aGlzLl9faXNEaXNjb25uZWN0ZWQgPSBmYWxzZVxuICAgICAgdGhpcy5yZWNvbm5lY3RlZCAmJiB0aGlzLnJlY29ubmVjdGVkKClcbiAgICB9XG4gIH1cbiAgX19kaXNjb25uZWN0ZWQoKXtcbiAgICB0aGlzLl9faXNEaXNjb25uZWN0ZWQgPSB0cnVlXG4gICAgdGhpcy5kaXNjb25uZWN0ZWQgJiYgdGhpcy5kaXNjb25uZWN0ZWQoKVxuICB9XG5cbiAgcHVzaEV2ZW50KGV2ZW50LCBwYXlsb2FkID0ge30sIG9uUmVwbHkgPSBmdW5jdGlvbiAoKXsgfSl7XG4gICAgcmV0dXJuIHRoaXMuX192aWV3LnB1c2hIb29rRXZlbnQobnVsbCwgZXZlbnQsIHBheWxvYWQsIG9uUmVwbHkpXG4gIH1cblxuICBwdXNoRXZlbnRUbyhwaHhUYXJnZXQsIGV2ZW50LCBwYXlsb2FkID0ge30sIG9uUmVwbHkgPSBmdW5jdGlvbiAoKXsgfSl7XG4gICAgcmV0dXJuIHRoaXMuX192aWV3LndpdGhpblRhcmdldHMocGh4VGFyZ2V0LCAodmlldywgdGFyZ2V0Q3R4KSA9PiB7XG4gICAgICByZXR1cm4gdmlldy5wdXNoSG9va0V2ZW50KHRhcmdldEN0eCwgZXZlbnQsIHBheWxvYWQsIG9uUmVwbHkpXG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZUV2ZW50KGV2ZW50LCBjYWxsYmFjayl7XG4gICAgbGV0IGNhbGxiYWNrUmVmID0gKGN1c3RvbUV2ZW50LCBieXBhc3MpID0+IGJ5cGFzcyA/IGV2ZW50IDogY2FsbGJhY2soY3VzdG9tRXZlbnQuZGV0YWlsKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGBwaHg6JHtldmVudH1gLCBjYWxsYmFja1JlZilcbiAgICB0aGlzLl9fbGlzdGVuZXJzLmFkZChjYWxsYmFja1JlZilcbiAgICByZXR1cm4gY2FsbGJhY2tSZWZcbiAgfVxuXG4gIHJlbW92ZUhhbmRsZUV2ZW50KGNhbGxiYWNrUmVmKXtcbiAgICBsZXQgZXZlbnQgPSBjYWxsYmFja1JlZihudWxsLCB0cnVlKVxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKGBwaHg6JHtldmVudH1gLCBjYWxsYmFja1JlZilcbiAgICB0aGlzLl9fbGlzdGVuZXJzLmRlbGV0ZShjYWxsYmFja1JlZilcbiAgfVxuXG4gIHVwbG9hZChuYW1lLCBmaWxlcyl7XG4gICAgcmV0dXJuIHRoaXMuX192aWV3LmRpc3BhdGNoVXBsb2FkcyhuYW1lLCBmaWxlcylcbiAgfVxuXG4gIHVwbG9hZFRvKHBoeFRhcmdldCwgbmFtZSwgZmlsZXMpe1xuICAgIHJldHVybiB0aGlzLl9fdmlldy53aXRoaW5UYXJnZXRzKHBoeFRhcmdldCwgdmlldyA9PiB2aWV3LmRpc3BhdGNoVXBsb2FkcyhuYW1lLCBmaWxlcykpXG4gIH1cblxuICBfX2NsZWFudXBfXygpe1xuICAgIHRoaXMuX19saXN0ZW5lcnMuZm9yRWFjaChjYWxsYmFja1JlZiA9PiB0aGlzLnJlbW92ZUhhbmRsZUV2ZW50KGNhbGxiYWNrUmVmKSlcbiAgfVxufVxuIiwgImltcG9ydCBET00gZnJvbSBcIi4vZG9tXCJcblxubGV0IEpTID0ge1xuICBleGVjKGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBkZWZhdWx0cyl7XG4gICAgbGV0IFtkZWZhdWx0S2luZCwgZGVmYXVsdEFyZ3NdID0gZGVmYXVsdHMgfHwgW251bGwsIHt9XVxuICAgIGxldCBjb21tYW5kcyA9IHBoeEV2ZW50LmNoYXJBdCgwKSA9PT0gXCJbXCIgP1xuICAgICAgSlNPTi5wYXJzZShwaHhFdmVudCkgOiBbW2RlZmF1bHRLaW5kLCBkZWZhdWx0QXJnc11dXG5cbiAgICBjb21tYW5kcy5mb3JFYWNoKChba2luZCwgYXJnc10pID0+IHtcbiAgICAgIGlmKGtpbmQgPT09IGRlZmF1bHRLaW5kICYmIGRlZmF1bHRBcmdzLmRhdGEpe1xuICAgICAgICBhcmdzLmRhdGEgPSBPYmplY3QuYXNzaWduKGFyZ3MuZGF0YSB8fCB7fSwgZGVmYXVsdEFyZ3MuZGF0YSlcbiAgICAgIH1cbiAgICAgIHRoaXMuZmlsdGVyVG9FbHMoc291cmNlRWwsIGFyZ3MpLmZvckVhY2goZWwgPT4ge1xuICAgICAgICB0aGlzW2BleGVjXyR7a2luZH1gXShldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIGFyZ3MpXG4gICAgICB9KVxuICAgIH0pXG4gIH0sXG5cbiAgaXNWaXNpYmxlKGVsKXtcbiAgICByZXR1cm4gISEoZWwub2Zmc2V0V2lkdGggfHwgZWwub2Zmc2V0SGVpZ2h0IHx8IGVsLmdldENsaWVudFJlY3RzKCkubGVuZ3RoID4gMClcbiAgfSxcblxuICAvLyBwcml2YXRlXG5cbiAgLy8gY29tbWFuZHNcblxuICBleGVjX2Rpc3BhdGNoKGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwge3RvLCBldmVudCwgZGV0YWlsLCBidWJibGVzfSl7XG4gICAgZGV0YWlsID0gZGV0YWlsIHx8IHt9XG4gICAgZGV0YWlsLmRpc3BhdGNoZXIgPSBzb3VyY2VFbFxuICAgIERPTS5kaXNwYXRjaEV2ZW50KGVsLCBldmVudCwge2RldGFpbCwgYnViYmxlc30pXG4gIH0sXG5cbiAgZXhlY19wdXNoKGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwgYXJncyl7XG4gICAgaWYoIXZpZXcuaXNDb25uZWN0ZWQoKSl7IHJldHVybiB9XG5cbiAgICBsZXQge2V2ZW50LCBkYXRhLCB0YXJnZXQsIHBhZ2VfbG9hZGluZywgbG9hZGluZywgdmFsdWUsIGRpc3BhdGNoZXJ9ID0gYXJnc1xuICAgIGxldCBwdXNoT3B0cyA9IHtsb2FkaW5nLCB2YWx1ZSwgdGFyZ2V0LCBwYWdlX2xvYWRpbmc6ICEhcGFnZV9sb2FkaW5nfVxuICAgIGxldCB0YXJnZXRTcmMgPSBldmVudFR5cGUgPT09IFwiY2hhbmdlXCIgJiYgZGlzcGF0Y2hlciA/IGRpc3BhdGNoZXIgOiBzb3VyY2VFbFxuICAgIGxldCBwaHhUYXJnZXQgPSB0YXJnZXQgfHwgdGFyZ2V0U3JjLmdldEF0dHJpYnV0ZSh2aWV3LmJpbmRpbmcoXCJ0YXJnZXRcIikpIHx8IHRhcmdldFNyY1xuICAgIHZpZXcud2l0aGluVGFyZ2V0cyhwaHhUYXJnZXQsICh0YXJnZXRWaWV3LCB0YXJnZXRDdHgpID0+IHtcbiAgICAgIGlmKGV2ZW50VHlwZSA9PT0gXCJjaGFuZ2VcIil7XG4gICAgICAgIGxldCB7bmV3Q2lkLCBfdGFyZ2V0LCBjYWxsYmFja30gPSBhcmdzXG4gICAgICAgIF90YXJnZXQgPSBfdGFyZ2V0IHx8IChzb3VyY2VFbCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgPyBzb3VyY2VFbC5uYW1lIDogdW5kZWZpbmVkKVxuICAgICAgICBpZihfdGFyZ2V0KXsgcHVzaE9wdHMuX3RhcmdldCA9IF90YXJnZXQgfVxuICAgICAgICB0YXJnZXRWaWV3LnB1c2hJbnB1dChzb3VyY2VFbCwgdGFyZ2V0Q3R4LCBuZXdDaWQsIGV2ZW50IHx8IHBoeEV2ZW50LCBwdXNoT3B0cywgY2FsbGJhY2spXG4gICAgICB9IGVsc2UgaWYoZXZlbnRUeXBlID09PSBcInN1Ym1pdFwiKXtcbiAgICAgICAgdGFyZ2V0Vmlldy5zdWJtaXRGb3JtKHNvdXJjZUVsLCB0YXJnZXRDdHgsIGV2ZW50IHx8IHBoeEV2ZW50LCBwdXNoT3B0cylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldFZpZXcucHVzaEV2ZW50KGV2ZW50VHlwZSwgc291cmNlRWwsIHRhcmdldEN0eCwgZXZlbnQgfHwgcGh4RXZlbnQsIGRhdGEsIHB1c2hPcHRzKVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG5cbiAgZXhlY19hZGRfY2xhc3MoZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7bmFtZXMsIHRyYW5zaXRpb24sIHRpbWV9KXtcbiAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgbmFtZXMsIFtdLCB0cmFuc2l0aW9uLCB0aW1lLCB2aWV3KVxuICB9LFxuXG4gIGV4ZWNfcmVtb3ZlX2NsYXNzKGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwge25hbWVzLCB0cmFuc2l0aW9uLCB0aW1lfSl7XG4gICAgdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIFtdLCBuYW1lcywgdHJhbnNpdGlvbiwgdGltZSwgdmlldylcbiAgfSxcblxuICBleGVjX3RyYW5zaXRpb24oZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7dGltZSwgdHJhbnNpdGlvbn0pe1xuICAgIGxldCBbdHJhbnNpdGlvbl9zdGFydCwgcnVubmluZywgdHJhbnNpdGlvbl9lbmRdID0gdHJhbnNpdGlvblxuICAgIGxldCBvblN0YXJ0ID0gKCkgPT4gdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIHRyYW5zaXRpb25fc3RhcnQuY29uY2F0KHJ1bm5pbmcpLCBbXSlcbiAgICBsZXQgb25Eb25lID0gKCkgPT4gdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIHRyYW5zaXRpb25fZW5kLCB0cmFuc2l0aW9uX3N0YXJ0LmNvbmNhdChydW5uaW5nKSlcbiAgICB2aWV3LnRyYW5zaXRpb24odGltZSwgb25TdGFydCwgb25Eb25lKVxuICB9LFxuXG4gIGV4ZWNfdG9nZ2xlKGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwge2Rpc3BsYXksIGlucywgb3V0cywgdGltZX0pe1xuICAgIHRoaXMudG9nZ2xlKGV2ZW50VHlwZSwgdmlldywgZWwsIGRpc3BsYXksIGlucywgb3V0cywgdGltZSlcbiAgfSxcblxuICBleGVjX3Nob3coZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7ZGlzcGxheSwgdHJhbnNpdGlvbiwgdGltZX0pe1xuICAgIHRoaXMuc2hvdyhldmVudFR5cGUsIHZpZXcsIGVsLCBkaXNwbGF5LCB0cmFuc2l0aW9uLCB0aW1lKVxuICB9LFxuXG4gIGV4ZWNfaGlkZShldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHtkaXNwbGF5LCB0cmFuc2l0aW9uLCB0aW1lfSl7XG4gICAgdGhpcy5oaWRlKGV2ZW50VHlwZSwgdmlldywgZWwsIGRpc3BsYXksIHRyYW5zaXRpb24sIHRpbWUpXG4gIH0sXG5cbiAgZXhlY19zZXRfYXR0cihldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHthdHRyOiBbYXR0ciwgdmFsXX0pe1xuICAgIHRoaXMuc2V0T3JSZW1vdmVBdHRycyhlbCwgW1thdHRyLCB2YWxdXSwgW10pXG4gIH0sXG5cbiAgZXhlY19yZW1vdmVfYXR0cihldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHthdHRyfSl7XG4gICAgdGhpcy5zZXRPclJlbW92ZUF0dHJzKGVsLCBbXSwgW2F0dHJdKVxuICB9LFxuXG4gIC8vIHV0aWxzIGZvciBjb21tYW5kc1xuXG4gIHNob3coZXZlbnRUeXBlLCB2aWV3LCBlbCwgZGlzcGxheSwgdHJhbnNpdGlvbiwgdGltZSl7XG4gICAgaWYoIXRoaXMuaXNWaXNpYmxlKGVsKSl7XG4gICAgICB0aGlzLnRvZ2dsZShldmVudFR5cGUsIHZpZXcsIGVsLCBkaXNwbGF5LCB0cmFuc2l0aW9uLCBudWxsLCB0aW1lKVxuICAgIH1cbiAgfSxcblxuICBoaWRlKGV2ZW50VHlwZSwgdmlldywgZWwsIGRpc3BsYXksIHRyYW5zaXRpb24sIHRpbWUpe1xuICAgIGlmKHRoaXMuaXNWaXNpYmxlKGVsKSl7XG4gICAgICB0aGlzLnRvZ2dsZShldmVudFR5cGUsIHZpZXcsIGVsLCBkaXNwbGF5LCBudWxsLCB0cmFuc2l0aW9uLCB0aW1lKVxuICAgIH1cbiAgfSxcblxuICB0b2dnbGUoZXZlbnRUeXBlLCB2aWV3LCBlbCwgZGlzcGxheSwgaW5zLCBvdXRzLCB0aW1lKXtcbiAgICBsZXQgW2luQ2xhc3NlcywgaW5TdGFydENsYXNzZXMsIGluRW5kQ2xhc3Nlc10gPSBpbnMgfHwgW1tdLCBbXSwgW11dXG4gICAgbGV0IFtvdXRDbGFzc2VzLCBvdXRTdGFydENsYXNzZXMsIG91dEVuZENsYXNzZXNdID0gb3V0cyB8fCBbW10sIFtdLCBbXV1cbiAgICBpZihpbkNsYXNzZXMubGVuZ3RoID4gMCB8fCBvdXRDbGFzc2VzLmxlbmd0aCA+IDApe1xuICAgICAgaWYodGhpcy5pc1Zpc2libGUoZWwpKXtcbiAgICAgICAgbGV0IG9uU3RhcnQgPSAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIG91dFN0YXJ0Q2xhc3NlcywgaW5DbGFzc2VzLmNvbmNhdChpblN0YXJ0Q2xhc3NlcykuY29uY2F0KGluRW5kQ2xhc3NlcykpXG4gICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgb3V0Q2xhc3NlcywgW10pXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBvdXRFbmRDbGFzc2VzLCBvdXRTdGFydENsYXNzZXMpKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJwaHg6aGlkZS1zdGFydFwiKSlcbiAgICAgICAgdmlldy50cmFuc2l0aW9uKHRpbWUsIG9uU3RhcnQsICgpID0+IHtcbiAgICAgICAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgW10sIG91dENsYXNzZXMuY29uY2F0KG91dEVuZENsYXNzZXMpKVxuICAgICAgICAgIERPTS5wdXRTdGlja3koZWwsIFwidG9nZ2xlXCIsIGN1cnJlbnRFbCA9PiBjdXJyZW50RWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiKVxuICAgICAgICAgIGVsLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwicGh4OmhpZGUtZW5kXCIpKVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYoZXZlbnRUeXBlID09PSBcInJlbW92ZVwiKXsgcmV0dXJuIH1cbiAgICAgICAgbGV0IG9uU3RhcnQgPSAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIGluU3RhcnRDbGFzc2VzLCBvdXRDbGFzc2VzLmNvbmNhdChvdXRTdGFydENsYXNzZXMpLmNvbmNhdChvdXRFbmRDbGFzc2VzKSlcbiAgICAgICAgICBET00ucHV0U3RpY2t5KGVsLCBcInRvZ2dsZVwiLCBjdXJyZW50RWwgPT4gY3VycmVudEVsLnN0eWxlLmRpc3BsYXkgPSAoZGlzcGxheSB8fCBcImJsb2NrXCIpKVxuICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIGluQ2xhc3NlcywgW10pXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBpbkVuZENsYXNzZXMsIGluU3RhcnRDbGFzc2VzKSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGVsLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwicGh4OnNob3ctc3RhcnRcIikpXG4gICAgICAgIHZpZXcudHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIFtdLCBpbkNsYXNzZXMuY29uY2F0KGluRW5kQ2xhc3NlcykpXG4gICAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJwaHg6c2hvdy1lbmRcIikpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmKHRoaXMuaXNWaXNpYmxlKGVsKSl7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIGVsLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwicGh4OmhpZGUtc3RhcnRcIikpXG4gICAgICAgICAgRE9NLnB1dFN0aWNreShlbCwgXCJ0b2dnbGVcIiwgY3VycmVudEVsID0+IGN1cnJlbnRFbC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCIpXG4gICAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJwaHg6aGlkZS1lbmRcIikpXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInBoeDpzaG93LXN0YXJ0XCIpKVxuICAgICAgICAgIERPTS5wdXRTdGlja3koZWwsIFwidG9nZ2xlXCIsIGN1cnJlbnRFbCA9PiBjdXJyZW50RWwuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXkgfHwgXCJibG9ja1wiKVxuICAgICAgICAgIGVsLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwicGh4OnNob3ctZW5kXCIpKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBhZGRPclJlbW92ZUNsYXNzZXMoZWwsIGFkZHMsIHJlbW92ZXMsIHRyYW5zaXRpb24sIHRpbWUsIHZpZXcpe1xuICAgIGxldCBbdHJhbnNpdGlvbl9ydW4sIHRyYW5zaXRpb25fc3RhcnQsIHRyYW5zaXRpb25fZW5kXSA9IHRyYW5zaXRpb24gfHwgW1tdLCBbXSwgW11dXG4gICAgaWYodHJhbnNpdGlvbl9ydW4ubGVuZ3RoID4gMCl7XG4gICAgICBsZXQgb25TdGFydCA9ICgpID0+IHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCB0cmFuc2l0aW9uX3N0YXJ0LmNvbmNhdCh0cmFuc2l0aW9uX3J1biksIFtdKVxuICAgICAgbGV0IG9uRG9uZSA9ICgpID0+IHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBhZGRzLmNvbmNhdCh0cmFuc2l0aW9uX2VuZCksIHJlbW92ZXMuY29uY2F0KHRyYW5zaXRpb25fcnVuKS5jb25jYXQodHJhbnNpdGlvbl9zdGFydCkpXG4gICAgICByZXR1cm4gdmlldy50cmFuc2l0aW9uKHRpbWUsIG9uU3RhcnQsIG9uRG9uZSlcbiAgICB9XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICBsZXQgW3ByZXZBZGRzLCBwcmV2UmVtb3Zlc10gPSBET00uZ2V0U3RpY2t5KGVsLCBcImNsYXNzZXNcIiwgW1tdLCBbXV0pXG4gICAgICBsZXQga2VlcEFkZHMgPSBhZGRzLmZpbHRlcihuYW1lID0+IHByZXZBZGRzLmluZGV4T2YobmFtZSkgPCAwICYmICFlbC5jbGFzc0xpc3QuY29udGFpbnMobmFtZSkpXG4gICAgICBsZXQga2VlcFJlbW92ZXMgPSByZW1vdmVzLmZpbHRlcihuYW1lID0+IHByZXZSZW1vdmVzLmluZGV4T2YobmFtZSkgPCAwICYmIGVsLmNsYXNzTGlzdC5jb250YWlucyhuYW1lKSlcbiAgICAgIGxldCBuZXdBZGRzID0gcHJldkFkZHMuZmlsdGVyKG5hbWUgPT4gcmVtb3Zlcy5pbmRleE9mKG5hbWUpIDwgMCkuY29uY2F0KGtlZXBBZGRzKVxuICAgICAgbGV0IG5ld1JlbW92ZXMgPSBwcmV2UmVtb3Zlcy5maWx0ZXIobmFtZSA9PiBhZGRzLmluZGV4T2YobmFtZSkgPCAwKS5jb25jYXQoa2VlcFJlbW92ZXMpXG5cbiAgICAgIERPTS5wdXRTdGlja3koZWwsIFwiY2xhc3Nlc1wiLCBjdXJyZW50RWwgPT4ge1xuICAgICAgICBjdXJyZW50RWwuY2xhc3NMaXN0LnJlbW92ZSguLi5uZXdSZW1vdmVzKVxuICAgICAgICBjdXJyZW50RWwuY2xhc3NMaXN0LmFkZCguLi5uZXdBZGRzKVxuICAgICAgICByZXR1cm4gW25ld0FkZHMsIG5ld1JlbW92ZXNdXG4gICAgICB9KVxuICAgIH0pXG4gIH0sXG5cbiAgc2V0T3JSZW1vdmVBdHRycyhlbCwgc2V0cywgcmVtb3Zlcyl7XG4gICAgbGV0IFtwcmV2U2V0cywgcHJldlJlbW92ZXNdID0gRE9NLmdldFN0aWNreShlbCwgXCJhdHRyc1wiLCBbW10sIFtdXSlcblxuICAgIGxldCBhbHRlcmVkQXR0cnMgPSBzZXRzLm1hcCgoW2F0dHIsIF92YWxdKSA9PiBhdHRyKS5jb25jYXQocmVtb3Zlcyk7XG4gICAgbGV0IG5ld1NldHMgPSBwcmV2U2V0cy5maWx0ZXIoKFthdHRyLCBfdmFsXSkgPT4gIWFsdGVyZWRBdHRycy5pbmNsdWRlcyhhdHRyKSkuY29uY2F0KHNldHMpO1xuICAgIGxldCBuZXdSZW1vdmVzID0gcHJldlJlbW92ZXMuZmlsdGVyKChhdHRyKSA9PiAhYWx0ZXJlZEF0dHJzLmluY2x1ZGVzKGF0dHIpKS5jb25jYXQocmVtb3Zlcyk7XG5cbiAgICBET00ucHV0U3RpY2t5KGVsLCBcImF0dHJzXCIsIGN1cnJlbnRFbCA9PiB7XG4gICAgICBuZXdSZW1vdmVzLmZvckVhY2goYXR0ciA9PiBjdXJyZW50RWwucmVtb3ZlQXR0cmlidXRlKGF0dHIpKVxuICAgICAgbmV3U2V0cy5mb3JFYWNoKChbYXR0ciwgdmFsXSkgPT4gY3VycmVudEVsLnNldEF0dHJpYnV0ZShhdHRyLCB2YWwpKVxuICAgICAgcmV0dXJuIFtuZXdTZXRzLCBuZXdSZW1vdmVzXVxuICAgIH0pXG4gIH0sXG5cbiAgaGFzQWxsQ2xhc3NlcyhlbCwgY2xhc3Nlcyl7IHJldHVybiBjbGFzc2VzLmV2ZXJ5KG5hbWUgPT4gZWwuY2xhc3NMaXN0LmNvbnRhaW5zKG5hbWUpKSB9LFxuXG4gIGlzVG9nZ2xlZE91dChlbCwgb3V0Q2xhc3Nlcyl7XG4gICAgcmV0dXJuICF0aGlzLmlzVmlzaWJsZShlbCkgfHwgdGhpcy5oYXNBbGxDbGFzc2VzKGVsLCBvdXRDbGFzc2VzKVxuICB9LFxuXG4gIGZpbHRlclRvRWxzKHNvdXJjZUVsLCB7dG99KXtcbiAgICByZXR1cm4gdG8gPyBET00uYWxsKGRvY3VtZW50LCB0bykgOiBbc291cmNlRWxdXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSlNcbiIsICJpbXBvcnQge1xuICBCRUZPUkVfVU5MT0FEX0xPQURFUl9USU1FT1VULFxuICBDSEVDS0FCTEVfSU5QVVRTLFxuICBDT05TRUNVVElWRV9SRUxPQURTLFxuICBQSFhfQVVUT19SRUNPVkVSLFxuICBQSFhfQ09NUE9ORU5ULFxuICBQSFhfQ09OTkVDVEVEX0NMQVNTLFxuICBQSFhfRElTQUJMRV9XSVRILFxuICBQSFhfRElTQUJMRV9XSVRIX1JFU1RPUkUsXG4gIFBIWF9ESVNBQkxFRCxcbiAgUEhYX0RJU0NPTk5FQ1RFRF9DTEFTUyxcbiAgUEhYX0VWRU5UX0NMQVNTRVMsXG4gIFBIWF9FUlJPUl9DTEFTUyxcbiAgUEhYX0ZFRURCQUNLX0ZPUixcbiAgUEhYX0hBU19TVUJNSVRURUQsXG4gIFBIWF9IT09LLFxuICBQSFhfUEFHRV9MT0FESU5HLFxuICBQSFhfUEFSRU5UX0lELFxuICBQSFhfUFJPR1JFU1MsXG4gIFBIWF9SRUFET05MWSxcbiAgUEhYX1JFRixcbiAgUEhYX1JFRl9TUkMsXG4gIFBIWF9ST09UX0lELFxuICBQSFhfU0VTU0lPTixcbiAgUEhYX1NUQVRJQyxcbiAgUEhYX1RSQUNLX1NUQVRJQyxcbiAgUEhYX1RSQUNLX1VQTE9BRFMsXG4gIFBIWF9VUERBVEUsXG4gIFBIWF9VUExPQURfUkVGLFxuICBQSFhfVklFV19TRUxFQ1RPUixcbiAgUFVTSF9USU1FT1VULFxuICBQSFhfTUFJTixcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IHtcbiAgY2xvbmUsXG4gIGNsb3Nlc3RQaHhCaW5kaW5nLFxuICBpc0VtcHR5LFxuICBpc0VxdWFsT2JqLFxuICBsb2dFcnJvcixcbiAgbWF5YmUsXG4gIGlzQ2lkLFxufSBmcm9tIFwiLi91dGlsc1wiXG5cbmltcG9ydCBCcm93c2VyIGZyb20gXCIuL2Jyb3dzZXJcIlxuaW1wb3J0IERPTSBmcm9tIFwiLi9kb21cIlxuaW1wb3J0IERPTVBhdGNoIGZyb20gXCIuL2RvbV9wYXRjaFwiXG5pbXBvcnQgTGl2ZVVwbG9hZGVyIGZyb20gXCIuL2xpdmVfdXBsb2FkZXJcIlxuaW1wb3J0IFJlbmRlcmVkIGZyb20gXCIuL3JlbmRlcmVkXCJcbmltcG9ydCBWaWV3SG9vayBmcm9tIFwiLi92aWV3X2hvb2tcIlxuaW1wb3J0IEpTIGZyb20gXCIuL2pzXCJcblxubGV0IHNlcmlhbGl6ZUZvcm0gPSAoZm9ybSwgbWV0YSwgb25seU5hbWVzID0gW10pID0+IHtcbiAgbGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGZvcm0pXG4gIGxldCB0b1JlbW92ZSA9IFtdXG5cbiAgZm9ybURhdGEuZm9yRWFjaCgodmFsLCBrZXksIF9pbmRleCkgPT4ge1xuICAgIGlmKHZhbCBpbnN0YW5jZW9mIEZpbGUpeyB0b1JlbW92ZS5wdXNoKGtleSkgfVxuICB9KVxuXG4gIC8vIENsZWFudXAgYWZ0ZXIgYnVpbGRpbmcgZmlsZURhdGFcbiAgdG9SZW1vdmUuZm9yRWFjaChrZXkgPT4gZm9ybURhdGEuZGVsZXRlKGtleSkpXG5cbiAgbGV0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoKVxuICBmb3IobGV0IFtrZXksIHZhbF0gb2YgZm9ybURhdGEuZW50cmllcygpKXtcbiAgICBpZihvbmx5TmFtZXMubGVuZ3RoID09PSAwIHx8IG9ubHlOYW1lcy5pbmRleE9mKGtleSkgPj0gMCl7XG4gICAgICBwYXJhbXMuYXBwZW5kKGtleSwgdmFsKVxuICAgIH1cbiAgfVxuICBmb3IobGV0IG1ldGFLZXkgaW4gbWV0YSl7IHBhcmFtcy5hcHBlbmQobWV0YUtleSwgbWV0YVttZXRhS2V5XSkgfVxuXG4gIHJldHVybiBwYXJhbXMudG9TdHJpbmcoKVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWV3IHtcbiAgY29uc3RydWN0b3IoZWwsIGxpdmVTb2NrZXQsIHBhcmVudFZpZXcsIGZsYXNoKXtcbiAgICB0aGlzLmxpdmVTb2NrZXQgPSBsaXZlU29ja2V0XG4gICAgdGhpcy5mbGFzaCA9IGZsYXNoXG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnRWaWV3XG4gICAgdGhpcy5yb290ID0gcGFyZW50VmlldyA/IHBhcmVudFZpZXcucm9vdCA6IHRoaXNcbiAgICB0aGlzLmVsID0gZWxcbiAgICB0aGlzLmlkID0gdGhpcy5lbC5pZFxuICAgIHRoaXMucmVmID0gMFxuICAgIHRoaXMuY2hpbGRKb2lucyA9IDBcbiAgICB0aGlzLmxvYWRlclRpbWVyID0gbnVsbFxuICAgIHRoaXMucGVuZGluZ0RpZmZzID0gW11cbiAgICB0aGlzLnBydW5pbmdDSURzID0gW11cbiAgICB0aGlzLnJlZGlyZWN0ID0gZmFsc2VcbiAgICB0aGlzLmhyZWYgPSBudWxsXG4gICAgdGhpcy5qb2luQ291bnQgPSB0aGlzLnBhcmVudCA/IHRoaXMucGFyZW50LmpvaW5Db3VudCAtIDEgOiAwXG4gICAgdGhpcy5qb2luUGVuZGluZyA9IHRydWVcbiAgICB0aGlzLmRlc3Ryb3llZCA9IGZhbHNlXG4gICAgdGhpcy5qb2luQ2FsbGJhY2sgPSBmdW5jdGlvbihvbkRvbmUpeyBvbkRvbmUgJiYgb25Eb25lKCkgfVxuICAgIHRoaXMuc3RvcENhbGxiYWNrID0gZnVuY3Rpb24oKXsgfVxuICAgIHRoaXMucGVuZGluZ0pvaW5PcHMgPSB0aGlzLnBhcmVudCA/IG51bGwgOiBbXVxuICAgIHRoaXMudmlld0hvb2tzID0ge31cbiAgICB0aGlzLnVwbG9hZGVycyA9IHt9XG4gICAgdGhpcy5mb3JtU3VibWl0cyA9IFtdXG4gICAgdGhpcy5jaGlsZHJlbiA9IHRoaXMucGFyZW50ID8gbnVsbCA6IHt9XG4gICAgdGhpcy5yb290LmNoaWxkcmVuW3RoaXMuaWRdID0ge31cbiAgICB0aGlzLmNoYW5uZWwgPSB0aGlzLmxpdmVTb2NrZXQuY2hhbm5lbChgbHY6JHt0aGlzLmlkfWAsICgpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJlZGlyZWN0OiB0aGlzLnJlZGlyZWN0ID8gdGhpcy5ocmVmIDogdW5kZWZpbmVkLFxuICAgICAgICB1cmw6IHRoaXMucmVkaXJlY3QgPyB1bmRlZmluZWQgOiB0aGlzLmhyZWYgfHwgdW5kZWZpbmVkLFxuICAgICAgICBwYXJhbXM6IHRoaXMuY29ubmVjdFBhcmFtcygpLFxuICAgICAgICBzZXNzaW9uOiB0aGlzLmdldFNlc3Npb24oKSxcbiAgICAgICAgc3RhdGljOiB0aGlzLmdldFN0YXRpYygpLFxuICAgICAgICBmbGFzaDogdGhpcy5mbGFzaFxuICAgICAgfVxuICAgIH0pXG4gICAgdGhpcy5zaG93TG9hZGVyKHRoaXMubGl2ZVNvY2tldC5sb2FkZXJUaW1lb3V0KVxuICAgIHRoaXMuYmluZENoYW5uZWwoKVxuICB9XG5cbiAgc2V0SHJlZihocmVmKXsgdGhpcy5ocmVmID0gaHJlZiB9XG5cbiAgc2V0UmVkaXJlY3QoaHJlZil7XG4gICAgdGhpcy5yZWRpcmVjdCA9IHRydWVcbiAgICB0aGlzLmhyZWYgPSBocmVmXG4gIH1cblxuICBpc01haW4oKXsgcmV0dXJuIHRoaXMuZWwuZ2V0QXR0cmlidXRlKFBIWF9NQUlOKSAhPT0gbnVsbCB9XG5cbiAgY29ubmVjdFBhcmFtcygpe1xuICAgIGxldCBwYXJhbXMgPSB0aGlzLmxpdmVTb2NrZXQucGFyYW1zKHRoaXMuZWwpXG4gICAgbGV0IG1hbmlmZXN0ID1cbiAgICAgIERPTS5hbGwoZG9jdW1lbnQsIGBbJHt0aGlzLmJpbmRpbmcoUEhYX1RSQUNLX1NUQVRJQyl9XWApXG4gICAgICAgIC5tYXAobm9kZSA9PiBub2RlLnNyYyB8fCBub2RlLmhyZWYpLmZpbHRlcih1cmwgPT4gdHlwZW9mICh1cmwpID09PSBcInN0cmluZ1wiKVxuXG4gICAgaWYobWFuaWZlc3QubGVuZ3RoID4gMCl7IHBhcmFtc1tcIl90cmFja19zdGF0aWNcIl0gPSBtYW5pZmVzdCB9XG4gICAgcGFyYW1zW1wiX21vdW50c1wiXSA9IHRoaXMuam9pbkNvdW50XG5cbiAgICByZXR1cm4gcGFyYW1zXG4gIH1cblxuICBpc0Nvbm5lY3RlZCgpeyByZXR1cm4gdGhpcy5jaGFubmVsLmNhblB1c2goKSB9XG5cbiAgZ2V0U2Vzc2lvbigpeyByZXR1cm4gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoUEhYX1NFU1NJT04pIH1cblxuICBnZXRTdGF0aWMoKXtcbiAgICBsZXQgdmFsID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoUEhYX1NUQVRJQylcbiAgICByZXR1cm4gdmFsID09PSBcIlwiID8gbnVsbCA6IHZhbFxuICB9XG5cbiAgZGVzdHJveShjYWxsYmFjayA9IGZ1bmN0aW9uICgpeyB9KXtcbiAgICB0aGlzLmRlc3Ryb3lBbGxDaGlsZHJlbigpXG4gICAgdGhpcy5kZXN0cm95ZWQgPSB0cnVlXG4gICAgZGVsZXRlIHRoaXMucm9vdC5jaGlsZHJlblt0aGlzLmlkXVxuICAgIGlmKHRoaXMucGFyZW50KXsgZGVsZXRlIHRoaXMucm9vdC5jaGlsZHJlblt0aGlzLnBhcmVudC5pZF1bdGhpcy5pZF0gfVxuICAgIGNsZWFyVGltZW91dCh0aGlzLmxvYWRlclRpbWVyKVxuICAgIGxldCBvbkZpbmlzaGVkID0gKCkgPT4ge1xuICAgICAgY2FsbGJhY2soKVxuICAgICAgZm9yKGxldCBpZCBpbiB0aGlzLnZpZXdIb29rcyl7XG4gICAgICAgIHRoaXMuZGVzdHJveUhvb2sodGhpcy52aWV3SG9va3NbaWRdKVxuICAgICAgfVxuICAgIH1cblxuICAgIERPTS5tYXJrUGh4Q2hpbGREZXN0cm95ZWQodGhpcy5lbClcblxuICAgIHRoaXMubG9nKFwiZGVzdHJveWVkXCIsICgpID0+IFtcInRoZSBjaGlsZCBoYXMgYmVlbiByZW1vdmVkIGZyb20gdGhlIHBhcmVudFwiXSlcbiAgICB0aGlzLmNoYW5uZWwubGVhdmUoKVxuICAgICAgLnJlY2VpdmUoXCJva1wiLCBvbkZpbmlzaGVkKVxuICAgICAgLnJlY2VpdmUoXCJlcnJvclwiLCBvbkZpbmlzaGVkKVxuICAgICAgLnJlY2VpdmUoXCJ0aW1lb3V0XCIsIG9uRmluaXNoZWQpXG4gIH1cblxuICBzZXRDb250YWluZXJDbGFzc2VzKC4uLmNsYXNzZXMpe1xuICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZShcbiAgICAgIFBIWF9DT05ORUNURURfQ0xBU1MsXG4gICAgICBQSFhfRElTQ09OTkVDVEVEX0NMQVNTLFxuICAgICAgUEhYX0VSUk9SX0NMQVNTXG4gICAgKVxuICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCguLi5jbGFzc2VzKVxuICB9XG5cbiAgc2hvd0xvYWRlcih0aW1lb3V0KXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5sb2FkZXJUaW1lcilcbiAgICBpZih0aW1lb3V0KXtcbiAgICAgIHRoaXMubG9hZGVyVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2hvd0xvYWRlcigpLCB0aW1lb3V0KVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IobGV0IGlkIGluIHRoaXMudmlld0hvb2tzKXsgdGhpcy52aWV3SG9va3NbaWRdLl9fZGlzY29ubmVjdGVkKCkgfVxuICAgICAgdGhpcy5zZXRDb250YWluZXJDbGFzc2VzKFBIWF9ESVNDT05ORUNURURfQ0xBU1MpXG4gICAgfVxuICB9XG5cbiAgaGlkZUxvYWRlcigpe1xuICAgIGNsZWFyVGltZW91dCh0aGlzLmxvYWRlclRpbWVyKVxuICAgIHRoaXMuc2V0Q29udGFpbmVyQ2xhc3NlcyhQSFhfQ09OTkVDVEVEX0NMQVNTKVxuICB9XG5cbiAgdHJpZ2dlclJlY29ubmVjdGVkKCl7XG4gICAgZm9yKGxldCBpZCBpbiB0aGlzLnZpZXdIb29rcyl7IHRoaXMudmlld0hvb2tzW2lkXS5fX3JlY29ubmVjdGVkKCkgfVxuICB9XG5cbiAgbG9nKGtpbmQsIG1zZ0NhbGxiYWNrKXtcbiAgICB0aGlzLmxpdmVTb2NrZXQubG9nKHRoaXMsIGtpbmQsIG1zZ0NhbGxiYWNrKVxuICB9XG5cbiAgdHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCBvbkRvbmUgPSBmdW5jdGlvbigpe30pe1xuICAgIHRoaXMubGl2ZVNvY2tldC50cmFuc2l0aW9uKHRpbWUsIG9uU3RhcnQsIG9uRG9uZSlcbiAgfVxuXG4gIHdpdGhpblRhcmdldHMocGh4VGFyZ2V0LCBjYWxsYmFjayl7XG4gICAgaWYocGh4VGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgfHwgcGh4VGFyZ2V0IGluc3RhbmNlb2YgU1ZHRWxlbWVudCl7XG4gICAgICByZXR1cm4gdGhpcy5saXZlU29ja2V0Lm93bmVyKHBoeFRhcmdldCwgdmlldyA9PiBjYWxsYmFjayh2aWV3LCBwaHhUYXJnZXQpKVxuICAgIH1cblxuICAgIGlmKGlzQ2lkKHBoeFRhcmdldCkpe1xuICAgICAgbGV0IHRhcmdldHMgPSBET00uZmluZENvbXBvbmVudE5vZGVMaXN0KHRoaXMuZWwsIHBoeFRhcmdldClcbiAgICAgIGlmKHRhcmdldHMubGVuZ3RoID09PSAwKXtcbiAgICAgICAgbG9nRXJyb3IoYG5vIGNvbXBvbmVudCBmb3VuZCBtYXRjaGluZyBwaHgtdGFyZ2V0IG9mICR7cGh4VGFyZ2V0fWApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayh0aGlzLCBwYXJzZUludChwaHhUYXJnZXQpKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgdGFyZ2V0cyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChwaHhUYXJnZXQpKVxuICAgICAgaWYodGFyZ2V0cy5sZW5ndGggPT09IDApeyBsb2dFcnJvcihgbm90aGluZyBmb3VuZCBtYXRjaGluZyB0aGUgcGh4LXRhcmdldCBzZWxlY3RvciBcIiR7cGh4VGFyZ2V0fVwiYCkgfVxuICAgICAgdGFyZ2V0cy5mb3JFYWNoKHRhcmdldCA9PiB0aGlzLmxpdmVTb2NrZXQub3duZXIodGFyZ2V0LCB2aWV3ID0+IGNhbGxiYWNrKHZpZXcsIHRhcmdldCkpKVxuICAgIH1cbiAgfVxuXG4gIGFwcGx5RGlmZih0eXBlLCByYXdEaWZmLCBjYWxsYmFjayl7XG4gICAgdGhpcy5sb2codHlwZSwgKCkgPT4gW1wiXCIsIGNsb25lKHJhd0RpZmYpXSlcbiAgICBsZXQge2RpZmYsIHJlcGx5LCBldmVudHMsIHRpdGxlfSA9IFJlbmRlcmVkLmV4dHJhY3QocmF3RGlmZilcbiAgICBpZih0aXRsZSl7IERPTS5wdXRUaXRsZSh0aXRsZSkgfVxuXG4gICAgY2FsbGJhY2soe2RpZmYsIHJlcGx5LCBldmVudHN9KVxuICAgIHJldHVybiByZXBseVxuICB9XG5cbiAgb25Kb2luKHJlc3Ape1xuICAgIGxldCB7cmVuZGVyZWQsIGNvbnRhaW5lcn0gPSByZXNwXG4gICAgaWYoY29udGFpbmVyKXtcbiAgICAgIGxldCBbdGFnLCBhdHRyc10gPSBjb250YWluZXJcbiAgICAgIHRoaXMuZWwgPSBET00ucmVwbGFjZVJvb3RDb250YWluZXIodGhpcy5lbCwgdGFnLCBhdHRycylcbiAgICB9XG4gICAgdGhpcy5jaGlsZEpvaW5zID0gMFxuICAgIHRoaXMuam9pblBlbmRpbmcgPSB0cnVlXG4gICAgdGhpcy5mbGFzaCA9IG51bGxcblxuICAgIEJyb3dzZXIuZHJvcExvY2FsKHRoaXMubGl2ZVNvY2tldC5sb2NhbFN0b3JhZ2UsIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSwgQ09OU0VDVVRJVkVfUkVMT0FEUylcbiAgICB0aGlzLmFwcGx5RGlmZihcIm1vdW50XCIsIHJlbmRlcmVkLCAoe2RpZmYsIGV2ZW50c30pID0+IHtcbiAgICAgIHRoaXMucmVuZGVyZWQgPSBuZXcgUmVuZGVyZWQodGhpcy5pZCwgZGlmZilcbiAgICAgIGxldCBodG1sID0gdGhpcy5yZW5kZXJDb250YWluZXIobnVsbCwgXCJqb2luXCIpXG4gICAgICB0aGlzLmRyb3BQZW5kaW5nUmVmcygpXG4gICAgICBsZXQgZm9ybXMgPSB0aGlzLmZvcm1zRm9yUmVjb3ZlcnkoaHRtbClcbiAgICAgIHRoaXMuam9pbkNvdW50KytcblxuICAgICAgaWYoZm9ybXMubGVuZ3RoID4gMCl7XG4gICAgICAgIGZvcm1zLmZvckVhY2goKFtmb3JtLCBuZXdGb3JtLCBuZXdDaWRdLCBpKSA9PiB7XG4gICAgICAgICAgdGhpcy5wdXNoRm9ybVJlY292ZXJ5KGZvcm0sIG5ld0NpZCwgcmVzcCA9PiB7XG4gICAgICAgICAgICBpZihpID09PSBmb3Jtcy5sZW5ndGggLSAxKXtcbiAgICAgICAgICAgICAgdGhpcy5vbkpvaW5Db21wbGV0ZShyZXNwLCBodG1sLCBldmVudHMpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub25Kb2luQ29tcGxldGUocmVzcCwgaHRtbCwgZXZlbnRzKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBkcm9wUGVuZGluZ1JlZnMoKXtcbiAgICBET00uYWxsKGRvY3VtZW50LCBgWyR7UEhYX1JFRl9TUkN9PVwiJHt0aGlzLmlkfVwiXVske1BIWF9SRUZ9XWAsIGVsID0+IHtcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfUkVGKVxuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKFBIWF9SRUZfU1JDKVxuICAgIH0pXG4gIH1cblxuICBvbkpvaW5Db21wbGV0ZSh7bGl2ZV9wYXRjaH0sIGh0bWwsIGV2ZW50cyl7XG4gICAgLy8gSW4gb3JkZXIgdG8gcHJvdmlkZSBhIGJldHRlciBleHBlcmllbmNlLCB3ZSB3YW50IHRvIGpvaW5cbiAgICAvLyBhbGwgTGl2ZVZpZXdzIGZpcnN0IGFuZCBvbmx5IHRoZW4gYXBwbHkgdGhlaXIgcGF0Y2hlcy5cbiAgICBpZih0aGlzLmpvaW5Db3VudCA+IDEgfHwgKHRoaXMucGFyZW50ICYmICF0aGlzLnBhcmVudC5pc0pvaW5QZW5kaW5nKCkpKXtcbiAgICAgIHJldHVybiB0aGlzLmFwcGx5Sm9pblBhdGNoKGxpdmVfcGF0Y2gsIGh0bWwsIGV2ZW50cylcbiAgICB9XG5cbiAgICAvLyBPbmUgZG93bnNpZGUgb2YgdGhpcyBhcHByb2FjaCBpcyB0aGF0IHdlIG5lZWQgdG8gZmluZCBwaHhDaGlsZHJlblxuICAgIC8vIGluIHRoZSBodG1sIGZyYWdtZW50LCBpbnN0ZWFkIG9mIGRpcmVjdGx5IG9uIHRoZSBET00uIFRoZSBmcmFnbWVudFxuICAgIC8vIGFsc28gZG9lcyBub3QgaW5jbHVkZSBQSFhfU1RBVElDLCBzbyB3ZSBuZWVkIHRvIGNvcHkgaXQgb3ZlciBmcm9tXG4gICAgLy8gdGhlIERPTS5cbiAgICBsZXQgbmV3Q2hpbGRyZW4gPSBET00uZmluZFBoeENoaWxkcmVuSW5GcmFnbWVudChodG1sLCB0aGlzLmlkKS5maWx0ZXIodG9FbCA9PiB7XG4gICAgICBsZXQgZnJvbUVsID0gdG9FbC5pZCAmJiB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoYFtpZD1cIiR7dG9FbC5pZH1cIl1gKVxuICAgICAgbGV0IHBoeFN0YXRpYyA9IGZyb21FbCAmJiBmcm9tRWwuZ2V0QXR0cmlidXRlKFBIWF9TVEFUSUMpXG4gICAgICBpZihwaHhTdGF0aWMpeyB0b0VsLnNldEF0dHJpYnV0ZShQSFhfU1RBVElDLCBwaHhTdGF0aWMpIH1cbiAgICAgIHJldHVybiB0aGlzLmpvaW5DaGlsZCh0b0VsKVxuICAgIH0pXG5cbiAgICBpZihuZXdDaGlsZHJlbi5sZW5ndGggPT09IDApe1xuICAgICAgaWYodGhpcy5wYXJlbnQpe1xuICAgICAgICB0aGlzLnJvb3QucGVuZGluZ0pvaW5PcHMucHVzaChbdGhpcywgKCkgPT4gdGhpcy5hcHBseUpvaW5QYXRjaChsaXZlX3BhdGNoLCBodG1sLCBldmVudHMpXSlcbiAgICAgICAgdGhpcy5wYXJlbnQuYWNrSm9pbih0aGlzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vbkFsbENoaWxkSm9pbnNDb21wbGV0ZSgpXG4gICAgICAgIHRoaXMuYXBwbHlKb2luUGF0Y2gobGl2ZV9wYXRjaCwgaHRtbCwgZXZlbnRzKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJvb3QucGVuZGluZ0pvaW5PcHMucHVzaChbdGhpcywgKCkgPT4gdGhpcy5hcHBseUpvaW5QYXRjaChsaXZlX3BhdGNoLCBodG1sLCBldmVudHMpXSlcbiAgICB9XG4gIH1cblxuICBhdHRhY2hUcnVlRG9jRWwoKXtcbiAgICB0aGlzLmVsID0gRE9NLmJ5SWQodGhpcy5pZClcbiAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZShQSFhfUk9PVF9JRCwgdGhpcy5yb290LmlkKVxuICB9XG5cbiAgYXBwbHlKb2luUGF0Y2gobGl2ZV9wYXRjaCwgaHRtbCwgZXZlbnRzKXtcbiAgICB0aGlzLmF0dGFjaFRydWVEb2NFbCgpXG4gICAgbGV0IHBhdGNoID0gbmV3IERPTVBhdGNoKHRoaXMsIHRoaXMuZWwsIHRoaXMuaWQsIGh0bWwsIG51bGwpXG4gICAgcGF0Y2gubWFya1BydW5hYmxlQ29udGVudEZvclJlbW92YWwoKVxuICAgIHRoaXMucGVyZm9ybVBhdGNoKHBhdGNoLCBmYWxzZSlcbiAgICB0aGlzLmpvaW5OZXdDaGlsZHJlbigpXG4gICAgRE9NLmFsbCh0aGlzLmVsLCBgWyR7dGhpcy5iaW5kaW5nKFBIWF9IT09LKX1dLCBbZGF0YS1waHgtJHtQSFhfSE9PS31dYCwgaG9va0VsID0+IHtcbiAgICAgIGxldCBob29rID0gdGhpcy5hZGRIb29rKGhvb2tFbClcbiAgICAgIGlmKGhvb2speyBob29rLl9fbW91bnRlZCgpIH1cbiAgICB9KVxuXG4gICAgdGhpcy5qb2luUGVuZGluZyA9IGZhbHNlXG4gICAgdGhpcy5saXZlU29ja2V0LmRpc3BhdGNoRXZlbnRzKGV2ZW50cylcbiAgICB0aGlzLmFwcGx5UGVuZGluZ1VwZGF0ZXMoKVxuXG4gICAgaWYobGl2ZV9wYXRjaCl7XG4gICAgICBsZXQge2tpbmQsIHRvfSA9IGxpdmVfcGF0Y2hcbiAgICAgIHRoaXMubGl2ZVNvY2tldC5oaXN0b3J5UGF0Y2godG8sIGtpbmQpXG4gICAgfVxuICAgIHRoaXMuaGlkZUxvYWRlcigpXG4gICAgaWYodGhpcy5qb2luQ291bnQgPiAxKXsgdGhpcy50cmlnZ2VyUmVjb25uZWN0ZWQoKSB9XG4gICAgdGhpcy5zdG9wQ2FsbGJhY2soKVxuICB9XG5cbiAgdHJpZ2dlckJlZm9yZVVwZGF0ZUhvb2soZnJvbUVsLCB0b0VsKXtcbiAgICB0aGlzLmxpdmVTb2NrZXQudHJpZ2dlckRPTShcIm9uQmVmb3JlRWxVcGRhdGVkXCIsIFtmcm9tRWwsIHRvRWxdKVxuICAgIGxldCBob29rID0gdGhpcy5nZXRIb29rKGZyb21FbClcbiAgICBsZXQgaXNJZ25vcmVkID0gaG9vayAmJiBET00uaXNJZ25vcmVkKGZyb21FbCwgdGhpcy5iaW5kaW5nKFBIWF9VUERBVEUpKVxuICAgIGlmKGhvb2sgJiYgIWZyb21FbC5pc0VxdWFsTm9kZSh0b0VsKSAmJiAhKGlzSWdub3JlZCAmJiBpc0VxdWFsT2JqKGZyb21FbC5kYXRhc2V0LCB0b0VsLmRhdGFzZXQpKSl7XG4gICAgICBob29rLl9fYmVmb3JlVXBkYXRlKClcbiAgICAgIHJldHVybiBob29rXG4gICAgfVxuICB9XG5cbiAgcGVyZm9ybVBhdGNoKHBhdGNoLCBwcnVuZUNpZHMpe1xuICAgIGxldCByZW1vdmVkRWxzID0gW11cbiAgICBsZXQgcGh4Q2hpbGRyZW5BZGRlZCA9IGZhbHNlXG4gICAgbGV0IHVwZGF0ZWRIb29rSWRzID0gbmV3IFNldCgpXG5cbiAgICBwYXRjaC5hZnRlcihcImFkZGVkXCIsIGVsID0+IHtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC50cmlnZ2VyRE9NKFwib25Ob2RlQWRkZWRcIiwgW2VsXSlcblxuICAgICAgbGV0IG5ld0hvb2sgPSB0aGlzLmFkZEhvb2soZWwpXG4gICAgICBpZihuZXdIb29rKXsgbmV3SG9vay5fX21vdW50ZWQoKSB9XG4gICAgfSlcblxuICAgIHBhdGNoLmFmdGVyKFwicGh4Q2hpbGRBZGRlZFwiLCBlbCA9PiB7XG4gICAgICBpZihET00uaXNQaHhTdGlja3koZWwpKXtcbiAgICAgICAgdGhpcy5saXZlU29ja2V0LmpvaW5Sb290Vmlld3MoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGh4Q2hpbGRyZW5BZGRlZCA9IHRydWVcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcGF0Y2guYmVmb3JlKFwidXBkYXRlZFwiLCAoZnJvbUVsLCB0b0VsKSA9PiB7XG4gICAgICBsZXQgaG9vayA9IHRoaXMudHJpZ2dlckJlZm9yZVVwZGF0ZUhvb2soZnJvbUVsLCB0b0VsKVxuICAgICAgaWYoaG9vayl7IHVwZGF0ZWRIb29rSWRzLmFkZChmcm9tRWwuaWQpIH1cbiAgICB9KVxuXG4gICAgcGF0Y2guYWZ0ZXIoXCJ1cGRhdGVkXCIsIGVsID0+IHtcbiAgICAgIGlmKHVwZGF0ZWRIb29rSWRzLmhhcyhlbC5pZCkpeyB0aGlzLmdldEhvb2soZWwpLl9fdXBkYXRlZCgpIH1cbiAgICB9KVxuXG4gICAgcGF0Y2guYWZ0ZXIoXCJkaXNjYXJkZWRcIiwgKGVsKSA9PiB7XG4gICAgICBpZihlbC5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUpeyByZW1vdmVkRWxzLnB1c2goZWwpIH1cbiAgICB9KVxuXG4gICAgcGF0Y2guYWZ0ZXIoXCJ0cmFuc2l0aW9uc0Rpc2NhcmRlZFwiLCBlbHMgPT4gdGhpcy5hZnRlckVsZW1lbnRzUmVtb3ZlZChlbHMsIHBydW5lQ2lkcykpXG4gICAgcGF0Y2gucGVyZm9ybSgpXG4gICAgdGhpcy5hZnRlckVsZW1lbnRzUmVtb3ZlZChyZW1vdmVkRWxzLCBwcnVuZUNpZHMpXG5cbiAgICByZXR1cm4gcGh4Q2hpbGRyZW5BZGRlZFxuICB9XG5cbiAgYWZ0ZXJFbGVtZW50c1JlbW92ZWQoZWxlbWVudHMsIHBydW5lQ2lkcyl7XG4gICAgbGV0IGRlc3Ryb3llZENJRHMgPSBbXVxuICAgIGVsZW1lbnRzLmZvckVhY2gocGFyZW50ID0+IHtcbiAgICAgIGxldCBjb21wb25lbnRzID0gRE9NLmFsbChwYXJlbnQsIGBbJHtQSFhfQ09NUE9ORU5UfV1gKVxuICAgICAgbGV0IGhvb2tzID0gRE9NLmFsbChwYXJlbnQsIGBbJHt0aGlzLmJpbmRpbmcoUEhYX0hPT0spfV1gKVxuICAgICAgY29tcG9uZW50cy5jb25jYXQocGFyZW50KS5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgbGV0IGNpZCA9IHRoaXMuY29tcG9uZW50SUQoZWwpXG4gICAgICAgIGlmKGlzQ2lkKGNpZCkgJiYgZGVzdHJveWVkQ0lEcy5pbmRleE9mKGNpZCkgPT09IC0xKXsgZGVzdHJveWVkQ0lEcy5wdXNoKGNpZCkgfVxuICAgICAgfSlcbiAgICAgIGhvb2tzLmNvbmNhdChwYXJlbnQpLmZvckVhY2goaG9va0VsID0+IHtcbiAgICAgICAgbGV0IGhvb2sgPSB0aGlzLmdldEhvb2soaG9va0VsKVxuICAgICAgICBob29rICYmIHRoaXMuZGVzdHJveUhvb2soaG9vaylcbiAgICAgIH0pXG4gICAgfSlcbiAgICAvLyBXZSBzaG91bGQgbm90IHBydW5lQ2lkcyBvbiBqb2lucy4gT3RoZXJ3aXNlLCBpbiBjYXNlIG9mXG4gICAgLy8gcmVqb2lucywgd2UgbWF5IG5vdGlmeSBjaWRzIHRoYXQgbm8gbG9uZ2VyIGJlbG9uZyB0byB0aGVcbiAgICAvLyBjdXJyZW50IExpdmVWaWV3IHRvIGJlIHJlbW92ZWQuXG4gICAgaWYocHJ1bmVDaWRzKXtcbiAgICAgIHRoaXMubWF5YmVQdXNoQ29tcG9uZW50c0Rlc3Ryb3llZChkZXN0cm95ZWRDSURzKVxuICAgIH1cbiAgfVxuXG4gIGpvaW5OZXdDaGlsZHJlbigpe1xuICAgIERPTS5maW5kUGh4Q2hpbGRyZW4odGhpcy5lbCwgdGhpcy5pZCkuZm9yRWFjaChlbCA9PiB0aGlzLmpvaW5DaGlsZChlbCkpXG4gIH1cblxuICBnZXRDaGlsZEJ5SWQoaWQpeyByZXR1cm4gdGhpcy5yb290LmNoaWxkcmVuW3RoaXMuaWRdW2lkXSB9XG5cbiAgZ2V0RGVzY2VuZGVudEJ5RWwoZWwpe1xuICAgIGlmKGVsLmlkID09PSB0aGlzLmlkKXtcbiAgICAgIHJldHVybiB0aGlzXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuW2VsLmdldEF0dHJpYnV0ZShQSFhfUEFSRU5UX0lEKV1bZWwuaWRdXG4gICAgfVxuICB9XG5cbiAgZGVzdHJveURlc2NlbmRlbnQoaWQpe1xuICAgIGZvcihsZXQgcGFyZW50SWQgaW4gdGhpcy5yb290LmNoaWxkcmVuKXtcbiAgICAgIGZvcihsZXQgY2hpbGRJZCBpbiB0aGlzLnJvb3QuY2hpbGRyZW5bcGFyZW50SWRdKXtcbiAgICAgICAgaWYoY2hpbGRJZCA9PT0gaWQpeyByZXR1cm4gdGhpcy5yb290LmNoaWxkcmVuW3BhcmVudElkXVtjaGlsZElkXS5kZXN0cm95KCkgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGpvaW5DaGlsZChlbCl7XG4gICAgbGV0IGNoaWxkID0gdGhpcy5nZXRDaGlsZEJ5SWQoZWwuaWQpXG4gICAgaWYoIWNoaWxkKXtcbiAgICAgIGxldCB2aWV3ID0gbmV3IFZpZXcoZWwsIHRoaXMubGl2ZVNvY2tldCwgdGhpcylcbiAgICAgIHRoaXMucm9vdC5jaGlsZHJlblt0aGlzLmlkXVt2aWV3LmlkXSA9IHZpZXdcbiAgICAgIHZpZXcuam9pbigpXG4gICAgICB0aGlzLmNoaWxkSm9pbnMrK1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICBpc0pvaW5QZW5kaW5nKCl7IHJldHVybiB0aGlzLmpvaW5QZW5kaW5nIH1cblxuICBhY2tKb2luKF9jaGlsZCl7XG4gICAgdGhpcy5jaGlsZEpvaW5zLS1cblxuICAgIGlmKHRoaXMuY2hpbGRKb2lucyA9PT0gMCl7XG4gICAgICBpZih0aGlzLnBhcmVudCl7XG4gICAgICAgIHRoaXMucGFyZW50LmFja0pvaW4odGhpcylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub25BbGxDaGlsZEpvaW5zQ29tcGxldGUoKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uQWxsQ2hpbGRKb2luc0NvbXBsZXRlKCl7XG4gICAgdGhpcy5qb2luQ2FsbGJhY2soKCkgPT4ge1xuICAgICAgdGhpcy5wZW5kaW5nSm9pbk9wcy5mb3JFYWNoKChbdmlldywgb3BdKSA9PiB7XG4gICAgICAgIGlmKCF2aWV3LmlzRGVzdHJveWVkKCkpeyBvcCgpIH1cbiAgICAgIH0pXG4gICAgICB0aGlzLnBlbmRpbmdKb2luT3BzID0gW11cbiAgICB9KVxuICB9XG5cbiAgdXBkYXRlKGRpZmYsIGV2ZW50cyl7XG4gICAgaWYodGhpcy5pc0pvaW5QZW5kaW5nKCkgfHwgKHRoaXMubGl2ZVNvY2tldC5oYXNQZW5kaW5nTGluaygpICYmICFET00uaXNQaHhTdGlja3kodGhpcy5lbCkpKXtcbiAgICAgIHJldHVybiB0aGlzLnBlbmRpbmdEaWZmcy5wdXNoKHtkaWZmLCBldmVudHN9KVxuICAgIH1cblxuICAgIHRoaXMucmVuZGVyZWQubWVyZ2VEaWZmKGRpZmYpXG4gICAgbGV0IHBoeENoaWxkcmVuQWRkZWQgPSBmYWxzZVxuXG4gICAgLy8gV2hlbiB0aGUgZGlmZiBvbmx5IGNvbnRhaW5zIGNvbXBvbmVudCBkaWZmcywgdGhlbiB3YWxrIGNvbXBvbmVudHNcbiAgICAvLyBhbmQgcGF0Y2ggb25seSB0aGUgcGFyZW50IGNvbXBvbmVudCBjb250YWluZXJzIGZvdW5kIGluIHRoZSBkaWZmLlxuICAgIC8vIE90aGVyd2lzZSwgcGF0Y2ggZW50aXJlIExWIGNvbnRhaW5lci5cbiAgICBpZih0aGlzLnJlbmRlcmVkLmlzQ29tcG9uZW50T25seURpZmYoZGlmZikpe1xuICAgICAgdGhpcy5saXZlU29ja2V0LnRpbWUoXCJjb21wb25lbnQgcGF0Y2ggY29tcGxldGVcIiwgKCkgPT4ge1xuICAgICAgICBsZXQgcGFyZW50Q2lkcyA9IERPTS5maW5kUGFyZW50Q0lEcyh0aGlzLmVsLCB0aGlzLnJlbmRlcmVkLmNvbXBvbmVudENJRHMoZGlmZikpXG4gICAgICAgIHBhcmVudENpZHMuZm9yRWFjaChwYXJlbnRDSUQgPT4ge1xuICAgICAgICAgIGlmKHRoaXMuY29tcG9uZW50UGF0Y2godGhpcy5yZW5kZXJlZC5nZXRDb21wb25lbnQoZGlmZiwgcGFyZW50Q0lEKSwgcGFyZW50Q0lEKSl7IHBoeENoaWxkcmVuQWRkZWQgPSB0cnVlIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmKCFpc0VtcHR5KGRpZmYpKXtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC50aW1lKFwiZnVsbCBwYXRjaCBjb21wbGV0ZVwiLCAoKSA9PiB7XG4gICAgICAgIGxldCBodG1sID0gdGhpcy5yZW5kZXJDb250YWluZXIoZGlmZiwgXCJ1cGRhdGVcIilcbiAgICAgICAgbGV0IHBhdGNoID0gbmV3IERPTVBhdGNoKHRoaXMsIHRoaXMuZWwsIHRoaXMuaWQsIGh0bWwsIG51bGwpXG4gICAgICAgIHBoeENoaWxkcmVuQWRkZWQgPSB0aGlzLnBlcmZvcm1QYXRjaChwYXRjaCwgdHJ1ZSlcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgdGhpcy5saXZlU29ja2V0LmRpc3BhdGNoRXZlbnRzKGV2ZW50cylcbiAgICBpZihwaHhDaGlsZHJlbkFkZGVkKXsgdGhpcy5qb2luTmV3Q2hpbGRyZW4oKSB9XG4gIH1cblxuICByZW5kZXJDb250YWluZXIoZGlmZiwga2luZCl7XG4gICAgcmV0dXJuIHRoaXMubGl2ZVNvY2tldC50aW1lKGB0b1N0cmluZyBkaWZmICgke2tpbmR9KWAsICgpID0+IHtcbiAgICAgIGxldCB0YWcgPSB0aGlzLmVsLnRhZ05hbWVcbiAgICAgIC8vIERvbid0IHNraXAgYW55IGNvbXBvbmVudCBpbiB0aGUgZGlmZiBub3IgYW55IG1hcmtlZCBhcyBwcnVuZWRcbiAgICAgIC8vIChhcyB0aGV5IG1heSBoYXZlIGJlZW4gYWRkZWQgYmFjaylcbiAgICAgIGxldCBjaWRzID0gZGlmZiA/IHRoaXMucmVuZGVyZWQuY29tcG9uZW50Q0lEcyhkaWZmKS5jb25jYXQodGhpcy5wcnVuaW5nQ0lEcykgOiBudWxsXG4gICAgICBsZXQgaHRtbCA9IHRoaXMucmVuZGVyZWQudG9TdHJpbmcoY2lkcylcbiAgICAgIHJldHVybiBgPCR7dGFnfT4ke2h0bWx9PC8ke3RhZ30+YFxuICAgIH0pXG4gIH1cblxuICBjb21wb25lbnRQYXRjaChkaWZmLCBjaWQpe1xuICAgIGlmKGlzRW1wdHkoZGlmZikpIHJldHVybiBmYWxzZVxuICAgIGxldCBodG1sID0gdGhpcy5yZW5kZXJlZC5jb21wb25lbnRUb1N0cmluZyhjaWQpXG4gICAgbGV0IHBhdGNoID0gbmV3IERPTVBhdGNoKHRoaXMsIHRoaXMuZWwsIHRoaXMuaWQsIGh0bWwsIGNpZClcbiAgICBsZXQgY2hpbGRyZW5BZGRlZCA9IHRoaXMucGVyZm9ybVBhdGNoKHBhdGNoLCB0cnVlKVxuICAgIHJldHVybiBjaGlsZHJlbkFkZGVkXG4gIH1cblxuICBnZXRIb29rKGVsKXsgcmV0dXJuIHRoaXMudmlld0hvb2tzW1ZpZXdIb29rLmVsZW1lbnRJRChlbCldIH1cblxuICBhZGRIb29rKGVsKXtcbiAgICBpZihWaWV3SG9vay5lbGVtZW50SUQoZWwpIHx8ICFlbC5nZXRBdHRyaWJ1dGUpeyByZXR1cm4gfVxuICAgIGxldCBob29rTmFtZSA9IGVsLmdldEF0dHJpYnV0ZShgZGF0YS1waHgtJHtQSFhfSE9PS31gKSB8fCBlbC5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFBIWF9IT09LKSlcbiAgICBpZihob29rTmFtZSAmJiAhdGhpcy5vd25zRWxlbWVudChlbCkpeyByZXR1cm4gfVxuICAgIGxldCBjYWxsYmFja3MgPSB0aGlzLmxpdmVTb2NrZXQuZ2V0SG9va0NhbGxiYWNrcyhob29rTmFtZSlcblxuICAgIGlmKGNhbGxiYWNrcyl7XG4gICAgICBpZighZWwuaWQpeyBsb2dFcnJvcihgbm8gRE9NIElEIGZvciBob29rIFwiJHtob29rTmFtZX1cIi4gSG9va3MgcmVxdWlyZSBhIHVuaXF1ZSBJRCBvbiBlYWNoIGVsZW1lbnQuYCwgZWwpIH1cbiAgICAgIGxldCBob29rID0gbmV3IFZpZXdIb29rKHRoaXMsIGVsLCBjYWxsYmFja3MpXG4gICAgICB0aGlzLnZpZXdIb29rc1tWaWV3SG9vay5lbGVtZW50SUQoaG9vay5lbCldID0gaG9va1xuICAgICAgcmV0dXJuIGhvb2tcbiAgICB9IGVsc2UgaWYoaG9va05hbWUgIT09IG51bGwpe1xuICAgICAgbG9nRXJyb3IoYHVua25vd24gaG9vayBmb3VuZCBmb3IgXCIke2hvb2tOYW1lfVwiYCwgZWwpXG4gICAgfVxuICB9XG5cbiAgZGVzdHJveUhvb2soaG9vayl7XG4gICAgaG9vay5fX2Rlc3Ryb3llZCgpXG4gICAgaG9vay5fX2NsZWFudXBfXygpXG4gICAgZGVsZXRlIHRoaXMudmlld0hvb2tzW1ZpZXdIb29rLmVsZW1lbnRJRChob29rLmVsKV1cbiAgfVxuXG4gIGFwcGx5UGVuZGluZ1VwZGF0ZXMoKXtcbiAgICB0aGlzLnBlbmRpbmdEaWZmcy5mb3JFYWNoKCh7ZGlmZiwgZXZlbnRzfSkgPT4gdGhpcy51cGRhdGUoZGlmZiwgZXZlbnRzKSlcbiAgICB0aGlzLnBlbmRpbmdEaWZmcyA9IFtdXG4gIH1cblxuICBvbkNoYW5uZWwoZXZlbnQsIGNiKXtcbiAgICB0aGlzLmxpdmVTb2NrZXQub25DaGFubmVsKHRoaXMuY2hhbm5lbCwgZXZlbnQsIHJlc3AgPT4ge1xuICAgICAgaWYodGhpcy5pc0pvaW5QZW5kaW5nKCkpe1xuICAgICAgICB0aGlzLnJvb3QucGVuZGluZ0pvaW5PcHMucHVzaChbdGhpcywgKCkgPT4gY2IocmVzcCldKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5saXZlU29ja2V0LnJlcXVlc3RET01VcGRhdGUoKCkgPT4gY2IocmVzcCkpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGJpbmRDaGFubmVsKCl7XG4gICAgLy8gVGhlIGRpZmYgZXZlbnQgc2hvdWxkIGJlIGhhbmRsZWQgYnkgdGhlIHJlZ3VsYXIgdXBkYXRlIG9wZXJhdGlvbnMuXG4gICAgLy8gQWxsIG90aGVyIG9wZXJhdGlvbnMgYXJlIHF1ZXVlZCB0byBiZSBhcHBsaWVkIG9ubHkgYWZ0ZXIgam9pbi5cbiAgICB0aGlzLmxpdmVTb2NrZXQub25DaGFubmVsKHRoaXMuY2hhbm5lbCwgXCJkaWZmXCIsIChyYXdEaWZmKSA9PiB7XG4gICAgICB0aGlzLmxpdmVTb2NrZXQucmVxdWVzdERPTVVwZGF0ZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuYXBwbHlEaWZmKFwidXBkYXRlXCIsIHJhd0RpZmYsICh7ZGlmZiwgZXZlbnRzfSkgPT4gdGhpcy51cGRhdGUoZGlmZiwgZXZlbnRzKSlcbiAgICAgIH0pXG4gICAgfSlcbiAgICB0aGlzLm9uQ2hhbm5lbChcInJlZGlyZWN0XCIsICh7dG8sIGZsYXNofSkgPT4gdGhpcy5vblJlZGlyZWN0KHt0bywgZmxhc2h9KSlcbiAgICB0aGlzLm9uQ2hhbm5lbChcImxpdmVfcGF0Y2hcIiwgKHJlZGlyKSA9PiB0aGlzLm9uTGl2ZVBhdGNoKHJlZGlyKSlcbiAgICB0aGlzLm9uQ2hhbm5lbChcImxpdmVfcmVkaXJlY3RcIiwgKHJlZGlyKSA9PiB0aGlzLm9uTGl2ZVJlZGlyZWN0KHJlZGlyKSlcbiAgICB0aGlzLmNoYW5uZWwub25FcnJvcihyZWFzb24gPT4gdGhpcy5vbkVycm9yKHJlYXNvbikpXG4gICAgdGhpcy5jaGFubmVsLm9uQ2xvc2UocmVhc29uID0+IHRoaXMub25DbG9zZShyZWFzb24pKVxuICB9XG5cbiAgZGVzdHJveUFsbENoaWxkcmVuKCl7XG4gICAgZm9yKGxldCBpZCBpbiB0aGlzLnJvb3QuY2hpbGRyZW5bdGhpcy5pZF0pe1xuICAgICAgdGhpcy5nZXRDaGlsZEJ5SWQoaWQpLmRlc3Ryb3koKVxuICAgIH1cbiAgfVxuXG4gIG9uTGl2ZVJlZGlyZWN0KHJlZGlyKXtcbiAgICBsZXQge3RvLCBraW5kLCBmbGFzaH0gPSByZWRpclxuICAgIGxldCB1cmwgPSB0aGlzLmV4cGFuZFVSTCh0bylcbiAgICB0aGlzLmxpdmVTb2NrZXQuaGlzdG9yeVJlZGlyZWN0KHVybCwga2luZCwgZmxhc2gpXG4gIH1cblxuICBvbkxpdmVQYXRjaChyZWRpcil7XG4gICAgbGV0IHt0bywga2luZH0gPSByZWRpclxuICAgIHRoaXMuaHJlZiA9IHRoaXMuZXhwYW5kVVJMKHRvKVxuICAgIHRoaXMubGl2ZVNvY2tldC5oaXN0b3J5UGF0Y2godG8sIGtpbmQpXG4gIH1cblxuICBleHBhbmRVUkwodG8pe1xuICAgIHJldHVybiB0by5zdGFydHNXaXRoKFwiL1wiKSA/IGAke3dpbmRvdy5sb2NhdGlvbi5wcm90b2NvbH0vLyR7d2luZG93LmxvY2F0aW9uLmhvc3R9JHt0b31gIDogdG9cbiAgfVxuXG4gIG9uUmVkaXJlY3Qoe3RvLCBmbGFzaH0peyB0aGlzLmxpdmVTb2NrZXQucmVkaXJlY3QodG8sIGZsYXNoKSB9XG5cbiAgaXNEZXN0cm95ZWQoKXsgcmV0dXJuIHRoaXMuZGVzdHJveWVkIH1cblxuICBqb2luKGNhbGxiYWNrKXtcbiAgICBpZih0aGlzLmlzTWFpbigpKXtcbiAgICAgIHRoaXMuc3RvcENhbGxiYWNrID0gdGhpcy5saXZlU29ja2V0LndpdGhQYWdlTG9hZGluZyh7dG86IHRoaXMuaHJlZiwga2luZDogXCJpbml0aWFsXCJ9KVxuICAgIH1cbiAgICB0aGlzLmpvaW5DYWxsYmFjayA9IChvbkRvbmUpID0+IHtcbiAgICAgIG9uRG9uZSA9IG9uRG9uZSB8fCBmdW5jdGlvbigpe31cbiAgICAgIGNhbGxiYWNrID8gY2FsbGJhY2sodGhpcy5qb2luQ291bnQsIG9uRG9uZSkgOiBvbkRvbmUoKVxuICAgIH1cbiAgICB0aGlzLmxpdmVTb2NrZXQud3JhcFB1c2godGhpcywge3RpbWVvdXQ6IGZhbHNlfSwgKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuY2hhbm5lbC5qb2luKClcbiAgICAgICAgLnJlY2VpdmUoXCJva1wiLCBkYXRhID0+IHtcbiAgICAgICAgICBpZighdGhpcy5pc0Rlc3Ryb3llZCgpKXtcbiAgICAgICAgICAgIHRoaXMubGl2ZVNvY2tldC5yZXF1ZXN0RE9NVXBkYXRlKCgpID0+IHRoaXMub25Kb2luKGRhdGEpKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLnJlY2VpdmUoXCJlcnJvclwiLCByZXNwID0+ICF0aGlzLmlzRGVzdHJveWVkKCkgJiYgdGhpcy5vbkpvaW5FcnJvcihyZXNwKSlcbiAgICAgICAgLnJlY2VpdmUoXCJ0aW1lb3V0XCIsICgpID0+ICF0aGlzLmlzRGVzdHJveWVkKCkgJiYgdGhpcy5vbkpvaW5FcnJvcih7cmVhc29uOiBcInRpbWVvdXRcIn0pKVxuICAgIH0pXG4gIH1cblxuICBvbkpvaW5FcnJvcihyZXNwKXtcbiAgICBpZihyZXNwLnJlYXNvbiA9PT0gXCJ1bmF1dGhvcml6ZWRcIiB8fCByZXNwLnJlYXNvbiA9PT0gXCJzdGFsZVwiKXtcbiAgICAgIHRoaXMubG9nKFwiZXJyb3JcIiwgKCkgPT4gW1widW5hdXRob3JpemVkIGxpdmVfcmVkaXJlY3QuIEZhbGxpbmcgYmFjayB0byBwYWdlIHJlcXVlc3RcIiwgcmVzcF0pXG4gICAgICByZXR1cm4gdGhpcy5vblJlZGlyZWN0KHt0bzogdGhpcy5ocmVmfSlcbiAgICB9XG4gICAgaWYocmVzcC5yZWRpcmVjdCB8fCByZXNwLmxpdmVfcmVkaXJlY3Qpe1xuICAgICAgdGhpcy5qb2luUGVuZGluZyA9IGZhbHNlXG4gICAgICB0aGlzLmNoYW5uZWwubGVhdmUoKVxuICAgIH1cbiAgICBpZihyZXNwLnJlZGlyZWN0KXsgcmV0dXJuIHRoaXMub25SZWRpcmVjdChyZXNwLnJlZGlyZWN0KSB9XG4gICAgaWYocmVzcC5saXZlX3JlZGlyZWN0KXsgcmV0dXJuIHRoaXMub25MaXZlUmVkaXJlY3QocmVzcC5saXZlX3JlZGlyZWN0KSB9XG4gICAgdGhpcy5sb2coXCJlcnJvclwiLCAoKSA9PiBbXCJ1bmFibGUgdG8gam9pblwiLCByZXNwXSlcbiAgICByZXR1cm4gdGhpcy5saXZlU29ja2V0LnJlbG9hZFdpdGhKaXR0ZXIodGhpcylcbiAgfVxuXG4gIG9uQ2xvc2UocmVhc29uKXtcbiAgICBpZih0aGlzLmlzRGVzdHJveWVkKCkpeyByZXR1cm4gfVxuICAgIGlmKCh0aGlzLmlzSm9pblBlbmRpbmcoKSAmJiBkb2N1bWVudC52aXNpYmlsaXR5U3RhdGUgIT09IFwiaGlkZGVuXCIpIHx8XG4gICAgICAodGhpcy5saXZlU29ja2V0Lmhhc1BlbmRpbmdMaW5rKCkgJiYgcmVhc29uICE9PSBcImxlYXZlXCIpKXtcblxuICAgICAgcmV0dXJuIHRoaXMubGl2ZVNvY2tldC5yZWxvYWRXaXRoSml0dGVyKHRoaXMpXG4gICAgfVxuICAgIHRoaXMuZGVzdHJveUFsbENoaWxkcmVuKClcbiAgICB0aGlzLmxpdmVTb2NrZXQuZHJvcEFjdGl2ZUVsZW1lbnQodGhpcylcbiAgICAvLyBkb2N1bWVudC5hY3RpdmVFbGVtZW50IGNhbiBiZSBudWxsIGluIEludGVybmV0IEV4cGxvcmVyIDExXG4gICAgaWYoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCl7IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuYmx1cigpIH1cbiAgICBpZih0aGlzLmxpdmVTb2NrZXQuaXNVbmxvYWRlZCgpKXtcbiAgICAgIHRoaXMuc2hvd0xvYWRlcihCRUZPUkVfVU5MT0FEX0xPQURFUl9USU1FT1VUKVxuICAgIH1cbiAgfVxuXG4gIG9uRXJyb3IocmVhc29uKXtcbiAgICB0aGlzLm9uQ2xvc2UocmVhc29uKVxuICAgIHRoaXMubG9nKFwiZXJyb3JcIiwgKCkgPT4gW1widmlldyBjcmFzaGVkXCIsIHJlYXNvbl0pXG4gICAgaWYoIXRoaXMubGl2ZVNvY2tldC5pc1VubG9hZGVkKCkpeyB0aGlzLmRpc3BsYXlFcnJvcigpIH1cbiAgfVxuXG4gIGRpc3BsYXlFcnJvcigpe1xuICAgIGlmKHRoaXMuaXNNYWluKCkpeyBET00uZGlzcGF0Y2hFdmVudCh3aW5kb3csIFwicGh4OnBhZ2UtbG9hZGluZy1zdGFydFwiLCB7ZGV0YWlsOiB7dG86IHRoaXMuaHJlZiwga2luZDogXCJlcnJvclwifX0pIH1cbiAgICB0aGlzLnNob3dMb2FkZXIoKVxuICAgIHRoaXMuc2V0Q29udGFpbmVyQ2xhc3NlcyhQSFhfRElTQ09OTkVDVEVEX0NMQVNTLCBQSFhfRVJST1JfQ0xBU1MpXG4gIH1cblxuICBwdXNoV2l0aFJlcGx5KHJlZkdlbmVyYXRvciwgZXZlbnQsIHBheWxvYWQsIG9uUmVwbHkgPSBmdW5jdGlvbiAoKXsgfSl7XG4gICAgaWYoIXRoaXMuaXNDb25uZWN0ZWQoKSl7IHJldHVybiB9XG5cbiAgICBsZXQgW3JlZiwgW2VsXSwgb3B0c10gPSByZWZHZW5lcmF0b3IgPyByZWZHZW5lcmF0b3IoKSA6IFtudWxsLCBbXSwge31dXG4gICAgbGV0IG9uTG9hZGluZ0RvbmUgPSBmdW5jdGlvbigpeyB9XG4gICAgaWYob3B0cy5wYWdlX2xvYWRpbmcgfHwgKGVsICYmIChlbC5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFBIWF9QQUdFX0xPQURJTkcpKSAhPT0gbnVsbCkpKXtcbiAgICAgIG9uTG9hZGluZ0RvbmUgPSB0aGlzLmxpdmVTb2NrZXQud2l0aFBhZ2VMb2FkaW5nKHtraW5kOiBcImVsZW1lbnRcIiwgdGFyZ2V0OiBlbH0pXG4gICAgfVxuXG4gICAgaWYodHlwZW9mIChwYXlsb2FkLmNpZCkgIT09IFwibnVtYmVyXCIpeyBkZWxldGUgcGF5bG9hZC5jaWQgfVxuICAgIHJldHVybiAoXG4gICAgICB0aGlzLmxpdmVTb2NrZXQud3JhcFB1c2godGhpcywge3RpbWVvdXQ6IHRydWV9LCAoKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYW5uZWwucHVzaChldmVudCwgcGF5bG9hZCwgUFVTSF9USU1FT1VUKS5yZWNlaXZlKFwib2tcIiwgcmVzcCA9PiB7XG4gICAgICAgICAgaWYocmVmICE9PSBudWxsKXsgdGhpcy51bmRvUmVmcyhyZWYpIH1cbiAgICAgICAgICBsZXQgZmluaXNoID0gKGhvb2tSZXBseSkgPT4ge1xuICAgICAgICAgICAgaWYocmVzcC5yZWRpcmVjdCl7IHRoaXMub25SZWRpcmVjdChyZXNwLnJlZGlyZWN0KSB9XG4gICAgICAgICAgICBpZihyZXNwLmxpdmVfcGF0Y2gpeyB0aGlzLm9uTGl2ZVBhdGNoKHJlc3AubGl2ZV9wYXRjaCkgfVxuICAgICAgICAgICAgaWYocmVzcC5saXZlX3JlZGlyZWN0KXsgdGhpcy5vbkxpdmVSZWRpcmVjdChyZXNwLmxpdmVfcmVkaXJlY3QpIH1cbiAgICAgICAgICAgIG9uTG9hZGluZ0RvbmUoKVxuICAgICAgICAgICAgb25SZXBseShyZXNwLCBob29rUmVwbHkpXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKHJlc3AuZGlmZil7XG4gICAgICAgICAgICB0aGlzLmxpdmVTb2NrZXQucmVxdWVzdERPTVVwZGF0ZSgoKSA9PiB7XG4gICAgICAgICAgICAgIGxldCBob29rUmVwbHkgPSB0aGlzLmFwcGx5RGlmZihcInVwZGF0ZVwiLCByZXNwLmRpZmYsICh7ZGlmZiwgZXZlbnRzfSkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlKGRpZmYsIGV2ZW50cylcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgZmluaXNoKGhvb2tSZXBseSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZpbmlzaChudWxsKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgKVxuICB9XG5cbiAgdW5kb1JlZnMocmVmKXtcbiAgICBET00uYWxsKGRvY3VtZW50LCBgWyR7UEhYX1JFRl9TUkN9PVwiJHt0aGlzLmlkfVwiXVske1BIWF9SRUZ9PVwiJHtyZWZ9XCJdYCwgZWwgPT4ge1xuICAgICAgbGV0IGRpc2FibGVkVmFsID0gZWwuZ2V0QXR0cmlidXRlKFBIWF9ESVNBQkxFRClcbiAgICAgIC8vIHJlbW92ZSByZWZzXG4gICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoUEhYX1JFRilcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfUkVGX1NSQylcbiAgICAgIC8vIHJlc3RvcmUgaW5wdXRzXG4gICAgICBpZihlbC5nZXRBdHRyaWJ1dGUoUEhYX1JFQURPTkxZKSAhPT0gbnVsbCl7XG4gICAgICAgIGVsLnJlYWRPbmx5ID0gZmFsc2VcbiAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKFBIWF9SRUFET05MWSlcbiAgICAgIH1cbiAgICAgIGlmKGRpc2FibGVkVmFsICE9PSBudWxsKXtcbiAgICAgICAgZWwuZGlzYWJsZWQgPSBkaXNhYmxlZFZhbCA9PT0gXCJ0cnVlXCIgPyB0cnVlIDogZmFsc2VcbiAgICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKFBIWF9ESVNBQkxFRClcbiAgICAgIH1cbiAgICAgIC8vIHJlbW92ZSBjbGFzc2VzXG4gICAgICBQSFhfRVZFTlRfQ0xBU1NFUy5mb3JFYWNoKGNsYXNzTmFtZSA9PiBET00ucmVtb3ZlQ2xhc3MoZWwsIGNsYXNzTmFtZSkpXG4gICAgICAvLyByZXN0b3JlIGRpc2FibGVzXG4gICAgICBsZXQgZGlzYWJsZVJlc3RvcmUgPSBlbC5nZXRBdHRyaWJ1dGUoUEhYX0RJU0FCTEVfV0lUSF9SRVNUT1JFKVxuICAgICAgaWYoZGlzYWJsZVJlc3RvcmUgIT09IG51bGwpe1xuICAgICAgICBlbC5pbm5lclRleHQgPSBkaXNhYmxlUmVzdG9yZVxuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoUEhYX0RJU0FCTEVfV0lUSF9SRVNUT1JFKVxuICAgICAgfVxuICAgICAgbGV0IHRvRWwgPSBET00ucHJpdmF0ZShlbCwgUEhYX1JFRilcbiAgICAgIGlmKHRvRWwpe1xuICAgICAgICBsZXQgaG9vayA9IHRoaXMudHJpZ2dlckJlZm9yZVVwZGF0ZUhvb2soZWwsIHRvRWwpXG4gICAgICAgIERPTVBhdGNoLnBhdGNoRWwoZWwsIHRvRWwsIHRoaXMubGl2ZVNvY2tldC5nZXRBY3RpdmVFbGVtZW50KCkpXG4gICAgICAgIGlmKGhvb2speyBob29rLl9fdXBkYXRlZCgpIH1cbiAgICAgICAgRE9NLmRlbGV0ZVByaXZhdGUoZWwsIFBIWF9SRUYpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHB1dFJlZihlbGVtZW50cywgZXZlbnQsIG9wdHMgPSB7fSl7XG4gICAgbGV0IG5ld1JlZiA9IHRoaXMucmVmKytcbiAgICBsZXQgZGlzYWJsZVdpdGggPSB0aGlzLmJpbmRpbmcoUEhYX0RJU0FCTEVfV0lUSClcbiAgICBpZihvcHRzLmxvYWRpbmcpeyBlbGVtZW50cyA9IGVsZW1lbnRzLmNvbmNhdChET00uYWxsKGRvY3VtZW50LCBvcHRzLmxvYWRpbmcpKX1cblxuICAgIGVsZW1lbnRzLmZvckVhY2goZWwgPT4ge1xuICAgICAgZWwuY2xhc3NMaXN0LmFkZChgcGh4LSR7ZXZlbnR9LWxvYWRpbmdgKVxuICAgICAgZWwuc2V0QXR0cmlidXRlKFBIWF9SRUYsIG5ld1JlZilcbiAgICAgIGVsLnNldEF0dHJpYnV0ZShQSFhfUkVGX1NSQywgdGhpcy5lbC5pZClcbiAgICAgIGxldCBkaXNhYmxlVGV4dCA9IGVsLmdldEF0dHJpYnV0ZShkaXNhYmxlV2l0aClcbiAgICAgIGlmKGRpc2FibGVUZXh0ICE9PSBudWxsKXtcbiAgICAgICAgaWYoIWVsLmdldEF0dHJpYnV0ZShQSFhfRElTQUJMRV9XSVRIX1JFU1RPUkUpKXtcbiAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoUEhYX0RJU0FCTEVfV0lUSF9SRVNUT1JFLCBlbC5pbm5lclRleHQpXG4gICAgICAgIH1cbiAgICAgICAgaWYoZGlzYWJsZVRleHQgIT09IFwiXCIpeyBlbC5pbm5lclRleHQgPSBkaXNhYmxlVGV4dCB9XG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZShcImRpc2FibGVkXCIsIFwiXCIpXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gW25ld1JlZiwgZWxlbWVudHMsIG9wdHNdXG4gIH1cblxuICBjb21wb25lbnRJRChlbCl7XG4gICAgbGV0IGNpZCA9IGVsLmdldEF0dHJpYnV0ZSAmJiBlbC5nZXRBdHRyaWJ1dGUoUEhYX0NPTVBPTkVOVClcbiAgICByZXR1cm4gY2lkID8gcGFyc2VJbnQoY2lkKSA6IG51bGxcbiAgfVxuXG4gIHRhcmdldENvbXBvbmVudElEKHRhcmdldCwgdGFyZ2V0Q3R4LCBvcHRzID0ge30pe1xuICAgIGlmKGlzQ2lkKHRhcmdldEN0eCkpeyByZXR1cm4gdGFyZ2V0Q3R4IH1cblxuICAgIGxldCBjaWRPclNlbGVjdG9yID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoXCJ0YXJnZXRcIikpXG4gICAgaWYoaXNDaWQoY2lkT3JTZWxlY3Rvcikpe1xuICAgICAgcmV0dXJuIHBhcnNlSW50KGNpZE9yU2VsZWN0b3IpXG4gICAgfSBlbHNlIGlmKHRhcmdldEN0eCAmJiAoY2lkT3JTZWxlY3RvciAhPT0gbnVsbCB8fCBvcHRzLnRhcmdldCkpe1xuICAgICAgcmV0dXJuIHRoaXMuY2xvc2VzdENvbXBvbmVudElEKHRhcmdldEN0eClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cblxuICBjbG9zZXN0Q29tcG9uZW50SUQodGFyZ2V0Q3R4KXtcbiAgICBpZihpc0NpZCh0YXJnZXRDdHgpKXtcbiAgICAgIHJldHVybiB0YXJnZXRDdHhcbiAgICB9IGVsc2UgaWYodGFyZ2V0Q3R4KXtcbiAgICAgIHJldHVybiBtYXliZSh0YXJnZXRDdHguY2xvc2VzdChgWyR7UEhYX0NPTVBPTkVOVH1dYCksIGVsID0+IHRoaXMub3duc0VsZW1lbnQoZWwpICYmIHRoaXMuY29tcG9uZW50SUQoZWwpKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuXG4gIHB1c2hIb29rRXZlbnQodGFyZ2V0Q3R4LCBldmVudCwgcGF5bG9hZCwgb25SZXBseSl7XG4gICAgaWYoIXRoaXMuaXNDb25uZWN0ZWQoKSl7XG4gICAgICB0aGlzLmxvZyhcImhvb2tcIiwgKCkgPT4gW1widW5hYmxlIHRvIHB1c2ggaG9vayBldmVudC4gTGl2ZVZpZXcgbm90IGNvbm5lY3RlZFwiLCBldmVudCwgcGF5bG9hZF0pXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgbGV0IFtyZWYsIGVscywgb3B0c10gPSB0aGlzLnB1dFJlZihbXSwgXCJob29rXCIpXG4gICAgdGhpcy5wdXNoV2l0aFJlcGx5KCgpID0+IFtyZWYsIGVscywgb3B0c10sIFwiZXZlbnRcIiwge1xuICAgICAgdHlwZTogXCJob29rXCIsXG4gICAgICBldmVudDogZXZlbnQsXG4gICAgICB2YWx1ZTogcGF5bG9hZCxcbiAgICAgIGNpZDogdGhpcy5jbG9zZXN0Q29tcG9uZW50SUQodGFyZ2V0Q3R4KVxuICAgIH0sIChyZXNwLCByZXBseSkgPT4gb25SZXBseShyZXBseSwgcmVmKSlcblxuICAgIHJldHVybiByZWZcbiAgfVxuXG4gIGV4dHJhY3RNZXRhKGVsLCBtZXRhLCB2YWx1ZSl7XG4gICAgbGV0IHByZWZpeCA9IHRoaXMuYmluZGluZyhcInZhbHVlLVwiKVxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBlbC5hdHRyaWJ1dGVzLmxlbmd0aDsgaSsrKXtcbiAgICAgIGlmKCFtZXRhKXsgbWV0YSA9IHt9IH1cbiAgICAgIGxldCBuYW1lID0gZWwuYXR0cmlidXRlc1tpXS5uYW1lXG4gICAgICBpZihuYW1lLnN0YXJ0c1dpdGgocHJlZml4KSl7IG1ldGFbbmFtZS5yZXBsYWNlKHByZWZpeCwgXCJcIildID0gZWwuZ2V0QXR0cmlidXRlKG5hbWUpIH1cbiAgICB9XG4gICAgaWYoZWwudmFsdWUgIT09IHVuZGVmaW5lZCl7XG4gICAgICBpZighbWV0YSl7IG1ldGEgPSB7fSB9XG4gICAgICBtZXRhLnZhbHVlID0gZWwudmFsdWVcblxuICAgICAgaWYoZWwudGFnTmFtZSA9PT0gXCJJTlBVVFwiICYmIENIRUNLQUJMRV9JTlBVVFMuaW5kZXhPZihlbC50eXBlKSA+PSAwICYmICFlbC5jaGVja2VkKXtcbiAgICAgICAgZGVsZXRlIG1ldGEudmFsdWVcbiAgICAgIH1cbiAgICB9XG4gICAgaWYodmFsdWUpe1xuICAgICAgaWYoIW1ldGEpeyBtZXRhID0ge30gfVxuICAgICAgZm9yKGxldCBrZXkgaW4gdmFsdWUpeyBtZXRhW2tleV0gPSB2YWx1ZVtrZXldIH1cbiAgICB9XG4gICAgcmV0dXJuIG1ldGFcbiAgfVxuXG4gIHB1c2hFdmVudCh0eXBlLCBlbCwgdGFyZ2V0Q3R4LCBwaHhFdmVudCwgbWV0YSwgb3B0cyA9IHt9KXtcbiAgICB0aGlzLnB1c2hXaXRoUmVwbHkoKCkgPT4gdGhpcy5wdXRSZWYoW2VsXSwgdHlwZSwgb3B0cyksIFwiZXZlbnRcIiwge1xuICAgICAgdHlwZTogdHlwZSxcbiAgICAgIGV2ZW50OiBwaHhFdmVudCxcbiAgICAgIHZhbHVlOiB0aGlzLmV4dHJhY3RNZXRhKGVsLCBtZXRhLCBvcHRzLnZhbHVlKSxcbiAgICAgIGNpZDogdGhpcy50YXJnZXRDb21wb25lbnRJRChlbCwgdGFyZ2V0Q3R4LCBvcHRzKVxuICAgIH0pXG4gIH1cblxuICBwdXNoRmlsZVByb2dyZXNzKGZpbGVFbCwgZW50cnlSZWYsIHByb2dyZXNzLCBvblJlcGx5ID0gZnVuY3Rpb24gKCl7IH0pe1xuICAgIHRoaXMubGl2ZVNvY2tldC53aXRoaW5Pd25lcnMoZmlsZUVsLmZvcm0sICh2aWV3LCB0YXJnZXRDdHgpID0+IHtcbiAgICAgIHZpZXcucHVzaFdpdGhSZXBseShudWxsLCBcInByb2dyZXNzXCIsIHtcbiAgICAgICAgZXZlbnQ6IGZpbGVFbC5nZXRBdHRyaWJ1dGUodmlldy5iaW5kaW5nKFBIWF9QUk9HUkVTUykpLFxuICAgICAgICByZWY6IGZpbGVFbC5nZXRBdHRyaWJ1dGUoUEhYX1VQTE9BRF9SRUYpLFxuICAgICAgICBlbnRyeV9yZWY6IGVudHJ5UmVmLFxuICAgICAgICBwcm9ncmVzczogcHJvZ3Jlc3MsXG4gICAgICAgIGNpZDogdmlldy50YXJnZXRDb21wb25lbnRJRChmaWxlRWwuZm9ybSwgdGFyZ2V0Q3R4KVxuICAgICAgfSwgb25SZXBseSlcbiAgICB9KVxuICB9XG5cbiAgcHVzaElucHV0KGlucHV0RWwsIHRhcmdldEN0eCwgZm9yY2VDaWQsIHBoeEV2ZW50LCBvcHRzLCBjYWxsYmFjayl7XG4gICAgbGV0IHVwbG9hZHNcbiAgICBsZXQgY2lkID0gaXNDaWQoZm9yY2VDaWQpID8gZm9yY2VDaWQgOiB0aGlzLnRhcmdldENvbXBvbmVudElEKGlucHV0RWwuZm9ybSwgdGFyZ2V0Q3R4KVxuICAgIGxldCByZWZHZW5lcmF0b3IgPSAoKSA9PiB0aGlzLnB1dFJlZihbaW5wdXRFbCwgaW5wdXRFbC5mb3JtXSwgXCJjaGFuZ2VcIiwgb3B0cylcbiAgICBsZXQgZm9ybURhdGFcbiAgICBpZihpbnB1dEVsLmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoXCJjaGFuZ2VcIikpKXtcbiAgICAgIGZvcm1EYXRhID0gc2VyaWFsaXplRm9ybShpbnB1dEVsLmZvcm0sIHtfdGFyZ2V0OiBvcHRzLl90YXJnZXR9LCBbaW5wdXRFbC5uYW1lXSlcbiAgICB9IGVsc2Uge1xuICAgICAgZm9ybURhdGEgPSBzZXJpYWxpemVGb3JtKGlucHV0RWwuZm9ybSwge190YXJnZXQ6IG9wdHMuX3RhcmdldH0pXG4gICAgfVxuICAgIGlmKERPTS5pc1VwbG9hZElucHV0KGlucHV0RWwpICYmIGlucHV0RWwuZmlsZXMgJiYgaW5wdXRFbC5maWxlcy5sZW5ndGggPiAwKXtcbiAgICAgIExpdmVVcGxvYWRlci50cmFja0ZpbGVzKGlucHV0RWwsIEFycmF5LmZyb20oaW5wdXRFbC5maWxlcykpXG4gICAgfVxuICAgIHVwbG9hZHMgPSBMaXZlVXBsb2FkZXIuc2VyaWFsaXplVXBsb2FkcyhpbnB1dEVsKVxuICAgIGxldCBldmVudCA9IHtcbiAgICAgIHR5cGU6IFwiZm9ybVwiLFxuICAgICAgZXZlbnQ6IHBoeEV2ZW50LFxuICAgICAgdmFsdWU6IGZvcm1EYXRhLFxuICAgICAgdXBsb2FkczogdXBsb2FkcyxcbiAgICAgIGNpZDogY2lkXG4gICAgfVxuICAgIHRoaXMucHVzaFdpdGhSZXBseShyZWZHZW5lcmF0b3IsIFwiZXZlbnRcIiwgZXZlbnQsIHJlc3AgPT4ge1xuICAgICAgRE9NLnNob3dFcnJvcihpbnB1dEVsLCB0aGlzLmxpdmVTb2NrZXQuYmluZGluZyhQSFhfRkVFREJBQ0tfRk9SKSlcbiAgICAgIGlmKERPTS5pc1VwbG9hZElucHV0KGlucHV0RWwpICYmIGlucHV0RWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1waHgtYXV0by11cGxvYWRcIikgIT09IG51bGwpe1xuICAgICAgICBpZihMaXZlVXBsb2FkZXIuZmlsZXNBd2FpdGluZ1ByZWZsaWdodChpbnB1dEVsKS5sZW5ndGggPiAwKXtcbiAgICAgICAgICBsZXQgW3JlZiwgX2Vsc10gPSByZWZHZW5lcmF0b3IoKVxuICAgICAgICAgIHRoaXMudXBsb2FkRmlsZXMoaW5wdXRFbC5mb3JtLCB0YXJnZXRDdHgsIHJlZiwgY2lkLCAoX3VwbG9hZHMpID0+IHtcbiAgICAgICAgICAgIGNhbGxiYWNrICYmIGNhbGxiYWNrKHJlc3ApXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXJBd2FpdGluZ1N1Ym1pdChpbnB1dEVsLmZvcm0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2socmVzcClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgdHJpZ2dlckF3YWl0aW5nU3VibWl0KGZvcm1FbCl7XG4gICAgbGV0IGF3YWl0aW5nU3VibWl0ID0gdGhpcy5nZXRTY2hlZHVsZWRTdWJtaXQoZm9ybUVsKVxuICAgIGlmKGF3YWl0aW5nU3VibWl0KXtcbiAgICAgIGxldCBbX2VsLCBfcmVmLCBfb3B0cywgY2FsbGJhY2tdID0gYXdhaXRpbmdTdWJtaXRcbiAgICAgIHRoaXMuY2FuY2VsU3VibWl0KGZvcm1FbClcbiAgICAgIGNhbGxiYWNrKClcbiAgICB9XG4gIH1cblxuICBnZXRTY2hlZHVsZWRTdWJtaXQoZm9ybUVsKXtcbiAgICByZXR1cm4gdGhpcy5mb3JtU3VibWl0cy5maW5kKChbZWwsIF9yZWYsIF9vcHRzLCBfY2FsbGJhY2tdKSA9PiBlbC5pc1NhbWVOb2RlKGZvcm1FbCkpXG4gIH1cblxuICBzY2hlZHVsZVN1Ym1pdChmb3JtRWwsIHJlZiwgb3B0cywgY2FsbGJhY2spe1xuICAgIGlmKHRoaXMuZ2V0U2NoZWR1bGVkU3VibWl0KGZvcm1FbCkpeyByZXR1cm4gdHJ1ZSB9XG4gICAgdGhpcy5mb3JtU3VibWl0cy5wdXNoKFtmb3JtRWwsIHJlZiwgb3B0cywgY2FsbGJhY2tdKVxuICB9XG5cbiAgY2FuY2VsU3VibWl0KGZvcm1FbCl7XG4gICAgdGhpcy5mb3JtU3VibWl0cyA9IHRoaXMuZm9ybVN1Ym1pdHMuZmlsdGVyKChbZWwsIHJlZiwgX2NhbGxiYWNrXSkgPT4ge1xuICAgICAgaWYoZWwuaXNTYW1lTm9kZShmb3JtRWwpKXtcbiAgICAgICAgdGhpcy51bmRvUmVmcyhyZWYpXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgcHVzaEZvcm1TdWJtaXQoZm9ybUVsLCB0YXJnZXRDdHgsIHBoeEV2ZW50LCBvcHRzLCBvblJlcGx5KXtcbiAgICBsZXQgZmlsdGVySWdub3JlZCA9IGVsID0+IHtcbiAgICAgIGxldCB1c2VySWdub3JlZCA9IGNsb3Nlc3RQaHhCaW5kaW5nKGVsLCBgJHt0aGlzLmJpbmRpbmcoUEhYX1VQREFURSl9PWlnbm9yZWAsIGVsLmZvcm0pXG4gICAgICByZXR1cm4gISh1c2VySWdub3JlZCB8fCBjbG9zZXN0UGh4QmluZGluZyhlbCwgXCJkYXRhLXBoeC11cGRhdGU9aWdub3JlXCIsIGVsLmZvcm0pKVxuICAgIH1cbiAgICBsZXQgZmlsdGVyRGlzYWJsZXMgPSBlbCA9PiB7XG4gICAgICByZXR1cm4gZWwuaGFzQXR0cmlidXRlKHRoaXMuYmluZGluZyhQSFhfRElTQUJMRV9XSVRIKSlcbiAgICB9XG4gICAgbGV0IGZpbHRlckJ1dHRvbiA9IGVsID0+IGVsLnRhZ05hbWUgPT0gXCJCVVRUT05cIlxuXG4gICAgbGV0IGZpbHRlcklucHV0ID0gZWwgPT4gW1wiSU5QVVRcIiwgXCJURVhUQVJFQVwiLCBcIlNFTEVDVFwiXS5pbmNsdWRlcyhlbC50YWdOYW1lKVxuXG4gICAgbGV0IHJlZkdlbmVyYXRvciA9ICgpID0+IHtcbiAgICAgIGxldCBmb3JtRWxlbWVudHMgPSBBcnJheS5mcm9tKGZvcm1FbC5lbGVtZW50cylcbiAgICAgIGxldCBkaXNhYmxlcyA9IGZvcm1FbGVtZW50cy5maWx0ZXIoZmlsdGVyRGlzYWJsZXMpXG4gICAgICBsZXQgYnV0dG9ucyA9IGZvcm1FbGVtZW50cy5maWx0ZXIoZmlsdGVyQnV0dG9uKS5maWx0ZXIoZmlsdGVySWdub3JlZClcbiAgICAgIGxldCBpbnB1dHMgPSBmb3JtRWxlbWVudHMuZmlsdGVyKGZpbHRlcklucHV0KS5maWx0ZXIoZmlsdGVySWdub3JlZClcblxuICAgICAgYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiB7XG4gICAgICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoUEhYX0RJU0FCTEVELCBidXR0b24uZGlzYWJsZWQpXG4gICAgICAgIGJ1dHRvbi5kaXNhYmxlZCA9IHRydWVcbiAgICAgIH0pXG4gICAgICBpbnB1dHMuZm9yRWFjaChpbnB1dCA9PiB7XG4gICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShQSFhfUkVBRE9OTFksIGlucHV0LnJlYWRPbmx5KVxuICAgICAgICBpbnB1dC5yZWFkT25seSA9IHRydWVcbiAgICAgICAgaWYoaW5wdXQuZmlsZXMpe1xuICAgICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZShQSFhfRElTQUJMRUQsIGlucHV0LmRpc2FibGVkKVxuICAgICAgICAgIGlucHV0LmRpc2FibGVkID0gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgZm9ybUVsLnNldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX1BBR0VfTE9BRElORyksIFwiXCIpXG4gICAgICByZXR1cm4gdGhpcy5wdXRSZWYoW2Zvcm1FbF0uY29uY2F0KGRpc2FibGVzKS5jb25jYXQoYnV0dG9ucykuY29uY2F0KGlucHV0cyksIFwic3VibWl0XCIsIG9wdHMpXG4gICAgfVxuXG4gICAgbGV0IGNpZCA9IHRoaXMudGFyZ2V0Q29tcG9uZW50SUQoZm9ybUVsLCB0YXJnZXRDdHgpXG4gICAgaWYoTGl2ZVVwbG9hZGVyLmhhc1VwbG9hZHNJblByb2dyZXNzKGZvcm1FbCkpe1xuICAgICAgbGV0IFtyZWYsIF9lbHNdID0gcmVmR2VuZXJhdG9yKClcbiAgICAgIGxldCBwdXNoID0gKCkgPT4gdGhpcy5wdXNoRm9ybVN1Ym1pdChmb3JtRWwsIHRhcmdldEN0eCwgcGh4RXZlbnQsIG9wdHMsIG9uUmVwbHkpXG4gICAgICByZXR1cm4gdGhpcy5zY2hlZHVsZVN1Ym1pdChmb3JtRWwsIHJlZiwgb3B0cywgcHVzaClcbiAgICB9IGVsc2UgaWYoTGl2ZVVwbG9hZGVyLmlucHV0c0F3YWl0aW5nUHJlZmxpZ2h0KGZvcm1FbCkubGVuZ3RoID4gMCl7XG4gICAgICBsZXQgW3JlZiwgZWxzXSA9IHJlZkdlbmVyYXRvcigpXG4gICAgICBsZXQgcHJveHlSZWZHZW4gPSAoKSA9PiBbcmVmLCBlbHMsIG9wdHNdXG4gICAgICB0aGlzLnVwbG9hZEZpbGVzKGZvcm1FbCwgdGFyZ2V0Q3R4LCByZWYsIGNpZCwgKF91cGxvYWRzKSA9PiB7XG4gICAgICAgIGxldCBmb3JtRGF0YSA9IHNlcmlhbGl6ZUZvcm0oZm9ybUVsLCB7fSlcbiAgICAgICAgdGhpcy5wdXNoV2l0aFJlcGx5KHByb3h5UmVmR2VuLCBcImV2ZW50XCIsIHtcbiAgICAgICAgICB0eXBlOiBcImZvcm1cIixcbiAgICAgICAgICBldmVudDogcGh4RXZlbnQsXG4gICAgICAgICAgdmFsdWU6IGZvcm1EYXRhLFxuICAgICAgICAgIGNpZDogY2lkXG4gICAgICAgIH0sIG9uUmVwbHkpXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgZm9ybURhdGEgPSBzZXJpYWxpemVGb3JtKGZvcm1FbCwge30pXG4gICAgICB0aGlzLnB1c2hXaXRoUmVwbHkocmVmR2VuZXJhdG9yLCBcImV2ZW50XCIsIHtcbiAgICAgICAgdHlwZTogXCJmb3JtXCIsXG4gICAgICAgIGV2ZW50OiBwaHhFdmVudCxcbiAgICAgICAgdmFsdWU6IGZvcm1EYXRhLFxuICAgICAgICBjaWQ6IGNpZFxuICAgICAgfSwgb25SZXBseSlcbiAgICB9XG4gIH1cblxuICB1cGxvYWRGaWxlcyhmb3JtRWwsIHRhcmdldEN0eCwgcmVmLCBjaWQsIG9uQ29tcGxldGUpe1xuICAgIGxldCBqb2luQ291bnRBdFVwbG9hZCA9IHRoaXMuam9pbkNvdW50XG4gICAgbGV0IGlucHV0RWxzID0gTGl2ZVVwbG9hZGVyLmFjdGl2ZUZpbGVJbnB1dHMoZm9ybUVsKVxuICAgIGxldCBudW1GaWxlSW5wdXRzSW5Qcm9ncmVzcyA9IGlucHV0RWxzLmxlbmd0aFxuXG4gICAgLy8gZ2V0IGVhY2ggZmlsZSBpbnB1dFxuICAgIGlucHV0RWxzLmZvckVhY2goaW5wdXRFbCA9PiB7XG4gICAgICBsZXQgdXBsb2FkZXIgPSBuZXcgTGl2ZVVwbG9hZGVyKGlucHV0RWwsIHRoaXMsICgpID0+IHtcbiAgICAgICAgbnVtRmlsZUlucHV0c0luUHJvZ3Jlc3MtLVxuICAgICAgICBpZihudW1GaWxlSW5wdXRzSW5Qcm9ncmVzcyA9PT0gMCl7IG9uQ29tcGxldGUoKSB9XG4gICAgICB9KTtcblxuICAgICAgdGhpcy51cGxvYWRlcnNbaW5wdXRFbF0gPSB1cGxvYWRlclxuICAgICAgbGV0IGVudHJpZXMgPSB1cGxvYWRlci5lbnRyaWVzKCkubWFwKGVudHJ5ID0+IGVudHJ5LnRvUHJlZmxpZ2h0UGF5bG9hZCgpKVxuXG4gICAgICBsZXQgcGF5bG9hZCA9IHtcbiAgICAgICAgcmVmOiBpbnB1dEVsLmdldEF0dHJpYnV0ZShQSFhfVVBMT0FEX1JFRiksXG4gICAgICAgIGVudHJpZXM6IGVudHJpZXMsXG4gICAgICAgIGNpZDogdGhpcy50YXJnZXRDb21wb25lbnRJRChpbnB1dEVsLmZvcm0sIHRhcmdldEN0eClcbiAgICAgIH1cblxuICAgICAgdGhpcy5sb2coXCJ1cGxvYWRcIiwgKCkgPT4gW1wic2VuZGluZyBwcmVmbGlnaHQgcmVxdWVzdFwiLCBwYXlsb2FkXSlcblxuICAgICAgdGhpcy5wdXNoV2l0aFJlcGx5KG51bGwsIFwiYWxsb3dfdXBsb2FkXCIsIHBheWxvYWQsIHJlc3AgPT4ge1xuICAgICAgICB0aGlzLmxvZyhcInVwbG9hZFwiLCAoKSA9PiBbXCJnb3QgcHJlZmxpZ2h0IHJlc3BvbnNlXCIsIHJlc3BdKVxuICAgICAgICBpZihyZXNwLmVycm9yKXtcbiAgICAgICAgICB0aGlzLnVuZG9SZWZzKHJlZilcbiAgICAgICAgICBsZXQgW2VudHJ5X3JlZiwgcmVhc29uXSA9IHJlc3AuZXJyb3JcbiAgICAgICAgICB0aGlzLmxvZyhcInVwbG9hZFwiLCAoKSA9PiBbYGVycm9yIGZvciBlbnRyeSAke2VudHJ5X3JlZn1gLCByZWFzb25dKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxldCBvbkVycm9yID0gKGNhbGxiYWNrKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNoYW5uZWwub25FcnJvcigoKSA9PiB7XG4gICAgICAgICAgICAgIGlmKHRoaXMuam9pbkNvdW50ID09PSBqb2luQ291bnRBdFVwbG9hZCl7IGNhbGxiYWNrKCkgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgICAgdXBsb2FkZXIuaW5pdEFkYXB0ZXJVcGxvYWQocmVzcCwgb25FcnJvciwgdGhpcy5saXZlU29ja2V0KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBkaXNwYXRjaFVwbG9hZHMobmFtZSwgZmlsZXNPckJsb2JzKXtcbiAgICBsZXQgaW5wdXRzID0gRE9NLmZpbmRVcGxvYWRJbnB1dHModGhpcy5lbCkuZmlsdGVyKGVsID0+IGVsLm5hbWUgPT09IG5hbWUpXG4gICAgaWYoaW5wdXRzLmxlbmd0aCA9PT0gMCl7IGxvZ0Vycm9yKGBubyBsaXZlIGZpbGUgaW5wdXRzIGZvdW5kIG1hdGNoaW5nIHRoZSBuYW1lIFwiJHtuYW1lfVwiYCkgfVxuICAgIGVsc2UgaWYoaW5wdXRzLmxlbmd0aCA+IDEpeyBsb2dFcnJvcihgZHVwbGljYXRlIGxpdmUgZmlsZSBpbnB1dHMgZm91bmQgbWF0Y2hpbmcgdGhlIG5hbWUgXCIke25hbWV9XCJgKSB9XG4gICAgZWxzZSB7IERPTS5kaXNwYXRjaEV2ZW50KGlucHV0c1swXSwgUEhYX1RSQUNLX1VQTE9BRFMsIHtkZXRhaWw6IHtmaWxlczogZmlsZXNPckJsb2JzfX0pIH1cbiAgfVxuXG4gIHB1c2hGb3JtUmVjb3ZlcnkoZm9ybSwgbmV3Q2lkLCBjYWxsYmFjayl7XG4gICAgdGhpcy5saXZlU29ja2V0LndpdGhpbk93bmVycyhmb3JtLCAodmlldywgdGFyZ2V0Q3R4KSA9PiB7XG4gICAgICBsZXQgaW5wdXQgPSBmb3JtLmVsZW1lbnRzWzBdXG4gICAgICBsZXQgcGh4RXZlbnQgPSBmb3JtLmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX0FVVE9fUkVDT1ZFUikpIHx8IGZvcm0uZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhcImNoYW5nZVwiKSlcblxuICAgICAgSlMuZXhlYyhcImNoYW5nZVwiLCBwaHhFdmVudCwgdmlldywgaW5wdXQsIFtcInB1c2hcIiwge190YXJnZXQ6IGlucHV0Lm5hbWUsIG5ld0NpZDogbmV3Q2lkLCBjYWxsYmFjazogY2FsbGJhY2t9XSlcbiAgICB9KVxuICB9XG5cbiAgcHVzaExpbmtQYXRjaChocmVmLCB0YXJnZXRFbCwgY2FsbGJhY2spe1xuICAgIGxldCBsaW5rUmVmID0gdGhpcy5saXZlU29ja2V0LnNldFBlbmRpbmdMaW5rKGhyZWYpXG4gICAgbGV0IHJlZkdlbiA9IHRhcmdldEVsID8gKCkgPT4gdGhpcy5wdXRSZWYoW3RhcmdldEVsXSwgXCJjbGlja1wiKSA6IG51bGxcbiAgICBsZXQgZmFsbGJhY2sgPSAoKSA9PiB0aGlzLmxpdmVTb2NrZXQucmVkaXJlY3Qod2luZG93LmxvY2F0aW9uLmhyZWYpXG5cbiAgICBsZXQgcHVzaCA9IHRoaXMucHVzaFdpdGhSZXBseShyZWZHZW4sIFwibGl2ZV9wYXRjaFwiLCB7dXJsOiBocmVmfSwgcmVzcCA9PiB7XG4gICAgICB0aGlzLmxpdmVTb2NrZXQucmVxdWVzdERPTVVwZGF0ZSgoKSA9PiB7XG4gICAgICAgIGlmKHJlc3AubGlua19yZWRpcmVjdCl7XG4gICAgICAgICAgdGhpcy5saXZlU29ja2V0LnJlcGxhY2VNYWluKGhyZWYsIG51bGwsIGNhbGxiYWNrLCBsaW5rUmVmKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmKHRoaXMubGl2ZVNvY2tldC5jb21taXRQZW5kaW5nTGluayhsaW5rUmVmKSl7XG4gICAgICAgICAgICB0aGlzLmhyZWYgPSBocmVmXG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuYXBwbHlQZW5kaW5nVXBkYXRlcygpXG4gICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2sobGlua1JlZilcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaWYocHVzaCl7XG4gICAgICBwdXNoLnJlY2VpdmUoXCJ0aW1lb3V0XCIsIGZhbGxiYWNrKVxuICAgIH0gZWxzZSB7XG4gICAgICBmYWxsYmFjaygpXG4gICAgfVxuICB9XG5cbiAgZm9ybXNGb3JSZWNvdmVyeShodG1sKXtcbiAgICBpZih0aGlzLmpvaW5Db3VudCA9PT0gMCl7IHJldHVybiBbXSB9XG5cbiAgICBsZXQgcGh4Q2hhbmdlID0gdGhpcy5iaW5kaW5nKFwiY2hhbmdlXCIpXG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRlbXBsYXRlXCIpXG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gaHRtbFxuXG4gICAgcmV0dXJuIChcbiAgICAgIERPTS5hbGwodGhpcy5lbCwgYGZvcm1bJHtwaHhDaGFuZ2V9XWApXG4gICAgICAgIC5maWx0ZXIoZm9ybSA9PiBmb3JtLmlkICYmIHRoaXMub3duc0VsZW1lbnQoZm9ybSkpXG4gICAgICAgIC5maWx0ZXIoZm9ybSA9PiBmb3JtLmVsZW1lbnRzLmxlbmd0aCA+IDApXG4gICAgICAgIC5maWx0ZXIoZm9ybSA9PiBmb3JtLmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX0FVVE9fUkVDT1ZFUikpICE9PSBcImlnbm9yZVwiKVxuICAgICAgICAubWFwKGZvcm0gPT4ge1xuICAgICAgICAgIGxldCBuZXdGb3JtID0gdGVtcGxhdGUuY29udGVudC5xdWVyeVNlbGVjdG9yKGBmb3JtW2lkPVwiJHtmb3JtLmlkfVwiXVske3BoeENoYW5nZX09XCIke2Zvcm0uZ2V0QXR0cmlidXRlKHBoeENoYW5nZSl9XCJdYClcbiAgICAgICAgICBpZihuZXdGb3JtKXtcbiAgICAgICAgICAgIHJldHVybiBbZm9ybSwgbmV3Rm9ybSwgdGhpcy50YXJnZXRDb21wb25lbnRJRChuZXdGb3JtKV1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFtmb3JtLCBudWxsLCBudWxsXVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLmZpbHRlcigoW2Zvcm0sIG5ld0Zvcm0sIG5ld0NpZF0pID0+IG5ld0Zvcm0pXG4gICAgKVxuICB9XG5cbiAgbWF5YmVQdXNoQ29tcG9uZW50c0Rlc3Ryb3llZChkZXN0cm95ZWRDSURzKXtcbiAgICBsZXQgd2lsbERlc3Ryb3lDSURzID0gZGVzdHJveWVkQ0lEcy5maWx0ZXIoY2lkID0+IHtcbiAgICAgIHJldHVybiBET00uZmluZENvbXBvbmVudE5vZGVMaXN0KHRoaXMuZWwsIGNpZCkubGVuZ3RoID09PSAwXG4gICAgfSlcbiAgICBpZih3aWxsRGVzdHJveUNJRHMubGVuZ3RoID4gMCl7XG4gICAgICB0aGlzLnBydW5pbmdDSURzLnB1c2goLi4ud2lsbERlc3Ryb3lDSURzKVxuXG4gICAgICB0aGlzLnB1c2hXaXRoUmVwbHkobnVsbCwgXCJjaWRzX3dpbGxfZGVzdHJveVwiLCB7Y2lkczogd2lsbERlc3Ryb3lDSURzfSwgKCkgPT4ge1xuICAgICAgICAvLyBUaGUgY2lkcyBhcmUgZWl0aGVyIGJhY2sgb24gdGhlIHBhZ2Ugb3IgdGhleSB3aWxsIGJlIGZ1bGx5IHJlbW92ZWQsXG4gICAgICAgIC8vIHNvIHdlIGNhbiByZW1vdmUgdGhlbSBmcm9tIHRoZSBwcnVuaW5nQ0lEcy5cbiAgICAgICAgdGhpcy5wcnVuaW5nQ0lEcyA9IHRoaXMucHJ1bmluZ0NJRHMuZmlsdGVyKGNpZCA9PiB3aWxsRGVzdHJveUNJRHMuaW5kZXhPZihjaWQpICE9PSAtMSlcblxuICAgICAgICAvLyBTZWUgaWYgYW55IG9mIHRoZSBjaWRzIHdlIHdhbnRlZCB0byBkZXN0cm95IHdlcmUgYWRkZWQgYmFjayxcbiAgICAgICAgLy8gaWYgdGhleSB3ZXJlIGFkZGVkIGJhY2ssIHdlIGRvbid0IGFjdHVhbGx5IGRlc3Ryb3kgdGhlbS5cbiAgICAgICAgbGV0IGNvbXBsZXRlbHlEZXN0cm95Q0lEcyA9IHdpbGxEZXN0cm95Q0lEcy5maWx0ZXIoY2lkID0+IHtcbiAgICAgICAgICByZXR1cm4gRE9NLmZpbmRDb21wb25lbnROb2RlTGlzdCh0aGlzLmVsLCBjaWQpLmxlbmd0aCA9PT0gMFxuICAgICAgICB9KVxuXG4gICAgICAgIGlmKGNvbXBsZXRlbHlEZXN0cm95Q0lEcy5sZW5ndGggPiAwKXtcbiAgICAgICAgICB0aGlzLnB1c2hXaXRoUmVwbHkobnVsbCwgXCJjaWRzX2Rlc3Ryb3llZFwiLCB7Y2lkczogY29tcGxldGVseURlc3Ryb3lDSURzfSwgKHJlc3ApID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZWQucHJ1bmVDSURzKHJlc3AuY2lkcylcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIG93bnNFbGVtZW50KGVsKXtcbiAgICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlKFBIWF9QQVJFTlRfSUQpID09PSB0aGlzLmlkIHx8XG4gICAgICBtYXliZShlbC5jbG9zZXN0KFBIWF9WSUVXX1NFTEVDVE9SKSwgbm9kZSA9PiBub2RlLmlkKSA9PT0gdGhpcy5pZFxuICB9XG5cbiAgc3VibWl0Rm9ybShmb3JtLCB0YXJnZXRDdHgsIHBoeEV2ZW50LCBvcHRzID0ge30pe1xuICAgIERPTS5wdXRQcml2YXRlKGZvcm0sIFBIWF9IQVNfU1VCTUlUVEVELCB0cnVlKVxuICAgIGxldCBwaHhGZWVkYmFjayA9IHRoaXMubGl2ZVNvY2tldC5iaW5kaW5nKFBIWF9GRUVEQkFDS19GT1IpXG4gICAgbGV0IGlucHV0cyA9IEFycmF5LmZyb20oZm9ybS5lbGVtZW50cylcbiAgICB0aGlzLmxpdmVTb2NrZXQuYmx1ckFjdGl2ZUVsZW1lbnQodGhpcylcbiAgICB0aGlzLnB1c2hGb3JtU3VibWl0KGZvcm0sIHRhcmdldEN0eCwgcGh4RXZlbnQsIG9wdHMsICgpID0+IHtcbiAgICAgIGlucHV0cy5mb3JFYWNoKGlucHV0ID0+IERPTS5zaG93RXJyb3IoaW5wdXQsIHBoeEZlZWRiYWNrKSlcbiAgICAgIHRoaXMubGl2ZVNvY2tldC5yZXN0b3JlUHJldmlvdXNseUFjdGl2ZUZvY3VzKClcbiAgICB9KVxuICB9XG5cbiAgYmluZGluZyhraW5kKXsgcmV0dXJuIHRoaXMubGl2ZVNvY2tldC5iaW5kaW5nKGtpbmQpIH1cbn1cbiIsICIvKiogSW5pdGlhbGl6ZXMgdGhlIExpdmVTb2NrZXRcbiAqXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGVuZFBvaW50IC0gVGhlIHN0cmluZyBXZWJTb2NrZXQgZW5kcG9pbnQsIGllLCBgXCJ3c3M6Ly9leGFtcGxlLmNvbS9saXZlXCJgLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBcIi9saXZlXCJgIChpbmhlcml0ZWQgaG9zdCAmIHByb3RvY29sKVxuICogQHBhcmFtIHtQaG9lbml4LlNvY2tldH0gc29ja2V0IC0gdGhlIHJlcXVpcmVkIFBob2VuaXggU29ja2V0IGNsYXNzIGltcG9ydGVkIGZyb20gXCJwaG9lbml4XCIuIEZvciBleGFtcGxlOlxuICpcbiAqICAgICBpbXBvcnQge1NvY2tldH0gZnJvbSBcInBob2VuaXhcIlxuICogICAgIGltcG9ydCB7TGl2ZVNvY2tldH0gZnJvbSBcInBob2VuaXhfbGl2ZV92aWV3XCJcbiAqICAgICBsZXQgbGl2ZVNvY2tldCA9IG5ldyBMaXZlU29ja2V0KFwiL2xpdmVcIiwgU29ja2V0LCB7Li4ufSlcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHNdIC0gT3B0aW9uYWwgY29uZmlndXJhdGlvbi4gT3V0c2lkZSBvZiBrZXlzIGxpc3RlZCBiZWxvdywgYWxsXG4gKiBjb25maWd1cmF0aW9uIGlzIHBhc3NlZCBkaXJlY3RseSB0byB0aGUgUGhvZW5peCBTb2NrZXQgY29uc3RydWN0b3IuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHMuZGVmYXVsdHNdIC0gVGhlIG9wdGlvbmFsIGRlZmF1bHRzIHRvIHVzZSBmb3IgdmFyaW91cyBiaW5kaW5ncyxcbiAqIHN1Y2ggYXMgYHBoeC1kZWJvdW5jZWAuIFN1cHBvcnRzIHRoZSBmb2xsb3dpbmcga2V5czpcbiAqXG4gKiAgIC0gZGVib3VuY2UgLSB0aGUgbWlsbGlzZWNvbmQgcGh4LWRlYm91bmNlIHRpbWUuIERlZmF1bHRzIDMwMFxuICogICAtIHRocm90dGxlIC0gdGhlIG1pbGxpc2Vjb25kIHBoeC10aHJvdHRsZSB0aW1lLiBEZWZhdWx0cyAzMDBcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0cy5wYXJhbXNdIC0gVGhlIG9wdGlvbmFsIGZ1bmN0aW9uIGZvciBwYXNzaW5nIGNvbm5lY3QgcGFyYW1zLlxuICogVGhlIGZ1bmN0aW9uIHJlY2VpdmVzIHRoZSBlbGVtZW50IGFzc29jaWF0ZWQgd2l0aCBhIGdpdmVuIExpdmVWaWV3LiBGb3IgZXhhbXBsZTpcbiAqXG4gKiAgICAgKGVsKSA9PiB7dmlldzogZWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1teS12aWV3LW5hbWVcIiwgdG9rZW46IHdpbmRvdy5teVRva2VufVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy5iaW5kaW5nUHJlZml4XSAtIFRoZSBvcHRpb25hbCBwcmVmaXggdG8gdXNlIGZvciBhbGwgcGh4IERPTSBhbm5vdGF0aW9ucy5cbiAqIERlZmF1bHRzIHRvIFwicGh4LVwiLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRzLmhvb2tzXSAtIFRoZSBvcHRpb25hbCBvYmplY3QgZm9yIHJlZmVyZW5jaW5nIExpdmVWaWV3IGhvb2sgY2FsbGJhY2tzLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRzLnVwbG9hZGVyc10gLSBUaGUgb3B0aW9uYWwgb2JqZWN0IGZvciByZWZlcmVuY2luZyBMaXZlVmlldyB1cGxvYWRlciBjYWxsYmFja3MuXG4gKiBAcGFyYW0ge2ludGVnZXJ9IFtvcHRzLmxvYWRlclRpbWVvdXRdIC0gVGhlIG9wdGlvbmFsIGRlbGF5IGluIG1pbGxpc2Vjb25kcyB0byB3YWl0IGJlZm9yZSBhcHBseVxuICogbG9hZGluZyBzdGF0ZXMuXG4gKiBAcGFyYW0ge2ludGVnZXJ9IFtvcHRzLm1heFJlbG9hZHNdIC0gVGhlIG1heGltdW0gcmVsb2FkcyBiZWZvcmUgZW50ZXJpbmcgZmFpbHNhZmUgbW9kZS5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gW29wdHMucmVsb2FkSml0dGVyTWluXSAtIFRoZSBtaW5pbXVtIHRpbWUgYmV0d2VlbiBub3JtYWwgcmVsb2FkIGF0dGVtcHRzLlxuICogQHBhcmFtIHtpbnRlZ2VyfSBbb3B0cy5yZWxvYWRKaXR0ZXJNYXhdIC0gVGhlIG1heGltdW0gdGltZSBiZXR3ZWVuIG5vcm1hbCByZWxvYWQgYXR0ZW1wdHMuXG4gKiBAcGFyYW0ge2ludGVnZXJ9IFtvcHRzLmZhaWxzYWZlSml0dGVyXSAtIFRoZSB0aW1lIGJldHdlZW4gcmVsb2FkIGF0dGVtcHRzIGluIGZhaWxzYWZlIG1vZGUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0cy52aWV3TG9nZ2VyXSAtIFRoZSBvcHRpb25hbCBmdW5jdGlvbiB0byBsb2cgZGVidWcgaW5mb3JtYXRpb24uIEZvciBleGFtcGxlOlxuICpcbiAqICAgICAodmlldywga2luZCwgbXNnLCBvYmopID0+IGNvbnNvbGUubG9nKGAke3ZpZXcuaWR9ICR7a2luZH06ICR7bXNnfSAtIGAsIG9iailcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHMubWV0YWRhdGFdIC0gVGhlIG9wdGlvbmFsIG9iamVjdCBtYXBwaW5nIGV2ZW50IG5hbWVzIHRvIGZ1bmN0aW9ucyBmb3JcbiAqIHBvcHVsYXRpbmcgZXZlbnQgbWV0YWRhdGEuIEZvciBleGFtcGxlOlxuICpcbiAqICAgICBtZXRhZGF0YToge1xuICogICAgICAgY2xpY2s6IChlLCBlbCkgPT4ge1xuICogICAgICAgICByZXR1cm4ge1xuICogICAgICAgICAgIGN0cmxLZXk6IGUuY3RybEtleSxcbiAqICAgICAgICAgICBtZXRhS2V5OiBlLm1ldGFLZXksXG4gKiAgICAgICAgICAgZGV0YWlsOiBlLmRldGFpbCB8fCAxLFxuICogICAgICAgICB9XG4gKiAgICAgICB9LFxuICogICAgICAga2V5ZG93bjogKGUsIGVsKSA9PiB7XG4gKiAgICAgICAgIHJldHVybiB7XG4gKiAgICAgICAgICAga2V5OiBlLmtleSxcbiAqICAgICAgICAgICBjdHJsS2V5OiBlLmN0cmxLZXksXG4gKiAgICAgICAgICAgbWV0YUtleTogZS5tZXRhS2V5LFxuICogICAgICAgICAgIHNoaWZ0S2V5OiBlLnNoaWZ0S2V5XG4gKiAgICAgICAgIH1cbiAqICAgICAgIH1cbiAqICAgICB9XG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHMuc2Vzc2lvblN0b3JhZ2VdIC0gQW4gb3B0aW9uYWwgU3RvcmFnZSBjb21wYXRpYmxlIG9iamVjdFxuICogVXNlZnVsIHdoZW4gTGl2ZVZpZXcgd29uJ3QgaGF2ZSBhY2Nlc3MgdG8gYHNlc3Npb25TdG9yYWdlYC4gIEZvciBleGFtcGxlLCBUaGlzIGNvdWxkXG4gKiBoYXBwZW4gaWYgYSBzaXRlIGxvYWRzIGEgY3Jvc3MtZG9tYWluIExpdmVWaWV3IGluIGFuIGlmcmFtZS4gIEV4YW1wbGUgdXNhZ2U6XG4gKlxuICogICAgIGNsYXNzIEluTWVtb3J5U3RvcmFnZSB7XG4gKiAgICAgICBjb25zdHJ1Y3RvcigpIHsgdGhpcy5zdG9yYWdlID0ge30gfVxuICogICAgICAgZ2V0SXRlbShrZXlOYW1lKSB7IHJldHVybiB0aGlzLnN0b3JhZ2Vba2V5TmFtZV0gfVxuICogICAgICAgcmVtb3ZlSXRlbShrZXlOYW1lKSB7IGRlbGV0ZSB0aGlzLnN0b3JhZ2Vba2V5TmFtZV0gfVxuICogICAgICAgc2V0SXRlbShrZXlOYW1lLCBrZXlWYWx1ZSkgeyB0aGlzLnN0b3JhZ2Vba2V5TmFtZV0gPSBrZXlWYWx1ZSB9XG4gKiAgICAgfVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cy5sb2NhbFN0b3JhZ2VdIC0gQW4gb3B0aW9uYWwgU3RvcmFnZSBjb21wYXRpYmxlIG9iamVjdFxuICogVXNlZnVsIGZvciB3aGVuIExpdmVWaWV3IHdvbid0IGhhdmUgYWNjZXNzIHRvIGBsb2NhbFN0b3JhZ2VgLlxuICogU2VlIGBvcHRzLnNlc3Npb25TdG9yYWdlYCBmb3IgZXhhbXBsZXMuXG4qL1xuXG5pbXBvcnQge1xuICBCSU5ESU5HX1BSRUZJWCxcbiAgQ09OU0VDVVRJVkVfUkVMT0FEUyxcbiAgREVGQVVMVFMsXG4gIEZBSUxTQUZFX0pJVFRFUixcbiAgTE9BREVSX1RJTUVPVVQsXG4gIE1BWF9SRUxPQURTLFxuICBQSFhfREVCT1VOQ0UsXG4gIFBIWF9EUk9QX1RBUkdFVCxcbiAgUEhYX0hBU19GT0NVU0VELFxuICBQSFhfS0VZLFxuICBQSFhfTElOS19TVEFURSxcbiAgUEhYX0xJVkVfTElOSyxcbiAgUEhYX0xWX0RFQlVHLFxuICBQSFhfTFZfTEFURU5DWV9TSU0sXG4gIFBIWF9MVl9QUk9GSUxFLFxuICBQSFhfTUFJTixcbiAgUEhYX1BBUkVOVF9JRCxcbiAgUEhYX1ZJRVdfU0VMRUNUT1IsXG4gIFBIWF9ST09UX0lELFxuICBQSFhfVEhST1RUTEUsXG4gIFBIWF9UUkFDS19VUExPQURTLFxuICBQSFhfU0VTU0lPTixcbiAgUkVMT0FEX0pJVFRFUl9NSU4sXG4gIFJFTE9BRF9KSVRURVJfTUFYLFxufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQge1xuICBjbG9uZSxcbiAgY2xvc2VzdFBoeEJpbmRpbmcsXG4gIGNsb3N1cmUsXG4gIGRlYnVnLFxuICBpc09iamVjdCxcbiAgbWF5YmVcbn0gZnJvbSBcIi4vdXRpbHNcIlxuXG5pbXBvcnQgQnJvd3NlciBmcm9tIFwiLi9icm93c2VyXCJcbmltcG9ydCBET00gZnJvbSBcIi4vZG9tXCJcbmltcG9ydCBIb29rcyBmcm9tIFwiLi9ob29rc1wiXG5pbXBvcnQgTGl2ZVVwbG9hZGVyIGZyb20gXCIuL2xpdmVfdXBsb2FkZXJcIlxuaW1wb3J0IFZpZXcgZnJvbSBcIi4vdmlld1wiXG5pbXBvcnQgSlMgZnJvbSBcIi4vanNcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaXZlU29ja2V0IHtcbiAgY29uc3RydWN0b3IodXJsLCBwaHhTb2NrZXQsIG9wdHMgPSB7fSl7XG4gICAgdGhpcy51bmxvYWRlZCA9IGZhbHNlXG4gICAgaWYoIXBoeFNvY2tldCB8fCBwaHhTb2NrZXQuY29uc3RydWN0b3IubmFtZSA9PT0gXCJPYmplY3RcIil7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFxuICAgICAgYSBwaG9lbml4IFNvY2tldCBtdXN0IGJlIHByb3ZpZGVkIGFzIHRoZSBzZWNvbmQgYXJndW1lbnQgdG8gdGhlIExpdmVTb2NrZXQgY29uc3RydWN0b3IuIEZvciBleGFtcGxlOlxuXG4gICAgICAgICAgaW1wb3J0IHtTb2NrZXR9IGZyb20gXCJwaG9lbml4XCJcbiAgICAgICAgICBpbXBvcnQge0xpdmVTb2NrZXR9IGZyb20gXCJwaG9lbml4X2xpdmVfdmlld1wiXG4gICAgICAgICAgbGV0IGxpdmVTb2NrZXQgPSBuZXcgTGl2ZVNvY2tldChcIi9saXZlXCIsIFNvY2tldCwgey4uLn0pXG4gICAgICBgKVxuICAgIH1cbiAgICB0aGlzLnNvY2tldCA9IG5ldyBwaHhTb2NrZXQodXJsLCBvcHRzKVxuICAgIHRoaXMuYmluZGluZ1ByZWZpeCA9IG9wdHMuYmluZGluZ1ByZWZpeCB8fCBCSU5ESU5HX1BSRUZJWFxuICAgIHRoaXMub3B0cyA9IG9wdHNcbiAgICB0aGlzLnBhcmFtcyA9IGNsb3N1cmUob3B0cy5wYXJhbXMgfHwge30pXG4gICAgdGhpcy52aWV3TG9nZ2VyID0gb3B0cy52aWV3TG9nZ2VyXG4gICAgdGhpcy5tZXRhZGF0YUNhbGxiYWNrcyA9IG9wdHMubWV0YWRhdGEgfHwge31cbiAgICB0aGlzLmRlZmF1bHRzID0gT2JqZWN0LmFzc2lnbihjbG9uZShERUZBVUxUUyksIG9wdHMuZGVmYXVsdHMgfHwge30pXG4gICAgdGhpcy5hY3RpdmVFbGVtZW50ID0gbnVsbFxuICAgIHRoaXMucHJldkFjdGl2ZSA9IG51bGxcbiAgICB0aGlzLnNpbGVuY2VkID0gZmFsc2VcbiAgICB0aGlzLm1haW4gPSBudWxsXG4gICAgdGhpcy5vdXRnb2luZ01haW5FbCA9IG51bGxcbiAgICB0aGlzLmNsaWNrU3RhcnRlZEF0VGFyZ2V0ID0gbnVsbFxuICAgIHRoaXMubGlua1JlZiA9IDFcbiAgICB0aGlzLnJvb3RzID0ge31cbiAgICB0aGlzLmhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZlxuICAgIHRoaXMucGVuZGluZ0xpbmsgPSBudWxsXG4gICAgdGhpcy5jdXJyZW50TG9jYXRpb24gPSBjbG9uZSh3aW5kb3cubG9jYXRpb24pXG4gICAgdGhpcy5ob29rcyA9IG9wdHMuaG9va3MgfHwge31cbiAgICB0aGlzLnVwbG9hZGVycyA9IG9wdHMudXBsb2FkZXJzIHx8IHt9XG4gICAgdGhpcy5sb2FkZXJUaW1lb3V0ID0gb3B0cy5sb2FkZXJUaW1lb3V0IHx8IExPQURFUl9USU1FT1VUXG4gICAgdGhpcy5tYXhSZWxvYWRzID0gb3B0cy5tYXhSZWxvYWRzIHx8IE1BWF9SRUxPQURTXG4gICAgdGhpcy5yZWxvYWRKaXR0ZXJNaW4gPSBvcHRzLnJlbG9hZEppdHRlck1pbiB8fCBSRUxPQURfSklUVEVSX01JTlxuICAgIHRoaXMucmVsb2FkSml0dGVyTWF4ID0gb3B0cy5yZWxvYWRKaXR0ZXJNYXggfHwgUkVMT0FEX0pJVFRFUl9NQVhcbiAgICB0aGlzLmZhaWxzYWZlSml0dGVyID0gb3B0cy5mYWlsc2FmZUppdHRlciB8fCBGQUlMU0FGRV9KSVRURVJcbiAgICB0aGlzLmxvY2FsU3RvcmFnZSA9IG9wdHMubG9jYWxTdG9yYWdlIHx8IHdpbmRvdy5sb2NhbFN0b3JhZ2VcbiAgICB0aGlzLnNlc3Npb25TdG9yYWdlID0gb3B0cy5zZXNzaW9uU3RvcmFnZSB8fCB3aW5kb3cuc2Vzc2lvblN0b3JhZ2VcbiAgICB0aGlzLmJvdW5kVG9wTGV2ZWxFdmVudHMgPSBmYWxzZVxuICAgIHRoaXMuZG9tQ2FsbGJhY2tzID0gT2JqZWN0LmFzc2lnbih7b25Ob2RlQWRkZWQ6IGNsb3N1cmUoKSwgb25CZWZvcmVFbFVwZGF0ZWQ6IGNsb3N1cmUoKX0sIG9wdHMuZG9tIHx8IHt9KVxuICAgIHRoaXMudHJhbnNpdGlvbnMgPSBuZXcgVHJhbnNpdGlvblNldCgpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwYWdlaGlkZVwiLCBfZSA9PiB7XG4gICAgICB0aGlzLnVubG9hZGVkID0gdHJ1ZVxuICAgIH0pXG4gICAgdGhpcy5zb2NrZXQub25PcGVuKCgpID0+IHtcbiAgICAgIGlmKHRoaXMuaXNVbmxvYWRlZCgpKXtcbiAgICAgICAgLy8gcmVsb2FkIHBhZ2UgaWYgYmVpbmcgcmVzdG9yZWQgZnJvbSBiYWNrL2ZvcndhcmQgY2FjaGUgYW5kIGJyb3dzZXIgZG9lcyBub3QgZW1pdCBcInBhZ2VzaG93XCJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8vIHB1YmxpY1xuXG4gIGlzUHJvZmlsZUVuYWJsZWQoKXsgcmV0dXJuIHRoaXMuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShQSFhfTFZfUFJPRklMRSkgPT09IFwidHJ1ZVwiIH1cblxuICBpc0RlYnVnRW5hYmxlZCgpeyByZXR1cm4gdGhpcy5zZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFBIWF9MVl9ERUJVRykgPT09IFwidHJ1ZVwiIH1cblxuICBpc0RlYnVnRGlzYWJsZWQoKXsgcmV0dXJuIHRoaXMuc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbShQSFhfTFZfREVCVUcpID09PSBcImZhbHNlXCIgfVxuXG4gIGVuYWJsZURlYnVnKCl7IHRoaXMuc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShQSFhfTFZfREVCVUcsIFwidHJ1ZVwiKSB9XG5cbiAgZW5hYmxlUHJvZmlsaW5nKCl7IHRoaXMuc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShQSFhfTFZfUFJPRklMRSwgXCJ0cnVlXCIpIH1cblxuICBkaXNhYmxlRGVidWcoKXsgdGhpcy5zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFBIWF9MVl9ERUJVRywgXCJmYWxzZVwiKSB9XG5cbiAgZGlzYWJsZVByb2ZpbGluZygpeyB0aGlzLnNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oUEhYX0xWX1BST0ZJTEUpIH1cblxuICBlbmFibGVMYXRlbmN5U2ltKHVwcGVyQm91bmRNcyl7XG4gICAgdGhpcy5lbmFibGVEZWJ1ZygpXG4gICAgY29uc29sZS5sb2coXCJsYXRlbmN5IHNpbXVsYXRvciBlbmFibGVkIGZvciB0aGUgZHVyYXRpb24gb2YgdGhpcyBicm93c2VyIHNlc3Npb24uIENhbGwgZGlzYWJsZUxhdGVuY3lTaW0oKSB0byBkaXNhYmxlXCIpXG4gICAgdGhpcy5zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFBIWF9MVl9MQVRFTkNZX1NJTSwgdXBwZXJCb3VuZE1zKVxuICB9XG5cbiAgZGlzYWJsZUxhdGVuY3lTaW0oKXsgdGhpcy5zZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKFBIWF9MVl9MQVRFTkNZX1NJTSkgfVxuXG4gIGdldExhdGVuY3lTaW0oKXtcbiAgICBsZXQgc3RyID0gdGhpcy5zZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFBIWF9MVl9MQVRFTkNZX1NJTSlcbiAgICByZXR1cm4gc3RyID8gcGFyc2VJbnQoc3RyKSA6IG51bGxcbiAgfVxuXG4gIGdldFNvY2tldCgpeyByZXR1cm4gdGhpcy5zb2NrZXQgfVxuXG4gIGNvbm5lY3QoKXtcbiAgICAvLyBlbmFibGUgZGVidWcgYnkgZGVmYXVsdCBpZiBvbiBsb2NhbGhvc3QgYW5kIG5vdCBleHBsaWNpdGx5IGRpc2FibGVkXG4gICAgaWYod2luZG93LmxvY2F0aW9uLmhvc3RuYW1lID09PSBcImxvY2FsaG9zdFwiICYmICF0aGlzLmlzRGVidWdEaXNhYmxlZCgpKXsgdGhpcy5lbmFibGVEZWJ1ZygpIH1cbiAgICBsZXQgZG9Db25uZWN0ID0gKCkgPT4ge1xuICAgICAgaWYodGhpcy5qb2luUm9vdFZpZXdzKCkpe1xuICAgICAgICB0aGlzLmJpbmRUb3BMZXZlbEV2ZW50cygpXG4gICAgICAgIHRoaXMuc29ja2V0LmNvbm5lY3QoKVxuICAgICAgfVxuICAgIH1cbiAgICBpZihbXCJjb21wbGV0ZVwiLCBcImxvYWRlZFwiLCBcImludGVyYWN0aXZlXCJdLmluZGV4T2YoZG9jdW1lbnQucmVhZHlTdGF0ZSkgPj0gMCl7XG4gICAgICBkb0Nvbm5lY3QoKVxuICAgIH0gZWxzZSB7XG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoKSA9PiBkb0Nvbm5lY3QoKSlcbiAgICB9XG4gIH1cblxuICBkaXNjb25uZWN0KGNhbGxiYWNrKXsgdGhpcy5zb2NrZXQuZGlzY29ubmVjdChjYWxsYmFjaykgfVxuXG4gIGV4ZWNKUyhlbCwgZW5jb2RlZEpTLCBldmVudFR5cGUgPSBudWxsKXtcbiAgICB0aGlzLm93bmVyKGVsLCB2aWV3ID0+IEpTLmV4ZWMoZXZlbnRUeXBlLCBlbmNvZGVkSlMsIHZpZXcsIGVsKSlcbiAgfVxuXG4gIC8vIHByaXZhdGVcblxuICB0cmlnZ2VyRE9NKGtpbmQsIGFyZ3MpeyB0aGlzLmRvbUNhbGxiYWNrc1traW5kXSguLi5hcmdzKSB9XG5cbiAgdGltZShuYW1lLCBmdW5jKXtcbiAgICBpZighdGhpcy5pc1Byb2ZpbGVFbmFibGVkKCkgfHwgIWNvbnNvbGUudGltZSl7IHJldHVybiBmdW5jKCkgfVxuICAgIGNvbnNvbGUudGltZShuYW1lKVxuICAgIGxldCByZXN1bHQgPSBmdW5jKClcbiAgICBjb25zb2xlLnRpbWVFbmQobmFtZSlcbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cblxuICBsb2codmlldywga2luZCwgbXNnQ2FsbGJhY2spe1xuICAgIGlmKHRoaXMudmlld0xvZ2dlcil7XG4gICAgICBsZXQgW21zZywgb2JqXSA9IG1zZ0NhbGxiYWNrKClcbiAgICAgIHRoaXMudmlld0xvZ2dlcih2aWV3LCBraW5kLCBtc2csIG9iailcbiAgICB9IGVsc2UgaWYodGhpcy5pc0RlYnVnRW5hYmxlZCgpKXtcbiAgICAgIGxldCBbbXNnLCBvYmpdID0gbXNnQ2FsbGJhY2soKVxuICAgICAgZGVidWcodmlldywga2luZCwgbXNnLCBvYmopXG4gICAgfVxuICB9XG5cbiAgcmVxdWVzdERPTVVwZGF0ZShjYWxsYmFjayl7XG4gICAgdGhpcy50cmFuc2l0aW9ucy5hZnRlcihjYWxsYmFjaylcbiAgfVxuXG4gIHRyYW5zaXRpb24odGltZSwgb25TdGFydCwgb25Eb25lID0gZnVuY3Rpb24oKXt9KXtcbiAgICB0aGlzLnRyYW5zaXRpb25zLmFkZFRyYW5zaXRpb24odGltZSwgb25TdGFydCwgb25Eb25lKVxuICB9XG5cbiAgb25DaGFubmVsKGNoYW5uZWwsIGV2ZW50LCBjYil7XG4gICAgY2hhbm5lbC5vbihldmVudCwgZGF0YSA9PiB7XG4gICAgICBsZXQgbGF0ZW5jeSA9IHRoaXMuZ2V0TGF0ZW5jeVNpbSgpXG4gICAgICBpZighbGF0ZW5jeSl7XG4gICAgICAgIGNiKGRhdGEpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZyhgc2ltdWxhdGluZyAke2xhdGVuY3l9bXMgb2YgbGF0ZW5jeSBmcm9tIHNlcnZlciB0byBjbGllbnRgKVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGNiKGRhdGEpLCBsYXRlbmN5KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICB3cmFwUHVzaCh2aWV3LCBvcHRzLCBwdXNoKXtcbiAgICBsZXQgbGF0ZW5jeSA9IHRoaXMuZ2V0TGF0ZW5jeVNpbSgpXG4gICAgbGV0IG9sZEpvaW5Db3VudCA9IHZpZXcuam9pbkNvdW50XG4gICAgaWYoIWxhdGVuY3kpe1xuICAgICAgaWYodGhpcy5pc0Nvbm5lY3RlZCgpICYmIG9wdHMudGltZW91dCl7XG4gICAgICAgIHJldHVybiBwdXNoKCkucmVjZWl2ZShcInRpbWVvdXRcIiwgKCkgPT4ge1xuICAgICAgICAgIGlmKHZpZXcuam9pbkNvdW50ID09PSBvbGRKb2luQ291bnQgJiYgIXZpZXcuaXNEZXN0cm95ZWQoKSl7XG4gICAgICAgICAgICB0aGlzLnJlbG9hZFdpdGhKaXR0ZXIodmlldywgKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmxvZyh2aWV3LCBcInRpbWVvdXRcIiwgKCkgPT4gW1wicmVjZWl2ZWQgdGltZW91dCB3aGlsZSBjb21tdW5pY2F0aW5nIHdpdGggc2VydmVyLiBGYWxsaW5nIGJhY2sgdG8gaGFyZCByZWZyZXNoIGZvciByZWNvdmVyeVwiXSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHB1c2goKVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKGBzaW11bGF0aW5nICR7bGF0ZW5jeX1tcyBvZiBsYXRlbmN5IGZyb20gY2xpZW50IHRvIHNlcnZlcmApXG4gICAgbGV0IGZha2VQdXNoID0ge1xuICAgICAgcmVjZWl2ZXM6IFtdLFxuICAgICAgcmVjZWl2ZShraW5kLCBjYil7IHRoaXMucmVjZWl2ZXMucHVzaChba2luZCwgY2JdKSB9XG4gICAgfVxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYodmlldy5pc0Rlc3Ryb3llZCgpKXsgcmV0dXJuIH1cbiAgICAgIGZha2VQdXNoLnJlY2VpdmVzLnJlZHVjZSgoYWNjLCBba2luZCwgY2JdKSA9PiBhY2MucmVjZWl2ZShraW5kLCBjYiksIHB1c2goKSlcbiAgICB9LCBsYXRlbmN5KVxuICAgIHJldHVybiBmYWtlUHVzaFxuICB9XG5cbiAgcmVsb2FkV2l0aEppdHRlcih2aWV3LCBsb2cpe1xuICAgIHZpZXcuZGVzdHJveSgpXG4gICAgdGhpcy5kaXNjb25uZWN0KClcbiAgICBsZXQgbWluTXMgPSB0aGlzLnJlbG9hZEppdHRlck1pblxuICAgIGxldCBtYXhNcyA9IHRoaXMucmVsb2FkSml0dGVyTWF4XG4gICAgbGV0IGFmdGVyTXMgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4TXMgLSBtaW5NcyArIDEpKSArIG1pbk1zXG4gICAgbGV0IHRyaWVzID0gQnJvd3Nlci51cGRhdGVMb2NhbCh0aGlzLmxvY2FsU3RvcmFnZSwgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLCBDT05TRUNVVElWRV9SRUxPQURTLCAwLCBjb3VudCA9PiBjb3VudCArIDEpXG4gICAgbG9nID8gbG9nKCkgOiB0aGlzLmxvZyh2aWV3LCBcImpvaW5cIiwgKCkgPT4gW2BlbmNvdW50ZXJlZCAke3RyaWVzfSBjb25zZWN1dGl2ZSByZWxvYWRzYF0pXG4gICAgaWYodHJpZXMgPiB0aGlzLm1heFJlbG9hZHMpe1xuICAgICAgdGhpcy5sb2codmlldywgXCJqb2luXCIsICgpID0+IFtgZXhjZWVkZWQgJHt0aGlzLm1heFJlbG9hZHN9IGNvbnNlY3V0aXZlIHJlbG9hZHMuIEVudGVyaW5nIGZhaWxzYWZlIG1vZGVgXSlcbiAgICAgIGFmdGVyTXMgPSB0aGlzLmZhaWxzYWZlSml0dGVyXG4gICAgfVxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYodGhpcy5oYXNQZW5kaW5nTGluaygpKXtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uID0gdGhpcy5wZW5kaW5nTGlua1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpXG4gICAgICB9XG4gICAgfSwgYWZ0ZXJNcylcbiAgfVxuXG4gIGdldEhvb2tDYWxsYmFja3MobmFtZSl7XG4gICAgcmV0dXJuIG5hbWUgJiYgbmFtZS5zdGFydHNXaXRoKFwiUGhvZW5peC5cIikgPyBIb29rc1tuYW1lLnNwbGl0KFwiLlwiKVsxXV0gOiB0aGlzLmhvb2tzW25hbWVdXG4gIH1cblxuICBpc1VubG9hZGVkKCl7IHJldHVybiB0aGlzLnVubG9hZGVkIH1cblxuICBpc0Nvbm5lY3RlZCgpeyByZXR1cm4gdGhpcy5zb2NrZXQuaXNDb25uZWN0ZWQoKSB9XG5cbiAgZ2V0QmluZGluZ1ByZWZpeCgpeyByZXR1cm4gdGhpcy5iaW5kaW5nUHJlZml4IH1cblxuICBiaW5kaW5nKGtpbmQpeyByZXR1cm4gYCR7dGhpcy5nZXRCaW5kaW5nUHJlZml4KCl9JHtraW5kfWAgfVxuXG4gIGNoYW5uZWwodG9waWMsIHBhcmFtcyl7IHJldHVybiB0aGlzLnNvY2tldC5jaGFubmVsKHRvcGljLCBwYXJhbXMpIH1cblxuICBqb2luUm9vdFZpZXdzKCl7XG4gICAgbGV0IHJvb3RzRm91bmQgPSBmYWxzZVxuICAgIERPTS5hbGwoZG9jdW1lbnQsIGAke1BIWF9WSUVXX1NFTEVDVE9SfTpub3QoWyR7UEhYX1BBUkVOVF9JRH1dKWAsIHJvb3RFbCA9PiB7XG4gICAgICBpZighdGhpcy5nZXRSb290QnlJZChyb290RWwuaWQpKXtcbiAgICAgICAgbGV0IHZpZXcgPSB0aGlzLm5ld1Jvb3RWaWV3KHJvb3RFbClcbiAgICAgICAgdmlldy5zZXRIcmVmKHRoaXMuZ2V0SHJlZigpKVxuICAgICAgICB2aWV3LmpvaW4oKVxuICAgICAgICBpZihyb290RWwuZ2V0QXR0cmlidXRlKFBIWF9NQUlOKSl7IHRoaXMubWFpbiA9IHZpZXcgfVxuICAgICAgfVxuICAgICAgcm9vdHNGb3VuZCA9IHRydWVcbiAgICB9KVxuICAgIHJldHVybiByb290c0ZvdW5kXG4gIH1cblxuICByZWRpcmVjdCh0bywgZmxhc2gpe1xuICAgIHRoaXMuZGlzY29ubmVjdCgpXG4gICAgQnJvd3Nlci5yZWRpcmVjdCh0bywgZmxhc2gpXG4gIH1cblxuICByZXBsYWNlTWFpbihocmVmLCBmbGFzaCwgY2FsbGJhY2sgPSBudWxsLCBsaW5rUmVmID0gdGhpcy5zZXRQZW5kaW5nTGluayhocmVmKSl7XG4gICAgdGhpcy5vdXRnb2luZ01haW5FbCA9IHRoaXMub3V0Z29pbmdNYWluRWwgfHwgdGhpcy5tYWluLmVsXG4gICAgbGV0IG5ld01haW5FbCA9IERPTS5jbG9uZU5vZGUodGhpcy5vdXRnb2luZ01haW5FbCwgXCJcIilcbiAgICB0aGlzLm1haW4uc2hvd0xvYWRlcih0aGlzLmxvYWRlclRpbWVvdXQpXG4gICAgdGhpcy5tYWluLmRlc3Ryb3koKVxuXG4gICAgdGhpcy5tYWluID0gdGhpcy5uZXdSb290VmlldyhuZXdNYWluRWwsIGZsYXNoKVxuICAgIHRoaXMubWFpbi5zZXRSZWRpcmVjdChocmVmKVxuICAgIHRoaXMudHJhbnNpdGlvblJlbW92ZXMoKVxuICAgIHRoaXMubWFpbi5qb2luKChqb2luQ291bnQsIG9uRG9uZSkgPT4ge1xuICAgICAgaWYoam9pbkNvdW50ID09PSAxICYmIHRoaXMuY29tbWl0UGVuZGluZ0xpbmsobGlua1JlZikpe1xuICAgICAgICB0aGlzLnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICAgIERPTS5maW5kUGh4U3RpY2t5KGRvY3VtZW50KS5mb3JFYWNoKGVsID0+IG5ld01haW5FbC5hcHBlbmRDaGlsZChlbCkpXG4gICAgICAgICAgdGhpcy5vdXRnb2luZ01haW5FbC5yZXBsYWNlV2l0aChuZXdNYWluRWwpXG4gICAgICAgICAgdGhpcy5vdXRnb2luZ01haW5FbCA9IG51bGxcbiAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpXG4gICAgICAgICAgb25Eb25lKClcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgdHJhbnNpdGlvblJlbW92ZXMoZWxlbWVudHMpe1xuICAgIGxldCByZW1vdmVBdHRyID0gdGhpcy5iaW5kaW5nKFwicmVtb3ZlXCIpXG4gICAgZWxlbWVudHMgPSBlbGVtZW50cyB8fCBET00uYWxsKGRvY3VtZW50LCBgWyR7cmVtb3ZlQXR0cn1dYClcbiAgICBlbGVtZW50cy5mb3JFYWNoKGVsID0+IHtcbiAgICAgIGlmKGRvY3VtZW50LmJvZHkuY29udGFpbnMoZWwpKXsgLy8gc2tpcCBjaGlsZHJlbiBhbHJlYWR5IHJlbW92ZWRcbiAgICAgICAgdGhpcy5leGVjSlMoZWwsIGVsLmdldEF0dHJpYnV0ZShyZW1vdmVBdHRyKSwgXCJyZW1vdmVcIilcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgaXNQaHhWaWV3KGVsKXsgcmV0dXJuIGVsLmdldEF0dHJpYnV0ZSAmJiBlbC5nZXRBdHRyaWJ1dGUoUEhYX1NFU1NJT04pICE9PSBudWxsIH1cblxuICBuZXdSb290VmlldyhlbCwgZmxhc2gpe1xuICAgIGxldCB2aWV3ID0gbmV3IFZpZXcoZWwsIHRoaXMsIG51bGwsIGZsYXNoKVxuICAgIHRoaXMucm9vdHNbdmlldy5pZF0gPSB2aWV3XG4gICAgcmV0dXJuIHZpZXdcbiAgfVxuXG4gIG93bmVyKGNoaWxkRWwsIGNhbGxiYWNrKXtcbiAgICBsZXQgdmlldyA9IG1heWJlKGNoaWxkRWwuY2xvc2VzdChQSFhfVklFV19TRUxFQ1RPUiksIGVsID0+IHRoaXMuZ2V0Vmlld0J5RWwoZWwpKSB8fCB0aGlzLm1haW5cbiAgICBpZih2aWV3KXsgY2FsbGJhY2sodmlldykgfVxuICB9XG5cbiAgd2l0aGluT3duZXJzKGNoaWxkRWwsIGNhbGxiYWNrKXtcbiAgICB0aGlzLm93bmVyKGNoaWxkRWwsIHZpZXcgPT4gY2FsbGJhY2sodmlldywgY2hpbGRFbCkpXG4gIH1cblxuICBnZXRWaWV3QnlFbChlbCl7XG4gICAgbGV0IHJvb3RJZCA9IGVsLmdldEF0dHJpYnV0ZShQSFhfUk9PVF9JRClcbiAgICByZXR1cm4gbWF5YmUodGhpcy5nZXRSb290QnlJZChyb290SWQpLCByb290ID0+IHJvb3QuZ2V0RGVzY2VuZGVudEJ5RWwoZWwpKVxuICB9XG5cbiAgZ2V0Um9vdEJ5SWQoaWQpeyByZXR1cm4gdGhpcy5yb290c1tpZF0gfVxuXG4gIGRlc3Ryb3lBbGxWaWV3cygpe1xuICAgIGZvcihsZXQgaWQgaW4gdGhpcy5yb290cyl7XG4gICAgICB0aGlzLnJvb3RzW2lkXS5kZXN0cm95KClcbiAgICAgIGRlbGV0ZSB0aGlzLnJvb3RzW2lkXVxuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3lWaWV3QnlFbChlbCl7XG4gICAgbGV0IHJvb3QgPSB0aGlzLmdldFJvb3RCeUlkKGVsLmdldEF0dHJpYnV0ZShQSFhfUk9PVF9JRCkpXG4gICAgaWYocm9vdCAmJiByb290LmlkID09PSBlbC5pZCl7XG4gICAgICByb290LmRlc3Ryb3koKVxuICAgICAgZGVsZXRlIHRoaXMucm9vdHNbcm9vdC5pZF1cbiAgICB9IGVsc2UgaWYocm9vdCl7XG4gICAgICByb290LmRlc3Ryb3lEZXNjZW5kZW50KGVsLmlkKVxuICAgIH1cbiAgfVxuXG4gIHNldEFjdGl2ZUVsZW1lbnQodGFyZ2V0KXtcbiAgICBpZih0aGlzLmFjdGl2ZUVsZW1lbnQgPT09IHRhcmdldCl7IHJldHVybiB9XG4gICAgdGhpcy5hY3RpdmVFbGVtZW50ID0gdGFyZ2V0XG4gICAgbGV0IGNhbmNlbCA9ICgpID0+IHtcbiAgICAgIGlmKHRhcmdldCA9PT0gdGhpcy5hY3RpdmVFbGVtZW50KXsgdGhpcy5hY3RpdmVFbGVtZW50ID0gbnVsbCB9XG4gICAgICB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcylcbiAgICAgIHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgdGhpcylcbiAgICB9XG4gICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIGNhbmNlbClcbiAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIGNhbmNlbClcbiAgfVxuXG4gIGdldEFjdGl2ZUVsZW1lbnQoKXtcbiAgICBpZihkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBkb2N1bWVudC5ib2R5KXtcbiAgICAgIHJldHVybiB0aGlzLmFjdGl2ZUVsZW1lbnQgfHwgZG9jdW1lbnQuYWN0aXZlRWxlbWVudFxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBkb2N1bWVudC5hY3RpdmVFbGVtZW50IGNhbiBiZSBudWxsIGluIEludGVybmV0IEV4cGxvcmVyIDExXG4gICAgICByZXR1cm4gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCB8fCBkb2N1bWVudC5ib2R5XG4gICAgfVxuICB9XG5cbiAgZHJvcEFjdGl2ZUVsZW1lbnQodmlldyl7XG4gICAgaWYodGhpcy5wcmV2QWN0aXZlICYmIHZpZXcub3duc0VsZW1lbnQodGhpcy5wcmV2QWN0aXZlKSl7XG4gICAgICB0aGlzLnByZXZBY3RpdmUgPSBudWxsXG4gICAgfVxuICB9XG5cbiAgcmVzdG9yZVByZXZpb3VzbHlBY3RpdmVGb2N1cygpe1xuICAgIGlmKHRoaXMucHJldkFjdGl2ZSAmJiB0aGlzLnByZXZBY3RpdmUgIT09IGRvY3VtZW50LmJvZHkpe1xuICAgICAgdGhpcy5wcmV2QWN0aXZlLmZvY3VzKClcbiAgICB9XG4gIH1cblxuICBibHVyQWN0aXZlRWxlbWVudCgpe1xuICAgIHRoaXMucHJldkFjdGl2ZSA9IHRoaXMuZ2V0QWN0aXZlRWxlbWVudCgpXG4gICAgaWYodGhpcy5wcmV2QWN0aXZlICE9PSBkb2N1bWVudC5ib2R5KXsgdGhpcy5wcmV2QWN0aXZlLmJsdXIoKSB9XG4gIH1cblxuICBiaW5kVG9wTGV2ZWxFdmVudHMoKXtcbiAgICBpZih0aGlzLmJvdW5kVG9wTGV2ZWxFdmVudHMpeyByZXR1cm4gfVxuXG4gICAgdGhpcy5ib3VuZFRvcExldmVsRXZlbnRzID0gdHJ1ZVxuICAgIC8vIGVudGVyIGZhaWxzYWZlIHJlbG9hZCBpZiBzZXJ2ZXIgaGFzIGdvbmUgYXdheSBpbnRlbnRpb25hbGx5LCBzdWNoIGFzIFwiZGlzY29ubmVjdFwiIGJyb2FkY2FzdFxuICAgIHRoaXMuc29ja2V0Lm9uQ2xvc2UoZXZlbnQgPT4ge1xuICAgICAgaWYoZXZlbnQgJiYgZXZlbnQuY29kZSA9PT0gMTAwMCAmJiB0aGlzLm1haW4pe1xuICAgICAgICB0aGlzLnJlbG9hZFdpdGhKaXR0ZXIodGhpcy5tYWluKVxuICAgICAgfVxuICAgIH0pXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCl7IH0pIC8vIGVuc3VyZSBhbGwgY2xpY2sgZXZlbnRzIGJ1YmJsZSBmb3IgbW9iaWxlIFNhZmFyaVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGFnZXNob3dcIiwgZSA9PiB7XG4gICAgICBpZihlLnBlcnNpc3RlZCl7IC8vIHJlbG9hZCBwYWdlIGlmIGJlaW5nIHJlc3RvcmVkIGZyb20gYmFjay9mb3J3YXJkIGNhY2hlXG4gICAgICAgIHRoaXMuZ2V0U29ja2V0KCkuZGlzY29ubmVjdCgpXG4gICAgICAgIHRoaXMud2l0aFBhZ2VMb2FkaW5nKHt0bzogd2luZG93LmxvY2F0aW9uLmhyZWYsIGtpbmQ6IFwicmVkaXJlY3RcIn0pXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKVxuICAgICAgfVxuICAgIH0sIHRydWUpXG4gICAgdGhpcy5iaW5kTmF2KClcbiAgICB0aGlzLmJpbmRDbGlja3MoKVxuICAgIHRoaXMuYmluZEZvcm1zKClcbiAgICB0aGlzLmJpbmQoe2tleXVwOiBcImtleXVwXCIsIGtleWRvd246IFwia2V5ZG93blwifSwgKGUsIHR5cGUsIHZpZXcsIHRhcmdldEVsLCBwaHhFdmVudCwgZXZlbnRUYXJnZXQpID0+IHtcbiAgICAgIGxldCBtYXRjaEtleSA9IHRhcmdldEVsLmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX0tFWSkpXG4gICAgICBsZXQgcHJlc3NlZEtleSA9IGUua2V5ICYmIGUua2V5LnRvTG93ZXJDYXNlKCkgLy8gY2hyb21lIGNsaWNrZWQgYXV0b2NvbXBsZXRlcyBzZW5kIGEga2V5ZG93biB3aXRob3V0IGtleVxuICAgICAgaWYobWF0Y2hLZXkgJiYgbWF0Y2hLZXkudG9Mb3dlckNhc2UoKSAhPT0gcHJlc3NlZEtleSl7IHJldHVybiB9XG5cbiAgICAgIGxldCBkYXRhID0ge2tleTogZS5rZXksIC4uLnRoaXMuZXZlbnRNZXRhKHR5cGUsIGUsIHRhcmdldEVsKX1cbiAgICAgIEpTLmV4ZWModHlwZSwgcGh4RXZlbnQsIHZpZXcsIHRhcmdldEVsLCBbXCJwdXNoXCIsIHtkYXRhfV0pXG4gICAgfSlcbiAgICB0aGlzLmJpbmQoe2JsdXI6IFwiZm9jdXNvdXRcIiwgZm9jdXM6IFwiZm9jdXNpblwifSwgKGUsIHR5cGUsIHZpZXcsIHRhcmdldEVsLCBwaHhFdmVudCwgZXZlbnRUYXJnZXQpID0+IHtcbiAgICAgIGlmKCFldmVudFRhcmdldCl7XG4gICAgICAgIGxldCBkYXRhID0ge2tleTogZS5rZXksIC4uLnRoaXMuZXZlbnRNZXRhKHR5cGUsIGUsIHRhcmdldEVsKX1cbiAgICAgICAgSlMuZXhlYyh0eXBlLCBwaHhFdmVudCwgdmlldywgdGFyZ2V0RWwsIFtcInB1c2hcIiwge2RhdGF9XSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHRoaXMuYmluZCh7Ymx1cjogXCJibHVyXCIsIGZvY3VzOiBcImZvY3VzXCJ9LCAoZSwgdHlwZSwgdmlldywgdGFyZ2V0RWwsIHRhcmdldEN0eCwgcGh4RXZlbnQsIHBoeFRhcmdldCkgPT4ge1xuICAgICAgLy8gYmx1ciBhbmQgZm9jdXMgYXJlIHRyaWdnZXJlZCBvbiBkb2N1bWVudCBhbmQgd2luZG93LiBEaXNjYXJkIG9uZSB0byBhdm9pZCBkdXBzXG4gICAgICBpZihwaHhUYXJnZXQgPT09IFwid2luZG93XCIpe1xuICAgICAgICBsZXQgZGF0YSA9IHRoaXMuZXZlbnRNZXRhKHR5cGUsIGUsIHRhcmdldEVsKVxuICAgICAgICBKUy5leGVjKHR5cGUsIHBoeEV2ZW50LCB2aWV3LCB0YXJnZXRFbCwgW1wicHVzaFwiLCB7ZGF0YX1dKVxuICAgICAgfVxuICAgIH0pXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCBlID0+IGUucHJldmVudERlZmF1bHQoKSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgZSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIGxldCBkcm9wVGFyZ2V0SWQgPSBtYXliZShjbG9zZXN0UGh4QmluZGluZyhlLnRhcmdldCwgdGhpcy5iaW5kaW5nKFBIWF9EUk9QX1RBUkdFVCkpLCB0cnVlVGFyZ2V0ID0+IHtcbiAgICAgICAgcmV0dXJuIHRydWVUYXJnZXQuZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhQSFhfRFJPUF9UQVJHRVQpKVxuICAgICAgfSlcbiAgICAgIGxldCBkcm9wVGFyZ2V0ID0gZHJvcFRhcmdldElkICYmIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRyb3BUYXJnZXRJZClcbiAgICAgIGxldCBmaWxlcyA9IEFycmF5LmZyb20oZS5kYXRhVHJhbnNmZXIuZmlsZXMgfHwgW10pXG4gICAgICBpZighZHJvcFRhcmdldCB8fCBkcm9wVGFyZ2V0LmRpc2FibGVkIHx8IGZpbGVzLmxlbmd0aCA9PT0gMCB8fCAhKGRyb3BUYXJnZXQuZmlsZXMgaW5zdGFuY2VvZiBGaWxlTGlzdCkpeyByZXR1cm4gfVxuXG4gICAgICBMaXZlVXBsb2FkZXIudHJhY2tGaWxlcyhkcm9wVGFyZ2V0LCBmaWxlcylcbiAgICAgIGRyb3BUYXJnZXQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJpbnB1dFwiLCB7YnViYmxlczogdHJ1ZX0pKVxuICAgIH0pXG4gICAgdGhpcy5vbihQSFhfVFJBQ0tfVVBMT0FEUywgZSA9PiB7XG4gICAgICBsZXQgdXBsb2FkVGFyZ2V0ID0gZS50YXJnZXRcbiAgICAgIGlmKCFET00uaXNVcGxvYWRJbnB1dCh1cGxvYWRUYXJnZXQpKXsgcmV0dXJuIH1cbiAgICAgIGxldCBmaWxlcyA9IEFycmF5LmZyb20oZS5kZXRhaWwuZmlsZXMgfHwgW10pLmZpbHRlcihmID0+IGYgaW5zdGFuY2VvZiBGaWxlIHx8IGYgaW5zdGFuY2VvZiBCbG9iKVxuICAgICAgTGl2ZVVwbG9hZGVyLnRyYWNrRmlsZXModXBsb2FkVGFyZ2V0LCBmaWxlcylcbiAgICAgIHVwbG9hZFRhcmdldC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcImlucHV0XCIsIHtidWJibGVzOiB0cnVlfSkpXG4gICAgfSlcbiAgfVxuXG4gIGV2ZW50TWV0YShldmVudE5hbWUsIGUsIHRhcmdldEVsKXtcbiAgICBsZXQgY2FsbGJhY2sgPSB0aGlzLm1ldGFkYXRhQ2FsbGJhY2tzW2V2ZW50TmFtZV1cbiAgICByZXR1cm4gY2FsbGJhY2sgPyBjYWxsYmFjayhlLCB0YXJnZXRFbCkgOiB7fVxuICB9XG5cbiAgc2V0UGVuZGluZ0xpbmsoaHJlZil7XG4gICAgdGhpcy5saW5rUmVmKytcbiAgICB0aGlzLnBlbmRpbmdMaW5rID0gaHJlZlxuICAgIHJldHVybiB0aGlzLmxpbmtSZWZcbiAgfVxuXG4gIGNvbW1pdFBlbmRpbmdMaW5rKGxpbmtSZWYpe1xuICAgIGlmKHRoaXMubGlua1JlZiAhPT0gbGlua1JlZil7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ocmVmID0gdGhpcy5wZW5kaW5nTGlua1xuICAgICAgdGhpcy5wZW5kaW5nTGluayA9IG51bGxcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG5cbiAgZ2V0SHJlZigpeyByZXR1cm4gdGhpcy5ocmVmIH1cblxuICBoYXNQZW5kaW5nTGluaygpeyByZXR1cm4gISF0aGlzLnBlbmRpbmdMaW5rIH1cblxuICBiaW5kKGV2ZW50cywgY2FsbGJhY2spe1xuICAgIGZvcihsZXQgZXZlbnQgaW4gZXZlbnRzKXtcbiAgICAgIGxldCBicm93c2VyRXZlbnROYW1lID0gZXZlbnRzW2V2ZW50XVxuXG4gICAgICB0aGlzLm9uKGJyb3dzZXJFdmVudE5hbWUsIGUgPT4ge1xuICAgICAgICBsZXQgYmluZGluZyA9IHRoaXMuYmluZGluZyhldmVudClcbiAgICAgICAgbGV0IHdpbmRvd0JpbmRpbmcgPSB0aGlzLmJpbmRpbmcoYHdpbmRvdy0ke2V2ZW50fWApXG4gICAgICAgIGxldCB0YXJnZXRQaHhFdmVudCA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSAmJiBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoYmluZGluZylcbiAgICAgICAgaWYodGFyZ2V0UGh4RXZlbnQpe1xuICAgICAgICAgIHRoaXMuZGVib3VuY2UoZS50YXJnZXQsIGUsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMud2l0aGluT3duZXJzKGUudGFyZ2V0LCB2aWV3ID0+IHtcbiAgICAgICAgICAgICAgY2FsbGJhY2soZSwgZXZlbnQsIHZpZXcsIGUudGFyZ2V0LCB0YXJnZXRQaHhFdmVudCwgbnVsbClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBET00uYWxsKGRvY3VtZW50LCBgWyR7d2luZG93QmluZGluZ31dYCwgZWwgPT4ge1xuICAgICAgICAgICAgbGV0IHBoeEV2ZW50ID0gZWwuZ2V0QXR0cmlidXRlKHdpbmRvd0JpbmRpbmcpXG4gICAgICAgICAgICB0aGlzLmRlYm91bmNlKGVsLCBlLCAoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMud2l0aGluT3duZXJzKGVsLCB2aWV3ID0+IHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlLCBldmVudCwgdmlldywgZWwsIHBoeEV2ZW50LCBcIndpbmRvd1wiKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGJpbmRDbGlja3MoKXtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBlID0+IHRoaXMuY2xpY2tTdGFydGVkQXRUYXJnZXQgPSBlLnRhcmdldClcbiAgICB0aGlzLmJpbmRDbGljayhcImNsaWNrXCIsIFwiY2xpY2tcIiwgZmFsc2UpXG4gICAgdGhpcy5iaW5kQ2xpY2soXCJtb3VzZWRvd25cIiwgXCJjYXB0dXJlLWNsaWNrXCIsIHRydWUpXG4gIH1cblxuICBiaW5kQ2xpY2soZXZlbnROYW1lLCBiaW5kaW5nTmFtZSwgY2FwdHVyZSl7XG4gICAgbGV0IGNsaWNrID0gdGhpcy5iaW5kaW5nKGJpbmRpbmdOYW1lKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZSA9PiB7XG4gICAgICBsZXQgdGFyZ2V0ID0gbnVsbFxuICAgICAgaWYoY2FwdHVyZSl7XG4gICAgICAgIHRhcmdldCA9IGUudGFyZ2V0Lm1hdGNoZXMoYFske2NsaWNrfV1gKSA/IGUudGFyZ2V0IDogZS50YXJnZXQucXVlcnlTZWxlY3RvcihgWyR7Y2xpY2t9XWApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgY2xpY2tTdGFydGVkQXRUYXJnZXQgPSB0aGlzLmNsaWNrU3RhcnRlZEF0VGFyZ2V0IHx8IGUudGFyZ2V0XG4gICAgICAgIHRhcmdldCA9IGNsb3Nlc3RQaHhCaW5kaW5nKGNsaWNrU3RhcnRlZEF0VGFyZ2V0LCBjbGljaylcbiAgICAgICAgdGhpcy5kaXNwYXRjaENsaWNrQXdheShlLCBjbGlja1N0YXJ0ZWRBdFRhcmdldClcbiAgICAgICAgdGhpcy5jbGlja1N0YXJ0ZWRBdFRhcmdldCA9IG51bGxcbiAgICAgIH1cbiAgICAgIGxldCBwaHhFdmVudCA9IHRhcmdldCAmJiB0YXJnZXQuZ2V0QXR0cmlidXRlKGNsaWNrKVxuICAgICAgaWYoIXBoeEV2ZW50KXsgcmV0dXJuIH1cbiAgICAgIGlmKHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpID09PSBcIiNcIil7IGUucHJldmVudERlZmF1bHQoKSB9XG5cbiAgICAgIHRoaXMuZGVib3VuY2UodGFyZ2V0LCBlLCAoKSA9PiB7XG4gICAgICAgIHRoaXMud2l0aGluT3duZXJzKHRhcmdldCwgdmlldyA9PiB7XG4gICAgICAgICAgSlMuZXhlYyhcImNsaWNrXCIsIHBoeEV2ZW50LCB2aWV3LCB0YXJnZXQsIFtcInB1c2hcIiwge2RhdGE6IHRoaXMuZXZlbnRNZXRhKFwiY2xpY2tcIiwgZSwgdGFyZ2V0KX1dKVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9LCBjYXB0dXJlKVxuICB9XG5cbiAgZGlzcGF0Y2hDbGlja0F3YXkoZSwgY2xpY2tTdGFydGVkQXQpe1xuICAgIGxldCBwaHhDbGlja0F3YXkgPSB0aGlzLmJpbmRpbmcoXCJjbGljay1hd2F5XCIpXG4gICAgRE9NLmFsbChkb2N1bWVudCwgYFske3BoeENsaWNrQXdheX1dYCwgZWwgPT4ge1xuICAgICAgaWYoIShlbC5pc1NhbWVOb2RlKGNsaWNrU3RhcnRlZEF0KSB8fCBlbC5jb250YWlucyhjbGlja1N0YXJ0ZWRBdCkpKXtcbiAgICAgICAgdGhpcy53aXRoaW5Pd25lcnMoZS50YXJnZXQsIHZpZXcgPT4ge1xuICAgICAgICAgIGxldCBwaHhFdmVudCA9IGVsLmdldEF0dHJpYnV0ZShwaHhDbGlja0F3YXkpXG4gICAgICAgICAgaWYoSlMuaXNWaXNpYmxlKGVsKSl7XG4gICAgICAgICAgICBKUy5leGVjKFwiY2xpY2tcIiwgcGh4RXZlbnQsIHZpZXcsIGVsLCBbXCJwdXNoXCIsIHtkYXRhOiB0aGlzLmV2ZW50TWV0YShcImNsaWNrXCIsIGUsIGUudGFyZ2V0KX1dKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgYmluZE5hdigpe1xuICAgIGlmKCFCcm93c2VyLmNhblB1c2hTdGF0ZSgpKXsgcmV0dXJuIH1cbiAgICBpZihoaXN0b3J5LnNjcm9sbFJlc3RvcmF0aW9uKXsgaGlzdG9yeS5zY3JvbGxSZXN0b3JhdGlvbiA9IFwibWFudWFsXCIgfVxuICAgIGxldCBzY3JvbGxUaW1lciA9IG51bGxcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCBfZSA9PiB7XG4gICAgICBjbGVhclRpbWVvdXQoc2Nyb2xsVGltZXIpXG4gICAgICBzY3JvbGxUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBCcm93c2VyLnVwZGF0ZUN1cnJlbnRTdGF0ZShzdGF0ZSA9PiBPYmplY3QuYXNzaWduKHN0YXRlLCB7c2Nyb2xsOiB3aW5kb3cuc2Nyb2xsWX0pKVxuICAgICAgfSwgMTAwKVxuICAgIH0pXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwb3BzdGF0ZVwiLCBldmVudCA9PiB7XG4gICAgICBpZighdGhpcy5yZWdpc3Rlck5ld0xvY2F0aW9uKHdpbmRvdy5sb2NhdGlvbikpeyByZXR1cm4gfVxuICAgICAgbGV0IHt0eXBlLCBpZCwgcm9vdCwgc2Nyb2xsfSA9IGV2ZW50LnN0YXRlIHx8IHt9XG4gICAgICBsZXQgaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG5cbiAgICAgIHRoaXMucmVxdWVzdERPTVVwZGF0ZSgoKSA9PiB7XG4gICAgICAgIGlmKHRoaXMubWFpbi5pc0Nvbm5lY3RlZCgpICYmICh0eXBlID09PSBcInBhdGNoXCIgJiYgaWQgPT09IHRoaXMubWFpbi5pZCkpe1xuICAgICAgICAgIHRoaXMubWFpbi5wdXNoTGlua1BhdGNoKGhyZWYsIG51bGwpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5yZXBsYWNlTWFpbihocmVmLCBudWxsLCAoKSA9PiB7XG4gICAgICAgICAgICBpZihyb290KXsgdGhpcy5yZXBsYWNlUm9vdEhpc3RvcnkoKSB9XG4gICAgICAgICAgICBpZih0eXBlb2Yoc2Nyb2xsKSA9PT0gXCJudW1iZXJcIil7XG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCBzY3JvbGwpXG4gICAgICAgICAgICAgIH0sIDApIC8vIHRoZSBib2R5IG5lZWRzIHRvIHJlbmRlciBiZWZvcmUgd2Ugc2Nyb2xsLlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSwgZmFsc2UpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcbiAgICAgIGxldCB0YXJnZXQgPSBjbG9zZXN0UGh4QmluZGluZyhlLnRhcmdldCwgUEhYX0xJVkVfTElOSylcbiAgICAgIGxldCB0eXBlID0gdGFyZ2V0ICYmIHRhcmdldC5nZXRBdHRyaWJ1dGUoUEhYX0xJVkVfTElOSylcbiAgICAgIGxldCB3YW50c05ld1RhYiA9IGUubWV0YUtleSB8fCBlLmN0cmxLZXkgfHwgZS5idXR0b24gPT09IDFcbiAgICAgIGlmKCF0eXBlIHx8ICF0aGlzLmlzQ29ubmVjdGVkKCkgfHwgIXRoaXMubWFpbiB8fCB3YW50c05ld1RhYil7IHJldHVybiB9XG5cbiAgICAgIGxldCBocmVmID0gdGFyZ2V0LmhyZWZcbiAgICAgIGxldCBsaW5rU3RhdGUgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKFBIWF9MSU5LX1NUQVRFKVxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpIC8vIGRvIG5vdCBidWJibGUgY2xpY2sgdG8gcmVndWxhciBwaHgtY2xpY2sgYmluZGluZ3NcbiAgICAgIGlmKHRoaXMucGVuZGluZ0xpbmsgPT09IGhyZWYpeyByZXR1cm4gfVxuXG4gICAgICB0aGlzLnJlcXVlc3RET01VcGRhdGUoKCkgPT4ge1xuICAgICAgICBpZih0eXBlID09PSBcInBhdGNoXCIpe1xuICAgICAgICAgIHRoaXMucHVzaEhpc3RvcnlQYXRjaChocmVmLCBsaW5rU3RhdGUsIHRhcmdldClcbiAgICAgICAgfSBlbHNlIGlmKHR5cGUgPT09IFwicmVkaXJlY3RcIil7XG4gICAgICAgICAgdGhpcy5oaXN0b3J5UmVkaXJlY3QoaHJlZiwgbGlua1N0YXRlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgZXhwZWN0ZWQgJHtQSFhfTElWRV9MSU5LfSB0byBiZSBcInBhdGNoXCIgb3IgXCJyZWRpcmVjdFwiLCBnb3Q6ICR7dHlwZX1gKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0sIGZhbHNlKVxuICB9XG5cbiAgZGlzcGF0Y2hFdmVudChldmVudCwgcGF5bG9hZCA9IHt9KXtcbiAgICBET00uZGlzcGF0Y2hFdmVudCh3aW5kb3csIGBwaHg6JHtldmVudH1gLCB7ZGV0YWlsOiBwYXlsb2FkfSlcbiAgfVxuXG4gIGRpc3BhdGNoRXZlbnRzKGV2ZW50cyl7XG4gICAgZXZlbnRzLmZvckVhY2goKFtldmVudCwgcGF5bG9hZF0pID0+IHRoaXMuZGlzcGF0Y2hFdmVudChldmVudCwgcGF5bG9hZCkpXG4gIH1cblxuICB3aXRoUGFnZUxvYWRpbmcoaW5mbywgY2FsbGJhY2spe1xuICAgIERPTS5kaXNwYXRjaEV2ZW50KHdpbmRvdywgXCJwaHg6cGFnZS1sb2FkaW5nLXN0YXJ0XCIsIHtkZXRhaWw6IGluZm99KVxuICAgIGxldCBkb25lID0gKCkgPT4gRE9NLmRpc3BhdGNoRXZlbnQod2luZG93LCBcInBoeDpwYWdlLWxvYWRpbmctc3RvcFwiLCB7ZGV0YWlsOiBpbmZvfSlcbiAgICByZXR1cm4gY2FsbGJhY2sgPyBjYWxsYmFjayhkb25lKSA6IGRvbmVcbiAgfVxuXG4gIHB1c2hIaXN0b3J5UGF0Y2goaHJlZiwgbGlua1N0YXRlLCB0YXJnZXRFbCl7XG4gICAgdGhpcy53aXRoUGFnZUxvYWRpbmcoe3RvOiBocmVmLCBraW5kOiBcInBhdGNoXCJ9LCBkb25lID0+IHtcbiAgICAgIHRoaXMubWFpbi5wdXNoTGlua1BhdGNoKGhyZWYsIHRhcmdldEVsLCBsaW5rUmVmID0+IHtcbiAgICAgICAgdGhpcy5oaXN0b3J5UGF0Y2goaHJlZiwgbGlua1N0YXRlLCBsaW5rUmVmKVxuICAgICAgICBkb25lKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGhpc3RvcnlQYXRjaChocmVmLCBsaW5rU3RhdGUsIGxpbmtSZWYgPSB0aGlzLnNldFBlbmRpbmdMaW5rKGhyZWYpKXtcbiAgICBpZighdGhpcy5jb21taXRQZW5kaW5nTGluayhsaW5rUmVmKSl7IHJldHVybiB9XG5cbiAgICBCcm93c2VyLnB1c2hTdGF0ZShsaW5rU3RhdGUsIHt0eXBlOiBcInBhdGNoXCIsIGlkOiB0aGlzLm1haW4uaWR9LCBocmVmKVxuICAgIHRoaXMucmVnaXN0ZXJOZXdMb2NhdGlvbih3aW5kb3cubG9jYXRpb24pXG4gIH1cblxuICBoaXN0b3J5UmVkaXJlY3QoaHJlZiwgbGlua1N0YXRlLCBmbGFzaCl7XG4gICAgbGV0IHNjcm9sbCA9IHdpbmRvdy5zY3JvbGxZXG4gICAgdGhpcy53aXRoUGFnZUxvYWRpbmcoe3RvOiBocmVmLCBraW5kOiBcInJlZGlyZWN0XCJ9LCBkb25lID0+IHtcbiAgICAgIHRoaXMucmVwbGFjZU1haW4oaHJlZiwgZmxhc2gsICgpID0+IHtcbiAgICAgICAgQnJvd3Nlci5wdXNoU3RhdGUobGlua1N0YXRlLCB7dHlwZTogXCJyZWRpcmVjdFwiLCBpZDogdGhpcy5tYWluLmlkLCBzY3JvbGw6IHNjcm9sbH0sIGhyZWYpXG4gICAgICAgIHRoaXMucmVnaXN0ZXJOZXdMb2NhdGlvbih3aW5kb3cubG9jYXRpb24pXG4gICAgICAgIGRvbmUoKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgcmVwbGFjZVJvb3RIaXN0b3J5KCl7XG4gICAgQnJvd3Nlci5wdXNoU3RhdGUoXCJyZXBsYWNlXCIsIHtyb290OiB0cnVlLCB0eXBlOiBcInBhdGNoXCIsIGlkOiB0aGlzLm1haW4uaWR9KVxuICB9XG5cbiAgcmVnaXN0ZXJOZXdMb2NhdGlvbihuZXdMb2NhdGlvbil7XG4gICAgbGV0IHtwYXRobmFtZSwgc2VhcmNofSA9IHRoaXMuY3VycmVudExvY2F0aW9uXG4gICAgaWYocGF0aG5hbWUgKyBzZWFyY2ggPT09IG5ld0xvY2F0aW9uLnBhdGhuYW1lICsgbmV3TG9jYXRpb24uc2VhcmNoKXtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN1cnJlbnRMb2NhdGlvbiA9IGNsb25lKG5ld0xvY2F0aW9uKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICBiaW5kRm9ybXMoKXtcbiAgICBsZXQgaXRlcmF0aW9ucyA9IDBcbiAgICB0aGlzLm9uKFwic3VibWl0XCIsIGUgPT4ge1xuICAgICAgbGV0IHBoeEV2ZW50ID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhcInN1Ym1pdFwiKSlcbiAgICAgIGlmKCFwaHhFdmVudCl7IHJldHVybiB9XG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIGUudGFyZ2V0LmRpc2FibGVkID0gdHJ1ZVxuICAgICAgdGhpcy53aXRoaW5Pd25lcnMoZS50YXJnZXQsIHZpZXcgPT4ge1xuICAgICAgICBKUy5leGVjKFwic3VibWl0XCIsIHBoeEV2ZW50LCB2aWV3LCBlLnRhcmdldCwgW1wicHVzaFwiLCB7fV0pXG4gICAgICB9KVxuICAgIH0sIGZhbHNlKVxuXG4gICAgZm9yKGxldCB0eXBlIG9mIFtcImNoYW5nZVwiLCBcImlucHV0XCJdKXtcbiAgICAgIHRoaXMub24odHlwZSwgZSA9PiB7XG4gICAgICAgIGxldCBwaHhDaGFuZ2UgPSB0aGlzLmJpbmRpbmcoXCJjaGFuZ2VcIilcbiAgICAgICAgbGV0IGlucHV0ID0gZS50YXJnZXRcbiAgICAgICAgbGV0IGlucHV0RXZlbnQgPSBpbnB1dC5nZXRBdHRyaWJ1dGUocGh4Q2hhbmdlKVxuICAgICAgICBsZXQgZm9ybUV2ZW50ID0gaW5wdXQuZm9ybSAmJiBpbnB1dC5mb3JtLmdldEF0dHJpYnV0ZShwaHhDaGFuZ2UpXG4gICAgICAgIGxldCBwaHhFdmVudCA9IGlucHV0RXZlbnQgfHwgZm9ybUV2ZW50XG4gICAgICAgIGlmKCFwaHhFdmVudCl7IHJldHVybiB9XG4gICAgICAgIGlmKGlucHV0LnR5cGUgPT09IFwibnVtYmVyXCIgJiYgaW5wdXQudmFsaWRpdHkgJiYgaW5wdXQudmFsaWRpdHkuYmFkSW5wdXQpeyByZXR1cm4gfVxuXG4gICAgICAgIGxldCBkaXNwYXRjaGVyID0gaW5wdXRFdmVudCA/IGlucHV0IDogaW5wdXQuZm9ybVxuICAgICAgICBsZXQgY3VycmVudEl0ZXJhdGlvbnMgPSBpdGVyYXRpb25zXG4gICAgICAgIGl0ZXJhdGlvbnMrK1xuICAgICAgICBsZXQge2F0OiBhdCwgdHlwZTogbGFzdFR5cGV9ID0gRE9NLnByaXZhdGUoaW5wdXQsIFwicHJldi1pdGVyYXRpb25cIikgfHwge31cbiAgICAgICAgLy8gZGV0ZWN0IGR1cCBiZWNhdXNlIHNvbWUgYnJvd3NlcnMgZGlzcGF0Y2ggYm90aCBcImlucHV0XCIgYW5kIFwiY2hhbmdlXCJcbiAgICAgICAgaWYoYXQgPT09IGN1cnJlbnRJdGVyYXRpb25zIC0gMSAmJiB0eXBlICE9PSBsYXN0VHlwZSl7IHJldHVybiB9XG5cbiAgICAgICAgRE9NLnB1dFByaXZhdGUoaW5wdXQsIFwicHJldi1pdGVyYXRpb25cIiwge2F0OiBjdXJyZW50SXRlcmF0aW9ucywgdHlwZTogdHlwZX0pXG5cbiAgICAgICAgdGhpcy5kZWJvdW5jZShpbnB1dCwgZSwgKCkgPT4ge1xuICAgICAgICAgIHRoaXMud2l0aGluT3duZXJzKGRpc3BhdGNoZXIsIHZpZXcgPT4ge1xuICAgICAgICAgICAgRE9NLnB1dFByaXZhdGUoaW5wdXQsIFBIWF9IQVNfRk9DVVNFRCwgdHJ1ZSlcbiAgICAgICAgICAgIGlmKCFET00uaXNUZXh0dWFsSW5wdXQoaW5wdXQpKXtcbiAgICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmVFbGVtZW50KGlucHV0KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgSlMuZXhlYyhcImNoYW5nZVwiLCBwaHhFdmVudCwgdmlldywgaW5wdXQsIFtcInB1c2hcIiwge190YXJnZXQ6IGUudGFyZ2V0Lm5hbWUsIGRpc3BhdGNoZXI6IGRpc3BhdGNoZXJ9XSlcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfSwgZmFsc2UpXG4gICAgfVxuICB9XG5cbiAgZGVib3VuY2UoZWwsIGV2ZW50LCBjYWxsYmFjayl7XG4gICAgbGV0IHBoeERlYm91bmNlID0gdGhpcy5iaW5kaW5nKFBIWF9ERUJPVU5DRSlcbiAgICBsZXQgcGh4VGhyb3R0bGUgPSB0aGlzLmJpbmRpbmcoUEhYX1RIUk9UVExFKVxuICAgIGxldCBkZWZhdWx0RGVib3VuY2UgPSB0aGlzLmRlZmF1bHRzLmRlYm91bmNlLnRvU3RyaW5nKClcbiAgICBsZXQgZGVmYXVsdFRocm90dGxlID0gdGhpcy5kZWZhdWx0cy50aHJvdHRsZS50b1N0cmluZygpXG4gICAgRE9NLmRlYm91bmNlKGVsLCBldmVudCwgcGh4RGVib3VuY2UsIGRlZmF1bHREZWJvdW5jZSwgcGh4VGhyb3R0bGUsIGRlZmF1bHRUaHJvdHRsZSwgY2FsbGJhY2spXG4gIH1cblxuICBzaWxlbmNlRXZlbnRzKGNhbGxiYWNrKXtcbiAgICB0aGlzLnNpbGVuY2VkID0gdHJ1ZVxuICAgIGNhbGxiYWNrKClcbiAgICB0aGlzLnNpbGVuY2VkID0gZmFsc2VcbiAgfVxuXG4gIG9uKGV2ZW50LCBjYWxsYmFjayl7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGUgPT4ge1xuICAgICAgaWYoIXRoaXMuc2lsZW5jZWQpeyBjYWxsYmFjayhlKSB9XG4gICAgfSlcbiAgfVxufVxuXG5jbGFzcyBUcmFuc2l0aW9uU2V0IHtcbiAgY29uc3RydWN0b3IoKXtcbiAgICB0aGlzLnRyYW5zaXRpb25zID0gbmV3IFNldCgpXG4gICAgdGhpcy5wZW5kaW5nT3BzID0gW11cbiAgICB0aGlzLnJlc2V0KClcbiAgfVxuXG4gIHJlc2V0KCl7XG4gICAgdGhpcy50cmFuc2l0aW9ucy5mb3JFYWNoKHRpbWVyID0+IHtcbiAgICAgIGNhbmNlbFRpbWVvdXQodGltZXIpXG4gICAgICB0aGlzLnRyYW5zaXRpb25zLmRlbGV0ZSh0aW1lcilcbiAgICB9KVxuICAgIHRoaXMuZmx1c2hQZW5kaW5nT3BzKClcbiAgfVxuXG4gIGFmdGVyKGNhbGxiYWNrKXtcbiAgICBpZih0aGlzLnNpemUoKSA9PT0gMCl7XG4gICAgICBjYWxsYmFjaygpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHVzaFBlbmRpbmdPcChjYWxsYmFjaylcbiAgICB9XG4gIH1cblxuICBhZGRUcmFuc2l0aW9uKHRpbWUsIG9uU3RhcnQsIG9uRG9uZSl7XG4gICAgb25TdGFydCgpXG4gICAgbGV0IHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnRyYW5zaXRpb25zLmRlbGV0ZSh0aW1lcilcbiAgICAgIG9uRG9uZSgpXG4gICAgICBpZih0aGlzLnNpemUoKSA9PT0gMCl7IHRoaXMuZmx1c2hQZW5kaW5nT3BzKCkgfVxuICAgIH0sIHRpbWUpXG4gICAgdGhpcy50cmFuc2l0aW9ucy5hZGQodGltZXIpXG4gIH1cblxuICBwdXNoUGVuZGluZ09wKG9wKXsgdGhpcy5wZW5kaW5nT3BzLnB1c2gob3ApIH1cblxuICBzaXplKCl7IHJldHVybiB0aGlzLnRyYW5zaXRpb25zLnNpemUgfVxuXG4gIGZsdXNoUGVuZGluZ09wcygpe1xuICAgIHRoaXMucGVuZGluZ09wcy5mb3JFYWNoKG9wID0+IG9wKCkpXG4gICAgdGhpcy5wZW5kaW5nT3BzID0gW11cbiAgfVxufVxuIiwgIi8vIFdlIGltcG9ydCB0aGUgQ1NTIHdoaWNoIGlzIGV4dHJhY3RlZCB0byBpdHMgb3duIGZpbGUgYnkgZXNidWlsZC5cbi8vIFJlbW92ZSB0aGlzIGxpbmUgaWYgeW91IGFkZCBhIHlvdXIgb3duIENTUyBidWlsZCBwaXBlbGluZSAoZS5nIHBvc3Rjc3MpLlxuaW1wb3J0IFwiLi4vY3NzL2FwcC5jc3NcIlxuXG4vLyBJZiB5b3Ugd2FudCB0byB1c2UgUGhvZW5peCBjaGFubmVscywgcnVuIGBtaXggaGVscCBwaHguZ2VuLmNoYW5uZWxgXG4vLyB0byBnZXQgc3RhcnRlZCBhbmQgdGhlbiB1bmNvbW1lbnQgdGhlIGxpbmUgYmVsb3cuXG4vLyBpbXBvcnQgXCIuL3VzZXJfc29ja2V0LmpzXCJcblxuLy8gWW91IGNhbiBpbmNsdWRlIGRlcGVuZGVuY2llcyBpbiB0d28gd2F5cy5cbi8vXG4vLyBUaGUgc2ltcGxlc3Qgb3B0aW9uIGlzIHRvIHB1dCB0aGVtIGluIGFzc2V0cy92ZW5kb3IgYW5kXG4vLyBpbXBvcnQgdGhlbSB1c2luZyByZWxhdGl2ZSBwYXRoczpcbi8vXG4vLyAgICAgaW1wb3J0IFwiLi4vdmVuZG9yL3NvbWUtcGFja2FnZS5qc1wiXG4vL1xuLy8gQWx0ZXJuYXRpdmVseSwgeW91IGNhbiBgbnBtIGluc3RhbGwgc29tZS1wYWNrYWdlIC0tcHJlZml4IGFzc2V0c2AgYW5kIGltcG9ydFxuLy8gdGhlbSB1c2luZyBhIHBhdGggc3RhcnRpbmcgd2l0aCB0aGUgcGFja2FnZSBuYW1lOlxuLy9cbi8vICAgICBpbXBvcnQgXCJzb21lLXBhY2thZ2VcIlxuLy9cblxuLy8gSW5jbHVkZSBwaG9lbml4X2h0bWwgdG8gaGFuZGxlIG1ldGhvZD1QVVQvREVMRVRFIGluIGZvcm1zIGFuZCBidXR0b25zLlxuaW1wb3J0IFwicGhvZW5peF9odG1sXCJcbi8vIEVzdGFibGlzaCBQaG9lbml4IFNvY2tldCBhbmQgTGl2ZVZpZXcgY29uZmlndXJhdGlvbi5cbmltcG9ydCB7U29ja2V0fSBmcm9tIFwicGhvZW5peFwiXG5pbXBvcnQge0xpdmVTb2NrZXR9IGZyb20gXCJwaG9lbml4X2xpdmVfdmlld1wiXG5pbXBvcnQgdG9wYmFyIGZyb20gXCIuLi92ZW5kb3IvdG9wYmFyXCJcblxubGV0IGNzcmZUb2tlbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJtZXRhW25hbWU9J2NzcmYtdG9rZW4nXVwiKS5nZXRBdHRyaWJ1dGUoXCJjb250ZW50XCIpXG5sZXQgbGl2ZVNvY2tldCA9IG5ldyBMaXZlU29ja2V0KFwiL2xpdmVcIiwgU29ja2V0LCB7cGFyYW1zOiB7X2NzcmZfdG9rZW46IGNzcmZUb2tlbn19KVxuXG4vLyBTaG93IHByb2dyZXNzIGJhciBvbiBsaXZlIG5hdmlnYXRpb24gYW5kIGZvcm0gc3VibWl0c1xudG9wYmFyLmNvbmZpZyh7YmFyQ29sb3JzOiB7MDogXCIjMjlkXCJ9LCBzaGFkb3dDb2xvcjogXCJyZ2JhKDAsIDAsIDAsIC4zKVwifSlcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGh4OnBhZ2UtbG9hZGluZy1zdGFydFwiLCBpbmZvID0+IHRvcGJhci5zaG93KCkpXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBoeDpwYWdlLWxvYWRpbmctc3RvcFwiLCBpbmZvID0+IHRvcGJhci5oaWRlKCkpXG5cbi8vIGNvbm5lY3QgaWYgdGhlcmUgYXJlIGFueSBMaXZlVmlld3Mgb24gdGhlIHBhZ2VcbmxpdmVTb2NrZXQuY29ubmVjdCgpXG5cbi8vIGV4cG9zZSBsaXZlU29ja2V0IG9uIHdpbmRvdyBmb3Igd2ViIGNvbnNvbGUgZGVidWcgbG9ncyBhbmQgbGF0ZW5jeSBzaW11bGF0aW9uOlxuLy8gPj4gbGl2ZVNvY2tldC5lbmFibGVEZWJ1ZygpXG4vLyA+PiBsaXZlU29ja2V0LmVuYWJsZUxhdGVuY3lTaW0oMTAwMCkgIC8vIGVuYWJsZWQgZm9yIGR1cmF0aW9uIG9mIGJyb3dzZXIgc2Vzc2lvblxuLy8gPj4gbGl2ZVNvY2tldC5kaXNhYmxlTGF0ZW5jeVNpbSgpXG53aW5kb3cubGl2ZVNvY2tldCA9IGxpdmVTb2NrZXRcblxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBTUEsTUFBQyxVQUFVLFNBQVEsV0FBVTtBQUMzQjtBQUdBLFFBQUMsWUFBWTtBQUNYLGNBQUksV0FBVztBQUNmLGNBQUksVUFBVSxDQUFDLE1BQU0sT0FBTyxVQUFVLEdBQUc7QUFDekMsbUJBQVMsSUFBSSxHQUFHLElBQUksUUFBUSxVQUFVLENBQUMsUUFBTyx1QkFBdUIsRUFBRSxHQUFHO0FBQ3hFLG9CQUFPLHdCQUNMLFFBQU8sUUFBUSxLQUFLO0FBQ3RCLG9CQUFPLHVCQUNMLFFBQU8sUUFBUSxLQUFLLDJCQUNwQixRQUFPLFFBQVEsS0FBSztBQUFBLFVBQ3hCO0FBQ0EsY0FBSSxDQUFDLFFBQU87QUFDVixvQkFBTyx3QkFBd0IsU0FBVSxVQUFVLFNBQVM7QUFDMUQsa0JBQUksV0FBVyxJQUFJLEtBQUssRUFBRSxRQUFRO0FBQ2xDLGtCQUFJLGFBQWEsS0FBSyxJQUFJLEdBQUcsS0FBTSxZQUFXLFNBQVM7QUFDdkQsa0JBQUksS0FBSyxRQUFPLFdBQVcsV0FBWTtBQUNyQyx5QkFBUyxXQUFXLFVBQVU7QUFBQSxjQUNoQyxHQUFHLFVBQVU7QUFDYix5QkFBVyxXQUFXO0FBQ3RCLHFCQUFPO0FBQUEsWUFDVDtBQUNGLGNBQUksQ0FBQyxRQUFPO0FBQ1Ysb0JBQU8sdUJBQXVCLFNBQVUsSUFBSTtBQUMxQywyQkFBYSxFQUFFO0FBQUEsWUFDakI7QUFBQSxRQUNKLEdBQUc7QUFFSCxZQUFJLFFBQ0YsaUJBQ0EsYUFDQSxpQkFDQSxTQUNB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

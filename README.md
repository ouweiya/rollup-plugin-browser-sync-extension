## Live Reload Feature for Rollup Plugin

Supports web page reloading and Chrome extension reloading.

## Install

```console
npm i rollup-plugin-browser-sync -D
```

## Usage

**`rollup.config.js`**

```js
import browserSync from 'rollup-plugin-browser-sync';

export default {
  ...
  plugins: [
    browserSync({
      options: {
        open: false,
        server: 'build',
        single: true,
        ui: false,
        ghostMode: false,
        notify: false,
      },
    }),
  ],
};
```

**Browsersync options**

https://browsersync.io/docs/options

## Chrome Extension Reload

```js
browserSync({
  options: {
    open: false,
    server: 'build',
    single: true,
    ui: false,
    ghostMode: false,
    notify: false,
  },
  extReload: true,
  extReloadOptions: { port: 5000 },
}),
```

When `extReload` is set to `false`, use `browserSync` for webpage reloading with the configuration items as `options`.
When `extReload` is set to `true`, use `ws` for extension reloading with the configuration items as `extReloadOptions`.

**WebSocketServer Options**

https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketserveroptions-callback


## Chrome Extension Code

`service_worker.js`

```js
const ws = new WebSocket('ws://localhost:5000');
// Connection succeeded
ws.addEventListener('open', function (event) {
  ws.send('client connects successfully');
  console.log('OPEN');
});
// Receive server messages
ws.addEventListener('message', function (event) {
  console.log(`Received: ${event.data}`);
  chrome.runtime.reload();
});
ws.addEventListener('error', error => {
  console.error(`WebSocket error: ${error}`);
});
// Reload tab
chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.query({ active: true, url: 'http://127.0.0.1/*' }, tabs => {
    tabs.forEach(tab => chrome.tabs.reload(tab.id));
  });
});
```

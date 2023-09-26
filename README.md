## Live Reload for Rollup Plugin

Supports web page reloading and Chrome extension reloading.

## Install

```console
npm i rollup-plugin-browser-sync-extension -D
```

## Usage

**`rollup.config.js`**

```js
import browserSync from 'rollup-plugin-browser-sync-extension';

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

`single: true` is very suitable for single-page applications, resolving the error of not finding the page on refresh.

Browsersync sometimes interrupts reloading due to script injection failures.
It's recommended to manually add the script in the HTML file for more reliability.

```js
browserSync({
    options: {
        ...
        snippet: false,
    },
}),

<script async src="/browser-sync/browser-sync-client.js?v=2.29.3"></script>
```

Learn more about Browsersync configuration. https://browsersync.io/docs/options

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

-   When `extReload` is set to `false`, use [`browserSync`](https://github.com/Browsersync/browser-sync) for webpage reloading with the configuration items as `options`.
-   When `extReload` is set to `true`, use [`ws`](https://github.com/websockets/ws) for extension reloading with the configuration items as `extReloadOptions`.

**WebSocketServer Options**

https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketserveroptions-callback

## Chrome Extension Code

`extReload.js`

```js
const ws = new WebSocket('ws://localhost:5000');
// Connection succeeded
ws.addEventListener('open', event => {
    console.log('OPEN');
});
// Receive server messages
ws.addEventListener('message', event => {
    console.log(`Message: ${event.data}`);
    // Reload background
    chrome.runtime.reload();
});
ws.addEventListener('error', error => {
    console.error(`WebSocket error: ${error}`);
});
// Reload tab
chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.query({ active: true, currentWindow: true, url: 'http://127.0.0.1/*' }, tabs => {
        tabs.forEach(tab => chrome.tabs.reload(tab.id));
    });
});
```

#### Code injection limited to development environment.

```js
output: {
  ...
  banner: chunk => {
    // In development environment, inject reload script into specified files.
    // "watch" can be any custom name.
    if (process.env.NODE_ENV === 'watch' && chunk.fileName === 'service_worker.js') {
      const conent = fs.readFileSync('src/extReload.ts', 'utf-8');
      console.log('inject ok');
      return conent;
    }
    return '';
  },
},
```

#### Add environment variables

```json
"scripts": {
  "watch": "rollup -c -w --environment NODE_ENV:watch",
},
```

`Service Workers` get terminated after being idle for a while.

Open the `Service Worker` view to keep it active.

https://developer.chrome.com/docs/extensions/mv3/service_workers/

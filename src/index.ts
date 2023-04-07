import type { Plugin, AddonHookFunction } from 'rollup';
import browserSync, { BrowserSyncInstance } from 'browser-sync';
import type { Options } from 'browser-sync';
import WebSocket, { WebSocketServer } from 'ws';

type OptionsType = {
  options: Options;
  extReload?: boolean;
  extReloadOptions?: {
    port: number;
  };
};

const browserSyncPlugin = ({ options, extReload, extReloadOptions }: OptionsType): Plugin => {
  let bs: BrowserSyncInstance;
  let wss: WebSocketServer;

  if (extReload) {
    wss = new WebSocketServer(extReloadOptions);
    wss.on('connection', ws => {
      ws.on('error', console.error);
      console.log('Connection OK');
    });
  } else {
    bs = browserSync.create();
  }

  return {
    name: 'rollup-plugin-browser-sync',
    writeBundle() {
      if (extReload) {
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send('reloading');
            console.log('Extension Reloading...');
          }
        });
      } else {
        if (bs.active) {
          bs.reload();
        } else {
          bs.init(options);
        }
      }
    },
  };
};

export default browserSyncPlugin;

// ws.on('message', data => {
//   console.log('Message from client:', data.toString());
// });

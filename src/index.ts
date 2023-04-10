import type { Plugin } from 'rollup';
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

let bs: BrowserSyncInstance;
let wss: WebSocketServer;

const browserSyncPlugin = ({ options, extReload, extReloadOptions }: OptionsType): Plugin => {
  // console.log('browserSyncPlugin------------------');
  return {
    name: 'rollup-plugin-browser-sync-extension',
    buildStart() {
      if (extReload) {
        if (!wss) {
          wss = new WebSocketServer(extReloadOptions);
          wss.on('connection', ws => {
            ws.on('error', console.error);
            console.log('Connection OK');
          });
          wss.on('error', err => {
            console.log(err);
            this.error(err);
          });

          // console.log('启动ws服务器');
        }
      } else {
        if (!bs) {
          bs = browserSync.create();
          // console.log('启动browser-sync服务器');
        }
      }
    },
    writeBundle() {
      // console.log('执行钩子', 'writeBundle');
      if (extReload) {
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send('Reloading');
            console.log('Extension Reloading...');
          }
        });
        // console.log('wss.clients, 发送消息');
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

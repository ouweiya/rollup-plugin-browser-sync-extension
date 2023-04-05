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

const browserSyncPlugin = ({ options, extReload, extReloadOptions }: OptionsType): Plugin => {
  let bs: BrowserSyncInstance;
  let wss: WebSocketServer;

  if (extReload) {
    wss = new WebSocketServer(extReloadOptions);
    wss.on('connection', ws => {
      console.log('连接服务器');
      ws.on('error', console.error);
      ws.on('message', data => {
        console.log('来自客户端的消息：', data.toString());
      });
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
            client.send('来自服务器信息');
            console.log('发送信息');
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

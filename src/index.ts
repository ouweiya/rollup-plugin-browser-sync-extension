import type { Plugin } from 'rollup';
import browserSync, { BrowserSyncInstance } from 'browser-sync';
import type { Options } from 'browser-sync';
import WebSocket, { WebSocketServer } from 'ws';

interface OptionsType {
    options: Options & { snippet?: boolean };
    extReload?: false;
    extReloadOptions?: never;
}

interface OptionsTypeWithReload {
    options: Options & { snippet?: boolean };
    extReload: true;
    extReloadOptions: {
        port: number;
    };
}

type OptionsTypeFinal = OptionsType | OptionsTypeWithReload;

const browserSyncPlugin = ({ options, extReload, extReloadOptions }: OptionsTypeFinal): Plugin => {
    let bs: BrowserSyncInstance;
    let wss: WebSocketServer;
    return {
        name: 'rollup-plugin-browser-sync-extension',
        buildStart() {
            if (extReload) {
                if (!wss) {
                    wss = new WebSocketServer(extReloadOptions);
                    wss.on('connection', ws => {
                        ws.on('error', this.warn);
                        console.log('\x1b[1m\x1b[32m%s\x1b[0m', 'Connection Successful');
                    });
                    wss.on('error', err => {
                        this.warn(err);
                    });
                    console.log('\x1b[1m\x1b[32m%s\x1b[0m', `Listen extension reload port ${extReloadOptions.port}`);
                }
            } else {
                if (!bs) {
                    bs = browserSync.create();
                }
                if (!bs.active) {
                    bs.init(options);
                }
            }
        },
        writeBundle() {
            if (extReload) {
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send('Reloading', () => console.log('\x1b[1m\x1b[32m%s\x1b[0m', 'Extension Reloading...'));
                    }
                });
            } else {
                if (bs && bs.active) {
                    bs.reload();
                }
            }
        },
    };
};

export default browserSyncPlugin;

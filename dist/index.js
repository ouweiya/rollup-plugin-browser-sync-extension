import browserSync from 'browser-sync';
import WebSocket, { WebSocketServer } from 'ws';
let bs;
let wss;
const browserSyncPlugin = ({ options, extReload, extReloadOptions }) => {
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
            }
            else {
                if (!bs) {
                    bs = browserSync.create();
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
            }
            else {
                if (bs.active) {
                    bs.reload();
                }
                else {
                    bs.init(options);
                }
            }
        },
    };
};
export default browserSyncPlugin;
//# sourceMappingURL=index.js.map
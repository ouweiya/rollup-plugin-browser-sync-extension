import browserSync from 'browser-sync';
import WebSocket, { WebSocketServer } from 'ws';
const browserSyncPlugin = ({ options, extReload, extReloadOptions }) => {
    let bs;
    let wss;
    if (extReload) {
        wss = new WebSocketServer(extReloadOptions);
        wss.on('connection', ws => {
            ws.on('error', console.error);
            console.log('Connection OK');
        });
    }
    else {
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
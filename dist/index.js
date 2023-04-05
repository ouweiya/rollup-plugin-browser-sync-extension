import browserSync from 'browser-sync';
import WebSocket, { WebSocketServer } from 'ws';
const browserSyncPlugin = ({ options, extReload, extReloadOptions }) => {
    let bs;
    let wss;
    if (extReload) {
        wss = new WebSocketServer(extReloadOptions);
        wss.on('connection', ws => {
            console.log('连接服务器');
            ws.on('error', console.error);
            ws.on('message', data => {
                console.log('来自客户端的消息：', data.toString());
            });
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
                        client.send('来自服务器信息');
                        console.log('发送信息');
                    }
                });
            }
            else {
                console.log('active:', bs.active);
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
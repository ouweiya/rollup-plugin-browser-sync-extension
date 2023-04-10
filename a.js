import { WebSocketServer } from 'ws';

try {
  const wss = new WebSocketServer({ port: 5000 }, () => {
    console.log('WebSocket Server is listening on port 5000');
  });

  wss.on('error', error => {
    console.log(error);
  });
} catch (error) {
  console.log('error222', error);
}

// wss.close(console.log);

// wss.on('connection', function connection(ws) {
//   ws.on('error', console.error);

//   ws.on('message', function message(data) {
//     console.log('received: %s', data);
//   });

//   ws.send('Welcome to WebSocket Server!');
// });

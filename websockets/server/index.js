const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const users = [];

wss.on('connection', function connection(client) {
    console.log('Client connected !')
    users.push(client);

    client.on('message', function incoming(msg) {
        console.log(`Message:${msg}`);
        const recievers = users.filter(user => user !== client);
        for(const client of recievers){
            if(client.readyState === client.OPEN){
                client.send(msg)
            }
        }
        // recievers.forEach(reciever => reciever.send(msg));
    });
});

// wss.on('connection',(client)=>{
//     console.log('Client connected !')
//     client.on('message',(msg)=>{    // (3)
//         console.log(`Message:${msg}`);
//         broadcast(msg)
//     })
// })
// function broadcast(msg) {       // (4)
//     for(const client of wss.clients){
//         if(client.readyState === ws.OPEN){
//             client.send(msg)
//         }
//     }
// }
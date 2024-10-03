//use NodeJs
//use ws
const port=8085;
const WebSocket = require('ws');

const server = new WebSocket.Server({ port: port, path: '/api/ws' });

let socket_list={};
let next_socket_id=1000;

server.on('connection', (socket) => {
 
  let socket_id=next_socket_id
  socket_list[socket_id]=socket;
  next_socket_id++;

  console.log('Client '+socket_id+' connected');
 
  socket.on('message', (data) => {
    console.log('message from '+socket_id+':'+data);
    try{
      message=JSON.parse(data);
    }catch(e){
      console.log(e);
      message=null;
    }
    if(!message||!message.type)return;

    if(message.type=='ping'){
        socket.send(JSON.stringify({'type':'pong'}));
    }else if(message.type=='text'){
        for(let id in socket_list){
            socket_list[id].send(JSON.stringify(message));
        }
    }
  });

  socket.on('close', () => {
    console.log('Client '+socket_id+' disconnected');
    delete socket_list[socket_id];
  });
});

console.log('WebSocket server is running on ws://localhost:'+port);


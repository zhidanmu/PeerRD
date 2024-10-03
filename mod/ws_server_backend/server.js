//use NodeJs
//use ws
const WebSocket = require('ws');
const fs = require('fs');
const port=8085;
const server = new WebSocket.Server({ port: port, path: '/api/ws' });

let socket_list={};
let next_socket_id=1000;
let name_list={};

function server_info_send(socket,info_txt){
  let send_message_obj={speaker:'-SERVER-',type:"text",text:info_txt,text_color:"purple",speaker_color:"purple",time:(new Date().toLocaleString())};
  socket.send(JSON.stringify(send_message_obj));
}

function get_name_list(){
  let str="当前在线成员：";
  let num=0;
  for(let ky in name_list){
    if(num>0)str+='、';
    str+=name_list[ky];
    num++;
  }
  //str+="<br>--["+num+"]--";
  return str;
}

let history_logger=(()=>{

  let file_name="log_"+Date.now().toString();
  let file_path="log/"+file_name;

  function init(){
    fs.writeFile(file_path, file_name+'\n', (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('logfile '+file_name+' created');
    });
  }

  function get_history(socket){
    fs.readFile(file_path,"utf8",(err,data)=>{
      if(err){
        console.log(err);
        server_info_send("获取log文件失败");
        return;
      }

      socket.send(JSON.stringify({data:data,type:"logfile"}));

    });
  }

  function log(message_obj){
    let speaker=message_obj.speaker;
    let text=message_obj.text;
    text=text.replace(/<[^>]+>/g,'');
    let log_str="["+speaker+"]:"+text+"\n";

    fs.appendFile(file_path,log_str,(err)=>{
      console.log(err);
    });
  }

  return {
    init:init,
    get_history:get_history,
    log:log
  }
})();

history_logger.init();


function try_cmds(str,socket){
  let isCmd=false;
  if(str.startsWith('.member')){
    server_info_send(socket,get_name_list());
    isCmd=true;
  }else if(str.startsWith(".history")){
    history_logger.get_history(socket);
    isCmd=true;
  }


  return isCmd;
}


server.on('connection', (socket) => {

  let socket_id=next_socket_id
  socket_list[socket_id]=socket;
  next_socket_id++;

  console.log('Client '+socket_id+' connected');

  let first_time_connect=true;
 
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
        let nn=message.speaker;
        if(!name_list[socket_id]||name_list[socket_id]!=nn){
          name_list[socket_id]=nn;
        }

        let isCmd=try_cmds(message.text,socket);
        if(isCmd)return;

        for(let id in socket_list){
            socket_list[id].send(JSON.stringify(message));
        }

        history_logger.log(message);

        if(first_time_connect){
          server_info_send(socket,get_name_list());
          first_time_connect=false;
        }
    }
  });

  socket.on('close', () => {
    console.log('Client '+socket_id+' disconnected');
    let nn= name_list[socket_id];
    delete socket_list[socket_id];
    delete name_list[socket_id];
    for(let id in socket_list){
      server_info_send(socket_list[id],nn+"下线");
    }
    history_logger.log({speaker:"-SERVER-",text:nn+'下线'})
  });
});

console.log('WebSocket server is running on ws://localhost:'+port);


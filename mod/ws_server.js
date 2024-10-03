let ws_server=(()=>{
    function stderr(err){
		sys.chat_sys_err(err.toString());
		console.log(err);
	}
	
	function stdsys(txt){
		sys.chat_sys_info(txt);
	}

	function stdout(txt){
		sys.chat_print(txt);
	}

	let ws=null;
	let heartbeatTimer=null;
	const heartbeatInterval=15000;

	function ws_send(message){
		if(ws.readyState == WebSocket.OPEN){
			ws.send(JSON.stringify(message));
		}else{
			stderr('ws似乎未打开');
		}
	}

	function send_heartbeat(){
		ws_send({type:'ping'});
		if(heartbeatTimer){
			clearTimeout(heartbeatTimer);
		}
		heartbeatTimer=setTimeout(()=>{
			stderr('未收到服务器心跳，可能断开连接');
		},heartbeatInterval)
	}

	function recv_heartbeat(){
		if(heartbeatTimer){
			clearTimeout(heartbeatTimer);
		}
		heartbeatTimer=setTimeout(send_heartbeat,heartbeatInterval)
	}

	function _ws(arg){
		let baseURL=arg.trim();
		if(!baseURL||baseURL==''){
			baseURL='ws://'+window.location.host;
			//baseURL=window.location.origin;
		}
		let url=baseURL+'/api/ws';

		if(ws){
			ws.close();
		}

		ws=new WebSocket(url)

		ws.onopen=()=>{
			stdsys('与websocket服务器连接成功');

			ws.onmessage=(event)=>{
				message=event.data;
				if(!message)return;
				message=JSON.parse(message);
				if(!message.type)return;

				if(message.type=='pong'){
					recv_heartbeat();
				}else if(message.type=='text'){
					stdout(message);
				}
			}

			send_heartbeat();

			send_message=(content)=>{
				if(content!=""){
					try{
						let cmd_res=cmd.handle(content.trim());
						let str=cmd_res.str;
						let not_send=cmd_res.not_send;
						if(!not_send){
							let message_obj={speaker:user.get('user_name'),text:str,text_color:color_option.text,speaker_color:color_option.user,time:(new Date().toLocaleString())};
							message_obj.type='text';
							let num=ws_send(message_obj);
							message_obj['text']=message_obj['text']+lan['rxnum'].replace('{num}',num).replace('{color}',color_option['rxnum']);
							//sys.chat_print(message_obj);
						}
						
					}catch(e){
						console.log(e);
						alert(e);
					}
				}
			}

			send_message("---"+user.get('user_name')+"连接至服务器---");

		}

		

		ws.onerror=(err)=>{
			console.log(err);
			stderr('websocket连接出现错误');
		}

		ws.onclose=()=>{
			stdsys('与websocket服务器连接已断开');
			clearTimeout(heartbeatTimer);
			send_message=std_send_message;
		}
	}


	function add_cmds(){
		cmd.set_handlers('ws_server',[
			{
				cmd:'.ws',
				func:(arg)=>{
					return _ws(arg);
				},
				description:"使用.ws [url],尝试使用websocket连接服务器,url可留空",
				not_send:true
			}
		]);
	}

	function init(){
		add_cmds();
		sys.chat_sys_info('ws_server模块已加载');
	}

    return {
        init:init
    }
})();

ws_server.init();
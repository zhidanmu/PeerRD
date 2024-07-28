let lan=(()=>{
	let lans={
		'zh':{
			'double_enter_send':'下方输入框可双击回车发送消息',
			'roll_dice':'[掷骰]',
			'cmd_error':'指令解析失败',
			'change_name':'{username1}更名为{username2}',
			'fail_to_send':'发送失败',
			'init_info':'当前用户名:{username}<br>下方输入框可双击回车发送消息<br>本网页使用PeerJS框架实现WebRTC',
			'connection_failed':'连接失败',
			'peer_id':'本机id为:{id}<br>使用.link [id]可连接其他主机<br>主机会广播消息，请勿互相连接',
			'lost_server_connection':'失去服务器连接',
			'connect_to':'已与{id}建立连接',
			'close_connection_to':'与{id}的连接已断开',
			'try_to_connect':'尝试与{id}建立连接中...'
		}
	}
	
	let ret=lans['zh'];
	
	let paramsStr = window.location.search
	let params = new URLSearchParams(paramsStr)
	let lp=params.get('lan');
	ret=lans[lp];
	if(ret==undefined){
		ret=lans['zh'];
	}

	return ret;
})();
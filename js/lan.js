let lan=(()=>{
	let lans={
		'zh':{
			'double_enter_send':'下方输入框可双击回车发送消息',
			'roll_dice':'[掷骰]',
			'cmd_error':'指令解析失败',
			'change_name':'更名为',
			'user_name_info':'当前用户名:',
			'fail_to_send':'发送失败'
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
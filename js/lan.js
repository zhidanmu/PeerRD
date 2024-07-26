let lan=(()=>{
	let lans={
		'zh':{
			'double_enter_send':'双击回车发送消息'
		}
	}
	
	let ret=lans['zh'];
	
	let paramsStr = window.location.search
	let params = new URLSearchParams(paramsStr)
	let lp=params.get('lan');
	console.log(lp);
	ret=lans[lp];
	if(ret==undefined){
		ret=lans['zh'];
	}
	console.log(ret);
	return ret;
})();
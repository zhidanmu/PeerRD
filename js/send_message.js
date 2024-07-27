(()=>{
	sys.chat_sys_info(lan['double_enter_send']);
})();



(
()=>{
	let enter_timestamp=0;
	sys.input_div_addEventListener('keydown',(event)=>{
		if(event.keyCode==13){
			let timestamp=Date.now();
			if(timestamp-enter_timestamp<500){
				let content=input_div.innerHTML;
				content=content.replaceAll('<div>','<br>');
				content=content.replaceAll('</div>','');
				content=content.replaceAll('<br>','\n');
				content=content.trim();
				if(content!=""){
					//TODO
					let str=cmd.handle(content);
					sys.chat_print({speaker:user.get('user_name'),text:str});
					input_div.innerHTML="";
				}
				event.preventDefault();
			}
			enter_timestamp=timestamp;
			return false;
		}
	});
}
)();
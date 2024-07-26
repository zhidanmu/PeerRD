
let sys=(function(){
	const chat_div=document.getElementById("chat_div");
	const input_div=document.getElementById("input_div");
	const send_btn=document.getElementById('send_btn');
	
	let mouse_on_chat_div=0;
	chat_div.addEventListener("mouseover",(event)=>{
		mouse_on_chat_div=1;
	});
	chat_div.addEventListener("mouseleave",(event)=>{
		mouse_on_chat_div=0;
	});
	
	
	function chat_print({speaker='default_speaker',text='default_text',speaker_color='blue',time=(new Date().toLocaleString())}){
		text=text.replaceAll('\n','<br>');
		let p=document.createElement("p");
		let sp=document.createElement('div');
		let tx=document.createElement('div');
		
		sp.style.color=speaker_color;
		sp.innerHTML=speaker+'  '+time;
		tx.innerHTML=text;
		p.appendChild(sp);
		p.appendChild(tx);
		
		chat_div.appendChild(p);
		if(mouse_on_chat_div==0){
			chat_div.scrollTop = chat_div.scrollHeight;
		}
	}
	
	function input_div_addEventListener(e,func){
		input_div.addEventListener(e,func);
	}
	
	return {
		chat_print:chat_print,
		input_div_addEventListener:input_div_addEventListener
		
	}
})();


(()=>{
	sys.chat_print({speaker:'SYSTEM',speaker_color:'red',text:lan['double_enter_send']});
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
					sys.chat_print({speaker:'local',speaker_color:'purple',text:content});
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
let f7trpg=(()=>{
	function stderr(err){
		sys.chat_sys_err(err.toString());
		console.log(err);
	}
	
	function stdsys(txt){
		sys.chat_sys_info(txt);
	}
	
	let character_status={
		'刚':1,
		'灵':1,
		'巧':1,
		'职业':'战士'
		
	};
	
	let character_status__tds={};
	
	function set_status(k,v){
		character_status[k]=v;
		save_status();
	}
	
	function get_status(k){
		return character_status[k];
	}
	
	function remove_status(k){
		delete character_status[k];
	}
	
	function save_status(){
		storage.set('f7trpg_status',JSON.stringify(character_status));
	}
	
	function load_status(){
		let sav=storage.get('f7trpg_status');
		if(sav){
			character_status=JSON.parse(sav);
		}
	}
	
	function bind_attr(k,td){
		td.addEventListener('change',()=>{
			set_status(k,td.value);
		});
	}
	
	function gen_status_panel(){
		let sta=document.createElement('div');
		sta.classList.add('center_div');
		sta.classList.add('opa');
		sta.classList.add('black_border');
		sta.style.display='none';
		sta.id='f7_status';
		sta.innerHTML='STATUS';
		sta.tabIndex='0';
		
		let table_layout=[
			[
			{
				key:'刚',
				description:'刚',
				type:'number',
				min:'1',
				max:'99'
			},
			{
				key:'灵',
				description:'灵',
				type:'number',
				min:'1',
				max:'99'
			},
			{
				key:'巧',
				description:'巧',
				type:'number',
				min:'1',
				max:'99'
			},
			{
				key:'职业',
				description:'职业',
				type:'datalist',
				options:[
					'战士','坦克','影袭','法师','射手','辅助'
				]
			},
			{
				key:'计算GA',
				description:'计算生成属性',
				type:'button',
				value:'计算',
				func:()=>{}
			}
			
			]
		
		
		
		]
		
		let table=document.createElement('table');
		table.border=1;
		for(let i=0;i<table_layout.length;i++){
			let tr=document.createElement('tr');
			let tr_list=table_layout[i];
			for(let j=0;j<tr_list.length;j++){
				let td=tr_list[j];
				let label=document.createElement('td');
				label.innerHTML=td.description;
				let input_td=document.createElement('td');
				let input=document.createElement('input');
				
				if(td.type=='number'){
					input.type='Number';
					input.min=td.min;
					input.max=td.max;
					input.value=character_status[td.key];
					bind_attr(td.key,input);
				}else if(td.type=='datalist'){
					let datalist=document.createElement('datalist');
					datalist.id=td.key;
					for(let ii=0;ii<td.options.length;ii++){
						let opts=document.createElement('option');
						opts.value=td.options[ii];
						datalist.appendChild(opts);
					}
					input.setAttribute('list',td.key);
					tr.appendChild(datalist);
					input.value=character_status[td.key];
					bind_attr(td.key,input);
				}else if(td.type=='button'){
					input.type='button';
					input.value=td.value;
					input.addEventListener('click',()=>{td.func()});
				}
				
				character_status__tds[td.key]=td;
				input_td.appendChild(input);
				tr.appendChild(label);
				tr.appendChild(input_td);
			}
			
			table.appendChild(tr);
		}
		
		sta.appendChild(table);
		document.body.appendChild(sta);
	}
	
	
	function _status(){
		$('f7_status').style.display='block';
	}
	
	function _chat(){
		$('f7_status').style.display='none';
	}
	
	function add_cmds(){
		cmd.set_handlers('f7trpg',[
			{
				cmd:'.status',
				func:(arg)=>{
					return _status();
				},
				description:"显示状态页面",
				not_send:true
			},
			{
				cmd:'.chat',
				func:(arg)=>{
					return _chat();
				},
				description:"显示聊天页面(关闭其他页面)",
				not_send:true
			}
		]);
	}
	
	
	
	function init(){
		load_status();
		gen_status_panel();
		dice.set_default_dice_num(2);
		dice.set_default_dice_type(6);
		add_cmds();
		$('menu_div').innerHTML='F7TRPG';
		document.title='F7TRPG';
		sys.chat_sys_info('f7trpg模块已加载');
	}
	
	return {
		init:init,
		set_status:set_status,
		get_status:get_status,
		remove_status:remove_status
	}
	
})();

f7trpg.init();
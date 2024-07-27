let cmd=(()=>{
	
	function _nn(nn){
		if(!nn)nn=user.get('user_name');
		let ret;
		ret="\""+user.get('user_name')+"\""+lan['change_name']+"\""+nn+"\""
		user.set('user_name',nn);
		sys.set_user_name(name);
		return ret;
	}
	
	function _r(dexpr){
		let ret=dice.evalDiceExpr(dexpr);
		return ret;
	}
	
	function handle(str){
		if(str.length<=0||str[0]!='.'){
			return str;
		}
		let ret="";
		ret+="<span style='color:"+color_option.user_op+";'>";
		
		if(str.substr(0,3)=='.nn'){
			ret+=_nn(str.substr(3).trim());
		}
		
		if(str.substr(0,2)=='.r'){
			let dres=_r(str.substr(2).trim());
			ret+=dres.str;
		}
		
		ret+="</span>";
		return ret;
	}
	
	
	return {
		handle:handle
	}
})();
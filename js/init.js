
(()=>{
    function setVH() {
      let VH = window.innerHeight / 100;
      document.documentElement.style.setProperty('--vh', VH + 'px');
    }
    let i = 'orientationchange' in window ? 'orientationchange' : 'resize';
    document.addEventListener('DOMContentLoaded', setVH);
    window.addEventListener(i, setVH);
})();



(()=>{
	sys.chat_sys_info(lan['user_name_info']+user.get('user_name')+"<br>"+lan['double_enter_send']);
})();
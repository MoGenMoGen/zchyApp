// import Toast from "vue-ydui/dist/lib.rem/dialog/index";


const postImgUrl = 'http://118.178.121.34:8080/uploads/';
const hostUrl = 'http://192.168.2.105';
// const hostUrl = 'http://www.mxjob.com.cn/wechat';

class until{
	imgStyle(cont){
	  let myContent = cont.replace(/<img[^>]*>/gi, function (match, capture) {
	    return match.replace(/(<img[^>]*)(\/?>)/gi, "$1style='max-width:100%;height:auto;' $2")
	    // return match.replace(/style\s*?=\s*?([‘"])[\s\S]*?\1/ig, 'style="max-width:100%;height:auto;"') // 替换style
	
	  })
	  return myContent
	}
    isMyApp(){
      let u = navigator.userAgent;
      let flag = u.indexOf('zhongChuang') > -1;
      return flag;
    }

  //把富文本的图片添加自适应宽度
    imgTagAddStyle (htmlstr) {
        // 正则匹配所有img标签
        // var regex0 = new RegExp("(i?)(\<img)([^\>]+\>)","gmi");
        // 正则匹配不含style="" 或 style='' 的img标签
        // eslint-disable-next-line no-useless-escape
        var regex1 = new RegExp("(i?)(\<img)(?!(.*?style=['\"](.*)['\"])[^\>]+\>)", 'gmi')
        // 给不含style="" 或 style='' 的img标签加上style=""
		   console.log( 'kankan', htmlstr)
        htmlstr = htmlstr.replace(regex1, '$2 style=""$3')
        console.log('增加style=""后的html字符串：' + htmlstr)
        // 正则匹配含有style的img标签
        // eslint-disable-next-line no-useless-escape
        var regex2 = new RegExp("(i?)(\<img.*?style=['\"])([^\>]+\>)", 'gmi')
        // 在img标签的style里面增加css样式(这里增加的样式：display:block;max-width:100%;height:auto;border:5px solid red;)
        htmlstr = htmlstr.replace(regex2, '$2width:auto;height:auto;$3')
        console.log('在img标签的style里面增加样式后的html字符串：' + htmlstr)
        return htmlstr
    }
  //渠道守卫空格
  trim(str){
    //未定义
    if(typeof str=='undefined'){
      return ''
    }
    return  str.replace(/(^\s+)|(\s+$)/g, "")
    // return  str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,'');
  }
   //将图片Base64 转成文件,
  base64toFile(dataUrl, filename) {
    var arr = dataUrl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }

    //苹果微信返回不刷新
    pushHistory(){

        window.addEventListener("popstate", function(e) {

            // alert("后退");
            self.location.reload();
        }, false);

        var state = {
            title : "",
            url : "#"
        };
        window.history.replaceState(state, "", "#");

    }
    //h5模拟登录
    h5Login(){
        let param = {
            usNm:'admin',
            pwd:'1124'
        }
        this.get('/general/access/h5Login',param)
            .then(res=>{
                return res
            })
    }
  // 截取小数

  getCookie(name)
    {
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    }
  getPk(){
    let obj = this.loGet('JS_token');
    return JSON.parse(obj).accInfo.teachAccPk;;
  }
  //ajax请求

  //跳转页面
  href(url){
    window.location.href = url;
  }

  //后退
  back(){
    window.history.back(-1);
  }
  //session存取
  seSave(name,obj){
    sessionStorage.setItem(name,obj);
  }
  seGet(name){
    return sessionStorage.getItem(name);
  }
  seRemove(name){
    sessionStorage.removeItem(name);
  }
  //local存取
  loSave(name,obj){
    localStorage.setItem(name,obj);
  }
  loGet(name){
    return localStorage.getItem(name);
  }
  loRemove(name){
    localStorage.removeItem(name);
  }
  //获取TS_token
  getToken(){
    return JSON.parse(localStorage.getItem('JS_token'));
  }
  getId(){
    let obj = this.getToken();
    return obj.result.uuid;
  }
  //截取URL参数
  getQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if ( r != null ){
      return decodeURI(r[2]);
    }else{
      return null;
    }
  }
    //截取URL参数
    getQueryString2(name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		let r
		if(window.location.href.split('?').length>1){
			r = window.location.href.split('?')[1].match(reg);
		}else{
			return null;
		}

        if ( r != null ){
            return decodeURI(r[2]);
        }else{
            return null;
        }
    }
  //判断是否空对象
  isEmptyObject(obj) {
    for (var name in obj){
      return false;//返回false，不为空对象
    }
    return true;//返回true，为空对象
  }
  //获取这个月的第一天和最后一天
    getNowMonthDate(time) {
        var date = time ? new Date(time) : new Date();
        var year = date.getFullYear() + "";
        var month = (date.getMonth() + 1) + "";
        // 本月第一天日期
        var begin = year + "-" + month + "-01"
        // 本月最后一天日期
        var lastDateOfCurrentMonth = new Date(year,month,0);
        var end = year + "-" + month + "-" + lastDateOfCurrentMonth.getDate();
        console.log(begin)
        console.log(end)
        return {begin,end};
    }
  //格式化日期,返回 年 月 日 星期
  formatDate(str=""){
      if(typeof(str)=='string'){
          str = str.replace(/-/g, "/")
      }
    str = str==""?new Date():new Date(str);
      // str = str==""?new Date():new Date(str);
      let week = ["星期天","星期一","星期二","星期三","星期四","星期五","星期六"];
    let year =str.getFullYear();
    let month = str.getMonth()+1<10?"0"+(str.getMonth()+1):str.getMonth()+1;
    let day = str.getDate()<10?"0"+str.getDate():str.getDate();
    let hour = str.getHours()<10?"0"+str.getHours():str.getHours();
    let minite = str.getMinutes()<10?"0"+str.getMinutes():str.getMinutes();
    let second = str.getSeconds()<10?"0"+str.getSeconds():str.getSeconds();
    week = week[str.getDay()];
    return {year,month,day,hour,minite,second,week};
  }
  formatDay(fmt,tm = ''){
    let times = tm ? new Date(tm.replace(/(-)/g, '/')): new Date();
    var o = {
      "M+" : times.getMonth()+1,                 //月份
      "d+" : times.getDate(),                    //日
      "h+" : times.getHours(),                   //小时
      "m+" : times.getMinutes(),                 //分
      "s+" : times.getSeconds(),                 //秒
      "q+" : Math.floor((times.getMonth()+3)/3), //季度
      "S"  : times.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
      fmt=fmt.replace(RegExp.$1, (times.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
      if(new RegExp("("+ k +")").test(fmt)){
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
      }
    }
    return fmt;
  }
  //指定时间倒计时(结束秒数)
  TimeSlot(count){
    let end = new Date();
    //Date类型的valueOf(),返回当前日期毫秒数,可以直接比较
    if(count<end){
      return {day:'00',h:'00',m:'00',s:'00'}
    }
    let total = (count - end.getTime())/1000;
      let day = Math.floor(total/(60*60)/24)
    let h = parseInt(total/(60*60)%24);
    let m = parseInt(total/60%60);
    let s = parseInt(total%60);
    day = day<10 ? "0"+day:day;
    h = h<10?"0"+h:h;
    m = m<10?"0"+m:m;
    s = s<10?"0"+s:s;

    return {day,h,m,s};
  }
  //距离今天几天
  TimeStep(times){
    let start = new Date(times);
    let end = new Date();
    let count = (end.getTime() - start.getTime())/1000;
    let d = parseInt(count/(60*60)/24);
    return d;
  }
  //设置只能输入数字
  formatNumber(val,max){
    max = parseInt(max);
    let reg = /^\d+$/g;
    val = val.toString();
    if(val.match(reg)){
      return val > max ? max : Number(val);
    }else {
      if(val==""){
        return "";
      }
      if(!val[0].match(reg)){
        return "";
      }
      let str = "";
      for(let i=0;i<val.length;i++){
        str += val[i].match(reg) ? val[i] : "";
      }
      return parseInt(str);
    }
  }
  count(flag,val,max){//加减按钮点击
    max = parseInt(max);
    if(max == 0){
      return 0;
    }
    if(flag=="-"){
      return val == 1 ? 1 : --val;
    }else {
      return val == max ? max : ++val;
    }
  }
  //数组排序(某属性数值)
  Sort(array,flag,state = 'up'){
    let box = array.sort((v1,v2)=>{
      if(state == 'up'){
        return v1[flag] - v2[flag];
      }else {
        return v2[flag] - v1[flag];
      }
    })
    return box;
  }
  TimeStep2(times) {
    let start = new Date(times);
    let end = new Date();
    let count = (end.getTime() - start.getTime()) / 1000;
    return count;
  }
  //随机生成 n~m 之间的数
  Random(min,max){
    let choices = max - min + 1;
    return Math.floor(Math.random() * choices + min);
  }
  /*验证码倒计时*/
  countdown(el,count){
    let timer =  setInterval(()=>{
      if(count == 0){
        el.innerHTML=`重新获取`;
        el.removeAttribute('disabled');
        clearInterval(timer);
      }else{
        count--;
        el.innerHTML=`( ${count} )`;
        el.setAttribute('disabled',true);
      }
    },1000);
  }
  formatTen(num) {
    return num > 9 ? (num + "") : ("0" + num);
  }
  formatTime(date) {
    let myDate = new Date(date)
    let year = myDate.getFullYear();
    let month = myDate.getMonth() + 1;
    let day = myDate.getDate();
    let hour = myDate.getHours();
    let minute = myDate.getMinutes();
    let second = myDate.getSeconds();
    return year + "-" + this.formatTen(month) + "-" + this.formatTen(day) + " " + this.formatTen(hour) + ":" + this.formatTen(minute) +
      ":" + this.formatTen(second);
  }
  formatTimeTwo() {
    let myDate = new Date()
    let year = myDate.getFullYear();
    let month = myDate.getMonth() + 1;
    let day = myDate.getDate();
    let hour = myDate.getHours();
    let minute = myDate.getMinutes();
    let second = myDate.getSeconds();
    return year + "-" + this.formatTen(month) + "-" + this.formatTen(day);
  }
  /*版本检测*/
  browser={
    versions:function(){
      var u = navigator.userAgent, app = navigator.appVersion;
      return {//移动终端浏览器版本信息
        trident: u.indexOf('Trident') > -1, //IE内核
        presto: u.indexOf('Presto') > -1, //opera内核
        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
        iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
        iPad: u.indexOf('iPad') > -1, //是否iPad
        webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
      };
    }(),
    language:(navigator.browserLanguage || navigator.language).toLowerCase()
  }
  // 给金额加千分符
  formatNumberRgx(num) {
      let parts = num.toString().split(".")
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      return parts.join(".")
  }
}
//touch判断方向
class judge{
  // 1上2下3左4右
  getDirection(startx, starty, endx, endy){
    let angx = endx - startx;
    let angy = endy - starty;
    let result = 0;
    var angle = this.getAngle(angx, angy);
    if (angle >= -135 && angle <= -45) {
      result = 1;
    } else if (angle > 45 && angle < 135) {
      result = 2;
    } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
      result = 3;
    } else if (angle >= -45 && angle <= 45 ) {
      result = 4;
    }
    return result;
  }
  getAngle(angx, angy){
    return Math.atan2(angy, angx) * 180 / Math.PI;
  }
}
class reg{

  //验证身份证号码
  checkCard(str){
    //15位数身份证正则表达式
    let arg1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
    //18位数身份证正则表达式
    let arg2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/;
      if(str==""){
          return "请输入身份证号码";
      }
    if (str.match(arg1) == null && str.match(arg2) == null) {
      return "请输入正确的身份证号码";
    }
    return 'ok';
  }
  //验证手机号
  checkPhone(str){
    let regPhone  = /^0?(13[0-9]|15[012356789]|18[012346789]|14[57]|17[678]|170[059]|14[57]|166|19[89])[0-9]{8}$/;
    if(str==""){
      return "请输入手机号";
    }
    if(!regPhone.test(str)){
      return "请填写正确的手机号";
    }
    return 'ok';
  }
  //验证用户名
  checkUserName(str){
    let reg = /[\u4e00-\u9fa5]/g;
    if(str.length==0){
      return "请输入用户名";
    }
    if(reg.test(str)){
      return "用户名不能包含中文";
    }
    return 'ok';
  }
  //验证真实姓名
  checkName(str){
    let reg = /^[\u4E00-\u9FA5]+$/;
    if(str.length == 0){
      return "请输入真实姓名";
    }
    if(str.length<2){
      return "请输入正确名字";
    }
    if(!reg.test(str)){
      return "请输入中文名";
    }
    return 'ok';
  }
  //验证密码
  checkPwd(str){
    let reg=/^[0-9a-zA-Z]{6,}$/;
    if(str==""){
      return "请输入密码";
    }
    if(!reg.test(str)){
        return "请输入正确规则密码";
    }
    return 'ok';
  }
  //验证邮箱
  checkMail(str){
    let reg =/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if(str==""){
      return "请输入邮箱";
    }
    if(!reg.test(str)){
      return "请输入正确的邮箱";
    }
    return 'ok';
  }

  //验证银行卡号
    checkMoney(str){
      let reg =/^([1-9]{1})(\d{14}|\d{18})$/;
      if(str==""){
          return "请输入银行卡号";
      }
      if(!reg.test(str)){
          return "请输入正确的银行卡号";
      }
      return 'ok';
  }
  

}
class app{
      //调用本地java方法
      constructor(){
        this.flag = false;
      }
    InterfaceName(name,data){
        let $q = new Promise((resolve,reject)=>{
            window.WebViewJavascriptBridge.callHandler(
                name,data,(res)=>{
                    if(res){
                        resolve(res);
                        return;
                    }else{
                        reject('err');
                        return;
                    }
                    // res = res?res:JSON.parse(res);
                }
            )
        });
        return $q;
    }
      isReady(){
        let $q = new Promise((resolve,reject)=>{
          if(window.WebViewJavascriptBridge){
            resolve('ok');
          }else {
            document.addEventListener('WebViewJavascriptBridgeReady',function () {
              resolve('ok');
            })
          }
        });
        return $q;
      }
	  //判断是否是PC
	    IsPC() {
	        var userAgentInfo = navigator.userAgent;
	        var Agents = ["Android", "iPhone",
	            "SymbianOS", "Windows Phone",
	            "iPad", "iPod"];
	        var flag = true;
	        for (var v = 0; v < Agents.length; v++) {
	            if (userAgentInfo.indexOf(Agents[v]) > 0) {
	                flag = false;
	                break;
	            }
	        }
	        return flag;
	    }
  //判断JS环境
  IsAndroid(){
    let u = navigator.userAgent;
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
    return isAndroid;
  }
  IsIos(){
    let u = navigator.userAgent;
    let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    return isiOS;
  }
  IsWx(){
    let u = navigator.userAgent.toLowerCase();
    let isWx = u.match(/MicroMessenger/i)=="micromessenger";
    return isWx;
  }



}
export { until,reg,hostUrl,app,postImgUrl,judge};

import Vue from 'vue'
Vue.directive('resetPage', {
    inserted: function (el) {
        // 该方法有时候会出现点击了键盘右上角完成按钮，键盘收起又弹出的情况
        // el.addEventListener('blur', function () {
        //   if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        //     let currentPosition, timer
        //     let speed = 1//页面滚动距离
        //     timer = setInterval(function () {
        //       currentPosition = document.documentElement.scrollTop || document.body.scrollTop
        //       currentPosition -= speed
        //       window.scrollTo(0, currentPosition)//页面向上滚动
        //       currentPosition += speed //speed变量
        //       window.scrollTo(0, currentPosition)//页面向下滚动
        //       clearInterval(timer)
        //     }, 100)
        //   }
        // })

        // 监听键盘收起事件
        document.body.addEventListener('focusout', () => {
            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                //软键盘收起的事件处理
                setTimeout(() => {
                    const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0
                    window.scrollTo(0, Math.max(scrollHeight - 1, 0))
                }, 100)
            }
        })
    }
})


require ('assets/css/common.css');
require ('assets/css/mobile.less');

import 'assets/js/ScreenAdaptive.js';

// import "babel-polyfill";// 解决 IE11 Promise对象未定义
import axios from 'axios';
import './vueFilter';  	//全局过滤器
import {until,reg,hostUrl,app} from 'assets/js/until'
import {msg,confirm,loading} from 'hero'
import 'assets/js/wconfig.js';
import Bridge from './jsBridge.js'
import {api} from './api.js'
import query from 'assets/js/query'
// import { Navbar, TabItem } from 'mint-ui';
import Vant from 'vant';
import 'vant/lib/index.css';

import { Lazyload } from 'vant';

Vue.use(Lazyload);
// 注册时可以配置额外的选项
Vue.use(Lazyload, {
    lazyComponent: true,
});

// import 'assets/js/Ios';
// import 'assets/js/WebViewJavascriptBridge';



import lrz from 'lrz'  //图片压缩

// import Calendar from 'vue-mobile-calendar' //日期选择器
//import Vconsole from 'vconsole'


// import chooseSelect from '@/components/chooseSelect'
export default{
  install(Vue){
    // Vue.component('chooseSelect',chooseSelect)
    // Vue.use(Calendar);
    // Vue.use(vuePickers);
    Vue.prototype.lrz = lrz;
   // Vue.prototype.Vconsole = new Vconsole()
    Vue.prototype.axios = axios;
    Vue.prototype.api = new api();
    Vue.prototype.until = new until();
    Vue.prototype.app = new app();
    Vue.prototype.reg = new reg();
    Vue.prototype.hostUrl = hostUrl;
    Vue.prototype.$bridge = Bridge
	Vue.use(Vant);
    Vue.use(msg);
    Vue.use(confirm);
    Vue.use(loading);
    Vue.prototype.query = query;

    // Vue.component(Navbar.name, Navbar);
    // Vue.component(TabItem.name, TabItem);


  }
}



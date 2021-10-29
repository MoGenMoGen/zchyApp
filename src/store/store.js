import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        shipId:'4942035725390848',
        cartNum: 0,//购物车中数量
        hostUrl:'https://www.sinovatocean.com/',
        price:0,//当价格是这个时显示“价格面议”
		serverAddr:'/sinovat'
    },
    mutations: {
        cartNum:(state,data)=>{
            if(data){
                window.sessionStorage.setItem("cartNum",data)
                state.cartNum = data
            }else {
                state.cartNum = 0
                window.sessionStorage.setItem("cartNum",0)
            }

        },

    }
})
export default store
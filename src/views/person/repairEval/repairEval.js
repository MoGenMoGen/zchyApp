import Vue from 'vue';
import init from '../../../assets/js/init'
import store from '@/store/store.js'
Vue.use(init);

import App from './App';

new Vue({
    store,
  render: h => h(App)
}).$mount('#container')

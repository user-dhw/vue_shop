import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
//引入全局样式表
import "./assets/css/global.css";

// 引入axios包
import axios from "axios";
//配置请求根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
// 挂载到vue原型上
Vue.prototype.$http = axios;

Vue.config.productionTip = false;

new Vue({
    router,
    render: (h) => h(App),
}).$mount("#app");
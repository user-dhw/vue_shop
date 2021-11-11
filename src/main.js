import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
// 导入字体图标
import "./assets/font/iconfont.css";
//引入全局样式表
import "./assets/css/global.css";

// 引入axios包
import axios from "axios";
// import { config } from "vue/types/umd";
//配置请求根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";

//通过axios拦截器添加token验证
axios.interceptors.request.use((config) => {
    // console.log(config);
    config.headers.Authorization = window.sessionStorage.getItem("token");
    return config;
});

// 挂载到vue原型上
Vue.prototype.$http = axios;

Vue.config.productionTip = false;

new Vue({
    router,
    render: (h) => h(App),
}).$mount("#app");
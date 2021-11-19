import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
// 导入字体图标
import "./assets/font/iconfont.css";
//引入全局样式表
import "./assets/css/global.css";
import TreeTable from "vue-table-with-tree-grid";
//导入富文本编辑器
import VueQuillEditor from "vue-quill-editor";
// 导入富文本编辑器对应的样式
import "quill/dist/quill.core.css"; // import styles
import "quill/dist/quill.snow.css"; // for snow theme
import "quill/dist/quill.bubble.css"; // for bubble theme

//// 导入echarts包
import * as echarts from "echarts";

//导入NProgress包对应的js和css
import nProgress from "nprogress";
import "nprogress/nprogress.css";

// 引入axios包
import axios from "axios";
// import { config } from "vue/types/umd";
//配置请求根路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";

//在request拦截器中展示进度条
//通过axios拦截器添加token验证
axios.interceptors.request.use((config) => {
    nProgress.start();
    // console.log(config);
    config.headers.Authorization = window.sessionStorage.getItem("token");
    return config;
});
//在response拦截器中隐藏进度条
axios.interceptors.response.use((config) => {
    nProgress.done();
    return config;
});
// 挂载到vue原型上
Vue.prototype.$http = axios;

Vue.config.productionTip = false;

Vue.component("tree-table", TreeTable);
//将富文本编辑器注册全局组件
Vue.use(VueQuillEditor);

Vue.prototype.$echarts = echarts;

Vue.filter("dataFormat", function(originVal) {
    const dt = new Date(originVal);
    const y = dt.getFullYear();
    const m = (dt.getMonth() + 1 + "").padStart(2, "0");
    const d = (dt.getDate() + "").padStart(2, "0");

    const hh = (dt.getHours() + "").padStart(2, "0");
    const mm = (dt.getMinutes() + "").padStart(2, "0");
    const ss = (dt.getSeconds() + "").padStart(2, "0");

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
});

new Vue({
    router,
    render: (h) => h(App),
}).$mount("#app");
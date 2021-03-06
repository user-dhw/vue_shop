import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/Login";
import Home from "../components/Home";
import Welcome from "../components/Welcome";
import User from "../components/user/User";
import Rights from "../components/power/Rights.vue";
import Roles from "../components/power/Roles.vue";
import Cate from "../components/goods/Cate.vue";
import Params from "../components/goods/Params.vue";
import List from "../components/goods/List.vue";
import Add from "../components/goods/Add.vue";
import Order from "../components/order/Order.vue";
import Report from "../components/report/Report.vue";

Vue.use(VueRouter);

const router = new VueRouter({
    // mode: "history",
    // base: "/admin/",
    routes: [
        { path: "/", redirect: "/login" },
        { path: "/login", component: Login },
        {
            path: "/home",
            component: Home,
            redirect: "/Welcome",
            children: [
                { path: "/Welcome", component: Welcome },
                { path: "/users", component: User },
                { path: "/rights", component: Rights },
                { path: "/roles", component: Roles },
                { path: "/categories", component: Cate },
                { path: "/params", component: Params },
                { path: "/goods", component: List },
                { path: "/goods/add", component: Add },
                { path: "/orders", component: Order },
                { path: "/reports", component: Report },
            ],
        },
    ],
});
//挂载路由导航首守卫
router.beforeEach((to, from, next) => {
    // to访问路径
    //from从哪个路径跳转过来
    //next 是一个函数,表示放行
    // next() 放行  next('/login')强制跳转路径
    if (to.path === "/login") return next();
    // 获取token
    const tokenStr = window.sessionStorage.getItem("token");
    if (!tokenStr) return next("/login");
    next();
});
export default router;
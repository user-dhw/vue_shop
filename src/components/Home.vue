<template>
    <el-container class="home-container"> 
      <!-- 头部区 -->
      <el-header>
        <div>
        <img src="../assets/logo.jpg" alt="">
        <span>电商后台管理系统</span>
        </div>
         <el-button type="info" @click="logout">退出</el-button>         
      </el-header>
      <!-- 页面主体区 -->
      <el-container>
        <!-- 页面侧边栏 -->
        <el-aside :width="isCollapse ? '64px' :'200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <!-- 侧边栏菜单区 -->
           <el-menu   background-color="#2b313d" text-color="#fff" active-text-color="#47a6ff" :collapse='isCollapse' :unique-opened='true' :collapse-transition='false' :router="true"
           :default-active="actionPath">
            <!-- 一级菜单 -->
            <el-submenu v-for="item in menulist" :key="item.id" :index="item.id+'' ">
              <!-- 一级菜单模板区 -->
              <template slot="title">
                <!-- 图标 -->
                <i :class="iconsObj[item.id]"></i>
                <!-- 文本 -->
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item :index="'/'+subItem.path+''" v-for="subItem in item.children" :key="subItem.id"
              @click="saveNavState('/'+subItem.path+'')"> 
                <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右侧内容主体 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>     
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menulist:[],
      iconsObj:{
        '125':'iconfont icon-zhanghao',
        '103':'iconfont icon-yinsitiaokuan',
        '101':'iconfont icon-mendian',
        '102':'iconfont icon-shaixuan',
        '145':'iconfont icon-shezhi',
     },
       //是否折叠
     isCollapse:false,
     //被激活的链接地址
     actionPath:''
    }
  },
  created() {
    this.getMenuList()
    this.actionPath=window.sessionStorage.getItem('activePath')
  },
    name:'Home',
    methods: {
      //退出按钮
      logout(){
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      //获取所有的菜单
     async getMenuList(){
      const{data:res} =await this.$http.get('menus')
      if(res.meta.status!==200)return this.$message.error(res.meta.msg);
      this.menulist=res.data
      // console.log(res);
      },
      //点击按钮切换菜单的折叠
      toggleCollapse(){
      this.isCollapse=!this.isCollapse    
      },
      //保存连接的激活状态
      saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.actionPath=activePath
      }

    },
    

}
</script>

<style lang="less" scoped>
.home-container{
  height: 100%;
}
.el-header{
  display: flex;
  background-color:#2d3437 ;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  >div{
    display: flex;
    align-items: center;
    span{
      margin-left: 15px;
    }
  }
}
.el-aside{
  background-color: #2b313d;
  el-menu{
    border-right: no;
  }
}
.el-main{
  background-color: #fcffff;
}
img{
  border-radius: 50%;
  width: 55px;
  height: 55px;
}
.iconfont{
  margin-right: 10px;
}
.toggle-button{
  background-color: #454c5f;
  color: #fff;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.3em;
  cursor: pointer;
}

</style>
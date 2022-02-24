<template>
  <el-container class="home-container">
    <el-header>
      <!-- 头部 -->
      <div class="header-logo">
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="loginOut">退出登录</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-menu background-color="#545c64" text-color="#fff" active-text-color="#409EFF" :unique-opened="true"
          :collapse-transition="false" :router="true" :default-active="activeIndex">
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id"
              @click="saveActiveIndex('/' + subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import {
    MenusList
  } from '@/assets/js/package.js'
  export default {
    data() {
      return {
        menuList: [],
        iconsObj: {
          '125': 'iconfont icon-user',
          '103': 'iconfont icon-tijikongjian',
          '101': 'iconfont icon-shangpin',
          '102': 'iconfont icon-danju',
          '145': 'iconfont icon-baobiao',
        },
        activeIndex: '/users'
      }
    },
    created() {
      this.getMenus();
      this.getActiveIndex();
    },
    methods: {
      // 退出登录
      loginOut() {
        // 情况 sessionStorage 的token
        window.sessionStorage.clear();
        // 路由重定向回 登录 页面
        this.$router.push("/login");
      },
      // 获取所有的菜单
      getMenus() {
        MenusList().then(res => {
          // console.log(res)
          this.menuList = res.data.slice(0, 2);
        }).catch(err => {
          console.log(err)
        })
      },
      getActiveIndex() {
        if (window.sessionStorage.getItem('aIndex') !== null) {
          this.activeIndex = window.sessionStorage.getItem('aIndex')
        }
      },
      saveActiveIndex(activePath) {
        window.sessionStorage.setItem('aIndex', activePath)
        this.activeIndex = activePath
      }

    }
  }

</script>

<style scoped>
  .home-container {
    height: 100%;
    text-align: left;
  }

  .el-header {
    background: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
  }

  .header-logo {
    display: flex;
    align-items: center;
  }

  .header-logo img {
    display: block;
    width: 40px;
    height: 40px;
    margin-right: 20px;
  }

  .el-aside {
    background: #373d41;
  }

  .el-main {
    background: #eaedf1;
  }

  .iconfont {
    margin-right: 10px;
  }

  .el-menu {
    border: none;
  }

  .toggle-button {
    background: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }

</style>

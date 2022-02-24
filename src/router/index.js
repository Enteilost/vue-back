import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Home from '@/views/Home'
import Users from '@/components/Users'
import Rights from '@/components/Rights'
import Roles from '@/components/Roles'

// 启动路由
Vue.use(Router)

// 导出路由
const router = new Router({
  routes: [{
      path: '/',
      // 重定向
      redirect: '/login'
    },
    {
      path: '/login',
      name: '登录页',
      component: Login,
    },
    {
      path: '/home',
      name: '后台首页',
      component: Home,
      redirect: '/users',
      children: [{
        path: '/users',
        name: '用户列表',
        component: Users,
      }, {
        path: '/rights',
        name: '权限列表',
        component: Rights
      }, {
        path: '/roles',
        name: '角色列表',
        component: Roles
      }]
    }
  ]
})

router.beforeEach((to,from,next) => {
  if(to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token');
  if(!tokenStr) return next('/login')
  next()
})

export default router

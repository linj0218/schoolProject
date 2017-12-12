import Vue from 'vue'
import Router from 'vue-router'
import {getSStorage} from '@/plugins/util'

const Test = r => require.ensure([], () => r(require('@/pages/test')), 'main')
const Login = r => require.ensure([], () => r(require('@/pages/login')), 'login')
const Index = r => require.ensure([], () => r(require('@/pages/index')), 'main')
const Homepage = r => require.ensure([], () => r(require('@/pages/homepage')), 'main')

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/test', name: 'test', title: '测试', component: Test },
    { path: '/login', name: 'login', title: '登录', component: Login },
    { path: '/', name: 'index', title: '首页', component: Index },
    { path: '/homepage', name: 'homepage', title: '日历', component: Homepage }
  ]
})

router.beforeEach((to, from, next) => {
  // 校验用户是否登录，未登录跳转登陆页
  getSStorage('userinfo') !== false || to.path === '/login' ? next() : next({path: '/login'})
})

export default router

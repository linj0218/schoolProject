import Vue from 'vue'
import Router from 'vue-router'
import { getSStorage, getCookie } from '@/script/util'

const Test = r => require.ensure([], () => r(require('@/pages/test')), 'test')
const Login = r => require.ensure([], () => r(require('@/pages/login')), 'main')
const Index = r => require.ensure([], () => r(require('@/pages/index')), 'main')
const Homepage = r => require.ensure([], () => r(require('@/pages/homepage')), 'main')
const Setting = r => require.ensure([], () => r(require('@/pages/setting')), 'setting')
const Memo = r => require.ensure([], () => r(require('@/pages/memo')), 'setting')
const Logs = r => require.ensure([], () => r(require('@/pages/logs')), 'setting')
const Contacts = r => require.ensure([], () => r(require('@/pages/contacts')), 'main')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/test',
      name: 'test',
      component: Test,
      meta: {
        pageTitle: '测试',
        requiresAuth: false,
        keepAlive: false
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        pageTitle: '登录',
        requiresAuth: false,
        keepAlive: false
      }
    },
    {
      path: '/',
      name: 'index',
      component: Index,
      meta: {
        pageTitle: '首页',
        requiresAuth: true,
        keepAlive: false
      }
    },
    {
      path: '/homepage',
      name: 'homepage',
      component: Homepage,
      meta: {
        pageTitle: '日历',
        requiresAuth: true,
        keepAlive: false
      }
    },
    {
      path: '/setting',
      name: 'setting',
      component: Setting,
      meta: {
        pageTitle: '设置',
        requiresAuth: true,
        keepAlive: false
      }
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: Contacts,
      meta: {
        pageTitle: '通讯录',
        requiresAuth: true,
        keepAlive: false
      }
    },
    {
      path: '/memo',
      name: 'memo',
      component: Memo,
      meta: {
        pageTitle: '备忘录',
        requiresAuth: true,
        keepAlive: false
      }
    },
    {
      path: '/logs',
      name: 'logs',
      component: Logs,
      meta: {
        pageTitle: '日志',
        requiresAuth: true,
        keepAlive: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  // 校验用户是否登录，未登录跳转登陆页
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const username = String(getCookie('USERNAME'));
    const password = String(getCookie('PASSWORD'));
    if (username !== 'undefined' && password !== 'undefined') {
      next();
    } else {
      !getSStorage('userinfo') ? next({path: '/login'}) : next();
    }
  } else {
    next();
  }
})

export default router

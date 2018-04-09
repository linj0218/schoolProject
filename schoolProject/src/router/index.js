import Vue from 'vue'
import Router from 'vue-router'
import {getSStorage} from '@/plugins/util'

const Test = r => require.ensure([], () => r(require('@/pages/test')), 'main')
const Login = r => require.ensure([], () => r(require('@/pages/login')), 'main')
const Index = r => require.ensure([], () => r(require('@/pages/index')), 'main')
const Homepage = r => require.ensure([], () => r(require('@/pages/homepage')), 'main')
const Setting = r => require.ensure([], () => r(require('@/pages/setting')), 'main')
const Contacts = r => require.ensure([], () => r(require('@/pages/contacts')), 'main')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/test',
      name: 'test',
      title: '测试',
      component: Test,
      meta: {
        pageTitle: '测试',
        requiresAuth: false
      }
    },
    {
      path: '/login',
      name: 'login',
      title: '登录',
      component: Login,
      meta: {
        pageTitle: '登录',
        requiresAuth: false
      }
    },
    {
      path: '/',
      name: 'index',
      title: '首页',
      component: Index,
      meta: {
        pageTitle: '首页',
        requiresAuth: true
      }
    },
    {
      path: '/homepage',
      name: 'homepage',
      title: '日历',
      component: Homepage,
      meta: {
        pageTitle: '日历',
        requiresAuth: true
      }
    },
    {
      path: '/setting',
      name: 'setting',
      title: '设置',
      component: Setting,
      meta: {
        pageTitle: '设置',
        requiresAuth: true
      }
    },
    {
      path: '/contacts',
      name: 'contacts',
      title: '通讯录',
      component: Contacts,
      meta: {
        pageTitle: '通讯录',
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  // 校验用户是否登录，未登录跳转登陆页
  if (to.matched.some(record => record.meta.requiresAuth)) {
    !getSStorage('userinfo') ? next({path: '/login'}) : next();
  } else {
    next();
  }
})

export default router

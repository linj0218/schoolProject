import Vue from 'vue'
import Router from 'vue-router'

const Test = r => require.ensure([], () => r(require('@/pages/test')), 'main')
const Login = r => require.ensure([], () => r(require('@/pages/login')), 'main')
const Index = r => require.ensure([], () => r(require('@/pages/index')), 'main')
const Homepage = r => require.ensure([], () => r(require('@/pages/homepage')), 'main')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/test',
      name: 'test',
      component: Test
    }, {
      path: '/login',
      name: 'login',
      component: Login
    }, {
      path: '/',
      name: 'index',
      component: Index
    }, {
      path: '/homepage',
      name: 'homepage',
      component: Homepage
    }
  ]
})

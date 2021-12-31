import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'


Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: {
      name: 'Login'
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import( /* webpackChunkName: "about" */ '../views/About.vue')
    }
  }
]



const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})



router.beforeEach((to, from, next) => {

  if (to.path == '/login') {
    if (window.sessionStorage.getItem('isLogin')) {
      next('/home')
    }
    next()
  } else {
    if (window.sessionStorage.getItem('isLogin')) {
      next()
    } else {
      alert('未登录')
      next('/login')
    }
  }
})

export default router
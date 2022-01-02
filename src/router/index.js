import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Welcome from '../views/mainPage/Welcome.vue'
import Users from '../views/mainPage/Users.vue'
import Roles from '../views/mainPage/rights/Roles.vue'
import Rights from '../views/mainPage/rights/Rights.vue'
import Goods from '../views/mainPage/goods/Goods.vue'
import GoodsParams from '../views/mainPage/goods/GoodsParams.vue'
import Categories from '../views/mainPage/goods/Categories.vue'
import Orders from '../views/mainPage/Orders.vue'
import Reports from '../views/mainPage/Reports.vue'








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
    redirect:'/home/welcome',
    children:[
      {
        path: 'welcome',
        name: 'Welcome',
        component: Welcome
      },
      {
        path: 'users',
        name: 'Users',
        component: Users
      },
      {
        path: 'roles',
        name: 'Roles',
        component: Roles
      },
      {
        path: 'rights',
        name: 'Rights',
        component: Rights
      },
      {
        path: 'goods',
        name: 'Goods',
        component: Goods
      },
      {
        path: 'params',
        name: 'GoodsParams',
        component: GoodsParams
      },
      {
        path: 'categories',
        name: 'Categories',
        component: Categories
      },
      {
        path: 'orders',
        name: 'Orders',
        component: Orders
      },
      {
        path: 'reports',
        name: 'Reports',
        component: Reports
      },

      
    ]
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

/**
 * 解决报错问题：报错显示是路由重复
 * Error: Avoided redundant navigation to current location
 */
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}



router.beforeEach((to, from, next) => {

  if (to.path == '/login') {
    if (window.sessionStorage.getItem('token')) {
      next('/home')
    }
    next()
  } else {
    if (window.sessionStorage.getItem('token')) {
      next()
    } else {
      alert('未登录')
      next('/login')
    }
  }
})

export default router
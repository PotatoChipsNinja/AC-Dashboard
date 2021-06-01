import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Status from '../views/Status.vue'
import Monitor from '../views/Monitor.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    component: Home
  },
  {
    path: '/status',
    component: Status
  },
  {
    path: '/monitor',
    component: Monitor
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  let username = localStorage.getItem('username')
  if (!username && to.path != '/login') {
    next('/login')
  } else if (username && to.path == '/login') {
    next('/')
  } else {
    next()
  }
})

export default router

import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AuthorsView from '@/views/AuthorsView.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/about', name: 'about', component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue') },
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  { path: '/authors', name: 'authors', component: AuthorsView },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

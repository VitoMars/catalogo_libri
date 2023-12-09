import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AuthorsView from '@/views/AuthorsView.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/authors', name: 'authors', component: AuthorsView },
  // Esempio di Lazy Loading
  { path: '/about', name: 'about', component: () => import('../views/AboutView.vue') },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

import { createRouter, createWebHistory } from 'vue-router'

// 1. Ajoute l'import de la page Home
const Home     = () => import('@/views/Home.vue')
const Login    = () => import('@/views/Login.vue')
const Register = () => import('@/views/Register.vue')
const NotFound = () => import('@/views/NotFound.vue')

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})

export default router
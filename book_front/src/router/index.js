import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth' // <-- IMPORT INDISPENSABLE

const Home     = () => import('@/views/Home.vue')
const Login    = () => import('@/views/Login.vue')
const Register = () => import('@/views/Register.vue')
const AllBooks = () => import('@/views/AllBooks.vue')
const AddBook  = () => import('@/views/AddBook.vue')
const Authors  = () => import('@/views/Authors.vue') 
const NotFound = () => import('@/views/NotFound.vue')

const routes = [
  { 
    path: '/', 
    name: 'Home', 
    component: Home 
  },
  { 
    path: '/login', 
    name: 'Login', 
    component: Login 
  },
  { 
    path: '/register', 
    name: 'Register', 
    component: Register 
  },
  { 
    path: '/books', 
    name: 'AllBooks', 
    component: AllBooks 
  },
  { 
    path: '/add-book', 
    name: 'AddBook', 
    component: AddBook,
    meta: { requiresAdmin: true } // <-- AJOUTER CECI
  },
  { 
    path: '/authors', 
    name: 'Authors', 
    component: Authors,
    meta: { requiresAdmin: true } // <-- AJOUTER CECI
  },
  { 
    path: '/:pathMatch(.*)*', 
    name: 'NotFound', 
    component: NotFound 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { 
    return { top: 0 } 
  }
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  // On appelle le store à l'intérieur du garde
  const auth = useAuthStore()

  // 1. Vérification des routes Admin
  if (to.meta.requiresAdmin && !auth.isAdmin) {
    console.warn("Accès refusé : redirection vers l'accueil (Non-Admin)")
    return next('/')
  }

  // 2. Rediriger l'utilisateur déjà connecté s'il tente d'aller sur Login/Register
  if ((to.name === 'Login' || to.name === 'Register') && auth.isLoggedIn) {
    return next('/')
  }

  // 3. Sinon, on laisse passer
  next()
})

export default router
import { createRouter, createWebHistory } from 'vue-router'

// 1. Déclaration des composants (Imports)
const Home     = () => import('@/views/Home.vue')
const Login    = () => import('@/views/Login.vue')
const Register = () => import('@/views/Register.vue')
const AllBooks = () => import('@/views/AllBooks.vue')
const AddBook  = () => import('@/views/AddBook.vue')
const Authors  = () => import('@/views/Authors.vue') 
const NotFound = () => import('@/views/NotFound.vue')

// 2. Définition des routes
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
    component: AddBook 
  },
  { 
    path: '/authors', 
    name: 'Authors', 
    component: Authors 
  },
  { 
    path: '/:pathMatch(.*)*', 
    name: 'NotFound', 
    component: NotFound 
  }
]

// 3. Création de l'instance du router
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { 
    return { top: 0 } 
  }
})

export default router
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:3000',
  headers: { 'Content-Type': 'application/json' }
})

// Intercepteur requête : injecter le token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Intercepteur réponse : rediriger si 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// --- Auth Service ---
export const authService = {
  signup: (data) => api.post('/auth/signup', data),
  signin: (data) => api.post('/auth/signin', data),
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}

// --- Authors Service ---
export const authorService = {
  getAll: () => api.get('/author/all'),
  create: (data) => api.post('/author/add', data),
  getById: (id) => api.get(`/author/search/${id}`),
  update: (id, data) => api.put(`/author/edit/${id}`, data),
  delete: (id) => api.delete(`/author/delete/${id}`)
}

// --- Books Service ---
export const bookService = {
  getAll: () => api.get('/books/all'), 
  getById: (id) => api.get(`/books/search/${id}`),
  create: (data) => api.post('/books/new', data),
  update: (id, data) => api.put(`/books/edit/${id}`, data),
  delete: (id) => api.delete(`/books/delete/${id}`)
}

// --- Favourites Service ---
export const favouriteService = {
  getAll: () => api.get('/favourites'),
  add: (id) => api.post(`/favourites/${id}`),
  remove: (id) => api.delete(`/favourites/${id}`)
}

// CRUCIAL : Cette ligne doit être présente !
export default api
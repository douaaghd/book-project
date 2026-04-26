import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
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

// ── Auth — routes NestJS exactes du prof
export const authService = {
  // POST /auth/signup  — body: { email, username, password, role? }
  signup: (data) => api.post('/auth/signup', data),

  // POST /auth/signin  — body: { identifiant, password }
  //                   — réponse: { ...user, access_token }
  signin: (data) => api.post('/auth/signin', data),

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}

// ── Books
export const bookService = {
  getAll:  ()         => api.get('/books'),
  getById: (id)       => api.get(`/books/${id}`),
  create:  (data)     => api.post('/books', data),
  update:  (id, data) => api.put(`/books/${id}`, data),
  delete:  (id)       => api.delete(`/books/${id}`)
}

// ── Authors
export const authorService = {
  getAll:  ()         => api.get('/authors'),
  getById: (id)       => api.get(`/authors/${id}`),
  create:  (data)     => api.post('/authors', data),
  update:  (id, data) => api.put(`/authors/${id}`, data),
  delete:  (id)       => api.delete(`/authors/${id}`)
}

// ── Favourites
export const favouriteService = {
  getAll: ()   => api.get('/favourites'),
  add:    (id) => api.post(`/favourites/${id}`),
  remove: (id) => api.delete(`/favourites/${id}`)
}

export default api

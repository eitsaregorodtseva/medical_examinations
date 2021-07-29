import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/auth',
    name: 'Auth',
    meta: {
      layout: 'auth',
    },
    component: () => import('../views/AuthNormal.vue'),
  },
  {
    path: '/auth_error',
    name: 'AuthError',
    meta: {
      layout: 'auth',
    },
    component: () => import('../views/AuthError.vue'),
  },
  {
    path: '/dig_sig',
    name: 'DigitalSignature',
    meta: {
      layout: 'auth',
    },
    component: () => import('../views/DSNormal.vue'),
  },
  {
    path: '/dig_sig_error',
    name: 'DigitalSignatureError',
    meta: {
      layout: 'DigitalSignatureError',
    },
    component: () => import('../views/DSError.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

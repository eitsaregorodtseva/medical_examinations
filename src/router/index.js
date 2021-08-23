import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('../views/Auth.vue'),
  },
  {
    path: '/dig_sig',
    name: 'DigitalSignature',
    component: () => import('../views/DigitalSignature.vue'),
  },
  {
    path: '/drivers/:driverId',
    name: 'DriversSingle',
    component: () => import('../views/DriversSingle.vue'),
    props: (route) => ({driverId: Number.parseInt(route.params.driverId, 10) || 0})
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

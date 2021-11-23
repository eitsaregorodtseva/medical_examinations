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
  },
  {
    path: '/exam_data',
    name: 'ExamData',
    component: () => import('../views/ExamData.vue'),
  },
  {
    path: '/expect_patient',
    name: 'ExpectPatient',
    component: () => import('../views/ExpectPatient.vue'),
  },
  {
    path: '/exams_history',
    name: 'ExamsHistory',
    component: () => import('../views/ExamsHistory.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

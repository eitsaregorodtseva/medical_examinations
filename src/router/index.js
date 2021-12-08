import { createRouter, createWebHistory } from 'vue-router'
import { notify } from '@kyvg/vue3-notification'
import  { Role } from '@/helpers/role'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    redirect: to => {
      let role = sessionStorage.getItem('user_role')
      if (!role) {
        return '/auth'
      } else if (role === Role.MedWorker) {
        return '/expect_patient'
      } else if (role === Role.Admin) {
        return '/admin'
      } else if (role === Role.Dispatcher) {
        return '/admin'
      }
    }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('../views/Auth.vue'),
  },
  {
    path: '/admin',
    name: 'AdminHome',
    component: () => import('../views/AdminHome.vue'),
    meta : {
      permittedRoles : [
        Role.Admin,
        Role.Dispatcher
      ]
    }
  },
  {
    path: '/dig_sig',
    name: 'DigitalSignature',
    component: () => import('../views/DigitalSignature.vue'),
    meta : {
      permittedRoles : [
        Role.MedWorker
      ]
    }
  },
  {
    path: '/personnel/:personnelId',
    name: 'PersonnelSingle',
    component: () => import('../views/PersonnelSingle.vue'),
    props: (route) => ({personnelId: Number.parseInt(route.params.personnelId, 10) || 0}),
    meta : {
      permittedRoles : [
        Role.MedWorker,
        Role.Admin,
        Role.Dispatcher
      ]
    }
  },
  {
    path: '/exam_data',
    name: 'ExamData',
    component: () => import('../views/ExamData.vue'),
    meta : {
      permittedRoles : [
        Role.MedWorker,
        Role.Admin,
        Role.Dispatcher
      ]
    }
  },
  {
    path: '/expect_patient',
    name: 'ExpectPatient',
    component: () => import('../views/ExpectPatient.vue'),
    meta : {
      permittedRoles : [
        Role.MedWorker
      ]
    }
  },
  {
    path: '/exams_history',
    name: 'ExamsHistory',
    component: () => import('../views/ExamsHistory.vue'),
    meta : {
      permittedRoles : [
        Role.Admin,
        Role.Dispatcher
      ]
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (!sessionStorage.getItem('user_id') && to.path !== '/auth') {
    // the user is not logged in, redirect to auth page
    next({ name: 'Auth', query: { returnUrl: to.path } })
  } else if (to.meta.permittedRoles) {
    // this route has role restrictions, allow only permitted roles
    let role = sessionStorage.getItem('user_role');
    if (role && to.meta.permittedRoles.indexOf(role) > -1) {
      next()
    } else {
      notify({
        type : 'warn',
        title : 'Доступ запрещен',
        text : '\"' + to.path + '\" недоступно для роли \"' + role + '\"'
      });
      next('/')
    }
  } else {
    next()
  }
})

export default router

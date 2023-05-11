import { createRouter, createWebHistory } from 'vue-router'
import { notify } from '@kyvg/vue3-notification'
import  { Role } from '@/constants/role'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Home/Home.vue'),
    redirect: to => {
      let role = sessionStorage.getItem('user_role')
      if (!role) {
        return '/auth'
      } else {
        if (role == Role.MedWorker){
          return '/new_exams'
        } 
        else{
          return '/statistics'
        }
      }
    }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/pages/Auth/Auth.vue'),
    meta :{
      layout : 'auth'
    }
  },
  {
    path: '/dig_sig',
    name: 'DigitalSignature',
    component: () => import('@/pages/DigitalSignature/DigitalSignature.vue'),
    meta : {
      layout : 'auth',
      permittedRoles : [
        Role.MedWorker
      ]
    }
  },
  {
    path: '/personnel/:personnelId',
    name: 'PersonnelSingle',
    component: () => import('@/pages/PersonnelSingle/PersonnelSingle.vue'),
    props: (route) => ({personnelId: Number.parseInt(route.params.personnelId, 10) || 0}),
    meta : {
      permittedRoles : [
        Role.MedWorker,
        // Role.Admin,
        // Role.Dispatcher
      ]
    }
  },
  {
    path: '/exam_data',
    name: 'ExamData',
    component: () => import('../components/ExamData/ExamData.vue'),
    meta : {
      permittedRoles : [
        Role.MedWorker,
        // Role.Admin,
        // Role.Dispatcher
      ]
    }
  },
  {
    path: '/new_exams',
    name: 'NewExams',
    component: () => import('@/pages/NewExams/NewExams.vue'),
    meta : {
      permittedRoles : [
        Role.MedWorker
      ]
    }
  },
  {
    path: '/exams_history',
    name: 'ExamsHistory',
    component: () => import('@/pages/ExamsHistory/ExamsHistory.vue'),
    meta : {
      permittedRoles : [
        Role.Admin,
        // Role.Dispatcher,
        // Role.MedWorker
      ]
    }
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: () => import('@/components/Statistics/Statistics.vue'),
    meta: {
      permittedRoles: [
        Role.Admin,
        Role.Dispatcher
      ]
    }
  },
  // {
  //   path: '/reports',
  //   name: 'Reports',
  //   component: () => import('../pages/ReportsExport.vue'),
  //   meta: {
  //     permittedRoles: [
  //       Role.Admin,
  //       Role.Dispatcher
  //     ]
  //   }
  // },
  {
    path: '/sms',
    name: 'Sms',
    component: () => import('../pages/Sms/SmsInform.vue'),
    meta: {
      layout: 'auth'
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (
    !sessionStorage.getItem('full_auth') &&
    !(to.path === '/auth' || to.path === '/dig_sig' || to.path === '/sms')
  ) {
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

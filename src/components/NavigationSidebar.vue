<template>
  <q-drawer
    show-if-above
    :width="200"
    :breakpoint="1000"
    bordered
    class="bg-grey-1"
  >
    <q-scroll-area class="fit">
      <q-list>
        <template
          v-for="(menuItem, index) in thisRolesMenu"
          :key="index"
        >
          <q-item
            v-ripple
            clickable
            :active="$route.path.indexOf(menuItem.link) > -1"
            @click="$router.push(menuItem.link)"
            :disable="menuItem.disable"
          >
            <q-item-section avatar>
              <q-icon :name="menuItem.icon" />
            </q-item-section>
            <q-item-section>
              {{ menuItem.label }}
            </q-item-section>
          </q-item>
          <q-separator
            v-if="menuItem.separator"
            :key="'sep' + index"
          />
        </template>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script>
import { Role } from '@/helpers/role'
const menuList = [
  {
    icon: 'home',
    label: 'Главная',
    separator: true,
    roles: [
      ],
    link : '/'
  },
  {
    icon: 'medical_services',
    label: 'Новые осмотры',
    separator: false,
    roles: [
        Role.MedWorker
      ],
    link: '/new_exams'
  },
  {
    icon: 'history',
    label: 'История осмотров',
    separator: true,
    roles: [
        Role.Admin,
        Role.Dispatcher,
        Role.MedWorker
      ],
    link: '/exams_history'
  },

  {
    icon: 'badge',
    label: 'Работники',
    separator: false,
    roles: [
        Role.Admin,
        Role.Dispatcher,
      ],
    link: '/personnel/1'
  },
  {
    icon: 'assessment',
    label: 'Статистика',
    separator: false,
    roles: [
        Role.Admin,
        Role.Dispatcher
      ],
    link: '/statistics',
  },
  {
    icon: 'file_present',
    label: 'Отчеты',
    separator: false,
    roles: [
        Role.Admin,
        Role.Dispatcher
      ],
    link: '/reports',
  },
]
export default {
    data () { return {
        role : sessionStorage.getItem('user_role'),
    }},
    computed : {
      thisRolesMenu () {
        return menuList.filter(i => i.roles.indexOf(this.role) > -1)
      },
    }

}
</script>

<style>

</style>

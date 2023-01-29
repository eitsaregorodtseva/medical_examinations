<template>
  <q-tabs
    :model-value="modelValue"
    dense
    outside-arrows
    mobile-arrows
    active-color="white"
    active-bg-color="dark"
    active-radius="20px"
    indicator-color="transparent"
    align="justify"
    style="width: 90%"
    no-caps
    @update:model-value="value => $emit('update:modelValue', value)"
  >
    <template
      v-for="(menuItem, index) in thisRolesMenu"
      :key="index"
    >
      <q-tab
        :name="menuItem.name"
        :label="menuItem.label"
      />
    </template>
  </q-tabs>
</template>
<script>
import { Role } from '@/helpers/role'
const navigationList = [
    {
        name: "main",
        label: "Главная",
        roles: [
            Role.Admin,
            Role.Dispatcher,
        ],
    },
    {
        name: "documents",
        label: "Документы",
        roles: [
            Role.Admin,
            Role.Dispatcher,
        ],
    },
    {
        name: "1c",
        label: "1С",
        roles: [
            Role.Admin,
            Role.Dispatcher,
        ],
    },
    {
        name: "medworkers",
        label: "Медики",
        roles: [
            Role.Admin,
        ],
    },
    {
        name: "applications",
        label: "Заявки",
        roles: [
            Role.Admin,
            Role.Dispatcher
        ],
    },
    {
        name: "settings",
        label: "Настройки",
        roles: [
            Role.Admin,
            Role.Dispatcher
        ],
    },
    {
        name: "help",
        label: "Справка",
        roles: [
            Role.Admin,
            Role.Dispatcher
        ],
    },
]
export default {
    props: {
    modelValue: {
      type: String,
      default: 'main'
    }
  },
  emits: {
    'update:modelValue': () => { return true }
  },
    data() {
        return {
            role: sessionStorage.getItem('user_role'),
        }
    },
    computed: {
        thisRolesMenu() {
            return navigationList.filter(i => i.roles.indexOf(this.role) > -1)
        },
    }

}
</script>
<style scoped>
.q-tabs--dense .q-tab {
    border-radius: 5px;
}
</style>
<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <q-page>
    <div class="q-pa-md q-ml-xl">
      <q-tabs 
        v-model="tab" 
        dense 
        active-color="white" 
        active-bg-color="dark"
        active-radius="20px" 
        indicator-color="transparent" 
        align="justify"
        style="width: 90%"
      >
        <q-tab name="main" label="Главная"></q-tab>
        <q-tab name="documents" label="Документы"></q-tab>
        <q-tab name="1c" label="1С"></q-tab>
        <q-tab name="medworkers" label="Медики"></q-tab>
        <q-tab name="applications" label="Заявки"></q-tab>
        <q-tab name="settings" label="Настройки"></q-tab>
        <q-tab name="help" label="Справка"></q-tab>
      </q-tabs>
      
      <q-tab-panels v-model="tab">
        <q-tab-panel name="main">
          <div class="q-py-md row">
            <q-btn-toggle
              v-model="model" 
              toggle-color="dark" 
              :options="[
                {label: 'Сегодня', value: 'today'},
                {label: 'Месяц', value: 'month'},
                {label: 'Год', value: 'year'}
              ]" 
              style="border-radius: 5px"
            />
            <!-- <q-input 
              v-model="search" 
              type="search" 
              label="Поиск"
              style="float: right;"
            >
              <template 
                v-slot:append
              >
                <q-icon name="search" />
              </template>
            </q-input> -->
          </div>
          <div 
            class="q-py-xl row q-gutter-xl" 
            style="justify-content: center;"
          >
            <exam-card />
            <terminal-card />
          </div>
        </q-tab-panel>
        <q-tab-panel name="documents" />
        <q-tab-panel name="1c" />
        <q-tab-panel name="medworkers" />
        <q-tab-panel name="applications" />
      
        <q-tab-panel name="settings" />
      
        <q-tab-panel name="help" />
      </q-tab-panels>
    </div>
      
    <!-- <div class="row q-gutter-md col-6">
      <div class="h6 col">Выберите период</div>
      <q-date class="col" v-model="model" range minimal />
      <input
        v-model="dates.from"
        class="col"
        type="date"
        required
      >
      <input
        v-model="dates.to"
        class="col"
        type="date"
        required
      >
      <button @click="updateOrganizationsTable" class="col btn_normal">Показать</button>
    </div>
    <organizations-statistics-table
      v-show="showTable"
      :organizations="organizationsList"
      :dates="dates"
      :user_id="user_id"
      height="80vh"
    /> -->
  </q-page>
</template>

<script>
// import OrganizationsStatisticsTable from '@/components/OrganizationsStatisticsTable.vue'
import ExamCard from '@/views/ExamCard.vue'
import TerminalCard from '@/views/TerminalCard.vue'
import { getAllOrganizationsStats, getOneOrganizationStats } from '@/api/organizations.api.js'
import moment from 'moment'
import { ref } from 'vue'

export default {
  components : {
        // OrganizationsStatisticsTable,
        ExamCard,
        TerminalCard
    },
    // setup() {
    //   return {
    //     tab: ref("main"),
    //     model: ref("one"),
    //   }
    // },
  data () {
    return {
    // model: {from: '2020/07/07', to: '2020/07/17' }
    tab: ref("main"),
    model: ref("today"),
    dates: {from: moment().subtract(1, 'months').format('YYYY-MM-DD'), to: moment().format('YYYY-MM-DD')},
    user_id: null,
    user_organization_id: null,
    organizationsList : [],
    showTable: false,
    
  }},
  mounted() {
        this.populateDataFromStorage()
    },
    methods : {
        populateDataFromStorage() {
            this.user_id = sessionStorage.getItem('user_id')
            this.user_organization_id = sessionStorage.getItem('user_organization_id')
        },

        async updateOrganizationsTable() {
          this.showTable = true
          try {
            var response
            if (this.user_organization_id === 'null') {
              response = await getAllOrganizationsStats(this.user_id, this.dates.from, this.dates.to)
            } else {
              response = await getOneOrganizationStats(this.user_organization_id, this.user_id, this.dates.from, this.dates.to)
            }
            this.organizationsList = response.data
            console.log(response.data)
          } catch (err) {
            console.log(err)
          }
        }


    }
}
</script>

<style> 
  .q-tabs--dense .q-tab {
    border-radius: 5px;
    text-transform: capitalize;
  }
  .q-tab-panel {
    padding-left: 0px;
  }
  .q-btn {
    text-transform: capitalize;
  }
  .q-btn .q-focus-helper {
    display: none;
  }
  .btn {
    cursor: auto;
  }
  .numbers {
    text-align: center;
    font-size: 20px;
  }
  .item-card {
    border-radius: 10px;
  }
</style>

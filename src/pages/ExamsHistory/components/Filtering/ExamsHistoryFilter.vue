<template>
  <q-form
    greedy
    @submit="onSubmit"
  >
    <div 
      v-if="!hideOrganizationSelector"
      class="q-pa-md"
    >
      <div class="q-gutter-md">
        <div class="h6 col">
          Выберите организацию:
        </div>
        <q-select
          v-model="filters.organization"
          filled
          label="Организация"
          :options="organizationOptions"
          option-value="id"
          option-label="name"
          style="width: 250px"
          use-input
          input-debounce="0"
          @update:model-value="OrganizationChangeValueHandler"
          @filter="organizationFilterFunc"
        >
          <template #no-option>
            <q-item>
              <q-item-section class="text-grey">
                Не найдено
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
    </div>
    <div class="q-pa-md">
      <div class="h6 q-pb-sm">
        Выберите период:
      </div>
      <div class="row justify-start">
        <q-input
          v-model="filters.dates.from"
          outlined
          type="date"
          required
        />
        <q-input
          v-model="filters.dates.to"
          outlined
          class="q-px-md"
          type="date"
          required
        />
      </div>
    </div>
    <div class="q-pa-md">
      <div class="q-gutter-sm">
        <div class="h6 col">
          Укажите параметры:
        </div>
        <div class="q-gutter-sm">
          <div class="row items-center">
            <div class="q-pa-sm">
              Сотрудники:
            </div>
            <div class="q-pa-sm">
              <q-option-group
                v-model="filters.personnelRadio"
                :options="personnelRadioOptions"
                color="primary"
                inline
                @update:model-value="ChangePersonnelSelectorState()"
              />
            </div>
            <div class="q-pa-sm">
              <q-select
                v-model="filters.personnelSelection"
                :disable="disablePersonnelSelector"
                filled
                use-chips
                behavior="dialog"
                multiple
                :rules="[ val => val || 'Пожалуйста, выберите сотрудников' ]"
                :options="personnelSelectionOptions"
                option-value="id"
                :option-label="option => GetFullName(option.second_name, option.first_name, option.father_name)"
                label="Сотрудники"
                style="width: 250px"
                use-input
                input-debounce="0"
                @filter="personnelFilterFunc"
              >
                <template #no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Сотрудники не найдены. Проверьте данные организации.
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>
        </div>
        <div class="q-gutter-sm">
          <div class="row items-center">
            <div class="q-pa-sm">
              Тип осмотра:
            </div>
            <div class="q-pa-sm">
              <q-option-group
                v-model="filters.examTypeRadio"
                :options="examTypeRadioOptions"
                color="primary"
                inline
                @update:model-value="ChangeExamTypeSelectorState()"
              />
            </div>
            <div class="q-pa-sm">
              <q-select
                v-model="filters.examTypeSelection"
                :disable="disableExamTypeSelector"
                filled
                :rules="[ val => val || 'Пожалуйста, выберите тип осмотра' ]"
                :options="examTypeSelectionOptions"
                option-label="name"
                label="Тип осмотра"
                style="width: 250px"
              >
                <template #no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Не найдено
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>
        </div>
        <div class="q-gutter-sm">
          <div class="row items-center">
            <div class="q-pa-sm">
              Допуск:
            </div>
            <div class="q-pa-sm">
              <q-option-group
                v-model="filters.admittanceRadio"
                :options="admittanceRadioOptions"
                color="primary"
                inline
                :disable="disableAdmittanceSelector"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="q-pa-md">
      <div class="q-gutter-sm">
        <q-btn
          color="primary"
          label="Применить"
          type="submit"
          :loading="loadingOnSubmitButton"
        />
        <q-btn
          outline
          color="primary"
          label="Сбросить фильтры"
          @click="DropFilters"
        />
      </div>
    </div>
  </q-form>
</template>

<script>
import { getAllOrganizations } from '@/api/organizations.api.js'
import { getPersonnelList } from '@/api/personnel.api.js'
import { getExamsTypesList } from '@/api/exams.api.js'
import { fullName } from '@/constants/names'
import moment from 'moment'
import { Notify } from 'quasar'

function emptyForm() {
    return {
        organization : null,
        personnelSelection : null,
        examTypeSelection : null,
        personnelRadio : 'all',
        examTypeRadio : 'all',
        admittanceRadio : null,
        dates: {
          from: moment().format('YYYY-MM-DD'), 
          to: moment().format('YYYY-MM-DD')
        },
    }
}

export default {
  props: {
    initFilters : {
      type: Object,
      default: emptyForm(),
    },
  },
  data () {return{
    user_id: null,
    user_organization_id: null,
    chosen_organization_id: null,
    filters : emptyForm(),
    filtersEventData: {
      appliedFilters: null,
      requestArgs : null,
    },
    isRoot: false,
    organizationOptions : null,
    receivedOrgOptions: null,
    personnelSelectionOptions : null,
    receivedPersonnel : null,
    examTypeSelectionOptions : null,
    filtered_data : null,
    personnelRadioOptions :  [
        {
          label: 'Все',
          value: 'all'
        },
        {
          label: 'Выбрать',
          value: 'custom'
        }
      ],
    examTypeRadioOptions :  [
        {
          label: 'Все',
          value: 'all'
        },
        {
          label: 'Выбрать',
          value: 'custom'
        }
      ],
    admittanceRadioOptions :  [
        {
          label: 'Все',
          value: null
        },
        {
          label: 'Допущен',
          value: true
        },
        {
          label: 'Не допущен',
          value: false
        }
      ],
    disablePersonnelSelector: true,
    disableExamTypeSelector: true,
    disableAdmittanceSelector: false,
    hideOrganizationSelector: false,
    loadingOnSubmitButton: false
  }},

  watch: {
    'filters.organization': function (newOrg, oldOrg) {
      if (newOrg != oldOrg){
        this.filters.personnelSelection = null
      }
    },
  },

  mounted() {
        this.populateDataFromStorage()
        this.HideOrgSelector()
        if (this.isRoot) {
          this.getOrganizationsList()
        }
        this.getExamsTypes()

        // Initializing saved data.
        this.InitiateFilters()
    },

  methods : {
    InitiateFilters(){
      if (this.initFilters !== null){
        this.filters = Object.assign({}, this.initFilters)
      }
      this.ChangePersonnelSelectorState()
      this.ChangeExamTypeSelectorState()
      this.OrganizationChangeValueHandler()
    },

    OnFilterApplied (filtersEventData) {
      this.$emit('OnFilterApplied', filtersEventData)
    },

    organizationFilterFunc (val, update) {
        if (val === '') {
          update(() => {
            this.organizationOptions = this.receivedOrgOptions
          })
        } else {
          update(() => {
            const needle = val.toLowerCase()
            this.organizationOptions = this.receivedOrgOptions.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
          })
        }
    },

    personnelFilterFunc (val, update) {
        if (val === '') {
          update(() => {
            this.personnelSelectionOptions = this.receivedPersonnel
          })
        } else {
          update(() => {
            const needle = val.toLowerCase()
            this.personnelSelectionOptions = this.receivedPersonnel.filter(v => fullName(v.second_name,  v.first_name, v.father_name).toLowerCase().indexOf(needle) > -1)
          })
        }
    },

    populateDataFromStorage() {
      this.user_id = sessionStorage.getItem('user_id')
      this.user_organization_id = sessionStorage.getItem('user_organization_id')
      if (this.user_organization_id == "null"){
        this.isRoot = true
      }
      else{
        this.isRoot = false
      }
    },

    HideOrgSelector(){
      if (this.isRoot){
        this.hideOrganizationSelector = false
      }
      else{
        this.hideOrganizationSelector = true
        this.chosen_organization_id = this.user_organization_id
        this.getPersonnel()
      }
    },

    ChangeExamTypeSelectorState(){
      if (this.filters.examTypeRadio == "custom"){
        this.disableExamTypeSelector = false
      }
      else{
        this.disableExamTypeSelector = true
      }
    },

    ChangePersonnelSelectorState(){
      if (this.filters.personnelRadio == "custom"){
        this.disablePersonnelSelector = false
      }
      else{
        this.disablePersonnelSelector = true
      }
    },

    OrganizationChangeValueHandler(){
      if (this.filters.organization != null){
        this.chosen_organization_id = this.filters.organization.id
        this.getPersonnel()
      }
    },

    GetFullName(second, first, father){
      return fullName(second, first, father)
    },

    async getOrganizationsList() {
      try {
        var response
        response = await getAllOrganizations(this.user_id)
        this.receivedOrgOptions = response.data
        this.organizationOptions = this.receivedOrgOptions
      } catch (err) {
        console.log(err)
      }
    },

    async getPersonnel() {
      if (this.chosen_organization_id != null){
        try {
          var response
          response = await getPersonnelList(this.user_id, this.chosen_organization_id)
          this.receivedPersonnel = response.data
          this.personnelSelectionOptions = this.receivedPersonnel
        } catch (err) {
          console.log(err)
        }
      }
    },

    async getExamsTypes() {
      try {
        var response
        response = await getExamsTypesList()
        this.examTypeSelectionOptions = response.data
      } catch (err) {
        console.log(err)
      }
    },

    async onSubmit(){
      var date_from = new Date(this.filters.dates.from)
      var date_to = new Date(this.filters.dates.to)
      if (date_from > date_to) {
        Notify.create({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'Неправильно заданы даты. Дата начала осмотров должна быть меньше даты конца осмотров.'
          })
      } else {
        this.loadingOnSubmitButton = true
        date_from = this.filters.dates.from + "T00:00:00"
        date_to = this.filters.dates.to + "T23:59:59.99999"
        var isAdmitted = this.filters.admittanceRadio

        var requestArgs = [
          this.user_id, // 'user_id' -- 0
          null, // 'has_verdict' -- 1
          this.chosen_organization_id, // 'organization_id' -- 2
          null, // 'personnel_id' -- 3
          date_from, // 'date_from' -- 4
          date_to, // 'date_to' -- 5
          null, // 'type' -- 6
          isAdmitted, // 'admittance' -- 7
        ]

        if (this.filters.examTypeRadio == "custom") {
          // set exam type
          requestArgs[6] = this.filters.examTypeSelection.name
        }
        this.filtersEventData.appliedFilters = this.filters
        this.filtersEventData.requestArgs = requestArgs
        this.OnFilterApplied(this.filtersEventData)

        this.loadingOnSubmitButton = false
      }
    },

    DropFilters(){
      this.filtersEventData.appliedFilters = null
      this.filtersEventData.requestArgs = null
      this.OnFilterApplied(this.filtersEventData)
      this.filters = emptyForm()
      this.ChangePersonnelSelectorState()
      this.ChangeExamTypeSelectorState()
      this.OrganizationChangeValueHandler()

      Notify.create({
              color: 'green-5',
              textColor: 'white',
              message: 'Фильтры сброшены'
            })
    }
  }
}
</script>

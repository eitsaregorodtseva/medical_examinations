<template>
  <q-form @submit="onSubmit" greedy>
    <div v-if="!hideOrganizationSelector">
      <div class="q-pa-md">
        <div class="q-gutter-md">
          <div class="h6 col">Выберите организацию:</div>
          <q-select
            v-model="organization"
            filled
            :rules="[ val => val || 'Пожалуйста, выберите организацию' ]"
            label="Организация"
            :options="organizationOptions"
            option-value="id"
            option-label="name"
            style="width: 250px"
            @update:model-value="OrganizationChangeValueHandler"
            use-input
            input-debounce="0"
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
    </div>
    <div class="q-pa-md">
      <div class="h6 q-pb-sm">Выберите период:</div>
      <div class="row justify-start">
        <q-input
          v-model="dates.from"
          outlined
          type="date"
          required
        />
        <q-input
          v-model="dates.to"
          outlined
          class="q-px-md"
          type="date"
          required
        />
      </div>
    </div>
    <div class="q-pa-md">
      <div class="q-gutter-sm">
        <div class="h6 col">Выберите форму отчета:</div>
        <q-option-group
            v-model="reportType"
            :options="reportTypeOptions"
            color="primary"
            @update:model-value="ChangeAdmittanceSelectorState()"
          />
      </div>
    </div>
    <div class="q-pa-md">
      <div class="q-gutter-sm">
        <div class="h6 col">Укажите параметры:</div>
          <div class="q-gutter-sm">
            <div class="row items-center">
              <div class="q-pa-sm">
                Сотрудники:
              </div>
              <div class="q-pa-sm">
                <q-option-group
                  v-model="personnelRadio"
                  :options="personnelRadioOptions"
                  color="primary"
                  inline
                  @update:model-value="ChangePersonnelSelectorState()"
                />
              </div>
              <div class="q-pa-sm">
                <q-select
                :disable="disablePersonnelSelector"
                filled
                use-chips
                behavior="dialog"
                v-model="personnelSelection"
                multiple
                :rules="[ val => val || 'Пожалуйста, выберите сотрудников' ]"
                :options="personnelSelectionOptions"
                option-value="id"
                :option-label="option => GetFullName(option.second_name,  option.first_name, option.father_name)"
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
              <q-select
              filled
              v-model="examTypeSelection"
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
                v-model="admittanceRadio"
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
        <q-btn color="primary" label="Сформировать" type="submit" />
      </div>
    </div>
  </q-form>
</template>

<script>
import { getAllOrganizations } from '@/api/organizations.api.js'
import { getPersonnelList } from '@/api/personnel.api.js'
import { getExamsTypesList, getExamsHistoryAll } from '@/api/exams.api.js'
import { fullName, nameWithInitials } from '@/helpers/names'
import moment from 'moment'
import { Notify } from 'quasar'
import * as FileSaver from "file-saver";
import JsExcelTemplate from "js-excel-template/browser/browser";
//import exams_report_template from "@/assets/excel_templates/exams_report_template.xlsx"

export default {
  data () {return{
    //exams_report_template : exams_report_template,
    user_id: null,
    user_organization_id: null,
    chosen_organization_id: null,
    isRoot: false,
    organization: null,
    organizationOptions : null,
    receivedOrgOptions: null,
    personnelSelection: null,
    personnelSelectionOptions : null,
    receivedPersonnel : null,
    examTypeSelection: null,
    examTypeSelectionOptions : null,
    reportType : 'examReport',
    personnelRadio : 'all',
    admittanceRadio : null,
    reportTypeOptions : [
        {
          label: 'Журнал регистрации осмотра',
          value: 'examReport'
        },
        {
          label: 'Журнал регистрации водителей, отстраненных от управления транспортным средством',
          value: 'failed_drivers_report'
        }
      ],
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
    dates: {from: moment().subtract(1, 'months').format('YYYY-MM-DD'), to: moment().format('YYYY-MM-DD')},
    disablePersonnelSelector: true,
    disableAdmittanceSelector: false,
    hideOrganizationSelector: false,
  }},

  watch: {
    organization(newOrg, oldOrg) {
      if (newOrg != oldOrg){
        this.personnelSelection = null
      }
    }
  },

  mounted() {
        this.populateDataFromStorage()
        this.HideOrgSelector()
        if (this.isRoot) {
          this.getOrganizationsList()
        }
        this.getExamsTypes()
    },
  
  methods : {
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

    ChangeAdmittanceSelectorState(){
      if (this.reportType == "failed_drivers_report"){
        this.disableAdmittanceSelector = true
      }
      else{
        this.disableAdmittanceSelector = false
      }
    },

    ChangePersonnelSelectorState(){
      if (this.personnelRadio == "custom"){
        this.disablePersonnelSelector = false
      }
      else{
        this.disablePersonnelSelector = true
      }
    },

    OrganizationChangeValueHandler(){
      if (this.organization != null){
        this.chosen_organization_id = this.organization.id
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
      var date_from = new Date(this.dates.from)
      var date_to = new Date(this.dates.to)
      if (date_from > date_to) {
        Notify.create({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'Неправильно заданы даты. Дата начала осмотров должна быть меньше даты конца осмотров.'
          })
      } else {
        date_from = this.dates.from + "T00:00:00"
        date_to = this.dates.to + "T00:00:00"

        var examsFromURL = []
        var isAdmitted = this.admittanceRadio
        var excelTemplatePath
        var excelOutputName

        if (this.reportType == "examReport") { 
          excelTemplatePath = "/excel_templates/exams_report_template.xlsx"
          excelOutputName = "Журнал_регистрации_осмотра.xlsx"
        } else{
          isAdmitted = false
          excelTemplatePath = "/excel_templates/suspended_drivers_template.xlsx"
          excelOutputName = "Журнал_осмотров_отстранненых_водителей.xlsx"
        }
        
        if (this.personnelRadio == "custom"){
          for (var i = 0; i < this.personnelSelection.length; i++){
            var response = await getExamsHistoryAll(this.user_id, null,
            this.chosen_organization_id, this.personnelSelection[i].pers_id, date_from,
            date_to, this.examTypeSelection.name, isAdmitted)
            examsFromURL = examsFromURL.concat(response.data)
          }
        } else{
          var response = await getExamsHistoryAll(this.user_id, null,
          this.chosen_organization_id, null, date_from,
          date_to, this.examTypeSelection.name, isAdmitted)
          examsFromURL = response.data
        }
        
        if (examsFromURL.length <= 0){
          Notify.create({
            color: 'warning',
            textColor: 'white',
            icon: 'warning',
            message: 'Результаты по заданным фильтрам не найдены'
          })
        } else {
          var exams = this.createCorrectExamsArray(examsFromURL)
          const fetchTable = await fetch(excelTemplatePath)
          const arrayBuffer = await fetchTable.arrayBuffer()
          const excelTemplate = await JsExcelTemplate.fromArrayBuffer(arrayBuffer)
          excelTemplate.set("exams", exams);
          const blob = await excelTemplate.toBlob()
          FileSaver.saveAs(blob, excelOutputName);

          Notify.create({
              color: 'green-5',
              textColor: 'white',
              message: 'Отчет сформирован'
            })
        }
      }
    },

    createCorrectExamsArray(oldExams){
      var newExams = []
      var oneExam = {}
      for (var i = 0; i < oldExams.length; i++){        
        oneExam.exam_id = oldExams[i].exam_id
        oneExam.date = oldExams[i].exam_datetime.slice(0,10)
        oneExam.time = oldExams[i].exam_datetime.slice(11,16)
        oneExam.pers_name = fullName(oldExams[i].second_name, oldExams[i].first_name, oldExams[i].father_name)
        oneExam.pers_number = oldExams[i].pers_number
        oneExam.date_of_birth = oldExams[i].date_of_birth
        oneExam.gender = oldExams[i].gender
        if (oldExams[i].complaints != null){
          oneExam.complaints_all = oldExams[i].complaints.replace(/[^a-zа-яё\s,]/gi, '');
        } else{
          oneExam.complaints_all = "Нет"
        }
        oneExam.pressure = oldExams[i].pressure_upper + "/" + oldExams[i].pressure_lower
        oneExam.heart_rate = oldExams[i].heart_rate
        oneExam.temperature = oldExams[i].temperature.toFixed(1)
        oneExam.alcohol = oldExams[i].alcohol
        oneExam.psycho = "Отсутств"
        oneExam.factors = "Отсутств"
        oneExam.med_name_with_initials = nameWithInitials(oldExams[i].med_second_name, oldExams[i].med_first_name, oldExams[i].med_father_name)
        oneExam.med_el_siignature = oldExams[i].med_el_signature
        oneExam.pers_name_with_initials = nameWithInitials(oldExams[i].second_name, oldExams[i].first_name, oldExams[i].father_name)

        newExams.push(oneExam)
        oneExam = {}
      }

      return newExams
    }
  }
}
</script>

<style>

</style>

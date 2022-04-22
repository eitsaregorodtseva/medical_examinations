<template>
  <div
    class="modal fade"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered ">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ title }}
          </h5>
          <!-- Button has unique id to tell instances apart when clicking it from the script -->
          <button
            :id="'closeButton-' + uuid"
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <form @submit.prevent="onSubmit">
          <div class="modal-body">
            <div class="input-group input-group-sm mb-2">
              <label
                for="inputPersNumber"
                class="input-group-text w-25"
              >Таб. №</label>
              <input
                id="inputPersNumber"
                v-model.trim="personnel_info.pers_number"
                type="text"
                class="form-control"
                required
              >
            </div>

            <hr>

            <div class="input-group input-group-sm mb-2">
              <label
                for="inputSecondName"
                class="input-group-text w-25"
              >Фамилия</label>
              <input
                id="inputSecondName"
                v-model.trim="personnel_info.second_name"
                type="text"
                class="form-control"
                required
              >
            </div>
            <div class="input-group input-group-sm mb-2">
              <label
                for="inputFirstName"
                class="input-group-text w-25"
              >Имя</label>
              <input
                id="inputFirstName"
                v-model.trim="personnel_info.first_name"
                type="text"
                class="form-control"
                required
              >
            </div>
            <div class="input-group input-group-sm mb-2">
              <label
                for="inputFatherName"
                class="input-group-text w-25"
              >Отчество</label>
              <input
                id="inputFatherName"
                v-model.trim="personnel_info.father_name"
                type="text"
                class="form-control"
              >
            </div>

            <hr>

            <div class="form-check-inline">
              Пол:
            </div>
            <div class="form-check form-check-inline">
              <input
                id="inputGenderMale"
                v-model="personnel_info.gender"
                class="form-check-input"
                type="radio"
                name="inputGender"
                value="м"
                checked
              >
              <label
                class="form-check-label"
                for="inputGenderMale"
              >Муж</label>
            </div>
            <div class="form-check form-check-inline">
              <input
                id="inputGenderFemale"
                v-model="personnel_info.gender"
                class="form-check-input"
                type="radio"
                name="inputGender"
                value="ж"
              >
              <label
                class="form-check-label"
                for="inputGenderFemale"
              >Жен</label>
            </div>

            <hr>

            <div class="input-group input-group-sm mb-2">
              <label
                for="inputDateOfBirth"
                class="input-group-text"
              >Дата рождения</label>
              <input
                id="inputDateOfBirth"
                v-model="personnel_info.date_of_birth"
                type="date"
                class="form-control"
                required
              >
              <label
                for="inputDateOfBirth"
                class="input-group-text"
              >
                возраст: {{ $moment().diff(personnel_info.date_of_birth, 'years') || ' ' }}
              </label>
            </div>

            <hr>

            <div class="form-check form-switch">
              <label
                class="form-check-label"
                for="switchConsent"
              >Согласие на обработку данных</label>
              <input
                id="switchConsent"
                v-model="personnel_info.processing_consent"
                class="form-check-input"
                type="checkbox"
              >
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn_error"
              data-bs-dismiss="modal"
            >
              Отмена
            </button>
            <button
              type="submit"
              class="btn_normal"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {addPersonnelRecord, updatePersonnelRecord} from '@/api/personnel.api'

// For creating unique id
let uuid = 0

function emptyForm() {
    return {
        organization : 1,
        pers_number : '',
        second_name : '',
        first_name : '',
        father_name : '',
        gender: 'м',
        date_of_birth: '',
        processing_consent: false,
    }
}
export default {
    props : {
        title: {
            type: String,
            default: 'Новый водитель'
        },
        initPersonnelInfo : {
            type: Object,
            default: emptyForm(),
            validator(input) {
                return input && 0 !== Object.keys(input).length
            }
        },
        // Set this to true if form is opened for editing personnel. Default: false
        isEditing: {
            type : Boolean,
            default : false
        }
    },

    emits : {
        // Is emmitted after sucsessful POST request
        personnelAdded : (id) => {return true},
        // Is emmited after sucsessful PATCH request
        personnelUpdated : () => {return true}
    },

    data (){ return {
        user_id : null,
        personnel_info : this.initPersonnelInfo,
        uuid : null
    }},

    watch : {
        initPersonnelInfo (new_info) {
            // Assign a copy of data, not object reference
            this.personnel_info = Object.assign({}, new_info)
        }
    },

    mounted() {
        // Generate unique id for this component
        this.uuid = uuid.toString()
        uuid += 1;

        this.populateDataFromStorage()
    },

    methods : {
        populateDataFromStorage() {
            this.user_id = sessionStorage.getItem('user_id')
            this.user_organization_id = sessionStorage.getItem('user_organization_id')
        },
        closeModal () {
            document.getElementById('closeButton-'+this.uuid).click()
        },
        async updatePersonnelInfo(params) {
            try {
                const response = await updatePersonnelRecord(this.user_id, this.personnel_info.pers_id, params)
                // On success
                this.$emit('personnelUpdated')
                this.closeModal()

            } catch (err) {}
        },
        async addPersonnel(){
            try {
                if (this.user_organization_id !== "null")
                  this.personnel_info.organization = this.user_organization_id
                const response = await addPersonnelRecord(this.user_id, this.personnel_info)
                const results = response.data
                // On success
                this.$emit('personnelAdded', results.id)
                this.closeModal()
                this.personnel_info = emptyForm()
            } catch (err) {}
        },
        onSubmit() {
            if (this.isEditing) {
                let changedParams = this.findChanges(this.initPersonnelInfo, this.personnel_info)
                if (0 === Object.keys(changedParams).length) {
                    this.closeModal()
                } else {
                    this.updatePersonnelInfo(changedParams)
                }
            } else {
                this.addPersonnel()
            }
        },
        findChanges (oldObj, newObj) {
            let diff = {}
            let key
            for (key in oldObj) {
                // Skip Objects, comparing only simple values
                let type = Object.prototype.toString.call(oldObj[key])
                if (type != '[object Object]') {
                    if (oldObj[key] != newObj[key]) {
                        diff[key] = newObj[key]
                    }
                }
            }
            return diff
        },
    }
}
</script>

<style>
.input-group-text {
    color: inherit
}
.form-check-input:checked {
    color: #3C61E9;
    border-color: #3C61E9;
}
</style>

<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="value => $emit('update:modelValue', value)"
    @reset="personnel_info = Object.assign({}, initPersonnelInfo)"
  >
    <q-card>
      <q-toolbar class="bg-white">
        <q-toolbar-title>{{ title }}</q-toolbar-title>
        <q-btn
          v-close-popup
          icon="close"
          flat
          @click="$emit('update:modelValue', false)"
        />
      </q-toolbar>
      <q-card-section>
        <q-form class="q-gutter-sm" greedy @submit="onSubmit">
          <q-input
            v-model.trim="personnel_info.pers_number"
            label="Таб. №"
            :rules="[val => val.length > 0 || 'Введите текст']"
          />
          <q-input
            v-model.trim="personnel_info.second_name"
            label="Фамилия"
            dense
            :rules="[val => val.length > 0 || 'Введите текст']"
          />
          <q-input
            v-model.trim="personnel_info.first_name"
            label="Имя"
            dense
            :rules="[val => val.length > 0 || 'Введите текст']"
          />
          <q-input
            v-model.trim="personnel_info.father_name"
            label="Отчество"
            dense
          />
          <div class="row items-center">
            <div class="q-pr-md"> Пол: </div>
            <q-option-group
              v-model="personnel_info.gender"
              :options="[
                { label: 'Муж', value: 'м' },
                { label: 'Жен', value: 'ж' }
              ]"
              inline
              dense
            />
          </div>
          <q-input
            v-model.trim="personnel_info.date_of_birth"
            label="Дата рождения"
            type="date"
            dense
            lazy-rules="ondemand"
            :rules="[
              val => $moment(val).isValid() || 'Неверная дата',
              val => $moment().diff(val, 'years') < 99 || 'Слишком ранняя дата',
              val => $moment().diff(val, 'years') > 16 || 'Слишком поздняя дата'
            ]"
          >
            <template #after>
              <div class="text-caption self-end text-center">
                возраст: {{ $moment().diff(personnel_info.date_of_birth, 'years') || ' ' }}
              </div>
            </template>
          </q-input>
          <q-toggle
            v-model="personnel_info.processing_consent"
            label="Согласие на обработку данных"
            left-label
          />
          <div class="">
            <q-btn
              class="btn_error"
              rounded
              type="reset"
              @click="$emit('update:modelValue', false)"
            >
              Отмена
            </q-btn>
            <q-btn
              type="submit"
              rounded
              class="btn_normal"
            >
              Сохранить
            </q-btn>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import {addPersonnelRecord, updatePersonnelRecord} from '@/api/personnel.api'

// For creating unique id
let uuid = 0

function emptyForm() {
    return {
        organization : null,
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
        },
        modelValue: {
          type : Boolean,
          default : false
        }
    },

    emits : {
        // Is emmitted after sucsessful POST request
        personnelAdded : (id) => {return true},
        // Is emmited after sucsessful PATCH request
        personnelUpdated : () => {return true},
        'update:modelValue' : () => {return true},
    },

    data (){ return {
        user_id : this.$store.state.user.id,
        user_organization_id: this.$store.state.user.organization_id,
        personnel_info : Object.assign({}, this.initPersonnelInfo),
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
    },

    methods : {
        closeModal () {
            this.$emit('update:modelValue', false)
        },
        async updatePersonnelInfo(params) {
            try {
                const response = await updatePersonnelRecord(this.user_id, this.personnel_info.pers_id, params)
                // On success
                this.$emit('personnelUpdated')
                this.closeModal()

            } catch (err) {
              this.$notify({
                type : 'error',
                title : 'Ошибка',
                text : 'Не удалось обновить информацию'
              });
            }
        },
        async addPersonnel(){
            try {
                if (this.user_organization_id !== "null") {
                  this.personnel_info.organization = this.user_organization_id
                } else if (this.$store.state.chosenOrganization) {
                  this.personnel_info.organization = this.$store.state.chosenOrganization.id
                } else {
                  this.$notify({
                    type : 'warn',
                    title : 'Не выбрана организация',
                  });
                }
                const response = await addPersonnelRecord(this.user_id, this.personnel_info)
                const results = response.data
                // On success
                this.$emit('personnelAdded', results.id)
                this.closeModal()
                this.personnel_info = emptyForm()
            } catch (err) {
              this.$notify({
                type : 'error',
                title : 'Ошибка',
                text : 'Не удалось добавить работника'
              });
            }
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
/* .input-group-text {
    color: inherit
}
.form-check-input:checked {
    color: #3C61E9;
    border-color: #3C61E9;
} */
</style>

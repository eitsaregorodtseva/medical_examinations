<template>
  <q-dialog 
    v-model="dialogState" 
    persistent
  >
    <q-card class="q-px-md">
      <q-card-section class="row" />

      <q-card-section class="column">
        <div class="column items-center text-center">
          <div 
            class="text-h6 q-mb-md" 
            style="font-weight: 600"
          >
            Подтверждение номера телефона
          </div>
          <div v-if="!code_approving">
            <div>Введите 4-значный код, который мы отправили</div><div> на номер {{ tel }}</div>
            <div 
              v-if="timer.seconds !== '00'"
              class="q-my-md"
              style="font-weight: 600"
            >
              Повторная отправка доступна через {{ timer.minutes }}:{{ timer.seconds }}
            </div>
                
            <div class="row q-gutter-sm q-mt-md justify-center">
              <q-input 
                ref="first_field"
                v-model="first_number"
                input-class="text-center"
                dense
                outlined 
                :autofocus="true"
                style="width: 40px" 
                mask="#" 
                @update:model-value="focusNextInput" 
              />
              <q-input 
                ref="second_field"
                v-model="second_number"
                input-class="text-center"
                dense 
                outlined 
                style="width: 40px" 
                mask="#" 
                @update:model-value="focusNextInput"
              />
              <q-input 
                ref="third_field"
                v-model="third_number"
                input-class="text-center"
                dense
                outlined
                style="width: 40px" 
                mask="#"
                @update:model-value="focusNextInput"
              />
              <q-input 
                ref="forth_field"
                v-model="forth_number"
                input-class="text-center"
                dense
                outlined
                style="width: 40px" 
                mask="#"
                @update:model-value="focusNextInput"
              />
            </div>
                  
            <div class="q-mt-md col-6"> 
              <q-btn
                v-if="timer.seconds === '00'"
                style="float: right"
                flat
                icon="refresh"
                @click="submitForm"
              >
                Отправить снова
              </q-btn>
            </div>
        
            <q-btn 
              class="q-mt-md" 
              flat 
              @click="closePopupDialog"
            >
              Изменить данные
            </q-btn>
          </div>
          <div v-else>
            <q-spinner
              class="q-mb-md"
              color="dark"
              size="3em"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    dialogState: { 
      type: Boolean, 
      default: true
    },
    tel: { 
      type: String, 
      default: ''
    },
    timer: Object,
    codeApproving: Boolean,
    closePopupDialog: Function,
    // focusNextInput: Function,
  },
  data() {
    return {
      first_number: ref(""),
      second_number: ref(""),
      third_number: ref(""), 
      forth_number: ref(""),

      code: "",

      mounted() {
        this.first_f(); 
      },
      methods: {
        focusNextInput() {
          if ((/^[0-9]$/).test(this.first_number)) {
            this.$refs.second_field.$el.focus()
          }
          if ((/^[0-9]$/).test(this.first_number) && (/^[0-9]$/).test(this.second_number)) {
            this.$refs.third_field.$el.focus()
          }
          if ((/^[0-9]$/).test(this.first_number) && (/^[0-9]$/).test(this.second_number) && (/^[0-9]$/).test(this.third_number)) {
            this.$refs.forth_field.$el.focus()
          }
          if ((/^[0-9]$/).test(this.first_number) && (/^[0-9]$/).test(this.second_number) && (/^[0-9]$/).test(this.third_number) && (/^[0-9]$/).test(this.forth_number)) {
            this.code = this.first_number + this.second_number + this.third_number + this.forth_number;
            // this.approveCode();
          }
        },

        first_f() {
          console.log(this.dialog_state)
        },
    //     closePopupDialog() {
    //       this.dialog_state = false;
    //       this.person_last_state = Object.assign({}, this.person);
    // },
      }
    }
  }
}
</script>
<style scoped>
.q-btn {
  text-transform: none;
}
.q-btn >>> .q-icon {
  margin-right: 10px;
}
.q-btn:disabled {
  background: transparent;
}
</style>
<template>
  <q-dialog 
    v-model="dialog"
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
          <div v-if="!approving">
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
                @click="$emit('submit')"
              >
                Отправить снова
              </q-btn>
            </div>
            <q-btn 
              class="q-mt-md" 
              flat 
              @click="$emit('close')"
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
    tel: { 
      type: String, 
      default: ''
    },
    approving: { 
      type: Boolean, 
      default: false
    },
    timer: {
      type: Object,
      default() {
        return {
          minutes: "00",
          seconds: "20",
          interval: 0,
        }
      }
    }
  },
  emits: ['close', 'submit', 'approveCode'],
  data() {
    return {
      dialog: ref(true),
      first_number: ref(""),
      second_number: ref(""),
      third_number: ref(""), 
      forth_number: ref(""),
      code: "",
    }
  },
  updated() {
    this.first_number = "";
    this.second_number = "";
    this.third_number = "";
    this.forth_number = "";
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
        this.$emit('approveCode', this.code);
        this.$refs.first_field.$el.focus();
      }
    },
  },
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
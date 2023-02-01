<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="value => $emit('update:modelValue', value)"
  >
    <q-card
      style="max-width: 3000px"
      class="q-pa-xs col"
    >
      <q-card-section
        v-if="period !== 'today'"
        class="row q-pa-xs"
      >
        <q-btn
          unelevated
          :ripple="false"
          flat
          icon="west"
          @click="$emit('update:modelValue', false)"
        />
      </q-card-section>
      <q-card-section
        v-else
        class="row q-pa-xs"
      >
        <div class="col">
          <q-btn
            unelevated
            :ripple="false"
            style="float: right"
            flat
            icon="close"
            @click="$emit('update:modelValue', false)"
          />
        </div>
      </q-card-section>
      <q-card-section class="row q-pt-xs justify-center">
        <div v-if="examsList.length > 0">
          <exams-history-table
            :exams="examsList"
            height="80vh"
          />
        </div>
        <div
          v-else
          class="q-ma-lg"
        >
          <q-spinner-oval
            color="dark"
            size="3em"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
import ExamsHistoryTable from '../ExamsHistoryTable.vue';
export default {
  components: {
    ExamsHistoryTable
  },
  props: {
    period: {
      type: String,
      default: ""
    },
    examsList: {
      type: Array,
      default() {
        return []
      }
    },
    modelValue: {
      type : Boolean,
      default : false
    },
  },
  emits: {
    'update:modelValue': () => { return true }
  },
}
</script>
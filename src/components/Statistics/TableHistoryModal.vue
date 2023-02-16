<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="value => $emit('update:modelValue', value)"
  >
    <q-card
      style="max-width: 3000px; width: 1000px"
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
        <div v-if="itemsList.length > 0">
          <div v-if="itemsType === 'exams'">
            <exams-history-table
              :exams="itemsList"
              height="80vh"
            />
          </div>
          <div v-else>
            <terminals-history-table
              :terminals="itemsList"
              height="80vh"
            />
          </div>
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
import TerminalsHistoryTable from './TerminalsHistoryTable.vue';
export default {
  components: {
    ExamsHistoryTable,
    TerminalsHistoryTable
  },
  props: {
    period: {
      type: String,
      default: ""
    },
    itemsList: {
      type: Array,
      default() {
        return []
      }
    },
    modelValue: {
      type : Boolean,
      default : false
    },
    itemsType: {
      type: String,
      default: ''
    }
  },
  emits: {
    'update:modelValue': () => { return true }
  },
}
</script>
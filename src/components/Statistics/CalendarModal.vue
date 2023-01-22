<template>
  <q-dialog v-model="dialog">
    <q-card class="q-py-md q-px-lg">
      <q-card-section>
        <div class="text-h6">Выбор даты</div>
      </q-card-section>
      <q-card-section>
        <q-btn-toggle
          v-model="periodState"
          toggle-color="dark"
          :options="[
            { label: 'День', value: 'day' },
            { label: 'Период', value: 'period' },
          ]"
          @click="changePeriod"
        />
      </q-card-section>
      <q-card-section>
        <q-date
          v-model="date"
          :locale="locale"
          color="dark"
          :range="range_state"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn @click="updateOrganizationsTable" color="dark">Показать</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: { 
    dialog_state: Boolean,
    date: String,
    periodState: String,
    changePeriod: {type: Function},
    range_state: Boolean,
  },
  data() {
    return {
        dialog: true,
        locale: {
        days: 'Понедельник_Вторник_Среда_Четверг_Пятница_Суббота_Воскресенье'.split('_'),
        daysShort: 'Пн_Вт_Ср_Чт_Пт_Сб_Вс'.split('_'),
        months: 'Январь_Февраль_Март_Апрель_Май_Июнь_Июль_Август_Сентябрь_Октябрь_Ноябрь_Декабрь'.split('_'),
        monthsShort: 'Янв_Фев_Мар_Апр_Май_Июнь_Июль_Авг_Сен_Окт_Ноя_Дек'.split('_'),
      },
    }
  }
};
</script>

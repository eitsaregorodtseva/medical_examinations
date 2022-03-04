<template>
    <q-markup-table class="terminals-stats-table">
        <thead>
            <tr class="app_normal">
                <th v-for="col in columns"
                :key="col.name">
                    {{ col.label }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="term in terminals"
                    :key="term.terminal_serial_number">
                <td class="text-left">{{ term.terminal_serial_number }}</td>
                <td class="text-left">{{ term.terminal_name }}</td>
                <td class="text-left">{{ term.exams_count }}</td>
            </tr>
        </tbody>
    </q-markup-table>
</template>

<script>

const columns = [
  { name: 'terminal_serial_number', label: 'Серийный номер'},
  { name: 'terminal_name', label: 'Название'},
  { name: 'exams_count', label: 'Кол-во осмотров'}
]

export default {
  props: {
    terminals : Array
  },
  data () {return {
    columns: columns
  } }
}

</script>

<style lang="sass" >
.terminals-stats-table

  thead tr:first-child th
    margin: 0
    font-weight: bolder

  thead tr th
    position: sticky
    z-index: 0 !important
  thead tr:first-child th
    top: 0

    /* height of all previous header rows */
    top: 48px
</style> 

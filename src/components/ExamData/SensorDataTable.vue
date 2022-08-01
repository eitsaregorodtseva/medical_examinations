<template>
  <q-markup-table :wrap-cells="true" style="color: inherit">
    <thead>
      <tr>
        <th colspan="3">
          <div class="text-h6">Данные приборов</div>
        </th>
      </tr>
      <tr>
        <th class="text-left" style="font-weight: bold">
          Параметр
        </th>
        <th class="text-center" style="font-weight: bold">
          Значение
        </th>
        <th class="text-center" style="font-weight: bold">
          Норма
        </th>
      </tr>
    </thead>
    <tbody>
      <tr :class="examData.pressure_upper >= 100 && examData.pressure_upper <= 150 ? 'input_normal' : 'bg-red-4 text-white'">
        <td>Верхнее артериальное давление</td>
        <td class="text-center">
          {{ examData.pressure_upper }}
        </td>
        <td class="text-center">100 - 150</td>
      </tr>
      <tr :class="examData.pressure_lower >= 60 && examData.pressure_lower <= 100 ? 'input_normal' : 'bg-red-4 text-white'">
        <td>Нижнее артериальное давление</td>
        <td class="text-center">
          {{ examData.pressure_lower }}
        </td>
        <td class="text-center">60 - 100</td>
      </tr>
      <tr :class="examData.heart_rate >= 54 && examData.heart_rate <= 96 ? 'input_normal' : 'bg-red-4 text-white'">
        <td>Пульс</td>
        <td class="text-center">
          {{ examData.heart_rate }}
        </td>
        <td class="text-center">54 - 96</td>
      </tr>
      <tr :class="examData.alcohol * 100 <= 16 ? 'input_normal' : 'bg-red-4 text-white'">
        <td>Уровень алкоголя</td>
        <td class="text-center">
          {{ examData.alcohol == 0 ? '< 0.16': '> 0.16' }}
        </td>
        <td class="text-center"> {{ '< 0.16' }}</td>
      </tr>
      <tr :class="examData.temperature * 10 >= 355 && examData.temperature * 10 <= 372 ? 'input_normal' : 'bg-red-4 text-white'">
        <td>Температура тела</td>
        <td class="text-center">
          {{ examData.temperature.toPrecision(3) }}
        </td>
        <td class="text-center">35.5 - 37.2</td>
      </tr>
    </tbody>
  </q-markup-table>
</template>

<script>
export default {
    props: {
        examData: Object
    }
}
</script>

<style>

</style>

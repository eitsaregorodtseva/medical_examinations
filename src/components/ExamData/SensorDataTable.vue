<template>
  <div class="fs-4">
    Данные приборов
  </div>
  <table class="table p-2">
    <thead class="text-dark">
      <tr>
        <th scope="col">
          Параметр
        </th>
        <th scope="col">
          Значение
        </th>
        <th scope="col">
          Норма
        </th>
      </tr>
    </thead>
    <tbody>
      <tr :class="examData.pressure_upper >= 100 && examData.pressure_upper <= 150 ? 'input_normal' : 'bg-red-4 text-white'">
        <td>Верхнее артериальное давление</td>
        <td class="right_col">
          {{ examData.pressure_upper }}
        </td>
        <td>100 - 150</td>
      </tr>
      <tr :class="examData.pressure_lower >= 60 && examData.pressure_lower <= 100 ? 'input_normal' : 'bg-red-4 text-white'">
        <td>Нижнее артериальное давление</td>
        <td class="right_col">
          {{ examData.pressure_lower }}
        </td>
        <td> 60 - 100</td>
      </tr>
      <tr :class="examData.heart_rate >= 54 && examData.heart_rate <= 96 ? 'input_normal' : 'bg-red-4 text-white'">
        <td>Пульс</td>
        <td class="right_col">
          {{ examData.heart_rate }}
        </td>
        <td>54 - 96</td>
      </tr>
      <tr :class="examData.alcohol * 100 <= 16 ? 'input_normal' : 'bg-red-4 text-white'">
        <td>Уровень алкоголя</td>
        <td class="right_col">
          {{ examData.alcohol }}
        </td>
        <td> {{ '< 0.16' }}</td>
      </tr>
      <tr :class="examData.temperature * 10 >= 355 && examData.temperature * 10 <= 372 ? 'input_normal' : 'bg-red-4 text-white'">
        <td>Температура тела</td>
        <td class="right_col">
          {{ examData.temperature.toPrecision(3) }}
        </td>
        <td>35.5 - 37.2</td>
      </tr>
    </tbody>
  </table>
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
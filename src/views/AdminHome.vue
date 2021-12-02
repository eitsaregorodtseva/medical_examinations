<template>
  <div class="container h-100">
    <div class="d-flex align-items-center justify-content-between h-100 ">
      <button
        class="btn_normal w-25 p-2"
        @click="$router.push('/drivers/1')"
      >
        <i class="bi bi-person-badge fs-1" />
        <br>
        Водители
      </button>
      <button
        class="btn_normal w-25 p-2"
        @click="$router.push('/exams_history')"
      >
        <i class="bi bi-card-checklist fs-1" />
        <br>
        Осмотры
      </button>
      <button
        class="w-25 p-2"
        disabled
      >
        <i class="bi bi-pc-display-horizontal fs-1" />
        <br>
        Терминалы (скоро)
      </button>
    </div>
  </div>
</template>

<script>

export default {

}
</script>

<style>

</style>

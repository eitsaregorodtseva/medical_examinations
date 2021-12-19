<template>
  <div class="fixed-center h-50 w-50 d-flex flex-column align-items-center">
    <div
      id="ds_rect"
      class="col container h-100 w-100"
      :class="isError ? 'app_error' : 'app_normal'"
    >
      <div class="form-horizontal h-100 d-flex flex-column justify-content-around align-items-center">
        <div id="img_cont">
          <img
            v-if="isError"
            id="img"
            src="@\assets\images\flash-drive(1).png"
          >
          <img
            v-else
            id="img"
            src="@\assets\images\flash-drive.png"
          >
        </div>
        <div
          v-if="isError"
          id="err_txt"
          class="txt_error"
        >
          {{ errorMessage }}
        </div>
        <div
          class="h5 text-center"
          :class="isError ? 'txt_error' : 'txt_normal'"
        >
          Присоедините к компьютеру носитель ключа электронной подписи.
        </div>
        <button
          class="justify-self-end w-25"
          :class="isError ? 'btn_error' : 'btn_normal'"
          type="submit"
          @click="okClicked"
        >
          Готово
        </button>
      </div>
    </div>
    <button
      class="mt-3 nav_btn_normal bg-white w-25 "
      :class="isError ? 'nav_btn_error' : 'nav_btn_normal'"
      @click="back"
    >
      Назад
    </button>
  </div>
</template>

<script>
import { findDevice } from '@/api/rutoken'
export default {
    data: () => ({
        isError: false,
        errorMessage : ''
    }),
    methods: {
        back() {
            this.$router.push('/auth');
        },
        okClicked() {
            var self = this
            findDevice()
                .then( device => {
                        self.isError = false
                        self.$emit('ok', device)
                    },
                    () => { self.isError = true })
        },
    }
}
</script>

<style>

#img {
    width: 129px;
    height: 129px;
    padding: 0;
}

</style>
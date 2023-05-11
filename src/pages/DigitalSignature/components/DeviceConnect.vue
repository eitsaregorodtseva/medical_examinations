<template>
  <app-centered-box :is-error="isError">
    <div
      class="column fit items-center"
      :class="{'input_error' : isError}"
    >
      <div
        id="img_cont"
        class="col-6 row items-center"
      >
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
        class="h5 text-center row items-center col "
        :class="isError ? 'txt_error' : 'txt_normal'"
      >
        Присоедините к компьютеру носитель ключа электронной подписи.
      </div>
      <q-btn
        unelevated
        rounded
        text-color="white"
        class="col-shrink"
        :class="isError ? 'btn_error' : 'btn_normal'"
        style="width:100px; height:40px;"
        label="Ок"
        :loading="spinButton"
        @click="okClicked"
      />
    </div>
    <template #below-box>
      <q-btn
        rounded
        class="nav_btn_normal bg-white"
        :class="isError ? 'nav_btn_error' : 'nav_btn_normal'"
        @click="back"
      >
        Назад
      </q-btn>
    </template>
  </app-centered-box>
</template>

<script>
import { findDevice } from '@/api/rutoken'
import AppCenteredBox from '@/components/AppCenteredBox/AppCenteredBox'
export default {
    components: {
      AppCenteredBox
    },
    data: () => ({
        isError: false,
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
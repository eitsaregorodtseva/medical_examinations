<template>
  <app-centered-box :is-error="isError">
    <div
      class="column fit items-center justify-between"
      :class="{'input_error' : isError}"
    >
      <div class="q-mt-lg text-center">
        <div class="h3 fw-bold">
          Установите Рутокен Плагин и расширение для браузера
        </div>
        <div v-if="isError">
          Компоненты все еще не найдены. <br/> Перезагрузите браузер и попробуйте еще раз.
        </div>
      </div>
      <div class="text-center">
        <div class="q-mb-sm">
          Инструкции по установке на сайте Рутокен:
        </div>
        <a
          href="https://dev.rutoken.ru/pages/viewpage.action?pageId=72451796"
          target="_blank"
        >
          Установка Плагина
          <q-icon name="launch" />
        </a>
        <br />
        <a
          href="https://dev.rutoken.ru/pages/viewpage.action?pageId=72451796#id-%D0%98%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BA%D1%86%D0%B8%D1%8F%D0%BF%D0%BE%D1%83%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BA%D0%B5%D0%A0%D1%83%D1%82%D0%BE%D0%BA%D0%B5%D0%BD%D0%9F%D0%BB%D0%B0%D0%B3%D0%B8%D0%BD%D0%B0-%D0%A3%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BA%D0%B0%D1%80%D0%B0%D1%81%D1%88%D0%B8%D1%80%D0%B5%D0%BD%D0%B8%D1%8F%D0%90%D0%B4%D0%B0%D0%BF%D1%82%D0%B5%D1%80%D0%A0%D1%83%D1%82%D0%BE%D0%BA%D0%B5%D0%BD%D0%9F%D0%BB%D0%B0%D0%B3%D0%B8%D0%BD%D0%B2%D1%80%D0%B0%D0%B7%D0%BB%D0%B8%D1%87%D0%BD%D1%8B%D1%85%D0%B1%D1%80%D0%B0%D1%83%D0%B7%D0%B5%D1%80%D0%B0%D1%85"
          target="_blank"
        >
          Установка расширения
          <q-icon name="launch" />
        </a>
      </div>
      <q-btn
        unelevated
        rounded
        text-color="white"
        :class="isError ? 'btn_error' : 'btn_normal'"
        style="width:100px; height:40px;"
        label="Ок"
        :loading="spinButton"
        @click="okClicked"
      />
    </div>
  </app-centered-box>
</template>

<script>
import { init } from '@/api/rutoken'
import AppCenteredBox from '@/components/AppCenteredBox'
export default {
components : {
  AppCenteredBox
},
emits : ['ok'],
data () { return {
    isError : false,
    spinButton : false
}},
methods : {
    okClicked() {
        this.spinButton = true;
        var self = this
        init()
            .then( () => {
                    self.isError = false
                    self.$emit('ok')
                },
                () => { self.isError = true })
            .finally(() => self.spinButton = false);
    },
}

}
</script>

<style>

</style>

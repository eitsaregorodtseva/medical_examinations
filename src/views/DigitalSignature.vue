<template>
  <q-page>
    <q-inner-loading
      :showing="loading"
      :label="loadingLabel"
      label-class="h6"
      size="72px"
    />
    <plugin-install
      v-if="currentStep === 'plugin-install'"
      @ok="onPluginFound"
    />
    <device-connect
      v-if="currentStep === 'device-connect'"
      @ok="onDeviceConneced"
    />
  </q-page>
</template>

<script>
import * as rutoken from '@/api/rutoken'
import { notify } from '@kyvg/vue3-notification';
import DeviceConnect from '@/components/DigitalSignature/DeviceConnect.vue';
import PluginInstall from '@/components/DigitalSignature/PluginInstall.vue';
export default {
    components: {
      DeviceConnect,
      PluginInstall
    },
    data: () => ({
        dbKey : sessionStorage.getItem('user_el_signature'),
        currentStep: '',
        loading : true,
        loadingLabel : 'Проверка цифровой подписи...'
    }),
    mounted() {
        var self = this;
        rutoken.init()
          .then( () => self.onPluginFound(),
            // rutoken plugin not found
            () => {
              self.currentStep = 'plugin-install';
              self.loading = false;
            });
    },
    methods: {
        onPluginFound() {
          console.log("Поиск устройства...")
          this.currentStep = '';
          this.loading = true;
          this.tryConnectDevice()
        },
        tryConnectDevice() {
          var self = this;
          rutoken.findDevice()
            .then( () => self.onDeviceConneced(),
            // device not found, ask user to connect it
                () => {
                    console.log("Устройство не найдено");
                    self.currentStep = 'device-connect';
                    self.loading = false;
                }
            );
        },
        onDeviceConneced() {
          console.log("Устройство найдено");
          this.currentStep = '';
          this.loading = true;
          this.tryLogin()
        },
        tryLogin() {
          var self = this
          rutoken.login('12345678')
            .then(() => self.onLogin(),
              // Failed with default pin, ask user to enter it
              (reason) => {
                rutoken.handleRutokenError(reason)
                console.log('Авторизация с pin по умолчанию не удалась');
                self.currentStep = 'pin-enter';
                self.loading = false;
              }
            )
        },
        onLogin () {
          console.log('Авторизация на устройстве выполнена');
          this.readCertificate()
        },
        readCertificate () {
          var self = this
          rutoken.readCertificate()
            .then(key => self.validateKey(key),
              (reason) => {
                rutoken.handleRutokenError(reason)
                alert("Не удалось считать сертификат")
              }
            )
        },
        validateKey (key) {
          console.log('Обработка сертификата:', key);
          if (this.dbKey === key) {
            console.log('Сертификат принят');
            this.finishAllChecks();
          } else {
            console.log('Сертификат не принят');
            alert('Цифровая подпись не совпалает с сохраненной!');
            sessionStorage.clear();
            this.$router.push('/auth');
          }
        },
        finishAllChecks() {
            this.currentStep = '';
            this.loading = true;
            sessionStorage.setItem('full_auth', true);
            this.$router.push('/');
        }
    }
}
</script>

<style scoped>

</style>

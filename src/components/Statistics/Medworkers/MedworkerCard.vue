<template>
  <q-card
    class="col-5"
    flat 
    bordered
  >
    <q-item>
      <q-item-section>
        <q-item-label>{{ data.organization_name }}</q-item-label>
      </q-item-section>
    </q-item>
    <q-separator />
    <q-card-section horizontal>
      <q-card-section class="col-6">
        <q-card
          class="col q-mb-md q-pa-md"
          :style="{'cursor': data.all_exams_count ? 'pointer' : 'auto', 'border-radius': '10px'}"
          @click="$emit('show-modal', 'exams', data.organization_id, data.all_exams_count)"
        >
          <div style="font-size: 18px; font-weight: 600; text-align: center">
            Осмотров
          </div>
          <div class="row q-mt-md">
            <div
              class="col-7 q-ml-sm q-mt-sm q-mr-xs"
              style="font-size: 20px; font-weight: 600; text-align: center"
            >
              <div>{{ data.all_exams_count }}</div>
            </div>
            <div class="col-2 q-mr-xs">
              <q-icon
                size="40px"
                name="img:/img/icons/done.svg"
              />
            </div>
          </div>
        </q-card>

        <div 
          class="row"
          style="gap: 16px"
        >
          <div class="row q-gutter-md justify-center">
            <q-card class="item-card q-pa-md">
              <div>Недопуск</div>
              <div class="row">
                <div class="col numbers q-mt-md">
                  <div>{{ data.non_admission_count }}</div>
                </div>
                <div class="col q-mt-sm q-ml-md">
                  <q-icon
                    size="40px"
                    name="img:/img/icons/denied.svg"
                  />
                </div>
              </div>
            </q-card>
            <q-card class="item-card q-pa-md">
              <div>Просрочки</div>
              <div class="row">
                <div class="col numbers q-mt-md">
                  <div>{{ data.alco_count }}</div>
                </div>
                <div class="col q-mt-sm q-ml-md">
                  <q-icon
                    size="45px"
                    name="img:/img/icons/overdue.svg"
                  />
                </div>
              </div>
            </q-card>
          </div>
        </div>
      </q-card-section>

      <q-separator vertical />

      <q-card-section class="col-6">
        <q-card
          class="col q-mb-md q-pa-md justify-center"
          :style="{'cursor': data.terminal_count ? 'pointer' : 'auto', 'border-radius': '10px'}"
          @click="$emit('show-modal', 'terminals', data.organization_id, data.terminal_count)"
        >
          <div style="font-size: 18px; font-weight: 600; text-align: center">
            Работа
          </div>
          <div
            class="col q-mt-md"
            style="display: flex; justify-content: center;"
          >
            <q-icon
              size="40px"
              name="img:/img/icons/work.svg"
            />
          </div>
        </q-card>
        <div
          class="row"
          style="gap: 16px"
        >
          <div class="row q-gutter-md justify-center">
            <q-card class="item-card q-pa-md">
              <div>Часов</div>
              <div class="row">
                <div class="col numbers q-mt-md">
                  <div>{{ data.online }}</div>
                </div>
                <div class="col q-mt-sm q-ml-md">
                  <q-icon
                    size="40px"
                    name="img:/img/icons/clock.svg"
                  />
                </div>
              </div>
            </q-card>
            <q-card class="item-card q-pa-md">
              <div>Дней</div>
              <div class="row">
                <div class="col numbers q-mt-md">
                  <div>{{ data.need_check }}</div>
                </div>
                <div class="col q-mt-sm q-ml-md">
                  <q-icon
                    size="40px"
                    name="img:/img/icons/calendar.svg"
                  />
                </div>
              </div>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default() {
        return {
          medworker_id: 0,
          medworker_name: '',
          days: 0,
          hours: 0,
          exams: 0,
          no_access: 0,
          delays: 0,
        }
      }, 
    },
  },
  emits: ['show-modal'],
};
</script>

<style scoped>
.item-card {
  border-radius: 10px;
  height: 100px;
  width: 121.5px;
}
.numbers {
  text-align: center;
  font-size: 20px;
}
.q-card {
  max-width: 590px;
}
</style>
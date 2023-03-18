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
              <div>План</div>
              <div class="row">
                <div class="col numbers q-mt-md">
                  <div>{{ data.new_exams_count }}</div>
                </div>
                <div class="col q-mt-sm q-ml-md">
                  <q-icon
                    size="40px"
                    name="img:/img/icons/plan.svg"
                  />
                </div>
              </div>
            </q-card>
            <q-card class="item-card q-pa-md">
              <div>Алкоголь</div>
              <div class="row">
                <div class="col numbers q-mt-md">
                  <div>{{ data.alco_count }}</div>
                </div>
                <div class="col q-mt-sm q-ml-md">
                  <q-icon
                    size="40px"
                    name="img:/img/icons/alcohol.svg"
                  />
                </div>
              </div>
            </q-card>
          </div>
          <div class="row q-gutter-md justify-center">
            <q-card class="item-card q-pa-md">
              <div>Допуски</div>
              <div class="row">
                <div class="col numbers q-mt-md">
                  <div>{{ data.admission_count }}</div>
                </div>
                <div class="col q-mt-sm q-ml-md">
                  <q-icon
                    size="40px"
                    name="img:/img/icons/ok.svg"
                  />
                </div>
              </div>
            </q-card>
            <q-card class="item-card q-pa-md">
              <div>Давление/пульс</div>
              <div class="row">
                <div class="col numbers">
                  <div>{{ data.pressure_heart_count }}</div>
                </div>
                <div class="col q-ml-md">
                  <q-icon
                    size="35px"
                    name="img:/img/icons/pressure.svg"
                  />
                </div>
              </div>
            </q-card>
          </div>
          <div class="row q-gutter-md justify-center">
            <q-card class="item-card q-pa-md">
              <div>Недопуск, всего</div>
              <div class="row">
                <div class="col numbers">
                  <div>{{ data.non_admission_count }}</div>
                </div>
                <div class="col q-ml-md">
                  <q-icon
                    size="35px"
                    name="img:/img/icons/denied.svg"
                  />
                </div>
              </div>
            </q-card>
            <q-card class="item-card q-pa-md">
              <div>Прочее</div>
              <div class="row">
                <div class="col numbers q-mt-md">
                  <div>{{ data.other_count }}</div>
                </div>
                <div class="col q-mt-md q-ml-md">
                  <q-icon
                    size="35px"
                    name="img:/img/icons/other.svg"
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
          class="col q-mb-md q-pa-md"
          :style="{'cursor': data.terminal_count ? 'pointer' : 'auto', 'border-radius': '10px'}"
          @click="$emit('show-modal', 'terminals', data.organization_id, data.terminal_count)"
        >
          <div style="font-size: 18px; font-weight: 600; text-align: center">
            Всего
          </div>
          <div class="row q-mt-md">
            <div
              class="col q-ml-lg q-mt-sm"
              style="font-size: 20px; font-weight: 600; text-align: center"
            >
              <div>{{ data.terminal_count }}</div>
            </div>
            <div class="col">
              <q-icon
                size="45px"
                name="img:/img/icons/terminal.svg"
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
              <div>В сети</div>
              <div class="row">
                <div class="col numbers q-mt-md">
                  <div>{{ data.online }}</div>
                </div>
                <div class="col q-mt-sm q-ml-md">
                  <q-icon
                    size="40px"
                    name="img:/img/icons/process.svg"
                  />
                </div>
              </div>
            </q-card>
            <q-card class="item-card q-pa-md">
              <div>Нужна поверка</div>
              <div class="row">
                <div class="col numbers">
                  <div>{{ data.need_check }}</div>
                </div>
                <div class="col q-ml-md">
                  <q-icon
                    size="35px"
                    name="img:/img/icons/check.svg"
                  />
                </div>
              </div>
            </q-card>
          </div>
          <div class="row q-gutter-md justify-center">
            <q-card class="item-card q-pa-md">
              <div>Не на связи</div>
              <div class="row">
                <div class="col numbers q-mt-md">
                  <div>{{ data.offline }}</div>
                </div>
                <div class="col q-mt-md q-ml-md">
                  <q-icon
                    size="30px"
                    name="img:/img/icons/connection.svg"
                  />
                </div>
              </div>
            </q-card>
            <q-card class="q-pa-md item-card">
              <div>Лимит</div>
              <div class="row">
                <div class="col numbers q-mt-md">
                  <div>{{ data.limit_exam }}</div>
                </div>
                <div class="col q-mt-sm q-ml-md">
                  <q-icon
                    size="40px"
                    name="img:/img/icons/limit.svg"
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
          organization_id: 0,
          organization_name: '',
          all_exams_count: 0,
          new_exams_count: 0,
          admission_count: 0,
          non_admission_count: 0,
          alco_count: 0,
          pressure_heart_count: 0,
          other_count: 0,
          terminal_count: 0,
          online: 0,
          offline: 0,
          need_check: 0,
          limit_exam: 0
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

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
              <div>{{ data.all_exams_count ?? 0 }}</div>
            </div>
            <div class="col-2 q-mr-xs">
              <q-icon
                size="40px"
              >
                <img src="@/img/icons/done.svg">
              </q-icon>
            </div>
          </div>
        </q-card>

        <div 
          class="row"
          style="gap: 16px"
        >
          <div class="row q-gutter-md justify-center">
            <q-card
              class="item-card q-pa-md"
              :style="{'cursor': data.new_exams_count ? 'pointer' : 'auto', 'border-radius': '10px'}"
              @click="$emit('show-modal', 'exams', data.organization_id, data.new_exams_count)"
            >
              <div>План</div>
              <div class="row">
                <div class="col numbers q-mt-md">
                  <div>{{ data.new_exams_count ?? 0 }}</div>
                </div>
                <div class="col q-mt-sm q-ml-md">
                  <!-- <q-icon
                    size="40px"
                    name="img:/img/icons/plan.svg"
                  /> -->
                  <q-icon
                    size="40px"
                  >
                    <img src="@/img/icons/plan.svg">
                  </q-icon>
                </div>
              </div>
            </q-card>
            <q-card
              class="item-card q-pa-md"
              :style="{'cursor': data.alco_count ? 'pointer' : 'auto', 'border-radius': '10px'}"
              @click="$emit('show-modal', 'exams', data.organization_id, data.alco_count)"
            >
              <div>Алкоголь</div>
              <div class="row">
                <div class="col numbers q-mt-md">
                  <div>{{ data.alco_count ?? 0 }}</div>
                </div>
                <div class="col q-mt-sm q-ml-md">
                  <!-- <q-icon
                    size="40px"
                    name="img:/img/icons/alcohol.svg"
                  /> -->
                  <q-icon
                    size="40px"
                  >
                    <img src="@/img/icons/alcohol.svg">
                  </q-icon>
                </div>
              </div>
            </q-card>
          </div>
          <div class="row q-gutter-md justify-center">
            <q-card
              class="item-card q-pa-md"
              :style="{'cursor': data.admission_count ? 'pointer' : 'auto', 'border-radius': '10px'}"
              @click="$emit('show-modal', 'exams', data.organization_id, data.admission_count)"
            >
              <div>Допуски</div>
              <div class="row">
                <div class="col numbers q-mt-md">
                  <div>{{ data.admission_count ?? 0 }}</div>
                </div>
                <div class="col q-mt-sm q-ml-md">
                  <!-- <q-icon
                    size="40px"
                    name="img:/img/icons/ok.svg"
                  /> -->
                  <q-icon
                    size="40px"
                  >
                    <img src="@/img/icons/ok.svg">
                  </q-icon>
                </div>
              </div>
            </q-card>
            <q-card
              class="item-card q-pa-md"
              :style="{'cursor': data.pressure_heart_count ? 'pointer' : 'auto', 'border-radius': '10px'}"
              @click="$emit('show-modal', 'exams', data.organization_id, data.pressure_heart_count)"
            >
              <div>Давление/пульс</div>
              <div class="row">
                <div class="col numbers">
                  <div>{{ data.pressure_heart_count ?? 0 }}</div>
                </div>
                <div class="col q-ml-md">
                  <!-- <q-icon
                    size="35px"
                    name="img:/img/icons/pressure.svg"
                  /> -->
                  <q-icon
                    size="35px"
                  >
                    <img src="@/img/icons/pressure.svg">
                  </q-icon>
                </div>
              </div>
            </q-card>
          </div>
          <div class="row q-gutter-md justify-center">
            <q-card
              class="item-card q-pa-md"
              :style="{'cursor': data.non_admission_count ? 'pointer' : 'auto', 'border-radius': '10px'}"
              @click="$emit('show-modal', 'exams', data.organization_id, data.non_admission_count)"
            >
              <div>Недопуск, всего</div>
              <div class="row">
                <div class="col numbers">
                  <div>{{ data.non_admission_count ?? 0 }}</div>
                </div>
                <div class="col q-ml-md">
                  <!-- <q-icon
                    size="35px"
                    name="img:/img/icons/denied.svg"
                  /> -->
                  <q-icon
                    size="35px"
                  >
                    <img src="@/img/icons/denied.svg">
                  </q-icon>
                </div>
              </div>
            </q-card>
            <q-card
              class="item-card q-pa-md"
              :style="{'cursor': data.other_count ? 'pointer' : 'auto', 'border-radius': '10px'}"
              @click="$emit('show-modal', 'exams', data.organization_id, data.other_count)"
            >
              <div>Прочее</div>
              <div class="row">
                <div class="col numbers q-mt-md">
                  <div>{{ data.other_count ?? 0 }}</div>
                </div>
                <div class="col q-mt-md q-ml-md">
                  <!-- <q-icon
                    size="35px"
                    name="img:/img/icons/other.svg"
                  /> -->
                  <q-icon
                    size="35px"
                  >
                    <img src="@/img/icons/other.svg">
                  </q-icon>
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
              <div>{{ data.terminal_count ?? 0 }}</div>
            </div>
            <div class="col">
              <!-- <q-icon
                size="40px"
                name="img:/img/icons/terminal.svg"
              /> -->
              <q-icon
                size="40px"
              >
                <img src="@/img/icons/terminal.svg">
              </q-icon>
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
                  <div>{{ data.online ?? 0 }}</div>
                </div>
                <div class="col q-mt-sm q-ml-md">
                  <!-- <q-icon
                    size="40px"
                    name="img:/img/icons/process.svg"
                  /> -->
                  <q-icon
                    size="40px"
                  >
                    <img src="@/img/icons/process.svg">
                  </q-icon>
                </div>
              </div>
            </q-card>
            <q-card class="item-card q-pa-md">
              <div>Нужна поверка</div>
              <div class="row">
                <div class="col numbers">
                  <div>{{ data.need_check ?? 0 }}</div>
                </div>
                <div class="col q-ml-md">
                  <!-- <q-icon
                    size="35px"
                    name="img:/img/icons/check.svg"
                  /> -->
                  <q-icon
                    size="35px"
                  >
                    <img src="@/img/icons/check.svg">
                  </q-icon>
                </div>
              </div>
            </q-card>
          </div>
          <div class="row q-gutter-md justify-center">
            <q-card class="item-card q-pa-md">
              <div>Не на связи</div>
              <div class="row">
                <div class="col numbers q-mt-md">
                  <div>{{ data.offline ?? 0 }}</div>
                </div>
                <div class="col q-mt-md q-ml-md">
                  <!-- <q-icon
                    size="30px"
                    name="img:/img/icons/connection.svg"
                  /> -->
                  <q-icon
                    size="30px"
                  >
                    <img src="@/img/icons/connection.svg">
                  </q-icon>
                </div>
              </div>
            </q-card>
            <q-card class="q-pa-md item-card">
              <div>Лимит</div>
              <div class="row">
                <div class="col numbers q-mt-md">
                  <div>{{ data.limit_exam ?? 0 }}</div>
                </div>
                <div class="col q-mt-sm q-ml-md">
                  <!-- <q-icon
                    size="40px"
                    name="img:/img/icons/limit.svg"
                  /> -->
                  <q-icon
                    size="40px"
                  >
                    <img src="@/img/icons/limit.svg">
                  </q-icon>
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

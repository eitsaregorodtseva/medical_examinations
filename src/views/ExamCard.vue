<!-- eslint-disable vue/require-default-prop -->
<template>
  <q-card 
    class="col-4" 
    style="min-width: 380px; max-width: 380px;"
  >
    <q-item>
      <q-item-section>
        <q-item-label>{{ data.organization_name }}</q-item-label>
      </q-item-section>
    </q-item>
    <q-separator />
    <q-card-section>
      <div class="row">
        <div class="q-pa-md col q-gutter-md">
          <q-card class="q-pa-sm q-pl-md q-gutter-xs item-card">
            <div>План</div>
            <div class="row">
              <div class="col numbers">
                <div>0</div>
              </div>
              <div class="col q-ml-lg">
                <q-icon 
                  size="30px"
                  name="img:/img/icons/plan.svg"
                />
              </div>
            </div>
          </q-card>
          <q-card class="q-px-sm q-pt-lg q-pb-lg q-gutter-xs item-card">
            <div style="font-size: 20px; font-weight: 600; text-align: center">
              Осмотров
            </div>
            <div class="row q-pt-lg q-pb-sm">
              <div 
                class="col q-mt-md" 
                style="font-size: 20px; font-weight: 600; text-align: center"
              >
                <div>{{ data.exams_count }}</div>
              </div>
              <div class="col">
                <q-icon 
                  size="50px"
                  name="img:/img/icons/done.svg"
                />
              </div>
            </div>
          </q-card>
          <q-card class="q-pa-sm q-gutter-xs item-card">
            <div>Допуски</div>
            <div class="row">
              <div class="col numbers">
                <div>0</div>
              </div>
              <div class="col q-ml-xl">
                <q-icon 
                  size="30px"
                  name="img:/img/icons/ok.svg"
                />
              </div>
            </div>
          </q-card>
        </div>
        <div class="q-pa-md col q-gutter-md">
          <q-card class="q-pa-sm q-gutter-xs item-card">
            <div>Недопуск, всего</div>
            <div class="row">
              <div class="col numbers">
                <div>0</div>
              </div>
              <div class="col q-ml-xl">
                <q-icon 
                  size="30px"
                  name="img:/img/icons/denied.svg"
                />
              </div>
            </div>
          </q-card>
          <q-card class="q-pa-sm q-gutter-xs item-card">
            <div>Алкоголь</div>
            <div class="row">
              <div class="col numbers">
                <div>0</div>
              </div>
              <div class="col q-ml-xl">
                <q-icon 
                  size="30px"
                  name="img:/img/icons/alcohol.svg"
                />
              </div>
            </div>
          </q-card>
          <q-card class="q-pa-sm q-gutter-xs item-card">
            <div>Давление/пульс</div>
            <div class="row">
              <div class="col numbers">
                <div>0</div>
              </div>
              <div class="col q-ml-xl">
                <q-icon 
                  size="35px"
                  name="img:/img/icons/pressure.svg"
                />
              </div>
            </div>
          </q-card>
          <q-card class="q-pa-sm q-gutter-xs item-card">
            <div>Прочее</div>
            <div class="row">
              <div class="col numbers">
                <div>0</div>
              </div>
              <div class="col q-ml-xl">
                <q-icon 
                  size="30px"
                  name="img:/img/icons/other.svg"
                />
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  props: {
    data: Object
  }
}
</script>
<template>
  <q-card 
    class="col-4" 
    style="min-width: 380px; max-width: 380px;"
  >
    <q-item>
      <q-item-section>
        <q-item-label>Название организации</q-item-label>
      </q-item-section>
    </q-item>
    <q-separator />
    <q-card-section>
      <div class="row">
        <div class="q-px-md q-py-lg col q-gutter-xl">
          <q-card  
            class="q-py-lg q-px-md q-gutter-xs item-card" 
            style="height: 200px"
          >
            <div style="font-size: 26px; font-weight: 600; text-align: center; ">
              Всего
            </div>
            <div class="row q-mt-lg q-mb-xl">
              <div 
                class="col q-mt-md" 
                style="font-size: 26px; font-weight: 600; text-align: center;"
              >
                <div>0</div>
              </div>
              <div class="col q-mb-xl q-mr-md">
                <q-icon 
                  size="65px" 
                  name="img:/img/icons/terminal.svg" 
                />
              </div>
            </div>
          </q-card>
          <q-card class="q-pa-sm q-gutter-xs item-card">
            <div>В сети</div>
            <div class="row">
              <div class="col numbers">
                <div>0</div>
              </div>
              <div class="col q-ml-xl">
                <q-icon 
                  size="30px" 
                  name="img:/img/icons/process.svg" 
                />
              </div>
            </div>
          </q-card>
        </div>
        <div class="q-px-md q-py-lg col q-gutter-xl">
          <q-card class="q-pa-sm q-gutter-xs item-card">
            <div>Не на связи</div>
            <div class="row">
              <div class="col numbers">
                <div>0</div>
              </div>
              <div class="col q-ml-xl">
                <q-icon 
                  size="30px" 
                  name="img:/img/icons/connection.svg" 
                />
              </div>
            </div>
          </q-card>
          <q-card class="q-pa-sm q-gutter-xs item-card">
            <div>Нужна поверка</div>
            <div class="row">
              <div class="col numbers">
                <div>0</div>
              </div>
              <div class="col q-ml-xl">
                <q-icon 
                  size="30px" 
                  name="img:/img/icons/check.svg" 
                />
              </div>
            </div>
          </q-card>
          <q-card class="q-pa-sm q-gutter-xs item-card">
            <div>Лимит</div>
            <div class="row">
              <div class="col numbers">
                <div>0</div>
              </div>
              <div class="col q-ml-xl">
                <q-icon 
                  size="30px" 
                  name="img:/img/icons/limit.svg" 
                />
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
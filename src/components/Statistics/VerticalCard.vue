<!-- eslint-disable vue/require-default-prop -->
<template>
    <q-card class="col-4" style="min-width: 370px; max-width: 370px;">
        <q-item>
            <q-item-section>
                <q-item-label>0</q-item-label>
            </q-item-section>
        </q-item>
        <q-separator />
        <q-card-section>
            <div class="row">
                <div class="q-pa-sm col q-pb-md q-gutter-sm">
                    <q-card class="q-pa-sm q-pl-sm q-gutter-xs item-card">
                        <div>План</div>
                        <div class="row">
                            <div class="col numbers">
                                <div>0</div>
                            </div>
                            <div class="col q-ml-lg">
                                <q-icon size="30px" name="img:/img/icons/plan.svg" />
                            </div>
                        </div>
                    </q-card>
                    <q-card class="q-px-sm q-pt-md q-pb-lg q-gutter-xs item-card"
                        style="cursor: pointer;">
                        <div style="font-size: 20px; font-weight: 600; text-align: center">
                            Осмотров
                        </div>
                        <div class="row q-pt-lg q-pb-sm">
                            <div class="col q-mt-md" style="font-size: 20px; font-weight: 600; text-align: center">
                                <div>0</div>
                            </div>
                            <div class="col">
                                <q-icon size="50px" name="img:/img/icons/done.svg" />
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
                                <q-icon size="30px" name="img:/img/icons/ok.svg" />
                            </div>
                        </div>
                    </q-card>
                </div>
                <div class="q-pa-sm col q-gutter-sm">
                    <q-card class="q-pa-sm q-gutter-xs item-card">
                        <div>Недопуск, всего</div>
                        <div class="row">
                            <div class="col numbers">
                                <div>0</div>
                            </div>
                            <div class="col q-ml-xl">
                                <q-icon size="30px" name="img:/img/icons/denied.svg" />
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
                                <q-icon size="30px" name="img:/img/icons/alcohol.svg" />
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
                                <q-icon size="35px" name="img:/img/icons/pressure.svg" />
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
                                <q-icon size="30px" name="img:/img/icons/other.svg" />
                            </div>
                        </div>
                    </q-card>
                </div>
            </div>
        

      <div class="row">
        <div class="q-px-sm q-py-sm q-pt-md col q-gutter-sm">
          <q-card  
            class="q-py-sm q-px-sm q-gutter-xs item-card" 
            style="height: 150px"
          >
            <div style="font-size: 26px; font-weight: 600; text-align: center; ">
              Всего
            </div>
            <div class="row q-mt-lg q-mb-xl">
              <div 
                class="col q-mt-md" 
                style="font-size: 26px; font-weight: 600; text-align: center;"
              >
                <div> 0 </div>
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
        <div class="q-px-md q-py-sm col q-gutter-sm">
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
  

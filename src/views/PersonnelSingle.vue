<template>
  <q-page>
    <PersonnelAddEditModal
      v-model="showAddModal"
      title="Новый работник"
      @personnel-added="onAddModalSuccess"
    />
    <PersonnelAddEditModal
      v-if="personnelInfoLoaded"
      v-model="showEditModal"
      :title="'Редактировать ' + personnelNameWithInitials"
      is-editing
      :init-personnel-info="personnel_info"
      @personnel-updated="onEditModalSuccess"
    />
    <div class="fit row q-col-gutter-md">
      <div class="col-3 full-height overflow-auto">
        <div
          class="q-py-xs bg-white shadow-2 full-width column items-stretch"
          style="position: sticky; z-index: 1; top: 0px;"
        >
          <div v-if="user_organization_id != 'null'" class="col-auto q-mb-sm">
            <q-btn
              dense
              icon="add"
              class="full-width text-dark"
              label="Новый работник"
              @click="showAddModal = true"
            />
          </div>
          <div class="col row q-px-md">
            <q-input
              v-model="search"
              borderless
              dense
              debounce="300"
              class="col"
              placeholder="Поиск"
            />
            <q-btn
              flat
              round
              dense
              icon="search"
              color="dark"
              class="col-auto"
            />
          </div>
        </div>
        <q-list
          v-if="personnelListLoaded"
          bordered
          padding
          class="rounded-borders"
        >
          <q-item
            v-for="pers in filteredPersonnelList"
            :key="pers.id"
            clickable
            :active="personnelId === pers.id"
            active-class="active-driver-in-sidebar"
            @click="changePersonnel(pers.id)"
          >
            <q-item-section>{{ pers.name }}</q-item-section>
          </q-item>
        </q-list>
      </div>

      <div
        v-if="personnelInfoLoaded"
        class="col q-pa-md"
      >
        <div class="row q-col-gutter-md">
          <div class="col-md-4 q-gutter-sm">
            <AppImage
              :image-id="personnel_info.photo"
            />
            <AppFileUpload
              ref="imgUploadForm"
              label="Изменить фото"
              @file-uploaded="onImageUploaded"
            />
          </div>


          <div class="col-md-8 q-pt-md q-gutter-md">
            <div class="text-h6"># {{ personnel_info.pers_number }}</div>
            <div class="text-h4">{{ personnelFullName }}</div>
            <q-markup-table flat>
              <tbody>
                <tr class="q-tr--no-hover">
                  <td>Пол:</td>
                  <td>{{ personnel_info.gender }}</td>
                </tr>
                <tr class="q-tr--no-hover">
                  <td>Дата рождения:</td>
                  <td>
                    {{ $moment(personnel_info.date_of_birth).format('L') }}
                    <span class="text-nowrap">(возраст: {{ personnel_info.age }})</span>
                  </td>
                </tr>
                <tr class="q-tr--no-hover">
                  <td>Зарегистрирован:</td>
                  <td>{{ $moment(personnel_info.registration_date).format('LLL') }}</td>
                </tr>
                <tr class="q-tr--no-hover">
                  <td>Согласие на обработку данных:</td>
                  <td>{{ personnel_info.processing_consent ? 'Да' : 'Нет' }}</td>
                </tr>
              </tbody>
            </q-markup-table>
            <q-btn
              class="btn_normal"
              rounded
              @click="showEditModal = true"
            >
              Редактировать
            </q-btn>
          </div>
        </div>
        <div class="q-pt-md">
          <medpapers-grid
            :personnel-id="personnelId"
            :user-id="user_id"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>


<script>
    import AppImage from '@/components/AppImage'
    import AppFileUpload from '@/components/AppFileUpload'
    import PersonnelAddEditModal from '@/components/PersonnelAddEditModal'
    import { getPersonnelList, getPersonnelRecord, updatePersonnelRecord } from '@/api/personnel.api'
    import { fullName, nameWithInitials } from '@/helpers/names'
    import MedpapersGrid from '@/components/Medpapers/MedpapersGrid.vue'

    export default {
        components: {
            AppImage,
            PersonnelAddEditModal,
            AppFileUpload,
            MedpapersGrid
        },

        props: {
            personnelId : Number
        },

        data: () => ({
            user_id : null,
            user_organization_id: null,
            personnel_info : {},
            personnel_list : [], // of objects {id, name}
            search : '',
            showEditModal : false,
            showAddModal : false
        }),

        computed : {
            personnelInfoLoaded () {
              return this.personnel_info && 0 !== Object.keys(this.personnel_info).length
            },
            personnelListLoaded () {
              return this.personnel_list && 0 !== this.personnel_list.length
            },
            personnelNameWithInitials () {
              if (!this.personnelInfoLoaded) {
                  return ''
              } else {
                return nameWithInitials(this.personnel_info.second_name, this.personnel_info.first_name, this.personnel_info.father_name)
              }
            },
            personnelFullName () {
              if (!this.personnelInfoLoaded) {
                  return ''
              } else {
                return fullName(this.personnel_info.second_name, this.personnel_info.first_name, this.personnel_info.father_name)
              }
            },
            filteredPersonnelList() {
              if (this.search.trim() !== '') {
                return this.personnel_list.filter(item => {
                  return item.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1
                })
              } else {
                return this.personnel_list
              }
    }
        },

        watch : {
            personnelId () {
                this.fetchPersonnelInfo(this.personnelId)
                this.$refs.imgUploadForm.clear()
            }
        },

        mounted() {
            this.populateDataFromStorage()

            this.fetchPersonnelInfo()

            if (0 === this.personnel_list.length) {
                this.fetchPersonnelList()
            }
        },

        methods : {
            populateDataFromStorage() {
                this.user_id = sessionStorage.getItem('user_id')
                this.user_organization_id = sessionStorage.getItem('user_organization_id')
            },
            async fetchPersonnelInfo() {
                try {
                    const response = await getPersonnelRecord(this.user_id, this.personnelId)
                    this.personnel_info = response.data
                } catch (err) {
                    if (err.response && err.response.status == 404) {
                      // TODO: enable this when there is a page for all personnel
                        // this.$notify({
                        //     type : 'warn',
                        //     title : 'Работник не найден',
                        //     text : 'Проверьте введенный адрес'
                        //     });
                    }
                }
            },
            async fetchPersonnelList() {
                try {
                    var response
                    if (this.user_organization_id !== 'null') {
                        response = await getPersonnelList(this.user_id, this.user_organization_id)
                    } else {
                        response = await getPersonnelList(this.user_id)
                    }
                    const results = response.data
                    this.personnel_list = results.map(personnel_info => ({
                        id : personnel_info.pers_id,
                        name: (
                            personnel_info.second_name + ' '
                            + personnel_info.first_name
                            + ' ' + (personnel_info.father_name || '')
                        ).trim()
                    }))
                } catch (err) {}
            },
            async updatePersonnelPhoto(photo) {
                try {
                    const response = await updatePersonnelRecord(this.user_id, this.personnelId, {photo})
                    this.$notify({
                        type : 'success',
                        title : 'Успешно обновлено',
                    });
                } catch (err) {}
            },
            changePersonnel(id) {
                this.$router.replace({name: 'PersonnelSingle', params: {personnelId :id}})
            },
            onAddModalSuccess(id) {
                this.changePersonnel(id)
                this.fetchPersonnelList()
                this.$notify({
                    type : 'success',
                    title : `Работник создан!`,
                })
            },
            async onEditModalSuccess() {
                this.fetchPersonnelList()
                await this.fetchPersonnelInfo()
                this.$notify({
                    type : 'success',
                    title : `Работник ${this.personnelNameWithInitials} обновлен!`
                })
            },
            async onImageUploaded(fileId) {
                await this.updatePersonnelPhoto(fileId)
                this.personnel_info.photo=fileId
            }
        }
    }
</script>

<style lang="sass">
@import "@/styles/quasar";
.active-driver-in-sidebar
  background-color: $secondary
  color: $dark

</style>

<template>
  <PersonnelAddEditModal
    id="addModal"
    title="Новый водитель"
    @personnel-added="onAddModalSuccess"
  />
  <PersonnelAddEditModal
    v-if="personnelInfoLoaded"
    id="editModal"
    :title="'Редактировать ' + personnelNameWithInitials"
    :is-editing="true"
    :init-personnel-info="personnel_info"
    @personnel-updated="onEditModalSuccess"
  />

  <div class="d-flex w-100 h-100">
    <nav
      class="col-lg-3 navbar-expand-md d-flex flex-nowrap sticky-top pe-2"
      style="height: 100vh"
    >
      <a
        class="d-md-none d-flex align-items-center fw-bold app_normal"
        data-bs-toggle="collapse"
        href="#personnelSidebar"
        aria-controls="personnelSidebar"
        style="min-width: 33px; writing-mode: vertical-lr; text-orientation: upright; text-decoration: none;"
      >
        <i class="bi bi-list fs-4 mt-2" />
        <span class="fs-6 flex-fill text-center">Работники</span>
      </a>

      <div
        id="personnelSidebar"
        class="collapse navbar-collapse"
        aria-labelledby="personnelSidebarLabel"
      >
        <div
          class="d-flex justify-content-evenly w-100 h-100"
          style="min-width: 263px;"
        >
          <AppListGroup
            :items="personnel_list"
            :active-item-id="personnelId"
            class="w-100 h-100"
            @item-clicked="changePersonnel"
          >
            <div class="d-flex align-items-center justify-content-between bg-white">
              <!-- <a
                href="#"
                class="flex-shrink-1  d-flex align-items-center"
              >
                <i class="bi bi-arrow-90deg-left" />
                <div class="p-1">Назад к списку</div>
              </a> -->
              <span class=" w-100 text-center fs-6 fw-bold p-1">Работники</span>
              <button
                class="btn_normal p-1"
                data-bs-toggle="modal"
                data-bs-target="#addModal"
              >
                Добавить
              </button>
            </div>
          </AppListGroup>
          <a
            class="d-md-none h-100 text-center app_normal fs-6"
            data-bs-toggle="collapse"
            href="#personnelSidebar"
            aria-controls="personnelSidebar"
            style=" writing-mode: vertical-lr;  text-decoration: none;"
          >Скрыть</a>
        </div>
      </div>
    </nav>


    <div
      v-if="personnelInfoLoaded"
      class="container"
    >
      <div class="row">
        <div class="col-md-4 d-flex flex-column align-items-center">
          <AppImage :image-id="personnel_info.photo" />
          <AppFileUpload @file-uploaded="onImageUploaded">
            Изменить фото
          </AppFileUpload>
        </div>


        <div class="col-md-8 pt-3 d-flex flex-column align-items-start">
          <h6># {{ personnel_info.pers_number }}</h6>
          <h4>{{ personnelFullName }}</h4>
          <table class="mt-4 table table-borderless">
            <tbody>
              <tr>
                <th>Пол:</th>
                <td>{{ personnel_info.gender }}</td>
              </tr>
              <tr>
                <th>Дата рождения:</th>
                <td>
                  {{ $moment(personnel_info.date_of_birth).format('L') }}
                  <span class="text-nowrap">(возраст: {{ personnel_info.age }})</span>
                </td>
              </tr>
              <tr>
                <th>Зарегистрирован:</th>
                <td>{{ $moment(personnel_info.registration_date).format('LLL') }}</td>
              </tr>
              <tr>
                <th>Согласие на обработку данных:</th>
                <td>{{ personnel_info.processing_consent ? 'Да' : 'Нет' }}</td>
              </tr>
            </tbody>
          </table>
          <button
            class="btn_normal m-3 align-self-center"
            data-bs-toggle="modal"
            data-bs-target="#editModal"
          >
            Редактировать
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
    import AppListGroup from '@/components/AppListGroup'
    import AppImage from '@/components/AppImage'
    import AppFileUpload from '@/components/AppFileUpload'
    import PersonnelAddEditModal from '@/components/PersonnelAddEditModal'
    import { getPersonnelList, getPersonnelRecord, updatePersonnelRecord } from '@/api/personnel.api'
    import { fullName, nameWithInitials } from '@/helpers/names'

    export default {
        components: {
            AppListGroup,
            AppImage,
            PersonnelAddEditModal,
            AppFileUpload
        },

        props : {
            personnelId : Number
        },

        data: () => ({
            user_id : null,
            user_organization_id: null,
            personnel_info : {},
            personnel_list : [] // of objects {id, name}
        }),

        computed : {
            personnelInfoLoaded () {
              return this.personnel_info && 0 !== Object.keys(this.personnel_info).length
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
            }
        },

        watch : {
            personnelId () {
                this.fetchPersonnelInfo(this.personnelId)
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
                        this.$notify({
                            type : 'warn',
                            title : 'Работник не найден',
                            text : 'Проверьте введенный адрес'
                            });
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

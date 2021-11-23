<template>
  <DriversAddEditModal
    id="addModal"
    title="Новый водитель"
    @driver-added="onAddModalSuccess"
  />
  <DriversAddEditModal
    v-if="show_driver"
    id="editModal"
    :title="'Редактировать ' + driver_name_with_initials"
    :is-editing="true"
    :init-driver-info="driver_info"
    @driver-updated="onEditModalSuccess"
  />

  <div class="d-flex w-100 h-100">
    <nav
      class="col-lg-3 navbar-expand-md d-flex flex-nowrap sticky-top pe-2"
      style="height: 100vh"
    >
      <a
        class="d-md-none d-flex align-items-center fw-bold app_normal"
        data-bs-toggle="collapse"
        href="#driversSidebar"
        aria-controls="driversSidebar"
        style="min-width: 33px; writing-mode: vertical-lr; text-orientation: upright; text-decoration: none;"
      >
        <i class="bi bi-list fs-4 mt-2" />
        <span class="fs-6 flex-fill text-center">Водители</span>
      </a>

      <div
        id="driversSidebar"
        class="collapse navbar-collapse"
        aria-labelledby="driversSidebarLabel"
      >
        <div
          class="d-flex justify-content-evenly w-100 h-100"
          style="min-width: 263px;"
        >
          <AppListGroup
            :items="drivers_list"
            :active-item-id="driverId"
            class="w-100 h-100"
            @item-clicked="changeDriver"
          >
            <div class="d-flex align-items-center justify-content-between bg-white">
              <a
                href="#"
                class="flex-shrink-1  d-flex align-items-center"
              >
                <i class="bi bi-arrow-90deg-left" />
                <div class="p-1">Назад к списку</div>
              </a>
              <span class=" w-100 text-center fs-6 fw-bold p-1">Водители</span>
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
            href="#driversSidebar"
            aria-controls="driversSidebar"
            style=" writing-mode: vertical-lr;  text-decoration: none;"
          >Скрыть</a>
        </div>
      </div>
    </nav>


    <div
      v-if="show_driver"
      class="container"
    >
      <div class="row">
        <div class="col-md-4 d-flex flex-column align-items-center">
          <AppImage :image-id="driver_info.photo" />
          <AppFileUpload @file-uploaded="onImageUploaded">
            Изменить фото
          </AppFileUpload>
        </div>


        <div class="col-md-8 pt-3 d-flex flex-column align-items-start">
          <h4># {{ driver_info.pers_number }}</h4>
          <h2>{{ driver_full_name }}</h2>
          <table class="mt-4 table table-borderless">
            <tbody>
              <tr>
                <th>Пол:</th>
                <td>{{ driver_info.gender }}</td>
              </tr>
              <tr>
                <th>Дата рождения:</th>
                <td>
                  {{ $moment(driver_info.date_of_birth).format('L') }}
                  <span class="text-nowrap">(возраст: {{ driver_info.age }})</span>
                </td>
              </tr>
              <tr>
                <th>Зарегистрирован:</th>
                <td>{{ $moment(driver_info.registration_date).format('LLL') }}</td>
              </tr>
              <tr>
                <th>Согласие на обработку данных:</th>
                <td>{{ driver_info.processing_consent ? 'Да' : 'Нет' }}</td>
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
    import DriversAddEditModal from '@/components/DriversAddEditModal'
    import { getPersonnelList, getPersonnelRecord, updatePersonnelRecord } from '@/api/personnel.api'

    export default {
        components: {
            AppListGroup,
            AppImage,
            DriversAddEditModal,
            AppFileUpload
        },

        props : {
            driverId : Number
        },

        data: () => ({
            user_id : null,
            user_organization_id: null,
            driver_info : {},
            drivers_list : [] // of objects {id, name}
        }),

        computed : {
            show_driver () {
              return this.driver_info && 0 !== Object.keys(this.driver_info).length
            },
            driver_full_name () {
                return (
                    [this.driver_info.second_name, this.driver_info.first_name, this.driver_info.father_name].filter(Boolean).join(' ')
                )
            },
            driver_name_with_initials () {
                if (0 === Object.keys(this.driver_info).length) {
                    return ''
                }

                let result = this.driver_info.second_name
                        + ' ' + this.driver_info.first_name.charAt(0) + '.'
                if (this.driver_info.father_name) {
                    result += this.driver_info.father_name.charAt(0) + '.'
                }
                return result
            }
        },

        watch : {
            driverId () {
                this.fetchDriverInfo(this.driverId)
            }
        },

        mounted() {
            this.populateDataFromStorage()

            this.fetchDriverInfo()

            if (0 === this.drivers_list.length) {
                this.fetchDriversList()
            }
        },

        methods : {
            populateDataFromStorage() {
                this.user_id = sessionStorage.getItem('user_id')
                this.user_organization_id = sessionStorage.getItem('user_organization_id')
            },
            async fetchDriverInfo() {
                try {
                    const response = await getPersonnelRecord(this.user_id, this.driverId)
                    this.driver_info = response.data
                } catch (err) {
                    if (err.response && err.response.status == 404) {
                        this.$notify({
                            type : 'warn',
                            title : 'Водитель не найден',
                            text : 'Проверьте введенный адрес'
                            });
                    }
                }
            },
            async fetchDriversList() {
                try {
                    var response
                    if (this.user_organization_id !== 'null') {
                        response = await getPersonnelList(this.user_id, this.user_organization_id)
                    } else {
                        response = await getPersonnelList(this.user_id)
                    }
                    const results = response.data
                    this.drivers_list = results.map(driver_info => ({
                        id : driver_info.pers_id,
                        name: (
                            driver_info.second_name + ' '
                            + driver_info.first_name
                            + ' ' + (driver_info.father_name || '')
                        ).trim()
                    }))
                } catch (err) {}
            },
            async updateDriverPhoto(photo) {
                try {
                    const response = await updatePersonnelRecord(this.user_id, this.driverId, {photo})
                    this.$notify({
                        type : 'success',
                        title : 'Успешно обновлено',
                    });
                } catch (err) {}
            },
            changeDriver(id) {
                this.$router.replace({name: 'DriversSingle', params: {driverId :id}})
            },
            onAddModalSuccess(id) {
                this.changeDriver(id)
                this.fetchDriversList()
                this.$notify({
                    type : 'success',
                    title : `Водитель создан!`,
                })
            },
            async onEditModalSuccess() {
                this.fetchDriversList()
                await this.fetchDriverInfo()
                this.$notify({
                    type : 'success',
                    title : `Водитель ${this.driver_name_with_initials} обновлен!`
                })
            },
            async onImageUploaded(fileId) {
                await this.updateDriverPhoto(fileId)
                this.driver_info.photo=fileId
            }
        }
    }
</script>

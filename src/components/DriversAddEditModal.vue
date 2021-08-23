<template>
    <div class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered ">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        {{ title }}
                    </h5>
                    <!-- Button has unique id to tell instances apart when clicking it from the script -->
                    <button type="button" :id="'closeButton-' + uuid" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form @submit.prevent="onSubmit">
                    <div class="modal-body">
                        <div class="input-group input-group-sm mb-2">
                            <label for="inputPersNumber" class="input-group-text w-25">Таб. №</label>
                            <input type="text" id="inputPersNumber" class="form-control" v-model.trim="driver_info.pers_number" required>
                        </div>

                        <hr>

                        <div class="input-group input-group-sm mb-2">
                            <label for="inputSecondName" class="input-group-text w-25">Фамилия</label>
                            <input type="text" id="inputSecondName" class="form-control" v-model.trim="driver_info.second_name" required>
                        </div>
                        <div class="input-group input-group-sm mb-2">
                            <label for="inputFirstName" class="input-group-text w-25">Имя</label>
                            <input type="text" id="inputFirstName" class="form-control" v-model.trim="driver_info.first_name" required>
                        </div>
                        <div class="input-group input-group-sm mb-2">
                            <label for="inputFatherName" class="input-group-text w-25">Отчество</label>
                            <input type="text" id="inputFatherName" class="form-control" v-model.trim="driver_info.father_name">
                        </div>

                        <hr>

                        <div class="form-check-inline">Пол:</div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="inputGender" id="inputGenderMale" 
                            value="м" v-model="driver_info.gender" checked>
                            <label class="form-check-label" for="inputGenderMale">Муж</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" name="inputGender" id="inputGenderFemale" 
                            value="ж" v-model="driver_info.gender">
                            <label class="form-check-label" for="inputGenderFemale">Жен</label>
                        </div>

                        <hr>
                        
                        <div class="input-group input-group-sm mb-2">
                            <label for="inputDateOfBirth" class="input-group-text">Дата рождения</label>
                            <input type="date" id="inputDateOfBirth" class="form-control" v-model="driver_info.date_of_birth" required>
                            <label for="inputDateOfBirth" class="input-group-text"> 
                                возраст: {{ $moment().diff(driver_info.date_of_birth, 'years') || ' '}} 
                            </label>

                        </div>

                        <hr>

                        <div class="form-check form-switch">
                            <label class="form-check-label" for="switchConsent">Согласие на обработку данных</label>
                            <input class="form-check-input" type="checkbox" id="switchConsent" v-model="driver_info.processing_consent">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn_error" data-bs-dismiss="modal">Отмена</button>
                        <button type="submit" class="btn_normal">Сохранить</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
// For creating unique id
let uuid = 0

function emptyForm() {
    return {
        organization : 1,
        pers_number : '',
        second_name : '',
        first_name : '',
        father_name : '',
        gender: 'м',
        date_of_birth: '',
        processing_consent: false,
    }
}
export default {
    props : {
        title: {
            type: String,
            default: 'Новый водитель'
        },
        initDriverInfo : {
            type: Object,
            default: emptyForm(),
            validator(input) {
                return input && 0 !== Object.keys(input).length
            }
        },
        // Set this to true if form is opened for editing driver. Default: false
        isEditing: {
            type : Boolean,
            default : false
        }
    },
    emits : {
        // Is emmitted after sucsessful POST request
        driverAdded : (id) => {return true},
        // Is emmited after sucsessful PATCH request
        driverUpdated : () => {}
    },
    data (){ return {
        driver_info : this.initDriverInfo,
        uuid : null
    }},
    methods : {
        closeModal () {
            document.getElementById('closeButton-'+this.uuid).click()
        },
        async updateDriverInfo(params) {
            try {
                const url = `https://stats.auditory.ru/api/web/update_personnel?user_id=5&personnel_id=${this.driver_info.pers_id}`
                const response = await this.$axios.patch(url, params)
                const results = response.data
                // On success
                this.$emit('driverUpdated')
                this.closeModal()

            } catch (err) {
                if (err.response) {
                // client received an error response (5xx, 4xx)
                console.log("Response Error:", err)
                } else if (err.request) {
                // client never received a response, or request never left
                console.log("Network Error:", err)
                } else {
                console.log("Client Error:", err)
                }
            }
        },
        async addDriver(){
            try {
                const url = 'https://stats.auditory.ru/api/web/add_personnel?user_id=5'
                const response = await this.$axios.post(url, this.driver_info)
                const results = response.data
                // On success
                this.$emit('driverAdded', results.id)
                this.closeModal()
                this.driver_info = emptyForm()
            } catch (err) {
                if (err.response) {
                // client received an error response (5xx, 4xx)
                console.log("Response Error:", err)
                } else if (err.request) {
                // client never received a response, or request never left
                console.log("Network Error:", err)
                } else {
                console.log("Client Error:", err)
                }
            }

        },
        onSubmit() {
            if (this.isEditing) {
                let changedParams = this.findChanges(this.initDriverInfo, this.driver_info) 
                if (0 === Object.keys(changedParams).length) {
                    this.closeModal()
                } else {
                    this.updateDriverInfo(changedParams)
                }
            } else {
                this.addDriver()
            }
        },
        findChanges (oldObj, newObj) {
            let diff = {}
            let key
            for (key in oldObj) {
                // Skip Objects, comparing only simple values
                let type = Object.prototype.toString.call(oldObj[key])
                if (type != '[object Object]') {
                    if (oldObj[key] != newObj[key]) {
                        diff[key] = newObj[key]
                    }
                }
            }
            return diff
        },
        

    },
    
    watch : {
        initDriverInfo (new_info) {
            // Assign a copy of data, not object reference
            this.driver_info = Object.assign({}, new_info)
        }
    },

    mounted() {
        // Generate unique id for this component
        this.uuid = uuid.toString()
        uuid += 1;
    }
}
</script>

<style>
.input-group-text {
    color: inherit
}
.form-check-input:checked {
    color: #3C61E9;
    border-color: #3C61E9;
}
</style>
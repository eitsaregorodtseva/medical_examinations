<template>
    <div class="d-flex flex-column m-3">
        <button class="btn_normal" @click="clickInputFile">
            <slot></slot>
        </button>
        <input class="d-none" id="inputFile" ref="file" type="file" 
        accept=".jpg,.png"
        @change="handleFileChange">
    </div>


</template>

<script>
export default {
    emits : {
        fileUploaded : (fileId) => {return true}
        },
    data () { return {
        file : ''
    }},
    methods : {
        clickInputFile () {
            document.getElementById('inputFile').click()
        },
        async handleFileChange() {
            this.file = this.$refs.file.files[0]
            // TODO: check if it's empty
            const fileId = await this.preloadFile(this.file)
            this.loadFile(this.file, fileId)
        },
        async preloadFile(file) {
            try {
                const params = {
                    file_name : file.name,
                    file_size : file.size
                }
                const url = `https://stats.auditory.ru/api/mediaserver/load_file`
                const response = await this.$axios.post(url, params)
                const results = response.data
                // On success
                return results.file_id

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
        async loadFile(file, fileId) {
            try {
                let formData = new FormData()
                formData.append('file_data', file)

                const last_byte = file.size
                const url = `https://stats.auditory.ru/api/mediaserver/load_file/${fileId}`
                const response = await this.$axios.put(url, formData, {
                    params : { last_byte }, 
                    headers: { 'Content-Type': 'multipart/form-data'}
                    })
                // On success
                this.$emit('fileUploaded', fileId)
                this.file = ''

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

    }
}
</script>

<style>

</style>
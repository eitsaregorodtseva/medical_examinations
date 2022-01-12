<template>
    <div v-if="imageId">
        <a data-bs-toggle="modal" href="#imgModal">
            <img :src="`https://stats.auditory.ru/api/mediaserver/get_image?file_id=${imageId}`"
            class="img-fluid img-thumbnail" alt="">
        </a>
        <div class="modal modal-center fade" id="imgModal" tabindex="-1">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <img :src="`https://stats.auditory.ru/api/mediaserver/get_image?file_id=${imageId}`"
                        class="img-fluid" alt="">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="d-flex justify-content-center align-items-center" style="background-color: #d3d3d3; width: 180px; height: 180px;">
        <span class="my-auto"> Нет фото </span>
    </div>
</template>

<script>
export default {
    props : {
        imageId : {
            type : String,
        }
}
}
</script>

<style>

</style>

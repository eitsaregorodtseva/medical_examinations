<template>
  <div>
    <q-img
      contain
      :src="imageURL"
      :class="{ 'cursor-pointer' : isLoaded }"
      :title="isLoaded ? 'Развернуть': ''"
      style="min-height: 50px; min-width: 50px"
      @click="isLoaded ? showFullImageDialog = true : {}"
      @load="isLoaded = true"
      @error="isLoaded = false"
    >
      <template #error>
        <div class="absolute-full flex flex-center bg-grey-3 text-grey">
          Нет фото
        </div>
      </template>
    </q-img>
    <q-dialog v-model="showFullImageDialog">
      <q-card class="full-width" style="max-height: 80vh;">
        <q-img :src="imageURL" class="full-height" style="max-height: 80vh;">
          <div
            class="absolute-top-right"
            style="padding: 0;"
          >
            <q-btn
              v-close-popup
              icon="close"
              class="float-right"
              flat
              dense
            />
          </div>
        </q-img>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import {serverURL} from '@/api/services'
export default {
  props : {
    imageId : {
        type : String,
    }
  },
  data () {return {
    serverURL: serverURL,
    showFullImageDialog : false,
    isLoaded : false,
  }},
  computed : {
    imageURL () {
      return serverURL + `/api/mediaserver/get_image?file_id=${this.imageId}`
    }
  }
}
</script>

<template>
  <!-- <div class="q-pa-md row items-start q-gutter-md"> -->
    <q-table
      :rows="medpapersList"
      :columns="columns"
      row-key="id"
      table-header-class="shadow-1"
      grid
      grid-header
      hide-bottom
    >
      <template #item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 ">
          <q-card>
            <!-- <q-img :src="getFileUrl(props.row.file)" /> -->
            <AppImage :image-id="props.row.file" />
            <!-- <AppImage image-id="a1e1a4083635411880eab0ed90add592" /> -->
            <q-card-section>
              <div class="text-subtitle2">
                #{{ props.row.id }}
              </div>
              <div class="text-subtitle1">
                {{ props.row.med_paper_name }}
              </div>
            </q-card-section>
            <q-card-section
              v-if="props.row.expiration_date"
              class="q-pt-none"
            >
              <span
                v-if="$moment().local().isAfter($moment(props.row.expiration_date))"
                class="text-red"
              >
                Срок действия истек {{ $moment(props.row.expiration_date).format('ll') }}
              </span>
              <span
                v-else
                class="text-green"
              >
                Действует до {{ $moment(props.row.expiration_date).format('ll') }}
              </span>
            </q-card-section>
            <q-card-section
              v-else
              class="q-pt-none text-green"
            >
              Без срока действия
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-table>
</template>

<script>
import moment from 'moment';
import {mediaURL} from '@/api/services'
import AppImage from '@/components/AppImage'
import { getPersonnelMedpapers, addPersonnelMedpaper } from '@/api/personnel.api'

const columns = [
  { name: 'id', label: 'По добавлению', field: 'id', sortable: true, align: 'center' },
  // { name: 'name', label: 'Название', field: 'name' },
  {
    name: 'expiration', label: 'По сроку действия', field: 'expiration_date', sortable: true,
    sort: (a, b, rowA, rowB) => {
        if (a === null) return -1;
        if (b === null) return 1;
        console.log(a, b, moment(a).diff(b));
        return -moment(a).diff(b);
    },
    align: 'center'
  },
]
export default {
    components: {
        AppImage
    },
    props: {
        personnelId: Number,
        userId: String
    },
    data() {return{
        mediaURL,
        columns,
        medpapersList: []
    }},
    watch: {
      personnelId() {
        this.fetchMedpapers()
      }
    },
    mounted() {
      this.fetchMedpapers()
    },
    methods: {
        getFileUrl(fileId) {
            // return mediaURL + '/' + fileId + '.jpg'
            return 'https://cdn.quasar.dev/img/parallax2.jpg'
        },
        async fetchMedpapers() {
          try {
            const response = await getPersonnelMedpapers(this.userId, this.personnelId)
            console.log(response);
            this.medpapersList = response.data
          } catch (err) {
            console.log(err);
          }
        }
    }
}
</script>

<style>

</style>
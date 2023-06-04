<template>
  <div
    v-if="loading_state"
    style="display: flex; justify: center; margin-top: 20%;"
  >
    <q-spinner-oval
      color="dark"
      size="3em"
      style="margin: auto"
    />
  </div>
  <div v-else>
    <q-table
      title="QR код по 1C"
      :rows="data"
      :columns="columns"
      :wrap-cells="true"
      separator="horizontal"
      :style="{ 'max-height': '70vh', 'margin-right': '10px', 'max-width': '94vw' }"
      table-header-class="app_normal text-black"
      rows-per-page-label="Записей на странице: "
      :pagination-label="(firstRowIndex, endRowIndex, totalRowsNumber) => {
        return firstRowIndex + ' - ' + endRowIndex + ' из ' + totalRowsNumber
      }"
    >
      <template #body="props">
        <q-tr :props="props">
          <q-td
            key="organization_name"
            :props="props"
          >
            {{ props.row.organization_name }}
          </q-td>
          <q-td
            key="date_time"
            :props="props"
          >
            {{ props.row.date_time }}
          </q-td>
          <q-td
            key="id"
            :props="props"
          >
            {{ props.row.id }}
          </q-td>
          <q-td
            key="fio_driver"
            :props="props"
          >
            {{ props.row.fio_driver }}
          </q-td>
          <q-td
            key="pers_number"
            :props="props"
          >
            {{ props.row.pers_number }}
          </q-td>
          <q-td
            key="doc_pdf"
            :props="props"
            style="text-decoration: underline; cursor: pointer;"
            @click="createQR(props.row)"
          >
            Просмотр
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
  <div id="qr_code" />
</template>
<script>
import QRCode from 'qrcode';
import { jsPDF } from "jspdf";
import moment from 'moment';
import { getDocumentsData } from '@/api/personnel.api';

const columns = [
  { name: 'organization_name', required: true, label: 'Организация', align: 'left', field: 'organization_name', sortable: true },
  {
    name: 'date_time',
    label: 'Дата, время',
    align: 'left',
    field: 'date_time',
    sortable: true,
  },
  { name: 'id', label: '№ Документа', align: 'left', field: 'id', sortable: true },
  { name: 'fio_driver', label: 'ФИО', align: 'left', field: 'fio_driver', sortable: true },
  { name: 'pers_number', label: 'Таб. №', align: 'left', field: 'pers_number', sortable: true },
  { name: 'doc_pdf', label: 'Просмотреть PDF', align: 'left', field: 'doc_pdf', sortable: false },
]

export default {

  data() {
    return {
      columns: columns,
      user_id: this.$store.state.user.id,
      loading_state: false,
      data: [],
    }
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    createQR(props) {
      const data = JSON.stringify({
        'ФИО': props.fio_driver, 
        'Дата и время осмотра': props.date_time, 
        'Вердикт': props.verdicts
      });
      QRCode.toDataURL(data)
        .then(url => {
          var pdf = new jsPDF();

          pdf.addImage(url, 'png', 0, 0, 60, 60);
          pdf.save('QR.pdf');
        })
        .catch(err => {
          console.error(err)
        })
      },
      async getTableData() {
        this.loading_state = true;
        try {
          var response;
          response = await getDocumentsData(
            this.user_id,
          );
          const prepareData = response.data.map((item) => {
            return {
              ...item,
              date_time: moment(item.current_timestamp_doc).format('YY-MM-DD HH:mm:ss')
            }
          })
          this.data = prepareData;  
          this.loading_state = false;
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
</script>
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
      title="Список документов"
      :rows="data"
      :columns="columns"
      :wrap-cells="true"
      separator="horizontal"
      :style="{ 'max-height': '60vh', 'margin-right': '10px', 'max-width': '94vw' }"
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
            key="document_type"
            :props="props"
          >
            {{ props.row.document_type }}
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
            @click="createDocument(props.row)"
          >
            Просмотреть
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
<script>
import moment from 'moment';
import { getDocumentsData } from '@/api/personnel.api';
import { DocumentType } from '@/constants/documents';
import { generateDocument as generateProtocol } from './createProtocol';
import { generateDocument as generateAppointment } from './createAppointment';
const columns = [
  { name: 'organization_name', required: true, label: 'Организация', align: 'left', field: 'organization_name', sortable: true },
  { name: 'document_type', label: 'Тип документа', align: 'left', field: 'document_type', sortable: true },
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
      user_id: this.$store.state.user.id,
      columns: columns,
      data: [],
      loading_state: false,
    }
  },
  mounted() {
    this.getTableData();
  },
  methods: {
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
    },
    createDocument(props) {
      if (props.document_type === DocumentType.Protocol) {
        generateProtocol(props)
      }
      else {
        generateAppointment(props)
      }
    }
  }
}
</script>
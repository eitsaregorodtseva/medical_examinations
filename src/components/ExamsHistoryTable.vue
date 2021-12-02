<template>
  <vue-table-lite
    :is-static-mode="true"
    :has-checkbox="false"
    :is-loading="table.isLoading"
    :is-re-search="table.isReSearch"
    :columns="table.columns"
    :rows="table.rows"
    :total="table.totalRecordCount"
    :sortable="table.sortable"
    :messages="table.messages"
  />
</template>

<script>
import VueTableLite from "vue3-table-lite";
import { computed, defineComponent, reactive, toRefs, watch } from "vue";
import moment from 'moment';

export default defineComponent({
  components: {
    VueTableLite,
  },
  props: {
    exams : Array
  },
  setup(props) {

    const name_with_initials = (second, first, father) => {
      let result = second
              + ' ' + first.charAt(0) + '.';
      if (father) {
          result += father.charAt(0) + '.';
      }
      return result;
    }

    const parseVerdictsList = (verdicts_list, verdict_comment) => {
      if (!verdicts_list) {
        return "";
      }

      let result = "";
      if (verdicts_list.includes('Допущен')) {
        return result;
      }
      if (verdicts_list.includes('Другое')) {
        // Replace with comment
        const ind = verdicts_list.indexOf('Другое');
        verdicts_list[ind] = verdict_comment;
      }

      result = verdicts_list.join(', ');
      return result;

    }

    const table = reactive({
      columns: [
        {
          label: "Дата и время",
          field: "exam_datetime",
          width: "5%",
          sortable: true,
          isKey: true,
          display: function (row) {
            return (
              moment(row.exam_datetime).format('lll')
            );
          },
        },
        {
          label: "Организация",
          field: "organization_name",
          width: "10%",
          sortable: true,
        },
        {
          label: "Таб. №",
          field: "pers_number",
          width: "5%",
          sortable: true,
          isKey: true,
        },
        {
          label: "ФИО",
          field: "name",
          width: "15%",
          sortable: true,
          display: function (row) {
            return (
              '<a href="drivers/' +
              row.pers_id +
               '" data-id="' +
              row.pers_id +
              '" >' +
              (row.second_name + ' ' + row.first_name + ' ' + (row.father_name || '')).trim() +
              "</button>"
            );
          },
        },
        {
          label: "Допуск",
          field: "admittance",
          width: "5%",
          sortable: true,
          display: function(row) {
            if (row.admittance === true) {
              return (
                "<div class=\" text-center\" >" +
                "Да" +
                "</div>"
              )
            } else if (row.admittance === false) {
              return (
                "<div class=\"app_error text-center\" >" +
                "Нет" +
                "</div>"
              );
            } else {
              return "";
            }
          }
        },
        {
          label: "Причины недопуска",
          field: "verdicts",
          width: "10%",
          sortable: true,
          display: function(row) {
            return parseVerdictsList(JSON.parse(row.verdicts), row.verdict_comment)
          }
        },
        {
          label: "Медработник",
          field: "med",
          width: "5%",
          sortable: true,
          display: function(row) {
            if (row.med_id) {
              return (
                '<a href="#" data-id="' +
                row.med_id +
                '" >' +
                name_with_initials(row.med_second_name, row.med_first_name, row.med_father_name) +
                "</button>"
              );
            } else {
              return "";
            }
          }
        },
      ],
      rows: props.exams,
      totalRecordCount: computed(() => {
        return table.rows.length;
      }),
      sortable: {
        order: "exam_datetime",
        sort: "desc",
      },
      messages: {
        pagingInfo: "Записи {0}-{1} из {2}",
        pageSizeChangeLabel: "Записей:",
        gotoPageLabel: "Перейти на страницу",
        noDataAvailable: "Нет данных",
      },
    });

    const examsRef = toRefs(props).exams
    watch(examsRef, (newValue, oldValue) => {
      table.rows = newValue
    })


    return {
      table,
    };
  },
});
</script>

<style>
</style>

import * as FileSaver from "file-saver"
import JsExcelTemplate from "js-excel-template/browser/browser"
import { fullName, nameWithInitials } from '@/helpers/names'
import moment from 'moment'

export async function createExamsReport (exams, organizationName, dateFrom, dateTo) {
    await createReport(exams, organizationName, dateFrom, dateTo, "/excel_templates/exams_report_template.xlsx", "Журнал_регистрации_осмотра.xlsx")
}

export async function createSuspendedDriversReport (exams, organizationName, dateFrom, dateTo) {
    await createReport(exams, organizationName, dateFrom, dateTo, "/excel_templates/suspended_drivers_template.xlsx", "Журнал_осмотров_отстранненых_водителей.xlsx")
}

async function createReport (exams, organizationName, dateFrom, dateTo, excelTemplatePath, outputFileName) {
    var formattedExams = createCorrectExamsArray(exams)
    const fetchTable = await fetch(excelTemplatePath)
    const arrayBuffer = await fetchTable.arrayBuffer()
    const excelTemplate = await JsExcelTemplate.fromArrayBuffer(arrayBuffer)
    excelTemplate.set("exams", formattedExams);
    excelTemplate.set("organizationName", organizationName)
    excelTemplate.set("dateFrom", moment(dateFrom).format('DD.MM.YYYY'))
    excelTemplate.set("dateTo", moment(dateTo).format('DD.MM.YYYY'))
    const blob = await excelTemplate.toBlob()
    FileSaver.saveAs(blob, outputFileName);
}

function createCorrectExamsArray(oldExams){
    var newExams = []
    var oneExam = {}
    for (var i = 0; i < oldExams.length; i++){
      oneExam.exam_id = oldExams[i].exam_id
      oneExam.date = moment(oldExams[i].exam_datetime).format('DD.MM.YYYY')
      oneExam.time = moment(oldExams[i].exam_datetime).format('HH:MM')
      oneExam.pers_name = fullName(oldExams[i].second_name, oldExams[i].first_name, oldExams[i].father_name)
      oneExam.pers_number = oldExams[i].pers_number
      oneExam.date_of_birth = moment(oldExams[i].date_of_birth).format('DD.MM.YYYY')
      oneExam.gender = oldExams[i].gender
      if (oldExams[i].complaints != null){
        oneExam.complaints_all = oldExams[i].complaints.replace(/[^a-zа-яё\s,]/gi, '');
      } else{
        oneExam.complaints_all = "Нет"
      }
      oneExam.pressure = oldExams[i].pressure_upper + "/" + oldExams[i].pressure_lower
      oneExam.heart_rate = oldExams[i].heart_rate
      oneExam.temperature = oldExams[i].temperature.toFixed(1)
      oneExam.alcohol = oldExams[i].alcohol
      oneExam.psycho = "Отсутств"
      oneExam.factors = "Отсутств"
      oneExam.med_name_with_initials = nameWithInitials(oldExams[i].med_second_name, oldExams[i].med_first_name, oldExams[i].med_father_name)
      oneExam.med_el_siignature = oldExams[i].med_el_signature
      oneExam.pers_name_with_initials = nameWithInitials(oldExams[i].second_name, oldExams[i].first_name, oldExams[i].father_name)

      newExams.push(oneExam)
      oneExam = {}
    }
    return newExams
  }

import * as FileSaver from "file-saver"
import { Buffer } from 'buffer';
window.Buffer = Buffer;
import XlsxTemplate from 'xlsx-template-browserify';
import {serverURL} from '@/api/services'
import { fullName, nameWithInitials } from '@/helpers/names'
import moment from 'moment'

export async function createExamsReport (exams, organizationName, dateFrom, dateTo) {
    await createReport(exams, organizationName, dateFrom, dateTo, "/excel_templates/exams_report_template.xlsx?v=2.0", "Журнал_регистрации_осмотра.xlsx")
}

export async function createSuspendedDriversReport (exams, organizationName, dateFrom, dateTo) {
    await createReport(exams, organizationName, dateFrom, dateTo, "/excel_templates/suspended_drivers_template.xlsx?v=2.0", "Журнал_осмотров_отстранненых_водителей.xlsx")
}

async function createReport (exams, organizationName, dateFrom, dateTo, excelTemplatePath, outputFileName) {

    var formattedExams = await createCorrectExamsArray(exams)
    // Get template excel file
    const fetchTable = await fetch(excelTemplatePath)
    const arrayBuffer = await fetchTable.arrayBuffer()
    // Create a template
    var option = {imageRatio : 10}
    var template = new XlsxTemplate(arrayBuffer, option);
    // Replacements take place on zero and first sheets
    var firstSheetName = "Обложка";
    var mainSheetName = "Осмотры";
    // Set up some placeholder values matching the placeholders in the template
    var values = {
            exams: formattedExams,
            organizationName: organizationName,
            dateFrom: dateFrom,
            dateTo: dateTo
        };
    // Perform substitution
    template.substitute(firstSheetName, values);
    template.substitute(mainSheetName, values);
    // Get binary data
    var data = template.generate({type: 'blob'});
    FileSaver.saveAs(data, outputFileName);
}

async function createCorrectExamsArray(oldExams){
    var newExams = []
    var oneExam = {}
    for (var i = 0; i < oldExams.length; i++){
      oneExam.exam_id = oldExams[i].exam_id
      oneExam.date = moment(oldExams[i].exam_datetime).format('DD.MM.YYYY')
      oneExam.time = moment(oldExams[i].exam_datetime).format('HH:MM')
      oneExam.datetime = oneExam.date + '\n' + oneExam.time
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
      var med_name_with_initials = nameWithInitials(oldExams[i].med_second_name, oldExams[i].med_first_name, oldExams[i].med_father_name)
      var med_el_signature = oldExams[i].med_el_signature
      oneExam.medworker_data = med_name_with_initials + '\n' + med_el_signature
      oneExam.pers_name_with_initials = nameWithInitials(oldExams[i].second_name, oldExams[i].first_name, oldExams[i].father_name)

      if (oldExams[i].signature != null && oldExams[i].signature != ""){
        var signatureURL = serverURL + `/api/mediaserver/get_image?file_id=${oldExams[i].signature}`
        const response = await fetch(signatureURL)
        const imageBlob = await response.blob()

        const blobToBase64 = blob => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          return new Promise(resolve => {
            reader.onloadend = () => {
              resolve(reader.result);
            };
          });
        };

        var base64data = await blobToBase64(imageBlob)
        var strImage = base64data.replace(/^data:image\/[a-z]+;base64,/, "");
        oneExam.signature = strImage
      }
      else {
        oneExam.signature = ""
      }

      newExams.push(oneExam)
      oneExam = {}
    }
    return newExams
  }

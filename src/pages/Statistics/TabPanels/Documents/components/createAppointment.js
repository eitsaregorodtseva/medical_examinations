import jsPDF from "jspdf";
import moment from "moment";

export async function generateDocument(data) {
  var doc = new jsPDF();
  doc.addFont("PTSans.ttf", "PTSans", "normal");

  doc.setFont("PTSans"); // set font
  doc.setFontSize(18);

  doc.text("Направление на врача", 75, 20, {bold: true});
  doc.setFontSize(14);

  doc.text(`ФИО: ${data.fio_driver}`, 10, 40);
  doc.text(`Направлен в медицинское учреждение ${data.medical_institution}`, 10, 50);
  doc.text('Для проверки здоровья после дистанционного осмотра:', 10, 60);
  doc.text(`- давление: ${data.pressure_upper}/${data.pressure_lower}.`, 20, 70);

  doc.save(`Направление на врача_${data.fio_driver}_${moment().format('DD-MM-YY')}.pdf`);
}
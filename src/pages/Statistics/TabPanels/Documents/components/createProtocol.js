import moment from "moment";
import jsPDF from "jspdf";


export async function generateDocument (data) {
  var doc = new jsPDF();
  doc.addFont("PTSans.ttf", "PTSans", "normal");
  doc.setFont("PTSans"); 

  doc.setFontSize(18);
  doc.text("Протокол контроля трезвости", 60, 20, {bold: true});
  doc.setFontSize(14);
  doc.text(`ФИО: ${data.fio_driver}`, 10, 40);
  doc.text(`Место работы: ${data.organization_name}`, 10, 50);
  doc.text(`Кем и когда направлен на обследование: ${data.fio_medic} ${moment().format('DD-MM-YY')}`, 10, 60);
  doc.text(`Жалобы: ${data.complaints}`, 10, 70);
  doc.text(`Пульс: ${data.heart_rate}`, 10, 80);
  doc.text(`Давление: ${data.pressure_upper}/${data.pressure_lower}`, 10, 90);
  doc.text(`Алкоголь: ${data.alcohol}`, 10, 100);
  doc.text(`Заключение: ${data.verdict}`, 10, 110);
  doc.text(`Дата и время выдачи направления: ${moment().format('DD-MM-YY HH:mm:ss')}`, 10, 120);

  doc.addPage()
  doc.setFontSize(18);
  doc.text("Направление на освидетельствование", 60, 20, {bold: true});
  doc.setFontSize(14);
  doc.text(`ФИО: ${data.fio_driver}`, 10, 40);
  doc.text(`Место работы: ${data.fio_driver}`, 10, 50);
  doc.text(`Дата и время выдачи направления: ${moment().format('DD-MM-YY HH:mm:ss')}`, 10, 60);
  doc.text('Приложение', 10, 70);
  doc.text(`ФИО: ${data.fio_driver}`, 20, 80);
  doc.text(`Место работы: ${data.organization_name}`, 20, 90);
  doc.text(`Кем и когда направлен на обследование: ${data.fio_medic} ${moment().format('DD-MM-YY')}`, 20, 100);
  doc.text(`Жалобы: ${data.complaints}`, 20, 110);
  doc.text(`Пульс: ${data.heart_rate}`, 20, 120);
  doc.text(`Давление: ${data.pressure_upper}/${data.pressure_lower}`, 20, 130);
  doc.text(`Алкоголь: ${data.alcohol}`, 20, 140);
  doc.text(`Заключение: ${data.verdict}`, 20, 150);
  doc.text(`Дата и время выдачи направления: ${moment().format('DD-MM-YY HH:mm:ss')}`, 20, 160);


  doc.addPage()
  doc.setFontSize(18);
  doc.text("Согласие на освидетельствование", 60, 20, {bold: true});
  doc.setFontSize(14);
  doc.text(`ФИО: ${data.fio_driver}`, 10, 40);
  doc.text(`Дата рождения: ${data.date_of_birth}`, 10, 50);
  doc.text(`ФИО медицинского работника: ${data.fio_medic}`, 10, 60);
  doc.text(`Дата: ${moment(data.exam_datetime).format('DD-MM-YY')}`, 10, 70);

  doc.addPage()
  doc.setFontSize(18);
  doc.text("Отказ от освидетельствования", 60, 20, {bold: true});
  doc.setFontSize(14);
  doc.text(`ФИО: ${data.fio_driver}`, 10, 40);
  doc.text(`Дата рождения: ${data.date_of_birth}`, 10, 50);
  doc.text(`ФИО медицинского работника: ${data.fio_medic}`, 10, 60);
  doc.text(`Дата: ${moment(data.exam_datetime).format('DD-MM-YY')}`, 10, 70);

  doc.save(`Протокол контроля трезвости_${data.fio_driver}_${moment().format('DD-MM-YY')}.pdf`);
}
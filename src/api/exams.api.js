import { webAPI } from "./services";

const getQueueSize = user_id => webAPI.get('/queue_size',
    { params : {user_id} });

const getNextPatient = user_id => webAPI.get('/get_patient',
    { params : {user_id} });

const getVerdictList = () => webAPI.get('/values/verdicts');

const getExamsTypesList = () => webAPI.get('/values/exams_types');

const getExamData = (exam_id, user_id) => webAPI.get(`/exams/${exam_id}`,
    { params : {user_id} });

const getExamsHistoryAll = (user_id, has_verdict = null, organization_id = null,
    personnel_id = null, date_from = null, date_to = null, type = null, admittance = null) => webAPI.get('/exams',
    { params: {user_id, has_verdict, organization_id, personnel_id, date_from, date_to,
                type, admittance} });

const getExamsHistoryForOrganization = (user_id, organization_id) => webAPI.get('/exams',
    { params: {user_id, organization_id} });

const getExamsHistoryForPersonnel = (user_id, personnel_id) => webAPI.get('/exams',
    { params: {user_id, personnel_id} });

const getExamsHistoryByVerdict = (user_id, has_verdict) => webAPI.get('/exams',
    { params: {user_id, has_verdict} });

const postVerdict = (exam_id, verd_list, user_id, verdict_comment = null, verdict_start_datetime, verdict_finish_datetime) => webAPI.post(`/exams/${exam_id}/verdict`,
    verd_list, { params: {user_id, verdict_comment, verdict_start_datetime, verdict_finish_datetime} });

const patchMedworkerInExam = (exam_id, user_id, medworker_id) => webAPI.patch(`/exams/${exam_id}`,
    null, { params : {user_id, medworker_id} });

const getExamsHistoryByPeriod = (user_id, date_from, date_to) => webAPI.get('/exams',
{ params: {user_id, date_from, date_to} });

const getExamsHistoryForOrganizationByPeriod = (user_id, organization_id, date_from, date_to) => webAPI.get('/exams',
    { params: {user_id, organization_id, date_from, date_to} });
    
const getExamsCountByPeriod = (user_id, start_date, end_date) => webAPI.get('/calendar',
    { params: {user_id, start_date, end_date} });

const getExamsCountForOrganizationByPeriod = (user_id, start_date, end_date, organization_id) => webAPI.get('/calendar',
    { params: {user_id, start_date, end_date, organization_id} });

export {
    getQueueSize,
    getNextPatient,
    getVerdictList,
    getExamsTypesList,
    getExamData,
    getExamsHistoryAll,
    getExamsHistoryForOrganization,
    getExamsHistoryForPersonnel,
    getExamsHistoryByVerdict,
    postVerdict,
    patchMedworkerInExam,
    getExamsHistoryByPeriod,
    getExamsHistoryForOrganizationByPeriod,
    getExamsCountByPeriod,
    getExamsCountForOrganizationByPeriod
}

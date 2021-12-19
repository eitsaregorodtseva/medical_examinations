import { webAPI } from "./services";

const getQueueSize = user_id => webAPI.get('/queue_size',
    { params : {user_id} });

const getNextPatient = user_id => webAPI.get('/get_patient',
    { params : {user_id} });

const getVerdictList = () => webAPI.get('/values/verdicts');

const getExamData = (exam_id, user_id) => webAPI.get(`/exams/${exam_id}`,
    { params : {user_id} });

const getExamsHistoryAll = (user_id) => webAPI.get('/exams',
    { params: {user_id} });

const getExamsHistoryForOrganization = (user_id, organization_id) => webAPI.get('/exams',
    { params: {user_id, organization_id} });

const getExamsHistoryForPersonnel = (user_id, personnel_id) => webAPI.get('/exams',
    { params: {user_id, personnel_id} });

const postVerdict = (exam_id, verd_list, user_id, verdict_comment = null) => webAPI.post(`/exams/${exam_id}/verdict`,
    verd_list, { params: {user_id, verdict_comment} });

export {
    getQueueSize,
    getNextPatient,
    getVerdictList,
    getExamData,
    getExamsHistoryAll,
    getExamsHistoryForOrganization,
    getExamsHistoryForPersonnel,
    postVerdict,
}

import { webAPI } from "./services";

const authMedic = authData => webAPI.get('/authorize',
    { params : authData });

const getNextPatient = user_id => webAPI.get('/get_patient',
    { params : {user_id} });

const getVerdictList = () => webAPI.get('/values/verdicts');

const getExamData = (exam_id, user_id) => webAPI.get(`/exams/${exam_id}`,
    { params : {user_id} });

const getExamHist = (user_id, personnel_id) => webAPI.get('/exams',
    { params: {user_id, personnel_id} });

const postVerdict = (exam_id, verd_list, user_id, verdict_comment = null) => webAPI.post(`/exams/${exam_id}/verdict`,
    verd_list, { params: {user_id, verdict_comment} });

export {
    authMedic,
    getNextPatient,
    getVerdictList,
    getExamData,
    getExamHist,
    postVerdict,
}
import {webAPI} from "./services";

const getExams = (user_id, organization_id=null) => webAPI.get('/exams',
    {params : {user_id, organization_id}})

export {
    getExams
}
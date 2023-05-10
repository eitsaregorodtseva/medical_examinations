import { webAPI } from "./services";

const getMedworkersStats = (user_id, start_date, end_date, all = false, delay_verdict = false) => webAPI.get('/medic',
    { params : {user_id, start_date, end_date, all, delay_verdict} });

export {
  getMedworkersStats,
}
import { webAPI } from "./services";

const getMedworkersStats = (user_id, start_date, end_date, all = false, delay_verdict = false) => webAPI.get('/medic',
    { params : {user_id, start_date, end_date, all, delay_verdict} });

const getWorkload = (user_id, start_date, end_date, page, count_row) => webAPI.get('/workload',
{ params : {user_id, start_date, end_date, page, count_row} });  

const getMaxWorkload = (user_id, start_date, end_date) => webAPI.get('/max_workload',
{ params : {user_id, start_date, end_date} });  

export {
  getMedworkersStats,
  getWorkload,
  getMaxWorkload
}
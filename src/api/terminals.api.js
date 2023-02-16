import { webAPI } from "./services";

const getAllTermsStats = (user_id, start_date, end_date) => webAPI.get('/terminals/statistics',
    { params : {user_id, start_date, end_date} });

const getOneTermnStats = (organization_id, user_id, start_date, end_date) => webAPI.get(`/terminals/${organization_id}/statistics`,
    { params: {user_id, organization_id, start_date, end_date} });

const getTermsHistoryByPeriod = (user_id, date_from, date_to) => webAPI.get('/terminals', 
    { params: {user_id, date_from, date_to} });

export {
    getAllTermsStats,
    getOneTermnStats,
    getTermsHistoryByPeriod,
}

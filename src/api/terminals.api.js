import { webAPI } from "./services";

const getAllTermsStats = (user_id, organization_id, start_date, end_date) => webAPI.get('/terminals/statistics',
    { params : {user_id, organization_id, start_date, end_date} });

export {
    getAllTermsStats
}

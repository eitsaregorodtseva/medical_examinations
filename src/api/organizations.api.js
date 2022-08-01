import { webAPI } from "./services";

const getAllOrganizations = (user_id) => webAPI.get('/organizations',
    { params : {user_id} });

const getAllOrganizationsStats = (user_id, start_date, end_date) => webAPI.get('/organizations/statistics',
    { params : {user_id, start_date, end_date} });

const getOneOrganizationStats = (organization_id, user_id, start_date, end_date) => webAPI.get(`/organizations/${organization_id}/statistics`,
    { params: {user_id, organization_id, start_date, end_date} });

const getOneOrganization = (user_id, organization_id, ) => webAPI.get(`/organizations/${organization_id}`,
    { params: {user_id, organization_id} });

export {
    getAllOrganizations,
    getAllOrganizationsStats,
    getOneOrganizationStats,
    getOneOrganization
}

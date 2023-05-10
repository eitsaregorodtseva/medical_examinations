import { webAPI } from "./services";

const getOrganizationSettings = (user_id) => webAPI.get('/settings/organizations',
    { params : {user_id} });

const getTerminalsSettings = (user_id) => webAPI.get('/settings/terminals',
    { params : {user_id} });

const getAccessSettings = (user_id) => webAPI.get('/settings/access',
    { params : {user_id} });

export {
    getOrganizationSettings,
    getTerminalsSettings,
    getAccessSettings,
}

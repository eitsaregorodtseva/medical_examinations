import {webAPI} from "./services";

const addPersonnelRecord = (user_id, personnel_data) => webAPI.post('/personnel',
personnel_data, {params : {user_id}})

const getPersonnelList = (user_id, organization_id = null) => webAPI.get('/personnel',
    {params : {user_id, organization_id}})

const getPersonnelRecord = (user_id, personnel_id) => webAPI.get(`/personnel/${personnel_id}`,
    {params : {user_id}})

const updatePersonnelRecord = (user_id, personnel_id, personnel_data) => webAPI.patch(`/personnel/${personnel_id}`,
    personnel_data, {params : {user_id}})

const deletePersonnelRecord = (user_id, personnel_id) => webAPI.patch(`/personnel/${personnel_id}`,
    {params : {user_id, personnel_id}})

const getPersonnelMedpapers = (user_id, personnel_id) => webAPI.get(`/personnel/${personnel_id}/medpapers`,
    {params : {user_id}})

const addPersonnelMedpaper = (user_id, personnel_id, medpaper_data) => webAPI.post(`/personnel/${personnel_id}/medpapers`,
    medpaper_data, {params: {user_id}})

export {
    addPersonnelRecord,
    getPersonnelList,
    getPersonnelRecord,
    updatePersonnelRecord,
    deletePersonnelRecord,
    getPersonnelMedpapers,
    addPersonnelMedpaper
}
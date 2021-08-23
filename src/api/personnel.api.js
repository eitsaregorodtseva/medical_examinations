import {webAPI} from "./services";

const getPersonnelInfo = (user_id, personnel_id) => webAPI.get('/personnel_info',
    {params : {user_id, personnel_id}})

const getPersonnelList = (user_id, organization_id = null) => webAPI.get('/personnel_list',
    {params : {user_id, organization_id}})

const addPersonnel = (user_id, personnel_data) => webAPI.post('/add_personnel', 
    personnel_data, {params : {user_id}})

const updatePersonnel = (user_id, personnel_id, personnel_data) => webAPI.patch('/update_personnel',
personnel_data, {params : {user_id, personnel_id}})

export {
    getPersonnelInfo,
    getPersonnelList,
    addPersonnel,
    updatePersonnel
}
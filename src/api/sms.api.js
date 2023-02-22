import { webAPI } from "./services";

const postPhoneNumber = (tel) => webAPI.post(`/sms/auth/generate_code`, { 
    tel 
});

const getCheckCodeStatus = (tel, code) => webAPI.get(`/sms/auth/check_code`, { 
    params: { tel, code } 
});

const postUser = (second_name, first_name, father_name, organization_id, tel) => webAPI.post(`/sms/users`, {
    second_name, first_name, father_name, organization_id, tel
});


export { 
    postPhoneNumber, 
    getCheckCodeStatus, 
    postUser 
};

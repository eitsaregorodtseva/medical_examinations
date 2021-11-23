import { webAPI } from "./services";

const auth = authData => webAPI.get('/authorize',
    { params : authData });

export {
    auth,
}
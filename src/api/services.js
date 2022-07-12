import axios from 'axios';
import {notify} from '@kyvg/vue3-notification'


const serverURL = 'https://меддопуск.рф';
const mediaURL = 'https://меддопуск.рф';
// const serverURL = 'https://stats.auditory.ru';
// const mediaURL = 'https://stats.auditory.ru';

const webAPI = axios.create({
    baseURL: serverURL + '/api/web',
    timeout: 7000,
    headers: {
        "Content-Type": "application/json",
    }
});

const mediaAPI = axios.create({
    baseURL: serverURL + '/api/mediaserver',
    timeout: 7000,
    headers: {
        "Content-Type": "application/json",
    }
});

// interceptor to catch errors
const errorInterceptor = error => {
    // check if it's a server error
    if (!error.response) {
      console.error('Network/Server error: ' + error.message);
      notify({
          type : 'error',
          title : 'Ошибка сети или сервера',
          text : 'Проверьте подключение к Интернету'
        });
      return Promise.reject(error);
    }

    // all the other error responses
    switch(error.response.status) {
        case 404:
            console.error(error.response.status, error.message, error.response.data);
            break;

        default:
            console.error(error.response.status, error.message, error.response.data);

    }
    return Promise.reject(error);
}

// Interceptor for responses
const responseInterceptor = response => {
    switch(response.status) {
        case 200:
            // yay!

            break;
        // any other cases
        default:
            // default case
    }

    return response;
}

webAPI.interceptors.response.use(responseInterceptor, errorInterceptor);
mediaAPI.interceptors.response.use(responseInterceptor, errorInterceptor);

export {
    serverURL,
    mediaURL,
    webAPI,
    mediaAPI
}

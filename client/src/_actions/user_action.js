import { LOGIN_USER } from './types';
import Axios from 'axios';

export function loginUser(dataToSubmit) {
    const request = Axios.post('/api/users/login', dataToSubmit)
    .then(response => response.data)

    console.log('이건 reqeust', request)

    return {
        type: LOGIN_USER,
        payload: request
    }
}

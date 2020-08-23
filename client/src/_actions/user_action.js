import { LOGIN_USER, REGISTER_USER, AUTH_USER } from './types';
import Axios from 'axios';

export const loginUser=(dataToSubmit) =>{
    const request = Axios.post('/api/users/login', dataToSubmit)
        .then(response => response.data)

    console.log('이건 reqeust1', request)

    return {
        type: LOGIN_USER,
        payload: request
    }
}

export const registerUser = (dataToSubmit) => {
    const request = Axios.post('/api/users/register', dataToSubmit)
        .then(response => response.data)

    return {
        type: REGISTER_USER,
        payload: request
    }
}

export const auth = () => {
    const request = Axios.get('/api/users/auth')//get이므로 body는 필요없음
        .then(response => response.data)

    return {
        type: AUTH_USER,
        payload: request
    }
}
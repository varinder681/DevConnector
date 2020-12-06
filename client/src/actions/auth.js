import { 
    REGISTER_SUCCESS, 
    REGISTER_FAIL, 
    USER_LOADED, 
    AUTH_ERROR,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    LOGOUT,
    CLEAR_PROFILE
} from './types';

import {setAlert} from "../actions/alert";
import setAuthToken from "../utils/setAuthToken";

import axios from 'axios';


// Load User 

export const loadUser = () => async dispatch => {
    if(localStorage.token){
        setAuthToken(localStorage.token);
    }

    try {
        const res = await axios.get('/api/auth');

        dispatch({
            type : USER_LOADED,
            payload : res.data
        })
    } catch (err) {
        dispatch({
            type : AUTH_ERROR
        })
    }

}

// Register User

export const register =  (user) => async dispatch => {

    const config = {
        "headers" : {
            'Content-Type' : "application/json"
        }
    } 
    const body = JSON.stringify({ ...user });

    try {
        const res = await axios.post('/api/users',body, config);
        
        dispatch({
            type : REGISTER_SUCCESS,
            payload : res.data
        })

        dispatch(loadUser());
        
    } catch (err) {

        const errors = err.response.data.errors;
        // console.log(err.response);
        
        if(errors){
            errors.forEach(err =>  dispatch(setAlert(err.msg,'danger')));
        }
        dispatch({
            type : REGISTER_FAIL
        })
    }

}


// Login User

export const login = (user) => async dispatch => {
    try { 
        const res = await axios.post('/api/auth', JSON.stringify({...user}), {
            headers : {
                'Content-Type' : 'application/json'
            }
        })
        localStorage.setItem('token',res.data.token);
        dispatch({
            type : LOGIN_SUCCESS,
            payload : res.data
        });

        dispatch(loadUser());

    } catch (err) {
        const errors = err.response.data.errors;
        // console.log(err.response);
        if(errors){
            errors.forEach(err =>  dispatch(setAlert(err.msg,'danger')));
        }
        dispatch({
            type : LOGIN_FAIL
        })
    }
}

// Log out User

export const logout = () => dispatch => {
    dispatch({type : CLEAR_PROFILE});
    dispatch({ type : LOGOUT });
}

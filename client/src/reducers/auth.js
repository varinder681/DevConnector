import { 
    REGISTER_SUCCESS, 
    REGISTER_FAIL, 
    USER_LOADED, 
    AUTH_ERROR, 
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    ACCOUNT_DELETED
} from '../actions/types';

const initialState = {
    token : localStorage.getItem('token'),
    isAuthenticated : false,
    loading : true,
    user : null
}

const auth = (state = initialState, action) => {
    const {type, payload} = action;

    switch(type) {


        case USER_LOADED : 
            return {
                ...state,
                user : payload,
                loading : false,
                isAuthenticated : true
            }
        case LOGIN_SUCCESS : 
        case REGISTER_SUCCESS :
            localStorage.setItem('token',payload.token);
            return {
                ...state,
                ...payload,
                isAuthenticated : true,
                loading : false
            };

        case LOGIN_FAIL:
        case REGISTER_FAIL: 
        case AUTH_ERROR :
        case LOGOUT:
        case ACCOUNT_DELETED:
            localStorage.removeItem('token');
            return {
                ...initialState,
                token : null,
                loading : false
            };
        default : 
            return state;
    }
}

export default auth;
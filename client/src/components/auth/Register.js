import React,{ useState } from 'react'
import {Link, Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';

const Register = ({setAlert, register, isAuth}) => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });
    const { name, email, password, password2 } = formData;

    const onChange = event => setFormData({
        ...formData,
        [event.target.name] : event.target.value
    })

    const onSubmit = event => {
        event.preventDefault();
        if(password !== password2){
            setAlert("Password does not match", 'danger');
        }else{
            const user = {
                name,
                email,
                password
            }
            register(user);
        }
    }

    if(isAuth){
        return <Redirect to="/dashboard" />; 
    }


    return (
        <React.Fragment>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
            <form className="form" onSubmit={onSubmit}>
                <div className="form-group">
                    <input type="text" onChange={onChange} placeholder="Name" value={name} name="name" required />
                </div>
                <div className="form-group">
                    <input type="email" onChange={onChange} placeholder="Email Address" value={email} name="email" />
                    <small className="form-text">This site uses Gravatar so if you want a profile image, use a
                    Gravatar email</small>
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        minLength="6"
                        value={password}
                        onChange={onChange}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="password2"
                        minLength="6"
                        value={password2}
                        onChange={onChange}
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
                Already have an account? <Link to="/login">Sign In</Link>
            </p>
        </React.Fragment>
    )
}

Register.propTypes = {
    setAlert : PropTypes.func.isRequired,
    isAuth : PropTypes.bool.isRequired
}

const mapStateToProps = state => {
    return {
        isAuth : state.auth.isAuthenticated
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setAlert : (msg, alertType) => dispatch(setAlert(msg,alertType)),
        register : (user) => dispatch(register(user))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
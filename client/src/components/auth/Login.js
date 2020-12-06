import React,{ useState } from 'react';
import {Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "../../actions/auth";
import PropTypes from "prop-types";

const Login = ({login, isAuth}) => {

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { email, password } = formData;

    const onChange = event => setFormData({
        ...formData,
        [event.target.name] : event.target.value
    })

    const onSubmit = async event => {
        event.preventDefault();
        login(formData);
        // console.log(formData);
    }
    
    if(isAuth){
        return <Redirect to="/dashboard" />; 
    }


    return (
        <React.Fragment>
            <h1 className="large text-primary">Log In</h1>
            <p className="lead"><i className="fas fa-user"></i> Sign In Your Account</p>
            <form className="form" onSubmit={onSubmit}>

                <div className="form-group">
                    <input type="email" onChange={onChange} placeholder="Email Address" value={email} name="email" />

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

                <input type="submit" className="btn btn-primary" value="Login" />
            </form>
            <p className="my-1">
                Do not Not have an Account? <Link to="/register">Sign Up</Link>
            </p>
        </React.Fragment>
    )
}

Login.propTypes = {
    login : PropTypes.func.isRequired,
    isAuth : PropTypes.bool.isRequired
}

const mapStateToProps = state => {
    return {
        isAuth : state.auth.isAuthenticated
    }
}

const mapDispatchToProps = dispatch => {
    return {
        login : (user) => dispatch(login(user))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Login);
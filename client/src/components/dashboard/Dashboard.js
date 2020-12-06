/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from "react-redux"
import { deleteAccount, getCurrentProfile } from "../../actions/profile";
import Spinner from "../layout/Spinner";
import { Link } from 'react-router-dom';
import Experience from "./Experience";
import Education from "./Education";
import DashboardActions from "./DashboardActions";

const Dashboard = ({ getCurrentProfile,deleteAccount, auth: { user }, profile: { profile, loading } }) => {

    useEffect(() => {
        getCurrentProfile();
    }, [])

    if (profile === null && loading) {
        return <Spinner />
    }
    return (
        <React.Fragment>
            <h1 className="large text-primary">Dashboard</h1>
            <p className="lead">
                <i className="fas fa-user"></i>
                Welcome {user && user.name}
            </p>
            { profile !== null ?
                <React.Fragment>
                    <DashboardActions />
                    <Experience experience={profile.experience} /> 
                    <Education education={profile.education}/>
                    <div className="my-2">
                        <button onClick={() => deleteAccount()} className="btn btn-danger">
                            <i className="fas fa-user-minus"></i>
                            {' '}Delete My Account
                        </button>
                    </div>

                </React.Fragment>
                :
                <React.Fragment>
                    <p>You have not setup your Profile</p>
                    <Link to="/create-profile" className="btn btn-primary my-1">
                        Create Profile
                    </Link>
                </React.Fragment>
            }
        </React.Fragment>
    )
}

Dashboard.propTypes = {
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    getCurrentProfile: PropTypes.func.isRequired,
    deleteAccount : PropTypes.func.isRequired
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        profile: state.profile,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getCurrentProfile: () => dispatch(getCurrentProfile()),
        deleteAccount : () => dispatch(deleteAccount())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

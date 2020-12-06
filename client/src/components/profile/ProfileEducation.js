import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";

const ProfileEducation = ({ education }) => {
  return (
    <div>
      <h3 className="text-dark">{education.school}</h3>
      <p>
        <strong>Degree: </strong>
        {education.degree}
      </p>
      <p>
        <strong>Field of study: </strong>
        {education.fieldofstudy}
      </p>
      <p>
        <Moment format="YYYY/MM/DD">{education.from}</Moment> -{" "}
        {!education.to ? (
          "Present"
        ) : (
          <Moment format="YYYY/MM/DD">{education.to}</Moment>
        )}
      </p>
      
      <p>
        {education.description !== "" && (
          <Fragment>
            <strong>Description: </strong>
            {education.description}
          </Fragment>
        )}
      </p>
    </div>
  );
};

ProfileEducation.propTypes = {
  education: PropTypes.object.isRequired,
};

export default ProfileEducation;

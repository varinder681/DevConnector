import React from "react";
import { connect } from "react-redux";
import Moment from "react-moment";
import PropTypes from "prop-types";
import { deleteEducation } from "../../actions/profile"

const Experience = ({ education, deleteEducation }) => {
  const educations = education.map((edu) => (
    <tr key={edu._id}>
      <td>{edu.school}</td>
      <td className="hide-sm">{edu.degree}</td>
      <td className="hide-sm">{edu.fieldofstudy}</td>
      <td>
        <Moment format="YYYY/MM/DD">{edu.from}</Moment> -{" "}
        {edu.to === null ? (
          "Present"
        ) : (
          <Moment format="YYYY/MM/DD">{edu.to}</Moment>
        )}
      </td>
      <td>
          <button onClick={() => deleteEducation(edu._id)} className="btn btn-danger">Delete</button>
      </td>
    </tr>
  ));

  return (
    <React.Fragment>
      <h2 className="my-2">Education Credientials</h2>
      <table className="table">
        <thead>
          <tr>
            <th>School</th>
            <th className="hide-sm">Degree</th>
            <th className="hide-sm">Field Of Study</th>
            <th className="hide-sm">Years</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{educations}</tbody>
      </table>
    </React.Fragment>
  );
};
Experience.prototypes = {
  education: PropTypes.array.isRequired,
  deleteEducation : PropTypes.func.isRequired
};

export default connect(null,{deleteEducation})(Experience);

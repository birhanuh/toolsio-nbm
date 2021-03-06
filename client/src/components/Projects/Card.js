import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Link } from "react-router-dom";
// Semantic UI JS
import { Progress } from "semantic-ui-react";

// Localization
import T from "i18n-react";

import moment from "moment";

export default function Card({ project }) {
  return (
    <div key={project.id} className="card">
      <div className="content">
        <div
          className={classnames("ui uppercase tiny right ribbon label", {
            blue: project.status === "new",
            orange: project.status === "in progress",
            green: project.status === "finished",
            turquoise: project.status === "delivered",
            red: project.status === "delayed"
          })}
        >
          {project.status}
        </div>

        <Link
          to={`/projects/show/${project.id}`}
          className={classnames("ui header", {
            blue: project.status === "new",
            orange: project.status === "in progress",
            green: project.status === "finished",
            turquoise: project.status === "delivered",
            red: project.status === "delayed"
          })}
        >
          <h3>{project.name}</h3>
        </Link>

        <div className="description">{project.description}</div>

        <table className="ui very basic center aligned table projects">
          <thead>
            <tr>
              <th>{T.translate("projects.show.user")}</th>
              <th>{T.translate("projects.page.deadline")}</th>
              <th>{T.translate("projects.page.customer")}</th>
              <th>{T.translate("projects.page.progress")}</th>
              <th>{T.translate("projects.page.invoiced")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{project.user.firstName}</td>
              <td>{moment(project.deadline).format("ll")}</td>
              <td>
                {project.customer ? (
                  project.customer.name
                ) : (
                  <p className="blue">
                    {T.translate("projects.page.no_customer")}
                  </p>
                )}
              </td>
              <td>
                <Progress
                  progress
                  percent={project.progress}
                  success
                  size="small"
                  className="mt-4"
                />
              </td>
              <td>
                {project.isInvoiced === true && (
                  <i className="check circle outline green icon"></i>
                )}
                {project.isInvoiced === false && (
                  <i className="times circle outline red icon"></i>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

Card.propTypes = {
  project: PropTypes.object.isRequired
};

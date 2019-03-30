import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import map from "lodash/map";
import sumBy from "lodash/sumBy";
import classnames from "classnames";
// Semantic UI JS
import { Card, Table, Header, Label } from "semantic-ui-react";

import GetCurrencySymbol from "../../../utils/currency";

// Localization
import T from "i18n-react";

import moment from "moment";

export default function Project({ project, status, tax }) {
  let tasksTotal = sumBy(project.tasks, "total");
  let invoiceTotal = tasksTotal + (tax / 100) * tasksTotal;

  return (
    <Card fluid>
      <Card.Content className="p-4">
        <Header as="h3">
          {<Link to={`/projects/show/${project.id}`}>{project.name}</Link>}
        </Header>
      </Card.Content>
      <Card.Content>
        <Table basic="very" collapsing celled>
          <tbody>
            <tr>
              <td>
                <i className="ui tiny header">
                  {T.translate("invoices.show.project.deadline")}
                </i>
              </td>
              <td>{moment(project.deadline).format("ll")}</td>
            </tr>
            <tr>
              <td>
                <i className="ui tiny header">
                  {T.translate("invoices.show.project.status")}
                </i>
              </td>
              <td>
                <Label
                  size="tiny"
                  className="uppercase"
                  color={
                    (project.status === "new" && "blue") ||
                    (project.status === "in progress" && "orange") ||
                    ((project.status === "finished" ||
                      project.status === "delivered") &&
                      project.status === "delayed" &&
                      "red")
                  }
                >
                  {project.status}
                </Label>
              </td>
            </tr>
            <tr>
              <td>
                <i className="ui tiny header">
                  {T.translate("invoices.show.project.description")}
                </i>
              </td>
              <td>{project.description ? project.description : ""}</td>
            </tr>
          </tbody>
        </Table>

        <Header as="h4" dividing>
          {T.translate("invoices.show.project.tasks.header")}
        </Header>
        <Table basic="very" className="invoice project">
          <thead>
            <tr>
              <th>{T.translate("invoices.show.project.tasks.name")}</th>
              <th className="right aligned">
                {T.translate("invoices.show.project.tasks.payment_type")}
              </th>
              <th className="right aligned">
                {T.translate("invoices.show.project.tasks.hours")}
              </th>
              <th className="right aligned">
                {T.translate("invoices.show.project.tasks.unit_price")}
              </th>
              <th className="right aligned">
                {T.translate("invoices.show.project.tasks.total")}
              </th>
            </tr>
          </thead>
          <tbody>
            {map(project.tasks, task => (
              <tr key={task.id}>
                <td>{task.name}</td>
                <td className="right aligned">{task.paymentType}</td>
                <td className="right aligned">{task.hours}</td>
                <td className="right aligned">{task.unitPrice}</td>
                <td className="right aligned">{task.total}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="3" />
              <td
                className={classnames("right aligned", {
                  blue: project.status === "new",
                  orange: project.status === "in progress",
                  green:
                    project.status === "finished" ||
                    project.status === "delivered",
                  red: project.status === "delayed"
                })}
              >
                {T.translate("invoices.show.subtotal")}
              </td>
              <td
                className={classnames("right aligned", {
                  blue: project.status === "new",
                  orange: project.status === "in progress",
                  green:
                    project.status === "finished" ||
                    project.status === "delivered",
                  red: project.status === "delayed"
                })}
              >
                <strong>{tasksTotal}</strong>
              </td>
            </tr>
            <tr>
              <td colSpan="3" />
              <td
                className={classnames("right aligned", {
                  blue: project.status === "new",
                  orange: project.status === "in progress",
                  green:
                    project.status === "finished" ||
                    project.status === "delivered",
                  red: project.status === "delayed"
                })}
              >
                {T.translate("invoices.show.tax")}
              </td>
              <td
                className={classnames("right aligned", {
                  blue: project.status === "new",
                  orange: project.status === "in progress",
                  green:
                    project.status === "finished" ||
                    project.status === "delivered",
                  red: project.status === "delayed"
                })}
              >
                <strong>{tax}%</strong>
              </td>
            </tr>
            <tr>
              <td colSpan="3" />
              <td
                className={classnames("right aligned", {
                  blue: status === "new",
                  orange: status === "pending",
                  red: status === "overdue",
                  green: status === "paid"
                })}
              >
                <strong>{T.translate("invoices.show.invoice_total")}</strong>
              </td>
              <td>
                <Header
                  as="h1"
                  textAlign="right"
                  className={classnames("m-0", {
                    blue: status === "new",
                    orange: status === "pending",
                    red: status === "overdue",
                    green: status === "paid"
                  })}
                >
                  <GetCurrencySymbol />
                  {invoiceTotal}
                </Header>
              </td>
            </tr>
          </tbody>
        </Table>
      </Card.Content>
    </Card>
  );
}

Project.propTypes = {
  project: PropTypes.object.isRequired
};

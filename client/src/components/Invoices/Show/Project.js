import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import map from 'lodash/map'
import sumBy from 'lodash/sumBy'
import classnames from 'classnames'

// Localization 
import T from 'i18n-react'

import moment from 'moment'

export default function Project({ project, status ,tax }) {

  let tasksTotal = sumBy(project.tasks, 'unitPrice')
  let invoiceTotal = tasksTotal+((tax/100)*tasksTotal)

  return(
    <div className="ui fluid card">
      <div className="content p-4">
        <h3 className="ui header">{<Link to={`/projects/show/${project.id}`}>{project.name}</Link>}</h3>
      </div>
      <div className="content">
        <table className="ui very basic collapsing celled table">
          <tbody>
            <tr>
              <td>
                <i className="ui tiny header">{T.translate("invoices.show.project.deadline")}</i>
              </td>
              <td>
                {moment(project.deadline).format('ll') }
              </td>
            </tr>
            <tr>
              <td>
                <i className="ui tiny header">{T.translate("invoices.show.project.status")}</i>
              </td>
              <td>
                { 
                  <div className={classnames("ui tiny uppercase label", {blue: project.status === 'new', orange: project.status === 'in progress', green: project.status === 'finished' || project.status === 'delivered', red: project.status === 'delayed'})}> 
                    {project.status}
                  </div>
                }
              </td>
            </tr>
            <tr>
              <td>
                <i className="ui tiny header">{T.translate("invoices.show.project.description")}</i>
              </td>
              <td>
                {project.description ? project.description : ''}
              </td>
            </tr>
          </tbody>
        </table>

        <h4 className="ui dividing header">{T.translate("invoices.show.project.tasks.header")}</h4>
        <table className="ui very basic table invoice project">
          <thead>
            <tr>
              <th>{T.translate("invoices.show.project.tasks.name")}</th>
              <th className="right aligned">{T.translate("invoices.show.project.tasks.payment_type")}</th>
              <th className="right aligned">{T.translate("invoices.show.project.tasks.hours")}</th>
              <th className="right aligned">{T.translate("invoices.show.project.tasks.unit_price")}</th>
              <th className="right aligned">{T.translate("invoices.show.project.tasks.total")}</th>
            </tr>
          </thead>
          <tbody>
            { map(project.tasks, (task) => 
              <tr key={task.id}>
                <td>{task.name}</td>
                <td className="right aligned">{task.paymentType}</td>
                <td className="right aligned">{task.hours}</td>
                <td className="right aligned">{task.unitPrice}</td>
                <td className="right aligned">{task.total}</td>
              </tr>
            )}
            <tr>
              <td colSpan="3"></td>
              <td className={classnames("right aligned", {blue: project.status === 'new', orange: project.status === 'in progress', green: project.status === 'finished' || project.status === 'delivered', red: project.status === 'delayed'})}>
                {T.translate("invoices.show.subtotal")}
              </td>
              <td className={classnames("right aligned", {blue: project.status === 'new', orange: project.status === 'in progress', green: project.status === 'finished' || project.status === 'delivered', red: project.status === 'delayed'})}>
                <strong>{tasksTotal}</strong>
              </td>
            </tr>
            <tr>
              <td colSpan="3"></td>
              <td className={classnames("right aligned", {blue: project.status === 'new', orange: project.status === 'in progress', green: project.status === 'finished' || project.status === 'delivered', red: project.status === 'delayed'})}>
                {T.translate("invoices.show.tax")}
              </td>
              <td className={classnames("right aligned", {blue: project.status === 'new', orange: project.status === 'in progress', green: project.status === 'finished' || project.status === 'delivered', red: project.status === 'delayed'})}>
                <strong>{tax}%</strong>
              </td>
            </tr>
            <tr>
              <td colSpan="3"></td>
              <td className={classnames("right aligned", {blue: status === 'new', orange: status === 'pending', red: status === 'overdue', green: status === 'paid'})}>
                <strong>{T.translate("invoices.show.invoice_total")}</strong>
              </td>
              <td>
                <h1 className={classnames("ui right aligned header m-0", {blue: status === 'new', orange: status === 'pending', red: status === 'overdue', green: status === 'paid'})}>
                  {invoiceTotal}
                </h1>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

Project.propTypes = {
  project: PropTypes.object.isRequired
}
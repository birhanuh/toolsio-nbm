import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import map from 'lodash/map'
import sumBy from 'lodash/sumBy'
import classnames from 'classnames'

// Localization 
import T from 'i18n-react'

import moment from 'moment'

export default function Project({ project }) {
  return(
    <div className="ui fluid card">
      <div className="content">
        <div className="left floated">
          <h4 className="ui header">{project && <Link to={`/projects/show/${project.id}`}>{project.name}</Link>}</h4>
        </div>
      </div>
      <div className="content">
        <table className="ui very basic collapsing celled table">
          <tbody>
            <tr>
              <td>
                <i className="ui tiny header">{T.translate("invoices.show.project.deadline")}</i>
              </td>
              <td>
                {project && moment(project.deadline).format("DD/MM/YYYY")}
              </td>
            </tr>
            <tr>
              <td>
                <i className="ui tiny header">{T.translate("invoices.show.project.status")}</i>
              </td>
              <td>
                { project && 
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
                {project && project.description ? project.description : ''}
              </td>
            </tr>
          </tbody>
        </table>

        <h4 className="ui dividing header">{T.translate("invoices.show.project.tasks.header")}</h4>
        <table className="ui very basic table invoice project">
          <thead>
            <tr>
              <th>{T.translate("invoices.show.project.tasks.name")}</th>
              <th>{T.translate("invoices.show.project.tasks.payment_type")}</th>
              <th>{T.translate("invoices.show.project.tasks.hours")}</th>
              <th>{T.translate("invoices.show.project.tasks.unit_price")}</th>
              <th>{T.translate("invoices.show.project.tasks.total")}</th>
            </tr>
          </thead>
          <tbody>
            { project && map(project.tasks, (task) => 
              <tr key={task.id}>
                <td>{task.name}</td>
                <td>{task.paymentType}</td>
                <td>{task.hours}</td>
                <td>{task.unitPrice}</td>
                <td>{task.total}</td>
              </tr>
            )}
            <tr>
              <td colSpan="3"></td>
              <td className={classnames({blue: project.status === 'new', orange: project.status === 'in progress', green: project.status === 'finished' || project.status === 'delivered', red: project.status === 'delayed'})}>
                {T.translate("invoices.show.subtotal")}
              </td>
              <td><strong>{project && sumBy(project.tasks, 'price')}</strong></td>
            </tr>
            <tr>
              <td colSpan="3"></td>
              <td className={classnames({blue: project.status === 'new', orange: project.status === 'in progress', green: project.status === 'finished' || project.status === 'delivered', red: project.status === 'delayed'})}>
                {T.translate("invoices.show.tax")}
              </td>
              <td><strong>{(project && project.tax) || (project && project.tax)}</strong></td>
            </tr>
            <tr>
              <td colSpan="3"></td>
              <td className={classnames({blue: project.status === 'new', orange: project.status === 'in progress', green: project.status === 'finished' || project.status === 'delivered', red: project.status === 'delayed'})}>
                <strong>{T.translate("invoices.show.invoice_total")}</strong>
              </td>
              <td>
                <h1 className={classnames("ui header m-0", {blue: project.status === 'new', orange: project.status === 'pending', red: project.status === 'overdue', green: project.status === 'paid' })}>
                  {project && sumBy(project.tasks, 'price')}
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
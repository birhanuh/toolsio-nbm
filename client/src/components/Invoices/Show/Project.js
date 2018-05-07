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
    <div>
      <h3 className="ui header">{T.translate("invoices.show.project.header")}</h3>
      <dl className="dl-horizontal"> 
        <dt>{T.translate("invoices.show.project.name")}</dt>
        <dd>{project && <Link to={`/projects/show/${project.id}`}>{project.name}</Link>}</dd>
        <dt>{T.translate("invoices.show.project.deadline")}</dt>
        <dd>{project && moment(project.deadline).format("DD/MM/YYYY")}</dd>
        <dt>{T.translate("invoices.show.project.status")}</dt>
        <dd>
          { project && 
            <div className={classnames("ui tiny uppercase label", {blue: project.status === 'new', orange: project.status === 'in progress', green: project.status === 'finished' || project.status === 'delivered', red: project.status === 'delayed'})}> 
                {project.status}
              </div>
          }
        </dd>
        <dt>{T.translate("invoices.show.project.description")}</dt>
        <dd>{project && project.description ? project.description : ''}</dd>
      </dl>  

      <h4 className="ui header">{T.translate("invoices.show.project.tasks.header")}</h4>
      <table className="ui very basic table invoice project">
        <thead>
          <tr>
            <th>{T.translate("invoices.show.project.tasks.name")}</th>
            <th>{T.translate("invoices.show.project.tasks.payment_type")}</th>
            <th>{T.translate("invoices.show.project.tasks.hours")}</th>
            <th>{T.translate("invoices.show.project.tasks.vat")}</th>
            <th>{T.translate("invoices.show.project.tasks.price")}</th>
          </tr>
        </thead>
        <tbody>
          { project && map(project.tasks, (task) => 
            <tr key={task.id}>
              <td>{task.name}</td>
              <td>{task.paymentType}</td>
              <td>{task.hours}</td>
              <td>{task.vat}</td>
              <td>{task.price}</td>
            </tr>
          )}
          <tr>
            <td colSpan="4"></td>
            <td><strong>{project && sumBy(project.tasks, 'price')}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

Project.propTypes = {
  project: PropTypes.object.isRequired
}
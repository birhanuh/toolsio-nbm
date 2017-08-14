import React from 'react'
import classnames from 'classnames'
import { Link } from 'react-router-dom'

// Localization 
import T from 'i18n-react'

export default function Card({project}) {
  
  return (
    <div className="card">
      <div className="content">
        <div className={classnames("ui uppercase tiny right ribbon label", {blue: project.status === 'new', orange: project.status === 'on going', green: project.status === 'finished' || project.status === 'delivered', red: project.status === 'delayed'})}> 
          {project.status}
        </div>
        
        <Link to={`/projects/show/${project._id}`} className="ui header">
          <h3 className={classnames({blue: project.status === 'new', orange: project.status === 'on going', green: project.status === 'finished' || project.status === 'delivered', red: project.status === 'delayed'})}>
            {project.name}
          </h3>
        </Link>

        <div className="description">{project.description}</div>

        <table className="ui very basic center aligned table projects">
          <thead>
            <tr>
              <th>{T.translate("projects.show.user")}</th>
              <th>{T.translate("projects.index.deadline")}</th>
              <th>{T.translate("projects.index.customer")}</th>
              <th>{T.translate("projects.index.progress")}</th>
              <th>{T.translate("projects.index.invoiced")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John</td>
              <td>{project.deadline}</td>
              <td>{project.customer.name}</td>
              <td>
                <div className="ui progress success small m-b-n">
                  <div className="bar">
                    <div className="progress"></div>
                  </div>
                </div>
              </td>
              <td>
                <i className={classnames("check circle outline icon", {blue: project.status === 'new', orange: project.status === 'on going', green: project.status === 'finished' || project.status === 'delivered', red: project.status === 'delayed'})}></i>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>

  )
}

Card.propTypes = {
  project: React.PropTypes.object.isRequired
}
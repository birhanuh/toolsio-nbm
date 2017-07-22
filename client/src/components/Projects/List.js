import React from 'react'
import Tr from './Tr'

// Localization 
import T from 'i18n-react'

export default function List({ projects }) {
  const emptyMessage = (
    <p className="ui info message">{T.translate("projects.index.empty_projects")}</p>
  )

  const projectsList = (
    <table className="ui striped selectable table">
       <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Status</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          { projects.map(project => <Tr project={project} key={project._id} />) }
        </tbody>
    </table>
  )

  return (
    <div>
      { projects.length === 0 ? emptyMessage : projectsList }
    </div>   
  )
}

List.propTypes = {
  projects: React.PropTypes.array.isRequired
}
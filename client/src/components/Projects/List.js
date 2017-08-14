import React from 'react'
import Card from './Card'

// Localization 
import T from 'i18n-react'

export default function List({ projects }) {
  const emptyMessage = (
    <div className="ui info message">
      <div className="header">
        {T.translate("projects.index.empty_projects_header")}
      </div>
      <p>{T.translate("projects.index.empty_projects_message")}</p>
    </div>
  )

  const projectsList = (
    <div className="ui two cards sales">
      { projects.map(project => <Card project={project} key={project._id} />) }
    </div>
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
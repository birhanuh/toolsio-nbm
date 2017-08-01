import React from 'react'
import Card from './Card'

// Localization 
import T from 'i18n-react'

export default function List({ projects, deleteProject }) {
  const emptyMessage = (
    <p className="ui info message">{T.translate("projects.index.empty_projects")}</p>
  )

  const projectsList = (
    <div className="ui cards">
      { projects.map(project => <Card project={project} key={project._id} deleteProject={deleteProject} />) }
    </div>
  )

  return (
    <div>
      { projects.length === 0 ? emptyMessage : projectsList }
    </div>   
  )
}

List.propTypes = {
  projects: React.PropTypes.array.isRequired,
  deleteProject: React.PropTypes.func.isRequired
}
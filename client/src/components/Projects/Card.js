import React from 'react'
import { Link } from 'react-router-dom'

export default function Card({project, deleteProject}) {
  
  return (
    <div className="card">
      <div className="content">
        <div className="right floated mini ui">
          {project.status}
        </div>
        <div className="header">
          {project.name}
        </div>
        <div className="meta">
         {project.deadline}
        </div>
        <div className="description">
         {project.description}
        </div>
      </div>
      
      <div className="extra content">
        <div className="ui two buttons">
          <button className="ui icon basic red button" onClick={deleteProject(project._id)}><i className="delete icon"></i></button>
          <Link to={`/projects/${project._id}`} className="ui icon basic green button"><i className="edit icon"></i></Link>
        </div>
      </div>
    </div>
  )
}

Card.propTypes = {
  project: React.PropTypes.object.isRequired,
  deleteProject: React.PropTypes.func.isRequired
}
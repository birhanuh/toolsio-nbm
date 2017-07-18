import React from 'react'
import { Link } from 'react-router-dom'

export default function Tr({project, deleteproject}) {
  
  return (
    <tr>
      <td>{project.name}</td>
      <td>{project.date}</td>
      <td>{project.status}</td>
      <td>{project.description}</td>
      <td>
        <button className="ui icon basic button red" onClick={deleteProject(project._id)}><i className="delete icon"></i></button>
        <Link to={`/projects/${project._id}`} className="ui icon basic button green"><i className="edit icon"></i></Link>
      </td>
    </tr>
  )
}

Tr.propTypes = {
  project: React.PropTypes.object.isRequired,
  deleteProject: React.PropTypes.func.isRequired
}
import React, { Component } from 'react' 
import { Create, Show } from '../../presentation'
import { APIManager } from '../../../utils'

class Projects extends Component {
  constructor() {
    super()
    this.state = {
      list: [
      ]
    }
  }
  
  submitProject() {
    APIManager.post('/api/projects', this.state.project, (err, response) => {
      if (err) {
        alert('ERROR' +err.message)
        return
      }

      console.log('Project created: '+JSON.stringify(response.result))
      let updatedList = Object.assign([], this.state.list)
      updatedList.push(response.result)
      this.setState({
        project: updatedProject
      })
    })
  }

  componentDidMount() {
    console.log('componentDidMount')

    APIManager.get('/api/projects', null, (err, response) => {
      if (err) {
        alert('ERROR' +err.message)
        return
      }

      console.log(JSON.stringify(response.results))
      this.setState({
        list: response.results
      })
    })

  }

  render() {
    //  const projectList = this.state.list.map(function() {...}) ES5 version

    const projectList = this.state.list.map((project, i) => {
      return (
        <tr key={project._id}>
          <td><span className="name">{project.name}</span></td>
          <td><span className="date">{project.date}</span></td>
          <td><span className="date">{project.state}</span></td>
          <td><span className="description">{project.description}</span></td>
          <td className="text-center">
            <a href="/projects/" className="btn btn-info btn-sm view-more-project"><i className="fa fa-eye" aria-hidden="true"></i>&nbsp;View more</a>
          </td>
        </tr> 
      )  
    })

    return (
      <div className="row">
        <div className="col-sm-12">
          <div className="clearfix">
            <div className="pull-left">
              <h1>Projects</h1> 
            </div>
            <div className="pull-right">
              <a href="#projects/new" className="btn btn-primary m-t-l"><i className="fa fa-plus-circle" aria-hidden="true"></i>&nbsp;Create new project</a>
            </div>
          </div>

          <Create onCreate={thid.submitProject.bind(this)}/>
          
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Description</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody className="projects-list">
              
              {projectList}      

            </tbody>
          </table>
        </div>
      </div> 
    )
  }
}

export default Projects
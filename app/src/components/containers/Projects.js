import React, { Component } from 'react' 
import { Create, Show } from '../presentation'
import { APIManager } from '../../utils'

class Projects extends Component {
  constructor() {
    super()
    this.state = {
      selected: 0,
      list: []
    }
  }
  
  submitProject(project) {
    APIManager.post('/api/projects', project, (err, response) => {
      if (err) {
        alert('ERROR' +err.message)
        return
      }

      console.log('Project created: '+JSON.stringify(response.result))
      let updatedList = Object.assign([], this.state.list)
      updatedList.push(response.result)
      this.setState({
        project: updatedList
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

  onSelect(index) {
    event.preventDefault();
    this.setState({
      selected: index
    })

    console.log('onSelect click: ', this.state.selected)
  }

  render() {
    //  Return Show component if this.state.list not null
    const project = !this.state.list[this.state.selected] ? null : (
      <Show project={this.state.list[this.state.selected]} /> 
    )

    //  const projectList = this.state.list.map(function() {...}) ES5 version
    const projectList = this.state.list.map((project, i) => {
      let selected = (i == this.state.selected)
      return (
        <tr key={i} className={selected ? 'active' : ''} >
          <td><span className="name">{project.name}</span></td>
          <td><span className="date">{project.date}</span></td>
          <td><span className="date">{project.state}</span></td>
          <td><span className="description">{project.description}</span></td>
          <td className="text-center">
            <button onClick={this.onSelect.bind(this, i)} className="btn btn-info btn-sm view-more-project"><i className="fa fa-eye" aria-hidden="true"></i>&nbsp;View more</button>
          </td>
        </tr> 
      )  
    })

    return (
      <div className="container">   
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

            <Create onCreate={this.submitProject.bind(this)}/>
            
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Description</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody className="projects-list">
                
                {projectList}      

              </tbody>
            </table>

            {project}
          </div>
        </div> 
      </div>
    )
  }
}

export default Projects
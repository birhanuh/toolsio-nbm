import React, { Component } from 'react' 

class Form extends Component {
  constructor() {
    super()
    this.state = {
      project: {
        name: '', 
        date: new Date(), 
        state: '', 
        description: ''
      }
    }
  }

  submitProject() {
    //this.state.project['name'] = event.target.value // WRONG! Never mutate a state in React

    // Create a copy of the state and update it
    let updatedProject = Object.assign({}, this.state.project)
    updatedProject['name'] = event.target.value

    this.setState({
      project: updatedProject
    })

    let updatedList = Object.assign([], this.state.list)
    updatedList.push(this.state.project)

    this.setState({
      project: updatedList
    })

    console.log('submitProject: ' +JSON.stringify(this.state.comment))
  }

  // updateProject(event) {
  //   console.log('submitProject: '+event)
  // }
  //called on onUpdate() in the element 

  render() {
    return (
      <div>
        <div className="form-horizontal">
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <h1>New Project</h1> 
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-2" htmlFor="name">Name:</label>
            <div className="col-sm-10">
              <input type="text" name="name" className="form-control name-input" placeholder="Enter name"/>
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-2" htmlFor="date">Date:</label>
            <div className="col-sm-10">
              <input type="date" name="date" className="form-control date-input" placeholder="Enter date"/>
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-2" htmlFor="name">Status:</label>
            <div className="col-sm-10">
              <input type="text" name="status" className="form-control name-input" placeholder="Enter name"/>
            </div>
          </div>
          <div className="form-group">
            <label className="control-label col-sm-2" htmlFor="description">Description:</label>
            <div className="col-sm-10">
              <textarea type="textarea" name="description" className="form-control description-input" placeholder="Enter description"></textarea>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-2">
              <button onClick={this.submitProject.bind(this)} className="btn btn-primary create-project"><i className="fa fa-check-circle" aria-hidden="true"></i>&nbsp;Create project</button>
            </div>
          </div>
        </div>
     
      </div> 
    )
  }
}

export default Form
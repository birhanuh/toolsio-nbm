import React, { Component } from 'react' 

class Create extends Component {
  constructor(props) {
    super(props)
    this.state = {
       project: {
        name: '', 
        date: new Date(), 
        state: 'NEW', 
        description: ''
      }
    }
  }

  updateProject(event) {
    //this.state.project['name'] = event.target.value // WRONG! Never mutate a state in React

    // Create a copy of the state and update it
    let updatedProject = Object.assign({}, this.state.project)
    console.log(event.target.id +' = '+event.target.value)
    updatedProject[event.target.id] = event.target.value
    this.setState({
      project: updatedProject
    })
  }

  submitProject(event) {
    this.props.onCreate(this.state.project)
  }

  render() {
    return (
      <div className="form-horizontal">
        <div className="form-group">
          <div className="col-sm-offset-2 col-sm-10">
            <h1>New Project</h1> 
            {/* <p>Name: {this.state.project.name}</p> We only update this part */}
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-2" htmlFor="name">Name:</label>
          <div className="col-sm-10">
            <input type="text" onChange={this.updateProject.bind(this)} id="name" name="name" className="form-control name-input" placeholder="Enter name"/>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-2" htmlFor="date">Date:</label>
          <div className="col-sm-10">
            <input type="date" onChange={this.updateProject.bind(this)} id="date" name="date" className="form-control date-input" placeholder="Enter date"/>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-2" htmlFor="name">Status:</label>
          <div className="col-sm-10">
            <input type="text" onChange={this.updateProject.bind(this)} id="status" name="status" className="form-control name-input" placeholder="Enter name"/>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-2" htmlFor="description">Description:</label>
          <div className="col-sm-10">
            <textarea type="textarea" onChange={this.updateProject.bind(this)} id="description" name="description" className="form-control description-input" placeholder="Enter description"></textarea>
          </div>
        </div>
        <div className="form-group">
          <div className="col-sm-offset-2 col-sm-2">
            <button onClick={this.submitProject.bind(this)} className="btn btn-primary create-project"><i className="fa fa-check-circle" aria-hidden="true"></i>&nbsp;Create project</button>
          </div>
        </div>
      </div>
    )
  }
}

export default Create
import React, { Component } from 'react' 

class Show extends Component {
  render() {
    return (
      <div className="well">

        <dl>
          <dt>Name:</dt>      
          <dd><span className="name">{this.props.project.name}</span></dd>

          <dt>Date:</dt>
          <dd><span className="date">{this.props.project.date}</span></dd>
          
          <dt>Status:</dt>
          <dd><span className="status">{this.props.project.status}</span></dd>

          <dt>Description:</dt>
          <dd><span className="description">{this.props.project.description}</span></dd>
          
          <div className="btn-toolbar m-t-l">
            <a href="#projects" className="btn btn-default"><i className="fa fa-ban" aria-hidden="true"></i>&nbsp;Cancel</a>
            <button className="btn btn-primary edit-project"><i className="fa fa-pencil" aria-hidden="true"></i>&nbsp;Edit project</button>
          </div>
        </dl>      
      </div> 
    )
  }
}

export default Show
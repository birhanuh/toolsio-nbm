import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import List from './List' 
import { connect } from 'react-redux'
import { fetchProjects, deleteProject } from '../../actions/projectActions'

// Localization 
import T from 'i18n-react'

class Page extends Component {

  componentDidMount() {
    this.props.fetchProjects()
  }

  render() {
    return (
      <div>
        <div className="row column">  
          <Link className="ui right floated primary button" to="/projects/new">
            <i className="add circle icon"></i>
            {T.translate("projects.index.create_new_project")}
          </Link>
          <h1 className="ui header m-t-n">{T.translate("projects.index.header")}</h1>   

          <div className="ui divider"></div>  
        </div>
        
        <div className="row column">     
          <List projects={this.props.projects} deleteProject={deleteProject} />  
        </div>       
      </div>   
    )
  }
}

Page.propTypes = {
  projects: React.PropTypes.array.isRequired,
  fetchProjects: React.PropTypes.func.isRequired,
  deleteProject: React.PropTypes.func.isRequired
}

function mapSateToProps(state) {
  return {
    projects: state.projects
  }
}

export default connect(mapSateToProps, { fetchProjects, deleteProject })(Page)

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import List from './List' 
import { connect } from 'react-redux'
import { fetchProjects } from '../../actions/projectActions'

// Localization 
import T from 'i18n-react'

class Projects extends Component {

  componentDidMount() {
    this.props.fetchProjects()
  }

  render() {
    return (
      <div>      
        <Link className="ui right floated primary button" to="/projects/new">
          <i className="add circle icon"></i>
          Create new Sale
        </Link>
        <h1 className="ui header">{T.translate("projects.index.header")}</h1>          
        
        <div className="ui divider"></div>

        <List projects={this.props.projects} />      
      </div>   
    )
  }
}

Projects.propTypes = {
  projects: React.PropTypes.array.isRequired,
  fetchProjects: React.PropTypes.func.isRequired
}

function mapSateToProps(state) {
  return {
    projects: state.srojects
  }
}

export default connect(mapSateToProps, { fetchProjects })(Projects)
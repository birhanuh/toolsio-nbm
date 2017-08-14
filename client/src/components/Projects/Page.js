import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import List from './List' 
import { connect } from 'react-redux'
import { fetchProjects } from '../../actions/projectActions'

// Localization 
import T from 'i18n-react'

class Page extends Component {

  componentDidMount() {
    this.props.fetchProjects()
  }

  render() {
    return (
      <div className="row column">  
        <div className="ui clearing vertical segment border-bottom-none">
          <div className="ui right floated icon input">
            <input type="text" placeholder="Search..." />
            <i className="inverted circular search link icon"></i>
          </div>

          <Link className="ui left floated primary button" to="/projects/new">
            <i className="add circle icon"></i>
            {T.translate("projects.index.create_new_project")}
          </Link>   
        </div> 
        
        <div className="row column">     
          <List projects={this.props.projects} />  
        </div>       
      </div>   
    )
  }
}

Page.propTypes = {
  fetchProjects: React.PropTypes.func.isRequired
}

function mapSateToProps(state) {
  return {
    projects: state.projects
  }
}

export default connect(mapSateToProps, { fetchProjects })(Page)

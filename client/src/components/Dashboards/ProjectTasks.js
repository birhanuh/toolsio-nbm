import React, { Component }  from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { fetchProjectTasks } from '../../actions/dashboardActions'

// Localization 
import T from 'i18n-react'

class ProjectTasks extends Component {
  
  state = {
    isLoading: false
  }
  
  componentDidMount() {
    this.props.fetchProjectTasks()
      .catch( ({response}) => this.setState({ projectTasks: { isLoading: true} }) )
  }

  render() {
    
    const { projectTasks } = this.props

    return (
      
      <div className="dashboards">
        <h4 className="ui header">{T.translate("dashboards.project_tasks.header")}</h4>
        <div className="ui card">
          <div className="content">
            
          </div>
        </div>
      </div>  
      )
  }
}

ProjectTasks.propTypes = {
  fetchProjectTasks: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    projectTasks: state.dashboards.projectTasks
  }
}

export default connect(mapStateToProps, { fetchProjectTasks }) (ProjectTasks)

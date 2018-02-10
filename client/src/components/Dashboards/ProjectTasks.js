import React, { Component }  from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
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
      .catch( ({response}) => this.setState({ isLoading: true }) )
  }

  render() {
    
    const { projectTasks } = this.props    

    let newNotification   
    let newProjects 

    let overdueNotification   
    let overdueProjects 

    projectTasks && projectTasks.map(task => {

      if (task._id === 'new') {
        newNotification = (<div key={task._id} className="ui info message">
            <div className="description">
              {T.translate("dashboards.project_tasks.new_projects", {count: task.count})}
            </div>
          </div>
          )
        
        newProjects = task.projects.map(project => 
          <Link key={project._id} to={`/projects/show/${project._id}`} className="item blue">{project.name}</Link>
        )  
      } else if (task._id !== 'new') {
        newNotification = (<div key={"no-new"} className="ui info message">
            <div className="description">
              {T.translate("dashboards.project_tasks.no_new_projects")}
            </div>
          </div>
          )
      }

      if (task._id === 'overdue') {
        overdueNotification = (<div key={task._id} className="ui negative message">
            <div className="description">
              {T.translate("dashboards.project_tasks.overdued_projects", {count: task.count})}
            </div>
          </div>
          )
        
        overdueProjects = task.projects.map(project => 
          <Link key={project._id} to={`/projects/show/${project._id}`} className="item red">{project.name}</Link>
        )  
      } else if (task._id !== 'overdue') {
        overdueNotification = (<div key={"no-overdue"} className="ui negative message">
            <div className="description">
              {T.translate("dashboards.project_tasks.no_overdued_projects")}
            </div>
          </div>
          )
      }

      })

      const lists = (<div className="content">
        {newNotification}
        <div className="ui ordered list">
          {newProjects}
        </div>

        <div className="ui divider"></div>

        {overdueNotification}
        <div className="ui ordered list">
          {overdueProjects}
        </div>

        </div>)

    return (
      
      <div className="dashboards">
        <h4 className="ui header">{T.translate("dashboards.project_tasks.header")}</h4>
        <div className="ui card">
          
            {lists}
          
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

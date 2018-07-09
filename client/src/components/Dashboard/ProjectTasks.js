import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { List } from 'semantic-ui-react'
import { Query } from 'react-apollo'
import { GET_PROJECT_TASKS_DATA } from '../../graphql/dashboard'

// Localization 
import T from 'i18n-react'

const ProjectTasksCard = () => (
  <Query query={GET_PROJECT_TASKS_DATA}>
    {({ loading, error, data }) => {
    
    const countStatus = data.getProjectTasksData && data.getProjectTasksData.countStatus
    const idNameStatus = data.getProjectTasksData && data.getProjectTasksData.idNameStatus

    let newNotification  
    let delayedNotification 

    let newProjects = []
    let delayedProjects = []

    countStatus && countStatus.map(item => {
      if (item.status === 'new') {
        newNotification = (<div className="ui info message">
          <div className="description">
            {T.translate("dashboard.project_tasks.new_projects", {count: item.count})}
          </div>
        </div>)
      } 

      if (item.status === 'delayed') {
        delayedNotification = (<div className="ui negative message">
          <div className="description">
            {T.translate("dashboard.project_tasks.delayed_projects", {count: item.count})}
          </div>
        </div>)
      }  
    })

    idNameStatus && idNameStatus.map(project => {
      if(project.status === 'new') {
        newProjects.push(project)
      } else if (project.status === 'delayed') {
        delayedProjects.push(project)
      }
    })

    const list = (<div className="content">
        {newNotification}
        <List ordered>
          {newProjects && newProjects.map(project => 
            <List.Item key={project.id} content={<Link to={`/projects/show/${project.id}`} className="item blue">{project.name}</Link>} /> )}
        </List>

        <div className="ui divider"></div>

        {delayedNotification}
        <List ordered>
          {delayedProjects && delayedProjects.map(project => 
             <List.Item key={project.id} content={<Link to={`/projects/show/${project.id}`} className="item red">{project.name}</Link>} /> )}
        </List>
      </div>)

    return (
      
      <div id="projectTask" className={classnames("dashboard", { loading: loading })}>
        <h4 className="ui header">{T.translate("dashboard.project_tasks.header")}</h4>
        <div className="ui card">
          
          {(countStatus && countStatus.length === 0) ?
            <div className="content">
              { !!error && <div className="ui negative message"><p>{error.message}</p></div> } 
              <div className="ui info message">
                <div className="description">
                  {T.translate("dashboard.project_tasks.no_new_projects")}
                  {T.translate("dashboard.project_tasks.no_delayed_projects")}
                </div>
              </div> 
            </div> : list }
          
        </div>
      </div>  
      )
    }}
  </Query>
)

export default ProjectTasksCard


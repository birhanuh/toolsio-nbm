import React, { Component }  from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import gql from "graphql-tag"
import { Query } from "react-apollo"

// Localization 
import T from 'i18n-react'

const GET_PROJECT_TASKS_DATA = gql`
  {
    getProjectTasksData {
      countStatus {
        status
        count
      }
      idNameStatus {
        id
        name 
        status
      }
    }
  }
`
const ProjectTasksCard = () => (
  <Query query={GET_PROJECT_TASKS_DATA}>
    {({ loading, error, data }) => {
    
    const countStatus = data && data.getProjectTasksData && data.getProjectTasksData.countStatus
    const idNameStatus = data && data.getProjectTasksData && data.getProjectTasksData.idNameStatus

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
      <div className="ui ordered list">
        {newProjects && newProjects.map(project => <Link key={project.id} to={`/projects/show/${project.id}`} className="item blue">{project.name}</Link>)}
      </div>

      <div className="ui divider"></div>

      {delayedNotification}
      <div className="ui ordered list">
        {delayedProjects && delayedProjects.map(project => <Link key={project.id} to={`/projects/show/${project.id}`} className="item red">{project.name}</Link>)}
      </div>

      </div>)

    return (
      
      <div className={classnames("dashboard", { loading: loading })}>
        <h4 className="ui header">{T.translate("dashboard.project_tasks.header")}</h4>
        <div className="ui card">
          
          {(countStatus && countStatus.length === 0) ?
            <div className="content">
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


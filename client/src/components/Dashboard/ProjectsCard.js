import React, { Component }  from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import gql from "graphql-tag"
import { Query } from "react-apollo"

import pick from 'lodash/pick'

import { Doughnut } from 'react-chartjs-2'

// Localization 
import T from 'i18n-react'

const GET_PROJECTS_DATA = gql`
  {
    getProjectsData {
      countStatus {
        status
        count
      }
      countMonth {
        month
        count
      }
    }
  }
`
const ProjectsCard = () => (
  <Query query={GET_PROJECTS_DATA}>
    {({ loading, error, data }) => {
    
      const countStatus = data && data.getProjectsData && data.getProjectsData.countStatus
      const countMonth = data && data.getProjectsData && data.getProjectsData.countMonth

      let statusPick = countStatus && countStatus.map(item => pick(item, ['status']).status)
      let countPick = countStatus && countStatus.map(item => pick(item, ['count']).count)
      // console.log('status', statusPick)
      // console.log('count', countPick)

      let chartData = {
        labels: statusPick,
        datasets: [
          {
            label: 'Incomes',
            data: countPick,
            backgroundColor: ["rgba(125,164,13,0.75)", "rgba(25,156,213,0.75)", "rgba(240,115,15,0.75)", "rgba(190,10,10,0.75)"],
            hoverBackgroundColor: ["rgba(125,164,13,1)", "rgba(25,156,213,1)", "rgba(240,115,15,1)", "rgba(190,10,10,1)"]
          }]
      }

      const chartOptions = {
        responsive: true,
        title: {
          display: true
        },
        tooltips: {
          mode: 'label'
        },
        hover: {
          mode: 'dataset'
        },
        options: {
          animation: { 
            animateScale: true,
            animateRotate: true
          }
        }
      }

      return (
        <div className={classnames("ui card dashboard form", { loading: loading })}>
          <div className="content">
            <div className="right floated">
              <h4 className="ui header">
                <i className="suitcase icon"></i>
              </h4>
            </div> 
            <div className="left floated">
              <h4 className="ui header">
                {T.translate("dashboard.projects.header")}
              </h4>
            </div>       
          </div>

          <div className="image">

            <Doughnut data={chartData} options={chartOptions} />

          </div>
          
          <div className="content">
            { !!error && <div className="ui negative message"><p>{error.message}</p></div> } 
            <div className="right floated">
              <div className="meta">{T.translate("dashboard.this_month")}</div>
              <div className="header">
                {countMonth && countMonth ? (countMonth[0].count ? countMonth[0].count : '-') : '-'}
                {countMonth && countMonth[1] && ((countMonth[1].count > countMonth[0].count) ? <i className="long arrow down red icon"></i> : 
                  <i className="long arrow up green icon"></i>)}
                </div>
            </div>     
            <div className="left floated">
              <div className="meta">{T.translate("dashboard.last_month")}</div>
              <div className="header">
                {countMonth && countMonth[1] ? (countMonth[1].count ? countMonth[1].count : '-') : '-'}
              </div>
            </div>    
          </div> 

          {countStatus && countStatus.length === 0 || countMonth && countMonth.length === 0 && 
            <div className="content-btn-outer-container">
              <div className="content-btn-inner-container">
                <Link to="/invoices" className="ui primary outline button small">
                  <i className="check circle outline icon"></i>{T.translate("dashboard.projects.create_first_project")}
                </Link>
              </div>
            </div>
          }          
        </div>
      )
    }}
  </Query>
)

export default ProjectsCard




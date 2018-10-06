import React  from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
// Semantic UI Form elements
import { Segment, Header, Card, Icon, Image, Message } from 'semantic-ui-react'
import { Query } from 'react-apollo'
import { GET_PROJECTS_DATA } from '../../graphql/dashboard'

import pick from 'lodash/pick'
import Moment from 'moment'

import { Doughnut } from 'react-chartjs-2'

// Localization 
import T from 'i18n-react'

const ProjectsCard = () => (
  <Query query={GET_PROJECTS_DATA}>
    {({ loading, error, data }) => {
    
      const countStatus = data.getProjectsData && data.getProjectsData.countStatus
      const countMonth = data.getProjectsData && data.getProjectsData.countMonth.map(item => pick(item, ['month', 'count']))

      let countMonthSorted = countMonth && countMonth.sort(function(a, b) {
          let x = new Date(Moment(a.month, 'MM/YYYY')) 
          let y = new Date(Moment(b.month, 'MM/YYYY')) 
          return ((x < y) ? -1 : ((x > y) ? 1 : 0))
        })

      let statusPick = countStatus && countStatus.map(item => pick(item, ['status']).status)
      let countPick = countStatus && countStatus.map(item => pick(item, ['count']).count)

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
        <Card id="projects" className={classnames("dashboard form", { loading: loading })}>
          <Card.Content>
            <Card.Header>
              <Header as='h4' floated='left'>
                {T.translate("dashboard.projects.header")}
              </Header>
              <Header as='h4' floated='right' className="mr-0">
                <Icon floated='right' name='suitcase' className="mr-0"/>
              </Header>
            </Card.Header>
          </Card.Content>        
          <Image>
            <Doughnut data={chartData} options={chartOptions} />
          </Image>
          
          <Card.Content extra>
            { !!error && <Message negative><p>{error.message}</p></Message> } 
            <Segment vertical floated='left' className="p-0"> 
              <Card.Meta>{countMonthSorted && countMonthSorted[0] ? (countMonthSorted[0].month ? countMonthSorted[0].month : '-') : '-'}</Card.Meta>
              <Card.Header>
                {countMonthSorted && countMonthSorted[0] ? (countMonthSorted[0].count ? countMonthSorted[0].count : '-') : '-'}
              </Card.Header>
            </Segment>   
            <Segment vertical floated='right' className="p-0">
              <Card.Meta>{countMonthSorted && countMonthSorted[1] ? (countMonthSorted[1].month ? countMonthSorted[1].month : '-') : '-'}</Card.Meta>
              <Card.Header>
                {countMonthSorted && countMonthSorted[1] ? (countMonthSorted[1].count ? countMonthSorted[1].count : '-') : '-'}
                {countMonthSorted && countMonthSorted.count && countMonthSorted.count.length !== 0 && ((countMonthSorted[0].count > countMonthSorted[1].count) ? <Icon name="long arrow down" className="red" /> : 
                  <Icon name="long arrow up" className="green" />)}
                </Card.Header>
            </Segment>      
          </Card.Content> 

          {(countStatus && countStatus.length === 0 || countMonth && countMonth.length === 0) && 
            <div className="content-btn-outer-container">
              <div className="content-btn-inner-container">
                <Link to="/projects" className="ui primary outline button small">
                  <Icon className="check circle outline" />{T.translate("dashboard.projects.create_first_project")}
                </Link>
              </div>
            </div>
          }          
        </Card>
      )
    }}
  </Query>
)

export default ProjectsCard




import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { Header, Card, Icon } from 'semantic-ui-react'
import { Query } from 'react-apollo'
import { GET_INVOICES_DATA } from '../../graphql/dashboard'

import pick from 'lodash/pick'

import { Bar } from 'react-chartjs-2'

// Localization 
import T from 'i18n-react'

const InvoicesCard = () => (
  <Query query={GET_INVOICES_DATA}>
    {({ loading, error, data }) => {
    
      const countStatusMonth = data.getInvoicesData && data.getInvoicesData.countStatusMonth
      const countMonth = data.getInvoicesData && data.getInvoicesData.countMonth

      let statusPick = countStatusMonth && countStatusMonth.map(item => pick(item, ['status']).status)
      let monthPick = countStatusMonth && countStatusMonth.map(item => pick(item, ['month']).month.substring(0, 3))
      let countPick = countStatusMonth && countStatusMonth.map(item => pick(item, ['count']).count)
      console.log('status', statusPick)
      console.log('count', countPick)
      console.log('month', monthPick)

      let chartData = {
        labels: ['April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'New',
            data: [5, 0, 0, 0],
            backgroundColor: "rgba(25,156,213,0.75)",
            hoverBackgroundColor: "rgba(25,156,213,0.9)",
            borderWidth: 2
          },
          {
            label: 'Paid',
            data: [2, 0, 0, 0],
            backgroundColor: "rgba(125,164,13,0.75)",
            hoverBackgroundColor: "rgba(125,164,13,0.9)",
            borderWidth: 2
          },{
            label: 'Pending',
            data: [3, 0, 0, 0],
            backgroundColor: "rgba(240,115,15,0.75)",
            hoverBackgroundColor: "rgba(240,115,15,0.9)",
            borderWidth: 2,
          },{
            label: 'Overdue',
            data: [1, 0, 0, 0],
            backgroundColor: "rgba(190,10,10,0.75)",
            hoverBackgroundColor: "rgba(190,10,10,0.9)",
            borderWidth: 2
          }],
          scaleBeginAtZero : true,
          scaleShowGridLines : true,
          scaleGridLineColor : "rgba(0,0,0,.05)",
          scaleGridLineWidth : 1,
          barShowStroke : true,
          barStrokeWidth : 1,
          barValueSpacing : 5,
          barDatasetSpacing : 1,
          responsive:true
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
          legend: {
            borderWidth: false
          }
        },
        // scales: {
        //   xAxes: [{
        //     stacked: true,
        //   }],
        //   yAxes: [{
        //     stacked: true
        //   }]
        // }
      }

      return (
        <Card className={classnames("dashboard invoice form", { loading: loading })}>
          <Card.Content>
            <Card.Header>
              <Header as='h4' floated='left'>
                {T.translate("dashboard.projects.header")}
              </Header>
              <Header as='h4' floated='right' className="mr-0">
                <Icon floated='right' name='file text outline' className="mr-0"/>
              </Header>
            </Card.Header>
          </Card.Content>        
          <div className="image">
            <Bar data={chartData} options={chartOptions} />
          </div>
          
          <Card.Content extra>
            { !!error && <div className="ui negative message"><p>{error.message}</p></div> }                 
            <div className="left floated">
              <div className="meta">{countMonth && countMonth[0] ? (countMonth[0].month ? countMonth[0].month : '-') : '-'}</div>
              <div className="header">
                {countMonth && countMonth[0] ? (countMonth[0].count ? countMonth[0].count : '-') : '-'}
              </div>
            </div>  
            <div className="right floated">
              <div className="meta">{countMonth && countMonth[1] ? (countMonth[1].month ? countMonth[1].month : '-') : '-'}</div>
              <div className="header">
                {countMonth && countMonth[1] ? (countMonth[1].count ? countMonth[1].count : '-') : '-'}
                {countMonth && countMonth[1] && ((countMonth[1].count > countMonth[0].count) ? <i className="long arrow up green icon"/ > : 
                  <i className="long arrow down red icon" />)}
                </div>
            </div>   
          </Card.Content> 

          {(countStatusMonth && countStatusMonth.length === 0 || countMonth && countMonth.length === 0) && 
            <div className="content-btn-outer-container">
              <div className="content-btn-inner-container">
                <Link to="/invoices" className="ui primary outline button small">
                  <i className="check circle outline icon"></i>{T.translate("dashboard.invoices.create_first_invoice")}
                </Link>
              </div>
            </div>
          }          
        </Card>
      )
    }}
  </Query>
)

export default InvoicesCard


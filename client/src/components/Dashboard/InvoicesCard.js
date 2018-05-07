import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import gql from "graphql-tag"
import { Query } from "react-apollo"

import pick from 'lodash/pick'

import { Bar } from 'react-chartjs-2'

// Localization 
import T from 'i18n-react'

const GET_INVOICES_DATA = gql`
  {
    getInvoicesData {
      countStatusMonth {
        status
        count
        month
      }
      countMonth {
        month
        count
      }
  }
}
`
const InvoicesCard = () => (
  <Query query={GET_INVOICES_DATA}>
    {({ loading, error, data }) => {
    
      const countStatusMonth = data && data.getInvoicesData && data.getInvoicesData.countStatusMonth
      const countMonth = data && data.getInvoicesData && data.getInvoicesData.countMonth

      let statusPick = countStatusMonth && countStatusMonth.map(item => pick(item, ['status']).status)
      let monthPick = countStatusMonth && countStatusMonth.map(item => pick(item, ['month']).month.substring(0, 3))
      let countPick = countStatusMonth && countStatusMonth.map(item => pick(item, ['count']).count)
      console.log('status', statusPick)
      console.log('count', countPick)
      console.log('month', monthPick)

      let chartData = {
        labels: ['Apr'],
        datasets: [
          {
            label: 'New',
            data: [5],
            backgroundColor: "rgba(25,156,213,0.75)",
            hoverBackgroundColor: "rgba(25,156,213,0.9)",
            borderWidth: 2
          },
          {
            label: 'Paid',
            data: [2],
            backgroundColor: "rgba(125,164,13,0.75)",
            hoverBackgroundColor: "rgba(125,164,13,0.9)",
            borderWidth: 2
          },{
            label: 'Pending',
            data: [3],
            backgroundColor: "rgba(240,115,15,0.75)",
            hoverBackgroundColor: "rgba(240,115,15,0.9)",
            borderWidth: 2,
          },{
            label: 'Overdue',
            data: [1],
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
          legend: {
            borderWidth: false
          },
          scales: {
            xAxes: [{
              ticks: {
                beginAtZero:true
              },
              gridLines: {
                display:false
              }
            }]
          }
        }
      }

      return (
        <div className={classnames("ui card dashboard form", { loading: loading })}>
          <div className="content">
            <div className="right floated">
              <h4 className="ui header">
                <i className="file text outline icon"></i>
              </h4>
            </div> 
            <div className="left floated">
              <h4 className="ui header">
                {T.translate("dashboard.invoices.header")}
              </h4>
            </div>       
          </div>

          <div className="image">

            <Bar data={chartData} options={chartOptions} />

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

          {countStatusMonth && countStatusMonth.length === 0 || countMonth && countMonth.length === 0 && 
            <div className="content-btn-outer-container">
              <div className="content-btn-inner-container">
                <Link to="/invoices" className="ui primary outline button small">
                  <i className="check circle outline icon"></i>{T.translate("dashboard.invoices.create_first_invoice")}
                </Link>
              </div>
            </div>
          }          
        </div>
      )
    }}
  </Query>
)

export default InvoicesCard


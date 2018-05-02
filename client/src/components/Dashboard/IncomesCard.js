import React, { Component }  from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import gql from "graphql-tag"
import { Query } from "react-apollo"

import pick from 'lodash/pick'

import { Line } from 'react-chartjs-2'

// Localization 
import T from 'i18n-react'

const GET_INCOMES = gql`
  {
    getIncomesData {
      daySum {
        day
        sum
      }
      monthSum {
        month
        sum
      }
    }
  }
`
const IncomesCard = () => (
  <Query query={GET_INCOMES}>
    {({ loading, error, data }) => {
     
      const daySum = data && data.getIncomesData && data.getIncomesData.daySum
      const monthSum = data && data.getIncomesData && data.getIncomesData.monthSum

      let dayPick = daySum && daySum.map(item => pick(item, ['day']).day.substring(0, 5))
      let sumPick = daySum && daySum.map(item => pick(item, ['sum']).sum)

      let chartData = {
        labels: dayPick,
        datasets: [
          {
            label: 'Incomes',
            data: sumPick,
            backgroundColor: "rgba(125,164,13, 0.75)",
            borderColor: "rgba(125,164,13, 1)",
            borderWidth: 1,
            pointRadius: 2,
            pointBackgroundColor: "rgba(125,164,13, 1)"
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
        scales: {
          xAxes: [
            {
              display: true,
              scaleLabel: {
                show: true,
                labelString: 'DD/MM/YYYY'
              },
              ticks: {
                autoSkip: false,
                maxRotation: 90,
                minRotation: 90
              }
            }
          ]
        }
      }

      return (
        <div className={classnames("ui card dashboard form", { loading: loading })}>
          <div className="content">
            <div className="right floated">
              <h4 className="ui header">
                <i className="money icon"></i>
              </h4>
            </div> 
            <div className="left floated">
              <h4 className="ui header">
                {T.translate("dashboard.incomes.header")}
              </h4>
            </div>       
          </div>

          <div className="image">

            <Line data={chartData} options={chartOptions} />

          </div>
          
          <div className="content">
            { !!error && <div className="ui negative message"><p>{error.message}</p></div> } 
            <div className="right floated">
              <div className="meta">{T.translate("dashboard.this_month")}</div>
              <div className="header">
                {monthSum && monthSum ? (monthSum[0].sum ? monthSum[0].sum : '-') : '-'}
                {monthSum && monthSum[1] && ((monthSum[1].sum > monthSum[0].sum) ? <i className="long arrow down red icon"></i> : 
                  <i className="long arrow up green icon"></i>)}
                </div>
            </div>     
            <div className="left floated">
              <div className="meta">{T.translate("dashboard.last_month")}</div>
              <div className="header">
                {monthSum && monthSum[1] ? (monthSum[1].sum ? monthSum[1].sum : '-') : '-'}
              </div>
            </div>    
          </div> 

          {daySum && daySum.length === 0 || monthSum && monthSum.length === 0 && 
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

export default IncomesCard


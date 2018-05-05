import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import gql from "graphql-tag"
import { Query } from "react-apollo"

import pick from 'lodash/pick'

import { Line } from 'react-chartjs-2'

// Localization 
import T from 'i18n-react'

const GET_CUSTOMERS = gql`
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
const CustomersCard = () => (
  <Query query={GET_CUSTOMERS}>
    {({ loading, error, data }) => {
     
      const daySum = data && data.getIncomesData && data.getIncomesData.daySum
      const monthSum = data && data.getIncomesData && data.getIncomesData.monthSum

      let dayPick = daySum && daySum.map(item => pick(item, ['day']).day.substring(0, 5))
      let sumPick = daySum && daySum.map(item => pick(item, ['sum']).sum)
      
      let chartData = {
        labels: dayPick,
        datasets: [
          {
            label: 'Customers',
            data: sumPick,
            borderColor: "#7DA40D",
            borderWidth: 1,
            fill: false,
            pointRadius: 2,
            pointBackgroundColor: "#7DA40D",
          },
          // {
          //   borderColor: "#be0a0a",
          //   borderWidth: 1,
          //   fill: false,
          //   pointRadius: 2,
          //   pointBackgroundColor: "#be0a0a",
          //   data: 4
          // }
          ]
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
                <i className="users icon"></i>
              </h4>
            </div> 
            <div className="left floated">
              <h4 className="ui header">
                {T.translate("dashboard.customers.header")}
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
                <Link to="/customers" className="ui primary outline button small">
                  <i className="check circle outline icon"></i>{T.translate("dashboard.customers.create_first_customer")}
                </Link>
              </div>
            </div>
          }          
        </div>
      )
    }}
  </Query>
)

export default CustomersCard


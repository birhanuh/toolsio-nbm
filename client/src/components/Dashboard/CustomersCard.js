import React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { Query } from 'react-apollo'
import { GET_CUSTOMERS_DATA } from '../../graphql/dashboard'

import pick from 'lodash/pick'

import { Polar } from 'react-chartjs-2'

// Localization 
import T from 'i18n-react'

const CustomersCard = () => (
  <Query query={GET_CUSTOMERS_DATA}>
    {({ loading, error, data }) => {
      
      const daySum = data && data.getIncomesData && data.getIncomesData.daySum
      const monthSum = data && data.getIncomesData && data.getIncomesData.monthSum

      let dayPick = daySum && daySum.map(item => pick(item, ['day']).day.substring(0, 5))
      let sumPick = daySum && daySum.map(item => pick(item, ['sum']).sum)

      let chartData = {
        labels: [
           'Red',
          'Green',
          'Yellow',
          'Blue'
        ],
        datasets: [{
          data: [
            60,
            37,
            20,
            41
          ],
          backgroundColor: [
            '#FF6384',
            '#4BC0C0',
            '#FFCE56',
            '#36A2EB'
          ],
          label: 'My dataset' // for legend
        }]        
      }

      const chartOptions = {
        responsive: true,
        legend: {
          position: 'right',
        },
        title: {
          display: true,
          text: 'Chart.js Polar Area Chart'
        },
        scale: {
          ticks: {
            beginAtZero: true
          },
          reverse: false
        },
        animation: {
          animateRotate: false,
          animateScale: true
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

            <Polar data={chartData} options={chartOptions} />

          </div>
          
          <div className="content">
            { !!error && <div className="ui negative message"><p>{error.message}</p></div> } 
            <div className="right floated">
              <div className="meta">{monthSum && monthSum ? (monthSum[0].month ? monthSum[0].month : '-') : '-'}</div>
              <div className="header">
                {monthSum && monthSum ? (monthSum[0].sum ? monthSum[0].sum : '-') : '-'}
                {monthSum && monthSum[1] && ((monthSum[1].sum > monthSum[0].sum) ? <i className="long arrow down red icon"></i> : 
                  <i className="long arrow up green icon"></i>)}
                </div>
            </div>     
            <div className="left floated">
              <div className="meta">{monthSum && monthSum[1] ? (monthSum[1].month ? monthSum[1].month : '-') : '-'}</div>
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


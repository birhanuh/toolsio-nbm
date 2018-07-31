import React  from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
// Semantic UI Form elements
import { Segment, Header, Card, Icon, Image, Message } from 'semantic-ui-react'
import { Query } from 'react-apollo'
import { GET_INCOMES_DATA } from '../../graphql/dashboard'

import pick from 'lodash/pick'
import Moment from 'moment'

import { Line } from 'react-chartjs-2'

// Localization 
import T from 'i18n-react'

const IncomesCard = () => (
  <Query query={GET_INCOMES_DATA}>
    {({ loading, error, data }) => {
     
      const daySum = data.getIncomesData && data.getIncomesData.daySum
      const monthSum = data.getIncomesData && data.getIncomesData.monthSum.map(item => pick(item, ['month', 'sum']))
      const countInvoices = data.getIncomesData && data.getIncomesData.countInvoices
      console.log('countInvoices', countInvoices === 0)
      let monthSumSorted = monthSum && monthSum.sort(function(a, b) {
          let x = new Date(Moment(a.month, 'MM/YYYY')) 
          let y = new Date(Moment(b.month, 'MM/YYYY')) 
          return ((x < y) ? -1 : ((x > y) ? 1 : 0))
        })

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
        <Card id="incomes" className={classnames("dashboard form", { loading: loading })}>
          <Card.Content>
            <Card.Header>
              <Header as='h4' floated='left'>
                {T.translate("dashboard.incomes.header")}
              </Header>
              <Header as='h4' floated='right' className="mr-0">
                <Icon floated='right' name='money' className="mr-0"/>
              </Header>
            </Card.Header>
          </Card.Content>        
          <Image>
            <Line data={chartData} options={chartOptions} />
          </Image>
          
          <Card.Content extra>
            { !!error && <Message negative><p>{error.message}</p></Message> } 
            <Segment vertical floated='left' className="p-0">
              <Card.Meta>{monthSumSorted && monthSumSorted[0] ? (monthSumSorted[0].month ? monthSumSorted[0].month : '-') : '-'}</Card.Meta>
              <Card.Header>
                {monthSumSorted && monthSumSorted[0] ? (monthSumSorted[0].sum ? monthSumSorted[0].sum : '-') : '-'}
              </Card.Header>
            </Segment>  
            <Segment vertical floated='right' className="p-0">
              <Card.Meta>{monthSumSorted && monthSumSorted.length !== 0 ? (monthSumSorted[1].month ? monthSumSorted[1].month : '-') : '-'}</Card.Meta>
              <Card.Header>
                {monthSumSorted && monthSumSorted.length !== 0 ? (monthSumSorted[1].sum ? monthSumSorted[1].sum : '-') : '-'}
                {monthSumSorted && monthSumSorted[0] && ((monthSumSorted[0].sum > monthSumSorted[1].sum) ? <Icon name="long arrow down" className="red" /> : 
                  <Icon name="long arrow up" className="green" />)}
                </Card.Header>
            </Segment>       
          </Card.Content> 

          {countInvoices === 0 && 
            <div className="content-btn-outer-container">
              <div className="content-btn-inner-container">
                <Link to="/invoices" className="ui primary outline button small">
                  <Icon name="check circle outline" />{T.translate("dashboard.invoices.create_first_invoice")}
                </Link>
              </div>
            </div>
          }          
        </Card>
      )
    }}
  </Query>
)

export default IncomesCard


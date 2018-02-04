import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import 'react-vis/dist/style.css'
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries, RadialChart, Hint } from 'react-vis'

// Localization 
import T from 'i18n-react'

export default function Card({...props}) {
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ]

  const { incomes, projects, sales, customers, invoices } = props

  const incomesGraph = (incomes) => {
    
    const data = incomes[1].data.map(income => 
      ({x: new Date(''+monthNames[income.date.month-1]+' '+income.date.day+' '+income.date.year+'').getTime(), y: income.sum})
      )

    const MARGIN = {
      bottom: 50
    }

    return (
      <div className="dashboards">
        <h4 className="ui header">
          {incomes && T.translate("dashboards.incomes.header")}
        </h4>
        <div className="ui card">
          <div className="content">

            <div className="image">
              <XYPlot
                xType="time"
                margin={MARGIN}
                width={300}
                height={200}>
                <HorizontalGridLines />
                <LineSeries
                  data={data}/>
                <XAxis tickLabelAngle={-90} />
                <YAxis />
              </XYPlot>
            </div>
            <div className="right floated">
              <div className="meta">{T.translate("dashboards.this_month")}</div>
              <div className="header">{incomes[1].totalSum}</div>
            </div>     
            <div className="left floated">
              <div className="meta">{T.translate("dashboards.last_month")}</div>
              <div className="header">{incomes[0].totalSum}</div>
            </div>    
          </div>
        </div>
      </div>  
      )
    }

  const projectsGraph = (projects) => {

    let value = false

    const data = projects[1].data.map(project => {

      let projectStatusClass          
      switch(project.status) {
        case 'new':
          projectStatusClass = 'blue-graph'
          break
        case 'in progress':
          projectStatusClass = 'orange-graph'
          break
        case 'overdue':
          projectStatusClass = 'red-graph'
          break
        case 'finished':
          projectStatusClass = 'green-graph' 
          break
        case 'delivered':
          projectStatusClass = 'turquoise-graph' 
          break
        case 'delayed':
          projectStatusClass = 'red-graph' 
          break  
        default:
          projectStatusClass = 'undefined' 
      }

      return ({theta: project.count, className: ''+projectStatusClass+''})
      })
    console.log('data: ', data)
    return (
      <div className="dashboards">
        <h4 className="ui header">
          {projects && T.translate("dashboards.projects.header")}
        </h4>
        <div className="ui card">
          <div className="content">

            <div className="image">
              <RadialChart
                className={'donut-chart-example'}
                innerRadius={55}
                radius={95}
                getAngle={d => d.theta}
                data={data}
                onValueMouseOver={v => {}}
                onSeriesMouseOut={v => {}}
                width={300}
                height={200}>
                {value && <Hint value={value}/>}
              </RadialChart>
            </div>
            <div className="right floated">
              <div className="meta">{T.translate("dashboards.this_month")}</div>
              <div className="header">{projects[1].totalCount}</div>
            </div>     
            <div className="left floated">
              <div className="meta">{T.translate("dashboards.last_month")}</div>
              <div className="header">{projects[0].totalCount}</div>
            </div>    
          </div>
        </div>
      </div>  
      )
    }

  const salesGraph = (sales) => {

    let value = false

    const data = sales[1].data.map(sale => {

      let saleStatusClass          
      switch(sale.status) {
        case 'new':
          saleStatusClass = 'blue-graph'
          break
        case 'in progress':
          saleStatusClass = 'orange-graph'
          break
        case 'overdue':
          saleStatusClass = 'red-graph'
          break
        case 'ready':
          saleStatusClass = 'green-graph' 
          break
        case 'ready':
          saleStatusClass = 'turquoise-graph' 
          break
         case 'delayed':
          saleStatusClass = 'red-graph' 
          break
        default:
          saleStatusClass = 'undefined'
      }

      return ({theta: sale.count, className: ''+saleStatusClass+''})
      })

    return (
      <div className="dashboards">
        <h4 className="ui header">
          {sales && T.translate("dashboards.sales.header")}
        </h4>
        <div className="ui card">
          <div className="content">

            <div className="image">
              <RadialChart
                className={'donut-chart-example'}
                innerRadius={55}
                radius={95}
                getAngle={d => d.theta}
                data={data}
                onValueMouseOver={v => {}}
                onSeriesMouseOut={v => {}}
                width={300}
                height={200}>
                {value && <Hint value={value}/>}
              </RadialChart>
            </div>
            <div className="right floated">
              <div className="meta">{T.translate("dashboards.this_month")}</div>
              <div className="header">{sales[1].totalCount}</div>
            </div>     
            <div className="left floated">
              <div className="meta">{T.translate("dashboards.last_month")}</div>
              <div className="header">{sales[0].totalCount}</div>
            </div>    
          </div>
        </div>
      </div>  
      )
    }

  const customersGraph = (customers) => {

      const data = [
    {x: 0, y: 8},
    {x: 1, y: 5},
    {x: 2, y: 4},
    {x: 3, y: 9},
    {x: 4, y: 1},
    {x: 5, y: 7},
    {x: 6, y: 6},
    {x: 7, y: 3},
    {x: 8, y: 2},
    {x: 9, y: 0}
  ]
    return (
      <div className="dashboards">
        <h4 className="ui header">
          {customers && T.translate("dashboards.customers.header")}
        </h4>
        <div className="ui card">
          <div className="content">

            <div className="image">
              <XYPlot
                width={300}
                height={200}>
                <HorizontalGridLines />
                <LineSeries
                  data={data}/>
                <XAxis />
                <YAxis />
              </XYPlot>
            </div>
            <div className="right floated">
              <div className="meta">{T.translate("dashboards.this_month")}</div>
              <div className="header">15</div>
            </div>     
            <div className="left floated">
              <div className="meta">{T.translate("dashboards.last_month")}</div>
              <div className="header">15</div>
            </div>    
          </div>
        </div>
      </div>  
      )
    }

  const invoicesGraph = (invoices) => {

      const data = [
    {x: 0, y: 8},
    {x: 1, y: 5},
    {x: 2, y: 4},
    {x: 3, y: 9},
    {x: 4, y: 1},
    {x: 5, y: 7},
    {x: 6, y: 6},
    {x: 7, y: 3},
    {x: 8, y: 2},
    {x: 9, y: 0}
  ]
    return (
      <div className="dashboards">
        <h4 className="ui header">
          {invoices && T.translate("dashboards.invoices.header")}
        </h4>
        <div className="ui card">
          <div className="content">

            <div className="image">
              <XYPlot
                width={600}
                height={200}>
                <HorizontalGridLines />
                <LineSeries
                  data={data}/>
                <XAxis />
                <YAxis />
              </XYPlot>
            </div>
            <div className="right floated">
              <div className="meta">{T.translate("dashboards.this_month")}</div>
              <div className="header">15</div>
            </div>     
            <div className="left floated">
              <div className="meta">{T.translate("dashboards.last_month")}</div>
              <div className="header">15</div>
            </div>    
          </div>
        </div>
      </div>  
      )
    }

  return (

    <div>
      { incomes && incomesGraph(incomes) }
      { projects && projectsGraph(projects) }
      { sales && salesGraph(sales) }
      { customers && customersGraph(customers) }
      { invoices && invoicesGraph(invoices) }     
    </div>     
  )
}

// Card.propTypes = {
//   props: PropTypes.object.isRequired
// }
import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import 'react-vis/dist/style.css'
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries} from 'react-vis'

// Localization 
import T from 'i18n-react'

export default function Card({...props}) {
  
  const { incomes, projects, sales, customers, invoices } = props

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

  const incomesGraph = (
    <div className="image">
      <XYPlot
        width={300}
        height={300}>
        <HorizontalGridLines />
        <LineSeries
          data={data}/>
        <XAxis />
        <YAxis />
      </XYPlot>
    </div>
    )

  const projectsGraph = (
    <div className="image">
      <XYPlot
        width={300}
        height={300}>
        <HorizontalGridLines />
        <LineSeries
          data={data}/>
        <XAxis />
        <YAxis />
      </XYPlot>
    </div>
    )

  const salesGraph = (
    <div className="image">
      <XYPlot
        width={300}
        height={300}>
        <HorizontalGridLines />
        <LineSeries
          data={data}/>
        <XAxis />
        <YAxis />
      </XYPlot>
    </div>
    )

  const customersGraph = (
    <div className="image">
      <XYPlot
        width={300}
        height={300}>
        <HorizontalGridLines />
        <LineSeries
          data={data}/>
        <XAxis />
        <YAxis />
      </XYPlot>
    </div>
    )

  const invoicesGraph = (
    <div className="image">
      <XYPlot
        width={300}
        height={300}>
        <HorizontalGridLines />
        <LineSeries
          data={data}/>
        <XAxis />
        <YAxis />
      </XYPlot>
    </div>
    )

  return (

    <div className="dashboards">
      <h4 className="ui header">
        {incomes && T.translate("dashboards.incomes")}
        {projects && T.translate("dashboards.projects")}
        {sales && T.translate("dashboards.sales")}
        {customers && T.translate("dashboards.customers")}
        {invoices && T.translate("dashboards.invoices")}
      </h4>
      <div className="ui card">
        <div className="content">

          { incomes && incomesGraph }
          { projects && projectsGraph }
          { sales && salesGraph }
          { customers && customersGraph }
          { invoices && invoicesGraph }

          <div className="right floated">
            <div className="meta">This month</div>
            <div className="header">15</div>
          </div>     
          <div className="left floated">
            <div className="meta">Last month</div>
            <div className="header">15</div>
          </div>    
        </div>
      </div>
    </div>  
  )
}

// Card.propTypes = {
//   props: PropTypes.object.isRequired
// }
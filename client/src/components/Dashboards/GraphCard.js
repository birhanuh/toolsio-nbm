import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import 'react-vis/dist/style.css'
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries} from 'react-vis'

// Localization 
import T from 'i18n-react'

export default function Card({dashboards}) {
  
  const { incomes, projects, sales, customers, invoices, projectTasks, saleTasks, invoiceTasks } = dashboards

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
      <h4 className="ui header">Incomes</h4>
      <div className="ui card">
        <div className="content">

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

Card.propTypes = {
  dashboards: PropTypes.object.isRequired
}
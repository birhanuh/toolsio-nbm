import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import 'react-vis/dist/style.css'
import {XYPlot, XAxis, YAxis, LineSeries, VerticalGridLines, HorizontalGridLines } from 'react-vis'

// Localization 
import T from 'i18n-react'

export default function IncomesCard({incomes}) {
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ]

  const data = incomes && incomes[1].data.map(income => 
    ({x: new Date(''+monthNames[income.date.month-1]+' '+income.date.day+' '+income.date.year+'').getTime(), y: income.sum})
    )

  const MARGIN = {
    bottom: 50
  }

  return (

    <div className="dashboards">
      <h4 className="ui header">
        {T.translate("dashboards.incomes.header")}
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
            <div className="header">{incomes && incomes[1].totalSum}</div>
          </div>     
          <div className="left floated">
            <div className="meta">{T.translate("dashboards.last_month")}</div>
            <div className="header">{incomes && incomes[0].totalSum}</div>
          </div>    
        </div>
      </div>
    </div>  
  )
}

// Card.propTypes = {
//   props: PropTypes.object.isRequired
// }
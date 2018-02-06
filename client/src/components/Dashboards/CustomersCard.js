import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import 'react-vis/dist/style.css'
import { XYPlot, XAxis, YAxis, LineSeries, VerticalGridLines, HorizontalGridLines } from 'react-vis'

// Localization 
import T from 'i18n-react'

export default function CustomersCard({customers}) {
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ]

  const data = customers && customers[0].data.map(customer => 
    ({x: new Date(''+monthNames[customer.date.month-1]+' '+customer.date.day+' '+customer.date.year+'').getTime(), y: customer.count})
    )

  const dataAvg = customers && customers[0].data.map(customer => 
    ({x: new Date(''+monthNames[customer.date.month-1]+' '+customer.date.day+' '+customer.date.year+'').getTime(), y: 4})
    )

  const MARGIN = {
    bottom: 50
  }
 
  return (
    <div className="dashboards">
      <h4 className="ui header">
        {customers && T.translate("dashboards.customers.header")}
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
              <LineSeries
                data={dataAvg}/>
              <XAxis tickLabelAngle={-90} />
              <YAxis />
            </XYPlot>
          </div>
          <div className="right floated">
            <div className="meta">{T.translate("dashboards.this_month")}</div>
            <div className="header">{customers && customers[1].totalCount}</div>
          </div>     
          <div className="left floated">
            <div className="meta">{T.translate("dashboards.average")}</div>
            <div className="header">4</div>
          </div>    
        </div>
      </div>
    </div>  
    )

}

// Card.propTypes = {
//   props: PropTypes.object.isRequired
// }
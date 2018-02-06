import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import 'react-vis/dist/style.css'
import { RadialChart, Hint } from 'react-vis'

// Localization 
import T from 'i18n-react'

export default function SalesCard({sales}) {

  let value = false
  
  const data = sales && sales[1].data.map(sale => {

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
      case 'delivered':
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
        {T.translate("dashboards.sales.header")}
      </h4>
      <div className="ui card">
        <div className="content">

          <div className="image">
            <RadialChart
              className={'donut-chart-example'}
              innerRadius={55}
              radius={95}
              getAngle={d => d.theta}
              data={data ? data : [{theta: 0}]}
              onValueMouseOver={v => {}}
              onSeriesMouseOut={v => {}}
              width={300}
              height={200}>
              {value && <Hint value={value}/>}
            </RadialChart>
          </div>
          <div className="right floated">
            <div className="meta">{T.translate("dashboards.this_month")}</div>
            <div className="header">{sales && sales[1].totalCount}</div>
          </div>     
          <div className="left floated">
            <div className="meta">{T.translate("dashboards.last_month")}</div>
            <div className="header">{sales && sales[0].totalCount}</div>
          </div>    
        </div>
      </div>
    </div>  
    )
    

}

// Card.propTypes = {
//   props: PropTypes.object.isRequired
// }
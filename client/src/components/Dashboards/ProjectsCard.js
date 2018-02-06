import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import 'react-vis/dist/style.css'
import { RadialChart, Hint } from 'react-vis'

// Localization 
import T from 'i18n-react'

export default function ProjectsCard({projects}) {

  let value = false

  const data = projects && projects[1].data.map(project => {

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

  return (
    <div className="dashboards">
      <h4 className="ui header">
        {T.translate("dashboards.projects.header")}
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
            <div className="header">{projects && projects[1].totalCount}</div>
          </div>     
          <div className="left floated">
            <div className="meta">{T.translate("dashboards.last_month")}</div>
            <div className="header">{projects && projects[0].totalCount}</div>
          </div>    
        </div>
      </div>
    </div>  
    )
}

// Card.propTypes = {
//   props: PropTypes.object.isRequired
// }
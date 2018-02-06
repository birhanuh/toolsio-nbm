import React, { Component }  from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { fetchSales } from '../../actions/dashboardActions'

import 'react-vis/dist/style.css'
import { RadialChart, Hint } from 'react-vis'

// Localization 
import T from 'i18n-react'

class SalesCard extends Component {

  state = {
    value: false,
    isLoading: false
  }

  componentDidMount = () => {
    this.props.fetchSales()
      .catch( ({response}) => this.setState({ isLoading: true }) )
  }

  render() {

    const { value } = this.state
    const { sales } = this.props

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
                onValueMouseOver={v => this.setState({value: v})}
                onSeriesMouseOut={v => this.setState({value: false})}
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

}

SalesCard.propTypes = {
  fetchSales: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    sales: state.dashboards.sales
  }
}

export default connect(mapStateToProps, { fetchSales }) (SalesCard)

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { fetchCustomers } from '../../actions/dashboardActions'

import { XYPlot, XAxis, YAxis, LineSeries, HorizontalGridLines, Hint, DiscreteColorLegend } from 'react-vis'

// Localization 
import T from 'i18n-react'

class CustomersCard extends Component {
  
  state = {
    value: false,
    isLoading: false
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.customers) {
      this.setState({ isLoading: false })
    }
  }

  componentDidMount = () => {
    this.setState({ isLoading: true })
    this.props.fetchCustomers()
      .catch( ({response}) => this.setState({ isLoading: false }) )
  }

  render() {

    const { value, isLoading } = this.state
    const { customers } = this.props

    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
      ]

    const data = customers && customers.lastTwoMonths[0].data.map(customer => 
      ({x: new Date(''+monthNames[customer.date.month-1]+' '+customer.date.day+' '+customer.date.year+'').getTime(), y: customer.count})
      )
    
    const dataAvg = data && data.map(xyData => 
      ({x: xyData.x, y: customers && customers.total.avg})
      )
    
    const MARGIN = {
      bottom: 50
    }

    const tooltipClass = {
      fontSize: '12px',
      background: 'black', 
      opacity: 0.85, 
      color: '#ffffff', 
      padding: '5px', 
      borderRadius: '5px'
    }
   
    return (
      <div className={classnames("ui card dashboards form", { loading: isLoading })}>
        <div className="content">
          <div className="right floated">
            <h4 className="ui header">
              <i className="users icon"></i>
            </h4>
          </div> 
          <div className="left floated">
            <h4 className="ui header">
              {T.translate("dashboards.customers.header")}
            </h4>
          </div>       
        </div>
        <div className="image">
          <XYPlot
          xType="time"
          margin={MARGIN}
          width={300}
          height={200}
          onValueMouseOver={v => this.setState({value: v})}
          onSeriesMouseOut={v => this.setState({value: false})}
          >
          <DiscreteColorLegend
            className="legend-right-top-aligned"
            orientation="vertical" 
            items={[
              {
                title: 'This month',
                color: '#12939A'
              },
              {
                title: 'Average per month',
                color: '#79C7E3'
              }
            ]}
          />
          {value && 
            <Hint value={value}>
              <div style={tooltipClass}>
                <p><strong>Status: </strong><span style={{textTransform: 'capitalize'}}>{value.x}</span></p>
                <p><strong>Number: </strong>{value.y}</p>
              </div>
            </Hint>
          }
          <HorizontalGridLines />
          <LineSeries
            style={{strokeLinejoin: "round"}}
            data={data}
            />
          <LineSeries
            data={dataAvg}/>
          <XAxis tickLabelAngle={-90} />
          <YAxis />
        </XYPlot>
        </div>
        <div className="content">  
          <div className="right floated">
            <div className="meta">{T.translate("dashboards.this_month")}</div>
            <div className="header">
              {customers && customers.lastTwoMonths[1].totalCount}
              {customers && (customers.total.avg.toFixed(2) > customers.lastTwoMonths[1].totalCount ) ? <i className="long arrow down red icon"></i> : 
                <i className="long arrow up green icon"></i>}
            </div>
          </div>     
          <div className="left floated">
            <div className="meta">{T.translate("dashboards.average")}</div>
            <div className="header">{customers && customers.total.avg.toFixed(2)}</div>
          </div>    
        </div>

        {customers && customers.total.count === 0 && 
          <div className="content-btn-outer-container">
            <div className="content-btn-inner-container">
              <Link to="/customers" className="ui primary outline button small">
                <i className="check circle outline icon"></i>{T.translate("dashboards.customers.create_first_customer")}
              </Link>
            </div>
          </div>
        }    

      </div>
      )
  }  
}

CustomersCard.propTypes = {  
  fetchCustomers: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    customers: state.dashboards.customers
  }
}

export default connect(mapStateToProps, { fetchCustomers }) (CustomersCard)

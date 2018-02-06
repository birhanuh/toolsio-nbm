import React, { Component }  from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { fetchIncomes } from '../../actions/dashboardActions'

import {XYPlot, XAxis, YAxis, LineSeries, VerticalGridLines, HorizontalGridLines } from 'react-vis'

// Localization 
import T from 'i18n-react'

class IncomesCard extends Component {
  
  state = {
    value: false,
    isLoading: false
  }

  componentDidMount = () => {
    this.props.fetchIncomes()
      .catch( ({response}) => this.setState({ isLoading: true }) )
  }

  render() {

    const { value } = this.state
    const { incomes } = this.props

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
                  style={{strokeLinejoin: "round"}}
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
}

IncomesCard.propTypes = {
  fetchIncomes: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    incomes: state.dashboards.incomes
  }
}

export default connect(mapStateToProps, { fetchIncomes }) (IncomesCard)

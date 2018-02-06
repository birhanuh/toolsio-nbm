import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { fetchInvoices } from '../../actions/dashboardActions'

import 'react-vis/dist/style.css'
import { XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, VerticalBarSeries, VerticalBarSeriesCanvas } from 'react-vis'

// Localization 
import T from 'i18n-react'

class InvoicesCard extends Component {

   state = {
    value: false,
    isLoading: false
  }

  componentDidMount = () => {
    this.props.fetchInvoices()
      .catch( ({response}) => this.setState({ isLoading: true }) )
  }

  render() {

  const { value } = this.state
  const { invoices } = this.props

  let useCanvas = false
  const content = useCanvas ? 'TOGGLE TO SVG' : 'TOGGLE TO CANVAS';
  const BarSeries = useCanvas ? VerticalBarSeriesCanvas : VerticalBarSeries;

  const data = invoices && invoices[1].data.map(invoice => 
    ({x: invoice.week, y: invoice.count})
    )
  console.log('data invoice: ', data)
  return (
    <div className="dashboards">
      <h4 className="ui header">
        {invoices && T.translate("dashboards.invoices.header")}
      </h4>
      <div className="ui card">
        <div className="content">

          <div className="image">
            <XYPlot
              xType="ordinal"
              width={600}
              height={300}
              xDistance={100}
              >
              <VerticalGridLines />
              <HorizontalGridLines />
              <XAxis tickFormat={v => `Week ${v}`} />
              <YAxis />
              <BarSeries
                className="vertical-bar-series-example"
                data={[
                  {x: 'A', y: 10},
                  {x: 'B', y: 5},
                  {x: 'C', y: 15}
                ]}/>
              <BarSeries
                data={[
                  {x: 'A', y: 12},
                  {x: 'B', y: 2},
                  {x: 'C', y: 11}
                ]}/>
              <BarSeries
                data={[
                  {x: 'A', y: 12},
                  {x: 'B', y: 2},
                  {x: 'C', y: 11}
                ]}/>
              <BarSeries
                data={[
                  {x: 'A', y: 12},
                  {x: 'B', y: 2},
                  {x: 'C', y: 11}
                ]}/>
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

}

InvoicesCard.propTypes = {  
  fetchInvoices: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    invoices: state.dashboards.invoices
  }
}

export default connect(mapStateToProps, { fetchInvoices }) (InvoicesCard)


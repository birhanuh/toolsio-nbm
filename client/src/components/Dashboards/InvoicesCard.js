import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { fetchInvoices } from '../../actions/dashboardActions'

import { XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, VerticalBarSeries, DiscreteColorLegend } from 'react-vis'

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

  let dataNew = []
  let dataPending = []
  let dataOverdue = []
  let dataPaid = []

  const data = invoices && invoices[1].data.map(invoice => {

    let invoiceStatusClass          
    switch(invoice.status) {
      case 'new':
        invoiceStatusClass = 'blue'
        dataNew.push({x: invoice.week, y: invoice.count, status: invoice.status})
        break
      case 'pending':
        invoiceStatusClass = 'orange'
        dataNew.push({x: invoice.week, y: invoice.count, status: invoice.status})
        break
      case 'overdue':
        invoiceStatusClass = 'red'
        dataOverdue.push({x: invoice.week, y: invoice.count, status: invoice.status})
        break
      case 'paid':
        invoiceStatusClass = 'green' 
        dataPaid.push({x: invoice.week, y: invoice.count, status: invoice.status})
        break
      default:
        invoiceStatusClass = 'undefined' 
    }
    
    })
  console.log('dataNew invoice: ', dataNew)
   console.log('dataPending invoice: ', dataPending)
    console.log('dataOverdue nvoice: ', dataOverdue )
     console.log('dataPaid invoice: ', dataPaid)
  return (
    <div className="ui card">
      <div className="content">
        <div className="right floated">
          <h4 className="ui header">
            <i className="file text outline icon"></i>
          </h4>
        </div> 
        <div className="left floated">
          <h4 className="ui header">
            { T.translate("dashboards.invoices.header")}
          </h4>
        </div>       
      </div>

      <div className="image">
        <XYPlot
          xType="ordinal"
          width={600}
          height={300}
          >
          <DiscreteColorLegend
            className="legend-center-top-aligned"
            orientation="horizontal" items={[
              {
                title: 'New',
                color: '#199CD5'
              },
              {
                title: 'Pending',
                color: '#F0730F'
              },
              {
                title: 'Overdue',
                color: '#be0a0a'
              },
              {
                title: 'Paid',
                color: '#7DA40D'
              }
            ]}
          />
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis tickFormat={v => `Week ${v}`} />
          <YAxis />
          <VerticalBarSeries
            color="#199CD5"
            data={dataNew}/>
          <VerticalBarSeries
            color="#F0730F"
            data={dataPending}/>
          <VerticalBarSeries
            color="#be0a0a"
            data={dataOverdue}/>
          <VerticalBarSeries
            color="#7DA40D"
            data={dataPaid}/>
        </XYPlot>
      </div>

      <div className="content"> 
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


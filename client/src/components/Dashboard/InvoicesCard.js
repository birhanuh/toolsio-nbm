import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { fetchInvoices } from '../../actions/dashboardActions'

import { Bar } from 'react-chartjs-2'

// Localization 
import T from 'i18n-react'

class InvoicesCard extends Component {

   state = {
    value: false,
    isLoading: false
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.invoices) {
      this.setState({ isLoading: false })
    }
  }

  componentDidMount = () => {
    this.setState({ isLoading: true })
    this.props.fetchInvoices()
      .catch( ({response}) => this.setState({ isLoading: false }) )
  }

  render() {

  const { value, isLoading } = this.state
  const { invoices } = this.props

  let dataNew = []
  let dataPending = []
  let dataOverdue = []
  let dataPaid = []

  const data = invoices && invoices.lastTwoMonths.length !== 0 && invoices.lastTwoMonths[1].data.map(invoice => {

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
    <div className={classnames("ui card dashboard form", { loading: isLoading })}>
      <div className="content">
        <div className="right floated">
          <h4 className="ui header">
            <i className="file text outline icon"></i>
          </h4>
        </div> 
        <div className="left floated">
          <h4 className="ui header">
            { T.translate("dashboard.invoices.header")}
          </h4>
        </div>       
      </div>

      <div className="image">
        <Bar />
      </div>

      <div className="content"> 
        <div className="right floated">
          <div className="meta">{T.translate("dashboard.this_month")}</div>
          <div className="header">
            {invoices && invoices.lastTwoMonths.length !== 0 && invoices.lastTwoMonths[1].totalCount}
            {invoices && invoices.lastTwoMonths.length !== 0 && (invoices.lastTwoMonths[0].totalCount > invoices.lastTwoMonths[1].totalCount ) ? <i className="long arrow down red icon"></i> : 
              <i className="long arrow up green icon"></i>}
          </div>
        </div>     
        <div className="left floated">
          <div className="meta">{T.translate("dashboard.last_month")}</div>
          <div className="header">{invoices && invoices.lastTwoMonths.length !== 0 && invoices.lastTwoMonths[0].totalCount}</div>
        </div>    
      </div>

       {(!!invoices || (invoices && invoices.total && invoices.total.count === 0)) &&
          <div className="content-btn-outer-container">
            <div className="content-btn-inner-container">
              <Link to="/invoices" className="ui primary outline button small">
                <i className="check circle outline icon"></i>{T.translate("dashboard.invoices.create_first_invoice")}
              </Link>
            </div>
          </div>
        }  
    </div> 
    )
  }

}

InvoicesCard.propTypes = {  
  fetchInvoices: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    invoices: state.dashboard.invoices
  }
}

export default connect(mapStateToProps, { fetchInvoices }) (InvoicesCard)


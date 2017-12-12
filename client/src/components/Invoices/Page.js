import React, { Component } from 'react'
import ReactDOMServer from 'react-dom/server'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import List from './List' 
import { connect } from 'react-redux'
import { fetchInvoices } from '../../actions/invoiceActions'

// Localization 
import T from 'i18n-react'

class Page extends Component {

  componentDidMount() {
    this.props.fetchInvoices()
  }

  shouldComponentUpdate = () => {
    return false
  }
  
  render() {
    
    const invoices = this.props.invoices.map(invoice => {
      let status = (
        <div className={classnames("ui uppercase tiny label", {orange: invoice.status === 'pending', red: invoice.status === 'overdue', green: invoice.status === 'paid' })}>
          {invoice.status}
        </div>
      )
      let actions = (
        <div className="ui small buttons">
          <a href={`/invoices/edit/${invoice._id}`} className="ui icon basic button green"><i className="edit icon"></i></a>
          <a href={`/invoices/show/${invoice._id}`} className="ui icon basic blue button"><i className="unhide icon"></i></a>
        </div>
      )

      return [
        (invoice.sale && invoice.sale.name) || (invoice.project && invoice.project.name),
        invoice.deadline,
        invoice.customer.name,
        invoice.project.total || invoice.sale.total,
        ReactDOMServer.renderToStaticMarkup(status),      
        ReactDOMServer.renderToStaticMarkup(actions)        
      ]
    })

    return (

      <div className="row column">  
        <div className="ui vertical segment">
          <Link className="ui primary button" to="/invoices/new">
            <i className="add circle icon"></i>
            {T.translate("invoices.page.create_new_invoice")}
          </Link>
        </div>  

        <List invoices={invoices} />   
      </div>  
    )

  }
}

Page.propTypes = {
  fetchInvoices: PropTypes.func.isRequired
}

function mapSateToProps(state) {
  return {
    invoices: state.invoices
  }
}

export default connect(mapSateToProps, { fetchInvoices })(Page)

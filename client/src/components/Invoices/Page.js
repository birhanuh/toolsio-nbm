import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import List from './List' 
import { connect } from 'react-redux'
import { fetchInvoices } from '../../actions/invoiceActions'

// Localization 
import T from 'i18n-react'

class Page extends Component {

  componentDidMount() {
    this.props.fetchInvoices()
  }

  render() {
    console.log('invoices', this.props.invoices)
    return (

      <div className="row column">  
        <div className="ui vertical segment">
          <Link className="ui primary button" to="/invoices/new">
            <i className="add circle icon"></i>
            {T.translate("invoices.page.create_new_invoice")}
          </Link>
        </div>  

        <List invoices={this.props.invoices} />   
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

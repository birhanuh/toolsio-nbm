import React, { Component } from 'react'
import PropTypes from 'prop-types'

// Localization 
import T from 'i18n-react'

// Datatables
import $ from 'jquery'
//$.fn.DataTable = require('datatables.net-se')

// Images
import ajaxLoader from '../../images/ajax-loader.gif' 

class List extends Component {
  
  componentDidUpdate() {  
    $('.table').DataTable({
      oLanguage: {
        sProcessing: "<img src='"+ajaxLoader+"'>"
      },
      bProcessing: true,
      data: this.props.customers,
      lengthMenu: [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
      columnDefs: [ {
        targets: 'no-sort',
        orderable: false
        }, {
        targets: 'align-center',
        className: 'text-center'
      } ]
    })
  }

  componentWillUnmount() {
    $('.table').DataTable().destroy()
  }

  render() {

    const emptyMessage = (
      <p className="ui info message">{T.translate("customers.page.empty_customers")}</p>
    )

    const customersList = (
      <table id="customersTable" className="ui very compact striped selectable table">
        <thead>
          <tr>
            <th>{T.translate("customers.page.name")}</th>
            <th>{T.translate("customers.page.vat_number")}</th>
            <th>{T.translate("customers.page.contacts")}</th>
            <th>{T.translate("customers.page.active_projects_sales")}</th>
            <th>{T.translate("customers.page.unpaid_invoices")}</th>
            <th>{T.translate("customers.page.view")}</th>
          </tr>
        </thead>
        <tbody>
          
        </tbody>
      </table>
    )

    return (
      <div>
        { this.props.customers.length === 0 ? emptyMessage : customersList }
      </div>   
    )
  }
  
}

List.propTypes = {
  customers: PropTypes.array.isRequired,
  deleteCustomer: PropTypes.func.isRequired
}

export default List
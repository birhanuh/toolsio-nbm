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
      processing: true,
      responsive: true,
      language: {
        emptyTable: 'No records',
        processing: "<img src='"+ajaxLoader+"'>",
        //info: '_START_ to _END_ of _TOTAL_',
        infoEmpty: '',
        search: '',
        searchPlaceholder: 'Search Customers',
        lengthMenu: '_MENU_',
        paginate: {
          previous: '<i class="left chevron icon"></i>',
          next: '<i class="right chevron icon"></i>'
        },
        aria: {
          paginate: {
            previous: 'Previous',
            next: 'Next'
          }
        }
      },
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
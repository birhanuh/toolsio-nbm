import React, { Component } from 'react'
import PropTypes from 'prop-types'

// Localization 
import T from 'i18n-react'

// Datatables
import $ from 'jquery'
window.JSZip = require('jszip')
//require('pdfmake')
import 'datatables.net-se'
import 'datatables.net-buttons-se'
import 'datatables.net-buttons/js/buttons.flash'
import 'datatables.net-buttons/js/buttons.html5'
import 'datatables.net-buttons/js/buttons.print'
import 'datatables.net-responsive-se'

// Images
import ajaxLoader from '../../images/ajax-loader.gif' 

class List extends Component {

  componentDidUpdate() {  
    $('.table').dataTable({
      dom: "<'ui three column grid'<'five wide column'l><'seven wide center aligned column'B><'right aligned four wide column'f>>t<'ui grid'<'left aligned eight wide column'i><'right aligned eight wide column'p>>",
      processing: true,
      responsive: true,
      language: {
        emptyTable: 'No records',
        processing: "<img src='"+ajaxLoader+"'>",
        //info: '_START_ to _END_ of _TOTAL_',
        infoEmpty: '',
        search: '',
        searchPlaceholder: 'Search Invoices',
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
      data: this.props.invoices,
      lengthMenu: [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
      buttons: [
        {extend: 'excel', title: 'Invoices', className: 'ui button tiny'},
        {extend: 'csv', title: 'Invoices', className: 'ui button tiny'},
        {extend: 'pdf', title: 'Invoices', className: 'ui button tiny'},
        {extend: 'print', title: 'Invoices', className: 'ui button tiny'}
      ],
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
      <div className="ui info message">
        <div className="header">
          {T.translate("invoices.page.empty_invoices_header")}
        </div>
        <p>{T.translate("invoices.page.empty_invoices_message")}</p>
      </div>
    )

    const invoicesList = (
      <table className="ui very compact striped selectable table">
        <thead>
          <tr>
            <th>{T.translate("invoices.page.sale_project")}</th>
            <th>{T.translate("invoices.page.deadline")}</th>
            <th>{T.translate("invoices.page.customer")}</th>
            <th>{T.translate("invoices.page.total")}</th>
            <th>{T.translate("invoices.page.status")}</th>
            <th>{T.translate("invoices.page.view")}</th>
          </tr>
        </thead>
        <tbody>
          
        </tbody>
      </table>

    )

    return (
      <div>
        { this.props.invoices.length === 0 ? emptyMessage : invoicesList }
      </div>   
    )
  }
}

List.propTypes = {
  invoices: PropTypes.array.isRequired
}

export default List


import React, { Component } from 'react'
import PropTypes from 'prop-types'

// Localization 
import T from 'i18n-react'

// Datatables
import $ from 'jquery'
$.fn.DataTable = require('datatables.net-se')
$.fn.Buttons = require('datatables.net-buttons-se')

// Images
import ajaxLoader from '../../images/ajax-loader.gif' 

class List extends Component {

  componentDidUpdate() {  
    let table = $('.table').DataTable({
      dom: "<'ui three column grid'<'five wide column'l><'seven wide center aligned column'B><'right aligned four wide column'f>>t<'ui grid'<'left aligned eight wide column'i><'right aligned eight wide column'p>>",
      //dom: 'lBfrtip',
      oLanguage: {
        sProcessing: "<img src='"+ajaxLoader+"'>"
      },
      bProcessing: true,
      data: this.props.invoices,
      lengthMenu: [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
      buttons: [
        {extend: 'excel', title: 'Invoices', className: 'tiny ui button'},
        {extend: 'csv', title: 'Invoices', className: 'tiny ui button'},
        {extend: 'pdf', title: 'Invoices', className: 'tiny ui button'},
        //{extend: 'print', title: 'Invoices', className: 'tiny ui button'}
      ],
      columnDefs: [ {
        targets: 'no-sort',
        orderable: false
        }, {
        targets: 'align-center',
        className: 'text-center'
      } ]
      
    })

    // new $.fn.DataTable.Buttons( table, {
    //   buttons: [
    //     'copy', 'excel', 'pdf'
    //   ]
    // })
  }

  componentWillUnmount() {
    //$('.table').DataTable().fnDestroy()
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


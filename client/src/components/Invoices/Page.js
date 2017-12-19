import React, { Component } from 'react'
import ReactDOMServer from 'react-dom/server'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { fetchInvoices } from '../../actions/invoiceActions'

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

import 'datatables.net-se/css/dataTables.semanticui.css'

// Images
import ajaxLoader from '../../images/ajax-loader.gif' 

class Page extends Component {

  componentDidMount() {
    
    this.props.fetchInvoices()

    $('.table').DataTable({
      processing: true,
      responsive: true,
      language: {
        emptyTable: '<p class="ui info message">'+T.translate("customers.page.empty_customers")+'</p>',
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
      serverSide: true,
      ajax: {
        url: "api/invoices_datatable",
        dataFilter: function(data) {
          var json = $.parseJSON(data)
          json.recordsTotal = json.results.total
          json.recordsFiltered = json.results.total
          json.data = json.results.list

          return JSON.stringify(json) // return JSON string
        }
      },
      lengthMenu: [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
      columnDefs: [ {
        targets: 'not-sortable',
        orderable: false
        }, {
        //targets: 'align-center',
        //className: 'center aligned'
      } ]
    })
  }

  componentWillUnmount = () => {
    $('.table').dataTable().fnDestroy()
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

        <table id="invoicesTable" className="ui very compact striped selectable table">
          <thead>
            <tr>
              <th>{T.translate("invoices.page.sale_project")}</th>
              <th>{T.translate("invoices.page.deadline")}</th>
              <th>{T.translate("invoices.page.customer")}</th>
              <th>{T.translate("invoices.page.total")}</th>
              <th className="not-sortable">{T.translate("invoices.page.status")}</th>
              <th className="not-sortable">{T.translate("invoices.page.view")}</th>
            </tr>
          </thead>
          <tbody>
            
          </tbody>
        </table>   

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

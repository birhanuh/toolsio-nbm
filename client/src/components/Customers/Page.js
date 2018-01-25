import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { fetchCustomers } from '../../actions/customerActions'

// Localization 
import T from 'i18n-react'

import Breadcrumb from '../Layouts/Breadcrumb'

import $ from 'jquery'

// Datatables
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
    
    this.props.fetchCustomers()

    $('.table').dataTable({
      processing: true,
      responsive: true,
      language: {
         emptyTable: '<h4 class="ui header info message m-3">'+T.translate("customers.page.empty_customers_header")+'<p>'+T.translate("customers.page.empty_customers_message")+'</p></h4>',
        processing: "<img src='"+ajaxLoader+"'>",
        //info: '_START_ to _END_ of _TOTAL_',
        infoEmpty: '',
        search: '',
        searchPlaceholder: 'Search Name, Vat number and Contacts',
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
        url: "api/customers_datatable",
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
    
    return (
      <div className="row column">  

        <Breadcrumb />

        <div className="ui vertical segment">
          <Link className="ui primary button" to="/customers/new">
            <i className="add circle icon"></i>
            {T.translate("customers.page.add_new_customer")}
          </Link>
        </div>  

        <table id="customersTable" className="ui very compact striped selectable table">
          <thead>
            <tr>
              <th>{T.translate("customers.page.name")}</th>
              <th>{T.translate("customers.page.vat_number")}</th>
              <th>{T.translate("customers.page.contacts")}</th>
              <th className="not-sortable">{T.translate("customers.page.active_projects_sales")}</th>
              <th className="not-sortable">{T.translate("customers.page.unpaid_invoices")}</th>
              <th className="not-sortable">{T.translate("customers.page.view")}</th>
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
  fetchCustomers: PropTypes.func.isRequired
}

function mapSateToProps(state) {
  return {
    customers: state.customers
  }
}

export default connect(mapSateToProps, { fetchCustomers })(Page)

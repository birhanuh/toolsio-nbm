import React from 'react'
import PropTypes from 'prop-types'
import Tr from './Tr'
import { Pagination } from '../../utils'

// Localization 
import T from 'i18n-react'

export default function Table({ getCustomers, offset, limit }) {
  const emptyMessage = (
    <tbody>
      <tr>
        <td colSpan="6">
          <div className="ui info message m-3">
            <div className="header">{T.translate("customers.page.empty_customers_header")}</div>
            <p>{T.translate("customers.page.empty_customers_message")}</p>
          </div>  
        </td>   
      </tr>
    </tbody> 
  )

  const customersList = (
    <tbody>
      { getCustomers.customers.map(customer => <Tr customer={customer} key={customer.id} />) }
    </tbody>
  )

  return (
    <table id="customersTable" className="ui small striped table">
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

      { getCustomers.customers.length === 0 ? emptyMessage : customersList }

      <tfoot>
        <tr>
          <th colSpan="6">
            <div className="ui right floated pagination menu">
              { <Pagination path="invoices" count={getCustomers.count} offset={offset} limit={limit} /> } 
            </div>
          </th>
        </tr>
      </tfoot>
    </table>
  )
}

Table.propTypes = {
  getCustomers: PropTypes.object.isRequired
}
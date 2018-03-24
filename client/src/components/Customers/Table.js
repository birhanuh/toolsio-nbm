import React from 'react'
import PropTypes from 'prop-types'
import Tr from './Tr'

// Localization 
import T from 'i18n-react'

export default function Table({ customers }) {
  const emptyMessage = (
    <tbody>
      <tr>
        <td colspan="4">
          <div class="ui info message m-3">
            <div className="header">{T.translate("customers.page.empty_customers_header")}</div>
            <p>{T.translate("customers.page.empty_customers_message")}</p>
          </div>  
        </td>   
      </tr>
    </tbody> 
  )

  const customersList = (
    <tbody>
      { customers.map(customer => <Tr customer={customer} key={customer.id} />) }
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

      { customers.length === 0 ? emptyMessage : customersList }
    </table>
  )
}

Table.propTypes = {
  customers: PropTypes.array.isRequired
}
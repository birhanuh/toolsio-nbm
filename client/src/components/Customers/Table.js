import React from 'react'
import PropTypes from 'prop-types'
// Semantic UI JS
import { Table as TableElement, Message, Header } from 'semantic-ui-react'
import Tr from './Tr'
import { Pagination } from '../../utils'

// Localization 
import T from 'i18n-react'

export default function Table({ customers, count, offset, limit }) {
  const emptyMessage = (
    <tbody>
      <tr>
        <td colSpan="6">
          <Message info className="m-3">
            <Header>{T.translate("customers.page.empty_customers_header")}</Header>
            <p>{T.translate("customers.page.empty_customers_message")}</p>
          </Message>  
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
    <TableElement id="customersTable" size="small" striped>
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

      <tfoot>
        <tr>
          <th colSpan="6" className="pt-4 pb-4">
            <Pagination path="customers" count={count} offset={offset} limit={limit} />
          </th>
        </tr>
      </tfoot>
    </TableElement>
  )
}

Table.propTypes = {
  customers: PropTypes.array.isRequired
}
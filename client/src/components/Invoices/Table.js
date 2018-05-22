import React from 'react'
import PropTypes from 'prop-types'
import Tr from './Tr'
import { Pagination } from '../../utils'

// Localization 
import T from 'i18n-react'

export default function Table({ invoices, count, offset, limit }) {
  const emptyMessage = (
    <tbody>
      <tr>
        <td colSpan="6">
          <div className="ui info message m-3">
            <div className="header">{T.translate("invoices.page.empty_invoices_header")}</div>
            <p>{T.translate("invoices.page.empty_invoices_message")}</p>
          </div>  
        </td>   
      </tr>
    </tbody> 
  )

  const invoicesList = (
    <tbody>
      { invoices.map(invoice => <Tr invoice={invoice} key={invoice.id} />) }
    </tbody>
  )

  return (
    <table id="invoicesTable" className="ui small striped table">
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

      { invoices.length === 0 ? emptyMessage : invoicesList }

      <tfoot>
        <tr>
          <th colSpan="6" className="pt-4 pb-4">
            <Pagination path="invoices" count={count} offset={offset} limit={limit} />
          </th>
        </tr>
      </tfoot>
    </table>
  )
}

Table.propTypes = {
  invoices: PropTypes.array.isRequired
}

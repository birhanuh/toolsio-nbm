import React from 'react'
import PropTypes from 'prop-types'
import Tr from './Tr'

// Localization 
import T from 'i18n-react'

export default function List({ invoices }) {
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
          <th>{T.translate("invoices.show.sale_project")}</th>
          <th>{T.translate("invoices.show.deadline")}</th>
          <th>{T.translate("invoices.show.customer")}</th>
          <th>{T.translate("invoices.show.total")}</th>
          <th>{T.translate("invoices.show.status")}</th>
          <th>{T.translate("invoices.show.view")}</th>
        </tr>
      </thead>
      <tbody>
        { invoices.map(invoice => <Tr invoice={invoice} key={invoice._id} />) }
      </tbody>
    </table>

  )

  return (
    <div>
      { invoices.length === 0 ? emptyMessage : invoicesList }
    </div>   
  )
}

List.propTypes = {
  invoices: PropTypes.array.isRequired
}
import React from 'react'
import PropTypes from 'prop-types'
import Tr from './Tr'

// Localization 
import T from 'i18n-react'

export default function List({ customers, deleteCustomer }) {
  const emptyMessage = (
    <p className="ui info message">{T.translate("conversations.page.empty_messages")}</p>
  )

  const customersList = (
    <table className="ui very compact striped selectable table">
      <thead>
        <tr>
          <th>{T.translate("customers.page.title")}</th>
          <th>{T.translate("customers.page.recipient")}</th>
          <th>{T.translate("customers.page.body")}</th>
          <th>{T.translate("customers.page.delete")}</th>
        </tr>
      </thead>
      <tbody>
        { customers.map(customer => <Tr customer={customer} key={customer._id} deleteCustomer={deleteCustomer} />) }
      </tbody>
    </table>
  )

  return (
    <div>
      { customers.length === 0 ? emptyMessage : customersList }
    </div>   
  )
}

List.propTypes = {
  customers: PropTypes.array.isRequired,
  deleteCustomer: PropTypes.func.isRequired
}
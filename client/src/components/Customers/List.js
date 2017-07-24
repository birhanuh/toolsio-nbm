import React from 'react'
import Tr from './Tr'

// Localization 
import T from 'i18n-react'

export default function List({ customers, deleteCustomer }) {
  const emptyMessage = (
    <p className="ui info message">{T.translate("customers.index.empty_customers")}</p>
  )

  const customersList = (
    <table className="ui striped selectable small table">
       <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Status</th>
            <th>Description</th>
            <th>Actions</th>
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
  customers: React.PropTypes.array.isRequired,
  deleteCustomer: React.PropTypes.func.isRequired
}
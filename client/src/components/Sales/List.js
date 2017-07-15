import React from 'react'
import Tr from './Tr'

// Localization 
import T from 'i18n-react'

export default function List({ sales, deleteSale }) {
  const emptyMessage = (
    <p>{T.translate("sales.index.empty_sales")}</p>
  )

  const salesList = (
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
          { sales.map(sale => <Tr sale={sale} key={sale._id} deleteSale={deleteSale} />) }
        </tbody>
    </table>
  )

  return (
    <div>
      { sales.length === 0 ? emptyMessage : salesList }
    </div>   
  )
}

List.propTypes = {
  sales: React.PropTypes.array.isRequired,
  deleteSale: React.PropTypes.func.isRequired
}
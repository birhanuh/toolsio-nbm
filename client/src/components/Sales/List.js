import React from 'react'
import Card from './Card'

// Localization 
import T from 'i18n-react'

export default function List({ sales, deleteSale }) {
  const emptyMessage = (
    <p className="ui info message">{T.translate("sales.index.empty_sales")}</p>
  )

  const salesList = (
    <div className="ui cards">
      { sales.map(sale => <Card sale={sale} key={sale._id} deleteSale={deleteSale} />) }
    </div>
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
import React from 'react'
import PropTypes from 'prop-types'
import Card from './Card'

// Localization 
import T from 'i18n-react'

export default function List({ sales, deleteSale }) {
  const emptyMessage = (
    <div className="ui info message">
      <div className="header">
        {T.translate("sales.page.empty_sales_header")}
      </div>
      <p>{T.translate("sales.page.empty_sales_message")}</p>
    </div>
  )

  const salesList = (
    <div className="ui two cards sales">
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
  sales: PropTypes.array.isRequired,
  deleteSale: PropTypes.func.isRequired
}
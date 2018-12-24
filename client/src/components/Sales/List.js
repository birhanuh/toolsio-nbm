import React from 'react'
import PropTypes from 'prop-types'
// Semantic React UI
import { Card as CardElement, Message, Header } from 'semantic-ui-react'
import classnames from 'classnames'
import Card from './Card'

// Localization 
import T from 'i18n-react'

export default function List({ sales, loading }) {
  const emptyMessage = (
    <Message info>
      <Header>
        {T.translate("sales.page.empty_sales_header")}
      </Header>
      <p>{T.translate("sales.page.empty_sales_message")}</p>
    </Message>
  )

  const salesList = (
   <CardElement.Group itemsPerRow={2} className={classnames("ui from projects", { loading: loading })}>
      { sales.map(sale => Card({sale: sale}) )}
    </CardElement.Group>
  )

  return (
    <div>
      { sales.length === 0 ? emptyMessage : salesList }
    </div>   
  )
}

List.propTypes = {
  sales: PropTypes.array.isRequired
}
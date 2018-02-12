import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import map from 'lodash/map'
import sumBy from 'lodash/sumBy'
import classnames from 'classnames'

// Localization 
import T from 'i18n-react'

export default function Sale({sale}) {
  return(
    <div>
      <h3 className="ui header">{T.translate("invoices.show.sale.header")}</h3>
      <dl className="dl-horizontal"> 
        <dt>{T.translate("invoices.show.sale.name")}</dt>
        <dd>{sale && <Link to={`/sales/show/${sale._id}`}>{sale.name}</Link>}</dd>
        <dt>{T.translate("invoices.show.sale.deadline")}</dt>
        <dd>{sale && sale.deadline}</dd>
        <dt>{T.translate("invoices.show.sale.status")}</dt>
        <dd>
          { sale && 
            <div className={classnames("ui tiny uppercase label", {blue: sale.status === 'new', orange: sale.status === 'in progress', green: sale.status === 'finished' || sale.status === 'delivered', red: sale.status === 'delayed'})}> 
                  {sale.status}
                </div>
          }
        </dd>
        <dt>{T.translate("invoices.show.sale.description")}</dt>
        <dd>{sale && sale.description ? sale.description : ''}</dd>
      </dl> 

      <h4 className="ui header">{T.translate("invoices.show.sale.items.header")}</h4>
      <table className="ui very basic table invoice sale">
        <thead>
          <tr>
            <th>{T.translate("invoices.show.sale.items.name")}</th>
            <th>{T.translate("invoices.show.sale.items.unit")}</th>
            <th>{T.translate("invoices.show.sale.items.quantity")}</th>
            <th>{T.translate("invoices.show.sale.items.vat")}</th>              
            <th>{T.translate("invoices.show.sale.items.price")}</th>
          </tr>
        </thead>
        <tbody>
          { sale && map(sale.items, (item) => 
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.unit}</td>
              <td>{item.quantity}</td>
              <td>{item.vat}</td>
              <td>{item.price}</td>
            </tr>
          )}
          <tr>
            <td colSpan="4"></td>
            <td><strong>{sale && sumBy(sale.items, 'price')}</strong></td>
          </tr>
        </tbody>  
      </table>
    </div>
  )
}

Sale.propTypes = {
  sale: PropTypes.object.isRequired
}
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import map from 'lodash/map'
import sumBy from 'lodash/sumBy'
import classnames from 'classnames'

// Localization 
import T from 'i18n-react'

import moment from 'moment'

export default function Sale({ sale }) {
  return(
    <div className="ui fluid card">
      <div className="content">
        <div className="left floated">
          <h4 className="ui header">{sale && <Link to={`/sales/show/${sale.id}`}>{sale.name}</Link>}</h4>
        </div>
      </div>
      <div className="content">
        <table className="ui very basic collapsing celled table">
          <tbody>
            <tr>
              <td>
                <i className="ui tiny header">{T.translate("invoices.show.sale.deadline")}</i>
              </td>
              <td>
                {sale && moment(sale.deadline).format("DD/MM/YYYY")}
              </td>
            </tr>
            <tr>
              <td>
                <i className="ui tiny header">{T.translate("invoices.show.sale.status")}</i>
              </td>
              <td>
                { sale && 
                  <div className={classnames("ui tiny uppercase label", {blue: sale.status === 'new', orange: sale.status === 'in progress', green: sale.status === 'finished' || sale.status === 'delivered', red: sale.status === 'delayed'})}> 
                    {sale.status}
                  </div>
                }
              </td>
            </tr>
            <tr>
              <td>
                <i className="ui tiny header">{T.translate("invoices.show.sale.description")}</i>
              </td>
              <td>
                {sale && sale.description ? sale.description : ''}
              </td>
            </tr>
          </tbody>
        </table>

        <h4 className="ui dividing header">{T.translate("invoices.show.sale.items.header")}</h4>
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
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.unit}</td>
                <td>{item.quantity}</td>
                <td>{item.vat}</td>
                <td>{item.price}</td>
              </tr>
            )}
            <tr>
              <td colSpan="3"></td>
              <td className={classnames({blue: sale.status === 'new', orange: sale.status === 'in progress', green: sale.status === 'finished' || sale.status === 'delivered', red: sale.status === 'delayed'})}>
                {T.translate("invoices.show.subtotal")}
              </td>
              <td><strong>{sale && sumBy(sale.items, 'price')}</strong></td>
            </tr>
            <tr>
              <td colSpan="3"></td>
              <td className={classnames({blue: sale.status === 'new', orange: sale.status === 'in progress', green: sale.status === 'finished' || sale.status === 'delivered', red: sale.status === 'delayed'})}>
                {T.translate("invoices.show.tax")}
              </td>
              <td><strong>{(sale && sale.tax) || (sale && sale.tax)}</strong></td>
            </tr>
            <tr>
              <td colSpan="3"></td>
              <td className={classnames({blue: sale.status === 'new', orange: sale.status === 'in progress', green: sale.status === 'finished' || sale.status === 'delivered', red: sale.status === 'delayed'})}>
                <strong>{T.translate("invoices.show.invoice_total")}</strong>
              </td>
              <td>
                <h1 className={classnames("ui header m-0", {blue: sale.status === 'new', orange: sale.status === 'pending', red: sale.status === 'overdue', green: sale.status === 'paid' })}>
                  {sale && sumBy(sale.tasks, 'price')}
                </h1>
              </td>
            </tr>
          </tbody>  
        </table>
      </div>
    </div>
  )
}

Sale.propTypes = {
  sale: PropTypes.object.isRequired
}
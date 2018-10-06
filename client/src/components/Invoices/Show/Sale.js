import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import map from 'lodash/map'
import sumBy from 'lodash/sumBy'
import classnames from 'classnames'
// Semantic UI JS
import { Card, Table, Header, Label } from 'semantic-ui-react'

import GetCurrencySymbol from '../../../utils/currency'

// Localization 
import T from 'i18n-react'

import moment from 'moment'

export default function Sale({ sale, status, tax }) {

  let itemsTotal = sumBy(sale.items, 'total')
  let invoiceTotal = itemsTotal+((tax/100)*itemsTotal)

  return(
    <Card fluid>
      <Card.Content className="p-4">
        <Header as='h3'><Link to={`/sales/show/${sale.id}`}>{sale.name}</Link></Header>
      </Card.Content>
      <Card.Content>
        <Table basic='very' collapsing celled>
          <tbody>
            <tr>
              <td>
                <i className="ui tiny header">{T.translate("invoices.show.sale.deadline")}</i>
              </td>
              <td>
                {moment(sale.deadline).format('ll') }
              </td>
            </tr>
            <tr>
              <td>
                <i className="ui tiny header">{T.translate("invoices.show.sale.status")}</i>
              </td>
              <td>
                <Label size='tiny' className="uppercase" color={sale.status === 'new' && 'blue' || sale.status === 'in progress' && 'orange' || (sale.status === 'finished' || sale.status === 'delivered') && sale.status === 'delayed' && 'red'}> 
                  {sale.status}
                </Label>
              </td>
            </tr>
            <tr>
              <td>
                <i className="ui tiny header">{T.translate("invoices.show.sale.description")}</i>
              </td>
              <td>
                {sale.description ? sale.description : ''}
              </td>
            </tr>
          </tbody>
        </Table>

        <Header as='h4'>{T.translate("invoices.show.sale.items.header")}</Header>
        <Table basic='very' className="invoice sale">
          <thead>
            <tr>
              <th>{T.translate("invoices.show.sale.items.name")}</th>
              <th className="right aligned">{T.translate("invoices.show.sale.items.unit")}</th>
              <th className="right aligned">{T.translate("invoices.show.sale.items.quantity")}</th>
              <th className="right aligned">{T.translate("invoices.show.sale.items.unit_price")}</th>              
              <th className="right aligned">{T.translate("invoices.show.sale.items.total")}</th>
            </tr>
          </thead>
          <tbody>
            { map(sale.items, (item) => 
              <tr key={item.id}>
                <td>{item.name}</td>
                <td className="right aligned">{item.unit}</td>
                <td className="right aligned">{item.quantity}</td>
                <td className="right aligned">{item.unitPrice}</td>
                <td className="right aligned">{item.total}</td>
              </tr>
            )}
            <tr>
              <td colSpan="3"></td>
              <td className={classnames("right aligned", {blue: sale.status === 'new', orange: sale.status === 'in progress', green: sale.status === 'finished' || sale.status === 'delivered', red: sale.status === 'delayed'})}>
                {T.translate("invoices.show.subtotal")}
              </td>
              <td className={classnames("right aligned", {blue: sale.status === 'new', orange: sale.status === 'in progress', green: sale.status === 'finished' || sale.status === 'delivered', red: sale.status === 'delayed'})}>
                <strong>{itemsTotal}</strong>
              </td>
            </tr>
            <tr>
              <td colSpan="3"></td>
              <td className={classnames("right aligned", {blue: sale.status === 'new', orange: sale.status === 'in progress', green: sale.status === 'finished' || sale.status === 'delivered', red: sale.status === 'delayed'})}>
                {T.translate("invoices.show.tax")}
              </td>
              <td className={classnames("right aligned", {blue: sale.status === 'new', orange: sale.status === 'in progress', green: sale.status === 'finished' || sale.status === 'delivered', red: sale.status === 'delayed'})}>
                <strong>{tax}%</strong>
              </td>
            </tr>
            <tr>
              <td colSpan="3"></td>
              <td className={classnames("right aligned", {blue: status === 'new', orange: status === 'pending', red: status === 'overdue', green: status === 'paid'})}>
                <strong>{T.translate("invoices.show.invoice_total")}</strong>
              </td>
              <td>
                <Header as='h1' textAlign='right' className={classnames("m-0", {blue: status === 'new', orange: status === 'pending', red: status === 'overdue', green: status === 'paid'})}>
                  <GetCurrencySymbol />{invoiceTotal}
                </Header>
              </td>
            </tr>
          </tbody>  
        </Table>
      </Card.Content>
    </Card>
  )
}

Sale.propTypes = {
  sale: PropTypes.object.isRequired
}
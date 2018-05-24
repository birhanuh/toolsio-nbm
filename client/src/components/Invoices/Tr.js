import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

import moment from 'moment'

// Localization 
import T from 'i18n-react'

export default function Tr({ invoice }) {
  
  return (
    <tr>
      <td>
        {invoice.project &&
          <Link to={`/invoices/show/${invoice.id}`} className={classnames("ui", {blue: invoice.status === 'new', orange: invoice.status === 'pending', red: invoice.status === 'overdue', green: invoice.status === 'paid' })}>
            {T.translate("invoices.page.invoice_for")}&nbsp;({invoice.project.name})
          </Link>
        }
        {invoice.sale &&
          <Link to={`/invoices/show/${invoice.id}`} className={classnames("ui", {blue: invoice.status === 'new', orange: invoice.status === 'pending', red: invoice.status === 'overdue', green: invoice.status === 'paid' })}>
            {T.translate("invoices.page.invoice_for")}&nbsp;({invoice.sale.name})
          </Link>
        }
      </td>
      <td>{moment(invoice.deadline).format('ll') }</td>
      <td>{invoice.customer.name}</td>
      <td>{invoice.total}</td>
      <td>
        <div className={classnames("ui tiny uppercase label", {blue: invoice.status === 'new', orange: invoice.status === 'pending', red: invoice.status === 'overdue', green: invoice.status === 'paid' })}>
          {invoice.status}
        </div>  
      </td>
      <td>
        <div className="ui small buttons">
          <Link to={`/invoices/edit/${invoice.id}`} className="ui icon basic button green"><i className="edit icon"></i></Link>
          <Link to={`/invoices/show/${invoice.id}`} className="ui icon basic blue button"><i className="unhide icon"></i></Link>
        </div>
      </td>
    </tr>
  )
}

Tr.propTypes = {
  invoice: PropTypes.object.isRequired
}
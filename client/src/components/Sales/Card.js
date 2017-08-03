import React from 'react'
import classnames from 'classnames'
import { Link } from 'react-router-dom'

// Localization 
import T from 'i18n-react'

export default function Card({sale}) {
  
  return (
    <div className="eight wide column">
      <div className="ui segment">
        <div className="ui clearing segment transparent">
         <div className={classnames("ui right floated uppercase label", {blue: sale.status === 'new', orange: sale.status === 'on going', red: sale.status === 'delayed', green: sale.status === 'delivered'})}>
            {sale.status}
          </div>
          
          <Link to={`/sales/show/${sale._id}`} className="ui left floated header">
            <h4 className={classnames("ui header", {blue: sale.status === 'new', orange: sale.status === 'on going', red: sale.status === 'delayed', green: sale.status === 'delivered'})}>
              {sale.name}
            </h4>
          </Link>
        </div>

        <p className="m-t-m">{sale.description}</p>

        <table className="ui very basic center aligned table sale">
          <thead>
            <tr>
              <th>{T.translate("sales.show.user")}</th>
              <th>{T.translate("sales.index.deadline")}</th>
              <th>{T.translate("sales.index.customer")}</th>
              <th>{T.translate("sales.index.invoiced")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John</td>
              <td>{sale.deadline}</td>
              <td>{sale.customer.name}</td>
              <td>
                <i className={classnames("check circle outline icon", {blue: sale.status === 'new', orange: sale.status === 'on going', red: sale.status === 'delayed', green: sale.status === 'delivered'})}></i>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  )
}

Card.propTypes = {
  sale: React.PropTypes.object.isRequired
}
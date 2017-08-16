import React from 'react'
import classnames from 'classnames'
import { Link } from 'react-router-dom'

// Localization 
import T from 'i18n-react'

export default function Card({sale}) {
  
  return (
    <div className="card">
      <div className="content">        
        <div className={classnames("ui uppercase tiny right ribbon label", {blue: sale.status === 'new', orange: sale.status === 'on going', red: sale.status === 'delayed', green: sale.status === 'delivered'})}>
          {sale.status}
        </div>
        
        <Link to={`/sales/show/${sale._id}`} className="ui header">
          <h3 className={classnames({blue: sale.status === 'new', orange: sale.status === 'on going', red: sale.status === 'delayed', green: sale.status === 'delivered'})}>
            {sale.name}
          </h3>
        </Link>
  
        <div className="description">{sale.description}</div>

        <table className="ui very basic center aligned table sales">
          <thead>
            <tr>
              <th>{T.translate("sales.show.user")}</th>
              <th>{T.translate("sales.page.deadline")}</th>
              <th>{T.translate("sales.page.customer")}</th>
              <th>{T.translate("sales.page.invoiced")}</th>
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
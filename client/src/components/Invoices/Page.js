import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

// Localization 
import T from 'i18n-react'

class Page extends Component {

  render() {
    return (

      <div className="row column">  
        <div className="ui vertical segment">
          <Link className="ui primary button" to="/invoices/new">
            <i className="add circle icon"></i>
            {T.translate("invoices.page.create_new_invoice")}
          </Link>
        </div>  

        {/*<List invoices={this.props.invoices} deleteCustomer={deleteCustomer} />   */}
      </div>  

    )

  }
}

export default Page
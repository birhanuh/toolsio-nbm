import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Table from './Table' 
import { graphql} from 'react-apollo'
import { GET_INVOICES_QUERY } from '../../graphql/invoices'

// Localization 
import T from 'i18n-react'

import Breadcrumb from '../Layouts/Breadcrumb'

class Page extends Component {

  componentDidMount() {
    
  }
  
  render() {

    const { getInvoices } = this.props.data

    return (

      <div className="row column">  

        <Breadcrumb />
        
        <div className="ui vertical segment">
          <Link className="ui primary button" to="/invoices/new">
            <i className="add circle icon"></i>
            {T.translate("invoices.page.create_new_invoice")}
          </Link>
        </div>  

        <div className="ui segment">
          <div className="ui clearing segment basic segment pl-0 pr-0">
            <div className="ui right floated input">
              <div className="ui icon input">
                <i className="search icon"></i>
                <input type="text" placeholder="Search..." />
              </div>
            </div>
            <div className="ui left floated select">
              <select className="ui dropdown">
                <option value="10" default>10</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>

          { getInvoices && <Table invoices={getInvoices} /> } 

          <div className="ui clearing segment basic segment p-0">
            <div className="ui right floated button">            
              <p>Pagination...</p>
            </div>
          </div>

        </div>

      </div>  
    )

  }
}

export default graphql(GET_INVOICES_QUERY)(Page)

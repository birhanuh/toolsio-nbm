import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Table from './Table' 
import { graphql} from 'react-apollo'
import { GET_INVOICES_QUERY } from '../../graphql/invoices'
import { Pagination } from '../../utils'

// Localization 
import T from 'i18n-react'

class Page extends Component {
  
  render() {
    const { params } = this.props.match
    let offset = params.offset ? parseInt(params.offset) : 0
    let limit = params.limit ? parseInt(params.limit) : 10

    const { getInvoices } = this.props.data

    return (
      <div className="row column">          
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

          { getInvoices && <Table invoices={getInvoices.invoices} /> } 

          <div className="ui left aligned clearing basic segment">        
            { getInvoices && <Pagination path="invoices" count={getInvoices.count} offset={offset} limit={limit} /> } 
          </div>
        </div>
      </div>  
    )
  }
}

export default graphql(GET_INVOICES_QUERY, {
    options: (props) => ({
      variables: {
        order: props.match.params.order ? props.match.params.order.toUpperCase() : 'DESC',
        offset: props.match.params.offset ? parseInt(props.match.params.offset) : 0,
        limit: props.match.params.limit ? parseInt(props.match.params.limit) : 10
      }
    })
  })(Page)

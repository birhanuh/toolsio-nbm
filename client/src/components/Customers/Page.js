import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Table from './Table' 
import { graphql} from 'react-apollo'
import { GET_CUSTOMERS_QUERY } from '../../graphql/customers'
import { Pagination } from '../../utils'

// Localization 
import T from 'i18n-react'

class Page extends Component {

  render() {
    const { params } = this.props.match
    let offset = params.offset ? parseInt(params.offset) : 0
    let limit = params.limit ? parseInt(params.limit) : 10
    const { getCustomers } = this.props.data
   
    return (
      <div className="row column">  
        <div className="sixteen wide column">
          <div className="ui vertical segment">
            <Link className="ui primary button" to="/customers/new">
              <i className="add circle icon"></i>
              {T.translate("customers.page.add_new_customer")}
            </Link>
          </div>  
          
          <div className="ui clearing segment">
            <div className="ui right floated vertical segment">
              <div className="ui icon input">
                <i className="search icon"></i>
                <input type="text" placeholder="Search..." />
              </div>
            </div>
            <div className="ui left floated vertical segment border-bottom-none">
              <select className="ui dropdown">
                <option value="10" default>10</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>

            { getCustomers && <Table customers={getCustomers.customers} /> }

            <div className="ui left aligned clearing basic segment">        
              { getCustomers && <Pagination path="customers" count={getCustomers.count} offset={offset} limit={limit} /> } 
            </div>
          </div>  
        </div>
      </div>  
    )
  }
}

export default graphql(GET_CUSTOMERS_QUERY, {
    options: (props) => ({
      variables: {
        order: props.match.params.order ? props.match.params.order.toUpperCase() : 'DESC',
        offset: props.match.params.offset ? parseInt(props.match.params.offset) : 0,
        limit: props.match.params.limit ? parseInt(props.match.params.limit) : 10
      }
    })
  })(Page)

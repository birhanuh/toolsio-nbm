import React, { Component } from 'react'
import { Link } from 'react-router-dom'
// Semantic UI JS
import { Select } from 'semantic-ui-react'
import { graphql} from 'react-apollo'
import { GET_CUSTOMERS_QUERY } from '../../graphql/customers'

import Table from './Table' 

// Localization 
import T from 'i18n-react'

class Page extends Component {

  handleLimitSelectionChange = (name, value) => {
    console.log('limit: ', value)
  }

  render() {
    const { params } = this.props.match
    let offset = params.offset ? parseInt(params.offset) : 0
    let limit = params.limit ? parseInt(params.limit) : 10
    const { getCustomers } = this.props.data
   
    return (
      <div className="row column">  
        <div className="sixteen wide column">
          <div className="ui vertical segment pl-0 pr-0">
            <Link className="ui primary button" to="/customers/new">
              <i className="add circle icon"></i>
              {T.translate("customers.page.add_new_customer")}
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
                <Select
                  name="limit"
                  value="10" 
                  onChange={(e, {value}) => this.handleLimitSelectChange('limit', value)} 
                  options={[
                    { key: "default", value: "10", text: '10' },
                    { key: "50", value: "50", text: '50' },
                    { key: "100", value: "100", text: '100' },
                    { key: "500", value: "500", text: '500' }
                  ]}
                  selection
                  compact
                />
              </div>
            </div>

            { getCustomers && <Table getCustomers={getCustomers} offset={offset} limit={limit} /> }

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

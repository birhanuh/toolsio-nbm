import React, { Component } from 'react'
import { Link } from 'react-router-dom'
// Semantic UI JS
import { Grid, Select, Input, Icon, Segment } from 'semantic-ui-react'
import { graphql} from 'react-apollo'
import { GET_CUSTOMERS_QUERY } from '../../graphql/customers'

import Table from './Table' 

// Localization 
import T from 'i18n-react'

class Page extends Component {

  state = { name: "", limit: this.props.match.params.limit ? parseInt(this.props.match.params.limit) : 10 }

  handleChange = (name, value) => {
    this.setState({
      [name]: value
    })

    if (name === 'limit') {
      this.props.data.fetchMore({
        variables: {
          limit: value
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev
           
          return Object.assign({}, prev, {
            getCustomers: fetchMoreResult.getCustomers
          })
        }
      })
    }
  }

  handleSearch = () => {
    this.props.data.fetchMore({
      variables: {
        name: this.state.name
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev
         
        return Object.assign({}, prev, {
          getCustomers: fetchMoreResult.getCustomers
        })
      }
    })
  }

  render() {
    const { limit } = this.state
    const { params } = this.props.match

    let offset = params.offset ? parseInt(params.offset) : 0

    const { getCustomers } = this.props.data
    
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Segment vertical className="p-0 mb-5">
            <Link className="ui primary button" to="/customers/new">
              <Icon name="add circle" />
              {T.translate("customers.page.add_new_customer")}
            </Link>
          </Segment>  
          
          <Segment>
            <Segment clearing basic className="pl-0 pr-0">
              <div className="ui right floated input">
                <div className="ui icon input">
                  <Input name="name" value={this.state.name} onChange={(e, {value}) => this.handleChange('name', value)} 
                    icon={<Icon name='search' inverted circular link onClick={this.handleSearch} />} placeholder={T.translate("customers.page.search")} />
                </div>
              </div>
              <div className="ui left floated select">
                <Select
                  name="limit"
                  value={limit.toString()} 
                  onChange={(e, {value}) => this.handleChange('limit', value)} 
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
            </Segment>

            { getCustomers && <Table customers={getCustomers.customers} count={getCustomers.count} offset={offset} limit={limit} /> }

          </Segment>  
        </Grid.Column>
      </Grid.Row>   
    )
  }
}

export default graphql(GET_CUSTOMERS_QUERY, {
    options: (props) => ({
      variables: {
        order: props.match.params.order ? props.match.params.order.toUpperCase() : 'DESC',
        offset: props.match.params.offset ? parseInt(props.match.params.offset) : 0,
        limit: props.match.params.limit ? parseInt(props.match.params.limit) : 10,
        name: ""
      },
      fetchPolicy: 'cache-network-only'
    })
  })(Page)

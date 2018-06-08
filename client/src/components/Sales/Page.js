import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Input, Button, Icon } from 'semantic-ui-react'
import List from './List' 
import { Query } from 'react-apollo'
import { GET_SALES_QUERY } from '../../graphql/sales'

// Localization 
import T from 'i18n-react'

class Page extends Component {

  state = { name: "" }

  handleChange = (name, value) => {
    this.setState({
      [name]: value
    })
  }

  render() {
    return (
      <Query 
        query={GET_SALES_QUERY}
        variables={{
          order: "DESC",
          offset: 0,
          limit: 10,
          name: ""
        }}
        fetchPolicy="cache-and-network">  
        {( { loading, data, fetchMore } ) => {

          const { getSales } = data

          return ( 
            <div className="row column"> 
              <div className="sixteen wide column">
                <div className="ui clearing basic segment pl-0 pr-0">
                  <div className="ui right floated icon input">
                    <Input name="name" value={this.state.name} onChange={(e, {value}) => this.handleChange('name', value)} 
                      icon={<Icon name='search' inverted circular link onClick={() => {
                        fetchMore({
                          variables: {
                            name: this.state.name
                          },
                          updateQuery: (prev, { fetchMoreResult }) => {
                            if (!fetchMoreResult) return prev
                            return Object.assign({}, prev, {
                              getSales: fetchMoreResult.getSales
                            })
                          }
                        })
                      }} />} placeholder='Search...' />
                  </div>

                  <Link className="ui left floated primary button" to="/sales/new">
                    <i className="add circle icon"></i>
                    {T.translate("sales.page.create_new_sale")}
                  </Link>   
                </div> 
                      
                { getSales && <List sales={getSales} loading={loading} /> }             

                <div className="ui center aligned basic segment">           
                  <Button 
                    primary
                    size="large"
                    onClick={() =>
                      fetchMore({
                        variables: {
                          offset: data.getSales.length
                        },
                        updateQuery: (prev, { fetchMoreResult }) => {
                          if (!fetchMoreResult) return prev
                          return Object.assign({}, prev, {
                            getSales: [...prev.getSales, ...fetchMoreResult.getSales]
                          })
                        }
                      })
                    }
                  >    
                    <Icon name='refresh' />&nbsp;
                    {T.translate("sales.page.load_more")}
                  </Button>
                </div>  
              </div>
            </div>  
          )
        }}
      </Query>)
  }
}

export default Page

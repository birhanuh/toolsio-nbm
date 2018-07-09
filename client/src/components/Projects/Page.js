import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Input, Button, Icon } from 'semantic-ui-react'
import List from './List' 
import { Query } from 'react-apollo'
import { GET_PROJECTS_QUERY } from '../../graphql/projects'

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
        query={GET_PROJECTS_QUERY}
        variables={{
          order: "DESC",
          offset: 0,
          limit: 10,
          name: ""
        }}
        fetchPolicy="cache-and-network">  
        {( { loading, data, fetchMore } ) => {
         
          const { getProjects } = data

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
                              getProjects: fetchMoreResult.getProjects
                            })
                          }
                        })
                      }} />} placeholder={T.translate("projects.page.search")} />
                  </div>

                  <Link className="ui left floated primary button" to="/projects/new">
                    <i className="add circle icon"></i>
                    {T.translate("projects.page.create_new_project")}
                  </Link>   
                </div> 

                { getProjects && <List projects={getProjects} loading={loading} /> }             

                <div className="ui center aligned basic segment">   

                  { getProjects && getProjects.length >= 5 &&        
                    <Button 
                      primary
                      size="large"
                       onClick={() =>
                        fetchMore({
                          variables: {
                            offset: data.getProjects.length
                          },
                          updateQuery: (prev, { fetchMoreResult }) => {
                            if (!fetchMoreResult) return prev
                            return Object.assign({}, prev, {
                              getProjects: [...prev.getProjects, ...fetchMoreResult.getProjects]
                            })
                          }
                        })
                      }
                    >    
                      <Icon name='refresh' />&nbsp;
                      {T.translate("projects.page.load_more")}
                    </Button>
                  }
                </div>  
              </div>
            </div>  
          )
        }}
      </Query>)
    }
}
export default Page

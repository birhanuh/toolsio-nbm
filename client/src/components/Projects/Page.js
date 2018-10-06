import React, { Component } from 'react'
import { Link } from 'react-router-dom'
// Semantic React UI
import { Grid, Segment, Input, Button, Icon } from 'semantic-ui-react'
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
            <Grid.Row>
              <Grid.Column width={16}>
                <Segment clearing basic className="p-0 mb-5">
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
                    <Icon name="add circle" />
                    {T.translate("projects.page.create_new_project")}
                  </Link>   
                </Segment> 

                { getProjects && <List projects={getProjects} loading={loading} /> }             

                <Segment basic textAlign='center'>   

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
                </Segment>  
              </Grid.Column>
            </Grid.Row>  
          )
        }}
      </Query>)
    }
}
export default Page

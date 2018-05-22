import React from 'react'
import { Link } from 'react-router-dom'
import List from './List' 
import { Query } from 'react-apollo'
import { GET_PROJECTS_QUERY } from '../../graphql/projects'

// Localization 
import T from 'i18n-react'

const Page = () => (
  <Query 
    query={GET_PROJECTS_QUERY}
    variables={{
      order: "DESC",
      offset: 0,
      limit: 10
    }}
    fetchPolicy="cache-and-network">  
    {( { loading, data, fetchMore } ) => {

      const { getProjects } = data

      return ( 
        <div className="row column"> 
          <div className="sixteen wide column">
            <div className="ui clearing basic segment pl-0 pr-0">
              <div className="ui right floated icon input">
                <input type="text" placeholder="Search..." />
                <i className="inverted circular search link icon"></i>
              </div>

              <Link className="ui left floated primary button" to="/projects/new">
                <i className="add circle icon"></i>
                {T.translate("projects.page.create_new_project")}
              </Link>   
            </div> 

            { getProjects && <List projects={getProjects} loading={loading} /> }             

            <div className="ui center aligned basic segment">           
              <button className="ui primary large button" onClick={() =>
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
                }>    
                <i className="sync alternate icon"></i>
                {T.translate("projects.page.load_more_button")}
              </button>
            </div>  
          </div>
        </div>  
      )
    }}
  </Query>
  )

export default Page

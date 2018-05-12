import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import List from './List' 
import { Query, graphql } from 'react-apollo'
import { GET_PROJECTS_QUERY } from '../../graphql/projects'

// Localization 
import T from 'i18n-react'

import Breadcrumb from '../Layouts/Breadcrumb'

const Page = ({ match }) => (
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

          <Breadcrumb />   

          <div className="ui clearing basic segment p-0">
            <div className="ui right floated icon input">
              <input type="text" placeholder="Search..." />
              <i className="inverted circular search link icon"></i>
            </div>

            <Link className="ui left floated primary button" to="/projects/new">
              <i className="add circle icon"></i>
              {T.translate("projects.page.create_new_project")}
            </Link>   
          </div> 

          <div className={classnames("row column", { loading: loading })}>                   
            { getProjects && <List projects={getProjects} /> }             
          </div>   

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
      )
    }}
  </Query>
  )

export default Page

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import List from './List' 
import { Pagination } from '../../utils'
import { graphql } from 'react-apollo'
import { GET_PROJECTS_QUERY } from '../../queries/projectQueriesMutations'

// Localization 
import T from 'i18n-react'

import Breadcrumb from '../Layouts/Breadcrumb'

class Page extends Component {

  constructor(props) {
    super(props)
    this.state = {
      offset: 0,
      length: 10
    }
  }

  componentDidMount() {

    const { offset, length } = this.state
    
    const { match } = this.props

    // if (!!match.params.offset) {   
    //   this.props.fetchProjects(match.params.offset, match.params.length)
    // } else {
    //   this.props.fetchProjects(offset, length)
    // }

  }

  render() {

    const { length } = this.state

    const { match } = this.props
    const { getProjects } = this.props.data

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
        
        <div className="row column">     
          { getProjects && <List projects={getProjects} /> }
        </div>    

        <div className="ui clearing vertical segment border-bottom-none">
         
          {/*<Pagination path="projects" pages={getProjects.pages} match={match} length={length} /> */}          
           
        </div>   
      </div>   
    )
  }
}

export default graphql(GET_PROJECTS_QUERY)(Page)

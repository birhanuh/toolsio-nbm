import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import List from './List' 
import { Pagination } from '../../utils'
import { connect } from 'react-redux'
import { fetchProjects } from '../../actions/projectActions'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

// Localization 
import T from 'i18n-react'

import Breadcrumb from '../Layouts/Breadcrumb'

class Page extends Component {

  constructor(props) {
    super(props)
    this.state = {
      start: 0,
      length: 10
    }
  }

  componentDidMount() {

    const { start, length } = this.state
    
    const { match } = this.props

    // if (!!match.params.start) {   
    //   this.props.fetchProjects(match.params.start, match.params.length)
    // } else {
    //   this.props.fetchProjects(start, length)
    // }

  }

  render() {

    const { length } = this.state

    const { match } = this.props
    const { getProjects } = this.props.data

    return (
      <div className="row column"> 

        <Breadcrumb />

        <div className="ui clearing vertical segment border-bottom-none">
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

const getProjectsQuery = gql`
  {
    getProjects {
      id
      name 
      deadline
      status
      progress
      description
      customer {
        name
      }
      user {
        firstName
      }
    }
  }
`

export default graphql(getProjectsQuery)(Page)

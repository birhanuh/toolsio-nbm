import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import List from './List' 
import { connect } from 'react-redux'
import { fetchProjects } from '../../actions/projectActions'

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

    const { start, length} = this.state
    
    const { match } = this.props

    if (!!match.params.start) {   
      this.props.fetchProjects(match.params.start, match.params.length)
    } else {
      this.props.fetchProjects(start, length)
    }

  }

  render() {

    const { length } = this.state

    const { projects, match } = this.props
    
    let currentPage = 0
    let start = (match && match.params && match.params.start) ? match.params.start : 0
    
    if (projects && projects.pages) {
      if ((start/length) < (parseInt(projects.pages)-5)) {
        currentPage = (match && match.params && match.params.start) ? Math.ceil(match.params.start/match.params.length) + 1 : 1
      } else {
        currentPage = projects && projects.pages && parseInt(projects.pages)-4
      }  
    }

    // Active page
    let activePage = (match && match.params && match.params.start) ? Math.ceil(match.params.start/match.params.length) + 1 : 1
    
    // Prevoius link
    let previousLink 

    if (currentPage && currentPage === 1 || currentPage < 0) {
      previousLink = (<div className="item disabled">
          <i className="angle left icon"></i>
        </div>)
    } else {
      previousLink = (<Link to={currentPage && currentPage === 1 ? `/projects/${parseInt(start)}/${length}` : `/projects/${parseInt(start)-10}/${length}`} className={classnames("item", {disabled: currentPage && currentPage === 1 || currentPage < 0 })} >
          <i className="angle left icon"></i>
        </Link>)
    }

    // Next link
    let nextLink 

    if (currentPage && currentPage+4 === projects.pages) {      
      nextLink = (<div className="item disabled">
        <i className="angle right icon"></i>
      </div>)
    } else {
      nextLink = (<Link to={!!match ? `/projects/${50}/${length}` : (currentPage && currentPage+4 === (projects.pages) ? `/projects/${parseInt(match.params.start)}/${length}` : `/projects/${parseInt(match.params.start)+10}/${length}`)} className={classnames("item", {disabled: currentPage && currentPage+4 === projects.pages})}>
          <i className="angle right icon"></i>
      </Link>)
    }
   
    let paginationElement = (
      <div className="ui right floated pagination menu">
        {previousLink}
        { currentPage > 0 &&
          <Link to={`/projects/${((currentPage)*10)-10}/${length}`} className={classnames("item", {active: activePage === currentPage})}>
            {currentPage}
          </Link>
        }
        {currentPage+1 > 0 &&
          <Link to={`/projects/${((currentPage+1)*10)-10}/${length}`} className={classnames("item", {active: activePage === currentPage+1})}>
            {currentPage+1}
          </Link>
        }
        {currentPage+2 > 0 &&
          <Link to={`/projects/${((currentPage+2)*10)-10}/${length}`} className={classnames("item", {active: activePage === currentPage+2})}>
            {currentPage+2}
          </Link>
        }
        {currentPage+3 > 0 &&
          <Link to={`/projects/${((currentPage+3)*10)-10}/${length}`} className={classnames("item", {active: activePage === currentPage+3})}>
            {currentPage+3}
          </Link>
        }
        <Link to={`/projects/${((currentPage+4)*10)-10}/${length}`} className={classnames("item 4", {active: activePage === currentPage+4})}>
          {currentPage+4}
        </Link>
        {nextLink}
      </div>
      )

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
          { projects && projects.list && <List projects={this.props.projects.list} /> }
        </div>    

        <div className="ui clearing vertical segment border-bottom-none">
         
          { paginationElement }            
           
        </div>   
      </div>   
    )
  }
}

Page.propTypes = {
  fetchProjects: PropTypes.func.isRequired
}

function mapSateToProps(state) {
  return {
    projects: state.projects
  }
}

export default connect(mapSateToProps, { fetchProjects })(Page)

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
      length: 10,
      total: this.props.projects ? this.props.projects.total : 0,
      pageNumbers: {
        first: 1,
        second: 2,
        third: 3,
        fourth: 4,
        fifth: 5
      }
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.projects) {
      this.setState({
        total: nextProps.projects.total
      })
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

  handlePrevious = (event) => {
    event.preventDefault()

    const { pageNumbers } = this.state
    
    if (pageNumbers.first > 1) {
      pageNumbers && this.setState({
        pageNumbers: {...pageNumbers, first: pageNumbers.first-1, second: pageNumbers.second-1, third: pageNumbers.third-1, fourth: pageNumbers.fourth-1, fifth: pageNumbers.fifth-1}
      })    
    }
  }

  handleNext = (event) => {
    event.preventDefault()

    const { length, total, pageNumbers } = this.state
    
    if (pageNumbers.fifth < (total/length)) {
      pageNumbers && this.setState({
        pageNumbers: {...pageNumbers, first: pageNumbers.first+1, second: pageNumbers.second+1, third: pageNumbers.third+1, fourth: pageNumbers.fourth+1, fifth: pageNumbers.fifth+1}
      })
    }
  }

  render() {

    const { start, length, total, pageNumbers } = this.state

    const { projects, match } = this.props
    
    let currentPage = Math.ceil(match.params.start/match.params.length) + 1

    let paginationElement = (
      <div className="ui right floated pagination menu">
        <a className={classnames("item", {disabled: pageNumbers.first === 1 })} onClick={this.handlePrevious.bind(this)}>
          <i className="angle left icon"></i>
        </a>
        <Link to={`/projects/${start}/${length}`} className={classnames("item", {active: currentPage === pageNumbers.first})}>
          {pageNumbers.first}
        </Link>
        <Link to={`/projects/${start+10}/${length}`} className={classnames("item", {active: currentPage === pageNumbers.second})}>
          {pageNumbers.second}
        </Link>
        <Link to={`/projects/${start+20}/${length}`} className={classnames("item", {active: currentPage === pageNumbers.third})}>
          {pageNumbers.third}
        </Link>
        <Link to={`/projects/${start+30}/${length}`} className={classnames("item", {active: currentPage === pageNumbers.fourth})}>
          {pageNumbers.fourth}
        </Link>
         <Link to={`/projects/${start+40}/${length}`} className={classnames("item", {active: currentPage === pageNumbers.fifth})}>
          {pageNumbers.fifth}
        </Link>
        <a className={classnames("item", {disabled: pageNumbers.fifth === (total/length)})} onClick={this.handleNext.bind(this)}>
          <i className="angle right icon"></i>
        </a>
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

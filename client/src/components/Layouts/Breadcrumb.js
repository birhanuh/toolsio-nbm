import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

// Localization 
import T from 'i18n-react'

export default function Breadcrumb(props, context) {

  const currentPage = context.router.history.location.pathname
  let currentPageTitle
  let currentPageDescription

  switch(true) {
    case currentPage.includes('/dashboard'): 
      currentPageTitle = "dashboard.header"
      currentPageDescription = "dashboard.description"
      break
    case currentPage.includes('/customers'): 
      currentPageTitle = "customers.page.header"
      currentPageDescription = "customers.page.description"
      break
    case currentPage.includes('/projects'): 
      currentPageTitle = "projects.page.header"
      currentPageDescription = "projects.page.description"
      break
    case currentPage.includes('/sales'): 
      currentPageTitle = "sales.page.header"
      currentPageDescription = "sales.page.description"
      break  
    case currentPage.includes('/invoices'): 
      currentPageTitle = "invoices.page.header"
      currentPageDescription = "invoices.page.description"
      break
    case currentPage.includes('/conversations'): 
      currentPageTitle = "conversations.page.header"
      currentPageDescription = "conversations.page.description"
      break
    case currentPage.includes('/settings'): 
      currentPageTitle = "settings.header"
      currentPageDescription = "settings.description"
      break
    case currentPage.includes('/users'): 
      currentPageTitle = "users.header"
      currentPageDescription = "users.description"
      break
    default:
      currentPageTitle = "No page title"
      currentPageDescription = "No page description"
  }

  let tokens = context.router.history.location.pathname.split('/')
  
  var hasNumber = /\d/
  let filterdTokens = tokens.filter(val => val !== "" && !hasNumber.test(val))
  
  const breadcrumbSections = filterdTokens.map((token, index) => {
    return (
    
      index+1 === filterdTokens.length ? <div key={index} className="section">{token}</div> : <div key={index}>
        <Link to={`/${token}`} className="active section">{token}</Link>
        <div className="divider"> / </div></div>
      )
    })

  return(

    <div className="ui fixed menu header-breadcrumb">          
      <div className="left menu">
        <div className="item">
          <h2 className="ui header">{T.translate(""+currentPageTitle+"")}
            <div className="sub header">{T.translate(""+currentPageDescription+"")}</div>
          </h2>
        </div>              
      </div>
      <div className="right menu">
        <div className="item">
          
          <div className="ui breadcrumb">
            { breadcrumbSections }  
          </div>

        </div>
      </div>
    </div>
    ) 
}

Breadcrumb.contextTypes = {
  router: PropTypes.object.isRequired
}


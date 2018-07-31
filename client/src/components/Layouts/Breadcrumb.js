import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
// Semantic UI Form elements
import { Menu, Header, Breadcrumb as BreadcrumbElement } from 'semantic-ui-react'

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
      currentPageTitle = "users.page.header"
      currentPageDescription = "users.page.description"
      break
    case currentPage.includes('/events'): 
      currentPageTitle = "events.page.header"
      currentPageDescription = "events.page.description"
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
    
      index+1 === filterdTokens.length ? <BreadcrumbElement.Section key={index}>{token}</BreadcrumbElement.Section> : <BreadcrumbElement.Section key={index} active>
        <Link to={`/${token}`}>{token}</Link>
        <BreadcrumbElement.Divider /></BreadcrumbElement.Section>
      )})

  return (
    <Menu fixed='top' className="header-breadcrumb">          
      <Menu.Menu position='left'>
        <Menu.Item>
          <Header as='h2'>{T.translate(""+currentPageTitle+"")}
            <Header.Subheader>{T.translate(""+currentPageDescription+"")}</Header.Subheader>
          </Header>
        </Menu.Item>              
      </Menu.Menu>
      <Menu.Menu position='right'>
        <Menu.Item>
      
          <BreadcrumbElement>
            { breadcrumbSections }  
          </BreadcrumbElement>

        </Menu.Item>
      </Menu.Menu>
    </Menu>
    ) 
}

Breadcrumb.contextTypes = {
  router: PropTypes.object.isRequired
}


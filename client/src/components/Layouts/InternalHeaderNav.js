import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import decode from 'jwt-decode'
// Semantic UI Form elements
import { Image, Dropdown, Menu, Label, Icon } from 'semantic-ui-react'
import { graphql, compose } from 'react-apollo'
import { GET_PROJECT_TASKS_DATA_QUERY, GET_SALE_TASKS_DATA_QUERY, GET_INVOICE_TASKS_DATA_QUERY, GET_UNREAD_DIRECT_MESSAGES_COUNT_QUERY } from '../../graphql/headerNav'

// Localization 
import T from 'i18n-react'

// Images
import logoInverted from '../../images/logo-inverted.png'
import avatarPlaceholderSmall from '../../images/avatar-placeholder-small.png'

/* jQuery */
import $ from 'jquery'
$.animate = require('jquery.easing')

class InternalHeaderNav extends Component {

  clickHandler = (e) => { 
    if (this.dashboardOrRoot()) {
      e.preventDefault()
    }

    var $anchor = $(e.target)
    $('html, body').stop().animate({
        scrollTop: $($anchor.attr('href')).offset().top - 50
    }, 1500, 'easeInOutExpo')    
  }

  dashboardOrRoot = () => {
    return (window.location.pathname.indexOf('/') === 0 && window.location.pathname.indexOf('/dashboard') === 0)
  }

  render() {    
    let currentUser = this.props.currentUser
    console.log("currentUser: ", currentUser)
    // const authToken = localStorage.getItem('authToken')   

    // if (authToken) {
    //   const { user } = decode(authToken)

    //   currentUser = user ? user : null
    // }   

    const { getUnreadDirectMessagesCount } = this.props.data
    let count = getUnreadDirectMessagesCount && getUnreadDirectMessagesCount.count 

    // Count unread messages
    const unreadMessagesCount = (T.translate("internal_navigation.unread_messages", {unread_messages_number: count}))

    const { getProjectTasksDataQuery: { getProjectTasksData }, getSaleTasksDataQuery: 
      { getSaleTasksData}, getInvoiceTasksDataQuery: { getInvoiceTasksData} } = this.props

    // Count notificaitions
    let countNotifications = 0

    const projectData = getProjectTasksData && getProjectTasksData.countStatus.map(item => {
      if (item.status === 'delayed') {
        countNotifications += item.count

        return(<Dropdown.Item as={Link} key={item.status} onClick={this.clickHandler} to={this.dashboardOrRoot() ? "#projectTask" : "/dashboard/#projectTask"}>
          <Label color="red">{item.count} DELAYED</Label> 
          Projects
        </Dropdown.Item>)              
      }
      if (item.status === 'new') {
        countNotifications += item.count

        return(<Dropdown.Item as={Link} key={item.status} onClick={this.clickHandler} to={this.dashboardOrRoot() ? "#projectTask" : "/dashboard/#projectTask"}>
          <Label color="blue">{item.count} NEW</Label> 
          Projects
        </Dropdown.Item>)
      }
    })
  
    const saleData = getSaleTasksData && getSaleTasksData.countStatus.map(item => {
      if (item.status === 'delayed') {
        countNotifications += item.count

        return(<Dropdown.Item as={Link} key={item.status} onClick={this.clickHandler} to={this.dashboardOrRoot() ? "#saleTask" : "/dashboard/#saleTask"}>
          <Label color="red">{item.count} DELAYED</Label> 
          Sales
        </Dropdown.Item>)              
      }
      if (item.status === 'new') {
        countNotifications += item.count

        return(<Dropdown.Item as={Link} key={item.status} onClick={this.clickHandler} to={this.dashboardOrRoot() ? "#saleTask" : "/dashboard/#saleTask"}>
          <Label color="blue">{item.count} NEW</Label> 
          Sales
        </Dropdown.Item>)
      }
    })

    const invoiceData = getInvoiceTasksData && getInvoiceTasksData.countStatus.map(item => {
      if (item.status === 'delayed') {
        countNotifications += item.count

        return(<Dropdown.Item as={Link} key={item.status} onClick={this.clickHandler} to={this.dashboardOrRoot() ? "#invoiceTask" : "/dashboard/#invoiceTask"}>
          <Label color="red">{item.count} DELAYED</Label> 
          Invoices
        </Dropdown.Item>)              
      }
      if (item.status === 'pending') {
        countNotifications += item.count

        return(<Dropdown.Item as={Link} key={item.status} onClick={this.clickHandler} to={this.dashboardOrRoot() ? "#invoiceTask" : "/dashboard/#invoiceTask"}>
          <Label color="orange">{item.count} PENDING</Label> 
          Invoices
        </Dropdown.Item>)
      }
    })

    const notifications = (T.translate("internal_navigation.notifications", {notifications_number: countNotifications}))

    return (
      <header> 
        <Menu fixed='top' key="headerNav">
          <Menu.Menu position='left'>
            <Menu.Item as="a" onClick={this.props.toggleInnerSidebarVisibility}><Icon name="sidebar" /></Menu.Item>
            <div className="logo item">
              <Link to="/dashboard">
                <img src={logoInverted} alt="logo-inverted" />
              </Link>
            </div>
          </Menu.Menu>

          <Menu.Menu position='right'>
            <Dropdown item pointing='top right' className='notifications' 
              trigger={(<Icon name="alarm" className="mr-0" />)} icon={null} > 
              <Dropdown.Menu>
                <Dropdown.Item disabled>
                  {notifications}
                </Dropdown.Item>)
                {projectData}
                {saleData}
                {invoiceData}
              </Dropdown.Menu>
            </Dropdown>  
           
            <Dropdown item pointing='top right' className='emails'
              trigger={(<div>
                <Icon name='mail' className="mr-0" />
                {count !== 0 && <Label size="tiny" color="red" floating>{count !== 0 && count}</Label>}
              </div>)} icon={null} >
              <Dropdown.Menu>
                <Dropdown.Item disabled>
                  {unreadMessagesCount}             
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  onClick={() => {
                    this.context.router.history.push('/conversations')
                  }}
                >              
                  <strong className="turquoise">{T.translate("internal_navigation.see_all_messages")}</strong>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            
            <Dropdown item pointing='top right' className='settings'
              trigger={(
                <span>
                  <Image avatar src={avatarPlaceholderSmall} alt="avatar-placeholder-small" /> 
                    {/*{currentUser && currentUser.firstName}*/}
                </span>)} >
              <Dropdown.Menu>
                <Dropdown.Item as="a" className="ui clearing segment">     
                  <div className="left floated">                 
                    <Icon name="tasks"/>              
                    {T.translate("internal_navigation.tasks")}
                  </div>
                  <Label color="blue" size="small" className="right floated">{countNotifications}</Label>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link to='/settings' className='d-block'>
                    <Icon name="settings" />
                    {T.translate("internal_navigation.settings")}
                  </Link>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item>
                  <Link to='/logout' className='d-block'>
                    <Icon name="sign out" />
                    {T.translate("internal_navigation.sign_out")}
                  </Link>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>             
          </Menu.Menu>
        </Menu>
      </header>)
  }
}

InternalHeaderNav.contextTypes = {
  router: PropTypes.object.isRequired
}

const Queries =  compose(
  graphql(GET_UNREAD_DIRECT_MESSAGES_COUNT_QUERY),
  graphql(GET_PROJECT_TASKS_DATA_QUERY, {
    name : 'getProjectTasksDataQuery'
  }),
  graphql(GET_SALE_TASKS_DATA_QUERY, {
    name : 'getSaleTasksDataQuery'
  }),
  graphql(GET_INVOICE_TASKS_DATA_QUERY, {
    name : 'getInvoiceTasksDataQuery'
  })
)(InternalHeaderNav)

export default (Queries)

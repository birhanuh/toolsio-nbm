import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link, Route } from 'react-router-dom'
import decode from 'jwt-decode'
import { Image, Dropdown, Menu, Label, Icon } from 'semantic-ui-react'
import { Query } from 'react-apollo'
import { GET_UNREAD_DIRECT_MESSAGES_COUNT_QUERY } from '../../graphql/conversations/directMessages'

import Breadcrumb from './Breadcrumb'

// Localization 
import T from 'i18n-react'

// Images
import logoInverted from '../../images/logo-inverted.png'
import avatarPlaceholderSmall from '../../images/avatar-placeholder-small.png'

const ActiveLink = ({ label, to, activeOnlyWhenExact }) => (
  <Route path={to} exact={activeOnlyWhenExact} children={({ match }) => (
    <Link className={match ? 'active item' : 'item' } to={to}>{label}</Link>
  )} />
)

/* Third party libraries */
import $ from 'jquery'
$.animate = require('jquery.easing')

class HeaderNav extends Component {

  componentDidMount = () => {    
    //jQuery for page scrolling feature - requires jQuery Easing plugin
    $('.ui.large.menu .left.menu a').bind('click', function() {
      var $anchor = $(this)
      $('html, body').stop().animate({
          scrollTop: $($anchor.attr('href')).offset().top - 50
      }, 1500, 'easeInOutExpo')
      event.preventDefault()
    })
  }

  logout(e) {
    e.preventDefault()
    
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshAuthToken')

    // Redirect to login page
    this.context.router.history.push('/login')
  }

  render() {
    
    let isAuthenticated = false
    let currentUser = null

    const authToken = localStorage.getItem('authToken')   

    if (authToken) {
      const { user } = decode(authToken)

      isAuthenticated = user ? true : false
      currentUser = user ? user : null
    }   

    const UserLinks = () => (
      <Query 
        query={GET_UNREAD_DIRECT_MESSAGES_COUNT_QUERY}
        fetchPolicy="cache-and-network">  
        {( { data } ) => {

          const { getUnreadDirectMessagesCount } = data
          let count = getUnreadDirectMessagesCount && getUnreadDirectMessagesCount.count 

          const unreadMessagesCount = (T.translate("internal_navigation.unread_messages", {unread_messages_number: count}))

          return [
            <nav key="nav" className="ui fixed menu">
              <div className="left menu">
                <a className="item anchor" onClick={this.props.toggleInnerSidebarVisibility}><i className="sidebar icon"></i></a>
                <div className="logo item">
                  <Link to="/dashboard">
                    <img src={logoInverted} alt="logo-inverted" />
                  </Link>
                </div>
              </div>

              <Menu.Menu position='right'>
                <Dropdown pointing='top right' className='ui dropdown item' 
                  trigger={(<Icon name="alarm" className="mr-0" />)} icon={null} > 
                  <Dropdown.Menu>
                    <Dropdown.Item as='a'>
                      <Label color="orange">WAR</Label> 
                      It is a long established.
                    </Dropdown.Item>
                    <Dropdown.Item as='a'>
                      <Label color="blue">NEW</Label> 
                      NEW
                    </Dropdown.Item>
                    <Dropdown.Item as='a'>
                      <Label color="green">SENT</Label> 
                      SENT
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>  
               
                <Dropdown pointing='top right' className='ui dropdown item'
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
                
                <Dropdown pointing='top right' className='ui dropdown item'
                  trigger={(
                    <span>
                      <Image avatar src={avatarPlaceholderSmall} alt="avatar-placeholder-small" /> 
                        {currentUser && currentUser.firstName}
                    </span>)} >
                  <Dropdown.Menu>
                    <Dropdown.Item>
                      <Icon name="tasks"/>
                      {T.translate("internal_navigation.tasks")}
                      <div className="ui right floated blue label">1</div>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Link to='/settings'>
                        <Icon name="settings" />
                        {T.translate("internal_navigation.settings")}
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item as='a' onClick={this.logout.bind(this)}>
                      <Icon name="sign out" />
                      {T.translate("internal_navigation.sign_out")}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>             
              </Menu.Menu>
            </nav>,

            <Breadcrumb key="breadcrumb" />
          ]
        }}
      </Query>
      )

    const GuestLinks = () => (
      <div id="home" className="ui inverted vertical masthead center aligned segment">
        <div className="ui container">
          <div className="ui large secondary inverted pointing menu">
            <a className="toc item" onClick={this.props.toggleOuterSidebarVisibility}>
              <i className="sidebar icon"></i>
            </a> 

            <div className="left menu">
              <ActiveLink activeOnlyWhenExact to="#home" label={T.translate("landing.home.header")} />
              <ActiveLink activeOnlyWhenExact to="#features" label={T.translate("landing.features.header")} />
              <ActiveLink activeOnlyWhenExact to="#clients" label={T.translate("landing.clients.header")} />
              <ActiveLink activeOnlyWhenExact to="#testimonials" label={T.translate("landing.testmonial.header")} />
              <ActiveLink activeOnlyWhenExact to="#pricing" label={T.translate("landing.pricing.header")} />
              <ActiveLink activeOnlyWhenExact to="#contacts" label={T.translate("landing.contacts.header")} />
            </div>

            <div className="right item">                                                   
              <Link className="ui inverted button"  to="/subdomain">{T.translate("log_in.log_in")}</Link> 
              <Link className="ui inverted button" to="/signup">{T.translate("sign_up.sign_up")}</Link>     
            </div>  
          </div>
        </div>

        <div className="ui text container">
          <h1 className="ui inverted header">
            {T.translate("landing.home.welcome")}&nbsp;
            <div className="turquoise d-inline">{T.translate("internal_navigation.toolsio")}</div>
          </h1>
          <h3>{T.translate("landing.home.slogan")}</h3>
          <a href="/signup" className="ui huge primary button">{T.translate("landing.home.get_started")}<i className="right arrow icon"></i></a>
        </div>
      </div>
    )

    return (
      <header>    
       
        {/* Call links conditionally.  */}
        { isAuthenticated ? <UserLinks /> : <GuestLinks /> } 

      </header>
    )
  }
}

HeaderNav.propTypes = {
  // authentication: PropTypes.object.isRequired,
  // logout: PropTypes.func.isRequired,
}

HeaderNav.contextTypes = {
  router: PropTypes.object.isRequired
}

export default HeaderNav

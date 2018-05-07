import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link, Route } from 'react-router-dom'
import decode from 'jwt-decode'
import { Image, Dropdown, Menu } from 'semantic-ui-react'

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

class HeaderNav extends Component {

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

    const latestFiveUnreadMessages = <Link to="/conversations"><strong>{T.translate("internal_navigation.unread_messages", {unread_messages_number: 0})}</strong></Link> 
    let countUnread = 2

    const userLinks = (
      <nav className="ui fixed menu">
        <div className="left menu">
          <a className="item anchor"><i className="sidebar icon"></i></a>
          <div className="logo item">
            <Link to="/dashboard">
              <img src={logoInverted} alt="logo-inverted" />
            </Link>
          </div>
        </div>

        <Menu.Menu position='right'>
          <Dropdown pointing='top right' className='ui dropdown item' 
            trigger={(<i className="alarm icon mr-0"></i>)} icon={null} > 
            <Dropdown.Menu>
              <Dropdown.Item as='a'>
                <div className="ui label orange">WAR</div> 
                It is a long established.
              </Dropdown.Item>
              <Dropdown.Item as='a'>
                <div className="ui label blue">NEW</div> 
                NEW
              </Dropdown.Item>
              <Dropdown.Item as='a'>
                <div className="ui label green">SENT</div> 
                SENT
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>  
         
          <Dropdown pointing='top right' className='ui dropdown item'
            trigger={(<div>
              <i className="mail envelop icon mr-0"></i>
              <div className="ui mini red label envelop">{countUnread}</div>
            </div>)} icon={null} >
            <Dropdown.Menu>
              <Dropdown.Item>
                {latestFiveUnreadMessages}             
              </Dropdown.Item>
              <Dropdown.Item>              
                <Link to="/conversations"><strong className="blue">{T.translate("internal_navigation.see_all_messages")}</strong></Link>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          
          <Dropdown pointing='top right' className='ui dropdown item'
            trigger={(
              <span>
                <Image avatar src={avatarPlaceholderSmall} alt="avatar-placeholder-small" /> {currentUser && currentUser.firstName}
              </span>)} >
            <Dropdown.Menu>
              <Dropdown.Item>
                <i className="tasks icon"></i>
                {T.translate("internal_navigation.tasks")}
                <div className="ui right floated blue label">1</div>
              </Dropdown.Item>
              <Dropdown.Item>
                <Link to='/settings'>
                  <i className="settings icon"></i>
                  {T.translate("internal_navigation.settings")}
                </Link>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item as='a' onClick={this.logout.bind(this)}>
                <i className="sign out icon"></i>
                {T.translate("internal_navigation.sign_out")}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>             
        </Menu.Menu>
      </nav>
    )

    const guestLinks = (
      <div>
        <div className="ui large top fixed menu transition hidden pointing menu">
          <div className="ui container">

            <div className="left menu">
              <ActiveLink activeOnlyWhenExact to="#home" label={T.translate("landing.home.header")} />
              <ActiveLink activeOnlyWhenExact to="#features" label={T.translate("landing.features.header")} />
              <ActiveLink activeOnlyWhenExact to="#clients" label={T.translate("landing.clients.header")} />
              <ActiveLink activeOnlyWhenExact to="#testimonials" label={T.translate("landing.testmonial.header")} />
              <ActiveLink activeOnlyWhenExact to="#pricing" label={T.translate("landing.pricing.header")} />
              <ActiveLink activeOnlyWhenExact to="#contacts" label={T.translate("landing.contacts.header")} />
            </div>
         
            <div className="right menu">
              <div className="item">                     
                <Link className="ui inverted button"  to="/login">{T.translate("log_in.log_in")}</Link>     
              </div>
              <div className="item">   
                <a className="ui inverted button" href={process.env.HTP+process.env.DNS+"/signup"}>{T.translate("sign_up.sign_up")}</a>    
              </div>
            </div>  
          </div>
        </div>
        <div className="ui vertical inverted sidebar menu left">
          <ActiveLink activeOnlyWhenExact className="active item" to="#home" label={T.translate("landing.home.header")} />
          <ActiveLink activeOnlyWhenExact className="item" to="#features" label={T.translate("landing.features.header")} />
          <ActiveLink activeOnlyWhenExact className="item" to="#clients" label={T.translate("landing.clients.header")} />
          <ActiveLink activeOnlyWhenExact className="item" to="#testimonials" label={T.translate("landing.testmonial.header")} />
          <ActiveLink activeOnlyWhenExact className="item" to="#pricing" label={T.translate("landing.pricing.header")} />
          <ActiveLink activeOnlyWhenExact className="item" to="#contacts" label={T.translate("landing.contacts.header")} />
          <Link className="item" to="/subdomain">{T.translate("log_in.log_in")}</Link>    
          <Link className="item" to="/signup">{T.translate("sign_up.sign_up")}</Link>    
        </div>
        <div id="home" className="ui inverted vertical masthead center aligned segment">
          <div className="ui container">
            <div className="ui large secondary inverted pointing menu">
              <Link className="toc item" to="/">
                <i className="sidebar icon"></i>
              </Link> 

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
                <a className="ui inverted button" href={process.env.HTP+process.env.DNS+"/signup"}>{T.translate("sign_up.sign_up")}</a>     
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
      </div>
    )

    return (
      <header>    
       
        {/* Call links conditionally.  */}
        { isAuthenticated ? userLinks : guestLinks } 

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

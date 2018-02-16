import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout } from '../../actions/authenticationActions'

import $ from 'jquery'
$.fn.dropdown = require('semantic-ui-dropdown')

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
  
  componentDidMount = () => {
    $('.ui.dropdown.item').dropdown({
      // you can use any ui transition
      transition: 'vertical flip'
    })
  }

   handleToggleBar = (e) => {
    e.preventDefault()
    
    $('.ui.visible.sidebar').toggleClass('collapsed')
    $('.ui.internal-page').toggleClass('collapsed')
    $('.ui.footer.segment.internal-footer').toggleClass('collapsed')
    $('.ui.fixed.menu.header-breadcrumb').toggleClass('collapsed')
  }

  logout(e) {
    e.preventDefault()
    this.props.logout()
  }

  render() {
    const { isAuthenticated, account } = this.props.authentication

    const userLinks = (
      <div>
        <nav className="ui fixed stackable menu">
          <div className="left menu">
            <div className="logo item">
              <Link to="/dashboards">
                <img src={logoInverted} alt="logo-inverted" />
              </Link>
            </div>
            <div className="item">
              <a onClick={this.handleToggleBar.bind(this)} href="#"><i className="sidebar icon"></i></a>
            </div>
          </div>
          
          <div className="right menu">
            <div className="ui dropdown item">
              <i className="alarm icon"></i>
              <div className="menu">
                <a className="item">
                  <div className="ui label orange">WAR</div> 
                  It is a long established.
                </a>
                <a className="item">
                  <div className="ui label blue">NEW</div> 
                  NEW
                </a>
                <a className="item">
                  <div className="ui label green">SENT</div> 
                  SENT
                </a>
              </div>
            </div>
            <div className="ui dropdown item">
              <i className="mail envelop icon"></i>
              <div className="ui mini blue label envelop">1</div>
              <div className="menu">
                <a className="item"><strong>Okay, right back at you in...</strong></a>
                <a className="item"><strong>Hi, I have sent you...</strong></a>                
                 <Link to="/conversations" className="item"><strong className="blue">{T.translate("internal_navigation.notifications")}</strong></Link>
              </div>
            </div>
            <div className="ui medium dropdown item">
              <img className="ui avatar image" src={avatarPlaceholderSmall} alt="avatar-placeholder-small" />
              {account.firstName}<i className="dropdown icon"></i>
              <div className="menu">
                <a className="item">
                  <i className="tasks icon"></i>
                  {T.translate("internal_navigation.tasks")}
                  <div className="ui right floated blue label">1</div>
                </a>
                <a className="item">
                  <i className="settings icon"></i>
                  {T.translate("internal_navigation.settings")}
                </a>
                <div className="divider"></div>
                <a className="item" to="#" onClick={this.logout.bind(this)} >
                  <i className="sign out icon"></i>
                  {T.translate("internal_navigation.sign_out")}
                </a>   
              </div>
            </div>
          </div>
        </nav>
      </div>
    )

    const guestLinks = (
      <div>
        <div className="ui large top fixed menu transition hidden pointing menu">
          <div className="ui container">
            <ActiveLink activeOnlyWhenExact to="#home" label={T.translate("landing.home.header")} />
            <ActiveLink activeOnlyWhenExact to="#features" label={T.translate("landing.features.header")} />
            <ActiveLink activeOnlyWhenExact to="#clients" label={T.translate("landing.clients.header")} />
            <ActiveLink activeOnlyWhenExact to="#testimonials" label={T.translate("landing.testmonial.header")} />
            <ActiveLink activeOnlyWhenExact to="#pricing" label={T.translate("landing.pricing.header")} />
            <ActiveLink activeOnlyWhenExact to="#contacts" label={T.translate("landing.contacts.header")} />
         
            <div className="right menu">
              <div className="item">                     
                <Link className="ui inverted button"  to="/login">{T.translate("log_in.log_in")}</Link>     
              </div>
              <div className="item">   
                <Link className="ui inverted button" to="/signup">{T.translate("sign_up.sign_up")}</Link>    
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
              <ActiveLink activeOnlyWhenExact to="#home" label={T.translate("landing.home.header")} />
              <ActiveLink activeOnlyWhenExact to="#features" label={T.translate("landing.features.header")} />
              <ActiveLink activeOnlyWhenExact to="#clients" label={T.translate("landing.clients.header")} />
              <ActiveLink activeOnlyWhenExact to="#testimonials" label={T.translate("landing.testmonial.header")} />
              <ActiveLink activeOnlyWhenExact to="#pricing" label={T.translate("landing.pricing.header")} />
              <ActiveLink activeOnlyWhenExact to="#contacts" label={T.translate("landing.contacts.header")} />
           
              <div className="right item">                                                   
                <Link className="ui inverted button"  to="/subdomain">{T.translate("log_in.log_in")}</Link> 
                <Link className="ui inverted button" to="/signup">{T.translate("sign_up.sign_up")}</Link>     
              </div>  
            </div>
          </div>

          <div className="ui text container">
            <h1 className="ui inverted header">
              {T.translate("landing.home.welcome")}&nbsp;
              <div className="turquoise inline-i">{T.translate("internal_navigation.toolsio")}</div>
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
  authentication: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  return {
    authentication: state.authentication
  }
}

export default connect(mapStateToProps, { logout })(HeaderNav)

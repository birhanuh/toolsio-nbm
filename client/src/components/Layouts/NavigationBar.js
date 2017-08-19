import React, { Component } from 'react'
import { Link, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout } from '../../actions/authentication'

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

class NavigationBar extends Component {
  
  componentDidMount = () => {
    $('.ui.dropdown.item').dropdown({
      // you can use any ui transition
      transition: 'vertical flip'
    })
  }

  logout(e) {
    e.preventDefault()
    this.props.logout()
  }

  render() {
    const { isAuthenticated } = this.props.auth

    const currentPage = window.location.pathname
    let currentPageTitle

    switch(currentPage) {
      case '/dashboard': 
        currentPageTitle = "dashboard.index.header"
        break
      case '/settings': 
        currentPageTitle = "settings.index.header"
        break
      case '/customers': 
        currentPageTitle = "customers.index.header"
        break
      case '/projects': 
        currentPageTitle = "projects.index.header"
        break
      case '/sales': 
        currentPageTitle = "sales.index.header"
        break  
      case '/invoices': 
        currentPageTitle = "invoices.index.header"
        break
      default:
        currentPageTitle = "No page title"
    }

    const userLinks = (
      <div>
        <nav className="ui fixed stackable menu">
          <div className="left menu">
            <div className="logo item">
              <Link to="/dashboard">
                <img src={logoInverted} alt="logo-inverted" />
              </Link>
            </div>
            <div className="item">
              <i className="sidebar icon"></i>
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
                <a className="item">{T.translate("internal_navigation.notifications")}</a>
              </div>
            </div>
            <div className="ui medium dropdown item">
              <img className="ui avatar image" src={avatarPlaceholderSmall} alt="avatar-placeholder-small" />
              Birhanu <i className="dropdown icon"></i>
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
        <div className="ui fixed menu header-breadcrumb">          
          <div className="left menu">
            <div className="item">
              <h2 className="ui header">{T.translate('"'+currentPageTitle+'"')}
                <div className="sub header">{T.translate('"'+currentPageTitle+'"')}</div>
              </h2>
            </div>              
          </div>
          <div className="right menu">
            <div className="item">
              <div className="ui breadcrumb">
                <a className="section">Dashboard</a>
                <div className="divider"> / </div>
                <a className="section">Sales</a>
                <div className="divider"> / </div>
                <div className="active section">New</div>
              </div>
            </div>
          </div>
        </div>
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
                <Link className="ui inverted button"  to="/login">{T.translate("sign_in.sign_in")}</Link>     
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
          <Link className="item" to="/login">{T.translate("sign_in.sign_in")}</Link>    
          <Link className="item" to="/login">{T.translate("sign_up.sign_up")}</Link>    
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
                <Link className="ui inverted button"  to="/login">{T.translate("sign_in.sign_in")}</Link>     
                <Link className="ui inverted button" to="/signup">{T.translate("sign_up.sign_up")}</Link>    
              </div>  
            </div>
          </div>

          <div className="ui text container">
            <h1 className="ui inverted header">
              {T.translate("landing.home.welcome")}&nbsp;
              <div className="turquoise visible-all-inline">{T.translate("internal_navigation.toolsio")}</div>
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

NavigationBar.propTypes = {
  auth: React.PropTypes.object.isRequired,
  logout: React.PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  return {
    auth: state.auth
  }
}

export default connect(mapStateToProps, { logout })(NavigationBar)

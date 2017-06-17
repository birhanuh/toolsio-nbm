import React, { Component } from 'react'
import { Link, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout } from '../../actions/authentication'

// Localization 
import T from 'i18n-react'

import logo from '../../images/logo-square.png'; 

const ActiveLink = ({ label, to, activeOnlyWhenExact }) => (
  <Route path={to} exact={activeOnlyWhenExact} children={({ match }) => (
    <Link className={match ? 'active item' : 'item' } to={to}>{label}</Link>
  )} />
)

class NavigationBar extends Component {
  logout(e) {
    e.preventDefault()
    this.props.logout()
  }

  render() {
    const { isAuthenticated } = this.props.auth

    const userLinks = (
      <nav className="ui fixed inverted menu">
        <div className="ui container">
          <Link className="header item" to="/dashboard">
            <img className="logo" src={logo} alt="logo-square" />
            Toolsio
          </Link>
          <ActiveLink activeOnlyWhenExact to="/dashboard" label={T.translate("dashboard.header")} />
          <ActiveLink activeOnlyWhenExact to="/projects" label={T.translate("projects.header")} />
          <ActiveLink activeOnlyWhenExact to="/sales" label={T.translate("sales.header")} />
          <ActiveLink activeOnlyWhenExact to="/invoices" label={T.translate("invoices.header")}/>
     
          <div className="right item">      
            <a className="ui inverted button" to="#" onClick={this.logout.bind(this)} >{T.translate("internal_navigation.log_out")}</a>   
          </div>
        </div>  
      </nav>
    )

    const guestLinks = (
      <div className="ui inverted vertical masthead center aligned segment">
        <div className="ui container">
          <div className="ui large secondary inverted pointing menu">
            <Link className="toc item" to="/">
              <i className="sidebar icon"></i>
            </Link> 
            <ActiveLink activeOnlyWhenExact to="/" label={T.translate("landing.home.header")} />
            <ActiveLink activeOnlyWhenExact to="/features" label={T.translate("landing.features.header")} />
            <ActiveLink activeOnlyWhenExact to="/clients" label={T.translate("landing.clients.header")} />
            <ActiveLink activeOnlyWhenExact to="/pricing" label={T.translate("landing.pricing.header")} />
            <ActiveLink activeOnlyWhenExact to="/testmonial" label={T.translate("landing.testmonial.header")} />
            <ActiveLink activeOnlyWhenExact to="/contacts" label={T.translate("landing.contacts.header")} />
         
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
          <h5>{T.translate("landing.home.slogan")}</h5>
          <div className="ui huge primary button">{T.translate("landing.home.get_started")}<i className="right arrow icon"></i></div>
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

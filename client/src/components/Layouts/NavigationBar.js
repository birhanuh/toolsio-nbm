import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout } from '../../actions/authentication'

import logo from '../../images/logo-square.png'; 

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
          <Link className="item" to="/dashboard">Dashboard</Link>
          <Link className="item" to="/projects">Projects</Link>
          <Link className="item" to="/sales">Sales</Link>
          <Link className="item" to="/invoices">Invoices</Link>
     
          <div className="right item">      
            <a className="ui inverted button" to="#" onClick={this.logout.bind(this)} >Log out</a>   
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
            <Link className="active item" to="/">Home</Link>
            <Link className="item" to="/about">About</Link>
            <Link className="item" to="/contact">Contact</Link>
         
            <div className="right item">                    
              <Link className="ui inverted button"  to="/login">Log in</Link>     
              <Link className="ui inverted button" to="/signup">Sign up</Link>    
            </div>  
          </div>
        </div>

        <div className="ui text container">
          <h1 className="ui inverted header">
            Welcome to Toolsio!
          </h1>
          <h2>Do whatever you want when you want to.</h2>
          <div className="ui huge primary button">Get Started <i className="right arrow icon"></i></div>
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

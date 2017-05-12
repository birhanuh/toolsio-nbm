import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { logout } from '../../actions/authentication'

class NavigationBar extends Component {
  logout(e) {
    e.preventDefault()
    this.props.logout()
  }

  render() {
    const { isAuthenticated } = this.props.auth

    const userLinks = (
      <div id="navbar" className="collapse navbar-collapse">
        <ul className="nav navbar-nav navbar-center">
          <li className="dashboard"><Link to="/dashboard">Dashboard</Link></li>
          <li className="projects"><Link to="/projects">Projects</Link></li>
          <li className="sales"><Link to="/sales">Sales</Link></li>
          <li className="invoices"><Link to="/invoices">Invoices</Link></li>
        </ul>
        <div className="navbar-form navbar-right">      
          <div className="form-group">
            <a to="#" onClick={this.logout.bind(this)} className="btn btn-primary">Log out</a>   
          </div>  
        </div>       
      </div> // .nav-collapse 
    )

    const guestLinks = (
      <div id="navbar" className="collapse navbar-collapse">
        <ul className="nav navbar-nav navbar-center">
          <li className="active"><Link to="/">Home</Link></li>
          <li className="about"><Link to="/about">About</Link></li>
          <li className="contact"><Link to="/contact">Contact</Link></li>
        </ul>
        <div className="navbar-form navbar-right">                
          <div className="form-group">
            <Link to="/signup" className="btn btn-primary">Sign up</Link>       
          </div>
          &nbsp;&nbsp;
          <div className="form-group">
            <Link to="/login" className="btn btn-primary">Log in</Link>   
          </div>  
        </div>       
      </div> // .nav-collapse
    )

    return (
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            { isAuthenticated ? <Link className="navbar-brand" to="/dashboard">Toolsio</Link> : <Link className="navbar-brand" to="/">Toolsio</Link> }
          </div>
          
          {/* Call links conditionally.  */}
          { isAuthenticated ? userLinks : guestLinks }

        </div>
      </nav>
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

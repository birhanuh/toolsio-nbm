import React from 'react'
import { Link } from 'react-router'

export default() => {
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
          <Link className="navbar-brand" href="/">Toolsio</Link>
        </div>
        <div id="navbar" className="collapse navbar-collapse">
          <ul className="nav navbar-nav navbar-center">
            <li className="active"><Link to="/">Home</Link></li>
            <li className="about"><Link to="/Linkbout">About</Link></li>
            <li className="contact"><Link to="/contact">Contact</Link></li>
            <li className="dashboard"><Link to="/Linkbout">Dashboard</Link></li>
            <li className="projects"><Link to="/projects">Projects</Link></li>
            <li className="sales"><Link to="/sales">Sales</Link></li>
            <li className="invoices"><Link to="/invoices">Invoices</Link></li>
          </ul>
          <div className="navbar-form navbar-right">    
            
              <div className="form-group">
                <Link to="/signup" className="btn btn-primary">Sign up</Link>       
              </div>
              ''
              <div className="form-group">
                <Link to="/login" className="btn btn-primary">Log in</Link>   
              </div>  
              
              {/* 
              <div className="form-group">
                <Link to="/logout" className="btn btn-primary">Logout</Link>
              </div>
              */}  
          </div>       
        </div> {/* .nav-collapse  */}
      </div>
    </nav>
  )
}


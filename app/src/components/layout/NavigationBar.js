import React from 'react'

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
          <a className="navbar-brand" href="/">Toolsio</a>
        </div>
        <div id="navbar" className="collapse navbar-collapse">
          <ul className="nav navbar-nav navbar-center">
            <li className="active"><a href="/">Home</a></li>
            <li className="about"><a href="/about">About</a></li>
            <li className="contact"><a href="/contact">Contact</a></li>
            <li className="dashboard"><a href="/about">Dashboard</a></li>
            <li className="projects"><a href="/projects">Projects</a></li>
            <li className="sales"><a href="/sales">Sales</a></li>
            <li className="invoices"><a href="/invoices">Invoices</a></li>
          </ul>
          <div className="navbar-form navbar-right">    
            
              <div className="form-group">
                <a href="/users/register" className="btn btn-primary">Register</a>       
              </div>
              <div className="form-group">
                <a href="/users/login" className="btn btn-primary">Login</a>   
              </div>  
               
              <div className="form-group">
                <a href="/users/logout" className="btn btn-primary">Logout</a>
              </div>  
          </div>       
        </div> {/* .nav-collapse  */}
      </div>
    </nav>
  )
}


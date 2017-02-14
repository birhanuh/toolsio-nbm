var React = require('react');

var BaseComponent = React.createClass({
  render: function (argument) {
    return (
      <html lang="en">
        {/* [if lt IE 7]> <html className="no-js ie6 oldie" lang="en">
          [if IE 7]>    <html className="no-js ie7 oldie" lang="en"> 
          [if IE 8]>    <html className="no-js ie8 oldie" lang="en"> 
          [if gt IE 8]>   <html className="no-js" lang="en"> */}
        <head>
          <meta charset="utf-8"/>
          <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>

         
          <meta name="viewport" content="width=device-width,initial-scale=1"/>
          <meta name="description" content=""/>
          <link rel="stylesheet" href="/css/styles.css"/>

        </head>
        <body>
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
                  {/* if (!user)   */} 
                    <div className="form-group">
                      <a href="/users/register" className="btn btn-primary">Register</a>       
                    </div>
                    <div className="form-group">
                      <a href="/users/login" className="btn btn-primary">Login</a>   
                    </div>  
                  {/* if (user)   */} 
                    <div className="form-group">
                      <a href="/users/logout" className="btn btn-primary">Logout</a>
                    </div>  
                </div>       
              </div> {/* .nav-collapse */}
            </div>
          </nav>
          {/* Initially populated by templates/layout.html */}
          <section>
            <div className="container">      
              {this.props.children}
            </div>
          </section>
          
          <footer className="footer">
            <div className="container">
              <p className="text-muted">Place sticky footer content here.</p>
            </div>
          </footer>

        </body>
      </html> 

    )
  }
});

module.exports = BaseComponent;
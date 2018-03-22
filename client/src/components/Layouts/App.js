import React, { Component } from 'react' 
import { Route, Switch } from 'react-router-dom'
import classnames from 'classnames'

import Dashboard from '../Dashboard/Page'
import Landing from './Landing'
import Signup from '../Signup/Page'
import Login from '../Login/Page'
import Subdomain from '../Login/Subdomain'
import { PrivateRoute } from '../../utils/requireAuth'
import Account from '../Account/Page'
import ProjectsPage from '../Projects/Page'
import ProjectsForm from '../Projects/Form'
import ProjectsShow from '../Projects/Show'
import SalesPage from '../Sales/Page'
import SalesForm from '../Sales/Form'
import SalesShow from '../Sales/Show'
import CustomersPage from '../Customers/Page'
import CustomersForm from '../Customers/Form'
import CustomersShow from '../Customers/Show'
import InvoicesPage from '../Invoices/Page'
import InvoicesForm from '../Invoices/Form'
import InvoicesShow from '../Invoices/Show/Page'
import ConversationsPage from '../Conversations/Page'
import UsersPage from '../Users/Page'

import HeaderNav from './HeaderNav'
import Sidebar from './Sidebar'
import FlashMessagesList from '../../flash/FlashMessagesList'

// Semantic CSS
import 'semantic-ui-css/semantic.min.css'

// CSS entry
import '../../css/app.scss'

// Images
import logo from '../../images/logo-square.png' 

// Jquery
import $ from 'jquery'

// Sidebar
$.fn.sidebar = require('semantic-ui-sidebar')

class App extends Component {
  
  componentDidMount = () => {
    //$('.sidebar.icon').sidebar('toggle')
  }

  render() {
    let landingPage = window.location.pathname === '/' ? true : false
    let authPages = window.location.pathname.indexOf('/login') === 0 || window.location.pathname.indexOf('/signup') === 0
      || window.location.pathname.indexOf('/subdomain') === 0 ? true : false

    let internalPages = (landingPage || authPages) ? false : true 

    return (
      <div className="pusher">
        
        { !authPages && <HeaderNav /> }
        
        { internalPages && 
          <Sidebar />
        }

        <section className={classnames({'ui stackable grid internal-page': internalPages, 'ui stackable centered grid auth-pages': authPages})}>          
                   
          { !authPages && <FlashMessagesList /> }
          
          <div className={classnames({'sixteen wide column': internalPages, 'six wide column': authPages})}>           
            <Switch>
              <Route exact path="/" component={Landing} />
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/signup/invitation/:token" component={Signup} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/login/confirmation/:token" component={Login} />
              <Route path="/subdomain" component={Subdomain} />
              <Route path="/dashboard" component={Dashboard} />
              <Route exact path="/account" component={Account} />
              <Route exact path="/projects" component={ProjectsPage} />
              <Route exact path="/projects/edit/:id" component={ProjectsForm} /> 
              <Route exact path="/projects/show/:id" component={ProjectsShow} />
              <Route exact path="/projects/new" component={ProjectsForm} />
              <Route exact path="/projects/:start/:length" component={ProjectsPage} />
              <PrivateRoute exact path="/sales" component={SalesPage} />
              <Route exact path="/sales/edit/:id" component={SalesForm} /> 
              <Route exact path="/sales/new" component={SalesForm} />
              <Route exact path="/sales/show/:id" component={SalesShow} />
              <Route exact path="/customers" component={CustomersPage} />
              <Route exact path="/customers/edit/:id" component={CustomersForm} /> 
              <Route exact path="/customers/new" component={CustomersForm} />
              <Route exact path="/customers/show/:id" component={CustomersShow} /> 
              <Route exact path="/invoices" component={InvoicesPage} />
              <Route exact path="/invoices/edit/:id" component={InvoicesForm} /> 
              <Route exact path="/invoices/new" component={InvoicesForm} />
              <Route exact path="/invoices/show/:id" component={InvoicesShow} /> 
              <Route exact path="/conversations" component={ConversationsPage} />
              <Route exact path="/conversations/:type" component={ConversationsPage} />
              <Route exact path="/conversations/:type/show/:id" component={ConversationsPage} /> 
              <Route exact path="/users" component={UsersPage} /> 
            </Switch>
          </div>
        </section>
        
        { internalPages &&
          <footer className="ui vertical footer segment internal-footer">
            <div className="ui stackable inverted grid">      
              <div className="ten wide column">
                <h4 className="ui inverted header">Footer Header</h4>
                <p>Extra space for a call to action inside the footer that could help re-engage users.</p>
              </div>
            </div>
          </footer>
        }
          
        { landingPage &&
          <footer className="ui inverted vertical footer segment">
            <div className="ui center aligned container">
              <div className="ui stackable inverted divided grid">
                <div className="three wide column">
                  <h4 className="ui inverted header">Group 1</h4>
                  <div className="ui inverted link list">
                    <a href="#" className="item">Link One</a>
                    <a href="#" className="item">Link Two</a>
                    <a href="#" className="item">Link Three</a>
                    <a href="#" className="item">Link Four</a>
                  </div>
                </div>
                <div className="three wide column">
                  <h4 className="ui inverted header">Group 2</h4>
                  <div className="ui inverted link list">
                    <a href="#" className="item">Link One</a>
                    <a href="#" className="item">Link Two</a>
                    <a href="#" className="item">Link Three</a>
                    <a href="#" className="item">Link Four</a>
                  </div>
                </div>
                <div className="three wide column">
                  <h4 className="ui inverted header">Group 3</h4>
                  <div className="ui inverted link list">
                    <a href="#" className="item">Link One</a>
                    <a href="#" className="item">Link Two</a>
                    <a href="#" className="item">Link Three</a>
                    <a href="#" className="item">Link Four</a>
                  </div>
                </div>
                <div className="seven wide column">
                  <h4 className="ui inverted header">Footer Header</h4>
                  <p>Extra space for a call to action inside the footer that could help re-engage users.</p>
                </div>
              </div>
              <div className="ui inverted section divider"></div>
              <img src={logo} className="ui centered mini image" alt="logo-square"/>
              <div className="ui horizontal inverted small divided link list">
                <a className="item" href="#">Site Map</a>
                <a className="item" href="#">Contact Us</a>
                <a className="item" href="#">Terms and Conditions</a>
                <a className="item" href="#">Privacy Policy</a>
              </div>
            </div>

            <a href="#" className="back-to-top">
              <i className="chevron up icon"></i>  
            </a>
          </footer>
        }
      </div>
    )
  }
}

export default App


import React, { Component } from 'react' 
import { Route, Switch } from 'react-router-dom'
import classnames from 'classnames'

import Dashboard from '../Dashboard/Page'
import Landing from './Landing'
import Signup from '../Signup/Page'
import Invitation from '../Signup/Invitation'
import Login from '../Login/Page'
import Subdomain from '../Login/Subdomain'
import { PrivateRoute, SubdomainRoute } from '../../utils/requireAuth'
import Account from '../Account/Page'
import ProjectsPage from '../Projects/Page'
import ProjectsForm from '../Projects/FormPage'
import ProjectsShow from '../Projects/Show'
import SalesPage from '../Sales/Page'
import SalesForm from '../Sales/FormPage'
import SalesShow from '../Sales/Show'
import CustomersPage from '../Customers/Page'
import CustomersForm from '../Customers/FormPage'
import CustomersShow from '../Customers/Show'
import InvoicesPage from '../Invoices/Page'
import InvoicesForm from '../Invoices/Form'
import InvoicesShow from '../Invoices/Show/Page'
import ConversationsPage from '../Conversations/Page'
import UsersPage from '../Users/Page'

import HeaderNav from './HeaderNav'
import Sidebar from './Sidebar'
import FlashMessage from '../../flash/FlashMessage'

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
    $('#app .ui.sidebar')
      .sidebar({
        transition: 'overlay',
        context: $('#app')
      })
      .sidebar('attach events', '#app .menu .item.anchor')
  }

  render() {
    let landingPage = window.location.pathname === '/' ? true : false
    let authPages = window.location.pathname.indexOf('/login') === 0 || window.location.pathname.indexOf('/signup') === 0
      || window.location.pathname.indexOf('/subdomain') === 0 ? true : false

    let internalPages = (landingPage || authPages) ? false : true 

    return (
      <div className="pusher">
        
        { internalPages && 
          <Sidebar />
        }

        { !authPages && <HeaderNav /> }

        <section className={classnames({'ui stackable grid basic segment internal-page': internalPages, 'ui stackable grid auth-pages': authPages})}>                    

          { !authPages && <FlashMessage /> }          
          
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/signup/invitation" component={Invitation} />
            <Route path="/subdomain" component={Subdomain} />
            <SubdomainRoute exact path="/login" component={Login} />
            <SubdomainRoute exact path="/login/confirmation/:token" component={Login} />
            <PrivateRoute path="/dashboard" component={Dashboard} />
            <PrivateRoute exact path="/settings" component={Account} />
            <PrivateRoute exact path="/projects" component={ProjectsPage} />
            <PrivateRoute exact path="/projects/edit/:id" component={ProjectsForm} /> 
            <PrivateRoute exact path="/projects/show/:id" component={ProjectsShow} />
            <PrivateRoute exact path="/projects/new" component={ProjectsForm} />
            <PrivateRoute exact path="/projects" component={ProjectsPage} />
            <PrivateRoute exact path="/sales" component={SalesPage} />
            <PrivateRoute exact path="/sales/edit/:id" component={SalesForm} /> 
            <PrivateRoute exact path="/sales/new" component={SalesForm} />
            <PrivateRoute exact path="/sales/show/:id?" component={SalesShow} />
            <PrivateRoute exact path="/customers/new" component={CustomersForm} />
            <PrivateRoute exact path="/customers/edit/:id" component={CustomersForm} /> 
            <PrivateRoute exact path="/customers/show/:id" component={CustomersShow} /> 
            <PrivateRoute exact path="/customers/:offset?/:limit?" component={CustomersPage} />
            <PrivateRoute exact path="/invoices/edit/:id" component={InvoicesForm} /> 
            <PrivateRoute exact path="/invoices/new" component={InvoicesForm} />
            <PrivateRoute exact path="/invoices/show/:id" component={InvoicesShow} /> 
            <PrivateRoute exact path="/invoices/:offset?/:limit?" component={InvoicesPage} />
            <PrivateRoute exact path="/conversations" component={ConversationsPage} />
            <PrivateRoute exact path="/conversations/channel/:channelId" component={ConversationsPage} />
            <PrivateRoute exact path="/conversations/receiver/:receiverId" component={ConversationsPage} />
            <PrivateRoute exact path="/users" component={UsersPage} /> 
          </Switch>
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


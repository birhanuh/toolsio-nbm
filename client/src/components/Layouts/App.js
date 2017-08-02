import React, { Component } from 'react' 
import { Route, Switch, Link } from 'react-router-dom'
import classnames from 'classnames'

import Dashboard from '../Dashboard/Index'
import Landing from './Landing'
import Signup from '../Signup/Index'
import Login from '../Login/Index'
import ProjectsIndex from '../Projects/Index'
import ProjectsFormPage from '../Projects/FormPage'
import ProjectsShow from '../Projects/Show'
import SalesIndex from '../Sales/Index'
import SalesFormPage from '../Sales/FormPage'
import SalesShow from '../Sales/Show'
import CustomersIndex from '../Customers/Index'
import CustomersFormPage from '../Customers/FormPage'
import requireAuth from '../../utils/requireAuth'

import NavigationBar from './NavigationBar'
import FlashMessagesList from '../../flash/FlashMessagesList'

// Semantic CSS
import 'semantic-ui-css/semantic.min.css'

// CSS entry
import '../../css/app.css'

// Logo
import logo from '../../images/logo-square.png' 

// Jquery
import $ from 'jquery'

// Sidebar
$.fn.sidebar = require('semantic-ui-sidebar')

// Localization 
import T from 'i18n-react'

const ActiveLink = ({ label, to, activeOnlyWhenExact }) => (
  <Route path={to} exact={activeOnlyWhenExact} children={({ match }) => (
    <Link className={match ? 'active item' : 'item' } to={to}>{label}</Link>
  )} />
)

class App extends Component {
  
  componentDidMount = () => {
    //$('.sidebar.icon').sidebar('toggle')
  }

  render() {
    let landingPage = window.location.pathname === '/' ? true : false
    let authPages = window.location.pathname === '/login' || window.location.pathname === '/signup'
      ? true : false

    let internalPages = (landingPage || authPages) ? false : true 

    return (
      <div className="pusher">
        
        { !authPages && <NavigationBar /> }
      
        <section className={classnames({'ui middle aligned stackable container internal-page': internalPages, 'ui stackable centered grid auth-pages': authPages})}>          
          { internalPages && 
            <div className="ui visible sidebar vertical menu">
              <ActiveLink activeOnlyWhenExact to="/dashboard" label={T.translate("dashboards.header")} />
              <ActiveLink activeOnlyWhenExact to="/projects" label={T.translate("projects.index.header")} />
              <ActiveLink activeOnlyWhenExact to="/sales" label={T.translate("sales.index.header")} />
              <ActiveLink activeOnlyWhenExact to="/customers" label={T.translate("customers.index.header")}/>
              <ActiveLink activeOnlyWhenExact to="/invoices" label={T.translate("invoices.index.header")}/>
            </div>
          }
          <div className="sixteen wide column">
            <FlashMessagesList />
          </div>
          <div className={classnames({'sixteen wide column': internalPages, 'six wide column': authPages})}>
            <Switch>
              <Route exact path="/" component={Landing} />
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/dashboard" component={requireAuth(Dashboard)} />
              <Route exact path="/projects" component={requireAuth(ProjectsIndex)} />
              <Route exact path="/projects/edit/:id" component={requireAuth(ProjectsFormPage)} /> 
              <Route exact path="/projects/show/:id" component={requireAuth(ProjectsShow)} />
              <Route exact path="/projects/new" component={requireAuth(ProjectsFormPage)} />
              <Route exact path="/sales" component={requireAuth(SalesIndex)} />
              <Route exact path="/sales/edit/:id" component={requireAuth(SalesFormPage)} /> 
              <Route exact path="/sales/new" component={requireAuth(SalesFormPage)} />
              <Route exact path="/sales/show/:id" component={requireAuth(SalesShow)} />
              <Route exact path="/customers" component={requireAuth(CustomersIndex)} />
              <Route exact path="/customers/edit/:id" component={requireAuth(CustomersFormPage)} /> 
              <Route exact path="/customers/new" component={requireAuth(CustomersFormPage)} />
            </Switch>
          </div>
        </section>
        
        { internalPages &&
          <footer className="ui inverted vertical footer segment">
            <div className="ui middle aligned container">
              <div className="ui stackable inverted grid">      
                <div className="ten wide column">
                  <h4 className="ui inverted header">Footer Header</h4>
                  <p>Extra space for a call to action inside the footer that could help re-engage users.</p>
                </div>
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


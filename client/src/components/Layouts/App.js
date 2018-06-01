import React, { Component } from 'react' 
import { Route, Switch, Link } from 'react-router-dom'
import classnames from 'classnames'
import { Sidebar, Menu } from 'semantic-ui-react'

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
import FlashMessage from '../../flash/FlashMessage'

// Localization 
import T from 'i18n-react'

// Semantic CSS
import 'semantic-ui-css/semantic.min.css'

// CSS entry
import '../../css/app.scss'

// Images
import logo from '../../images/logo-square.png' 
import logoPlaceholderMedium from '../../images/logo-placeholder.svg'

const ActiveLink = ({ label, to, icon, activeOnlyWhenExact }) => (
  <Route path={to} exact={activeOnlyWhenExact} children={({ match }) => (
    <Link className={match ? 'active item' : 'item' } to={to}>
      <i className={icon}></i>
      <span>{label}</span>
    </Link>
  )} />
)

class App extends Component {
  
  state = { 
    visibleInnerSidebar: false,
    visibleOuterSidebar: false  
  }

  toggleInnerSidebarVisibility = () => 
    this.setState({ visibleInnerSidebar: !this.state.visibleInnerSidebar })

  toggleOuterSidebarVisibility = () => 
    this.setState({ visibleOuterSidebar: !this.state.visibleOuterSidebar })

  render() {
    const { visibleInnerSidebar, visibleOuterSidebar } = this.state

    let landingPage = window.location.pathname === '/' ? true : false
    let authPages = window.location.pathname.indexOf('/login') === 0 || window.location.pathname.indexOf('/signup') === 0
      || window.location.pathname.indexOf('/subdomain') === 0 ? true : false

    let internalPages = (landingPage || authPages) ? false : true 

    return (
      <Sidebar.Pushable>
        <Sidebar as={Menu} animation='overlay' width='thin' visible={visibleOuterSidebar} vertical inverted>
          <ActiveLink activeOnlyWhenExact className="active item" to="#home" label={T.translate("landing.home.header")} />
          <ActiveLink activeOnlyWhenExact className="item" to="#features" label={T.translate("landing.features.header")} />
          <ActiveLink activeOnlyWhenExact className="item" to="#clients" label={T.translate("landing.clients.header")} />
          <ActiveLink activeOnlyWhenExact className="item" to="#testimonials" label={T.translate("landing.testmonial.header")} />
          <ActiveLink activeOnlyWhenExact className="item" to="#pricing" label={T.translate("landing.pricing.header")} />
          <ActiveLink activeOnlyWhenExact className="item" to="#contacts" label={T.translate("landing.contacts.header")} />
          <Link className="item" to="/subdomain">{T.translate("log_in.log_in")}</Link>    
          <Link className="item" to="/signup">{T.translate("sign_up.sign_up")}</Link>    
        </Sidebar>

        { internalPages &&
          <Sidebar as={Menu} animation='slide along' visible={visibleInnerSidebar} vertical inverted>
            <div className="ui center aligned vertical segment account">
              <Link to="/settings">
                <img className="ui centered tiny rounded image mt-3" src={logoPlaceholderMedium} alt="logo-placeholder-medium" />
              </Link>
              <p className="mt-3 mb-2">Birhanu (Admin)</p>
            </div>
            <ActiveLink activeOnlyWhenExact to="/dashboard" icon="dashboard icon" label={T.translate("dashboard.header")} />
            <ActiveLink activeOnlyWhenExact to="/projects" icon="suitcase icon" label={T.translate("projects.page.header")} />
            <ActiveLink activeOnlyWhenExact to="/sales" icon="cart icon" label={T.translate("sales.page.header")} />
            <ActiveLink activeOnlyWhenExact to="/customers" icon="users icon" label={T.translate("customers.page.header")}/>
            <ActiveLink activeOnlyWhenExact to="/invoices" icon="file text outline icon" label={T.translate("invoices.page.header")}/>
            <ActiveLink activeOnlyWhenExact to="/users" icon="user icon" label={T.translate("users.header")}/>
          </Sidebar>
        }
        <Sidebar.Pusher>
          { !authPages && <HeaderNav toggleInnerSidebarVisibility={this.toggleInnerSidebarVisibility} toggleOuterSidebarVisibility={this.toggleOuterSidebarVisibility} /> }

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
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    )
  }
}

export default App


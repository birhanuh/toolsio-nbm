import React, { Component } from 'react' 
import { Route, Switch } from 'react-router-dom'
import classnames from 'classnames'
// Semantic UI React
import { Sidebar } from 'semantic-ui-react'

import Dashboard from '../Dashboard/Page'
import LandingPage from './LandingPage'
import Signup from '../Signup/Page'
import Invitation from '../Signup/Invitation'
import Login from '../Login/Page'
import Subdomain from '../Login/Subdomain'
// Utils 
import { isAuthenticated, isAuthPages, SubdomainRoute, PrivateRoute } from '../../utils/'
import Settings from '../Settings/Page'
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
import EventsPage from '../Events/Page'

import InternalHeaderNav from './InternalHeaderNav'
import LandingPageHeaderNav from './LandingPageHeaderNav'
import { OuterSidebarScrollableHeader, InnerSidebar } from './Sidebars'
import FlashMessage from '../../flash/FlashMessage'

// Semantic CSS
import 'semantic-ui-css/semantic.min.css'

// CSS entry
import '../../css/app.scss'

// Localization 
import T from 'i18n-react'

// Logo
import logo from '../../images/logo-square.png' 

class App extends Component {
  
  state = { 
    visibleInnerSidebar: false,
    visibleOuterSidebar: false
  }

  toggleInnerSidebarVisibility = () => 
    this.setState(state => ({ visibleInnerSidebar: !state.visibleInnerSidebar }))

  toggleOuterSidebarVisibility = () => 
    this.setState(state => ({ visibleOuterSidebar: !state.visibleOuterSidebar }))

  // Hide OuterPageSidebar when click outside Sidebar area
  hideSidebarVisibility = () => {
    const { visibleOuterSidebar, visibleInnerSidebar } = this.state

    if (visibleOuterSidebar) {
      this.setState({ visibleOuterSidebar: false })
    }

    if (visibleInnerSidebar) {
      this.setState({ visibleInnerSidebar: false })
    }
  }

  render() {
    const { visibleOuterSidebar, visibleInnerSidebar } = this.state

    return [      
      <Sidebar.Pushable key="Sidebar">  
        { isAuthenticated() && !isAuthPages() && <InnerSidebar key="InnerSidebar" visibleInnerSidebar={visibleInnerSidebar} /> }
        <Sidebar.Pusher onClick={this.hideSidebarVisibility}>
          {/* Display either internal or external header nav */}
          { (isAuthenticated() && !isAuthPages()) && <InternalHeaderNav toggleInnerSidebarVisibility={this.toggleInnerSidebarVisibility} /> }

          {/* Display either internal or external header nav */}
          { (!isAuthenticated() && !isAuthPages()) && <LandingPageHeaderNav toggleInnerSidebarVisibility={this.toggleOuterSidebarVisibility} /> }

          <section className={classnames({"ui stackable grid basic segment internal-page": (isAuthenticated() && !isAuthPages()), "ui stackable grid auth-pages": isAuthPages()})}>
            {/* Falsh messages */}  
            {!isAuthPages() && <FlashMessage /> }    
            
            <Switch>
              {/* Render Laning-page or Dashboard */}
              <Route exact path="/" render={props => isAuthenticated() ? <Dashboard {...props} /> : <LandingPage {...props} />} />        
             
              {/* Publick Signup pages */}
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/signup/invitation" component={Invitation} />
              <Route path="/subdomain" component={Subdomain} />    

              {/* Subdomain required Login pages */}
              <SubdomainRoute exact path="/login" component={Login} />
              <SubdomainRoute exact path="/login/confirmation/:token" component={Login} />
              
              {/* Authenticated internal pages */}      
              <PrivateRoute path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/settings" component={Settings} />
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
              <PrivateRoute exact path="/events" component={EventsPage} /> 
            </Switch>
          </section>

          {/* Internal page footer */}
          { (isAuthenticated() && !isAuthPages()) && <footer className="ui vertical footer segment internal-footer">
            <div className="ui stackable inverted grid">      
              <div className="ten wide column">
                <h4 className="ui inverted header mb-0">{T.translate("landing.footer.toolsio")}</h4>
                <small>{T.translate("landing.footer.copy_right")}</small>
              </div>
            </div>
          </footer> }    

          {/* Landing page footer */}
          { (!isAuthenticated() && !isAuthPages()) && <footer className="ui inverted vertical footer segment">
            <div className="ui center aligned container">
              <div className="ui stackable inverted divided grid">
                <div className="three wide column">
                  <h4 className="ui inverted header">Group 1</h4>
                  <div className="ui inverted link list">
                    <a href="#features" className="item">{T.translate("landing.features.header")}</a>
                  </div>
                </div>
                <div className="three wide column">
                  <h4 className="ui inverted header">Group 2</h4>
                  <div className="ui inverted link list">
                    <a href="#pricing" className="item">{T.translate("landing.pricing.header")}</a>
                  </div>
                </div>
                <div className="three wide column">
                  <h4 className="ui inverted header">Group 3</h4>
                  <div className="ui inverted link list">
                    <a href="#testimonial" className="item">{T.translate("landing.testimonial.header")}</a>
                  </div>
                </div>
                <div className="seven wide column">
                  <h4 className="ui inverted header">{T.translate("landing.footer.toolsio")}</h4>
                  <p>{T.translate("landing.footer.address")}</p>
                  <small>{T.translate("landing.footer.copy_right")}</small>
                </div>
              </div>
              <div className="ui inverted section divider"></div>
              <img src={logo} className="ui centered mini image" alt="logo-square"/>
              <div className="ui horizontal inverted small divided link list">
                <a className="item" href="/terms-and-conditions">{T.translate("landing.footer.terms_and_conditions")}</a>
                <a className="item" href="/privacy-policy">{T.translate("landing.footer.privacy_policy")}</a>
              </div>
            </div>

            <a href="#" className="back-to-top">
              <i className="chevron up icon"></i>  
            </a>
          </footer>
        }  
        </Sidebar.Pusher>
      </Sidebar.Pushable>,
      <OuterSidebarScrollableHeader key="OuterSidebarScrollableHeader" visibleInnerSidebar={visibleOuterSidebar} />]
  }
}

export default App


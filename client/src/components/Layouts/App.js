import React, { Component } from 'react' 
import { Route, Switch, Redirect } from 'react-router-dom'
import { Sidebar } from 'semantic-ui-react'

import Dashboard from '../Dashboard/Page'
import LandingPage from './LandingPage'
import Signup from '../Signup/Page'
import Invitation from '../Signup/Invitation'
import Login from '../Login/Page'
import Subdomain from '../Login/Subdomain'
// helper functions 
import { isAuthenticated, getSubdomain } from '../../utils/'
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
import { InnerSidebar } from './InnerSidebar'
import FlashMessage from '../../flash/FlashMessage'

// Semantic CSS
import 'semantic-ui-css/semantic.min.css'

// CSS entry
import '../../css/app.scss'

class App extends Component {
  
  state = { 
    visibleInnerSidebar: false
  }

  toggleInnerSidebarVisibility = () => 
    this.setState({ visibleInnerSidebar: !this.state.visibleInnerSidebar })

  // Hide Sidebar when click outside Sidebar area
  hideSidebarVisibility = () => {
    const { visibleInnerSidebar } = this.state

    if (visibleInnerSidebar) {
      this.setState({ visibleInnerSidebar: false })
    }
  }

  render() {
    const { visibleInnerSidebar } = this.state

    // Authenticated routes
    const PrivateRoute = ({ component: Component, ...rest }) => (
      <Route {...rest} render={props => (
        
        isAuthenticated() ? (
          <Sidebar.Pushable>  
            <InnerSidebar visibleInnerSidebar={visibleInnerSidebar} />               
            <Sidebar.Pusher onClick={this.hideSidebarVisibility}>
              <InternalHeaderNav toggleInnerSidebarVisibility={this.toggleInnerSidebarVisibility} />
              <section className="ui stackable grid basic segment internal-page">     
                <FlashMessage /> 

                {/* Passed Component*/}
                <Component {...props} />
              </section>                  
              <footer className="ui vertical footer segment internal-footer">
                <div className="ui stackable inverted grid">      
                  <div className="ten wide column">
                    <h4 className="ui inverted header">Footer Header</h4>
                    <p>Extra space for a call to action inside the footer that could help re-engage users.</p>
                  </div>
                </div>
              </footer>                
            </Sidebar.Pusher>
          </Sidebar.Pushable>) : (<Redirect to={{ pathname: '/login', state: {from: props.location}}}/>))  
        }/>)

    // Login route
    const SubdomainRoute = ({ component: Component, ...rest }) => (
      <Route {...rest} render={props => (

        getSubdomain() ? (
          <section className="ui stackable grid auth-pages">

            {/* Passed Component*/}
            <Component {...props}/>
          </section>  
          ) : (<Redirect to={{ pathname: '/', 
          state: {from: props.location}}}/>))  
        }/>
      )

    // Root path Dashboard
    const RootPathDashboard = ({ ...props }) => (      
      isAuthenticated() ? (
        <Sidebar.Pushable>  
          <InnerSidebar visibleInnerSidebar={visibleInnerSidebar} />               
          <Sidebar.Pusher onClick={this.hideSidebarVisibility}>
            <InternalHeaderNav toggleInnerSidebarVisibility={this.toggleInnerSidebarVisibility} />
            <section className="ui stackable grid basic segment internal-page">     
              <FlashMessage /> 

              {/* Passed Component*/}
              <Dashboard {...props} />
            </section>                  
            <footer className="ui vertical footer segment internal-footer">
              <div className="ui stackable inverted grid">      
                <div className="ten wide column">
                  <h4 className="ui inverted header">Footer Header</h4>
                  <p>Extra space for a call to action inside the footer that could help re-engage users.</p>
                </div>
              </div>
            </footer>                
          </Sidebar.Pusher>
        </Sidebar.Pushable>) : (<Redirect to={{ pathname: '/login', state: {from: props.location}}}/>))  

    return (                   
      <Switch>
        {/* Publick laningpage */}
        <Route exact path="/" render={props => isAuthenticated() ? <RootPathDashboard {...props} /> : <LandingPage {...props} />} />        
       
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
      </Switch>)
  }
}

export default App


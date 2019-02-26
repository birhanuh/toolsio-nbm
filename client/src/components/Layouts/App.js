import React, { Component } from 'react' 
import { Route, Switch } from 'react-router-dom'
import classnames from 'classnames'
// Semantic UI React
import { Segment, Grid, Container, Sidebar, Header, List, Divider } from 'semantic-ui-react'

import Dashboard from '../Dashboard/Page'
import LandingPage from './LandingPage'
import Signup from '../Signup/Page'
import Invitation from '../Signup/Invitation'
import Login from '../Login/Page'
import Logout from './Logout'
import Subdomain from '../Login/Subdomain'
import ForgotPasswordRequest from '../Login/ForgotPasswordRequest'
import PasswordReset from '../Login/PasswordReset'
// Utils 
import { isAuthPages, isAuthenticated, SubdomainRoute, AuthRoute, PrivateRoute, DashboardOrLandingPageRoute } from '../../utils'
import Settings from '../Settings/Page'
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
import EventsPage from '../Events/Page'

import InternalHeaderNav from './InternalHeaderNav'
import LandingPageHeaderNav from './LandingPageHeaderNav'
import Breadcrumb from './Breadcrumb'
import { OuterSidebarScrollableHeader, InnerSidebar } from './Sidebars'
import FlashMessage from '../../flash/FlashMessage'

// Authorization utils
import { getCookie } from '../../utils'

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
        { isAuthenticated() && !isAuthPages() && <InnerSidebar currentAccount={JSON.parse(getCookie('currentAccount'))} key="InnerSidebar" visibleInnerSidebar={visibleInnerSidebar} /> }
        <Sidebar.Pusher onClick={this.hideSidebarVisibility}>
          
          {/* Display either internal or external header nav */}
          { (isAuthenticated() && !isAuthPages()) && <InternalHeaderNav currentAccount={JSON.parse(getCookie('currentAccount'))} toggleInnerSidebarVisibility={this.toggleInnerSidebarVisibility} /> }

          {/* Display either internal or external header nav */}
          { (!isAuthenticated() && !isAuthPages()) && <LandingPageHeaderNav toggleOuterSidebarVisibility={this.toggleOuterSidebarVisibility} /> }

          <section className={classnames({"ui stackable grid basic segment internal-page": (isAuthenticated() && !isAuthPages()), "ui stackable grid auth-pages": isAuthPages()})}>
            {/* Display breadcrumb */}
            { isAuthenticated() && !isAuthPages() && <Breadcrumb key="breadcrumb" /> }

            {/* Falsh messages */}  
            {!isAuthPages() && <FlashMessage /> }    
            
            <Switch>
              {/* Render Laning-page or Dashboard */}
              <DashboardOrLandingPageRoute exact path="/" dashboardComponent={Dashboard} landingPageComponent={LandingPage} />        
             
              {/* Public Signup pages */}
              <AuthRoute exact path="/signup" component={Signup} />
              <AuthRoute exact path="/signup/invitation" component={Invitation} />
              <AuthRoute path="/subdomain" component={Subdomain} />    
              <Route path="/logout" component={Logout} />    

              {/* Subdomain required Login pages */}
              <SubdomainRoute exact path="/login" component={Login} />
              <AuthRoute exact path="/login/confirmation/" component={Login} />
              <AuthRoute exact path="/login/forgot-password-request/" component={ForgotPasswordRequest} />
              <AuthRoute exact path="/login/password-reset/" component={PasswordReset} /> 
              
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
          { (isAuthenticated() && !isAuthPages()) && 
            <Segment inverted vertical className="footer internal-footer">
                <Grid inverted stackable>
                  <Grid.Row>
                    <Grid.Column width={10}>
                      <Header inverted as='h4'  className="mb-0">{T.translate("landing.footer.toolsio")}</Header>
                      <small>{T.translate("landing.footer.copy_right")}</small>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>
           }    

          {/* Landing page footer */}
          { (!isAuthenticated() && !isAuthPages()) && 
            <Segment inverted vertical style={{ padding: '5em 0em' }} className="footer">
              <Container textAlign='center'>
                <Grid divided inverted stackable>
                  <Grid.Row>
                    <Grid.Column width={9}>
                      <Header inverted as='h3'>Trello</Header>
                      <List link inverted>
                        <p>{T.translate("landing.footer.trello_description")}</p>
                        <List.Item as='a' to='https://trello.com/b/Qw2mO2ht/toolsio' target='_blank'>{T.translate("landing.footer.trello_link", { link: 'https://trello.com/b/Qw2mO2ht/toolsio' })}</List.Item>
                      </List>
                    </Grid.Column>
                    {/*<Grid.Column width={3}>
                      <Header inverted as='h3'>Group 2</Header>
                      <List link inverted>
                        <List.Item as='a' to='#features'>{T.translate("landing.features.header")}</List.Item>
                      </List>
                    </Grid.Column>
                    <Grid.Column width={3}>
                      <Header inverted as='h3'>Group 2</Header>
                      <List link inverted>
                        <List.Item as='a' to='#features'>{T.translate("landing.features.header")}</List.Item>
                      </List>
                    </Grid.Column>*/}
                    <Grid.Column width={7}>
                      <Header inverted as='h3'>{T.translate("landing.footer.toolsio")}</Header>
                      <p>{T.translate("landing.footer.address")}</p>
                      <small>{T.translate("landing.footer.copy_right")}</small>
                    </Grid.Column>
                  </Grid.Row>                  
             
                  <Divider inverted section />
                  <Grid.Row>
                    <Grid.Column>
                      <img src={logo} className="ui centered mini image" alt="logo-square"/>
                      <div className="ui horizontal inverted small divided link list">
                        <a className="item" href="/terms-and-conditions">{T.translate("landing.footer.terms_and_conditions")}</a>
                        <a className="item" href="/privacy-policy">{T.translate("landing.footer.privacy_policy")}</a>
                      </div>
                    </Grid.Column> 
                  </Grid.Row> 
              </Grid>
            </Container>
          </Segment>
        }  
        </Sidebar.Pusher>
      </Sidebar.Pushable>,
      <OuterSidebarScrollableHeader key="OuterSidebarScrollableHeader" visibleOuterSidebar={visibleOuterSidebar} />,
      <a key="back-to-top" href="#" className="back-to-top">
        <i className="chevron up icon"></i>  
      </a>]
  }
}

export default App


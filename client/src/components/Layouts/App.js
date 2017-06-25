import React, { Component } from 'react' 
import { Route, Switch } from 'react-router-dom'
import classnames from 'classnames'

import Dashboard from '../Dashboard/Page'
import Landing from './Landing'
import Signup from '../Signup/Page'
import Login from '../Login/Page'
import Projects from '../Projects/Projects'
import Sales from '../Sales/Page'
import SaleFormPage from '../Sales/FormPage'
import requireAuth from '../../utils/requireAuth'

import NavigationBar from './NavigationBar'
import FlashMessagesList from '../../flash/FlashMessagesList'

// Semantic CSS
import 'semantic-ui-css/semantic.min.css';

// CSS
import '../../css/app.css'

import logo from '../../images/logo-square.png'; 

class App extends Component {
  render() {
    let landingPage = window.location.pathname === '/' ? true : false
    let authPages = window.location.pathname === '/login' || window.location.pathname === '/signup'
      ? true : false

    let internalPages = (landingPage || authPages) ? false : true 

    document.body.className = ''

    if (internalPages) {
      document.body.className = 'internal-page'
    }  

    return (
      <div className={classnames({'pusher': landingPage, 'ui middle aligned center aligned grid': authPages})}>
        
        { !authPages && <NavigationBar /> }
      
        <section className={classnames({'ui middle aligned container internal': internalPages, 'auth column': authPages})}>   
          <div className={classnames({'ui stackable grid': internalPages})}>
            <div className="sixteen wide column">
              <FlashMessagesList />
            </div>
            <div className={classnames({'sixteen wide column': internalPages})}>
              <Switch>
                <Route exact path="/" component={Landing} />
                <Route path="/signup" component={Signup} />
                <Route path="/login" component={Login} />
                <Route path="/dashboard" component={requireAuth(Dashboard)} />
                <Route exact path="/projects" component={requireAuth(Projects)} />
                <Route exact path="/sales" component={requireAuth(Sales)} />
                <Route exact path="/sales/:id" component={requireAuth(SaleFormPage)} /> 
                <Route exact path="/sales/new" component={requireAuth(SaleFormPage)} />
              </Switch>
            </div>
          </div>
        </section>
        
        { (!authPages || !landingPage) &&
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


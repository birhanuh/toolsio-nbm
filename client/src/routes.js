import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Dashboard from './components/Dashboard/Page'
import Landing from './components/Layouts/Landing'
import Signup from './components/Signup/Page'
import Login from './components/Login/Page'
import Projects from './components/Projects/Page'
import Sales from './components/Sales/Page'
import SaleFormPage from './components/Sales/FormPage'
import requireAuth from './utils/requireAuth'

export default (
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
)

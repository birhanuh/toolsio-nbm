import React from 'react'
import { Route, IndexRoute } from 'react-router'

import index from './components/layout/index'
import Dashboard from './components/layout/Dashboard'
import Landing from './components/layout/Landing'
import Signup from './components/presentation/auth/Signup'
import Login from './components/presentation/auth/Login'
import Projects from './components/containers/Projects'
import requireAuth from './utils/requireAuth'

export default (
  <Route path="/" component={index}>
    <IndexRoute component={Landing} />
    <Route path="signup" component={Signup} />
    <Route path="login" component={Login} />
    <Route path="dashboard" component={requireAuth(Dashboard)} />
    <Route path="projects" component={requireAuth(Projects)} />
  </Route>
)

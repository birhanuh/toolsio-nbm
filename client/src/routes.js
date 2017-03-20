import React from 'react'
import { Route, IndexRoute } from 'react-router'

import { Home, Landing, Dashboard } from './components/layout/'
import Signup from './components/presentation/auth/Signup'
import Login from './components/presentation/auth/Login'
import Projects from './components/containers/Projects'
import requireAuth from './utils/requireAuth'

export default (
  <Route path="/" component={Home}>
    <IndexRoute component={Landing} />
    <Route path="signup" component={Signup} />
    <Route path="login" component={Login} />
    <Route path="dashboard" component={requireAuth(Dashboard)} />
    <Route path="projects" component={requireAuth(Projects)} />
  </Route>
)

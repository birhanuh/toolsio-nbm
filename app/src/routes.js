import React from 'react'
import { Route, IndexRoute } from 'react-router'

import { Home, Landing } from './components/layout/'
import Signup from './components/layout/auth/Signup'
import Login from './components/layout/auth/Login'

export default (
  <Route path="/" component={Home}>
    <IndexRoute component={Landing} />
    <Route path="signup" component={Signup} />
    <Route path="login" component={Login} />
  </Route>
)

import React from 'react'
import { Route, IndexRoute } from 'react-router'

import { Home, Landing } from './components/layout/'
import Signup from './components/presentation/auth/Signup'
import Login from './components/presentation/auth/Login'

export default (
  <Route path="/" component={Home}>
    <IndexRoute component={Landing} />
    <Route path="signup" component={Signup} />
    <Route path="login" component={Login} />
  </Route>
)

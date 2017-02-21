import React from 'react'
import { Route, IndexRoute } from 'react-router'

import Home from './components/layout/Home'
import Landing from './components/layout/Landing'

export default (
  <Route path="/" component={Home}>
    <IndexRoute component={Landing} />
  </Route>
)

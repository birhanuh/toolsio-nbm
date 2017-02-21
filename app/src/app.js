import React, { Component } from 'react' // ES6 version
import ReactDOM from 'react-dom'
import { Router, browserHistory } from 'react-router'
//var React = require('react') // ES5 version

import routes from './routes'

ReactDOM.render(<Router history={browserHistory} routes={routes} />, document.getElementById('app'))
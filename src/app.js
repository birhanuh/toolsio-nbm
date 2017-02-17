import React, { Component } from 'react' // ES6 version
import ReactDOM from 'react-dom'
//var React = require('react') // ES5 version

import Projects from './components/containers/project/Projects'
import Dashboard from './components/layout/Dashboard'

class App extends Component {
  render() {
    return (
      <div>Hello React!
        <Projects />
      </div>  
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('root'))
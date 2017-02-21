import React, { Component } from 'react' // ES6 version
import ReactDOM from 'react-dom'
//var React = require('react') // ES5 version

import Home from './components/layout/Home'

class App extends Component {
  render() {
    return (
      <div>
        <Home />
      </div>  
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('app'))
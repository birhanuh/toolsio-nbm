import React, { Component } from 'react' 
import classnames from 'classnames'
import NavigationBar from './NavigationBar'
import FlashMessagesList from '../../flash/FlashMessagesList'
import Projects from '../containers/Projects'
//import Sales from '../containers/Sales'

class Home extends Component {
  render() {
    return (
      <div>
        <NavigationBar />
      
        <section>         
          <div className={classnames({'container': this.props.location.pathname != '/'})}>
            <div className={classnames({'container': this.props.location.pathname === '/'})}>
              <FlashMessagesList />
            </div>  
            {this.props.children}
          </div>
        </section>
        
        <footer className="footer">
          <div className="container">
            <p className="text-muted">Place sticky footer content here.</p>
          </div>
        </footer>
      </div>
    )
  }
}

export default Home
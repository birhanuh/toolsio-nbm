import React, { Component } from 'react' 
import classnames from 'classnames'
import NavigationBar from './NavigationBar'
import FlashMessagesList from '../../flash/FlashMessagesList'

class Home extends Component {
  render() {
    return (
      <div>
        <NavigationBar />
      
        <section>         
          <div className={classnames({'container': this.props.location.pathname !== '/'})}>
            <div className={classnames({'container': this.props.location.pathname === '/'})}>
              <FlashMessagesList />
            </div>  
            {this.props.children}
          </div>
        </section>
        
        <footer>
          <div className="container">
            <div className="row">
              <div className="col-sm-12">
                <p className="text-muted">Place sticky footer content here.</p>
              </div>
            </div>  
          </div>
        </footer>
      </div>
    )
  }
}

export default Home


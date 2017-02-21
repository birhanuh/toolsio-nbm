import React, { Component } from 'react' 
import NavigationBar from './NavigationBar'
import Projects from '../containers/Projects'
//import Sales from '../containers/Sales'

class Home extends Component {
  render() {
    return (
      <div>
        <NavigationBar />
      
        <section>         
            {/*if success_msg.length > 0
              .alert.alert-success #{success_msg}
            if error_msg.length > 0
              .alert.alert-danger #{error_msg}
            if error.length > 0
              .alert.alert-danger #{error}</div> 
                {this.props.children} */}
            
          {this.props.children}
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
import React, { Component } from 'react' 

class Login extends Component {
  render() {
    return (
      <Base name={this.props.name}>
        <div className="row">
          <div className="col-sm-6 col-sm-offset-3">
            <div className="panel panel-default">
              <div className="panel-body">
                <h2 className="page-header m-t-m">Login to your Account</h2>

                {/* if errors
                  each error in errors
                    .alert.alert-danger #{error.msg}
                */}    
                
                <form method="post" action="/users/login">
                  <div className="form-group">
                    <label>Email</label>
                    <input className="form-control" type="email" name="email" placeholder="Email"/>
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input className="form-control" type="password" name="password" placeholder="Password"/>
                  </div>
                  <button type="submit" className="btn btn-default">Submit</button>
                </form>  
              </div>    
              <div className="panel-footer">
                <a href="/users/register">Don't have an account? Register here</a>
              </div>
            </div>
          </div>
        </div>      
      </Base>
    )
  }
}

export default Login
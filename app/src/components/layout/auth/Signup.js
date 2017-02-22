import React, { Component } from 'react' 

class Signup extends Component {
  render() {
    return (
      <Base name={this.props.name}>
        <div className="row">
          <div className="col-sm-6 col-sm-offset-3">
            <div className="panel panel-default">
              <div className="panel-body">
                <h2 class="page-header m-t-m">Create an Account</h2>

                {/* if errors
                  each error in errors
                    .alert.alert-danger #{error.msg}
                */}    
                
                <form method="post" action="/users/register">
                  <div className="form-group">
                    <label>First name</label>
                    <input className="form-control" type="text" name="firstName" placeholder="First Name"/>
                  </div>
                  <div className="form-group">
                    <label>Last name</label>
                    <input className="form-control" type="text" name="lastName" placeholder="Last Name"/>
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input className="form-control" type="email" name="email" placeholder="Email"/>
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input className="form-control" type="password" name="password" placeholder="Password"/>
                  </div>
                  <div className="form-group">
                    <label>Confirm password</label>
                    <input className="form-control" type="password" name="password2" placeholder="Confirm Password"/>
                  </div>
                  <button type="submit" className="btn btn-default">Submit</button>
                </form>  
              </div>    
              <div className="panel-footer">
                <a href="/users/login">Already a user? Login here</a>
              </div>
            </div>
          </div>
        </div>      
      </Base>
    )
  }
}

export default Signup
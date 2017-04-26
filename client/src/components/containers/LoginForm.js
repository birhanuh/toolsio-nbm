import React, { Component } from 'react' 
import FormField from '../../utils/FormField'
import { connect } from 'react-redux'
import { Validation } from '../../utils'
import { loginRequest } from '../../actions/authentication'
import { addFlashMessage } from '../../actions/flashMessages'

class LoginForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {
        email: '',
        password: ''
      },
      errors: {},
      isLoading: false
    }
  }

  onChange(event) {
    let updatedUser = Object.assign({}, this.state.user)
    updatedUser[event.target.name] = event.target.value
    this.setState({
      user: updatedUser
    })
  }

  isValid() {
    const { errors, isValid } = Validation.validateLoginInput(this.state.user)

    if (!isValid) {
      this.setState({ errors })
    }

    return isValid;
  }

  onSubmit(event) {
    event.preventDefault()
    
    if (this.isValid()) {
      this.setState({ errros: {}, isLoading: true })
      this.props.loginRequest(this.state.user).then(
        () => {
          this.props.addFlashMessage({
            type: 'success',
            text: 'You have signed in successfully!'
          })
          this.context.router.push('/dashboard')
        },
        ({ response }) => this.setState({ errors: response.data.errors, isLoading: false })
      )  
    }
  }

  render() {
    const { errors, isLoading } = this.state
   
    return (              
      <form onSubmit={this.onSubmit.bind(this)}>

        { errors.form && <div className="alert alert-danger alert-dismissible">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          {errors.form}</div> }

        <FormField
          label="Email"
          name="email" 
          value={this.state.user.email} 
          onChange={this.onChange.bind(this)} 
          placeholder="Email"
          error={errors.email}
        />
        <FormField
          label="Password"
          name="password" 
          value={this.state.user.password} 
          onChange={this.onChange.bind(this)} 
          placeholder="Last Name"
          error={errors.password}
          type="password"
        />
        <div className="form-group">        
          <button disabled={isLoading} className="btn btn-primary">Login</button>
        </div>  
      </form>         
    )
  }
}

LoginForm.propTypes = {
  loginRequest: React.PropTypes.func.isRequired,
  addFlashMessage: React.PropTypes.func.isRequired
}

LoginForm.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default connect(null, { loginRequest, addFlashMessage })(LoginForm)


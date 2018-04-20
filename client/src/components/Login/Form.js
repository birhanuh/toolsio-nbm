import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { addFlashMessage } from '../../actions/flashMessageActions'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { Validation } from '../../utils'

// Localization 
import T from 'i18n-react'

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      errors: {},
      isLoading: false
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  isValid() {
    const { email, password } = this.state
    const { errors, isValid } = Validation.validateLoginInput({email, password})

    let updatedErrors = Object.assign({}, this.state.errors)
    updatedErrors = errors

    if (!isValid) {
      this.setState({ errors: updatedErrors })
    }

    return isValid;
  }

  handleSubmit = (e) => {
    e.preventDefault()
    
    const { email, password } = this.state
  
    if (this.isValid()) {
      this.setState({ errors: {}, isLoading: true })

      this.props.mutate({variables: { email, password }})
        .then(res => {
         
          const { success, authToken, refreshAuthToken, errors } = res.data.loginUser
      
          if (success) {
            localStorage.setItem('authToken', authToken)
            localStorage.setItem('refreshAuthToken', refreshAuthToken)
            
            this.props.addFlashMessage({
              type: 'success',
              text: 'You have signed in successfully!'
            })

            // Redirect to dashboard
            this.context.router.history.push('/dashboard')
          } else {
            let errorsList = {}
            errors.map(error => errorsList[error.path] = error.message)
            this.setState({ errors: errorsList, isLoading: false })
          }
        })
        .catch(err => this.setState({ errors: err, isLoading: false }))
    }
  }

  render() {
    const { email, password, errors, isLoading } = this.state
  
    return (  
        <form className={classnames("ui large form", { loading: isLoading })} onSubmit={this.handleSubmit.bind(this)}>
          <div className="ui stacked segment">

            { !!errors.message && <div className="ui negative message"><p>{errors.message}</p></div> } 

            <div className={classnames("field", { error: errors && errors.email })}>
              <div className="ui right icon input">
                <i className="user icon"></i>
                <input type="text" name="email" placeholder={T.translate("log_in.email")} 
                  value={email} onChange={this.handleChange} />
              </div>
              <span className="red">{errors && errors.email}</span>
            </div>  
            <div className={classnames("field", { error: errors && errors.password })}>
              <div className="ui right icon input">
                <i className="lock icon"></i>
                <input type="password" name="password" placeholder={T.translate("log_in.password")}
                  value={password} onChange={this.handleChange} />                
              </div>
              <span className="red">{errors && errors.password}</span>
            </div>
                  
            <button disabled={isLoading} className="ui fluid large teal submit button">{T.translate("log_in.log_in")}</button>
              
          </div>
        </form>         
      
    )
  }
}

// Proptypes definition
Form.propTypes = {
  addFlashMessage: PropTypes.func.isRequired
}

Form.contextTypes = {
  router: PropTypes.object.isRequired
}

const loginUserMutation = gql`
  mutation($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      success
      authToken 
      refreshAuthToken
      errors {
        path
        message
      }
    }
  }
`

export default connect(null, { addFlashMessage }) (graphql(loginUserMutation)(Form))


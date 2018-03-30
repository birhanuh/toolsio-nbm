import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { addFlashMessage } from '../../actions/flashMessageActions'
import { extendObservable } from 'mobx'
import { observer } from 'mobx-react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { Validation } from '../../utils'

// Localization 
import T from 'i18n-react'

class Form extends Component {
  constructor(props) {
    super(props)
    extendObservable(this, {
      email: '',
      password: '',
      errors: {},
      isLoading: false
    })
  }

  handleChange = (e) => {
    const { name, value } = e.target
    this[name] = value
  }

  isValid() {
    const { email, password } = this
    const { errors, isValid } = Validation.validateLoginInput({email, password})

    let updatedErrors = Object.assign({}, this.state.errors)
    updatedErrors.message.errors = errors

    if (!isValid) {
      this.setState({ errors: updatedErrors })
    }

    return isValid;
  }

  handleSubmit = (e) => {
    e.preventDefault()
    
    const { email, password } = this
    this.errors = {password: 'me'}
    if (true) {
      this.setState({ errors: {}, isLoading: true })
      this.props.mutate({variables: { email, password }})
        .then(res => {
          // this.props.addFlashMessage({
          //   type: 'success',
          //   text: 'You have signed in successfully!'
          // })
          const { success, token, refreshToken, errors } = res.data.loginUser
         
          if (success) {
            localStorage.setItem('token', token)
            localStorage.setItem('refreshToken', refreshToken)
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
    const { email, password, errors, isLoading } = this
    console.log('errors ', errors.password)
    return (  
        <form className={classnames("ui large form", { loading: isLoading })} onSubmit={this.handleSubmit}>
          <div className="ui stacked segment">

            {/*{ !!errors.message && (typeof errors.message === "string") && <div className="ui negative message"><p>{errors.message}</p></div> } */}

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

const loginUserMutation = gql`
  mutation($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      success
      token 
      refreshToken
      errors {
        path
        message
      }
    }
  }
`
export default graphql(loginUserMutation)(observer(Form))


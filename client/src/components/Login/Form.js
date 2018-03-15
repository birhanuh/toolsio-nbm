import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
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
      errors: {
        message: {
          errors: {}
        }
      },
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
   
    if (true) {
      this.setState({ errros: {}, isLoading: true })
      this.props.mutate({variables: {email, password}})
        .then(res => {
          // this.props.addFlashMessage({
          //   type: 'success',
          //   text: 'You have signed in successfully!'
          // })
          // this.context.router.history.push('/dashboard')
          console.log('res', res)
          const { success, token, refreshToken } = res.data.loginUser
          if (true) {
            localStorage.setItem('token', token)
            localStorage.setItem('refreshToken', refreshToken)
          }
        })
        //.catch(err => this.setState({ errors: err.data.errors, isLoading: false }))
        .catch(err => console.log('err', err))
    }
  }

  render() {
    const { email, password, errors, isLoading } = this
   
    return (  
        <form className={classnames("ui large form", { loading: isLoading })} onSubmit={this.handleSubmit}>
          <div className="ui stacked segment">

            { !!errors.message && (typeof errors.message === "string") && <div className="ui negative message"><p>{errors.message}</p></div> } 

            <div className={classnames("field", { error: !!errors.message && errors.message.errors && errors.message.errors.email })}>
              <div className="ui right icon input">
                <i className="user icon"></i>
                <input type="text" name="email" placeholder={T.translate("log_in.email")} 
                  value={email} onChange={this.handleChange} />
              </div>
              <span className="red">{errors.message && errors.message.errors && errors.message.errors.email && errors.message.errors.email.message}</span>
            </div>  
            <div className={classnames("field", { error: !!errors.message && errors.message.errors && errors.message.errors.password })}>
              <div className="ui right icon input">
                <i className="lock icon"></i>
                <input type="password" name="password" placeholder={T.translate("log_in.password")}
                  value={password} onChange={this.handleChange} />                
              </div>
              <span className="red">{errors.message && errors.message.errors && errors.message.errors.password && errors.message.errors.password.message}</span>
            </div>
                  
            <button disabled={isLoading} className="ui fluid large teal submit button">{T.translate("log_in.log_in")}</button>
              
          </div>
        </form>         
      
    )
  }
}

// Form.propTypes = {
//   // loginRequest: PropTypes.func.isRequired,
//   // addFlashMessage: PropTypes.func.isRequired
// }

// Form.contextTypes = {
//   router: PropTypes.object.isRequired
// }

const loginMutation = gql`
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
export default graphql(loginMutation)(observer(Form))


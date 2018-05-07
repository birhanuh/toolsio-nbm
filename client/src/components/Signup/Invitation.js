import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Validation } from '../../utils'
import classnames from 'classnames'
import jwt from 'jsonwebtoken'
// Semantic UI Form elements
import { Input, Form } from 'semantic-ui-react'
import { addFlashMessage } from '../../actions/flashMessageActions'
import { graphql } from 'react-apollo'
import { REGISTER_INVITED_USER_MUTATION } from '../../graphql/authentications'

// Localization 
import T from 'i18n-react'

// Config
import jwtConfig from '../../../../config/jwt.json'

class Invitation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      token: null,
      errors: {},
      isLoading: false
    }
  }
  
  componentDidMount = () => {
    const url = new URL(window.location.href)
    let token = url.searchParams.get("token")
  
    const { email } = jwt.verify(token, jwtConfig.jwtSecret1)

    this.setState({ email, token })
  }

  handleChange = (name, value) => {
    if (this.state.errors[name]) {
      // Clone errors form state to local variable
      let errors = Object.assign({}, this.state.errors)
      delete errors[name]

      this.setState({
        [name]: value,
        errors
      })
    } else {
      this.setState({
        [name]: value
      })
    }
  }

  isValid() {
    const { errors, isValid } = Validation.validateInvitationRegistrationInput(this.state)

    let updatedErrors = Object.assign({}, this.state.errors)
    updatedErrors = errors

    if (!isValid) {
      this.setState({ errors: updatedErrors })
    }

    return isValid;
  }

  handleSubmit(e) {
    e.preventDefault()

    if (this.isValid()) {       
      this.setState({ isLoading: true })
      
      const { firstName, lastName, email, password, token } = this.state
      
      this.props.mutate({variables: { firstName, lastName, email, password, token }})
        .then(res => {      
          const { success, account, errors } = res.data.registerInvitedUser
         
          if (success) {
            this.props.addFlashMessage({
              type: 'success',
              text: T.translate("sign_up.success_create")
            })
            
            // Redirect to login
            window.location = `${process.env.HTTP}${account.subdomain}.${process.env.DNS}/login`
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
    const { firstName, email, lastName, password, confirmPassword, errors, isLoading } = this.state

    return (            
      <Form loading={isLoading} onSubmit={this.handleSubmit.bind(this)}>
        <div className="ui stacked segment">
           
          { !!errors.message && <div className="ui negative message"><p>{errors.message}</p></div> } 
          
          <Form.Field>
            <label>{T.translate("sign_up.first_name")}</label>
            <Input
              placeholder={T.translate("sign_up.first_name")}
              control={Input}
              name="firstName" 
              value={firstName} 
              onChange={(e, {value}) => this.handleChange('firstName', value)} 
              error={!!errors.firstName}
            />
            <span className="red">{errors.firstName}</span>
          </Form.Field>

          <Form.Field>
            <label>{T.translate("sign_up.last_name")}</label>
            <Input
              placeholder={T.translate("sign_up.last_name")}
              control={Input}
              name="lastName" 
              value={lastName} 
              onChange={(e, {value}) => this.handleChange('lastName', value)} 
              error={!!errors.lastName}
            />
            <span className="red">{errors.lastName}</span>
          </Form.Field>

          <Form.Field>
            <label className={classnames({red: !!errors.email})}>{T.translate("sign_up.email")}</label>
            <Input
              placeholder={T.translate("sign_up.email")}
              control={Input}
              name="email" 
              value={email} 
              onChange={(e, {value}) => this.handleChange('email', value)} 
              error={!!errors.email}
            />
            <span className="red">{errors.email}</span>
          </Form.Field>

          <Form.Field>
            <label className={classnames({red: !!errors.password})}>{T.translate("sign_up.password")}</label>
            <Input
              placeholder={T.translate("sign_up.password")}
              control={Input}
              name="password" 
              value={password} 
              onChange={(e, {value}) => this.handleChange('password', value)} 
              error={!!errors.password}
            />
            <span className="red">{errors.password}</span>
          </Form.Field>

          <Form.Field>
            <label className={classnames({red: !!errors.confirmPassword})}>{T.translate("sign_up.confirm_password")}</label>
            <Input
              placeholder={T.translate("sign_up.confirm_password")}
              control={Input}
              name="confirmPassword" 
              value={confirmPassword} 
              onChange={(e, {value}) => this.handleChange('confirmPassword', value)} 
              error={!!errors.confirmPassword}
            />
            <span className="red">{errors.confirmPassword}</span>
          </Form.Field>

          <button disabled={isLoading} className="ui fluid large teal submit button">{T.translate("sign_up.sign_up")}</button>
        </div>
      </Form>         

    )
  }
}

// Proptypes definition
Invitation.propTypes = {
  addFlashMessage: PropTypes.func.isRequired
}

// Contexttype definition
Invitation.contextTypes = {
  router: PropTypes.object.isRequired
}

export default connect(null, { addFlashMessage }) (graphql(REGISTER_INVITED_USER_MUTATION)(Invitation))



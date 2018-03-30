import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Validation } from '../../utils'
import { InputField, SelectField } from '../../utils/FormFields'
import classnames from 'classnames'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

// Localization 
import T from 'i18n-react'

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: {
        subdomain: '', 
        industry: ''
      },
      user: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      errors: {},
      isLoading: false,
      invalid: false
    }
  }
  
  handleChange(e) {
    if (e.target.name === "subdomain" || e.target.name === "industry") {
      this.setState({
        account: { ...this.state.account, [e.target.name]: e.target.value }
      })
    }
    else if (e.target.name === "firstName" || e.target.name === "lastName" || e.target.name === "email"
        || e.target.name === "password" || e.target.name === "confirmPassword") {
      this.setState({
        user: { ...this.state.user, [e.target.name]: e.target.value }
      })
    }  
  }

  getAccount = (e) => {
    const field = e.target.name
    const val = e.target.value

    if (val !== '') {
      this.props.client.query({ 
        query: getAccountQuery,
        variables: {subdomain: val} })
        .then(res => {

          const { id, subdomain } = res.data.getAccountQuery

          if (subdomain) {

            let updatedErrors = Object.assign({}, this.state.errors)
            updatedErrors = {subdomain: 'There is an account with such '+field+ ' subdomain.'}

            this.setState({ errors: updatedErrors })
          }
        })
    }
  }

  isValid() {
    const { errors, isValid } = Validation.validateRegistrationInput(this.state)

    let updatedErrors = Object.assign({}, this.state.errors)
    updatedErrors.message.errors = errors

    if (!isValid) {
      this.setState({ errors: updatedErrors })
    }

    return isValid;
  }

  handleSubmit(e) {
    e.preventDefault()

    if (true) { 
      // Empty errros state for each submit
      this.setState({ errros: {}, isLoading: true })
      
      const { account: { subdomain, industry }, user: { firstName, lastName, email, password } } = this.state
      // Make submit
      this.props.registerUserMutation({variables: { firstName, lastName, email, password, subdomain, industry }})
        .then(res => {
          // this.props.addFlashMessage({
          //   type: 'success',
          //   text: T.translate("sign_up.success_create")
          // })
          // window.location = `${process.env.HTP}${this.props.currentAccount.account}.${process.env.DNS}/dashboard`

          const { success, token, refreshToken, errors } = res.data.registerUser
         
          if (success) {
            console.log('res', res.data)
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
    const { account, user, errors, isLoading, invalid } = this.state
   
    return (            
      <form className={classnames("ui large form", { loading: isLoading })} onSubmit={this.handleSubmit.bind(this)}>
        <div className="ui stacked segment">
           
          {/*{ !!errors.message && (typeof errors.message === "string") && <div className="ui negative message"><p>{errors.message}</p></div> }*/} 
          
          <InputField
            id='firstName'
            label={T.translate("sign_up.first_name")}
            name="firstName" 
            value={user.firstName} 
            onChange={this.handleChange.bind(this)} 
            placeholder={T.translate("sign_up.first_name")}
            formClass="field"
          />
          <InputField
            id='lastName'
            label={T.translate("sign_up.last_name")}
            name="lastName" 
            value={user.lastName} 
            onChange={this.handleChange.bind(this)} 
            placeholder={T.translate("sign_up.last_name")}
            formClass="field"
          />
          <InputField
            type="email"
            name="email" 
            value={user.email} 
            id='email'
            label={T.translate("sign_up.email")}
            onChange={this.handleChange.bind(this)} 
            placeholder={T.translate("sign_up.email")}
            error={errors && errors.email}
            formClass="field"
          />
          <InputField
            type="password"
            name="password" 
            value={user.password} 
            id="password"
            label={T.translate("sign_up.password")}
            onChange={this.handleChange.bind(this)} 
            placeholder={T.translate("sign_up.password")}
            error={errors && errors.password}
            formClass="field"
          />
          <InputField
            type="password"
            name="confirmPassword" 
            value={user.confirmPassword} 
            id="confirmPassword"
            label={T.translate("sign_up.confirm_password")}
            onChange={this.handleChange.bind(this)} 
            placeholder={T.translate("sign_up.confirm_password")}
            error={errors.confirmPassword}
            formClass="field"
          />
          <SelectField
            type="select"
            name="industry"
            value={account.industry} 
            label={T.translate("sign_up.account.industry")}
            onChange={this.handleChange.bind(this)} 
            error={errors && errors.industry}
            formClass="field"

            options={[
              <option key="default" value="" disabled>{T.translate("sign_up.account.select_industry")}</option>,
              <option key="human resource" value="human resource">Human resource</option>,
              <option key="fashion" value="fashion">Fashion</option>,
              <option key="import/export" value="import/export">Import/Export</option>,
              <option key="store" value="store">Store</option>,
              <option key="technology" value="technology">Technology</option>
              ]
            }
          />
          <div className={classnames("field", { error: !!errors && errors.subdomain })}>
            <label>{T.translate("sign_up.account.subdomain")}</label>
            <div className="ui right labeled input">
              <input type="text" name="subdomain" 
                id="subdomain" 
                placeholder={T.translate("sign_up.account.subdomain")} 
                onBlur={this.getAccount.bind(this)} 
                value={account.subdomain} 
                onChange={this.handleChange.bind(this)} />
              <div className="ui label">toolsio.com</div>  
            </div>
            <span className="red">{errors && errors.subdomain}</span>
          </div>  

          <button disabled={isLoading || invalid} className="ui fluid large teal submit button">{T.translate("sign_up.sign_up")}</button>
        </div>
      </form>         

    )
  }
}

// Proptypes definition
Form.propTypes = {
  // addFlashMessage: PropTypes.func.isRequired,
  // isSubdomainExist: PropTypes.func.isRequired,
  // isUserExist: PropTypes.func.isRequired
}

const registerUserMutation = gql`
  mutation registerUser($firstName: String, $lastName: String, $email: String!, $password: String!, $subdomain: String!, $industry: String!) {
    registerUser(firstName: $firstName, lastName: $lastName, email: $email, password: $password, subdomain: $subdomain, industry: $industry) {
      success
      errors {
        path
        message
      }
    }
  }
`

const getAccountQuery = gql`
  query getAccount($subdomain: String!) {
    getAccount(subdomain: $subdomain) {
      id
      subdomain
    }
  }
`

export default graphql(registerUserMutation)(Form)


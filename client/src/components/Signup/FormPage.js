import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Validation } from '../../utils'
import { addFlashMessage } from '../../actions/flashMessageActions'
// Semantic UI Form elements
import { Input, Select, Form } from 'semantic-ui-react'
import { graphql } from 'react-apollo'
import { REGISTER_USER_MUTATION } from '../../graphql/authentications'


// Localization 
import T from 'i18n-react'

class FormPage extends Component {
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
  
  handleChange = (name, value) => {
     if (this.state.errors[name]) {
      // Clone errors form state to local variable
      let errors = Object.assign({}, this.state.errors)
      delete errors[name]

      if (name === "subdomain" || name === "industry") {
        this.setState({
          account: { ...this.state.account, [name]: value },
          errors
        })
      }
      else if (name === "firstName" || name === "lastName" || name === "email"
          || name === "password" || name === "confirmPassword") {
        this.setState({
          user: { ...this.state.user, [name]: value },
          errors
        })
      }  
    } else {
      if (name === "subdomain" || name === "industry") {
        this.setState({
          account: { ...this.state.account, [name]: value }
        })
      }
      else if (name === "firstName" || name === "lastName" || name === "email"
          || name === "password" || name === "confirmPassword") {
        this.setState({
          user: { ...this.state.user, [name]: value }
        })
      }  
    }
   
  }

  isValid() {
    const { errors, isValid } = Validation.validateRegistrationInput(this.state)

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
      
      const { account: { subdomain, industry }, user: { firstName, lastName, email, password } } = this.state
      
      this.props.mutate({variables: { firstName, lastName, email, password, subdomain, industry }})
        .then(res => {      
          const { success, account, errors } = res.data.registerUser
         
          if (success) {
            this.props.addFlashMessage({
              type: 'success',
              text: T.translate("sign_up.success_create")
            })
            
            // Redirect to login
            window.location = `${process.env.SERVER_PROTOCOL}${account.subdomain}.${process.env.SERVER_HOST}/login`
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
      <Form loading={isLoading} onSubmit={this.handleSubmit.bind(this)}>
        <div className="ui stacked segment">
           
          { !!errors.message && <div className="ui negative message"><p>{errors.message}</p></div> }
          
          <Form.Field>
            <label>{T.translate("sign_up.first_name")}</label>
            <Input
              placeholder={T.translate("sign_up.first_name")}
              name="firstName" 
              value={user.firstName} 
              onChange={(e, {value}) => this.handleChange('firstName', value)} 
              error={!!errors.firstName}
            />
            <span className="red">{errors.firstName}</span>
          </Form.Field>

          <Form.Field>
            <label>{T.translate("sign_up.last_name")}</label>
            <Input
              placeholder={T.translate("sign_up.last_name")}
              name="lastName" 
              value={user.lastName} 
              onChange={(e, {value}) => this.handleChange('lastName', value)} 
              error={!!errors.lastName}
            />
            <span className="red">{errors.lastName}</span>
          </Form.Field>

          <Form.Field error={!!errors.email}>
            <label>{T.translate("sign_up.email")}</label>
            <Input
              placeholder={T.translate("sign_up.email")}
              name="email" 
              value={user.email} 
              onChange={(e, {value}) => this.handleChange('email', value)} 
              error={!!errors.email}
            />
            <span className="red">{errors.email}</span>
          </Form.Field>

          <Form.Field error={!!errors.password}>
            <label>{T.translate("sign_up.password")}</label>
            <Input
              placeholder={T.translate("sign_up.password")}
              name="password" 
              value={user.password} 
              onChange={(e, {value}) => this.handleChange('password', value)} 
              type='password'
              error={!!errors.password}
            />
            <span className="red">{errors.password}</span>
          </Form.Field>

          <Form.Field error={!!errors.confirmPassword}>
            <label>{T.translate("sign_up.confirm_password")}</label>
            <Input
              placeholder={T.translate("sign_up.confirm_password")}
              name="confirmPassword" 
              value={user.confirmPassword} 
              onChange={(e, {value}) => this.handleChange('confirmPassword', value)} 
              type='password'
              error={!!errors.confirmPassword}
            />
            <span className="red">{errors.confirmPassword}</span>
          </Form.Field>
         
          <Form.Field error={!!errors.industry}>
            <label>{T.translate("sign_up.account.industry")}</label>
            <Select
              placeholder={T.translate("sign_up.account.select_industry")}
              name="industry"
              value={account.industry} 
              onChange={(e, {value}) => this.handleChange('industry', value)} 
              error={!!errors.industry}
              options={[
                { key: "human resource", value: "human resource", text: 'Human resource' },
                { key: "fashion", value: "fashion", text: 'Fashion' },
                { key: "import/export", value: "import/export", text: 'Import/Export' },
                { key: "store", value: "store", text: 'Store' },
                { key: "technology", value: "technology", text: 'Technology' }
              ]}
              selection
              fluid
              />
            <span className="red">{errors.industry}</span>
          </Form.Field>

          <Form.Field error={!!errors.subdomain}>
            <label>{T.translate("sign_up.account.subdomain")}</label>
            <Input
              label="toolsio.com"
              placeholder={T.translate("sign_up.account.subdomain")}
              name="subdomain" 
              value={user.subdomain} 
              onChange={(e, {value}) => this.handleChange('subdomain', value)} 
              error={!!errors.subdomain}
              fluid
            />
            <span className="red">{errors.subdomain}</span>
          </Form.Field>

          <button disabled={isLoading || invalid} className="ui fluid large teal submit button">{T.translate("sign_up.sign_up")}</button>
        </div>
      </Form>         

    )
  }
}

// Proptypes definition
FormPage.propTypes = {
  addFlashMessage: PropTypes.func.isRequired
  // isSubdomainExist: PropTypes.func.isRequired,
  // isUserExist: PropTypes.func.isRequired
}

FormPage.contextTypes = {
  router: PropTypes.object.isRequired
}

export default connect(null, { addFlashMessage } ) (graphql(REGISTER_USER_MUTATION)(FormPage))

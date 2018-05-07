import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Validation } from '../../utils'
// Semantic UI Form elements
import { Input, Form } from 'semantic-ui-react'
import { addFlashMessage } from '../../actions/flashMessageActions'
import { graphql } from 'react-apollo'
import { SEND_INVITATION_MUTATION } from '../../graphql/users'

// Localization 
import T from 'i18n-react'

class FormPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      errors: {},
      isLoading: false
    }
  }

  handleChange = (name, value) => {

    if (this.state.errors[name]) {

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
    const { errors, isValid } = Validation.validateUserInvitationInput(this.state)

    let updateErrors = Object.assign({}, this.state.errors)
    updateErrors = errors

    if (!isValid) {
      this.setState({ errors: updateErrors })
    }

    return isValid
  }

  handleSubmit = (e) => {
    e.preventDefault()

    if (this.isValid()) {
      const { email } = this.state

      this.setState({ isLoading: true })
      
      this.props.mutate({ 
        variables: { email } })
        .then(res => {  

          const { success, errors } = res.data.sendInvitation

          if (success) {
            this.props.addFlashMessage({
              type: 'success',
              text: T.translate("users.flash.invitation_success", {email: email})
            })

            this.setState({ email: '', isLoading: false })
          } else {
            let errorsList = {}
            console.log('errors: ', res.data.sendInvitation)
            errors.map(error => errorsList[error.path] = error.message)

            this.setState({ errors: errorsList, isLoading: false })
          }
        })
        .catch(err => this.setState({ errors: err, isLoading: false }))
    }
    
  }

  render() {

    const { email, errors, isLoading } = this.state

    return(

      <div className="ui text segment">  

        <fieldset className="custom-fieldset">
          <legend className="custom-legend">{T.translate("users.form.invite_user_label")}</legend>

          <Form loading={isLoading} onSubmit={this.handleSubmit.bind(this)}>          
            
            { !!errors.message && <div className="ui negative message"><p>{errors.message}</p></div> } 

            <Form.Group error={errors.email}>
              <Form.Field 
                placeholder={T.translate("users.form.email")}
                control={Input}
                name="email" 
                value={email} 
                onChange={(e, {value}) => this.handleChange('email', value)} 
                error={!!errors.email}
              />
              <span className="red">{errors.email}</span>
            </Form.Group>

            <button disabled={isLoading} className="ui primary button">
              <i className="check circle outline icon" aria-hidden="true"></i>&nbsp;{T.translate("users.form.invite_user")}
            </button> 

          </Form>
        </fieldset>  
      </div>

      )
  }
}

FormPage.propTypes = {
  addFlashMessage: PropTypes.func.isRequired
}

export default connect(null, { addFlashMessage }) (graphql(SEND_INVITATION_MUTATION)(FormPage))



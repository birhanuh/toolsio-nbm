import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { Validation } from '../../utils'
import { InputField } from '../../utils/FormFields'
import { addFlashMessage } from '../../actions/flashMessageActions'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

// Localization 
import T from 'i18n-react'

class Form extends Component {

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      errors: {},
      isLoading: false
    }
  }

  handleChange = (e) => {

    if (this.state.errors[e.target.name]) {

      let errors = Object.assign({}, this.state.errors)
      delete errors[e.target.name]

      this.setState({
        [e.target.name]: e.target.value,
        errors
      })
    } else {
      this.setState({
        [e.target.name]: e.target.value
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

          <form className={classnames("ui form", { loading: isLoading })} onSubmit={this.handleSubmit.bind(this)}>          
            
            { !!errors.message && <div className="ui negative message"><p>{errors.message}</p></div> } 

            <InputField
              label=''
              name="email" 
              value={email} 
              onChange={this.handleChange.bind(this)} 
              placeholder="Email"
              error={errors && errors.email}
              formClass="field"
            />

            <button disabled={isLoading} className="ui primary button"><i className="check circle outline icon" aria-hidden="true"></i>&nbsp;{T.translate("users.form.invite_user")}</button> 

          </form>
        </fieldset>  
      </div>

      )
  }
}

Form.propTypes = {
  addFlashMessage: PropTypes.func.isRequired
}

const sendInvitationMutation = gql`
  mutation sendInvitation($email: String!) {
    sendInvitation(email: $email) {
      success
      errors {
        path
        message
      }
    }
  }
`

export default connect(null, { addFlashMessage }) (graphql(sendInvitationMutation)(Form))



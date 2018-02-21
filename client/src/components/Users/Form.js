import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { Validation } from '../../utils'
import { InputField } from '../../utils/FormFields'
import { sendInvitation } from '../../actions/userActions'

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

    if (!!this.state.errors[e.target.name]) {

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

    if (this.isValid()) {
      const { email } = this.state
      this.setState({ isLoading: true })

      this.props.sendInvitation({ email })
        .catch( ({response}) => this.setState({ errors: response.data.errors, isLoading: false }) )
    }
    
  }

  render() {

    const { email, errors, isLoading } = this.state

    return(

      <div className="ui text segment">  

        <fieldset className="custom-fieldset">
          <legend className="custom-legend">{T.translate("account.users.invite_user_message")}</legend>

          <form className={classnames("ui form", { loading: isLoading })} onSubmit={this.handleSubmit.bind(this)}>          
            
            { !!errors && (typeof errors === "string") && <div className="ui negative message"><p>{errors}</p></div> } 

            <InputField
              label=''
              name="email" 
              value={email} 
              onChange={this.handleChange.bind(this)} 
              placeholder="Email"
              error={errors && errors.email}
              formClass="inline field"
            />

            <button disabled={isLoading} className="ui primary button"><i className="check circle outline icon" aria-hidden="true"></i>&nbsp;{T.translate("account.users.invite_user")}</button> 

          </form>
        </fieldset>  
      </div>

      )
  }


}

Form.propTypes = {
  sendInvitation: PropTypes.func.isRequired
}

export default connect(null, { sendInvitation }) (Form)



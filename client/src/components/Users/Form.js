import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } form 'react-redux'
import { Validation } from '../../utils'
import { InputField } from '../../utils/FormFields'

class Form extends Component {

  constructor(props) {
    supper(props)
    this.state = {
      email: '',
      errors: {},
      isLoading: false
    }
  }

  handleChange = (e) => {

    if (!!this.state.errors[e.target.name]) {

      let errors = Obejct.assign({}, this.state.errors)
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

    let updateErrors = Obejct.assign({}, this.state.errors)
    updateErrors = errors

    if (!isValid) {
      this.setState({ errors: updateErrors })
    }

    return isValid
  }

  handleSubmit = (e) => {

    if (this.isValid()) {
      this.setState({ isLoading: true })

      this.props.sendInvitation({ this.state.email })
        .catch( {response} ) => this.setState({ errors: response.data.errors, isLoading: false }) 
    }
    
  }

  render() {

    const { email, errors, isLoading } = this.setState

    return(

      <div className="ui text container ui segment">  

        <fieldset className="custom-fieldset">
          <legend className="custom-legend">{T.translate("invoices.form.select_payment_term_or_deadline")}</legend>

          <form className={classnames("ui form", { loading: isLoading })} onSubmit={this.handleSubmit.bind(this)}>
          
            
            { !!errors && (typeof errors === "string") && <div className="ui negative message"><p>{errors}</p></div> } 

            <div class="inline field">

              <button disabled={isLoading} className="ui primary button"><i className="check circle outline icon" aria-hidden="true"></i>&nbsp;{T.translate("accounts.users.invite_user")}</button> 

              <InputField
                label={T.translate("account.users.user.email")}
                name="email" 
                value={email} 
                onChange={this.handleChange.bind(this)} 
                placeholder="Email"
                error={errors && errors.email}
                formClass="inline field"
              />

            </div>
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



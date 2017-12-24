import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import map from 'lodash/map'
import classnames from 'classnames'
import { Validation } from '../../utils'
import { InputField, SelectField, TextAreaField } from '../../utils/FormFields'

// Localization 
import T from 'i18n-react'

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      _id: this.props.message ? this.props.message._id : null,
      recipientId: this.props.message ? this.props.message.recipientId : '',
      title: this.props.message ? this.props.message.title : '',
      body: this.props.body ? this.props.message.body : '',
      errors: {
        message: {
          errors: {}
        }
      },
      isLoading: false
    }
  }

  handleChange = (e) => {

    if (!!this.state.errors[e.target.name]) {
      // Clone errors form state to local variable
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
    const { errors, isValid } = Validation.validateMessageInput(this.state)

    let updatedErrors = Object.assign({}, this.state.errors)
    updatedErrors.message.errors = errors

    if (!isValid) {
      this.setState({ 
        errors: updatedErrors 
      })
    }

    return isValid;
  }

  handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (true) { 
      const { _id, recipientId, title, body } = this.state
      this.setState({ isLoading: true })
      this.props.createConversation({ _id, recipientId, title, body })
        .catch( ( {response} ) => this.setState({ errors: response.data.errors, isLoading: false }) ) 
    }
  }

  render() {
    const { _id, title, recipientId, body, errors, isLoading } = this.state

    const recipientsOptions = map(this.props.users, (user) => 
      user._id !== this.props.account._id && <option key={user._id} value={user._id}>{user.firstName}</option>
    )

    return (  
      <div className="ui stackable centered grid">
        <div className="fourteen wide column ui segment">  

          <form className={classnames("ui form", { loading: isLoading })} onSubmit={this.handleSubmit.bind(this)}>

            <div className="field">  
               <h1 className="ui header">{T.translate("conversations.form.new_message")}</h1>
            </div>

            { !!errors.message && (typeof errors.message === "string") && <div className="ui negative message"><p>{errors.message}</p></div> }

            <SelectField
              name="recipientId"
              value={recipientId} 
              onChange={this.handleChange.bind(this)} 
              error={errors.message && errors.message.errors && errors.message.errors.recipientId && errors.message.errors.recipientId.message}
              formClass="field"

              options={[<option key="default" value="" disabled>{T.translate("conversations.form.select_recipient")}</option>,
                recipientsOptions]}
            />

            <InputField
              label={T.translate("conversations.form.title")}
              name="title" 
              value={title} 
              onChange={this.handleChange.bind(this)} 
              placeholder={T.translate("conversations.form.title")}
              error={errors.message && errors.message.errors && errors.message.errors.title && errors.message.errors['title'].message}
              formClass="field"
            />
            
            <TextAreaField
              label={T.translate("conversations.form.body")}
              name="body" 
              value={body} 
              onChange={this.handleChange.bind(this)} 
              placeholder={T.translate("conversations.form.body")}
              error={errors.message && errors.message.errors && errors.message.errors.body && errors.message.errors['body'].message}
              formClass="field"
            /> 

            <div className="field">    
              <button disabled={isLoading} className="ui primary button"><i className="send outline icon" aria-hidden="true"></i>&nbsp;{T.translate("conversations.form.send")}</button>
            </div>  
          </form> 
        </div>  
      </div>
    )
  }
}

Form.propTypes = {
  createConversation: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired
}

function mapStateToProp(state) {
  return {
    account: state.authentication.account
  }
}

export default connect(mapStateToProp) (Form)

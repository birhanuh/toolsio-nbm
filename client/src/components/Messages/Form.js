import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import map from 'lodash/map'
import classnames from 'classnames'
import { Validation } from '../../utils'
import { InputField, SelectField, TextAreaField } from '../../utils/FormFields'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

// Localization 
import T from 'i18n-react'

class Form extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      recipientId: '',
      title: '',
      body: '',
      errors: {},
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
    const { errors, isValid } = Validation.validateConversationInput(this.state)

    let updatedErrors = Object.assign({}, this.state.errors)
    updatedErrors = errors

    if (!isValid) {
      this.setState({ 
        errors: updatedErrors 
      })
    }

    return isValid
  }

  handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (this.isValid()) { 
      const { recipientId, title, body } = this.state

      this.setState({ isLoading: true })

      this.props.createMessageMutation({ 
        variables: { title, body, recipientId: parseInt(recipientId) }
        })
        .then(res => {
          // this.props.addFlashMessage({
          //   type: 'success',
          //   text: T.translate("messages.form.flash.success_compose")
          // })  
          // this.context.router.history.push('/conversations')
          

          const { success, sale, errors } = res.data.createMessage

          if (success) {
            this.context.router.history.push('/conversations')
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
    const { id, title, recipientId, body, errors, isLoading } = this.state

    const { getUsers } = this.props.data

    const recipientsOptions = map(getUsers, (user) => 
      //user.id !== this.props.account.id && <option key={user.id} value={user.id}>{user.firstName}</option>
      user.id !== 1 && <option key={user.id} value={user.id}>{user.firstName}</option>
    )

    return (  
      <div className="p-3">  

        <form className={classnames("ui form", { loading: isLoading })} onSubmit={this.handleSubmit.bind(this)}>

          <div className="field">  
             <h1 className="ui header">{T.translate("messages.form.new_message")}</h1>
          </div>

          { !!errors.message && <div className="ui negative message"><p>{errors.message}</p></div> }

          <SelectField
            name="recipientId"
            value={recipientId} 
            onChange={this.handleChange.bind(this)} 
            error={errors.recipientId}
            formClass="field"

            options={[<option key="default" value="" disabled>{T.translate("messages.form.select_recipient")}</option>,
              recipientsOptions]}
          />

          <InputField
            label={T.translate("messages.form.title")}
            name="title" 
            value={title} 
            onChange={this.handleChange.bind(this)} 
            placeholder={T.translate("messages.form.title")}
            error={errors.title}
            formClass="field"
          />
          
          <TextAreaField
            label={T.translate("messages.form.body")}
            name="body" 
            value={body} 
            onChange={this.handleChange.bind(this)} 
            placeholder={T.translate("messages.form.body")}
            error={errors.body}
            formClass="field"
          /> 

          <div className="field">    
            <button disabled={isLoading} className="ui primary button"><i className="send outline icon" aria-hidden="true"></i>&nbsp;{T.translate("messages.form.send")}</button>
          </div>  
        </form> 
      </div> 
    )
  }
}

Form.contextTypes = {
  router: PropTypes.object.isRequired
}

const createMessageMutation = gql`
  mutation createMessage($title: String!, $body: String!, $recipientId: Int!) {
    createMessage(title: $title, body: $body, recipientId: $recipientId ) {
      success
      message {
        id
      } 
      errors {
        path
        message
      }
    }
  }
`

const getUsersQuery = gql`
  {
    getUsers {
      id
      firstName
      lastName
      email
    }
  }
`

const MutationsAndQuery =  compose(
  graphql(createMessageMutation, {
    name : 'createMessageMutation'
  }),
  graphql(getUsersQuery)
)(Form)

export default MutationsAndQuery


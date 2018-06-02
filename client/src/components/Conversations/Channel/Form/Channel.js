import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Validation } from '../../../../utils'
// Semantic UI Form elements
import { Input, Form } from 'semantic-ui-react'
import { graphql, compose } from 'react-apollo'
import { GET_CHANNELS_USERS_COUNT_QUERY, CREATE_CHANNEL_MUTATION } from '../../../../graphql/channels'

// Localization 
import T from 'i18n-react'

class Channel extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      errors: {},
      isLoading: false
    }
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
    const { errors, isValid } = Validation.validateChannelInput(this.state)

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
      const { name } = this.state

      this.setState({ isLoading: true })

      this.props.createChannelMutation({ 
        variables: { name },
        update: (proxy, { data: { createChannel } }) => {
          const { success, channel } = createChannel

          if (!success) {
            return
          }
          // Read the data from our cache for this query.
          const data = proxy.readQuery({ query: GET_CHANNELS_USERS_COUNT_QUERY })
          // Add our comment from the mutation to the end.
          channel.usersCount = 1
          data.getChannelsUsersCount.push(channel)
          // Write our data back to the cache.
          proxy.writeQuery({ query: GET_CHANNELS_USERS_COUNT_QUERY, data })
        }})
        .then(res => {
          const { success, channel, errors } = res.data.createChannel

          if (success) {
            this.props.addFlashMessage({
              type: 'success',
              text: T.translate("messages.form.flash.success_create_channel", { name: channel.name})
            })  

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
    const { name, errors, isLoading } = this.state

    return (   
      <form className={classnames("ui form p-3", { loading: isLoading })} onSubmit={this.handleSubmit.bind(this)}>

        <div className="field">  
           <h1 className="ui header">{T.translate("conversations.form.create_channel")}</h1>
        </div>

        { !!errors.message && <div className="ui negative message"><p>{errors.message}</p></div> }

        <Form.Field>
          <label className={classnames({red: !!errors.name})}>{T.translate("conversations.form.name")}</label>
          <Input 
            placeholder={T.translate("conversations.form.name")}
            name="name" 
            value={name} 
            onChange={(e, {value}) => this.handleChange('name', value)} 
            error={!!errors.name}
            fluid
          />
          <span className="red">{errors.name}</span>
        </Form.Field>
  
        <button disabled={isLoading} className="ui primary button"><i className="check circle outline icon" aria-hidden="true"></i>&nbsp;{T.translate("conversations.form.create")}</button>
        
      </form> 
    )
  }
}

Channel.contextTypes = {
  router: PropTypes.object.isRequired
}

const MutationsAndQuery =  compose(
  graphql(CREATE_CHANNEL_MUTATION, {
    name : 'createChannelMutation'
  }),
  graphql(GET_CHANNELS_USERS_COUNT_QUERY)
)(Channel)

export default MutationsAndQuery


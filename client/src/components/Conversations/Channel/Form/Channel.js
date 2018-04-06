import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Validation } from '../../../../utils'
import { InputField } from '../../../../utils/FormFields'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

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

  handleChange = (e) => {

    if (!this.state.errors[e.target.name]) {
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
          const data = proxy.readQuery({ query: getChannelsQuery })
          // Add our comment from the mutation to the end.
          channel.getUsersCount = 1
          data.getChannels.push(channel)
          // Write our data back to the cache.
          proxy.writeQuery({ query: getChannelsQuery, data })
        }})
        .then(res => {
          // this.props.addFlashMessage({
          //   type: 'success',
          //   text: T.translate("messages.form.flash.success_compose")
          // })  
          // this.context.router.history.push('/conversations')
          

          const { success, channel, errors } = res.data.createChannel

          if (success) {
            this.context.router.history.push('/conversations')
            this.setState({ isLoading: false })
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

        <InputField
          label={T.translate("customers.show.name")}
          name="name" 
          value={name} 
          onChange={this.handleChange.bind(this)} 
          placeholder="Name"
          error={errors.name}
          formClass="field"
        />
  
        <button disabled={isLoading} className="ui primary button"><i className="check circle outline icon" aria-hidden="true"></i>&nbsp;{T.translate("conversations.form.create")}</button>
        
      </form> 
    )
  }
}

Channel.contextTypes = {
  router: PropTypes.object.isRequired
}

const createChannelMutation = gql`
  mutation createChannel($name: String!) {
    createChannel(name: $name) {
      success
      channel {
        id 
        name
      }
      errors {
        path
        message
      }
    }
  }
`

const getChannelsQuery = gql`
  {
    getChannels {
      id
      name
      getUsersCount 
    }
  }
`

const MutationsAndQuery =  compose(
  graphql(createChannelMutation, {
    name : 'createChannelMutation'
  }),
  graphql(getChannelsQuery, {
    name: 'getChannelsQuery'
  })
)(Channel)

export default MutationsAndQuery


import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Validation } from '../../../../utils'
import { Dropdown } from 'semantic-ui-react'
import { graphql, compose } from 'react-apollo'
import { GET_CHANNEL_USERS_QUERY, ADD_MEMBER_MUTATION } from '../../../../graphql/conversations/channels'

// Localization 
import T from 'i18n-react'

class Users extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      members: [],
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
    const { errors, isValid } = Validation.validateAddUserInput(this.state)

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
      const { members } = this.state
      const { channelId } = this.props

      this.setState({ isLoading: true })

      this.props.addMemberMutation({ 
        variables: { members, channelId },
        update: (proxy, { data: { addMember } }) => {
          const { success, member } = addMember

          if (!success) {
            return
          }
          // Read the data from our cache for this query.
          const data = proxy.readQuery({ query: getChannelUsersQuery })
          // Add our comment from the mutation to the end.
          console.log('data ', data)
          data.getChannel.users.push(member)
          // Write our data back to the cache.
          proxy.writeQuery({ query: getChannelUsersQuery, data })
        }})
        .then(res => {
          // this.props.addFlashMessage({
          //   type: 'success',
          //   text: T.translate("messages.form.flash.success_compose")
          // })  
          // this.context.router.history.push('/conversations')          

          const { success, errors } = res.data.addMember

          if (success) {
            this.setState({ isLoading: false })

            // Close modal on success
            this.props.onClose()
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
    const { members, errors, isLoading } = this.state

    const { getUsers } = this.props.data

    const usersOptions = getUsers && getUsers.map(user => 
      ({ key: user.id, value: user.id, text: user.firstName })
    )

    return (   
      <form className={classnames("ui form", { loading: isLoading })} onSubmit={this.handleSubmit.bind(this)}>

        { !!errors.message && <div className="ui negative message"><p>{errors.message}</p></div> }

        { usersOptions &&
          <Dropdown
            name="members"
            value={members} 
            placeholder={T.translate("conversations.form.select_users")} 
            fluid 
            multiple 
            search 
            selection
            className="field"
            options={usersOptions} 
            error={errors.members}
            onChange={(e, {value}) => this.handleChange('members', value)} 
          />
        }

        <button disabled={isLoading} className="ui primary button"><i className="check circle outline icon" 
          aria-hidden="true"></i>&nbsp;{T.translate("conversations.form.add")}</button>
        
      </form> 
    )
  }
}

Users.propTypes = {
  channelId: PropTypes.string.isRequired
}

const MutationsAndQuery =  compose(
  graphql(ADD_MEMBER_MUTATION, {
    name : 'addMemberMutation'
  }),
  graphql(GET_CHANNEL_USERS_QUERY, {
    options: (props) => ({
      variables: {
        id: parseInt(props.channelId)
      }
    })
  })
)(Users)

export default MutationsAndQuery


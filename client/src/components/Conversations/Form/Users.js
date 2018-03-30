import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Validation } from '../../../utils'
import { SelectField } from '../../../utils/FormFields'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

// Localization 
import T from 'i18n-react'

class Users extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      userId: '',
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
      const { userId } = this.state
      const { channelId } = this.props

      this.setState({ isLoading: true })

      this.props.addMemberMutation({ 
        variables: { userId, channelId },
        update: (proxy, { data: { addMember } }) => {
          const { success, member } = addMember

          if (!success) {
            return
          }
          // Read the data from our cache for this query.
          const data = proxy.readQuery({ query: getChannelQuery })
          // Add our comment from the mutation to the end.
          data.getChannel.users.push(member)
          // Write our data back to the cache.
          proxy.writeQuery({ query: getChannelQuery, data })
        }})
        .then(res => {
          // this.props.addFlashMessage({
          //   type: 'success',
          //   text: T.translate("messages.form.flash.success_compose")
          // })  
          // this.context.router.history.push('/conversations')
          

          const { success, member, errors } = res.data.addMember

          if (success) {
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
    const { userId, errors, isLoading } = this.state

    const { getUsers } = this.props.data

    const usersOptions = getUsers && getUsers.map(user => 
      user.id !== 1 && <option key={user.id} value={user.id}>{user.firstName}</option>
    )

    return (   
      <form className={classnames("ui form", { loading: isLoading })} onSubmit={this.handleSubmit.bind(this)}>

        <div className="field">  
           <h1 className="ui header">{T.translate("conversations.form.create_channel")}</h1>
        </div>

        { !!errors.message && <div className="ui negative message"><p>{errors.message}</p></div> }

        <SelectField
            name="userId"
            value={userId} 
            onChange={this.handleChange.bind(this)} 
            error={errors.userId}
            formClass="field"

            options={[<option key="default" value="" disabled>{T.translate("conversations.form.select_users")}</option>,
              usersOptions]}
          />
  
        <button disabled={isLoading} className="ui primary button"><i className="check circle outline icon" 
          aria-hidden="true"></i>&nbsp;{T.translate("conversations.form.add")}</button>
        
      </form> 
    )
  }
}

Users.propTypes = {
  channelId: PropTypes.string.isRequired
}

const addMemberMutation = gql`
  mutation addMember($userId: Int!, $channelId: Int!) {
    addMember(userId: $userId, channelId: $channelId ) {
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

const getChannelQuery = gql`
  query getChannel($id: Int!) {
    getChannel(id: $id) {
      id
      name
      users {
        id
        email
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
  graphql(addMemberMutation, {
    name : 'addMemberMutation'
  }),
  graphql(getChannelQuery, {
    "name": "getChannelQuery",
    options: (props) => ({
      variables: {
        id: parseInt(props.channelId)
      }
    })
  }),
  graphql(getUsersQuery)
)(Users)

export default MutationsAndQuery


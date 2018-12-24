// import React...
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addFlashMessage } from '../../actions/flashMessageActions'
import { Validation } from '../../utils'
import { graphql, compose } from 'react-apollo'
import { GET_EVENTS_QUERY, CREATE_EVENT_MUTATION, UPDATE_EVENT_MUTATION } from '../../graphql/events'

// Semantic UI JS
import { Form as FormElement, Input, TextArea, Modal, Message } from 'semantic-ui-react'

// Localization 
import T from 'i18n-react'

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: this.props.start ? this.props.start : "",
      end: this.props.end ? this.props.end : "",
      id: this.props.id ? this.props.id : null,
      title: this.props.title ? this.props.title : "",
      description: this.props.description ? this.props.description : "",
      url: this.props.url ? this.props.url : "",
      errors: {},
      isValid: false
    }
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {  
    if (nextProps) {
      this.setState({
        start: nextProps.start,
        end: nextProps.end,
        id: nextProps.id,
        title: nextProps.title,
        description: nextProps.description,
        url: nextProps.url
      })
    }
  }

  handleChange = (name, value) => {
    //this.state.event['name'] = event.target.value // WRONG! Never mutate a state in React
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
    const { errors, isValid } = Validation.validateEventInput(this.state)

    let updatedErrors = Object.assign({}, this.state.errors)
    updatedErrors = errors

    if (!isValid) {
      this.setState({ errors: updatedErrors })
    }
  
    return isValid
  }

  handleSubmit = (event) => {
    event.preventDefault()

    // Validation
    if (this.isValid()) { 
      this.setState({ isLoading: true })

      const { start, end, id, title, url, description } = this.state

      if (id) {
        this.props.updateEventMutation({ 
        variables: { id, title, url, description, start, end },
        update: (store, { data: { updateEvent } }) => {
          let { success, event } = updateEvent

          if (!success) {
            return
          }
          // Read the data from our cache for this query.
          const data = store.readQuery({ query: GET_EVENTS_QUERY })

          // Add our event from the mutation to the end.
          let updatedEvents = data.getEvents.map(item => {
            if (item.id === event.id) {
              return {...event, __typename: 'Event'}
            }
            return item
          })

          data.getEvents = updatedEvents

          // Write our data back to the cache.
          store.writeQuery({ query: GET_EVENTS_QUERY, data })
        }})
        .then(res => {      
          const { success, event, errors } = res.data.updateEvent

          if (success) {
            this.props.addFlashMessage({
              type: 'success',
              text: T.translate("events.form.flash.success_update", { title: event.title})
            })  

            this.setState({ isLoading: false })
            this.props.toggleConfirmationModal()
          } else {
            let errorsList = {}
            errors.map(error => errorsList[error.path] = error.message)

            this.setState({ errors: errorsList, isLoading: false })
          }
        })
        .catch(err => this.setState({ errors: err, isLoading: false }))
      } else {
       
        this.props.createEventMutation({ 
          variables: { start, end, id, title, url, description },
          update: (store, { data: { createEvent } }) => {
            const { success, event } = createEvent

            if (!success) {
              return
            }
            // Read the data from our cache for this query.
            const data = store.readQuery({ query: GET_EVENTS_QUERY })

            // Add our comment from the mutation to the end.
            data.getEvents.push(event)
            // Write our data back to the cache.
            store.writeQuery({ query: GET_EVENTS_QUERY, data })
          }})
          .then(res => {          

            const { success, event, errors } = res.data.createEvent

            if (success) {
              this.props.addFlashMessage({
                type: 'success',
                text: T.translate("events.form.flash.success_create", { title: event.title})
              })  

              this.setState({ isLoading: false })
              this.props.toggleConfirmationModal()
            } else {
              let errorsList = {}
              errors.map(error => errorsList[error.path] = error.message)

              this.setState({ errors: errorsList, isLoading: false })
            }
          })
          .catch(err => this.setState({ errors: err, isLoading: false }))
      }
    }    
  }

  render() {
    const { id, title, description, url, errors, isLoading } = this.state
    const { openConfirmationModal, toggleConfirmationModal } = this.props

    return (
      <Modal 
        key="modal" 
        className="ui small modal event"
        open={openConfirmationModal}>
        <Modal.Header>  
           { id ? T.translate("events.form.edit_event") : T.translate("events.form.new_event") }
        </Modal.Header>
        <Modal.Content>
          <FormElement loading={isLoading}>

            { !!errors.message && <Message negative><p>{errors.message}</p></Message> } 
            
            <FormElement.Field error={!!errors.title}>
              <label>{T.translate("events.form.title")}</label>
              <Input
                placeholder={T.translate("events.form.title")}
                name="title" 
                value={title} 
                onChange={(e, {value}) => this.handleChange('title', value)} 
                error={!!errors.title}
              />
              <span className="red">{errors.title}</span>
            </FormElement.Field>

            <FormElement.Field error={!!errors.url}>
              <label>{T.translate("events.form.url")}</label>
              <Input
                placeholder={T.translate("events.form.url")}
                name="url" 
                value={url} 
                onChange={(e, {value}) => this.handleChange('url', value)} 
                error={!!errors.url}
              />
              <span className="red">{errors.url}</span>
            </FormElement.Field>
            
            <FormElement.Field>  
              <label>{T.translate("events.form.description")}</label>
              <TextArea
                placeholder={T.translate("events.form.description")}
                name="description" 
                value={description} 
                onChange={(e, {value}) => this.handleChange('description', value)} 
              />
            </FormElement.Field>

          </FormElement>
        </Modal.Content>
        <Modal.Actions>
          <button className="ui button" onClick={toggleConfirmationModal}>{T.translate("events.form.cancel")}</button>
          <button disabled={isLoading} className="ui primary button" onClick={this.handleSubmit.bind(this)}>
            <i className="check circle outline icon" aria-hidden="true"></i>&nbsp;{T.translate("events.form.save")}
          </button>
        </Modal.Actions>
      </Modal>)
  }

}

Form.propTypes = {
  addFlashMessage: PropTypes.func.isRequired,
  start: PropTypes.object,
  end: PropTypes.object,
  title: PropTypes.string,
  description: PropTypes.string,
  url: PropTypes.string,
  openConfirmationModal: PropTypes.bool.isRequired
}

const Mutations =  compose(
  graphql(CREATE_EVENT_MUTATION, {
    name : 'createEventMutation'
  }),
  graphql(UPDATE_EVENT_MUTATION, {
    name: 'updateEventMutation'
  })
)(Form)

export default connect(null, { addFlashMessage } ) (Mutations)



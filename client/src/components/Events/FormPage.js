// import React...
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Validation } from '../../utils'

// Semantic UI JS
import { Form, Input, TextArea, Modal } from 'semantic-ui-react'

// Localization 
import T from 'i18n-react'

class FormPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      url: "",
      errors: {},
      isValid: false
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

  handleSubmit = async (event) => {
     event.preventDefault()

    // Validation
    if (this.isValid()) { 
      this.setState({ isLoading: true })

      const { id, title, url, description } = this.state
      const { start, end } = this.props

      if (id) {
        this.props.updateEventMutation({ 
        variables: { id, title, url, description, start, end },
        update: (store, { data: { updateEvent } }) => {
          let { success, event } = updateEvent

          if (!success) {
            return
          }
          // Read the data from our cache for this query.
          const data = store.readQuery({ query: GET_PROJECTS_QUERY,
            variables: {
              order: 'DESC',
              offset: 0,
              limit: 10
            }
          })
          // Add our comment from the mutation to the end.

          let updatedEvents = data.getEvents.map(item => {
            if (item.id === event.id) {
              return {...event, __typename: 'Event'}
            }
            return item
          })

          data.getEvents = updatedEvents

          // Write our data back to the cache.
          store.writeQuery({ query: GET_PROJECTS_QUERY, data })
        }})
        .then(res => {          

          const { success, event, errors } = res.data.updateEvent

          if (success) {
            this.props.addFlashMessage({
              type: 'success',
              text: T.translate("events.form.flash.success_update", { title: event.title})
            })  

            this.context.router.history.push('/events')
          } else {
            let errorsList = {}
            errors.map(error => errorsList[error.path] = error.message)

            this.setState({ errors: errorsList, isLoading: false })
          }
        })
        .catch(err => this.setState({ errors: err, isLoading: false }))
      } else {
       
        this.props.createEventMutation({ 
          variables: { id, title, url, description, start, end },
          update: (store, { data: { createEvent } }) => {
            const { success, event } = createEvent

            if (!success) {
              return
            }
            // Read the data from our cache for this query.
            const data = store.readQuery({ query: GET_PROJECTS_QUERY,
              variables: {
                order: 'DESC',
                offset: 0,
                limit: 10
              } 
            })
            // Add our comment from the mutation to the end.
            data.getEvents.push(event)
            // Write our data back to the cache.
            store.writeQuery({ query: GET_PROJECTS_QUERY, data })
          }})
          .then(res => {          

            const { success, event, errors } = res.data.createEvent

            if (success) {
              this.props.addFlashMessage({
                type: 'success',
                text: T.translate("events.form.flash.success_create", { title: event.title})
              })  

              this.context.router.history.push('/events')
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
          <Form loading={isLoading} onSubmit={this.handleSubmit.bind(this)}>

            { !!errors.message && <div className="ui negative message"><p>{errors.message}</p></div> } 
            
            <Form.Field error={!!errors.name}>
              <label>{T.translate("events.form.title")}</label>
              <Input
                placeholder={T.translate("events.form.title")}
                name="title" 
                value={title} 
                onChange={(e, {value}) => this.handleChange('title', value)} 
                error={!!errors.title}
              />
              <span className="red">{errors.title}</span>
            </Form.Field>

            <Form.Field error={!!errors.url}>
              <label>{T.translate("events.form.url")}</label>
              <Input
                placeholder={T.translate("events.form.url")}
                name="url" 
                value={url} 
                onChange={(e, {value}) => this.handleChange('url', value)} 
                error={!!errors.url}
              />
              <span className="red">{errors.url}</span>
            </Form.Field>
            
            <Form.Field>  
              <label>{T.translate("events.form.description")}</label>
              <TextArea
                placeholder={T.translate("events.form.description")}
                name="description" 
                value={description} 
                onChange={(e, {value}) => this.handleChange('description', value)} 
              />
            </Form.Field>

          </Form>
        </Modal.Content>
        <Modal.Actions>
          <button className="ui button" onClick={toggleConfirmationModal}>{T.translate("events.form.cancel")}</button>
          <button disabled={isLoading} className="ui primary button">
            <i className="check circle outline icon" aria-hidden="true"></i>&nbsp;{T.translate("events.form.save")}
          </button>
        </Modal.Actions>
      </Modal>)
  }

}

FormPage.propTypes = {
  start: PropTypes.object.isRequired,
  end: PropTypes.object.isRequired,
  openConfirmationModal: PropTypes.bool.isRequired
}

export default FormPage



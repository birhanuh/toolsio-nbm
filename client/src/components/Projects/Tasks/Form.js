import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { Validation } from '../../../utils'
import { addFlashMessage } from '../../../actions/flashMessageActions'
import AddTaskTr from './AddTaskTr'
import ShowEditTaskTr from './ShowEditTaskTr'
import { graphql, compose } from 'react-apollo'
import { GET_PROJECT_QUERY } from '../../../queries/projectQueriesMutations'
import { CREATE_TASK_MUTATION, UPDATE_TASK_MUTATION, DELETE_TASK_MUTATION } from '../../../queries/taskQueriesMutations'

// Localization 
import T from 'i18n-react'

import $ from 'jquery'

// Modal
$.fn.modal = require('semantic-ui-modal')
$.fn.dimmer = require('semantic-ui-dimmer')

class Form extends Component {
   constructor(props) {
    super(props)
    this.state = {
      taskToBeDeleated: {},
      newTask: {
        projectId: this.props.projectId,
        name: "",
        paymentType: "",
        hours: "",
        price: "",
        vat: "",
        errors: {},
        isLoading: false
      },
      editTask: {
        id: null,
        projectId: this.props.projectId,
        name: "",
        paymentType: "",
        hours: "",
        price: "",
        vat: "",
        errors: {},
        isLoading: false
      }
    }
  }

  handleNewTaskChange = (name, value) => {
    if (this.state.newTask.errors[name]) {
      let errors = Object.assign({}, this.state.newTask.errors)
      delete errors[name]

      let updatedTask = Object.assign({}, this.state.newTask)
      updatedTask[name] = value
      updatedTask.errors = errors 

      this.setState({
        newTask: updatedTask
      })
    } else {
      let updatedTask = Object.assign({}, this.state.newTask)
      updatedTask.projectId = this.props.projectId
      updatedTask[name] = value

      this.setState({
        newTask: updatedTask
      })
    }
  }

  isValidNewTask() {
    const { errors, isValid } = Validation.validateTaskInput(this.state.newTask)
    
    if (!isValid) {
      let updatedTask = Object.assign({}, this.state.newTask)
      updatedTask.errors = errors
      this.setState({
        newTask: updatedTask
      })
    }

    return isValid
  }

  handleCreate(event) {
    event.preventDefault()

    // Validation
    if (this.isValidNewTask()) { 
      const { projectId, name, paymentType, hours, price, vat } = this.state.newTask

      this.props.createTaskMutation({ 
        variables: { projectId, name, paymentType, hours, price, vat },
        update: (store, { data: { createTask } }) => {
          const { success, task } = createTask

          if (!success) {
            return
          }
          
          // Read the data from our cache for this query.
          const data = store.readQuery({ query: GET_PROJECT_QUERY,
            variables: {
              id: projectId,
            }
          })
          // Add our comment from the mutation to the end.
          data.getProject.tasks.push(task)
          // Write our data back to the cache.
          store.writeQuery({ query: GET_PROJECT_QUERY, data }) 
        }})
        .then(res => {

          const { success, task, errors } = res.data.createTask

          if (success) {
            let updatedTask = Object.assign({}, this.state.newTask)
            updatedTask.projectId = null
            updatedTask.name = ""
            updatedTask.paymentType = ""
            updatedTask.hours = ""
            updatedTask.price = ""
            updatedTask.vat = ""
            updatedTask.isLoading = false
            
            this.setState({
              newTask: updatedTask
            })

            this.props.addFlashMessage({
              type: 'success',
              text: T.translate("projects.tasks.form.flash.success_add", { name: task.name})
            })
          } else {
            let errorsList = {}
            errors.map(error => errorsList[error.path] = error.message)

            let updatedTask = Object.assign({}, this.state.newTask)
            updatedTask.errors = errorsList
            updatedTask.isLoading = false
            
            this.setState({ newTask: updatedTask })
          }

        })
        .catch(err => {
          let updatedTask = Object.assign({}, this.state.newTask)
          updatedTask.errors = err 
          updatedTask.isLoading = false

          this.setState({ newTask: updatedTask })
        })
        
    }
  }

  handleEditTaskChange = (name, value, task) => {
    if (this.state.editTask.errors[name]) {
      let errors = Object.assign({}, this.state.editTask.errors)
      delete errors[name]

      let updatedTask = Object.assign({}, this.state.editTask)
      updatedTask.id = task.id
      updatedTask.projectId = task.projectId
      updatedTask[name] = value

      this.setState({
        editTask: updatedTask
      })
    } else {
      let updatedTask = Object.assign({}, this.state.editTask)
      updatedTask.id = task.id
      updatedTask.projectId = task.projectId
      updatedTask[name] = value
      
      this.setState({
        editTask: updatedTask
      })
    }
  }

  handleEdit(task, event) {
    event.preventDefault()

    //Hide show tr and show edit tr
    $('#'+task.id+' td.show-task').hide()
    $('#'+task.id+' td.edit-task').show()
    
    let updatedTask = Object.assign({}, this.state.editTask)
    updatedTask.id = task.id
    updatedTask.projectId = task.projectId
    updatedTask.name = task.name
    updatedTask.paymentType = task.paymentType
    updatedTask.hours = task.hours
    updatedTask.price = task.price
    updatedTask.vat = task.vat
    this.setState({
      editTask: updatedTask
    })
  }

  handleCancelEdit(task, event) {
    event.preventDefault()

    // Hide edit tr and show show tr
    $('#'+task.id+' td.edit-task').hide()
    $('#'+task.id+' td.show-task').show()    
  }

  isValidEditTask() {
    const { errors, isValid } = Validation.validateTaskInput(this.state.editTask)
    
    if (!isValid) {
      let updatedTask = Object.assign({}, this.state.editTask)
      updatedTask.errors.message.errors = errors
      this.setState({
        editTask: updatedTask
      })
    }

    return isValid
  }

  handleUpdate(event) {
    event.preventDefault()

    // Validation
    if (this.isValidEditTask()) { 
      const { id, projectId, name, paymentType, hours, price, vat } = this.state.editTask
      
      this.props.updateTaskMutation({ 
        variables: { id, projectId, name, paymentType, hours, price, vat },
        update: (store, { data: { updateTask } }) => {
          const { success, task } = updateTask

          if (!success) {
            return
          }
          
          // Read the data from our cache for this query.
          const data = store.readQuery({ query: GET_PROJECT_QUERY,
              variables: {
                id: projectId,
              }
             })
          // Add our comment from the mutation to the end.
          let updatedTasks = data.getProject.tasks.map(item => {
            if (item.id === task.id) {
              return {...task, __typename: 'Task'}
            }
            return item
          })
          data.getProject.tasks = updatedTasks
      
          // Write our data back to the cache.
          store.writeQuery({ query: GET_PROJECT_QUERY, data }) 
        }})
        .then(res => {

          const { success, task, errors } = res.data.updateTask

          if (success) {
            let updatedTask = Object.assign({}, this.state.editTask)
            updatedTask.projectId = null
            updatedTask.name = ""
            updatedTask.paymentType = ""
            updatedTask.hours = ""
            updatedTask.price = ""
            updatedTask.vat = ""
            updatedTask.isLoading = false
            
            this.setState({
              editTask: updatedTask
            })

            this.props.addFlashMessage({
              type: 'success',
              text: T.translate("projects.tasks.form.flash.success_update", { name: name})
            })
            
            // Hide edit tr and show show tr
            $('#'+task.id+' td.edit-task').hide()
            $('#'+task.id+' td.show-task').show()  
          } else {
            let errorsList = {}
            errors.map(error => errorsList[error.path] = error.message)

            let updatedTask = Object.assign({}, this.state.editTask)
            updatedTask.errors = errorsList
            updatedTask.isLoading = false
            
            this.setState({ editTask: updatedTask })
          }

        })
        .catch(err => {
          let updatedTask = Object.assign({}, this.state.editTask)
          updatedTask.errors = err 
          updatedTask.isLoading = false

          this.setState({ editTask: updatedTask })
        })
    }
  }

  showConfirmationModal(task, event) {
    event.preventDefault()
    
    this.setState({
      taskToBeDeleated: task
    })

    // Show modal
    $('.small.modal.task').modal('show')
  }
    
  hideConfirmationModal(event) {
    event.preventDefault()

    // Show modal
    $('.small.modal.task').modal('hide')
  }

  handleDelete(task, event) {
    event.preventDefault()
    
    const { id, name } = task
    const { projectId } = this.props

    this.props.deleteTaskMutation({ 
      variables: { id },
      update: (proxy, { data: { deleteTask } }) => {
        const { success } = deleteTask

        if (!success) {
          return
        }
        // Read the data from our cache for this query.
        const data = proxy.readQuery({ query: GET_PROJECT_QUERY,
            variables: {
              id: projectId,
            }
          })
        // Add our comment from the mutation to the end.
   
        let updatedTasks = data.getProject.tasks.filter(task => task.id !== id) 
        data.getProject.tasks = updatedTasks
 
        // Write our data back to the cache.
        proxy.writeQuery({ query: GET_PROJECT_QUERY, data })
      }})
      .then(res => {          

        const { success, project, errors } = res.data.deleteTask

        if (success) {
          this.props.addFlashMessage({
            type: 'success',
            text: T.translate("projects.tasks.form.flash.success_delete", { name: project.name})
          })  

          this.setState({ itemToBeDeleated: {} })
        } else {
          let errorsList = {}
          errors.map(error => errorsList[error.path] = error.message)

          this.setState({ errors: errorsList, isLoading: false })
        }
      })
      .catch(() => {
        this.props.addFlashMessage({
          type: 'error',
          text: T.translate("projects.tasks.form.flash.error_delete", { name: name})
        })  

        this.setState({ errors: err, isLoading: false })  
      }) 
  }

  render() {
    const { newTask, editTask } = this.state

    const { tasks, total } = this.props
    

    const tasksList = (
      tasks.map(task => 
        <ShowEditTaskTr 
          key={task.id}
          task={task} 
          editTask={editTask}
          handleCancelEdit={this.handleCancelEdit.bind(this, task)}
          handleEditTaskChange={this.handleEditTaskChange} 
          handleUpdate={this.handleUpdate.bind(this)}
          handleEdit={this.handleEdit.bind(this, task)}
          showConfirmationModal={this.showConfirmationModal.bind(this, task)}/> 
        )
    )

    return(
      <form className={classnames("ui small form", { loading: newTask.isLoading || editTask.isRequired })}>
        <table className="ui very basic table tasks">
          <thead>
            <tr>
              <th>{T.translate("projects.tasks.form.name")}</th>
              <th>{T.translate("projects.tasks.form.payment_type")}</th>
              <th>{T.translate("projects.tasks.form.hours")}</th>
              <th>{T.translate("projects.tasks.form.price")}</th>
              <th>{T.translate("projects.tasks.form.vat")}</th>
              <th width="110px">{T.translate("projects.tasks.form.actions")}</th>
            </tr>
          </thead>
          <tbody>

            { tasks.length !== 0 && tasksList }
            
            <AddTaskTr
              task={newTask} 
              handleNewTaskChange={this.handleNewTaskChange} 
              handleCreate={this.handleCreate.bind(this)} /> 
            
            <tr>
              <td colSpan="3"><strong>{T.translate("projects.tasks.form.total")}</strong></td>
              <td><strong>{total}</strong></td>
              <td></td>
              <td></td>
            </tr>

          </tbody>
        </table>
        <div className="ui small modal task">
          <div className="header">Confirmation</div>
          <div className="content">
            <p className="red">{T.translate("projects.tasks.form.confirmation_msg")}</p>
          </div>
          <div className="actions">
            <button className="ui button" onClick={this.hideConfirmationModal.bind(this)}>{T.translate("projects.tasks.cancel")}</button>
            <button className="ui negative button" onClick={this.handleDelete.bind(this, this.state.taskToBeDeleated)}>{T.translate("projects.tasks.delete")}</button>
          </div>
        </div>
      </form>
    )
  }
  
}

Form.propTypes = {
  tasks: PropTypes.array.isRequired,
  projectId: PropTypes.number.isRequired,
  addFlashMessage: PropTypes.func.isRequired
}

const Mutations =  compose(
  graphql(CREATE_TASK_MUTATION, {
    name : 'createTaskMutation'
  }),
  graphql(UPDATE_TASK_MUTATION, {
    name : 'updateTaskMutation'
  }),
  graphql(DELETE_TASK_MUTATION, {
    name : 'deleteTaskMutation'
  })
)(Form)

export default connect(null, { addFlashMessage } ) (Mutations)

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { Validation } from '../../../utils'
import { addFlashMessage } from '../../../actions/flashMessageActions'
import { AddElement, ShowEditElement } from './Tr'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

// Localization 
import T from 'i18n-react'

import $ from 'jquery'

// Modal
$.fn.modal = require('semantic-ui-modal')
$.fn.dimmer = require('semantic-ui-dimmer')

class Task extends Component {
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
        projectId: null,
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

  handleNewTaskChange = (e) => {
    if (!this.state.newTask.errors[e.target.name]) {
      let errors = Object.assign({}, this.state.newTask.errors)
      delete errors[e.target.name]

      let updatedTask = Object.assign({}, this.state.newTask)
      updatedTask.projectId = this.props.projectId
      updatedTask[e.target.name] = e.target.value

      this.setState({
        newTask: updatedTask,
        errors
      })
    } else {
      let updatedTask = Object.assign({}, this.state.newTask)
      updatedTask.projectId = this.props.projectId
      updatedTask[e.target.name] = e.target.value

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
        update: (proxy, { data: { createTask } }) => {
          const { success, task } = createTask

          if (!success) {
            return
          }
          /*
          // Read the data from our cache for this query.
          const data = proxy.readQuery({ query: getProjectQuery })
          // Add our comment from the mutation to the end.
          data.getProject.tasks.push(task)
          // Write our data back to the cache.
          proxy.writeQuery({ query: getProjectQuery, data }) */
        }})
        .then(res => {
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

          // this.props.addFlashMessage({
          //   type: 'success',
          //   text: T.translate("projects.tasks.form.flash.success_add", { name: name})
          // })

          const { success, task, errors } = res.data.createTask

          if (!success) {
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

  handleEditTaskChange = (task, e) => {
    if (!this.state.editTask.errors.message.errors[e.target.name]) {
      let errors = Object.assign({}, this.state.editTask.errors)
      delete errors.message.errors[e.target.name]

      let updatedTask = Object.assign({}, this.state.editTask)
      updatedTask.id = task.id
      updatedTask.projectId = task.projectId
      updatedTask[e.target.name] = e.target.value

      this.setState({
        editTask: updatedTask,
        errors
      })
    } else {
      let updatedTask = Object.assign({}, this.state.editTask)
      updatedTask.id = task.id
      updatedTask.projectId = task.projectId
      updatedTask[e.target.name] = e.target.value

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
        update: (proxy, { data: { updateTask } }) => {
          const { success, task } = updateTask

          if (!success) {
            return
          }
          /*
          // Read the data from our cache for this query.
          const data = proxy.readQuery({ query: getProjectQuery })
          // Add our comment from the mutation to the end.
          data.getProject.tasks.push(task)
          // Write our data back to the cache.
          proxy.writeQuery({ query: getProjectQuery, data }) */
        }})
        .then(res => {
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

          // this.props.addFlashMessage({
          //   type: 'success',
          //   text: T.translate("projects.tasks.form.flash.success_add", { name: name})
          // })

          const { success, task, errors } = res.data.updateTask

          if (!success) {
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
    
    let name = task.name

    this.props.deleteTask(task).then(
      () => {
        this.setState({
          taskToBeDeleated: {}
        })

        this.props.addFlashMessage({
          type: 'success',
          text: T.translate("projects.tasks.form.flash.success_delete", { name: name})
        })  
      },
      ({ response }) => {
      }
    ) 
  }

  render() {
    const { newTask, editTask } = this.state
  
    let tasks = this.props.tasks   
    
    const tasksList = (
      tasks.map(task => 
        <ShowEditElement 
          key={task.id}
          task={task} 
          editTask={editTask}
          handleCancelEdit={this.handleCancelEdit.bind(this, task)}
          handleEditTaskChange={this.handleEditTaskChange.bind(this, task)} 
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
            
            <AddElement 
              task={newTask} 
              handleNewTaskChange={this.handleNewTaskChange.bind(this)} 
              handleCreate={this.handleCreate.bind(this)} /> 
            
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

Task.propTypes = {
  tasks: PropTypes.array.isRequired,
  projectId: PropTypes.number.isRequired,
  //addFlashMessage: PropTypes.func.isRequired
}

const createTaskMutation = gql`
  mutation createTask($name: String!, $hours: String!, $paymentType: String!, $price: Float!, $vat: Int!, $projectId: Int!) {
    createTask(name: $name, hours: $hours, paymentType: $paymentType, price: $price, vat: $vat, projectId: $projectId) {
      success
      task {
        id
        name
        hours
        paymentType
        price
        vat
      }
      errors {
        path
        message
      }
    }
  }
`

const updateTaskMutation = gql`
  mutation updateTask($id: id, $name: String!, $hours: String!, $paymentType: String!, $price: Float!, $vat: Int!, $projectId: Int!) {
    updateTask(id: $id, name: $name, hours: $hours, paymentType: $paymentType, price: $price, vat: $vat, projectId: $projectId) {
      success
      task {
        id
        name
        hours
        paymentType
        price
        vat
      }
      errors {
        path
        message
      }
    }
  }
`

// const getProjectQuery = gql`
//   query getProject($id: Int!) {
//     getProject(id: $id) {
//       id
//       name 
//       deadline
//       status
//       progress
//       description
//       customer {
//         id
//         name
//       }
//       tasks {
//         id
//         name
//         hours
//         paymentType
//         price
//         vat
//       }
//     }
//   }
// `
// const MutationsAndQuery =  compose(
//   graphql(createTaskMutation, {
//     name : 'createTaskMutation'
//   }),
//   graphql(getProjectQuery, {
//     name: 'getProjectQuery',
//     options: (props) => ({
//       variables: {
//         id: props.match.params.id 
//       }
//     })
//   })
// )(Task)

// export default MutationsAndQuery

const MutationsAndQuery =  compose(
  graphql(createTaskMutation, {
    name : 'createTaskMutation'
  }),
   graphql(updateTaskMutation, {
    name : 'updateTaskMutation'
  })
)(Task)

export default MutationsAndQuery

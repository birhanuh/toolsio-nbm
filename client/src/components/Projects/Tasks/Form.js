import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { Validation } from '../../../utils'
import { createTask, updateTask, deleteTask } from '../../../actions/projectActions'
import { addFlashMessage } from '../../../actions/flashMessagesActions'
import { AddElement, ShowEditElement } from './Tr'

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
        _creator: this.props.creator,
        name: "",
        paymentType: "",
        hours: "",
        price: "",
        vat: "",
        errors: {
          message: {
            errors: {}
          }
        },
        isLoading: false
      },
      editTask: {
        _id: null,
        _creator: null,
        name: "",
        paymentType: "",
        hours: "",
        price: "",
        vat: "",
        errors: {
          message: {
            errors: {}
          }
        },
        isLoading: false
      }
    }
  }

  handleNewTaskChange = (e) => {
    if (!!this.state.newTask.errors.message.errors[e.target.name]) {
      let errors = Object.assign({}, this.state.newTask.errors)
      delete errors.message.errors[e.target.name]

      let updatedTask = Object.assign({}, this.state.newTask)
      updatedTask._creator = this.props.creator
      updatedTask[e.target.name] = e.target.value

      this.setState({
        newTask: updatedTask,
        errors
      })
    } else {
      let updatedTask = Object.assign({}, this.state.newTask)
      updatedTask._creator = this.props.creator
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
      updatedTask.errors.message.errors = errors
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
      const { _creator, name, paymentType, hours, price, vat } = this.state.newTask

      let updatedTask = Object.assign({}, this.state.newTask)
      updatedTask.isLoading = true
       this.setState({
        newTask: updatedTask
      })
      this.props.createTask({ _creator, name, paymentType, hours, price, vat }).then(
        () => {
          let updatedTask = Object.assign({}, this.state.newTask)
          updatedTask._creator = null
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
            text: T.translate("projects.tasks.form.flash.success_add", { name: name})
          })
        },
        ({ response }) => {
          let updatedTask = Object.assign({}, this.state.newTask)
          updatedTask.errors.message.errors = response.data.errors.message.errors
          updatedTask.isLoading = false
          this.setState({ newTask: updatedTask })
        }
      )  
    }
  }

  handleEditTaskChange = (task, e) => {
    if (!!this.state.editTask.errors.message.errors[e.target.name]) {
      let errors = Object.assign({}, this.state.editTask.errors)
      delete errors.message.errors[e.target.name]

      let updatedTask = Object.assign({}, this.state.editTask)
      updatedTask._id = task._id
      updatedTask._creator = task._creator
      updatedTask[e.target.name] = e.target.value

      this.setState({
        editTask: updatedTask,
        errors
      })
    } else {
      let updatedTask = Object.assign({}, this.state.editTask)
      updatedTask._id = task._id
      updatedTask._creator = task._creator
      updatedTask[e.target.name] = e.target.value

      this.setState({
        editTask: updatedTask
      })
    }
  }

  handleEdit(task, event) {
    event.preventDefault()

    //Hide show tr and show edit tr
    $('#'+task._id+' td.show-task').hide()
    $('#'+task._id+' td.edit-task').show()
    
    let updatedTask = Object.assign({}, this.state.editTask)
    updatedTask._id = task._id
    updatedTask._creator = task._creator
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
    $('#'+task._id+' td.edit-task').hide()
    $('#'+task._id+' td.show-task').show()    
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
      const { _id, _creator, name, paymentType, hours, price, vat } = this.state.editTask
      
      let updatedTask = Object.assign({}, this.state.editTask)
      updatedTask.isLoading = true
       this.setState({
        editTask: updatedTask
      })
      this.props.updateTask({ _id, _creator, name, paymentType, hours, price, vat }).then(
        (response) => {
          let updatedTask = Object.assign({}, this.state.editTask)
          updatedTask.isLoading = false
          this.setState({
            editTask: updatedTask
          })

          this.props.addFlashMessage({
            type: 'success',
            text: T.translate("projects.tasks.form.flash.success_update", { name: name})
          })

          // Hide edit tr and show show tr
          $('#'+_id+' td.edit-task').hide()
          $('#'+_id+' td.show-task').show()   
        },
        ({ response }) => {
          let updatedTask = Object.assign({}, this.state.editTask)
          updatedTask.errors.message.errors = response.data.errors.message.errors
          updatedTask.isLoading = false
          this.setState({ editTask: updatedTask })
        }
      )  
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
          key={task._id}
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
  creator: PropTypes.string.isRequired,
  createTask: PropTypes.func.isRequired,
  updateTask: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired
}

export default connect(null, { createTask, updateTask, deleteTask, addFlashMessage } )(Task)

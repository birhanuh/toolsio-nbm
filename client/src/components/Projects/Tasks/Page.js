import React, { Component } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { Validation } from '../../../utils'
import { createTask, updateTask, deleteTask } from '../../../actions/projectActions'
import { addFlashMessage } from '../../../actions/flashMessages'
import { NewForm, EditForm } from './Form'

// Localization 
import T from 'i18n-react'

import $ from 'jquery'

class Task extends Component {
   constructor(props) {
    super(props)
    this.state = {
      newTask: {
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

  handleChange = (e) => {
    if (!!this.state.newTask.errors.message.errors[e.target.name]) {
      let errors = Object.assign({}, this.state.newTask.errors)
      delete errors.message.errors[e.target.name]

      let updatedTask = Object.assign({}, this.state.newTask)
      updatedTask._creator = this.state._id
      updatedTask[e.target.name] = e.target.value

      this.setState({
        newTask: updatedTask,
        errors
      })
    } else {
      let updatedTask = Object.assign({}, this.state.newTask)
      updatedTask._creator = this.state._id
      updatedTask[e.target.name] = e.target.value

      this.setState({
        newTask: updatedTask
      })
    }
  }

  isValid() {
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

  handleSubmit(event) {
     event.preventDefault()
     
    // Validation
    if (this.isValid()) { 
      const { newTask } = this.state
      let updatedTask = Object.assign({}, this.state.newTask)
      updatedTask.isLoading = true
       this.setState({
        newTask: updatedTask
      })
      this.props.createTask({ newTask }).then(
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
            text: 'Task added'
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

  handleEdit(task, event) {
    event.preventDefault()

    //Hide show tr and show edit tr
    $('#'+task._id+' td .show-item').hide()
    $('#'+task._id+' td .edit-item').show()

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

    // Hide show tr and show edit tr
    $('#'+task._id+' td .edit-item').hide()
    $('#'+task._id+' td .show-item').show()

    
  }

  handleDelete(task, event) {
    event.preventDefault()

    
  }

  handleUpdate(event) {
    event.preventDefault()
    event.stopPropagation()

    // Validation
    if (this.isValid()) { 
      const { task } = this.state
      let updatedTask = Object.assign({}, this.state.editTask)
      updatedTask.isLoading = true
       this.setState({
        editTask: updatedTask
      })
      this.props.updateTask({ task }).then(
        () => {
          let updatedTask = Object.assign({}, this.state.editTask)
          updatedTask.isLoading = false
          this.setState({
            editTask: updatedTask
          })

          this.props.addFlashMessage({
            type: 'success',
            text: 'Task updated'
          })
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

  render() {
    const { newTask, editTask } = this.state
  
    let tasks = this.props.tasks   
    
    const tasksList = (
      tasks.map(task => <EditForm key={task._id} task={task} editTask={editTask} handleEdit={this.handleEdit.bind(this, task)} 
        handleCancelEdit={this.handleCancelEdit.bind(this, task)} handleDelete={this.handleDelete.bind(this, task)}
        handleUpdate={this.handleUpdate.bind(this, task)} handleChange={this.handleChange} />)
    )

    return(
      <form className={classnames("ui small form", { loading: newTask.isLoading })} onSubmit={this.handleSubmit.bind(this)}>
        <table className="ui very basic table task">
          <thead>
            <tr>
              <th>{T.translate("projects.tasks.new.name")}</th>
              <th>{T.translate("projects.tasks.new.payment_type")}</th>
              <th>{T.translate("projects.tasks.new.hours")}</th>
              <th>{T.translate("projects.tasks.new.price")}</th>
              <th>{T.translate("projects.tasks.new.vat")}</th>
              <th width="110px">{T.translate("projects.tasks.new.actions")}</th>
            </tr>
          </thead>
          <tbody>

            { tasks.length !== 0 && tasksList }
            
            <NewForm task={newTask} handleChange={this.handleChange} /> 
            
          </tbody>
        </table>
      </form>
    )
  }
  
}

Task.propTypes = {
  tasks: React.PropTypes.array.isRequired,
  createTask: React.PropTypes.func.isRequired,
  updateTask: React.PropTypes.func.isRequired,
  deleteTask: React.PropTypes.func.isRequired,
  addFlashMessage: React.PropTypes.func.isRequired
}

export default connect(null, { createTask, updateTask, deleteTask, addFlashMessage } )(Task)

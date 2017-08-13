import React, { Component } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { Validation } from '../../../utils'
import { createTask, updateTask, deleteTask } from '../../../actions/projectActions'
import { addFlashMessage } from '../../../actions/flashMessages'
import { NewForm, EditForm } from './InputRow'

// Localization 
import T from 'i18n-react'

import $ from 'jquery'

class Task extends Component {
   constructor(props) {
    super(props)
    this.state = {
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

    // Hide edit tr and show show tr
    $('#'+task._id+' td .edit-item').hide()
    $('#'+task._id+' td .show-item').show()    
  }

  handleDelete(task, event) {
    event.preventDefault()

    
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
            text: 'Task updated'
          })

          // Hide edit tr and show show tr
          $('#'+_id+' td .edit-item').hide()
          $('#'+_id+' td .show-item').show()   
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
        handleUpdate={this.handleUpdate.bind(this)} handleEditTaskChange={this.handleEditTaskChange.bind(this, task)} />)
    )

    return(
      <form className={classnames("ui small form", { loading: newTask.isLoading || editTask.isRequired })}>
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
            
            <NewForm newTask={newTask} handleNewTaskChange={this.handleNewTaskChange} handleCreate={this.handleCreate.bind(this)} /> 
            
          </tbody>
        </table>
      </form>
    )
  }
  
}

Task.propTypes = {
  tasks: React.PropTypes.array.isRequired,
  creator: React.PropTypes.string.isRequired,
  createTask: React.PropTypes.func.isRequired,
  updateTask: React.PropTypes.func.isRequired,
  deleteTask: React.PropTypes.func.isRequired,
  addFlashMessage: React.PropTypes.func.isRequired
}

export default connect(null, { createTask, updateTask, deleteTask, addFlashMessage } )(Task)

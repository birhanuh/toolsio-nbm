import React, { Component } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { Validation } from '../../utils'
import { createTask, updateTask, deleteTask } from '../../actions/projectActions'
import { InputField, SelectField } from '../../utils/FormFields'
import { addFlashMessage } from '../../actions/flashMessages'

// Localization 
import T from 'i18n-react'

import $ from 'jquery'

class Task extends Component {
   constructor(props) {
    super(props)
    this.state = {
      task: {
        _id: null,
        _creator: null,
        name: "",
        payment_type: "",
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
    if (!!this.state.task.errors.message.errors[e.target.name]) {
      let errors = Object.assign({}, this.state.task.errors)
      delete errors.message.errors[e.target.name]

      let updatedTask = Object.assign({}, this.state.task)
      updatedTask._creator = this.state._id
      updatedTask[e.target.name] = e.target.value

      this.setState({
        task: updatedTask,
        errors
      })
    } else {
      let updatedTask = Object.assign({}, this.state.task)
      updatedTask._creator = this.state._id
      updatedTask[e.target.name] = e.target.value

      this.setState({
        task: updatedTask
      })
    }
  }

  isValid() {
    const { errors, isValid } = Validation.validateTaskInput(this.state.task)
    
    if (!isValid) {
      let updatedTask = Object.assign({}, this.state.task)
      updatedTask.errors.message.errors = errors
      this.setState({
        task: updatedTask
      })
    }

    return isValid
  }

  handleSubmit(event) {
     event.preventDefault()
     
    // Validation
    if (this.isValid()) { 
      const { _id, task } = this.state
      let updatedTask = Object.assign({}, this.state.task)
      updatedTask.isLoading = true
       this.setState({
        task: updatedTask
      })
      this.props.createTask({ _id, task }).then(
        () => {
          let updatedTask = Object.assign({}, this.state.task)
          updatedTask._creator = null
          updatedTask.name = ""
          updatedTask.payment_type = ""
          updatedTask.hours = ""
          updatedTask.price = ""
          updatedTask.vat = ""
          updatedTask.isLoading = false
           this.setState({
            task: updatedTask
          })

          this.props.addFlashMessage({
            type: 'success',
            text: 'Task added'
          })
        },
        ({ response }) => {
          let updatedTask = Object.assign({}, this.state.task)
          updatedTask.errors.message.errors = response.data.errors.message.errors
          updatedTask.isLoading = false
          this.setState({ task: updatedTask })
        }
      )  
    }
  }

  editTask(id, event) {
    event.preventDefault()

    //Hide show tr and show edit tr
    $('#'+id+' td .show-item').hide()
    $('#'+id+' td .edit-item').show()

  }

  cancelEditTask(id, event) {
    event.preventDefault()

    // Hide show tr and show edit tr
    $('#'+id+' td .edit-item').hide()
    $('#'+id+' td .show-item').show()

    
  }

  handleUpdate(event) {
    event.preventDefault()
    event.stopPropagation()

    // Validation
    if (this.isValid()) { 
      const { _id, task } = this.state
      let updatedTask = Object.assign({}, this.state.task)
      updatedTask.isLoading = true
       this.setState({
        task: updatedTask
      })
      this.props.updateTask({ _id, task }).then(
        () => {
          let updatedTask = Object.assign({}, this.state.task)
          updatedTask.isLoading = false
           this.setState({
            task: updatedTask
          })

          this.props.addFlashMessage({
            type: 'success',
            text: 'Task updated'
          })
        },
        ({ response }) => {
          let updatedTask = Object.assign({}, this.state.task)
          updatedTask.errors.message.errors = response.data.errors.message.errors
          updatedTask.isLoading = false
          this.setState({ task: updatedTask })
        }
      )  
    }
  }

  render() {
    const { task } = this.state
    let tasks = this.props.tasks 
  
    const tasksList = (
      tasks.map(taskItem => 
        <tr key={taskItem._id} id={taskItem._id} className="form-tr">
          <td>
            <div className="show-item">{taskItem.name}</div>
            <div className="edit-item">
              <InputField
                name="name" 
                value={taskItem.name} 
                onChange={this.handleChange.bind(this)}  
                placeholder="Name"
                error={task.errors.message && task.errors.message.errors && task.errors.message.errors.name && task.errors.message.errors.name.message}
                formClass="ui small input"
              />
            </div>
          </td>
          <td>
            <div className="show-item">{taskItem.payment_type}</div>
            <div className="edit-item">
              <SelectField
                name="payment_type"
                type="select"
                value={taskItem.payment_type} 
                onChange={this.handleChange.bind(this)}  
                error={task.errors.message && task.errors.message.errors && task.errors.message.errors.payment_type && task.errors.message.errors.payment_type.message}
                formClass="ui small input"
                options={[
                  <option key="default" value="" disabled>{T.translate("projects.tasks.new.select_payment_type")}</option>,
                  <option key="per hour" value="per hour">Per task</option>,
                  <option key="per task" value="per task">Per hour</option>
                  ]
                }
              />
            </div>
          </td>
          <td>
            <div className="show-item">{taskItem.hours}</div>
            <div className="edit-item">
              <InputField
                name="hours" 
                value={taskItem.hours.toString()} 
                onChange={this.handleChange.bind(this)}  
                placeholder="0.00"
                error={task.errors.message && task.errors.message.errors && task.errors.message.errors.hours && task.errors.message.errors.hours.message}
                formClass="ui small input"
              />  
            </div>          
          </td>
          <td>
            <div className="show-item">{taskItem.price}</div>
            <div className="edit-item">
              <InputField
                name="price" 
                value={taskItem.price.toString()} 
                onChange={this.handleChange.bind(this)} 
                placeholder="0.00"
                error={task.errors.message && task.errors.message.errors && task.errors.message.errors.price && task.errors.message.errors.price.message}
                formClass="ui small input"
              />
            </div>
          </td>
          <td>
            <div className="show-item">{taskItem.vat}</div>
            <div className="edit-item">
              <InputField
                name="vat" 
                value={taskItem.vat.toString()} 
                onChange={this.handleChange.bind(this)} 
                placeholder="0"
                error={task.errors.message && task.errors.message.errors && task.errors.message.errors.vat && task.errors.message.errors.vat.message}
                formClass="ui small input"
              />
            </div>
          </td>
          <td width="120px">
            <div className="show-item ui fluid small buttons">
              <button className="ui negative icon basic button" onClick={deleteTask(taskItem._id)}><i className="delete icon"></i></button>
              <button className="ui positive icon basic button" onClick={this.editTask.bind(this, taskItem._id)}><i className="edit icon"></i></button>
            </div>

            <div className="edit-item ui fluid small buttons">
              <button className="ui basic icon button" onClick={this.cancelEditTask.bind(this, taskItem._id)}><i className="remove circle outline icon"></i></button>
              <button className="ui positive icon basic button" onClick={this.editTask.bind(this, taskItem._id)}><i className="check circle outline icon"></i></button>
            </div>
          </td>
        </tr>
      )
    )

    return(
      <form className={classnames("ui small form", { loading: task.isLoading })} onSubmit={this.handleSubmit.bind(this)}>
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
            
            <tr className="form-tr input">
              <td>
                <InputField
                  name="name" 
                  value={task.name} 
                  onChange={this.handleChange.bind(this)}  
                  placeholder="Name"
                  error={task.errors.message && task.errors.message.errors && task.errors.message.errors.name && task.errors.message.errors.name.message}
                  formClass="ui small input"
                />
              </td>
              <td>
                <SelectField
                  name="payment_type"
                  type="select"
                  value={task.payment_type} 
                  onChange={this.handleChange.bind(this)}  
                  error={task.errors.message && task.errors.message.errors && task.errors.message.errors.payment_type && task.errors.message.errors.payment_type.message}
                  formClass="ui small input"
                  options={[
                    <option key="default" value="" disabled>{T.translate("projects.tasks.new.select_payment_type")}</option>,
                    <option key="per hour" value="per hour">Per task</option>,
                    <option key="per task" value="per task">Per hour</option>
                    ]
                  }
                />
              </td>
              <td>
                <InputField
                  name="hours" 
                  value={task.hours} 
                  onChange={this.handleChange.bind(this)}  
                  placeholder="0.00"
                  error={task.errors.message && task.errors.message.errors && task.errors.message.errors.hours && task.errors.message.errors.hours.message}
                  formClass="ui small input"
                />
              </td>
              <td>
                <InputField
                  name="price" 
                  value={task.price} 
                  onChange={this.handleChange.bind(this)} 
                  placeholder="0.00"
                  error={task.errors.message && task.errors.message.errors && task.errors.message.errors.price && task.errors.message.errors.price.message}
                  formClass="ui small input"
                />
              </td>
              <td>
                <InputField
                  name="vat" 
                  value={task.vat} 
                  onChange={this.handleChange.bind(this)} 
                  placeholder="0"
                  error={task.errors.message && task.errors.message.errors && task.errors.message.errors.vat && task.errors.message.errors.vat.message}
                  formClass="ui small input"
                />
              </td>
              <td width="120px">
                <button disabled={task.isLoading} className="ui fluid small icon basic turquoise button"><i className="add circle icon icon" aria-hidden="true"></i>&nbsp;{T.translate("projects.tasks.new.add_task")}</button>
              </td>
            </tr>
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

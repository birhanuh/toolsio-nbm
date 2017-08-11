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
      _id: this.props.project._id,
      task: {
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

    // Hide show tr and show edit tr
    $('#'+id+' .edit').show()
    $('#'+id+' .show').hide()
  }

  handleUpdate(event) {
     event.preventDefault()
     
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
    let tasks = this.props.project.tasks
  
    const tasksList = (
      tasks.map(taskItem => 
        <tr key={taskItem._id} id={taskItem._id} className="form-tr">
          <td className="show">{taskItem.name}</td>
          <td className="show">{taskItem.payment_type}</td>
          <td className="show">{taskItem.hours}</td>
          <td className="show">{taskItem.price}</td>
          <td className="show">{taskItem.vat}</td>
          <td className="show">
            <div className="ui fluid small buttons">
              <button className="ui small icon basic button red" onClick={deleteTask(taskItem._id)}><i className="delete icon"></i></button>
              <button className="ui small icon basic button green" onClick={this.editTask.bind(this, taskItem._id)}><i className="edit icon"></i></button>
            </div>
          </td>
        
          <td className="edit">
            <InputField
              name="name" 
              value={taskItem.name} 
              onChange={this.handleChange.bind(this)}  
              placeholder="Name"
              error={task.errors.message && task.errors.message.errors && task.errors.message.errors.name && task.errors.message.errors.name.message}
              formClass="ui small input"
            />
          </td>
          <td className="edit">
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
          </td>
          <td className="edit">
            <InputField
              name="hours" 
              value={taskItem.hours.toString()} 
              onChange={this.handleChange.bind(this)}  
              placeholder="0.00"
              error={task.errors.message && task.errors.message.errors && task.errors.message.errors.hours && task.errors.message.errors.hours.message}
              formClass="ui small input"
            />
          </td>
          <td className="edit">
            <InputField
              name="price" 
              value={taskItem.price.toString()} 
              onChange={this.handleChange.bind(this)} 
              placeholder="0.00"
              error={task.errors.message && task.errors.message.errors && task.errors.message.errors.price && task.errors.message.errors.price.message}
              formClass="ui small input"
            />
          </td>
          <td className="edit">
            <InputField
              name="vat" 
              value={taskItem.vat.toString()} 
              onChange={this.handleChange.bind(this)} 
              placeholder="0"
              error={task.errors.message && task.errors.message.errors && task.errors.message.errors.vat && task.errors.message.errors.vat.message}
              formClass="ui small input"
            />
          </td>
          <td className="edit">
            <button disabled={task.isLoading} className="ui fluid small icon basic turquoise button"><i className="add circle icon icon" aria-hidden="true"></i>&nbsp;{T.translate("projects.tasks.edit.edit_task")}</button>
          </td>
        </tr>

      )
    )

    return(
      <form className={classnames("ui form", { loading: task.isLoading })} onSubmit={this.handleSubmit.bind(this)}>
        <table className="ui small very basic table task">
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
            
            <tr className="form-tr">
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
              <td>
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
  createTask: React.PropTypes.func.isRequired,
  updateTask: React.PropTypes.func.isRequired,
  deleteTask: React.PropTypes.func.isRequired,
  addFlashMessage: React.PropTypes.func.isRequired
}

export default connect(null, { createTask, updateTask, deleteTask, addFlashMessage } )(Task)

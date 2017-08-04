import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { Validation } from '../../utils'
import { fetchProject, deleteProject, createTask } from '../../actions/projectActions'
import { InputField, SelectField } from '../../utils/FormFields'

// Localization 
import T from 'i18n-react'

class Show extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      _id: this.props.project ? this.props.project._id : null,
      name: this.props.project ? this.props.project.name : '',
      deadline: this.props.project ? this.props.project.deadline : '',
      customer: this.props.project ? this.props.project.customer : '',
      status: this.props.project ? this.props.project.status : '',
      description: this.props.project ? this.props.project.description : '',
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

  componentDidMount = () => {
    // Fetch Project when id is present in params
    const { match } = this.props
    if (match.params.id) {
      this.props.fetchProject(match.params.id)
    } 
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      _id: nextProps.project._id,
      name: nextProps.project.name,
      deadline: nextProps.project.deadline,
      customer: nextProps.project.customer,
      status: nextProps.project.status,
      description: nextProps.project.description
    })
  }

  handleChange = (e) => {
    if (!!this.state.task.errors.message.errors[e.target.name]) {
      let errors = Object.assign({}, this.state.task)
      delete errors.message.errors[e.target.name]

      let updatedTask = Object.assign({}, this.state.task)
      updatedTask[e.target.name] = e.target.value

      this.setState({
        task: updatedTask,
        errors
      })
    } else {
      let updatedTask = Object.assign({}, this.state.task)
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
     console.log('task: ', this.isValid())
    // Validation
    if (this.isValid()) { 
      const { _id, _creator, name, payment_type, hours, price, vat } = this.state.task
      let updatedisLoading = Object.assign({}, this.state.task)
      updatedisLoading.isLoading = true
       this.setState({
        task: updatedisLoading
      })
      this.props.createTask({ _id, _creator, name, payment_type, hours, price, vat })
        .catch( ( {response} ) => this.setState({ errors: response.data.errors, isLoading: false }) ) 
    }
  }

  render() {
    const { _id, name, deadline, customer, status, description, task } = this.state

    return (
      <div className="ui stackable grid">
        <div className="twelve wide column">
          <div className="ui segment">    
            <h1 className="ui header">{name}</h1> 
            <dl className="dl-horizontal">
              <dt>{T.translate("projects.show.customer")}</dt>
              <dd>{customer.name}</dd>
              {/*<dt>{T.translate("projects.show.user")}</dt>
              <dd>{project.user.first_name}</dd>*/}
              <dt>{T.translate("projects.show.deadline")}</dt>
              <dd>{deadline}</dd>
              <dt>{T.translate("projects.show.status")}</dt>
              <dd>
                <div className={classnames("ui uppercase label", {blue: status === 'new', orange: status === 'on going', green: status === 'finished' || status === 'delivered', red: status === 'delayed'})}> 
                  {status}
                </div>
              </dd>
             
              <dt>{T.translate("projects.show.description")}</dt>
              <dd>
                {description ? description : '-'}
              </dd>    
            </dl>  

            <h3 className="ui header">{T.translate("projects.tasks.header")}</h3>

            <form className={classnames("ui form", { loading: task.isLoading })} onSubmit={this.handleSubmit.bind(this)}>
              <table className="ui very basic table task">
                <thead>
                  <tr>
                    <th>{T.translate("projects.tasks.new.name")}</th>
                    <th>{T.translate("projects.tasks.new.payment_type")}</th>
                    <th>{T.translate("projects.tasks.new.hours")}</th>
                    <th>{T.translate("projects.tasks.new.price")}</th>
                    <th>{T.translate("projects.tasks.new.vat")}</th>
                    <th>{T.translate("projects.tasks.new.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <InputField
                        name="name" 
                        value={task.name} 
                        onChange={this.handleChange.bind(this)}  
                        placeholder="Name"
                        error={task.errors.message && task.errors.message.errors && task.errors.message.errors.name && task.errors.message.errors.name.message}
                        formClass="field"
                      />
                    </td>
                    <td>
                      <SelectField
                        name="payment_type"
                        type="select"
                        value={task.payment_type} 
                        onChange={this.handleChange.bind(this)}  
                        error={task.errors.message && task.errors.message.errors && task.errors.message.errors.payment_type && task.errors.message.errors.payment_type.message}
                        formClass="field"
                        options={[
                          <option key="default" value="" disabled>{T.translate("projects.tasks.new.select_payment_type")}</option>,
                          <option key="per hour" value="per hour">Per task</option>,
                          <option key="per task" value="per task">Per hour</option>
                          ]
                        }
                        formClass="field"
                      />
                    </td>
                    <td>
                      <InputField
                        name="hours" 
                        value={task.hours} 
                        onChange={this.handleChange.bind(this)}  
                        placeholder="0.00"
                        error={task.errors.message && task.errors.message.errors && task.errors.message.errors.hours && task.errors.message.errors.hours.message}
                        formClass="field"
                      />
                    </td>
                    <td>
                      <InputField
                        name="price" 
                        value={task.price} 
                        onChange={this.handleChange.bind(this)} 
                        placeholder="0.00"
                        error={task.errors.message && task.errors.message.errors && task.errors.message.errors.price && task.errors.message.errors.price.message}
                        formClass="field"
                      />
                    </td>
                    <td>
                      <InputField
                        name="vat" 
                        value={task.vat} 
                        onChange={this.handleChange.bind(this)} 
                        placeholder="0%"
                        error={task.errors.message && task.errors.message.errors && task.errors.message.errors.vat && task.errors.message.errors.vat.message}
                        formClass="field"
                      />
                    </td>
                    {/*<td>
                      <button className="ui icon basic red button" onClick={deleteTask(task._id)}><i className="delete icon"></i></button>
                    </td>
                    <td>
                      <Link className="ui icon basic green button" onClick={updateTask(task._id)}><i className="edit icon"></i></Link>
                    </td>*/}
                    <td className="actions">
                      <button disabled={task.isLoading} className="small ui icon basic turquoise button"><i className="add circle icon icon" aria-hidden="true"></i>&nbsp;{T.translate("projects.tasks.new.add_task")}</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>

            <div className="ui divider"></div>

            <button className="ui negative button" onClick={deleteProject(_id)}><i className="delete icon"></i>{T.translate("button.delete")}</button>
            <Link to={`/projects/edit/${_id}`} className="ui primary button"><i className="edit icon"></i>{T.translate("button.edit")}</Link>
          </div>    
        </div>
      </div>
    )
  }
}

Show.propTypes = {
  fetchProject: React.PropTypes.func.isRequired,
  deleteProject: React.PropTypes.func.isRequired,
  createTask: React.PropTypes.func.isRequired,
}

function mapStateToProps(state, props) {
  const { match } = props
  if (match.params.id) {
    return {
      project: state.projects.find(item => item._id === match.params.id)
    }
  } 
}

export default connect(mapStateToProps, { fetchProject, deleteProject, createTask } )(Show)
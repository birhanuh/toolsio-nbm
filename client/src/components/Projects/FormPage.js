import React, { Component } from 'react' 
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { addFlashMessage } from '../../actions/flashMessageActions'
import { Validation } from '../../utils'
// Semantic UI JS
import { Input, Select, TextArea, Form } from 'semantic-ui-react'
import { graphql, compose } from 'react-apollo'
import { GET_CUSTOMERS_QUERY } from '../../graphql/customers'
import { GET_PROJECT_QUERY, GET_PROJECTS_QUERY, CREATE_PROJECT_MUTATION, UPDATE_PROJECT_MUTATION } from '../../graphql/projects'

// Datepicker 
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'

// Localization 
import T from 'i18n-react'

import $ from 'jquery'
$.fn.progress = require('semantic-ui-progress')

class FormPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.data.getProject ? this.props.data.getProject.id : null,
      name: this.props.data.getProject ? this.props.data.getProject.name : '',
      deadline: this.props.data.getProject ? moment(this.props.data.getProject.deadline) : moment(),
      customerId: this.props.data.getProject ? this.props.data.getProject.customerId : '',
      status: this.props.data.getProject ? this.props.data.getProject.status : 'new',
      progress: this.props.data.getProject ? this.props.data.getProject.progress : 0,
      description: this.props.data.getProject ? this.props.data.getProject.description : '',
      errors: {},
      isLoading: false
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.data.getProject) {
      this.setState({
        id: nextProps.data.getProject.id,
        name: nextProps.data.getProject.name,
        deadline: moment(nextProps.data.getProject.deadline),
        customerId: nextProps.data.getProject.customerId,
        status: nextProps.data.getProject.status,
        progress: nextProps.data.getProject.progress,
        description: nextProps.data.getProject.description
      })
    }
  }

  handleChange = (name, value) => {
    //this.state.project['name'] = event.target.value // WRONG! Never mutate a state in React
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
    const { errors, isValid } = Validation.validateProjectInput(this.state)

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

      const { id, name, deadline, status, progress, description, customerId } = this.state
      
      if (id) {
        this.props.updateProjectMutation({ 
        variables: { id, name, deadline, status, progress, description, customerId: parseInt(customerId) },
        update: (store, { data: { updateProject } }) => {
          let { success, project } = updateProject

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

          let updatedProjects = data.getProjects.map(item => {
            if (item.id === project.id) {
              return {...project, __typename: 'Project'}
            }
            return item
          })

          data.getProjects = updatedProjects

          // Write our data back to the cache.
          store.writeQuery({ query: GET_PROJECTS_QUERY, data })
        }})
        .then(res => {          

          const { success, project, errors } = res.data.updateProject

          if (success) {
            this.props.addFlashMessage({
              type: 'success',
              text: T.translate("projects.form.flash.success_update", { name: project.name})
            })  

            this.context.router.history.push('/projects')
          } else {
            let errorsList = {}
            errors.map(error => errorsList[error.path] = error.message)

            this.setState({ errors: errorsList, isLoading: false })
          }
        })
        .catch(err => this.setState({ errors: err, isLoading: false }))
      } else {
       
        this.props.createProjectMutation({ 
          variables: { name, deadline, status, progress, description, customerId: parseInt(customerId) },
          update: (store, { data: { createProject } }) => {
            const { success, project } = createProject

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
            data.getProjects.push(project)
            // Write our data back to the cache.
            store.writeQuery({ query: GET_PROJECTS_QUERY, data })
          }})
          .then(res => {          

            const { success, project, errors } = res.data.createProject

            if (success) {
              this.props.addFlashMessage({
                type: 'success',
                text: T.translate("projects.form.flash.success_create", { name: project.name})
              })  

              this.context.router.history.push('/projects')
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

  handleChangeDate(deadline) {
    if (this.state.errors['deadline']) {
      // Clone errors form state to local variable
      let errors = Object.assign({}, this.state.errors)
      delete errors['deadline']
      
      this.setState({
        deadline: deadline,
        errors
      })
    } else {
      this.setState({
        deadline: deadline
      })
    }
  } 

  handleIncreaseProgress = (event) => {
    event.preventDefault()

    const { progress } = this.state

    if (progress <= 90) {
      this.setState({
        progress: progress+10
      })

      $("#progress").progress({
        percent: progress,
        label: 'percent',
        text: {
          percent : `${progress+10}%`
        },
        className : {
          active: 'success'
        }
      })
    }
  }

  handleDecreaseProgress = (event) => {
    event.preventDefault()

    const { progress } = this.state

    if (progress >= 10) {
      this.setState({
        progress: progress-10
      })

      $("#progress").progress({
        percent: progress,
        label: 'percent',
        text: {
          percent : `${progress-10}%`
        },
        className : {
          active: 'success'
        }
      })
    }
  }

  render() {
    const { id, name, deadline, customerId, status, progress, description, errors, isLoading } = this.state
   
    const { getCustomers } = this.props.getCustomersQuery
  
    const customersOptions = getCustomers && getCustomers.customers.map(customer => 
      ({ key: customer.id, value: customer.id, text: customer.name })
    )
  
    return (
      <div className="row column">
        <div className="ui text container segment">  

          <Form loading={isLoading} onSubmit={this.handleSubmit.bind(this)}>

            <div className="inline field">  
              {id ? <h1 className="ui header">{T.translate("projects.form.edit_project")}</h1> : <h1 className="ui header">{T.translate("projects.form.new_project")}</h1>}        
            </div>

            { !!errors.message && <div className="ui negative message"><p>{errors.message}</p></div> } 
            
            <Form.Field inline error={!!errors.name}>
              <label>{T.translate("projects.form.name")}</label>
              <Input
                placeholder={T.translate("projects.form.name")}
                name="name" 
                value={name} 
                onChange={(e, {value}) => this.handleChange('name', value)} 
                error={!!errors.name}
              />
              <span className="red">{errors.name}</span>
            </Form.Field>

            <Form.Field inline error={!!errors.deadline}>
              <label>{T.translate("projects.form.deadline")}</label>
              <DatePicker
                dateFormat="DD/MM/YYYY"
                selected={deadline}
                onChange={this.handleChangeDate.bind(this)}
              />
              <span className="red">{errors.deadline}</span>
            </Form.Field>

            { customersOptions && 
              <Form.Field inline error={!!errors.customerId}>
                <label>{T.translate("projects.form.customer")}</label>
                <Select
                  placeholder={T.translate("projects.form.select_customer")}
                  name="customerId"
                  value={customerId && customerId} 
                  onChange={(e, {value}) => this.handleChange('customerId', value)} 
                  error={!!errors.customerId}
                  options={customersOptions}
                  selection
                />
                <span className="red">{errors.customerId}</span>
              </Form.Field>
            }
              
            {
              customersOptions && customersOptions.length === 0 &&
                <div className="inline field">
                  <div className="ui mini info message mb-1">
                    <p>{T.translate("projects.form.empty_customers_message")}</p>

                    <Link className="ui primary outline tiny button" to="/customers/new">
                      <i className="add circle icon"></i>
                      {T.translate("projects.form.add_new_customer")}
                    </Link>
                  </div>
                </div>
            }

            { id &&
              <Form.Field inline className={classnames("show", {blue: status === 'new', orange: status === 'in progress', 
                green: status === 'finished', turquoise: status === 'delivered', red: status === 'delayed', error: !!errors.status})}
               >
                <label>{T.translate("projects.form.status")}</label>
                <Select
                  label={T.translate("projects.form.status")}
                  placeholder={T.translate("projects.form.select_status")}
                  name="status"
                  value={status} 
                  onChange={(e, {value}) => this.handleChange('status', value)} 
                  error={!!errors.staus}
                  options={[
                    { key: "default", value: "new", disabled: true, text: 'NEW' },
                    { key: "in progress", value: "in progress", text: 'IN PROGRESS' },
                    { key: "finished", value: "finished", text: 'FINISHED' },
                    { key: "delayed", value: "delayed", text: 'DELAYED' },
                    { key: "delivered", value: "delivered", text: 'DELIVERED' }
                  ]}
                  selection
                />
                <span className="red">{errors.status}</span>
              </Form.Field>
            }

            { id &&
              <div className="inline field progress">
                <div id="progress" className="ui success progress mb-3 mt-2">
                  <div className="bar" style={{transitionDuration: '300ms', width: ''+progress+'%'}}>
                    <div className="progress">{progress}%</div>
                  </div>
                </div>

                <div className="ui icon mini buttons">
                  <div className="decrement ui basic red button icon" onClick={this.handleDecreaseProgress.bind(this)}><i className="minus icon"></i></div>
                  <div className="increment ui basic green button icon" onClick={this.handleIncreaseProgress.bind(this)}><i className="plus icon"></i></div>
                </div>
              </div>
            }
            
            <Form.Field inline>  
              <label>{T.translate("projects.form.description")}</label>
              <TextArea
                placeholder={T.translate("projects.form.description")}
                name="description" 
                value={description} 
                onChange={(e, {value}) => this.handleChange('description', value)} 
              />
            </Form.Field>

            <div className="inline field">   
              <Link className="ui primary outline button" to="/projects">
                <i className="minus circle icon"></i>
                {T.translate("projects.form.cancel")}
              </Link> 
              <button disabled={isLoading} className="ui primary button">
                <i className="check circle outline icon" aria-hidden="true"></i>&nbsp;{T.translate("projects.form.save")}
              </button>
            </div>  
          </Form> 
        </div>  
      </div>
    )
  }
}

FormPage.propTypes = {
  addFlashMessage: PropTypes.func.isRequired
}

FormPage.contextTypes = {
  router: PropTypes.object.isRequired
}

const MutationsQuery =  compose(
  graphql(CREATE_PROJECT_MUTATION, {
    name : 'createProjectMutation'
  }),
  graphql(UPDATE_PROJECT_MUTATION, {
    name: 'updateProjectMutation'
  }),
  graphql(GET_PROJECTS_QUERY, {
    name: 'getProjectsQuery',
    options: () => ({
      variables: {
        order: 'DESC',
        offset: 0,
        limit: 10
      }
    })
  }),
  graphql(GET_CUSTOMERS_QUERY, {
    name: 'getCustomersQuery',
    options: () => ({
      variables: {
        order: 'DESC',
        offset: 0,
        limit: 10
      }
    })
  }),
  graphql(GET_PROJECT_QUERY, {
    options: (props) => ({
      variables: {
        id: props.match.params.id ? parseInt(props.match.params.id) : 0
      }
    })
  })
)(FormPage)

export default connect(null, { addFlashMessage } ) (MutationsQuery)

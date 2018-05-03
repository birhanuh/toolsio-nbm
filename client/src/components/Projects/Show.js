import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import Moment from 'moment'
import { addFlashMessage } from '../../actions/flashMessageActions'
// Semantic UI JS
import { Select, Form } from 'semantic-ui-react'
import { graphql, compose } from 'react-apollo'
import { GET_PROJECTS_QUERY, GET_PROJECT_QUERY, UPDATE_PROJECT_MUTATION, DELETE_PROJECT_MUTATION } from '../../queries/projectQueriesMutations'

import Breadcrumb from '../Layouts/Breadcrumb'

import TasksForm from './Tasks/Form'

// Localization 
import T from 'i18n-react'

import $ from 'jquery'

// Modal
$.fn.modal = require('semantic-ui-modal')
$.fn.dimmer = require('semantic-ui-dimmer')
$.fn.progress = require('semantic-ui-progress')

class Show extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.data.getProject ? this.props.data.getProject.id : null,
      name: this.props.data.getProject ? this.props.data.getProject.name : '',
      deadline: this.props.data.getProject ? this.props.data.getProject.deadline : '',
      customer: this.props.data.getProject ? this.props.data.getProject.customer : '',
      status: this.props.data.getProject ? this.props.data.getProject.status : '',
      description: this.props.data.getProject ? this.props.data.getProject.description : '',
      progress: this.props.data.getProject ? this.props.data.getProject.progress : 0,
      tasks: this.props.data.getProject ? this.props.data.getProject.tasks : [],
      user: this.props.data.getProject ? this.props.data.getProject.user : null,
      total: this.props.data.getProject ? this.props.data.getProject.total : 0
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.data.getProject) {
      this.setState({
        id: nextProps.data.getProject.id,
        name: nextProps.data.getProject.name,
        deadline: nextProps.data.getProject.deadline,
        customer: nextProps.data.getProject.customer,
        status: nextProps.data.getProject.status,
        description: nextProps.data.getProject.description,
        progress: nextProps.data.getProject.progress,
        tasks: nextProps.data.getProject.tasks,
        user: nextProps.data.getProject.user,
        total: nextProps.data.getProject.total
      })
    }
  }

  componentDidMount = () => {
    // Fetch Project when id is present in params
    const { match } = this.props

    // Check if param id is an int
    const projectId = parseInt(match.params.id, 10)
    
    if (!projectId) {
      return <Redirect to="/projects" />
    } else {
      //this.props.getProjectMutation({ variables: {id: projectId} })
    } 
    // Progress
    //$("#progress").progress('increment')
  }

  showConfirmationModal(event) {
    event.preventDefault()

    // Show modal
    $('.small.modal.project').modal('show')
  }

  hideConfirmationModal(event) {
    event.preventDefault()

    // Show modal
    $('.small.modal.project').modal('hide')
  }

  handleStatusChange = (value) => {
    const { id, name } = this.state

    this.props.updateProjectMutation({ 
        variables: { id, status: value }
      })
      .then(res => {      
        const { success, project, errors } = res.data.updateProject

        if (success) {
          this.props.addFlashMessage({
            type: 'success',
            text: T.translate("projects.form.flash.success_update", { name: name})
          })  
        } else {
          let errorsList = {}
          errors.map(error => errorsList[error.path] = error.message)

          this.setState({ errors: errorsList, isLoading: false })
        }
      })
      .catch(err => this.setState({ errors: err, isLoading: false }))
  }

   handleIncreaseProgress = (event) => {
    event.preventDefault()

    const { id, name, progress } = this.state

    if (progress <= 90) {
      this.setState({
        progress: progress+10
      })

      $("#progress").progress({
        percent: progress,
        label: 'percent',
        text: {
          percent: `${progress+10}%`
        },
        className : {
          active: 'success'
        }
      })

      // Update Project
      let progressUpdated = progress+10

      this.props.updateProjectMutation({ 
          variables: { id, progress: progressUpdated }
        })
        .then(res => {          

          const { success, project, errors } = res.data.updateProject

          if (success) {
            this.props.addFlashMessage({
              type: 'success',
              text: T.translate("projects.form.flash.success_update", { name: name})
            })  
          } else {
            let errorsList = {}
            errors.map(error => errorsList[error.path] = error.message)

            this.setState({ errors: errorsList, isLoading: false })
          }
        })
        .catch(err => this.setState({ errors: err, isLoading: false }))
    }
  }

  handleDecreaseProgress = (event) => {
    event.preventDefault()

    const { id, name, status, progress } = this.state

    if (progress >= 10) {
      this.setState({
        progress: progress-10
      })

      $("#progress").progress({
        percent: progress,
        label: 'percent',
        text: {
          percent: `${progress-10}%`
        },
        className : {
          active: 'success'
        }
      })

      // Update Project
      let progressUpdated = progress-10

      this.props.updateProjectMutation({ 
          variables: { id, progress: progressUpdated }
        })
        .then(res => {          

          const { success, project, errors } = res.data.updateProject

          if (success) {
            this.props.addFlashMessage({
              type: 'success',
              text: T.translate("projects.form.flash.success_update", { name: name})
            })  
          } else {
            let errorsList = {}
            errors.map(error => errorsList[error.path] = error.message)

            this.setState({ errors: errorsList, isLoading: false })
          }
        })
        .catch(err => this.setState({ errors: err, isLoading: false }))
    }
  }
  handleDelete(id, event) {
    event.preventDefault()
    
    const { name } = this.state
    
    this.props.deleteProjectMutation({ 
      variables: { id },
      update: (store, { data: { deleteProject } }) => {
        const { success } = deleteProject

        if (!success) {
          return
        }
        // Read the data from our cache for this query.
        const data = store.readQuery({ query: GET_PROJECTS_QUERY })
        // Add our comment from the mutation to the end.
   
        let updatedProjects = data.getProjects.filter(project => project.id !== id) 
        data.getProjects = updatedProjects
 
        // Write our data back to the cache.
        store.writeQuery({ query: GET_PROJECTS_QUERY, data })
      }})
      .then(res => {          

        const { success, errors } = res.data.deleteProject

        if (success) {
          this.props.addFlashMessage({
            type: 'success',
            text: T.translate("projects.show.flash.success_delete", { name: name})
          })  

          this.context.router.history.push('/projects')
        } else {
          let errorsList = {}
          errors.map(error => errorsList[error.path] = error.message)

          this.setState({ errors: errorsList, isLoading: false })
        }
      })
      .catch(err => {
        this.props.addFlashMessage({
          type: 'error',
          text: T.translate("projects.show.flash.error_delete", { name: name})
        })  

        this.setState({ errors: err, isLoading: false })  
      })
    
  }



  render() {
    const { id, name, deadline, customer, status, description, progress, tasks, user } = this.state
    
    let total = 0
    tasks.map(task => (total+=task.price))

    return (
      <div className="ui stackable grid">

        <Breadcrumb />

        <div className="twelve wide column">
          <div className="ui segment">    
            <h1 className={classnames("ui header", {blue: status === 'new', orange: status === 'in progress', green: status === 'finished', turquoise: status === 'delivered', red: status === 'delayed'})}>{name}</h1> 
            <dl className="dl-horizontal">
              <dt>{T.translate("projects.show.customer")}</dt>
              <dd>{customer ? <Link to={`/customers/show/${customer.id}`}>{customer.name}</Link> : '-'}</dd>
              <dt>{T.translate("projects.show.user")}</dt>
              <dd>{user && user.firstName}</dd>
              <dt>{T.translate("projects.show.deadline")}</dt>
              <dd>{Moment(deadline).format('DD/MM/YYYY')}</dd>
              <dt>{T.translate("projects.show.status")}</dt>
              <dd>               
                <Form.Field 
                  placeholder={T.translate("projects.form.select_status")}
                  control={Select}
                  name="status"
                  value={status} 
                  onChange={(e, {value}) => this.handleStatusChange(value)} 
                  className={classnames("inline field show", {blue: status === 'new', orange: status === 'in progress', green: status === 'finished', turquoise: status === 'delivered', red: status === 'delayed'})}
                  options={[
                    { key: "default", value: "new", disabled: true, text: 'NEW' },
                    { key: "in progress", value: "in progress", text: 'IN PROGRESS' },
                    { key: "finished", value: "finished", text: 'FINISHED' },
                    { key: "delayed", value: "delayed", text: 'DELAYED' },
                    { key: "delivered", value: "delivered", text: 'DELIVERED' }
                  ]}
                  selection
                />
              </dd>
             
              <dt>{T.translate("projects.show.description")}</dt>
              <dd>
                {description ? description : '-'}
              </dd>    

              <dt>{T.translate("projects.show.progress")}</dt>
              <dd>
                <div style={{width: "50%"}}>
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
              </dd>
            </dl>  

            <h3 className="ui header">{T.translate("projects.tasks.header")}</h3>

            { (tasks && id) && <TasksForm projectId={id} total={total} tasks={tasks} /> }
            
            <div className="ui divider"></div>

            <button className="ui negative button" onClick={this.showConfirmationModal.bind(this)}><i className="trash icon"></i>{T.translate("projects.show.delete")}</button>
            <Link to={`/projects/edit/${id}`} className="ui primary button"><i className="edit icon"></i>{T.translate("projects.show.edit")}</Link>
          </div>    
        </div>

        <div className="ui small modal project">
          <div className="header">Confirmation</div>
          <div className="content">
            <p className="red">{T.translate("projects.show.confirmation_msg")}</p>
          </div>
          <div className="actions">
            <button className="ui button" onClick={this.hideConfirmationModal.bind(this)}>{T.translate("projects.show.cancel")}</button>
            <button className="ui negative button" onClick={this.handleDelete.bind(this, id)}>{T.translate("projects.show.delete")}</button>
          </div>
        </div>
      </div>
    )
  }
}

Show.propTypes = {
  addFlashMessage: PropTypes.func.isRequired
}

Show.contextTypes = {
  router: PropTypes.object.isRequired
}

const MutationQuery =  compose(
  graphql(UPDATE_PROJECT_MUTATION, {
    name : 'updateProjectMutation'
  }),
  graphql(DELETE_PROJECT_MUTATION, {
    name : 'deleteProjectMutation'
  }),
  graphql(GET_PROJECTS_QUERY),
  graphql(GET_PROJECT_QUERY, {
    options: (props) => ({
      variables: {
        id: parseInt(props.match.params.id)
      },
    })
  })
)(Show)

export default connect(null, { addFlashMessage } ) (MutationQuery)

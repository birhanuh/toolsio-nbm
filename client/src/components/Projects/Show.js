import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import Moment from 'moment'
import { addFlashMessage } from '../../actions/flashMessageActions'
import { fetchProject, updateProject, deleteProject } from '../../actions/projectActions'
import { SelectField } from '../../utils/FormFields'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import Breadcrumb from '../Layouts/Breadcrumb'

import TaskForm from './Tasks/Form'

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
      tasks: this.props.data.getProject ? this.props.data.getProject.tasks : []
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
    console.log('sdf ', this.props.data.getProject.deadline)
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
        tasks: nextProps.data.getProject.tasks
      })
    }
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

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })

    const { id } = this.state

    this.props.updateProject({ id, status: e.target.value })
      .then(() => {
        console.log('updateProject status')
      })
  }

  handleDelete(id, event) {
    event.preventDefault()
    
    let name = this.props.project.name

    this.props.deleteProject(id).then(
      () => {
        this.props.addFlashMessage({
          type: 'success',
          text: T.translate("projects.show.flash.success_delete", { name: name})
        })  
        this.context.router.history.push('/projects')
      },
      ({ response }) => {
      }
    ) 
    
  }

  handleIncreaseProgress = (event) => {
    event.preventDefault()

    const { id, progress } = this.state

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

      this.props.updateProject({ id, progress: progressUpdated })
        .then(() => {
          console.log('updateProject progress')
        })
    }
  }

  handleDecreaseProgress = (event) => {
    event.preventDefault()

    const { id, status, progress } = this.state

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

      this.props.updateProject({ id, progress: progressUpdated })
        .then(() => {
          console.log('updateProject progress')
        })
    }
  }

  render() {
    const { id, name, deadline, customer, status, description, progress, tasks } = this.state

    return (
      <div className="ui stackable grid">

        <Breadcrumb />

        <div className="twelve wide column">
          <div className="ui segment">    
            <h1 className={classnames("ui header", {blue: status === 'new', orange: status === 'in progress', green: status === 'finished', turquoise: status === 'delivered', red: status === 'delayed'})}>{name}</h1> 
            <dl className="dl-horizontal">
              <dt>{T.translate("projects.show.customer")}</dt>
              <dd>{customer ? <Link to={`/customers/show/${customer.id}`}>{customer.name}</Link> : '-'}</dd>
              {/*<dt>{T.translate("projects.show.user")}</dt>
              <dd>{project.user.first_name}</dd>*/}
              <dt>{T.translate("projects.show.deadline")}</dt>
              <dd>{Moment(deadline).format('DD/MM/YYYY')}</dd>
              <dt>{T.translate("projects.show.status")}</dt>
              <dd>
                <SelectField
                  label=""
                  name="status"
                  type="select"
                  value={status} 
                  formClass={classnames("inline field show", {blue: status === 'new', orange: status === 'in progress', green: status === 'finished', turquoise: status === 'delivered', red: status === 'delayed'})}
                  onChange={this.handleChange.bind(this)} 
                  error=""

                  options={[
                    <option key="default" value="new" disabled>NEW</option>,
                    <option key="in progress" value="in progress">IN PROGRESS</option>,
                    <option key="finished" value="finished">FINISHED</option>,
                    <option key="delayed" value="delayed">DELAYED</option>,
                    <option key="delivered" value="delivered">DELIVERED</option>
                    ]
                  }
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

            { tasks && this.state.id && <TaskForm projectId={this.state.id} tasks={this.state.tasks} /> }
            
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
  //addFlashMessage: PropTypes.func.isRequired
}

Show.contextTypes = {
  router: PropTypes.object.isRequired
}

const getProjectQuery = gql`
  query getProject($id: Int!) {
    getProject(id: $id) {
      id
      name 
      deadline
      status
      progress
      description
      customer {
        id
        name
      }
      tasks {
        id
        name
        hours
        paymentType
        price
        vat
      }
    }
  }
`

export default graphql(getProjectQuery, {
  options: (props) => ({
    variables: {
      id: parseInt(props.match.params.id)
    }
  })})(Show)


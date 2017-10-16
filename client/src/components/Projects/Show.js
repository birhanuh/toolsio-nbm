import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import Moment from 'moment'
import { addFlashMessage } from '../../actions/flashMessages'
import { fetchProject, deleteProject } from '../../actions/projectActions'

import TaskForm from './Tasks/Form'

// Localization 
import T from 'i18n-react'

import $ from 'jquery'

// Modal
$.fn.modal = require('semantic-ui-modal')
$.fn.dimmer = require('semantic-ui-dimmer')

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
      tasks: this.props.project ? this.props.project.tasks : []
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
    if (nextProps.project) {
      this.setState({
        _id: nextProps.project._id,
        name: nextProps.project.name,
        deadline: nextProps.project.deadline,
        customer: nextProps.project.customer,
        status: nextProps.project.status,
        description: nextProps.project.description,
        tasks: nextProps.project.tasks
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

  render() {
    const { _id, name, deadline, customer, status, description, tasks } = this.state
    
    return (
      <div className="ui stackable grid">
        <div className="twelve wide column">
          <div className="ui segment">    
            <h1 className={classnames("ui header", {blue: status === 'new', orange: status === 'on going', green: status === 'finished' || status === 'delivered', red: status === 'delayed'})}>{name}</h1> 
            <dl className="dl-horizontal">
              <dt>{T.translate("projects.show.customer")}</dt>
              <dd>{customer ? customer.name: <p className="blue">{T.translate("projects.show.no_customer")}</p>}</dd>
              {/*<dt>{T.translate("projects.show.user")}</dt>
              <dd>{project.user.first_name}</dd>*/}
              <dt>{T.translate("projects.show.deadline")}</dt>
              <dd>{Moment(deadline).format('DD/MM/YYYY')}</dd>
              <dt>{T.translate("projects.show.status")}</dt>
              <dd>
                <div className={classnames("ui tiny uppercase label", {blue: status === 'new', orange: status === 'on going', green: status === 'finished' || status === 'delivered', red: status === 'delayed'})}> 
                  {status}
                </div>
              </dd>
             
              <dt>{T.translate("projects.show.description")}</dt>
              <dd>
                {description ? description : '-'}
              </dd>    
            </dl>  

            <h3 className="ui header">{T.translate("projects.tasks.header")}</h3>

            { tasks && this.state._id && <TaskForm creator={this.state._id} tasks={this.state.tasks} /> }
            
            <div className="ui divider"></div>

            <button className="ui negative button" onClick={this.showConfirmationModal.bind(this)}><i className="delete icon"></i>{T.translate("button.delete")}</button>
            <Link to={`/projects/edit/${_id}`} className="ui primary button"><i className="edit icon"></i>{T.translate("button.edit")}</Link>
          </div>    
        </div>

        <div className="ui small modal project">
          <div className="header">Confirmation</div>
          <div className="content">
            <p>{T.translate("projects.show.confirmation_msg")}</p>
          </div>
          <div className="actions">
            <button className="ui button" onClick={this.hideConfirmationModal.bind(this)}>{T.translate("button.cancel")}</button>
            <button className="ui negative button" onClick={this.handleDelete.bind(this, _id)}>{T.translate("button.delete")}</button>
          </div>
        </div>
      </div>
    )
  }
}

Show.propTypes = {
  fetchProject: PropTypes.func.isRequired,
  deleteProject: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired,
  project: PropTypes.object
}

Show.contextTypes = {
  router: PropTypes.object.isRequired
}

function mapStateToProps(state, props) {
  const { match } = props
  if (match.params.id) {
    return {
      project: state.projects.find(item => item._id === match.params.id)
    }
  } 
}

export default connect(mapStateToProps, { fetchProject, deleteProject, addFlashMessage } )(Show)
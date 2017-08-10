import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { fetchProject, deleteProject } from '../../actions/projectActions'

import Task from './Task'

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
      tasks: this.props.project ? this.props.project.tasks : null
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
      description: nextProps.project.description,
      tasks: nextProps.project.tasks
    })
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
              <dd>{customer.name}</dd>
              {/*<dt>{T.translate("projects.show.user")}</dt>
              <dd>{project.user.first_name}</dd>*/}
              <dt>{T.translate("projects.show.deadline")}</dt>
              <dd>{deadline}</dd>
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

            { this.props.project && <Task project={this.props.project} /> }
            
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
  deleteProject: React.PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  const { match } = props
  if (match.params.id) {
    return {
      project: state.projects.find(item => item._id === match.params.id)
    }
  } 
}

export default connect(mapStateToProps, { fetchProject, deleteProject } )(Show)
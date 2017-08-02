import React, { Component } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { fetchProject, updateProject } from '../../actions/projectActions'

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

  render() {
    const { name, deadline, customer, status, description } = this.state

    return (
      <div className="ui stackable grid">
        <div className="twelve wide column ui segment">  
          <h1 className="ui header">{name}</h1> 
          <dl className="dl-horizontal">
            <dt>{T.translate("projects.show.customer")}</dt>
            <dd>{customer}</dd>
            {/*<dt>{T.translate("projects.show.user")}</dt>
            <dd>{project.user.first_name}</dd>*/}
            <dt>{T.translate("projects.show.deadline")}</dt>
            <dd>{deadline}</dd>
            <dt>{T.translate("projects.show.status")}</dt>
            <dd>
              <div className={classnames("ui label", {blue: status === 'new', orange: status === 'in progress', green: status === 'ready' })}> 
                {status}
              </div>
            </dd>
           
            <dt>{T.translate("projects.show.description")}</dt>
            <dd>
              {description ? description : '-'}
            </dd>    
          </dl>      
        </div>
      </div>
    )
  }
}

Show.propTypes = {
  fetchProject: React.PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  const { match } = props
  if (match.params.id) {
    return {
      project: state.projects.find(item => item._id === match.params.id)
    }
  } 
}

export default connect(mapStateToProps, { fetchProject, updateProject } )(Show)
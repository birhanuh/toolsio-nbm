import React, { Component } from 'react' 
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { createProject, fetchProject, updateProject } from '../../actions/projectActions'
import Form from './Form'

class FormPage  extends Component {
  
  state = {
    redirect: false
  }

  componentDidMount = () => {
    const { match } = this.props
    if (match.params._id) {
      this.props.fetchSale(match.params._id)
    } else {}
  }

  saveSale = ({ _id, name, customer, deadline, status, description }) => {
    if (_id) {
      return this.props.updateProject({ _id, name, customer, deadline, status, description }).then(
        () => { this.setState({ redirect: true }) } )   
    } else {        
      return this.props.createProject({ _id, name, customer, deadline, status, description }).then(
        () => { this.setState({ redirect: true }) } )   
    }
  }

  render() {
   return (
      <div>
        {
          this.state.redirect ? 
          <Redirect to="/sales" /> : 
          <Form project={this.props.sale} saveProject={this.saveProject} />
        }
      </div>
    )
  }
}

FormPage.propTypes = {
  createProject: React.PropTypes.func.isRequired,
  fetchProject: React.PropTypes.func.isRequired,
  updateProject: React.PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  const { match } = props
  if (match.params._id) {
    return {
      project: state.projects.find(item => item._id === match.params._id)
    }
  } 
  return { project: null }
}

export default connect(mapStateToProps, { createProject, fetchProject, updateProject })(FormPage)


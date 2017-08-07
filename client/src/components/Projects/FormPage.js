import React, { Component } from 'react' 
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { createProject, fetchProject, updateProject } from '../../actions/projectActions'
import { fetchCustomers } from '../../actions/customerActions'
import Form from './Form'

class FormPage  extends Component {
  
  state = {
    redirect: false
  }

  componentDidMount = () => {
    // Fetch Project when id is present in params
    const { match } = this.props
    if (match.params.id) {
      this.props.fetchProject(match.params.id)
    } 

    // Fetch Customers
    this.props.fetchCustomers()
  }

  saveProject = ({ _id, name, customer, deadline, status, description }) => {
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
          <Redirect to="/projects" /> : 
          <Form project={this.props.project} saveProject={this.saveProject} customers={this.props.customers}/>
        }
      </div>
    )
  }
}

FormPage.propTypes = {
  createProject: React.PropTypes.func.isRequired,
  fetchProject: React.PropTypes.func.isRequired,
  updateProject: React.PropTypes.func.isRequired,
  fetchCustomers: React.PropTypes.func.isRequired,
  customers: React.PropTypes.array.isRequired,
}

function mapStateToProps(state, props) {
  const { match } = props
  if (match.params.id) {
    return {
      project: state.projects.find(item => item._id === match.params.id),
      customers: state.customers
    }
  } 
  return { 
    project: null,
    customers: state.customers
  }
}

export default connect(mapStateToProps, { createProject, fetchProject, updateProject, fetchCustomers })(FormPage)


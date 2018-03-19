import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { createProject, fetchProject, updateProject } from '../../actions/projectActions'
import { fetchCustomers } from '../../actions/customerActions'
import Form from './Form'

// Localization 
import T from 'i18n-react'

class FormPage  extends Component {
  
  state = {
    redirect: false
  }

  componentDidMount = () => {
    // // Fetch Project when id is present in params
    // const { match } = this.props
    // if (match.params.id) {
    //   this.props.fetchProject(match.params.id)
    // } 

    // // Fetch Customers
    // this.props.fetchCustomers()
  }

  saveProject = ({ _id, name, customer, deadline, status, progress, description }) => {
    if (_id) {
      return this.props.updateProject({ _id, name, customer, deadline, status, progress, description })
        .then(() => 
          { 
            this.setState({ redirect: true }) 

            this.props.addFlashMessage({
              type: 'success',
              text: T.translate("projects.form.flash.success_update", { name: name})
            })  
            this.context.router.history.push('/projects')
        })   
    } else {        
      return this.props.createProject({ _id, name, customer, deadline, status, progress, description })
        .then(() => 
          { 
            this.setState({ redirect: true }) 

            this.props.addFlashMessage({
              type: 'success',
              text: T.translate("projects.form.flash.success_create", { name: name})
            })  
            this.context.router.history.push('/projects')
          })   
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
  // createProject: PropTypes.func.isRequired,
  // fetchProject: PropTypes.func.isRequired,
  // updateProject: PropTypes.func.isRequired,
  // fetchCustomers: PropTypes.func.isRequired,
  // customers: PropTypes.array.isRequired,
  // project: PropTypes.object
}



FormPage.contextTypes = {
  router: PropTypes.object.isRequired
}

export default FormPage


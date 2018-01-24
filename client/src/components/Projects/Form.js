import React, { Component } from 'react' 
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import map from 'lodash/map'
import { Validation } from '../../utils'
import { InputField, TextAreaField, SelectField } from '../../utils/FormFields'

// Datepicker 
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'

// Localization 
import T from 'i18n-react'

import Breadcrumb from '../Layouts/Breadcrumb'

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      _id: this.props.project ? this.props.project._id : null,
      name: this.props.project ? this.props.project.name : '',
      deadline: this.props.project ? moment(this.props.project.deadline, "MM-DD-YYYY") : moment(),
      customer: this.props.project ? (this.props.project.customer ? this.props.project.customer._id : '') : '',
      status: this.props.project ? this.props.project.status : '',
      description: this.props.project ? this.props.project.description : '',
      errors: {
        message: {
          errors: {}
        }
      },
      isLoading: false
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.project) {
      this.setState({
        _id: nextProps.project._id,
        name: nextProps.project.name,
        deadline: moment(nextProps.project.deadline),
        customer: nextProps.project.customer,
        status: nextProps.project.status,
        description: nextProps.project.description
      })
    }
  }

  handleChange = (e) => {
    //this.state.project['name'] = event.target.value // WRONG! Never mutate a state in React

    if (!!this.state.errors.message.errors[e.target.name]) {
      // Clone errors form state to local variable
      let errors = Object.assign({}, this.state.errors)
      delete errors.message.errors[e.target.name]

      this.setState({
        [e.target.name]: e.target.value,
        errors
      })
    } else {
      this.setState({
        [e.target.name]: e.target.value
      })
    }
  }

  isValid() {
    const { errors, isValid } = Validation.validateProjectInput(this.state)

    let updatedErrors = Object.assign({}, this.state.errors)
    updatedErrors.message.errors = errors

    if (!isValid) {
      this.setState({ errors: updatedErrors })
    }

    return isValid;
  }

  handleSubmit(event) {
     event.preventDefault()

    // Validation
    if (this.isValid()) { 
      const { _id, name, deadline, customer, status, description } = this.state
      this.setState({ isLoading: true })

      this.props.saveProject({ _id, name, customer, deadline, status, description })
        .catch( ( {response} ) => this.setState({ errors: response.data.errors, isLoading: false }) ) 
    }
  }

  handleChangeDate(deadline) {
    this.setState({
      deadline: deadline
    })
  } 

  render() {
    const { _id, name, deadline, customer, status, description, errors, isLoading } = this.state
 
    const customersOptions = map(this.props.customers, (customer) => 
      <option key={customer._id} value={customer._id}>{customer.name}</option>
    )
    
    return (
      <div className="ui stackable grid">

        <Breadcrumb />

        <div className="ui text container ui segment">  

          <form className={classnames("ui form", { loading: isLoading })} onSubmit={this.handleSubmit.bind(this)}>
            <div className="inline field"> 
              {_id ? <h1 className="ui header">{T.translate("projects.form.edit_project")}</h1> : <h1 className="ui header">{T.translate("projects.form.new_project")}</h1>}
            </div>
            
            { !!errors.message && (typeof errors.message === "string") && <div className="ui negative message"><p>{errors.message}</p></div> } 

            <InputField
              label={T.translate("projects.form.name")}
              name="name" 
              value={name} 
              onChange={this.handleChange.bind(this)} 
              placeholder="Name"
              error={errors.message && errors.message.errors && errors.message.errors.name && errors.message.errors.name.message}
              formClass="inline field"
            />
                          
            <div  className={classnames("inline field", { error: !!errors['deadline'] })}>
              <label className="" htmlFor="date">{T.translate("projects.form.deadline")}</label>
              <DatePicker
                dateFormat="DD/MM/YYYY"
                selected={deadline}
                onChange={this.handleChangeDate.bind(this)}
              />
              <span>{errors.deadline}</span>
            </div>
            
            <SelectField
              label={T.translate("projects.form.customer")}
              name="customer"
              value={customer ? (typeof customer === 'object' ? customer._id : customer) : ''} 
              onChange={this.handleChange.bind(this)} 
              error={errors.message && errors.message.errors && errors.message.errors.customer && errors.message.errors.customer.message}
              formClass="inline field"

              options={[<option key="default" value="" disabled>{T.translate("projects.form.select_customer")}</option>,
                customersOptions]}
            />
            
            {
              customersOptions.length === 0 &&
                <div className="inline field">
                  <div className="ui mini info message mb-1">
                    <p>{T.translate("projects.form.empty_customers_message")}</p>

                    <Link className="ui primary outline tiny button" to="/customers/new">
                      <i className="add circle icon"></i>
                      {T.translate("customers.page.add_new_customer")}
                    </Link>
                  </div>
                </div>
            }

            { _id &&
              <SelectField
                label={T.translate("projects.form.status")}
                name="status"
                type="select"
                value={status} 
                onChange={this.handleChange.bind(this)} 
                error={errors.message && errors.message.errors && errors.message.errors.status && errors.message['status'].message}
                formClass="inline field"

                options={[
                  <option key="default" value="new" disabled>NEW</option>,
                  <option key="in progress" value="in progress">IN PROGRESS</option>,
                  <option key="finished" value="finished">FINISHED</option>,
                  <option key="delayed" value="delayed">DELAYED</option>,
                  <option key="delivered" value="delivered">DELIVERED</option>
                  ]
                }
              />
            }
              
            {/*
            <div className={classnames("field", { error: !!error.status })}>
              <label htmlFor="status">Status</label>
              <Dropdown 
                placeholder='Status' 
                search selection options={statusOptions}   
                value={status} 
                onChange={this.handleChange.bind(this)} 
                error={errors.status} />
            </div>      
            */}

            <TextAreaField
              label={T.translate("projects.form.description")}
              name="description" 
              value={description} 
              onChange={this.handleChange.bind(this)} 
              placeholder={T.translate("projects.form.description")}
              formClass="inline field"
            /> 

            <div className="inline field">    
              <Link className="ui primary outline button" to="/projects">
                <i className="minus circle icon"></i>
                {T.translate("projects.form.cancel")}
              </Link>
              <button disabled={isLoading} className="ui primary button"><i className="check circle outline icon" aria-hidden="true"></i>&nbsp;{T.translate("projects.form.save")}</button>
            </div>  
          </form> 
        </div>  
      </div>
    )
  }
}

Form.propTypes = {
  saveProject: PropTypes.func.isRequired,
  project: PropTypes.object,
  customers: PropTypes.array.isRequired
}

export default Form

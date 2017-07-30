import React, { Component } from 'react' 
import classnames from 'classnames'
import { Validation } from '../../utils'
import { InputField, TextAreaField, SelectField } from '../../utils/FormFields'

import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'

// Localization 
import T from 'i18n-react'

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      _id: this.props.project ? this.props.project._id : null,
      name: this.props.project ? this.props.project.name : '',
      deadline: this.props.project ? moment(this.props.project.deadline) : moment(),
      customer: this.props.project ? this.props.project.customer : '',
      status: this.props.project ? this.props.project.status : '',
      description: this.props.project ? this.props.project.description : '',
      errors: {},
      isLoading: false
    }
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      _id: nextProps.project._id,
      name: nextProps.project.name,
      deadline: moment(nextProps.project.deadline),
      customer: nextProps.project.customer,
      status: nextProps.project.status,
      description: nextProps.project.description
    })
  }

  handleChange = (e) => {
    //this.state.project['name'] = event.target.value // WRONG! Never mutate a state in React

    if (!!this.state.errors[e.target.name]) {
      // Clone errors form state to local variable
      let errors = Object.assign({}, this.state.errors)
      delete errors[e.target.name]

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

    if (!isValid) {
      this.setState({ errors })
    }

    return isValid;
  }

  handleSubmit(event) {
     event.preventDefault()

    // Validation
    if (this.isValid) { 
      const { _id, name, deadline, customer, status, description } = this.state
      this.setState({ isLoading: true })
      this.props.saveProject({ _id, name, customer, deadline, status, description })
        .catch( ( {response} ) => this.setState({ errors: response.data.errors, isLoading: false }) ) 
    }
  }

  handleChangeDate(deadline) {
    this.setState({
      deadline: deadline
    });
  } 

  render() {
    const { name, deadline, customer, status, description, errors, isLoading } = this.state

    return (
      <div className="ui stackable centered grid">
        <div className="eight wide column ui segment">  

          <form className={classnames("ui form", { loading: isLoading })} onSubmit={this.handleSubmit.bind(this)}>
            <div className="inline field"> 
              <h1 className="ui header">{T.translate("projects.new.header")}</h1>
              { !!errors.message && (typeof errors.message === "string") && <div className="ui negative message"><p>{errors.message}</p></div> } 
            </div>
            
            <InputField
              label={T.translate("projects.new.name")}
              name="name" 
              value={name} 
              onChange={this.handleChange.bind(this)} 
              placeholder="Name"
              error={errors.message && errors.message.name && errors.message['name'].message}
              formClass="inline field"
            />
                          
            <div  className={classnames("inline field", { error: !!errors['deadline'] })}>
              <label className="" htmlFor="date">{T.translate("projects.new.deadline")}</label>
              <DatePicker
                dateFormat="DD/MM/YYYY"
                selected={deadline}
                onChange={this.handleChangeDate.bind(this)}
              />
              <span>{errors.password}</span>
            </div>
            
            <SelectField
              label={T.translate("projects.new.customer")}
              name="customer"
              value={customer} 
              onChange={this.handleChange.bind(this)} 
              error={errors.message && errors.message.customer && errors.message['customer'].message}
              formClass="inline field"

              options={[
                <option key="default" value="" disabled>{T.translate("projects.new.select_customer")}</option>,
                <option key="1" value="1">Customer 1</option>,
                <option key="2" value="2">Customer 2</option>
              ]}
            />
            
            <SelectField
              label={T.translate("projects.new.status")}
              name="status"
              type="select"
              value={status} 
              onChange={this.handleChange.bind(this)} 
              error={errors.message && errors.message.status && errors.message['status'].message}
              formClass="inline field"

              options={[
                <option key="default" value="" disabled>{T.translate("projects.new.select_status")}</option>,
                <option key="new" value="new">NEW</option>,
                <option key="in progress" value="in progress">IN PROGRESS</option>,
                <option key="ready" value="ready">READY</option>,
                <option key="delivered" value="delivered">DELIVERED</option>
                ]
              }
            />
              
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
              label={T.translate("projects.new.description")}
              name="description" 
              value={description} 
              onChange={this.handleChange.bind(this)} 
              placeholder={T.translate("projects.new.description")}
              formClass="inline field"
            /> 

            <div className="inline field">    
              <button disabled={isLoading} className="ui primary button"><i className="check circle outline icon" aria-hidden="true"></i>&nbsp;{T.translate("button.save")}</button>
            </div>  
          </form> 
        </div>  
      </div>
    )
  }
}

export default Form

import React, { Component } from 'react' 
import classnames from 'classnames'
import { Validation } from '../../utils'
import { InputField, TextAreaField, SelectField } from '../../utils/FormFields'

import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'

// Localization 
import T from 'i18n-react'

// Semantic UI JS
//import { Dropdown, Input } from 'semantic-ui-react'

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      _id: this.props.sale ? this.props.sale._id : null,
      name: this.props.sale ? this.props.sale.name : '',
      deadline: this.props.sale ? moment(this.props.sale.deadline) : moment(),
      customer: this.props.sale ? this.props.sale.customer : '',
      status: this.props.sale ? this.props.sale.status : '',
      description: this.props.sale ? this.props.sale.description : '',
      errors: {},
      isLoading: false
    }
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      _id: nextProps.sale._id,
      name: nextProps.sale.name,
      deadline: moment(nextProps.sale.deadline),
      customer: nextProps.sale.customer,
      status: nextProps.sale.status,
      description: nextProps.sale.description
    })
  }

  handleChange = (e) => {
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
    const { errors, isValid } = Validation.validateSaleInput(this.state)

    if (!isValid) {
      this.setState({ errors })
    }

    return isValid;
  }

  handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (this.isValid) { 
      const { _id, name, deadline, customer, status, description } = this.state
      this.setState({ isLoading: true })
      this.props.saveSale({ _id, name, customer, deadline, status, description })
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
    
    //const statusOptions = [ { key: 'new', value: 'new', text: 'NEW' },
    //    { key: 'in progress', value: 'in progress', text: 'IN PROGRESS' },
    //    { key: 'ready', value: 'ready', text: 'READY' } ,
    //    { key: 'delivered', value: 'delivered', text: 'DELIVERED' } ]

    return (  
      <div className="ui stackable centered grid">
        <div className="eight wide column ui segment">  

          <form className={classnames("ui form", { loading: isLoading })} onSubmit={this.handleSubmit.bind(this)}>

            <div className="inline field">  
              <h1 className="ui header">{T.translate("sales.new.header")}</h1>              
            </div>

            { !!errors.message && (typeof errors.message === "string") && <div className="ui negative message"><p>{errors.message}</p></div> } 
            
            <InputField
              label={T.translate("sales.new.name")}
              name="name" 
              value={name} 
              onChange={this.handleChange.bind(this)} 
              placeholder="Name"
              error={errors.message && errors.message.errors && errors.message.errors.name && errors.message['name'].message}
              formClass="inline field"
            />
            <div  className={classnames("inline field", { error: !!errors.deadline })}>
              <label className="" htmlFor="date">{T.translate("sales.new.deadline")}</label>
              <DatePicker
                dateFormat="DD/MM/YYYY"
                selected={deadline}
                onChange={this.handleChangeDate.bind(this)}
              />
              <span>{errors.password}</span>
            </div>
            <SelectField
              label={T.translate("sales.new.customer")}
              name="customer"
              value={customer} 
              onChange={this.handleChange.bind(this)} 
              error={errors.message && errors.message.errors && errors.message.errors.customer && errors.message.errors.customer.message}
              formClass="inline field"

              options={[
                <option key="default" value="" disabled>{T.translate("sales.new.select_customer")}</option>,
                <option key="1" value="1">Customer 1</option>,
                <option key="2" value="2">Customer 2</option>
              ]}
            />
            <SelectField
              label={T.translate("sales.new.status")}
              name="status"
              type="select"
              value={status} 
              onChange={this.handleChange.bind(this)} 
              error={errors.message && errors.message.errors && errors.message.errors.status && errors.message.errors.status.message}
              formClass="inline field"

              options={[
                <option key="default" value="" disabled>{T.translate("sales.new.select_status")}</option>,
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
              label={T.translate("sales.new.description")}
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


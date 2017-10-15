import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Validation } from '../../utils'
import { InputField } from '../../utils/FormFields'

// Datepicker 
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'

// Localization 
import T from 'i18n-react'

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      _id: this.props.invoice ? this.props.invoice._id : null,
      step1: {
        sale: this.props.invoice ? this.props.invoice.sale : '',
        project: this.props.invoice ? this.props.invoice.project : ''
      },
      step2: {
        phoneNumber: this.props.invoice ? this.props.invoice.contact.phoneNumber : '',
        email: this.props.invoice ? this.props.invoice.contact.email : ''
      },
      errors: {},
      isLoading: false
    }
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      _id: nextProps.invoice._id,
      name: nextProps.invoice.name,
      address: {
        street: nextProps.invoice.address.street,
        postalCode: nextProps.invoice.address.postalCode,
        region: nextProps.invoice.address.region,
        country: nextProps.invoice.address.country
      },
      vatNumber: nextProps.invoice.vatNumber,
      includeContactOnInvoice: nextProps.invoice.includeContactOnInvoice,
      contact: {
        phoneNumber: nextProps.invoice.contact.phoneNumber,
        email: nextProps.invoice.contact.email
      }
    })
  }

  componentDidMount = () => {
    let classContextThis = this
    
    if (this.state.includeContactOnInvoice === true) {
      $('.ui.toggle.checkbox').checkbox('check')
    }

    $('.ui.toggle.checkbox').checkbox({
      onChecked: function() {
         classContextThis.setState({
          includeContactOnInvoice: true
        })
      },
      onUnchecked: function() {
        classContextThis.setState({
          includeContactOnInvoice: false
        })
      }
    })

  }

  handleChange = (e) => {
    if (!!this.state.errors[e.target.name]) {
      // Clone errors form state to local variable
      let errors = Object.assign({}, this.state.errors)
      delete errors[e.target.name]

      if (e.target.name === "email" || e.target.name === "phoneNumber") {

         this.setState({
          contact: { ...this.state.contact, [e.target.name]: e.target.value },
          errors
        })
      } else if (e.target.name === "street" || e.target.name === "postalCode" || e.target.name === "region"
        || e.target.name === "country") {

         this.setState({
          address: { ...this.state.address, [e.target.name]: e.target.value },
          errors
        })
      } else {
        this.setState({
          [e.target.name]: e.target.value,
          errors
        })
      }
    } else {

      if (e.target.name === "email" || e.target.name === "phoneNumber") {

         this.setState({
          contact: { ...this.state.contact, [e.target.name]: e.target.value },
        })
      } else if (e.target.name === "street" || e.target.name === "postalCode" || e.target.name === "region"
        || e.target.name === "country") {
        
         this.setState({
          address: { ...this.state.address, [e.target.name]: e.target.value }
        })
      } else {
        this.setState({
          [e.target.name]: e.target.value
        })
      }

    }
   
  }

  isValid() {
    const { errors, isValid } = Validation.validateCustomerInput(this.state)

    if (!isValid) {
      this.setState({ errors })
    }

    return isValid;
  }

  handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (this.isValid) { 
      const { _id, name, vatNumber, contact, includeContactOnInvoice, address } = this.state
      this.setState({ isLoading: true })
      this.props.saveCustomer({ _id, name, vatNumber, includeContactOnInvoice, contact, address })
        .catch( ( {response} ) => this.setState({ errors: response.data.errors, isLoading: false }) ) 
    }
  }

  handleChangeDate(deadline) {
    this.setState({
      deadline: deadline
    })
  } 

  render() {
    const { _id, name, vatNumber, contact, includeContactOnInvoice, address, errors, isLoading } = this.state
    
    //const statusOptions = [ { key: 'new', value: 'new', text: 'NEW' },
    //    { key: 'in progress', value: 'in progress', text: 'IN PROGRESS' },
    //    { key: 'ready', value: 'ready', text: 'READY' } ,
    //    { key: 'delivered', value: 'delivered', text: 'DELIVERED' } ]

    return (  
       <div className="row">
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
              <span>{errors.password}</span>
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
                  <option key="on going" value="on going">ON GOING</option>,
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
              <button disabled={isLoading} className="ui primary button"><i className="check circle outline icon" aria-hidden="true"></i>&nbsp;{T.translate("button.save")}</button>
            </div>  
          </form> 
        </div>  
      </div>
    )
  }
}

Form.propTypes = {
  invoice: PropTypes.object
}

export default Form


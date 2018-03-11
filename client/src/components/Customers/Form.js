import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { Validation } from '../../utils'
import { InputField } from '../../utils/FormFields'

import 'react-datepicker/dist/react-datepicker.css'

// Localization 
import T from 'i18n-react'

// Country region selector 
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector'

import $ from 'jquery'
$.fn.checkbox = require('semantic-ui-checkbox')

import Breadcrumb from '../Layouts/Breadcrumb'

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      _id: this.props.customer ? this.props.customer._id : null,
      name: this.props.customer ? this.props.customer.name : '',
      address: {
        street: this.props.customer ? this.props.customer.address.street: '',
        postal_code: this.props.customer ? this.props.customer.address.postal_code : '',
        region: this.props.customer ? this.props.customer.address.region : '',
        country: this.props.customer ? this.props.customer.address.country : ''
      },
      vat_number: this.props.customer ? this.props.customer.vat_number : '',
      is_contact_included_in_invoice: this.props.customer ? this.props.customer.is_contact_included_in_invoice : false,
      contact: {
        phone_number: this.props.customer ? this.props.customer.contact.phone_number : '',
        email: this.props.customer ? this.props.customer.contact.email : ''
      },
      errors: {
        message: {
          errors: {}
        }
      },
      isLoading: false
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.customer) {
      this.setState({
        _id: nextProps.customer._id,
        name: nextProps.customer.name,
        address: {
          street: nextProps.customer.address.street,
          postal_code: nextProps.customer.address.postal_code,
          region: nextProps.customer.address.region,
          country: nextProps.customer.address.country
        },
        vat_number: nextProps.customer.vat_number,
        is_contact_included_in_invoice: nextProps.customer.is_contact_included_in_invoice,
        contact: {
          phone_number: nextProps.customer.contact.phone_number,
          email: nextProps.customer.contact.email
        }
      })
    }
  }

  componentDidMount = () => {
    let classContextThis = this
    
    if (this.state.is_contact_included_in_invoice === true) {
      $('.ui.toggle.checkbox').checkbox('check')
    }

    $('.ui.toggle.checkbox').checkbox({
      onChecked: function() {
         classContextThis.setState({
          is_contact_included_in_invoice: true
        })
      },
      onUnchecked: function() {
        classContextThis.setState({
          is_contact_included_in_invoice: false
        })
      }
    })

  }

  handleChange = (e) => {
  
    if (!!this.state.errors[e.target.name]) {
      // Clone errors form state to local variable
      let errors = Object.assign({}, this.state.errors)
      delete errors[e.target.name]

      if (e.target.name === "email" || e.target.name === "phone_number") {

         this.setState({
          contact: { ...this.state.contact, [e.target.name]: e.target.value },
          errors
        })
      } else if (e.target.name === "street" || e.target.name === "postal_code" || e.target.name === "region"
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

      if (e.target.name === "email" || e.target.name === "phone_number") {

         this.setState({
          contact: { ...this.state.contact, [e.target.name]: e.target.value },
        })
      } else if (e.target.name === "street" || e.target.name === "postal_code" || e.target.name === "region"
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

    let updatedErrors = Object.assign({}, this.state.errors)
    updatedErrors.message.errors = errors

    if (!isValid) {
      this.setState({ 
        errors: updatedErrors 
      })
    }

    return isValid
  }

  handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (true) { 
      const { _id, name, vat_number, contact, is_contact_included_in_invoice, address } = this.state
      this.setState({ isLoading: true })
      this.props.saveCustomer({ _id, name, vat_number, is_contact_included_in_invoice, contact, address })
        .catch( ({response}) => this.setState({ errors: response.data.errors, isLoading: false }) ) 
    }
  }

  selectCountry (val) {
    let updatedAddress = Object.assign({}, this.state.address)
    updatedAddress["country"] = val
    this.setState({ address: updatedAddress })
  }

  selectRegion (val) {
    let updatedAddress = Object.assign({}, this.state.address)
    updatedAddress["region"] = val
    this.setState({ address: updatedAddress })
  }

  render() {
    const { _id, name, vat_number, contact, is_contact_included_in_invoice, address, errors, isLoading } = this.state
    
    //const statusOptions = [ { key: 'new', value: 'new', text: 'NEW' },
    //    { key: 'in progress', value: 'in progress', text: 'IN PROGRESS' },
    //    { key: 'ready', value: 'ready', text: 'READY' } ,
    //    { key: 'delivered', value: 'delivered', text: 'DELIVERED' } ]

    return (  
      <div className="ui stackable grid">

        <Breadcrumb />

        <div className="ui text container ui segment">  

          <form className={classnames("ui form", { loading: isLoading })} onSubmit={this.handleSubmit.bind(this)}>

            <div className="inline field">  
               {_id ? <h1 className="ui header">{T.translate("customers.form.edit_customer")}</h1> : <h1 className="ui header">{T.translate("customers.form.new_customer")}</h1>}
            </div>

            { !!errors.message && (typeof errors.message === "string") && <div className="ui negative message"><p>{errors.message}</p></div> }

            <InputField
              label={T.translate("customers.show.name")}
              name="name" 
              value={name} 
              onChange={this.handleChange.bind(this)} 
              placeholder="Name"
              error={errors.message && errors.message.errors && errors.message.errors.name && errors.message.errors['name'].message}
              formClass="inline field"
            />
            <InputField
              label={T.translate("customers.show.vat_number")}
              name="vat_number" 
              value={vat_number} 
              onChange={this.handleChange.bind(this)} 
              placeholder="Vat number"
              error={errors.message && errors.message.errors && errors.message.errors.vat_number && errors.message.errors['vat_number'].message}
              formClass="inline field"
            />
             <fieldset className="custom-fieldset">
              <legend className="custom-legend">{T.translate("customers.show.contact.header")}</legend>
              <InputField
                label={T.translate("customers.show.contact.phone_number")}
                name="phone_number" 
                value={contact.phone_number} 
                onChange={this.handleChange.bind(this)} 
                placeholder="Phone number"
                error={errors.message && errors.message.errors && errors.message.errors['contact.phone_number'] && errors.message.errors['contact.phone_number'].message}
                formClass="inline field"
              />
              <InputField
                label={T.translate("customers.show.contact.email")}
                name="email" 
                value={contact.email} 
                onChange={this.handleChange.bind(this)} 
                placeholder="Email"
                error={errors.message && errors.message.errors && errors.message.errors['contact.email'] && errors.message.errors['contact.email'].message}
                formClass="inline field"
              />
            </fieldset>
            <div className="inline field">              
              <label>{T.translate("customers.show.include_contact_on_invoice")}</label> 
              <div className="ui toggle checkbox">
                <input 
                  type="checkbox" 
                  name="is_contact_included_in_invoice" 
                  value={is_contact_included_in_invoice}
                  onChange={this.handleChange.bind(this)} />
                <label></label>
              </div>
            </div>
            <fieldset className="custom-fieldset">
              <legend className="custom-legend">{T.translate("customers.show.address.header")}</legend>
              <InputField
                label={T.translate("customers.show.address.street")}
                name="street" 
                value={address.street} 
                onChange={this.handleChange.bind(this)} 
                placeholder="Street"
                error={errors.message && errors.message.errors && errors.message.errors['address.street'] && errors.message.errors['address.street'].message}
                formClass="inline field"
              />
              <InputField
                label={T.translate("customers.show.address.postal_code")}
                name="postal_code" 
                value={address.postal_code} 
                onChange={this.handleChange.bind(this)} 
                placeholder="Postal code"
                error={errors.message && errors.message.errors && errors.message.errors['address.postal_code'] && errors.message.errors['address.postal_code'].message}
                formClass="inline field"
              />
              <div className={classnames("inline field", {error: errors.message && errors.message.errors && errors.message.errors['address.country']})}>              
                <label>{T.translate("customers.show.address.country")}</label>
                <CountryDropdown
                  defaultOptionLabel={T.translate("customers.form.select_country")}
                  value={address.country}
                  onChange={(val) => this.selectCountry(val)} 
                  error={errors.message && errors.message.errors && errors.message.errors['address.country'] && errors.message.errors['address.country'].message} />
                
                <span className={classnames({red: errors.message && errors.message.errors && errors.message.errors['address.country']})}>{errors.message && errors.message.errors && errors.message.errors['address.country'] && errors.message.errors['address.country'].message}</span>  
              </div>  
              <div className={classnames("inline field", {error: address.country !== '' && errors.message && errors.message.errors && errors.message.errors['address.region']})}>              
                <label>{T.translate("customers.show.address.region")}</label> 
                <RegionDropdown
                  defaultOptionLabel={T.translate("customers.form.select_region")}
                  disabled={address.country === ''}
                  country={address.country}
                  value={address.region}
                  onChange={(val) => this.selectRegion(val)} 
                  error={errors.message && errors.message.errors && errors.message.errors['address.region'] && errors.message.errors['address.region'].message}/>
                
                <span className={classnames({red: address.country !== '' && errors.message && errors.message.errors && errors.message.errors['address.region']})}>{errors.message && errors.message.errors && errors.message.errors['address.country'] && errors.message.errors['address.region'].message}</span>  
              </div>
              
            </fieldset>

            <div className="inline field">  
              <Link className="ui primary outline button" to="/customers">
                <i className="minus circle icon"></i>
                {T.translate("customers.form.cancel")}
              </Link>  
              <button disabled={isLoading} className="ui primary button"><i className="check circle outline icon" aria-hidden="true"></i>&nbsp;{T.translate("customers.form.save")}</button>
            </div>  
          </form> 
        </div>  
      </div>
    )
  }
}

Form.propTypes = {
  saveCustomer: PropTypes.func.isRequired,
  customer: PropTypes.object
}

export default Form


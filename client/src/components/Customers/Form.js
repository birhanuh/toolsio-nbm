import React, { Component } from 'react' 
import classnames from 'classnames'
import { Validation } from '../../utils'
import { InputField } from '../../utils/FormFields'

import 'react-datepicker/dist/react-datepicker.css'

// Localization 
import T from 'i18n-react'

// Country region selector 
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector'

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      _id: this.props.customer ? this.props.customer._id : null,
      name: this.props.customer ? this.props.customer.name : '',
      address: {
        street: this.props.customer ? this.props.customer.address.street: '',
        postalCode: this.props.customer ? this.props.customer.address.postalCode : '',
        region: this.props.customer ? this.props.customer.address.region : '',
        country: this.props.customer ? this.props.customer.address.country : ''
      },
      vatNumber: this.props.customer ? this.props.customer.vatNumber : '',
      contact: {
        phoneNumber: this.props.customer ? this.props.customer.contact.phoneNumber : '',
        email: this.props.customer ? this.props.customer.contact.email : ''
      },
      errors: {},
      isLoading: false
    }
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      _id: nextProps.customer._id,
      name: nextProps.customer.name,
      address: {
        street: nextProps.customer.address.street,
        postalCode: nextProps.customer.address.postalCode,
        region: nextProps.customer.address.region,
        country: nextProps.customer.address.country
      },
      vatNumber: nextProps.customer.vatNumber,
      contact: {
        phoneNumber: nextProps.customer.contact.phoneNumber,
        email: nextProps.customer.contact.email
      }
    })
  }

  handleChange = (e) => {
    if (!!this.state.errors[e.target.name]) {
      // Clone errors form state to local variable
      let errors = Object.assign({}, this.state.errors)
      delete errors[e.target.name]

      if (e.target.name === "email" || e.target.name === "phoneNumber") {
        let updatedContact = Object.assign({}, this.state.contact)
        updatedContact[e.target.name] = e.target.value
         this.setState({
          contact: updatedContact,
          errors
        })
      } else if (e.target.name === "street" || e.target.name === "postalCode" || e.target.name === "region"
        || e.target.name === "country") {
        let updatedAddress = Object.assign({}, this.state.address)
        updatedAddress[e.target.name] = e.target.value
         this.setState({
          address: updatedAddress,
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
        let updatedContact = Object.assign({}, this.state.contact)
        updatedContact[e.target.name] = e.target.value
         this.setState({
          contact: updatedContact
        })
      } else if (e.target.name === "street" || e.target.name === "postalCode" || e.target.name === "region"
        || e.target.name === "country") {
        let updatedAddress = Object.assign({}, this.state.address)
        updatedAddress[e.target.name] = e.target.value
         this.setState({
          address: updatedAddress
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
      const { _id, name, deadline, customer, status, description } = this.state
      this.setState({ isLoading: true })
      this.props.saveCustomer({ _id, name, customer, deadline, status, description })
        .catch( ( {response} ) => this.setState({ errors: response.data.errors, isLoading: false }) ) 
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
    const { name, vatNumber, contact, address, errors, isLoading } = this.state
    
    //const statusOptions = [ { key: 'new', value: 'new', text: 'NEW' },
    //    { key: 'in progress', value: 'in progress', text: 'IN PROGRESS' },
    //    { key: 'ready', value: 'ready', text: 'READY' } ,
    //    { key: 'delivered', value: 'delivered', text: 'DELIVERED' } ]

    return (  
      <div className="ui stackable centered grid">
        <div className="eight wide column ui segment">  

          <form className={classnames("ui form", { loading: isLoading })} onSubmit={this.handleSubmit.bind(this)}>

            <div className="inline field">  
              <h1 className="ui header">{T.translate("customers.new.header")}</h1>
        
              { !!errors.message && <div className="ui negative message"><p>{errors.message}</p></div> }
            </div>

            <InputField
              label={T.translate("customers.show.name")}
              name="name" 
              value={name} 
              onChange={this.handleChange.bind(this)} 
              placeholder="Name"
              error={errors.name}
              formClass="inline field"
            />
            <InputField
              label={T.translate("customers.show.vat_number")}
              name="vatNumber" 
              value={vatNumber} 
              onChange={this.handleChange.bind(this)} 
              placeholder="Vat number"
              error={errors.vatNumber}
              formClass="inline field"
            />
             <fieldset className="custom-fieldset">
              <legend className="custom-legend">{T.translate("customers.show.contact.header")}</legend>
              <InputField
                label={T.translate("customers.show.contact.phone_number")}
                name="phoneNumber" 
                value={contact.phoneNumber} 
                onChange={this.handleChange.bind(this)} 
                placeholder="Phone number"
                error={errors.phoneNumber}
                formClass="inline field"
              />
              <InputField
                label={T.translate("customers.show.contact.email")}
                name="email" 
                value={contact.email} 
                onChange={this.handleChange.bind(this)} 
                placeholder="Email"
                error={errors.email}
                formClass="inline field"
              />
            </fieldset>
            <fieldset className="custom-fieldset">
              <legend className="custom-legend">{T.translate("customers.show.address.header")}</legend>
              <InputField
                label={T.translate("customers.show.address.street")}
                name="street" 
                value={address.street} 
                onChange={this.handleChange.bind(this)} 
                placeholder="Street"
                error={errors.street}
                formClass="inline field"
              />
              <InputField
                label={T.translate("customers.show.address.postal_code")}
                name="postalCode" 
                value={address.postalCode} 
                onChange={this.handleChange.bind(this)} 
                placeholder="Street"
                error={errors.street}
                formClass="inline field"
              />
              <div className="inline field">              
                <label>{T.translate("customers.show.address.country")}</label>
                <CountryDropdown
                  defaultOptionLabel={T.translate("customers.new.select_country")}
                  value={address.country}
                  onChange={(val) => this.selectCountry(val)} />
              </div>  
              <div className="inline field">              
                <label>{T.translate("customers.show.address.region")}</label> 
                <RegionDropdown
                  defaultOptionLabel={T.translate("customers.new.select_region")}
                  disabled={address.country === ''}
                  country={address.country}
                  value={address.region}
                  onChange={(val) => this.selectRegion(val)} />
              </div>
              
            </fieldset>

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


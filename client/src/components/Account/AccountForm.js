import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { Validation } from '../../utils'
import { InputField, SelectField } from '../../utils/FormFields'

// Localization 
import T from 'i18n-react'

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      _id: this.props.account ? this.props.account._id : null,
      subdomain: this.props.account ? this.props.account.subdomain : '',
      logo: this.props.account ? this.props.account.logo : '',
      industry: this.props.account ? this.props.account.industry : '',
      address: {
        street: this.props.account ? this.props.account.address.street: '',
        postalCode: this.props.account ? this.props.account.address.postalCode : '',
        region: this.props.account ? this.props.account.address.region : '',
        country: this.props.account ? this.props.account.address.country : ''
      },
      contact: {
        phoneNumber: this.props.account ? this.props.account.contact.phoneNumber : '',
        email: this.props.account ? this.props.account.contact.email : ''
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
    if (nextProps.account) {
      this.setState({
        _id: nextProps.account._id,
        subdomain: nextProps.account.subdomain,
        logo: nextProps.account.logo,
        industry: nextProps.account.industry,
        address: {
          street: nextProps.account.address.street,
          postalCode: nextProps.account.address.postalCode,
          region: nextProps.account.address.region,
          country: nextProps.account.address.country
        },
        contact: {
          phoneNumber: nextProps.account.contact.phoneNumber,
          email: nextProps.account.contact.email
        }
      })
    }
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
    const { errors, isValid } = Validation.validateAccountInput(this.state)

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
    if (this.isValid()) { 
      const { _id, subdomain, industry, logo, contact, address } = this.state
      this.setState({ isLoading: true })
      this.props.updateAccount({ _id, subdomain, industry, logo, contact, address })
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
    const { id, subdomain, industry, logo, contact, address } = this.state

    return (  
      <div className="ui stackable grid">

        <Breadcrumb />

        <div className="ui text container ui segment">  

          <form className={classnames("ui form", { loading: isLoading })} onSubmit={this.handleSubmit.bind(this)}>

            <div className="inline field">  
               {_id ? <h1 className="ui header">{T.translate("accounts.form.edit_account")}</h1> : <h1 className="ui header">{T.translate("accounts.form.new_account")}</h1>}
            </div>

            { !!errors.message && (typeof errors.message === "string") && <div className="ui negative message"><p>{errors.message}</p></div> }

            <InputField
              label={T.translate("accounts.show.name")}
              name="name" 
              value={name} 
              onChange={this.handleChange.bind(this)} 
              placeholder="Name"
              error={errors.message && errors.message.errors && errors.message.errors.name && errors.message.errors['name'].message}
              formClass="inline field"
            />
            <InputField
              label={T.translate("accounts.show.vat_number")}
              name="vatNumber" 
              value={vatNumber} 
              onChange={this.handleChange.bind(this)} 
              placeholder="Vat number"
              error={errors.message && errors.message.errors && errors.message.errors.vatNumber && errors.message.errors['vatNumber'].message}
              formClass="inline field"
            />
             <fieldset className="custom-fieldset">
              <legend className="custom-legend">{T.translate("accounts.show.contact.header")}</legend>
              <InputField
                label={T.translate("accounts.show.contact.phone_number")}
                name="phoneNumber" 
                value={contact.phoneNumber} 
                onChange={this.handleChange.bind(this)} 
                placeholder="Phone number"
                error={errors.message && errors.message.errors && errors.message.errors['contact.phoneNumber'] && errors.message.errors['contact.phoneNumber'].message}
                formClass="inline field"
              />
              <InputField
                label={T.translate("accounts.show.contact.email")}
                name="email" 
                value={contact.email} 
                onChange={this.handleChange.bind(this)} 
                placeholder="Email"
                error={errors.message && errors.message.errors && errors.message.errors['contact.email'] && errors.message.errors['contact.email'].message}
                formClass="inline field"
              />
            </fieldset>
            <div className="inline field">              
              <label>{T.translate("accounts.show.include_contact_on_invoice")}</label> 
              <div className="ui toggle checkbox">
                <input 
                  type="checkbox" 
                  name="includeContactOnInvoice" 
                  value={includeContactOnInvoice}
                  onChange={this.handleChange.bind(this)} />
                <label></label>
              </div>
            </div>
            <fieldset className="custom-fieldset">
              <legend className="custom-legend">{T.translate("accounts.show.address.header")}</legend>
              <InputField
                label={T.translate("accounts.show.address.street")}
                name="street" 
                value={address.street} 
                onChange={this.handleChange.bind(this)} 
                placeholder="Street"
                error={errors.message && errors.message.errors && errors.message.errors['address.street'] && errors.message.errors['address.street'].message}
                formClass="inline field"
              />
              <InputField
                label={T.translate("accounts.show.address.postal_code")}
                name="postalCode" 
                value={address.postalCode} 
                onChange={this.handleChange.bind(this)} 
                placeholder="Postal code"
                error={errors.message && errors.message.errors && errors.message.errors['address.postalCode'] && errors.message.errors['address.postalCode'].message}
                formClass="inline field"
              />
              <div className={classnames("inline field", {error: errors.message && errors.message.errors && errors.message.errors['address.country']})}>              
                <label>{T.translate("accounts.show.address.country")}</label>
                <CountryDropdown
                  defaultOptionLabel={T.translate("accounts.form.select_country")}
                  value={address.country}
                  onChange={(val) => this.selectCountry(val)} 
                  error={errors.message && errors.message.errors && errors.message.errors['address.country'] && errors.message.errors['address.country'].message} />
                
                <span className={classnames({red: errors.message && errors.message.errors && errors.message.errors['address.country']})}>{errors.message && errors.message.errors && errors.message.errors['address.country'] && errors.message.errors['address.country'].message}</span>  
              </div>  
              <div className={classnames("inline field", {error: address.country !== '' && errors.message && errors.message.errors && errors.message.errors['address.region']})}>              
                <label>{T.translate("accounts.show.address.region")}</label> 
                <RegionDropdown
                  defaultOptionLabel={T.translate("accounts.form.select_region")}
                  disabled={address.country === ''}
                  country={address.country}
                  value={address.region}
                  onChange={(val) => this.selectRegion(val)} 
                  error={errors.message && errors.message.errors && errors.message.errors['address.region'] && errors.message.errors['address.region'].message}/>
                
                <span className={classnames({red: address.country !== '' && errors.message && errors.message.errors && errors.message.errors['address.region']})}>{errors.message && errors.message.errors && errors.message.errors['address.country'] && errors.message.errors['address.region'].message}</span>  
              </div>
              
            </fieldset>

            <div className="inline field">  
              <Link className="ui primary outline button" to="/accounts">
                <i className="minus circle icon"></i>
                {T.translate("accounts.form.cancel")}
              </Link>  
              <button disabled={isLoading} className="ui primary button"><i className="check circle outline icon" aria-hidden="true"></i>&nbsp;{T.translate("accounts.form.save")}</button>
            </div>  
          </form> 
        </div>  
      </div>
    )
  }
}

Form.propTypes = {
  updateAccount: PropTypes.func.isRequired,
  account: PropTypes.object
}

export default Form


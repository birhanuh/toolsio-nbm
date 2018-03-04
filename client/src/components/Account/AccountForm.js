import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { Validation } from '../../utils'
import { InputField, SelectField } from '../../utils/FormFields'

// Localization 
import T from 'i18n-react'

// Country region selector 
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector'

class AccountForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      _id: this.props.account ? this.props.account._id : null,
      subdomain: this.props.account ? this.props.account.subdomain : '',
      logo: this.props.account ? this.props.account.logo : '',
      industry: this.props.account ? this.props.account.industry : '',
      address: {
        street: this.props.account ? (this.props.account.address ? this.props.account.address.street : '') : '',
        postalCode: this.props.account ? (this.props.account.address ? this.props.account.address.postalCode : '') : '',
        region: this.props.account ? (this.props.account.address ? this.props.account.address.region : '') : '',
        country: this.props.account ? (this.props.account.address ? this.props.account.address.country : '') : ''
      },
      contact: {
        phoneNumber: this.props.account ? (this.props.account.contact ? this.props.account.contact.phoneNumber : '') : '',
        email: this.props.account ? (this.props.account.contact ? this.props.account.contact.email : '') : ''
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
          street: nextProps.account.address && nextProps.account.address.street,
          postalCode: nextProps.account.address && nextProps.account.address.postalCode,
          region: nextProps.account.address && nextProps.account.address.region,
          country: nextProps.account.address && nextProps.account.address.country
        },
        contact: {
          phoneNumber: nextProps.account.contact && nextProps.account.contact.phoneNumber,
          email: nextProps.account.contact && nextProps.account.contact.email
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
        .then((res) => {
          this.props.addFlashMessage({
            type: 'success',
            text: T.translate("account..form.success_update_account")
          })
        },
        ({ response }) => this.setState({ errors: response.data.errors, isLoading: false })
      ) 
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
    const { _id, subdomain, industry, logo, contact, address, errors, isLoading } = this.state

    return ( 

      <form className={classnames("ui form", { loading: isLoading })} onSubmit={this.handleSubmit.bind(this)}>

        { !!errors.message && (typeof errors.message === "string") && <div className="ui negative message"><p>{errors.message}</p></div> }

        <InputField
          label={T.translate("account.page.subdomain")}
          name="subdomain" 
          value={subdomain} 
          onChange={this.handleChange.bind(this)} 
          placeholder="Name"
          error={errors.message && errors.message.errors && errors.message.errors.subdomain && errors.message.errors['subdomain'].message}
          formClass="field"
        />
        <SelectField
          type="select"
          name="industry"
          value={industry ? industry : '-'} 
          label={T.translate("account.page.industry")}
          onChange={this.handleChange.bind(this)} 
          error={errors.message && errors.message.errors && errors.message.errors.industry && errors.message.errors['industry'].message}
          formClass="field"

          options={[
            <option key="default" value="" disabled>{T.translate("account.page.select_industry")}</option>,
            <option key="human resource" value="human resource">Human resource</option>,
            <option key="fashion" value="fashion">Fashion</option>,
            <option key="import/export" value="import/export">Import/Export</option>,
            <option key="store" value="store">Store</option>,
            <option key="technology" value="technology">Technology</option>
            ]
          }
        />
         <fieldset className="custom-fieldset">
          <legend className="custom-legend">{T.translate("account.page.contact.header")}</legend>
          <InputField
            label={T.translate("account.page.contact.phone_number")}
            name="phoneNumber" 
            value={contact.phoneNumber} 
            onChange={this.handleChange.bind(this)} 
            placeholder="Phone number"
            error={errors.message && errors.message.errors && errors.message.errors['contact.phoneNumber'] && errors.message.errors['contact.phoneNumber'].message}
            formClass="field"
          />
          <InputField
            label={T.translate("account.page.contact.email")}
            name="email" 
            value={contact.email} 
            onChange={this.handleChange.bind(this)} 
            placeholder="Email"
            error={errors.message && errors.message.errors && errors.message.errors['contact.email'] && errors.message.errors['contact.email'].message}
            formClass="field"
          />
        </fieldset>
        <fieldset className="custom-fieldset">
          <legend className="custom-legend">{T.translate("account.page.address.header")}</legend>
          <InputField
            label={T.translate("account.page.address.street")}
            name="street" 
            value={address.street} 
            onChange={this.handleChange.bind(this)} 
            placeholder="Street"
            error={errors.message && errors.message.errors && errors.message.errors['address.street'] && errors.message.errors['address.street'].message}
            formClass="field"
          />
          <InputField
            label={T.translate("account.page.address.postal_code")}
            name="postalCode" 
            value={address.postalCode} 
            onChange={this.handleChange.bind(this)} 
            placeholder="Postal code"
            error={errors.message && errors.message.errors && errors.message.errors['address.postalCode'] && errors.message.errors['address.postalCode'].message}
            formClass="field"
          />
          <div className={classnames("field", {error: errors.message && errors.message.errors && errors.message.errors['address.country']})}>              
            <label>{T.translate("account.page.address.country")}</label>
            <CountryDropdown
              defaultOptionLabel={T.translate("account.page.address.select_country")}
              value={address.country}
              onChange={(val) => this.selectCountry(val)} 
              error={errors.message && errors.message.errors && errors.message.errors['address.country'] && errors.message.errors['address.country'].message} />
            
            <span className={classnames({red: errors.message && errors.message.errors && errors.message.errors['address.country']})}>{errors.message && errors.message.errors && errors.message.errors['address.country'] && errors.message.errors['address.country'].message}</span>  
          </div>  
          <div className={classnames("field", {error: address.country !== '' && errors.message && errors.message.errors && errors.message.errors['address.region']})}>              
            <label>{T.translate("account.page.address.region")}</label> 
            <RegionDropdown
              defaultOptionLabel={T.translate("account.page.address.select_region")}
              disabled={address.country === ''}
              country={address.country}
              value={address.region}
              onChange={(val) => this.selectRegion(val)} 
              error={errors.message && errors.message.errors && errors.message.errors['address.region'] && errors.message.errors['address.region'].message}/>
            
            <span className={classnames({red: address.country !== '' && errors.message && errors.message.errors && errors.message.errors['address.region']})}>{errors.message && errors.message.errors && errors.message.errors['address.country'] && errors.message.errors['address.region'].message}</span>  
          </div>
          
        </fieldset>

        <div className="field">  
          <Link className="ui primary outline button" to="/dashboard">
            <i className="minus circle icon"></i>
            {T.translate("account.page.cancel")}
          </Link>  
          <button disabled={isLoading} className="ui primary button"><i className="check circle outline icon" aria-hidden="true"></i>&nbsp;{T.translate("account.page.edit")}</button>
        </div>  
      </form> 
    )
  }
}

AccountForm.propTypes = {
  updateAccount: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired,
  account: PropTypes.object
}

export default AccountForm


import React, { Component } from 'react' 
import PropTypes from 'prop-types'
require('babel-polyfill')
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import Dropzone from 'react-dropzone'
import { Validation } from '../../utils'
import { InputField, SelectField } from '../../utils/FormFields'

// Localization 
import T from 'i18n-react'

import $ from 'jquery'

import moment from 'moment'

// Modal
$.fn.dimmer = require('semantic-ui-dimmer')

// Country region selector 
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector'


// Images
import logoPlaceholderMedium from '../../images/logo-placeholder.svg'

class AccountForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      _id: this.props.account ? this.props.account._id : null,
      subdomain: this.props.account ? this.props.account.subdomain : '',
      logo: this.props.account ? this.props.account.logo : '',
      industry: this.props.account ? this.props.account.industry : '',
      address: {
        street: this.props.account.address ? this.props.account.address.street : '',
        postalCode: this.props.account.address ? this.props.account.address.postalCode : '',
        region: this.props.account.address ? this.props.account.address.region : '',
        country: this.props.account.address ? this.props.account.address.country : ''
      },
      contact: {
        phoneNumber: this.props.account.contact ? this.props.account.contact.phoneNumber : '',
        email: this.props.account.contact ? this.props.account.contact.email : ''
      },
      file: null,
      errors: {
        message: {
          errors: {}
        }
      },
      isLoadingLogo: false,
      isLoadingForm: false
    }
  }

  componentDidMount() {

    $('.ui.card .image').dimmer({
      on: 'hover'
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
      this.setState({ isLoadingLogo: true })
      this.props.updateAccount({ _id, subdomain, industry, logo, contact, address })
        .then((res) => {
          this.props.addFlashMessage({
            type: 'success',
            text: T.translate("account.form.success_update_account")
          })
          this.setState({ isLoadingForm: false })
        },
        ({ response }) => this.setState({ errors: response.data.errors, isLoadingForm: false })
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

  uploadToS3 = async (url, file, signedRequest) => {

    const options = {
      headers: {
        "Content-Type": file.type
      }
    }
    
    const uploadLogoResponse = await this.props.uploadLogo(signedRequest, file, options)

    if (uploadLogoResponse.status === 200) {
      this.setState({
        logo: url
      })

      const { _id, logo } = this.state
      
      this.setState({ isLoadingLogo: true })
      this.props.updateAccount({ _id, logo })
        .then((res) => {
          this.props.addFlashMessage({
            type: 'success',
            text: T.translate("account.form.success_update_account")
          })
          this.setState({ isLoadingLogo: false })
        },
        ({ response }) => this.setState({ errors: response.data.errors, isLoadingLogo: false })
      ) 
    }
  }

  formatFileName = filename => {
    const date = moment().format("DDMMYYYY")
    const randomString = Math.random()
      .toString(36)
      .substring(2, 7)
    const cleanFileName = filename.toLowerCase().replace(/[^a-z0-9]/g, "-")
    const newFileName = `logos/${date}-${randomString}-${cleanFileName}`
    return newFileName.substring(0, 60)
  }

  handleOnDrop = async files => {

    this.setState({
      'file': files[0]
    })
  }

  handleSubmitImage = async () => {
    const { subdomain, file } = this.state
    const response = await this.props.s3SignLogo({
      variables: {
        filename: this.formatFileName(file.name),
        filetype: file.type
      }
    })

    const { signedRequest, url } = response.data.result
    await this.uploadToS3(url, file, signedRequest)
  }

  render() {
    const { _id, subdomain, industry, logo, contact, address, errors, isLoadingLogo, isLoadingForm } = this.state

    return ( 

      <div className="twelve wide column"> 
        <div className="ui items segment account">
          <div className="ui item">    
            <div className="image">
              <div className={classnames("ui card form", { loading: isLoadingLogo })}>
                <div className="blurring dimmable image">
                  <div className="ui dimmer">
                    <div className="content">
                      <div className="center">
                        <Dropzone onDrop={this.handleOnDrop.bind(this)} multiple={false} className="ui inverted button">
                          {T.translate("account.page.select_logo")}
                        </Dropzone>
                      </div>
                    </div>
                  </div>
                  <img className="ui rounded image" src={logoPlaceholderMedium} alt="logo-placeholder-medium" />
                </div>
              </div>

              <button disabled={isLoadingLogo} className="fluid ui primary button" onClick={this.handleSubmitImage.bind(this)}><i className="upload icon" aria-hidden="true"></i>&nbsp;{T.translate("account.page.upload")}</button>
            </div>
            <div className="content">
              <h1 className="ui header mt-2 mb-3">{T.translate("account.page.account")}</h1>
              
              <form className={classnames("ui form", { loading: isLoadingForm })} onSubmit={this.handleSubmit.bind(this)}>

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
                <button disabled={isLoadingForm} className="ui primary button"><i className="check circle outline icon" aria-hidden="true"></i>&nbsp;{T.translate("account.page.edit")}</button>
              </div>  
            </form>   
          </div>

        </div> 
      </div>   
    </div>

    )
  }
}

AccountForm.propTypes = {
  updateAccount: PropTypes.func.isRequired,
  s3SignLogo: PropTypes.func.isRequired,
  uploadLogo: PropTypes.func.isRequired,
  addFlashMessage: PropTypes.func.isRequired,
  account: PropTypes.object
}

export default AccountForm


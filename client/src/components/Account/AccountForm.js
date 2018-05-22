import React, { Component } from 'react' 
import PropTypes from 'prop-types'
require('babel-polyfill')
import { connect } from 'react-redux'
import axios from 'axios'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import Dropzone from 'react-dropzone'
import { Validation } from '../../utils'
import { addFlashMessage } from '../../actions/flashMessageActions'
// Semantic UI Form elements
import { Input, Select, Form } from 'semantic-ui-react'
import { graphql, compose } from 'react-apollo'
import { GET_ACCOUNT_QUERY, UPDATE_ACCOUNT_MUTATION, S3_SIGN_LOGO_MUTATION } from '../../graphql/accounts'

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
      subdomain: this.props.data.getAccount ? this.props.data.getAccount.subdomain : '',
      logoUrl: this.props.data.getAccount ? this.props.data.getAccount.logoUrl : '',
      industry: this.props.data.getAccount ? this.props.data.getAccount.industry : '',
      address: {
        street: this.props.data.getAccount ? (this.props.data.getAccount.street ? this.props.data.getAccount.street : '') : '',
        postalCode: this.props.data.getAccount ? (this.props.data.getAccount.postalCode ? this.props.data.getAccount.postalCode : '') : '',
        region: this.props.data.getAccount ? (this.props.data.getAccount.region ? this.props.data.getAccount.region : '') : '',
        country: this.props.data.getAccount ? (this.props.data.getAccount.country ? this.props.data.getAccount.country : '') : ''
      },
      contact: {
        phoneNumber: this.props.data.getAccount ? (this.props.data.getAccount.phoneNumber ? this.props.data.getAccount.phoneNumber : '') : '',
        email: this.props.data.getAccount ? (this.props.data.getAccount.email ? this.props.data.getAccount.email : '') : ''
      },
      file: null,
      errors: {},
      isLoadingLogo: false,
      isLoadingForm: false
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.data.getAccount) {
      this.setState({
        subdomain: nextProps.data.getAccount.subdomain,
        logoUrl: nextProps.data.getAccount.logoUrl ? nextProps.data.getAccount.logoUrl : '',
        industry: nextProps.data.getAccount.industry,
        address: {
          street: nextProps.data.getAccount.street ? nextProps.data.getAccount.street : '',
          postalCode: nextProps.data.getAccount.postalCode ? nextProps.data.getAccount.postalCode : '',
          region: nextProps.data.getAccount.region ? nextProps.data.getAccount.region : '',
          country: nextProps.data.getAccount.country ? nextProps.data.getAccount.country : ''
        },
        contact: {
          phoneNumber: nextProps.data.getAccount.phoneNumber ?  nextProps.data.getAccount.phoneNumber : '',
          email: nextProps.data.getAccount.email ? nextProps.data.getAccount.email : '' 
        }
      })
    }
  }
  
  componentDidMount() {

    $('.ui.card .image').dimmer({
      on: 'hover'
    })
  }

  handleChange = (name, value) => {
  
    if (this.state.errors[name]) {
      // Clone errors form state to local variable
      let errors = Object.assign({}, this.state.errors)
      delete errors[name]

      if (name === "email" || name === "phoneNumber") {

         this.setState({
          contact: { ...this.state.contact, [name]: value },
          errors
        })
      } else if (name === "street" || name === "postalCode" || name === "region"
        || name === "country") {

         this.setState({
          address: { ...this.state.address, [name]: value },
          errors
        })
      } else {
        this.setState({
          [name]: value,
          errors
        })
      }
    } else {

      if (name === "email" || name === "phoneNumber") {

         this.setState({
          contact: { ...this.state.contact, [name]: value },
        })
      } else if (name === "street" || name === "postalCode" || name === "region"
        || name === "country") {
        
         this.setState({
          address: { ...this.state.address, [name]: value }
        })
      } else {
        this.setState({
          [name]: value
        })
      }

    }
   
  }

  isValid() {
    const { errors, isValid } = Validation.validateAccountInput(this.state)

    let updatedErrors = Object.assign({}, this.state.errors)
    updatedErrors = errors

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
      this.setState({ isLoading: true })

     const { name, subdomain, contact: {phoneNumber, email} , logoUrl, address: { street, postalCode, region, country} } = this.state
      
      if (subdomain) {
        this.props.updateAccountMutation({variables: { name, subdomain, phoneNumber, email, logoUrl, street, postalCode: parseInt(postalCode), region, country } })
          .then(res => {

            const { success, errors } = res.data.updateAccount
           
            if (success) {
              this.props.addFlashMessage({
                type: 'success',
                text: T.translate("settings.account.flash.success_update")
              })
              this.setState({ isLoading: false })
            } else {
              let errorsList = {}
              errors.map(error => {
                
                if (error.path === 'phoneNumber' || error.path === 'email') {
                  errorsList['contact'] = {...errorsList['contact'], [error.path]: error.message }
                } else if (error.path === 'street' || error.path === 'postalCode' || error.path === 'region' || error.path === 'country') {
                  errorsList['address'] = {...errorsList['address'], [error.path]: error.message }
                } else {
                  errorsList[error.path] = error.message
                }
              })
              this.setState({ errors: errorsList, isLoading: false })
            }
           
          })
          .catch(err => this.setState({ errors: err, isLoading: false }))
      }   
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

  // Save File to S3
  uploadLogo = (signedRequest, file, options) => {
    return axios.put(signedRequest, file, options)
  }

  uploadToS3 = async (url, file, signedRequest) => {

    const options = {
      headers: {
        "Content-Type": file.type
      }
    }
    
    const uploadLogoResponse = await this.uploadLogo(signedRequest, file, options)

    if (uploadLogoResponse.status === 200) {
      this.setState({
        logoUrl: url
      })

      const { subdomain, logoUrl } = this.state
      
     this.props.updateAccountMutation({variables: { subdomain, logoUrl } })
      .then(res => {

        const { success, errors } = res.data.updateAccount
       
        if (success) {
          this.props.addFlashMessage({
            type: 'success',
            text: T.translate("settings.account.flash.success_update")
          })
          this.setState({ isLoadingLogo: false })
        } else {
          let errorsList = {}
          errors.map(error => {
            
            if (error.path === 'phoneNumber' || error.path === 'email') {
              errorsList['contact'] = {...errorsList['contact'], [error.path]: error.message }
            } else if (error.path === 'street' || error.path === 'postalCode' || error.path === 'region' || error.path === 'country') {
              errorsList['address'] = {...errorsList['address'], [error.path]: error.message }
            } else {
              errorsList[error.path] = error.message
            }
          })
          this.setState({ errors: errorsList, isLoadingLogo: false })
        }
       
      })
      .catch(err => this.setState({ errors: err, isLoadingLogo: false }))
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
    const { file } = this.state
    const response = await this.props.s3SignLogoMutation({
      variables: {
        fileName: this.formatFileName(file.name),
        fileType: file.type
      }
    })

    const { signedRequest, url } = response.data.s3SignLogo
    await this.uploadToS3(url, file, signedRequest)
  }

  render() {
    const { subdomain, industry, logoUrl, contact, address, errors, isLoadingLogo, isLoadingForm } = this.state

    return ( 
      <div className="ui items segment account">
        <div className="ui item">    
          <div className="image">
            <div className={classnames("ui card form", { loading: isLoadingLogo })}>
              <div className="blurring dimmable image">
                <div className="ui dimmer">
                  <div className="content">
                    <div className="center">
                      <Dropzone onDrop={this.handleOnDrop.bind(this)} multiple={false} className="ignore ui inverted button">
                        {T.translate("settings.account.select_logo")}
                      </Dropzone>
                    </div>
                  </div>
                </div>
                <img className="ui rounded image" src={logoUrl ? logoUrl : logoPlaceholderMedium} alt="logo" />
              </div>
            </div>

            <button disabled={isLoadingLogo} className="fluid ui primary button" onClick={this.handleSubmitImage.bind(this)}><i className="upload icon" aria-hidden="true"></i>&nbsp;{T.translate("settings.account.upload")}</button>
          </div>
          <div className="content">
            <h1 className="ui header mt-2 mb-3">{T.translate("settings.account.header")}</h1>
            
            <Form loading={isLoadingForm} onSubmit={this.handleSubmit.bind(this)}>

              { !!errors.message && (typeof errors.message === "string") && <div className="ui negative message"><p>{errors.message}</p></div> }

              <Form.Field  error={!!errors.subdomain}>
                <label>{T.translate("settings.account.subdomain")}</label>
                <Input 
                  placeholder={T.translate("settings.account.subdomain")}
                  name="subdomain" 
                  value={subdomain} 
                  onChange={(e, {value}) => this.handleChange('subdomain', value)} 
                  error={errors.subdomain}
                />
                <span className="red">{errors.name}</span>
              </Form.Field>

              <Form.Field error={!!errors.industry}>
                <label>{T.translate("settings.account.industry")}</label>
                <Select 
                  placeholder={T.translate("settings.account.select_industry")}
                  name="industry"
                  value={industry ? industry : '-'} 
                  onChange={(e, {value}) => this.handleChange('industry', value)} 
                  error={!!errors.industry}
                  options={[
                    { key: "human resource", value: "human resource", text: 'Human resource' },
                    { key: "fashion", value: "fashion", text: 'Fashion' },
                    { key: "import/export", value: "import/export", text: 'Import/Export' },
                    { key: "store", value: "store", text: 'Store' },
                    { key: "technology", value: "technology", text: 'Technology' }
                  ]}
                  selection
                />
                <span className="red">{errors.industry}</span>
              </Form.Field>

              <fieldset className="custom-fieldset">
                <legend className="custom-legend">{T.translate("settings.account.contact.header")}</legend>
                <Form.Field>
                  <label>{T.translate("settings.account.contact.phone_number")}</label>
                  <Input 
                    placeholder={T.translate("settings.account.contact.phone_number")}
                    name="phoneNumber" 
                    value={contact.phoneNumber} 
                    onChange={(e, {value}) => this.handleChange('phoneNumber', value)}
                  />
                </Form.Field>
                <Form.Field>
                  <label>{T.translate("settings.account.contact.email")}</label>
                  <Input 
                    placeholder={T.translate("settings.account.contact.email")}
                    name="email" 
                    value={contact.email} 
                    onChange={(e, {value}) => this.handleChange('email', value)} 
                  />
                </Form.Field>
              </fieldset>
              <fieldset className="custom-fieldset">
                <legend className="custom-legend">{T.translate("settings.account.address.header")}</legend>
                <Form.Field>
                  <label>{T.translate("settings.account.address.street")}</label>
                  <Input 
                    placeholder={T.translate("settings.account.address.street")}
                    name="street" 
                    value={address.street} 
                    onChange={(e, {value}) => this.handleChange('street', value)} 
                    fluid
                    />
                </Form.Field>
                <Form.Field>
                  <label>{T.translate("settings.account.address.postal_code")}</label>
                  <Input 
                    placeholder={T.translate("settings.account.address.postal_code")}
                    name="postalCode" 
                    value={address.postalCode} 
                    onChange={(e, {value}) => this.handleChange('postalCode', value)} 
                    />
                </Form.Field>
                <div>              
                  <label>{T.translate("settings.account.address.country")}</label>
                  <CountryDropdown
                    defaultOptionLabel={T.translate("settings.account.address.select_country")}
                    value={address.country}
                    onChange={(val) => this.selectCountry(val)} 
                    />
                </div> 
                <div className={classnames("field", {error: address.country !== '' && errors['address.region']})}>              
                  <label>{T.translate("settings.account.address.region")}</label> 
                  <RegionDropdown
                    defaultOptionLabel={T.translate("settings.account.address.select_region")}
                    disabled={address.country === ''}
                    country={address.country}
                    value={address.region}
                    onChange={(val) => this.selectRegion(val)} 
                    />
                </div>
              
              </fieldset>

              <div className="field">  
                <Link className="ui primary outline button" to="/dashboard">
                  <i className="minus circle icon"></i>
                  {T.translate("settings.account.cancel")}
                </Link>  
                <button disabled={isLoadingForm} className="ui primary button"><i className="check circle outline icon" aria-hidden="true"></i>&nbsp;{T.translate("settings.account.edit")}</button>
              </div>  
            </Form>   
          </div>

        </div> 
      </div>  
    )
  }
}

AccountForm.propTypes = {
  addFlashMessage: PropTypes.func.isRequired
}

const MutationQuery =  compose(
  graphql(UPDATE_ACCOUNT_MUTATION, {
    name : 'updateAccountMutation',
    options: (props) => ({
      variables: {
        subdomain: props.subdomain
      },
    })
  }),
  graphql(S3_SIGN_LOGO_MUTATION, {
    name : 's3SignLogoMutation'
  }),
  graphql(GET_ACCOUNT_QUERY, {
    options: (props) => ({
      variables: {
        subdomain: props.subdomain
      },
    })
  })
)(AccountForm)

export default connect(null, { addFlashMessage } ) (MutationQuery)



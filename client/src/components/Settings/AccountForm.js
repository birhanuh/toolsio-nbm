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
import { Item, Header, Card, Message, Input, Select, Form, Button, Icon, Dimmer, Image } from 'semantic-ui-react'
import { Image as CloudinaryImage } from 'cloudinary-react'
import { graphql, compose } from 'react-apollo'
import { GET_ACCOUNT_QUERY, UPDATE_ACCOUNT_MUTATION, S3_SIGN_LOGO_MUTATION } from '../../graphql/accounts'

// Localization 
import T from 'i18n-react'

import moment from 'moment'

import $ from 'jquery'

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
      currencyCode: this.props.data.getAccount ? this.props.data.getAccount.currencyCode : 'USD',
      companyId: this.props.data.getAccount ? (this.props.data.getAccount.companyId ? this.props.data.getAccount.companyId : '') : '',
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
      active: false,
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
        currencyCode: nextProps.data.getAccount.currencyCode,
        companyId: nextProps.data.getAccount.companyId ? nextProps.data.getAccount.companyId : '',
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

  componentDidUpdate = () => {
    $('input[name=subdomain]').value = ''
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
      this.setState({ isLoadingForm: true })

     const { subdomain, industry, currencyCode, companyId, contact: {phoneNumber, email} , logoUrl, address: { street, postalCode, region, country} } = this.state
      
      if (subdomain) {
        this.props.updateAccountMutation({variables: { subdomain, industry, currencyCode, companyId, 
          phoneNumber, email, logoUrl, street, postalCode: parseInt(postalCode), region, country },
            update: (store, { data: { updateAccount } }) => {
              const { success, account } = updateAccount

              if (!success) {
                return
              }
              
              // Read the data from our cache for this query.
              const data = store.readQuery({ query: GET_ACCOUNT_QUERY,
                variables: {
                  subdomain: this.props.subdomain
                } 
              })
              // Update account object.
              data.getAccount = account
              // Write our data back to the cache.
              store.writeQuery({ query: GET_ACCOUNT_QUERY,
                variables: {
                  subdomain: this.props.subdomain
                }, data })
            } 
          })
          .then(res => {
            const { success, errors } = res.data.updateAccount     
                  
            if (success) {
              this.props.addFlashMessage({
                type: 'success',
                text: T.translate("settings.account.flash.success_update")
              })
              this.setState({ isLoadingForm: false })
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
              this.setState({ errors: errorsList, isLoadingForm: false })
            }           
          })
          .catch(err => this.setState({ errors: err, isLoadingForm: false }))
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

  uploadToServer = async (public_id) => {

    this.setState({
      logoUrl: public_id
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
          this.setState({ isLoadingLogo: false, file: null, active: false })
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
      'file': files[0],
      'active': true
    })
  }

  handleSubmitImage = async () => {
    const { file } = this.state
    let response
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', process.env.CLOUDINARY_PRESET_LOGOS)

      this.setState({ isLoadingLogo: true })

      response = await axios.post(process.env.CLOUDINARY_API_URL_IMAGE, formData)
      const { public_id } = response.data
      await this.uploadToServer(public_id)
    } else {
      this.props.addFlashMessage({
        type: 'error',
        text: T.translate("settings.account.flash.upload_first")
      })
    }
  }

  toggleShow = () => this.setState(state => ({ active: !state.active }))

  render() {
    const { industry, currencyCode, companyId, logoUrl, contact, address, errors, active, file, isLoadingLogo, isLoadingForm } = this.state
 
    return ( 
      <Item className="mb-5">    
        <Item.Image>
          <Card className={classnames("ui form", { loading: isLoadingLogo })} style={{height: "170px"}}>
            <Dimmer.Dimmable 
              onMouseEnter={this.toggleShow}
              onMouseLeave={this.toggleShow}
              style={{padding: '2px'}}
            >
              {logoUrl ? <CloudinaryImage width="165" height="165" background="white" crop="pad"
                cloudName="toolsio" publicId={logoUrl} /> : 
                  <Image src={logoPlaceholderMedium} alt="logoPlaceholderMedium" /> }
              <Dimmer
                active={file ? true : active}
              >
                {file ? <small className="ui inverted">{file.name}</small> : 
                  <Dropzone onDrop={this.handleOnDrop.bind(this)} multiple={false} className="ignore ui inverted button" >
                    {T.translate("settings.account.select_logo")}
                  </Dropzone>}
              </Dimmer> 
            </Dimmer.Dimmable>
          </Card>

          <Button disabled={isLoadingLogo} primary fluid onClick={this.handleSubmitImage.bind(this)}><Icon name="upload" />&nbsp;{T.translate("settings.account.upload")}</Button>
        </Item.Image>
        <Item.Content>
          <Header as='h1' className="mt-2 mb-3">{T.translate("settings.account.header")}</Header>
          
          <Form loading={isLoadingForm} onSubmit={this.handleSubmit.bind(this)} autoComplete="off">
            {/*<input autoComplete="false" name="subdomain" type="text" style={{display: 'none'}} />*/}
            { !!errors.message && (typeof errors.message === "string") && <Message negative><p>{errors.message}</p></Message> }

            {/*
            <Form.Field  error={!!errors.subdomain}>
              <label>{T.translate("settings.account.subdomain")}</label>
              <Input 
                placeholder={T.translate("settings.account.subdomain")}
                name="subdomain" 
                value={subdomain} 
                onChange={(e, {value}) => this.handleChange('subdomain', value)} 
                error={errors.subdomain}
                autoComplete="off"
              />
              <span className="red">{errors.name}</span>
            </Form.Field>*/}

            <Form.Field error={!!errors.industry}>
              <label>{T.translate("settings.account.industry")}</label>
              <Select 
                placeholder={T.translate("settings.account.select_industry")}
                name="industry"
                value={industry ? industry : '-'} 
                onChange={(e, {value}) => this.handleChange('industry', value)} 
                error={!!errors.industry}
                options={[
                  { key: "beauty salon", value: "beauty salon", text: 'Beauty salon' },
                  { key: "construction", value: "construction", text: 'Construction' },                
                  { key: "design", value: "design", text: 'Design' },
                  { key: "education", value: "education", text: 'Education' },
                  { key: "entertainment", value: "entertainment", text: 'Enterntainment' },
                  { key: "fashion", value: "fashion", text: 'Fashion' },
                  { key: "health care", value: "health care", text: 'Health care' },
                  { key: "housing", value: "housing", text: 'Housing' },
                  { key: "hotel", value: "hotel", text: 'Hotel' },
                  { key: "human resource", value: "human resource", text: 'Human resource' },
                  { key: "import/export", value: "import/export", text: 'Import/Export' },
                  { key: "sport", value: "sport", text: 'Sport' },
                  { key: "stationary", value: "stationary", text: 'Stationary' },
                  { key: "resturant", value: "resturant", text: 'Resturant' },
                  { key: "store", value: "store", text: 'Store' },                
                  { key: "supermarket", value: "supermarket", text: 'Supermarket' },
                  { key: "energy", value: "energy", text: 'Technology' },
                  { key: "travel", value: "travel", text: 'Travel' },              
                  { key: "other", value: "other", text: 'Other' }
                ]}
                selection
              />
              <span className="red">{errors.industry}</span>
            </Form.Field>

            <Form.Field>
              <label>{T.translate("settings.account.company_id")}</label>
              <Input 
                placeholder={T.translate("settings.account.company_id")}
                name="companyId" 
                value={companyId} 
                onChange={(e, {value}) => this.handleChange('companyId', value)} 
                />
            </Form.Field>

            <Form.Field error={!!errors.industry}>
              <label>{T.translate("settings.account.currency_code")}</label>
              <Select 
                placeholder={T.translate("settings.account.select_currency_code")}
                name="currencyCode"
                value={currencyCode} 
                onChange={(e, {value}) => this.handleChange('currencyCode', value)} 
                error={!!errors.currencyCode}
                options={[
                  { key: "USD", flag: 'us', value: "USD", text: 'US Dollar' },
                  { key: "EUR", flag: 'eu', value: "EUR", text: 'Euro' },
                  { key: "GBP", flag: 'gb', value: "GBP", text: 'British Pound' },
                  { key: "INR", flag: 'in', value: "INR", text: 'Indian Rupee' },
                  { key: "AUD", flag: 'au', value: "AUD", text: 'Australian Dollar' },
                  { key: "CAD", flag: 'ca', value: "CAD", text: 'Canadian Dollar' },
                  { key: "CHF", flag: 'ch', value: "CHF", text: 'Swiss Franc' },
                  { key: "SGD", flag: 'sg', value: "SGD", text: 'Singapore Dollar' },
                  { key: "MYR", flag: 'my', value: "MYR", text: 'Malaysian Ringgit' },
                  { key: "JPY", flag: 'jp', value: "JPY", text: 'Japanese Yen' },
                  { key: "CNY", flag: 'cn', value: "CNY", text: 'Chinese Yuan Renminbi' },
                  { key: "ETB", flag: 'et', value: "ETB", text: 'Ethiopia, Birr' },
                  { key: "KES", flag: 'ke', value: "KES", text: 'Kenyan Shilling' },
                  { key: "ZAR", flag: 'za', value: "ZAR", text: 'South African Rand' }
                ]}
                selection
              />
              <span className="red">{errors.currencyCode}</span>
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
                <Icon name="minus circle" />
                {T.translate("settings.account.cancel")}
              </Link>   
              <Button primary disabled={isLoadingForm}><Icon name="check circle outline" />&nbsp;{T.translate("settings.account.edit")}</Button>
            </div>  
          </Form>   
        </Item.Content>

      </Item>  
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



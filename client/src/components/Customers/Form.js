import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { Validation } from '../../utils'
import { addFlashMessage } from '../../actions/flashMessageActions'
import { InputField } from '../../utils/FormFields'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

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
      id: this.props.data.getCustomer ? this.props.data.getCustomer.id : null,
      name: this.props.data.getCustomer ? this.props.data.getCustomer.name : '',
      address: {
        street: this.props.data.getCustomer ? this.props.data.getCustomer.street: '',
        postalCode: this.props.data.getCustomer ? this.props.data.getCustomer.postalCode : '',
        region: this.props.data.getCustomer ? this.props.data.getCustomer.region : '',
        country: this.props.data.getCustomer ? this.props.data.getCustomer.country : ''
      },
      vatNumber: this.props.data.getCustomer ? this.props.data.getCustomer.vatNumber : '',
      isContactIncludedInInvoice: this.props.data.getCustomer ? this.props.data.getCustomer.isContactIncludedInInvoice : false,
      contact: {
        phoneNumber: this.props.data.getCustomer ? this.props.data.getCustomer.phoneNumber : '',
        email: this.props.data.getCustomer ? this.props.data.getCustomer.email : ''
      },
      errors: {},
      isLoading: false
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.data.getCustomer) {
      this.setState({
        id: nextProps.data.getCustomer.id,
        name: nextProps.data.getCustomer.name,
        address: {
          street: !nextProps.data.getCustomer.street ? '' : nextProps.data.getCustomer.street,
          postalCode: !nextProps.data.getCustomer.postalCode ? '' : nextProps.data.getCustomer.postalCode,
          region: !nextProps.data.getCustomer.region ? '' : nextProps.data.getCustomer.region,
          country: !nextProps.data.getCustomer.country ? '' : nextProps.data.getCustomer.country
        },
        vatNumber: nextProps.data.getCustomer.vatNumber,
        isContactIncludedInInvoice: nextProps.data.getCustomer.isContactIncludedInInvoice,
        contact: {
          phoneNumber: !nextProps.data.getCustomer.phoneNumber ? '' : nextProps.data.getCustomer.phoneNumber,
          email: !nextProps.data.getCustomer.email ? '' : nextProps.data.getCustomer.email
        }
      })
    }
  }

  componentDidMount = () => {
    let classContextThis = this
    
    if (this.state.isContactIncludedInInvoice === true) {
      $('.ui.toggle.checkbox').checkbox('check')
    }

    $('.ui.toggle.checkbox').checkbox({
      onChecked: function() {
         classContextThis.setState({
          isContactIncludedInInvoice: true
        })
      },
      onUnchecked: function() {
        classContextThis.setState({
          isContactIncludedInInvoice: false
        })
      }
    })

  }

  handleChange = (e) => {
  
    if (this.state.errors[e.target.name]) {
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

      const { id, name, vatNumber, contact: {phoneNumber, email} , isContactIncludedInInvoice, address: { street, postalCode, region, country} } = this.state

      this.setState({ isLoading: true })
      
      if (id) {
        this.props.updateCustomerMutation({variables: { id, name, vatNumber: parseInt(vatNumber), phoneNumber, email, isContactIncludedInInvoice, street, postalCode: parseInt(postalCode), region, country } })
          .then(res => {
            
            // this.props.addFlashMessage({
            //   type: 'success',
            //   text: T.translate("customers.form.flash.success_update", { name: name})
            // })  
            // this.context.router.history.push('/customers')

            const { success, errors } = res.data.createCustomer
           
            if (success) {
              this.context.router.history.push('/customers')
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

      this.props.createCustomerMutation({variables: { name, vatNumber: parseInt(vatNumber), phoneNumber, email, isContactIncludedInInvoice, 
        street, postalCode: parseInt(postalCode), region, country } })
        .then(res => {
          
          // this.props.addFlashMessage({
          //   type: 'success',
          //   text: T.translate("customers.form.flash.success_create", { name: name})
          // })  
          // this.context.router.history.push('/customers')

          const { success, errors } = res.data.createCustomer
         
          if (success) {
            this.context.router.history.push('/customers')
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
    const { id, name, vatNumber, contact, isContactIncludedInInvoice, address, errors, isLoading } = this.state
    
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
               {id ? <h1 className="ui header">{T.translate("customers.form.edit_customer")}</h1> : <h1 className="ui header">{T.translate("customers.form.new_customer")}</h1>}
            </div>

            { !!errors.message && <div className="ui negative message"><p>{errors.message}</p></div> }

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
              placeholder={T.translate("customers.show.vat_number")}
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
                placeholder={T.translate("customers.show.contact.phone_number")}
                error={errors.contact && errors.contact.phoneNumber}
                formClass="inline field"
              />
              <InputField
                label={T.translate("customers.show.contact.email")}
                name="email" 
                value={contact.email} 
                onChange={this.handleChange.bind(this)} 
                placeholder={T.translate("customers.show.contact.email")}
                error={errors.contact && errors.contact.email}
                formClass="inline field"
              />
            </fieldset>
            <div className="inline field">              
              <label>{T.translate("customers.show.include_contact_in_invoice")}</label> 
              <div className="ui toggle checkbox">
                <input 
                  type="checkbox" 
                  name="isContactIncludedInInvoice" 
                  value={isContactIncludedInInvoice}
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
                placeholder={T.translate("customers.show.address.street")}
                error={errors.address && errors.address.street}
                formClass="inline field"
              />
              <InputField
                label={T.translate("customers.show.address.postal_code")}
                name="postalCode" 
                value={address.postalCode} 
                onChange={this.handleChange.bind(this)} 
                placeholder={T.translate("customers.show.address.postal_code")}
                error={errors.address && errors.address.postalCode}
                formClass="inline field"
              />
              <div className={classnames("inline field", {error: errors.address && errors.address.country})}>              
                <label>{T.translate("customers.show.address.country")}</label>
                <CountryDropdown
                  defaultOptionLabel={T.translate("customers.form.select_country")}
                  value={address.country}
                  onChange={(val) => this.selectCountry(val)} 
                  error={errors.address && errors.address.country} />
                
                <span className={classnames({red: errors.address && errors.address.country})}>{errors.address && errors.address.country}</span>  
              </div>  
              <div className={classnames("inline field", {error: errors.address && errors.address.region})}>              
                <label>{T.translate("customers.show.address.region")}</label> 
                <RegionDropdown
                  defaultOptionLabel={T.translate("customers.form.select_region")}
                  disabled={address.country === ''}
                  country={address.country}
                  value={address.region}
                  onChange={(val) => this.selectRegion(val)} 
                  error={errors.address && errors.address.region} />
                
                <span className={classnames({red: address.region !== '' && errors.address && errors.address.region})}>{errors.address && errors.address.region}</span>  
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
  addFlashMessage: PropTypes.func.isRequired,
}

Form.contextTypes = {
  router: PropTypes.object.isRequired
}

const createCustomerMutation = gql`
  mutation createCustomer($name: String!, $vatNumber: Int!, $email: String!, $phoneNumber: String!, $isContactIncludedInInvoice: Boolean!, $street: String, $postalCode: String, $region: String, $country: String) {
    createCustomer(name: $name, vatNumber: $vatNumber, email: $email, phoneNumber: $phoneNumber, isContactIncludedInInvoice: $isContactIncludedInInvoice, street: $street, 
      postalCode: $postalCode, region: $region, country: $country) {
      success
      errors {
        path
        message
      }
    }
  }
`
const updateCustomerMutation = gql`
  mutation updateCustomer($id: Int!, $name: String!, $vatNumber: Int!, $email: String!, $phoneNumber: String!, $isContactIncludedInInvoice: Boolean!, $street: String, $postalCode: String, $region: String, $country: String) {
    updateCustomer(id: $id, name: $name, vatNumber: $vatNumber, email: $email, phoneNumber: $phoneNumber, isContactIncludedInInvoice: $isContactIncludedInInvoice, street: $street, postalCode: $postalCode, region: $region, country: $country) {
      success
      errors {
        path
        message
      }
    }
  }
`
const getCustomerQuery = gql`
  query getCustomer($id: Int!) {
    getCustomer(id: $id) {
      id
      name
      vatNumber
      phoneNumber
      email
      isContactIncludedInInvoice
      street
      postalCode
      region
      country
    }
  }
`

const MutationsQuery =  compose(
  graphql(createCustomerMutation, {
    name : 'createCustomerMutation'
  }),
  graphql(updateCustomerMutation, {
    name: 'updateCustomerMutation'
  }),
  graphql(getCustomerQuery, {
    options: (props) => ({
      variables: {
        id: props.match.params.id ? parseInt(props.match.params.id) : 0
      },
    })
  })
)(Form)

export default connect(null, { addFlashMessage } ) (MutationsQuery)

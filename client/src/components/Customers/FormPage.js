import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { Validation } from '../../utils'
import { addFlashMessage } from '../../actions/flashMessageActions'
// Semantic UI Form elements
import { Input, Checkbox, Form } from 'semantic-ui-react'
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

class FormPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.data.getCustomer ? this.props.data.getCustomer.id : null,
      name: this.props.data.getCustomer ? this.props.data.getCustomer.name : '',
      address: {
        street: this.props.data.getCustomer ? (this.props.data.getCustomer.street ? this.props.data.getCustomer.street : '') : '',
        postalCode: this.props.data.getCustomer ? (this.props.data.getCustomer.postalCode ? this.props.data.getCustomer.postalCode : '') : '',
        region: this.props.data.getCustomer ? (this.props.data.getCustomer.region ? this.props.data.getCustomer.region : '') : '',
        country: this.props.data.getCustomer ? (this.props.data.getCustomer.country ? this.props.data.getCustomer.country : '') : ''
      },
      vatNumber: this.props.data.getCustomer ? this.props.data.getCustomer.vatNumber : '',
      isContactIncludedInInvoice: this.props.data.getCustomer ? this.props.data.getCustomer.isContactIncludedInInvoice : false,
      contact: {
        phoneNumber: this.props.data.getCustomer ? (this.props.data.getCustomer.phoneNumber ? this.props.data.getCustomer.phoneNumber : '') : '',
        email: this.props.data.getCustomer ? (this.props.data.getCustomer.email ? this.props.data.getCustomer.email : '') : ''
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
          street: nextProps.data.getCustomer.street ? nextProps.data.getCustomer.street : '',
          postalCode: nextProps.data.getCustomer.postalCode ? nextProps.data.getCustomer.postalCode : '',
          region: nextProps.data.getCustomer.region ? nextProps.data.getCustomer.region : '',
          country: nextProps.data.getCustomer.country ? nextProps.data.getCustomer.country : '' 
        },
        vatNumber: nextProps.data.getCustomer.vatNumber,
        isContactIncludedInInvoice: nextProps.data.getCustomer.isContactIncludedInInvoice,
        contact: {
          phoneNumber: nextProps.data.getCustomer.phoneNumber ? nextProps.data.getCustomer.phoneNumber : '',
          email: nextProps.data.getCustomer.email ? nextProps.data.getCustomer.email : ''
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
        this.props.updateCustomerMutation({variables: { id, name, vatNumber: parseInt(vatNumber), phoneNumber, 
          email, isContactIncludedInInvoice, street, postalCode: parseInt(postalCode), region, country },
          update: (store, { data: { updateCustomer } }) => {
            const { success, customer } = updateCustomer

            if (!success) {
              return
            }
            // Read the data from our cache for this query.
            const data = store.readQuery({ query: getCustomersQuery })
            // Add our comment from the mutation to the end.
            
            let updatedCustomers = data.getCustomers.map(item => {
              if (item.id === customer.id) {
                return {...customer, __typename: 'Customer'}
              }
              return item
            })

            data.getCustomers = updatedCustomers

            // Write our data back to the cache.
            store.writeQuery({ query: getCustomersQuery, data })
          }})
          .then(res => {

            const { success, errors } = res.data.updateCustomer
           
            if (success) {
              this.props.addFlashMessage({
                type: 'success',
                text: T.translate("customers.form.flash.success_update", { name: name})
              })  

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
      } else {

        this.props.createCustomerMutation({variables: { name, vatNumber: parseInt(vatNumber), phoneNumber, email, isContactIncludedInInvoice, 
          street, postalCode: parseInt(postalCode), region, country },
          update: (store, { data: { createCustomer } }) => {
            const { success, customer } = createCustomer

            if (!success) {
              return
            }
            // Read the data from our cache for this query.
            const data = store.readQuery({ query: getCustomersQuery })
            // Add our comment from the mutation to the end.
            data.getCustomers.push(customer)
            // Write our data back to the cache.
            store.writeQuery({ query: getCustomersQuery, data })
          }})
          .then(res => {

            const { success, errors } = res.data.createCustomer
           
            if (success) {
              this.props.addFlashMessage({
                type: 'success',
                text: T.translate("customers.form.flash.success_create", { name: name})
              }) 

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

    return (  
      <div className="row column">

        <Breadcrumb />

        <div className="ui text container segment">  

          <Form loading={isLoading} onSubmit={this.handleSubmit.bind(this)}>

            <div className="inline field">  
              {id ? <h1 className="ui header">{T.translate("customers.form.edit_customer")}</h1> : <h1 className="ui header">{T.translate("customers.form.new_customer")}</h1>}        
            </div>

            { !!errors.message && <div className="ui negative message"><p>{errors.message}</p></div> } 
            
            <Form.Field inline>
              <label className={classnames({red: !!errors.name})}>{T.translate("customers.form.name")}</label>
              <Input
                placeholder={T.translate("customers.form.name")}
                name="name" 
                value={name} 
                onChange={(e, {value}) => this.handleChange('name', value)} 
                error={!!errors.name}
              />
              <span className="red">{errors.name}</span>
            </Form.Field>

            <Form.Field inline>
              <label className={classnames({red: !!errors.vatNumber})}>{T.translate("customers.form.vat_number")}</label>
              <Input
                placeholder={T.translate("customers.form.vat_number")}
                name="vatNumber" 
                value={vatNumber} 
                onChange={(e, {value}) => this.handleChange('vatNumber', value)} 
                error={!!errors.vatNumber}
              />
              <span className="red">{errors.vatNumber}</span>
            </Form.Field>
             <fieldset className="custom-fieldset">
              <legend className="custom-legend">{T.translate("customers.show.contact.header")}</legend>
              <Form.Field inline>
                <label className={classnames({red: !!errors.contact.phoneNumber})}>{T.translate("customers.form.contact.phone_number")}</label>
                <Input
                  placeholder={T.translate("customers.form.contact.phone_number")}
                  name="phoneNumber" 
                  value={contact.phoneNumber} 
                  onChange={(e, {value}) => this.handleChange('phoneNumber', value)} 
                  error={errors.contact && errors.contact.phoneNumber}
                />
                <span className="red">{errors.name}</span>
              </Form.Field>
              <Form.Field inline>
                <label className={classnames({red: !!errors.contact.email})}>{T.translate("customers.form.contact.email")}</label>
                <Input
                  placeholder={T.translate("customers.form.contact.email")}
                  name="email" 
                  value={contact.email} 
                  onChange={(e, {value}) => this.handleChange('email', value)} 
                  error={errors.contact && errors.contact.email}
                />
                <span className="red">{errors.email}</span>
              </Form.Field>
            </fieldset>
             <Form.Field inline>
              <label className={classnames({red: !!errors.isContactIncludedInInvoice})}>{T.translate("customers.form.include_contact_in_invoice")}</label>
              <Checkbox
                toggle
                name="isContactIncludedInInvoice" 
                value={contact.isContactIncludedInInvoice} 
                onChange={(e, {value}) => this.handleChange('isContactIncludedInInvoice', value)} 
                error={errors.contact && errors.contact.isContactIncludedInInvoice}
              />
              <span className="red">{errors.name}</span>
            </Form.Field>

            <fieldset className="custom-fieldset">
              <legend className="custom-legend">{T.translate("customers.show.address.header")}</legend>
              <Form.Field inline>
                <label className={classnames({red: !!errors.address.street})}>{T.translate("customers.form.address.street")}</label>
                <Input
                  placeholder={T.translate("customers.form.address.street")}
                  name="street" 
                  value={address.street} 
                  onChange={(e, {value}) => this.handleChange('street', value)} 
                  error={errors.address && errors.address.street}
                />
                <span className="red">{errors.name}</span>
              </Form.Field>
              <Form.Field inline>
                <label className={classnames({red: !!errors.address.postalCode})}>{T.translate("customers.form.address.postal_code")}</label>
                <Input
                  placeholder={T.translate("customers.form.address.postal_code")}
                  name="postalCode" 
                  value={address.postalCode} 
                  onChange={(e, {value}) => this.handleChange('postalCode', value)} 
                  error={errors.address && errors.address.postalCode}
                />
                <span className="red">{errors.name}</span>
              </Form.Field>
              <div className={classnames("inline field", {error: errors.address && errors.address.country})}>              
                <label>{T.translate("customers.form.address.country")}</label>
                <CountryDropdown
                  defaultOptionLabel={T.translate("customers.form.address.select_country")}
                  value={address.country}
                  onChange={(val) => this.selectCountry(val)} 
                  error={errors.address && errors.address.country} />
                
                <span className={classnames({red: errors.address && errors.address.country})}>{errors.address && errors.address.country}</span>  
              </div>  
              <div className={classnames("inline field", {error: errors.address && errors.address.region})}>              
                <label>{T.translate("customers.show.address.region")}</label> 
                <RegionDropdown
                  defaultOptionLabel={T.translate("customers.form.address.select_region")}
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
          </Form> 
        </div>  
      </div>
    )
  }
}

FormPage.propTypes = {
  addFlashMessage: PropTypes.func.isRequired,
}

FormPage.contextTypes = {
  router: PropTypes.object.isRequired
}

const createCustomerMutation = gql`
  mutation createCustomer($name: String!, $vatNumber: Int!, $email: String!, $phoneNumber: String!, $isContactIncludedInInvoice: Boolean!, $street: String, $postalCode: String, $region: String, $country: String) {
    createCustomer(name: $name, vatNumber: $vatNumber, email: $email, phoneNumber: $phoneNumber, isContactIncludedInInvoice: $isContactIncludedInInvoice, street: $street, 
      postalCode: $postalCode, region: $region, country: $country) {
      success
      customer {
        id
        name
        vatNumber
        phoneNumber
        email
      }
      errors {
        path
        message
      }
    }
  }
`
const updateCustomerMutation = gql`
  mutation updateCustomer($id: Int!, $name: String, $vatNumber: Int, $email: String, $phoneNumber: String, $isContactIncludedInInvoice: Boolean, $street: String, $postalCode: String, $region: String, $country: String) {
    updateCustomer(id: $id, name: $name, vatNumber: $vatNumber, email: $email, phoneNumber: $phoneNumber, isContactIncludedInInvoice: $isContactIncludedInInvoice, street: $street, postalCode: $postalCode, region: $region, country: $country) {
      success
      customer {
        id
        name
        vatNumber
        phoneNumber
        email
      }
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

const getCustomersQuery = gql`
  {
    getCustomers {
      id
      name
      vatNumber
      phoneNumber
      email
    }
  }
`

const MutationsQueries =  compose(
  graphql(createCustomerMutation, {
    name : 'createCustomerMutation'
  }),
  graphql(updateCustomerMutation, {
    name: 'updateCustomerMutation'
  }),
  graphql(getCustomersQuery),
  graphql(getCustomerQuery, {
    options: (props) => ({
      variables: {
        id: props.match.params.id ? parseInt(props.match.params.id) : 0
      },
    })
  })
)(FormPage)

export default connect(null, { addFlashMessage } ) (MutationsQueries)

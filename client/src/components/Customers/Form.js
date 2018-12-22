import React, { Component } from 'react' 
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { Validation } from '../../utils'
import { addFlashMessage } from '../../actions/flashMessageActions'
// Semantic UI JS
import { Grid, Container, Segment, Message, Header, Input, Form as FormElement, Checkbox, Button, Icon } from 'semantic-ui-react'
import { graphql, compose } from 'react-apollo'
import { GET_CUSTOMERS_QUERY, GET_CUSTOMER_QUERY, CREATE_CUSTOMER_MUTATION, UPDATE_CUSTOMER_MUTATION } from '../../graphql/customers'

import 'react-datepicker/dist/react-datepicker.css'

// Localization 
import T from 'i18n-react'

// Country region selector 
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector'

class Form extends Component {

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

  handleChangeToggle = (name, checked) => {
    if (this.state.errors[name]) {
      // Clone errors form state to local variable
      let errors = Object.assign({}, this.state.errors)
      delete errors[name]

      this.setState({
        [name]: checked,
        errors
      })
    } else {
      this.setState({
        [name]: checked
      })
    }   
  }

  isValid() {
    const { errors, isValid } = Validation.validateCustomerInput(this.state)

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
            const data = store.readQuery({ query: GET_CUSTOMERS_QUERY,
              variables: {
                order: 'DESC',
                offset: 0,
                limit: 10,
                name: ""
              } 
            })
           
            // Add our Customer from the mutation to the end.            
            let updatedCustomers = data.getCustomers.customers.map(item => {
              if (item.id === customer.id) {
                return {...customer, __typename: 'Customer'}
              }
              return item
            })
            data.getCustomers.customers = updatedCustomers 

            // Write our data back to the cache.
            store.writeQuery({ query: GET_CUSTOMERS_QUERY, variables: {
                order: 'DESC',
                offset: 0,
                limit: 10,
                name: ""
              }, data })
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

            window.performance.mark('form_start')

            if (!success) {
              return
            }

            // Read the data from our cache for this query.
            const data = store.readQuery({ query: GET_CUSTOMERS_QUERY,
              variables: {
                order: 'DESC',
                offset: 0,
                limit: 10,
                name: ""
              }  
            })
            // Add our Customer from the mutation to the end.
            data.getCustomers.customers.push(customer)
            // Write our data back to the cache.
            store.writeQuery({ query: GET_CUSTOMERS_QUERY, variables: {
                order: 'DESC',
                offset: 0,
                limit: 10,
                name: ""
              }, data })
          }})
          .then(res => {
            const { success, errors } = res.data.createCustomer
            
            window.performance.mark('form_end')
            window.performance.measure('form_interaction', 'form_start', 'form_end')

            const value = window.performance.getEntriesByName('form_interaction')[0].duration
            console.log('form_interaction in ms: ', value)

            if (success) {
              this.props.addFlashMessage({
                type: 'success',
                text: T.translate("customers.form.flash.success_create", { name: name})
              }) 

              // Redirect to projects/new based on previous path
              if (this.props.location.state && this.props.location.state.prevPath && this.props.location.state.prevPath === '/projects/new') {
                this.context.router.history.push('/projects/new')
                return
              }

              // Redirect to sales/new based on previous path
              if (this.props.location.state && this.props.location.state.prevPath && this.props.location.state.prevPath === '/sales/new') {
                this.context.router.history.push('/sales/new')
                return
              }

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
      <Grid.Row columns={1}>
        <Container text>
          <Segment>  

            <FormElement loading={isLoading} onSubmit={this.handleSubmit.bind(this)}>

              <div className="inline field">  
                {id ? <Header as="h1">{T.translate("customers.form.edit_customer")}</Header> : <Header as="h1">{T.translate("customers.form.new_customer")}</Header>}        
              </div>

              { !!errors.message && <Message negative><p>{errors.message}</p></Message> } 
              
              <FormElement.Field inline error={!!errors.name}>
                <label>{T.translate("customers.form.name")}</label>
                <Input
                  placeholder={T.translate("customers.form.name")}
                  name="name" 
                  value={name} 
                  onChange={(e, {value}) => this.handleChange('name', value)}
                />
                <span className="red">{errors.name}</span>
              </FormElement.Field>

              <FormElement.Field inline error={!!errors.vatNumber}>
                <label>{T.translate("customers.form.vat_number")}</label>
                <Input
                  placeholder={T.translate("customers.form.vat_number")}
                  name="vatNumber" 
                  value={vatNumber} 
                  onChange={(e, {value}) => this.handleChange('vatNumber', value)} 
                />
                <span className="red">{errors.vatNumber}</span>
              </FormElement.Field>
               <fieldset className="custom-fieldset">
                <legend className="custom-legend">{T.translate("customers.show.contact.header")}</legend>
                <FormElement.Field inline error={!!errors.phoneNumber}>
                  <label>{T.translate("customers.form.contact.phone_number")}</label>
                  <Input
                    placeholder={T.translate("customers.form.contact.phone_number")}
                    name="phoneNumber" 
                    value={contact.phoneNumber} 
                    onChange={(e, {value}) => this.handleChange('phoneNumber', value)} 
                  />
                  <span className="red">{errors.phoneNumber}</span>
                </FormElement.Field>
                <FormElement.Field inline error={!!errors.email}>
                  <label>{T.translate("customers.form.contact.email")}</label>
                  <Input
                    placeholder={T.translate("customers.form.contact.email")}
                    name="email" 
                    value={contact.email} 
                    onChange={(e, {value}) => this.handleChange('email', value)} 
                  />
                  <span className="red">{errors.email}</span>
                </FormElement.Field>
              </fieldset>
               <FormElement.Field inline>
                <label>{T.translate("customers.form.include_contact_in_invoice")}</label>
                <Checkbox
                  toggle
                  name="isContactIncludedInInvoice" 
                  checked={isContactIncludedInInvoice} 
                  onChange={(e, {checked}) => this.handleChangeToggle('isContactIncludedInInvoice', checked)}
                />
              </FormElement.Field>

              <fieldset className="custom-fieldset">
                <legend className="custom-legend">{T.translate("customers.show.address.header")}</legend>
                <FormElement.Field inline error={!!errors.street}>
                  <label>{T.translate("customers.form.address.street")}</label>
                  <Input
                    placeholder={T.translate("customers.form.address.street")}
                    name="street" 
                    value={address.street} 
                    onChange={(e, {value}) => this.handleChange('street', value)} 
                  />
                  <span className="red">{errors.street}</span>
                </FormElement.Field>
                <FormElement.Field inline error={!!errors.postalCode}>
                  <label>{T.translate("customers.form.address.postal_code")}</label>
                  <Input
                    placeholder={T.translate("customers.form.address.postal_code")}
                    name="postalCode" 
                    value={address.postalCode} 
                    onChange={(e, {value}) => this.handleChange('postalCode', value)} 
                  />
                  <span className="red">{errors.postalCode}</span>
                </FormElement.Field>
                <div className={classnames("inline field", {error: !!errors.country})}>              
                  <label>{T.translate("customers.form.address.country")}</label>
                  <CountryDropdown
                    defaultOptionLabel={T.translate("customers.form.address.select_country")}
                    value={address.country}
                    onChange={(val) => this.selectCountry(val)} 
                    error={!!errors.country} />
                  
                  <span className="red">{errors.country}</span>  
                </div> 
                <div className={classnames("inline field", {error: errors.region})}>              
                  <label>{T.translate("customers.show.address.region")}</label> 
                  <RegionDropdown
                    defaultOptionLabel={T.translate("customers.form.address.select_region")}
                    disabled={address.country === ''}
                    country={address.country}
                    value={address.region}
                    onChange={(val) => this.selectRegion(val)} />
                  
                  <span className="red">{errors.region}</span>  
                </div>
                
              </fieldset>

              <div className="inline field">  
                <Link className="ui primary outline button" to="/customers">
                  <i className="minus circle icon"></i>
                  {T.translate("customers.form.cancel")}
                </Link>  
                <Button primary disabled={isLoading}><Icon name="check circle outline" />&nbsp;{T.translate("customers.form.save")}</Button>
              </div>  
            </FormElement> 
          </Segment>
        </Container>
      </Grid.Row>  
    )
  }
}

Form.propTypes = {
  addFlashMessage: PropTypes.func.isRequired,
}

Form.contextTypes = {
  router: PropTypes.object.isRequired
}

const MutationsQueries =  compose(
  graphql(CREATE_CUSTOMER_MUTATION, {
    name : 'createCustomerMutation'
  }),
  graphql(UPDATE_CUSTOMER_MUTATION, {
    name: 'updateCustomerMutation'
  }),
  graphql(GET_CUSTOMERS_QUERY, {
    name: 'getCustomersQuery', 
    options: () => ({
      variables: {
        order: 'DESC',
        offset: 0,
        limit: 10,
        name: ''
      }
    })
  }),
  graphql(GET_CUSTOMER_QUERY, {
    options: (props) => ({
      variables: {
        id: props.match.params.id ? parseInt(props.match.params.id) : 0
      }
    })
  })
)(Form)

export default connect(null, { addFlashMessage } ) (MutationsQueries)

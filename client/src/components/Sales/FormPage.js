import React, { Component } from 'react' 
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classnames from 'classnames'
import map from 'lodash/map'
import { addFlashMessage } from '../../actions/flashMessageActions'
import { Validation } from '../../utils'
// Semantic UI Form elements
import { Input, Select, TextArea, Form } from 'semantic-ui-react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'

// Localization 
import T from 'i18n-react'

import Breadcrumb from '../Layouts/Breadcrumb'

class FormPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.data.getSale ? this.props.data.getSale.id : null,
      name: this.props.data.getSale ? this.props.data.getSale.name : '',
      deadline: this.props.data.getSale ? moment(this.props.data.getSale.deadline) : moment(),
      customerId: this.props.data.getSale ? this.props.data.getSale.customerId : '',
      status: this.props.data.getSale ? this.props.data.getSale.status : 'new',
      description: this.props.data.getSale ? this.props.data.getSale.description : '',
      errors: {},
      isLoading: false
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.data.getSale) {
      this.setState({
        id: nextProps.data.getSale.id,
        name: nextProps.data.getSale.name,
        deadline: moment(nextProps.data.getSale.deadline),
        customerId: nextProps.data.getSale.customer.id,
        status: nextProps.data.getSale.status,
        description: nextProps.data.getSale.description,
      })
    }
  }

  handleChange = (name, value) => {
    if (this.state.errors[name]) {
      // Clone errors form state to local variable
      let errors = Object.assign({}, this.state.errors)
      delete errors[name]

      this.setState({
        [name]: value,
        errors
      })
     
    } else {

      this.setState({
        [name]: value
      })  
    }   
  }

  isValid() {
    const { errors, isValid } = Validation.validateSaleInput(this.state)

    let updatedErrors = Object.assign({}, this.state.errors)
    updatedErrors = errors

    if (!isValid) {
      this.setState({ errors: updatedErrors })
    }

    return isValid
  }

  handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (this.isValid()) { 
      this.setState({ isLoading: true })

      const { id, name, deadline, status, description, customerId } = this.state
      
      if (id) {
        this.props.updateSaleMutation({ 
        variables: { id, name, deadline, status, description, customerId: parseInt(customerId) },
        update: (store, { data: { updateSale } }) => {
          const { success, sale } = updateSale
          
          if (!success) {
            return
          }
          // Read the data from our cache for this query.
          const data = store.readQuery({ query: getCustomersSalesQuery })
          // Add our comment from the mutation to the end.
          
          let updatedSales = data.getSales.map(item => {
            if (item.id === sale.id) {
              return {...sale, __typename: 'Sale'}
            }
            return item
          })

          data.getSales = updatedSales

          // Write our data back to the cache.
          store.writeQuery({ query: getCustomersSalesQuery, data })
        }})
        .then(res => {

          const { success, sale, errors } = res.data.updateSale

          if (success) {            
            this.props.addFlashMessage({
              type: 'success',
              text: T.translate("sales.form.flash.success_update", { name: sale.name})
            })  
            this.context.router.history.push('/sales')
          } else {
            let errorsList = {}
            errors.map(error => errorsList[error.path] = error.message)

            this.setState({ errors: errorsList, isLoading: false })
          }
        })
        .catch(err => this.setState({ errors: err, isLoading: false }))
      } else {

        this.props.createSaleMutation({ 
          variables: { name, deadline, status, description, customerId: parseInt(customerId) },
          update: (store, { data: { createSale } }) => {
            const { success, sale } = createSale

            if (!success) {
              return
            }
            // Read the data from our cache for this query.
            const data = store.readQuery({ query: getCustomersSalesQuery });
            // Add our comment from the mutation to the end.
            data.getSales.push(sale);
            // Write our data back to the cache.
            store.writeQuery({ query: getCustomersSalesQuery, data });
          }})
          .then(res => {          

            const { success, sale, errors } = res.data.createSale

            if (success) {
              this.props.addFlashMessage({
                type: 'success',
                text: T.translate("sales.form.flash.success_create", { name: name})
              })  
              
              this.context.router.history.push('/sales')
            } else {
              let errorsList = {}
              errors.map(error => errorsList[error.path] = error.message)

              this.setState({ errors: errorsList, isLoading: false })
            }
          })
          .catch(err => this.setState({ errors: err, isLoading: false }))
        }
    }    
  }

  handleChangeDate(deadline) {
    if (!this.state.errors['deadline']) {
      // Clone errors form state to local variable
      let errors = Object.assign({}, this.state.errors)
      delete errors['deadline']
      
      this.setState({
        deadline: deadline,
        errors
      })
    } else {
      this.setState({
        deadline: deadline
      })
    }
  } 

  render() {
    const { id, name, deadline, customerId, status, description, errors, isLoading } = this.state
    
    const { getCustomers } = this.props.getCustomersSalesQuery
  
    const customersOptions = map(getCustomers, (customer) => 
      ({ key: customer.id, value: customer.id, text: customer.name })
    )

    return (  
      <div className="row column">

        <Breadcrumb />

        <div className="ui text container ui segment">  

          <Form loading={isLoading} onSubmit={this.handleSubmit.bind(this)}>

            <div className="inline field">  
              {id ? <h1 className="ui header">{T.translate("sales.form.edit_sale")}</h1> : <h1 className="ui header">{T.translate("sales.form.new_sale")}</h1>}        
            </div>

            { !!errors.message && <div className="ui negative message"><p>{errors.message}</p></div> } 
            
            <Form.Field inline>
              <label className={classnames({red: !!errors.name})}>{T.translate("sales.form.name")}</label>
              <Input
                placeholder={T.translate("sales.form.name")}
                name="name" 
                value={name} 
                onChange={(e, {value}) => this.handleChange('name', value)} 
                error={!!errors.name}
              />
              <span className="red">{errors.name}</span>
            </Form.Field>

            <Form.Field inline error={errors.deadline}>
              <label>{T.translate("sales.form.deadline")}</label>
              <DatePicker
                dateFormat="DD/MM/YYYY"
                selected={deadline}
                onChange={this.handleChangeDate.bind(this)}
              />
              <span className="red">{errors.deadline}</span>
            </Form.Field>

            <Form.Field inline>
              <label className={classnames({red: !!errors.customerId})}>{T.translate("sales.form.customer")}</label>
              <Select
                placeholder={T.translate("sales.form.select_customer")}
                name="customerId"
                value={customerId && customerId} 
                onChange={(e, {value}) => this.handleChange('customerId', value)} 
                error={!!errors.customerId}
                options={customersOptions}
                selection
              />
              <span className="red">{errors.customerId}</span>
            </Form.Field>

             {
              customersOptions.length === 0 &&
                <div className="inline field">
                  <div className="ui mini info message mb-1">
                    <p>{T.translate("sales.form.empty_customers_message")}</p>

                    <Link className="ui primary outline tiny button" to="/customers/new">
                      <i className="add circle icon"></i>
                      {T.translate("customers.page.add_new_customer")}
                    </Link>
                  </div>
                </div>
            }

            { id &&
              <Form.Field inline>
                <label className={classnames({red: !!errors.status})}>{T.translate("sales.form.status")}</label>
                <Select
                  label={T.translate("sales.form.status")}
                  placeholder={T.translate("sales.form.select_status")}
                  name="status"
                  value={status} 
                  onChange={(e, {value}) => this.handleChange('status', value)} 
                  error={!!errors.staus}
                  options={[
                    { key: "default", value: "new", disabled: true, text: 'NEW' },
                    { key: "in progress", value: "in progress", text: 'IN PROGRESS' },
                    { key: "finished", value: "finished", text: 'FINISHED' },
                    { key: "delayed", value: "delayed", text: 'DELAYED' },
                    { key: "delivered", value: "delivered", text: 'DELIVERED' }
                    ]}
                  selection
                />
                <span className="red">{errors.status}</span>
              </Form.Field>
            }

            <Form.Field inline>  
              <label>{T.translate("sales.form.description")}</label>
              <TextArea
                placeholder={T.translate("sales.form.description")}
                name="description" 
                value={description} 
                onChange={(e, {value}) => this.handleChange('description', value)} 
              />
            </Form.Field>

            <div className="inline field">   
              <Link className="ui primary outline button" to="/sales">
                <i className="minus circle icon"></i>
                {T.translate("sales.form.cancel")}
              </Link> 
              <button disabled={isLoading} className="ui primary button">
                <i className="check circle outline icon" aria-hidden="true"></i>&nbsp;{T.translate("sales.form.save")}
              </button>
            </div>  
          </Form> 
        </div>  
      </div>
    )
  }
}

FormPage.propTypes = {
  addFlashMessage: PropTypes.func.isRequired
}

FormPage.contextTypes = {
  router: PropTypes.object.isRequired
}

const createSaleMutation = gql`
  mutation createSale($name: String!, $deadline: Date!, $status: String!, $description: String, $customerId: Int!) {
    createSale(name: $name, deadline: $deadline, status: $status, description: $description, customerId: $customerId) {
      success
      sale {
        id
        name 
        deadline
        status
        description
        customer {
          name
        }
      }
      errors {
        path
        message
      }
    }
  }
`

const updateSaleMutation = gql`
  mutation updateSale($id: Int!, $name: String, $deadline: Date, $status: String, $description: String, $customerId: Int) {
    updateSale(id: $id, name: $name, deadline: $deadline, status: $status, description: $description, customerId: $customerId) {
      success
      sale {
        id
        name
        deadline
        status
        description
        customer {
          id
          name
        }
      }
      errors {
        path
        message
      }
    }
  }
`

const getCustomersSalesQuery = gql`
  query {
    getCustomers {
      id
      name
    }
    getSales {
      id
      name 
      deadline
      status
      description
      customer {
        name
      }
    }
  }
`

const getSaleQuery = gql`
  query getSale($id: Int!) {
    getSale(id: $id) {
      id
      name 
      deadline
      status
      description
      customerId
      customer {
        id
        name
      }
      items {
        id
        name
        unit
        quantity
        price
        vat
      }
    }
  }
`

const MutationsQuery =  compose(
  graphql(createSaleMutation, {
    name : 'createSaleMutation'
  }),
  graphql(updateSaleMutation, {
    name: 'updateSaleMutation'
  }),
  graphql(getCustomersSalesQuery, {
    name: 'getCustomersSalesQuery'
  }),
  graphql(getSaleQuery, {
    options: (props) => ({
      variables: {
        id: props.match.params.id ? parseInt(props.match.params.id) : 0
      }
    })
  })
)(FormPage)

export default connect(null, { addFlashMessage } ) (MutationsQuery)


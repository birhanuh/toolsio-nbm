import React, { Component } from 'react' 
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import map from 'lodash/map'
import { Validation } from '../../utils'
import { InputField, TextAreaField, SelectField } from '../../utils/FormFields'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'

// Localization 
import T from 'i18n-react'

import Breadcrumb from '../Layouts/Breadcrumb'

// Semantic UI JS
//import { Dropdown, Input } from 'semantic-ui-react'

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.sale ? this.props.sale.id : null,
      name: this.props.sale ? this.props.sale.name : '',
      deadline: this.props.sale ? moment(this.props.sale.deadline).format("MM-DD-YYYY") : moment(),
      customerId: this.props.sale ? this.props.sale.customerId : '',
      status: this.props.sale ? this.props.sale.status : 'new',
      description: this.props.sale ? this.props.sale.description : '',
      total: this.props.sale ? this.props.sale.total : 0,
      errors: {},
      isLoading: false
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.sale) {
      this.setState({
        id: nextProps.sale.id,
        name: nextProps.sale.name,
        deadline: moment(nextProps.sale.deadline),
        customerId: nextProps.sale.customerId,
        status: nextProps.sale.status,
        description: nextProps.sale.description,
        total: nextProps.sale.total
      })
    }
  }

  handleChange = (e) => {
    if (!!this.state.errors[e.target.name]) {
      // Clone errors form state to local variable
      let errors = Object.assign({}, this.state.errors)
      delete errors[e.target.name]

      this.setState({
        [e.target.name]: e.target.value,
        errors
      })
    } else {
      this.setState({
        [e.target.name]: e.target.value
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
    if (true) { 
      this.setState({ isLoading: true })

      const { name, deadline, status, description, total, customerId } = this.state
      
      this.props.createSaleMutation({ variables: { name, deadline, status, description, total, customerId: parseInt(customerId) }})
        .then(res => {
          // this.props.addFlashMessage({
          //   type: 'success',
          //   text: T.translate("projects.form.flash.success_update", { name: name})
          // })  
          // this.context.router.history.push('/projects')
          

          const { success, project, errors } = res.data.createSale

          if (success) {
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

  handleChangeDate(deadline) {
    if (!!this.state.errors['deadline']) {
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
    
    const { getCustomers } = this.props.getCustomersQuery
  
    const customersOptions = map(getCustomers, (customer) => 
      <option key={customer.id} value={customer.id}>{customer.name}</option>
    )

    return (  
      <div className="ui stackable grid">

        <Breadcrumb />

        <div className="ui text container ui segment">  

          <form className={classnames("ui form", { loading: isLoading })} onSubmit={this.handleSubmit.bind(this)}>

            <div className="inline field">  
              {id ? <h1 className="ui header">{T.translate("sales.form.edit_sale")}</h1> : <h1 className="ui header">{T.translate("sales.form.new_sale")}</h1>}        
            </div>

            { !!errors.message && <div className="ui negative message"><p>{errors.message}</p></div> } 
            
            <InputField
              label={T.translate("sales.form.name")}
              name="name" 
              value={name} 
              onChange={this.handleChange.bind(this)} 
              placeholder="Name"
              error={errors.name}
              formClass="inline field"
            />

            <div  className={classnames("inline field", { error: !!errors.deadline })}>
              <label className="" htmlFor="date">{T.translate("sales.form.deadline")}</label>
              <DatePicker
                dateFormat="DD/MM/YYYY"
                selected={deadline}
                onChange={this.handleChangeDate.bind(this)}
              />
              <span className="red">{errors.deadline}</span>
            </div>

            <SelectField
              label={T.translate("sales.form.customer")}
              name="customerId"
              value={customerId ? customerId : ''} 
              onChange={this.handleChange.bind(this)} 
              error={errors.customerId}
              formClass="inline field"
              
              options={[<option key="default" value="" disabled>{T.translate("sales.form.select_customer")}</option>,
                customersOptions]}
            />

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
              <SelectField
                label={T.translate("sales.form.status")}
                name="status"
                type="select"
                value={status} 
                onChange={this.handleChange.bind(this)} 
                error={errors.status}
                formClass="inline field"

                options={[
                  <option key="default" value="new" disabled>NEW</option>,
                  <option key="in progress" value="in progress">IN PROGRESS</option>,
                  <option key="ready" value="ready">READY</option>,
                  <option key="delayed" value="delayed">DELAYED</option>,
                  <option key="delivered" value="delivered">DELIVERED</option>
                  ]
                }
              />
            }

            <TextAreaField
              label={T.translate("sales.form.description")}
              name="description" 
              value={description} 
              onChange={this.handleChange.bind(this)} 
              placeholder={T.translate("sales.form.description")}
              formClass="inline field"
            />

            <div className="inline field">   
              <Link className="ui primary outline button" to="/sales">
                <i className="minus circle icon"></i>
                {T.translate("sales.form.cancel")}
              </Link> 
              <button disabled={isLoading} className="ui primary button"><i className="check circle outline icon" aria-hidden="true"></i>&nbsp;{T.translate("sales.form.save")}</button>
            </div>  
          </form> 
        </div>  
      </div>
    )
  }
}

Form.propTypes = {
  // saveSale: PropTypes.func.isRequired,
  // sale: PropTypes.object,
  // customers: PropTypes.array.isRequired
}

Form.contextTypes = {
  router: PropTypes.object.isRequired
}

const createSaleMutation = gql`
  mutation createSale($name: String!, $deadline: Date!, $status: String!, $description: String, $total: Int, $customerId: Int!) {
    createSale(name: $name, deadline: $deadline, status: $status, description: $description, total: $total, customerId: $customerId) {
      success
      project {
        name
      }
      errors {
        path
        message
      }
    }
  }
`

const updateSaleMutation = gql`
  mutation updateSale($id: Int!, $name: String!, $deadline: Date!, $status: String!, $description: String, $total: Int, $customerId: Int!) {
    updateSale(id: $id, name: $name, deadline: $deadline, status: $status, description: $description, total: $total, customerId: $customerId) {
      success
      project {
        name
      }
      errors {
        path
        message
      }
    }
  }
`

const getCustomersQuery = gql`
  query {
    getCustomers {
      id
      name
    }
  }
`

const MutationsAndQuery =  compose(
  graphql(createSaleMutation, {
    name : 'createSaleMutation'
  }),
  graphql(updateSaleMutation, {
    name: 'updateSaleMutation'
  }),
  graphql(getCustomersQuery, {
    name: 'getCustomersQuery'
  })
)(Form)

export default MutationsAndQuery


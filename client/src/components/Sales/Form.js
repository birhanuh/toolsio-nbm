import React, { Component } from 'react' 
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import map from 'lodash/map'
import { Validation } from '../../utils'
import { InputField, TextAreaField, SelectField } from '../../utils/FormFields'

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
      _id: this.props.sale ? this.props.sale._id : null,
      name: this.props.sale ? this.props.sale.name : '',
      deadline: this.props.sale ? moment(this.props.sale.deadline, "MM-DD-YYYY") : moment(),
      customer: this.props.sale ? (this.props.sale.customer ? this.props.sale.customer._id : '') : '',
      status: this.props.sale ? this.props.sale.status : '',
      description: this.props.sale ? this.props.sale.description : '',
      errors: {
        message: {
          errors: {}
        }
      },
      isLoading: false
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.sale) {
      this.setState({
        _id: nextProps.sale._id,
        name: nextProps.sale.name,
        deadline: moment(nextProps.sale.deadline),
        customer: nextProps.sale.customer._id,
        status: nextProps.sale.status,
        description: nextProps.sale.description
      })
    }
  }

  handleChange = (e) => {
    if (!!this.state.errors.message.errors[e.target.name]) {
      // Clone errors form state to local variable
      let errors = Object.assign({}, this.state.errors)
      delete errors.message.errors[e.target.name]

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
    updatedErrors.message.errors = errors

    if (!isValid) {
      this.setState({ errors: updatedErrors })
    }

    return isValid;
  }

  handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (this.isValid()) { 
      const { _id, name, deadline, customer, status, description } = this.state
      this.setState({ isLoading: true })
      
      this.props.saveSale({ _id, name, customer, deadline, status, description })
        .catch( ( {response} ) => this.setState({ errors: response.data.errors, isLoading: false }) ) 
    }
  }

  handleChangeDate(deadline) {
    this.setState({
      deadline: deadline
    });
  } 

  render() {
    const { _id, name, deadline, customer, status, description, errors, isLoading } = this.state
    
    const customersOptions = map(this.props.customers, (customer) => 
      <option key={customer._id} value={customer._id}>{customer.name}</option>
    )

    return (  
      <div className="ui stackable grid">

        <Breadcrumb />

        <div className="ui text container ui segment">  

          <form className={classnames("ui form", { loading: isLoading })} onSubmit={this.handleSubmit.bind(this)}>

            <div className="inline field">  
              {_id ? <h1 className="ui header">{T.translate("sales.form.edit_sale")}</h1> : <h1 className="ui header">{T.translate("sales.form.new_sale")}</h1>}        
            </div>

            { !!errors.message && (typeof errors.message === "string") && <div className="ui negative message"><p>{errors.message}</p></div> } 
            
            <InputField
              label={T.translate("sales.form.name")}
              name="name" 
              value={name} 
              onChange={this.handleChange.bind(this)} 
              placeholder="Name"
              error={errors.message && errors.message.errors && errors.message.errors.name && errors.message.errors.name.message}
              formClass="inline field"
            />

            <div  className={classnames("inline field", { error: !!errors.deadline })}>
              <label className="" htmlFor="date">{T.translate("sales.form.deadline")}</label>
              <DatePicker
                dateFormat="DD/MM/YYYY"
                selected={deadline}
                onChange={this.handleChangeDate.bind(this)}
              />
              <span>{errors.deadline}</span>
            </div>

            <SelectField
              label={T.translate("sales.form.customer")}
              name="customer"
              value={customer ? (typeof customer === 'object' ? customer._id : customer) : ''} 
              onChange={this.handleChange.bind(this)} 
              error={errors.message && errors.message.errors && errors.message.errors.customer && errors.message.errors.customer.message}
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

            { _id &&
              <SelectField
                label={T.translate("sales.form.status")}
                name="status"
                type="select"
                value={status} 
                onChange={this.handleChange.bind(this)} 
                error={errors.message && errors.message.errors && errors.message.errors.status && errors.message.errors.status.message}
                formClass="inline field"

                options={[
                  <option key="default" value="new" disabled>NEW</option>,
                  <option key="preparing" value="preparing">PREPARING</option>,
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
  saveSale: PropTypes.func.isRequired,
  sale: PropTypes.object,
  customers: PropTypes.array.isRequired
}

export default Form


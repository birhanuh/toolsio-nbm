import React, { Component } from 'react' 
import { connect } from 'react-redux'
import classnames from 'classnames'
import { Validation } from '../../utils'
import { createSale } from '../../actions/saleActions'
import FormField from '../../utils/FormField'

import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

class SaleForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      date: moment(),
      status: '',
      description: '',
      errors: {},
      isLoading: false
    }
  }

  handleChange = (e) => {
    if (!!this.state.errors[e.target.name]) {
      // Clone errors form states to local varibale
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

    if (!isValid) {
      this.setState({ errors })
    }

    return isValid;
  }

  handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (this.isValid()) { 
      this.setState({ isLoading: true })
      this.props.createSale(this.state).then(
        () => {

        },
        ( {response} ) => this.setState({ errors: response.data.errors, isLoading: false })
      )
    }
  }

  componentWillUnmount() {
    clearTimeout(this.clickTimeout);
  }

  handleChangeDate(date) {
    this.setState({
      date: date
    });
  } 

  render() {
    const { name, date, status, description, errors, isLoading } = this.state
    
    return (              
      <form className={classnames("ui form", { loading: isLoading })} onSubmit={this.handleSubmit.bind(this)}>

        <FormField
          label="Name"
          name="name" 
          value={name} 
          onChange={this.handleChange.bind(this)} 
          placeholder="Name"
          error={errors.name}
        />
        <div  className={classnames("field", { error: !!errors.date })}>
          <label className="" htmlFor="date">Date:</label>
          <DatePicker
            dateFormat="DD/MM/YYYY"
            selected={date}
            onChange={this.handleChangeDate.bind(this)}
          />
          <span>{errors.password}</span>
        </div>
        <FormField
          formType="select"
          label="status"
          name="status"
          type="select"
          value={status} 
          onChange={this.handleChange.bind(this)} 
          error={errors.status}

          options={[
            <option key="default" value="" disabled>Set Status</option>,
            <option key="new" value="new">NEW</option>,
            <option key="in progress" value="in progress">IN PROGRESS</option>,
            <option key="ready" value="ready">READY</option>,
            <option key="delivered" value="delivered">DELIVERED</option>
            ]
          }
        />
        <FormField
          formType="textarea"
          label="Description"
          name="description" 
          value={description} 
          onChange={this.handleChange.bind(this)} 
          placeholder="Description"
        />

        <div className="filed">    
          <button disabled={isLoading} className="ui primary button"><i className="fa fa-check-circle" aria-hidden="true"></i>&nbsp;Add Sale</button>
        </div>  
      </form>         
    )
  }
}

SaleForm.propTypes = {
  createSale: React.PropTypes.func.isRequired
}

export default connect(null, { createSale })(SaleForm)


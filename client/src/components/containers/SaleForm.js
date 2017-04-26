import React, { Component } from 'react' 
import { connect } from 'react-redux'
import { createSale } from '../../actions/saleActions'
import FormField from '../../utils/FormField'

class SaleForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      date: new Date().toString(),
      status: '',
      description: '',
      errors: {},
      isLoading: false
    }
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  onSubmit(e) {
    e.preventDefault()
    this.props.createSale(this.state)
  }

  render() {
    const { name, date, status, description, errors, isLoading } = this.state
    console.log('date: ', new Date())
    return (              
      <form onSubmit={this.onSubmit.bind(this)}>

        { errors.form && <div className="alert alert-danger alert-dismissible">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          {errors.form}</div> }

        <FormField
          label="Name"
          name="name" 
          value={name} 
          onChange={this.onChange.bind(this)} 
          placeholder="Name"
          error={errors.name}
          labelHorizontal="col-sm-2"
          inputHorizontal="col-sm-10"
        />
        <FormField
          label="Date"
          name="date" 
          type="date"
          value={date} 
          onChange={this.onChange.bind(this)} 
          placeholder="Date"
          error={errors.date}
          labelHorizontal="col-sm-2"
          inputHorizontal="col-sm-10"
        />
        <FormField
          formType="select"
          label="status"
          name="status"
          type="select"
          value={status} 
          onChange={this.onChange.bind(this)} 
          labelHorizontal="col-sm-2"
          inputHorizontal="col-sm-10"

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
          onChange={this.onChange.bind(this)} 
          placeholder="Description"
          error={errors.description}
          formGroup=""
          labelHorizontal="col-sm-2"
          inputHorizontal="col-sm-10"
        />

        <div className="form-group">
          <div className="col-sm-offset-2 col-sm-2">    
            <button disabled={isLoading} className="btn btn-primary">Login</button>
          </div>
        </div>  
      </form>         
    )
  }
}

SaleForm.propTypes = {
  createSale: React.PropTypes.func.isRequired
}

export default connect(null, { createSale })(SaleForm)


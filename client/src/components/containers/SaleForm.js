import React, { Component } from 'react' 
import { connect } from 'react-redux'
import { createSale } from '../../actions/saleActions'
import Input from '../../utils/FormGroup'

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

        <Input
          label="Name"
          field="name" 
          value={name} 
          onChange={this.onChange.bind(this)} 
          placeholder="Name"
          error={errors.name}
        />
        <Input
          label="Date"
          field="date" 
          type="date"
          value={date} 
          onChange={this.onChange.bind(this)} 
          placeholder="Date"
          error={errors.date}
        />
        <div className="form-group">
          <label className="control-lable">Status</label>
          <select
            className="form-control"
            name="status" 
            value={status} 
            onChange={this.onChange.bind(this)} 
          >
            <option value="" disabled>Set Status</option>
            <option key="new" value="new">NEW</option>
            <option key="in progress" value="in progress">IN PROGRESS</option>
            <option key="ready" value="ready">READY</option>
            <option key="delivered" value="delivered">DELIVERED</option>
          </select>
        </div>
        <div className="form-group">
          <label className="control-label">Description</label>
          <textarea type="textarea" 
            name="description" 
            className="form-control description-input" 
            placeholder="Description"
            value={description}
            onChange={this.onChange.bind(this)}>
          </textarea>
        </div>

        <div className="form-group">        
          <button disabled={isLoading} className="btn btn-primary">Login</button>
        </div>  
      </form>         
    )
  }
}

SaleForm.propTypes = {
  createSale: React.PropTypes.func.isRequired
}

export default connect(null, { createSale })(SaleForm)


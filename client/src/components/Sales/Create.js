import React, { Component } from 'react' 
import SaleForm from './SaleForm'

class Create extends Component {

  render() {
    return (
      <div>
        <h1 className="ui header">Create new Sale</h1>
        <SaleForm /> 
      </div>  
    )
  }
}

export default Create
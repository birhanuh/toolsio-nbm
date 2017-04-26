import React, { Component } from 'react' 
import SaleForm from '../../containers/SaleForm'

class Create extends Component {

  render() {
    return (
      <div className="row">
        <div className="col-sm-8 col-sm-offset-2">
          <div className="form-horizontal">
            <div className="form-group">
              <div className="col-sm-offset-2 col-sm-10">
                <h1>Create new Sale</h1>
              </div>
            </div>   
            <SaleForm /> 
          </div>
        </div>
      </div>  
    )
  }
}

export default Create
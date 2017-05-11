import React, { Component } from 'react'
import List from './List'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      brand: null, 
      model: null
    }

    this.brandChanged = this.brandChanged.bind(this);
    this.modelChanged = this.modelChanged.bind(this);
    this.buttonClicked = this.buttonClicked.bind(this);
    this.knownModel = this.knownModel.bind(this);
  }

  brandChanged(event) {
    let brand = event.target.value
    if(this.knownBrand(brand)) {
      this.setState({
        brand: brand, 
        model: null
      })
    } else {
      this.setState({
        brand: null, 
        model: null
      })
    }
  }

  modelChanged(event) {
    let model = event.target.value
    if(this.knownModel(model)) {
      this.setState({ model, buttonDisabled: false })
    } else {
      this.setState({ model: null, buttonDisabled: true })
    }
  }

  buttonClicked(event) {
    let { brand, model } = this.state;
    console.log(this.state);
    console.log(`${brand} ${model} riding...`)
  }

  data() {
    return (
      {
        'Opel':   ['Agila', 'Astra', 'Corsa', 'Vectra'],
        'Škoda':  ['Fabia', 'Octavia', 'Superb', 'Yeti'],
        'Toyota': ['Auris', 'Avensis', 'Corolla', 'Prius']
      }
    )
  }

  brands() {
    return Object.keys(this.data());
  }

  models() {
    return this.state.brand ? this.data()[this.state.brand] : [];
  }

  knownBrand(brand) {
    return this.brands().indexOf(brand) !== -1
  }

  knownModel(model) {
    return this.models().indexOf(model) !== -1
  }

  render() {
    let buttonDisabled = this.state.model === null || this.state.brand === null
    let selectDisabled = this.state.brand === null

    return ( 
      <div>
        <h1>Dashboard</h1> 
        <div className="form-inline">
          <List name="Brand" items={this.brands()} 
           handler={this.brandChanged} value={this.state.brand} />
          &nbsp;&nbsp;
          <List name="Model" selectDisabled={selectDisabled} items={this.models()} 
           handler={this.modelChanged} value={this.state.model} />
          &nbsp;&nbsp;
          <button className="btn btn-primary" onClick={this.buttonClicked} 
           disabled={buttonDisabled}>Ride</button>
        </div>
      </div>  
    )
  }  
}

export default Dashboard
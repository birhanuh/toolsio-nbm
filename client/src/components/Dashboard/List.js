import React, { Component } from 'react' 

class List extends Component {
  render() {
    let { name, items } = this.props;
    let options = []

    options.push(<option key="default" value={name}>{name}</option>);

    for(var index in items) {
      let item = items[index];
      options.push(<option key={index} value={item}>{item}</option>);
    }

    return (
      <div className="form-group">
        <select className="form-control" disabled={this.props.selectDisabled} onChange={this.props.handler} 
          value={this.props.value ? this.props.value : "Model"}>
          {options}
        </select>
      </div>  
    )
  }
}

export default List
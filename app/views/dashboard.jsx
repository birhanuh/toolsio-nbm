var React = require('react');
var Base = require('./base');

var DashboardComponent = React.createClass({
  render: function (argument) {
    return (
        <Base name={this.props.name}>
          <div>
            <h1 className="page-header">Dashboard</h1>
            <h1> User Informatoin</h1>
            {/* 
            <p> First Name: #{user.firstName}</p>  
            <p> Last Name: #{user.lastName}</p>  
            <p> Email: #{user.email}</p>  
            <p> Data: #{user.data}</p> */}
          </div>
        </Base>
      )
  }
});

module.exports = DashboardComponent;


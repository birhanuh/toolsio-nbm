var React = require('react');
var Base = require('./base');

var IndexComponent = React.createClass({
  render: function (argument) {
    return (
        <Base name={this.props.name}>
          <div>
            <h1>This is react</h1>
          </div>
        </Base>
      )
  }
});

module.exports = IndexComponent;
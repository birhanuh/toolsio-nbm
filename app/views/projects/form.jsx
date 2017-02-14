var React = require('react');
var Base = require('../base');

var NewComponent = React.createClass({
  render: function (argument) {
    return (
        <Base name={this.props.name}>
          <div className="form-horizontal">
            <div className="form-group">
              <div className="col-sm-offset-2 col-sm-10">
                <h1>New Project</h1> 
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-sm-2" for="name">Name:</label>
              <div className="col-sm-10">
                <input type="name" id="name" className="form-control name-input" placeholder="Enter name">
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-sm-2" for="date">Date:</label>
              <div className="col-sm-10">
                <input type="date" id="date" className="form-control date-input" placeholder="Enter date">
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-sm-2" for="description">Description:</label>
              <div className="col-sm-10">
                <textarea type="description" id="description" className="form-control description-input" placeholder="Enter description"></textarea>
              </div>
            </div>
            <div className="form-group">
              <div className="col-sm-offset-2 col-sm-2">
                <button className="btn btn-primary create-project"><i className="fa fa-check-circle" aria-hidden="true"></i>&nbsp;Create project</button>
              </div>
            </div>
          </div>
        </Base>
      )
  }
});

module.exports = NewComponent;
var React = require('react');
var Base = require('../base');

var ShowComponent = React.createClass({
  render: function (argument) {
    return (
        <Base name={this.props.name}>
          <div className="well">

            <dl>
              <dt>Name:</dt>      
              <dd><span className="name"><%= project.name %></span></dd>

              <dt>Date:</dt>
              <dd><span className="date"><%= project.date %></span></dd>
                      
              <dt>Description:</dt>
              <dd><span className="description"><%= project.description %></span></dd>
                      
              <div className="btn-toolbar m-t-l">
                <a href="#projects" className="btn btn-default"><i className="fa fa-ban" aria-hidden="true"></i>&nbsp;Cancel</a>
                <button className="btn btn-primary edit-project"><i className="fa fa-pencil" aria-hidden="true"></i>&nbsp;Edit project</button>
              </div>
            </dl>      
          </div> 
        </Base>
      )
  }
});

module.exports = ShowComponent;
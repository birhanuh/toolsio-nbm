var React = require('react');
var Base = require('../base');

var ProjectsComponent = React.createClass({
  render: function (argument) {
    return (
        <Base name={this.props.name}>
          <div className="row">
            <div className="col-sm-12">
              <div className="clearfix">
                <div className="pull-left">
                  <h1>Projects</h1> 
                </div>
                <div className="pull-right">
                  <a href="#projects/new" className="btn btn-primary m-t-l"><i className="fa fa-plus-circle" aria-hidden="true"></i>&nbsp;Create new project</a>
                </div>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Description</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="projects-list">
                  <% _.each(projects, function(project) { %>
                  <!-- This isn't great sanitization and you will want something more secure for outputting untrusted data to the page -->
                    <tr>
                      <td><span className="name"><%= project.get('name') %></span></td>
                      <td><span className="date"><%= project.get('date') %></span></td>
                      <td><span className="description"><%= project.get('description') %></span></td>
                      <td className="text-center">
                        <a href=<%= "#projects/"+ project.get('_id') %> className="btn btn-info btn-sm view-more-project"><i className="fa fa-eye" aria-hidden="true"></i>&nbsp;View more</a>
                      </td>
                    </tr>  
                  <% }); %>

                </tbody>
              </table>
            </div>
          </div>  
        </Base>
      )
  }
});

module.exports = ProjectsComponent;
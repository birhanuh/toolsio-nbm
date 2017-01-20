define([
  'jquery',
  'underscore',
  'backbone',
  'views/project/ProjectEditView',
  'views/project/ProjectListView',
  'text!templates/project/projectTemplate.html'
], function($, _, Backbone, ProjectEditView, ProjectListView, projectTemplate){
  
  var ProjectView = Backbone.View.extend({
    
    el: '.page',
    
    render: function () {
      
      $(this.el).html(projectTemplate);
      
      // Create new Backbone views using the view manager (does some extra goodies);
      var projectEditView = new ProjectEditView();
      projectEditView.render();
      
      var projectListView = new ProjectListView();
      projectListView.render();
      
      projectEditView.on('postProject', function () {
        projectListView.render();
      });
      
    }
  });

  return ProjectView;
  
});

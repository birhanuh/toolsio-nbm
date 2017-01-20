define([
  'jquery',
  'underscore',
  'backbone',
  'models/ProjectModel',
  'text!templates/project/projectEditTemplate.html'
], function($, _, Backbone, ProjectModel, projectEditTemplate){
  
  var ProjectEditView = Backbone.View.extend({
    el: '.project-form-container',
    render: function () {
      $(this.el).html(projectEditTemplate);
      
    },
    events: {
      'click .create-project': 'postProject'
    },
    
    postProject: function() {
      var that = this;

      console.log("posting message from ProjectEditView")

      var projectModel = new ProjectModel();
      
      projectModel.save( { name: $('.name-input').val(), date: $('.date-input').val(), 
        description: $('.description-input').val() }, {
        
        success: function () {
          console.log("ProjectEditView succes " + projectModel.get('name') )
          
          that.trigger('postProject');
        },
        error: function () {
          console.log("ProjectEditView error on save");
        }

      });
    }
  });

  return ProjectEditView;

});

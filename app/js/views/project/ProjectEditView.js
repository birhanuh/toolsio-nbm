define([
  'jquery',
  'underscore',
  'backbone',
  'dateformat',
  'models/ProjectModel',
  'text!templates/project/projectEditTemplate.html'
], function($, _, Backbone, Dateformat, ProjectModel, projectEditTemplate){
  
  var ProjectEditView = Backbone.View.extend({
    el: '.page',

    render: function () {
      var navBar = $('#navbar');
      var li = navBar.children().children();
      li.removeClass('active');
      var currentLi = $('.projects');
      currentLi.addClass('active');
      var that = this;

      // Call get project
      this.getProject();

      return this;
    },
    
    events: {
      'click .create-project': 'postProject'
    },
    
    getProject: function(){

      var that = this;

      this.model.fetch({
        success: function(response) {
          that.$el.html(_.template(projectEditTemplate)($.extend({}, {project: response.attributes[0], _:_})));
          console.log('Successfully got project: ', response.attributes[0]);
        },
        error: function(response) {
          console.log(response, "ProjectList error!");
        }
      });

    },

    postProject: function() {
      var that = this;

      console.log("posting project from ProjectEditView")

      var projectModel = new ProjectModel();
      
      projectModel.save( { name: $('.name-input').val(), date: $('.date-input').val(), 
        description: $('.description-input').val() }, {
        
        success: function (response) {
          console.log('Successfully saved project with _id: ' +response.toJSON()._id);
          
          // Redirect to projects page
          location.href = "#projects"
        },
        error: function () {
          console.log("ProjectEditView error on save");
        }

      });
    }
  });

  return ProjectEditView;

});

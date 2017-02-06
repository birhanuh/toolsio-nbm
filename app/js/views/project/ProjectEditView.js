define([
  'jquery',
  'underscore',
  'backbone',
  'dateformat',
  'models/ProjectModel',
  'text!templates/project/projectNewTemplate.html',
  'text!templates/project/projectEditTemplate.html'
], function($, _, Backbone, Dateformat, ProjectModel, projectNewTemplate, projectEditTemplate){
  
  var ProjectEditView = Backbone.View.extend({
    el: '.page',

    render: function () {
      this.$el.empty();

      var navBar = $('#navbar');
      var li = navBar.children().children();
      li.removeClass('active');
      var currentLi = $('.projects');
      currentLi.addClass('active');
      var that = this;

      if (this.model) {        
        // Call get project
        this.getProject();
      } else {
        this.$el.html(_.template(projectNewTemplate));
      } 

      return this;
    },
    
    events: {
      'click .create-project': 'onCreate',
      'click .update-project': 'onUpdate',
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

    onCreate: function() {

      var projectModel = new ProjectModel();

      projectModel.save( { name: $('.name-input').val(), date: $('.date-input').val(), 
        description: $('.description-input').val() }, {
        
        success: function (response) {
          console.log('Successfully saved project with _id: ' +response.toJSON()._id);
          
          // Redirect to show project page
          location.href = "#projects";
        },
        error: function () {
          console.log("ProjectEditView error on save");
        }

      });
    },

    onUpdate: function() {
      console.log('model: ', this.model);
      this.model.save({ name: $('.name-input').val(), date: $('.date-input').val(), 
        description: $('.description-input').val() });
      
      //console.log('model: ', this.model);
      //console.log('route: ', this.model.attributes[0]._id);
      // Redirect to show project page
      //location.href = "#projects/show/"+this.model.attributes[0]._id;
    }

  });

  return ProjectEditView;

});

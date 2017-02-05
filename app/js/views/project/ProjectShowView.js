define([
  'jquery',
  'underscore',
  'backbone',
  'collections/ProjectsCollection',
  'views/project/ProjectEditView',
  'text!templates/project/projectShowTemplate.html'
], function($, _, Backbone, ProjectsCollection, ProjectEditView, projectShowTemplate){
  var ProjectShowView = Backbone.View.extend({
    el: '.page',

    initialize: function() {   
      //this.model.on("sync", this.render, this);

    },

    events: {
      
    },

    render: function () {
      var navBar = $('#navbar');
      var li = navBar.children().children();
      li.removeClass('active');
      var currentLi = $('.projects');
      currentLi.addClass('active');

      // Call get project
      this.getProject();

      return this;
    },

    getProject: function(){

      var that = this;

      this.model.fetch({
        success: function(response) {
          that.$el.html(_.template(projectShowTemplate)($.extend({}, {project: response.attributes[0], _:_})));
          console.log('Successfully got project: ', response.attributes[0]);
        },
        error: function(response) {
          console.log(response, "ProjectList error!");
        }
      });

    }
   
  });
  return ProjectShowView;
});

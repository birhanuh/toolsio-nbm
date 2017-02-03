define([
  'jquery',
  'underscore',
  'backbone',
  'collections/ProjectsCollection',
  'views/project/ProjectEditView',
  'text!templates/project/projectListTemplate.html'
], function($, _, Backbone, ProjectsCollection, ProjectEditView, projectListTemplate){
  var ProjectListView = Backbone.View.extend({
    el: '.page',
    
    initialize: function() {
      this.collection = new ProjectsCollection();
      //this.collection.on('add', this.render, this);
      //this.collection.on('change', this.render, this);
      //this.collection.on('remove', this.render, this);
      
    },

    events: {
      
    },

    render: function () {
      var navBar = $('#navbar');
      var li = navBar.children().children();
      li.removeClass('active');
      var currentLi = $('.projects');
      currentLi.addClass('active');
     
      /* no projects at the start */
      this.getProjects();
    },

    getProjects: function(){

      var that = this;

      this.collection.fetch({
        success: function(response) {
          $(that.el).html(_.template(projectListTemplate)($.extend({}, {projects: response.models, _:_})));
          console.log('Successfully got projects: ', response);
        },
        error: function(response) {
          console.log(response, "ProjectList error!");
        }
      });

    }

  });
  return ProjectListView;
});

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
      this.collection.bind('add', this.render, this);
      this.collection.bind('change', this.render, this);
      this.collection.bind('remove', this.render, this);
      
    },

    events: {
      
    },

    render: function () {
      var navBar = $('#navbar');
      var li = navBar.children().children();
      li.removeClass('active');
      var currentli = $('.projects');
      currentli.addClass('active');
      console.log(li);
      var that = this;
     
      /* no projects at the start */

      that.getProjects();
    },

    getProjects: function(){

      var that = this;

      this.collection.fetch({
        success: function(projects) {
          $(that.el).html(_.template(projectListTemplate, {projects: projects.models, _:_}));
          console.log('Successfully got projects: ', projects);
        },
        error: function(response) {
            console.log(response, "ProjectList error!");
        }
      });

    }

  });
  return ProjectListView;
});

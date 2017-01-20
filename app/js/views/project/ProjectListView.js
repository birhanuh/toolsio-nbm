define([
  'jquery',
  'underscore',
  'backbone',
  'collections/ProjectsCollection',
  'text!templates/project/projectListTemplate.html'
], function($, _, Backbone, ProjectsCollection, projectListTemplate){
  var ProjectListView = Backbone.View.extend({
    model: new ProjectsCollection(),
    el: '.project-list-container',
    
    initialize: function() {
      //var projects = new ProjectsCollection();
      this.model.on('add', this.render, this);
      this.model.on('change', this.render, this);
      this.model.on('remove', this.render, this);

    },

    render: function () {
      var that = this;
     
      /* no projects at the start */

      that.getProjects();
    },

    getProjects: function(){

      var that = this;

      this.model.fetch({
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

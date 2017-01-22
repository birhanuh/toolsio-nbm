define([
  'jquery',
  'underscore',
  'backbone',
  'collections/ProjectsCollection',
  'text!templates/project/projectListTemplate.html'
], function($, _, Backbone, ProjectsCollection, projectListTemplate){
  var ProjectListView = Backbone.View.extend({
    el: '.project-list-container',
    
    initialize: function() {
      this.collection = new ProjectsCollection();
      // this.model.on('add', this.render, this);
      // this.model.on('change', this.render, this);
      // this.model.on('remove', this.render, this);

    },

    render: function () {
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

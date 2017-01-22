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
      // this.model.on('add', this.render, this);
      // this.model.on('change', this.render, this);
      // this.model.on('remove', this.render, this);

    },

    events: {
      'click .create-project': 'onCreate',
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

    },

    onCreate: function () {
      this.$el.empty();

      var projectEditView = new ProjectEditView();
      projectEditView.render();
    }

  });
  return ProjectListView;
});

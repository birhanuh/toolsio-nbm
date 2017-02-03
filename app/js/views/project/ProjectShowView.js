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
      this.model.on("sync", this.render, this);

      console.log('This model init: ', this.model);
    },

    events: {
      
    },

    render: function () {
      var navBar = $('#navbar');
      var li = navBar.children().children();
      li.removeClass('active');
      var currentLi = $('.projects');
      currentLi.addClass('active');

      // this.model.fetch({
      //   success: function(response) {
      //     console.log('Successfully got project: ', response.name);
      //   },
      //   error: function(response) {
      //     console.log(response, "ProjectList error!");
      //   }
      // });
      
      console.log('This model: ', this.model.name);
      //this.$el.html(_.template(projectShowTemplate)($.extend({}, {project: this.model})));

      return this;
    }

   
  });
  return ProjectShowView;
});

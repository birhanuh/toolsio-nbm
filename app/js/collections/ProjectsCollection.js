define([
  'jquery',
  'underscore',
  'backbone',
  'models/ProjectModel'
], function($, _, Backbone, ProjectModel){
  var ProjectsCollection = Backbone.Collection.extend({
    model: ProjectModel,

    url: 'http://localhost:8888/projects'
    //url: 'http://toolsio-mongodb.jit.su/messages'
  });

  return ProjectsCollection;
});

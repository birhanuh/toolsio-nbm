define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var ProjectModel = Backbone.Model.extend({
    url: 'http://localhost:8888/projects'
    //url: 'http://nationalpark-mongodb.jit.su/messages'
  });
  return ProjectModel;
});

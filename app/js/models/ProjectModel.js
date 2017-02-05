define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var ProjectModel = Backbone.Model.extend({

    defaults: {
      name: '',
      date: new Date(),
      description: ''
    },

    urlRoot: 'http://localhost:8888/projects',

 
  });
  return ProjectModel;
});

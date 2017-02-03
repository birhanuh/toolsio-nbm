define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  var ProjectModel = Backbone.Model.extend({

    defaults: {
      name: '',
      date: new Date(),
      definition: ''
    },

    urlRoot: 'http://localhost:8888/projects',

    parse : function(response){
      return response;  
    }  
  });
  return ProjectModel;
});

define([
  'jquery',
  'underscore',
  'backbone',
  'views/DashboardView', 
  'views/project/ProjectView'
], function ($, _, Backbone, DashboardView, ProjectView) {
  
  var Router = Backbone.Router.extend({
    routes: {
      'messages': 'showMessageAboutMongo', // All urls will trigger this route
      'about': 'showAbout',
      '/projects': 'showProjects',

      // Default 
      '*actions': 'defaultAction',
    }
  });

  var initialize = function(){
		
    //var vent = _.extend({}, Backbone.Events);
    var router = new Router();

    console.log("Router / initialize");

		router.on('route:defaultAction', function (actions) {

      var dashboardView = new DashboardView();
      dashboardView.render();
      
      console.log("default route");        
		});

    router.on('route:showProjects', function () {

      var projectView = new ProjectView();
      projectView.render();

      console.log("Project route");
        
    });

    router.on('route:showMessageAboutMongo', function () {

      console.log("display helpful message about setting up mongo");
        
    });

    router.on('route:showAbout', function () {

      console.log("display about");
        
    });

    Backbone.history.start();
    
  };
  return {
    initialize: initialize
  };
});

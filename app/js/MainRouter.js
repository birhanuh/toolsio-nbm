define([
  'jquery',
  'underscore',
  'backbone',
  'views/MainView', 
  'views/project/ProjectView'
], function ($, _, Backbone, MainView, ProjectView) {
  
  var MainRouter = Backbone.Router.extend({
    routes: {
      '*actions': 'defaultAction',
      'messages': 'showMessageAboutMongo', // All urls will trigger this route
      'about': 'showAbout',
      'projects': 'showProjects' 
    }
  });

  var initialize = function(){
		
    //var vent = _.extend({}, Backbone.Events);
    var router = new MainRouter();

    console.log("MainRouter / initialize");

		router.on('route:defaultAction', function (actions) {
        console.log("default route");        
		});

    router.on('route:showProjects', function () {

        var mainView = new MainView();
        mainView.render();

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

define([
  'jquery',
  'underscore',
  'backbone',
  'views/DashboardView', 
  'views/project/ProjectEditView',
  'views/project/ProjectListView'
], function ($, _, Backbone, DashboardView, ProjectEditView, ProjectListView) {
  
  var Router = Backbone.Router.extend({
    routes: {
      // Contact
      'contact': 'showContact', 
      
      // About 
      'about': 'showAbout',
      
      // Users 
      'users/edit:id': 'editUser',
      'users/new': 'newUser',
      'users': 'showUser',
      
      // Projects
      'projects/edit:id': 'editProject',
      'projects/new': 'newProject',
      'projects': 'showProjects',
      
      // Sales 
      'sales/edit:id': 'editSale',
      'sales/new': 'newSale',
      'sales': 'showSales',

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
      
      console.log("default/dashboard route");        
		});

    // Projects 
    router.on('route:showProjects', function () {
      var projectListView = new ProjectListView();
      projectListView.render();
      // this.navigate('projects', { trigger: true });
      console.log("Projects route");        
    });
    
    router.on('route:newProject', function () {
      var projectEditView = new ProjectEditView();
      projectEditView.render();
      console.log("Projects new route");        
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

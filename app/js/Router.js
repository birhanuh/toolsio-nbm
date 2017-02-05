define([
  'jquery',
  'underscore',
  'backbone',
  'views/DashboardView', 
  'models/ProjectModel',
  'views/project/ProjectShowView',
  'views/project/ProjectEditView',
  'views/project/ProjectListView'
], function ($, _, Backbone, DashboardView, ProjectModel, ProjectShowView, ProjectEditView, ProjectListView) {
  
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
      'projects/edit/:porject_id': 'editProject',
      'projects/show/:porject_id': 'showProject',
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

    // New Project
    router.on('route:newProject', function () {
      var projectEditView = new ProjectEditView();
      projectEditView.render();
      console.log("Projects new route");        
    });

    // Show Project 
    router.on('route:showProject', function (porject_id) {
      var projectModel = new ProjectModel({ id: porject_id });
      var projectShowView = new ProjectShowView({model: projectModel});
      projectShowView.render();    
      console.log("Projects show route");    
    });
    
    // Edit Project
    router.on('route:editProject', function (porject_id) {
      var projectModel = new ProjectModel({ id: porject_id });
      var projectEditView = new ProjectEditView({model: projectModel});
      projectEditView.render();
      console.log("Projects edit route");        
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

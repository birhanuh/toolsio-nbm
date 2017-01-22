define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/dashboardTemplate.html' 
], function($, _, Backbone, dashboardTemplate){
  
  var MainView = Backbone.View.extend({
    el: '.page',
    initialize: function () {
      
    },
    render: function () {
			var that = this;
      $(this.el).html(dashboardTemplate);
      
		} 
	});
  return MainView;

});

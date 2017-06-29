var FactoryGirl = require('factory_girl'); // for nodejs

FactoryGirl.define('sale', function() {
  this.customer = Math.random()*101|0;
  this.name = 'Sale 1'
  this.date = new Date() 
  this.status = 'NEW'
  this.description = 'Description. ..'
  this.items = []
})



var FactoryGirl = module.exports = FactoryGirl
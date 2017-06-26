var FactoryGirl = require('factory_girl'); // for nodejs
FactoryGirl.define('sale', function() {
  this.id = Math.random()*101|0;
  this.name = 'Sale 1'
  this.status = 'NEW'
  this.description = 'Description. ..'
})

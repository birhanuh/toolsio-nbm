var express = require('express')

var ProjectsController = require('./ProjectsController')
//var SalesController = rquire('./SalesController')

module.exports = {
  projects: ProjectsController,
  //sales: SalesController,
}
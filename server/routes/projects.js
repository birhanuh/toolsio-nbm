var express = require('express');
var router = express.Router();

var ProjectMongooseModel = require('../models/project');

// GET Projects
router.get('/projects', function(req ,res, next) {
  ProjectMongooseModel.find(function(err, projects) {
    if (err) {
      res.send(err);
    }
    res.json(projects);
  });
});

// GET Project
router.get('/projects/:id', function(req, res, next) {
  ProjectMongooseModel.findOne({_id: req.params.id}, function(err, project) {
    if (err) {
      res.send(err);
    }
    res.json(project);
  });
}); 

// POST Project
router.post('/projects', function(req, res, next) {
  var project = req.body;
  if (!task.name || !project.date || !project.status || !project.description) {
    res.status(400);
    res.json({
      "error": "Bad data"
    })
  }
  ProjectMongooseModel.save(project, function(err, project) {
    if (err) {
      res.send(err);
    }
    res.json(project);
  });
});

// DELETE Project
router.delete('/projects/:id', function(req, res, next) {
  ProjectMongooseModel.remove({_id: req.params.id}, function(err, projects) {
    if (err) {
      res.send(err);
    }
    res.json(projects);
  });
}); 

// DELETE Project
router.put('/projects/:id', function(req, res, next) {
  var project = req.body;
  var updProject = {};

  if (project.name) {
    updProject.name = project.name;
  }

  if (project.date) {
    updProject.date = project.date;
  }

  if (project.status) {
    updProject.status = project.status;
  }
  
  if (project.description) {
    updProject.description = project.description;
  }

  if (!updProject) {
    res.status(400);
    res.json({
      "error": "Bad data"
    });
  } else {
    ProjectMongooseModel.update({_id: req.params.id}, updProject, {}, function(err, projects) {
      if (err) {
        res.send(err);
      }
      res.json(projects);
    });
  }

}); 

module.exports = router;
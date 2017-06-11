import Project from '../models/project'
import Validation from '../utils'

export default {
  
  find: function(params, callback) {
    Project.find(params, function(err, projects) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, projects)
    })
  },

  findById: function(id, callback) {
    Project.findById(id, function(err, project) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, project)
    })
  },

  create: function(params, callback) {
    Project.create(params, function(err, project) {
      if (err) {
        callback(err, null)
        return
      }
      callback(null, project)
    })
  },

  update: function(id, params, callback) {
    Project.findByIdAndUpdate(id, params, {new: true}, function(err, project) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, project)
    })
  },

  delete: function(id, callback) {
    Project.findByIdAndRemove(id, function(err, project) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, null)
    })
  }
}
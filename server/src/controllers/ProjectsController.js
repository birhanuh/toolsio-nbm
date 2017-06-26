import Project from '../models/Project'
import Validation from '../utils'

export default {
  
  find: (params, callback) => {
    Project.find(params, function(err, projects) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, projects)
    })
  },

  findById: (id, callback) => {
    Project.findById(id, function(err, project) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, project)
    })
  },

  create: (params, callback) => {
    Project.create(params, function(err, project) {
      if (err) {
        callback(err, null)
        return
      }
      callback(null, project)
    })
  },

  update: (id, params, callback) => {
    Project.findByIdAndUpdate(id, params, {new: true}, function(err, project) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, project)
    })
  },

  delete: (id, callback) => {
    Project.findByIdAndRemove(id, function(err, project) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, null)
    })
  }
}
import Task from '../models/Task'
import Project from '../models/Project'

export default {
  
  find: (params, callback) => {
    Task.find(params, function(err, tasks) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, tasks)
    })
  },

  findById: (id, callback) => {
    Task.findById(id, function(err, task) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, task)
    })
  },

  create: (params, callback) => {  
    Task.create(params.task, function(err, task) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, task)
    })
  },

  findByIdAndUpdate: (id, params, callback) => {
    Task.findByIdAndUpdate(id, params, {new: true}, function(err, task) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, task)
    })
  },

  findByIdAndRemove: (id, callback) => {
    Task.findByIdAndRemove(id, function(err, task) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, null)
    })
  }
}
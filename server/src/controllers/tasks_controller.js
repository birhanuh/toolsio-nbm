import Task from '../models/task'
import Project from '../models/project'

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
    Task.create(params, function(err, task) {
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

      // Remove task from Project
      Project.findByIdAndUpdate(task._creator, { $pull: { tasks: id} }, function(err, project) {
        if (err) {
          callback(err, null)
          return
        }
        callback(null, null)
      })
    })
  }
}
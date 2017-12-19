import Task from '../models/task'
import Project from '../models/project'

export default {
  
  find: (query, callback) => {
    Task.find(function(err, tasks) {
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

  create: (reqBody, callback) => {  
    Task.create(reqBody, function(err, task) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, task)
    })
  },

  findByIdAndUpdate: (id, reqBody, callback) => {
    Task.findByIdAndUpdate(id, reqBody, {new: true}, function(err, task) {
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

      // Remove Task from this Project
      Project.findByIdAndUpdate(task._creator, { $pull: { tasks: id}, $inc: {total: -task.price} }, function(err, project) {
        if (err) {
          callback(err, null)
          return
        }
        callback(null, null)
      })

      callback(null, null)
    })
  }
}
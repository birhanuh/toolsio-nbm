import Task from '../models/Task'
import Project from '../models/Project'

export default {

  create: (params, callback) => {  
    Task.create(params, function(err, task) {
      if (err) {
        callback(err, null)
        return
      }

      // Return updated Project with added task
      Project.findByIdAndUpdate(task._creator).populate([{ path: 'customer', select: 'name'}, { path: 'tasks' }]).exec(function(err, project) {
        if (err) {
          callback(err, null)
          return
        }
        callback(null, project)
      })
    })
  },

  findByIdAndUpdate: (id, params, callback) => {
    Task.findByIdAndUpdate(id, params, {new: true}, function(err, task) {
      if (err) {
        callback(err, null)
        return
      }

      // Return updated Project with updated item
      Project.findByIdAndUpdate(task._creator).populate([{ path: 'customer', select: 'name'}, { path: 'tasks' }]).exec(function(err, project) {
        if (err) {
          callback(err, null)
          return
        }
        callback(null, project)
      })
    })
  },

  findByIdAndRemove: (id, callback) => {
    Task.findByIdAndRemove(id, function(err, task) {
      if (err) {
        callback(err, null)
        return
      }

      // Return updated Project with removed task
      Project.findByIdAndUpdate(task._creator).populate([{ path: 'customer', select: 'name'}, { path: 'tasks' }]).exec(function(err, project) {
        if (err) {
          callback(err, null)
          return
        }
        callback(null, project)
      })
    })
  }
}
import Task from '../models/task'
import Project from '../models/project'

export default {
  
  find: (req, callback) => {

    Task.find(function(err, tasks) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, tasks)
    })
  },

  findById: (req, callback) => {

    let id = req.params.id

    Task.findById(id, function(err, task) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, task)
    })
  },

  create: (req, callback) => {  

    let body = req.body
    delete body['_id']

    Task.create(body, function(err, task) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, task)
    })
  },

  findByIdAndUpdate: (req, callback) => {

    let id = req.params.id
    let body = req.body

    Task.findByIdAndUpdate(id, body, {new: true}, function(err, task) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, task)
    })
  },

  findByIdAndRemove: (req, callback) => {

    let id = req.params.id

    Task.findByIdAndRemove(id, function(err, task) {
      if (err) {
        callback(err, null)
        return
      }

      // Remove this Task from associated Project
      Project.findByIdAndUpdate(task._creator, { $pull: { tasks: id}, $inc: {total: -task.price} }, function(err, project) {
        if (err) {
          callback(err, null)
          return
        }
      })

      callback(null, null)
    })
  }
}
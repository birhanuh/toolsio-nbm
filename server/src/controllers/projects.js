import Project from '../models/project'
import Task from '../models/task'
import Invoice from '../models/invoice'

export default {
  
  find: (req, callback) => {
    
    Project.find({}).select('-tasks').populate({ path: 'customer', select: 'name' }).exec(function(err, projects) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, projects)
    })
  },

  findById: (req, callback) => {

    let id = req.params.id

    Project.findById(id).populate([{ path: 'customer', select: '_id'}, { path: 'customer', select: 'name'}, { path: 'tasks'}, { path: 'invoice', select: '_id' }]).exec(function(err, project) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, project)
    })
  },

  create: (req, callback) => {

    let body = req.body

    Project.create(body, function(err, project) {
      if (err) {
        callback(err, null)
        return
      }
      callback(null, project)
    })
  },

  findByIdAndUpdate: (req, callback) => {

    let id = req.params.id
    let body = req.body

    Project.findByIdAndUpdate(id, body, {new: true}, (err, project) => {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, project)
    })
  },

  findByIdAndRemove: (req, callback) => {

    let id = req.params.id

    Project.findByIdAndRemove(id, (err, project) => {
      if (err) {
        callback(err, null)
        return
      }

      // Remove relateded tasks
      Task.remove({ _creator: id }, (err, task) => {
        if (err) {
          callback(err, null)
          return
        }
        callback(null, null)
      })

      // Remove relateded invoice
      Invoice.remove({ project: id }, (err, invoice) => {
        if (err) {
          callback(err, null)
          return
        }
        callback(null, null)
      })
      
    })
  }
}
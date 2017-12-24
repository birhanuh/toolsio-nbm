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

  findById: (id, callback) => {
    Project.findById(id).populate([{ path: 'customer', select: '_id'}, { path: 'customer', select: 'name'}, { path: 'tasks'}, { path: 'invoice', select: '_id' }]).exec(function(err, project) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, project)
    })
  },

  create: (reqBody, callback) => {
    Project.create(reqBody, function(err, project) {
      if (err) {
        callback(err, null)
        return
      }
      callback(null, project)
    })
  },

  findByIdAndUpdate: (id, reqBody, callback) => {
    Project.findByIdAndUpdate(id, reqBody, {new: true}, function(err, project) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, project)
    })
  },

  findByIdAndRemove: (id, callback) => {
    Project.findByIdAndRemove(id, function(err, project) {
      if (err) {
        callback(err, null)
        return
      }

      // Remove relateded tasks
      Task.remove({ _creator: id }, function(err, task) {
        if (err) {
          callback(err, null)
          return
        }
        callback(null, null)
      })

      // Remove relateded invoice
      Invoice.remove({ project: id }, function(err, invoice) {
        if (err) {
          callback(err, null)
          return
        }
        callback(null, null)
      })
      
    })
  }
}
import Project from '../models/project'
import Task from '../models/task'
import Invoice from '../models/invoice'

export default {
  
  find: (req, callback) => {
    
    let query = req.query

    let start = parseInt(query.start)
    let length = parseInt(query.length)

    Project.count({}, (err, count) => {
      Project.find({}).skip(start).limit(length).select('-tasks').populate({ path: 'customer', select: 'name' }).exec((err, projects) => {
        if (err) {
          callback(err, null)
          return
        }

        let projectsTotatlPages = {      
          total: count,
          length: length,
          pages: Math.ceil(count/length),
          list: projects
        }

        callback(null, projectsTotatlPages)
      })
    })
  },

  findById: (req, callback) => {

    let id = req.params.id

    Project.findById(id).populate([{ path: 'customer', select: 'name'}, { path: 'tasks'}, { path: 'invoice', select: '_id' }]).exec((err, project) => {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, project)
    })
  },

  create: (req, callback) => {

    let body = req.body
    delete body['_id']

    Project.create(body, (err, project) => {
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

    Project.findByIdAndUpdate(id, body, {new: true}).populate([{ path: 'customer', select: 'name'}, { path: 'tasks'}, { path: 'invoice', select: '_id' }]).exec((err, project) => {
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

      // Remove associated Task
      Task.remove({ _creator: project._id }, (err, task) => {
        if (err) {
          callback(err, null)
          return
        }
      })

      // Remove associated Invoice
      Invoice.remove({ project: project._id }, (err, invoice) => {
        if (err) {
          callback(err, null)
          return
        }
      })
      
      callback(null, null)
    })
  }
}
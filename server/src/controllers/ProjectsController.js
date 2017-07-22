import Project from '../models/Project'
import { Validation } from '../utils'

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
    const { errors, isValid } = Validation.validateProjectInput(params)

    if (isValid) {
      Project.create(params, function(err, project) {
        if (err) {
          callback(err, null)
          return
        }
        callback(null, project)
      })
    } else {
      callback(errors, null, null)
    }
  },

  findByIdAndUpdate: (id, params, callback) => {
    const { errors, isValid } = Validation.validateProjectInput(params)

    if (isValid) {
      Project.findByIdAndUpdate(id, params, {new: true}, function(err, project) {
        if (err) {
          callback(err, null)
          return
        }

        callback(null, project)
      })
    } else {
      callback(errors, null, null)
    }
  },

  findByIdAndRemove: (id, callback) => {
    Project.findByIdAndRemove(id, function(err, project) {
      if (err) {
        callback(err, null)
        return
      }

      callback(null, null)
    })
  }
}
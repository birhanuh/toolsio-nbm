import Project from '../models/project'
import Task from '../models/task'
import Invoice from '../models/invoice'

export default {
  
  find: (req, callback) => {
    
    let query = req.query

    let start = parseInt(query.start)
    let length = parseInt(query.length)

    // Project.count()
    //   .then(count => {
    //     Project.query(function (qb) {
    //        qb.innerJoin('customers', 'projects.customer_id', 'customers.id');
    //        qb.groupBy('projects.id');
    //     }).orderBy('-created_at').fetchPage({ page: start, pageSize: length })
    //       .then(projects => {

    //         let projectsTotatlPages = {      
    //           total: count,
    //           length: length,
    //           pages: Math.ceil(count/length),
    //           list: projects
    //         }

    //         callback(null, projectsTotatlPages)
    //       })
    //       .catch(err => { 
    //         callback(err, null)
    //       })
    //   })
    //   .catch(err => { 
    //     callback(err, null)
    //   })


    Project.count()
    .then(count => {
      Project.collection({ currentpage: start, limit: length, order: 'desc' }).fetch()
        .then(projects => {

          let projectsTotatlPages = {      
            total: count,
            length: length,
            pages: Math.ceil(count/length),
            list: projects
          }

          callback(null, projectsTotatlPages)
        })
        .catch(err => { 
          callback(err, null)
        })
    })
  },

  findById: (req, callback) => {

    let id = req.params.id

    Project.forge({ id: id}).fetch({withRelated: ['tasks']})
      .then(project => {
        //project.related('tasks')
        callback(null, project)
      })
      .catch(err => { 
        callback(err, null)
      })

  },

  create: (req, callback) => {

    let body = req.body
    delete body['_id']

    Project.forge(body, { hasTimestamps: true }).save()
      .then(project => {
        callback(null, project)
      })
      .catch(err => { 
        callback(err, null)
      })
  },

  findByIdAndUpdate: (req, callback) => {

    let id = req.params.id
    let body = req.body

    Project({id: id}).save(body, {patch: true})
      .then(project => {
        callback(null, project)
      })
      .catch(err => { 
        callback(err, null)
      })
  },

  findByIdAndRemove: (req, callback) => {

    let id = req.params.id

    Project.destory({id: id})
      .then(project => {
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
      .catch(err => { 
        callback(err, null)
      })
  }
}
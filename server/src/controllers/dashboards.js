import Invoice from '../models/invoice'
import Project from '../models/project'
import Sale from '../models/sale'
import User from '../models/user'
import Customer from '../models/customer'

let date = new Date()
let firstDayOfLastMonth = new Date(date.getFullYear(), date.getMonth()-1, 1)

export default {

  findById: (req, callback) => {

    let id = req.params.id

    // Total income
    if (id === 'total-income') {
      Invoice.aggregate( [
          {$match: {
            status: 'paid'
          }},
          {$group: 
            {
              _id: '$status', 
              count: {
                $sum: 1
              },
              sum: {
                $sum: '$total'
              }
            }
          }], function (err, results) {
          if (err) {
            callback(err, null)
            return
          }
          callback(null, results)
          return 
        })

      return 
    }

    // Incomes
    if (id === 'incomes') {
      Invoice.aggregate( [
          {$match: {
            createdAt: {
              $gte: firstDayOfLastMonth
            },
            status: 'paid'
          }},
          {$group: 
            {
              _id: { month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" }, year: { $year: "$createdAt" } }, 
              count: { $sum: 1},
              sum: { $sum: '$total'}
            }
          },{$group: 
            {
              _id: null, 
              totalCount: { $sum: '$count' },
              totalSum: { $sum: '$sum' },
              data: {
                $push: { 
                  date: '$_id',
                  count: '$count',
                  sum: '$sum'
                }
              }
            }
          }], function (err, results) {
          if (err) {
            callback(err, null)
            return
          }
          callback(null, results)
          return 
        })

      return 
    }

    // Projects
    if (id === 'projects') {
      Project.aggregate( [
          {$match: {
            createdAt: {
              $gte: firstDayOfLastMonth
            }
          }},
          {$project: 
            {
              _id: 0, 
              status: 1, 
              month: { $month: '$createdAt' } 
            }
          },
          {$group: 
            {
              _id: {
                month: '$month',
                status: '$status'
              }, 
              count: { '$sum': 1 }
            }
          },{$group: 
            {
              _id: '$_id.month', 
              totalCount: { $sum: '$count' },
              data: {
                $push: { 
                  status: '$_id.status',
                  count: '$count'
                }
              }
            }
          }], function (err, results) {
            if (err) {
              callback(err, null)
              return
            }
            callback(null, results)
            return 
        })

      return 
    }

    // Sales
    if (id === 'sales') {
      Sale.aggregate( [
          {$match: {
            createdAt: {
              $gte: ffirstDayOfLastMonth
            }
          }},
          {$project: 
            {
              _id: 0, 
              status: 1, 
              month: { $month: '$createdAt' } 
            }
          },
          {$group: 
            {
              _id: {
                month: '$month',
                status: '$status'
              },
              count: { $sum: 1}
            }
          },{$group: 
            {
              _id: '$_id.month', 
              totalCount: { $sum: '$count' },
              data: {
                $push: { 
                  status: '$_id.status',
                  count: '$count'
                }
              }
            }
          }], function (err, results) {
            if (err) {
              callback(err, null)
              return
            }
            callback(null, results)
            return 
        })

      return 
    }

    // Customers
    if (id === 'customers') {
      Customer.aggregate( [
          {$match: {
            createdAt: {
              $gte: firstDayOfLastMonth
            }
          }},
          {$group: 
            {
              _id: { month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" }, year: { $year: "$createdAt" } }, 
              count: { $sum: 1}
            }
          },
          {$group: 
            {
              _id: null, 
              totalCount: { $sum: '$count' },
              data: {
                $push: { 
                  date: '$_id',
                  count: '$count'
                }
              }
            }
          }], function (err, results) {
            if (err) {
              callback(err, null)
              return
            }
            callback(null, results)
            return 
        })

      return 
    }

     // Invoices
    if (id === 'invoices') {

      Invoice.aggregate( [
          {$match: {
            createdAt: {
              $gte: firstDayOfLastMonth
            }
          }},
          {$project: 
            {
              _id: 0, 
              status: 1, 
              week: { $week: '$createdAt' },
              month: { $month: '$createdAt' } 
            }
          },
          {$group: 
            {
              _id: {
                week: '$week',
                status: '$status'
              },
              statusCount: { '$sum': 1 }
            }
          },{$group: 
            {
              _id: '$_id.week', 
              totalCount: { $sum: '$statusCount' },
              data: {
                $push: { 
                  status: '$_id.status',
                  count: '$statusCount'
                }
              }
            }
          }], function (err, results) {
          if (err) {
            callback(err, null)
            return
          }
          callback(null, results)
          return 
        })

        return
      }

    // Tasks Projects 
    if (id === 'tasks-projects') {

      Project.aggregate([
          {$match: {$or: [
              {status: 'new'},
              {status: 'delayed'}
            ]}
          },
          {$group: 
            {
              _id: {
                _id: '$_id',
                status: '$status'
              },
              statusCount: { '$sum': 1 }
            }
          },
          {$group: 
            {
              _id: '$_id.status', 
              count: { $sum: '$statusCount' },
              projects: {
                $push: { 
                  id: '$_id._id'
                }
              }
            }
          }], (err, projects) => {
        if (err) {
          callback(err, null)
          return
        }

        callback(null, projects)
      })

      return 
    }

    // Tasks Sales 
    if (id === 'tasks-sales') {

      Sale.aggregate([
          {$match: {$or: [
              {status: 'new'},
              {status: 'delayed'}
            ]}
          },
          {$group: 
            {
              _id: {
                _id: '$_id',
                status: '$status'
              },
              statusCount: { '$sum': 1 }
            }
          },
          {$group: 
            {
              _id: '$_id.status', 
              count: { $sum: '$statusCount' },
              sales: {
                $push: { 
                  id: '$_id._id'
                }
              }
            }
          }], (err, sales) => {
        if (err) {
          callback(err, null)
          return
        }

        callback(null, sales)
      })

      return 
    }

    // Tasks Invoices 
    if (id === 'tasks-invoices') {

      Invoice.aggregate([
        {$match: {$or: [
              {status: 'pending'},
              {status: 'overdue'}
            ]}
          },
          {$group: 
            {
              _id: {
                _id: '$_id',
                status: '$status',
                customer: '$customer'
              },
              statusCount: { '$sum': 1 }
            }
          },
          {$group: 
            {
              _id: '$_id.status', 
              count: { $sum: '$statusCount' },
              invoices: {
                $push: { 
                  id: '$_id._id',
                  customer: '$_id.customer'
                }
              }
            }
          }], (err, invoices) => {
        if (err) {
          callback(err, null)
          return
        }

        callback(null, invoices)
      })

      return 
    }
  }
}
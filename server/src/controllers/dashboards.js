import Invoice from '../models/invoice'
import Project from '../models/project'
import Sale from '../models/sale'
import User from '../models/user'
import Customer from '../models/customer'

let date = new Date()

var firstDayOfTheMonth = new Date(date.getFullYear(), date.getMonth(), 1)


let thirtyDaysEarlierDateLong = new Date().setDate(date.getDate()-30)
let thirtyDaysEarlierDate = new Date(thirtyDaysEarlierDateLong)

export default {
  find: (req, callback) => {

    let type = req.query.type

    // Total income
    if (type === 'total-income') {
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
    if (type === 'incomes') {
      Invoice.aggregate( [
          {$match: {
            createdAt: {
              $gte: firstDayOfTheMonth
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
    if (type === 'projects') {
      Project.aggregate( [
          {$match: {
            createdAt: {
              $gte: firstDayOfTheMonth
            }
          }},
          {$group: 
            {
              _id: '$status', 
              count: { '$sum': 1 }
            }
          },{$group: 
            {
              _id: null, 
              totalCount: { $sum: '$count' },
              data: {
                $push: { 
                  status: '$_id',
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
    if (type === 'sales') {
      Sale.aggregate( [
          {$match: {
            createdAt: {
              $gte: firstDayOfTheMonth
            }
          }},
          {$group: 
            {
              _id: '$status', 
              count: { $sum: 1}
            }
          },{$group: 
            {
              _id: null, 
              totalCount: { $sum: '$count' },
              data: {
                $push: { 
                  status: '$_id',
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
    if (type === 'customers') {
      Customer.aggregate( [
          {$match: {
            createdAt: {
              $gte: firstDayOfTheMonth
            }
          }},
          {$group: 
            {
              _id: { month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" }, year: { $year: "$createdAt" } }, 
              count: { $sum: 1}
            }
          },{$group: 
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
    if (type === 'invoices') {

      Invoice.aggregate( [
          {$match: {
            createdAt: {
              $gte: thirtyDaysEarlierDate
            }
          }},
          {$project: 
            {
              _id: 0, 
              status: 1, 
              week: { $week: '$createdAt' } 
            }
          },{$group: 
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
              count: { $sum: '$statusCount' },
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
    if (type === 'tasks-projects') {

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
          },{$group: 
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
    if (type === 'tasks-sales') {

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
          },{$group: 
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
    if (type === 'tasks-invoices') {

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
          },{$group: 
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
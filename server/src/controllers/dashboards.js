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

    // Income
    if (type === 'incomes') {
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
              count: { $sum: 1}
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
              _id: '{ month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" }, year: { $year: "$createdAt" } }', 
              count: { $sum: 1}
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
              statuses: {
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

    // Tasks
    if (type === 'tasks') {

      return 
    }
  }
}
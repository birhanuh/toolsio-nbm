import Invoice from '../models/invoice'
import Project from '../models/project'
import Sale from '../models/sale'
import User from '../models/user'
import Customer from '../models/customer'

let date = new Date()
let firstDayOfLastMonth = new Date(date.getFullYear(), date.getMonth()-1, 1)

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
              $gte: firstDayOfLastMonth
            },
            status: 'paid'
          }},
          {$project: 
            {
              total: 1,
              day: { $dayOfMonth: '$createdAt' },
              month: { $month: '$createdAt' },
              year: { $year: '$createdAt' }
            }
          },
          {$group: 
            {
              _id: {
                day: '$day',
                month: '$month',
                year: '$year',
              }, 
              count: { $sum: 1},
              sum: { $sum: '$total'}
            }
          },
          {$group: 
            {
              _id: '$_id.month', 
              totalCount: { $sum: '$count' },
              totalSum: { $sum: '$sum' },
              data: {
                $push: { 
                  date: '$_id',
                  sum: '$sum'
                }
              }
            }
          }], function (err, firstLevelResults) {
            
            if (err) {
              callback(err, null)
              return
            }

            Invoice.aggregate([
              { $group: 
                { _id: null, 
                  count: { $sum: 1 }
                } 
            }], function (err, secondLevelResults) {

              if (err) {
                callback(err, null)
                return
              }
              
              callback(null, {total: secondLevelResults[0], lastTwoMonths: firstLevelResults})
            
              return 
            })
        })

      return 
    }

    // Projects
    if (type === 'projects') {
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
          },
          {$group: 
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
          }], function (err, firstLevelResults) {
            
            if (err) {
              callback(err, null)
              return
            }

            Project.aggregate([
              { $group: 
                { _id: null, 
                  count: { $sum: 1 }
                } 
            }], function (err, secondLevelResults) {

              if (err) {
                callback(err, null)
                return
              }
              
              callback(null, {total: secondLevelResults[0], lastTwoMonths: firstLevelResults})
            
              return 
            })
        })

      return 
    }

    // Sales
    if (type === 'sales') {
      Sale.aggregate( [
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
              count: { $sum: 1}
            }
          },
          {$group: 
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
          }], function (err, firstLevelResults) {
            
            if (err) {
              callback(err, null)
              return
            }

            Sale.aggregate([
              { $group: 
                { _id: null, 
                  count: { $sum: 1 }
                } 
            }], function (err, secondLevelResults) {

              if (err) {
                callback(err, null)
                return
              }
              
              callback(null, {total: secondLevelResults[0], lastTwoMonths: firstLevelResults})
            
              return 
            })
        })

      return 
    }

    // Customers
    if (type === 'customers') {
      Customer.aggregate( [
          {$match: {
            createdAt: {
              $gte: firstDayOfLastMonth
            }
          }},
          {$project: 
            {
              day: { $dayOfMonth: '$createdAt' },
              month: { $month: '$createdAt' },
              year: { $year: '$createdAt' }
            }
          },
          {$group: 
            {
              _id: {
                day: '$day',
                month: '$month',
                year: '$year',
              }, 
              count: { $sum: 1}
            }
          },
          {$group: 
            {
              _id: '$_id.month', 
              totalCount: { $sum: '$count' },
              data: {
                $push: { 
                  date: '$_id',
                  count: '$count'
                }
              }
            }
          }], function (err, firstLevelResults) {
            if (err) {
              callback(err, null)
              return
            }
            Customer.aggregate([
              { $group: 
                { _id: null, 
                  count: { $sum: 1 },
                  firstCustomersDate: { $first: "$createdAt" }
                } 
            }], function (err, secondLevelResults) {

              if (err) {
                callback(err, null)
                return
              }

              let secondLevelResultsUpdated = []
              
              if (secondLevelResults.length !== 0) {
                let firstCustomersDate = new Date(""+secondLevelResults[0].firstCustomersDate+"")
                let daysBetween = Customer.daysBetween(firstCustomersDate, new Date())
              
                let avg = secondLevelResults[0].count/daysBetween

                secondLevelResultsUpdated = Object.assign({}, secondLevelResults[0], {avg: avg}) 
              }
              
              callback(null, {total: secondLevelResultsUpdated, lastTwoMonths: firstLevelResults})
            
              return 
            })
        })

      return 
    }

     // Invoices
    if (type === 'invoices') {

      Invoice.aggregate( [
          {$match: {
            createdAt: {
              $gte: firstDayOfLastMonth
            }
          }},
          {$project: 
            {
              status: 1, 
              week: { $week: '$createdAt' },
              month: { $month: '$createdAt' } 
            }
          },
          {$group: 
            {
              _id: {
                week: '$week',
                month: '$month',
                status: '$status'
              },
              statusCount: { '$sum': 1 }
            }
          },
          {$group: 
            {
              _id: '$_id.month', 
              totalCount: { $sum: '$statusCount' },
              data: {                
                $push: { 
                  week: '$_id.week', 
                  status: '$_id.status',
                  count: '$statusCount'
                }
              }
            }
          }], function (err, firstLevelResults) {
            
            if (err) {
              callback(err, null)
              return
            }

            Sale.aggregate([
              { $group: 
                { _id: null, 
                  count: { $sum: 1 }
                } 
            }], function (err, secondLevelResults) {

              if (err) {
                callback(err, null)
                return
              }
              
              callback(null, {total: secondLevelResults[0], lastTwoMonths: firstLevelResults})
            
              return 
            })
        })

        return
      }

    // Tasks Projects 
    if (type === 'project-tasks') {

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
                status: '$status',
                name: '$name'
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
                  _id: '$_id._id',
                  name: '$_id.name'
                }
              }
            }
          }],function (err, firstLevelResults) {
            
            if (err) {
              callback(err, null)
              return
            }

            Project.aggregate([
              { $group: 
                { _id: null, 
                  count: { $sum: 1 }
                } 
            }], function (err, secondLevelResults) {

              if (err) {
                callback(err, null)
                return
              }
              
              callback(null, {total: secondLevelResults[0], newDelayed: firstLevelResults})
            
              return 
            })
        })

      return
    }

    // Tasks Sales 
    if (type === 'sale-tasks') {

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
                status: '$status',
                name: '$name'
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
                  _id: '$_id._id',
                  name: '$_id.name'
                }
              }
            }
          }], function (err, firstLevelResults) {
            
            if (err) {
              callback(err, null)
              return
            }

            Sale.aggregate([
              { $group: 
                { _id: null, 
                  count: { $sum: 1 }
                } 
            }], function (err, secondLevelResults) {

              if (err) {
                callback(err, null)
                return
              }
              
              callback(null, {total: secondLevelResults[0], newDelayed: firstLevelResults})
            
              return 
            })
        })

      return 
    }

    // Tasks Invoices 
    if (type === 'invoice-tasks') {

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
                customer: '$customer',
                referenceNumber: '$referenceNumber'
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
                  _id: '$_id._id',
                  project: '$_id.project',
                  referenceNumber: '$_id.referenceNumber'
                }
              }
            }
          }], function (err, firstLevelResults) {
            
            if (err) {
              callback(err, null)
              return
            }

            Invoice.aggregate([
              { $group: 
                { _id: null, 
                  count: { $sum: 1 }
                } 
            }], function (err, secondLevelResults) {

              if (err) {
                callback(err, null)
                return
              }
              
              callback(null, {total: secondLevelResults[0], pendingOverdue: firstLevelResults})
            
              return 
            })
        })

      return 
    }
  }
}

import Invoice from '../models/invoice'
import Project from '../models/project'
import Sale from '../models/sale'
import User from '../models/user'
import Customer from '../models/customer'

let today = new Date()
let thirtyDaysEarlierDateLong = new Date().setDate(today.getDate()-30)
let thirtyDaysEarlierDate = new Date(thirtyDaysEarlierDateLong)

export default {
  find: (req, callback) => {

    let type = req.query.type

    // Income
    if (type === 'incomes') {

      return 
    }

    // Projects
    if (type === 'projects') {

      return 
    }

    // Sales
    if (type === 'sales') {

      return 
    }

     // Invoices
    if (type === 'invoices') {
      //  Project.aggregate( [
      //   {
      //     $group:
      //       {
      //          _id: "$status",  
      //          count: { $sum: 1 }
      //       }
      //   }
      // ], function (err, result) {
      //      if (err) {
      //          console.log(err);
      //          return;
      //      }
      //      console.log(result);
      //    })
      //    return 
      //  }
      
      Project.aggregate( [
        {$match: {
          createdAt: {
            $gte: thirtyDaysEarlierDate
          }
        }},
        {$project: 
          {_id: 0, 
            status: 1, 
            week: { $week: "$createdAt" } 
          }
        }], function (err, results) {
        if (err) {
          callback(err, null)
          return
        }
        console.log('result: ', results)
        callback(null, results)
        return 
      })
      }

    // Tasks
    if (type === 'tasks') {

      return 
    }
  }
}
import Invoice from '../models/invoice'
import Project from '../models/project'
import Sale from '../models/sale'
import User from '../models/user'
import Customer from '../models/customer'

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

      Invoice.aggregate( [ {$project: {_id: 0, status: 1, week: { $week: "$createdAt" } }} ], function (err, result) {
          if (err) {
              callback(err, null)
              return;
          }
          console.log('result: ', result)
          callback(null, result)
          return 
        })
      }

    // Tasks
    if (type === 'tasks') {

      return 
    }
  }
}
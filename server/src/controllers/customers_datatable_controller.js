import Customer from '../models/customer'

export default {
  
  find: (query, callback) => {
     
    let limit = parseInt(query.iDisplayLength) 
    let skip = parseInt(query.iDisplayStart)
    let searchString = query.sSearch !== '' ? query.sSearch : ''
    console.log('sSearch: ', query.sSearch === '')
    Customer.count({}, function( err, count){

      Customer.find({$text: {$search: ''}}).skip(skip).limit(limit).exec(function(err, customers) {
        if (err) {
          callback(err, null)
          return
        }

        let customersList = []

        const customersFiltered = customers.map(customer => {
          let activeProjectsAndSales = '-'
          let unpaidInvoices = '-'
          let actions = 
            "<div class=\"ui small buttons\">" +
              "<a href=\"/customers/edit/"+customer._id+"\" class=\"ui icon basic button green\"><i class=\"edit icon\"></i></a>" +
              "<a href=\"/customers/show/"+customer._id+"\" class=\"ui icon basic blue button\"><i class=\"unhide icon\"></i></a>" +
            "</div>"

          customersList =
            [
            customer.name,
            customer.vatNumber,
            customer.contact.phoneNumber+ '\n' +customer.contact.email,        
            activeProjectsAndSales,
            unpaidInvoices,
            actions        
          ]

          return customersList
        })

        customers = {      
          sEcho: parseInt(query.sEcho),
          iTotalRecords: count,
          iTotalDisplayRecords: count,
          aaData: customersFiltered
        }
     
        callback(null, customers)
      })
    })
  }

}
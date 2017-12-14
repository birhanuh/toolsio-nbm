import Customer from '../models/customer'

export default {
  
  find: (query, callback) => {
     
    let limit = parseInt(query.iDisplayLength) 
    let skip = parseInt(query.iDisplayStart)

    const columns = ['name', 'vatNumber', 'contact']
    let sortCol = parseInt(query.iSortCol_0)
    let field = columns[sortCol]

    let sortDir =  query.sSortDir_0
    
    let textSearch = query.sSearch ? { $text: {$search: query.sSearch}} : {}
    let sort = field && sortDir ? {[field]: ''+sortDir+''} : {}

    Customer.count({}, function( err, count){

      Customer.find(textSearch).sort(sort).skip(skip).limit(limit).exec(function(err, customers) {
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
import Customer from '../models/customer'

export default {
  
  find: (query, callback) => {

    let start = parseInt(query.start)
    let length = parseInt(query.length)

    let order = query.order[0]
    const columns = ['name', 'vatNumber', 'contact']
    let field = columns[parseInt(order.column)]
    let sortDir =  order.dir 
    let sort = query.order.length > 0 ? {[field]: ''+sortDir+''} : {}

    let search = query.search.value !== '' ? { $text: {$search: query.search.value}} : {}
    
    Customer.count({}, (err, count) => {

      Customer.find(search).sort(sort).skip(start).limit(length).exec((err, customers) => {
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
          draw: parseInt(query.draw),
          total: count,
          list: customersFiltered
        }
     
        callback(null, customers)
      })
    })
  }

}
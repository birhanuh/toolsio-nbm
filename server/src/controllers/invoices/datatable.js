import Invioce from '../../models/invoice'

export default {
  
  find: (req, callback) => {

    let query = req.query

    let start = parseInt(query.start)
    let length = parseInt(query.length)

    let order = query.order[0]
    const columns = ['name', 'vatNumber', 'contact']
    let field = columns[parseInt(order.column)]
    let sortDir =  order.dir 
    let sort = query.order.length > 0 ? {[field]: ''+sortDir+''} : {}

    let search = query.search.value !== '' ? { $text: {$search: query.search.value}} : {}

    Invioce.count({}, function( err, count){

      Invioce.find(search).sort(sort).skip(start).limit(length).populate([{path: 'sale', select: 'name total'}, {path: 'project', select: 'name total' }, {path: 'customer', select: 'name'}]).exec((err, invoices) => {
        if (err) {
          callback(err, null)
          return
        }

        let invoicesList = []

        const invoicesFiltered = invoices.map(invoice => {
         
          let statusClass
          
          switch(invoice.status) {
            case 'new':
              statusClass = 'blue'
              break
            case 'pending':
              statusClass = 'orange'
              break
            case 'overdue':
              statusClass = 'red'
              break
            case 'paid':
              statusClass = 'green' 
              break
            default:
              statusClass = 'undefined' 
          }
          
          let status = "<div class=\"ui uppercase tiny label "+statusClass+"\">"+
            invoice.status+
          "</div>"
          
          let actions = 
            "<div class=\"ui small buttons\">" +
              "<a href=\"/invoices/edit/"+invoice._id+"\" class=\"ui icon basic button green\"><i class=\"edit icon\"></i></a>" +
              "<a href=\"/invoices/show/"+invoice._id+"\" class=\"ui icon basic blue button\"><i class=\"unhide icon\"></i></a>" +
            "</div>"

          invoicesList =
            [
            (invoice.sale && invoice.sale.name) || (invoice.project && invoice.project.name),
            invoice.createdAt,
            invoice.customer.name,
            invoice.project && invoice.project.total || invoice.sale && invoice.sale.total,
            status, 
            actions        
          ]

          return invoicesList
        })

        invoices = {      
           draw: parseInt(query.draw),
          total: count,
          list: invoicesFiltered
        }
     
        callback(null, invoices)
      })
    })
  }

}
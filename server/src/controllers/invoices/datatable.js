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

      Invioce.find(search).sort(sort).skip(start).limit(length).populate([{path: 'sale', select: 'name total status'}, {path: 'project', select: 'name total status' }, {path: 'customer', select: 'name'}]).exec((err, invoices) => {
        if (err) {
          callback(err, null)
          return
        }

        let invoicesList = []

        const invoicesFiltered = invoices.map(invoice => {
         
          let invoiceStatusClass          
          switch(invoice.status) {
            case 'new':
              invoiceStatusClass = 'blue'
              break
            case 'pending':
              invoiceStatusClass = 'orange'
              break
            case 'overdue':
              invoiceStatusClass = 'red'
              break
            case 'paid':
              invoiceStatusClass = 'green' 
              break
            default:
              invoiceStatusClass = 'undefined' 
          }
          
          let saleStatusClass          
          switch(invoice.sale && invoice.sale.status) {
            case 'new':
              saleStatusClass = 'blue'
              break
            case 'in progress':
              saleStatusClass = 'orange'
              break
            case 'overdue':
              saleStatusClass = 'red'
              break
            case 'ready':
              saleStatusClass = 'green' 
              break
            case 'ready':
              saleStatusClass = 'green' 
              break
             case 'delayed':
              saleStatusClass = 'red' 
              break
            default:
              saleStatusClass = 'undefined' 
          }
     
          let projectStatusClass          
          switch(invoice.project && invoice.project.status) {
            case 'new':
              projectStatusClass = 'blue'
              break
            case 'in progress':
              projectStatusClass = 'orange'
              break
            case 'overdue':
              projectStatusClass = 'red'
              break
            case 'finished':
              projectStatusClass = 'green' 
              break
            case 'delivered':
              projectStatusClass = 'green' 
              break
            case 'delayed':
              projectStatusClass = 'red' 
              break  
            default:
              projectStatusClass = 'undefined' 
          }
          let actions = 
            "<div class=\"ui small buttons\">" +
              "<a href=\"/invoices/edit/"+invoice._id+"\" class=\"ui icon basic button green\"><i class=\"edit icon\"></i></a>" +
              "<a href=\"/invoices/show/"+invoice._id+"\" class=\"ui icon basic blue button\"><i class=\"unhide icon\"></i></a>" +
            "</div>"

          invoicesList =
            [
            (invoice.sale && "<span class=\""+saleStatusClass+"\">"+invoice.sale.name+"</span>") || 
              (invoice.project && "<span class=\""+projectStatusClass+"\">"+invoice.project.name+"</span>"),
            invoice.createdAt,
            invoice.customer.name,
            invoice.project && invoice.project.total || invoice.sale && invoice.sale.total,
            "<div class=\"ui uppercase tiny label "+invoiceStatusClass+"\">"+
              invoice.status+
            "</div>", 
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
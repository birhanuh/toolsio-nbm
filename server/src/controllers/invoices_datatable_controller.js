import Invioce from '../models/invoice'

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

    Invioce.count({}, function( err, count){

      Invioce.find(textSearch).sort(sort).skip(skip).limit(limit).populate([{path: 'sale', select: 'name total'}, {path: 'project', select: 'name total' }, {path: 'customer', select: 'name'}]).exec(function(err, invoices) {
        if (err) {
          callback(err, null)
          return
        }

        let invoicesList = []

        const invoicesFiltered = invoices.map(invoice => {
         
          let statusClass
          
          switch(invoice.status) {
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
          sEcho: parseInt(query.sEcho),
          iTotalRecords: count,
          iTotalDisplayRecords: count,
          aaData: invoicesFiltered
        }
     
        callback(null, invoices)
      })
    })
  }

}
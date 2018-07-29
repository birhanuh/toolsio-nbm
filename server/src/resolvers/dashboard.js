import requiresAuth from '../middlewares/authentication'
// lodash
import _ from 'lodash'

export default {
  Query: {
    getTotalIncomeData: requiresAuth.createResolver(async (parent, args, { models, subdomain }) =>  {
      const paidTasksSumPromise = models.sequelize.query("SELECT SUM(ts.total) FROM tasks ts JOIN invoices invoice ON ts.project_id = invoice.project_id WHERE invoice.status='paid'", {
        model: models.Task,
        raw: true,
        searchPath: subdomain
      })

      const paidItemsSumPromise = models.sequelize.query("SELECT SUM(it.total) FROM items it JOIN invoices invoice ON it.sale_id = invoice.sale_id WHERE invoice.status='paid'", {
        model: models.Item,
        raw: true,
        searchPath: subdomain
      })

      const [paidTasksSum, paidItemsSum] = await Promise.all([paidTasksSumPromise, paidItemsSumPromise])
      
      return {
        tasksTotalSum: paidTasksSum[0].sum ? paidTasksSum[0].sum : 0,
        itemsTotalSum: paidItemsSum[0].sum ? paidItemsSum[0].sum : 0
      } 
    }),
    
    getIncomesData: requiresAuth.createResolver(async (parent, args, { models, subdomain }) =>  {
      const paidTasksSumDayPromise = models.sequelize.query("SELECT to_char(invoice.updated_at, 'DD/MM/YYYY') AS day, SUM(ts.total) FROM tasks ts JOIN invoices invoice ON ts.project_id = invoice.project_id WHERE invoice.status='paid' GROUP BY 1", {
        model: models.Task,
        raw: true,
        searchPath: subdomain
      })

      const paidItemsSumDayPromise = models.sequelize.query("SELECT to_char(invoice.updated_at, 'DD/MM/YYYY') AS day, SUM(it.total) FROM items it JOIN invoices invoice ON it.sale_id = invoice.sale_id WHERE invoice.status='paid' GROUP BY 1", {
        model: models.Item,
        raw: true,
        searchPath: subdomain
      })

      const countInvoicesPromise = models.Invoice.count({ searchPath: subdomain })

      const [paidTasksSumDay, paidItemsSumDay, countInvoices] = await Promise.all([paidTasksSumDayPromise, paidItemsSumDayPromise, countInvoicesPromise])

      let paidTasksItemsSumDay = [...paidTasksSumDay, ...paidItemsSumDay]
      console.log('paidTasksItemsSumDay', paidTasksItemsSumDay)

      let groupByDaySum = _(paidTasksItemsSumDay).groupBy('day').map((objs, key) => ({
        'day': key,
        'sum': _.sum(objs.map(item => parseInt(item.sum))) // objs = [{ day: '26/04/2018', sum: '40' }, { day: '26/04/2018', sum: '25' } ] select sum and convert to int = [40, 25]
      })).value()

      const paidTasksSumMonthPromise = models.sequelize.query("SELECT to_char(invoice.updated_at, 'MM/YYYY') AS month, SUM(ts.total) FROM tasks ts JOIN invoices invoice ON ts.project_id = invoice.project_id WHERE invoice.status='paid' GROUP BY 1 LIMIT 2", {
        model: models.Task,
        raw: true,
        searchPath: subdomain
      })

      const paidItemsSumMonthPromise = models.sequelize.query("SELECT to_char(invoice.updated_at, 'MM/YYYY') AS month, SUM(it.total) FROM items it JOIN invoices invoice ON it.sale_id = invoice.sale_id WHERE invoice.status='paid' GROUP BY 1 LIMIT 2", {
        model: models.Item,
        raw: true,
        searchPath: subdomain
      })

      const [paidTasksSumMonth, paidItemsSumMonth] = await Promise.all([paidTasksSumMonthPromise, paidItemsSumMonthPromise])

      let paidTasksItemsSumMonth = [...paidTasksSumMonth, ...paidItemsSumMonth]

      let groupByMonthSum = _(paidTasksItemsSumMonth).groupBy('month').map((objs, key) => ({
        'month': key,
        'sum': _.sum(objs.map(item => parseInt(item.sum))) 
      })).value()
      console.log('paidItemsSumMonth', paidItemsSumMonth)
      return {
        daySum: groupByDaySum,
        monthSum: groupByMonthSum,
        countInvoices
      } 
    }),

    getProjectsData: requiresAuth.createResolver(async (parent, args, { models, subdomain }) => {
      // const data = await models.Project.findAll({
      //   group: ['status'],
      //   attributes: ['status', [models.sequelize.fn('COUNT', 'status'), 'count']],
      // }, { raw: true })

      const countStatusPromise = models.sequelize.query('SELECT count(*), status FROM projects GROUP BY status', {
        model: models.Project,
        raw: true, 
        searchPath: subdomain
      })

      const countMonthPromise = models.sequelize.query("SELECT to_char(created_at, 'MM/YYYY') AS month, count(*) FROM projects GROUP BY 1 LIMIT 2", {
        model: models.Project,
        raw: true, 
        searchPath: subdomain
      })

      const [countStatus, countMonth] = await Promise.all([countStatusPromise, countMonthPromise])

      return {
        countStatus,
        countMonth 
      }
    }),

    getSalesData: requiresAuth.createResolver(async (parent, args, { models, subdomain }) => {

      const countStatusPromise = models.sequelize.query('SELECT count(*), status FROM sales GROUP BY status', {
        model: models.Sale,
        raw: true, 
        searchPath: subdomain
      })

      const countMonthPromise = models.sequelize.query("SELECT to_char(created_at, 'MM/YYYY') AS month, count(*) FROM sales GROUP BY 1 LIMIT 2", {
        model: models.Sale,
        raw: true, 
        searchPath: subdomain
      })

      const [countStatus, countMonth] = await Promise.all([countStatusPromise, countMonthPromise])

      return {
        countStatus,
        countMonth 
      }
    }),

    getCustomersData: requiresAuth.createResolver(async (parent, args, { models, subdomain }) => {
      const countProjectPromise = models.sequelize.query('SELECT c.name, count(p) FROM projects p JOIN customers c ON p.customer_id = c.id GROUP BY c.name', {
        model: models.Project,
        raw: true, 
        searchPath: subdomain
      })
      const countSalePromise = models.sequelize.query('SELECT c.name, count(s) FROM sales s JOIN customers c ON s.customer_id = c.id GROUP BY c.name', {
        model: models.Sale,
        raw: true, 
        searchPath: subdomain
      })

      const [countProject, countSale] = await Promise.all([countProjectPromise, countSalePromise]) 
      // countProject [ { name: 'Customera', count: '4' }, { name: 'Customerb', count: '7' } ]
      // countSale [ { name: 'Customerb', count: '2' }, { name: 'Customera', count: '6' } ]
      let mergedCountProjectCountSale = [...countProject, ...countSale]

      let groupByCustomersCountProjectSale = _(mergedCountProjectCountSale).groupBy('name').map((objs, key) => ({
        'name': key,
        'projectsSalesCount': _.sum(objs.map(item => parseInt(item.count))) 
      })).value()
      // groupByCustomersCountProjectSale [ { name: 'Customera', count: 10 }, { name: 'Customerb', count: 9 } ]

      return {
        nameCountProjectsSales: groupByCustomersCountProjectSale
      }
    }),

    getInvoicesData: requiresAuth.createResolver(async (parent, args, { models, subdomain }) => {
      const countStatusPromise = models.sequelize.query("SELECT to_char(created_at, 'Mon/YYYY') AS month, count(*) FROM invoices GROUP BY 1 LIMIT 2", {
        model: models.Invoice,
        raw: true, 
        searchPath: subdomain
      })

      const countMonthPromise = models.sequelize.query("SELECT to_char(created_at, 'Mon/YYYY') AS month, status, count(*) FROM invoices GROUP BY 1,2 LIMIT 4", {
        model: models.Invoice,
        raw: true, 
        searchPath: subdomain
      })

      const [countMonth, countStatusMonth] = await Promise.all([countStatusPromise, countMonthPromise])

      return {
        countMonth: countMonth,
        countStatusMonth: countStatusMonth 
      }
    }),

    getProjectTasksData: requiresAuth.createResolver(async (parent, args, { models, subdomain }) => {
      const countStatusPromise = await models.sequelize.query("SELECT count(*), status FROM projects WHERE status='new' OR status='delayed' GROUP BY status", {
        model: models.Project,
        raw: true, 
        searchPath: subdomain
      })

      const idNameStatusPromise = await models.sequelize.query("SELECT status, id, name FROM projects WHERE status='new' OR status='delayed' GROUP BY 1,id", {
        model: models.Project,
        raw: true, 
        searchPath: subdomain
      })

      const [countStatus, idNameStatus] = await Promise.all([countStatusPromise, idNameStatusPromise])
    
      return {
        countStatus,
        idNameStatus
      }
    }),

    getSaleTasksData: requiresAuth.createResolver(async (parent, args, { models, subdomain }) => {
      const countStatusPromise = await models.sequelize.query("SELECT count(*), status FROM sales WHERE status='new' OR status='delayed' GROUP BY status", {
        model: models.Sale,
        raw: true, 
        searchPath: subdomain
      })

      const idNameStatusPromise = await models.sequelize.query("SELECT status, id, name FROM sales WHERE status='new' OR status='delayed' GROUP BY 1,id", {
        model: models.Sale,
        raw: true, 
        searchPath: subdomain
      })

      const [countStatus, idNameStatus] = await Promise.all([countStatusPromise, idNameStatusPromise])
  
      return {
        countStatus,
        idNameStatus
      }
    }),

    getInvoiceTasksData: requiresAuth.createResolver(async (parent, args, { models, subdomain }) => {
      const countStatusPromise = await models.sequelize.query("SELECT count(*), status FROM invoices WHERE status='pending' OR status='overdue' GROUP BY status", {
        model: models.Invoice,
        raw: true, 
        searchPath: subdomain
      })

      const idProjectStatusPromise = await models.sequelize.query("SELECT p.name, invoice.id, invoice.status FROM projects p JOIN invoices invoice ON p.id = invoice.project_id WHERE invoice.status='pending' OR invoice.status='overdue' GROUP BY 1,2", {
        model: models.Project,
        raw: true, 
        searchPath: subdomain
      })

      const idSaleStatusPromise = await models.sequelize.query("SELECT s.name, invoice.id, invoice.status FROM sales s JOIN invoices invoice ON s.id = invoice.sale_id WHERE invoice.status='pending' OR invoice.status='overdue' GROUP BY 1,2", {
        model: models.Sale,
        raw: true, 
        searchPath: subdomain
      })
      
      const [countStatus,  idProjectStatus, idSaleStatus] = await Promise.all([countStatusPromise, idProjectStatusPromise, idSaleStatusPromise])
      console.log('idSaleStatusPromise', idProjectStatus)
      return {
        countStatus,
        idProjectStatus,
        idSaleStatus
      }
    })

  }
}
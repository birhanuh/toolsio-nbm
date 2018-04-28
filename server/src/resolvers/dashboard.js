import { requiresAuth } from '../middlewares/authentication'

let date = new Date()
let firstDayOfLastMonth = new Date(date.getFullYear(), date.getMonth()-1, 1)

export default {
  Query: {
    getTotalIncomeData: async (parent, args, { models }) =>  {
      const paidTasksSumPromise = models.sequelize.query("SELECT SUM(ts.price) FROM tasks ts JOIN invoices invoice ON ts.project_id = invoice.project_id WHERE invoice.status='paid'", {
        model: models.Task,
        raw: true,
      })

      const paidItemsSumPromise = models.sequelize.query("SELECT SUM(it.price) FROM items it JOIN invoices invoice ON it.sale_id = invoice.sale_id WHERE invoice.status='paid'", {
        model: models.Item,
        raw: true,
      })

      const [paidTasksSum, paidItemsSum] = await Promise.all([paidTasksSumPromise, paidItemsSumPromise])
      console.log('paidTasksSum', paidTasksSum)
      
      return {
        tasksTotalSum: paidTasksSum[0].sum,
        itemsTotalSum: paidItemsSum[0].sum
      } 
    },
    
    getProjectsData: async (parent, args, { models }) => {
      // const data = await models.Project.findAll({
      //   group: ['status'],
      //   attributes: ['status', [models.sequelize.fn('COUNT', 'status'), 'count']],
      // }, { raw: true })

      const countStatusPromise = models.sequelize.query('SELECT count(*), status FROM projects GROUP BY status', {
        model: models.Project,
        raw: true
      })

      const countMonthPromise = models.sequelize.query("SELECT to_char(created_at,'Mon') AS mon, extract(year FROM created_at) AS yyyy, count(*) FROM projects GROUP BY 1,2 LIMIT 2", {
        model: models.Project,
        raw: true
      })

      const [countStatus, countMonth] = await Promise.all([countStatusPromise, countMonthPromise])

      return {
        countStatus,
        countMonth 
      }
    },

    getSalesData: async (parent, args, { models }) => {

      const countStatusPromise = models.sequelize.query('SELECT count(*), status FROM sales GROUP BY status', {
        model: models.Sale,
        raw: true
      })

      const countMonthPromise = models.sequelize.query("SELECT to_char(created_at,'Mon') AS mon, extract(year FROM created_at) AS yyyy, count(*) FROM sales GROUP BY 1,2 LIMIT 2", {
        model: models.Sale,
        raw: true
      })

      const [countStatus, countMonth] = await Promise.all([countStatusPromise, countMonthPromise])

      return {
        countStatus,
        countMonth 
      }
    },

    getCustomersData: async (parent, args, { models }) => {

    },

    getInvoicesData: async (parent, args, { models }) => {
      const countStatusPromise = models.sequelize.query("SELECT to_char(created_at,'Mon') AS mon, extract(year FROM created_at) AS yyyy, count(*) FROM invoices GROUP BY 1,2 LIMIT 2", {
        model: models.Invoice,
        raw: true
      })

      const countMonthPromise = models.sequelize.query("SELECT to_char(created_at,'Mon') AS mon, extract(year FROM created_at) AS yyyy, status, count(*) FROM invoices GROUP BY 1,2,3 LIMIT 4", {
        model: models.Invoice,
        raw: true
      })

      const [countMonth, countStatusMonth] = await Promise.all([countStatusPromise, countMonthPromise])

      return {
        countMonth: countMonth,
        countStatusMonth: countStatusMonth 
      }
    },

    getProjectTasksData: async (parent, args, { models }) => {
      const countStatusPromise = await models.sequelize.query("SELECT count(*), status FROM projects WHERE status='new' OR status='delayed' GROUP BY status", {
        model: models.Project,
        raw: true
      })

      const idStatusPromise = await models.sequelize.query("SELECT status, id FROM projects WHERE status='new' OR status='delayed' GROUP BY 1,id", {
        model: models.Project,
        raw: true
      })

      const [countStatus, idStatus] = await Promise.all([countStatusPromise, idStatusPromise])
      console.log('countStatus ', idStatus)
      return {
        countStatus,
        idStatus
      }
    },

    getSaleTasksData: async (parent, args, { models }) => {
      const countStatusPromise = await models.sequelize.query("SELECT count(*), status FROM sales WHERE status='new' OR status='delayed' GROUP BY status", {
        model: models.Sale,
        raw: true
      })

      const idStatusPromise = await models.sequelize.query("SELECT status, id FROM sales WHERE status='new' OR status='delayed' GROUP BY 1,id", {
        model: models.Sale,
        raw: true
      })

      const [countStatus, idStatus] = await Promise.all([countStatusPromise, idStatusPromise])
  
      return {
        countStatus,
        idStatus
      }
    },

    getInvoiceTasksData: async (parent, args, { models }) => {
      const countStatusPromise = await models.sequelize.query("SELECT count(*), status FROM invoices WHERE status='new' OR status='overdue' GROUP BY status", {
        model: models.Invoice,
        raw: true
      })

      const idStatusPromise = await models.sequelize.query("SELECT status, id FROM invoices WHERE status='new' OR status='overdue' GROUP BY 1,id", {
        model: models.Invoice,
        raw: true
      })

      const [countStatus, idStatus] = await Promise.all([countStatusPromise, idStatusPromise])
      
      return {
        countStatus,
        idStatus
      }
    }

  }
}
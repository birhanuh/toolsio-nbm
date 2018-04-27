import { requiresAuth } from '../middlewares/authentication'

let date = new Date()
let firstDayOfLastMonth = new Date(date.getFullYear(), date.getMonth()-1, 1)

export default {
  Query: {
    getTotalIncomeData: async (parent, args, { models }) =>  {

      const data = await models.Task.sum('price', {
        group: 'project.id',
        include: [
        {
          model: models.Project,
          where: { status: 'delivered' },
        }
      ]}, { raw: true }) 

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
        countStatus: countStatus,
        countMonth: countMonth 
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
        countStatus: countStatus,
        countMonth: countMonth 
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

    },

    getSaleTasksData: async (parent, args, { models }) => {

    },

    getInvoiceTasksData: async (parent, args, { models }) => {

    }

  }
}
import { requiresAuth } from '../middlewares/authentication'

let date = new Date()
let firstDayOfLastMonth = new Date(date.getFullYear(), date.getMonth()-1, 1)

export default {
  Query: {
    getTotalIncomeData: async (parent, args, { models }) =>  {

      // const data = await models.Task.sum('price', {
      //   group: 'project.id',
      //   include: [
      //   {
      //     model: models.Project,
      //     where: { status: 'delivered' },
      //   }
      // ]}, { raw: true }) 

      const data = await models.Invoice.sum('price', {
          where: { status: 'delivered' }
        }, { raw: true }) 

      console.log('data', data)
      return {
        data: data ? data : 0
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

      const countMonthPromise = models.sequelize.query("select to_char(created_at,'Mon') as mon, extract(year from created_at) as yyyy, count(*) from projects group by 1,2 limit 2", {
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

      const countMonthPromise = models.sequelize.query("select to_char(created_at,'Mon') as mon, extract(year from created_at) as yyyy, count(*) from sales group by 1,2 limit 2", {
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

    },

  }
}
import Sequelize from "sequelize";

export const customerBatcher = async (customersId, models, subdomain) => {
  const results = await models.Customer.findAll(
    {
      where: { id: { [Sequelize.Op.in]: customersId } },
      searchPath: subdomain
    },
    { raw: true }
  );

  const data = {};

  // group by id
  results.forEach(r => {
    data[r.id] = r;
  });

  return customersId.map(id => data[id]);
};

export const projectBatcher = async (projectsId, models, subdomain) => {
  const results = await models.Project.findAll(
    { where: { id: { [Sequelize.Op.in]: projectsId } }, searchPath: subdomain },
    { raw: true }
  );

  const data = {};

  // group by id
  results.forEach(r => {
    data[r.id] = r;
  });

  return projectsId.map(id => data[id]);
};

export const saleBatcher = async (salesId, models, subdomain) => {
  const results = await models.Sale.findAll(
    { where: { id: { [Sequelize.Op.in]: salesId } }, searchPath: subdomain },
    { raw: true }
  );

  const data = {};

  // group by id
  results.forEach(r => {
    data[r.id] = r;
  });

  return salesId.map(id => data[id]);
};

export const userBatcher = async (usersId, models, subdomain) => {
  const results = await models.User.findAll(
    { where: { id: { [Sequelize.Op.in]: usersId } }, searchPath: subdomain },
    { raw: true }
  );

  const data = {};

  // group by id
  results.forEach(r => {
    data[r.id] = r;
  });

  // [{id: 1, email: 'testa@toolsio.com'}, {}, {}]
  return usersId.map(id => data[id]);
};

export const usersCountBatcher = async (ids, models, subdomain) => {
  const results = await models.User.findAll(
    {
      include: [
        {
          model: models.Channel,
          where: { id: { [Sequelize.Op.in]: ids } },
          searchPath: subdomain
        }
      ]
    },
    { raw: true }
  );

  const data = {};
  console.log("results ", results[0].dataValues.channels);
  // group by channel
  results.forEach(r => {
    if (data[r.id]) {
      data[r.id].push(r);
    } else {
      data[r.id] = [r];
    }
  });
  console.log("data ", data);
  // [[{name: 'general'}], [], []]
  return results;
};

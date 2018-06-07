#! /bin/bash
dropdb toolsio_test
createdb toolsio_test
sequelize db:migrate
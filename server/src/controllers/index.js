import express from 'express'

import ProjectsController from './ProjectsController'
import SalesController from'./SalesController'

module.exports = {
  projects: ProjectsController,
  sales: SalesController,
}
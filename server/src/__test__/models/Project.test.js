// Mongodb connection
import db from '../../db'

// Macros
import Macros from '../helpers/Macros'

// Load factories 
import FactoryGirl from '../factories'

// Schema
import Project from '../../models/Project'

let projectCreated = {}

describe("Project",  () => { 

  beforeAll( (done) => {
    db.connect('mongodb://localhost/toolsio_test')
    done()
  })

  afterAll( (done) => {
    Macros.dropDatabase()
    done()
  })


  it('should fail with validation errors for each required field', (done) => {

    Project.create({}, function(err, project) {
      expect(err).not.toBeNull()
      expect(err.errors.customer.message).toContain('Customer is required.')
      expect(err.errors.name.message).toContain('Name is required.')
      expect(err.errors.deadline.message).toContain('Deadline is required.')
      
      done()
    })
  })

  it('saves Project', (done) => {

    FactoryGirl.create('project').then(project => {
      Project.create(project, function(err, project) {      
        // Assign created Project
        projectCreated = project
       
        expect(project).not.toBeNull()
        expect(project.name).toContain('Project 1')
        expect(project.status).toContain('new')
        expect(project.description).toContain('Description 1...')

        done()
      })
    })
  })

  it('finds Project', (done) => { 

    Project.findById(projectCreated._id, (error, project) => {
      expect(project).not.toBeNull()

      done()
    })
  })

  it('updates Project', (done) => { 

    // Update name
    projectCreated.name = 'Project 1 updated'
    
    Project.findByIdAndUpdate(projectCreated._id, projectCreated, {new: true}, (error, project) => {
      expect(project.name).toContain('Project 1 updated')

      done()
    })
  })

  it('deletes Project', (done) => { 

    Project.findByIdAndRemove(projectCreated._id, (error, project) => {
      expect(project).not.toBeNull()

      done()
    })
  })

})

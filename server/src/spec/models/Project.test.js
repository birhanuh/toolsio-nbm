// Mongodb connecton
import db from '../../db'

// Load factories 
import FactoryGirl from '../factories'

// Schema
import Project from '../../models/Project'

// Factored Project
let project = FactoryGirl.create('project')

let projectId = null

describe("Project", function() { 

  beforeAll(function() {
    db.connect('mongodb://localhost/toolsio_test')
  })

  afterAll(function() {
    db.drop()
  })


  it('should fail with validation errors for each required field', function(done) {

    Project.create({}, function(err, project) {
      expect(err).not.toBeNull()
      expect(err.errors.customer.message).toContain('Customer is required.')
      expect(err.errors.name.message).toContain('Name is required.')
      expect(err.errors.deadline.message).toContain('Deadline is required.')
      
      done()
    })
  })

  it('saves Project', function(done) {

    Project.create(project, function(err, project) {      
      // Assign id
      projectId = project._id
     
      expect(project).not.toBeNull()
      expect(project.name).toContain('Project 1')
      expect(project.status).toContain('new')
      expect(project.description).toContain('Description 1...')

      done()
    })
  })

  it('finds Project', function(done) { 

    Project.findById(projectId, project, function(error, project) {
      expect(project).not.toBeNull()

      done()
    })
  })

  it('updates Project', function(done) { 

    // Update name
    project.name = 'Project 1 updated'
    
    Project.findByIdAndUpdate(projectId, project, {new: true}, function(error, project) {
      expect(project.name).toContain('Project 1 updated')

      done()
    })
  })

  it('deletes Project', function(done) { 

    Project.findByIdAndRemove(projectId, project, function(error, project) {
      expect(project).not.toBeNull()

      done()
    })
  })

})

// Mongodb connecton
import db from '../../db'

// Load factories 
import FactoryGirl from '../factories'

// Schema
import Task from '../../models/Task'

// Factored Task
let task = FactoryGirl.create('task')

let taskId = null

describe("Task", function() { 

  beforeAll(() => {
    db.connect('mongodb://localhost/toolsio_test')
  })

  afterAll(() => {
    db.drop()
  })


  it('should fail with validation errors for each required field', (done) => {

    Task.create({}, function(err, task) {      
      expect(err).not.toBeNull()
      expect(err.errors.name.message).toContain('Name is required.')
      expect(err.errors.paymentType.message).toContain('Payment type is required.')

      done()
    })
  })

  it('saves Task', (done) => {
    
    Task.create(task, (err, task) => {      
      // Assign id
      taskId = task._id
 
      expect(task).not.toBeNull()
      expect(task.name).toContain('Task 1')
      expect(task.paymentType).toContain('Per hour')
      expect(task.price).toBe(20)

      done()
    })
  })

  it('finds Task', (done) => { 

    Task.findById(taskId, task, (error, task) => {
      expect(task).not.toBeNull()

      done()
    })
  })

  it('updates Task', (done) => { 

    // Update name
    task.name = 'Task 1 updated'
    
    Task.findByIdAndUpdate(taskId, task, {new: true}, (error, task) => {      
      expect(task.name).toContain('Task 1 updated')

      done()
    })
  })

  it('deletes Task', (done) => { 

    Task.findByIdAndRemove(taskId, task, (error, task) => {
      expect(task).not.toBeNull()
      
      done()
    })
  })

})

// Mongodb connection
import db from '../../db'

// Macros
import Macros from '../helpers/macros'

// Load factories 
import FactoryGirl from '../factories'

// Schema
import Task from '../../models/task'

let taskCreated = {}

describe("Task", () => { 

  beforeAll((done) => {
    db.connect(process.env.DB_HOST+process.env.DB_TEST)
    done()
  })

  afterAll((done) => {
    Macros.clean('tasks')
    done()
  })


  it('should fail with validation errors for each required field', (done) => {

    Task.create({}, (err, task) => {      
      expect(err).not.toBeNull()
      expect(err.errors.name.message).toContain('Name is required.')
      expect(err.errors.paymentType.message).toContain('Payment type is required.')

      done()
    })
  })

  it('saves Task', (done) => {
    
    FactoryGirl.create('task').then(task => {

      Task.create(task, (err, task) => {      
        // Assign the new created Task
        taskCreated = task
   
        expect(task).not.toBeNull()
        expect(task.name).toContain('Task 1')
        expect(task.paymentType).toContain('Per hour')
        expect(task.price).toBe(20)

        done()
      })
    })
    
  })

  it('finds Task', (done) => { 

    Task.findById(taskCreated._id, (error, task) => {
      expect(task).not.toBeNull()

      done()
    })
  })

  it('updates Task', (done) => { 
    
    // Update name
    taskCreated.name = 'Task 1 updated'

    Task.findByIdAndUpdate(taskCreated._id, taskCreated, {new: true}, (error, task) => {      
      expect(task.name).toContain('Task 1 updated')

      done()
    })
  
  })

  xit('deletes Task', (done) => { 

    Task.findByIdAndRemove(taskCreated._id, (error, task) => {
      expect(task).not.toBeNull()
      
      done()
    })  
  })

})

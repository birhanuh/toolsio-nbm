import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

// Actions 
import { 
  fetchProjects, addProject, setProjects, projectFetched, projectUpdated, projectDeleted, addTask
} from '../../actions/projectActions'
import * as types from '../../actions/types'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe("actoins", () => { 

  test('should create an action to add a Project', () => {
    const project = {}
    const expectedAction = {
      type: types.ADD_PROJECT,
      project
    }
    expect(addProject(project)).toEqual(expectedAction)
  })  

  test('should create an action to set Projects', () => {
    const projects = []
    const expectedAction = {
      type: types.SET_PROJECTS,
      projects
    }
    expect(setProjects(projects)).toEqual(expectedAction)
  })  

  test('should create an action to update a Project', () => {
    const project = {}
    const expectedAction = {
      type: types.PROJECT_UPDATED,
      project
    }
    expect(projectUpdated(project)).toEqual(expectedAction)
  })  

  test('should create an action to create a Task', () => {
    const task = {}
    const expectedAction = {
      type: types.ADD_TASK,
      task
    }
    expect(addTask(task)).toEqual(expectedAction)
  })  

  // Async Action Creator
  it('should excute fetchProjects()', () => {
    
    const store = mockStore({})

    // Return the promise
    return store.dispatch(fetchProjects())
      .then(() => {
        const actions = store.getActions()
        expect(actions[0]).toEqual(setProjects())
      })
  })
  
})

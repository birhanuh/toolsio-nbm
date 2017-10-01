import reducer from '../../reducers/projects'
import * as types from '../../actions/types'

// Factories
import { Projects, Project, Project2 } from '../factories'

describe("project reducer", function() { 

  it('should handle ADD_PROJECT', () => {

    expect(
      reducer([Project], {
        type: types.ADD_PROJECT,
        project: Project2
      })
    ).toEqual([
      Project,
      Project2
    ])
  })  

  it('should handle SET_PROJECTS', () => {

    expect(
      reducer([], {
        type: types.SET_PROJECTS,
        projects: Projects
      })
    ).toEqual(
      Projects
    )
  }) 
  
  it('should handle PROJECT_UPDATED', () => {

    const projectUpdated = { _id: 1, name: 'Project 1 updated', deadline: new Date().toDateString(),
            status: 'new', description: 'Project 1 description updated...'  }

    expect(
      reducer([Project], {
        type: types.PROJECT_UPDATED,
        project: projectUpdated
      })
    ).toEqual([
      projectUpdated
    ])
  }) 

  it('should handle PROJECT_FETCHED', () => {

    expect(
      reducer(Projects, {
        type: types.PROJECT_FETCHED,
        project: Project
      })
    ).toEqual(
      Projects
    )
  }) 

  it('should handle PROJECT_DELETED', () => {
  
    expect(
      reducer(Projects, {
        type: types.PROJECT_DELETED,
        projectId: Project._id
      })
    ).toEqual([
      Project2
    ])
  }) 

})

import reducer from '../../reducers/projects'
import * as types from '../../actions/types'

// Project store mocks
const project = {
  _id: 1,
  name: 'Project 1',
  deadline: new Date().toDateString(),
  status: 'new',
  description: 'Project 1 description...' 
}

const projects = [{
  _id: 1,
  name: 'Project 1',
  deadline: new Date().toDateString(),
  status: 'new',
  description: 'Project 1 description...' 
},
{
  _id: 2,
  name: 'Project 2',
  deadline: new Date().toDateString(),
  status: 'new',
  description: 'Project 2 description...' 
}]

describe("project reducer", function() { 

  it('should handle ADD_PROJECT', () => {

    expect(
      reducer([project], {
        type: types.ADD_PROJECT,
        project: project
      })
    ).toEqual([
      {
        _id: 1,
        name: 'Project 1',
        deadline: new Date().toDateString(),
        status: 'new',
        description: 'Project 1 description...' 
      },
      project
    ])
  })  

  it('should handle SET_PROJECTS', () => {

    expect(
      reducer([], {
        type: types.SET_PROJECTS,
        projects: projects
      })
    ).toEqual(
      projects
    )
  }) 
  
  it('should handle PROJECT_UPDATED', () => {

    const projectUpdated = { _id: 1, name: 'Project 1 updated', deadline: new Date().toDateString(),
            status: 'new', description: 'Project 1 description updated...'  }

    expect(
      reducer([project], {
        type: types.PROJECT_UPDATED,
        project: projectUpdated
      })
    ).toEqual([
      projectUpdated
    ])
  }) 

  it('should handle PROJECT_FETCHED', () => {

    expect(
      reducer(projects, {
        type: types.PROJECT_FETCHED,
        project: project
      })
    ).toEqual([
      {
        _id: 1,
        name: 'Project 1',
        deadline: new Date().toDateString(),
        status: 'new',
        description: 'Project 1 description...' 
      },
      {
        _id: 2,
        name: 'Project 2',
        deadline: new Date().toDateString(),
        status: 'new',
        description: 'Project 2 description...' 
      }
    ])
  }) 

  it('should handle PROJECT_DELETED', () => {
  
    expect(
      reducer(projects, {
        type: types.PROJECT_DELETED,
        projectId: project._id
      })
    ).toEqual([
      {
        _id: 2,
        name: 'Project 2',
        deadline: new Date().toDateString(),
        status: 'new',
        description: 'Project 2 description...' 
      }
    ])
  }) 

})

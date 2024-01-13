// state of tasks
export const state = () => ({
  list: [] // Array to store the list of tasks
})

// retrieve state properties
export const getters = {
  list: state => state.list // retrieve the list of tasks
}

// directly modify the state
export const mutations = {
  // set the entire list of tasks
  SET_LIST(state, data) {
    state.list = data
  },
  // insert a new task into the list
  INSERT(state, data) {
    state.list.push(data)
  },
  // update an existing task in the list
  UPDATE(state, data) {
    const listIndex = state.list.map(l => l.id).indexOf(data.id)
    state.list.splice(listIndex, 1, data)
  },
  // delete multiple tasks based on their IDs
  BULK_DELETE(state, data) {
    for (let i = state.list.length - 1; i >= 0; i--) {
      if (data.includes(state.list[i].id)) {
        state.list.splice(i, 1);
      }
    }
  },
  // delete a specific task based on its ID
  DELETE(state, data) {
    const listIndex = state.list.map(l => l.id).indexOf(data.id)
    state.list.splice(listIndex, 1)
  },
  // delete all tasks in the list
  DELETE_ALL(state) {
    state.list.splice(0)
  },
}

// Actions module
export const actions = {
  // fetch and initialize the tasks from localStorage
  paginate({ commit }) {
    const data = JSON.parse(localStorage.getItem('tasks'))
    commit('SET_LIST', data ? data : [])
    return data
  },

  // save a new task to the list
  save({ commit }, model) {
    commit('INSERT', model)
    localStorage.setItem('tasks', JSON.stringify(this.getters['tasks/list']))
    return model
  },

  // delete a specific task from the list
  destroy({ commit }, model) {
    commit('DELETE', model)
    localStorage.setItem('tasks', JSON.stringify(this.getters['tasks/list']))
    return model
  },

  // toggle the 'status' property of a task
  tagAsDone({ commit }, model) {
    commit('UPDATE', {
      id: model.id,
      name: model.name,
      status: model.status ? false : true
    })
    return model
  },

  // remove all tasks with 'status' set to true
  removeAllTagAsDone({ commit }, model) {
    commit('BULK_DELETE', model)
    localStorage.setItem('tasks', JSON.stringify(this.getters['tasks/list']))
    return model
  },

  // remove all tasks from the list
  removeAllTasks({ commit }, model) {
    commit('DELETE_ALL')
    localStorage.setItem('tasks', JSON.stringify(this.getters['tasks/list']))
    return model
  },
}
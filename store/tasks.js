export const state = () => ({
  list: []
})

export const getters = {
  list: state => state.list
}

export const mutations = {
  SET_LIST (state, data) {
    state.list = data
  },
  INSERT (state, data) {
    state.list.push(data)
  },
	UPDATE (state, data) {
    const listIndex = state.list.map(l => l.id).indexOf(data.id)

    state.list.splice(listIndex, 1, data)
  },
	BULK_DELETE (state, data) {
		for (let i = state.list.length - 1; i >= 0; i--) {
			if (data.includes(state.list[i].id)) {
				state.list.splice(i, 1);
			}
		}
  },
	DELETE (state, data) {
    const listIndex = state.list.map(l => l.id).indexOf(data.id)

    state.list.splice(listIndex, 1)
  },
	DELETE_ALL (state) {
    state.list.splice(0)
  },
}

export const actions = {
	paginate ({ commit }) {
		const data = JSON.parse(localStorage.getItem('tasks'))

    commit('SET_LIST', data ? data : [])

    return data
  },

  save ({ commit }, model) {
		commit('INSERT', model)
		
		localStorage.setItem('tasks', JSON.stringify(this.getters['tasks/list']))

    return model
  },

	destroy ({ commit }, model) {
		commit('DELETE', model)
		
		localStorage.setItem('tasks', JSON.stringify(this.getters['tasks/list']))

    return model
  },

	tagAsDone ({ commit }, model) {

		commit('UPDATE', {
			id: model.id,
			name: model.name,
			status: model.status ? false : true
		})
		
		return model
	},

	removeAllTagAsDone ({ commit }, model) {
		commit('BULK_DELETE', model)

		localStorage.setItem('tasks', JSON.stringify(this.getters['tasks/list']))
		
		return model
	},

	removeAllTasks ({ commit }, model) {
		commit('DELETE_ALL')

		localStorage.setItem('tasks', JSON.stringify(this.getters['tasks/list']))
		
		return model
	},
}

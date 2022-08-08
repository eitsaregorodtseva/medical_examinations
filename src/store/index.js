import { createStore, storeKey } from 'vuex'

export default createStore({
  state: {
    chosenOrganization: null
  },
  mutations: {
    chooseOrganization(state, val) {
      state.chosenOrganization = val
    }
  },
  actions: {
  },
  modules: {
  }
})

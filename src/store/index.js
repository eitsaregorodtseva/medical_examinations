// import { createStore } from 'vuex';
// import createPersistedState from "vuex-persistedstate";


// export default createStore({
//   state: {
//     chosenOrganization: null,
//     user: {
//         id: null, 
//         role: null, 
//         organization_id: null, 
//         el_signature: null
//     }
//   },
//   mutations: {
//     user(state) {
//       state.user = {
//         id: sessionStorage.getItem('user_id'), 
//         role: sessionStorage.getItem('user_role'), 
//         organization_id: sessionStorage.getItem('user_organization_id'), 
//         el_signature: sessionStorage.getItem('user_el_signature')
//       }
//     },
//     chooseOrganization(state, val) {
//       state.chosenOrganization = val
//     }
//   },
//   actions: {
//   },
//   modules: {
//   },
//   plugins: [createPersistedState()]
// })

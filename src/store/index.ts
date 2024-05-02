import { createStore } from 'vuex';

interface WarboxItemState {
  items: any[];
}

export default createStore({
  state: (): WarboxItemState => ({
    items: [],
  }),
  mutations: {
    addItem(state, item) {
      state.items.push(item);
    },
    removeItem(state, index) {
      state.items.splice(index, 1);
    },
  },
  actions: {
    addItem({ commit }, item) {
      commit('addItem', item);
    },
    removeItem({ commit }, index) {
      commit('removeItem', index);
    },
  },
});

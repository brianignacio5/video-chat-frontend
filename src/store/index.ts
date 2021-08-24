import Vue from "vue";
import Vuex, { ActionTree, MutationTree } from "vuex";

Vue.use(Vuex);

interface ChatState {
  messages: { [key: string]: string };
  users: string[];
}

const chatState: ChatState = {
  messages: {},
  users: [],
};

const mutations: MutationTree<ChatState> = {};

const actions: ActionTree<ChatState, any> = {
  socket_addUsers(context, payload) {
    context.state.users = payload.users;
  },
};

export default new Vuex.Store({
  state: chatState,
  mutations,
  actions,
  modules: {},
});

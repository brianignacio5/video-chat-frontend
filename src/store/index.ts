import Vue from "vue";
import Vuex, { ActionTree, MutationTree } from "vuex";
import { IMessage } from "./types";

Vue.use(Vuex);

interface ChatState {
  messages: IMessage[];
  users: string[];
}

const chatState: ChatState = {
  messages: [
    { content: "some", userId: "user 1", id: "1" },
    { content: "another", userId: "user 2", id: "2" },
    { content: "else", userId: "user 2", id: "2" },
    { content: "some", userId: "user 1", id: "1" },
    { content: "another", userId: "user 2", id: "2" },
    { content: "else", userId: "user 2", id: "2" },
  ],
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

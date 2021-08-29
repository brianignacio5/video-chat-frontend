import Vue from "vue";
import Vuex, { ActionTree, MutationTree } from "vuex";
import { IMessage, IUser } from "./types";
import { errHandler } from "./utils";

Vue.use(Vuex);

interface ChatState {
  answersFrom: { [key: string]: boolean };
  constrains: { video: boolean; audio: boolean };
  messages: IMessage[];
  myself: IUser;
  peerConnection: RTCPeerConnection;
  users: IUser[];
  usernameSelected: boolean;
}

const chatState: ChatState = {
  answersFrom: {},
  constrains: { video: true, audio: true },
  myself: { id: "", name: "" },
  messages: [],
  peerConnection: new RTCPeerConnection(),
  users: [],
  usernameSelected: false,
};

const mutations: MutationTree<ChatState> = {
  setNewAnswerFrom(state, socketId: string) {
    const newState = state;
    newState.answersFrom[socketId] = true;
    Object.assign(state, newState);
  },
  setUsernameSelected(state, isSelected: boolean) {
    const newState = state;
    newState.usernameSelected = isSelected;
    Object.assign(state, newState);
  },
};

const actions: ActionTree<ChatState, any> = {
  socket_addUsers(context, payload) {
    const users = payload.users as IUser[];
    for (const u of users) {
      const existingUser = context.state.users.find((user) => user.id === u.id);
      if (!existingUser) {
        context.state.users.push(u);
      }
    }
  },
  socket_connectError(context, err) {
    console.log(err);
    if (err.message === "invalid username") {
      context.state.usernameSelected = false;
    }
  },
  socket_messageFromServer(context, payload) {
    console.log(payload.message);
    context.state.messages.push(payload.message);
  },
  socket_myUserInfo(context, payload: IUser) {
    context.state.myself = payload;
  },
  socket_removeUser(context, id) {
    const newUsers = context.state.users.filter((user) => {
      return user.id !== id;
    });
    context.state.users = newUsers;
  },
  async getOffer(context, id: string) {
    const offer = await context.state.peerConnection.createOffer();
    await context.state.peerConnection.setLocalDescription(
      new RTCSessionDescription(offer)
    );
    return offer;
  },
  async getUserMedia(context) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(
        context.state.constrains
      );
      console.log(stream);
      const video = document.getElementById("local-video") as HTMLVideoElement;
      if (video) {
        video.srcObject = stream;
      }
      stream.getTracks().forEach((track) => {
        context.state.peerConnection.addTrack(track, stream);
      });
    } catch (error) {
      errHandler(error);
    }
  },
};

export default new Vuex.Store({
  state: chatState,
  mutations,
  actions,
  modules: {},
});

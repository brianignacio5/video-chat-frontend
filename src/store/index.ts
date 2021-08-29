import Vue from "vue";
import Vuex, { ActionTree, MutationTree } from "vuex";
import { IMessage, IUser } from "./types";
import { errHandler } from "./utils";

Vue.use(Vuex);

interface ChatState {
  answersFrom: { [key: string]: boolean };
  constrains: { video: boolean; audio: boolean };
  displayName: string;
  messages: IMessage[];
  peerConnection: RTCPeerConnection;
  users: IUser[];
}

const chatState: ChatState = {
  answersFrom: {},
  constrains: { video: true, audio: true },
  displayName: "",
  messages: [
    { content: "some", userId: "user 1", id: "1" },
    { content: "another", userId: "user 2", id: "2" },
    { content: "else", userId: "user 2", id: "3" },
    { content: "some", userId: "user 1", id: "4" },
    { content: "another", userId: "user 2", id: "5" },
    { content: "else", userId: "user 2", id: "6" },
  ],
  peerConnection: new RTCPeerConnection(),
  users: [
    { id: "dsfrf34rk3", displayName: "user1" },
    { id: "reg3r34g45", displayName: "user2" },
  ],
};

const mutations: MutationTree<ChatState> = {
  setDisplayName(state, newDisplayName) {
    const newState = state;
    newState.displayName = newDisplayName;
    Object.assign(state, newState);
  },
  setNewAnswerFrom(state, socketId: string) {
    const newState = state;
    newState.answersFrom[socketId] = true;
    Object.assign(state, newState);
  },
};

const actions: ActionTree<ChatState, any> = {
  socket_addUsers(context, payload) {
    const userArr = payload.users as string[];
    context.state.users = userArr.map((u) => {
      return { id: u, displayName: "" } as IUser;
    });
  },
  socket_messageFromServer(context, payload) {
    context.state.messages.push(payload.message);
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
      console.log(stream)
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

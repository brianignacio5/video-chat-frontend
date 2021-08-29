<template>
  <div id="users-container" class="flex flex-col m-2 overflow-y-auto h-1/3">
    <h4 class="text-2xl font-bold my-2">Users</h4>
    <ul>
      <li
        v-for="user in users"
        :key="user.id"
        class="my-1 hover:text-red-500"
        @click="createOffer(user.id)"
      >
        {{ user.id }} : {{ user.displayName }}
      </li>
    </ul>
    <label for="displayName">Set name in chat</label>
    <input
      type="text"
      name="displayName"
      id=""
      class="
        rounded-xl
        border border-transparent
        focus:ring-4 focus:ring-blue-600
        text-xs
        p-3
        mx-1
        text-black
      "
    />
  </div>
</template>

<script lang="ts">
import { errHandler } from "@/store/utils";
import { Component, Vue } from "vue-property-decorator";
import { Action, Mutation, State } from "vuex-class";
import { Socket } from "vue-socket.io-extended";

@Component
export default class Users extends Vue {
  @Action getOffer!: (userId: string) => Promise<any>;
  @Mutation setDisplayName!: (newVal: string) => void;
  @Mutation setNewAnswerFrom!: (socketId: string) => void;
  @State("users") storeUsers!: { [key: string]: string };
  @State("displayName") storeDisplayName!: string;
  @State("peerConnection") storePeerConnection!: RTCPeerConnection;
  @State("answersFrom") storeAnswersFrom!: { [key: string]: boolean };

  get displayName() {
    return this.storeDisplayName;
  }

  set displayName(newVal: string) {
    this.setDisplayName(newVal);
  }

  get users() {
    return this.storeUsers;
  }

  async createOffer(id: string) {
    try {
      const offer = await this.getOffer(id);
      this.$socket.client.emit("makeOffer", {
        offer: offer,
        to: id,
      });
    } catch (error) {
      errHandler(error);
    }
  }

  @Socket()
  async answerMade(payload: { answer: any; socket: string }) {
    try {
      await this.storePeerConnection.setRemoteDescription(
        new RTCSessionDescription(payload.answer)
      );
      document
        .getElementById(payload.socket)
        ?.setAttribute("class", "text-bold");
      if (!this.storeAnswersFrom[payload.socket]) {
        await this.createOffer(payload.socket);
        this.setNewAnswerFrom(payload.socket);
      }
    } catch (error) {
      errHandler(error);
    }
  }

  @Socket()
  async offerMade(payload: { offer: any; socket: string }) {
    try {
      await this.storePeerConnection.setRemoteDescription(
        new RTCSessionDescription(payload.offer)
      );
      const answer = await this.storePeerConnection.createAnswer();
      await this.storePeerConnection.setLocalDescription(
        new RTCSessionDescription(answer)
      );
      this.$socket.client.emit("makeAnswer", {
        answer: answer,
        to: payload.socket,
      });
    } catch (error) {
      errHandler(error);
    }
  }
}
</script>

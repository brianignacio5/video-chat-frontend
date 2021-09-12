<template>
  <div id="users-container" class="flex flex-col overflow-y-auto h-full">
    <h4 class="text-2xl font-bold my-4">Users</h4>
    <ul>
      <li
        v-for="user in users"
        :key="user.id"
        class="my-1 p-2 mx-8 bg-white rounded-xl text-black hover:text-red-500"
        @click="createOffer(user.id)"
      >
        {{ user.id }} : {{ user.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { errHandler } from "@/store/utils";
import { Component, Vue } from "vue-property-decorator";
import { Action, Mutation, State } from "vuex-class";
import { Socket } from "vue-socket.io-extended";
import { IUser } from "@/store/types";

@Component
export default class Users extends Vue {
  @Action getOffer!: (userId: string) => Promise<any>;
  @Mutation setNewAnswerFrom!: (socketId: string) => void;
  @Mutation setSelectedRemoteUser!: (userId: string) => void;
  @State("users") storeUsers!: IUser[];
  @State("peerConnection") storePeerConnection!: RTCPeerConnection;
  @State("answersFrom") storeAnswersFrom!: { [key: string]: boolean };

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
      this.setSelectedRemoteUser(id);
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

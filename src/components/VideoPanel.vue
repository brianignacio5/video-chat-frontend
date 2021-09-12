<template>
  <div class="flex flex-1 flex-col justify-items-stretch items-stretch h-full">
    <div class="m-4 h-1/2 flex flex-col justify-items-center items-center">
      <video
        autoplay
        class="rounded-xl shadow-md bg-gray-500 h-56 w-full"
        id="remote-video"
      ></video>
      <p class="m-1">{{ anotherUser.name }}</p>
    </div>
    <div class="m-4 h-1/2 flex flex-col justify-items-center">
      <video
        class="rounded-xl shadow-md bg-red-800 h-56 w-full"
        muted
        autoplay
        id="local-video"
      ></video>
      <p class="m-1">{{ myself.name }} (You)</p>
    </div>
    <div>
      <button
        @click="createOffer(anotherUser.id)"
        class="border border-gray-500 rounded-xl m-2 p-2 hover:border-green-600"
      >
        Start video
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Users from "@/components/Users.vue";
import { Action, Mutation, State } from "vuex-class";
import { errHandler } from "@/store/utils";
import { IUser } from "@/store/types";
import { Socket } from "vue-socket.io-extended";

@Component({
  components: {
    Users,
  },
})
export default class VideoPanel extends Vue {
  @Action getUserMedia!: () => void;
  @Action getOffer!: (userId: string) => Promise<any>;
  @Mutation setNewAnswerFrom!: (socketId: string) => void;
  @State("answersFrom") storeAnswersFrom!: { [key: string]: boolean };
  @State("myself") storeMyself!: IUser;
  @State("peerConnection") storePeerConnection!: RTCPeerConnection;
  @State("selectedRemoteUser") storeSelectedRemoteUser!: IUser;

  get myself() {
    return this.storeMyself;
  }

  get anotherUser() {
    if (this.storeSelectedRemoteUser && this.storeSelectedRemoteUser.id) {
      return this.storeSelectedRemoteUser;
    }
    return { id: "", name: "default" };
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

  mounted() {
    this.storePeerConnection.ontrack = function ({ streams: [stream] }) {
      const remoteVideo = document.getElementById(
        "remote-video"
      ) as HTMLVideoElement;
      if (remoteVideo) {
        remoteVideo.srcObject = stream;
      }
    };
    this.getUserMedia();
    if (this.myself && this.myself.name) {
      this.$socket.client.emit("sendTxtMsg", {
        message: `${this.storeMyself.name} has joined the chat.`,
        from: this.storeMyself,
        to: this.anotherUser.id,
      });
    }
  }
}
</script>

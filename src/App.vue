<template>
  <div id="app" class="max-h-full h-full w-full bg-blue-900">
    <div class="flex flex-col sm:flex-row flex-wrap justify-items-center">
      <div class="flex flex-1 flex-col justify-items-stretch items-strech">
        <div class="m-4 h-1/3">
          <video
            autoplay
            class="rounded-xl shadow-md bg-gray-500 h-56 w-full m-auto"
            id="remote-video"
          ></video>
        </div>
        <Users />
        <div class="m-4 h-1/3">
          <video
            class="rounded-xl shadow-md bg-red-800 h-56 w-full m-auto"
            muted
            autoplay
            id="local-video"
          ></video>
        </div>
      </div>
      <div class="flex flex-1 flex-col h-screen justify-items-center">
        <div
          class="
            flex flex-col
            items-center
            rounded-xl
            bg-red-800 bg-opacity-90
            p-2
            m-4
            h-full
          "
        >
          <div class="flex-grow overflow-y-auto m-1 w-full">
            <Message :message="msg" v-for="msg in messages" :key="msg.id" />
          </div>
          <input
            type="text"
            placeholder="enter new message.."
            name=""
            v-model="currMsg"
            id="new-msg"
            class="
              rounded-xl
              border border-transparent
              focus:ring-4 focus:ring-blue-600
              text-xs text-black
              w-full
              p-3
              space-x-4
              mx-1
            "
            @keyup.enter="sendMessage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Action, State } from "vuex-class";
import Message from "@/components/Message.vue";
import Users from "@/components/Users.vue";
import { IMessage } from "./store/types";

@Component({
  components: {
    Message,
    Users,
  },
})
export default class App extends Vue {
  @Action sendMsg!: () => void;
  @Action getUserMedia!: () => void;
  @State("displayName") storeDisplayName!: string;
  @State("messages") storeMessages!: IMessage;
  @State("peerConnection") storePeerConnection!: RTCPeerConnection;
  private currMsg = "";

  get messages() {
    return this.storeMessages;
  }

  public sendMessage() {
    this.sendMsg();
    this.$socket.client.emit("sendTxtMsg", {
      message: this.currMsg,
      from: this.storeDisplayName,
    });
    this.currMsg = "";
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
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
}
</style>

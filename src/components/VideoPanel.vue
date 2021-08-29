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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Users from "@/components/Users.vue";
import { Action, State } from "vuex-class";
import { IUser } from "@/store/types";

@Component({
  components: {
    Users,
  },
})
export default class VideoPanel extends Vue {
  @Action getUserMedia!: () => void;
  @State("peerConnection") storePeerConnection!: RTCPeerConnection;
  @State("myself") storeMyself!: IUser;
  @State("users") storeUsers!: IUser[];

  get myself() {
    return this.storeMyself;
  }
  
  get anotherUser() {
    if (this.storeUsers && this.storeUsers.length) {
      return this.storeUsers[0];
    }
    return { id: "", name: "default" };
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

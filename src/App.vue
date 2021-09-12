<template>
  <div id="app" class="h-screen w-screen bg-blue-900">
    <SelectUsername v-if="!usernameSelected" />
    <Users v-if="usernameSelected && !selectedRemoteUser.id" />
    <div
      class="flex flex-col sm:flex-row flex-wrap justify-items-center"
      v-else
    >
      <VideoPanel />
      <ChatPanel />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State } from "vuex-class";
import ChatPanel from "@/components/ChatPanel.vue";
import VideoPanel from "@/components/VideoPanel.vue";
import Users from "@/components/Users.vue";
import SelectUsername from "@/components/SelectUsername.vue";
import { IUser } from "./store/types";

@Component({
  components: {
    ChatPanel,
    VideoPanel,
    SelectUsername,
    Users,
  },
})
export default class App extends Vue {
  @State("usernameSelected") storeUsernameSelected!: boolean;
  @State("selectedRemoteUser") storeSelectedRemoteUser!: IUser;

  get usernameSelected() {
    return this.storeUsernameSelected;
  }

  get selectedRemoteUser() {
    return this.storeSelectedRemoteUser;
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

<template>
  <div id="app" class="h-screen w-screen bg-blue-900">
    <SelectUsername v-if="!usernameSelected" />
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
import SelectUsername from "@/components/SelectUsername.vue";

@Component({
  components: {
    ChatPanel,
    VideoPanel,
    SelectUsername,
  },
})
export default class App extends Vue {
  @State("usernameSelected") storeUsernameSelected!: boolean;

  get usernameSelected() {
    return this.storeUsernameSelected;
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

<template>
  <div id="app">
    <div class="container">
      <div class="flex">
        <video
          autoplay
          class="rounded-xl shadow-md w-3/12 h-3/12 bg-gray-500 m-5"
          id="remote-video"
        ></video>
        <div class="flex-1 bg-blue-300 m-5 max-w-lg max-h-32">
          <div
            class="
              p-3
              m-3
              max-w-sm
              mx-auto
              flex
              items-center
              space-x-4
              bg-white
              rounded-xl
              shadow-md
            "
          >
            <div class="flex-shrink-0">
              <img src="./assets/user.png" alt="avatar" class="h-8 w-8" />
            </div>
            <div>
              <div class="text-left text-md font-medium text-black">User</div>
              <p class="text-gray-500">Message 1</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <video
      class="
        rounded-xl
        shadow-md
        w-3/12
        h-3/12
        bg-red-300
        absolute
        bottom-0
        right-0
        m-5
      "
      muted
      autoplay
      id="local-video"
    ></video>
    <div id="users-container">
      <h4>Users</h4>
      <ul>
        <li v-for="(item, key) in users" :key="key">
          {{ key }} with {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State } from "vuex-class";
@Component
export default class App extends Vue {
  @State("users") storeUsers!: { [key: string]: string };

  get users() {
    console.log(this.storeUsers);
    return this.storeUsers;
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

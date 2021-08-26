<template>
  <div id="users-container" class="m-2 overflow-y-auto h-1/3">
    <h4 class="text-2xl font-bold my-2">Users</h4>
    <ul>
      <li class="my-1 hover:text-red-500">User 1</li>
      <li>User 2</li>
      <li
        v-for="(item, key) in users"
        :key="key"
        class="my-1 hover:text-red-500"
      >
        {{ key }} with {{ item }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State } from "vuex-class";

@Component
export default class Users extends Vue {
  @State("users") storeUsers!: { [key: string]: string };

  get users() {
    return this.storeUsers;
  }
}
</script>

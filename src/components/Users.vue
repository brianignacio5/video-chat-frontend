<template>
  <div id="users-container" class="flex flex-col overflow-y-auto h-full">
    <h4 class="text-2xl font-bold my-4">Users</h4>
    <ul>
      <li
        v-for="user in users"
        :key="user.id"
        class="my-1 p-2 mx-8 bg-white rounded-xl text-black hover:text-red-500"
        @click="setSelectedRemoteUser(user.id)"
      >
        {{ user.id }} : {{ user.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Mutation, State } from "vuex-class";
import { IUser } from "@/store/types";

@Component
export default class Users extends Vue {
  @Mutation setSelectedRemoteUser!: (userId: string) => void;
  @State("users") storeUsers!: IUser[];
  @State("peerConnection") storePeerConnection!: RTCPeerConnection;

  get users() {
    return this.storeUsers;
  }
}
</script>

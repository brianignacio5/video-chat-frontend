<template>
  <form
    @submit.prevent="onSubmit"
    class="flex flex-col items-center justify-center w-4/5 h-full m-auto"
  >
    <input
      type="text"
      name="username"
      id="self-username"
      v-model="username"
      placeholder="Enter username"
      class="
        rounded-xl
        border border-transparent
        focus:ring-4 focus:ring-red-600
        text-xs text-black
        w-full
        p-3
        m-4
      "
    />
    <button
      :disabled="!isValid"
      class="border border-gray-500 rounded-xl p-2 hover:border-green-600"
    >
      Enter chat room
    </button>
  </form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Mutation } from "vuex-class";

@Component
export default class SelectUsername extends Vue {
  @Mutation setUsernameSelected!: (isSelected: boolean) => void;
  username = "";

  get isValid() {
    return (
      this.username.trim().length > 2 &&
      this.username.trim().indexOf(" ") === -1
    );
  }

  onSubmit() {
    this.setUsernameSelected(true);
    this.$socket.client.auth = { username: this.username.trim() };
    this.$socket.client.connect();
  }
}
</script>

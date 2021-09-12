<template>
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
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Message from "@/components/Message.vue";
import { State } from "vuex-class";
import { IMessage, IUser } from "@/store/types";

@Component({
  components: {
    Message,
  },
})
export default class ChatPanel extends Vue {
  @State("messages") storeMessages!: IMessage;
  @State("myself") storeMyself!: IUser;
  @State("selectedRemoteUser") storeSelectedRemoteUser!: IUser;
  private currMsg = "";

  get messages() {
    return this.storeMessages;
  }

  get anotherUser() {
    if (this.storeSelectedRemoteUser && this.storeSelectedRemoteUser.id) {
      return this.storeSelectedRemoteUser;
    }
    return { id: "", name: "default" };
  }

  public sendMessage() {
    this.$socket.client.emit("sendTxtMsg", {
      message: this.currMsg,
      from: this.storeMyself,
      to: this.anotherUser.id,
    });
    this.currMsg = "";
  }
}
</script>

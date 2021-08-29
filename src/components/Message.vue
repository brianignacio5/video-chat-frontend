<template>
  <div
    class="
      p-3
      flex flex-col
      bg-gray-400 bg-opacity-40
      rounded-xl
      w-full
      hover:bg-red-600
      my-2
    "
  >
    <div
      class="text-sm font-bold"
      :class="{ 'self-end': isMessageFromMe, 'self-start': !isMessageFromMe }"
    >
      {{ message.from.name }}
    </div>
    <p
      class="text-xs"
      :class="{ 'self-end': isMessageFromMe, 'self-start': !isMessageFromMe }"
    >
      {{ message.content }}
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { State } from "vuex-class";
import { IMessage, IUser } from "../store/types";

@Component
export default class Message extends Vue {
  @Prop() message!: IMessage;
  @State("myself") storeMyself!: IUser;

  get isMessageFromMe() {
    return this.message.from.id === this.storeMyself.id;
  }
}
</script>

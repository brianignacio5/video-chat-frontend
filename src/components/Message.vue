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
    <div class="self-end text-sm font-bold">
      {{ message.userId }}
    </div>
    <p class="text-xs self-end">{{ message.content }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { IMessage } from "../store/types";

@Component
export default class Message extends Vue {
  @Prop() message!: IMessage;
}
</script>

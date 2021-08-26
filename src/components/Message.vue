<template>
  <div
    class="
      p-3
      max-w-sm
      flex
      items-center
      space-x-4
      bg-gray-400 bg-opacity-40
      rounded-xl
      shadow-md
      m-1
      hover:bg-red-600
    "
  >
    <div>
      <div class="text-left text-sm font-bold">
        {{ message.userId }}
      </div>
      <p class="text-white text-left text-xs">{{ message.content }}</p>
    </div>
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

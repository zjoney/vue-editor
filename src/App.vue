<template>
  <div class="app">
    <Editor v-model="state" :formData="formData" />
  </div>
</template>

<script>
import { ref, provide } from "vue";
import data from "./data.json";
import Editor from "./packages/editor";
import { registerConfig as config } from "./utils/editor-config.jsx";

export default {
  components: {
    Editor,
  },
  setup() {
    const state = ref(data);
    provide("config", config); // 将组件直接传出去
    const formData = ref({
      username: "zf",
      password: "123",
    });

    return {
      state,
      formData,
    };
  },
};
</script>

<style lang="scss">
.app {
  position: fixed;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
}
</style>

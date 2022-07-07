<template>
  <div class="app">
    <Editor v-model="state" :formData="formData" />
    <!-- <Range :start="0" :end="100"></Range> -->
  </div>
</template>

<script>
import { ref, provide } from "vue";
import data from "./data.json";
import Editor from "./packages/editor";
import { registerConfig as config } from "./utils/editor-config.jsx";
import Range from "./components/Range.jsx";

export default {
  components: {
    Editor,
    Range,
  },
  setup() {
    const state = ref(data);
    provide("config", config); // 将组件直接传出去
    const formData = ref({
      username: "zf",
      password: "123",
      start: 0,
      end: 100
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

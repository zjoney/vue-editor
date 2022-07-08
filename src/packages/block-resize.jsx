import { defineComponent } from "vue";

export default defineComponent({
  props: {
    block: { type: Object },
    component: { type: Object }
  },
  setup(props, ctx) {
    const { width, height } = props.component.resize || {}
    return () => {
      return <>
        {width && <>
          <div class="block-resize block-resize-left"></div>
          <div class="block-resize block-resize-right"></div>
        </>}
        {height && <>
          <div class="block-resize block-resize-top"></div>
          <div class="block-resize block-resize-bottom"></div>
        </>}

        {width && height && <>
          <div class="block-resize block-resize-top-left"></div>
          <div class="block-resize block-resize-top-right"></div>
          <div class="block-resize block-resize-bottom-left"></div>
          <div class="block-resize block-resize-bottom-right"></div>
        </>}
      </>
    }
  }
})
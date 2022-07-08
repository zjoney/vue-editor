import { defineComponent } from "vue";

export default defineComponent({
  props: {
    block: { type: Object },
    component: { type: Object }
  },
  setup(props, ctx) {
    const { width, height } = props.component.resize || {};
    let data = {};
    const onmousemove = (e) => {
      let { clientX, clientY } = e;
      let { startX, startY, startWidth, startHeight, startLeft, startTop } = data;
      let durX = clientX - startX;
      let durY = clientY - startY;
      const width = startWidth + durX;
      const height = startHeight + durY;
      // 拖拽时候改变宽高
      props.block.width = width;
      props.block.height = height;
      props.block.hasResize = true;
    }
    const onmouseup = () => {
      document.body.removeEventListener('onmousemove', onmousemove);
      document.body.removeEventListener('onmouseup', onmouseup);
    }
    const onmousedown = (e, direction) => {
      e.stopPropagation();
      data = {
        startX: e.clientX,
        startY: e.clientY,
        startWidth: props.block.width,
        startHeight: props.block.height,
        startLeft: props.block.left,
        startTop: props.block.top,
        direction,
      }
      document.body.addEventListener('mousemove', onmousemove);
      document.body.addEventListener('mousemup', onmouseup);
    }
    return () => {
      return <>
        {width && <>
          <div class="block-resize block-resize-left" onMousedown={(e) => onmousedown(e, { horizontal: 'start', vertical: 'center' })}></div>
          <div class="block-resize block-resize-right" onMousedown={(e) => onmousedown(e, { horizontal: 'end', vertical: 'center' })}></div>
        </>}
        {height && <>
          <div class="block-resize block-resize-top" onMousedown={(e) => onmousedown(e, { horizontal: 'center', vertical: 'start' })}></div>
          <div class="block-resize block-resize-bottom" onMousedown={(e) => onmousedown(e, { horizontal: 'center', vertical: 'end' })}></div>
        </>}

        {width && height && <>
          <div class="block-resize block-resize-top-left" onMousedown={(e) => onmousedown(e, { horizontal: 'start', vertical: 'start' })}></div>
          <div class="block-resize block-resize-top-right" onMousedown={(e) => onmousedown(e, { horizontal: 'end', vertical: 'start' })}></div>
          <div class="block-resize block-resize-bottom-left" onMousedown={(e) => onmousedown(e, { horizontal: 'end', vertical: 'start' })}></div>
          <div class="block-resize block-resize-bottom-right" onMousedown={(e)=>onmousedown(e, {horizontal: 'end', vertical: 'end'})}></div>
        </>}
      </>
    }
  }
})
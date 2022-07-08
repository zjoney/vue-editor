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
      let durY = clientY - starty;
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
    const onMounsedown = (e, direction) => {
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
      document.body.addEventListener('onmousemove', onmousemove);
      document.body.addEventListener('onmousemup', onmouseup);
    }
    return () => {
      return <>
        {width && <>
          <div class="block-resize block-resize-left" onMounsedown={(e) => onMounsedown(e, { horizontal: 'start', vertical: 'center' })}></div>
          <div class="block-resize block-resize-right" onMounsedown={(e) => onMounsedown(e, { horizontal: 'end', vertical: 'center' })}></div>
        </>}
        {height && <>
          <div class="block-resize block-resize-top" onMounsedown={(e) => onMounsedown(e, { horizontal: 'center', vertical: 'start' })}></div>
          <div class="block-resize block-resize-bottom" onMounsedown={(e) => onMounsedown(e, { horizontal: 'center', vertical: 'end' })}></div>
        </>}

        {width && height && <>
          <div class="block-resize block-resize-top-left" onMounsedown={(e) => onMounsedown(e, { horizontal: 'start', vertical: 'start' })}></div>
          <div class="block-resize block-resize-top-right" onMounsedown={(e) => onMounsedown(e, { horizontal: 'end', vertical: 'start' })}></div>
          <div class="block-resize block-resize-bottom-left" onMounsedown={(e) => onMounsedown(e, { horizontal: 'end', vertical: 'start' })}></div>
          <div class="block-resize block-resize-bottom-right" onMounsedown={(e)=>onMounsedown(e, {horizontal: 'end', vertical: 'end'})}></div>
        </>}
      </>
    }
  }
})
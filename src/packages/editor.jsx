import { computed, defineComponent, inject, ref } from "vue";
import './editor.scss'

import EditorBlocks from "./editor-block.jsx";
export default defineComponent({
  components: {
    EditorBlocks,
  },
  props: {
    modelValue: { type: Object } // 接收数据 根据v-modal来的
  },
  setup(props) {
    const data = computed({
      get() {
        return props.modelValue
      }
    });
    const containerStyles = computed(() => ({
      width: data.value.container.width + 'px',
      height: data.value.container.height + 'px'
    }))
    const config = inject('config');

    const containerRef = ref(null)
    const dragenter = (e) => {
      e.dataTransfer.dropEffect = 'move'
    }
    const dragover = (e) => {
      e.preventDedault();
    }
    const dragleave = (e) => {
      e.dataTransfer.dropEffect = 'none'
    }
    const drop = (e) => {
      // 先留这里
    }
    const dragStart = (e, component) => {
      console.log(containerRef);
      /**
       * dragenter 进入目标 添加一个移动标识
       * dragover 在目标经过 必须要阻止默认行为 否则不能触发drop
       * dragleave 离开元素的时候 需要增加一个禁用标识
       * drop 松手的时候 根据拖拽的组件 添加一个组件
       */
      containerRef.value.addEventListener('dragenter', dragenter);
      containerRef.value.addEventListener('dragover', dragover);
      containerRef.value.addEventListener('dragleave', dragleave);
      containerRef.value.addEventListener('drop', drop);
     
    }
    return () => <div class="editor">
      {/* 根据注册列表渲染内容 可以实现H5拖拽*/}
      <div class="editor-left">{config.componentList.map(component => (<div class="editor-left-item"
        draggable
        onDragStart={e => dragStart(e, component)}
      >
        <span>{component.label}</span>
        <div>{component.preview()}</div>
      </div>))}</div>
      <div class="editor-top">top </div>
      <div class="editor-right">属性控制栏</div>
      <div class="editor-container">
        {/* 产生滚动条 */}
        <div class="editor-container-canvas">
          {/* 产生滚动内容 */}
          <div class="editor-container-canvas_content" style={containerStyles.value} ref={containerRef}>
            {
              data.value.blocks.map((block) => (
                <EditorBlocks block={block}></EditorBlocks>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  }
})
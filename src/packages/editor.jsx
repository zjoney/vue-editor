import { computed, defineComponent, inject, ref } from "vue";
import './editor.scss'

import EditorBlocks from "./editor-block.jsx";
import deepcopy from "deepcopy";
import { useMenuDragger } from "./useMenuDraggers";
export default defineComponent({
  components: {
    EditorBlocks,
  },
  props: {
    modelValue: { type: Object } // 接收数据 根据v-modal来的
  },
  emits: ['update:modelValue'], // 要触发的时间
  setup(props, ctx) {
    const data = computed({
      get() {
        return props.modelValue
      },
      set(newValue) {
        ctx.emit('update:modelValue', deepcopy(newValue));
      }
    });
    const containerStyles = computed(() => ({
      width: data.value.container.width + 'px',
      height: data.value.container.height + 'px'
    }))
    const config = inject('config');

    const containerRef = ref(null);
    //1、 实现菜单拖拽功能
    let { dragstart, dragend } = useMenuDragger(containerRef, data);

    // 2、获取焦点


    // 3、实现拖拽多个元素
    const clearBlockFocus = () => {
      data.value.blocks.forEach(block => block.focus = false)
    }
    const blockMousedown = (e, block) => {
      e.preventDefault();
      e.stopPropagation();
      //  block上我们规划一个属性，focus获取焦点后将focus变为true
      if (e.shiftKey) {
        block.focus = !block.focus;
      } else {
        if (!block.focus) {
          clearBlockFocus();
          block.focus = true; //要清空其他focus
        } else {
          block.focus = false;
        }
      }
    }
    // 点击容器让选中的失去焦点
    const containerMounseDown = () => {
      clearBlockFocus();
    }
    return () => <div class="editor">
      {/* 根据注册列表渲染内容 可以实现H5拖拽*/}
      <div class="editor-left">
        {config.componentList.map(component => (
          <div class="editor-left-item"
            draggable
            onDragstart={e => dragstart(e, component)}
            onDragend={dragend}
          >
            <span>{component.label}</span>
            <div>{component.preview()}</div>
          </div>))}
      </div>
      <div class="editor-top">top </div>
      <div class="editor-right">属性控制栏</div>
      <div class="editor-container">
        {/* 产生滚动条 */}
        <div class="editor-container-canvas">
          {/* 产生滚动内容 */}
          <div class="editor-container-canvas_content" style={containerStyles.value}
            ref={containerRef}
            onMousedown={containerMounseDown}
          >
            {
              data.value.blocks.map((block) => (
                <EditorBlocks
                  class={block.focus ? 'editor-block-focus' : ''}
                  onMousedown={(e) => blockMousedown(e, block)}
                  block={block}></EditorBlocks>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  }
})
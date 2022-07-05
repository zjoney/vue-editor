import { computed, defineComponent, inject, ref } from "vue";
import './editor.scss'

import EditorBlocks from "./editor-block.jsx";
import deepcopy from "deepcopy";
import { useMenuDragger } from "./useMenuDraggers";
import { useFocus } from './useFocus'
import { useBlockDragger } from "./useBlockDragger";
import { useCommand } from "./useCommands";
import { $dialog } from "@/components/Dialog";
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

    // 2、获取焦点, 选中可能直接进行拖拽
    let { blockMousedown, containerMounseDown, lastSelectBlock,
      focusData } = useFocus(data, (e) => {
        // 实现焦点后拖拽
        onMousedown(e)
      });
    // 实现组件拖拽
    let { onMousedown, markLine } = useBlockDragger(focusData, lastSelectBlock, data)


    const { commands } = useCommand(data)
    let buttons = [
      {
        label: '撤销', icon: 'icon-back', handler: () => commands.undo()
      },
      {
        label: '重做', icon: 'icon-forward', handler: () => commands.redo()
      },
      {
        label: '导出', icon: 'icon-export', handler: () => {
          $dialog({
            title: '导出JSON数据',
            content: JSON.stringify(data.value)
          })
        },
      },
      {
        label: '导入', icon: 'icon-import', handler: () => {
          $dialog({
            title: '导入JSON数据',
            content: '',
            footer: true,
            onConfirm(content) {
              data.value = JSON.parse(content);
            }
          })
        }
      }
    ]
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
      <div class="editor-top">{
        buttons.map((btn, index) => {
          return <div class='editor-top-button' onClick={btn.handler}>
            <i class={btn.icon}></i>
            <span>{btn.label}</span>
          </div>
        })
      }</div>
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
              data.value.blocks.map((block, index) => (
                <EditorBlocks
                  class={block.focus ? 'editor-block-focus' : ''}
                  onMousedown={(e) => blockMousedown(e, block, index)}
                  block={block}></EditorBlocks>
              ))
            }
            {markLine.x != null && <div
              style={{ left: markLine.x + 'px' }}
              class="line-x"></div>}
            {markLine.y != null && <div
              style={{ top: markLine.y + 'px' }}
              class="line-y"></div>}
          </div>
        </div>
      </div>
    </div>
  }
})
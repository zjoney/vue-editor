import { ElDialog, ElButton, ElInput } from "element-plus";
import { createVNode, defineComponent, render, reactive } from "vue";


const DialogComponent = defineComponent({
  props: {
    option: { type: Object },
  },
  setup(props, ctx) {
    console.log('@@', props, ctx);
    const state = reactive({
      option: props.option,// 用户给组件的属性
      isShow: false
    });
    const onCancel = () => { // 取消时关闭窗口
      state.isShow = false;
    }
    const onConfirm = () => { // 确认时调用用户回调
      state.option.onConfirm &&
        state.option.onConfirm(state.option.content);
      state.isShow = false;
    }
    ctx.expose({// 让外界可以调用方法
      showDialog: (option) => {
        state.option = option;
        state.isShow = true;
      }
    })
    return () => {
      return <ElDialog v-model={state.isShow} title={state.option.title}>
        {{
          default: () => <div> <ElInput type="textarea" v-model={state.option.content} rows={10}></ElInput>
          </div>,
          footer: () => state.option.footer && <div> <ElButton onClick={onCancel}>取消</ElButton> <ElButton onClick={onConfirm}>确定</ElButton>
          </div>
        }}
      </ElDialog>
    }
  }
});
let vm;
export const $dialog = (option) => {
  if (!vm) { // 没有dialog就手动挂载
    const el = document.createElement('div');
    vm = createVNode(DialogComponent, { option }); // 渲染组件
    document.body.appendChild((render(vm, el), el));
  }
  let { showDialog } = vm.component.exposed;
  showDialog(option);
}
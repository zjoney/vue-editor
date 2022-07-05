import { ElDialog, ElButton, ElInput } from "element-plus";
import { createVNode, defineComponent, render, reactive } from "vue";


const DialogComponent = defineComponent({
  props: {
    option: { type: Object },
  },
  setup(props, ctx) {
    const state = reactive({
      option: props.option,
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
    ctx.expose({
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
  if (!vm) {
    const el = document.createElement('div');
    vm = createVNode(DialogComponent, { option }); // 渲染组件
    document.body.appendChild((render(vm, el), el));
  }
  let { showDialog } = vm.component.exposed;
  showDialog(option);
}
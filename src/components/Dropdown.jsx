
import { computed, createVNode, defineComponent, reactive, render } from "vue";

const DialogComponent = defineComponent({
  props: {
    option: { type: Object },
  },
  setup(props, ctx) {
    const state = reactive({
      option: props.option,
      isShow: false,
      top: 0,
      left: 0,
    })
    ctx.expose({
      showDropdown(option) {
        state.option = option;
        state.isShow = true;
        const { top, left, height } =
          option.el.getBoundingClientRect();
        state.top = top + height;
        state.left = left;
      }
    })
    const classes = computed(() => [
      'dropdown',
      {
        'dropdown-isShow': state.isShow
      }
    ])
    const styles = computed(() => ({
      top: state.top + 'px',
      left: state.left + 'px'
    }))
    return () => {
      return <div class={classes.value} style={styles.value}>
        下拉菜单区域
      </div>
    }
  }
})


let vm;
export const $dropdown = (option) => {
  if (!vm) { // 没有dropdown就手动挂载
    const el = document.createElement('div');
    vm = createVNode(DialogComponent, { option }); // 渲染组件
    document.body.appendChild((render(vm, el), el));
  }
  let { showDropdown } = vm.component.exposed;
  showDropdown(option);
}
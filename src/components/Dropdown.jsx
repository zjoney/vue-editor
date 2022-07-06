
import { computed, createVNode, defineComponent, onBeforeUnmount, onMounted, reactive, ref, render } from "vue";

export const DropdownItem = defineComponent({
  props: {
    label: String,
    icon: String,
  },
  setup(props) {
    let { label, icon } = props;
    return () => <div class="dropdown-item">
      <i class={icon}></i>
      <span>{label}</span>
    </div>
  }
})

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
    }));
    const el = ref(null)
    const onMousedownDocument = (e) => {
      if (!el.value.contains(e.target)) {//如果点击是dropdown内部 什么都不做
        state.isShow = false;
      }
    }
    onMounted(() => {
      // 事件传的行为，先捕获再冒泡
      // 之前都增加了stopPropgation
      document.body.addEventListener('mousedown', onMousedownDocument, true)
    });
    onBeforeUnmount(() => {
      document.body.removeEventListener('mousedown', onMousedownDocument)
    })
    return () => {
      return <div class={classes.value} style={styles.value} ref={el}>
        {state.option.content()}
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
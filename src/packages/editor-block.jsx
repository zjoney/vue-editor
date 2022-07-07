import { computed, defineComponent, inject, onMounted, ref } from "vue";

export default defineComponent({
  props: {
    block: { type: Object },
    formData: { type: Object },
  },
  setup(props) {
    const blockStyles = computed(() => ({
      top: `${props.block.top}px`,
      left: `${props.block.left}px`,
      zIndex: `${props.block.zIndex}`,
    }))
    const config = inject('config');
    const blockRef = ref(null);
    onMounted(() => {
      let { offsetWidth, offsetHeight } = blockRef.value;
      if (props.block.alignCnter) { // 拖拽松手才渲染，

        props.block.left = props.block.left - offsetWidth / 2;
        props.block.top = props.block.top - offsetHeight / 2;
        props.block.alignCenter = false;
      }
      props.block.width = offsetWidth;
      props.block.height = offsetHeight;
    })
    return () => {
      // 通过Block的key属性直接获取对应的组件
      const component = config.componentMap[props.block.key];
      // 获取render函数
      const RenderComponent = component.render({
        props: props.block.props,
        // model: props.block.model =>{ default: "username" } =>{modelValue: FormData.username, "onUpdate:modelValie": v=>FormData.username = v},
        model: Object.keys(component.model || {}).reduce((prev, modelName) => {
          let propName = props.block.model[modelName];
         
          prev[modelName] = {
            modelValue: props.formData[propName],// zf
            "onUpdate:modelValie": v=>props.formData[propName] = v
          }
          return prev;
        }, {})
      });

      return <div class="editor-block" style={blockStyles.value} ref={blockRef}>{RenderComponent}</div>
    }
  }
})

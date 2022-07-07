import { computed, defineComponent } from "vue";
import deepcopy from 'deepcopy'
import { ElButton, ElTag } from "element-plus";
import { $tableDialog } from "../components/TableDialog";

export default defineComponent({
  props: {
    propConfig: { type: Object },
    modelValue: { type: Array },
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const data = computed({
      get() {
        return props.modelValue || []
      },
      set(newValue) {
        ctx.emit('update:modelValue', deepcopy(newValue))
      }
    })
    const add = () => {
      $tableDialog({
        config: props.propConfig,
        data: data.value,
        onConfirm(value) {
          // 点击确认  数据更新
          data.value = value;
        }
      })
    }
    return () => {
      return <div>
        {/* 下拉框没数据 直接显示按钮 */}
        {(!data.value || data.value.length == 0) && <ElButton onClick={add}>添加</ElButton>}
        {(data.value || []).map(item => <ElTag onClick={add}>{item[props.propConfig.table.key]}</ElTag>)}
      </div>
    }
  }
})


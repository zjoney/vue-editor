import { ElForm, ElFormItem, ElButton, ElInput, ElInputNumber, ElColorPicker, ElSelect, ElOption } from "element-plus"
import { defineComponent, inject, reactive, watch } from "vue"
import deepcopy from 'deepcopy'



export default defineComponent({
  props: {
    block: { type: Object },
    data: { type: Object }, //所有数据
    updateContainer: { type: Function },
    updateBlock: { type: Function },
  },
  setup(props, ctx) {
    const config = inject('config');//组件的配置信息
    const state = reactive({
      editData: {}
    })
    const reset = () => {
      if (!props.block) {
        //说明绑定是容器的宽度 高度
        state.editData = deepcopy(props.data.container)
      } else {
        state.editData = deepcopy(props.block);
      }
    }
    const apply = () => {
      if (!props.block) {
        //更改是容器的宽度 高度
        props.updateContainer({ ...props.data, container: state.editData });
      } else {
        props.updateBlock(state.editData, props.block);
      }
    }
    watch(() => props.block, reset, { immediate: true })
    return () => {
      let content = []
      if (!props.block) {
        content.push(<>
          <ElFormItem label="容器宽度">
            <ElInputNumber v-model={state.editData.width}></ElInputNumber>
          </ElFormItem>
          <ElFormItem label="容器高度">
            <ElInputNumber v-model={state.editData.height}></ElInputNumber>
          </ElFormItem>
        </>)
      } else {
        let component = config.componentMap[props.block.key];
        if (component && component.props) {
          content.push(Object.entries(component.props).map(([propName, propConfig]) => {
            return <ElFormItem label={propConfig.label}>
              {{
                // {text: '', color: ''}
                input: () => (<ElInput v-model={state.editData.props[propName]} />),
                color: () => (<ElColorPicker v-model={state.editData.props[propName]}>
                </ElColorPicker>),
                select: () => <ElSelect v-model={state.editData.props[propName]}>
                  {propConfig.options.map(opt => (
                    <ElOption label={opt.label}
                      value={opt.value}>{opt.value}</ElOption>
                  ))}
                </ElSelect>
              }[propConfig.type]()}
            </ElFormItem>
          })
          )
        }
        // 根据model渲染
        if (component && component.model) {
          content.push(<>{
            Object.entries(component.model).map(([modelName, label]) => {
              return <ElFormItem label={label}>
               {/* model = >{default:username} */}
                <ElInput v-model={state.editData.model[modelName]}></ElInput>
              </ElFormItem>
            })
          }
          </>)
        }

      }

      return <ElForm labelPosition='top' style='padding: 30px'>
        {content}
        <ElFormItem>
          <ElButton type='primary' onClick={() => apply()}>应用</ElButton>
          <ElButton onClick={reset} >重置</ElButton>
        </ElFormItem>
      </ElForm>
    }
  }
})
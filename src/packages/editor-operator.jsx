import { ElForm, ElFormItem, ElButton, ElInput, ElInputNumber, ElColorPicker, ElSelect, ElOption } from "element-plus"
import { defineComponent, inject } from "vue"



export default defineComponent({
  props: {
    block: { type: Object },
    data: { type: Object }, //所有数据
  },
  setup(props, ctx) {
    const config = inject('config');//组件的配置信息
    return () => {
      let content = []
      if (!props.block) {
        content.push(<>
          <ElFormItem label="容器宽度">
            <ElInputNumber></ElInputNumber>
          </ElFormItem>
          <ElFormItem label="容器高度">
            <ElInputNumber></ElInputNumber>
          </ElFormItem>
        </>)
      } else {
        let component = config.componentMap[props.block.key];
        if (component && component.props) {
          content.push(Object.entries(component.props).map(([propName, propConfig]) => {
            return <ElFormItem label={propConfig.label}>
              {{
                input: () => (<ElInput />),
                color: () => (<ElColorPicker >
                </ElColorPicker>),
                select: () => <ElSelect>
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
      }

      return <ElForm labelPosition='top' style='padding: 30px'>
        {content}
        <ElFormItem>
          <ElButton type='primary'>应用</ElButton>
          <ElButton >重置</ElButton>
        </ElFormItem>
      </ElForm>
    }
  }
})
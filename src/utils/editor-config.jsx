/**
 * 列表是显示所有的物料
 * key对应的组件映射关系
 */
import Range from '@/components/Range'
import { ElButton, ElInput, ElOption, ElSelect } from 'element-plus'

function createEditorConfig() {
  const componentList = []
  const componentMap = {}
  return {
    componentList,
    componentMap,
    register: (component) => {
      componentList.push(component)
      componentMap[component.key] = component
    }
  }
}
export let registerConfig = createEditorConfig();
const createInputProp = (label) => ({ type: 'input', label })
const createColorProp = (label) => ({ type: 'color', label })
const createSlectProp = (label, options) => ({ type: 'select', label, options })
const createTableProp = (label, table) => ({ type: 'table', label, table })
registerConfig.register({
  label: '下拉框',
  preview: () => <ElSelect></ElSelect>,
  render: ({ props, model }) => {

    return <ElSelect {...model.default}>{(props.options || []).map((opt, index) => {
      return <ElOption label={opt.label} value={opt.value} key={index}>
      </ElOption>
    })}</ElSelect>
  },
  key: 'select',
  props: {
    options: createTableProp('下拉选项', {
      options: [
        { label: '显示值', filed: 'label' },
        { label: '绑定值', filed: 'value' },
      ],
      key: 'label'// 显示给用户的值 
    })
  },
  model: {
    default: '绑定字段'
  }
});
registerConfig.register({
  label: '文本',
  preview: () => '预览文本',
  render: ({ props, }) => <span style={{ color: props.color, fontSize: props.size }}>{props.text || '渲染文本'}</span>,
  key: 'text',
  props: {
    text: createInputProp('文本内容'),
    color: createColorProp('字体颜色'),
    size: createSlectProp('字体大小', [
      { label: '14px', value: '14px' },
      { label: '20px', value: '20px' },
      { label: '24px', value: '24px' }
    ])
  }
})
registerConfig.register({
  label: '按钮',
  resize:{
    width: true, //横向大小
    height: true, // 高度大小
  },
  preview: () => <ElButton>预览按钮</ElButton>,
  render: ({ props }) => <ElButton type={props.type} size={props.size}>{props.text || '渲染按钮'}</ElButton>,
  key: 'button',
  props: {
    text: createInputProp('按钮内容'),
    type: createSlectProp('按钮类型', [
      { label: '基础', value: 'primary' },
      { label: '成功', value: 'success' },
      { label: '警告', value: 'warning' },
      { label: '危险', value: 'danger' },
      { label: '文本', value: 'text' },
    ]),
    size: createSlectProp('按钮尺寸', [
      { label: '默认', value: 'default' },
      { label: '中等', value: 'medium' },
      { label: '小', value: 'small' },
      { label: '极小', value: 'mini' },
    ])
  }
})
registerConfig.register({
  label: '输入框',
  resize:{
    width: true, //横向大小
  },
  preview: () => <ElInput placeholder='预览输入框'></ElInput>,
  render: ({ model }) => <ElInput placeholder='渲染输入框' {...model.default}></ElInput>,
  key: 'input',
  model: {
    default: '绑定字段'
    // default 等会绑定的model = {modelValue,onUpdate:modelValue}
  }
})

registerConfig.register({
  label: '范围选择器',
  preview: () => <Range placeholder='预览范围选择器'></Range>,
  render: ({ model }) => {

    return <Range {...{
      start: model.start.modelValue,
      end: model.end.modelValue,
      "onUpdate:start": model.start["onUpdate:modelValue"],
      "onUpdate:end": model.end["onUpdate:modelValue"],

    }}></Range>
  },
  key: 'range',
  model: {
    start: '开始字段',
    end: '结束字段',
    // default 等会绑定的model = {modelValue,onUpdate:modelValue}
  }
})


/**
 * 列表是显示所有的物料
 * key对应的组件映射关系
 */
import { ElButton, ElInput } from 'element-plus'

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
registerConfig.register({
  label: 'wenben',
  preview: () => '预览文本',
  render: () => '渲染文本',
  key: 'text',
  props: {
    text: createInputProp('文本内容'),
    color: createColorProp('字体颜色'),
    size: createSlectProp('字体大小', [
      {label: '14px', value: '14px'}, 
      {label: '20px', value: '20px'}, 
      {label: '24px', value: '24px'}
    ])
  }
})
registerConfig.register({
  label: '按钮',
  preview: () => <ElButton>预览按钮</ElButton>,
  render: () => <ElButton>渲染按钮</ElButton>,
  key: 'button',
  props: {
    text: createInputProp('按钮内容'),
    type: createSlectProp('按钮类型', [
      {label: '基础', value: 'primary'}, 
      {label: '成功', value: 'success'}, 
      {label: '警告', value: 'warning'}, 
      {label: '危险', value: 'danger'}, 
      {label: '文本', value: 'text'},
    ]),
    size: createSlectProp('按钮尺寸', [
      {label: '默认', value: ''}, 
      {label: '中等', value: 'medium'}, 
      {label: '小', value: 'small'}, 
      {label: '极小', value: 'min'}, 
    ])
  }
})
registerConfig.register({
  label: '输入框',
  preview: () => <ElInput placeholder='预览输入框'></ElInput>,
  render: () => <ElInput placeholder='渲染输入框'></ElInput>,
  key: 'input',
})


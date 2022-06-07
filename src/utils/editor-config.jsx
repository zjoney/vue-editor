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
console.log('registerConfig', registerConfig);
registerConfig.register({
  label: 'wenben',
  preview: () => '预览文本',
  render: () => '渲染文本',
  key: 'text',
})
registerConfig.register({
  label: 'anniu',
  preview: () => <ElButton>预览按钮</ElButton>,
  render: () => <ElButton>渲染按钮</ElButton>,
  key: 'button',
})
registerConfig.register({
  label: '输入框',
  preview: () => <ElInput>预览输入框</ElInput>,
  render: () => <ElInput>渲染输入框</ElInput>,
  key: 'input',
})


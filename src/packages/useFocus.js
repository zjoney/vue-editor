
import { computed, ref } from 'vue';
export function useFocus(data,previewRef, callback) {
  const selectIndex = ref(-1);
  // 最后选择的那一个
  const lastSelectBlock = computed(() => data.value.blocks[selectIndex.value])

  const focusData = computed(() => {
    let focus = [];
    let unfocused = [];
    (data.value.blocks || []).forEach(block => (block.focus ? focus : unfocused).push(block));
    return {
      focus,
      unfocused
    }
  })
  const clearBlockFocus = () => {
    data.value.blocks.forEach(block => block.focus = false)
  }
  const containerMounseDown = () => {
    if(previewRef.value) return;
    clearBlockFocus();
    selectIndex.value = -1;
  }
  const blockMousedown = (e, block, index) => {
    if(previewRef.value) return;
    e.preventDefault();
    e.stopPropagation();
    //  block上我们规划一个属性，focus获取焦点后将focus变为true
    if (e.shiftKey) {
      if (focusData.value.focus.length <= 1) {
        block.focus = true; // 当前只有一个节点选中时候，摁住shift也不会切换focus
      } else {
        block.focus = !block.focus;
      }
    } else {
      if (!block.focus) {
        clearBlockFocus();
        block.focus = true; //要清空其他focus
      } // 当自己已经被选中  再次点击时候还是选中
    }
    selectIndex.value = index;
    callback(e)
  }
  return {
    blockMousedown,
    containerMounseDown,
    focusData,
    lastSelectBlock,
  }
}
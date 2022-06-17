
import {computed} from 'vue';
export function useFocus (data, callback){
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
  const blockMousedown = (e, block) => {
    e.preventDefault();
    e.stopPropagation();
    //  block上我们规划一个属性，focus获取焦点后将focus变为true
    if (e.shiftKey) {
      block.focus = !block.focus;
    } else {
      if (!block.focus) {
        clearBlockFocus();
        block.focus = true; //要清空其他focus
      } else {
        block.focus = false;
      }
    }
    callback(e)
  }
  const containerMounseDown = () => {
    clearBlockFocus();
  }
  return {
    blockMousedown,
    containerMounseDown,
    focusData,
  }
}
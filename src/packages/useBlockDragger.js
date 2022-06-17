export function useBlockDragger(focusData) {
  let dragState = {
    startX: 0,
    startY: 0
  }
  const onMousedown = (e) => {// 当按下后记录当前位置
    dragState = {
      startX: e.clientX,
      startY: e.clientY,
      startPos: focusData.value.focus.map(({ top, left }) => ({
        top, left
      }))
    }
    document.addEventListener('mousemove', onMousemove)
    document.addEventListener('mouseup', onMouseup)
  }
  const onMousemove = (e) => {
    let { clientX: moveX, clientY: moveY } = e;
    let durX = moveX - dragState.startX;
    let durY = moveY - dragState.startY;
    focusData.value.focus.forEach((block, index) => {
      block.top = dragState.startPos[index].top + durX
      block.left = dragState.startPos[index].left + durY
    })
  }
  const onMouseup = (e) => {
    document.removeEventListener('mousemove', onMousemove);
    document.removeEventListener('mouseup', onMouseup)
  }
  return {
    onMousedown
  }
}
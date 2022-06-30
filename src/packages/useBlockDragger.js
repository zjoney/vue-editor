export function useBlockDragger(focusData, lastSelectBlock) {
  let dragState = {
    startX: 0,
    startY: 0
  }
  const onMousedown = (e) => {// 当按下后记录当前位置
    const { width: BWidth, height: BHeight } = lastSelectBlock.value

    dragState = {
      startX: e.clientX,
      startY: e.clientY,
      startPos: focusData.value.focus.map(({ top, left }) => ({
        top, left
      })),
      lines: (() => {
        const { unfoused } = focusData.value;// 记录没选中的位置做辅助线
        let lines = { x: [], y: [] };
        unfoused.forEach((block) => {
          const { top: ATop, left: ALeft, width: AWidth, height: AHeight } = block;
          // 当此元素拖拽到和A元素top一致的时候，要显示这根辅助线
          lines.y.push({ showTop: ATop, top: ATop, })
          lines.y.push({ showTop: ATop, top: ATop - BHeight, }) // 顶对底
          lines.y.push({ showTop: ATop + AHeight / 2, top: ATop + AHeight / 2 - BHeight / 2, }) // 中间对中间
          lines.y.push({ showTop: ATop + AHeight, top: ATop + AHeight, }) // 底对顶
          lines.y.push({ showTop: ATop + AHeight, top: ATop + AHeight - BHeight, }) // 底对底

          lines.x.push({ showLeft: ALeft, left: ALeft, }) // 左对左
          lines.x.push({ showLeft: ALeft + AWidth, left: ALeft + AWidth, }) // 右对左
          lines.x.push({ showLeft: ALeft + AWidth / 2, left: ALeft + AWidth / 2 - BWidth / 2, }) // 中间对中间
          lines.x.push({ showLeft: ALeft + AWidth, left: ALeft + AWidth - BWidth, }) // 右对右
          lines.x.push({ showLeft: ALeft + AWidth, left: ALeft - BWidth, }) // 左对右

        });
      })()
    }
    document.addEventListener('mousemove', onMousemove)
    document.addEventListener('mouseup', onMouseup)
  }
  const onMousemove = (e) => {
    console.log('move')
    let { clientX: moveX, clientY: moveY } = e;
    let durX = moveX - dragState.startX;
    let durY = moveY - dragState.startY;
    focusData.value.focus.forEach((block, index) => {
      block.top = dragState.startPos[index].top + durY
      block.left = dragState.startPos[index].left + durX
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
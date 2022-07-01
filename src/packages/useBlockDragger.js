import { reactive } from "vue"

export function useBlockDragger(focusData, lastSelectBlock, data) {
  let dragState = {
    startX: 0,
    startY: 0
  }
  let markLine = reactive({
    x:null,
    y:null
  })
  const onMousedown = (e) => {// 当按下后记录当前位置
    const { width: BWidth, height: BHeight } = lastSelectBlock.value

    dragState = {
      startX: e.clientX,
      startY: e.clientY,
      startLeft: lastSelectBlock.value.left,//拖拽前
      startTop: lastSelectBlock.value.top,
      startPos: focusData.value.focus.map(({ top, left }) => ({
        top, left
      })),
      lines: (() => {
        const { unfocused } = focusData.value;// 记录没选中的位置做辅助线
        let lines = { x: [], y: [] };
        [...unfocused,
        {
          top: 0,
          left: 0,
          width: data.value.container.width,
          height: data.value.container.height,
        }
        ].forEach((block) => {
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
        console.log(lines)
        return lines;
      })()
    }
    document.addEventListener('mousemove', onMousemove)
    document.addEventListener('mouseup', onMouseup)
  }
  const onMousemove = (e) => {
    let { clientX: moveX, clientY: moveY } = e;
    // 计算最新的left  top 去线里面找
    // 鼠标移动后-鼠标移动前 + left
    let left  = moveX - dragState.startX + dragState.startLeft;
    let top  = moveY - dragState.startY + dragState.startTop;
    // 先计算横线  距离参照物元素还有5像素 就显示这根线
    let y = null
    let x = null
    for(let i=0; i< dragState.lines.y.length; i++){
      const { top: t, showTop: s} = dragState.lines.y[i];
      if(Math.abs(t-top)<5){ // 说明接近了
        y= s;//线需要显示位置
        moveY = dragState.startY - dragState.startTop + t; //容器距离顶部距离 + 目标高度就是最新的moveY;
        // 实现快速贴上

        break; // 找到就跳出循环 
      }
    }
    for(let i=0; i< dragState.lines.x.length; i++){
      const { left: l, showLeft: s} = dragState.lines.x[i];
      if(Math.abs(l-left)<5){ // 说明接近了
        x= s;//线需要显示位置
        moveX = dragState.startX - dragState.startLeft + l; //容器距离顶部距离 + 目标高度就是最新的moveX;
        // 实现快速贴上

        break; // 找到就跳出循环 
      }
    }
    markLine.x = x; //markline响应式数据 更新数据就会更新视图
    markLine.y = y;
    let durX = moveX - dragState.startX;//拖拽前后的距离
    let durY = moveY - dragState.startY;
    focusData.value.focus.forEach((block, index) => {
      block.top = dragState.startPos[index].top + durY
      block.left = dragState.startPos[index].left + durX
    })
  }
  const onMouseup = (e) => {
    document.removeEventListener('mousemove', onMousemove);
    document.removeEventListener('mouseup', onMouseup);
    markLine.x = null;
    markLine.y = null;
  }
  return {
    onMousedown,
    markLine
  }
}
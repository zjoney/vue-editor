import { ElDialog, ElButton, ElInput } from "element-plus";
import { createVNode, defineComponent, render, reactive } from "vue";


const DialogComponent = defineComponent({
  props: {
    option: { type: Object },
  },
  setup(props, ctx) {
    console.log('@@', props, ctx);
    const state = reactive({
      option: props.option,// 用户给组件的属性
      isShow: false
    });
    const onCancel = () => { // 取消时关闭窗口
      state.isShow = false;
    }
    const onConfirm = () => { // 确认时调用用户回调
      state.option.onConfirm &&
        state.option.onConfirm(state.option.content);
      state.isShow = false;
    }
    ctx.expose({// 让外界可以调用方法
      showDialog: (option) => {
        state.option = option;
        state.isShow = true;
      }
    })
    return () => {
      return <ElDialog v-model={state.isShow} title={state.option.title}>
        {{
          default: () => <div> <ElInput type="textarea" v-model={state.option.content} rows={10}></ElInput>
          </div>,
          footer: () => state.option.footer && <div> <ElButton onClick={onCancel}>取消</ElButton> <ElButton onClick={onConfirm}>确定</ElButton>
          </div>
        }}
      </ElDialog>
    }
  }
});
let vm;
export const $dialog = (option) => {
  if (!vm) { // 没有dialog就手动挂载
    const el = document.createElement('div');
    vm = createVNode(DialogComponent, { option }); // 渲染组件
    document.body.appendChild((render(vm, el), el));
  }
  let { showDialog } = vm.component.exposed;
  showDialog(option);
}
/**
 * DymaticPlan 初级 左上角走到右下角路径
 * 不同路径 
 * m * n方格子
 */
var uniquePath = (m, n) => {
  // 1定义数组含义
  let dp = new Array(m).fill(0).map(() => new Array(n).fill(0));
  // 2 找出关系数组元素间的关系式
  for (let i = 0; i < m; i++) {
    dp[i][0] = 1;
  }
  for (let i = 0; i < n; i++) {
    dp[0][i] = 1;
  }
  // 3找出初始值
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }
  return dp[m - 1][n - 1];
}
/**
 * DymaticPlan 中级 左上角走到右下角，找最小路径之和
 * 不同路径 
 * m * n方格子
 * var arr = [
 * [1,3,1],
 * [2,5,1],
 * [4,6,1]
 * ]
 */
const minPathSum = (arr) => {
  let m = arr.length;
  let n = arr[0].length;
  if (m <= 0 || n <= 0) {
    return 0;
  }

  const dp = new Array(m).fill(0).map(() => new Array(0).fill(n)); // 
  // 初始化
  dp[0][0] = arr[0][0];
  // 初始化最左边的列
  for (let i = 1; i < m; i++) {
    dp[i][0] = dp[i - 1][0] + arr[i][0];
  }
  // 初始化最上边的行
  for (let i = 1; i < n; i++) {
    dp[0][i] = dp[0][i - 1] + arr[0][i];
  }
  // 推导出 dp[m-1][n-1]
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + arr[i][j];
    }
  }
  return dp[m - 1][n - 1];
}
/**
 * DymaticPlan 高级 左上角走到右下角，编辑距离
 * 不同路径 
 * m * n方格子
 * var arr = [
 * [1,3,1],
 * [2,5,1],
 * [4,6,1]
 * ]
 */
var minDistance = (word1, word2) => {
  let n1 = word1.length;
  let n2 = word2.length;
  const dp = new Array(n1 + 1).fill(0).map(() => new Array(n2 + 1).fill(0));
  // dp[0][0...n2]的初始值
  for (let j = 1; j <= n2; j++)
    dp[0][j] = dp[0][j - 1] + 1;
  // dp[0...n1][0] 的初始值
  for (let i = 1; i <= n1; i++) dp[i][0] = dp[i - 1][0] + 1;
  // 通过公式推出 dp[n1][n2]
  for (let i = 1; i <= n1; i++) {
    for (let j = 1; j <= n2; j++) {
      // 如果 word1[i] 与 word2[j] 相等。第 i 个字符对应下标是 i-1
      if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(Math.min(dp[i - 1][j - 1], dp[i][j - 1]), dp[i - 1][j]) + 1;
      }
    }
  }
  return dp[n1][n2];
};
uniquePath(3, 7) // 
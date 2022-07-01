
import deepcopy from "deepcopy";
import { onUnmounted } from "vue";
import { events } from "./events";

export function useCommands(data) {
  const state = { //前进后腿需要指针
    current: -1,
    queue: [], //存放所有命令
    commands: {}, // 制作命令和执行功能的映射表
    commandArray: [],//存放所有命令
    destroyArray: []
  }
  const registry = (command) => {
    state.commandArray.push(command);
    state.commands[command.name] = () => {
      //命令-名字对应执行函数
      const { redo, undo } = command.execute();
      redo()
      if (!command.pushQueue) {// 不需要放到队列里直接跳过
        return
      }
      let { queue, current } = state;
      // 如果现放组件1》组件2》组件3》
      // 组件1》组件3
      if (queue.length > 0) {
        queue = queue.slice(0, current + 1)//放置过程中有撤销功能，所以根据current值来计算新的
        state.queue = queue;
      }
      queue.push({ redo, undo });//保存指令的前进
      state.current = current + 1;
      console.log(queue)
    }
  };
  // 注册我们需要的命令
  registry({
    name: 'redo',
    keyboard: 'ctrl+y',
    execute() {
      return {
        redo() {
          let item = state.queue[state.current + 1];//找到当前的下一步
          if (item) {
            item.redo && item.redo();
            state.current++;
          }
        }
      }
    },
  });
  registry({
    name: 'undo',
    keyboard: 'ctrl+z',
    execute() {
      return {
        redo() {
          if (state.current == -1) return;
          let item = state.queue[state.current];
          if (item) {
            item.undo && item.undo();
            state.current--
          }
        }
      }
    }
  });
  registry({//如果希望将操作放队列中，可以增加属性标识 等会儿操作防盗队列中
    name: 'drag',
    pushQueue: true,
    init() {//初始化操作 默认就执行
      // 监控开始时间，保存状态
      const start = () =>{
        this.before = deepcopy(data.value.blocks)
      }
      //  拖拽之后需要触发事件
      const end = () => {
        state.commands.drag()
      }
      events.on('start', start)
      events.on('end', end)
      return () => {
        events.off('start', start);
        events.off('end', end);
      }
    },
    execute() {
      let before = this.before;
      let after = data.value.blocks;//之后状态
      return {
        redo() {// 
          data.value = {
            ...data.value, blocks: after
          }
        },
        undo() {// 前进一步
          data.value = {
            ...data.value, blocks: before
          }
        }
      }
    }
  });

  ; (() => {
    state.commandArray.forEach(command => command.init && command.init() && state.destroyArray.push(command.init()))
  })();
  onUnmounted(() => {
    state.destroyArray.forEach(fn => fn && fn())
  })
  return state;
}
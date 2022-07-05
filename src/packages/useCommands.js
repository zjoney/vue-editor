
import deepcopy from "deepcopy";
import { onUnmounted } from "vue";
import { events } from "./events";

export function useCommand(data, focusData) {
  const state = { //前进后腿需要指针
    current: -1,
    queue: [], //存放所有命令
    commands: {}, // 制作命令和执行功能的映射表 undo
    commandArray: [],//存放所有命令
    destroyArray: []
  }
  const registry = (command) => {

    state.commandArray.push(command);
    state.commands[command.name] = (...args) => {
      //命令-名字对应执行函数
      const { redo, undo } = command.execute(...args);
      redo();
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
            state.current--;
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
      this.before = null;
      const start = () => {
        this.before = deepcopy(data.value.blocks)
      }
      //  拖拽之后需要触发事件
      const end = () => {
        state.commands.drag();
      }
      events.on('start', start);
      events.on('end', end);
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
  registry({
    name: 'updateContainer',//更新整个容器
    pushQueue: 'true',
    execute(newValue) {
      let state = {
        before: data.value,
        after: newValue //新值
      }
      return {
        redo: () => {// 
          data.value = state.after;
        },
        undo: () => {// 前进一步
          data.value = state.before;
        }
      }
    }
  });
  registry({//置顶操作
    name: 'placeTop',//更新整个容器
    pushQueue: 'true',
    execute(newValue) {
      let before = deepcopy(data.value.blocks);
      let after = (() => {//就是在所有的block中找到最大的
        let { focus, unfocused } = focusData.value;

        let maxZIndex = unfocused.reduce((pre, block) => {
          return Math.max(pre, block.zIndex);
        }, -Infinity)
        // 让当前选中zindex  +1
        focus.forEach(block => block.zIndex = maxZIndex + 1);
        return data.value.blocks;
      })();
      return {
        // 如果当前Blocks 前后不一致 则不会更新,deepcopy
        undo: () => {
          data.value = { ...data.value, blocks: before };
        },
        redo: () => {// 
          data.value = { ...data.value, blocks: after };
        },
      }
    }
  });
  registry({//置底操作
    name: 'placeBottom',//更新整个容器
    pushQueue: 'true',
    execute() {
      let before = deepcopy(data.value.blocks);
      let after = (() => {//就是在所有的block中找到最大的
        let { focus, unfocused } = focusData.value;

        let minZIndex = unfocused.reduce((pre, block) => {
          return Math.min(pre, block.zIndex);
        }, Infinity) - 1;
        // 不能直接-1，因为Index不能出现负值。
        // 如果选中的这个是负值，让其他元素+1
        if (minZIndex < 0) {
          const dur = Math.abs(minZIndex);
          minZIndex = 0;
          unfocused.forEach(block => block.zIndex += dur);
        }
        // 如果是正值
        focus.forEach(block => block.zIndex = minZIndex);
        return data.value.blocks;
      })();
      return {
        // 如果当前Blocks 前后不一致 则不会更新,deepcopy
        undo: () => {
          data.value = { ...data.value, blocks: before };
        },
        redo: () => {// 
          data.value = { ...data.value, blocks: after };
        },
      }
    }
  });
  registry({//删除操作
    name: 'delete',//更新整个容器
    pushQueue: 'true',
    execute() {
      let state= {
        before : deepcopy(data.value.blocks),//当前值
        after: focusData.value.unfocused,//选中都删除
      }
      return {
        undo: () => {
          data.value = { ...data.value, blocks: state.before };
        },
        redo: () => {// 
          data.value = { ...data.value, blocks: state.after };
        },
      }
    }
  });
  const keyboardEvent = (() => {
    const keyCodes = {
      90: 'z',
      89: 'y',
    }
    const onKeydown = (e) => {
      const { ctrlKey, keyCode } = e;//ctrl+z/ctrl+y
      let keyString = [];
      if (ctrlKey) keyString.push('ctrl');
      keyString.push(keyCodes[keyCode]);
      keyString = keyString.join('+')
      state.commandArray.forEach(({ keyboard, name }) => {
        if (!keyboard) return; // 没键盘事件
        if (keyboard === keyString) {
          state.commands[name]();
          e.preventDefault();
        }
      })


    }
    const init = () => {
      window.addEventListener('keydown', onKeydown)
      return () => { // 销毁事件
        window.removeEventListener('keydown', onKeydown)
      }
    }
    return init
  })();
  ; (() => {
    // 监听键盘事件
    state.destroyArray.push(keyboardEvent())
    state.commandArray.forEach(command => command.init && state.destroyArray.push(command.init()))
  })();
  onUnmounted(() => {
    state.destroyArray.forEach(fn => fn && fn())
  })
  return state;
}
import { Fiber } from "./typings/Fiber";
import { VDom } from "./typings/VDom";
import { commitWork } from "./util/commitWork";
import { performUnitOfWork } from "./util/performUnitOfWork";

// 下一个处理的fiber节点，render时对其进行初始化修改
let nextUnitOfWork: Fiber = null;

// 需要渲染的树的根节点，render时进行初始化
let wipRoot: Fiber = null;

// 保存渲染前的fiber树
let currentRoot: Fiber = null;

export function render(vDom: VDom, container: HTMLElement) {
  // 真正意义上的初始化nextUnitOfWork，对container进行包装
  nextUnitOfWork = {
    // tagName 返回string类型。。离谱子
    type: container.tagName as keyof HTMLElementTagNameMap,
    child: null,
    props: {
      children: [vDom],
    },
    return: null,
    sibling: null,
    stateNode: container,
    alternate: currentRoot,
    effectTag: "NO_EFFECT",
  };
  wipRoot = nextUnitOfWork;

  // 开始创建节点
  requestIdleCallback(workLoop);
}

function workLoop(deadline: IdleDeadline) {
  let shouldYield = false; // 是否需要让出控制权
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 5; // 如果剩余时间小于5ms则让出控制权
  }
  if (!nextUnitOfWork && wipRoot) commitRoot();
  requestIdleCallback(workLoop); // 再次添加回调，等下一次浏览器空闲时执行
}

function commitRoot() {
  currentRoot = wipRoot;
  if (wipRoot.type === "TEXT_ELEMENT") throw new Error("wipRoot type error");
  commitWork(wipRoot.child);
  wipRoot = null;
}

import { Fiber, TEXT_ELEMENT } from "./typings/Fiber";
import { VDom } from "./typings/VDom";
import { commitWork } from "./util/commitWork";
import {
    getFiberInCreate, getFiberInDelete, getFiberInReplace, getFiberInSameType
} from "./util/getFiber";

export function createElement(
  type: keyof HTMLElementTagNameMap,
  props: Record<string, any>,
  ...children: VDom[]
): VDom {
  return {
    type,
    props: {
      ...props,
      children,
    },
  };
}

// createDOMElement不再深度create，只创建当前fiber的dom元素
function createDOMElement(fiber: Fiber): HTMLElement | Text {
  if (fiber.type === "TEXT_ELEMENT") {
    const textNode = document.createTextNode(fiber.value);
    return textNode;
  }
  const node = document.createElement(fiber.type);
  for (const key in fiber.props || {}) {
    if (key === "children") continue;
    if (key.startsWith("on")) {
      node.addEventListener(key.slice(2), fiber.props[key]);
      continue;
    }
    node.setAttribute(key, fiber.props[key]);
  }
  return node;
}

// 下一个处理的fiber节点，render时对其进行初始化修改
let nextUnitOfWork: Fiber | null = null;

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

/** 负责完成当前任务，并返回下一任务 */
function performUnitOfWork(fiber: Fiber | null): Fiber | null {
  if (!fiber) return null;
  if (!fiber.stateNode) {
    fiber.stateNode = createDOMElement(fiber);
  }

  reconcileChildren(fiber);

  if (fiber.type !== "TEXT_ELEMENT") {
    if (fiber.child) return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.return;
  }
  return null;
}

/** 将 fiber 节点的 children 进行 fiber 化，同时对 children 进行 diff */
function reconcileChildren(fiber: Fiber) {
  if (fiber.type === "TEXT_ELEMENT") return;
  // if (!fiber.props && !fiber.props.children) return;
  // 如果当前没有children也不能随便退出了，因为可能是children被删除，需要diff
  const curChildren = ((fiber.props && fiber.props.children) || []) as VDom[];

  /** 上次渲染时的节点，若为null则说明是第一次挂载 */
  let oldFiber: Fiber = null;

  if (fiber.alternate && fiber.alternate.type !== "TEXT_ELEMENT") {
    oldFiber = fiber.alternate.child;
  }
  let preSibling: Fiber = null;

  let index = 0;
  while (index < curChildren.length || oldFiber) {
    const curVDom = curChildren[index];
    const curVDomType =
      curVDom && (typeof curVDom === "string" ? TEXT_ELEMENT : curVDom.type);
    let newFiber: Fiber = null;
    const isSameType = curVDomType && oldFiber && curVDomType === oldFiber.type;

    // 若标签类型相同，则可继续复用之前的dom节点，但是文本节点则归为替换
    if (isSameType) {
      newFiber = getFiberInSameType(curVDom, oldFiber, fiber);
    } else if (curVDom && !oldFiber) {
      // 当前节点存在而老节点不存在，说明为新建
      newFiber = getFiberInCreate(curVDom, fiber);
    } else if (!curVDom && oldFiber) {
      // 当前节点不存在而老节点存在，说明为删除
      newFiber = getFiberInDelete(oldFiber);
    } else {
      // 二者均存在而类型不同，替换
      newFiber = getFiberInReplace(curVDom, oldFiber, fiber);
    }

    if (oldFiber) oldFiber = oldFiber.sibling;

    // 第 0 个作为父亲的 child，其他的则用 sibling 连接，需考虑curVDom不存在的情况
    if (!index) fiber.child = newFiber;
    else preSibling.sibling = newFiber;

    preSibling = newFiber;
    index++;
  }
}

function commitRoot() {
  currentRoot = wipRoot;
  commitWork(wipRoot);
  wipRoot = null;
}

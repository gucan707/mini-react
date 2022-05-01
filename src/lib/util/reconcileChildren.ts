import { Fiber, TEXT_ELEMENT } from "../typings/Fiber";
import { VDom } from "../typings/VDom";
import {
    getFiberInCreate, getFiberInDelete, getFiberInReplace, getFiberInSameType
} from "./getFiber";

/** 将 fiber 节点的 children 进行 fiber 化，同时对 children 进行 diff */
export function reconcileChildren(fiber: Fiber, children: VDom[] = []) {
  if (fiber.type === "TEXT_ELEMENT") return;
  // if (!fiber.props && !fiber.props.children) return;
  // 如果当前没有children也不能随便退出了，因为可能是children被删除，需要diff

  let curChildren = children;
  if (fiber?.props?.children?.length) curChildren = fiber.props.children;

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

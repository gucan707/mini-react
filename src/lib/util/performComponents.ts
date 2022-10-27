import { Fiber } from "../typings/Fiber";
import { VDom } from "../typings/VDom";
import { createDOMElement } from "./createDomElement";
import { reconcileChildren } from "./reconcileChildren";

export const wipFuncFiber = {
  wipFiber: null as Fiber,
  hookIndex: 0,
};

export function performFunctionComponents(fiber: Fiber) {
  // 这里判断 TEXT_ELEMENT 是为了糊弄TS。。不知道为什么TS判断不出来type为Function时也有props
  if (!fiber || fiber.type === "TEXT_ELEMENT") return;
  if (!(fiber.type instanceof Function)) return;
  fiber.hooks = fiber.hooks ? fiber.hooks : [];
  wipFuncFiber.hookIndex = 0;
  wipFuncFiber.wipFiber = fiber;
  const child = fiber.type(fiber.props) as VDom;
  reconcileChildren(fiber, [child]);
}

export function performHostComponents(fiber: Fiber) {
  if (!fiber || fiber.type instanceof Function) return;
  if (!fiber.stateNode) {
    fiber.stateNode = createDOMElement(fiber);
  }

  reconcileChildren(fiber);
}

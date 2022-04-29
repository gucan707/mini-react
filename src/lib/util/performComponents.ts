import { Fiber } from "../typings/Fiber";
import { createDOMElement } from "./createDomElement";
import { reconcileChildren } from "./reconcileChildren";

export function performFunctionComponents(fiber: Fiber) {
  if (!fiber || !(fiber.type instanceof Function)) return;
}

export function performHostComponents(fiber: Fiber) {
  if (!fiber || fiber.type instanceof Function) return;
  if (!fiber.stateNode) {
    fiber.stateNode = createDOMElement(fiber);
  }

  reconcileChildren(fiber);
}

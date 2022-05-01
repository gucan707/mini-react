import { Fiber } from "../typings/Fiber";
import { performFunctionComponents, performHostComponents } from "./performComponents";

/** 负责完成当前任务，并返回下一任务 */
export function performUnitOfWork(fiber: Fiber): Fiber {
  if (!fiber) return null;
  if (fiber.type instanceof Function) {
    performFunctionComponents(fiber);
  } else {
    performHostComponents(fiber);
  }

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

import { Fiber } from "../typings/Fiber";
import { VDom } from "../typings/VDom";

export function getFiberInSameType(
  curVDom: VDom,
  oldFiber: Fiber,
  returnFiber: Fiber
) {
  let newFiber: Fiber = null;
  if (typeof curVDom === "string") {
    if (oldFiber.type !== "TEXT_ELEMENT") {
      throw Error("内部错误");
    }

    newFiber = {
      type: "TEXT_ELEMENT",
      return: returnFiber,
      sibling: null,
      stateNode: null,
      effectTag: oldFiber.value === curVDom ? "NO_EFFECT" : "REPLACE",
      value: curVDom,
      alternate: oldFiber,
    };
  } else {
    if (oldFiber.type === "TEXT_ELEMENT")
      throw new Error(
        "oldFiber has different type with newFiber, but getFiber step into getFiberInSameType"
      );
    newFiber = {
      type: curVDom.type,
      return: returnFiber,
      sibling: null,
      child: null,
      stateNode: oldFiber.stateNode as HTMLElement,
      effectTag: "UPDATE",
      alternate: oldFiber,
      props: curVDom.props,
      hooks: oldFiber.hooks,
    };
  }

  return newFiber;
}

export function getFiberInCreate(curVDom: VDom, returnFiber: Fiber) {
  let newFiber: Fiber = null;
  if (typeof curVDom === "string") {
    newFiber = {
      type: "TEXT_ELEMENT",
      alternate: null,
      effectTag: "CREATE",
      return: returnFiber,
      sibling: null,
      stateNode: null,
      value: curVDom,
    };
  } else {
    newFiber = {
      type: curVDom.type,
      alternate: null,
      effectTag: "CREATE",
      child: null,
      props: curVDom.props,
      return: returnFiber,
      sibling: null,
      stateNode: null,
    };
  }

  return newFiber;
}

export function getFiberInDelete(oldFiber: Fiber) {
  if (!oldFiber) return null;
  const newFiber = { ...oldFiber };
  newFiber.effectTag = "DELETE";
  return newFiber;
}

export function getFiberInReplace(
  curVDom: VDom,
  oldFiber: Fiber,
  returnFiber: Fiber
) {
  let newFiber: Fiber = null;
  if (typeof curVDom === "string") {
    newFiber = {
      type: "TEXT_ELEMENT",
      alternate: oldFiber,
      effectTag: "REPLACE",
      return: returnFiber,
      sibling: null,
      stateNode: null,
      value: curVDom,
    };
  } else {
    newFiber = {
      type: curVDom.type,
      alternate: oldFiber,
      child: null,
      effectTag: "REPLACE",
      props: curVDom.props,
      return: returnFiber,
      sibling: null,
      stateNode: null,
    };
  }

  return newFiber;
}

import { rerender } from "./render";
import { StateHook } from "./typings/Fiber";
import { wipFuncFiber } from "./util/performComponents";

export function useState<T = undefined>(initialValue: T) {
  const curIndex = wipFuncFiber.hookIndex++;
  const { wipFiber } = wipFuncFiber;
  if (wipFiber.type === "TEXT_ELEMENT")
    throw new Error("error: wipFiber.type is TEXT_ELEMENT");

  type Setter = (action: T | ((oldValue: T) => T)) => void;

  if (!wipFiber.hooks[curIndex]) {
    const hook: StateHook = {
      type: "state",
      state: initialValue,
      setter: ((action) => {
        if (action instanceof Function)
          wipFiber.hooks[curIndex].state = action(
            wipFiber.hooks[curIndex].state
          );
        else wipFiber.hooks[curIndex].state = action;
        rerender();
      }) as Setter,
    };
    wipFiber.hooks[curIndex] = hook;
  }

  const curHook = wipFiber.hooks[curIndex];

  return [curHook.state, curHook.setter] as [T, Setter];
}
